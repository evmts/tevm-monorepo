/// Production-quality Frame module for EVM execution context
/// 
/// This module manages the execution context for a single call frame in the EVM, including
/// stack, memory, program counter, gas tracking, and return data. It supports nested calls,
/// static execution contexts, and provides comprehensive debugging capabilities.
/// 
/// Performance characteristics:
/// - Zero-allocation paths for common operations
/// - Inline hot-path functions for minimal overhead
/// - Direct field access for stack and memory operations
/// - Lazy return data allocation
/// 
/// Reference implementations:
/// - go-ethereum: https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go
/// - revm: https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs
/// - evmone: https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp

const std = @import("std");
const memory_mod = @import("Memory.zig");
const Memory = memory_mod.Memory;
const stack_mod = @import("Stack.zig");
const Stack = stack_mod.Stack;
const contract_mod = @import("Contract.zig");
const Contract = contract_mod.Contract;
const constants = @import("constants.zig");

// Address type (20 bytes) - matches Contract.zig pattern
pub const Address = [20]u8;

/// Error types for frame operations
pub const FrameError = error{
    OutOfMemory,
    StackError,
    InvalidPC,
    ExecutionHalted,
    OutOfGas,
    InvalidJump,
    WriteProtection,
    DepthLimit,
};

/// Execution halt reasons
pub const HaltReason = enum {
    None,
    Stop,
    Return,
    Revert,
    OutOfGas,
    InvalidOpcode,
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    WriteProtection,
    DepthLimit,
    InvalidCall,
    CreateCollision,
    PrecompileFailed,
    NonceOverflow,
    CreateContractSizeLimit,
    CreateContractStartingWithEF,
    CreateInitCodeSizeLimit,
};

/// Gas tracking for frame execution
pub const Gas = struct {
    /// Gas remaining for execution
    remaining: u64,
    /// Gas used so far
    used: u64,
    /// Gas limit for this call
    limit: u64,
    /// Gas refunded during execution
    refunded: u64,
    /// Current memory size for gas calculation
    memory_size: usize,

    /// Initialize gas tracking
    pub fn init(gas_limit: u64) Gas {
        return .{
            .remaining = gas_limit,
            .used = 0,
            .limit = gas_limit,
            .refunded = 0,
            .memory_size = 0,
        };
    }

    /// Consume gas with overflow protection
    pub fn consume(self: *Gas, amount: u64) FrameError!void {
        if (amount > self.remaining) {
            return error.OutOfGas;
        }
        self.remaining -= amount;
        self.used += amount;
    }

    /// Add gas refund
    pub fn refund(self: *Gas, amount: u64) void {
        self.refunded = @min(self.refunded + amount, std.math.maxInt(u64) - amount);
    }

    /// Calculate memory expansion gas cost
    pub fn memoryGasCost(self: *const Gas, offset: usize, size: usize) struct { cost: u64, overflow: bool } {
        if (size == 0) {
            return .{ .cost = 0, .overflow = false };
        }

        const end_offset = @addWithOverflow(offset, size);
        if (end_offset[1] != 0) {
            return .{ .cost = 0, .overflow = true };
        }

        const new_size = toWordSize(end_offset[0]);
        if (new_size <= self.memory_size) {
            return .{ .cost = 0, .overflow = false };
        }

        const new_cost = memoryCost(new_size);
        const current_cost = memoryCost(self.memory_size);
        
        if (new_cost < current_cost) {
            return .{ .cost = 0, .overflow = true };
        }

        return .{ .cost = new_cost - current_cost, .overflow = false };
    }

    /// Update memory size after expansion
    pub fn expandMemory(self: *Gas, new_size: usize) void {
        self.memory_size = toWordSize(new_size);
    }

    /// Calculate word size (rounds up to 32 bytes)
    fn toWordSize(size: usize) usize {
        return ((size + 31) / 32) * 32;
    }

    /// Calculate memory cost using quadratic formula
    fn memoryCost(size: usize) u64 {
        const words = size / 32;
        const linear_cost = words * constants.G_MEMORY;
        const quadratic_cost = (words * words) / constants.G_QUADRATIC_WORD;
        return linear_cost + quadratic_cost;
    }
};

/// EVM execution frame
pub const Frame = struct {
    /// EVM stack (operand stack)
    stack: Stack,
    /// EVM memory (byte-addressable)
    memory: Memory,
    /// Contract being executed
    contract: *Contract,
    /// Gas meter for this frame
    gas: *Gas,
    /// Program counter
    pc: usize,
    /// Return data from last call
    return_data: ?[]u8,
    /// Halt reason if execution stopped
    halt_reason: HaltReason,
    /// Whether frame is in static mode (no state changes)
    is_static: bool,
    /// Call depth (for limit checking)
    depth: u32,
    /// Memory allocator
    allocator: std.mem.Allocator,

    /// Create a new execution frame
    pub fn init(
        allocator: std.mem.Allocator,
        contract: *Contract,
        gas: *Gas,
        is_static: bool,
        depth: u32,
    ) !Frame {
        return Frame{
            .stack = Stack{},
            .memory = try Memory.init(allocator),
            .contract = contract,
            .gas = gas,
            .pc = 0,
            .return_data = null,
            .halt_reason = .None,
            .is_static = is_static,
            .depth = depth,
            .allocator = allocator,
        };
    }

    /// Clean up frame resources
    pub fn deinit(self: *Frame) void {
        self.memory.deinit();
        if (self.return_data) |data| {
            self.allocator.free(data);
        }
    }

    // Execution Control

    /// Get current operation byte
    pub inline fn currentOp(self: *const Frame) ?u8 {
        if (self.pc >= self.contract.code.len) {
            return null;
        }
        return self.contract.code[self.pc];
    }

    /// Advance program counter
    pub inline fn advance(self: *Frame, n: usize) void {
        self.pc += n;
    }

    /// Jump to address (with validation)
    pub fn jump(self: *Frame, dest: usize) FrameError!void {
        if (dest >= self.contract.code.len) {
            self.halt_reason = .InvalidJump;
            return error.InvalidPC;
        }
        if (!self.isValidJump(dest)) {
            self.halt_reason = .InvalidJump;
            return error.InvalidJump;
        }
        self.pc = dest;
    }

    /// Check if execution should halt
    pub inline fn shouldHalt(self: *const Frame) bool {
        return self.halt_reason != .None;
    }

    /// Halt execution with reason
    pub inline fn halt(self: *Frame, reason: HaltReason) void {
        self.halt_reason = reason;
    }

    // Stack Operations (delegated)

    /// Push value to stack
    pub inline fn push(self: *Frame, value: u256) !void {
        self.stack.push(value) catch |err| {
            switch (err) {
                error.StackOverflow => self.halt_reason = .StackOverflow,
                else => {},
            }
            return err;
        };
    }

    /// Pop value from stack
    pub inline fn pop(self: *Frame) !u256 {
        return self.stack.pop() catch |err| {
            switch (err) {
                error.StackUnderflow => self.halt_reason = .StackUnderflow,
                else => {},
            }
            return err;
        };
    }

    /// Peek at stack top
    pub inline fn peek(self: *Frame) !*u256 {
        return self.stack.peek() catch |err| {
            switch (err) {
                error.StackUnderflow => self.halt_reason = .StackUnderflow,
                else => {},
            }
            return err;
        };
    }

    /// Duplicate stack item
    pub inline fn dup(self: *Frame, n: usize) !void {
        self.stack.dup(n) catch |err| {
            switch (err) {
                error.StackUnderflow => self.halt_reason = .StackUnderflow,
                error.StackOverflow => self.halt_reason = .StackOverflow,
                else => {},
            }
            return err;
        };
    }

    /// Swap stack items
    pub inline fn swap(self: *Frame, n: usize) !void {
        self.stack.swap(n) catch |err| {
            switch (err) {
                error.StackUnderflow => self.halt_reason = .StackUnderflow,
                else => {},
            }
            return err;
        };
    }

    // Memory Operations

    /// Ensure memory is sized for access
    pub fn ensureMemory(self: *Frame, offset: usize, size: usize) !void {
        if (size == 0) return;

        const mem_result = self.gas.memoryGasCost(offset, size);
        if (mem_result.overflow) {
            self.halt_reason = .OutOfGas;
            return error.OutOfMemory;
        }

        self.gas.consume(mem_result.cost) catch {
            self.halt_reason = .OutOfGas;
            return error.OutOfGas;
        };

        const required = offset + size;
        try self.memory.resize(required);
        self.gas.expandMemory(required);
    }

    /// Read word from memory
    pub fn readMemoryWord(self: *Frame, offset: usize) !u256 {
        try self.ensureMemory(offset, 32);
        const word = try self.memory.getWord(offset);
        var result: u256 = 0;
        var i: usize = 0;
        while (i < 32) : (i += 1) {
            result = (result << 8) | word[i];
        }
        return result;
    }

    /// Write word to memory
    pub fn writeMemoryWord(self: *Frame, offset: usize, value: u256) !void {
        try self.ensureMemory(offset, 32);
        var word: [32]u8 = undefined;
        var val = value;
        var i: usize = 32;
        while (i > 0) {
            i -= 1;
            word[i] = @truncate(val);
            val >>= 8;
        }
        try self.memory.setWord(offset, word);
    }

    /// Read bytes from memory
    pub fn readMemory(self: *Frame, offset: usize, size: usize) ![]const u8 {
        if (size == 0) return &[_]u8{};
        try self.ensureMemory(offset, size);
        return try self.memory.getSlice(offset, size);
    }

    /// Write bytes to memory
    pub fn writeMemory(self: *Frame, offset: usize, data: []const u8) !void {
        if (data.len == 0) return;
        try self.ensureMemory(offset, data.len);
        try self.memory.setData(offset, data);
    }

    // Return Data Management

    /// Set return data from execution
    pub fn setReturnData(self: *Frame, data: []const u8) !void {
        // Free existing return data
        if (self.return_data) |old_data| {
            self.allocator.free(old_data);
        }

        // Allocate and copy new data
        if (data.len > 0) {
            self.return_data = try self.allocator.dupe(u8, data);
        } else {
            self.return_data = null;
        }
    }

    /// Get return data slice
    pub fn getReturnData(self: *const Frame) []const u8 {
        return self.return_data orelse &[_]u8{};
    }

    /// Get return data size
    pub fn getReturnDataSize(self: *const Frame) usize {
        if (self.return_data) |data| {
            return data.len;
        }
        return 0;
    }

    // Context Accessors

    /// Get caller address
    pub inline fn getCaller(self: *const Frame) Address {
        return self.contract.caller;
    }

    /// Get contract address
    pub inline fn getAddress(self: *const Frame) Address {
        return self.contract.address;
    }

    /// Get call value
    pub inline fn getValue(self: *const Frame) u256 {
        return self.contract.value;
    }

    /// Get call input data
    pub inline fn getInput(self: *const Frame) []const u8 {
        return self.contract.input;
    }

    /// Get contract code
    pub inline fn getCode(self: *const Frame) []const u8 {
        return self.contract.code;
    }

    /// Get code size
    pub inline fn getCodeSize(self: *const Frame) usize {
        return self.contract.code.len;
    }

    /// Check if valid jump destination
    pub fn isValidJump(self: *const Frame, dest: usize) bool {
        if (dest >= self.contract.code.len) return false;
        if (self.contract.code[dest] != constants.JUMPDEST) return false;
        // If contract has advanced analysis, use it
        if (self.contract.analysis) |analysis| {
            // Check if the jumpdest is in the valid positions
            for (analysis.jumpdest_positions) |pos| {
                if (pos == dest) return true;
            }
            return false;
        }
        // For simple contracts without analysis, JUMPDEST opcode check is sufficient
        return true;
    }

    // State Inspection

    /// Get current stack depth
    pub inline fn stackDepth(self: *const Frame) usize {
        return self.stack.len();
    }

    /// Get current memory size
    pub inline fn memorySize(self: *const Frame) usize {
        return self.memory.size();
    }

    /// Check if frame can write state
    pub inline fn canWrite(self: *const Frame) bool {
        return !self.is_static;
    }

    /// Check if at depth limit
    pub inline fn atDepthLimit(self: *const Frame) bool {
        return self.depth >= 1024;
    }

    // Debug Support

    /// Dump frame state (for debugging)
    pub fn dumpState(self: *const Frame) void {
        const builtin = @import("builtin");
        if (builtin.mode == .Debug) {
            std.debug.print("Frame State:\n", .{});
            std.debug.print("  PC: {}\n", .{self.pc});
            std.debug.print("  Gas remaining: {}\n", .{self.gas.remaining});
            std.debug.print("  Gas used: {}\n", .{self.gas.used});
            std.debug.print("  Stack depth: {}\n", .{self.stack.len()});
            std.debug.print("  Memory size: {}\n", .{self.memory.size()});
            std.debug.print("  Depth: {}\n", .{self.depth});
            std.debug.print("  Static: {}\n", .{self.is_static});
            if (self.halt_reason != .None) {
                std.debug.print("  Halted: {s}\n", .{@tagName(self.halt_reason)});
            }
        }
    }

    /// Get stack as slice (for debugging)
    pub fn getStackSlice(self: *const Frame) []const u256 {
        return self.stack.data[0..self.stack.size];
    }

    /// Get memory as slice (for debugging) 
    pub fn getMemorySlice(self: *const Frame) []const u8 {
        return self.memory.data.items;
    }

    /// Log frame operation (debug builds only)
    pub fn logOperation(self: *const Frame, op: u8) void {
        const builtin = @import("builtin");
        if (builtin.mode == .Debug) {
            std.debug.print("[FRAME] PC={d:0>5} OP=0x{X:0>2} STACK={d} MEM={d} GAS={d}\n", .{
                self.pc,
                op,
                self.stack.len(),
                self.memory.size(),
                self.gas.remaining,
            });
        }
    }
};
//! Interpreter implementation for ZigEVM
//! This module implements the core EVM interpreter that executes EVM bytecode

const std = @import("std");
const types = @import("../util/types.zig");
const Stack = @import("../stack/stack.zig").Stack;
const memory_mod = @import("../memory/memory.zig");
const Memory = memory_mod.Memory;
const BlockInfoManager = memory_mod.BlockInfoManager;
const ReturnData = @import("return_data.zig").ReturnData;
const storage_mod = @import("../opcodes/storage.zig");
const Storage = storage_mod.Storage;
const environment_mod = @import("../opcodes/environment.zig");
const EvmEnvironment = environment_mod.EvmEnvironment;

const U256 = types.U256;
const Address = types.Address;
const Hash = types.Hash;
const Error = types.Error;
const ExecutionResult = types.ExecutionResult;

/// Result of opcode execution
pub const InterpreterAction = enum {
    Continue,
    Stop,
    Return,
    Revert,
    SelfDestruct,
};

/// Interpreter for executing EVM bytecode
pub const Interpreter = struct {
    // Execution state
    pc: usize = 0,
    code: []const u8,
    stack: Stack,
    memory: Memory,
    gas_left: u64,
    original_gas: u64,
    gas_refund: u64 = 0,
    return_data: []u8,
    return_data_allocator: std.mem.Allocator,
    return_data_buffer: ReturnData, // Buffer for RETURNDATASIZE and RETURNDATACOPY opcodes
    jump_dest_map: []bool,
    depth: u16,
    storage: Storage,  // Contract storage
    is_static: bool = false, // Whether this is a static call (no state modifications allowed)
    block_info: ?*BlockInfoManager = null,
    
    // Environment context
    environment: ?*EvmEnvironment = null, // Blockchain environment information
    calldata: ?[]const u8 = null,         // Call data for this execution
    gas_price: U256 = U256.zero(),        // Gas price for the transaction
    
    // For now, this is just a placeholder shell - we'll implement the full functionality in later steps
    
    /// Initialize a new Interpreter instance
    pub fn init(
        allocator: std.mem.Allocator,
        code: []const u8,
        gas_limit: u64,
        depth: u16,
    ) !Interpreter {
        const jump_dest_map = try analyzeJumpDests(allocator, code);
        errdefer allocator.free(jump_dest_map);
        
        var storage = try Storage.init(allocator);
        errdefer storage.deinit();
        
        return Interpreter{
            .code = code,
            .stack = Stack.init(),
            .memory = try Memory.init(allocator),
            .gas_left = gas_limit,
            .original_gas = gas_limit,
            .return_data = &[_]u8{},
            .return_data_allocator = allocator,
            .return_data_buffer = ReturnData.init(allocator),
            .jump_dest_map = jump_dest_map,
            .depth = depth,
            .storage = storage,
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *Interpreter) void {
        self.memory.deinit();
        if (self.return_data.len > 0) {
            self.return_data_allocator.free(self.return_data);
        }
        self.return_data_buffer.deinit();
        self.storage.deinit();
        self.return_data_allocator.free(self.jump_dest_map);
    }
    
    /// Main execution loop implementation
    pub fn execute(self: *Interpreter) ExecutionResult {
        // Save original gas for calculating gas used at the end
        const original_gas = self.gas_left;
        const dispatch = @import("../opcodes/dispatch.zig");

        // Main execution loop
        while (self.pc < self.code.len) {
            // Load the current opcode
            const opcode = self.code[self.pc];
            
            // Check for STOP opcode explicitly
            if (opcode == 0x00) { // STOP
                break;
            }
            
            // Execute the instruction
            dispatch.executeInstruction(
                &self.stack,
                &self.memory,
                self.code,
                &self.pc,
                &self.gas_left,
                &self.gas_refund,
                &self.return_data_buffer,
                &self.storage,
                self.is_static,
                self.environment,
                self.calldata,
                &self.gas_price
            ) catch |err| {
                // Handle execution errors
                switch (err) {
                    Error.InvalidJump => {
                        // For jumps, we need to validate the destination
                        if (!self.isValidJumpDest(self.pc)) {
                            return .{
                                .Error = .{
                                    .error_type = Error.InvalidJumpDest,
                                    .gas_used = original_gas,
                                }
                            };
                        }
                        // If it's a valid jump, continue execution
                        continue;
                    },
                    Error.StackOverflow,
                    Error.StackUnderflow,
                    Error.OutOfGas,
                    Error.InvalidOpcode,
                    Error.ReturnDataOutOfBounds,
                    Error.StorageUnavailable,
                    Error.StaticModeViolation,
                    Error.StaticStateChange,
                    Error.WriteProtection,
                    Error.EnvironmentNotAvailable,
                    Error.BalanceUnavailable,
                    Error.NotImplemented,
                    => {
                        // For non-recoverable errors, return error result with gas used
                        return .{
                            .Error = .{
                                .error_type = err,
                                .gas_used = original_gas,
                            }
                        };
                    },
                    else => {
                        // For other errors, treat as internal error
                        return .{
                            .Error = .{
                                .error_type = Error.InternalError,
                                .gas_used = original_gas,
                            }
                        };
                    }
                }
            };
            
            // Handle explicit RETURN and REVERT opcodes
            if (opcode == 0xF3) { // RETURN
                // Get memory offset and size from stack
                const offset = try self.stack.pop();
                const size = try self.stack.pop();
                
                // Convert to usize (assuming they're small enough)
                const mem_offset = @as(usize, offset.words[0]);
                const mem_size = @as(usize, size.words[0]);
                
                // Set the return data from memory
                try self.setReturnData(mem_offset, mem_size);
                
                // Return success with the data
                return .{
                    .Success = .{
                        .gas_used = original_gas - self.gas_left,
                        .gas_refunded = self.gas_refund,
                        .return_data = self.return_data,
                    }
                };
            } else if (opcode == 0xFD) { // REVERT
                // Get memory offset and size from stack
                const offset = try self.stack.pop();
                const size = try self.stack.pop();
                
                // Convert to usize (assuming they're small enough)
                const mem_offset = @as(usize, offset.words[0]);
                const mem_size = @as(usize, size.words[0]);
                
                // Set the return data from memory
                try self.setReturnData(mem_offset, mem_size);
                
                // Return revert with the data
                return .{
                    .Revert = .{
                        .gas_used = original_gas - self.gas_left,
                        .return_data = self.return_data,
                    }
                };
            }
        }
        
        // Successful execution (e.g., via STOP)
        return .{
            .Success = .{
                .gas_used = original_gas - self.gas_left,
                .gas_refunded = self.gas_refund,
                .return_data = self.return_data,
            }
        };
    }
    
    /// Set return data from memory
    pub fn setReturnData(self: *Interpreter, offset: usize, size: usize) !void {
        // Free previous return data if any
        if (self.return_data.len > 0) {
            self.return_data_allocator.free(self.return_data);
            self.return_data = &[_]u8{};
        }
        
        // Allocate new return data buffer
        if (size > 0) {
            var data = try self.return_data_allocator.alloc(u8, size);
            errdefer self.return_data_allocator.free(data);
            
            // Copy data from memory (handling out-of-bounds access)
            const available = if (offset >= self.memory.size) 0 
                else std.math.min(size, self.memory.size - offset);
                
            // Initialize with zeros
            @memset(data, 0);
            
            // Copy available data
            if (available > 0) {
                @memcpy(data[0..available], self.memory.page.buffer[offset..][0..available]);
            }
            
            self.return_data = data;
            
            // Also update the return data buffer for RETURNDATASIZE/RETURNDATACOPY
            try self.return_data_buffer.set(data);
        } else {
            // Clear the return data buffer if size is 0
            try self.return_data_buffer.set(&[_]u8{});
        }
    }
    
    /// Verify a jump destination is valid
    pub fn isValidJumpDest(self: *Interpreter, dest: usize) bool {
        if (dest >= self.code.len) {
            return false;
        }
        return self.jump_dest_map[dest];
    }
};

/// Analyze bytecode to identify all valid JUMPDEST positions
fn analyzeJumpDests(allocator: std.mem.Allocator, code: []const u8) ![]bool {
    var result = try allocator.alloc(bool, code.len);
    @memset(result, false);
    
    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];
        
        // JUMPDEST opcode (0x5B)
        if (op == 0x5B) {
            result[i] = true;
        } 
        // PUSH operations (0x60-0x7F) have immediate data to skip
        else if (op >= 0x60 and op <= 0x7F) {
            const n = @as(usize, op) - 0x5F; // Number of bytes to push
            i += n;
            if (i >= code.len) break;
        }
        
        i += 1;
    }
    
    return result;
}

// Tests
test "Interpreter initialization" {
    const bytecode = [_]u8{0x60, 0x01, 0x60, 0x02, 0x01, 0x60, 0x03, 0x5B, 0x00};
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    try std.testing.expect(interpreter.code.len == bytecode.len);
    try std.testing.expect(interpreter.gas_left == 100000);
    try std.testing.expect(interpreter.depth == 0);
    try std.testing.expect(interpreter.jump_dest_map[7] == true); // JUMPDEST at position 7
    try std.testing.expect(interpreter.jump_dest_map[0] == false); // Not a JUMPDEST
}

test "Jump destination analysis" {
    const bytecode = [_]u8{
        0x60, 0x10, // PUSH1 0x10
        0x5B,       // JUMPDEST
        0x60, 0x20, // PUSH1 0x20
        0x01,       // ADD
        0x5B,       // JUMPDEST
        0x00,       // STOP
    };
    
    const jumpdests = try analyzeJumpDests(std.testing.allocator, &bytecode);
    defer std.testing.allocator.free(jumpdests);
    
    try std.testing.expect(jumpdests[2] == true);  // JUMPDEST at position 2
    try std.testing.expect(jumpdests[6] == true);  // JUMPDEST at position 6
    try std.testing.expect(jumpdests[0] == false); // PUSH1 at position 0
    try std.testing.expect(jumpdests[1] == false); // Immediate data of PUSH1
}

test "Simple ADD program execution" {
    // PUSH1 5, PUSH1 10, ADD, STOP
    const bytecode = [_]u8{0x60, 0x05, 0x60, 0x0A, 0x01, 0x00};
    
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check result
    switch (result) {
        .Success => |success| {
            try std.testing.expect(success.gas_used > 0);
            try std.testing.expect(success.return_data.len == 0);
        },
        .Revert, .Error => {
            try std.testing.expect(false); // This should not happen
        },
    }
    
    // Check stack (should have 15 on top)
    try std.testing.expect(interpreter.stack.getSize() == 1);
    const top = try interpreter.stack.peek();
    try std.testing.expectEqual(U256.fromU64(15), top.*);
}

test "RETURN program execution" {
    // PUSH1 0xFF (value to store)
    // PUSH1 0 (memory position)
    // MSTORE (store 32 bytes)
    // PUSH1 32 (return size)
    // PUSH1 0 (return offset)
    // RETURN
    const bytecode = [_]u8{
        0x60, 0xFF,     // PUSH1 0xFF
        0x60, 0x00,     // PUSH1 0
        0x52,           // MSTORE
        0x60, 0x20,     // PUSH1 32 (size)
        0x60, 0x00,     // PUSH1 0 (offset)
        0xF3            // RETURN
    };
    
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check result
    switch (result) {
        .Success => |success| {
            try std.testing.expect(success.gas_used > 0);
            try std.testing.expect(success.return_data.len == 32);
            try std.testing.expect(success.return_data[31] == 0xFF); // Last byte should be 0xFF
        },
        .Revert, .Error => {
            try std.testing.expect(false); // This should not happen
        },
    }
}

test "REVERT program execution" {
    // PUSH1 0xFF (value to store)
    // PUSH1 0 (memory position)
    // MSTORE (store 32 bytes)
    // PUSH1 32 (return size)
    // PUSH1 0 (return offset)
    // REVERT
    const bytecode = [_]u8{
        0x60, 0xFF,     // PUSH1 0xFF
        0x60, 0x00,     // PUSH1 0
        0x52,           // MSTORE
        0x60, 0x20,     // PUSH1 32 (size)
        0x60, 0x00,     // PUSH1 0 (offset)
        0xFD            // REVERT
    };
    
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check result
    switch (result) {
        .Success => {
            try std.testing.expect(false); // This should not happen
        },
        .Revert => |revert| {
            try std.testing.expect(revert.gas_used > 0);
            try std.testing.expect(revert.return_data.len == 32);
            try std.testing.expect(revert.return_data[31] == 0xFF); // Last byte should be 0xFF
        },
        .Error => {
            try std.testing.expect(false); // This should not happen
        },
    }
}
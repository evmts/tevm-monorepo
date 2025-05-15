const std = @import("std");
const address = @import("Address");
const _ = @import("log_config.zig"); // Import for log configuration

// Define a scoped logger for Frame-related logs
const log = std.log.scoped(.frame);

pub const Bytes = []const u8;

/// Represents the type of call being made
pub const CallScheme = enum {
    Call,        // Regular call
    CallCode,    // Like call but only the code is used
    DelegateCall,// Like callcode but with sender and value from parent
    StaticCall,  // Cannot modify state
};

/// Represents EVM execution frame input parameters
pub const FrameInput = union(enum) {
    /// Standard call to address
    Call: struct {
        callData: Bytes,
        gasLimit: u64,
        target: address.Address,
        codeAddress: address.Address, // Address where code is loaded from
        caller: address.Address,
        value: u256,
        callType: CallScheme,
        isStatic: bool,
    },
    
    /// Contract creation
    Create: struct {
        initCode: Bytes,
        gasLimit: u64,
        caller: address.Address,
        value: u256,
        salt: ?[32]u8, // NULL for regular CREATE, non-null for CREATE2
    },
    
    pub fn getGasLimit(self: FrameInput) u64 {
        return switch (self) {
            .Call => |call| call.gasLimit,
            .Create => |create| create.gasLimit,
        };
    }
};

/// Journal checkpoint for reverting state changes if needed
pub const JournalCheckpoint = usize;

/// Result of instruction execution
pub const InstructionResult = enum {
    Success,
    Revert,
    OutOfGas,
    InvalidOpcode,
    StackOverflow,
    StackUnderflow,
    InvalidJump,
    CallTooDeep,
    OutOfFunds,
};

/// Frame execution results
pub const FrameResult = union(enum) {
    Call: struct {
        status: InstructionResult,
        returnData: Bytes,
        gasUsed: u64,
        gasRefunded: u64,
    },
    
    Create: struct {
        status: InstructionResult,
        returnData: Bytes,
        gasUsed: u64,
        gasRefunded: u64,
        createdAddress: ?address.Address,
    },
};

/// Memory context for a frame
pub const Memory = struct {
    data: std.ArrayList(u8),
    
    pub fn init(allocator: std.mem.Allocator) Memory {
        return Memory{
            .data = std.ArrayList(u8).init(allocator),
        };
    }
    
    pub fn deinit(self: *Memory) void {
        self.data.deinit();
    }
    
    pub fn store(self: *Memory, offset: usize, value: []const u8) !void {
        // Expand memory if needed
        const requiredSize = offset + value.len;
        if (requiredSize > self.data.items.len) {
            try self.data.resize(requiredSize);
        }
        
        @memcpy(self.data.items[offset..offset+value.len], value);
    }
    
    pub fn load(self: *const Memory, offset: usize, length: usize) []const u8 {
        if (offset >= self.data.items.len) {
            return &[_]u8{};
        }
        
        const end = @min(offset + length, self.data.items.len);
        return self.data.items[offset..end];
    }
};

/// Stack implementation for EVM
pub const Stack = struct {
    data: std.ArrayList(u256),
    
    pub fn init(allocator: std.mem.Allocator) Stack {
        return Stack{
            .data = std.ArrayList(u256).init(allocator),
        };
    }
    
    pub fn deinit(self: *Stack) void {
        self.data.deinit();
    }
    
    pub fn push(self: *Stack, value: u256) !void {
        if (self.data.items.len >= 1024) {
            return error.StackOverflow;
        }
        try self.data.append(value);
    }
    
    pub fn pop(self: *Stack) !u256 {
        if (self.data.items.len == 0) {
            return error.StackUnderflow;
        }
        return self.data.pop() orelse return error.StackUnderflow;
    }
};

/// EVM execution state 
pub const ExecutionState = struct {
    memory: Memory,
    stack: Stack,
    pc: usize,
    gas: struct {
        remaining: u64,
        refunded: u64,
    },
    returnData: Bytes,
    
    pub fn init(allocator: std.mem.Allocator, gasLimit: u64) ExecutionState {
        return ExecutionState{
            .memory = Memory.init(allocator),
            .stack = Stack.init(allocator),
            .pc = 0,
            .gas = .{
                .remaining = gasLimit,
                .refunded = 0,
            },
            .returnData = &[_]u8{},
        };
    }
    
    pub fn deinit(self: *ExecutionState) void {
        self.memory.deinit();
        self.stack.deinit();
    }
};

/// Main execution frame - represents a single execution context
pub const Frame = struct {
    allocator: std.mem.Allocator,
    /// The input that created this frame
    input: FrameInput,
    /// Current execution state
    state: ExecutionState,
    /// Bytecode being executed
    code: Bytes,
    /// Depth in the call stack (limit 1024)
    depth: u16,
    /// Journal checkpoint for state changes
    checkpoint: JournalCheckpoint,
    
    pub fn init(
        allocator: std.mem.Allocator, 
        input: FrameInput, 
        code: Bytes,
        depth: u16,
        checkpoint: JournalCheckpoint
    ) !Frame {
        const gasLimit = input.getGasLimit();
        
        return Frame{
            .allocator = allocator,
            .input = input,
            .state = ExecutionState.init(allocator, gasLimit),
            .code = code,
            .depth = depth,
            .checkpoint = checkpoint,
        };
    }
    
    pub fn deinit(self: *Frame) void {
        self.state.deinit();
    }
    
    /// Debug method that logs information about the frame
    pub fn debug(self: *Frame) void {
        log.debug("\n=== FRAME DEBUG [Depth: {d}] ===", .{self.depth});
        
        // Print input information based on type
        switch (self.input) {
            .Call => |call| {
                log.debug("Type: Call", .{});
                log.debug("Gas Limit: {d}", .{call.gasLimit});
                log.debug("Target: {any}", .{call.target});
                log.debug("Code Address: {any}", .{call.codeAddress});
                log.debug("Caller: {any}", .{call.caller});
                log.debug("Value: {d}", .{call.value});
                log.debug("Call Type: {s}", .{@tagName(call.callType)});
                log.debug("Is Static: {}", .{call.isStatic});
                log.debug("Call Data Size: {d} bytes", .{call.callData.len});
            },
            .Create => |create| {
                log.debug("Type: Create", .{});
                log.debug("Gas Limit: {d}", .{create.gasLimit});
                log.debug("Caller: {any}", .{create.caller});
                log.debug("Value: {d}", .{create.value});
                log.debug("Has Salt: {}", .{create.salt != null});
                log.debug("Init Code Size: {d} bytes", .{create.initCode.len});
            },
        }
        
        // Print code information
        log.debug("Code Length: {d} bytes", .{self.code.len});
        if (self.code.len > 0) {
            var bytesStr: [50]u8 = undefined;
            var fbs = std.io.fixedBufferStream(&bytesStr);
            const writer = fbs.writer();
            
            const len = @min(self.code.len, 10);
            var i: usize = 0;
            while (i < len) : (i += 1) {
                writer.print("{x:0>2} ", .{self.code[i]}) catch break;
            }
            
            log.debug("First 10 bytes: {s}", .{bytesStr[0..fbs.pos]});
        }
        
        // Print current execution state
        log.debug("PC: {d}", .{self.state.pc});
        log.debug("Gas Remaining: {d}", .{self.state.gas.remaining});
        log.debug("Gas Refunded: {d}", .{self.state.gas.refunded});
        log.debug("Stack Size: {d}", .{self.state.stack.data.items.len});
        log.debug("Memory Size: {d} bytes", .{self.state.memory.data.items.len});
        
        log.debug("=== END FRAME DEBUG ===\n", .{});
    }
    
    /// Execute the frame until completion or a new call is needed
    pub fn execute(self: *Frame, _: *StateManager) !FrameOrCall {
        // Simple implementation for initial tests
        // Just check for basic opcodes and handle them
        log.debug("Starting execution", .{});
        
        if (self.code.len == 0) {
            log.debug("Empty code, returning success", .{});
            // Empty code returns success
            return FrameOrCall{ 
                .Result = FrameResult{
                    .Call = .{
                        .status = .Success,
                        .returnData = &[_]u8{},
                        .gasUsed = self.input.getGasLimit() - self.state.gas.remaining,
                        .gasRefunded = self.state.gas.refunded,
                    }
                }
            };
        }
        
        log.debug("Code length is {d}, first byte: {x:0>2}", .{self.code.len, self.code[0]});
        
        // In a real implementation, we would loop through the bytecode and interpret opcodes
        // but for this simplified version, we'll just check for STOP (0x00)
        if (self.code[0] == 0x00) {
            log.debug("Found STOP opcode, returning success", .{});
            // STOP opcode
            return FrameOrCall{ 
                .Result = FrameResult{
                    .Call = .{
                        .status = .Success,
                        .returnData = &[_]u8{},
                        .gasUsed = self.input.getGasLimit() - self.state.gas.remaining,
                        .gasRefunded = self.state.gas.refunded,
                    }
                }
            };
        }
        
        log.debug("Unknown opcode, returning InvalidOpcode", .{});
        // Default response for other opcodes (not yet implemented)
        return FrameOrCall{ 
            .Result = FrameResult{
                .Call = .{
                    .status = .InvalidOpcode,
                    .returnData = &[_]u8{},
                    .gasUsed = self.input.getGasLimit() - self.state.gas.remaining,
                    .gasRefunded = self.state.gas.refunded,
                }
            }
        };
    }
};

/// Result of frame execution - either a result or a new call
pub const FrameOrCall = union(enum) {
    /// Execution completed with this result
    Result: FrameResult,
    /// Execution needs to create a new call
    Call: FrameInput,
};

/// State manager handles the EVM state (balances, code, storage)
pub const StateManager = struct {
    // Simple implementation for testing
    mockCode: ?Bytes = null,
    
    pub fn checkpoint(_: *StateManager) JournalCheckpoint {
        // Create a checkpoint in the state journal
        return 0; // Placeholder
    }
    
    pub fn commit(_: *StateManager, cp: JournalCheckpoint) void {
        // Commit all changes since checkpoint
        _ = cp;
    }
    
    pub fn revert(_: *StateManager, cp: JournalCheckpoint) void {
        // Revert all changes since checkpoint
        _ = cp;
    }
    
    pub fn loadCode(self: *StateManager, addr: address.Address) !Bytes {
        // For testing, just return mock code if available
        _ = addr;
        if (self.mockCode) |code| {
            return code;
        }
        return &[_]u8{};
    }
};

// Note: The Evm struct is defined in evm.zig
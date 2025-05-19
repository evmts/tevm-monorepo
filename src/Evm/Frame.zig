const std = @import("std");
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;
const Contract = @import("Contract.zig").Contract;
const Address = @import("../Address/address.zig").Address;

/// Frame contains the execution state of the EVM interpreter
/// It represents a single execution frame, similar to geth's ScopeContext
pub const Frame = struct {
    // Core execution context
    op: []const u8 = undefined, // Current operation bytecode
    pc: usize = 0, // Program counter
    cost: u64 = 0, // Gas cost accumulated in the current execution
    err: ?ExecutionError = null, // Error encountered during execution

    // Execution resources
    memory: Memory, // EVM memory
    stack: Stack, // EVM stack
    contract: *Contract, // Current contract being executed

    // Call data and return data
    returnData: ?[]u8 = null, // Return data from last call
    returnSize: usize = 0, // Size of return data

    // Allocator for memory management
    allocator: std.mem.Allocator,

    /// Create a new frame with the given allocator and contract
    pub fn init(allocator: std.mem.Allocator, contract: *Contract) !Frame {
        return Frame{
            .memory = Memory.init(allocator),
            .stack = Stack{},
            .contract = contract,
            .allocator = allocator,
        };
    }

    /// Free resources used by the frame
    pub fn deinit(self: *Frame) void {
        self.memory.deinit();
        if (self.returnData) |data| {
            self.allocator.free(data);
            self.returnData = null;
            self.returnSize = 0;
        }
    }

    /// Set return data
    pub fn setReturnData(self: *Frame, data: []const u8) !void {
        if (self.returnData) |old_data| {
            self.allocator.free(old_data);
        }

        const copy = try self.allocator.alloc(u8, data.len);
        @memcpy(copy, data);
        
        self.returnData = copy;
        self.returnSize = data.len;
    }

    /// Get memory data
    pub fn memoryData(self: *const Frame) []u8 {
        return self.memory.data();
    }

    /// Get stack data
    pub fn stackData(self: *const Frame) []u256 {
        const stack_slice = self.stack.data[0..self.stack.size];
        return stack_slice;
    }

    /// Get caller address
    pub fn caller(self: *const Frame) Address {
        return self.contract.getCaller();
    }

    /// Get contract address
    pub fn address(self: *const Frame) Address {
        return self.contract.getAddress();
    }

    /// Get call value
    pub fn callValue(self: *const Frame) u256 {
        return self.contract.getValue();
    }

    /// Get call input/calldata
    pub fn callInput(self: *const Frame) []const u8 {
        return self.contract.input;
    }

    /// Get contract code
    pub fn contractCode(self: *const Frame) []const u8 {
        return self.contract.code;
    }
};

/// Error type for execution errors
pub const ExecutionError = error{
    STOP,
    REVERT,
    INVALID,
    OutOfGas,
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    InvalidOpcode,
    StaticStateChange,
    OutOfOffset,
    GasUintOverflow,
    WriteProtection,
    ReturnDataOutOfBounds,
    DeployCodeTooBig,
    MaxCodeSizeExceeded,
    InvalidCodeEntry,
    DepthLimit,
};

/// Constructor for creating a new frame
pub fn createFrame(allocator: std.mem.Allocator, contract: *Contract) !Frame {
    return Frame.init(allocator, contract);
}
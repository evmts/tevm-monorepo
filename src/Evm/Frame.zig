const std = @import("std");
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;
const Contract = @import("Contract.zig").Contract;
const Address = @import("../Address/address.zig").Address;
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;

// Create a file-specific logger
const logger = createLogger(@src().file);

/// Frame contains the execution state of the EVM interpreter
/// It represents a single execution frame, similar to geth's ScopeContext
///
/// The Frame holds all the resources needed for contract execution:
/// - Stack: data stack for EVM operations
/// - Memory: the EVM's linear memory space
/// - Contract: the contract being executed
/// - Program counter and execution state
/// - Return data from previous calls
///
/// Each call or contract execution creates a new Frame, which is destroyed
/// when execution completes
pub const Frame = struct {
    // Core execution context
    /// Current operation bytecode being executed
    op: []const u8 = undefined, 
    /// Program counter - position in the bytecode
    pc: usize = 0, 
    /// Gas cost accumulated in the current execution step
    cost: u64 = 0, 
    /// Error encountered during execution (if any)
    err: ?ExecutionError = null, 

    // Execution resources
    /// EVM memory - a linear byte array that can be accessed via MLOAD/MSTORE
    memory: Memory, 
    /// EVM stack - holds up to 1024 items for operation inputs/outputs
    stack: Stack, 
    /// Current contract being executed, containing code and execution context
    contract: *Contract, 

    // Call data and return data
    /// Return data from the most recent call operation
    returnData: ?[]u8 = null, 
    /// Size of the return data buffer
    returnSize: usize = 0, 

    /// Logger for debug information
    logger: EvmLogger,

    /// Allocator for memory management of the Frame's resources
    allocator: std.mem.Allocator,

    /// Create a new frame with the given allocator and contract
    ///
    /// This initializes a fresh execution context for running EVM code
    ///
    /// Parameters:
    /// - allocator: Memory allocator used for memory management
    /// - contract: Pointer to the contract being executed
    ///
    /// Returns: A new Frame instance
    /// Error: May return allocation errors if memory setup fails
    pub fn init(allocator: std.mem.Allocator, contract: *Contract) !Frame {
        logger.debug("Creating new Frame for contract at address: {}", .{contract.address});
        return Frame{
            .memory = Memory.init(allocator),
            .stack = Stack{},
            .contract = contract,
            .logger = logger,
            .allocator = allocator,
        };
    }

    /// Free resources used by the frame
    ///
    /// This must be called when a frame is no longer needed to prevent memory leaks.
    /// It frees the EVM memory and any return data buffer.
    pub fn deinit(self: *Frame) void {
        self.logger.debug("Freeing Frame resources", .{});
        self.memory.deinit();
        if (self.returnData) |data| {
            self.allocator.free(data);
            self.returnData = null;
            self.returnSize = 0;
        }
    }

    /// Set return data from contract execution
    ///
    /// This copies the provided data to a new buffer. Any previous return data
    /// is freed first.
    ///
    /// Parameters:
    /// - data: Slice of bytes to store as return data
    ///
    /// Error: May return allocation errors if memory allocation fails
    pub fn setReturnData(self: *Frame, data: []const u8) !void {
        self.logger.debug("Setting return data, size: {d} bytes", .{data.len});
        if (self.returnData) |old_data| {
            self.allocator.free(old_data);
        }

        const copy = try self.allocator.alloc(u8, data.len);
        @memcpy(copy, data);
        
        self.returnData = copy;
        self.returnSize = data.len;
    }

    /// Get access to the raw memory data buffer
    ///
    /// Returns: Slice representing the EVM memory contents
    pub fn memoryData(self: *const Frame) []u8 {
        return self.memory.data();
    }

    /// Get access to the stack data
    ///
    /// Returns: Slice containing the valid stack elements (excludes unused slots)
    pub fn stackData(self: *const Frame) []u256 {
        const stack_slice = self.stack.data[0..self.stack.size];
        return stack_slice;
    }

    /// Get the address that initiated the current call
    ///
    /// Returns: Address of the caller
    pub fn caller(self: *const Frame) Address {
        return self.contract.getCaller();
    }

    /// Get the address of the contract being executed
    ///
    /// Returns: Address of the contract
    pub fn address(self: *const Frame) Address {
        return self.contract.getAddress();
    }

    /// Get the ETH value sent with the call
    ///
    /// Returns: Value in wei as a 256-bit integer
    pub fn callValue(self: *const Frame) u256 {
        return self.contract.getValue();
    }

    /// Get the input data (calldata) for the current call
    ///
    /// Returns: Slice of bytes passed as calldata
    pub fn callInput(self: *const Frame) []const u8 {
        return self.contract.input;
    }

    /// Get the bytecode of the contract being executed
    ///
    /// Returns: Slice of bytes containing the contract's bytecode
    pub fn contractCode(self: *const Frame) []const u8 {
        return self.contract.code;
    }
};

/// Error type for execution errors
///
/// These errors represent the various conditions that can halt or
/// revert execution in the EVM
pub const ExecutionError = error{
    /// Normal STOP opcode execution - graceful termination
    STOP,
    /// REVERT opcode execution - reverts state changes but returns data
    REVERT,
    /// INVALID opcode or other invalid condition - full reversion
    INVALID,
    /// Not enough gas to continue execution
    OutOfGas,
    /// Attempted to pop from an empty stack
    StackUnderflow,
    /// Attempted to push to a full stack (beyond 1024 elements)
    StackOverflow,
    /// Jump to an invalid destination (not a JUMPDEST opcode)
    InvalidJump,
    /// Encountered an undefined opcode
    InvalidOpcode,
    /// Attempted to modify state in a static (view) context
    StaticStateChange,
    /// Memory access beyond valid bounds or overflow
    OutOfOffset,
    /// Gas calculation resulted in an integer overflow
    GasUintOverflow,
    /// Attempted to write in a read-only context
    WriteProtection,
    /// Accessed return data outside of bounds
    ReturnDataOutOfBounds,
    /// Contract creation code exceeds size limits
    DeployCodeTooBig,
    /// Contract code size exceeds the maximum allowed size
    MaxCodeSizeExceeded,
    /// Contract entry code is invalid (e.g., starts with EF)
    InvalidCodeEntry,
    /// Call depth exceeds limit (1024)
    DepthLimit,
};

/// Constructor for creating a new frame
///
/// This is a convenience function that wraps Frame.init()
///
/// Parameters:
/// - allocator: Memory allocator used for memory management
/// - contract: Pointer to the contract being executed
///
/// Returns: A new Frame instance
/// Error: May return allocation errors if memory setup fails
pub fn createFrame(allocator: std.mem.Allocator, contract: *Contract) !Frame {
    logger.debug("Creating frame via helper function", .{});
    return Frame.init(allocator, contract);
}
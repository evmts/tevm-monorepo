const std = @import("std");
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;
const Contract = @import("Contract.zig").Contract;
const Address = @import("../Address/address.zig").Address;
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;
const logMemory = @import("EvmLogger.zig").logMemory;
const logStack = @import("EvmLogger.zig").logStack;
const logStackSlop = @import("EvmLogger.zig").logStackSlop;
const logStep = @import("EvmLogger.zig").logStep;
const logHexBytes = @import("EvmLogger.zig").logHexBytes;
const createScopedLogger = @import("EvmLogger.zig").createScopedLogger;
const hex = @import("../Utils/hex.zig");

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
        const scoped = createScopedLogger(logger, "Frame.init");
        defer scoped.deinit();
        
        logger.debug("Creating new Frame for contract at address: {}", .{contract.address});
        logger.debug("Contract caller: {}", .{contract.caller});
        logger.debug("Contract value: {d} wei", .{contract.value});
        logger.debug("Initial gas: {d}", .{contract.gas});
        logger.debug("Code size: {d} bytes", .{contract.code.len});
        
        if (contract.code.len > 0 and contract.code.len <= 64) {
            logHexBytes(logger, "Contract bytecode", contract.code);
        } else if (contract.code.len > 64) {
            logHexBytes(logger, "Contract bytecode (first 64 bytes)", contract.code[0..64]);
        }
        
        if (contract.input.len > 0) {
            if (contract.input.len <= 64) {
                logHexBytes(logger, "Input data (calldata)", contract.input);
            } else {
                logHexBytes(logger, "Input data (calldata, first 64 bytes)", contract.input[0..64]);
                logger.debug("Input data total size: {d} bytes", .{contract.input.len});
            }
        } else {
            logger.debug("No input data (empty calldata)", .{});
        }
        
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
        const scoped = createScopedLogger(logger, "Frame.deinit");
        defer scoped.deinit();
        
        logger.debug("Freeing Frame resources", .{});
        logger.debug("Final memory size: {d} bytes", .{self.memory.len()});
        logger.debug("Final stack size: {d} items", .{self.stack.len()});
        
        if (self.err) |err| {
            logger.debug("Frame ended with error: {}", .{err});
        } else {
            logger.debug("Frame ended successfully", .{});
        }
        
        if (self.returnData) |data| {
            if (data.len <= 64) {
                logHexBytes(logger, "Return data", data);
            } else {
                logHexBytes(logger, "Return data (first 64 bytes)", data[0..64]);
                logger.debug("Return data total size: {d} bytes", .{data.len});
            }
            logger.debug("Freeing return data buffer ({d} bytes)", .{data.len});
            self.allocator.free(data);
            self.returnData = null;
            self.returnSize = 0;
        } else {
            logger.debug("No return data to free", .{});
        }
        
        logger.debug("Remaining gas: {d}", .{self.contract.gas});
        
        // Log gas refund if any
        if (self.contract.gas_refund > 0) {
            logger.debug("Gas refund: {d}", .{self.contract.gas_refund});
        }
        
        self.memory.deinit();
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
        const scoped = createScopedLogger(logger, "Frame.setReturnData");
        defer scoped.deinit();
        
        logger.debug("Setting return data, size: {d} bytes", .{data.len});
        
        if (data.len <= 64) {
            logHexBytes(logger, "New return data", data);
        } else {
            logHexBytes(logger, "New return data (first 64 bytes)", data[0..64]);
        }
        
        if (self.returnData) |old_data| {
            logger.debug("Freeing previous return data ({d} bytes)", .{old_data.len});
            self.allocator.free(old_data);
        }

        logger.debug("Allocating new return data buffer of {d} bytes", .{data.len});
        const copy = try self.allocator.alloc(u8, data.len);
        @memcpy(copy, data);
        
        self.returnData = copy;
        self.returnSize = data.len;
        logger.debug("Return data set successfully", .{});
    }

    /// Get access to the raw memory data buffer
    ///
    /// Returns: Slice representing the EVM memory contents
    pub fn memoryData(self: *const Frame) []u8 {
        const data = self.memory.data();
        logger.debug("Getting memory data: {d} bytes", .{data.len});
        return data;
    }

    /// Get access to the stack data
    ///
    /// Returns: Slice containing the valid stack elements (excludes unused slots)
    pub fn stackData(self: *const Frame) []u256 {
        const stack_slice = self.stack.data[0..self.stack.size];
        logger.debug("Getting stack data: {d} items", .{stack_slice.len});
        return stack_slice;
    }

    /// Get the address that initiated the current call
    ///
    /// Returns: Address of the caller
    pub fn caller(self: *const Frame) Address {
        const caller_addr = self.contract.getCaller();
        logger.debug("Getting caller address: {}", .{caller_addr});
        return caller_addr;
    }

    /// Get the address of the contract being executed
    ///
    /// Returns: Address of the contract
    pub fn address(self: *const Frame) Address {
        const contract_addr = self.contract.getAddress();
        logger.debug("Getting contract address: {}", .{contract_addr});
        return contract_addr;
    }

    /// Get the ETH value sent with the call
    ///
    /// Returns: Value in wei as a 256-bit integer
    pub fn callValue(self: *const Frame) u256 {
        const value = self.contract.getValue();
        logger.debug("Getting call value: {d} wei", .{value});
        return value;
    }

    /// Get the input data (calldata) for the current call
    ///
    /// Returns: Slice of bytes passed as calldata
    pub fn callInput(self: *const Frame) []const u8 {
        const input = self.contract.input;
        logger.debug("Getting call input data: {d} bytes", .{input.len});
        return input;
    }

    /// Get the bytecode of the contract being executed
    ///
    /// Returns: Slice of bytes containing the contract's bytecode
    pub fn contractCode(self: *const Frame) []const u8 {
        const code = self.contract.code;
        logger.debug("Getting contract code: {d} bytes", .{code.len});
        return code;
    }
    
    /// Log the current execution state of the frame
    ///
    /// This is a debugging helper that logs the current state of the Frame,
    /// including PC, opcode, stack contents, and memory contents
    pub fn logExecutionState(self: *const Frame, op_name: []const u8) void {
        if (@import("EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            logger.debug("Execution state at PC={d}, Opcode={s}", .{self.pc, op_name});
            
            // Log current stack state
            const stack_data = self.stackData();
            logStackSlop(logger, stack_data, op_name, self.pc);
            
            // Log memory state (first 128 bytes max)
            const mem_data = self.memoryData();
            if (mem_data.len > 0) {
                const display_size = @min(mem_data.len, 128);
                logMemory(logger, mem_data, display_size);
            }
            
            // Log full execution step with more details
            if (stack_data.len > 0 or mem_data.len > 0) {
                const curr_op = if (self.pc < self.contract.code.len) self.contract.code[self.pc] else 0;
                logStep(logger, self.pc, curr_op, op_name, self.contract.gas, stack_data, mem_data);
            }
        }
    }
    
    /// Log gas usage details
    ///
    /// This logs the gas cost of the current operation and remaining gas
    pub fn logGasUsage(self: *const Frame, op_name: []const u8, gas_cost: u64) void {
        logger.debug("Gas: {s} uses {d} gas, remaining: {d}", .{op_name, gas_cost, self.contract.gas});
        if (gas_cost > 50) {
            logger.debug("High gas operation: {s} used {d} gas", .{op_name, gas_cost});
        }
    }
    
    /// Log memory expansion operations
    ///
    /// This logs details about memory expansions and their gas costs
    pub fn logMemoryExpansion(self: *const Frame, old_size: u64, new_size: u64, gas_cost: u64) void {
        logger.debug("Memory expanded: {d} -> {d} bytes (cost: {d} gas)", .{old_size, new_size, gas_cost});
    }
    
    /// Log a stack operation (push or pop)
    ///
    /// This logs details about values being pushed to or popped from the stack
    pub fn logStackOp(self: *const Frame, is_push: bool, value: ?u256) void {
        if (is_push) {
            if (value) |v| {
                logger.debug("Stack push: {x}", .{v});
            }
        } else {
            if (value) |v| {
                logger.debug("Stack pop: {x}", .{v});
            } else {
                logger.debug("Stack pop (no value)", .{});
            }
        }
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

/// Get a human-readable description of an execution error
///
/// Parameters:
/// - err: The execution error to describe
///
/// Returns: A string describing the error
pub fn getErrorDescription(err: ExecutionError) []const u8 {
    return switch (err) {
        .STOP => "Normal STOP opcode execution",
        .REVERT => "REVERT opcode - state reverted",
        .INVALID => "INVALID opcode or invalid operation",
        .OutOfGas => "Out of gas",
        .StackUnderflow => "Stack underflow",
        .StackOverflow => "Stack overflow (beyond 1024 elements)",
        .InvalidJump => "Jump to invalid destination",
        .InvalidOpcode => "Undefined opcode",
        .StaticStateChange => "State modification in static context",
        .OutOfOffset => "Memory access out of bounds",
        .GasUintOverflow => "Gas calculation overflow",
        .WriteProtection => "Write to protected storage",
        .ReturnDataOutOfBounds => "Return data access out of bounds",
        .DeployCodeTooBig => "Contract creation code too large",
        .MaxCodeSizeExceeded => "Contract code size exceeds limit",
        .InvalidCodeEntry => "Invalid contract entry code",
        .DepthLimit => "Call depth exceeds limit (1024)",
    };
}

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
    const scoped = createScopedLogger(logger, "createFrame");
    defer scoped.deinit();
    
    logger.debug("Creating frame via helper function for contract at {}", .{contract.address});
    
    if (contract.code.len > 0) {
        logger.debug("Contract has {d} bytes of code", .{contract.code.len});
        if (contract.code.len <= 32) {
            var buf: [128]u8 = undefined;
            const hex_str = hex.bytesToHex(contract.code, &buf) catch "error encoding hex";
            logger.debug("Code: 0x{s}", .{hex_str});
        }
    } else {
        logger.debug("Contract has no code (EOA or new contract)", .{});
    }
    
    return Frame.init(allocator, contract);
}
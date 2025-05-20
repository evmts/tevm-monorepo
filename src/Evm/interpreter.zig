const std = @import("std");
const opcodes = @import("opcodes.zig");
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Contract = @import("Contract.zig").Contract;
const Frame = @import("Frame.zig").Frame;
const ExecutionError = @import("Frame.zig").ExecutionError;
const Evm = @import("Evm.zig");
const JumpTableModule = @import("JumpTable.zig");
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;
const logStack = @import("EvmLogger.zig").logStack;
const logMemory = @import("EvmLogger.zig").logMemory;
const logOpcode = @import("EvmLogger.zig").logOpcode;
const Address = @import("../Address/package.zig");

// Import specific items from opcodes for convenience
const Operation = opcodes.Operation;
const JumpTable = JumpTableModule.JumpTable;
const getOperation = opcodes.getOperation;

// Import precompiles system
const precompile = @import("precompile/Precompiles.zig");

// We'll initialize the logger inside a function
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger("interpreter.zig");
    }
    return _logger.?;
}

/// Interpreter error type
///
/// These errors represent the various execution errors that can occur
/// during contract execution. They map closely to error conditions
/// defined in the Ethereum Yellow Paper.
const InterpreterError = error{
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

/// The Interpreter executes EVM bytecode
///
/// The Interpreter is responsible for running the EVM execution loop:
/// - Fetching opcodes from contract bytecode
/// - Calculating gas costs for each operation
/// - Executing the operations
/// - Managing memory, stack, and execution context
/// - Handling errors and exceptional conditions
/// - Returning execution results
pub const Interpreter = struct {
    /// Memory allocator for the interpreter's resources
    allocator: std.mem.Allocator,
    
    /// Pointer to the EVM instance that provides context and state access
    evm: *Evm,
    
    /// Jump table containing the implementation of all opcodes
    table: JumpTable,
    
    /// Whether the interpreter is running in read-only mode
    /// In read-only mode, operations that modify state will fail
    readOnly: bool = false,
    
    /// Return data from the last call operation
    /// This is stored at the interpreter level to allow access across frames
    returnData: ?[]u8 = null,
    
    /// Logger for debug information
    logger: EvmLogger,
    
    /// Opcodes to operation names mapping for debug logging
    /// Used to provide human-readable names in logs
    const opcodeNames = opcodes.opcodeNames;

    /// Create a new Interpreter instance
    ///
    /// Parameters:
    /// - allocator: Memory allocator for the interpreter's resources
    /// - evm: Pointer to the EVM instance to use
    /// - table: Jump table containing opcode implementations
    ///
    /// Returns: A new Interpreter instance
    pub fn create(allocator: std.mem.Allocator, evm: *Evm, table: JumpTable) Interpreter {
        getLogger().debug("Creating new Interpreter instance", .{});
        return Interpreter{
            .evm = evm,
            .table = table,
            .allocator = allocator,
            .logger = getLogger(),
        };
    }
    
    /// Initialize a new Interpreter instance with default jump table
    ///
    /// This convenience function creates an interpreter with the default
    /// jump table configuration. It's primarily used for testing and simpler
    /// initialization.
    ///
    /// Parameters:
    /// - allocator: Memory allocator for the interpreter's resources
    /// - evm: Pointer to the EVM instance to use
    ///
    /// Returns: A new Interpreter instance
    /// Error: Returned if initialization fails
    pub fn init(allocator: std.mem.Allocator, evm: *Evm) !Interpreter {
        getLogger().debug("Initializing new Interpreter instance", .{});
        
        // Create a new jump table with default opcode implementations
        var jump_table = try JumpTable.init(allocator);
        
        // Register all standard opcodes 
        try opcodes.registerOpcodes(allocator, &jump_table);
        
        return Interpreter{
            .evm = evm,
            .table = jump_table,
            .allocator = allocator,
            .logger = getLogger(),
        };
    }

    /// Run the interpreter to execute contract code
    ///
    /// This is the main entry point for EVM execution. It handles the entire
    /// lifecycle of a contract call, from setting up the execution environment
    /// to running the execution loop and returning results.
    ///
    /// Parameters:
    /// - contract: Pointer to the contract to execute
    /// - input: Input data (calldata) for the execution
    /// - readOnly: Whether this execution should be read-only (STATICCALL)
    ///
    /// Returns: Return data from the execution, or null if none
    /// Error: Various execution errors that can occur during execution
    pub fn run(self: *Interpreter, contract: *Contract, input: []const u8, readOnly: bool) InterpreterError!?[]const u8 {
        getLogger().debug("Starting execution in 'run' with depth {d}", .{self.evm.depth + 1});
        getLogger().debug("Contract code length: {d}, readOnly: {}", .{contract.code.len, readOnly});
        
        // Increment the call depth which is restricted to 1024
        self.evm.depth += 1;
        defer self.evm.depth -= 1;

        // Make sure the readOnly is only set if we aren't in readOnly yet.
        // This also makes sure that the readOnly flag isn't removed for child calls.
        if (readOnly and !self.readOnly) {
            getLogger().debug("Setting readOnly mode to true", .{});
            self.readOnly = true;
            defer self.readOnly = false;
        }

        // Reset the previous call's return data
        if (self.returnData) |data| {
            getLogger().debug("Freeing previous return data ({d} bytes)", .{data.len});
            self.allocator.free(data);
            self.returnData = null;
        }

        // Don't bother with the execution if there's no code.
        if (contract.code.len == 0) {
            getLogger().info("Contract has no code, skipping execution", .{});
            return null;
        }

        // EIP-3651: Warm COINBASE - If EIP-3651 is enabled, mark the COINBASE address as warm
        // For the real implementation, we would use the actual COINBASE address from the block
        // Since we don't have access to it here, we'll just implement the EIP-3651 behavior
        if (self.evm.chainRules.IsEIP3651 and self.evm.depth == 1) {
            getLogger().debug("EIP-3651: Marking COINBASE address as warm from the start", .{});
            // Note: In a real implementation, we would get the actual COINBASE address
            // and mark that specific address as warm. For now, we're using a dummy 
            // zero address since that's what our opCoinbase implementation uses.
            const coinbase_addr = Address.ZERO_ADDRESS;
            
            // Get account access list from state manager
            if (self.evm.state_manager) |_| {
                // Mark the COINBASE address as accessed (warm) in the state manager's access list
                // This would be implementation-specific based on how access lists are tracked
                // For now, we'll just log that it should happen
                getLogger().debug("EIP-3651: Should mark COINBASE {any} as warm in state manager", .{coinbase_addr});
                
                // If there was a markAccountWarm method on the state manager, we'd call it here
                // state_manager.markAccountWarm(coinbase_addr);
            }
        }

        // Initialize the Frame
        getLogger().debug("Initializing execution frame", .{});
        var frame = try Frame.init(self.allocator, contract);
        defer frame.deinit();

        // Set contract input
        contract.input = input;
        getLogger().debug("Input data set, length: {d} bytes", .{input.len});

        // Main execution loop
        getLogger().debug("Starting main execution loop", .{});
        while (true) {
            // Get the current operation from the bytecode
            const op_code = contract.getOp(frame.pc);
            const operation = self.table.getOperation(op_code);
            
            // Get operation name for logging
            const op_name = if (op_code < opcodeNames.len) opcodeNames[op_code] else "UNKNOWN";
            
            logOpcode(self.logger, frame.pc, op_code, op_name, operation.constant_gas, contract.gas);
            
            // Debug log the stack state before execution
            if (frame.stack.size > 0) {
                logStack(self.logger, frame.stack.data[0..frame.stack.size]);
            }
            
            // Validate stack
            if (frame.stack.size < operation.min_stack) {
                getLogger().err("Stack underflow: required {d}, have {d}", .{operation.min_stack, frame.stack.size});
                return InterpreterError.StackUnderflow;
            } else if (frame.stack.size > operation.max_stack) {
                getLogger().err("Stack overflow: maximum {d}, have {d}", .{operation.max_stack, frame.stack.size});
                return InterpreterError.StackOverflow;
            }

            // Check if we have enough gas for the constant part
            const constantGas = operation.constant_gas;
            if (contract.gas < constantGas) {
                getLogger().err("Out of gas: need {d}, have {d}", .{constantGas, contract.gas});
                return InterpreterError.OutOfGas;
            }
            contract.useGas(constantGas);
            getLogger().debug("Charged {d} constant gas, remaining: {d}", .{constantGas, contract.gas});
            
            // Calculate and charge dynamic gas if needed
            if (operation.dynamic_gas != null and operation.memory_size != null) {
                // Calculate memory expansion size if needed
                var memorySize: u64 = 0;
                if (operation.memory_size) |memory_size_fn| {
                    getLogger().debug("Calculating memory size for operation", .{});
                    const result = memory_size_fn(&frame.stack);
                    if (result.overflow) {
                        getLogger().err("Memory size calculation overflowed", .{});
                        return InterpreterError.GasUintOverflow;
                    }
                    
                    // Memory is expanded in words of 32 bytes
                    // Gas is also calculated in words
                    const word_size = (result.size + 31) / 32;
                    memorySize = word_size * 32;
                    getLogger().debug("Memory size: {d} bytes ({d} words)", .{memorySize, word_size});
                }
                
                // Calculate dynamic gas
                if (operation.dynamic_gas) |dynamic_gas_fn| {
                    getLogger().debug("Calculating dynamic gas cost", .{});
                    const dynamicCost = dynamic_gas_fn(self, &frame, &frame.stack, &frame.memory, memorySize) catch {
                        getLogger().err("Dynamic gas calculation failed", .{});
                        return InterpreterError.OutOfGas;
                    };
                    
                    // Check if we have enough gas for the dynamic part
                    if (contract.gas < dynamicCost) {
                        getLogger().err("Out of gas for dynamic part: need {d}, have {d}", .{dynamicCost, contract.gas});
                        return InterpreterError.OutOfGas;
                    }
                    
                    // Charge the dynamic gas
                    contract.useGas(dynamicCost);
                    getLogger().debug("Charged {d} dynamic gas, remaining: {d}", .{dynamicCost, contract.gas});
                    
                    // Resize memory if necessary
                    if (memorySize > 0) {
                        getLogger().debug("Resizing memory to {d} bytes", .{memorySize});
                        frame.memory.resize(memorySize) catch {
                            getLogger().err("Failed to resize memory", .{});
                            return InterpreterError.OutOfGas;
                        };
                    }
                }
            }
            
            // Execute the operation
            getLogger().debug("Executing operation {s}", .{op_name});
            _ = operation.execute(frame.pc, self, &frame) catch |err| {
                // Handle execution errors
                switch (err) {
                    ExecutionError.STOP => {
                        getLogger().info("Execution stopped normally with STOP", .{});
                        break; // Successful completion with STOP
                    },
                    ExecutionError.REVERT => {
                        getLogger().info("Execution reverted with REVERT", .{});
                        // Handle revert - return remaining gas to caller
                        // and return revert data
                        if (frame.returnData) |data| {
                            getLogger().debug("REVERT with {d} bytes of return data", .{data.len});
                            // Clean up previous return data if it exists to prevent memory leaks
                            if (self.returnData) |old_data| {
                                self.allocator.free(old_data);
                                self.returnData = null;
                            }
                            
                            // Copy return data for the caller to access
                            const return_copy = self.allocator.dupe(u8, data) catch return InterpreterError.OutOfGas;
                            self.returnData = return_copy;
                            return return_copy;
                        }
                        getLogger().debug("REVERT with no return data", .{});
                        return null;
                    },
                    ExecutionError.OutOfGas => {
                        getLogger().err("Execution failed: Out of gas", .{});
                        return InterpreterError.OutOfGas;
                    },
                    ExecutionError.StackUnderflow => {
                        getLogger().err("Execution failed: Stack underflow", .{});
                        return InterpreterError.StackUnderflow;
                    },
                    ExecutionError.StackOverflow => {
                        getLogger().err("Execution failed: Stack overflow", .{});
                        return InterpreterError.StackOverflow;
                    },
                    ExecutionError.InvalidJump => {
                        getLogger().err("Execution failed: Invalid jump destination", .{});
                        return InterpreterError.InvalidJump;
                    },
                    ExecutionError.InvalidOpcode => {
                        getLogger().err("Execution failed: Invalid opcode", .{});
                        return InterpreterError.InvalidOpcode;
                    },
                    ExecutionError.StaticStateChange => {
                        getLogger().err("Execution failed: State change in static call", .{});
                        return InterpreterError.StaticStateChange;
                    },
                    else => {
                        getLogger().err("Execution failed with error: {}", .{err});
                        return InterpreterError.InvalidOpcode;
                    },
                }
            };
            
            // Debug log memory state after important memory operations
            if (op_code >= 0x50 and op_code <= 0x5F) { // MLOAD, MSTORE, etc.
                const mem_data = frame.memory.data();
                if (mem_data.len > 0) {
                    logMemory(self.logger, mem_data, 128); // Show up to 128 bytes
                }
            }

            // Update program counter for next iteration
            frame.pc += 1;
            getLogger().debug("Updated PC to {d}", .{frame.pc});
        }
        
        getLogger().info("Execution completed successfully", .{});

        // Return successful completion data if any
        if (frame.returnData) |data| {
            getLogger().debug("Returning successful completion data: {d} bytes", .{data.len});
            
            // Clean up previous return data if it exists to prevent memory leaks
            if (self.returnData) |old_data| {
                self.allocator.free(old_data);
                self.returnData = null;
            }
            
            // Copy return data for the caller to access
            const return_copy = self.allocator.dupe(u8, data) catch return InterpreterError.OutOfGas;
            self.returnData = return_copy;
            return return_copy;
        }
        
        getLogger().debug("Execution completed with no return data", .{});
        return null;
    }
    
    /// Free resources used by the interpreter
    ///
    /// This releases any memory allocated by the interpreter, primarily
    /// the return data buffer. It should be called when the interpreter
    /// is no longer needed to prevent memory leaks.
    pub fn deinit(self: *Interpreter) void {
        getLogger().debug("Deinitializing interpreter", .{});
        if (self.returnData) |data| {
            getLogger().debug("Freeing return data: {d} bytes", .{data.len});
            self.allocator.free(data);
            self.returnData = null;
        }
    }
};
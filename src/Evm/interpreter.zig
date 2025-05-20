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

// Import specific items from opcodes for convenience
const Operation = opcodes.Operation;
const JumpTable = JumpTableModule.JumpTable;
const getOperation = opcodes.getOperation;

// Import precompiles system
const precompile = @import("precompile/Precompiles.zig");

// Create a file-specific logger
const logger = createLogger(@src().file);

// Interpreter error type
const InterpreterError = error{
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

pub const Interpreter = struct {
    allocator: std.mem.Allocator,
    evm: *Evm,
    table: JumpTable,
    readOnly: bool = false,
    returnData: ?[]u8 = null,
    logger: EvmLogger,
    
    // Opcodes to operation names mapping for debug logging
    const opcodeNames = opcodes.opcodeNames;

    pub fn create(allocator: std.mem.Allocator, evm: *Evm, table: JumpTable) Interpreter {
        logger.debug("Creating new Interpreter instance", .{});
        return Interpreter{
            .evm = evm,
            .table = table,
            .allocator = allocator,
            .logger = logger,
        };
    }

    pub fn run(self: *Interpreter, contract: *Contract, input: []const u8, readOnly: bool) InterpreterError!?[]const u8 {
        self.logger.debug("Starting execution in 'run' with depth {d}", .{self.evm.depth + 1});
        self.logger.debug("Contract code length: {d}, readOnly: {}", .{contract.code.len, readOnly});
        
        // Increment the call depth which is restricted to 1024
        self.evm.depth += 1;
        defer self.evm.depth -= 1;

        // Make sure the readOnly is only set if we aren't in readOnly yet.
        // This also makes sure that the readOnly flag isn't removed for child calls.
        const previousReadOnly = self.readOnly;
        if (readOnly and !self.readOnly) {
            self.logger.debug("Setting readOnly mode to true", .{});
            self.readOnly = true;
            defer self.readOnly = false;
        }

        // Reset the previous call's return data
        if (self.returnData) |data| {
            self.logger.debug("Freeing previous return data ({d} bytes)", .{data.len});
            self.allocator.free(data);
            self.returnData = null;
        }

        // Don't bother with the execution if there's no code.
        if (contract.code.len == 0) {
            self.logger.info("Contract has no code, skipping execution", .{});
            return null;
        }

        // Initialize the Frame
        self.logger.debug("Initializing execution frame", .{});
        var frame = try Frame.init(self.allocator, contract);
        defer frame.deinit();

        // Set contract input
        contract.input = input;
        self.logger.debug("Input data set, length: {d} bytes", .{input.len});

        // Main execution loop
        self.logger.debug("Starting main execution loop", .{});
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
                self.logger.err("Stack underflow: required {d}, have {d}", .{operation.min_stack, frame.stack.size});
                return InterpreterError.StackUnderflow;
            } else if (frame.stack.size > operation.max_stack) {
                self.logger.err("Stack overflow: maximum {d}, have {d}", .{operation.max_stack, frame.stack.size});
                return InterpreterError.StackOverflow;
            }

            // Check if we have enough gas for the constant part
            const constantGas = operation.constant_gas;
            if (contract.gas < constantGas) {
                self.logger.err("Out of gas: need {d}, have {d}", .{constantGas, contract.gas});
                return InterpreterError.OutOfGas;
            }
            contract.useGas(constantGas);
            self.logger.debug("Charged {d} constant gas, remaining: {d}", .{constantGas, contract.gas});
            
            // Calculate and charge dynamic gas if needed
            if (operation.dynamic_gas != null and operation.memory_size != null) {
                // Calculate memory expansion size if needed
                var memorySize: u64 = 0;
                if (operation.memory_size) |memory_size_fn| {
                    self.logger.debug("Calculating memory size for operation", .{});
                    const result = memory_size_fn(&frame.stack);
                    if (result.overflow) {
                        self.logger.err("Memory size calculation overflowed", .{});
                        return InterpreterError.GasUintOverflow;
                    }
                    
                    // Memory is expanded in words of 32 bytes
                    // Gas is also calculated in words
                    const word_size = (result.size + 31) / 32;
                    memorySize = word_size * 32;
                    self.logger.debug("Memory size: {d} bytes ({d} words)", .{memorySize, word_size});
                }
                
                // Calculate dynamic gas
                if (operation.dynamic_gas) |dynamic_gas_fn| {
                    self.logger.debug("Calculating dynamic gas cost", .{});
                    const dynamicCost = dynamic_gas_fn(self, &frame, &frame.stack, &frame.memory, memorySize) catch {
                        self.logger.err("Dynamic gas calculation failed", .{});
                        return InterpreterError.OutOfGas;
                    };
                    
                    // Check if we have enough gas for the dynamic part
                    if (contract.gas < dynamicCost) {
                        self.logger.err("Out of gas for dynamic part: need {d}, have {d}", .{dynamicCost, contract.gas});
                        return InterpreterError.OutOfGas;
                    }
                    
                    // Charge the dynamic gas
                    contract.useGas(dynamicCost);
                    self.logger.debug("Charged {d} dynamic gas, remaining: {d}", .{dynamicCost, contract.gas});
                    
                    // Resize memory if necessary
                    if (memorySize > 0) {
                        self.logger.debug("Resizing memory to {d} bytes", .{memorySize});
                        frame.memory.resize(memorySize) catch {
                            self.logger.err("Failed to resize memory", .{});
                            return InterpreterError.OutOfGas;
                        };
                    }
                }
            }
            
            // Execute the operation
            self.logger.debug("Executing operation {s}", .{op_name});
            _ = operation.execute(frame.pc, self, &frame) catch |err| {
                // Handle execution errors
                switch (err) {
                    ExecutionError.STOP => {
                        self.logger.info("Execution stopped normally with STOP", .{});
                        break; // Successful completion with STOP
                    },
                    ExecutionError.REVERT => {
                        self.logger.info("Execution reverted with REVERT", .{});
                        // Handle revert - return remaining gas to caller
                        // and return revert data
                        if (frame.returnData) |data| {
                            self.logger.debug("REVERT with {d} bytes of return data", .{data.len});
                            // Copy return data for the caller to access
                            const return_copy = self.allocator.dupe(u8, data) catch return InterpreterError.OutOfGas;
                            self.returnData = return_copy;
                            return return_copy;
                        }
                        self.logger.debug("REVERT with no return data", .{});
                        return null;
                    },
                    ExecutionError.OutOfGas => {
                        self.logger.err("Execution failed: Out of gas", .{});
                        return InterpreterError.OutOfGas;
                    },
                    ExecutionError.StackUnderflow => {
                        self.logger.err("Execution failed: Stack underflow", .{});
                        return InterpreterError.StackUnderflow;
                    },
                    ExecutionError.StackOverflow => {
                        self.logger.err("Execution failed: Stack overflow", .{});
                        return InterpreterError.StackOverflow;
                    },
                    ExecutionError.InvalidJump => {
                        self.logger.err("Execution failed: Invalid jump destination", .{});
                        return InterpreterError.InvalidJump;
                    },
                    ExecutionError.InvalidOpcode => {
                        self.logger.err("Execution failed: Invalid opcode", .{});
                        return InterpreterError.InvalidOpcode;
                    },
                    ExecutionError.StaticStateChange => {
                        self.logger.err("Execution failed: State change in static call", .{});
                        return InterpreterError.StaticStateChange;
                    },
                    else => {
                        self.logger.err("Execution failed with error: {}", .{err});
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
            self.logger.debug("Updated PC to {d}", .{frame.pc});
        }
        
        self.logger.info("Execution completed successfully", .{});

        // Return successful completion data if any
        if (frame.returnData) |data| {
            self.logger.debug("Returning successful completion data: {d} bytes", .{data.len});
            // Copy return data for the caller to access
            const return_copy = self.allocator.dupe(u8, data) catch return InterpreterError.OutOfGas;
            self.returnData = return_copy;
            return return_copy;
        }
        
        self.logger.debug("Execution completed with no return data", .{});
        return null;
    }
    
    pub fn deinit(self: *Interpreter) void {
        self.logger.debug("Deinitializing interpreter", .{});
        if (self.returnData) |data| {
            self.logger.debug("Freeing return data: {d} bytes", .{data.len});
            self.allocator.free(data);
            self.returnData = null;
        }
    }
};
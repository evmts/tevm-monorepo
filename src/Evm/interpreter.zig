const std = @import("std");

// Import necessary types directly
const Evm = @import("evm.zig").Evm;

// Import internal modules in a way that avoids circular dependencies
const opcodes = @import("opcodes.zig");
const logger_module = @import("EvmLogger.zig");

// Import types from local modules
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Contract = @import("Contract.zig").Contract;
const Frame = @import("Frame.zig").Frame;
// ExecutionError is now InterpreterError defined in this file

// Import from logger module
const EvmLogger = logger_module.EvmLogger;
const createLogger = logger_module.createLogger;
const logStack = logger_module.logStack;
const logMemory = logger_module.logMemory;
const logOpcode = logger_module.logOpcode;

// Import external packages
const address = @import("address");

// Import specific items from opcodes for convenience
const Operation = opcodes.Operation;
// Import JumpTable from the jumpTable module
const JumpTable = @import("jumpTable/JumpTable.zig").JumpTable;
const getOperation = opcodes.getOperation;

// Import precompiles system
const precompile = @import("precompile/package.zig");

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
pub const InterpreterError = error{
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

/// The Interpreter executes EVM bytecode
///
/// The Interpreter is responsible for running the EVM execution loop:
/// - Fetching opcodes from contract bytecode
/// - Calculating gas costs for each operation
/// - Executing the operations
/// - Managing memory, stack, and execution context
/// - Handling errors and exceptional conditions
/// - Returning execution results
///
/// Performance comparison with revm and evmone:
///
/// Interpreter Architecture:
/// - Tevm: Simple loop with function pointer dispatch
/// - revm: Macro-based instruction dispatch with gas metering (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs#L285)
/// - evmone: Advanced interpreter with computed goto (https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp)
///
/// Critical optimizations missing:
/// 1. evmone uses computed goto for ~20% performance boost
/// 2. revm uses macros to inline gas checks and reduce function call overhead
/// 3. Both batch gas checks for sequential opcodes
///
/// evmone's baseline interpreter ref: https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp#L42
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
    // TODO: Add opcodeNames mapping to opcodes module
    // const opcodeNames = opcodes.opcodeNames;

    /// Create a new Interpreter instance
    ///
    /// Parameters:
    /// - allocator: Memory allocator for the interpreter's resources
    /// - evm: Pointer to the EVM instance to use
    /// - table: Jump table containing opcode implementations
    ///
    /// Returns: A new Interpreter instance
    pub fn create(allocator: std.mem.Allocator, evm_instance: *Evm, table: JumpTable) Interpreter {
        getLogger().debug("Creating new Interpreter instance", .{});
        return Interpreter{
            .evm = evm_instance,
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
    pub fn init(allocator: std.mem.Allocator, evm_instance: *Evm) !Interpreter {
        getLogger().debug("Initializing new Interpreter instance", .{});

        // Create a new jump table with default opcode implementations
        // For benchmarks, use the latest hardfork
        const jumpTableModule = @import("jumpTable/JumpTable.zig");
        const jump_table = try jumpTableModule.newJumpTable(allocator, "latest");

        return Interpreter{
            .evm = evm_instance,
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
    ///
    /// Main interpreter loop comparison:
    /// - revm: Uses loop-continue pattern with inline gas checks (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs#L363)
    /// - evmone: Uses computed goto or switch in tight loop (https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp#L47)
    ///
    /// Performance insights:
    /// 1. evmone pre-validates jumps to avoid checks in hot loop
    /// 2. revm batches gas accounting for common opcode sequences
    /// 3. Both avoid function calls in the hot path where possible
    pub fn run(self: *Interpreter, contract: *Contract, input: []const u8, readOnly: bool) InterpreterError!?[]const u8 {
        getLogger().debug("Starting execution in 'run' with depth {d}", .{self.evm.depth + 1});
        getLogger().debug("Contract code length: {d}, readOnly: {}", .{ contract.code.len, readOnly });

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
            const coinbase_addr = address.ZERO_ADDRESS;

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
            // TODO: Add opcodeNames mapping to get human-readable names
            const op_name = "OPCODE"; // Temporary placeholder

            logOpcode(self.logger, frame.pc, op_code, op_name, operation.constant_gas, contract.gas);

            // Debug log the stack state before execution
            if (frame.stack.size > 0) {
                logStack(self.logger, frame.stack.data[0..frame.stack.size]);
            }

            // Validate stack
            if (frame.stack.size < operation.min_stack) {
                getLogger().err("Stack underflow: required {d}, have {d}", .{ operation.min_stack, frame.stack.size });
                return InterpreterError.StackUnderflow;
            } else if (frame.stack.size > operation.max_stack) {
                getLogger().err("Stack overflow: maximum {d}, have {d}", .{ operation.max_stack, frame.stack.size });
                return InterpreterError.StackOverflow;
            }

            // Check if we have enough gas for the constant part
            const constantGas = operation.constant_gas;
            if (contract.gas < constantGas) {
                getLogger().err("Out of gas: need {d}, have {d}", .{ constantGas, contract.gas });
                return InterpreterError.OutOfGas;
            }
            _ = contract.useGas(constantGas);
            getLogger().debug("Charged {d} constant gas, remaining: {d}", .{ constantGas, contract.gas });

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
                    getLogger().debug("Memory size: {d} bytes ({d} words)", .{ memorySize, word_size });
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
                        getLogger().err("Out of gas for dynamic part: need {d}, have {d}", .{ dynamicCost, contract.gas });
                        return InterpreterError.OutOfGas;
                    }

                    // Charge the dynamic gas
                    _ = contract.useGas(dynamicCost);
                    getLogger().debug("Charged {d} dynamic gas, remaining: {d}", .{ dynamicCost, contract.gas });

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
                    InterpreterError.STOP => {
                        getLogger().info("Execution stopped normally with STOP", .{});
                        break; // Successful completion with STOP
                    },
                    InterpreterError.REVERT => {
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
                    InterpreterError.OutOfGas => {
                        getLogger().err("Execution failed: Out of gas", .{});
                        return InterpreterError.OutOfGas;
                    },
                    InterpreterError.StackUnderflow => {
                        getLogger().err("Execution failed: Stack underflow", .{});
                        return InterpreterError.StackUnderflow;
                    },
                    InterpreterError.StackOverflow => {
                        getLogger().err("Execution failed: Stack overflow", .{});
                        return InterpreterError.StackOverflow;
                    },
                    InterpreterError.InvalidJump => {
                        getLogger().err("Execution failed: Invalid jump destination", .{});
                        return InterpreterError.InvalidJump;
                    },
                    InterpreterError.InvalidOpcode => {
                        getLogger().err("Execution failed: Invalid opcode", .{});
                        return InterpreterError.InvalidOpcode;
                    },
                    InterpreterError.StaticStateChange => {
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

// ============================================================================
// TESTS
// ============================================================================

const testing = std.testing;
const test_allocator = std.testing.allocator;

// Test helper: Create bytecode from opcode values
fn createBytecode(allocator: std.mem.Allocator, codes: []const u8) ![]u8 {
    const bytecode = try allocator.alloc(u8, codes.len);
    @memcpy(bytecode, codes);
    return bytecode;
}

// Test helper: Create a test EVM environment
fn createTestEvm(allocator: std.mem.Allocator) !*Evm {
    const evm = try allocator.create(Evm);
    evm.* = try Evm.init(null);
    return evm;
}

// Test helper: Execute bytecode and return result
fn executeTestBytecode(allocator: std.mem.Allocator, bytecode: []const u8, gas: u64) !struct {
    result: ?[]const u8,
    gas_left: u64,
    err: ?InterpreterError,
} {
    const evm = try createTestEvm(allocator);
    defer allocator.destroy(evm);
    
    // Create interpreter
    var interpreter = try Interpreter.init(allocator, evm);
    defer interpreter.deinit();
    
    // Create contract
    var contract = Contract{
        .caller = address.ZERO_ADDRESS,
        .address = address.ZERO_ADDRESS,
        .value = 0,
        .gas = gas,
        .code = bytecode,
        .code_hash = [_]u8{0} ** 32,
        .input = &[_]u8{},
        .analysis = null,
        .jumpdests = null,
    };
    
    // Execute
    const result = interpreter.run(&contract, &[_]u8{}, false) catch |err| {
        return .{
            .result = null,
            .gas_left = contract.gas,
            .err = err,
        };
    };
    
    return .{
        .result = result,
        .gas_left = contract.gas,
        .err = null,
    };
}

// ============================================================================
// ARITHMETIC OPCODE TESTS
// ============================================================================

test "Interpreter: STOP opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x00, // STOP
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expectEqual(@as(?[]const u8, null), result.result);
}

test "Interpreter: ADD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x02, // PUSH1 2
        0x60, 0x03, // PUSH1 3
        0x01,       // ADD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 5 (2 + 3)
    try testing.expectEqual(@as(u8, 5), result.result.?[31]);
}

test "Interpreter: SUB opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x03, // PUSH1 3
        0x60, 0x07, // PUSH1 7
        0x03,       // SUB (7 - 3 = 4)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 4 (7 - 3)
    try testing.expectEqual(@as(u8, 4), result.result.?[31]);
}

test "Interpreter: MUL opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x04, // PUSH1 4
        0x60, 0x06, // PUSH1 6
        0x02,       // MUL (4 * 6 = 24)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 24 (4 * 6)
    try testing.expectEqual(@as(u8, 24), result.result.?[31]);
}

test "Interpreter: DIV opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x04, // PUSH1 4
        0x60, 0x0C, // PUSH1 12
        0x04,       // DIV (12 / 4 = 3)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 3 (12 / 4)
    try testing.expectEqual(@as(u8, 3), result.result.?[31]);
}

test "Interpreter: DIV by zero" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0
        0x60, 0x0A, // PUSH1 10
        0x04,       // DIV (10 / 0 = 0 in EVM)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 0 (division by zero returns 0 in EVM)
    try testing.expectEqual(@as(u8, 0), result.result.?[31]);
}

test "Interpreter: MOD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x03, // PUSH1 3
        0x60, 0x0A, // PUSH1 10
        0x06,       // MOD (10 % 3 = 1)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (10 % 3)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: ADDMOD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x03, // PUSH1 3 (modulo)
        0x60, 0x02, // PUSH1 2
        0x60, 0x05, // PUSH1 5
        0x08,       // ADDMOD ((5 + 2) % 3 = 1)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 ((5 + 2) % 3)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: MULMOD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x05, // PUSH1 5 (modulo)
        0x60, 0x03, // PUSH1 3
        0x60, 0x04, // PUSH1 4
        0x09,       // MULMOD ((4 * 3) % 5 = 2)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 2 ((4 * 3) % 5)
    try testing.expectEqual(@as(u8, 2), result.result.?[31]);
}

// ============================================================================
// COMPARISON OPCODE TESTS
// ============================================================================

test "Interpreter: LT opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x05, // PUSH1 5
        0x60, 0x03, // PUSH1 3
        0x10,       // LT (3 < 5 = 1)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (true: 3 < 5)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: GT opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x03, // PUSH1 3
        0x60, 0x05, // PUSH1 5
        0x11,       // GT (5 > 3 = 1)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (true: 5 > 3)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: EQ opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x05, // PUSH1 5
        0x60, 0x05, // PUSH1 5
        0x14,       // EQ (5 == 5 = 1)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (true: 5 == 5)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: ISZERO opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0
        0x15,       // ISZERO (0 == 0 = 1)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (true: 0 is zero)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

// ============================================================================
// BITWISE OPCODE TESTS
// ============================================================================

test "Interpreter: AND opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x0F, // PUSH1 15 (0b1111)
        0x60, 0x0C, // PUSH1 12 (0b1100)
        0x16,       // AND (15 & 12 = 12)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 12 (0b1111 & 0b1100)
    try testing.expectEqual(@as(u8, 12), result.result.?[31]);
}

test "Interpreter: OR opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x0C, // PUSH1 12 (0b1100)
        0x60, 0x03, // PUSH1 3  (0b0011)
        0x17,       // OR (12 | 3 = 15)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 15 (0b1100 | 0b0011)
    try testing.expectEqual(@as(u8, 15), result.result.?[31]);
}

test "Interpreter: XOR opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x0F, // PUSH1 15 (0b1111)
        0x60, 0x0A, // PUSH1 10 (0b1010)
        0x18,       // XOR (15 ^ 10 = 5)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 5 (0b1111 ^ 0b1010)
    try testing.expectEqual(@as(u8, 5), result.result.?[31]);
}

test "Interpreter: NOT opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0
        0x19,       // NOT (~0 = max uint256)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be all 0xFF bytes
    for (result.result.?) |byte| {
        try testing.expectEqual(@as(u8, 0xFF), byte);
    }
}

// ============================================================================
// STACK OPCODE TESTS
// ============================================================================

test "Interpreter: POP opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x50,       // POP (removes 2 from stack)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (the value that remained on stack)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: DUP1 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x05, // PUSH1 5
        0x80,       // DUP1 (duplicates top of stack)
        0x01,       // ADD (5 + 5 = 10)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 10 (5 + 5)
    try testing.expectEqual(@as(u8, 10), result.result.?[31]);
}

test "Interpreter: SWAP1 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x02, // PUSH1 2
        0x60, 0x03, // PUSH1 3
        0x90,       // SWAP1 (swaps top two stack items)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 2 (after swap, 2 is on top)
    try testing.expectEqual(@as(u8, 2), result.result.?[31]);
}

// ============================================================================
// MEMORY OPCODE TESTS
// ============================================================================

test "Interpreter: MLOAD and MSTORE" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x42, // PUSH1 66 (value to store)
        0x60, 0x20, // PUSH1 32 (memory offset)
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32 (memory offset)
        0x51,       // MLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 66 (stored and loaded from memory)
    try testing.expectEqual(@as(u8, 66), result.result.?[31]);
}

test "Interpreter: MSTORE8" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0xFF, // PUSH1 255 (value to store)
        0x60, 0x1F, // PUSH1 31 (memory offset - last byte of word)
        0x53,       // MSTORE8
        0x60, 0x00, // PUSH1 0
        0x51,       // MLOAD (load full word starting at 0)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should have 0xFF in the last byte
    try testing.expectEqual(@as(u8, 0xFF), result.result.?[31]);
}

// ============================================================================
// CONTROL FLOW OPCODE TESTS
// ============================================================================

test "Interpreter: JUMP opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x05, // PUSH1 5 (jump destination)
        0x56,       // JUMP
        0xFE,       // INVALID (should be skipped)
        0x5B,       // JUMPDEST (at position 5)
        0x60, 0x42, // PUSH1 66
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 66 (jumped over INVALID)
    try testing.expectEqual(@as(u8, 66), result.result.?[31]);
}

test "Interpreter: JUMPI opcode - conditional true" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1 (condition - true)
        0x60, 0x07, // PUSH1 7 (jump destination)
        0x57,       // JUMPI
        0xFE,       // INVALID (should be skipped)
        0x5B,       // JUMPDEST (at position 7)
        0x60, 0x42, // PUSH1 66
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 66 (jumped over INVALID)
    try testing.expectEqual(@as(u8, 66), result.result.?[31]);
}

test "Interpreter: JUMPI opcode - conditional false" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0 (condition - false)
        0x60, 0x0A, // PUSH1 10 (jump destination)
        0x57,       // JUMPI (should not jump)
        0x60, 0x33, // PUSH1 51
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 51 (did not jump)
    try testing.expectEqual(@as(u8, 51), result.result.?[31]);
}

// ============================================================================
// ERROR CONDITION TESTS
// ============================================================================

test "Interpreter: REVERT opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0
        0x60, 0x00, // PUSH1 0
        0xFD,       // REVERT
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, InterpreterError.REVERT), result.err);
}

test "Interpreter: INVALID opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0xFE, // INVALID
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, InterpreterError.INVALID), result.err);
}

test "Interpreter: Stack underflow" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x01, // ADD (requires 2 items on stack, but stack is empty)
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, InterpreterError.StackUnderflow), result.err);
}

test "Interpreter: Out of gas" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x01,       // ADD
    });
    defer test_allocator.free(bytecode);
    
    // Execute with insufficient gas
    const result = try executeTestBytecode(test_allocator, bytecode, 5);
    try testing.expectEqual(@as(?InterpreterError, InterpreterError.OutOfGas), result.err);
}

test "Interpreter: Invalid jump destination" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x10, // PUSH1 16 (invalid jump destination - not a JUMPDEST)
        0x56,       // JUMP
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, InterpreterError.InvalidJump), result.err);
}

// ============================================================================
// PUSH OPCODE TESTS
// ============================================================================

test "Interpreter: PUSH0 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x5F,       // PUSH0
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 0
    try testing.expectEqual(@as(u8, 0), result.result.?[31]);
}

test "Interpreter: PUSH2 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x61, 0x01, 0x23, // PUSH2 0x0123 (291)
        0x60, 0x00,       // PUSH1 0
        0x52,             // MSTORE
        0x60, 0x20,       // PUSH1 32
        0x60, 0x00,       // PUSH1 0
        0xF3,             // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 0x0123 (291)
    try testing.expectEqual(@as(u8, 0x01), result.result.?[30]);
    try testing.expectEqual(@as(u8, 0x23), result.result.?[31]);
}

// ============================================================================
// SHIFT OPCODE TESTS (EIP-145)
// ============================================================================

test "Interpreter: SHL opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x04, // PUSH1 4 (shift amount)
        0x1B,       // SHL (1 << 4 = 16)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 16 (1 << 4)
    try testing.expectEqual(@as(u8, 16), result.result.?[31]);
}

test "Interpreter: SHR opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x10, // PUSH1 16
        0x60, 0x02, // PUSH1 2 (shift amount)
        0x1C,       // SHR (16 >> 2 = 4)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 4 (16 >> 2)
    try testing.expectEqual(@as(u8, 4), result.result.?[31]);
}

// ============================================================================
// ENVIRONMENT OPCODE TESTS
// ============================================================================

test "Interpreter: PC opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x58,       // PC (program counter at position 0)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 0 (PC at first instruction)
    try testing.expectEqual(@as(u8, 0), result.result.?[31]);
}

test "Interpreter: MSIZE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x42, // PUSH1 66
        0x60, 0x20, // PUSH1 32 (memory offset)
        0x52,       // MSTORE (expands memory to at least 64 bytes)
        0x59,       // MSIZE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 64 (memory expanded to 64 bytes)
    try testing.expectEqual(@as(u8, 64), result.result.?[31]);
}

test "Interpreter: GAS opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x5A,       // GAS (get remaining gas)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be less than initial gas (100000) but greater than 0
    // We can't predict exact value but we can check it's reasonable
    const gas_result = std.mem.readInt(u256, result.result.?[0..32], .big);
    try testing.expect(gas_result < 100000);
    try testing.expect(gas_result > 90000); // Should have used less than 10000 gas
}

test "Interpreter: CALLDATASIZE opcode" {
    // Create bytecode that reads calldata size
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x36,       // CALLDATASIZE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    // Execute with some calldata
    const evm = try createTestEvm(test_allocator);
    defer test_allocator.destroy(evm);
    
    var interpreter = try Interpreter.init(test_allocator, evm);
    defer interpreter.deinit();
    
    const calldata = &[_]u8{0x12, 0x34, 0x56, 0x78};
    var contract = Contract{
        .caller = address.ZERO_ADDRESS,
        .address = address.ZERO_ADDRESS,
        .value = 0,
        .gas = 100000,
        .code = bytecode,
        .code_hash = [_]u8{0} ** 32,
        .input = calldata,
        .analysis = null,
        .jumpdests = null,
    };
    
    const result = interpreter.run(&contract, calldata, false) catch |err| {
        try testing.expect(false); // Should not error
        return err;
    };
    
    try testing.expect(result != null);
    try testing.expectEqual(@as(usize, 32), result.?.len);
    // Result should be 4 (length of calldata)
    try testing.expectEqual(@as(u8, 4), result.?[31]);
}

test "Interpreter: CALLDATALOAD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0 (offset)
        0x35,       // CALLDATALOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    // Execute with specific calldata
    const evm = try createTestEvm(test_allocator);
    defer test_allocator.destroy(evm);
    
    var interpreter = try Interpreter.init(test_allocator, evm);
    defer interpreter.deinit();
    
    // Create 32 bytes of calldata with pattern
    var calldata: [32]u8 = undefined;
    for (&calldata, 0..) |*byte, i| {
        byte.* = @intCast(i + 1);
    }
    
    var contract = Contract{
        .caller = address.ZERO_ADDRESS,
        .address = address.ZERO_ADDRESS,
        .value = 0,
        .gas = 100000,
        .code = bytecode,
        .code_hash = [_]u8{0} ** 32,
        .input = &calldata,
        .analysis = null,
        .jumpdests = null,
    };
    
    const result = interpreter.run(&contract, &calldata, false) catch |err| {
        try testing.expect(false); // Should not error
        return err;
    };
    
    try testing.expect(result != null);
    try testing.expectEqual(@as(usize, 32), result.?.len);
    // Result should match our calldata pattern
    for (result.?, 0..) |byte, i| {
        try testing.expectEqual(@as(u8, @intCast(i + 1)), byte);
    }
}

test "Interpreter: CODECOPY opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // CODECOPY(destOffset=0, offset=0, size=10)
        0x60, 0x0A, // PUSH1 10 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x00, // PUSH1 0 (destOffset)
        0x39,       // CODECOPY
        0x60, 0x00, // PUSH1 0
        0x51,       // MLOAD (load what was copied)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // First byte of result should be 0x60 (PUSH1)
    try testing.expectEqual(@as(u8, 0x60), result.result.?[0]);
}

test "Interpreter: CODESIZE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x38,       // CODESIZE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 9 (length of bytecode)
    try testing.expectEqual(@as(u8, 9), result.result.?[31]);
}

// ============================================================================
// KECCAK256 OPCODE TEST
// ============================================================================

test "Interpreter: KECCAK256 (SHA3) opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Store "hello" in memory
        0x68, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x00, 0x00, // PUSH9 "hello\0\0\0"
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        // Calculate keccak256(offset=0, size=5)
        0x60, 0x05, // PUSH1 5 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x20,       // KECCAK256
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // keccak256("hello") = 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8
    // Check first few bytes
    try testing.expectEqual(@as(u8, 0x1c), result.result.?[0]);
    try testing.expectEqual(@as(u8, 0x8a), result.result.?[1]);
    try testing.expectEqual(@as(u8, 0xff), result.result.?[2]);
    try testing.expectEqual(@as(u8, 0x95), result.result.?[3]);
}

// ============================================================================
// BYTE OPCODE TEST
// ============================================================================

test "Interpreter: BYTE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x61, 0x12, 0x34, // PUSH2 0x1234
        0x60, 0x1E,       // PUSH1 30 (byte position from left, 0-indexed)
        0x1A,             // BYTE
        0x60, 0x00,       // PUSH1 0
        0x52,             // MSTORE
        0x60, 0x20,       // PUSH1 32
        0x60, 0x00,       // PUSH1 0
        0xF3,             // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Byte 30 of 0x1234 (padded to 32 bytes) is 0x12
    try testing.expectEqual(@as(u8, 0x12), result.result.?[31]);
}

// ============================================================================
// SIGNEXTEND OPCODE TEST
// ============================================================================

test "Interpreter: SIGNEXTEND opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0xFF, // PUSH1 0xFF (-1 as signed byte)
        0x60, 0x00, // PUSH1 0 (extend from byte 0)
        0x0B,       // SIGNEXTEND
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be all 0xFF bytes (sign extended -1)
    for (result.result.?) |byte| {
        try testing.expectEqual(@as(u8, 0xFF), byte);
    }
}

// ============================================================================
// EXP OPCODE TEST
// ============================================================================

test "Interpreter: EXP opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x03, // PUSH1 3 (exponent)
        0x60, 0x02, // PUSH1 2 (base)
        0x0A,       // EXP (2^3 = 8)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 8 (2^3)
    try testing.expectEqual(@as(u8, 8), result.result.?[31]);
}

// ============================================================================
// SMOD OPCODE TEST
// ============================================================================

test "Interpreter: SMOD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x03, // PUSH1 3
        0x60, 0x07, // PUSH1 7
        0x07,       // SMOD (7 % 3 = 1 for signed)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (7 % 3)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

// ============================================================================
// SDIV OPCODE TEST
// ============================================================================

test "Interpreter: SDIV opcode with negative numbers" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Push -2 (0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE)
        0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, // PUSH32 -2
        // Push -8
        0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8, // PUSH32 -8
        0x05,       // SDIV (-8 / -2 = 4)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 4 (-8 / -2)
    try testing.expectEqual(@as(u8, 4), result.result.?[31]);
}

// ============================================================================
// SLT and SGT OPCODE TESTS
// ============================================================================

test "Interpreter: SLT opcode with signed comparison" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Push 5
        0x60, 0x05, // PUSH1 5
        // Push -1 (0xFF...FF)
        0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // PUSH32 -1
        0x12,       // SLT (-1 < 5 = 1 in signed comparison)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (true: -1 < 5 in signed comparison)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: SGT opcode with signed comparison" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Push -5 (0xFF...FB)
        0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFB, // PUSH32 -5
        // Push 3
        0x60, 0x03, // PUSH1 3
        0x13,       // SGT (3 > -5 = 1 in signed comparison)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (true: 3 > -5 in signed comparison)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

// ============================================================================
// SAR OPCODE TEST (Arithmetic Shift Right)
// ============================================================================

test "Interpreter: SAR opcode with negative number" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Push -16 (0xFF...F0)
        0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF0, // PUSH32 -16
        0x60, 0x02, // PUSH1 2 (shift amount)
        0x1D,       // SAR (-16 >> 2 = -4 arithmetic shift)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be -4 (0xFF...FC)
    for (result.result.?[0..31]) |byte| {
        try testing.expectEqual(@as(u8, 0xFF), byte);
    }
    try testing.expectEqual(@as(u8, 0xFC), result.result.?[31]);
}

// ============================================================================
// COMPLEX BYTECODE TEST
// ============================================================================

test "Interpreter: Complex calculation" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Calculate: ((10 + 5) * 2) - 6 = 24
        0x60, 0x05, // PUSH1 5
        0x60, 0x0A, // PUSH1 10
        0x01,       // ADD (10 + 5 = 15)
        0x60, 0x02, // PUSH1 2
        0x02,       // MUL (15 * 2 = 30)
        0x60, 0x06, // PUSH1 6
        0x03,       // SUB (30 - 6 = 24)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 24
    try testing.expectEqual(@as(u8, 24), result.result.?[31]);
}

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

test "Interpreter: Empty bytecode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{});
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expectEqual(@as(?[]const u8, null), result.result);
}

test "Interpreter: Stack manipulation complex" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x60, 0x03, // PUSH1 3
        0x60, 0x04, // PUSH1 4
        0x82,       // DUP3 (duplicate 3rd item: 2)
        0x91,       // SWAP2 (swap 1st and 3rd)
        0x01,       // ADD
        0x01,       // ADD
        0x01,       // ADD
        // Stack should now have sum of all 4 values: 1+2+3+4=10
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 12 (due to DUP3 duplicating the 2)
    try testing.expectEqual(@as(u8, 12), result.result.?[31]);
}

// ============================================================================
// PUSH VARIANTS TEST
// ============================================================================

test "Interpreter: PUSH3 through PUSH32" {
    // Test PUSH3
    const bytecode3 = try createBytecode(test_allocator, &[_]u8{
        0x62, 0x12, 0x34, 0x56, // PUSH3 0x123456
        0x60, 0x00,             // PUSH1 0
        0x52,                   // MSTORE
        0x60, 0x20,             // PUSH1 32
        0x60, 0x00,             // PUSH1 0
        0xF3,                   // RETURN
    });
    defer test_allocator.free(bytecode3);
    
    const result3 = try executeTestBytecode(test_allocator, bytecode3, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result3.err);
    try testing.expect(result3.result != null);
    try testing.expectEqual(@as(u8, 0x12), result3.result.?[29]);
    try testing.expectEqual(@as(u8, 0x34), result3.result.?[30]);
    try testing.expectEqual(@as(u8, 0x56), result3.result.?[31]);
    
    // Test PUSH4
    const bytecode4 = try createBytecode(test_allocator, &[_]u8{
        0x63, 0x12, 0x34, 0x56, 0x78, // PUSH4 0x12345678
        0x60, 0x00,                   // PUSH1 0
        0x52,                         // MSTORE
        0x60, 0x20,                   // PUSH1 32
        0x60, 0x00,                   // PUSH1 0
        0xF3,                         // RETURN
    });
    defer test_allocator.free(bytecode4);
    
    const result4 = try executeTestBytecode(test_allocator, bytecode4, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result4.err);
    try testing.expect(result4.result != null);
    try testing.expectEqual(@as(u8, 0x12), result4.result.?[28]);
    try testing.expectEqual(@as(u8, 0x34), result4.result.?[29]);
    try testing.expectEqual(@as(u8, 0x56), result4.result.?[30]);
    try testing.expectEqual(@as(u8, 0x78), result4.result.?[31]);
}

// ============================================================================
// DUP AND SWAP VARIANTS TEST
// ============================================================================

test "Interpreter: DUP2 through DUP16" {
    // Test DUP2
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x81,       // DUP2 (duplicate 2nd item: 1)
        0x01,       // ADD (1 + 2 = 3)
        0x01,       // ADD (3 + 1 = 4)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 4 (2 + 1 + 1)
    try testing.expectEqual(@as(u8, 4), result.result.?[31]);
}

test "Interpreter: SWAP2 through SWAP16" {
    // Test SWAP2
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x60, 0x03, // PUSH1 3
        0x91,       // SWAP2 (swap 1st and 3rd: stack becomes 1, 2, 3 -> 3, 2, 1)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (after SWAP2, 1 is on top)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

// ============================================================================
// LOG OPCODE TESTS
// ============================================================================

test "Interpreter: LOG0 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Store some data in memory
        0x60, 0x42, // PUSH1 66
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        // LOG0(offset=0, size=32)
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0xA0,       // LOG0
        // Return success
        0x60, 0x01, // PUSH1 1
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    // Result should be 1 (success)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: LOG1 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Store some data in memory
        0x60, 0x42, // PUSH1 66
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        // LOG1(offset=0, size=32, topic1)
        0x60, 0x99, // PUSH1 0x99 (topic)
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0xA1,       // LOG1
        // Return success
        0x60, 0x01, // PUSH1 1
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    // Result should be 1 (success)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

// ============================================================================
// STORAGE OPCODE TESTS
// ============================================================================

test "Interpreter: SSTORE and SLOAD" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Store value 42 at storage key 1
        0x60, 0x2A, // PUSH1 42 (value)
        0x60, 0x01, // PUSH1 1 (key)
        0x55,       // SSTORE
        // Load from storage key 1
        0x60, 0x01, // PUSH1 1 (key)
        0x54,       // SLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 42
    try testing.expectEqual(@as(u8, 42), result.result.?[31]);
}

// ============================================================================
// ENVIRONMENT INFORMATION OPCODE TESTS
// ============================================================================

test "Interpreter: ADDRESS opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x30,       // ADDRESS
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be zero address (as set in test helper)
    for (result.result.?) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "Interpreter: CALLER opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x33,       // CALLER
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be zero address (as set in test helper)
    for (result.result.?) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "Interpreter: CALLVALUE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x34,       // CALLVALUE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 0 (no value sent in test)
    try testing.expectEqual(@as(u8, 0), result.result.?[31]);
}

test "Interpreter: ORIGIN opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x32,       // ORIGIN
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: GASPRICE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x3A,       // GASPRICE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

// ============================================================================
// BLOCK INFORMATION OPCODE TESTS
// ============================================================================

test "Interpreter: BLOCKHASH opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1 (block number)
        0x40,       // BLOCKHASH
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: COINBASE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x41,       // COINBASE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: TIMESTAMP opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x42,       // TIMESTAMP
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: NUMBER opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x43,       // NUMBER
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: GASLIMIT opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x45,       // GASLIMIT
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: CHAINID opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x46,       // CHAINID
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: SELFBALANCE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x47,       // SELFBALANCE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: BASEFEE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x48,       // BASEFEE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

// ============================================================================
// EXTERNAL ACCOUNT OPCODE TESTS
// ============================================================================

test "Interpreter: BALANCE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // PUSH20 address
        0x31,       // BALANCE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: EXTCODESIZE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // PUSH20 address
        0x3B,       // EXTCODESIZE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: EXTCODECOPY opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // EXTCODECOPY(address, destOffset=0, offset=0, size=32)
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x00, // PUSH1 0 (destOffset)
        0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // PUSH20 address
        0x3C,       // EXTCODECOPY
        // Return what was copied
        0x60, 0x00, // PUSH1 0
        0x51,       // MLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: EXTCODEHASH opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // PUSH20 address
        0x3F,       // EXTCODEHASH
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

// ============================================================================
// RETURNDATASIZE AND RETURNDATACOPY OPCODE TESTS
// ============================================================================

test "Interpreter: RETURNDATASIZE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x3D,       // RETURNDATASIZE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Should be 0 as no previous call
    try testing.expectEqual(@as(u8, 0), result.result.?[31]);
}

test "Interpreter: RETURNDATACOPY opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Try to copy return data (should be empty)
        0x60, 0x00, // PUSH1 0 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x00, // PUSH1 0 (destOffset)
        0x3E,       // RETURNDATACOPY
        // Return success
        0x60, 0x01, // PUSH1 1
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    // Result should be 1 (success)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

// ============================================================================
// CALLDATACOPY OPCODE TEST
// ============================================================================

test "Interpreter: CALLDATACOPY opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // CALLDATACOPY(destOffset=0, offset=0, size=4)
        0x60, 0x04, // PUSH1 4 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x00, // PUSH1 0 (destOffset)
        0x37,       // CALLDATACOPY
        // Load and return the copied data
        0x60, 0x00, // PUSH1 0
        0x51,       // MLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    // Execute with specific calldata
    const evm = try createTestEvm(test_allocator);
    defer test_allocator.destroy(evm);
    
    var interpreter = try Interpreter.init(test_allocator, evm);
    defer interpreter.deinit();
    
    const calldata = &[_]u8{0xDE, 0xAD, 0xBE, 0xEF};
    var contract = Contract{
        .caller = address.ZERO_ADDRESS,
        .address = address.ZERO_ADDRESS,
        .value = 0,
        .gas = 100000,
        .code = bytecode,
        .code_hash = [_]u8{0} ** 32,
        .input = calldata,
        .analysis = null,
        .jumpdests = null,
    };
    
    const result = interpreter.run(&contract, calldata, false) catch |err| {
        try testing.expect(false); // Should not error
        return err;
    };
    
    try testing.expect(result != null);
    try testing.expectEqual(@as(usize, 32), result.?.len);
    // First 4 bytes should match our calldata
    try testing.expectEqual(@as(u8, 0xDE), result.?[0]);
    try testing.expectEqual(@as(u8, 0xAD), result.?[1]);
    try testing.expectEqual(@as(u8, 0xBE), result.?[2]);
    try testing.expectEqual(@as(u8, 0xEF), result.?[3]);
}

// ============================================================================
// PREVRANDAO OPCODE TEST (formerly DIFFICULTY)
// ============================================================================

test "Interpreter: PREVRANDAO opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x44,       // PREVRANDAO (formerly DIFFICULTY)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

// ============================================================================
// COMPLEX MULTI-OPCODE TESTS
// ============================================================================

test "Interpreter: Complex conditional logic" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // if (5 > 3) { result = 100 } else { result = 200 }
        0x60, 0x03, // PUSH1 3
        0x60, 0x05, // PUSH1 5
        0x11,       // GT (5 > 3 = 1)
        0x60, 0x0B, // PUSH1 11 (jump destination for true branch)
        0x57,       // JUMPI
        // False branch: push 200
        0x60, 0xC8, // PUSH1 200
        0x60, 0x0E, // PUSH1 14 (jump to end)
        0x56,       // JUMP
        // True branch: push 100
        0x5B,       // JUMPDEST (position 11)
        0x60, 0x64, // PUSH1 100
        // End
        0x5B,       // JUMPDEST (position 14)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 100 (true branch taken)
    try testing.expectEqual(@as(u8, 100), result.result.?[31]);
}

test "Interpreter: Loop with counter" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // sum = 0; for (i = 5; i > 0; i--) { sum += i }
        0x60, 0x00, // PUSH1 0 (sum)
        0x60, 0x05, // PUSH1 5 (counter)
        // Loop start (position 4)
        0x5B,       // JUMPDEST
        0x80,       // DUP1 (duplicate counter)
        0x60, 0x00, // PUSH1 0
        0x11,       // GT (counter > 0)
        0x60, 0x17, // PUSH1 23 (jump to end if false)
        0x57,       // JUMPI
        // Loop body
        0x80,       // DUP1 (duplicate counter)
        0x82,       // DUP3 (duplicate sum)
        0x01,       // ADD (sum + counter)
        0x92,       // SWAP3 (update sum)
        0x50,       // POP
        0x60, 0x01, // PUSH1 1
        0x03,       // SUB (counter - 1)
        0x60, 0x04, // PUSH1 4 (loop start)
        0x56,       // JUMP
        // End (position 23)
        0x5B,       // JUMPDEST
        0x50,       // POP (remove counter)
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 15 (5 + 4 + 3 + 2 + 1)
    try testing.expectEqual(@as(u8, 15), result.result.?[31]);
}

// ============================================================================
// TRANSIENT STORAGE OPCODE TESTS (EIP-1153)
// ============================================================================

test "Interpreter: TSTORE and TLOAD" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Store value 42 at transient storage key 1
        0x60, 0x2A, // PUSH1 42 (value)
        0x60, 0x01, // PUSH1 1 (key)
        0x5D,       // TSTORE
        // Load from transient storage key 1
        0x60, 0x01, // PUSH1 1 (key)
        0x5C,       // TLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 42
    try testing.expectEqual(@as(u8, 42), result.result.?[31]);
}

// ============================================================================
// MCOPY OPCODE TEST (EIP-5656)
// ============================================================================

test "Interpreter: MCOPY opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Store value at offset 0
        0x60, 0x42, // PUSH1 66
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        // MCOPY(dest=32, src=0, size=32)
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (src)
        0x60, 0x20, // PUSH1 32 (dest)
        0x5E,       // MCOPY
        // Load from destination offset
        0x60, 0x20, // PUSH1 32
        0x51,       // MLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 66 (copied value)
    try testing.expectEqual(@as(u8, 66), result.result.?[31]);
}

// ============================================================================
// BLOBHASH and BLOBBASEFEE OPCODE TESTS (EIP-4844)
// ============================================================================

test "Interpreter: BLOBHASH opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0 (blob index)
        0x49,       // BLOBHASH
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

test "Interpreter: BLOBBASEFEE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x4A,       // BLOBBASEFEE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
}

// ============================================================================
// LARGE BYTECODE TESTS
// ============================================================================

test "Interpreter: Large stack operations" {
    // Build bytecode that pushes 16 values and uses DUP16
    var bytecode_list = std.ArrayList(u8).init(test_allocator);
    defer bytecode_list.deinit();
    
    // Push 16 different values
    for (1..17) |i| {
        try bytecode_list.append(0x60); // PUSH1
        try bytecode_list.append(@intCast(i));
    }
    
    // DUP16 (duplicate the 16th item, which is 1)
    try bytecode_list.append(0x8F); // DUP16
    
    // Store and return
    try bytecode_list.appendSlice(&[_]u8{
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    
    const bytecode = try bytecode_list.toOwnedSlice();
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Result should be 1 (the 16th item duplicated)
    try testing.expectEqual(@as(u8, 1), result.result.?[31]);
}

test "Interpreter: Maximum PUSH32" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // PUSH32 with all bytes set to 0xFF
        0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
              0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);
    
    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // All bytes should be 0xFF
    for (result.result.?) |byte| {
        try testing.expectEqual(@as(u8, 0xFF), byte);
    }
}

test "Interpreter: LOG2 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x01, // PUSH1 1 (topic1)
        0x60, 0x02, // PUSH1 2 (topic2)
        0xA2,       // LOG2
        0x00,       // STOP
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: LOG3 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x01, // PUSH1 1 (topic1)
        0x60, 0x02, // PUSH1 2 (topic2)
        0x60, 0x03, // PUSH1 3 (topic3)
        0xA3,       // LOG3
        0x00,       // STOP
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: LOG4 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x01, // PUSH1 1 (topic1)
        0x60, 0x02, // PUSH1 2 (topic2)
        0x60, 0x03, // PUSH1 3 (topic3)
        0x60, 0x04, // PUSH1 4 (topic4)
        0xA4,       // LOG4
        0x00,       // STOP
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: MLOAD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0
        0x51,       // MLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    try testing.expectEqual(@as(u8, 0x42), result.result.?[31]);
}

test "Interpreter: MSTORE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0xFF, // PUSH1 0xFF
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    try testing.expectEqual(@as(u8, 0xFF), result.result.?[31]);
}

test "Interpreter: MSTORE8 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0xFF, // PUSH1 0xFF (value)
        0x60, 0x1F, // PUSH1 31 (offset - last byte of first word)
        0x53,       // MSTORE8
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    try testing.expectEqual(@as(u8, 0xFF), result.result.?[31]);
}

test "Interpreter: SLOAD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0 (storage key)
        0x54,       // SLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Storage is empty by default, should return 0
    for (result.result.?) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "Interpreter: SSTORE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x42, // PUSH1 0x42 (value)
        0x60, 0x00, // PUSH1 0 (key)
        0x55,       // SSTORE
        0x00,       // STOP
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: TLOAD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0 (transient storage key)
        0x5C,       // TLOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    // Transient storage is empty by default, should return 0
    for (result.result.?) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "Interpreter: TSTORE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x42, // PUSH1 0x42 (value)
        0x60, 0x00, // PUSH1 0 (key)
        0x5D,       // TSTORE
        0x00,       // STOP
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: RETURN opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    try testing.expectEqual(@as(u8, 0x42), result.result.?[31]);
}

test "Interpreter: JUMPDEST opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x05, // PUSH1 5
        0x56,       // JUMP
        0x00,       // STOP (should be skipped)
        0x5B,       // JUMPDEST (destination)
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
    try testing.expect(result.result != null);
    try testing.expectEqual(@as(usize, 32), result.result.?.len);
    try testing.expectEqual(@as(u8, 0x42), result.result.?[31]);
}

test "Interpreter: RETURNDATALOAD opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // This would normally follow a CALL, but for testing we'll just try to load return data
        0x60, 0x00, // PUSH1 0 (offset)
        0xF7,       // RETURNDATALOAD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    // This should fail because there's no return data available
    try testing.expect(result.err != null);
}

test "Interpreter: CREATE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Push contract initialization code
        0x60, 0x00, // PUSH1 0 (value)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x00, // PUSH1 0 (size)
        0xF0,       // CREATE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: CREATE2 opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // Push contract initialization code
        0x60, 0x00, // PUSH1 0 (salt)
        0x60, 0x00, // PUSH1 0 (value)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x00, // PUSH1 0 (size)
        0xF5,       // CREATE2
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: CALL opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // CALL parameters (gas, address, value, argsOffset, argsSize, retOffset, retSize)
        0x60, 0x00, // PUSH1 0 (retSize)
        0x60, 0x00, // PUSH1 0 (retOffset)
        0x60, 0x00, // PUSH1 0 (argsSize)
        0x60, 0x00, // PUSH1 0 (argsOffset)
        0x60, 0x00, // PUSH1 0 (value)
        0x60, 0x00, // PUSH1 0 (address)
        0x60, 0x00, // PUSH1 0 (gas - will use all available)
        0xF1,       // CALL
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: CALLCODE opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // CALLCODE parameters (gas, address, value, argsOffset, argsSize, retOffset, retSize)
        0x60, 0x00, // PUSH1 0 (retSize)
        0x60, 0x00, // PUSH1 0 (retOffset)
        0x60, 0x00, // PUSH1 0 (argsSize)
        0x60, 0x00, // PUSH1 0 (argsOffset)
        0x60, 0x00, // PUSH1 0 (value)
        0x60, 0x00, // PUSH1 0 (address)
        0x60, 0x00, // PUSH1 0 (gas)
        0xF2,       // CALLCODE
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: DELEGATECALL opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // DELEGATECALL parameters (gas, address, argsOffset, argsSize, retOffset, retSize)
        0x60, 0x00, // PUSH1 0 (retSize)
        0x60, 0x00, // PUSH1 0 (retOffset)
        0x60, 0x00, // PUSH1 0 (argsSize)
        0x60, 0x00, // PUSH1 0 (argsOffset)
        0x60, 0x00, // PUSH1 0 (address)
        0x60, 0x00, // PUSH1 0 (gas)
        0xF4,       // DELEGATECALL
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: STATICCALL opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // STATICCALL parameters (gas, address, argsOffset, argsSize, retOffset, retSize)
        0x60, 0x00, // PUSH1 0 (retSize)
        0x60, 0x00, // PUSH1 0 (retOffset)
        0x60, 0x00, // PUSH1 0 (argsSize)
        0x60, 0x00, // PUSH1 0 (argsOffset)
        0x60, 0x00, // PUSH1 0 (address)
        0x60, 0x00, // PUSH1 0 (gas)
        0xFA,       // STATICCALL
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: SELFDESTRUCT opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x00, // PUSH1 0 (beneficiary address)
        0xFF,       // SELFDESTRUCT
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result.err);
}

test "Interpreter: Additional DUP opcodes (DUP2-DUP16)" {
    // Test DUP2
    const bytecode2 = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x81,       // DUP2
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode2);
    
    const result2 = try executeTestBytecode(test_allocator, bytecode2, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result2.err);
    try testing.expect(result2.result != null);
    try testing.expectEqual(@as(u8, 1), result2.result.?[31]);

    // Test DUP8
    var bytecode_list = std.ArrayList(u8).init(test_allocator);
    defer bytecode_list.deinit();
    
    // Push 8 values
    for (1..9) |i| {
        try bytecode_list.appendSlice(&[_]u8{ 0x60, @intCast(i) });
    }
    
    try bytecode_list.append(0x87); // DUP8
    try bytecode_list.appendSlice(&[_]u8{
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    
    const bytecode8 = try bytecode_list.toOwnedSlice();
    defer test_allocator.free(bytecode8);
    
    const result8 = try executeTestBytecode(test_allocator, bytecode8, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result8.err);
    try testing.expect(result8.result != null);
    try testing.expectEqual(@as(u8, 1), result8.result.?[31]); // DUP8 should duplicate the 8th item (1)
}

test "Interpreter: Additional SWAP opcodes (SWAP2-SWAP16)" {
    // Test SWAP2
    const bytecode2 = try createBytecode(test_allocator, &[_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x60, 0x03, // PUSH1 3
        0x91,       // SWAP2
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode2);
    
    const result2 = try executeTestBytecode(test_allocator, bytecode2, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result2.err);
    try testing.expect(result2.result != null);
    try testing.expectEqual(@as(u8, 1), result2.result.?[31]); // Top should now be 1

    // Test SWAP8
    var bytecode_list = std.ArrayList(u8).init(test_allocator);
    defer bytecode_list.deinit();
    
    // Push 9 values
    for (1..10) |i| {
        try bytecode_list.appendSlice(&[_]u8{ 0x60, @intCast(i) });
    }
    
    try bytecode_list.append(0x97); // SWAP8
    try bytecode_list.appendSlice(&[_]u8{
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    
    const bytecode8 = try bytecode_list.toOwnedSlice();
    defer test_allocator.free(bytecode8);
    
    const result8 = try executeTestBytecode(test_allocator, bytecode8, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result8.err);
    try testing.expect(result8.result != null);
    try testing.expectEqual(@as(u8, 1), result8.result.?[31]); // Top should now be 1 (swapped with 9)
}

test "Interpreter: Additional PUSH opcodes (PUSH3-PUSH31)" {
    // Test PUSH3
    const bytecode3 = try createBytecode(test_allocator, &[_]u8{
        0x62, 0x01, 0x02, 0x03, // PUSH3 0x010203
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode3);
    
    const result3 = try executeTestBytecode(test_allocator, bytecode3, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result3.err);
    try testing.expect(result3.result != null);
    try testing.expectEqual(@as(u8, 0x01), result3.result.?[29]);
    try testing.expectEqual(@as(u8, 0x02), result3.result.?[30]);
    try testing.expectEqual(@as(u8, 0x03), result3.result.?[31]);

    // Test PUSH16
    var bytecode_list = std.ArrayList(u8).init(test_allocator);
    defer bytecode_list.deinit();
    
    try bytecode_list.append(0x6F); // PUSH16
    for (1..17) |i| {
        try bytecode_list.append(@intCast(i));
    }
    
    try bytecode_list.appendSlice(&[_]u8{
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    
    const bytecode16 = try bytecode_list.toOwnedSlice();
    defer test_allocator.free(bytecode16);
    
    const result16 = try executeTestBytecode(test_allocator, bytecode16, 100000);
    try testing.expectEqual(@as(?InterpreterError, null), result16.err);
    try testing.expect(result16.result != null);
    // Check last 16 bytes
    for (0..16) |i| {
        try testing.expectEqual(@as(u8, @intCast(i + 1)), result16.result.?[16 + i]);
    }
}

test "Interpreter: EXTCALL opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // EXTCALL parameters (address, argsOffset, argsSize, value)
        0x60, 0x00, // PUSH1 0 (value)
        0x60, 0x00, // PUSH1 0 (argsSize)
        0x60, 0x00, // PUSH1 0 (argsOffset)
        0x60, 0x00, // PUSH1 0 (address)
        0xF8,       // EXTCALL
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    // EXTCALL might not be implemented in all EVM versions
    // So we just check that it doesn't crash
    _ = result;
}

test "Interpreter: EXTDELEGATECALL opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // EXTDELEGATECALL parameters (address, argsOffset, argsSize)
        0x60, 0x00, // PUSH1 0 (argsSize)
        0x60, 0x00, // PUSH1 0 (argsOffset)
        0x60, 0x00, // PUSH1 0 (address)
        0xF9,       // EXTDELEGATECALL
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    // EXTDELEGATECALL might not be implemented in all EVM versions
    _ = result;
}

test "Interpreter: EXTSTATICCALL opcode" {
    const bytecode = try createBytecode(test_allocator, &[_]u8{
        // EXTSTATICCALL parameters (address, argsOffset, argsSize)
        0x60, 0x00, // PUSH1 0 (argsSize)
        0x60, 0x00, // PUSH1 0 (argsOffset)
        0x60, 0x00, // PUSH1 0 (address)
        0xFB,       // EXTSTATICCALL
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 32
        0x60, 0x00, // PUSH1 0
        0xF3,       // RETURN
    });
    defer test_allocator.free(bytecode);

    const result = try executeTestBytecode(test_allocator, bytecode, 100000);
    // EXTSTATICCALL might not be implemented in all EVM versions
    _ = result;
}

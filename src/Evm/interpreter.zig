const std = @import("std");
const opcodes = @import("opcodes.zig");
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Contract = @import("Contract.zig").Contract;
const InterpreterState = @import("InterpreterState.zig").InterpreterState;
const Evm = @import("Evm.zig");
const JumpTableModule = @import("JumpTable.zig");

// Import specific items from opcodes for convenience
const Operation = opcodes.Operation;
const JumpTable = JumpTableModule.JumpTable;
const ExecutionError = opcodes.ExecutionError;
const getOperation = opcodes.getOperation;

// Interpreter error type
const InterpreterError = error{TODO};

// Performance comparison with revm and evmone:
//
// Interpreter Architecture:
// - Tevm: Simple loop with function pointer dispatch
// - revm: Macro-based instruction dispatch with gas metering (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs#L285)
// - evmone: Advanced interpreter with computed goto (https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp)
//
// Critical optimizations missing:
// 1. evmone uses computed goto for ~20% performance boost
// 2. revm uses macros to inline gas checks and reduce function call overhead
// 3. Both batch gas checks for sequential opcodes
//
// evmone's baseline interpreter ref: https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp#L42
pub const Interpreter = struct {
    allocator: std.mem.Allocator,
    evm: *Evm,
    table: JumpTable,

    pub fn create(allocator: std.mem.Allocator, evm: *Evm, table: JumpTable) Interpreter {
        return Interpreter{
            .evm = evm,
            .table = table,
            .allocator = allocator,
        };
    }

    // Main interpreter loop comparison:
    // - revm: Uses loop-continue pattern with inline gas checks (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs#L363)
    // - evmone: Uses computed goto or switch in tight loop (https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp#L47)
    //
    // Performance insights:
    // 1. evmone pre-validates jumps to avoid checks in hot loop
    // 2. revm batches gas accounting for common opcode sequences
    // 3. Both avoid function calls in the hot path where possible
    pub fn run(self: *Interpreter, contract: *Contract, input: []const u8) InterpreterError!?[]const u8 {
        self.evm.depth += 1;
        defer self.evm.depth -= 1;

        if (contract.deployedBytecode.len == 0) {
            return null;
        }

        var state = InterpreterState{};

        contract.input = input;

        // Main interpreter loop
        // evmone optimization: Uses local copies of frequently accessed values
        // evmone ref: https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp#L58
        while (true) {
            // Get the current operation from the bytecode
            const op_code = contract.getOp(state.pc);
            const operation = self.table.getOperation(op_code);

            // Execute the operation
            // Performance issue: Function call overhead for each opcode
            // revm solution: Macro expansion to inline common operations
            // evmone solution: Computed goto to avoid function calls entirely
            _ = operation.execute(state.pc, self, &state) catch |err| {
                // Handle execution errors
                if (err == ExecutionError.STOP) {
                    // Successful completion with STOP
                    break;
                }
                // Other error handling could be implemented here
                return InterpreterError.TODO;
            };

            // Update program counter for next iteration
            // Note: revm/evmone handle PC updates within opcodes for better control
            state.pc += 1;
        }

        return null; // Return result (would typically be state.returnData)
    }
};

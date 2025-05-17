const std = @import("std");
const opcodes = @import("opcodes.zig");
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Contract = @import("Contract.zig").Contract;
const InterpreterState = @import("InterpreterState.zig").InterpreterState;
const Evm = @import("Evm.zig");

// Import specific items from opcodes for convenience
const Operation = opcodes.Operation;
const JumpTable = opcodes.JumpTable;
const ExecutionError = opcodes.ExecutionError;
const getOperation = opcodes.getOperation;

// Interpreter error type
const InterpreterError = error{TODO};

pub const Interpreter = struct {
    allocator: std.mem.Allocator,
    evm: *Evm,
    table: *JumpTable,

    pub fn create(allocator: std.memory.Allocator, evm: *Evm, table: *JumpTable) Interpreter {
        return Interpreter{
            .evm = evm,
            .table = table,
            .allocator = allocator,
        };
    }

    pub fn run(self: *Interpreter, contract: *Contract, input: []const u8) InterpreterError!?[]const u8 {
        self.evm.depth += 1;
        defer self.evm.depth -= 1;

        if (contract.deployedBytecode.len == 0) {
            return null;
        }

        var state = InterpreterState{};

        contract.input = input;

        while (true) {
            // Here geth checks EIP4762 https://github.com/ethereum/go-ethereum/blob/c8be0f9a74fdabe5f82fa5b647e9973c9c3567ef/core/vm/interpreter.go#L236
            const operation = self.table.getOp(contract.getOp(state.pc));

            // Execute the operation
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
            state.pc += 1;
        }

        return null; // Return result (would typically be state.returnData)
    }
};

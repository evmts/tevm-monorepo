const std = @import("std");
const opcodes = @import("opcodes.zig");
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Contract = @import("Contract.zig").Contract;
const Frame = @import("Frame.zig").Frame;
const ExecutionError = @import("Frame.zig").ExecutionError;
const Evm = @import("Evm.zig");
const JumpTableModule = @import("JumpTable.zig");

// Import specific items from opcodes for convenience
const Operation = opcodes.Operation;
const JumpTable = JumpTableModule.JumpTable;
const getOperation = opcodes.getOperation;

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

    pub fn create(allocator: std.mem.Allocator, evm: *Evm, table: JumpTable) Interpreter {
        return Interpreter{
            .evm = evm,
            .table = table,
            .allocator = allocator,
        };
    }

    pub fn run(self: *Interpreter, contract: *Contract, input: []const u8, readOnly: bool) InterpreterError!?[]const u8 {
        // Increment the call depth which is restricted to 1024
        self.evm.depth += 1;
        defer self.evm.depth -= 1;

        // Make sure the readOnly is only set if we aren't in readOnly yet.
        // This also makes sure that the readOnly flag isn't removed for child calls.
        const previousReadOnly = self.readOnly;
        if (readOnly and !self.readOnly) {
            self.readOnly = true;
            defer self.readOnly = false;
        }

        // Reset the previous call's return data
        if (self.returnData) |data| {
            self.allocator.free(data);
            self.returnData = null;
        }

        // Don't bother with the execution if there's no code.
        if (contract.code.len == 0) {
            return null;
        }

        // Initialize the Frame
        var frame = try Frame.init(self.allocator, contract);
        defer frame.deinit();

        // Set contract input
        contract.input = input;

        // Main execution loop
        while (true) {
            // Get the current operation from the bytecode
            const op_code = contract.getOp(frame.pc);
            const operation = self.table.getOperation(op_code);

            // Validate stack
            if (frame.stack.size < operation.min_stack) {
                return InterpreterError.StackUnderflow;
            } else if (frame.stack.size > operation.max_stack) {
                return InterpreterError.StackOverflow;
            }

            // Check if we have enough gas
            const constantGas = operation.constant_gas;
            if (contract.gas < constantGas) {
                return InterpreterError.OutOfGas;
            }
            contract.useGas(constantGas);
            
            // Dynamic gas calculation would go here
            
            // Execute the operation
            _ = operation.execute(frame.pc, self, &frame) catch |err| {
                // Handle execution errors
                switch (err) {
                    ExecutionError.STOP => break, // Successful completion with STOP
                    ExecutionError.REVERT => {
                        // Handle revert - return remaining gas to caller
                        // and return revert data
                        if (frame.returnData) |data| {
                            // Copy return data for the caller to access
                            const return_copy = self.allocator.dupe(u8, data) catch return InterpreterError.OutOfGas;
                            self.returnData = return_copy;
                            return return_copy;
                        }
                        return null;
                    },
                    ExecutionError.OutOfGas => return InterpreterError.OutOfGas,
                    ExecutionError.StackUnderflow => return InterpreterError.StackUnderflow,
                    ExecutionError.StackOverflow => return InterpreterError.StackOverflow,
                    ExecutionError.InvalidJump => return InterpreterError.InvalidJump,
                    ExecutionError.InvalidOpcode => return InterpreterError.InvalidOpcode,
                    ExecutionError.StaticStateChange => return InterpreterError.StaticStateChange,
                    else => return InterpreterError.InvalidOpcode,
                }
            };

            // Update program counter for next iteration
            frame.pc += 1;
        }

        // Return successful completion data if any
        if (frame.returnData) |data| {
            // Copy return data for the caller to access
            const return_copy = self.allocator.dupe(u8, data) catch return InterpreterError.OutOfGas;
            self.returnData = return_copy;
            return return_copy;
        }
        
        return null;
    }
    
    pub fn deinit(self: *Interpreter) void {
        if (self.returnData) |data| {
            self.allocator.free(data);
            self.returnData = null;
        }
    }
};
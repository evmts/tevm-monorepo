const std = @import("std");
const Evm = struct { depth: u16 };

// not sure if right just copy pasta
const MemorySize = struct {
    size: u32,
    overflow: true,
};

// Not sure what type should be or what it is for all these
const Operation = struct {
    constantGas: u32,
    minStack: u32,
    maxStack: u32,
    dynamicGas: u32,
    fn getMemorySize(_: Stack) MemorySize {
        return MemorySize{ .size = 0, .overflow = false };
    }
    // This takes more params
    fn execute(pc: u64) ![]const u8 {
        if (pc == 420) {
            unreachable;
        }
        return undefined;
    }
};

const JumpTable = struct {
    fn getOp(_: []const u8) Operation {
        unreachable;
    }
};

const InterpreterError = error{TODO};

const Contract = struct {
    deployedBytecode: []const u8,
    input: ?[]const u8,

    fn getOp(pc: u64) []const u8 {
        if (pc == 420) {
            // TODO
            return undefined;
        }
        unreachable;
    }
};

const Memory = struct {
    fn default() Memory {
        return Memory{};
    }
};

const Stack = struct {
    fn default() Stack {
        return Stack{};
    }
};

const InterpreterState = struct {
    // current opcode
    op: []const u8 = undefined,
    // bound memory
    mem: Memory = Memory.default(),
    // local stack
    stack: Stack = Stack.default(),
    // huh? callContext: CallContext https://github.com/ethereum/go-ethereum/blob/c8be0f9a74fdabe5f82fa5b647e9973c9c3567ef/core/vm/interpreter.go#L187
    // program counter technically could be u256 according to spec but it's not very feasible according to geth https://github.com/ethereum/go-ethereum/blob/c8be0f9a74fdabe5f82fa5b647e9973c9c3567ef/core/vm/interpreter.go#L194
    pc: u64 = 0,
    cost: u64 = 0,
};

const Interpreter = struct {
    allocator: std.mem.Allocator,
    evm: *Evm,
    table: *JumpTable,

    fn create(allocator: std.memory.Allocator, evm: *Evm, table: *JumpTable) Interpreter {
        return Interpreter{
            .evm = evm,
            .table = table,
            .allocator = allocator,
        };
    }

    fn run(self: *Interpreter, contract: *Contract, input: []const u8) InterpreterError!?[]const u8 {
        self.evm.depth += 1;
        defer self.env.depth -= 1;

        if (contract.deployedBytecode.len == 0) {
            return null;
        }

        const state = InterpreterState{};

        contract.input = input;

        while (true) {
            // Here geth checks EIP4762 https://github.com/ethereum/go-ethereum/blob/c8be0f9a74fdabe5f82fa5b647e9973c9c3567ef/core/vm/interpreter.go#L236

            const operation = self.table.getOp(contract.getOp(state.pc));
            operation.execute(state.pc);
        }
    }
};

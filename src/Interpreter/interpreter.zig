const std = @import("std");
const Evm = struct { depth: u16 };

const MemorySize = struct {
    size: u32,
    overflow: true,
};

const ExecutionError = error{
    STOP,
};

const STOP = struct {
    constantGas: u32 = 0,
    minStack: u32 = 0,
    maxStack: u32 = 1028,
    dynamicGas: u32,
    fn execute(_: usize, _: *Interpreter, _: *InterpreterState) ExecutionError![]const u8 {
        return ExecutionError.STOP;
    }
    // Not needed with STOP but might be needed for future opcodes
    // fn getMemorySize(_: Stack) MemorySize {
    //   return MemorySize{ .size = 0, .overflow = false };
    // }
};

const ADD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, add them, and push result
        // Implementation depends on your Interpreter and InterpreterState types
        return ""; // Successful execution
    }
};

const MUL = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, multiply them, and push result
        return "";
    }
};

const SUB = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, subtract second from first, and push result
        return "";
    }
};

const DIV = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, divide first by second, and push result
        // Handle division by zero
        return "";
    }
};

const SDIV = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, perform signed division, and push result
        // Handle division by zero
        return "";
    }
};

const MOD = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, calculate modulo, and push result
        // Handle modulo by zero
        return "";
    }
};

const SMOD = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, calculate signed modulo, and push result
        // Handle modulo by zero
        return "";
    }
};

const ADDMOD = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop three values from stack, add first two modulo third, and push result
        // Handle modulo by zero
        return "";
    }
};

const MULMOD = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop three values from stack, multiply first two modulo third, and push result
        // Handle modulo by zero
        return "";
    }
};
const EXP = struct {
    constantGas: u32 = 10, // Base cost, actual cost is dynamic
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 50, // Additional dynamic calculation needed per byte in exponent
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop base and exponent from stack, calculate base^exponent, and push result
        return "";
    }
};

const SIGNEXTEND = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop byte position and value from stack, sign extend the value from the specified byte position
        return "";
    }
};

const LT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, compare (first < second), push 1 if true, 0 if false
        return "";
    }
};

const GT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, compare (first > second), push 1 if true, 0 if false
        return "";
    }
};

const SLT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, compare signed (first < second), push 1 if true, 0 if false
        return "";
    }
};

const SGT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, compare signed (first > second), push 1 if true, 0 if false
        return "";
    }
};

const EQ = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, compare equality, push 1 if equal, 0 if not equal
        return "";
    }
};

const ISZERO = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop value from stack, push 1 if value is zero, 0 otherwise
        return "";
    }
};

const AND = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, compute bitwise AND, push result
        return "";
    }
};

const OR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, compute bitwise OR, push result
        return "";
    }
};

const XOR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop two values from stack, compute bitwise XOR, push result
        return "";
    }
};

const NOT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop value from stack, compute bitwise NOT, push result
        return "";
    }
};

const BYTE = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop position and value, extract byte at position from value, push result
        return "";
    }
};

const SHL = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop shift and value, compute (value << shift), push result
        return "";
    }
};

const SHR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop shift and value, compute (value >> shift), push result
        return "";
    }
};

const SAR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop shift and value, compute arithmetic right shift, push result
        return "";
    }
};

const KECCAK256 = struct {
    constantGas: u32 = 30, // Keccak256Gas
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 6, // Per word, plus memory expansion cost
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset and size, compute keccak256 hash of memory region, push result
        return "";
    }
};

const ADDRESS = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push the address of the current executing account
        return "";
    }
};

const BALANCE = struct {
    constantGas: u32 = 700, // Later versions reduced this cost
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop address, push balance of that address
        return "";
    }
};

const ORIGIN = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push the address of the original transaction sender
        return "";
    }
};

const CALLER = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push the address of the caller
        return "";
    }
};

const CALLVALUE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push the value sent with the current call
        return "";
    }
};

const CALLDATALOAD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset, push 32 bytes of calldata starting at that offset
        return "";
    }
};

const CALLDATASIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push size of calldata
        return "";
    }
};

const CALLDATACOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on memOffset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop memOffset, dataOffset, and size
        // Copy call data from dataOffset to memory at memOffset
        return "";
    }
};

const CODESIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push size of code running in current environment
        return "";
    }
};

const CODECOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on memOffset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop memOffset, codeOffset, and size
        // Copy code from codeOffset to memory at memOffset
        return "";
    }
};

const GASPRICE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push the gas price used in the current transaction
        return "";
    }
};

const EXTCODESIZE = struct {
    constantGas: u32 = 700, // Later versions reduced this
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop address, push size of code at that address
        return "";
    }
};

const EXTCODECOPY = struct {
    constantGas: u32 = 700, // Later versions reduced this
    minStack: u32 = 4,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on memOffset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop address, memOffset, codeOffset, and size
        // Copy code of the specified account from codeOffset to memory at memOffset
        return "";
    }
};

const RETURNDATASIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push size of data returned from most recent call
        return "";
    }
};

const RETURNDATACOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on memOffset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop memOffset, dataOffset, and size
        // Copy return data from dataOffset to memory at memOffset
        return "";
    }
};

const EXTCODEHASH = struct {
    constantGas: u32 = 700, // ExtcodeHashGasConstantinople
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop address, push hash of the code at that address
        return "";
    }
};

const BLOCKHASH = struct {
    constantGas: u32 = 20, // GasExtStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop block number, push hash of that block
        return "";
    }
};

const COINBASE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push address of the current block's miner
        return "";
    }
};

const TIMESTAMP = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push timestamp of the current block
        return "";
    }
};

const NUMBER = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push current block number
        return "";
    }
};

const PREVRANDAO = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push RANDAO value from current block
        // This is the new opcode that replaced DIFFICULTY after The Merge
        return "";
    }
};

const GASLIMIT = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push gas limit of the current block
        return "";
    }
};

const CHAINID = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push chain ID
        return "";
    }
};

const SELFBALANCE = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push balance of the current contract
        return "";
    }
};

const BASEFEE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push base fee of the current block (post-EIP 1559)
        return "";
    }
};

const BLOBHASH = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop index, push hash of blob at that index (EIP-4844)
        return "";
    }
};

const BLOBBASEFEE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push blob base fee of the current block (EIP-7516)
        return "";
    }
};

const POP = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop value from stack and discard it
        return "";
    }
};

const MLOAD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset from stack
        return MemorySize{ .size = 32, .overflow = false }; // 32 bytes read
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset, push value from memory at that offset
        return "";
    }
};

const MSTORE = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset from stack
        return MemorySize{ .size = 32, .overflow = false }; // 32 bytes written
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset and value, store value in memory at offset
        return "";
    }
};

const MSTORE8 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset from stack
        return MemorySize{ .size = 1, .overflow = false }; // 1 byte written
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset and value, store least significant byte in memory at offset
        return "";
    }
};

const SLOAD = struct {
    constantGas: u32 = 800, // SloadGas (post-London)
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop key, push value from storage at that key
        return "";
    }
};

const SSTORE = struct {
    constantGas: u32 = 0, // All costs are dynamic
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 20000, // Base cost, actual cost depends on value being set
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop key and value, store value in storage at key
        return "";
    }
};

const JUMP = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop destination, set PC to destination
        // Must validate destination is a JUMPDEST
        return "";
    }
};

const JUMPI = struct {
    constantGas: u32 = 10, // GasSlowStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop destination and condition
        // If condition is not zero, set PC to destination
        // Must validate destination is a JUMPDEST
        return "";
    }
};

const PC = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push current program counter
        return "";
    }
};

const MSIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push current memory size in bytes
        return "";
    }
};

const GAS = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push remaining gas
        return "";
    }
};

const JUMPDEST = struct {
    constantGas: u32 = 1, // JumpdestGas
    minStack: u32 = 0,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Mark valid jump destination, no operation performed
        return "";
    }
};

const TLOAD = struct {
    constantGas: u32 = 100, // Approximate cost
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop key, push value from transient storage at that key (EIP-1153)
        return "";
    }
};

const TSTORE = struct {
    constantGas: u32 = 100, // Approximate cost
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop key and value, store value in transient storage at key (EIP-1153)
        return "";
    }
};

const MCOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on dest, source, and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop dest, source, and size
        // Copy memory from source to dest for size bytes (EIP-5656)
        return "";
    }
};

const PUSH0 = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push zero onto the stack (EIP-3855)
        return "";
    }
};

// Define PUSH1 through PUSH32
const PUSH1 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Push 1 byte onto stack from code after PC
        return "";
    }
};

// Similar structs for PUSH2 through PUSH32 would follow the same pattern
// I'll define a generic PUSH template that could be used for all PUSH operations

// Define DUP1 through DUP16
const DUP1 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 2,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Duplicate the 1st stack item
        return "";
    }
};

// Similar structs for DUP2 through DUP16 would follow the same pattern

// Define SWAP1 through SWAP16
const SWAP1 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 2,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Swap 1st and 2nd stack items
        return "";
    }
};

// Similar structs for SWAP2 through SWAP16 would follow the same pattern

// Define LOGx operations
const LOG0 = struct {
    constantGas: u32 = 375, // LogGas
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset and size, log data from memory with no topics
        return "";
    }
};

const LOG1 = struct {
    constantGas: u32 = 750, // LogGas + LogTopicGas
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset, size, and topic1, log data from memory with 1 topic
        return "";
    }
};

const LOG2 = struct {
    constantGas: u32 = 1125, // LogGas + 2*LogTopicGas
    minStack: u32 = 4,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset, size, topic1, and topic2, log data from memory with 2 topics
        return "";
    }
};

const LOG3 = struct {
    constantGas: u32 = 1500, // LogGas + 3*LogTopicGas
    minStack: u32 = 5,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset, size, topic1, topic2, and topic3, log data from memory with 3 topics
        return "";
    }
};

const LOG4 = struct {
    constantGas: u32 = 1875, // LogGas + 4*LogTopicGas
    minStack: u32 = 6,
    maxStack: u32 = 0,
    dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset, size, topic1, topic2, topic3, and topic4, log data from memory with 4 topics
        return "";
    }
};

// Create/call operations
const CREATE = struct {
    constantGas: u32 = 32000, // CreateGas
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on execution, plus memory expansion
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion size based on offset and size from stack
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop value, offset, and size
        // Create a new contract with code from memory and value
        return "";
    }
};

const CALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 7,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on value transfer and new account
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion from inOffset, inSize, outOffset, outSize
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop gas, address, value, inOffset, inSize, outOffset, outSize
        // Call the specified address with the given inputs
        return "";
    }
};

const CALLCODE = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 7,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on value transfer
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion from inOffset, inSize, outOffset, outSize
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop gas, address, value, inOffset, inSize, outOffset, outSize
        // Call the specified code with the current contract's context
        return "";
    }
};

const RETURN = struct {
    constantGas: u32 = 0,
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Memory expansion only
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion from offset and size
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset and size, return data from memory
        return "";
    }
};

const DELEGATECALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion from inOffset, inSize, outOffset, outSize
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop gas, address, inOffset, inSize, outOffset, outSize
        // Call the specified code with the sender and value of the current contract
        return "";
    }
};

const CREATE2 = struct {
    constantGas: u32 = 32000, // CreateGas
    minStack: u32 = 4,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation including hash cost
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion from offset and size
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop value, offset, size, and salt
        // Create a new contract with deterministic address
        return "";
    }
};

const STATICCALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion from inOffset, inSize, outOffset, outSize
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop gas, address, inOffset, inSize, outOffset, outSize
        // Call the specified address with static restrictions (no state changes)
        return "";
    }
};

const REVERT = struct {
    constantGas: u32 = 0,
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Memory expansion only
    fn getMemorySize(stack: Stack) MemorySize {
        // Calculate memory expansion from offset and size
        return MemorySize{ .size = 0, .overflow = false }; // Placeholder
    }
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop offset and size, revert state changes and return data from memory
        return ExecutionError.REVERT;
    }
};

const INVALID = struct {
    constantGas: u32 = 0,
    minStack: u32 = 0,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Invalid operation
        return ExecutionError.INVALID;
    }
};

const SELFDESTRUCT = struct {
    constantGas: u32 = 5000, // Base cost, dynamic in recent versions
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Additional cost based on whether account already has balance
    fn execute(pc: usize, interpreter: *Interpreter, state: *InterpreterState) ExecutionError![]const u8 {
        // Pop beneficiary address, destroy current contract and send funds to beneficiary
        return "";
    }
};

// Now let's create the complete Operation union
const Operation = union(enum) {
    STOP: STOP,
    ADD: ADD,
    MUL: MUL,
    SUB: SUB,
    DIV: DIV,
    SDIV: SDIV,
    MOD: MOD,
    SMOD: SMOD,
    ADDMOD: ADDMOD,
    MULMOD: MULMOD,
    EXP: EXP,
    SIGNEXTEND: SIGNEXTEND,
    LT: LT,
    GT: GT,
    SLT: SLT,
    SGT: SGT,
    EQ: EQ,
    ISZERO: ISZERO,
    AND: AND,
    OR: OR,
    XOR: XOR,
    NOT: NOT,
    BYTE: BYTE,
    SHL: SHL,
    SHR: SHR,
    SAR: SAR,
    KECCAK256: KECCAK256,
    ADDRESS: ADDRESS,
    BALANCE: BALANCE,
    ORIGIN: ORIGIN,
    CALLER: CALLER,
    CALLVALUE: CALLVALUE,
    CALLDATALOAD: CALLDATALOAD,
    CALLDATASIZE: CALLDATASIZE,
    CALLDATACOPY: CALLDATACOPY,
    CODESIZE: CODESIZE,
    CODECOPY: CODECOPY,
    GASPRICE: GASPRICE,
    EXTCODESIZE: EXTCODESIZE,
    EXTCODECOPY: EXTCODECOPY,
    RETURNDATASIZE: RETURNDATASIZE,
    RETURNDATACOPY: RETURNDATACOPY,
    EXTCODEHASH: EXTCODEHASH,
    BLOCKHASH: BLOCKHASH,
    COINBASE: COINBASE,
    TIMESTAMP: TIMESTAMP,
    NUMBER: NUMBER,
    PREVRANDAO: PREVRANDAO,
    GASLIMIT: GASLIMIT,
    CHAINID: CHAINID,
    SELFBALANCE: SELFBALANCE,
    BASEFEE: BASEFEE,
    BLOBHASH: BLOBHASH,
    BLOBBASEFEE: BLOBBASEFEE,
    POP: POP,
    MLOAD: MLOAD,
    MSTORE: MSTORE,
    MSTORE8: MSTORE8,
    SLOAD: SLOAD,
    SSTORE: SSTORE,
    JUMP: JUMP,
    JUMPI: JUMPI,
    PC: PC,
    MSIZE: MSIZE,
    GAS: GAS,
    JUMPDEST: JUMPDEST,
    TLOAD: TLOAD,
    TSTORE: TSTORE,
    MCOPY: MCOPY,
    PUSH0: PUSH0,
    PUSH1: PUSH1,
    // PUSH2 through PUSH32 would be included here
    DUP1: DUP1,
    // DUP2 through DUP16 would be included here
    SWAP1: SWAP1,
    // SWAP2 through SWAP16 would be included here
    LOG0: LOG0,
    LOG1: LOG1,
    LOG2: LOG2,
    LOG3: LOG3,
    LOG4: LOG4,
    CREATE: CREATE,
    CALL: CALL,
    CALLCODE: CALLCODE,
    RETURN: RETURN,
    DELEGATECALL: DELEGATECALL,
    CREATE2: CREATE2,
    STATICCALL: STATICCALL,
    REVERT: REVERT,
    INVALID: INVALID,
    SELFDESTRUCT: SELFDESTRUCT,
};

// A function to get an operation by opcode byte
fn getOperation(opcode: u8) Operation {
    return switch (opcode) {
        0x00 => Operation{ .STOP = STOP{} },
        0x01 => Operation{ .ADD = ADD{} },
        0x02 => Operation{ .MUL = MUL{} },
        0x03 => Operation{ .SUB = SUB{} },
        0x04 => Operation{ .DIV = DIV{} },
        0x05 => Operation{ .SDIV = SDIV{} },
        0x06 => Operation{ .MOD = MOD{} },
        0x07 => Operation{ .SMOD = SMOD{} },
        0x08 => Operation{ .ADDMOD = ADDMOD{} },
        0x09 => Operation{ .MULMOD = MULMOD{} },
        0x0A => Operation{ .EXP = EXP{} },
        0x0B => Operation{ .SIGNEXTEND = SIGNEXTEND{} },
        0x10 => Operation{ .LT = LT{} },
        0x11 => Operation{ .GT = GT{} },
        0x12 => Operation{ .SLT = SLT{} },
        0x13 => Operation{ .SGT = SGT{} },
        0x14 => Operation{ .EQ = EQ{} },
        0x15 => Operation{ .ISZERO = ISZERO{} },
        0x16 => Operation{ .AND = AND{} },
        0x17 => Operation{ .OR = OR{} },
        0x18 => Operation{ .XOR = XOR{} },
        0x19 => Operation{ .NOT = NOT{} },
        0x1A => Operation{ .BYTE = BYTE{} },
        0x1B => Operation{ .SHL = SHL{} },
        0x1C => Operation{ .SHR = SHR{} },
        0x1D => Operation{ .SAR = SAR{} },
        0x20 => Operation{ .KECCAK256 = KECCAK256{} },
        0x30 => Operation{ .ADDRESS = ADDRESS{} },
        0x31 => Operation{ .BALANCE = BALANCE{} },
        0x32 => Operation{ .ORIGIN = ORIGIN{} },
        0x33 => Operation{ .CALLER = CALLER{} },
        0x34 => Operation{ .CALLVALUE = CALLVALUE{} },
        0x35 => Operation{ .CALLDATALOAD = CALLDATALOAD{} },
        0x36 => Operation{ .CALLDATASIZE = CALLDATASIZE{} },
        0x37 => Operation{ .CALLDATACOPY = CALLDATACOPY{} },
        0x38 => Operation{ .CODESIZE = CODESIZE{} },
        0x39 => Operation{ .CODECOPY = CODECOPY{} },
        0x3A => Operation{ .GASPRICE = GASPRICE{} },
        0x3B => Operation{ .EXTCODESIZE = EXTCODESIZE{} },
        0x3C => Operation{ .EXTCODECOPY = EXTCODECOPY{} },
        0x3D => Operation{ .RETURNDATASIZE = RETURNDATASIZE{} },
        0x3E => Operation{ .RETURNDATACOPY = RETURNDATACOPY{} },
        0x3F => Operation{ .EXTCODEHASH = EXTCODEHASH{} },
        0x40 => Operation{ .BLOCKHASH = BLOCKHASH{} },
        0x41 => Operation{ .COINBASE = COINBASE{} },
        0x42 => Operation{ .TIMESTAMP = TIMESTAMP{} },
        0x43 => Operation{ .NUMBER = NUMBER{} },
        0x44 => Operation{ .PREVRANDAO = PREVRANDAO{} },
        0x45 => Operation{ .GASLIMIT = GASLIMIT{} },
        0x46 => Operation{ .CHAINID = CHAINID{} },
        0x47 => Operation{ .SELFBALANCE = SELFBALANCE{} },
        0x48 => Operation{ .BASEFEE = BASEFEE{} },
        0x49 => Operation{ .BLOBHASH = BLOBHASH{} },
        0x4A => Operation{ .BLOBBASEFEE = BLOBBASEFEE{} },
        0x50 => Operation{ .POP = POP{} },
        0x51 => Operation{ .MLOAD = MLOAD{} },
        0x52 => Operation{ .MSTORE = MSTORE{} },
        0x53 => Operation{ .MSTORE8 = MSTORE8{} },
        0x54 => Operation{ .SLOAD = SLOAD{} },
        0x55 => Operation{ .SSTORE = SSTORE{} },
        0x56 => Operation{ .JUMP = JUMP{} },
        0x57 => Operation{ .JUMPI = JUMPI{} },
        0x58 => Operation{ .PC = PC{} },
        0x59 => Operation{ .MSIZE = MSIZE{} },
        0x5A => Operation{ .GAS = GAS{} },
        0x5B => Operation{ .JUMPDEST = JUMPDEST{} },
        0x5C => Operation{ .TLOAD = TLOAD{} },
        0x5D => Operation{ .TSTORE = TSTORE{} },
        0x5E => Operation{ .MCOPY = MCOPY{} },
        0x5F => Operation{ .PUSH0 = PUSH0{} },
        0x60 => Operation{ .PUSH1 = PUSH1{} },
        // 0x61..0x7F => PUSH2..PUSH32
        0x80 => Operation{ .DUP1 = DUP1{} },
        // 0x81..0x8F => DUP2..DUP16
        0x90 => Operation{ .SWAP1 = SWAP1{} },
        // 0x91..0x9F => SWAP2..SWAP16
        0xA0 => Operation{ .LOG0 = LOG0{} },
        0xA1 => Operation{ .LOG1 = LOG1{} },
        0xA2 => Operation{ .LOG2 = LOG2{} },
        0xA3 => Operation{ .LOG3 = LOG3{} },
        0xA4 => Operation{ .LOG4 = LOG4{} },
        0xF0 => Operation{ .CREATE = CREATE{} },
        0xF1 => Operation{ .CALL = CALL{} },
        0xF2 => Operation{ .CALLCODE = CALLCODE{} },
        0xF3 => Operation{ .RETURN = RETURN{} },
        0xF4 => Operation{ .DELEGATECALL = DELEGATECALL{} },
        0xF5 => Operation{ .CREATE2 = CREATE2{} },
        0xFA => Operation{ .STATICCALL = STATICCALL{} },
        0xFD => Operation{ .REVERT = REVERT{} },
        0xFE => Operation{ .INVALID = INVALID{} },
        0xFF => Operation{ .SELFDESTRUCT = SELFDESTRUCT{} },
        else => Operation{ .INVALID = INVALID{} }, // Default to INVALID for undefined opcodes
    };
}
const JumpTable = struct {
    fn getOp(_: []const u8) Operation {
        unreachable;
    }
};

const InterpreterError = error{TODO};

const Contract = struct {
    deployedBytecode: []const u8,
    input: ?[]const u8,

    fn getOp(self: *Contract, pc: usize) u8 {
        return self.deployedBytecode[pc];
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
    pc: usize = 0,
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

const std = @import("std");
const _frame = @import("Frame.zig");
const _stack = @import("Stack.zig");
const _opcodes = @import("Opcodes.zig");
const bytecode = @import("Bytecode");
const Evm = @import("EvmInterpreter.zig").Evm;

const Frame = _frame.Frame;
const Stack = _stack.Stack;
const Opcode = _opcodes.Opcode;

pub const ExecutionError = error{
    /// Normal stop (STOP opcode)
    STOP,
    /// Revert operation (REVERT opcode)
    REVERT,
    /// Invalid operation (INVALID opcode or invalid state)
    INVALID,
    /// Stack underflow
    StackUnderflow,
    /// Stack overflow
    StackOverflow,
    /// Out of offset (memory access beyond bounds)
    OutOfOffset,
    /// Out of gas
    OutOfGas,
    /// Invalid jump destination
    InvalidJump,
    /// Invalid opcode
    InvalidOpcode,
    /// Static call violation (state modification in static context)
    StaticCallViolation,
    /// Contract creation failed
    CreateContractFailed,
};

/// MemorySize represents memory expansion requirements for EVM operations
///
/// This is used by opcodes that need to calculate memory expansion costs
/// and ensure memory is properly sized before execution.
pub const MemorySize = struct {
    /// Size in bytes needed for memory expansion
    size: u32,

    /// Whether the calculation resulted in an overflow
    /// This is used to detect and handle arithmetic overflow errors
    overflow: bool,
};

// Implementation of all opcodes
pub const STOP = struct {
    constantGas: u32 = 0,
    minStack: u32 = 0,
    maxStack: u32 = 1028,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        return ExecutionError.STOP;
    }
};

pub const ADD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack
        // Add them and store result in y
        return "";
    }
};

pub const MUL = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, multiply them, and push result
        return "";
    }
};

pub const SUB = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, subtract second from first, and push result
        return "";
    }
};

pub const DIV = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, divide first by second, and push result
        // Handle division by zero
        return "";
    }
};

pub const SDIV = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, perform signed division, and push result
        // Handle division by zero
        return "";
    }
};

pub const MOD = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, calculate modulo, and push result
        // Handle modulo by zero
        return "";
    }
};

pub const SMOD = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, calculate signed modulo, and push result
        // Handle modulo by zero
        return "";
    }
};

pub const ADDMOD = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop three values from stack, add first two modulo third, and push result
        // Handle modulo by zero
        return "";
    }
};

pub const MULMOD = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop three values from stack, multiply first two modulo third, and push result
        // Handle modulo by zero
        return "";
    }
};

pub const EXP = struct {
    constantGas: u32 = 10, // Base cost, actual cost is dynamic
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 50, // Additional dynamic calculation needed per byte in exponent
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop base and exponent from stack, calculate base^exponent, and push result
        return "";
    }
};

pub const SIGNEXTEND = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop byte position and value from stack, sign extend the value from the specified byte position
        return "";
    }
};

pub const LT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, compare (first < second), push 1 if true, 0 if false
        return "";
    }
};

pub const GT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, compare (first > second), push 1 if true, 0 if false
        return "";
    }
};

pub const SLT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, compare signed (first < second), push 1 if true, 0 if false
        return "";
    }
};

pub const SGT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, compare signed (first > second), push 1 if true, 0 if false
        return "";
    }
};

pub const EQ = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, compare equality, push 1 if equal, 0 if not equal
        return "";
    }
};

pub const ISZERO = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop value from stack, push 1 if value is zero, 0 otherwise
        return "";
    }
};

pub const AND = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, compute bitwise AND, push result
        return "";
    }
};

pub const OR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, compute bitwise OR, push result
        return "";
    }
};

pub const XOR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop two values from stack, compute bitwise XOR, push result
        return "";
    }
};

pub const NOT = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop value from stack, compute bitwise NOT, push result
        return "";
    }
};

pub const BYTE = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop position and value, extract byte at position from value, push result
        return "";
    }
};

pub const SHL = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop shift and value, compute (value << shift), push result
        return "";
    }
};

pub const SHR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop shift and value, compute (value >> shift), push result
        return "";
    }
};

pub const SAR = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop shift and value, compute arithmetic right shift, push result
        return "";
    }
};

pub const KECCAK256 = struct {
    constantGas: u32 = 30, // Keccak256Gas
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 6, // Per word, plus memory expansion cost
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop offset and size from stack
        // Calculate keccak256 hash of memory region
        // Push hash to stack
        return "";
    }
};

pub const ADDRESS = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push the address of the current executing account
        return "";
    }
};

pub const BALANCE = struct {
    constantGas: u32 = 700, // Later versions reduced this cost
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop address, push balance of that address
        return "";
    }
};

pub const ORIGIN = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push the address of the original transaction sender
        return "";
    }
};

pub const CALLER = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push the address of the caller
        return "";
    }
};

pub const CALLVALUE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push the value sent with the current call
        return "";
    }
};

pub const CALLDATALOAD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop offset, push 32 bytes of calldata starting at that offset
        return "";
    }
};

pub const CALLDATASIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push size of calldata
        return "";
    }
};

pub const CALLDATACOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop memOffset, dataOffset, and size
        // Copy call data from dataOffset to memory at memOffset
        return "";
    }
};

pub const CODESIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push size of code running in current environment
        return "";
    }
};

pub const CODECOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop memOffset, codeOffset, and size
        // Copy code from codeOffset to memory at memOffset
        return "";
    }
};

pub const GASPRICE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push the gas price used in the current transaction
        return "";
    }
};

pub const EXTCODESIZE = struct {
    constantGas: u32 = 700, // Later versions reduced this
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop address, push size of code at that address
        return "";
    }
};

pub const EXTCODECOPY = struct {
    constantGas: u32 = 700, // Later versions reduced this
    minStack: u32 = 4,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop address, memOffset, codeOffset, and size
        // Copy code of the specified account from codeOffset to memory at memOffset
        return "";
    }
};

pub const RETURNDATASIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push size of data returned from most recent call
        return "";
    }
};

pub const RETURNDATACOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop memOffset, dataOffset, and size
        // Copy return data from dataOffset to memory at memOffset
        return "";
    }
};

pub const EXTCODEHASH = struct {
    constantGas: u32 = 700, // ExtcodeHashGasConstantinople
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop address, push hash of the code at that address
        return "";
    }
};

pub const BLOCKHASH = struct {
    constantGas: u32 = 20, // GasExtStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop block number, push hash of that block
        return "";
    }
};

pub const COINBASE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push address of the current block's miner
        return "";
    }
};

pub const TIMESTAMP = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push timestamp of the current block
        return "";
    }
};

pub const NUMBER = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push current block number
        return "";
    }
};

pub const PREVRANDAO = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push RANDAO value from current block
        // This is the new opcode that replaced DIFFICULTY after The Merge
        return "";
    }
};

pub const GASLIMIT = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push gas limit of the current block
        return "";
    }
};

pub const CHAINID = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push chain ID
        return "";
    }
};

pub const SELFBALANCE = struct {
    constantGas: u32 = 5, // GasFastStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push balance of the current contract
        return "";
    }
};

pub const BASEFEE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push base fee of the current block (post-EIP 1559)
        return "";
    }
};

pub const BLOBHASH = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop index, push hash of blob at that index (EIP-4844)
        return "";
    }
};

pub const BLOBBASEFEE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push blob base fee of the current block (EIP-7516)
        return "";
    }
};

pub const POP = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop value from stack and discard it
        return "";
    }
};

pub const MLOAD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 32, .overflow = false }; // 32 bytes read
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop offset, push value from memory at that offset
        return "";
    }
};

pub const MSTORE = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 32, .overflow = false }; // 32 bytes written
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop offset and value, store value in memory at offset
        return "";
    }
};

pub const MSTORE8 = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 1, .overflow = false }; // 1 byte written
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop offset and value, store least significant byte in memory at offset
        return "";
    }
};

pub const SLOAD = struct {
    constantGas: u32 = 800, // SloadGas (post-London)
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop key, push value from storage at that key
        return "";
    }
};

pub const SSTORE = struct {
    constantGas: u32 = 0, // All costs are dynamic
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 20000, // Base cost, actual cost depends on value being set
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop key and value, store value in storage at key
        return "";
    }
};

pub const JUMP = struct {
    constantGas: u32 = 8, // GasMidStep
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop destination, set PC to destination
        // Must validate destination is a JUMPDEST
        return "";
    }
};

pub const JUMPI = struct {
    constantGas: u32 = 10, // GasSlowStep
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop destination and condition
        // If condition is not zero, set PC to destination
        // Must validate destination is a JUMPDEST
        return "";
    }
};

pub const PC = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, frame: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push current program counter
        _ = frame;
        return "";
    }
};

pub const MSIZE = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push current memory size in bytes
        return "";
    }
};

pub const GAS = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push remaining gas
        return "";
    }
};

pub const JUMPDEST = struct {
    constantGas: u32 = 1, // JumpdestGas
    minStack: u32 = 0,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // No operation, just a marker for valid jump destinations
        return "";
    }
};

pub const TLOAD = struct {
    constantGas: u32 = 100, // Approximate cost
    minStack: u32 = 1,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop key, push value from transient storage at that key (EIP-1153)
        return "";
    }
};

pub const TSTORE = struct {
    constantGas: u32 = 100, // Approximate cost
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop key and value, store value in transient storage at key (EIP-1153)
        return "";
    }
};

pub const MCOPY = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 3,
    maxStack: u32 = 0,
    dynamicGas: u32 = 3, // Per word, plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop dest, source, and size
        // Copy memory from source to dest for size bytes (EIP-5656)
        return "";
    }
};

// PUSH opcodes factory
pub fn PushOpcodeFactory(comptime n: u8) type {
    return struct {
        constantGas: u32 = 3, // GasFastestStep
        minStack: u32 = 0,
        maxStack: u32 = 1,
        dynamicGas: u32 = 0,
        pub fn execute(_: *Evm, frame: *Frame) ExecutionError![]const u8 {
            // TODO: Implement
            // Push n bytes onto stack from code after PC
            // Uses parameter n to determine how many bytes to read
            _ = frame;
            _ = n; // Use n in implementation
            return "";
        }
    };
}

pub const PUSH0 = struct {
    constantGas: u32 = 2, // GasQuickStep
    minStack: u32 = 0,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Push zero onto the stack (EIP-3855)
        return "";
    }
};

pub const PUSH1 = PushOpcodeFactory(1);
pub const PUSH2 = PushOpcodeFactory(2);
pub const PUSH3 = PushOpcodeFactory(3);
pub const PUSH4 = PushOpcodeFactory(4);
pub const PUSH5 = PushOpcodeFactory(5);
pub const PUSH6 = PushOpcodeFactory(6);
pub const PUSH7 = PushOpcodeFactory(7);
pub const PUSH8 = PushOpcodeFactory(8);
pub const PUSH9 = PushOpcodeFactory(9);
pub const PUSH10 = PushOpcodeFactory(10);
pub const PUSH11 = PushOpcodeFactory(11);
pub const PUSH12 = PushOpcodeFactory(12);
pub const PUSH13 = PushOpcodeFactory(13);
pub const PUSH14 = PushOpcodeFactory(14);
pub const PUSH15 = PushOpcodeFactory(15);
pub const PUSH16 = PushOpcodeFactory(16);
pub const PUSH17 = PushOpcodeFactory(17);
pub const PUSH18 = PushOpcodeFactory(18);
pub const PUSH19 = PushOpcodeFactory(19);
pub const PUSH20 = PushOpcodeFactory(20);
pub const PUSH21 = PushOpcodeFactory(21);
pub const PUSH22 = PushOpcodeFactory(22);
pub const PUSH23 = PushOpcodeFactory(23);
pub const PUSH24 = PushOpcodeFactory(24);
pub const PUSH25 = PushOpcodeFactory(25);
pub const PUSH26 = PushOpcodeFactory(26);
pub const PUSH27 = PushOpcodeFactory(27);
pub const PUSH28 = PushOpcodeFactory(28);
pub const PUSH29 = PushOpcodeFactory(29);
pub const PUSH30 = PushOpcodeFactory(30);
pub const PUSH31 = PushOpcodeFactory(31);
pub const PUSH32 = PushOpcodeFactory(32);

// DUP opcodes factory
pub fn DupOpcodeFactory(comptime n: u8) type {
    return struct {
        constantGas: u32 = 3, // GasFastestStep
        minStack: u32 = n,
        maxStack: u32 = n + 1,
        dynamicGas: u32 = 0,
        pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
            // TODO: Implement
            // Duplicate the nth stack item
            return "";
        }
    };
}

pub const DUP1 = DupOpcodeFactory(1);
pub const DUP2 = DupOpcodeFactory(2);
pub const DUP3 = DupOpcodeFactory(3);
pub const DUP4 = DupOpcodeFactory(4);
pub const DUP5 = DupOpcodeFactory(5);
pub const DUP6 = DupOpcodeFactory(6);
pub const DUP7 = DupOpcodeFactory(7);
pub const DUP8 = DupOpcodeFactory(8);
pub const DUP9 = DupOpcodeFactory(9);
pub const DUP10 = DupOpcodeFactory(10);
pub const DUP11 = DupOpcodeFactory(11);
pub const DUP12 = DupOpcodeFactory(12);
pub const DUP13 = DupOpcodeFactory(13);
pub const DUP14 = DupOpcodeFactory(14);
pub const DUP15 = DupOpcodeFactory(15);
pub const DUP16 = DupOpcodeFactory(16);

// SWAP opcodes factory
pub fn SwapOpcodeFactory(comptime n: u8) type {
    return struct {
        constantGas: u32 = 3, // GasFastestStep
        minStack: u32 = n + 1,
        maxStack: u32 = n + 1,
        dynamicGas: u32 = 0,
        pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
            // TODO: Implement
            // Swap 1st and (n+1)th stack items
            return "";
        }
    };
}

pub const SWAP1 = SwapOpcodeFactory(1);
pub const SWAP2 = SwapOpcodeFactory(2);
pub const SWAP3 = SwapOpcodeFactory(3);
pub const SWAP4 = SwapOpcodeFactory(4);
pub const SWAP5 = SwapOpcodeFactory(5);
pub const SWAP6 = SwapOpcodeFactory(6);
pub const SWAP7 = SwapOpcodeFactory(7);
pub const SWAP8 = SwapOpcodeFactory(8);
pub const SWAP9 = SwapOpcodeFactory(9);
pub const SWAP10 = SwapOpcodeFactory(10);
pub const SWAP11 = SwapOpcodeFactory(11);
pub const SWAP12 = SwapOpcodeFactory(12);
pub const SWAP13 = SwapOpcodeFactory(13);
pub const SWAP14 = SwapOpcodeFactory(14);
pub const SWAP15 = SwapOpcodeFactory(15);
pub const SWAP16 = SwapOpcodeFactory(16);

// LOG opcodes factory
pub fn LogOpcodeFactory(comptime n: u32) type {
    return struct {
        constantGas: u32 = 375 + 375 * n, // LogGas + n*LogTopicGas
        minStack: u32 = 2 + n,
        maxStack: u32 = 0,
        dynamicGas: u32 = 8, // LogDataGas per byte, plus memory expansion
        pub fn getMemorySize(stack: *const Stack) MemorySize {
            // TODO: Implement
            _ = stack;
            return MemorySize{ .size = 0, .overflow = false };
        }
        pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
            // TODO: Implement
            // Pop offset, size, and n topics, log data from memory with n topics
            return "";
        }
    };
}

pub const LOG0 = LogOpcodeFactory(0);
pub const LOG1 = LogOpcodeFactory(1);
pub const LOG2 = LogOpcodeFactory(2);
pub const LOG3 = LogOpcodeFactory(3);
pub const LOG4 = LogOpcodeFactory(4);

pub const CREATE = struct {
    constantGas: u32 = 32000, // CreateGas
    minStack: u32 = 3,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on execution, plus memory expansion
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop value, offset, and size
        // Create a new contract with code from memory and value
        return "";
    }
};

pub const CALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 7,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on value transfer and new account
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop gas, address, value, inOffset, inSize, outOffset, outSize
        // Call the specified address with the given inputs
        return "";
    }
};

pub const CALLCODE = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 7,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation based on value transfer
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop gas, address, value, inOffset, inSize, outOffset, outSize
        // Call the specified code with the current contract's context
        return "";
    }
};

pub const RETURN = struct {
    constantGas: u32 = 0,
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Memory expansion only
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop offset and size, return data from memory
        return "";
    }
};

pub const DELEGATECALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop gas, address, inOffset, inSize, outOffset, outSize
        // Call the specified code with the sender and value of the current contract
        return "";
    }
};

pub const CREATE2 = struct {
    constantGas: u32 = 32000, // CreateGas
    minStack: u32 = 4,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation including hash cost
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop value, offset, size, and salt
        // Create a new contract with deterministic address
        return "";
    }
};

pub const RETURNDATALOAD = struct {
    constantGas: u32 = 3, // GasFastestStep
    minStack: u32 = 2,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop offset from stack, load return data at that offset
        return "";
    }
};

pub const EXTCALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 7,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // External call operation
        return "";
    }
};

pub const EXTDELEGATECALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // External delegate call operation
        return "";
    }
};

pub const STATICCALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0, // Complex calculation
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop gas, address, inOffset, inSize, outOffset, outSize
        // Call the specified address with static restrictions (no state changes)
        return "";
    }
};

pub const EXTSTATICCALL = struct {
    constantGas: u32 = 700, // CallGas (post-Tangerine Whistle)
    minStack: u32 = 6,
    maxStack: u32 = 1,
    dynamicGas: u32 = 0,
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // External static call operation
        return "";
    }
};

pub const REVERT = struct {
    constantGas: u32 = 0,
    minStack: u32 = 2,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Memory expansion only
    pub fn getMemorySize(stack: *const Stack) MemorySize {
        // TODO: Implement
        _ = stack;
        return MemorySize{ .size = 0, .overflow = false };
    }
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // Pop offset and size, revert state changes and return data from memory
        return ExecutionError.REVERT;
    }
};

pub const INVALID = struct {
    constantGas: u32 = 0,
    minStack: u32 = 0,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // Invalid operation
        return ExecutionError.INVALID;
    }
};

pub const SELFDESTRUCT = struct {
    constantGas: u32 = 5000, // Base cost, dynamic in recent versions
    minStack: u32 = 1,
    maxStack: u32 = 0,
    dynamicGas: u32 = 0, // Additional cost based on whether account already has balance
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        // TODO: Implement
        // Pop beneficiary address, destroy current contract and send funds to beneficiary
        return "";
    }
};

pub const OpcodeExecutor = struct {
    const Self = @This();

    // we are treating this like this because in future this should be dynamically dispatching via a jump table and pointer
    opcode: Opcode,
    pub fn create(opcode: Opcode) Self {
        return Self{ .opcode = opcode };
    }

    // TODO: Perf improvement we should use a jump table though
    pub fn execute(self: Self, evm: *Evm, frame: *Frame) ExecutionError!void {
        return switch (self.opcode) {
            Opcode.STOP => {
                _ = try STOP.execute(evm, frame);
            },
            Opcode.ADD => {
                _ = try ADD.execute(evm, frame);
            },
            Opcode.MUL => {
                _ = try MUL.execute(evm, frame);
            },
            Opcode.SUB => {
                _ = try SUB.execute(evm, frame);
            },
            Opcode.DIV => {
                _ = try DIV.execute(evm, frame);
            },
            Opcode.SDIV => {
                _ = try SDIV.execute(evm, frame);
            },
            Opcode.MOD => {
                _ = try MOD.execute(evm, frame);
            },
            Opcode.SMOD => {
                _ = try SMOD.execute(evm, frame);
            },
            Opcode.ADDMOD => {
                _ = try ADDMOD.execute(evm, frame);
            },
            Opcode.MULMOD => {
                _ = try MULMOD.execute(evm, frame);
            },
            Opcode.EXP => {
                _ = try EXP.execute(evm, frame);
            },
            Opcode.SIGNEXTEND => {
                _ = try SIGNEXTEND.execute(evm, frame);
            },
            Opcode.LT => {
                _ = try LT.execute(evm, frame);
            },
            Opcode.GT => {
                _ = try GT.execute(evm, frame);
            },
            Opcode.SLT => {
                _ = try SLT.execute(evm, frame);
            },
            Opcode.SGT => {
                _ = try SGT.execute(evm, frame);
            },
            Opcode.EQ => {
                _ = try EQ.execute(evm, frame);
            },
            Opcode.ISZERO => {
                _ = try ISZERO.execute(evm, frame);
            },
            Opcode.AND => {
                _ = try AND.execute(evm, frame);
            },
            Opcode.OR => {
                _ = try OR.execute(evm, frame);
            },
            Opcode.XOR => {
                _ = try XOR.execute(evm, frame);
            },
            Opcode.NOT => {
                _ = try NOT.execute(evm, frame);
            },
            Opcode.BYTE => {
                _ = try BYTE.execute(evm, frame);
            },
            Opcode.SHL => {
                _ = try SHL.execute(evm, frame);
            },
            Opcode.SHR => {
                _ = try SHR.execute(evm, frame);
            },
            Opcode.SAR => {
                _ = try SAR.execute(evm, frame);
            },
            Opcode.KECCAK256 => {
                _ = try KECCAK256.execute(evm, frame);
            },
            Opcode.ADDRESS => {
                _ = try ADDRESS.execute(evm, frame);
            },
            Opcode.BALANCE => {
                _ = try BALANCE.execute(evm, frame);
            },
            Opcode.ORIGIN => {
                _ = try ORIGIN.execute(evm, frame);
            },
            Opcode.CALLER => {
                _ = try CALLER.execute(evm, frame);
            },
            Opcode.CALLVALUE => {
                _ = try CALLVALUE.execute(evm, frame);
            },
            Opcode.CALLDATALOAD => {
                _ = try CALLDATALOAD.execute(evm, frame);
            },
            Opcode.CALLDATASIZE => {
                _ = try CALLDATASIZE.execute(evm, frame);
            },
            Opcode.CALLDATACOPY => {
                _ = try CALLDATACOPY.execute(evm, frame);
            },
            Opcode.CODESIZE => {
                _ = try CODESIZE.execute(evm, frame);
            },
            Opcode.CODECOPY => {
                _ = try CODECOPY.execute(evm, frame);
            },
            Opcode.GASPRICE => {
                _ = try GASPRICE.execute(evm, frame);
            },
            Opcode.EXTCODESIZE => {
                _ = try EXTCODESIZE.execute(evm, frame);
            },
            Opcode.EXTCODECOPY => {
                _ = try EXTCODECOPY.execute(evm, frame);
            },
            Opcode.RETURNDATASIZE => {
                _ = try RETURNDATASIZE.execute(evm, frame);
            },
            Opcode.RETURNDATACOPY => {
                _ = try RETURNDATACOPY.execute(evm, frame);
            },
            Opcode.EXTCODEHASH => {
                _ = try EXTCODEHASH.execute(evm, frame);
            },
            Opcode.BLOCKHASH => {
                _ = try BLOCKHASH.execute(evm, frame);
            },
            Opcode.COINBASE => {
                _ = try COINBASE.execute(evm, frame);
            },
            Opcode.TIMESTAMP => {
                _ = try TIMESTAMP.execute(evm, frame);
            },
            Opcode.NUMBER => {
                _ = try NUMBER.execute(evm, frame);
            },
            Opcode.PREVRANDAO => {
                _ = try PREVRANDAO.execute(evm, frame);
            },
            Opcode.GASLIMIT => {
                _ = try GASLIMIT.execute(evm, frame);
            },
            Opcode.CHAINID => {
                _ = try CHAINID.execute(evm, frame);
            },
            Opcode.SELFBALANCE => {
                _ = try SELFBALANCE.execute(evm, frame);
            },
            Opcode.BASEFEE => {
                _ = try BASEFEE.execute(evm, frame);
            },
            Opcode.BLOBHASH => {
                _ = try BLOBHASH.execute(evm, frame);
            },
            Opcode.BLOBBASEFEE => {
                _ = try BLOBBASEFEE.execute(evm, frame);
            },
            Opcode.POP => {
                _ = try POP.execute(evm, frame);
            },
            Opcode.MLOAD => {
                _ = try MLOAD.execute(evm, frame);
            },
            Opcode.MSTORE => {
                _ = try MSTORE.execute(evm, frame);
            },
            Opcode.MSTORE8 => {
                _ = try MSTORE8.execute(evm, frame);
            },
            Opcode.SLOAD => {
                _ = try SLOAD.execute(evm, frame);
            },
            Opcode.SSTORE => {
                _ = try SSTORE.execute(evm, frame);
            },
            Opcode.JUMP => {
                _ = try JUMP.execute(evm, frame);
            },
            Opcode.JUMPI => {
                _ = try JUMPI.execute(evm, frame);
            },
            Opcode.PC => {
                _ = try PC.execute(evm, frame);
            },
            Opcode.MSIZE => {
                _ = try MSIZE.execute(evm, frame);
            },
            Opcode.GAS => {
                _ = try GAS.execute(evm, frame);
            },
            Opcode.JUMPDEST => {
                _ = try JUMPDEST.execute(evm, frame);
            },
            Opcode.TLOAD => {
                _ = try TLOAD.execute(evm, frame);
            },
            Opcode.TSTORE => {
                _ = try TSTORE.execute(evm, frame);
            },
            Opcode.MCOPY => {
                _ = try MCOPY.execute(evm, frame);
            },
            Opcode.PUSH0 => {
                _ = try PUSH0.execute(evm, frame);
            },
            Opcode.PUSH1 => {
                _ = try PUSH1.execute(evm, frame);
            },
            Opcode.PUSH2 => {
                _ = try PUSH2.execute(evm, frame);
            },
            Opcode.PUSH3 => {
                _ = try PUSH3.execute(evm, frame);
            },
            Opcode.PUSH4 => {
                _ = try PUSH4.execute(evm, frame);
            },
            Opcode.PUSH5 => {
                _ = try PUSH5.execute(evm, frame);
            },
            Opcode.PUSH6 => {
                _ = try PUSH6.execute(evm, frame);
            },
            Opcode.PUSH7 => {
                _ = try PUSH7.execute(evm, frame);
            },
            Opcode.PUSH8 => {
                _ = try PUSH8.execute(evm, frame);
            },
            Opcode.PUSH9 => {
                _ = try PUSH9.execute(evm, frame);
            },
            Opcode.PUSH10 => {
                _ = try PUSH10.execute(evm, frame);
            },
            Opcode.PUSH11 => {
                _ = try PUSH11.execute(evm, frame);
            },
            Opcode.PUSH12 => {
                _ = try PUSH12.execute(evm, frame);
            },
            Opcode.PUSH13 => {
                _ = try PUSH13.execute(evm, frame);
            },
            Opcode.PUSH14 => {
                _ = try PUSH14.execute(evm, frame);
            },
            Opcode.PUSH15 => {
                _ = try PUSH15.execute(evm, frame);
            },
            Opcode.PUSH16 => {
                _ = try PUSH16.execute(evm, frame);
            },
            Opcode.PUSH17 => {
                _ = try PUSH17.execute(evm, frame);
            },
            Opcode.PUSH18 => {
                _ = try PUSH18.execute(evm, frame);
            },
            Opcode.PUSH19 => {
                _ = try PUSH19.execute(evm, frame);
            },
            Opcode.PUSH20 => {
                _ = try PUSH20.execute(evm, frame);
            },
            Opcode.PUSH21 => {
                _ = try PUSH21.execute(evm, frame);
            },
            Opcode.PUSH22 => {
                _ = try PUSH22.execute(evm, frame);
            },
            Opcode.PUSH23 => {
                _ = try PUSH23.execute(evm, frame);
            },
            Opcode.PUSH24 => {
                _ = try PUSH24.execute(evm, frame);
            },
            Opcode.PUSH25 => {
                _ = try PUSH25.execute(evm, frame);
            },
            Opcode.PUSH26 => {
                _ = try PUSH26.execute(evm, frame);
            },
            Opcode.PUSH27 => {
                _ = try PUSH27.execute(evm, frame);
            },
            Opcode.PUSH28 => {
                _ = try PUSH28.execute(evm, frame);
            },
            Opcode.PUSH29 => {
                _ = try PUSH29.execute(evm, frame);
            },
            Opcode.PUSH30 => {
                _ = try PUSH30.execute(evm, frame);
            },
            Opcode.PUSH31 => {
                _ = try PUSH31.execute(evm, frame);
            },
            Opcode.PUSH32 => {
                _ = try PUSH32.execute(evm, frame);
            },
            Opcode.DUP1 => {
                _ = try DUP1.execute(evm, frame);
            },
            Opcode.DUP2 => {
                _ = try DUP2.execute(evm, frame);
            },
            Opcode.DUP3 => {
                _ = try DUP3.execute(evm, frame);
            },
            Opcode.DUP4 => {
                _ = try DUP4.execute(evm, frame);
            },
            Opcode.DUP5 => {
                _ = try DUP5.execute(evm, frame);
            },
            Opcode.DUP6 => {
                _ = try DUP6.execute(evm, frame);
            },
            Opcode.DUP7 => {
                _ = try DUP7.execute(evm, frame);
            },
            Opcode.DUP8 => {
                _ = try DUP8.execute(evm, frame);
            },
            Opcode.DUP9 => {
                _ = try DUP9.execute(evm, frame);
            },
            Opcode.DUP10 => {
                _ = try DUP10.execute(evm, frame);
            },
            Opcode.DUP11 => {
                _ = try DUP11.execute(evm, frame);
            },
            Opcode.DUP12 => {
                _ = try DUP12.execute(evm, frame);
            },
            Opcode.DUP13 => {
                _ = try DUP13.execute(evm, frame);
            },
            Opcode.DUP14 => {
                _ = try DUP14.execute(evm, frame);
            },
            Opcode.DUP15 => {
                _ = try DUP15.execute(evm, frame);
            },
            Opcode.DUP16 => {
                _ = try DUP16.execute(evm, frame);
            },
            Opcode.SWAP1 => {
                _ = try SWAP1.execute(evm, frame);
            },
            Opcode.SWAP2 => {
                _ = try SWAP2.execute(evm, frame);
            },
            Opcode.SWAP3 => {
                _ = try SWAP3.execute(evm, frame);
            },
            Opcode.SWAP4 => {
                _ = try SWAP4.execute(evm, frame);
            },
            Opcode.SWAP5 => {
                _ = try SWAP5.execute(evm, frame);
            },
            Opcode.SWAP6 => {
                _ = try SWAP6.execute(evm, frame);
            },
            Opcode.SWAP7 => {
                _ = try SWAP7.execute(evm, frame);
            },
            Opcode.SWAP8 => {
                _ = try SWAP8.execute(evm, frame);
            },
            Opcode.SWAP9 => {
                _ = try SWAP9.execute(evm, frame);
            },
            Opcode.SWAP10 => {
                _ = try SWAP10.execute(evm, frame);
            },
            Opcode.SWAP11 => {
                _ = try SWAP11.execute(evm, frame);
            },
            Opcode.SWAP12 => {
                _ = try SWAP12.execute(evm, frame);
            },
            Opcode.SWAP13 => {
                _ = try SWAP13.execute(evm, frame);
            },
            Opcode.SWAP14 => {
                _ = try SWAP14.execute(evm, frame);
            },
            Opcode.SWAP15 => {
                _ = try SWAP15.execute(evm, frame);
            },
            Opcode.SWAP16 => {
                _ = try SWAP16.execute(evm, frame);
            },
            Opcode.LOG0 => {
                _ = try LOG0.execute(evm, frame);
            },
            Opcode.LOG1 => {
                _ = try LOG1.execute(evm, frame);
            },
            Opcode.LOG2 => {
                _ = try LOG2.execute(evm, frame);
            },
            Opcode.LOG3 => {
                _ = try LOG3.execute(evm, frame);
            },
            Opcode.LOG4 => {
                _ = try LOG4.execute(evm, frame);
            },
            Opcode.CREATE => {
                _ = try CREATE.execute(evm, frame);
            },
            Opcode.CALL => {
                _ = try CALL.execute(evm, frame);
            },
            Opcode.CALLCODE => {
                _ = try CALLCODE.execute(evm, frame);
            },
            Opcode.RETURN => {
                _ = try RETURN.execute(evm, frame);
            },
            Opcode.DELEGATECALL => {
                _ = try DELEGATECALL.execute(evm, frame);
            },
            Opcode.CREATE2 => {
                _ = try CREATE2.execute(evm, frame);
            },
            Opcode.RETURNDATALOAD => {
                _ = try RETURNDATALOAD.execute(evm, frame);
            },
            Opcode.EXTCALL => {
                _ = try EXTCALL.execute(evm, frame);
            },
            Opcode.EXTDELEGATECALL => {
                _ = try EXTDELEGATECALL.execute(evm, frame);
            },
            Opcode.STATICCALL => {
                _ = try STATICCALL.execute(evm, frame);
            },
            Opcode.EXTSTATICCALL => {
                _ = try EXTSTATICCALL.execute(evm, frame);
            },
            Opcode.REVERT => {
                _ = try REVERT.execute(evm, frame);
            },
            Opcode.INVALID => {
                _ = try INVALID.execute(evm, frame);
            },
            Opcode.SELFDESTRUCT => {
                _ = try SELFDESTRUCT.execute(evm, frame);
            },
        };
    }
};

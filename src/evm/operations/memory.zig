/// Memory operations module for the EVM
/// 
/// This module defines operations for reading from and writing to the EVM's
/// volatile memory space. Memory in the EVM is a byte-addressable array that
/// expands as needed and is cleared between transactions. These operations
/// are essential for temporary data storage during contract execution.

const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const memory_ops = opcodes.memory;

/// MLOAD operation (0x51): Load Word from Memory
/// 
/// Loads 32 bytes from memory starting at the specified offset and pushes
/// the value onto the stack. Memory is automatically expanded if needed,
/// with new areas initialized to zero.
/// 
/// Stack: [..., offset] → [..., value]
/// Gas: 3 + memory expansion cost
/// 
/// Memory expansion cost increases quadratically with size to prevent
/// excessive memory usage attacks.
pub const MLOAD = Operation{
    .execute = memory_ops.op_mload,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// MSTORE operation (0x52): Store Word to Memory
/// 
/// Stores a 32-byte word to memory at the specified offset.
/// Memory is automatically expanded if the write extends beyond current size.
/// 
/// Stack: [..., offset, value] → [...]
/// Gas: 3 + memory expansion cost
/// 
/// The value is right-padded with zeros if needed to fill 32 bytes.
/// Common pattern: MSTORE is often paired with MLOAD for data manipulation.
pub const MSTORE = Operation{
    .execute = memory_ops.op_mstore,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// MSTORE8 operation (0x53): Store Byte to Memory
/// 
/// Stores a single byte (least significant byte of the value) to memory
/// at the specified offset. Only affects one byte, unlike MSTORE.
/// 
/// Stack: [..., offset, value] → [...]
/// Gas: 3 + memory expansion cost
/// 
/// Useful for:
/// - Building strings byte by byte
/// - Precise memory manipulation
/// - Implementing custom data structures
pub const MSTORE8 = Operation{
    .execute = memory_ops.op_mstore8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// MSIZE operation (0x59): Get Memory Size
/// 
/// Returns the current size of memory in bytes. This is the highest
/// accessed memory address plus one, rounded up to the next multiple of 32.
/// 
/// Stack: [...] → [..., size]
/// Gas: 2
/// 
/// Memory size only grows, never shrinks during execution.
/// Useful for memory management and calculating memory expansion costs.
pub const MSIZE = Operation{
    .execute = memory_ops.op_msize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// MCOPY operation (0x5E): Copy Memory to Memory
/// 
/// Copies data from one memory location to another within the same context.
/// Handles overlapping regions correctly (like memmove in C).
/// 
/// Stack: [..., dest, src, size] → [...]
/// Gas: 3 + 3 × (size + 31) ÷ 32 + memory expansion cost
/// 
/// Where:
/// - dest: Destination offset in memory
/// - src: Source offset in memory
/// - size: Number of bytes to copy
/// 
/// Introduced in Cancun (EIP-5656) for efficient memory management.
pub const MCOPY = Operation{
    .execute = memory_ops.op_mcopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

/// CALLDATACOPY operation (0x37): Copy Call Data to Memory
/// 
/// Copies call data (input data from the transaction or message call)
/// to memory. Pads with zeros if reading beyond call data bounds.
/// 
/// Stack: [..., destOffset, offset, size] → [...]
/// Gas: 3 + 3 × (size + 31) ÷ 32 + memory expansion cost
/// 
/// Where:
/// - destOffset: Destination in memory
/// - offset: Source offset in call data
/// - size: Number of bytes to copy
/// 
/// Essential for processing function arguments and complex input data.
pub const CALLDATACOPY = Operation{
    .execute = memory_ops.op_calldatacopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

/// RETURNDATASIZE operation (0x3D): Get Return Data Size
/// 
/// Pushes the size of the return data from the most recent external call.
/// This includes calls made via CALL, STATICCALL, DELEGATECALL, or CALLCODE.
/// 
/// Stack: [...] → [..., size]
/// Gas: 2
/// 
/// Introduced in Byzantium (EIP-211).
/// Returns 0 if no calls have been made yet in this context.
pub const RETURNDATASIZE = Operation{
    .execute = memory_ops.op_returndatasize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// RETURNDATACOPY operation (0x3E): Copy Return Data to Memory
/// 
/// Copies return data from the most recent external call to memory.
/// Reverts if attempting to read beyond the return data bounds.
/// 
/// Stack: [..., destOffset, offset, size] → [...]
/// Gas: 3 + 3 × (size + 31) ÷ 32 + memory expansion cost
/// 
/// Where:
/// - destOffset: Destination in memory
/// - offset: Source offset in return data
/// - size: Number of bytes to copy
/// 
/// Introduced in Byzantium (EIP-211).
/// Stricter than CALLDATACOPY - reverts on out-of-bounds access.
pub const RETURNDATACOPY = Operation{
    .execute = memory_ops.op_returndatacopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

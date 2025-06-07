/// Storage operations module for the EVM
/// 
/// This module defines operations for interacting with contract storage,
/// including both persistent storage (SLOAD/SSTORE) and transient storage
/// (TLOAD/TSTORE). Storage is where contracts keep their state between
/// transactions, organized as a key-value mapping of 256-bit words.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const storage = opcodes.storage;

/// SLOAD operation (0x54): Load from Storage
/// 
/// Reads a 256-bit value from the contract's persistent storage at the
/// specified key and pushes it onto the stack.
/// 
/// Stack: [..., key] → [..., value]
/// Gas: Dynamic based on access pattern
///   - Berlin+: 100 (warm) or 2100 (cold)
///   - Pre-Berlin: See historical variants in misc.zig
/// 
/// Storage slots are initialized to zero if never written.
/// Gas costs vary significantly based on hardfork and whether
/// the storage slot has been accessed before in the transaction.
pub const SLOAD = Operation{
    .execute = storage.op_sload,
    .constant_gas = 0, // Gas handled dynamically in operation (cold/warm access)
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// SSTORE operation (0x55): Store to Storage
/// 
/// Writes a 256-bit value to the contract's persistent storage at the
/// specified key. This is one of the most expensive operations due to
/// the cost of writing to the blockchain's state.
/// 
/// Stack: [..., key, value] → [...]
/// Gas: Dynamic based on multiple factors
///   - Current value vs new value (zero/non-zero transitions)
///   - Whether slot is warm or cold
///   - Whether transaction will be reverted
///   - Gas refunds for clearing storage (setting to zero)
/// 
/// Gas costs can range from 100 (warm, no-op) to 20000+ (cold, zero to non-zero).
/// Storage is persistent across transactions and blocks.
/// 
/// Security note: Be careful with storage layout to avoid collisions.
pub const SSTORE = Operation{
    .execute = storage.op_sstore,
    .constant_gas = 0, // Gas handled dynamically in operation
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// TLOAD operation (0x5C): Load from Transient Storage
/// 
/// Reads a 256-bit value from transient storage at the specified key.
/// Transient storage is cleared after each transaction, making it useful
/// for temporary data and reentrancy locks.
/// 
/// Stack: [..., key] → [..., value]
/// Gas: 100
/// 
/// Introduced in Cancun (EIP-1153).
/// Transient storage provides a gas-efficient alternative to regular
/// storage for data that doesn't need to persist between transactions.
pub const TLOAD = Operation{
    .execute = storage.op_tload,
    .constant_gas = 100,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// TSTORE operation (0x5D): Store to Transient Storage
/// 
/// Writes a 256-bit value to transient storage at the specified key.
/// The value will be automatically cleared at the end of the transaction.
/// 
/// Stack: [..., key, value] → [...]
/// Gas: 100
/// 
/// Introduced in Cancun (EIP-1153).
/// Common uses:
/// - Reentrancy guards
/// - Temporary flags and counters
/// - Cross-contract communication within a transaction
/// - Gas-efficient temporary storage
/// 
/// Much cheaper than SSTORE since data doesn't persist.
pub const TSTORE = Operation{
    .execute = storage.op_tstore,
    .constant_gas = 100,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// EVM Operations Package
/// 
/// This module serves as the central export point for all EVM operation modules.
/// It organizes operations into logical categories for easier navigation and use.
/// Each submodule contains related operations that share similar functionality.
/// 
/// Categories:
/// - arithmetic: Mathematical operations (ADD, MUL, DIV, etc.)
/// - comparison: Value comparison operations (LT, GT, EQ, etc.)
/// - bitwise: Bit manipulation operations (AND, OR, XOR, etc.)
/// - memory: Memory access operations (MLOAD, MSTORE, etc.)
/// - storage: Persistent storage operations (SLOAD, SSTORE, etc.)
/// - control: Flow control operations (JUMP, JUMPI, RETURN, etc.)
/// - stack: Stack manipulation operations (POP, PUSH, DUP, SWAP, etc.)
/// - environment: Execution environment queries (CALLER, CALLVALUE, etc.)
/// - block: Block information operations (NUMBER, TIMESTAMP, etc.)
/// - crypto: Cryptographic operations (SHA3/KECCAK256)
/// - log: Event emission operations (LOG0-LOG4)
/// - system: System operations (CREATE, CALL, etc.)
/// - misc: Miscellaneous operations (GAS, UNDEFINED, etc.)

// Re-export all operation modules
pub const arithmetic = @import("arithmetic.zig");
pub const comparison = @import("comparison.zig");
pub const bitwise = @import("bitwise.zig");
pub const memory = @import("memory.zig");
pub const storage = @import("storage.zig");
pub const control = @import("control.zig");
pub const stack = @import("stack.zig");
pub const environment = @import("environment.zig");
pub const block = @import("block.zig");
pub const crypto = @import("crypto.zig");
pub const log = @import("log.zig");
pub const system = @import("system.zig");
pub const misc = @import("misc.zig");

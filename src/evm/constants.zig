//! EVM opcode constants and bytecode analysis utilities.
//!
//! This module serves as the central definition point for all EVM opcodes
//! and provides utility functions for bytecode analysis. All opcodes are
//! defined as comptime constants for zero-cost abstraction and compile-time
//! verification.
//!
//! ## Organization
//! Opcodes are grouped by their functional categories:
//! - Arithmetic operations (0x00-0x0B)
//! - Comparison & bitwise logic (0x10-0x1D)
//! - Keccak hashing (0x20)
//! - Environmental information (0x30-0x3F)
//! - Block information (0x40-0x4A)
//! - Stack, memory, storage operations (0x50-0x5F)
//! - Push operations (0x60-0x7F)
//! - Duplication operations (0x80-0x8F)
//! - Exchange operations (0x90-0x9F)
//! - Logging operations (0xA0-0xA4)
//! - System operations (0xF0-0xFF)
//!
//! ## Usage
//! ```zig
//! const opcode = bytecode[pc];
//! if (constants.is_push(opcode)) {
//!     const push_size = constants.get_push_size(opcode);
//!     // Skip over the push data
//!     pc += 1 + push_size;
//! }
//! ```
//!
//! ## Hardfork Considerations
//! Some opcodes are only available after specific hardforks:
//! - PUSH0 (0x5F): Shanghai
//! - TLOAD/TSTORE (0x5C/0x5D): Cancun
//! - MCOPY (0x5E): Cancun
//! - BASEFEE (0x48): London
//! - CHAINID (0x46): Istanbul
//!
//! Reference: https://www.evm.codes/

// ============================================================================
// Arithmetic Operations (0x00-0x0B)
// ============================================================================

/// Halts execution of the current context.
/// Stack: [] -> []
/// Gas: 0
pub const STOP: u8 = 0x00;

/// Addition operation with modulo 2^256.
/// Stack: [a, b] -> [a + b]
/// Gas: 3
pub const ADD: u8 = 0x01;
/// Multiplication operation with modulo 2^256.
/// Stack: [a, b] -> [a * b]
/// Gas: 5
pub const MUL: u8 = 0x02;

/// Subtraction operation with modulo 2^256.
/// Stack: [a, b] -> [a - b]
/// Gas: 3
pub const SUB: u8 = 0x03;

/// Integer division operation.
/// Stack: [a, b] -> [a / b] (0 if b == 0)
/// Gas: 5
pub const DIV: u8 = 0x04;
pub const SDIV: u8 = 0x05;
pub const MOD: u8 = 0x06;
pub const SMOD: u8 = 0x07;
pub const ADDMOD: u8 = 0x08;
pub const MULMOD: u8 = 0x09;
/// Exponential operation (a ** b).
/// Stack: [a, b] -> [a ** b]
/// Gas: 10 + 50 per byte in exponent
/// Note: Gas cost increases with size of exponent
pub const EXP: u8 = 0x0A;

/// Sign extension operation.
/// Stack: [b, x] -> [y] where y is sign-extended x from (b+1)*8 bits
/// Gas: 5
pub const SIGNEXTEND: u8 = 0x0B;

// ============================================================================
// Comparison & Bitwise Logic Operations (0x10-0x1D)
// ============================================================================
pub const LT: u8 = 0x10;
pub const GT: u8 = 0x11;
pub const SLT: u8 = 0x12;
pub const SGT: u8 = 0x13;
pub const EQ: u8 = 0x14;
pub const ISZERO: u8 = 0x15;
pub const AND: u8 = 0x16;
pub const OR: u8 = 0x17;
pub const XOR: u8 = 0x18;
pub const NOT: u8 = 0x19;
pub const BYTE: u8 = 0x1A;
pub const SHL: u8 = 0x1B;
pub const SHR: u8 = 0x1C;
pub const SAR: u8 = 0x1D;

// ============================================================================
// Cryptographic Operations (0x20)
// ============================================================================

/// Computes Keccak-256 hash of memory region.
/// Stack: [offset, size] -> [hash]
/// Gas: 30 + 6 per word + memory expansion
pub const KECCAK256: u8 = 0x20;

// ============================================================================
// Environmental Information (0x30-0x3F)
// ============================================================================
pub const ADDRESS: u8 = 0x30;
pub const BALANCE: u8 = 0x31;
pub const ORIGIN: u8 = 0x32;
pub const CALLER: u8 = 0x33;
pub const CALLVALUE: u8 = 0x34;
pub const CALLDATALOAD: u8 = 0x35;
pub const CALLDATASIZE: u8 = 0x36;
pub const CALLDATACOPY: u8 = 0x37;
pub const CODESIZE: u8 = 0x38;
pub const CODECOPY: u8 = 0x39;
pub const GASPRICE: u8 = 0x3A;
pub const EXTCODESIZE: u8 = 0x3B;
pub const EXTCODECOPY: u8 = 0x3C;
pub const RETURNDATASIZE: u8 = 0x3D;
pub const RETURNDATACOPY: u8 = 0x3E;
pub const EXTCODEHASH: u8 = 0x3F;

// ============================================================================
// Block Information (0x40-0x4A)
// ============================================================================
pub const BLOCKHASH: u8 = 0x40;
pub const COINBASE: u8 = 0x41;
pub const TIMESTAMP: u8 = 0x42;
pub const NUMBER: u8 = 0x43;
pub const PREVRANDAO: u8 = 0x44;
pub const GASLIMIT: u8 = 0x45;
pub const CHAINID: u8 = 0x46;
pub const SELFBALANCE: u8 = 0x47;
pub const BASEFEE: u8 = 0x48;
pub const BLOBHASH: u8 = 0x49;
pub const BLOBBASEFEE: u8 = 0x4A;

// ============================================================================
// Stack, Memory, Storage and Flow Operations (0x50-0x5F)
// ============================================================================
pub const POP: u8 = 0x50;
pub const MLOAD: u8 = 0x51;
pub const MSTORE: u8 = 0x52;
pub const MSTORE8: u8 = 0x53;
/// Load value from storage.
/// Stack: [key] -> [value]
/// Gas: 100 (warm) or 2100 (cold) since Berlin
pub const SLOAD: u8 = 0x54;

/// Store value to storage.
/// Stack: [key, value] -> []
/// Gas: Complex - depends on current value and new value
/// Note: Most expensive operation, can cost 20000 gas
pub const SSTORE: u8 = 0x55;
pub const JUMP: u8 = 0x56;
pub const JUMPI: u8 = 0x57;
pub const PC: u8 = 0x58;
pub const MSIZE: u8 = 0x59;
pub const GAS: u8 = 0x5A;
/// Valid jump destination marker.
/// Stack: [] -> []
/// Gas: 1
/// Note: Only opcode that can be jumped to
pub const JUMPDEST: u8 = 0x5B;
pub const TLOAD: u8 = 0x5C;
pub const TSTORE: u8 = 0x5D;
pub const MCOPY: u8 = 0x5E;
/// Push zero onto the stack (Shanghai hardfork).
/// Stack: [] -> [0]
/// Gas: 2
/// Note: More efficient than PUSH1 0x00
pub const PUSH0: u8 = 0x5F;

// ============================================================================
// Push Operations (0x60-0x7F)
// ============================================================================
pub const PUSH1: u8 = 0x60;
pub const PUSH2: u8 = 0x61;
pub const PUSH3: u8 = 0x62;
pub const PUSH4: u8 = 0x63;
pub const PUSH5: u8 = 0x64;
pub const PUSH6: u8 = 0x65;
pub const PUSH7: u8 = 0x66;
pub const PUSH8: u8 = 0x67;
pub const PUSH9: u8 = 0x68;
pub const PUSH10: u8 = 0x69;
pub const PUSH11: u8 = 0x6A;
pub const PUSH12: u8 = 0x6B;
pub const PUSH13: u8 = 0x6C;
pub const PUSH14: u8 = 0x6D;
pub const PUSH15: u8 = 0x6E;
pub const PUSH16: u8 = 0x6F;
pub const PUSH17: u8 = 0x70;
pub const PUSH18: u8 = 0x71;
pub const PUSH19: u8 = 0x72;
pub const PUSH20: u8 = 0x73;
pub const PUSH21: u8 = 0x74;
pub const PUSH22: u8 = 0x75;
pub const PUSH23: u8 = 0x76;
pub const PUSH24: u8 = 0x77;
pub const PUSH25: u8 = 0x78;
pub const PUSH26: u8 = 0x79;
pub const PUSH27: u8 = 0x7A;
pub const PUSH28: u8 = 0x7B;
pub const PUSH29: u8 = 0x7C;
pub const PUSH30: u8 = 0x7D;
pub const PUSH31: u8 = 0x7E;
pub const PUSH32: u8 = 0x7F;

// ============================================================================
// Duplication Operations (0x80-0x8F)
// ============================================================================
pub const DUP1: u8 = 0x80;
pub const DUP2: u8 = 0x81;
pub const DUP3: u8 = 0x82;
pub const DUP4: u8 = 0x83;
pub const DUP5: u8 = 0x84;
pub const DUP6: u8 = 0x85;
pub const DUP7: u8 = 0x86;
pub const DUP8: u8 = 0x87;
pub const DUP9: u8 = 0x88;
pub const DUP10: u8 = 0x89;
pub const DUP11: u8 = 0x8A;
pub const DUP12: u8 = 0x8B;
pub const DUP13: u8 = 0x8C;
pub const DUP14: u8 = 0x8D;
pub const DUP15: u8 = 0x8E;
pub const DUP16: u8 = 0x8F;

// ============================================================================
// Exchange Operations (0x90-0x9F)
// ============================================================================
pub const SWAP1: u8 = 0x90;
pub const SWAP2: u8 = 0x91;
pub const SWAP3: u8 = 0x92;
pub const SWAP4: u8 = 0x93;
pub const SWAP5: u8 = 0x94;
pub const SWAP6: u8 = 0x95;
pub const SWAP7: u8 = 0x96;
pub const SWAP8: u8 = 0x97;
pub const SWAP9: u8 = 0x98;
pub const SWAP10: u8 = 0x99;
pub const SWAP11: u8 = 0x9A;
pub const SWAP12: u8 = 0x9B;
pub const SWAP13: u8 = 0x9C;
pub const SWAP14: u8 = 0x9D;
pub const SWAP15: u8 = 0x9E;
pub const SWAP16: u8 = 0x9F;

// ============================================================================
// Logging Operations (0xA0-0xA4)
// ============================================================================
pub const LOG0: u8 = 0xA0;
pub const LOG1: u8 = 0xA1;
pub const LOG2: u8 = 0xA2;
pub const LOG3: u8 = 0xA3;
pub const LOG4: u8 = 0xA4;

// ============================================================================
// System Operations (0xF0-0xFF)
// ============================================================================
pub const CREATE: u8 = 0xF0;
pub const CALL: u8 = 0xF1;
pub const CALLCODE: u8 = 0xF2;
pub const RETURN: u8 = 0xF3;
pub const DELEGATECALL: u8 = 0xF4;
pub const CREATE2: u8 = 0xF5;
pub const RETURNDATALOAD: u8 = 0xF7;
pub const EXTCALL: u8 = 0xF8;
pub const EXTDELEGATECALL: u8 = 0xF9;
pub const STATICCALL: u8 = 0xFA;
pub const EXTSTATICCALL: u8 = 0xFB;
pub const REVERT: u8 = 0xFD;
pub const INVALID: u8 = 0xFE;
/// Destroy contract and send balance to address.
/// Stack: [address] -> []
/// Gas: 5000 + dynamic costs
/// Note: Deprecated - only works in same transaction (Cancun)
pub const SELFDESTRUCT: u8 = 0xFF;

/// Checks if an opcode is a PUSH operation (PUSH1-PUSH32).
///
/// PUSH operations place N bytes of immediate data onto the stack,
/// where N is determined by the specific PUSH opcode.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` if the opcode is between PUSH1 (0x60) and PUSH32 (0x7F)
/// - `false` otherwise
///
/// ## Example
/// ```zig
/// if (is_push(opcode)) {
///     const data_size = get_push_size(opcode);
///     // Read `data_size` bytes following the opcode
/// }
/// ```
pub fn is_push(op: u8) bool {
    return op >= PUSH1 and op <= PUSH32;
}

/// Returns the number of immediate data bytes for a PUSH opcode.
///
/// PUSH1 pushes 1 byte, PUSH2 pushes 2 bytes, etc., up to PUSH32
/// which pushes 32 bytes of immediate data from the bytecode.
///
/// ## Parameters
/// - `op`: The opcode to analyze
///
/// ## Returns
/// - 1-32 for valid PUSH opcodes (PUSH1-PUSH32)
/// - 0 for non-PUSH opcodes
///
/// ## Algorithm
/// For valid PUSH opcodes: size = opcode - 0x60 + 1
///
/// ## Example
/// ```zig
/// const size = get_push_size(PUSH20); // Returns 20
/// const size2 = get_push_size(ADD);   // Returns 0
/// ```
pub fn get_push_size(op: u8) u8 {
    if (!is_push(op)) return 0;
    return op - PUSH1 + 1;
}

/// Checks if an opcode is a DUP operation (DUP1-DUP16).
///
/// DUP operations duplicate a stack item and push the copy onto the stack.
/// DUP1 duplicates the top item, DUP2 the second item, etc.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` if the opcode is between DUP1 (0x80) and DUP16 (0x8F)
/// - `false` otherwise
///
/// ## Stack Effect
/// DUPn: [... vn ... v1] -> [... vn ... v1 vn]
pub fn is_dup(op: u8) bool {
    return op >= DUP1 and op <= DUP16;
}

/// Get the stack position for a DUP opcode
/// Returns 0 for non-DUP opcodes
pub fn get_dup_position(op: u8) u8 {
    if (!is_dup(op)) return 0;
    return op - DUP1 + 1;
}

/// Check if an opcode is a SWAP operation
pub fn is_swap(op: u8) bool {
    return op >= SWAP1 and op <= SWAP16;
}

/// Get the stack position for a SWAP opcode
/// Returns 0 for non-SWAP opcodes
pub fn get_swap_position(op: u8) u8 {
    if (!is_swap(op)) return 0;
    return op - SWAP1 + 1;
}

/// Check if an opcode is a LOG operation
pub fn is_log(op: u8) bool {
    return op >= LOG0 and op <= LOG4;
}

/// Get the number of topics for a LOG opcode
/// Returns 0 for non-LOG opcodes
pub fn get_log_topic_count(op: u8) u8 {
    if (!is_log(op)) return 0;
    return op - LOG0;
}

/// Checks if an opcode terminates execution of the current context.
///
/// Terminating operations end the current execution context and cannot
/// be followed by any other operations in the execution flow.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` for STOP, RETURN, REVERT, SELFDESTRUCT, INVALID
/// - `false` otherwise
///
/// ## Terminating Opcodes
/// - STOP (0x00): Halts execution successfully
/// - RETURN (0xF3): Returns data and halts successfully
/// - REVERT (0xFD): Reverts state changes and returns data
/// - SELFDESTRUCT (0xFF): Destroys contract and sends balance
/// - INVALID (0xFE): Invalid operation, always reverts
///
/// ## Usage
/// ```zig
/// if (is_terminating(opcode)) {
///     // This is the last operation in this context
///     return;
/// }
/// ```
pub fn is_terminating(op: u8) bool {
    return op == STOP or op == RETURN or op == REVERT or op == SELFDESTRUCT or op == INVALID;
}

/// Check if an opcode is a call operation
pub fn is_call(op: u8) bool {
    return op == CALL or op == CALLCODE or op == DELEGATECALL or op == STATICCALL or
        op == EXTCALL or op == EXTDELEGATECALL or op == EXTSTATICCALL;
}

/// Check if an opcode is a create operation
pub fn is_create(op: u8) bool {
    return op == CREATE or op == CREATE2;
}

/// Checks if an opcode can modify blockchain state.
///
/// State-modifying operations are restricted in static calls and
/// require special handling for gas accounting and rollback.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns  
/// - `true` for operations that modify storage, create contracts, or emit logs
/// - `false` for read-only operations
///
/// ## State-Modifying Opcodes
/// - SSTORE: Modifies contract storage
/// - CREATE/CREATE2: Deploys new contracts
/// - SELFDESTRUCT: Destroys contract and transfers balance
/// - LOG0-LOG4: Emits events (modifies receipts)
///
/// ## Note
/// CALL can also modify state indirectly if it transfers value,
/// but this function only checks direct state modifications.
///
/// ## Static Call Protection
/// These operations will fail with an error if executed within
/// a STATICCALL context.
pub fn modifies_state(op: u8) bool {
    return op == SSTORE or op == CREATE or op == CREATE2 or op == SELFDESTRUCT or
        op == LOG0 or op == LOG1 or op == LOG2 or op == LOG3 or op == LOG4;
}

/// Check if an opcode is valid
pub fn is_valid(op: u8) bool {
    return op != INVALID;
}

// ============================================================================
// Contract Size and Gas Constants
// ============================================================================

/// Maximum allowed size for deployed contract bytecode.
///
/// ## Value
/// 24,576 bytes (24 KB)
///
/// ## Origin
/// Defined by EIP-170 (activated in Spurious Dragon hardfork)
///
/// ## Rationale
/// - Prevents excessive blockchain growth from large contracts
/// - Ensures contracts can be loaded into memory efficiently
/// - Encourages modular contract design
///
/// ## Implications
/// - Contract creation fails if initcode returns bytecode larger than this
/// - Does NOT limit initcode size (see EIP-3860 for that)
/// - Libraries and proxy patterns help work around this limit
///
/// Reference: https://eips.ethereum.org/EIPS/eip-170
pub const MAX_CODE_SIZE: u32 = 24576;

/// Gas cost per byte of deployed contract code.
///
/// ## Value
/// 200 gas per byte
///
/// ## Usage
/// Charged during contract creation (CREATE/CREATE2) based on the
/// size of the returned bytecode that will be stored on-chain.
///
/// ## Calculation
/// `deployment_gas_cost = len(returned_code) * 200`
///
/// ## Example
/// A 1000-byte contract costs an additional 200,000 gas to deploy
/// beyond the execution costs.
///
/// ## Note
/// This is separate from the initcode gas cost introduced in EIP-3860.
pub const DEPLOY_CODE_GAS_PER_BYTE: u64 = 200;

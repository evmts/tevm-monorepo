/// EVM Constants and Utilities Module
/// 
/// This module contains all EVM-related constants, limits, gas costs, and utility functions.
/// It serves as a single source of truth for all EVM specifications to avoid circular dependencies
/// and ensure consistency across the codebase.

const std = @import("std");

// ============================
// Section 1: Opcode Constants
// ============================

// Arithmetic opcodes
pub const ADD: u8 = 0x01;
pub const MUL: u8 = 0x02;
pub const SUB: u8 = 0x03;
pub const DIV: u8 = 0x04;
pub const SDIV: u8 = 0x05;
pub const MOD: u8 = 0x06;
pub const SMOD: u8 = 0x07;
pub const ADDMOD: u8 = 0x08;
pub const MULMOD: u8 = 0x09;
pub const EXP: u8 = 0x0a;
pub const SIGNEXTEND: u8 = 0x0b;

// Comparison & bitwise logic
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
pub const BYTE: u8 = 0x1a;
pub const SHL: u8 = 0x1b;
pub const SHR: u8 = 0x1c;
pub const SAR: u8 = 0x1d;

// SHA3
pub const KECCAK256: u8 = 0x20;

// Environmental information
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
pub const GASPRICE: u8 = 0x3a;
pub const EXTCODESIZE: u8 = 0x3b;
pub const EXTCODECOPY: u8 = 0x3c;
pub const RETURNDATASIZE: u8 = 0x3d;
pub const RETURNDATACOPY: u8 = 0x3e;
pub const EXTCODEHASH: u8 = 0x3f;

// Block information
pub const BLOCKHASH: u8 = 0x40;
pub const COINBASE: u8 = 0x41;
pub const TIMESTAMP: u8 = 0x42;
pub const NUMBER: u8 = 0x43;
pub const DIFFICULTY: u8 = 0x44; // Same as PREVRANDAO post-merge
pub const GASLIMIT: u8 = 0x45;
pub const CHAINID: u8 = 0x46;
pub const SELFBALANCE: u8 = 0x47;
pub const BASEFEE: u8 = 0x48;
pub const BLOBHASH: u8 = 0x49;
pub const BLOBBASEFEE: u8 = 0x4a;

// Stack, memory, storage and flow operations
pub const POP: u8 = 0x50;
pub const MLOAD: u8 = 0x51;
pub const MSTORE: u8 = 0x52;
pub const MSTORE8: u8 = 0x53;
pub const SLOAD: u8 = 0x54;
pub const SSTORE: u8 = 0x55;
pub const JUMP: u8 = 0x56;
pub const JUMPI: u8 = 0x57;
pub const PC: u8 = 0x58;
pub const MSIZE: u8 = 0x59;
pub const GAS: u8 = 0x5a;
pub const JUMPDEST: u8 = 0x5b;
pub const TLOAD: u8 = 0x5c;
pub const TSTORE: u8 = 0x5d;
pub const MCOPY: u8 = 0x5e;
pub const PUSH0: u8 = 0x5f;

// Push operations
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
pub const PUSH11: u8 = 0x6a;
pub const PUSH12: u8 = 0x6b;
pub const PUSH13: u8 = 0x6c;
pub const PUSH14: u8 = 0x6d;
pub const PUSH15: u8 = 0x6e;
pub const PUSH16: u8 = 0x6f;
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
pub const PUSH27: u8 = 0x7a;
pub const PUSH28: u8 = 0x7b;
pub const PUSH29: u8 = 0x7c;
pub const PUSH30: u8 = 0x7d;
pub const PUSH31: u8 = 0x7e;
pub const PUSH32: u8 = 0x7f;

// Duplication operations
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
pub const DUP11: u8 = 0x8a;
pub const DUP12: u8 = 0x8b;
pub const DUP13: u8 = 0x8c;
pub const DUP14: u8 = 0x8d;
pub const DUP15: u8 = 0x8e;
pub const DUP16: u8 = 0x8f;

// Exchange operations
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
pub const SWAP11: u8 = 0x9a;
pub const SWAP12: u8 = 0x9b;
pub const SWAP13: u8 = 0x9c;
pub const SWAP14: u8 = 0x9d;
pub const SWAP15: u8 = 0x9e;
pub const SWAP16: u8 = 0x9f;

// Logging operations
pub const LOG0: u8 = 0xa0;
pub const LOG1: u8 = 0xa1;
pub const LOG2: u8 = 0xa2;
pub const LOG3: u8 = 0xa3;
pub const LOG4: u8 = 0xa4;

// System operations
pub const CREATE: u8 = 0xf0;
pub const CALL: u8 = 0xf1;
pub const CALLCODE: u8 = 0xf2;
pub const RETURN: u8 = 0xf3;
pub const DELEGATECALL: u8 = 0xf4;
pub const CREATE2: u8 = 0xf5;
pub const STATICCALL: u8 = 0xfa;
pub const REVERT: u8 = 0xfd;
pub const INVALID: u8 = 0xfe;
pub const SELFDESTRUCT: u8 = 0xff;

// Common aliases
pub const STOP: u8 = 0x00;
pub const SHA3: u8 = KECCAK256;
pub const SUICIDE: u8 = SELFDESTRUCT;
pub const PREVRANDAO: u8 = DIFFICULTY; // Post-merge alias

// ==============================
// Section 2: EVM Limits and Sizes
// ==============================

// Stack limits
pub const STACK_LIMIT: usize = 1024;
pub const MAX_STACK_SIZE: usize = 1024;

// Call depth
pub const CALL_DEPTH_LIMIT: usize = 1024;
pub const MAX_CALL_DEPTH: usize = 1024;

// Code size limits
pub const MAX_CODE_SIZE: usize = 24576; // 24KB (EIP-170)
pub const MAX_INITCODE_SIZE: usize = 49152; // 48KB (EIP-3860)

// Memory and word sizes
pub const WORD_SIZE: usize = 32;
pub const WORD_SIZE_BITS: usize = 256;
pub const ADDRESS_SIZE: usize = 20;
pub const HASH_SIZE: usize = 32;

// Transaction limits
pub const MAX_BLOB_GAS_PER_BLOCK: u64 = 786432; // 6 * 131072 (EIP-4844)
pub const TARGET_BLOB_GAS_PER_BLOCK: u64 = 393216; // 3 * 131072
pub const BLOB_TX_MIN_BLOB_GASPRICE: u64 = 1;
pub const BLOB_TX_BLOB_GASPRICE_UPDATE_FRACTION: u64 = 3338477;

// Precompile addresses
pub const PRECOMPILE_ECRECOVER: u8 = 0x01;
pub const PRECOMPILE_SHA256: u8 = 0x02;
pub const PRECOMPILE_RIPEMD160: u8 = 0x03;
pub const PRECOMPILE_IDENTITY: u8 = 0x04;
pub const PRECOMPILE_MODEXP: u8 = 0x05;
pub const PRECOMPILE_ECADD: u8 = 0x06;
pub const PRECOMPILE_ECMUL: u8 = 0x07;
pub const PRECOMPILE_ECPAIRING: u8 = 0x08;
pub const PRECOMPILE_BLAKE2F: u8 = 0x09;
pub const PRECOMPILE_POINT_EVALUATION: u8 = 0x0a;

// =======================
// Section 3: Gas Constants
// =======================

// Base gas costs
pub const G_ZERO: u64 = 0;
pub const G_BASE: u64 = 2;
pub const G_VERYLOW: u64 = 3;
pub const G_LOW: u64 = 5;
pub const G_MID: u64 = 8;
pub const G_HIGH: u64 = 10;
pub const G_JUMPDEST: u64 = 1;

// Memory gas costs
pub const G_MEMORY: u64 = 3;
pub const G_QUADRATIC_WORD: u64 = 512; // Memory expansion quadratic cost divisor

// Storage gas costs (EIP-2200)
pub const G_SLOAD: u64 = 2100;
pub const G_SSET: u64 = 20000;
pub const G_SRESET: u64 = 2900;
pub const R_SCLEAR: u64 = 15000;
pub const G_SELFDESTRUCT: u64 = 5000;

// Transaction gas costs
pub const G_TRANSACTION: u64 = 21000;
pub const G_TRANSACTION_DATA_ZERO: u64 = 4;
pub const G_TRANSACTION_DATA_NONZERO: u64 = 16; // Pre-EIP-2028
pub const G_TRANSACTION_DATA_NONZERO_EIP2028: u64 = 16;

// Create operation gas costs
pub const G_CREATE: u64 = 32000;
pub const G_CODEDEPOSIT: u64 = 200;
pub const G_INITCODE_WORD: u64 = 2; // EIP-3860

// Call operation gas costs
pub const G_CALL: u64 = 700;
pub const G_CALLVALUE: u64 = 9000;
pub const G_CALLSTIPEND: u64 = 2300;
pub const G_NEWACCOUNT: u64 = 25000;

// Precompile gas costs
pub const G_ECRECOVER: u64 = 3000;
pub const G_SHA256_BASE: u64 = 60;
pub const G_SHA256_WORD: u64 = 12;
pub const G_RIPEMD160_BASE: u64 = 600;
pub const G_RIPEMD160_WORD: u64 = 120;
pub const G_IDENTITY_BASE: u64 = 15;
pub const G_IDENTITY_WORD: u64 = 3;

// Log operation gas costs
pub const G_LOG: u64 = 375;
pub const G_LOGTOPIC: u64 = 375;
pub const G_LOGDATA: u64 = 8;

// Other operation gas costs
pub const G_KECCAK256: u64 = 30;
pub const G_KECCAK256_WORD: u64 = 6;
pub const G_COPY: u64 = 3;
pub const G_BLOCKHASH: u64 = 20;
pub const G_EXP_BYTE: u64 = 50;

// EIP-2929 access list gas costs
pub const COLD_SLOAD_COST: u64 = 2100;
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_STORAGE_READ_COST: u64 = 100;

// EIP-3529 gas refund changes
pub const MAX_REFUND_QUOTIENT: u64 = 5; // Pre-London
pub const MAX_REFUND_QUOTIENT_EIP3529: u64 = 5; // Post-London

// ==================================
// Section 4: Additional Constants
// ==================================

// Block and chain constants
pub const BLOCK_HASH_HISTORY: u64 = 256; // Number of recent block hashes available
pub const MAX_WITHDRAWALS_PER_PAYLOAD: usize = 16; // EIP-4895
pub const MAX_BLOB_NUMBER_PER_BLOCK: usize = 6; // EIP-4844

// Chain IDs
pub const MAINNET_CHAIN_ID: u64 = 1;
pub const GOERLI_CHAIN_ID: u64 = 5;
pub const SEPOLIA_CHAIN_ID: u64 = 11155111;

// Difficulty/Prevrandao
pub const DIFFICULTY_BOUND_DIVISOR: u64 = 2048;
pub const MIN_DIFFICULTY: u64 = 131072;

// Empty hashes - commonly used in state management
pub const KECCAK_EMPTY: [32]u8 = .{ 
    0xc5, 0xd2, 0x46, 0x01, 0x86, 0xf7, 0x23, 0x3c,
    0x92, 0x7e, 0x7d, 0xb2, 0xdc, 0xc7, 0x03, 0xc0,
    0xe5, 0x00, 0xb6, 0x53, 0xca, 0x82, 0x27, 0x3b,
    0x7b, 0xfa, 0xd8, 0x04, 0x5d, 0x85, 0xa4, 0x70
}; // Keccak256("")

pub const KECCAK_NULL_RLP: [32]u8 = .{
    0x56, 0xe8, 0x1f, 0x17, 0x1b, 0xcc, 0x55, 0xa6,
    0xff, 0x83, 0x45, 0xe6, 0x92, 0xc0, 0xf8, 0x6e,
    0x5b, 0x48, 0xe0, 0x1b, 0x99, 0x6c, 0xad, 0xc0,
    0x01, 0x62, 0x2f, 0xb5, 0xe3, 0x63, 0xb4, 0x21
}; // Keccak256(RLP(null))

pub const EMPTY_UNCLES_HASH: [32]u8 = .{
    0x1d, 0xcc, 0x4d, 0xe8, 0xde, 0xc7, 0x5d, 0x7a,
    0xab, 0x85, 0xb5, 0x67, 0xb6, 0xcc, 0xd4, 0x1a,
    0xd3, 0x12, 0x45, 0x1b, 0x94, 0x8a, 0x74, 0x13,
    0xf0, 0xa1, 0x42, 0xfd, 0x40, 0xd4, 0x93, 0x47
}; // Keccak256(RLP([]))

// System addresses
pub const SYSTEM_ADDRESS: [20]u8 = .{0xff} ** 19 ++ .{0xfe}; // 0xfffffffffffffffffffffffffffffffffffffffe
pub const BEACON_ROOTS_ADDRESS: [20]u8 = .{0} ** 19 ++ .{0x0b}; // EIP-4788
pub const HISTORY_STORAGE_ADDRESS: [20]u8 = .{0} ** 19 ++ .{0x0c}; // EIP-2935
pub const WITHDRAWAL_REQUEST_ADDRESS: [20]u8 = .{0} ** 19 ++ .{0x0d}; // EIP-7002
pub const CONSOLIDATION_REQUEST_ADDRESS: [20]u8 = .{0} ** 19 ++ .{0x0e}; // EIP-7251

// Mathematical constants
pub const MAX_UINT64: u64 = 0xFFFFFFFFFFFFFFFF;
pub const MAX_UINT256: u256 = (1 << 256) - 1;

// Refund constants
pub const REFUND_QUOTIENT: u64 = 2; // Legacy (pre-London)
pub const REFUND_QUOTIENT_EIP3529: u64 = 5; // Post-London

// Storage refunds (pre-London)
pub const SSTORE_REFUND_GAS: u64 = 15000;
pub const SSTORE_SET_GAS: u64 = 20000;
pub const SSTORE_RESET_GAS: u64 = 5000;
pub const SSTORE_CLEARS_SCHEDULE_REFUND_GAS: u64 = 15000;

// Self-destruct refunds (removed in EIP-3529)
pub const SELF_DESTRUCT_REFUND_GAS: u64 = 24000; // Pre-London only

// Access list constants (EIP-2930)
pub const ACCESS_LIST_STORAGE_KEY_COST: u64 = 1900;
pub const ACCESS_LIST_ADDRESS_COST: u64 = 2400;

// Base fee constants (EIP-1559)
pub const INITIAL_BASE_FEE: u64 = 1000000000; // 1 gwei
pub const BASE_FEE_CHANGE_DENOMINATOR: u64 = 8;
pub const ELASTICITY_MULTIPLIER: u64 = 2;

// Blob transaction constants (EIP-4844)
pub const MIN_BLOB_GASPRICE: u64 = 1;
pub const BLOB_COMMITMENT_SIZE: usize = 48;
pub const BLOB_SIZE: usize = 131072; // 128KB
pub const FIELD_ELEMENTS_PER_BLOB: usize = 4096;
pub const BYTES_PER_FIELD_ELEMENT: usize = 32;

// Additional precompile gas costs
// BN256 curve operations (EIP-196, EIP-197)
pub const G_BN256_ADD: u64 = 150; // Istanbul reduction from 500
pub const G_BN256_MUL: u64 = 6000; // Istanbul reduction from 40000
pub const G_BN256_PAIRING_BASE: u64 = 45000; // Istanbul reduction from 100000
pub const G_BN256_PAIRING_POINT: u64 = 34000; // Istanbul reduction from 80000

// Blake2f (EIP-152)
pub const G_BLAKE2F_ROUND: u64 = 1;

// Point evaluation precompile (EIP-4844)
pub const G_POINT_EVALUATION: u64 = 50000;

// =======================
// Section 5: Common Types
// =======================

/// Memory size calculation result
pub const MemorySize = struct {
    size: u64,
    overflow: bool,
};

/// Gas calculation result
pub const GasResult = struct {
    cost: u64,
    overflow: bool,
};

// ======================
// Section 6: Error Types
// ======================

/// EVM execution errors
pub const EvmError = error{
    OutOfGas,
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    InvalidOpcode,
    OutOfBounds,
    WriteProtection,
    DepthLimit,
    InsufficientBalance,
    ContractAddressCollision,
    CodeSizeExceeded,
    InitCodeSizeExceeded,
    Revert,
    Stop,
    Invalid,
};

// ==========================
// Section 7: Utility Functions
// ==========================

/// Check if an opcode is a PUSH instruction
pub fn isPush(opcode: u8) bool {
    return opcode >= PUSH1 and opcode <= PUSH32;
}

/// Check if an opcode is a DUP instruction
pub fn isDup(opcode: u8) bool {
    return opcode >= DUP1 and opcode <= DUP16;
}

/// Check if an opcode is a SWAP instruction
pub fn isSwap(opcode: u8) bool {
    return opcode >= SWAP1 and opcode <= SWAP16;
}

/// Check if an opcode is a LOG instruction
pub fn isLog(opcode: u8) bool {
    return opcode >= LOG0 and opcode <= LOG4;
}

/// Get the number of bytes pushed by a PUSH opcode
pub fn getPushSize(opcode: u8) u8 {
    if (!isPush(opcode) and opcode != PUSH0) return 0;
    if (opcode == PUSH0) return 0;
    return opcode - PUSH1 + 1;
}

/// Get the number of items duplicated by a DUP opcode
pub fn getDupSize(opcode: u8) u8 {
    if (!isDup(opcode)) return 0;
    return opcode - DUP1 + 1;
}

/// Get the swap depth for a SWAP opcode
pub fn getSwapSize(opcode: u8) u8 {
    if (!isSwap(opcode)) return 0;
    return opcode - SWAP1 + 1;
}

/// Get the number of topics for a LOG opcode
pub fn getLogTopics(opcode: u8) u8 {
    if (!isLog(opcode)) return 0;
    return opcode - LOG0;
}

/// Calculate memory expansion cost
pub fn memoryGasCost(size: u64) u64 {
    if (size == 0) return 0;
    const word_size = (size + 31) / 32;
    const linear_cost = word_size * G_MEMORY;
    const quadratic_cost = (word_size * word_size) / G_QUADRATIC_WORD;
    return linear_cost + quadratic_cost;
}

/// Calculate memory expansion cost returning a GasResult
pub fn memoryGasCostWithOverflow(size: u64) GasResult {
    if (size == 0) return GasResult{ .cost = 0, .overflow = false };
    
    // Check for overflow in word size calculation
    const word_size = (size + 31) / 32;
    
    // Check for overflow in linear cost
    const linear_cost = @mulWithOverflow(word_size, G_MEMORY);
    if (linear_cost[1] != 0) return GasResult{ .cost = 0, .overflow = true };
    
    // Check for overflow in quadratic term
    const quadratic_mult = @mulWithOverflow(word_size, word_size);
    if (quadratic_mult[1] != 0) return GasResult{ .cost = 0, .overflow = true };
    
    const quadratic_cost = quadratic_mult[0] / G_QUADRATIC_WORD;
    
    // Check for overflow in final addition
    const total_cost = @addWithOverflow(linear_cost[0], quadratic_cost);
    if (total_cost[1] != 0) return GasResult{ .cost = 0, .overflow = true };
    
    return GasResult{ .cost = total_cost[0], .overflow = false };
}

/// Calculate initcode gas cost (EIP-3860)
pub fn initCodeGasCost(size: u64) u64 {
    if (size == 0) return 0;
    const word_size = (size + 31) / 32;
    return word_size * G_INITCODE_WORD;
}

/// Check if an address is a precompile
pub fn isPrecompile(address: [20]u8) bool {
    // Check if address is 0x00...01 through 0x00...0a
    for (address[0..19]) |byte| {
        if (byte != 0) return false;
    }
    return address[19] >= PRECOMPILE_ECRECOVER and address[19] <= PRECOMPILE_POINT_EVALUATION;
}

/// Calculate the cost of accessing an account (EIP-2929)
pub fn accountAccessGasCost(is_cold: bool) u64 {
    return if (is_cold) COLD_ACCOUNT_ACCESS_COST else 0;
}

/// Calculate the cost of accessing storage (EIP-2929)
pub fn storageAccessGasCost(is_cold: bool) u64 {
    return if (is_cold) COLD_SLOAD_COST else WARM_STORAGE_READ_COST;
}

/// Check if a block number is within the accessible history
pub fn isBlockHashAccessible(current_block: u64, requested_block: u64) bool {
    if (requested_block >= current_block) return false;
    return current_block - requested_block <= BLOCK_HASH_HISTORY;
}

/// Calculate blob gas price (EIP-4844)
pub fn calcBlobGasPrice(excess_blob_gas: u64) u64 {
    return @max(
        MIN_BLOB_GASPRICE,
        fakeExponential(MIN_BLOB_GASPRICE, excess_blob_gas, BLOB_TX_BLOB_GASPRICE_UPDATE_FRACTION)
    );
}

/// Fake exponential function for blob gas pricing (EIP-4844)
fn fakeExponential(base: u64, exponent: u64, factor: u64) u64 {
    var output: u128 = base;
    var current_exponent = exponent;
    var current_factor: u128 = factor;
    
    while (current_factor > 0) {
        if (current_exponent & 1 != 0) {
            output = (output * current_factor) / factor;
        }
        current_factor = (current_factor * current_factor) / factor;
        current_exponent >>= 1;
    }
    
    return @truncate(output);
}

/// Get the number of effective bytes in a data array for gas calculation
pub fn dataGasCost(data: []const u8, is_contract_creation: bool) u64 {
    var cost: u64 = 0;
    for (data) |byte| {
        if (byte == 0) {
            cost += G_TRANSACTION_DATA_ZERO;
        } else {
            cost += G_TRANSACTION_DATA_NONZERO;
        }
    }
    if (is_contract_creation) {
        cost += initCodeGasCost(@intCast(data.len));
    }
    return cost;
}

/// Check if an opcode is terminal (ends execution)
pub fn isTerminal(opcode: u8) bool {
    return switch (opcode) {
        STOP, RETURN, REVERT, INVALID, SELFDESTRUCT => true,
        else => false,
    };
}

/// Get opcode name from byte value
pub fn getOpcodeName(opcode: u8) []const u8 {
    return switch (opcode) {
        0x00 => "STOP",
        0x01 => "ADD",
        0x02 => "MUL",
        0x03 => "SUB",
        0x04 => "DIV",
        0x05 => "SDIV",
        0x06 => "MOD",
        0x07 => "SMOD",
        0x08 => "ADDMOD",
        0x09 => "MULMOD",
        0x0a => "EXP",
        0x0b => "SIGNEXTEND",
        0x10 => "LT",
        0x11 => "GT",
        0x12 => "SLT",
        0x13 => "SGT",
        0x14 => "EQ",
        0x15 => "ISZERO",
        0x16 => "AND",
        0x17 => "OR",
        0x18 => "XOR",
        0x19 => "NOT",
        0x1a => "BYTE",
        0x1b => "SHL",
        0x1c => "SHR",
        0x1d => "SAR",
        0x20 => "KECCAK256",
        0x30 => "ADDRESS",
        0x31 => "BALANCE",
        0x32 => "ORIGIN",
        0x33 => "CALLER",
        0x34 => "CALLVALUE",
        0x35 => "CALLDATALOAD",
        0x36 => "CALLDATASIZE",
        0x37 => "CALLDATACOPY",
        0x38 => "CODESIZE",
        0x39 => "CODECOPY",
        0x3a => "GASPRICE",
        0x3b => "EXTCODESIZE",
        0x3c => "EXTCODECOPY",
        0x3d => "RETURNDATASIZE",
        0x3e => "RETURNDATACOPY",
        0x3f => "EXTCODEHASH",
        0x40 => "BLOCKHASH",
        0x41 => "COINBASE",
        0x42 => "TIMESTAMP",
        0x43 => "NUMBER",
        0x44 => "DIFFICULTY",
        0x45 => "GASLIMIT",
        0x46 => "CHAINID",
        0x47 => "SELFBALANCE",
        0x48 => "BASEFEE",
        0x49 => "BLOBHASH",
        0x4a => "BLOBBASEFEE",
        0x50 => "POP",
        0x51 => "MLOAD",
        0x52 => "MSTORE",
        0x53 => "MSTORE8",
        0x54 => "SLOAD",
        0x55 => "SSTORE",
        0x56 => "JUMP",
        0x57 => "JUMPI",
        0x58 => "PC",
        0x59 => "MSIZE",
        0x5a => "GAS",
        0x5b => "JUMPDEST",
        0x5c => "TLOAD",
        0x5d => "TSTORE",
        0x5e => "MCOPY",
        0x5f => "PUSH0",
        0x60 => "PUSH1",
        0x61 => "PUSH2",
        0x62 => "PUSH3",
        0x63 => "PUSH4",
        0x64 => "PUSH5",
        0x65 => "PUSH6",
        0x66 => "PUSH7",
        0x67 => "PUSH8",
        0x68 => "PUSH9",
        0x69 => "PUSH10",
        0x6a => "PUSH11",
        0x6b => "PUSH12",
        0x6c => "PUSH13",
        0x6d => "PUSH14",
        0x6e => "PUSH15",
        0x6f => "PUSH16",
        0x70 => "PUSH17",
        0x71 => "PUSH18",
        0x72 => "PUSH19",
        0x73 => "PUSH20",
        0x74 => "PUSH21",
        0x75 => "PUSH22",
        0x76 => "PUSH23",
        0x77 => "PUSH24",
        0x78 => "PUSH25",
        0x79 => "PUSH26",
        0x7a => "PUSH27",
        0x7b => "PUSH28",
        0x7c => "PUSH29",
        0x7d => "PUSH30",
        0x7e => "PUSH31",
        0x7f => "PUSH32",
        0x80 => "DUP1",
        0x81 => "DUP2",
        0x82 => "DUP3",
        0x83 => "DUP4",
        0x84 => "DUP5",
        0x85 => "DUP6",
        0x86 => "DUP7",
        0x87 => "DUP8",
        0x88 => "DUP9",
        0x89 => "DUP10",
        0x8a => "DUP11",
        0x8b => "DUP12",
        0x8c => "DUP13",
        0x8d => "DUP14",
        0x8e => "DUP15",
        0x8f => "DUP16",
        0x90 => "SWAP1",
        0x91 => "SWAP2",
        0x92 => "SWAP3",
        0x93 => "SWAP4",
        0x94 => "SWAP5",
        0x95 => "SWAP6",
        0x96 => "SWAP7",
        0x97 => "SWAP8",
        0x98 => "SWAP9",
        0x99 => "SWAP10",
        0x9a => "SWAP11",
        0x9b => "SWAP12",
        0x9c => "SWAP13",
        0x9d => "SWAP14",
        0x9e => "SWAP15",
        0x9f => "SWAP16",
        0xa0 => "LOG0",
        0xa1 => "LOG1",
        0xa2 => "LOG2",
        0xa3 => "LOG3",
        0xa4 => "LOG4",
        0xf0 => "CREATE",
        0xf1 => "CALL",
        0xf2 => "CALLCODE",
        0xf3 => "RETURN",
        0xf4 => "DELEGATECALL",
        0xf5 => "CREATE2",
        0xfa => "STATICCALL",
        0xfd => "REVERT",
        0xfe => "INVALID",
        0xff => "SELFDESTRUCT",
        else => "UNKNOWN",
    };
}

// ===============================
// Section 8: Hardfork Support
// ===============================

/// Hardfork enumeration
pub const Hardfork = enum {
    Frontier,
    Homestead,
    TangerineWhistle,
    SpuriousDragon,
    Byzantium,
    Constantinople,
    Petersburg,
    Istanbul,
    Berlin,
    London,
    Paris,
    Shanghai,
    Cancun,
};

/// Gas constants that vary by hardfork
pub const GasConstants = struct {
    sload: u64,
    selfdestruct: u64,
    balance: u64,
    call: u64,
    callcode: u64,
    delegatecall: u64,
    staticcall: u64,
    extcodesize: u64,
    extcodecopy: u64,
    extcodehash: u64,
    sstore_set: u64,
    sstore_reset: u64,
    sstore_refund: u64,
};

/// Get gas constants for a specific hardfork
pub fn getGasConstants(hardfork: Hardfork) GasConstants {
    return switch (hardfork) {
        .Frontier => .{
            .sload = 50,
            .selfdestruct = 0,
            .balance = 20,
            .call = 40,
            .callcode = 40,
            .delegatecall = 40,
            .staticcall = 40,
            .extcodesize = 20,
            .extcodecopy = 20,
            .extcodehash = 400,
            .sstore_set = 20000,
            .sstore_reset = 5000,
            .sstore_refund = 15000,
        },
        .TangerineWhistle => .{
            .sload = 200,
            .selfdestruct = 5000,
            .balance = 400,
            .call = 700,
            .callcode = 700,
            .delegatecall = 700,
            .staticcall = 700,
            .extcodesize = 700,
            .extcodecopy = 700,
            .extcodehash = 700,
            .sstore_set = 20000,
            .sstore_reset = 5000,
            .sstore_refund = 15000,
        },
        .Istanbul => .{
            .sload = 800,
            .selfdestruct = 5000,
            .balance = 700,
            .call = 700,
            .callcode = 700,
            .delegatecall = 700,
            .staticcall = 700,
            .extcodesize = 700,
            .extcodecopy = 700,
            .extcodehash = 700,
            .sstore_set = 20000,
            .sstore_reset = 5000,
            .sstore_refund = 15000,
        },
        .Berlin => .{
            .sload = 2100,
            .selfdestruct = 5000,
            .balance = 2600,
            .call = 2600,
            .callcode = 2600,
            .delegatecall = 2600,
            .staticcall = 2600,
            .extcodesize = 2600,
            .extcodecopy = 2600,
            .extcodehash = 2600,
            .sstore_set = 20000,
            .sstore_reset = 2900,
            .sstore_refund = 15000,
        },
        .London => .{
            .sload = 2100,
            .selfdestruct = 5000,
            .balance = 2600,
            .call = 2600,
            .callcode = 2600,
            .delegatecall = 2600,
            .staticcall = 2600,
            .extcodesize = 2600,
            .extcodecopy = 2600,
            .extcodehash = 2600,
            .sstore_set = 20000,
            .sstore_reset = 2900,
            .sstore_refund = 4800, // Reduced in London
        },
        else => .{
            // Default to latest known values
            .sload = 2100,
            .selfdestruct = 5000,
            .balance = 2600,
            .call = 2600,
            .callcode = 2600,
            .delegatecall = 2600,
            .staticcall = 2600,
            .extcodesize = 2600,
            .extcodecopy = 2600,
            .extcodehash = 2600,
            .sstore_set = 20000,
            .sstore_reset = 2900,
            .sstore_refund = 4800,
        },
    };
}
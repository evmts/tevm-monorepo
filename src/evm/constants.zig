/// EVM opcode constants and helper functions
///
/// This module provides opcode values and utility functions for working with
/// EVM bytecode. All opcodes are defined as comptime constants for zero-cost
/// abstraction.
///
/// Reference: https://www.evm.codes/

// Core opcodes used frequently
pub const STOP: u8 = 0x00;
pub const ADD: u8 = 0x01;
pub const MUL: u8 = 0x02;
pub const SUB: u8 = 0x03;
pub const DIV: u8 = 0x04;
pub const SDIV: u8 = 0x05;
pub const MOD: u8 = 0x06;
pub const SMOD: u8 = 0x07;
pub const ADDMOD: u8 = 0x08;
pub const MULMOD: u8 = 0x09;
pub const EXP: u8 = 0x0A;
pub const SIGNEXTEND: u8 = 0x0B;

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
pub const BYTE: u8 = 0x1A;
pub const SHL: u8 = 0x1B;
pub const SHR: u8 = 0x1C;
pub const SAR: u8 = 0x1D;

// Hashing
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
pub const GASPRICE: u8 = 0x3A;
pub const EXTCODESIZE: u8 = 0x3B;
pub const EXTCODECOPY: u8 = 0x3C;
pub const RETURNDATASIZE: u8 = 0x3D;
pub const RETURNDATACOPY: u8 = 0x3E;
pub const EXTCODEHASH: u8 = 0x3F;

// Block information
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
pub const GAS: u8 = 0x5A;
pub const JUMPDEST: u8 = 0x5B;
pub const TLOAD: u8 = 0x5C;
pub const TSTORE: u8 = 0x5D;
pub const MCOPY: u8 = 0x5E;
pub const PUSH0: u8 = 0x5F;

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
pub const DUP11: u8 = 0x8A;
pub const DUP12: u8 = 0x8B;
pub const DUP13: u8 = 0x8C;
pub const DUP14: u8 = 0x8D;
pub const DUP15: u8 = 0x8E;
pub const DUP16: u8 = 0x8F;

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
pub const SWAP11: u8 = 0x9A;
pub const SWAP12: u8 = 0x9B;
pub const SWAP13: u8 = 0x9C;
pub const SWAP14: u8 = 0x9D;
pub const SWAP15: u8 = 0x9E;
pub const SWAP16: u8 = 0x9F;

// Logging operations
pub const LOG0: u8 = 0xA0;
pub const LOG1: u8 = 0xA1;
pub const LOG2: u8 = 0xA2;
pub const LOG3: u8 = 0xA3;
pub const LOG4: u8 = 0xA4;

// System operations
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
pub const SELFDESTRUCT: u8 = 0xFF;

/// Check if an opcode is a PUSH operation
pub inline fn is_push(op: u8) bool {
    return op >= PUSH1 and op <= PUSH32;
}

/// Get the number of bytes pushed for a PUSH opcode
/// Returns 0 for non-PUSH opcodes
pub inline fn get_push_size(op: u8) u8 {
    if (!is_push(op)) return 0;
    return op - PUSH1 + 1;
}

/// Check if an opcode is a DUP operation
pub inline fn is_dup(op: u8) bool {
    return op >= DUP1 and op <= DUP16;
}

/// Get the stack position for a DUP opcode
/// Returns 0 for non-DUP opcodes
pub inline fn get_dup_position(op: u8) u8 {
    if (!is_dup(op)) return 0;
    return op - DUP1 + 1;
}

/// Check if an opcode is a SWAP operation
pub inline fn is_swap(op: u8) bool {
    return op >= SWAP1 and op <= SWAP16;
}

/// Get the stack position for a SWAP opcode
/// Returns 0 for non-SWAP opcodes
pub inline fn get_swap_position(op: u8) u8 {
    if (!is_swap(op)) return 0;
    return op - SWAP1 + 1;
}

/// Check if an opcode is a LOG operation
pub inline fn is_log(op: u8) bool {
    return op >= LOG0 and op <= LOG4;
}

/// Get the number of topics for a LOG opcode
/// Returns 0 for non-LOG opcodes
pub inline fn get_log_topic_count(op: u8) u8 {
    if (!is_log(op)) return 0;
    return op - LOG0;
}

/// Check if an opcode is a terminating operation
pub inline fn is_terminating(op: u8) bool {
    return op == STOP or op == RETURN or op == REVERT or op == SELFDESTRUCT or op == INVALID;
}

/// Check if an opcode is a call operation
pub inline fn is_call(op: u8) bool {
    return op == CALL or op == CALLCODE or op == DELEGATECALL or op == STATICCALL or
        op == EXTCALL or op == EXTDELEGATECALL or op == EXTSTATICCALL;
}

/// Check if an opcode is a create operation
pub inline fn is_create(op: u8) bool {
    return op == CREATE or op == CREATE2;
}

/// Check if an opcode can modify state
pub inline fn modifies_state(op: u8) bool {
    return op == SSTORE or op == CREATE or op == CREATE2 or op == SELFDESTRUCT or
        op == LOG0 or op == LOG1 or op == LOG2 or op == LOG3 or op == LOG4;
}

/// Check if an opcode is valid
pub inline fn is_valid(op: u8) bool {
    return op != INVALID;
}

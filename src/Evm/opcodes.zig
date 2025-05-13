// TEVM: Zig implementation of Ethereum Virtual Machine
// Based on evmone, an EVM implementation by The evmone Authors
// License: Apache-2.0
const std = @import("std");

/// The list of EVM opcodes from every EVM revision.
pub const Opcode = enum(u8) {
    // Arithmetic operations
    STOP = 0x00,
    ADD = 0x01,
    MUL = 0x02,
    SUB = 0x03,
    DIV = 0x04,
    SDIV = 0x05,
    MOD = 0x06,
    SMOD = 0x07,
    ADDMOD = 0x08,
    MULMOD = 0x09,
    EXP = 0x0a,
    SIGNEXTEND = 0x0b,

    // Comparison & bitwise logic operations
    LT = 0x10,
    GT = 0x11,
    SLT = 0x12,
    SGT = 0x13,
    EQ = 0x14,
    ISZERO = 0x15,
    AND = 0x16,
    OR = 0x17,
    XOR = 0x18,
    NOT = 0x19,
    BYTE = 0x1a,
    SHL = 0x1b,
    SHR = 0x1c,
    SAR = 0x1d,

    // Cryptographic operations
    KECCAK256 = 0x20,

    // Environmental information
    ADDRESS = 0x30,
    BALANCE = 0x31,
    ORIGIN = 0x32,
    CALLER = 0x33,
    CALLVALUE = 0x34,
    CALLDATALOAD = 0x35,
    CALLDATASIZE = 0x36,
    CALLDATACOPY = 0x37,
    CODESIZE = 0x38,
    CODECOPY = 0x39,
    GASPRICE = 0x3a,
    EXTCODESIZE = 0x3b,
    EXTCODECOPY = 0x3c,
    RETURNDATASIZE = 0x3d,
    RETURNDATACOPY = 0x3e,
    EXTCODEHASH = 0x3f,

    // Block information
    BLOCKHASH = 0x40,
    COINBASE = 0x41,
    TIMESTAMP = 0x42,
    NUMBER = 0x43,
    PREVRANDAO = 0x44,
    GASLIMIT = 0x45,
    CHAINID = 0x46,
    SELFBALANCE = 0x47,
    BASEFEE = 0x48,
    BLOBHASH = 0x49,
    BLOBBASEFEE = 0x4a,

    // Stack, memory, storage and flow operations
    POP = 0x50,
    MLOAD = 0x51,
    MSTORE = 0x52,
    MSTORE8 = 0x53,
    SLOAD = 0x54,
    SSTORE = 0x55,
    JUMP = 0x56,
    JUMPI = 0x57,
    PC = 0x58,
    MSIZE = 0x59,
    GAS = 0x5a,
    JUMPDEST = 0x5b,
    TLOAD = 0x5c,
    TSTORE = 0x5d,
    MCOPY = 0x5e,
    PUSH0 = 0x5f,

    // Push operations
    PUSH1 = 0x60,
    PUSH2 = 0x61,
    PUSH3 = 0x62,
    PUSH4 = 0x63,
    PUSH5 = 0x64,
    PUSH6 = 0x65,
    PUSH7 = 0x66,
    PUSH8 = 0x67,
    PUSH9 = 0x68,
    PUSH10 = 0x69,
    PUSH11 = 0x6a,
    PUSH12 = 0x6b,
    PUSH13 = 0x6c,
    PUSH14 = 0x6d,
    PUSH15 = 0x6e,
    PUSH16 = 0x6f,
    PUSH17 = 0x70,
    PUSH18 = 0x71,
    PUSH19 = 0x72,
    PUSH20 = 0x73,
    PUSH21 = 0x74,
    PUSH22 = 0x75,
    PUSH23 = 0x76,
    PUSH24 = 0x77,
    PUSH25 = 0x78,
    PUSH26 = 0x79,
    PUSH27 = 0x7a,
    PUSH28 = 0x7b,
    PUSH29 = 0x7c,
    PUSH30 = 0x7d,
    PUSH31 = 0x7e,
    PUSH32 = 0x7f,

    // Duplication operations
    DUP1 = 0x80,
    DUP2 = 0x81,
    DUP3 = 0x82,
    DUP4 = 0x83,
    DUP5 = 0x84,
    DUP6 = 0x85,
    DUP7 = 0x86,
    DUP8 = 0x87,
    DUP9 = 0x88,
    DUP10 = 0x89,
    DUP11 = 0x8a,
    DUP12 = 0x8b,
    DUP13 = 0x8c,
    DUP14 = 0x8d,
    DUP15 = 0x8e,
    DUP16 = 0x8f,

    // Exchange operations
    SWAP1 = 0x90,
    SWAP2 = 0x91,
    SWAP3 = 0x92,
    SWAP4 = 0x93,
    SWAP5 = 0x94,
    SWAP6 = 0x95,
    SWAP7 = 0x96,
    SWAP8 = 0x97,
    SWAP9 = 0x98,
    SWAP10 = 0x99,
    SWAP11 = 0x9a,
    SWAP12 = 0x9b,
    SWAP13 = 0x9c,
    SWAP14 = 0x9d,
    SWAP15 = 0x9e,
    SWAP16 = 0x9f,

    // Logging operations
    LOG0 = 0xa0,
    LOG1 = 0xa1,
    LOG2 = 0xa2,
    LOG3 = 0xa3,
    LOG4 = 0xa4,

    // EOF data section access operations
    DATALOAD = 0xd0,
    DATALOADN = 0xd1,
    DATASIZE = 0xd2,
    DATACOPY = 0xd3,

    // Relative jump operations (EIP-4200)
    RJUMP = 0xe0,
    RJUMPI = 0xe1,
    RJUMPV = 0xe2,
    CALLF = 0xe3,
    RETF = 0xe4,
    JUMPF = 0xe5,

    // EIP-663 operations
    DUPN = 0xe6,
    SWAPN = 0xe7,
    EXCHANGE = 0xe8,

    // EOF-specific operations
    EOFCREATE = 0xec,
    TXCREATE = 0xed,
    RETURNCODE = 0xee,

    // System operations
    CREATE = 0xf0,
    CALL = 0xf1,
    CALLCODE = 0xf2,
    RETURN = 0xf3,
    DELEGATECALL = 0xf4,
    CREATE2 = 0xf5,
    RETURNDATALOAD = 0xf7,
    EXTCALL = 0xf8,
    EXTDELEGATECALL = 0xf9,
    STATICCALL = 0xfa,
    EXTSTATICCALL = 0xfb,
    REVERT = 0xfd,
    INVALID = 0xfe,
    SELFDESTRUCT = 0xff,

    /// Convert from a byte value to the corresponding opcode
    pub fn fromByte(byte: u8) ?Opcode {
        return std.meta.intToEnum(Opcode, byte) catch null;
    }

    /// Get the human-readable name of the opcode
    pub fn getName(self: Opcode) []const u8 {
        return switch (self) {
            .STOP => "STOP",
            .ADD => "ADD",
            .MUL => "MUL",
            .SUB => "SUB",
            .DIV => "DIV",
            .SDIV => "SDIV",
            .MOD => "MOD",
            .SMOD => "SMOD",
            .ADDMOD => "ADDMOD",
            .MULMOD => "MULMOD",
            .EXP => "EXP",
            .SIGNEXTEND => "SIGNEXTEND",
            .LT => "LT",
            .GT => "GT",
            .SLT => "SLT",
            .SGT => "SGT",
            .EQ => "EQ",
            .ISZERO => "ISZERO",
            .AND => "AND",
            .OR => "OR",
            .XOR => "XOR",
            .NOT => "NOT",
            .BYTE => "BYTE",
            .SHL => "SHL",
            .SHR => "SHR",
            .SAR => "SAR",
            .KECCAK256 => "KECCAK256",
            .ADDRESS => "ADDRESS",
            .BALANCE => "BALANCE",
            .ORIGIN => "ORIGIN",
            .CALLER => "CALLER",
            .CALLVALUE => "CALLVALUE",
            .CALLDATALOAD => "CALLDATALOAD",
            .CALLDATASIZE => "CALLDATASIZE",
            .CALLDATACOPY => "CALLDATACOPY",
            .CODESIZE => "CODESIZE",
            .CODECOPY => "CODECOPY",
            .GASPRICE => "GASPRICE",
            .EXTCODESIZE => "EXTCODESIZE",
            .EXTCODECOPY => "EXTCODECOPY",
            .RETURNDATASIZE => "RETURNDATASIZE",
            .RETURNDATACOPY => "RETURNDATACOPY",
            .EXTCODEHASH => "EXTCODEHASH",
            .BLOCKHASH => "BLOCKHASH",
            .COINBASE => "COINBASE",
            .TIMESTAMP => "TIMESTAMP",
            .NUMBER => "NUMBER",
            .PREVRANDAO => "PREVRANDAO",
            .GASLIMIT => "GASLIMIT",
            .CHAINID => "CHAINID",
            .SELFBALANCE => "SELFBALANCE",
            .BASEFEE => "BASEFEE",
            .BLOBHASH => "BLOBHASH",
            .BLOBBASEFEE => "BLOBBASEFEE",
            .POP => "POP",
            .MLOAD => "MLOAD",
            .MSTORE => "MSTORE",
            .MSTORE8 => "MSTORE8",
            .SLOAD => "SLOAD",
            .SSTORE => "SSTORE",
            .JUMP => "JUMP",
            .JUMPI => "JUMPI",
            .PC => "PC",
            .MSIZE => "MSIZE",
            .GAS => "GAS",
            .JUMPDEST => "JUMPDEST",
            .TLOAD => "TLOAD",
            .TSTORE => "TSTORE",
            .MCOPY => "MCOPY",
            .PUSH0 => "PUSH0",
            .PUSH1 => "PUSH1",
            .PUSH2 => "PUSH2",
            .PUSH3 => "PUSH3",
            .PUSH4 => "PUSH4",
            .PUSH5 => "PUSH5",
            .PUSH6 => "PUSH6",
            .PUSH7 => "PUSH7",
            .PUSH8 => "PUSH8",
            .PUSH9 => "PUSH9",
            .PUSH10 => "PUSH10",
            .PUSH11 => "PUSH11",
            .PUSH12 => "PUSH12",
            .PUSH13 => "PUSH13",
            .PUSH14 => "PUSH14",
            .PUSH15 => "PUSH15",
            .PUSH16 => "PUSH16",
            .PUSH17 => "PUSH17",
            .PUSH18 => "PUSH18",
            .PUSH19 => "PUSH19",
            .PUSH20 => "PUSH20",
            .PUSH21 => "PUSH21",
            .PUSH22 => "PUSH22",
            .PUSH23 => "PUSH23",
            .PUSH24 => "PUSH24",
            .PUSH25 => "PUSH25",
            .PUSH26 => "PUSH26",
            .PUSH27 => "PUSH27",
            .PUSH28 => "PUSH28",
            .PUSH29 => "PUSH29",
            .PUSH30 => "PUSH30",
            .PUSH31 => "PUSH31",
            .PUSH32 => "PUSH32",
            .DUP1 => "DUP1",
            .DUP2 => "DUP2",
            .DUP3 => "DUP3",
            .DUP4 => "DUP4",
            .DUP5 => "DUP5",
            .DUP6 => "DUP6",
            .DUP7 => "DUP7",
            .DUP8 => "DUP8",
            .DUP9 => "DUP9",
            .DUP10 => "DUP10",
            .DUP11 => "DUP11",
            .DUP12 => "DUP12",
            .DUP13 => "DUP13",
            .DUP14 => "DUP14",
            .DUP15 => "DUP15",
            .DUP16 => "DUP16",
            .SWAP1 => "SWAP1",
            .SWAP2 => "SWAP2",
            .SWAP3 => "SWAP3",
            .SWAP4 => "SWAP4",
            .SWAP5 => "SWAP5",
            .SWAP6 => "SWAP6",
            .SWAP7 => "SWAP7",
            .SWAP8 => "SWAP8",
            .SWAP9 => "SWAP9",
            .SWAP10 => "SWAP10",
            .SWAP11 => "SWAP11",
            .SWAP12 => "SWAP12",
            .SWAP13 => "SWAP13",
            .SWAP14 => "SWAP14",
            .SWAP15 => "SWAP15",
            .SWAP16 => "SWAP16",
            .LOG0 => "LOG0",
            .LOG1 => "LOG1",
            .LOG2 => "LOG2",
            .LOG3 => "LOG3",
            .LOG4 => "LOG4",
            .DATALOAD => "DATALOAD",
            .DATALOADN => "DATALOADN",
            .DATASIZE => "DATASIZE",
            .DATACOPY => "DATACOPY",
            .RJUMP => "RJUMP",
            .RJUMPI => "RJUMPI",
            .RJUMPV => "RJUMPV",
            .CALLF => "CALLF",
            .RETF => "RETF",
            .JUMPF => "JUMPF",
            .DUPN => "DUPN",
            .SWAPN => "SWAPN",
            .EXCHANGE => "EXCHANGE",
            .EOFCREATE => "EOFCREATE",
            .TXCREATE => "TXCREATE",
            .RETURNCODE => "RETURNCODE",
            .CREATE => "CREATE",
            .CALL => "CALL",
            .CALLCODE => "CALLCODE",
            .RETURN => "RETURN",
            .DELEGATECALL => "DELEGATECALL",
            .CREATE2 => "CREATE2",
            .RETURNDATALOAD => "RETURNDATALOAD",
            .EXTCALL => "EXTCALL",
            .EXTDELEGATECALL => "EXTDELEGATECALL",
            .STATICCALL => "STATICCALL",
            .EXTSTATICCALL => "EXTSTATICCALL",
            .REVERT => "REVERT",
            .INVALID => "INVALID",
            .SELFDESTRUCT => "SELFDESTRUCT",
        };
    }

    /// Get stack requirements for an opcode
    pub fn getStackRequirements(self: Opcode) struct { input: u8, output: u8 } {
        return switch (self) {
            // 0 inputs, 0 outputs
            .STOP, .JUMPDEST => .{ .input = 0, .output = 0 },

            // 0 inputs, 1 output
            .PUSH0, .PUSH1, .PUSH2, .PUSH3, .PUSH4, .PUSH5, .PUSH6, .PUSH7, .PUSH8, .PUSH9, .PUSH10, .PUSH11, .PUSH12, .PUSH13, .PUSH14, .PUSH15, .PUSH16, .PUSH17, .PUSH18, .PUSH19, .PUSH20, .PUSH21, .PUSH22, .PUSH23, .PUSH24, .PUSH25, .PUSH26, .PUSH27, .PUSH28, .PUSH29, .PUSH30, .PUSH31, .PUSH32, .ADDRESS, .ORIGIN, .CALLER, .CALLVALUE, .CALLDATASIZE, .CODESIZE, .GASPRICE, .RETURNDATASIZE, .COINBASE, .TIMESTAMP, .NUMBER, .PREVRANDAO, .GASLIMIT, .CHAINID, .SELFBALANCE, .PC, .MSIZE, .GAS, .BASEFEE, .BLOBBASEFEE, .DATASIZE => .{ .input = 0, .output = 1 },

            // 1 input, 0 outputs
            .POP => .{ .input = 1, .output = 0 },

            // 1 input, 1 output
            .ISZERO, .NOT, .BLOCKHASH, .CALLDATALOAD, .MLOAD, .SLOAD, .TLOAD, .EXTCODESIZE, .EXTCODEHASH, .BALANCE, .BLOBHASH, .DATALOAD, .RETURNDATALOAD => .{ .input = 1, .output = 1 },

            // 2 inputs, 0 outputs
            .MSTORE, .MSTORE8, .SSTORE, .TSTORE, .JUMP => .{ .input = 2, .output = 0 },

            // 2 inputs, 1 output
            .ADD, .MUL, .SUB, .DIV, .SDIV, .MOD, .SMOD, .EXP, .SIGNEXTEND, .LT, .GT, .SLT, .SGT, .EQ, .AND, .OR, .XOR, .BYTE, .SHL, .SHR, .SAR => .{ .input = 2, .output = 1 },

            // 3 inputs, 0 outputs
            .CALLDATACOPY, .RETURNDATACOPY, .CODECOPY, .MCOPY, .DATACOPY => .{ .input = 3, .output = 0 },

            // 3 inputs, 1 output
            .ADDMOD, .MULMOD, .JUMPI => .{ .input = 3, .output = 1 },

            // Special cases
            .KECCAK256 => .{ .input = 2, .output = 1 },

            // DUP instructions
            .DUP1 => .{ .input = 1, .output = 2 },
            .DUP2 => .{ .input = 2, .output = 3 },
            .DUP3 => .{ .input = 3, .output = 4 },
            .DUP4 => .{ .input = 4, .output = 5 },
            .DUP5 => .{ .input = 5, .output = 6 },
            .DUP6 => .{ .input = 6, .output = 7 },
            .DUP7 => .{ .input = 7, .output = 8 },
            .DUP8 => .{ .input = 8, .output = 9 },
            .DUP9 => .{ .input = 9, .output = 10 },
            .DUP10 => .{ .input = 10, .output = 11 },
            .DUP11 => .{ .input = 11, .output = 12 },
            .DUP12 => .{ .input = 12, .output = 13 },
            .DUP13 => .{ .input = 13, .output = 14 },
            .DUP14 => .{ .input = 14, .output = 15 },
            .DUP15 => .{ .input = 15, .output = 16 },
            .DUP16 => .{ .input = 16, .output = 17 },

            // SWAP instructions
            .SWAP1 => .{ .input = 2, .output = 2 },
            .SWAP2 => .{ .input = 3, .output = 3 },
            .SWAP3 => .{ .input = 4, .output = 4 },
            .SWAP4 => .{ .input = 5, .output = 5 },
            .SWAP5 => .{ .input = 6, .output = 6 },
            .SWAP6 => .{ .input = 7, .output = 7 },
            .SWAP7 => .{ .input = 8, .output = 8 },
            .SWAP8 => .{ .input = 9, .output = 9 },
            .SWAP9 => .{ .input = 10, .output = 10 },
            .SWAP10 => .{ .input = 11, .output = 11 },
            .SWAP11 => .{ .input = 12, .output = 12 },
            .SWAP12 => .{ .input = 13, .output = 13 },
            .SWAP13 => .{ .input = 14, .output = 14 },
            .SWAP14 => .{ .input = 15, .output = 15 },
            .SWAP15 => .{ .input = 16, .output = 16 },
            .SWAP16 => .{ .input = 17, .output = 17 },

            // LOG instructions
            .LOG0 => .{ .input = 2, .output = 0 },
            .LOG1 => .{ .input = 3, .output = 0 },
            .LOG2 => .{ .input = 4, .output = 0 },
            .LOG3 => .{ .input = 5, .output = 0 },
            .LOG4 => .{ .input = 6, .output = 0 },

            // CREATE instructions
            .CREATE, .CREATE2 => .{ .input = 3, .output = 1 },

            // CALL instructions
            .CALL, .CALLCODE => .{ .input = 7, .output = 1 },
            .DELEGATECALL, .STATICCALL => .{ .input = 6, .output = 1 },

            // RETURN instructions
            .RETURN, .REVERT => .{ .input = 2, .output = 0 },

            // SELFDESTRUCT
            .SELFDESTRUCT => .{ .input = 1, .output = 0 },

            // Other/EOF/Specialized instructions - placeholder values
            .EXTCODECOPY => .{ .input = 4, .output = 0 },
            .DATALOADN, .RJUMP, .RJUMPI, .RJUMPV, .CALLF, .RETF, .JUMPF, .DUPN, .SWAPN, .EXCHANGE, .EOFCREATE, .TXCREATE, .RETURNCODE, .EXTCALL, .EXTDELEGATECALL, .EXTSTATICCALL, .INVALID => .{ .input = 0, .output = 0 },
        };
    }

    /// Get gas cost for an opcode
    pub fn getGasCost(self: Opcode) u32 {
        // This is a simplified implementation - actual gas calculation is more complex
        // and depends on EVM state, parameters, etc.
        return switch (self) {
            .STOP, .RETURN, .REVERT => 0,

            // Very low tier
            .ADD, .SUB, .NOT, .LT, .GT, .SLT, .SGT, .EQ, .ISZERO, .AND, .OR, .XOR, .BYTE, .SHL, .SHR, .SAR, .POP, .PUSH0, .PUSH1, .PUSH2, .PUSH3, .PUSH4, .PUSH5, .PUSH6, .PUSH7, .PUSH8, .PUSH9, .PUSH10, .PUSH11, .PUSH12, .PUSH13, .PUSH14, .PUSH15, .PUSH16, .PUSH17, .PUSH18, .PUSH19, .PUSH20, .PUSH21, .PUSH22, .PUSH23, .PUSH24, .PUSH25, .PUSH26, .PUSH27, .PUSH28, .PUSH29, .PUSH30, .PUSH31, .PUSH32, .DUP1, .DUP2, .DUP3, .DUP4, .DUP5, .DUP6, .DUP7, .DUP8, .DUP9, .DUP10, .DUP11, .DUP12, .DUP13, .DUP14, .DUP15, .DUP16, .SWAP1, .SWAP2, .SWAP3, .SWAP4, .SWAP5, .SWAP6, .SWAP7, .SWAP8, .SWAP9, .SWAP10, .SWAP11, .SWAP12, .SWAP13, .SWAP14, .SWAP15, .SWAP16, .ADDRESS, .ORIGIN, .CALLER, .CALLVALUE, .CALLDATASIZE, .CODESIZE, .GASPRICE, .RETURNDATASIZE, .COINBASE, .TIMESTAMP, .NUMBER, .PREVRANDAO, .GASLIMIT, .CHAINID, .PC, .MSIZE, .GAS => 3,

            // Low tier
            .MUL, .DIV, .SDIV, .MOD, .SMOD, .SIGNEXTEND, .JUMPDEST => 5,

            // Mid tier
            .ADDMOD, .MULMOD, .JUMP, .JUMPI => 8,

            // High tier
            .BLOCKHASH, .BASEFEE, .BLOBBASEFEE, .BLOBHASH => 20,

            // Special cost tier
            .MLOAD, .MSTORE, .MSTORE8 => 3, // Plus memory expansion cost
            .SLOAD => 100, // Plus potential cold access cost
            .SSTORE => 100, // Complex rules based on value changes
            .CALLDATALOAD => 3,
            .CALLDATACOPY, .RETURNDATACOPY, .CODECOPY, .MCOPY => 3, // Plus memory expansion and copy cost
            .EXTCODESIZE, .EXTCODEHASH, .BALANCE => 100, // Plus potential cold access cost
            .EXTCODECOPY => 100, // Plus memory expansion and copy cost and potential cold access
            .SELFDESTRUCT => 5000,
            .LOG0 => 375,
            .LOG1 => 750,
            .LOG2 => 1125,
            .LOG3 => 1500,
            .LOG4 => 1875,
            .CREATE, .CREATE2 => 32000,
            .CALL, .CALLCODE, .DELEGATECALL, .STATICCALL => 100, // Plus complex cost factors
            .KECCAK256 => 30, // Plus data size cost
            .EXP => 10, // Plus byte cost

            // EOF and other specialized opcodes - placeholder values
            .DATALOAD, .DATALOADN, .DATASIZE, .DATACOPY, .RJUMP, .RJUMPI, .RJUMPV, .CALLF, .RETF, .JUMPF, .DUPN, .SWAPN, .EXCHANGE, .EOFCREATE, .TXCREATE, .RETURNCODE, .RETURNDATALOAD, .EXTCALL, .EXTDELEGATECALL, .EXTSTATICCALL, .INVALID, .TLOAD, .TSTORE => 10,
        };
    }
};

// TEVM: Zig implementation of Ethereum Virtual Machine
// Based on evmone, an EVM implementation by The evmone Authors
// License: Apache-2.0

const std = @import("std");

/// Metadata for each EVM opcode
pub const OpCodeInfo = struct {
    name        : []const u8,
    inputs      : u8,
    outputs     : u8,
    immediate   : u8,
    notEof      : bool,
    terminating : bool,

    pub fn name(self: @This()) []const u8 { return self.name; }
    pub fn ioDiff(self: @This()) i16 { return @intCast(i16, self.outputs) - @intCast(i16, self.inputs); }
    pub fn isDisabledInEof(self: @This()) bool { return !self.notEof; }
    pub fn isTerminating(self: @This()) bool { return self.terminating; }
};

/// A raw opcode byte
pub alias RawOpCode = u8;

/// The list of EVM opcodes from every EVM revision.
pub const Opcode = enum(RawOpCode) {
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

    pub fn fromByte(byte: u8) ?Opcode {
        return std.meta.intToEnum(Opcode, byte) catch null;
    }

    pub fn toInfo(self: Opcode) OpCodeInfo {
        const infoOpt = OPCODE_NFO[@as(u8, self)];
        if (infoOpt) |info| return info;
        @panic("Invalid opcode metadata lookup");
    }

    pub fn getName(self: Opcode) []const u8 {
        return self.toInfo().name;
    }

    pub fn getStackRequirements(self: Opcode) struct { input: u8, output: u8 } {
        const info = self.toInfo();
        return .{ .input = info.inputs, .output = info.outputs };
    }

    pub fn isJumpdest(self: Opcode) bool {
        return self == .JUMPDEST;
    }

    pub fn isPush(self: Opcode) bool {
        return (self >= .PUSH1 and self <= .PUSH32);
    }

    pub fn modifiesMemory(self: Opcode) bool {
        return modifiesMemoryRaw(@as(u8, self));
    }

    pub fn computeSelector(preimage: []const u8) [4]u8 {
        // stub: keccak256 + take first 4 bytes
        return [_]u8{0,0,0,0};
    }
};

/// Compile-time definitions used to populate OPCODE_INFO
const Definition = struct {
    code        : u8,
    name        : []const u8,
    inputs      : u8,
    outputs     : u8,
    immediate   : u8,
    notEof      : bool,
    terminating : bool,
};

const definitions = comptime [_]Definition{
    .{ .code=0x00, .name="STOP", .inputs=0, .outputs=0, .immediate=0, .notEof=true, .terminating=true },
    .{ .code=0x01, .name="ADD",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x02, .name="MUL",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x03, .name="SUB",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x04, .name="DIV",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x05, .name="SDIV", .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x06, .name="MOD",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x07, .name="SMOD", .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x08, .name="ADDMOD", .inputs=3, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x09, .name="MULMOD", .inputs=3, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x0a, .name="EXP",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x0b, .name="SIGNEXTEND", .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x10, .name="LT",   .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x11, .name="GT",   .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x12, .name="SLT",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x13, .name="SGT",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x14, .name="EQ",   .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x15, .name="ISZERO", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x16, .name="AND",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x17, .name="OR",   .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x18, .name="XOR",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x19, .name="NOT",  .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x1a, .name="BYTE", .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x1b, .name="SHL",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x1c, .name="SHR",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x1d, .name="SAR",  .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x20, .name="KECCAK256", .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x30, .name="ADDRESS", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x31, .name="BALANCE", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x32, .name="ORIGIN", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x33, .name="CALLER", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x34, .name="CALLVALUE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x35, .name="CALLDATALOAD", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x36, .name="CALLDATASIZE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x37, .name="CALLDATACOPY", .inputs=3, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x38, .name="CODESIZE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x39, .name="CODECOPY", .inputs=3, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x3a, .name="GASPRICE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x3b, .name="EXTCODESIZE", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x3c, .name="EXTCODECOPY", .inputs=4, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x3d, .name="RETURNDATASIZE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x3e, .name="RETURNDATACOPY", .inputs=3, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x3f, .name="EXTCODEHASH", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x40, .name="BLOCKHASH", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x41, .name="COINBASE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x42, .name="TIMESTAMP", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x43, .name="NUMBER", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x44, .name="PREVRANDAO", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x45, .name="GASLIMIT", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x46, .name="CHAINID", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x47, .name="SELFBALANCE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x48, .name="BASEFEE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x49, .name="BLOBHASH", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x4a, .name="BLOBBASEFEE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x50, .name="POP", .inputs=1, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x51, .name="MLOAD", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x52, .name="MSTORE", .inputs=2, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x53, .name="MSTORE8", .inputs=2, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x54, .name="SLOAD", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x55, .name="SSTORE", .inputs=2, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x56, .name="JUMP", .inputs=1, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x57, .name="JUMPI", .inputs=2, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x58, .name="PC", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x59, .name="MSIZE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x5a, .name="GAS", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x5b, .name="JUMPDEST", .inputs=0, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x5c, .name="TLOAD", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x5d, .name="TSTORE", .inputs=2, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x5e, .name="MCOPY", .inputs=3, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x5f, .name="PUSH0", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x60, .name="PUSH1", .inputs=0, .outputs=1, .immediate=1, .notEof=true, .terminating=false },
    .{ .code=0x61, .name="PUSH2", .inputs=0, .outputs=1, .immediate=2, .notEof=true, .terminating=false },
    .{ .code=0x62, .name="PUSH3", .inputs=0, .outputs=1, .immediate=3, .notEof=true, .terminating=false },
    .{ .code=0x63, .name="PUSH4", .inputs=0, .outputs=1, .immediate=4, .notEof=true, .terminating=false },
    .{ .code=0x64, .name="PUSH5", .inputs=0, .outputs=1, .immediate=5, .notEof=true, .terminating=false },
    .{ .code=0x65, .name="PUSH6", .inputs=0, .outputs=1, .immediate=6, .notEof=true, .terminating=false },
    .{ .code=0x66, .name="PUSH7", .inputs=0, .outputs=1, .immediate=7, .notEof=true, .terminating=false },
    .{ .code=0x67, .name="PUSH8", .inputs=0, .outputs=1, .immediate=8, .notEof=true, .terminating=false },
    .{ .code=0x68, .name="PUSH9", .inputs=0, .outputs=1, .immediate=9, .notEof=true, .terminating=false },
    .{ .code=0x69, .name="PUSH10", .inputs=0, .outputs=1, .immediate=10, .notEof=true, .terminating=false },
    .{ .code=0x6a, .name="PUSH11", .inputs=0, .outputs=1, .immediate=11, .notEof=true, .terminating=false },
    .{ .code=0x6b, .name="PUSH12", .inputs=0, .outputs=1, .immediate=12, .notEof=true, .terminating=false },
    .{ .code=0x6c, .name="PUSH13", .inputs=0, .outputs=1, .immediate=13, .notEof=true, .terminating=false },
    .{ .code=0x6d, .name="PUSH14", .inputs=0, .outputs=1, .immediate=14, .notEof=true, .terminating=false },
    .{ .code=0x6e, .name="PUSH15", .inputs=0, .outputs=1, .immediate=15, .notEof=true, .terminating=false },
    .{ .code=0x6f, .name="PUSH16", .inputs=0, .outputs=1, .immediate=16, .notEof=true, .terminating=false },
    .{ .code=0x70, .name="PUSH17", .inputs=0, .outputs=1, .immediate=17, .notEof=true, .terminating=false },
    .{ .code=0x71, .name="PUSH18", .inputs=0, .outputs=1, .immediate=18, .notEof=true, .terminating=false },
    .{ .code=0x72, .name="PUSH19", .inputs=0, .outputs=1, .immediate=19, .notEof=true, .terminating=false },
    .{ .code=0x73, .name="PUSH20", .inputs=0, .outputs=1, .immediate=20, .notEof=true, .terminating=false },
    .{ .code=0x74, .name="PUSH21", .inputs=0, .outputs=1, .immediate=21, .notEof=true, .terminating=false },
    .{ .code=0x75, .name="PUSH22", .inputs=0, .outputs=1, .immediate=22, .notEof=true, .terminating=false },
    .{ .code=0x76, .name="PUSH23", .inputs=0, .outputs=1, .immediate=23, .notEof=true, .terminating=false },
    .{ .code=0x77, .name="PUSH24", .inputs=0, .outputs=1, .immediate=24, .notEof=true, .terminating=false },
    .{ .code=0x78, .name="PUSH25", .inputs=0, .outputs=1, .immediate=25, .notEof=true, .terminating=false },
    .{ .code=0x79, .name="PUSH26", .inputs=0, .outputs=1, .immediate=26, .notEof=true, .terminating=false },
    .{ .code=0x7a, .name="PUSH27", .inputs=0, .outputs=1, .immediate=27, .notEof=true, .terminating=false },
    .{ .code=0x7b, .name="PUSH28", .inputs=0, .outputs=1, .immediate=28, .notEof=true, .terminating=false },
    .{ .code=0x7c, .name="PUSH29", .inputs=0, .outputs=1, .immediate=29, .notEof=true, .terminating=false },
    .{ .code=0x7d, .name="PUSH30", .inputs=0, .outputs=1, .immediate=30, .notEof=true, .terminating=false },
    .{ .code=0x7e, .name="PUSH31", .inputs=0, .outputs=1, .immediate=31, .notEof=true, .terminating=false },
    .{ .code=0x7f, .name="PUSH32", .inputs=0, .outputs=1, .immediate=32, .notEof=true, .terminating=false },
    .{ .code=0x80, .name="DUP1", .inputs=1, .outputs=2, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x81, .name="DUP2", .inputs=2, .outputs=3, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x82, .name="DUP3", .inputs=3, .outputs=4, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x83, .name="DUP4", .inputs=4, .outputs=5, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x84, .name="DUP5", .inputs=5, .outputs=6, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x85, .name="DUP6", .inputs=6, .outputs=7, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x86, .name="DUP7", .inputs=7, .outputs=8, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x87, .name="DUP8", .inputs=8, .outputs=9, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x88, .name="DUP9", .inputs=9, .outputs=10, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x89, .name="DUP10", .inputs=10, .outputs=11, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x8a, .name="DUP11", .inputs=11, .outputs=12, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x8b, .name="DUP12", .inputs=12, .outputs=13, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x8c, .name="DUP13", .inputs=13, .outputs=14, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x8d, .name="DUP14", .inputs=14, .outputs=15, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x8e, .name="DUP15", .inputs=15, .outputs=16, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x8f, .name="DUP16", .inputs=16, .outputs=17, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x90, .name="SWAP1", .inputs=2, .outputs=2, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x91, .name="SWAP2", .inputs=3, .outputs=3, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x92, .name="SWAP3", .inputs=4, .outputs=4, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x93, .name="SWAP4", .inputs=5, .outputs=5, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x94, .name="SWAP5", .inputs=6, .outputs=6, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x95, .name="SWAP6", .inputs=7, .outputs=7, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x96, .name="SWAP7", .inputs=8, .outputs=8, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x97, .name="SWAP8", .inputs=9, .outputs=9, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x98, .name="SWAP9", .inputs=10, .outputs=10, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x99, .name="SWAP10", .inputs=11, .outputs=11, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x9a, .name="SWAP11", .inputs=12, .outputs=12, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x9b, .name="SWAP12", .inputs=13, .outputs=13, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x9c, .name="SWAP13", .inputs=14, .outputs=14, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x9d, .name="SWAP14", .inputs=15, .outputs=15, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x9e, .name="SWAP15", .inputs=16, .outputs=16, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0x9f, .name="SWAP16", .inputs=17, .outputs=17, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xa0, .name="LOG0", .inputs=2, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xa1, .name="LOG1", .inputs=3, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xa2, .name="LOG2", .inputs=4, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xa3, .name="LOG3", .inputs=5, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xa4, .name="LOG4", .inputs=6, .outputs=0, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xd0, .name="DATALOAD", .inputs=1, .outputs=1, .immediate=0, .notEof=false, .terminating=false },
    .{ .code=0xd1, .name="DATALOADN", .inputs=0, .outputs=1, .immediate=2, .notEof=false, .terminating=false },
    .{ .code=0xd2, .name="DATASIZE", .inputs=0, .outputs=1, .immediate=0, .notEof=false, .terminating=false },
    .{ .code=0xd3, .name="DATACOPY", .inputs=3, .outputs=0, .immediate=0, .notEof=false, .terminating=false },
    .{ .code=0xe0, .name="RJUMP", .inputs=0, .outputs=0, .immediate=2, .notEof=true, .terminating=false },
    .{ .code=0xe1, .name="RJUMPI", .inputs=1, .outputs=0, .immediate=2, .notEof=true, .terminating=false },
    .{ .code=0xe2, .name="RJUMPV", .inputs=1, .outputs=0, .immediate=1, .notEof=true, .terminating=false },
    .{ .code=0xe3, .name="CALLF", .inputs=0, .outputs=0, .immediate=2, .notEof=true, .terminating=false },
    .{ .code=0xe4, .name="RETF", .inputs=0, .outputs=0, .immediate=0, .notEof=true, .terminating=true },
    .{ .code=0xe5, .name="JUMPF", .inputs=0, .outputs=0, .immediate=2, .notEof=true, .terminating=false },
    .{ .code=0xe6, .name="DUPN", .inputs=1, .outputs=2, .immediate=1, .notEof=true, .terminating=false },
    .{ .code=0xe7, .name="SWAPN", .inputs=2, .outputs=2, .immediate=1, .notEof=true, .terminating=false },
    .{ .code=0xe8, .name="EXCHANGE", .inputs=2, .outputs=2, .immediate=1, .notEof=true, .terminating=false },
    .{ .code=0xec, .name="EOFCREATE", .inputs=3, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xed, .name="TXCREATE", .inputs=2, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xee, .name="RETURNCODE", .inputs=0, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xf0, .name="CREATE", .inputs=3, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xf1, .name="CALL", .inputs=7, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xf2, .name="CALLCODE", .inputs=7, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xf3, .name="RETURN", .inputs=2, .outputs=0, .immediate=0, .notEof=true, .terminating=true },
    .{ .code=0xf4, .name="DELEGATECALL", .inputs=6, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xf5, .name="CREATE2", .inputs=4, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xf7, .name="RETURNDATALOAD", .inputs=1, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xf8, .name="EXTCALL", .inputs=7, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xf9, .name="EXTDELEGATECALL", .inputs=6, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xfa, .name="STATICCALL", .inputs=6, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xfb, .name="EXTSTATICCALL", .inputs=6, .outputs=1, .immediate=0, .notEof=true, .terminating=false },
    .{ .code=0xfd, .name="REVERT", .inputs=2, .outputs=0, .immediate=0, .notEof=true, .terminating=true },
    .{ .code=0xfe, .name="INVALID", .inputs=0, .outputs=0, .immediate=0, .notEof=true, .terminating=true },
    .{ .code=0xff, .name="SELFDESTRUCT", .inputs=1, .outputs=0, .immediate=0, .notEof=true, .terminating=true },
};

/// Table of opcode metadata by byte
pub const OPCODE_INFO = comptime blk: {
    var table: [256]?OpCodeInfo = undefined;
    for (table) |*slot| slot.* = null;
    for (definitions) |def| {
        table[def.code] = OpCodeInfo{
            .name        = def.name,
            .inputs      = def.inputs,
            .outputs     = def.outputs,
            .immediate   = def.immediate,
            .notEof      = def.notEof,
            .terminating = def.terminating,
        };
    }
    break :blk table;
};

/// Helper to test memory-modifying opcodes by raw byte
pub fn modifiesMemoryRaw(op: u8) bool {
    return switch (op) {
        @as(u8, Opcode.EXTCODECOPY),
        @as(u8, Opcode.MLOAD),
        @as(u8, Opcode.MSTORE),
        @as(u8, Opcode.MSTORE8),
        @as(u8, Opcode.MCOPY),
        @as(u8, Opcode.CODECOPY),
        @as(u8, Opcode.CALLDATACOPY),
        @as(u8, Opcode.RETURNDATACOPY),
        @as(u8, Opcode.CALL),
        @as(u8, Opcode.CALLCODE),
        @as(u8, Opcode.DELEGATECALL),
        @as(u8, Opcode.STATICCALL), *
            => true,
        else => false,
    };
}

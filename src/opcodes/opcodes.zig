//! Opcodes for ZigEVM
//! This module defines all the opcodes and their properties

const std = @import("std");

/// Opcode enumeration with gas costs and names
pub const Opcode = enum(u8) {
    // 0x0* range - stop and arithmetic operations
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
    EXP = 0x0A,
    SIGNEXTEND = 0x0B,

    // 0x1* range - comparison operations
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
    BYTE = 0x1A,
    SHL = 0x1B,
    SHR = 0x1C,
    SAR = 0x1D,

    // 0x2* range - SHA3 and environmental information
    SHA3 = 0x20,
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
    GASPRICE = 0x3A,
    EXTCODESIZE = 0x3B,
    EXTCODECOPY = 0x3C,
    RETURNDATASIZE = 0x3D,
    RETURNDATACOPY = 0x3E,
    EXTCODEHASH = 0x3F,

    // 0x4* range - block information
    BLOCKHASH = 0x40,
    COINBASE = 0x41,
    TIMESTAMP = 0x42,
    NUMBER = 0x43,
    PREVRANDAO = 0x44, // Previously DIFFICULTY
    GASLIMIT = 0x45,
    CHAINID = 0x46,
    SELFBALANCE = 0x47,
    BASEFEE = 0x48,
    BLOBHASH = 0x49,
    BLOBBASEFEE = 0x4A,

    // 0x5* range - stack, memory, storage and flow operations
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
    GAS = 0x5A,
    JUMPDEST = 0x5B,
    TLOAD = 0x5C,
    TSTORE = 0x5D,
    MCOPY = 0x5E,

    // 0x6*, 0x7* range - push operations (immediate values)
    PUSH0 = 0x5F,
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
    PUSH11 = 0x6A,
    PUSH12 = 0x6B,
    PUSH13 = 0x6C,
    PUSH14 = 0x6D,
    PUSH15 = 0x6E,
    PUSH16 = 0x6F,
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
    PUSH27 = 0x7A,
    PUSH28 = 0x7B,
    PUSH29 = 0x7C,
    PUSH30 = 0x7D,
    PUSH31 = 0x7E,
    PUSH32 = 0x7F,

    // 0x8* range - duplication operations
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
    DUP11 = 0x8A,
    DUP12 = 0x8B,
    DUP13 = 0x8C,
    DUP14 = 0x8D,
    DUP15 = 0x8E,
    DUP16 = 0x8F,

    // 0x9* range - swap operations
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
    SWAP11 = 0x9A,
    SWAP12 = 0x9B,
    SWAP13 = 0x9C,
    SWAP14 = 0x9D,
    SWAP15 = 0x9E,
    SWAP16 = 0x9F,

    // 0xa* range - log operations
    LOG0 = 0xA0,
    LOG1 = 0xA1,
    LOG2 = 0xA2,
    LOG3 = 0xA3,
    LOG4 = 0xA4,

    // 0xf* range - system operations
    CREATE = 0xF0,
    CALL = 0xF1,
    CALLCODE = 0xF2,
    RETURN = 0xF3,
    DELEGATECALL = 0xF4,
    CREATE2 = 0xF5,
    STATICCALL = 0xFA,
    REVERT = 0xFD,
    INVALID = 0xFE,
    SELFDESTRUCT = 0xFF,

    // Convert a byte value to an opcode, returns INVALID for unknown opcodes
    pub fn fromByte(byte: u8) Opcode {
        return std.meta.intToEnum(Opcode, byte) catch Opcode.INVALID;
    }

    // Get the number of bytes to push for a PUSH* opcode
    pub fn pushBytes(self: Opcode) u8 {
        return switch (self) {
            Opcode.PUSH0 => 0,
            Opcode.PUSH1 => 1,
            Opcode.PUSH2 => 2,
            Opcode.PUSH3 => 3,
            Opcode.PUSH4 => 4,
            Opcode.PUSH5 => 5,
            Opcode.PUSH6 => 6,
            Opcode.PUSH7 => 7,
            Opcode.PUSH8 => 8,
            Opcode.PUSH9 => 9,
            Opcode.PUSH10 => 10,
            Opcode.PUSH11 => 11,
            Opcode.PUSH12 => 12,
            Opcode.PUSH13 => 13,
            Opcode.PUSH14 => 14,
            Opcode.PUSH15 => 15,
            Opcode.PUSH16 => 16,
            Opcode.PUSH17 => 17,
            Opcode.PUSH18 => 18,
            Opcode.PUSH19 => 19,
            Opcode.PUSH20 => 20,
            Opcode.PUSH21 => 21,
            Opcode.PUSH22 => 22,
            Opcode.PUSH23 => 23,
            Opcode.PUSH24 => 24,
            Opcode.PUSH25 => 25,
            Opcode.PUSH26 => 26,
            Opcode.PUSH27 => 27,
            Opcode.PUSH28 => 28,
            Opcode.PUSH29 => 29,
            Opcode.PUSH30 => 30,
            Opcode.PUSH31 => 31,
            Opcode.PUSH32 => 32,
            else => 0,
        };
    }

    // Get the stack position to duplicate for a DUP* opcode
    pub fn dupPosition(self: Opcode) u8 {
        return switch (self) {
            Opcode.DUP1 => 1,
            Opcode.DUP2 => 2,
            Opcode.DUP3 => 3,
            Opcode.DUP4 => 4,
            Opcode.DUP5 => 5,
            Opcode.DUP6 => 6,
            Opcode.DUP7 => 7,
            Opcode.DUP8 => 8,
            Opcode.DUP9 => 9,
            Opcode.DUP10 => 10,
            Opcode.DUP11 => 11,
            Opcode.DUP12 => 12,
            Opcode.DUP13 => 13,
            Opcode.DUP14 => 14,
            Opcode.DUP15 => 15,
            Opcode.DUP16 => 16,
            else => 0,
        };
    }

    // Get the stack position to swap for a SWAP* opcode
    pub fn swapPosition(self: Opcode) u8 {
        return switch (self) {
            Opcode.SWAP1 => 1,
            Opcode.SWAP2 => 2,
            Opcode.SWAP3 => 3,
            Opcode.SWAP4 => 4,
            Opcode.SWAP5 => 5,
            Opcode.SWAP6 => 6,
            Opcode.SWAP7 => 7,
            Opcode.SWAP8 => 8,
            Opcode.SWAP9 => 9,
            Opcode.SWAP10 => 10,
            Opcode.SWAP11 => 11,
            Opcode.SWAP12 => 12,
            Opcode.SWAP13 => 13,
            Opcode.SWAP14 => 14,
            Opcode.SWAP15 => 15,
            Opcode.SWAP16 => 16,
            else => 0,
        };
    }

    // Get the number of topics for a LOG* opcode
    pub fn logTopics(self: Opcode) u8 {
        return switch (self) {
            Opcode.LOG0 => 0,
            Opcode.LOG1 => 1,
            Opcode.LOG2 => 2,
            Opcode.LOG3 => 3,
            Opcode.LOG4 => 4,
            else => 0,
        };
    }

    // Check if opcode is a push operation
    pub fn isPush(self: Opcode) bool {
        return self == Opcode.PUSH0 or (@intFromEnum(self) >= @intFromEnum(Opcode.PUSH1) and @intFromEnum(self) <= @intFromEnum(Opcode.PUSH32));
    }

    // Check if opcode is a dup operation
    pub fn isDup(self: Opcode) bool {
        return @intFromEnum(self) >= @intFromEnum(Opcode.DUP1) and @intFromEnum(self) <= @intFromEnum(Opcode.DUP16);
    }

    // Check if opcode is a swap operation
    pub fn isSwap(self: Opcode) bool {
        return @intFromEnum(self) >= @intFromEnum(Opcode.SWAP1) and @intFromEnum(self) <= @intFromEnum(Opcode.SWAP16);
    }

    // Check if opcode is a log operation
    pub fn isLog(self: Opcode) bool {
        return @intFromEnum(self) >= @intFromEnum(Opcode.LOG0) and @intFromEnum(self) <= @intFromEnum(Opcode.LOG4);
    }
};

/// Structure defining opcode properties for metering and analysis
pub const OpcodeInfo = struct {
    name: []const u8,
    gas_cost: u64,
    stack_pops: u8,
    stack_pushes: u8,
    side_effects: bool,
    fork_minimum: u64, // Ethereum fork number where opcode was introduced (0 for initial opcodes)

    // Table of all opcode properties, indexed by opcode value
    pub const table = blk: {
        var tbl: [256]OpcodeInfo = undefined;
        
        // Initialize with unknown operands
        for (&tbl) |*info| {
            info.* = OpcodeInfo{
                .name = "UNKNOWN",
                .gas_cost = 0,
                .stack_pops = 0,
                .stack_pushes = 0,
                .side_effects = false,
                .fork_minimum = 0,
            };
        }
        
        // 0x0* range - stop and arithmetic operations
        tbl[@intFromEnum(Opcode.STOP)] = .{ .name = "STOP", .gas_cost = 0, .stack_pops = 0, .stack_pushes = 0, .side_effects = true, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.ADD)] = .{ .name = "ADD", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.MUL)] = .{ .name = "MUL", .gas_cost = 5, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.SUB)] = .{ .name = "SUB", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.DIV)] = .{ .name = "DIV", .gas_cost = 5, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.SDIV)] = .{ .name = "SDIV", .gas_cost = 5, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.MOD)] = .{ .name = "MOD", .gas_cost = 5, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.SMOD)] = .{ .name = "SMOD", .gas_cost = 5, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.ADDMOD)] = .{ .name = "ADDMOD", .gas_cost = 8, .stack_pops = 3, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.MULMOD)] = .{ .name = "MULMOD", .gas_cost = 8, .stack_pops = 3, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.EXP)] = .{ .name = "EXP", .gas_cost = 10, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.SIGNEXTEND)] = .{ .name = "SIGNEXTEND", .gas_cost = 5, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        
        // 0x1* range - comparison operations
        tbl[@intFromEnum(Opcode.LT)] = .{ .name = "LT", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.GT)] = .{ .name = "GT", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.SLT)] = .{ .name = "SLT", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.SGT)] = .{ .name = "SGT", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.EQ)] = .{ .name = "EQ", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.ISZERO)] = .{ .name = "ISZERO", .gas_cost = 3, .stack_pops = 1, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.AND)] = .{ .name = "AND", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.OR)] = .{ .name = "OR", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.XOR)] = .{ .name = "XOR", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.NOT)] = .{ .name = "NOT", .gas_cost = 3, .stack_pops = 1, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.BYTE)] = .{ .name = "BYTE", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 0 };
        tbl[@intFromEnum(Opcode.SHL)] = .{ .name = "SHL", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 1283168 }; // Constantinople
        tbl[@intFromEnum(Opcode.SHR)] = .{ .name = "SHR", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 1283168 }; // Constantinople
        tbl[@intFromEnum(Opcode.SAR)] = .{ .name = "SAR", .gas_cost = 3, .stack_pops = 2, .stack_pushes = 1, .side_effects = false, .fork_minimum = 1283168 }; // Constantinople

        // More opcodes would be defined here

        // Push opcodes (0x60-0x7f)
        tbl[@intFromEnum(Opcode.PUSH0)] = .{ .name = "PUSH0", .gas_cost = 2, .stack_pops = 0, .stack_pushes = 1, .side_effects = false, .fork_minimum = 1559925 }; // Shanghai
        
        for (0..32) |i| {
            const push_op = @intFromEnum(Opcode.PUSH1) + @as(u8, @intCast(i));
            tbl[push_op] = .{ 
                .name = std.fmt.comptimePrint("PUSH{d}", .{i + 1}), 
                .gas_cost = 3, 
                .stack_pops = 0, 
                .stack_pushes = 1, 
                .side_effects = false, 
                .fork_minimum = 0 
            };
        }
        
        // DUP opcodes (0x80-0x8f)
        for (0..16) |i| {
            const dup_op = @intFromEnum(Opcode.DUP1) + @as(u8, @intCast(i));
            tbl[dup_op] = .{ 
                .name = std.fmt.comptimePrint("DUP{d}", .{i + 1}), 
                .gas_cost = 3, 
                .stack_pops = @intCast(i + 1), 
                .stack_pushes = @intCast(i + 2), 
                .side_effects = false, 
                .fork_minimum = 0 
            };
        }
        
        // SWAP opcodes (0x90-0x9f)
        for (0..16) |i| {
            const swap_op = @intFromEnum(Opcode.SWAP1) + @as(u8, @intCast(i));
            tbl[swap_op] = .{ 
                .name = std.fmt.comptimePrint("SWAP{d}", .{i + 1}), 
                .gas_cost = 3, 
                .stack_pops = @intCast(i + 2), 
                .stack_pushes = @intCast(i + 2), 
                .side_effects = false, 
                .fork_minimum = 0 
            };
        }
        
        // LOG opcodes (0xa0-0xa4)
        for (0..5) |i| {
            const log_op = @intFromEnum(Opcode.LOG0) + @as(u8, @intCast(i));
            tbl[log_op] = .{ 
                .name = std.fmt.comptimePrint("LOG{d}", .{i}), 
                .gas_cost = 375 + @as(u64, 375) * i, // LOG0: 375, LOG1: 750, LOG2: 1125, ...
                .stack_pops = @intCast(2 + i), 
                .stack_pushes = 0, 
                .side_effects = true, 
                .fork_minimum = 0 
            };
        }
        
        break :blk tbl;
    };

    /// Get information about an opcode
    pub fn getInfo(opcode: u8) OpcodeInfo {
        return table[opcode];
    }
};

// Tests
test "Basic opcode properties" {
    try std.testing.expectEqual(Opcode.ADD, Opcode.fromByte(0x01));
    try std.testing.expectEqual(Opcode.INVALID, Opcode.fromByte(0xc0)); // Unknown opcode
    
    try std.testing.expectEqual(@as(u8, 5), Opcode.PUSH5.pushBytes());
    try std.testing.expectEqual(@as(u8, 0), Opcode.ADD.pushBytes());
    
    try std.testing.expectEqual(@as(u8, 3), Opcode.DUP3.dupPosition());
    try std.testing.expectEqual(@as(u8, 10), Opcode.SWAP10.swapPosition());
    
    try std.testing.expectEqual(@as(u8, 2), Opcode.LOG2.logTopics());
    
    try std.testing.expect(Opcode.PUSH16.isPush());
    try std.testing.expect(!Opcode.ADD.isPush());
    
    try std.testing.expect(Opcode.DUP5.isDup());
    try std.testing.expect(Opcode.SWAP7.isSwap());
    try std.testing.expect(Opcode.LOG3.isLog());
}

test "Opcode info table" {
    const add_info = OpcodeInfo.getInfo(@intFromEnum(Opcode.ADD));
    try std.testing.expectEqualStrings("ADD", add_info.name);
    try std.testing.expectEqual(@as(u64, 3), add_info.gas_cost);
    try std.testing.expectEqual(@as(u8, 2), add_info.stack_pops);
    try std.testing.expectEqual(@as(u8, 1), add_info.stack_pushes);
    try std.testing.expect(!add_info.side_effects);
    
    const log2_info = OpcodeInfo.getInfo(@intFromEnum(Opcode.LOG2));
    try std.testing.expectEqualStrings("LOG2", log2_info.name);
    try std.testing.expectEqual(@as(u8, 4), log2_info.stack_pops); // 2 + 2 topics
    try std.testing.expectEqual(@as(u8, 0), log2_info.stack_pushes);
    try std.testing.expect(log2_info.side_effects);
    
    const shl_info = OpcodeInfo.getInfo(@intFromEnum(Opcode.SHL));
    try std.testing.expectEqualStrings("SHL", shl_info.name);
    try std.testing.expectEqual(@as(u64, 1283168), shl_info.fork_minimum); // Constantinople
}
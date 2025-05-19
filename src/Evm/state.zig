const std = @import("std");

// 256-bit unsigned integer type
const U256 = std.math.big.int.Const;

pub const EvmState = struct {
    // Current execution state
    running: bool = false,
    step: u64 = 0,

    // Current bytecode and program counter
    bytecode: []const u8 = &[_]u8{},
    pc: u64 = 0,

    // Stack and memory state
    stack: []const U256 = &[_]U256{},
    memory: []const u8 = &[_]u8{},

    // Gas information
    gasUsed: u64 = 0,
    gasLimit: u64 = 0,

    // Error state if any
    error: ?[]const u8 = null,

    pub fn toJson(self: EvmState, allocator: std.mem.Allocator) ![]u8 {
        var json = std.ArrayList(u8).init(allocator);
        defer json.deinit();

        var writer = json.writer();

        try writer.writeAll("{");

        try writer.writeAll("\"running\":");
        try writer.writeAll(if (self.running) "true" else "false");
        try writer.writeAll(",");

        try writer.writeAll("\"step\":");
        try writer.print("{}", .{self.step});
        try writer.writeAll(",");

        try writer.writeAll("\"bytecode\":\"");
        for (self.bytecode) |byte| {
            try writer.print("{x:0>2}", .{byte});
        }
        try writer.writeAll("\",");

        try writer.writeAll("\"pc\":");
        try writer.print("{}", .{self.pc});
        try writer.writeAll(",");

        try writer.writeAll("\"stack\":[");
        for (self.stack, 0..) |value, i| {
            if (i > 0) try writer.writeAll(",");
            try writer.print("\"0x{x}\"", .{value});
        }
        try writer.writeAll("],");

        try writer.writeAll("\"memory\":\"");
        for (self.memory) |byte| {
            try writer.print("{x:0>2}", .{byte});
        }
        try writer.writeAll("\",");

        try writer.writeAll("\"gasUsed\":");
        try writer.print("{}", .{self.gasUsed});
        try writer.writeAll(",");

        try writer.writeAll("\"gasLimit\":");
        try writer.print("{}", .{self.gasLimit});

        if (self.error) |err| {
            try writer.writeAll(",");
            try writer.writeAll("\"error\":\"");
            try writer.writeAll(err);
            try writer.writeAll("\"");
        }

        try writer.writeAll("}");

        return try json.toOwnedSlice();
    }
};
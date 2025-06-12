const std = @import("std");

pub fn main() !void {
    // Calculate the function selector for "Benchmark()"
    const function_signature = "Benchmark()";
    
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(function_signature);
    var hash: [32]u8 = undefined;
    hasher.final(&hash);
    
    // First 4 bytes are the function selector
    const selector: [4]u8 = hash[0..4].*;
    
    std.debug.print("Function signature: {s}\n", .{function_signature});
    std.debug.print("Full hash: ", .{});
    for (hash) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    std.debug.print("Function selector: 0x{x:02}{x:02}{x:02}{x:02}\n", .{selector[0], selector[1], selector[2], selector[3]});
    std.debug.print("As u32 (big endian): 0x{x:0>8}\n", .{std.mem.readInt(u32, &selector, .big)});
}
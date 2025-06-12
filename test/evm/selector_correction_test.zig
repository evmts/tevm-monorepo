const std = @import("std");
const testing = std.testing;

fn calculateSelector(function_sig: []const u8) [4]u8 {
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(function_sig);
    var hash: [32]u8 = undefined;
    hasher.final(&hash);
    
    var selector: [4]u8 = undefined;
    selector[0] = hash[0];
    selector[1] = hash[1];
    selector[2] = hash[2];
    selector[3] = hash[3];
    return selector;
}

test "calculate correct function selectors for debug tool" {
    std.debug.print("\n=== FUNCTION SELECTOR CORRECTIONS ===\n", .{});
    
    // Calculate correct selectors for all functions used in debug tool
    
    std.debug.print("\n--- Correct selectors for debug tool functions ---\n", .{});
    
    // getValue() function
    const getValue_selector = calculateSelector("getValue()");
    std.debug.print("getValue() selector: 0x", .{});
    for (getValue_selector) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // test() function  
    const test_selector = calculateSelector("test()");
    std.debug.print("test() selector: 0x", .{});
    for (test_selector) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Benchmark() function
    const benchmark_selector = calculateSelector("Benchmark()");
    std.debug.print("Benchmark() selector: 0x", .{});
    for (benchmark_selector) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Compare with the wrong values in debug tool
    std.debug.print("\n--- Comparison with debug tool values ---\n", .{});
    
    const wrong_getValue_selector: [4]u8 = .{ 0x20, 0x96, 0x52, 0x32 };
    const wrong_test_selector: [4]u8 = .{ 0xf8, 0xa8, 0xfd, 0x6d };
    const wrong_benchmark_selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    
    std.debug.print("getValue() - Wrong: 0x{x:08}, Correct: 0x{x:08}\n", .{
        std.mem.readInt(u32, &wrong_getValue_selector, .big),
        std.mem.readInt(u32, &getValue_selector, .big)
    });
    
    std.debug.print("test() - Wrong: 0x{x:08}, Correct: 0x{x:08}\n", .{
        std.mem.readInt(u32, &wrong_test_selector, .big),
        std.mem.readInt(u32, &test_selector, .big)
    });
    
    std.debug.print("Benchmark() - Wrong: 0x{x:08}, Correct: 0x{x:08}\n", .{
        std.mem.readInt(u32, &wrong_benchmark_selector, .big),
        std.mem.readInt(u32, &benchmark_selector, .big)
    });
    
    // Check which ones are actually wrong
    std.debug.print("\n--- Analysis ---\n", .{});
    
    if (std.mem.eql(u8, &getValue_selector, &wrong_getValue_selector)) {
        std.debug.print("✅ getValue() selector is correct\n", .{});
    } else {
        std.debug.print("❌ getValue() selector is WRONG - this explains the mystery value!\n", .{});
    }
    
    if (std.mem.eql(u8, &test_selector, &wrong_test_selector)) {
        std.debug.print("✅ test() selector is correct\n", .{});
    } else {
        std.debug.print("❌ test() selector is WRONG\n", .{});
    }
    
    if (std.mem.eql(u8, &benchmark_selector, &wrong_benchmark_selector)) {
        std.debug.print("✅ Benchmark() selector is correct\n", .{});
    } else {
        std.debug.print("❌ Benchmark() selector is WRONG\n", .{});
    }
    
    std.debug.print("\n=== SOLUTION ===\n", .{});
    std.debug.print("Replace hardcoded selectors in debug_gas_issue.zig with:\n", .{});
    std.debug.print("const GET_VALUE_SELECTOR: [4]u8 = .{{ 0x{x:02}, 0x{x:02}, 0x{x:02}, 0x{x:02} }};\n", .{
        getValue_selector[0], getValue_selector[1], getValue_selector[2], getValue_selector[3]
    });
    std.debug.print("const TEST_SELECTOR: [4]u8 = .{{ 0x{x:02}, 0x{x:02}, 0x{x:02}, 0x{x:02} }};\n", .{
        test_selector[0], test_selector[1], test_selector[2], test_selector[3]
    });
    std.debug.print("const BENCHMARK_SELECTOR: [4]u8 = .{{ 0x{x:02}, 0x{x:02}, 0x{x:02}, 0x{x:02} }};\n", .{
        benchmark_selector[0], benchmark_selector[1], benchmark_selector[2], benchmark_selector[3]
    });
}
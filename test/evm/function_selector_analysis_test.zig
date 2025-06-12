const std = @import("std");
const testing = std.testing;

test "function selector analysis - verify correct selector calculation" {
    std.debug.print("\n=== FUNCTION SELECTOR ANALYSIS ===\n", .{});
    
    // Test 1: Calculate correct function selector for Benchmark()
    std.debug.print("\n--- Test 1: Calculate Benchmark() selector ---\n", .{});
    
    const function_signature = "Benchmark()";
    std.debug.print("Function signature: {s}\n", .{function_signature});
    
    // Calculate keccak256 hash
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(function_signature);
    var hash: [32]u8 = undefined;
    hasher.final(&hash);
    
    // First 4 bytes are the selector
    const selector = hash[0..4];
    std.debug.print("Full hash: ", .{});
    for (hash) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    std.debug.print("Function selector: 0x", .{});
    for (selector) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Convert to u32 for comparison
    const selector_u32 = std.mem.readInt(u32, selector, .big);
    std.debug.print("Selector as u32: 0x{x:08}\n", .{selector_u32});
    
    // Test 2: Compare with what we expect
    std.debug.print("\n--- Test 2: Compare with benchmark selector ---\n", .{});
    
    const expected_selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    const expected_u32 = std.mem.readInt(u32, &expected_selector, .big);
    
    std.debug.print("Expected selector: 0x", .{});
    for (expected_selector) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    std.debug.print("Expected as u32: 0x{x:08}\n", .{expected_u32});
    
    if (selector_u32 == expected_u32) {
        std.debug.print("✅ MATCH: Calculated selector matches expected\n", .{});
    } else {
        std.debug.print("❌ MISMATCH: Selectors don't match!\n", .{});
        std.debug.print("   Calculated: 0x{x:08}\n", .{selector_u32});
        std.debug.print("   Expected:   0x{x:08}\n", .{expected_u32});
    }
    
    // Test 3: Test different function signatures
    std.debug.print("\n--- Test 3: Test other function signatures ---\n", .{});
    
    const test_functions = [_][]const u8{
        "test()",
        "benchmark()",  // lowercase
        "Benchmark(uint256)",  // with parameter
    };
    
    for (test_functions) |func_sig| {
        var func_hasher = std.crypto.hash.sha3.Keccak256.init(.{});
        func_hasher.update(func_sig);
        var func_hash: [32]u8 = undefined;
        func_hasher.final(&func_hash);
        
        const func_selector = func_hash[0..4];
        const func_u32 = std.mem.readInt(u32, func_selector, .big);
        
        std.debug.print("{s} -> 0x{x:08}\n", .{ func_sig, func_u32 });
    }
    
    // Test 4: Analyze common values that might be confused
    std.debug.print("\n--- Test 4: Common misinterpretation analysis ---\n", .{});
    
    // Check if the large number from debug output could be a misinterpreted selector
    const debug_value: u256 = 14739605505579052261146427134528887326101505340529352447376586313349898174464;
    
    std.debug.print("Debug value from trace: {}\n", .{debug_value});
    std.debug.print("Debug value hex: 0x{x}\n", .{debug_value});
    
    // Convert to bytes and check first 4 bytes
    var debug_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &debug_bytes, debug_value, .big);
    
    std.debug.print("First 4 bytes: 0x", .{});
    for (debug_bytes[0..4]) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    std.debug.print("\n=== CONCLUSION ===\n", .{});
    std.debug.print("This test verifies function selector calculation.\n", .{});
    std.debug.print("If selectors match, the issue is in EVM execution or bytecode structure.\n", .{});
    std.debug.print("If selectors don't match, we need to fix the function call setup.\n", .{});
}

test "bytecode structure analysis - simple manual parsing" {
    std.debug.print("\n=== BYTECODE STRUCTURE ANALYSIS ===\n", .{});
    
    // Test what a minimal Solidity contract should look like
    std.debug.print("\n--- Expected bytecode patterns ---\n", .{});
    
    // Function selector should appear in bytecode for comparison
    const expected_selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    std.debug.print("Looking for selector pattern: 0x", .{});
    for (expected_selector) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Common Solidity patterns
    std.debug.print("Common Solidity bytecode patterns:\n", .{});
    std.debug.print("- Function dispatch usually starts with CALLDATASIZE (0x36) check\n", .{});
    std.debug.print("- Followed by CALLDATALOAD (0x35) to get function selector\n", .{});
    std.debug.print("- Then conditional jumps (0x57 = JUMPI) for function routing\n", .{});
    std.debug.print("- REVERT (0xfd) if function not found\n", .{});
    
    std.debug.print("\nTo debug contract execution:\n", .{});
    std.debug.print("1. Check if bytecode contains expected selector pattern\n", .{});
    std.debug.print("2. Verify function dispatch logic is correctly compiled\n", .{});
    std.debug.print("3. Ensure EVM is executing bytecode vs just reverting\n", .{});
}
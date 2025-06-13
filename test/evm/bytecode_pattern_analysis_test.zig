const std = @import("std");
const testing = std.testing;

test "bytecode pattern analysis - examine compiled contract structure" {
    std.debug.print("\n=== BYTECODE PATTERN ANALYSIS ===\n", .{});
    
    // Test sample bytecode patterns to understand structure
    std.debug.print("\n--- Test 1: Analyzing common bytecode patterns ---\n", .{});
    
    // This simulates what a typical Solidity contract bytecode should contain
    const expected_selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    
    std.debug.print("Looking for function selector: 0x", .{});
    for (expected_selector) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Test what the mystery value might be
    std.debug.print("\n--- Test 2: Analyzing mystery value from EVM trace ---\n", .{});
    
    const mystery_bytes: [4]u8 = .{ 0x20, 0x96, 0x52, 0x32 };
    const mystery_u32 = std.mem.readInt(u32, &mystery_bytes, .big);
    
    std.debug.print("Mystery value from EVM: 0x{x:08}\n", .{mystery_u32});
    std.debug.print("Expected selector:      0x{x:08}\n", .{std.mem.readInt(u32, &expected_selector, .big)});
    
    // Check if mystery value could be an offset or memory address
    std.debug.print("\n--- Test 3: Interpret mystery value ---\n", .{});
    std.debug.print("Mystery value 0x20965232 could be:\n", .{});
    std.debug.print("- Decimal: {}\n", .{mystery_u32});
    std.debug.print("- Memory offset: 0x{x}\n", .{mystery_u32});
    std.debug.print("- Bytecode position: {}\n", .{mystery_u32});
    
    // Look for patterns
    if (mystery_u32 == 0x20965232) {
        std.debug.print("This looks like it could be:\n", .{});
        std.debug.print("- A memory address/offset\n", .{});
        std.debug.print("- Data at wrong calldata position\n", .{});
        std.debug.print("- Reading from uninitialized memory\n", .{});
    }
    
    // Test 4: Manual bytecode structure expectations
    std.debug.print("\n--- Test 4: Expected bytecode structure for Solidity contract ---\n", .{});
    
    std.debug.print("A typical Solidity function dispatch should contain:\n", .{});
    std.debug.print("1. Constructor code (if any)\n", .{});
    std.debug.print("2. Runtime code starting with:\n", .{});
    std.debug.print("   - CALLDATASIZE (0x36) - check if we have data\n", .{});
    std.debug.print("   - PUSH1 4 (0x6004) - push 4 bytes for selector length\n", .{});
    std.debug.print("   - LT (0x10) - check if calldata < 4 bytes\n", .{});
    std.debug.print("   - PUSH1 <revert_offset> (0x60XX) - jump target for revert\n", .{});
    std.debug.print("   - JUMPI (0x57) - conditional jump to revert\n", .{});
    std.debug.print("   - PUSH1 0 (0x6000) - offset 0\n", .{});
    std.debug.print("   - CALLDATALOAD (0x35) - load first 32 bytes (including selector)\n", .{});
    std.debug.print("   - PUSH1 224 (0x60e0) - shift amount to get selector\n", .{});
    std.debug.print("   - SHR (0x1c) - shift right to isolate selector\n", .{});
    std.debug.print("3. Function comparison:\n", .{});
    std.debug.print("   - DUP1 (0x80) - duplicate selector\n", .{});
    std.debug.print("   - PUSH4 0x30627b7c (0x6330627b7c) - our function selector\n", .{});
    std.debug.print("   - EQ (0x14) - compare selectors\n", .{});
    std.debug.print("   - PUSH1 <function_offset> (0x60XX) - jump target for function\n", .{});
    std.debug.print("   - JUMPI (0x57) - conditional jump to function\n", .{});
    std.debug.print("4. Default revert if no function matches\n", .{});
    
    std.debug.print("\n=== DEBUGGING STEPS ===\n", .{});
    std.debug.print("1. Compile a simple contract and examine its bytecode\n", .{});
    std.debug.print("2. Search for 0x30627b7c in the compiled bytecode\n", .{});
    std.debug.print("3. Verify the EVM is reading calldata correctly\n", .{});
    std.debug.print("4. Check if mystery value 0x20965232 appears in bytecode\n", .{});
    std.debug.print("5. Trace EVM execution to see where selector comparison fails\n", .{});
}

test "calldata analysis - verify input data structure" {
    std.debug.print("\n=== CALLDATA ANALYSIS ===\n", .{});
    
    // Test how function call data should be structured
    std.debug.print("\n--- Test 1: Function call data structure ---\n", .{});
    
    const selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    
    std.debug.print("Function call to Benchmark() should contain:\n", .{});
    std.debug.print("Bytes 0-3: Function selector = 0x", .{});
    for (selector) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    std.debug.print("Bytes 4+: Function parameters (none for Benchmark())\n", .{});
    
    // Test what EVM should read
    std.debug.print("\n--- Test 2: EVM calldata reading ---\n", .{});
    
    std.debug.print("When EVM executes CALLDATALOAD at offset 0:\n", .{});
    std.debug.print("Should read: 0x{x:08}000000000000000000000000000000000000000000000000000000000000\n", .{std.mem.readInt(u32, &selector, .big)});
    
    std.debug.print("After SHR 224 (shift right 28 bytes):\n", .{});
    std.debug.print("Should isolate: 0x{x:08}\n", .{std.mem.readInt(u32, &selector, .big)});
    
    std.debug.print("But EVM trace shows: 0x20965232\n", .{});
    std.debug.print("This suggests:\n", .{});
    std.debug.print("- Wrong calldata being passed to contract\n", .{});
    std.debug.print("- EVM reading from wrong offset\n", .{});
    std.debug.print("- Calldata not being set up properly\n", .{});
    std.debug.print("- Contract receiving different input than expected\n", .{});
}
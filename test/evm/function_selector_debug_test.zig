const std = @import("std");
const testing = std.testing;
const Compiler = @import("Compiler");

test "debug function selector in TenThousandHashes bytecode" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    // TenThousandHashes source - same as in benchmark
    const source =
        \\// SPDX-License-Identifier: GPL-3.0
        \\pragma solidity ^0.8.17;
        \\
        \\contract TenThousandHashes {
        \\    function Benchmark() external pure {
        \\        for (uint256 i = 0; i < 20000; i++) {
        \\            keccak256(abi.encodePacked(i));
        \\        }
        \\    }
        \\}
    ;

    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };

    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        "TenThousandHashes.sol",
        source,
        settings,
    ) catch |err| {
        std.debug.print("Compilation failed: {}\n", .{err});
        return err;
    };
    defer compilation_result.deinit();

    if (compilation_result.errors.len > 0) {
        std.debug.print("Compilation errors:\n", .{});
        for (compilation_result.errors) |compile_error| {
            std.debug.print("  {s}\n", .{compile_error.message});
        }
        return error.CompilationFailed;
    }

    try testing.expect(compilation_result.contracts.len > 0);
    const contract = compilation_result.contracts[0];
    
    std.debug.print("\n=== TenThousandHashes Contract Analysis ===\n", .{});
    std.debug.print("Constructor bytecode length: {}\n", .{contract.bytecode.len});
    std.debug.print("Runtime bytecode length: {}\n", .{contract.deployed_bytecode.len});

    // Use deployed bytecode for analysis
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0) 
        contract.deployed_bytecode 
    else 
        contract.bytecode;

    // Print first 64 bytes of runtime bytecode to see contract structure
    std.debug.print("\nFirst 64 bytes of runtime bytecode:\n", .{});
    const bytes_to_show = @min(64, runtime_bytecode.len);
    for (0..bytes_to_show) |i| {
        if (i % 16 == 0) std.debug.print("\n{x:04}: ", .{i});
        std.debug.print("{x:02} ", .{runtime_bytecode[i]});
    }
    std.debug.print("\n", .{});

    // Calculate the function selector for "Benchmark()"
    const function_signature = "Benchmark()";
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(function_signature);
    var hash: [32]u8 = undefined;
    hasher.final(&hash);
    const selector: [4]u8 = hash[0..4].*;
    
    std.debug.print("\nFunction selector for Benchmark(): 0x{x:02}{x:02}{x:02}{x:02}\n", 
        .{selector[0], selector[1], selector[2], selector[3]});

    // Search for the function selector in the bytecode
    var found_selector = false;
    var selector_offset: usize = 0;
    if (runtime_bytecode.len >= 4) {
        for (0..runtime_bytecode.len - 3) |i| {
            if (std.mem.eql(u8, runtime_bytecode[i..i+4], &selector)) {
                std.debug.print("Found Benchmark() selector at offset {}\n", .{i});
                found_selector = true;
                selector_offset = i;
                break;
            }
        }
    }

    if (!found_selector) {
        std.debug.print("ERROR: Benchmark() function selector NOT found in runtime bytecode\n", .{});
        
        // Let's search for any 4-byte sequence that looks like a function selector
        std.debug.print("\nScanning for potential function selectors (in dispatch table):\n", .{});
        for (0..runtime_bytecode.len - 3) |i| {
            const potential_selector = runtime_bytecode[i..i+4];
            // Look for patterns that might be selectors (typically appear after PUSH4)
            if (i > 0 and runtime_bytecode[i-1] == 0x63) { // PUSH4 opcode
                std.debug.print("  Potential selector at offset {}: 0x{x:02}{x:02}{x:02}{x:02}\n", 
                    .{i, potential_selector[0], potential_selector[1], potential_selector[2], potential_selector[3]});
            }
        }
        
        return error.FunctionSelectorNotFound;
    } else {
        std.debug.print("SUCCESS: Found function selector in bytecode\n", .{});
        
        // Show context around the selector
        if (selector_offset >= 8 and selector_offset + 12 <= runtime_bytecode.len) {
            std.debug.print("Context around selector (offset {}-{}):\n", .{selector_offset - 8, selector_offset + 12});
            for ((selector_offset - 8)..(selector_offset + 12)) |i| {
                if (i == selector_offset) std.debug.print("[", .{});
                std.debug.print("{x:02}", .{runtime_bytecode[i]});
                if (i == selector_offset + 3) std.debug.print("]", .{});
                std.debug.print(" ", .{});
            }
            std.debug.print("\n", .{});
        }
    }

    // Look for the dispatch pattern leading to the function
    std.debug.print("\nLooking for function dispatch pattern...\n", .{});
    
    // In Solidity, the function dispatch typically looks like:
    // CALLDATASIZE, PUSH1, LT, PUSH, JUMPI (for minimum calldata check)
    // Then: PUSH1 0x00, CALLDATALOAD, PUSH29, SHR (to extract function selector)
    // Then: DUP1, PUSH4 <selector>, EQ, PUSH, JUMPI (to check each function)
    
    for (0..runtime_bytecode.len - 6) |i| {
        // Look for PUSH4 followed by our selector
        if (runtime_bytecode[i] == 0x63 and // PUSH4
            i + 5 <= runtime_bytecode.len and
            std.mem.eql(u8, runtime_bytecode[i+1..i+5], &selector)) {
            std.debug.print("Found PUSH4 + selector pattern at offset {}\n", .{i});
            
            // Show the dispatch context
            const start = if (i >= 16) i - 16 else 0;
            const end = @min(i + 20, runtime_bytecode.len);
            std.debug.print("Dispatch context (offset {}-{}):\n", .{start, end});
            for (start..end) |j| {
                if (j == i) std.debug.print("[PUSH4 ", .{});
                if (j == i + 1) std.debug.print("SELECTOR", .{});
                if (j == i + 5) std.debug.print("] ", .{});
                if (j != i and j != i + 1 and j != i + 2 and j != i + 3 and j != i + 4) {
                    std.debug.print("{x:02} ", .{runtime_bytecode[j]});
                }
            }
            std.debug.print("\n", .{});
            break;
        }
    }
}
const std = @import("std");
const testing = std.testing;
const Compiler = @import("Compiler");

test "simple TenThousandHashes compilation test" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    // Same TenThousandHashes source as benchmark
    const tenhashes_source =
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

    std.debug.print("\n=== Simple TenThousandHashes Compilation Test ===\n", .{});

    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        "TenThousandHashes.sol",
        tenhashes_source,
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

    // Basic sanity checks
    try testing.expect(contract.bytecode.len > 0);
    try testing.expect(contract.deployed_bytecode.len > 0);

    // Check if we can find the Benchmark() selector in the bytecode
    const function_signature = "Benchmark()";
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(function_signature);
    var hash: [32]u8 = undefined;
    hasher.final(&hash);
    const benchmark_selector: [4]u8 = hash[0..4].*;

    std.debug.print("Benchmark() selector: 0x{x:02}{x:02}{x:02}{x:02}\n", .{ benchmark_selector[0], benchmark_selector[1], benchmark_selector[2], benchmark_selector[3] });

    // Search for the selector in deployed bytecode
    const runtime_bytecode = contract.deployed_bytecode;
    var found_selector = false;

    if (runtime_bytecode.len >= 4) {
        for (0..runtime_bytecode.len - 3) |i| {
            if (std.mem.eql(u8, runtime_bytecode[i .. i + 4], &benchmark_selector)) {
                std.debug.print("Found Benchmark() selector at offset {}\n", .{i});
                found_selector = true;
                break;
            }
        }
    }

    if (!found_selector) {
        std.debug.print("WARNING: Benchmark() selector not found in bytecode\n", .{});
    } else {
        std.debug.print("SUCCESS: Compilation and selector verification passed\n", .{});
    }

    // Check for any obvious bytecode issues
    var ascii_hex_count: usize = 0;
    for (runtime_bytecode) |byte| {
        if ((byte >= '0' and byte <= '9') or
            (byte >= 'A' and byte <= 'F') or
            (byte >= 'a' and byte <= 'f'))
        {
            ascii_hex_count += 1;
        }
    }

    const ascii_percentage = if (runtime_bytecode.len > 0) (ascii_hex_count * 100) / runtime_bytecode.len else 0;
    std.debug.print("ASCII hex percentage: {}%\n", .{ascii_percentage});

    if (ascii_percentage > 80) {
        std.debug.print("ERROR: Bytecode appears to be hex string instead of binary\n", .{});
        return error.BytecodeIsHexString;
    }
}

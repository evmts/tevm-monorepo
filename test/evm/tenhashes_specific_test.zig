const std = @import("std");
const testing = std.testing;
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

const evm = evm_root.evm;

test "TenThousandHashes specific reproduction test" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    // Exact same source as used in the benchmark
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

    // Same compilation settings as benchmark
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

    const contract = compilation_result.contracts[0];
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0)
        contract.deployed_bytecode
    else
        contract.bytecode;

    // Create VM and Database exactly like the benchmark
    const vm_ptr = try allocator.create(evm.Vm);
    defer allocator.destroy(vm_ptr);

    const database_ptr = try allocator.create(evm.MemoryDatabase);
    defer allocator.destroy(database_ptr);

    // Initialize database and VM
    database_ptr.* = evm.MemoryDatabase.init(allocator);
    defer database_ptr.deinit();

    const db_interface = database_ptr.to_database_interface();
    vm_ptr.* = try evm.Vm.init(allocator, db_interface, null, null);
    defer vm_ptr.deinit();

    // Deploy exactly like benchmark
    const contract_address = Address.from_u256(0x1000);
    const caller_address = Address.from_u256(0x2000);

    try vm_ptr.state.set_code(contract_address, runtime_bytecode);
    std.debug.print("Contract deployed at address: {any}\n", .{contract_address});

    // Verify deployment
    const stored_code = vm_ptr.state.get_code(contract_address);
    std.debug.print("Stored code length: {} bytes\n", .{stored_code.len});

    // Calculate Benchmark() selector exactly like benchmark
    const function_signature = "Benchmark()";
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(function_signature);
    var hash: [32]u8 = undefined;
    hasher.final(&hash);
    const benchmark_selector: [4]u8 = hash[0..4].*;

    std.debug.print("Benchmark() selector: 0x{x:02}{x:02}{x:02}{x:02}\n", .{ benchmark_selector[0], benchmark_selector[1], benchmark_selector[2], benchmark_selector[3] });

    // Check if this matches the hardcoded selector from benchmark
    const expected_selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    try testing.expectEqualSlices(u8, &benchmark_selector, &expected_selector);

    // Calculate code hash exactly like benchmark
    hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(runtime_bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    // Test with different gas limits to see when it fails
    const gas_limits = [_]u64{ 1000, 10_000, 21_000, 50_000, 100_000, 1_000_000, 1_000_000_000 };

    for (gas_limits) |gas_limit| {
        std.debug.print("\n--- Testing with {} gas ---\n", .{gas_limit});

        var contract_instance = evm.Contract.init(caller_address, contract_address, 0, gas_limit, runtime_bytecode, code_hash, &benchmark_selector, false);
        defer contract_instance.deinit(allocator, null);

        const result = vm_ptr.run(allocator, &contract_instance);
        std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", .{ result.status, result.gas_used, result.gas_left });

        if (result.output) |output| {
            std.debug.print("Output length: {} bytes\n", .{output.len});
            defer allocator.free(output);
        } else {
            std.debug.print("No output returned\n", .{});
        }

        // If we get exactly 45 gas usage and Invalid status, we reproduced the issue
        if (result.gas_used == 45 and result.status == .Invalid) {
            std.debug.print("REPRODUCED: Found the exact 45 gas + Invalid status issue!\n", .{});
            return error.ReproducedBenchmarkIssue; // This will fail the test but show we reproduced it
        }
    }

    std.debug.print("Could not reproduce the 45 gas + Invalid status issue\n", .{});
}

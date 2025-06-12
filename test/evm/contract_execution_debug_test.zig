const std = @import("std");
const testing = std.testing;

test "contract execution debug - gas pattern analysis" {
    const allocator = testing.allocator;

    std.debug.print("\n=== CONTRACT EXECUTION DEBUG - GAS PATTERN ANALYSIS ===\n", .{});

    // Import modules
    const Compiler = @import("Compiler");
    const evm_root = @import("evm");
    const Address = @import("Address");
    const evm = evm_root.evm;

    // Test 1: Ultra simple contract that returns a constant
    std.debug.print("\n--- Test 1: Ultra Simple Contract ---\n", .{});
    const ULTRA_SIMPLE_CONTRACT =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract UltraSimple {
        \\    function Benchmark() external pure returns (uint256) {
        \\        return 42;
        \\    }
        \\}
    ;

    try testContractExecution(allocator, Compiler, evm, Address, "UltraSimple", ULTRA_SIMPLE_CONTRACT, "Should return 42, use 100-200 gas");

    // Test 2: Contract with simple arithmetic
    std.debug.print("\n--- Test 2: Simple Arithmetic ---\n", .{});
    const SIMPLE_ARITHMETIC_CONTRACT =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract SimpleArithmetic {
        \\    function Benchmark() external pure returns (uint256) {
        \\        uint256 a = 10;
        \\        uint256 b = 20;
        \\        return a + b;
        \\    }
        \\}
    ;

    try testContractExecution(allocator, Compiler, evm, Address, "SimpleArithmetic", SIMPLE_ARITHMETIC_CONTRACT, "Should return 30, use 200+ gas");

    // Test 3: Contract with a small loop
    std.debug.print("\n--- Test 3: Small Loop ---\n", .{});
    const SMALL_LOOP_CONTRACT =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract SmallLoop {
        \\    function Benchmark() external pure returns (uint256) {
        \\        uint256 sum = 0;
        \\        for (uint256 i = 0; i < 3; i++) {
        \\            sum = sum + i;
        \\        }
        \\        return sum;  // Should return 0+1+2 = 3
        \\    }
        \\}
    ;

    try testContractExecution(allocator, Compiler, evm, Address, "SmallLoop", SMALL_LOOP_CONTRACT, "Should return 3, use 300+ gas");

    // Test 4: Contract with single keccak256
    std.debug.print("\n--- Test 4: Single Keccak256 ---\n", .{});
    const SINGLE_KECCAK_CONTRACT =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract SingleKeccak {
        \\    function Benchmark() external pure returns (bytes32) {
        \\        return keccak256(abi.encodePacked(uint256(42)));
        \\    }
        \\}
    ;

    try testContractExecution(allocator, Compiler, evm, Address, "SingleKeccak", SINGLE_KECCAK_CONTRACT, "Should return hash, use 200+ gas");

    std.debug.print("\n=== ANALYSIS ===\n", .{});
    std.debug.print("If all contracts show ~158 gas usage:\n", .{});
    std.debug.print("1. Function dispatch works (Success status)\n", .{});
    std.debug.print("2. Contract logic execution has an issue\n", .{});
    std.debug.print("3. Possible causes: early RETURN, loop issues, or gas accounting bug\n", .{});
}

fn testContractExecution(allocator: std.mem.Allocator, Compiler: anytype, evm: anytype, Address: anytype, name: []const u8, source: []const u8, expected: []const u8) !void {
    std.debug.print("\n🔍 Testing {s}\n", .{name});
    std.debug.print("Expected: {s}\n", .{expected});

    // Compile the contract
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false, // Disable optimizer for debugging
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };

    const filename = try std.fmt.allocPrint(allocator, "{s}.sol", .{name});
    defer allocator.free(filename);

    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        filename,
        source,
        settings,
    ) catch |err| {
        std.debug.print("❌ Compilation failed: {}\n", .{err});
        return;
    };
    defer compilation_result.deinit();

    if (compilation_result.errors.len > 0) {
        std.debug.print("❌ Compilation errors:\n", .{});
        for (compilation_result.errors) |compile_error| {
            std.debug.print("  {s}\n", .{compile_error.message});
        }
        return;
    }

    const contract = compilation_result.contracts[0];
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0)
        contract.deployed_bytecode
    else
        contract.bytecode;

    std.debug.print("✅ Compiled: constructor={} bytes, runtime={} bytes\n", .{ contract.bytecode.len, runtime_bytecode.len });

    // Show first few bytes for debugging
    std.debug.print("Runtime bytecode (first 16 bytes): ", .{});
    for (runtime_bytecode[0..@min(16, runtime_bytecode.len)]) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});

    // Execute the contract
    try executeContract(allocator, evm, Address, name, runtime_bytecode);
}

fn executeContract(allocator: std.mem.Allocator, evm: anytype, Address: anytype, name: []const u8, bytecode: []const u8) !void {
    std.debug.print("⚡ Executing {s}...\n", .{name});

    // Create VM and Database on heap
    const vm_ptr = try allocator.create(evm.Vm);
    defer allocator.destroy(vm_ptr);

    const database_ptr = try allocator.create(evm.MemoryDatabase);
    defer allocator.destroy(database_ptr);

    database_ptr.* = evm.MemoryDatabase.init(allocator);
    defer database_ptr.deinit();

    const db_interface = database_ptr.to_database_interface();
    vm_ptr.* = try evm.Vm.init(allocator, db_interface, null, null);
    defer vm_ptr.deinit();

    // Deploy contract
    const contract_address = Address.from_u256(0x1000);
    const caller_address = Address.from_u256(0x2000);

    try vm_ptr.state.set_code(contract_address, bytecode);
    std.debug.print("📦 Contract deployed at {any}\n", .{contract_address});

    // Function selector for Benchmark()
    const benchmark_selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    std.debug.print("🎯 Calling Benchmark() with selector 0x{x:08}\n", .{std.mem.readInt(u32, &benchmark_selector, .big)});

    // Calculate code hash
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    // Create contract instance
    var contract = evm.Contract.init(caller_address, contract_address, 0, 500_000, // 500k gas for debugging
        bytecode, code_hash, &benchmark_selector, false);
    defer contract.deinit(allocator, null);

    // Execute the contract
    const result = vm_ptr.interpret(&contract, &benchmark_selector) catch |err| {
        std.debug.print("❌ Execution failed: {}\n", .{err});
        return;
    };

    const gas_used = 500_000 - result.gas_left;

    std.debug.print("\n📊 RESULTS:\n", .{});
    std.debug.print("   Status: {any}\n", .{result.status});
    std.debug.print("   Gas used: {} gas\n", .{gas_used});
    std.debug.print("   Gas remaining: {} gas\n", .{result.gas_left});

    if (result.output) |output| {
        std.debug.print("   Output: {} bytes\n", .{output.len});
        if (output.len > 0) {
            std.debug.print("   Output (hex): ", .{});
            for (output[0..@min(32, output.len)]) |byte| {
                std.debug.print("{x:02}", .{byte});
            }
            std.debug.print("\n", .{});

            // Interpret as uint256 if 32 bytes
            if (output.len == 32) {
                const value = std.mem.readInt(u256, output[0..32], .big);
                std.debug.print("   Output as uint256: {}\n", .{value});
            }
        }
        defer allocator.free(output);
    } else {
        std.debug.print("   No output returned\n", .{});
    }

    // Quick analysis
    std.debug.print("\n🧠 QUICK ANALYSIS:\n", .{});
    if (gas_used < 100) {
        std.debug.print("   ❌ CRITICAL: Extremely low gas - execution likely failed immediately\n", .{});
    } else if (gas_used < 200) {
        std.debug.print("   ⚠️  SUSPICIOUS: Very low gas - only basic dispatch happening\n", .{});
    } else if (gas_used < 500) {
        std.debug.print("   ✅ NORMAL: Reasonable gas usage\n", .{});
    } else {
        std.debug.print("   🚀 HIGH: Significant computation occurred\n", .{});
    }

    if (result.status != .Success) {
        std.debug.print("   ❌ FAILED: Execution did not complete successfully\n", .{});
    }

    if (result.output == null) {
        std.debug.print("   ⚠️  NO OUTPUT: Function may not be returning properly\n", .{});
    }
}

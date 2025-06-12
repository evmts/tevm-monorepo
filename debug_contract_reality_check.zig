const std = @import("std");
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

const evm = evm_root.evm;

pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    std.debug.print("\n=== Reality Check: What's Actually Happening in Contract Execution ===\n", .{});

    // Test 1: Simple contract that should use very little gas
    std.debug.print("\nTest 1: Ultra simple contract (should use ~21-50 gas)...\n", .{});
    const ultra_simple_source =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract UltraSimple {
        \\    function Benchmark() external pure returns (uint256) {
        \\        return 42;
        \\    }
        \\}
    ;

    try testContract(allocator, "UltraSimple", ultra_simple_source, "Should use minimal gas (~50)");

    // Test 2: Simple loop (should use more gas)
    std.debug.print("\nTest 2: Simple loop (should use hundreds of gas)...\n", .{});
    const simple_loop_source =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract SimpleLoop {
        \\    function Benchmark() external pure returns (uint256) {
        \\        uint256 sum = 0;
        \\        for (uint256 i = 0; i < 10; i++) {
        \\            sum += i;
        \\        }
        \\        return sum;
        \\    }
        \\}
    ;

    try testContract(allocator, "SimpleLoop", simple_loop_source, "Should use hundreds of gas");

    // Test 3: Single Keccak256 (should use ~30+ gas)
    std.debug.print("\nTest 3: Single Keccak256 (should use ~30+ gas)...\n", .{});
    const single_keccak_source =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract SingleKeccak {
        \\    function Benchmark() external pure returns (bytes32) {
        \\        return keccak256(abi.encodePacked(uint256(42)));
        \\    }
        \\}
    ;

    try testContract(allocator, "SingleKeccak", single_keccak_source, "Should use ~30+ gas for keccak256");

    // Test 4: The problematic TenThousandHashes
    std.debug.print("\nTest 4: TenThousandHashes (should use 600,000+ gas)...\n", .{});
    const ten_thousand_hashes_source =
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

    try testContract(allocator, "TenThousandHashes", ten_thousand_hashes_source, "Should use 600,000+ gas");

    std.debug.print("\n=== Analysis ===\n", .{});
    std.debug.print("If ALL tests show ~158 gas, then we're not actually executing the contract logic!\n", .{});
    std.debug.print("Possible issues:\n", .{});
    std.debug.print("1. Contract is reverting immediately (function not found)\n", .{});
    std.debug.print("2. Contract is returning early without executing the loop\n", .{});
    std.debug.print("3. Our EVM is not properly executing opcodes\n", .{});
    std.debug.print("4. Gas accounting is completely wrong\n", .{});
}

fn testContract(allocator: std.mem.Allocator, name: []const u8, source: []const u8, expected: []const u8) !void {
    std.debug.print("\n--- Testing {s} ---\n", .{name});
    std.debug.print("Expected: {s}\n", .{expected});

    // Compiler settings
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false,
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
        std.debug.print("Compilation failed: {}\n", .{err});
        return;
    };
    defer compilation_result.deinit();

    if (compilation_result.errors.len > 0) {
        std.debug.print("Compilation errors:\n", .{});
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

    std.debug.print("Bytecode length: {} bytes\n", .{runtime_bytecode.len});

    // Execute with detailed logging
    const gas_used = try executeWithDetailedLogging(allocator, name, runtime_bytecode);
    
    std.debug.print("RESULT: {s} used {} gas\n", .{name, gas_used});
    
    // Reality check
    if (gas_used < 100) {
        std.debug.print("❌ SUSPICIOUS: Very low gas usage suggests execution didn't happen\n", .{});
    } else if (gas_used < 1000) {
        std.debug.print("⚠️  POSSIBLE: Low gas suggests simple execution\n", .{});
    } else {
        std.debug.print("✅ REASONABLE: Higher gas suggests real execution\n", .{});
    }
}

fn executeWithDetailedLogging(allocator: std.mem.Allocator, name: []const u8, bytecode: []const u8) !u64 {
    // Create VM and Database
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
    
    // Function selector for Benchmark()
    const benchmark_selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    
    // Calculate code hash
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);
    
    // Create contract instance
    var contract = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        10_000_000,  // 10M gas (enough for most tests)
        bytecode,
        code_hash,
        &benchmark_selector,
        false
    );
    defer contract.deinit(allocator, null);
    
    std.debug.print("Executing {s} with {} gas limit...\n", .{name, contract.gas});
    
    // Execute and measure
    const result = vm_ptr.interpret(&contract, &benchmark_selector) catch |err| {
        std.debug.print("Execution failed: {}\n", .{err});
        return 0;
    };
    
    const gas_used = 10_000_000 - result.gas_left;
    
    std.debug.print("Status: {any}\n", .{result.status});
    std.debug.print("Gas used: {}\n", .{gas_used});
    std.debug.print("Gas left: {}\n", .{result.gas_left});
    
    if (result.output) |output| {
        std.debug.print("Output length: {}\n", .{output.len});
        defer allocator.free(output);
    } else {
        std.debug.print("No output\n", .{});
    }
    
    return gas_used;
}
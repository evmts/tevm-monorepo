const std = @import("std");
const testing = std.testing;
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

const evm = evm_root.evm;

test "contract call setup and initial execution" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    // Simple contract that should execute successfully
    const simple_contract_source =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract Simple {
        \\    function test() external pure returns (uint256) {
        \\        return 42;
        \\    }
        \\}
    ;

    // Compile the contract
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };

    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        "Simple.sol",
        simple_contract_source,
        settings,
    ) catch |err| {
        std.debug.print("Compilation failed: {}\n", .{err});
        return err;
    };
    defer compilation_result.deinit();

    if (compilation_result.errors.len > 0) {
        return error.CompilationFailed;
    }

    const contract = compilation_result.contracts[0];
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0) 
        contract.deployed_bytecode 
    else 
        contract.bytecode;

    std.debug.print("\n=== Contract Call Setup Test ===\n", .{});

    // Create VM and Database on heap
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
    
    // Deploy the contract
    const contract_address = Address.from_u256(0x1000);
    const caller_address = Address.from_u256(0x2000);
    
    try vm_ptr.state.set_code(contract_address, runtime_bytecode);
    
    // Calculate function selector for test() 
    const function_signature = "test()";
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(function_signature);
    var hash: [32]u8 = undefined;
    hasher.final(&hash);
    const test_selector: [4]u8 = hash[0..4].*;
    
    std.debug.print("test() function selector: 0x{x:02}{x:02}{x:02}{x:02}\n", 
        .{test_selector[0], test_selector[1], test_selector[2], test_selector[3]});
    
    // Test 1: Call with no data (should fail)
    std.debug.print("\n--- Test 1: Call with no calldata ---\n", .{});
    var empty_data: [0]u8 = .{};
    var code_hash: [32]u8 = undefined;
    hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(runtime_bytecode);
    hasher.final(&code_hash);
    
    var contract_no_data = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        100_000,
        runtime_bytecode,
        code_hash,
        &empty_data,
        false
    );
    defer contract_no_data.deinit(allocator, null);
    
    const result_no_data = vm_ptr.run(allocator, &contract_no_data);
    std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", 
        .{result_no_data.status, result_no_data.gas_used, result_no_data.gas_left});
    
    // Test 2: Call with correct function selector
    std.debug.print("\n--- Test 2: Call with test() selector ---\n", .{});
    var contract_with_selector = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        100_000,
        runtime_bytecode,
        code_hash,
        &test_selector,
        false
    );
    defer contract_with_selector.deinit(allocator, null);
    
    const result_with_selector = vm_ptr.run(allocator, &contract_with_selector);
    std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", 
        .{result_with_selector.status, result_with_selector.gas_used, result_with_selector.gas_left});
    
    if (result_with_selector.output) |output| {
        std.debug.print("Output length: {} bytes\n", .{output.len});
        if (output.len >= 32) {
            // Should be 42 (0x2a) padded to 32 bytes
            const return_value = std.mem.readInt(u256, output[0..32], .big);
            std.debug.print("Return value: {}\n", .{return_value});
            try testing.expect(return_value == 42);
        }
        defer allocator.free(output);
    }
    
    // Test 3: Call with wrong function selector
    std.debug.print("\n--- Test 3: Call with wrong selector ---\n", .{});
    const wrong_selector: [4]u8 = .{ 0x12, 0x34, 0x56, 0x78 };
    var contract_wrong_selector = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        100_000,
        runtime_bytecode,
        code_hash,
        &wrong_selector,
        false
    );
    defer contract_wrong_selector.deinit(allocator, null);
    
    const result_wrong_selector = vm_ptr.run(allocator, &contract_wrong_selector);
    std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", 
        .{result_wrong_selector.status, result_wrong_selector.gas_used, result_wrong_selector.gas_left});
}
const std = @import("std");
const testing = std.testing;
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

const evm = evm_root.evm;

test "basic contract deployment and code storage" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    // Simple contract that should deploy successfully
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
        std.debug.print("Compilation errors:\n", .{});
        for (compilation_result.errors) |compile_error| {
            std.debug.print("  {s}\n", .{compile_error.message});
        }
        return error.CompilationFailed;
    }

    try testing.expect(compilation_result.contracts.len > 0);
    const contract = compilation_result.contracts[0];
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0)
        contract.deployed_bytecode
    else
        contract.bytecode;

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

    // Deploy the contract to a test address
    const contract_address = Address.from_u256(0x1000);

    // Set up initial state - put the deployed bytecode at the contract address
    try vm_ptr.state.set_code(contract_address, runtime_bytecode);
    std.debug.print("Contract deployed at address: {any}\n", .{contract_address});

    // Verify deployment
    const stored_code = vm_ptr.state.get_code(contract_address);
    std.debug.print("Stored code length: {} bytes\n", .{stored_code.len});

    // Verify the stored code matches what we deployed
    try testing.expect(stored_code.len == runtime_bytecode.len);
    try testing.expectEqualSlices(u8, stored_code, runtime_bytecode);

    std.debug.print("SUCCESS: Contract deployment and code storage verified\n", .{});
}

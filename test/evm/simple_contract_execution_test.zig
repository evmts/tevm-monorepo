const std = @import("std");
const testing = std.testing;

test "simple contract execution debug" {
    const allocator = testing.allocator;
    
    std.debug.print("=== SIMPLE CONTRACT EXECUTION DEBUG ===\n", .{});
    
    // Test with the simplest possible contract
    const SIMPLE_CONTRACT =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.0;
        \\
        \\contract Simple {
        \\    function test() external pure returns (uint256) {
        \\        return 42;
        \\    }
        \\}
    ;
    
    const Compiler = @import("Compiler");
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false,  // Disable optimizer for debugging
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };
    
    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        "Simple.sol",
        SIMPLE_CONTRACT,
        settings,
    ) catch |err| {
        std.debug.print("Compilation failed: {}\n", .{err});
        return;
    };
    defer compilation_result.deinit();
    
    if (compilation_result.contracts.len == 0) {
        std.debug.print("No contracts compiled\n", .{});
        return;
    }
    
    const contract = compilation_result.contracts[0];
    std.debug.print("Contract: {s}, bytecode length: {}\n", .{ contract.name, contract.bytecode.len });
    std.debug.print("First 32 bytes of bytecode: ", .{});
    for (contract.bytecode[0..@min(32, contract.bytecode.len)]) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Try to execute using the EVM
    const evm_root = @import("evm");
    
    // Create VM and Database on heap to avoid stack overflow
    const vm_ptr = allocator.create(evm_root.evm.Vm) catch |err| {
        std.debug.print("VM allocation failed: {}\n", .{err});
        return;
    };
    defer allocator.destroy(vm_ptr);
    
    const database_ptr = allocator.create(evm_root.evm.MemoryDatabase) catch |err| {
        std.debug.print("Database allocation failed: {}\n", .{err});
        return;
    };
    defer allocator.destroy(database_ptr);
    
    // Initialize database and VM
    database_ptr.* = evm_root.evm.MemoryDatabase.init(allocator);
    defer database_ptr.deinit();
    
    const db_interface = database_ptr.to_database_interface();
    vm_ptr.* = evm_root.evm.Vm.init(allocator, db_interface, null, null) catch |err| {
        std.debug.print("VM init failed: {}\n", .{err});
        return;
    };
    defer vm_ptr.deinit();
    
    std.debug.print("VM created successfully\n", .{});
    
    // Set up addresses
    const contract_address = evm_root.evm.Address.from_u256(0x1000);
    const caller_address = evm_root.evm.Address.from_u256(0x2000);
    
    // Deploy the contract code
    try vm_ptr.state.set_code(contract_address, contract.bytecode);
    std.debug.print("Contract deployed at {any}\n", .{contract_address});
    
    // Verify the code was stored
    const stored_code = vm_ptr.state.get_code(contract_address);
    std.debug.print("Stored code length: {}\n", .{stored_code.len});
    
    // Test with function selector for test(): bytes4(keccak256("test()"))
    // For test(), the selector is: 0xf8a8fd6d
    const TEST_SELECTOR: [4]u8 = .{ 0xf8, 0xa8, 0xfd, 0x6d };
    
    std.debug.print("Function selector: ", .{});
    for (TEST_SELECTOR) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Calculate code hash
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(contract.bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);
    
    // Create a contract instance for execution
    var contract_instance = evm_root.evm.Contract.init(
        caller_address,       // caller
        contract_address,     // address
        0,                   // value (no ETH transfer)
        10_000_000,          // gas limit
        contract.bytecode,   // code
        code_hash,           // code hash
        &TEST_SELECTOR,      // input data
        false                // not static
    );
    defer contract_instance.deinit(allocator, null);
    
    std.debug.print("Contract instance created with gas: {}\n", .{contract_instance.gas});
    
    // Execute the contract
    const result = vm_ptr.interpret(&contract_instance, &TEST_SELECTOR) catch |err| {
        std.debug.print("Contract execution failed: {}\n", .{err});
        return;
    };
    
    // Report execution results
    const gas_used = 10_000_000 - result.gas_left;
    std.debug.print("Contract executed: status={}, gas_used={}, gas_left={}\n", .{ result.status, gas_used, result.gas_left });
    
    if (result.output) |output| {
        std.debug.print("Output length: {} bytes\n", .{output.len});
        std.debug.print("Output: ", .{});
        for (output) |byte| {
            std.debug.print("{x:02}", .{byte});
        }
        std.debug.print("\n", .{});
        defer allocator.free(output);
    } else {
        std.debug.print("No output\n", .{});
    }
    
    std.debug.print("=== END SIMPLE CONTRACT EXECUTION DEBUG ===\n", .{});
}
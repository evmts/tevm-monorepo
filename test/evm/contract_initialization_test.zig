const std = @import("std");
const testing = std.testing;
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

const evm = evm_root.evm;

test "contract initialization and first bytes execution" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    // Ultra simple contract
    const ultra_simple_source =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract UltraSimple {
        \\    function get() external pure returns (uint256) {
        \\        return 1;
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
        "UltraSimple.sol",
        ultra_simple_source,
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

    std.debug.print("\n=== Contract Initialization Test ===\n", .{});
    std.debug.print("Runtime bytecode length: {} bytes\n", .{runtime_bytecode.len});

    // Analyze the first few bytes of the bytecode
    std.debug.print("First 20 bytes of runtime bytecode: ", .{});
    const bytes_to_show = @min(20, runtime_bytecode.len);
    for (runtime_bytecode[0..bytes_to_show]) |byte| {
        std.debug.print("{x:02} ", .{byte});
    }
    std.debug.print("\n", .{});

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
    
    // Calculate function selector for get() 
    const function_signature = "get()";
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(function_signature);
    var hash: [32]u8 = undefined;
    hasher.final(&hash);
    const get_selector: [4]u8 = hash[0..4].*;
    
    std.debug.print("get() function selector: 0x{x:02}{x:02}{x:02}{x:02}\n", 
        .{get_selector[0], get_selector[1], get_selector[2], get_selector[3]});

    // Check if selector exists in bytecode
    var found_selector = false;
    if (runtime_bytecode.len >= 4) {
        for (0..runtime_bytecode.len - 3) |i| {
            if (std.mem.eql(u8, runtime_bytecode[i..i+4], &get_selector)) {
                std.debug.print("Found get() selector at offset {}\n", .{i});
                found_selector = true;
                break;
            }
        }
    }

    if (!found_selector) {
        std.debug.print("WARNING: get() selector not found in bytecode\n", .{});
    }

    // Test different execution scenarios with precise gas tracking
    var code_hash: [32]u8 = undefined;
    hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(runtime_bytecode);
    hasher.final(&code_hash);

    // Test 1: Call with 21000 gas (standard transaction gas)
    std.debug.print("\n--- Test 1: Standard transaction gas (21000) ---\n", .{});
    var contract_21k = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        21_000,
        runtime_bytecode,
        code_hash,
        &get_selector,
        false
    );
    defer contract_21k.deinit(allocator, null);
    
    const result_21k = vm_ptr.run(allocator, &contract_21k);
    std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", 
        .{result_21k.status, result_21k.gas_used, result_21k.gas_left});

    // Test 2: Call with 45 gas (the exact amount we've been seeing)
    std.debug.print("\n--- Test 2: Exactly 45 gas ---\n", .{});
    var contract_45 = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        45,
        runtime_bytecode,
        code_hash,
        &get_selector,
        false
    );
    defer contract_45.deinit(allocator, null);
    
    const result_45 = vm_ptr.run(allocator, &contract_45);
    std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", 
        .{result_45.status, result_45.gas_used, result_45.gas_left});

    // Test 3: Call with 46 gas (one more than we've been seeing)
    std.debug.print("\n--- Test 3: Exactly 46 gas ---\n", .{});
    var contract_46 = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        46,
        runtime_bytecode,
        code_hash,
        &get_selector,
        false
    );
    defer contract_46.deinit(allocator, null);
    
    const result_46 = vm_ptr.run(allocator, &contract_46);
    std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", 
        .{result_46.status, result_46.gas_used, result_46.gas_left});

    // Test 4: Call with 50 gas 
    std.debug.print("\n--- Test 4: 50 gas ---\n", .{});
    var contract_50 = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        50,
        runtime_bytecode,
        code_hash,
        &get_selector,
        false
    );
    defer contract_50.deinit(allocator, null);
    
    const result_50 = vm_ptr.run(allocator, &contract_50);
    std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", 
        .{result_50.status, result_50.gas_used, result_50.gas_left});

    // Test 5: Call with 100 gas 
    std.debug.print("\n--- Test 5: 100 gas ---\n", .{});
    var contract_100 = evm.Contract.init(
        caller_address,
        contract_address,
        0,
        100,
        runtime_bytecode,
        code_hash,
        &get_selector,
        false
    );
    defer contract_100.deinit(allocator, null);
    
    const result_100 = vm_ptr.run(allocator, &contract_100);
    std.debug.print("Status: {any}, Gas used: {}, Gas left: {}\n", 
        .{result_100.status, result_100.gas_used, result_100.gas_left});

    // Test 6: No function call data - just run the contract initialization
    std.debug.print("\n--- Test 6: No calldata (contract initialization only) ---\n", .{});
    var empty_data: [0]u8 = .{};
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

    std.debug.print("\nAnalysis complete - checking for 45 gas pattern\n", .{});
}
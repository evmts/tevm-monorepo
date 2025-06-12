const std = @import("std");
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

// Simple contract that should execute successfully with minimal gas
const SIMPLE_CONTRACT_SOURCE =
    \\// SPDX-License-Identifier: MIT
    \\pragma solidity ^0.8.0;
    \\
    \\contract Simple {
    \\    function getValue() external pure returns (uint256) {
    \\        return 42;
    \\    }
    \\}
;

// Even simpler contract - just returns immediately
const MINIMAL_CONTRACT_SOURCE =
    \\// SPDX-License-Identifier: MIT
    \\pragma solidity ^0.8.0;
    \\
    \\contract Minimal {
    \\    function test() external pure returns (bool) {
    \\        return true;
    \\    }
    \\}
;

fn testContractExecution(allocator: std.mem.Allocator, contract_name: []const u8, source: []const u8, selector: [4]u8) !void {
    std.debug.print("\n=== Testing {s} ===\n", .{contract_name});
    
    // Compile contract
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false,  // Disable optimizer for clearer debugging
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };
    
    const filename = try std.fmt.allocPrint(allocator, "{s}.sol", .{contract_name});
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
    
    if (compilation_result.contracts.len == 0) {
        std.debug.print("No contracts compiled\n", .{});
        return;
    }
    
    const contract = compilation_result.contracts[0];
    std.debug.print("Compiled {s}: constructor={} bytes, runtime={} bytes\n", .{
        contract_name, contract.bytecode.len, contract.deployed_bytecode.len
    });
    
    // Use runtime bytecode
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0) contract.deployed_bytecode else contract.bytecode;
    
    std.debug.print("First 32 bytes of runtime bytecode: ", .{});
    for (runtime_bytecode[0..@min(32, runtime_bytecode.len)]) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Create VM and Database on heap
    const vm_ptr = try allocator.create(evm_root.evm.Vm);
    defer allocator.destroy(vm_ptr);
    
    const database_ptr = try allocator.create(evm_root.evm.MemoryDatabase);
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
    
    // Deploy contract
    const contract_address = Address.from_u256(0x1000);
    const caller_address = Address.from_u256(0x2000);
    
    vm_ptr.state.set_code(contract_address, runtime_bytecode) catch |err| {
        std.debug.print("Failed to set code: {}\n", .{err});
        return;
    };
    
    std.debug.print("Contract deployed successfully\n", .{});
    
    // Verify deployment
    const stored_code = vm_ptr.state.get_code(contract_address);
    std.debug.print("Stored code length: {} bytes\n", .{stored_code.len});
    
    // Calculate code hash
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(runtime_bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);
    
    // Test different gas limits to see where the issue occurs
    const gas_limits = [_]u64{ 21000, 50000, 100000, 1000000, 10000000, 100000000 };
    
    for (gas_limits) |gas_limit| {
        std.debug.print("\n--- Testing with {} gas ---\n", .{gas_limit});
        
        // Create contract instance
        var contract_instance = evm_root.evm.Contract.init(
            caller_address,
            contract_address,
            0,                  // value
            gas_limit,
            runtime_bytecode,
            code_hash,
            &selector,          // function selector
            false               // not static
        );
        defer contract_instance.deinit(allocator, null);
        
        // Execute
        const result = vm_ptr.interpret(&contract_instance, &selector) catch |err| {
            std.debug.print("Execution failed with error: {}\n", .{err});
            continue;
        };
        
        const gas_used = gas_limit - result.gas_left;
        std.debug.print("Status: {}, Gas used: {}, Gas left: {}\n", .{ result.status, gas_used, result.gas_left });
        
        if (result.output) |output| {
            std.debug.print("Output length: {} bytes\n", .{output.len});
            if (output.len > 0) {
                std.debug.print("Output: ", .{});
                for (output[0..@min(32, output.len)]) |byte| {
                    std.debug.print("{x:02}", .{byte});
                }
                std.debug.print("\n", .{});
            }
            defer allocator.free(output);
        }
        
        // If successful, break
        if (result.status == .Success) {
            std.debug.print("SUCCESS with {} gas!\n", .{gas_limit});
            break;
        }
    }
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("=== EVM Gas Debugging Tool ===\n", .{});
    
    // Test with progressively simpler contracts
    
    // Function selector for getValue(): bytes4(keccak256("getValue()"))
    const GET_VALUE_SELECTOR: [4]u8 = .{ 0x20, 0x96, 0x52, 0x32 }; // This is an approximation
    try testContractExecution(allocator, "Simple", SIMPLE_CONTRACT_SOURCE, GET_VALUE_SELECTOR);
    
    // Function selector for test(): bytes4(keccak256("test()"))  
    const TEST_SELECTOR: [4]u8 = .{ 0xf8, 0xa8, 0xfd, 0x6d };
    try testContractExecution(allocator, "Minimal", MINIMAL_CONTRACT_SOURCE, TEST_SELECTOR);
    
    // Test the problematic Benchmark() selector
    std.debug.print("\n=== Testing with Benchmark() selector ===\n", .{});
    const BENCHMARK_SELECTOR: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    try testContractExecution(allocator, "MinimalBenchmark", 
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.0;
        \\
        \\contract MinimalBenchmark {
        \\    function Benchmark() external pure returns (uint256) {
        \\        return 1;
        \\    }
        \\}
    , BENCHMARK_SELECTOR);
}
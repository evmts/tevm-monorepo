const std = @import("std");
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

const TENHASHES_CONTRACT =
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

pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    std.debug.print("=== Testing TenThousandHashes with Fixed Selector ===\n", .{});

    // Compile contract
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
        TENHASHES_CONTRACT,
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

    // Create VM and Database
    const vm_ptr = try allocator.create(evm_root.evm.Vm);
    defer allocator.destroy(vm_ptr);
    
    const database_ptr = try allocator.create(evm_root.evm.MemoryDatabase);
    defer allocator.destroy(database_ptr);
    
    database_ptr.* = evm_root.evm.MemoryDatabase.init(allocator);
    defer database_ptr.deinit();
    
    const db_interface = database_ptr.to_database_interface();
    vm_ptr.* = try evm_root.evm.Vm.init(allocator, db_interface, null, null);
    defer vm_ptr.deinit();
    
    // Deploy contract
    const contract_address = Address.from_u256(0x1000);
    const caller_address = Address.from_u256(0x2000);
    
    try vm_ptr.state.set_code(contract_address, runtime_bytecode);
    
    // CORRECT Benchmark() selector
    const benchmark_selector: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    
    // Calculate code hash
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(runtime_bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);
    
    // Test with different gas limits
    const gas_limits = [_]u64{ 1000000, 10000000, 100000000 };
    
    for (gas_limits) |gas_limit| {
        std.debug.print("\n--- Testing with {} gas ---\n", .{gas_limit});
        
        var contract_instance = evm_root.evm.Contract.init(
            caller_address,
            contract_address,
            0,
            gas_limit,
            runtime_bytecode,
            code_hash,
            &benchmark_selector,
            false
        );
        defer contract_instance.deinit(allocator, null);
        
        const start_time = std.time.nanoTimestamp();
        
        const result = vm_ptr.interpret(&contract_instance, &benchmark_selector) catch |err| {
            std.debug.print("Execution failed: {}\n", .{err});
            continue;
        };
        
        const end_time = std.time.nanoTimestamp();
        const execution_time_ms = @as(f64, @floatFromInt(end_time - start_time)) / 1_000_000.0;
        
        const gas_used = gas_limit - result.gas_left;
        
        std.debug.print("Status: {any}\n", .{result.status});
        std.debug.print("Gas used: {} gas\n", .{gas_used});
        std.debug.print("Gas left: {} gas\n", .{result.gas_left});
        std.debug.print("Execution time: {d:.2} ms\n", .{execution_time_ms});
        
        if (result.output) |output| {
            std.debug.print("Output length: {} bytes\n", .{output.len});
            defer allocator.free(output);
        }
        
        // Analyze results
        if (result.status == .Success) {
            std.debug.print("🎉 SUCCESS! TenThousandHashes executed properly\n", .{});
            if (gas_used > 100000) {
                std.debug.print("✅ Realistic gas usage: {} gas (expected: high)\n", .{gas_used});
            } else {
                std.debug.print("⚠️  Still low gas usage: {} gas\n", .{gas_used});
            }
            break;
        } else if (result.status == .Revert) {
            std.debug.print("❌ Contract reverted (likely out of gas)\n", .{});
        } else {
            std.debug.print("❌ Execution failed with status: {any}\n", .{result.status});
        }
    }
    
    std.debug.print("\n=== CONCLUSION ===\n", .{});
    std.debug.print("If gas usage is now high (>100k gas), the fix worked!\n", .{});
    std.debug.print("If gas usage is still low (~158 gas), there may be other issues.\n", .{});
}
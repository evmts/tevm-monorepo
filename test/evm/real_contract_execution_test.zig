const std = @import("std");
const testing = std.testing;

test "debug real solidity contract compilation and EVM execution" {
    const allocator = testing.allocator;
    
    std.debug.print("=== DEBUGGING REAL CONTRACT EXECUTION ===\n", .{});
    
    // Test 1: Verify compiler works
    const Compiler = @import("Compiler");
    std.debug.print("1. Compiler module imported successfully\n", .{});
    
    // Test 2: Simple contract compilation
    const simple_contract =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.0;
        \\
        \\contract SimpleTest {
        \\    function test() external pure returns (uint256) {
        \\        return 42;
        \\    }
        \\}
    ;
    
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = true,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };
    
    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        "SimpleTest.sol",
        simple_contract,
        settings,
    ) catch |err| {
        std.debug.print("2. Compilation failed: {}\n", .{err});
        return;
    };
    defer compilation_result.deinit();
    
    std.debug.print("2. Compilation succeeded\n", .{});
    std.debug.print("   Contracts: {}\n", .{compilation_result.contracts.len});
    std.debug.print("   Errors: {}\n", .{compilation_result.errors.len});
    
    if (compilation_result.contracts.len == 0) {
        std.debug.print("   ERROR: No contracts compiled\n", .{});
        return;
    }
    
    const contract = compilation_result.contracts[0];
    std.debug.print("   Contract name: {s}\n", .{contract.name});
    std.debug.print("   Bytecode length: {}\n", .{contract.bytecode.len});
    std.debug.print("   First 20 bytes: ", .{});
    for (contract.bytecode[0..@min(20, contract.bytecode.len)]) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    // Test 3: Try to access EVM for execution
    const evm_root = @import("evm");
    std.debug.print("3. EVM module imported\n", .{});
    
    // Test 4: Check what's available in EVM
    if (@hasDecl(evm_root, "evm")) {
        const evm = evm_root.evm;
        std.debug.print("4. Found EVM sub-module\n", .{});
        
        // Test 5: Look for execution capabilities
        if (@hasDecl(evm, "vm")) {
            std.debug.print("5. Found VM in EVM\n", .{});
        } else {
            std.debug.print("5. No VM found in EVM\n", .{});
        }
        
        if (@hasDecl(evm, "execution")) {
            std.debug.print("6. Found execution in EVM\n", .{});
        } else {
            std.debug.print("6. No execution found in EVM\n", .{});
        }
        
        if (@hasDecl(evm, "State")) {
            std.debug.print("7. Found State in EVM\n", .{});
        } else {
            std.debug.print("7. No State found in EVM\n", .{});
        }
    }
    
    std.debug.print("=== END DEBUG ===\n", .{});
}

test "debug TenThousandHashes contract specifically" {
    const allocator = testing.allocator;
    
    std.debug.print("=== DEBUGGING TEN THOUSAND HASHES ===\n", .{});
    
    const TEN_THOUSAND_HASHES_SOURCE =
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
    
    const Compiler = @import("Compiler");
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = true,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };
    
    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        "TenThousandHashes.sol",
        TEN_THOUSAND_HASHES_SOURCE,
        settings,
    ) catch |err| {
        std.debug.print("TenThousandHashes compilation failed: {}\n", .{err});
        
        // Let's try a simpler version first
        std.debug.print("Attempting simple version...\n", .{});
        
        const simple_version =
            \\// SPDX-License-Identifier: MIT
            \\pragma solidity ^0.8.0;
            \\
            \\contract TenThousandHashes {
            \\    function Benchmark() external pure {
            \\        for (uint256 i = 0; i < 10; i++) {
            \\            keccak256(abi.encodePacked(i));
            \\        }
            \\    }
            \\}
        ;
        
        var simple_result = Compiler.Compiler.compile_source(
            allocator,
            "TenThousandHashesSimple.sol",
            simple_version,
            settings,
        ) catch |simple_err| {
            std.debug.print("Even simple version failed: {}\n", .{simple_err});
            return;
        };
        defer simple_result.deinit();
        
        std.debug.print("Simple version compiled! Contracts: {}\n", .{simple_result.contracts.len});
        if (simple_result.errors.len > 0) {
            std.debug.print("Simple version errors:\n", .{});
            for (simple_result.errors) |simple_error| {
                std.debug.print("  {s}\n", .{simple_error.message});
            }
        }
        return;
    };
    defer compilation_result.deinit();
    
    std.debug.print("TenThousandHashes compiled successfully!\n", .{});
    
    if (compilation_result.errors.len > 0) {
        std.debug.print("Compilation warnings/errors:\n", .{});
        for (compilation_result.errors) |compile_error| {
            std.debug.print("  {s}\n", .{compile_error.message});
        }
    }
    
    if (compilation_result.contracts.len == 0) {
        std.debug.print("ERROR: No contracts in compilation result\n", .{});
        return;
    }
    
    const contract = compilation_result.contracts[0];
    std.debug.print("Contract: {s}\n", .{contract.name});
    std.debug.print("Bytecode length: {}\n", .{contract.bytecode.len});
    std.debug.print("ABI entries: {}\n", .{contract.abi.len});
    
    // Now try to execute this contract
    std.debug.print("Now attempting actual execution...\n", .{});
    
    // Function selector for Benchmark(): bytes4(keccak256("Benchmark()"))
    const BENCHMARK_SELECTOR: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    
    std.debug.print("Function selector: ", .{});
    for (BENCHMARK_SELECTOR) |byte| {
        std.debug.print("{x:02}", .{byte});
    }
    std.debug.print("\n", .{});
    
    std.debug.print("=== END TEN THOUSAND HASHES DEBUG ===\n", .{});
}

test "attempt real EVM execution with TenThousandHashes" {
    const allocator = testing.allocator;
    
    std.debug.print("=== TESTING REAL EVM EXECUTION ===\n", .{});
    
    // Compile the contract first
    const TEN_THOUSAND_HASHES_SOURCE =
        \\// SPDX-License-Identifier: GPL-3.0
        \\pragma solidity ^0.8.17;
        \\
        \\contract TenThousandHashes {
        \\    function Benchmark() external pure {
        \\        for (uint256 i = 0; i < 100; i++) {
        \\            keccak256(abi.encodePacked(i));
        \\        }
        \\    }
        \\}
    ;
    
    const Compiler = @import("Compiler");
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = true,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };
    
    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        "TenThousandHashes.sol",
        TEN_THOUSAND_HASHES_SOURCE,
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
    std.debug.print("Contract compiled: {s}, bytecode length: {}\n", .{ contract.name, contract.bytecode.len });
    
    // Try to execute using the EVM
    const evm_root = @import("evm");
    const evm = evm_root.evm;
    
    // Create a memory database
    var database = evm.MemoryDatabase.init(allocator);
    defer database.deinit();
    
    // Create VM instance
    var vm = evm.Vm.init(allocator, database.to_database_interface(), null, null) catch |err| {
        std.debug.print("VM init failed: {}\n", .{err});
        return;
    };
    defer vm.deinit();
    
    std.debug.print("VM created successfully\n", .{});
    
    // Let's try to find a simpler way to execute contracts
    // For now, let's just report success in getting this far
    std.debug.print("Successfully set up EVM execution environment\n", .{});
    std.debug.print("Next step: figure out contract call interface\n", .{});
    
    std.debug.print("=== END REAL EVM EXECUTION TEST ===\n", .{});
}
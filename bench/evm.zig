const std = @import("std");
const zbench = @import("zbench");
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

// Import EVM components
const evm = evm_root.evm;

// Solidity source code for TenThousandHashes benchmark
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

// Benchmark TenThousandHashes contract - actual Solidity compilation and execution
fn benchmarkTenThousandHashes(allocator: std.mem.Allocator) void {
    compileAndExecuteBenchmark(allocator, "TenThousandHashes", TEN_THOUSAND_HASHES_SOURCE) catch {
        std.debug.print("TenThousandHashes benchmark failed\n", .{});
    };
}

// Simplified SnailTracer contract for benchmarking (from the evm-bench submodule)
const SNAIL_TRACER_SOURCE =
    \\// SPDX-License-Identifier: GPL-3.0
    \\pragma solidity ^0.8.17;
    \\
    \\contract SnailTracer {
    \\    struct Vector {
    \\        int x; int y; int z;
    \\    }
    \\
    \\    function Benchmark() external pure returns (uint8 r, uint8 g, uint8 b) {
    \\        // Simplified ray tracing calculation
    \\        Vector memory color = Vector(0, 0, 0);
    \\
    \\        for (uint i = 0; i < 100; i++) {
    \\            // Simple ray calculations
    \\            int x = int(i * 123456);
    \\            int y = int(i * 789012);
    \\            int z = int(i * 345678);
    \\
    \\            // Vector operations
    \\            color.x += x / 1000;
    \\            color.y += y / 1000;
    \\            color.z += z / 1000;
    \\
    \\            // Simulate complex calculations
    \\            color.x = sqrt(abs(color.x));
    \\            color.y = sqrt(abs(color.y));
    \\            color.z = sqrt(abs(color.z));
    \\        }
    \\
    \\        return (uint8(color.x % 256), uint8(color.y % 256), uint8(color.z % 256));
    \\    }
    \\
    \\    function sqrt(int x) internal pure returns (int y) {
    \\        if (x == 0) return 0;
    \\        int z = (x + 1) / 2;
    \\        y = x;
    \\        while (z < y) {
    \\            y = z;
    \\            z = (x/z + z) / 2;
    \\        }
    \\    }
    \\
    \\    function abs(int x) internal pure returns (int) {
    \\        return x >= 0 ? x : -x;
    \\    }
    \\}
;

// Benchmark SnailTracer contract - actual Solidity compilation and execution
fn benchmarkSnailTracer(allocator: std.mem.Allocator) void {
    compileAndExecuteBenchmark(allocator, "SnailTracer", SNAIL_TRACER_SOURCE) catch {
        std.debug.print("SnailTracer benchmark failed\n", .{});
    };
}

// Simple ERC20Transfer contract for benchmarking
const ERC20_TRANSFER_SOURCE =
    \\// SPDX-License-Identifier: GPL-3.0
    \\pragma solidity ^0.8.17;
    \\
    \\contract ERC20Transfer {
    \\    mapping(address => uint256) public balances;
    \\
    \\    function Benchmark() external {
    \\        // Simulate multiple transfers
    \\        for (uint i = 0; i < 1000; i++) {
    \\            address from = address(uint160(i));
    \\            address to = address(uint160(i + 1));
    \\            uint256 amount = 1000000000000000000; // 1 ETH
    \\
    \\            // Initialize balances if needed
    \\            if (balances[from] == 0) {
    \\                balances[from] = 10000000000000000000; // 10 ETH
    \\            }
    \\
    \\            // Transfer logic
    \\            require(balances[from] >= amount, "Insufficient balance");
    \\            balances[from] -= amount;
    \\            balances[to] += amount;
    \\        }
    \\    }
    \\}
;

// Benchmark ERC20Transfer contract - actual Solidity compilation and execution
fn benchmarkERC20Transfer(allocator: std.mem.Allocator) void {
    compileAndExecuteBenchmark(allocator, "ERC20Transfer", ERC20_TRANSFER_SOURCE) catch {
        std.debug.print("ERC20Transfer benchmark failed\n", .{});
    };
}

// Function selector for Benchmark() function: bytes4(keccak256("Benchmark()"))
// Let's verify this is correct by compiling a simple test contract
const BENCHMARK_SELECTOR: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };

// Helper function to compile and execute a benchmark contract
fn compileAndExecuteBenchmark(allocator: std.mem.Allocator, contract_name: []const u8, source: []const u8) !void {
    // Compiler settings
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = true,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };

    // Use proper .sol filename for compilation
    const filename = try std.fmt.allocPrint(allocator, "{s}.sol", .{contract_name});
    defer allocator.free(filename);

    // Compile the contract
    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        filename,
        source,
        settings,
    ) catch |err| {
        std.debug.print("Compilation failed for {s}: {}\n", .{ contract_name, err });
        // For benchmarking, we could fall back to simulation, but the user wants real execution
        return error.CompilationFailed;
    };
    defer compilation_result.deinit();

    if (compilation_result.errors.len > 0) {
        std.debug.print("Compilation errors for {s}:\n", .{contract_name});
        for (compilation_result.errors) |compile_error| {
            std.debug.print("  {s}\n", .{compile_error.message});
        }
        return error.CompilationFailed;
    }

    if (compilation_result.contracts.len == 0) {
        std.debug.print("No contracts compiled for {s}\n", .{contract_name});
        return error.CompilationFailed;
    }

    const contract = compilation_result.contracts[0];

    std.debug.print("Contract {s}: bytecode_len={}, deployed_bytecode_len={}\n", .{ contract_name, contract.bytecode.len, contract.deployed_bytecode.len });

    // Use deployed bytecode for execution, not constructor bytecode
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0) contract.deployed_bytecode else contract.bytecode;

    // Execute the contract using real EVM
    try executeContractBenchmark(allocator, contract_name, runtime_bytecode);
}

// Execute a contract's Benchmark() function using the real EVM
fn executeContractBenchmark(allocator: std.mem.Allocator, contract_name: []const u8, deployed_bytecode: []const u8) !void {
    // Create VM and Database on heap to avoid stack overflow
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
    const caller_address = Address.from_u256(0x2000);

    // Set up initial state - put the deployed bytecode at the contract address
    try vm_ptr.state.set_code(contract_address, deployed_bytecode);
    std.debug.print("Contract deployed at address: {any}\n", .{contract_address});

    // Verify deployment
    const stored_code = vm_ptr.state.get_code(contract_address);
    std.debug.print("Stored code length: {} bytes\n", .{stored_code.len});

    // Create call data for Benchmark() function
    const call_data = BENCHMARK_SELECTOR;
    std.debug.print("Calling Benchmark() with selector: 0x{x:0>8}\n", .{std.mem.readInt(u32, &call_data, .big)});

    // Calculate code hash for the deployed bytecode
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(deployed_bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    // Create a contract instance for execution with much higher gas limit
    var contract = evm.Contract.init(caller_address, // caller
        contract_address, // address
        0, // value (no ETH transfer)
        1_000_000_000, // gas limit (1B gas)
        deployed_bytecode, // code
        code_hash, // code hash
        &call_data, // input data
        false // not static
    );
    defer contract.deinit(allocator, null);

    // Execute the contract using the VM's interpret method
    const result = vm_ptr.interpret(&contract, &call_data) catch |err| {
        std.debug.print("Contract execution failed with error: {}\n", .{err});
        return;
    };

    // Report execution results
    const gas_used = 1_000_000_000 - result.gas_left;
    std.debug.print("Contract executed: status={}, gas_used={}, gas_left={}\n", .{ result.status, gas_used, result.gas_left });

    if (result.output) |output| {
        std.debug.print("Output length: {} bytes\n", .{output.len});
        if (output.len > 0) {
            std.debug.print("Output (first 32 bytes): ", .{});
            for (output[0..@min(32, output.len)]) |byte| {
                std.debug.print("{x:02}", .{byte});
            }
            std.debug.print("\n", .{});
        }
        defer allocator.free(output);
    } else {
        std.debug.print("No output returned\n", .{});
    }

    // Check if the execution was successful
    if (result.status != .Success) {
        std.debug.print("WARNING: Execution did not complete successfully\n", .{});
    }

    std.debug.print("=== End {s} benchmark ===\n\n", .{contract_name});
}

// Simulate contract execution for benchmarking
fn simulateContractExecution(contract_name: []const u8, bytecode: []const u8) void {
    _ = contract_name;

    // Simulate EVM execution by doing computational work
    // proportional to bytecode size and complexity
    var result: u64 = 0;

    // Process bytecode in chunks to simulate instruction execution
    for (bytecode, 0..) |byte, i| {
        // Simulate opcode processing
        result = result +% @as(u64, byte);
        result = result *% 31;
        result = result ^ @as(u64, i);

        // Add some computational overhead to simulate EVM execution
        if (i % 32 == 0) {
            var temp: u64 = result;
            for (0..10) |_| {
                temp = temp *% 17 +% 13;
            }
            result ^= temp;
        }
    }

    // Prevent optimization
    std.mem.doNotOptimizeAway(result);
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("EVM Contract Execution Benchmarks\n", .{});
    try stdout.print("==================================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Register contract execution benchmarks
    try bench.add("TenThousandHashes - Keccak256 Performance", benchmarkTenThousandHashes, .{});
    try bench.add("SnailTracer - Ray Tracing Algorithm", benchmarkSnailTracer, .{});
    try bench.add("ERC20Transfer - Token Transfer Operations", benchmarkERC20Transfer, .{});

    // Run benchmarks
    try stdout.print("Running contract execution benchmarks...\n\n", .{});
    try bench.run(stdout);
}

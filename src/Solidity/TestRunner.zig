const std = @import("std");
const compiler = @import("../Compilers/compiler.zig");
const Compiler = compiler.Compiler;

// Test result structure
const TestResult = struct {
    name: []const u8,
    passed: bool,
    message: []const u8,
    gas_used: ?u64 = null,
};

// Individual test contracts
const test_contracts = [_]struct {
    name: []const u8,
    file: []const u8,
}{
    .{ .name = "TestBasicOps", .file = "test_contracts/TestBasicOps.sol" },
    .{ .name = "TestMemory", .file = "test_contracts/TestMemory.sol" },
    .{ .name = "TestStorage", .file = "test_contracts/TestStorage.sol" },
    .{ .name = "TestControlFlow", .file = "test_contracts/TestControlFlow.sol" },
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    std.debug.print("\n=== EVM Test Suite Runner ===\n\n", .{});

    var all_passed = true;
    var total_tests: usize = 0;
    var passed_tests: usize = 0;

    // Compile each test contract
    for (test_contracts) |test_contract| {
        std.debug.print("Compiling {s}...\n", .{test_contract.name});
        
        const file_path = try std.fmt.allocPrint(allocator, "src/Solidity/{s}", .{test_contract.file});
        defer allocator.free(file_path);
        
        // Read the source file
        const source = std.fs.cwd().readFileAlloc(allocator, file_path, 1024 * 1024) catch |err| {
            std.debug.print("  ERROR: Failed to read {s}: {}\n", .{ file_path, err });
            all_passed = false;
            continue;
        };
        defer allocator.free(source);
        
        // Compile settings
        const settings = compiler.CompilerSettings{
            .optimizer_enabled = true,
            .optimizer_runs = 200,
            .output_abi = true,
            .output_bytecode = true,
            .output_deployed_bytecode = true,
        };
        
        // Compile the contract
        var result = Compiler.compileSource(
            allocator,
            test_contract.file,
            source,
            settings,
        ) catch |err| {
            std.debug.print("  ERROR: Compilation failed: {}\n", .{err});
            all_passed = false;
            continue;
        };
        defer result.deinit();
        
        // Check for compilation errors
        if (result.errors.len > 0) {
            std.debug.print("  Compilation errors:\n", .{});
            for (result.errors) |err| {
                std.debug.print("    - {s}\n", .{err.message});
            }
            all_passed = false;
            continue;
        }
        
        // Process compiled contracts
        for (result.contracts) |contract| {
            if (std.mem.eql(u8, contract.name, test_contract.name)) {
                std.debug.print("  ✓ Compiled {s}\n", .{contract.name});
                std.debug.print("    - Bytecode length: {} bytes\n", .{contract.bytecode.len});
                std.debug.print("    - Deployed bytecode length: {} bytes\n", .{contract.deployed_bytecode.len});
                std.debug.print("    - ABI functions: {}\n", .{contract.abi.len});
                
                // Save bytecode for testing
                const bytecode_file = try std.fmt.allocPrint(allocator, "src/Solidity/test_contracts/{s}.bytecode", .{test_contract.name});
                defer allocator.free(bytecode_file);
                
                const bytecode_out = try std.fs.cwd().createFile(bytecode_file, .{});
                defer bytecode_out.close();
                try bytecode_out.writeAll(contract.deployed_bytecode);
                
                // Save ABI for reference
                const abi_file = try std.fmt.allocPrint(allocator, "src/Solidity/test_contracts/{s}.abi.json", .{test_contract.name});
                defer allocator.free(abi_file);
                
                // Convert ABI back to JSON for saving
                var abi_json = std.ArrayList(u8).init(allocator);
                defer abi_json.deinit();
                try std.json.stringify(contract.abi, .{}, abi_json.writer());
                
                const abi_out = try std.fs.cwd().createFile(abi_file, .{});
                defer abi_out.close();
                try abi_out.writeAll(abi_json.items);
                
                total_tests += 1;
                passed_tests += 1;
            }
        }
    }
    
    // Summary
    std.debug.print("\n=== Test Summary ===\n", .{});
    std.debug.print("Total contracts: {}\n", .{total_tests});
    std.debug.print("Compiled successfully: {}\n", .{passed_tests});
    std.debug.print("Failed: {}\n", .{total_tests - passed_tests});
    
    if (all_passed) {
        std.debug.print("\n✅ All test contracts compiled successfully!\n", .{});
        std.debug.print("\nNext step: Run EVM tests using the compiled bytecode\n", .{});
    } else {
        std.debug.print("\n❌ Some test contracts failed to compile\n", .{});
        return error.TestsFailed;
    }
}
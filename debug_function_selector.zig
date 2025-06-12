const std = @import("std");
const Compiler = @import("Compiler");
const Address = @import("Address");
const evm_root = @import("evm");
const evm = evm_root.evm;

// Simple contract to test function selector
const SIMPLE_TEST_CONTRACT =
    \\// SPDX-License-Identifier: GPL-3.0
    \\pragma solidity ^0.8.17;
    \\
    \\contract SimpleTest {
    \\    uint256 public value = 42;
    \\    
    \\    function Benchmark() external pure returns (uint256) {
    \\        return 12345;
    \\    }
    \\    
    \\    function getValue() external view returns (uint256) {
    \\        return value;
    \\    }
    \\}
;

pub fn main() !void {
    std.debug.print("=== FUNCTION SELECTOR DEBUG ===\n", .{});
    
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    // Compile the simple test contract
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = true,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };
    
    const filename = "SimpleTest.sol";
    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        filename,
        SIMPLE_TEST_CONTRACT,
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
    std.debug.print("Compiled contract: {s}\n", .{contract.name});
    std.debug.print("Deployed bytecode length: {} bytes\n", .{contract.deployed_bytecode.len});
    
    // Print first 64 bytes of deployed bytecode to look for function selectors
    std.debug.print("First 64 bytes of deployed bytecode:\n", .{});
    for (contract.deployed_bytecode[0..@min(64, contract.deployed_bytecode.len)], 0..) |byte, i| {
        if (i % 16 == 0) std.debug.print("\n{d:4}: ", .{i});
        std.debug.print("{x:02} ", .{byte});
    }
    std.debug.print("\n\n", .{});
    
    // Look for potential function selectors in the bytecode
    std.debug.print("Looking for function selectors in bytecode...\n", .{});
    
    // Expected selectors (manually calculated - these might be wrong)
    const benchmark_selector = [_]u8{ 0x30, 0x62, 0x7b, 0x7c };
    const get_value_selector = [_]u8{ 0x20, 0x96, 0x52, 0x71 }; // keccak256("getValue()")[:4] - this is a guess
    
    var found_benchmark = false;
    var found_get_value = false;
    
    for (contract.deployed_bytecode, 0..) |_, i| {
        if (i + 4 <= contract.deployed_bytecode.len) {
            const slice = contract.deployed_bytecode[i..i+4];
            if (std.mem.eql(u8, slice, &benchmark_selector)) {
                std.debug.print("Found Benchmark() selector at offset {}: {x:02}{x:02}{x:02}{x:02}\n", .{i, slice[0], slice[1], slice[2], slice[3]});
                found_benchmark = true;
            }
            if (std.mem.eql(u8, slice, &get_value_selector)) {
                std.debug.print("Found getValue() selector at offset {}: {x:02}{x:02}{x:02}{x:02}\n", .{i, slice[0], slice[1], slice[2], slice[3]});
                found_get_value = true;
            }
        }
    }
    
    if (!found_benchmark) {
        std.debug.print("WARNING: Benchmark() selector not found in bytecode!\n", .{});
    }
    if (!found_get_value) {
        std.debug.print("WARNING: getValue() selector not found in bytecode!\n", .{});
    }
    
    std.debug.print("\n=== END FUNCTION SELECTOR DEBUG ===\n", .{});
}
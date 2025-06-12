const std = @import("std");
const evm_root = @import("evm");
const Compiler = @import("Compiler");
const Address = @import("Address");

// Simple TenThousandHashes contract for analysis
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

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("=== Detailed Bytecode Analysis ===\n", .{});
    
    // Compile the contract
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false,  // Disable optimizer for clearer analysis
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
    std.debug.print("Contract: constructor={} bytes, runtime={} bytes\n", .{
        contract.bytecode.len, 
        contract.deployed_bytecode.len
    });
    
    // Print the full deployed bytecode
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0) contract.deployed_bytecode else contract.bytecode;
    
    std.debug.print("\n=== Deployed Bytecode ({} bytes) ===\n", .{runtime_bytecode.len});
    for (runtime_bytecode, 0..) |byte, i| {
        if (i % 16 == 0) {
            std.debug.print("\n{x:04}: ", .{i});
        }
        std.debug.print("{x:02} ", .{byte});
    }
    std.debug.print("\n\n", .{});
    
    // Analyze bytecode structure
    std.debug.print("=== Bytecode Analysis ===\n", .{});
    
    // Check if Benchmark() selector is in the bytecode
    const BENCHMARK_SELECTOR: [4]u8 = .{ 0x30, 0x62, 0x7b, 0x7c };
    std.debug.print("Looking for Benchmark() selector: 0x{x:0>8}\n", .{std.mem.readInt(u32, &BENCHMARK_SELECTOR, .big)});
    
    var found_selector = false;
    var selector_offset: usize = 0;
    if (runtime_bytecode.len >= 4) {
        for (0..runtime_bytecode.len - 3) |i| {
            if (std.mem.eql(u8, runtime_bytecode[i..i+4], &BENCHMARK_SELECTOR)) {
                std.debug.print("Found Benchmark() selector at offset {}\n", .{i});
                found_selector = true;
                selector_offset = i;
                break;
            }
        }
    }
    
    if (!found_selector) {
        std.debug.print("Benchmark() selector NOT found in bytecode!\n", .{});
    }
    
    // Look for key opcodes that might consume 11734 gas
    std.debug.print("\n=== Key Opcodes Analysis ===\n", .{});
    for (runtime_bytecode, 0..) |byte, i| {
        const opcode_name = switch (byte) {
            0x00 => "STOP",
            0x01 => "ADD", 
            0x02 => "MUL",
            0x03 => "SUB",
            0x04 => "DIV",
            0x05 => "SDIV",
            0x06 => "MOD",
            0x07 => "SMOD",
            0x08 => "ADDMOD",
            0x09 => "MULMOD",
            0x0a => "EXP",
            0x10 => "LT",
            0x11 => "GT",
            0x12 => "SLT",
            0x13 => "SGT",
            0x14 => "EQ",
            0x15 => "ISZERO",
            0x16 => "AND",
            0x17 => "OR",
            0x18 => "XOR",
            0x19 => "NOT",
            0x1a => "BYTE",
            0x1b => "SHL",
            0x1c => "SHR",
            0x1d => "SAR",
            0x20 => "KECCAK256",
            0x30 => "ADDRESS",
            0x31 => "BALANCE",
            0x32 => "ORIGIN",
            0x33 => "CALLER",
            0x34 => "CALLVALUE",
            0x35 => "CALLDATALOAD",
            0x36 => "CALLDATASIZE",
            0x37 => "CALLDATACOPY",
            0x38 => "CODESIZE",
            0x39 => "CODECOPY",
            0x3a => "GASPRICE",
            0x3b => "EXTCODESIZE",
            0x3c => "EXTCODECOPY",
            0x3d => "RETURNDATASIZE",
            0x3e => "RETURNDATACOPY",
            0x3f => "EXTCODEHASH",
            0x40 => "BLOCKHASH",
            0x41 => "COINBASE",
            0x42 => "TIMESTAMP",
            0x43 => "NUMBER",
            0x44 => "DIFFICULTY",
            0x45 => "GASLIMIT",
            0x50 => "POP",
            0x51 => "MLOAD",
            0x52 => "MSTORE",
            0x53 => "MSTORE8",
            0x54 => "SLOAD",
            0x55 => "SSTORE",
            0x56 => "JUMP",
            0x57 => "JUMPI",
            0x58 => "PC",
            0x59 => "MSIZE",
            0x5a => "GAS",
            0x5b => "JUMPDEST",
            0x5f => "PUSH0",
            0x60...0x7f => "PUSH",
            0x80...0x8f => "DUP",
            0x90...0x9f => "SWAP",
            0xa0 => "LOG0",
            0xa1 => "LOG1",
            0xa2 => "LOG2",
            0xa3 => "LOG3",
            0xa4 => "LOG4",
            0xf0 => "CREATE",
            0xf1 => "CALL",
            0xf2 => "CALLCODE", 
            0xf3 => "RETURN",
            0xf4 => "DELEGATECALL",
            0xf5 => "CREATE2",
            0xfa => "STATICCALL",
            0xfd => "REVERT",
            0xfe => "INVALID",
            0xff => "SELFDESTRUCT",
            else => null,
        };
        
        if (opcode_name) |name| {
            std.debug.print("0x{x:04}: 0x{x:02} {s}\n", .{i, byte, name});
        }
    }
    
    // Calculate expected gas usage for function dispatch
    std.debug.print("\n=== Expected Gas Analysis ===\n", .{});
    std.debug.print("Transaction base cost: 21000 gas\n", .{});
    std.debug.print("Contract call setup: ~700 gas\n", .{});
    std.debug.print("Function selector check: ~3-8 gas per check\n", .{});
    std.debug.print("Memory expansion: varies\n", .{});
    std.debug.print("Observed gas consumption: 11734 gas\n", .{});
    std.debug.print("Overhead beyond transaction: {} gas\n", .{11734 - 21000});
    
    // Check if the Solidity function dispatch pattern is present
    std.debug.print("\n=== Function Dispatch Pattern Analysis ===\n", .{});
    
    // Look for typical Solidity dispatch pattern:
    // 1. CALLDATASIZE check
    // 2. CALLDATALOAD to get selector
    // 3. DUP/SWAP operations for comparison
    // 4. EQ checks with function selectors
    // 5. JUMPI to function body
    
    var dispatch_opcodes = std.ArrayList(struct{offset: usize, opcode: u8, name: []const u8}).init(allocator);
    defer dispatch_opcodes.deinit();
    
    for (runtime_bytecode, 0..) |byte, i| {
        switch (byte) {
            0x36 => try dispatch_opcodes.append(.{.offset = i, .opcode = byte, .name = "CALLDATASIZE"}),
            0x35 => try dispatch_opcodes.append(.{.offset = i, .opcode = byte, .name = "CALLDATALOAD"}),
            0x14 => try dispatch_opcodes.append(.{.offset = i, .opcode = byte, .name = "EQ"}),
            0x57 => try dispatch_opcodes.append(.{.offset = i, .opcode = byte, .name = "JUMPI"}),
            0x63 => try dispatch_opcodes.append(.{.offset = i, .opcode = byte, .name = "PUSH4"}),
            else => {},
        }
    }
    
    std.debug.print("Function dispatch opcodes found:\n", .{});
    for (dispatch_opcodes.items) |item| {
        std.debug.print("  0x{x:04}: {s}\n", .{item.offset, item.name});
    }
}
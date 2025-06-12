const std = @import("std");
const testing = std.testing;
const Compiler = @import("Compiler");

test "identify exact point where execution becomes invalid" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    std.debug.print("\n=== Invalid Execution Point Analysis ===\n", .{});

    // Test contracts with known good and bad patterns
    const test_contracts = [_]struct {
        name: []const u8,
        source: []const u8,
        expected_status: []const u8,
    }{
        .{
            .name = "Empty Contract",
            .source =
            \\// SPDX-License-Identifier: MIT
            \\pragma solidity ^0.8.17;
            \\contract Empty {}
            ,
            .expected_status = "Should revert with no calldata",
        },
        .{
            .name = "Single Return Function",
            .source =
            \\// SPDX-License-Identifier: MIT
            \\pragma solidity ^0.8.17;
            \\contract SingleReturn {
            \\    function getValue() external pure returns (uint256) {
            \\        return 42;
            \\    }
            \\}
            ,
            .expected_status = "Should work if selector found",
        },
        .{
            .name = "Multiple Functions",
            .source =
            \\// SPDX-License-Identifier: MIT
            \\pragma solidity ^0.8.17;
            \\contract MultiFunctions {
            \\    function getA() external pure returns (uint256) { return 1; }
            \\    function getB() external pure returns (uint256) { return 2; }
            \\    function getC() external pure returns (uint256) { return 3; }
            \\}
            ,
            .expected_status = "Should have complex dispatch logic",
        },
        .{
            .name = "Constructor Only",
            .source =
            \\// SPDX-License-Identifier: MIT
            \\pragma solidity ^0.8.17;
            \\contract ConstructorOnly {
            \\    uint256 public value;
            \\    constructor() { value = 100; }
            \\}
            ,
            .expected_status = "Should have getter for value",
        },
    };

    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };

    for (test_contracts) |test_contract| {
        std.debug.print("\n--- Analyzing: {s} ---\n", .{test_contract.name});
        std.debug.print("Expected: {s}\n", .{test_contract.expected_status});

        var compilation_result = Compiler.Compiler.compile_source(
            allocator,
            "Test.sol",
            test_contract.source,
            settings,
        ) catch |err| {
            std.debug.print("Compilation failed: {}\n", .{err});
            continue;
        };
        defer compilation_result.deinit();

        if (compilation_result.errors.len > 0) {
            std.debug.print("Compilation errors found, skipping...\n", .{});
            continue;
        }

        const contract = compilation_result.contracts[0];
        const runtime_bytecode = if (contract.deployed_bytecode.len > 0)
            contract.deployed_bytecode
        else
            contract.bytecode;

        // Analyze the bytecode structure
        if (runtime_bytecode.len > 0) {
            std.debug.print("First 10 bytes: ", .{});
            const bytes_to_show = @min(10, runtime_bytecode.len);
            for (runtime_bytecode[0..bytes_to_show]) |byte| {
                std.debug.print("{x:02} ", .{byte});
            }
            std.debug.print("\n", .{});

            // Look for common patterns that could cause invalid execution

            // Pattern 1: Check for JUMPDEST opcodes (0x5b)
            var jumpdest_count: usize = 0;
            for (runtime_bytecode) |byte| {
                if (byte == 0x5b) jumpdest_count += 1;
            }
            std.debug.print("JUMPDEST count: {}\n", .{jumpdest_count});

            // Pattern 2: Check for JUMP/JUMPI opcodes (0x56/0x57)
            var jump_count: usize = 0;
            for (runtime_bytecode) |byte| {
                if (byte == 0x56 or byte == 0x57) jump_count += 1;
            }
            std.debug.print("JUMP/JUMPI count: {}\n", .{jump_count});

            // Pattern 3: Check for invalid opcodes (anything > 0xfe)
            var invalid_opcode_count: usize = 0;
            for (runtime_bytecode) |byte| {
                if (byte > 0xfe) invalid_opcode_count += 1;
            }
            std.debug.print("Invalid opcodes (>0xfe): {}\n", .{invalid_opcode_count});

            // Pattern 4: Look for function dispatch patterns
            // Solidity typically starts with PUSH1 0x80 PUSH1 0x40 MSTORE (0x608060405234...)
            const typical_solidity_start = [_]u8{ 0x60, 0x80, 0x60, 0x40, 0x52 };
            if (runtime_bytecode.len >= typical_solidity_start.len) {
                const matches_pattern = std.mem.eql(u8, runtime_bytecode[0..typical_solidity_start.len], &typical_solidity_start);
                std.debug.print("Starts with typical Solidity pattern: {}\n", .{matches_pattern});
            }

            // Pattern 5: Estimate where the 45 gas would be consumed
            // Simulate gas consumption for first several opcodes
            var estimated_gas: u32 = 0;
            var opcode_count: usize = 0;
            var i: usize = 0;

            std.debug.print("Simulated execution:\n", .{});
            while (i < runtime_bytecode.len and estimated_gas < 50 and opcode_count < 20) {
                const opcode = runtime_bytecode[i];
                var opcode_gas: u32 = 3; // Default VERYLOW cost
                var opcode_name: []const u8 = "UNKNOWN";
                var advance: usize = 1;

                // Determine opcode cost and name
                switch (opcode) {
                    0x00 => {
                        opcode_gas = 0;
                        opcode_name = "STOP";
                    },
                    0x01...0x0f => {
                        opcode_gas = 3;
                        opcode_name = "ARITH";
                    },
                    0x10...0x1f => {
                        opcode_gas = 3;
                        opcode_name = "COMPARE";
                    },
                    0x20...0x2f => {
                        opcode_gas = 30;
                        opcode_name = "KECCAK256";
                    },
                    0x30...0x3f => {
                        opcode_gas = 2;
                        opcode_name = "ENV";
                    },
                    0x40...0x4f => {
                        opcode_gas = 3;
                        opcode_name = "BLOCK";
                    },
                    0x50...0x5f => {
                        if (opcode == 0x56 or opcode == 0x57) {
                            opcode_gas = 8;
                            opcode_name = "JUMP";
                        } else if (opcode == 0x5b) {
                            opcode_gas = 1;
                            opcode_name = "JUMPDEST";
                        } else {
                            opcode_gas = 3;
                            opcode_name = "STACK";
                        }
                    },
                    0x60...0x7f => {
                        // PUSH1 to PUSH32
                        const push_size = opcode - 0x5f;
                        opcode_gas = 3;
                        opcode_name = "PUSH";
                        advance = 1 + push_size;
                    },
                    0x80...0x8f => {
                        opcode_gas = 3;
                        opcode_name = "DUP";
                    },
                    0x90...0x9f => {
                        opcode_gas = 3;
                        opcode_name = "SWAP";
                    },
                    0xf0...0xff => {
                        opcode_gas = 0;
                        opcode_name = "SYSTEM";
                    },
                    else => {
                        opcode_gas = 3;
                        opcode_name = "OTHER";
                    },
                }

                estimated_gas += opcode_gas;
                opcode_count += 1;

                std.debug.print("  #{}: 0x{x:02} {s} (+{} gas, total: {})\n", .{ opcode_count, opcode, opcode_name, opcode_gas, estimated_gas });

                if (estimated_gas == 45) {
                    std.debug.print("    ^^^ EXACTLY 45 GAS AT THIS POINT!\n", .{});
                }

                i += advance;
            }

            if (estimated_gas >= 45) {
                std.debug.print("Reached 45+ gas after {} opcodes\n", .{opcode_count});
            } else {
                std.debug.print("Only consumed {} gas in first {} opcodes\n", .{ estimated_gas, opcode_count });
            }
        }
    }

    std.debug.print("\nAnalysis complete. Looking for patterns in 45-gas invalid execution.\n", .{});
}

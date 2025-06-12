const std = @import("std");
const testing = std.testing;
const evm_root = @import("evm");
const Compiler = @import("Compiler");

test "bytecode compilation reproduces corrupted hex issue" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    // Simple contract that should compile to valid bytecode
    const simple_contract_source =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.17;
        \\
        \\contract Simple {
        \\    function test() external pure returns (uint256) {
        \\        return 42;
        \\    }
        \\}
    ;

    // Compile the contract
    const settings = Compiler.CompilerSettings{
        .optimizer_enabled = false,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };

    var compilation_result = Compiler.Compiler.compile_source(
        allocator,
        "Simple.sol",
        simple_contract_source,
        settings,
    ) catch |err| {
        std.debug.print("Compilation failed: {}\n", .{err});
        return err;
    };
    defer compilation_result.deinit();

    // Check for compilation errors
    if (compilation_result.errors.len > 0) {
        std.debug.print("Compilation errors:\n", .{});
        for (compilation_result.errors) |compile_error| {
            std.debug.print("  {s}\n", .{compile_error.message});
        }
        return error.CompilationFailed;
    }

    try testing.expect(compilation_result.contracts.len > 0);

    const contract = compilation_result.contracts[0];
    const runtime_bytecode = if (contract.deployed_bytecode.len > 0) 
        contract.deployed_bytecode 
    else 
        contract.bytecode;

    std.debug.print("\n=== Bytecode Analysis ===\n", .{});
    std.debug.print("Constructor bytecode length: {}\n", .{contract.bytecode.len});
    std.debug.print("Runtime bytecode length: {}\n", .{runtime_bytecode.len});

    // Print first 32 bytes of runtime bytecode
    std.debug.print("First 32 bytes of runtime bytecode:\n", .{});
    const bytes_to_show = @min(32, runtime_bytecode.len);
    for (0..bytes_to_show) |i| {
        if (i % 16 == 0) std.debug.print("\n{x:04}: ", .{i});
        std.debug.print("{x:02} ", .{runtime_bytecode[i]});
    }
    std.debug.print("\n", .{});

    // Check if bytecode looks like ASCII hex instead of binary
    var ascii_hex_count: usize = 0;
    var valid_opcode_count: usize = 0;

    for (runtime_bytecode) |byte| {
        // Check if byte is ASCII hex character (0-9, A-F, a-f)
        if ((byte >= '0' and byte <= '9') or 
            (byte >= 'A' and byte <= 'F') or 
            (byte >= 'a' and byte <= 'f')) {
            ascii_hex_count += 1;
        }
        
        // Check if byte is a valid EVM opcode (most opcodes are 0x00-0xff)
        // But ASCII values 0x30-0x66 ('0'-'f') are unusual for EVM bytecode
        if (byte <= 0x0a or  // STOP to EXP
            (byte >= 0x10 and byte <= 0x1d) or  // LT to SAR
            byte == 0x20 or  // KECCAK256
            (byte >= 0x30 and byte <= 0x3f) or  // ADDRESS to EXTCODEHASH
            (byte >= 0x40 and byte <= 0x45) or  // BLOCKHASH to GASLIMIT
            (byte >= 0x50 and byte <= 0x5b) or  // POP to JUMPDEST
            byte == 0x5f or  // PUSH0
            (byte >= 0x60 and byte <= 0x7f) or  // PUSH1 to PUSH32
            (byte >= 0x80 and byte <= 0x9f) or  // DUP1 to SWAP16
            (byte >= 0xa0 and byte <= 0xa4) or  // LOG0 to LOG4
            (byte >= 0xf0 and byte <= 0xf5) or  // CREATE to CREATE2
            byte == 0xfa or byte == 0xfd or byte == 0xfe or byte == 0xff) {  // STATICCALL, REVERT, INVALID, SELFDESTRUCT
            valid_opcode_count += 1;
        }
    }

    const ascii_percentage = (ascii_hex_count * 100) / runtime_bytecode.len;
    const valid_opcode_percentage = (valid_opcode_count * 100) / runtime_bytecode.len;

    std.debug.print("\nBytecode analysis:\n", .{});
    std.debug.print("  ASCII hex characters: {} ({} %)\n", .{ascii_hex_count, ascii_percentage});
    std.debug.print("  Valid EVM opcodes: {} ({} %)\n", .{valid_opcode_count, valid_opcode_percentage});

    // If more than 80% of bytes are ASCII hex characters, likely we have hex string instead of binary
    if (ascii_percentage > 80) {
        std.debug.print("ERROR: Bytecode appears to be ASCII hex string instead of binary!\n", .{});
        
        // Try to decode the hex string to see if it produces valid bytecode
        if (runtime_bytecode.len % 2 == 0) {
            std.debug.print("Attempting to decode hex string...\n", .{});
            
            const decoded = try allocator.alloc(u8, runtime_bytecode.len / 2);
            defer allocator.free(decoded);
            
            for (0..decoded.len) |i| {
                const hex_pair = runtime_bytecode[i * 2..i * 2 + 2];
                decoded[i] = std.fmt.parseInt(u8, hex_pair, 16) catch {
                    std.debug.print("Failed to decode hex at position {}\n", .{i * 2});
                    return error.InvalidHexString;
                };
            }
            
            std.debug.print("Decoded bytecode first 32 bytes:\n", .{});
            for (0..@min(32, decoded.len)) |i| {
                if (i % 16 == 0) std.debug.print("\n{x:04}: ", .{i});
                std.debug.print("{x:02} ", .{decoded[i]});
            }
            std.debug.print("\n", .{});
            
            // Check for function selector in decoded bytecode
            const test_selector: [4]u8 = .{ 0xf8, 0xa8, 0xfd, 0x6d }; // test() selector
            var found_selector = false;
            if (decoded.len >= 4) {
                for (0..decoded.len - 3) |i| {
                    if (std.mem.eql(u8, decoded[i..i+4], &test_selector)) {
                        std.debug.print("Found test() selector at offset {} in decoded bytecode\n", .{i});
                        found_selector = true;
                        break;
                    }
                }
            }
            
            if (!found_selector) {
                std.debug.print("test() selector not found in decoded bytecode\n", .{});
            }
        }
        
        return error.BytecodeIsHexString;
    }

    // Look for the test() function selector in the runtime bytecode
    const test_selector: [4]u8 = .{ 0xf8, 0xa8, 0xfd, 0x6d }; // bytes4(keccak256("test()"))
    var found_selector = false;
    
    if (runtime_bytecode.len >= 4) {
        for (0..runtime_bytecode.len - 3) |i| {
            if (std.mem.eql(u8, runtime_bytecode[i..i+4], &test_selector)) {
                std.debug.print("Found test() selector at offset {}\n", .{i});
                found_selector = true;
                break;
            }
        }
    }

    // For a valid Solidity contract, we should find the function selector
    if (!found_selector) {
        std.debug.print("WARNING: test() function selector not found in bytecode\n", .{});
    }

    // Check if bytecode starts with typical Solidity dispatch pattern
    if (runtime_bytecode.len >= 8) {
        const starts_with_dispatch = (runtime_bytecode[0] == 0x60 and  // PUSH1
                                     runtime_bytecode[2] == 0x60 and   // PUSH1
                                     runtime_bytecode[4] == 0x52) or   // MSTORE
                                    (runtime_bytecode[0] == 0x36 and   // CALLDATASIZE
                                     runtime_bytecode[1] == 0x60);     // PUSH1
        
        if (!starts_with_dispatch) {
            std.debug.print("WARNING: Bytecode doesn't start with typical Solidity dispatch pattern\n", .{});
        }
    }
}
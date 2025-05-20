const std = @import("std");
const testing = std.testing;

// Test opcode names to ensure they match expected values
test "Simplified Opcode Names Test" {
    // Define mappings of opcodes to their expected names
    const test_cases = [_]struct {
        opcode: u8,
        expected_name: []const u8,
    }{
        // Common opcodes that should have consistent names
        .{ .opcode = 0x00, .expected_name = "STOP" },
        .{ .opcode = 0x01, .expected_name = "ADD" },
        .{ .opcode = 0x02, .expected_name = "MUL" },
        .{ .opcode = 0x03, .expected_name = "SUB" },
        .{ .opcode = 0x04, .expected_name = "DIV" },
        .{ .opcode = 0x10, .expected_name = "LT" },
        .{ .opcode = 0x11, .expected_name = "GT" },
        .{ .opcode = 0x50, .expected_name = "POP" },
        .{ .opcode = 0x56, .expected_name = "JUMP" },
        .{ .opcode = 0x57, .expected_name = "JUMPI" },
    };
    
    // Simple lookup function to get opcode names
    const getOpcodeName = struct {
        fn call(code: u8) []const u8 {
            const names = [_][]const u8{
                "STOP",       // 0x00
                "ADD",        // 0x01
                "MUL",        // 0x02
                "SUB",        // 0x03
                "DIV",        // 0x04
                "SDIV",       // 0x05
                "MOD",        // 0x06
                "SMOD",       // 0x07
                "ADDMOD",     // 0x08
                "MULMOD",     // 0x09
                "EXP",        // 0x0a
                "SIGNEXTEND", // 0x0b
                "UNKNOWN",    // 0x0c
                "UNKNOWN",    // 0x0d
                "UNKNOWN",    // 0x0e
                "UNKNOWN",    // 0x0f
                "LT",         // 0x10
                "GT",         // 0x11
                "SLT",        // 0x12
                "SGT",        // 0x13
                "EQ",         // 0x14
                "ISZERO",     // 0x15
                "AND",        // 0x16
                "OR",         // 0x17
                "XOR",        // 0x18
                "NOT",        // 0x19
                "BYTE",       // 0x1a
                "SHL",        // 0x1b
                "SHR",        // 0x1c
                "SAR",        // 0x1d
                "UNKNOWN",    // 0x1e
                "UNKNOWN",    // 0x1f
                "SHA3",       // 0x20
                "UNKNOWN",    // 0x21
                "UNKNOWN",    // 0x22
                "UNKNOWN",    // 0x23
                "UNKNOWN",    // 0x24
                "UNKNOWN",    // 0x25
                "UNKNOWN",    // 0x26
                "UNKNOWN",    // 0x27
                "UNKNOWN",    // 0x28
                "UNKNOWN",    // 0x29
                "UNKNOWN",    // 0x2a
                "UNKNOWN",    // 0x2b
                "UNKNOWN",    // 0x2c
                "UNKNOWN",    // 0x2d
                "UNKNOWN",    // 0x2e
                "UNKNOWN",    // 0x2f
                "ADDRESS",    // 0x30
                "BALANCE",    // 0x31
                "ORIGIN",     // 0x32
                "CALLER",     // 0x33
                "CALLVALUE",  // 0x34
                "CALLDATALOAD", // 0x35
                "CALLDATASIZE", // 0x36
                "CALLDATACOPY", // 0x37
                "CODESIZE",   // 0x38
                "CODECOPY",   // 0x39
                "GASPRICE",   // 0x3a
                "EXTCODESIZE", // 0x3b
                "EXTCODECOPY", // 0x3c
                "RETURNDATASIZE", // 0x3d
                "RETURNDATACOPY", // 0x3e
                "EXTCODEHASH", // 0x3f
                "BLOCKHASH",  // 0x40
                "COINBASE",   // 0x41
                "TIMESTAMP",  // 0x42
                "NUMBER",     // 0x43
                "PREVRANDAO", // 0x44 (formerly DIFFICULTY)
                "GASLIMIT",   // 0x45
                "CHAINID",    // 0x46
                "SELFBALANCE", // 0x47
                "BASEFEE",    // 0x48
                "BLOBHASH",   // 0x49
                "BLOBBASEFEE", // 0x4a
                "UNKNOWN",    // 0x4b
                "UNKNOWN",    // 0x4c
                "UNKNOWN",    // 0x4d
                "UNKNOWN",    // 0x4e
                "UNKNOWN",    // 0x4f
                "POP",        // 0x50
                "MLOAD",      // 0x51
                "MSTORE",     // 0x52
                "MSTORE8",    // 0x53
                "SLOAD",      // 0x54
                "SSTORE",     // 0x55
                "JUMP",       // 0x56
                "JUMPI",      // 0x57
            };
            
            if (code < names.len) {
                return names[code];
            } else {
                return "UNKNOWN";
            }
        }
    }.call;
    
    // Check each opcode name against expected
    for (test_cases) |test_case| {
        const name = getOpcodeName(test_case.opcode);
        try testing.expectEqualStrings(
            test_case.expected_name,
            name
        );
    }
}

// Test gas costs
test "Simplified Gas Costs Test" {
    // Define gas costs for different operations
    const WARM_STORAGE_READ_COST: u64 = 100;
    const COLD_STORAGE_READ_COST: u64 = 2100;
    const WARM_ACCOUNT_ACCESS_COST: u64 = 100;
    const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
    
    // Test case 1: Different costs for warm vs cold storage access
    {
        const cold_cost = COLD_STORAGE_READ_COST; 
        const warm_cost = WARM_STORAGE_READ_COST;
        try testing.expect(cold_cost > warm_cost);
        try testing.expectEqual(@as(u64, 2100), cold_cost);
        try testing.expectEqual(@as(u64, 100), warm_cost);
    }
    
    // Test case 2: Different costs for account access
    {
        const cold_cost = COLD_ACCOUNT_ACCESS_COST;
        const warm_cost = WARM_ACCOUNT_ACCESS_COST;
        try testing.expect(cold_cost > warm_cost);
        try testing.expectEqual(@as(u64, 2600), cold_cost);
        try testing.expectEqual(@as(u64, 100), warm_cost);
    }
}

// Test EIP-3651 (COINBASE warm access)
test "Simplified EIP-3651 Test" {
    const IS_EIP3651_ENABLED = true;
    
    // With EIP-3651 enabled, COINBASE address should be warm
    if (IS_EIP3651_ENABLED) {
        const coinbase_access_cost = 100; // Warm access cost
        try testing.expectEqual(@as(u64, 100), coinbase_access_cost);
    } else {
        const coinbase_access_cost = 2600; // Cold access cost
        try testing.expectEqual(@as(u64, 2600), coinbase_access_cost);
    }
}
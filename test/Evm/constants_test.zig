const std = @import("std");
const testing = std.testing;
const constants = @import("evm").constants;

test "opcode constants are correct" {
    // Test arithmetic opcodes
    try testing.expectEqual(@as(u8, 0x01), constants.ADD);
    try testing.expectEqual(@as(u8, 0x02), constants.MUL);
    try testing.expectEqual(@as(u8, 0x03), constants.SUB);
    try testing.expectEqual(@as(u8, 0x04), constants.DIV);
    try testing.expectEqual(@as(u8, 0x05), constants.SDIV);
    try testing.expectEqual(@as(u8, 0x06), constants.MOD);
    try testing.expectEqual(@as(u8, 0x07), constants.SMOD);
    try testing.expectEqual(@as(u8, 0x08), constants.ADDMOD);
    try testing.expectEqual(@as(u8, 0x09), constants.MULMOD);
    try testing.expectEqual(@as(u8, 0x0a), constants.EXP);
    try testing.expectEqual(@as(u8, 0x0b), constants.SIGNEXTEND);
    
    // Test comparison opcodes
    try testing.expectEqual(@as(u8, 0x10), constants.LT);
    try testing.expectEqual(@as(u8, 0x11), constants.GT);
    try testing.expectEqual(@as(u8, 0x14), constants.EQ);
    try testing.expectEqual(@as(u8, 0x15), constants.ISZERO);
    
    // Test KECCAK256
    try testing.expectEqual(@as(u8, 0x20), constants.KECCAK256);
    try testing.expectEqual(constants.KECCAK256, constants.SHA3); // Test alias
    
    // Test stack operations
    try testing.expectEqual(@as(u8, 0x50), constants.POP);
    try testing.expectEqual(@as(u8, 0x51), constants.MLOAD);
    try testing.expectEqual(@as(u8, 0x52), constants.MSTORE);
    
    // Test push operations
    try testing.expectEqual(@as(u8, 0x5f), constants.PUSH0);
    try testing.expectEqual(@as(u8, 0x60), constants.PUSH1);
    try testing.expectEqual(@as(u8, 0x7f), constants.PUSH32);
    
    // Test system operations
    try testing.expectEqual(@as(u8, 0xf0), constants.CREATE);
    try testing.expectEqual(@as(u8, 0xf1), constants.CALL);
    try testing.expectEqual(@as(u8, 0xf3), constants.RETURN);
    try testing.expectEqual(@as(u8, 0xfd), constants.REVERT);
    try testing.expectEqual(@as(u8, 0xfe), constants.INVALID);
    try testing.expectEqual(@as(u8, 0xff), constants.SELFDESTRUCT);
    try testing.expectEqual(constants.SELFDESTRUCT, constants.SUICIDE); // Test alias
}

test "EVM limits are correct" {
    try testing.expectEqual(@as(usize, 1024), constants.STACK_LIMIT);
    try testing.expectEqual(@as(usize, 1024), constants.MAX_STACK_SIZE);
    try testing.expectEqual(@as(usize, 1024), constants.CALL_DEPTH_LIMIT);
    try testing.expectEqual(@as(usize, 24576), constants.MAX_CODE_SIZE);
    try testing.expectEqual(@as(usize, 49152), constants.MAX_INITCODE_SIZE);
    try testing.expectEqual(@as(usize, 32), constants.WORD_SIZE);
    try testing.expectEqual(@as(usize, 256), constants.WORD_SIZE_BITS);
    try testing.expectEqual(@as(usize, 20), constants.ADDRESS_SIZE);
    try testing.expectEqual(@as(usize, 32), constants.HASH_SIZE);
}

test "gas constants are correct" {
    // Base gas costs
    try testing.expectEqual(@as(u64, 0), constants.G_ZERO);
    try testing.expectEqual(@as(u64, 2), constants.G_BASE);
    try testing.expectEqual(@as(u64, 3), constants.G_VERYLOW);
    try testing.expectEqual(@as(u64, 5), constants.G_LOW);
    try testing.expectEqual(@as(u64, 8), constants.G_MID);
    try testing.expectEqual(@as(u64, 10), constants.G_HIGH);
    
    // Memory gas costs
    try testing.expectEqual(@as(u64, 3), constants.G_MEMORY);
    try testing.expectEqual(@as(u64, 512), constants.G_QUADRATIC_WORD);
    
    // Storage gas costs
    try testing.expectEqual(@as(u64, 2100), constants.G_SLOAD);
    try testing.expectEqual(@as(u64, 20000), constants.G_SSET);
    
    // Transaction gas costs
    try testing.expectEqual(@as(u64, 21000), constants.G_TRANSACTION);
    try testing.expectEqual(@as(u64, 4), constants.G_TRANSACTION_DATA_ZERO);
    try testing.expectEqual(@as(u64, 16), constants.G_TRANSACTION_DATA_NONZERO);
    
    // Create operation gas costs
    try testing.expectEqual(@as(u64, 32000), constants.G_CREATE);
    try testing.expectEqual(@as(u64, 200), constants.G_CODEDEPOSIT);
}

test "isPush function" {
    // Test PUSH0
    try testing.expect(!constants.isPush(constants.PUSH0)); // PUSH0 is not included in isPush
    
    // Test PUSH1 through PUSH32
    try testing.expect(constants.isPush(constants.PUSH1));
    try testing.expect(constants.isPush(constants.PUSH16));
    try testing.expect(constants.isPush(constants.PUSH32));
    
    // Test non-PUSH opcodes
    try testing.expect(!constants.isPush(constants.ADD));
    try testing.expect(!constants.isPush(constants.DUP1));
    try testing.expect(!constants.isPush(constants.SWAP1));
    try testing.expect(!constants.isPush(0x50)); // POP
    try testing.expect(!constants.isPush(0x80)); // DUP1
}

test "isDup function" {
    // Test DUP1 through DUP16
    try testing.expect(constants.isDup(constants.DUP1));
    try testing.expect(constants.isDup(constants.DUP8));
    try testing.expect(constants.isDup(constants.DUP16));
    
    // Test non-DUP opcodes
    try testing.expect(!constants.isDup(constants.ADD));
    try testing.expect(!constants.isDup(constants.PUSH1));
    try testing.expect(!constants.isDup(constants.SWAP1));
    try testing.expect(!constants.isDup(0x7f)); // Just before DUP1
    try testing.expect(!constants.isDup(0x90)); // SWAP1
}

test "isSwap function" {
    // Test SWAP1 through SWAP16
    try testing.expect(constants.isSwap(constants.SWAP1));
    try testing.expect(constants.isSwap(constants.SWAP8));
    try testing.expect(constants.isSwap(constants.SWAP16));
    
    // Test non-SWAP opcodes
    try testing.expect(!constants.isSwap(constants.ADD));
    try testing.expect(!constants.isSwap(constants.PUSH1));
    try testing.expect(!constants.isSwap(constants.DUP1));
    try testing.expect(!constants.isSwap(0x8f)); // Just before SWAP1
    try testing.expect(!constants.isSwap(0xa0)); // LOG0
}

test "isLog function" {
    // Test LOG0 through LOG4
    try testing.expect(constants.isLog(constants.LOG0));
    try testing.expect(constants.isLog(constants.LOG1));
    try testing.expect(constants.isLog(constants.LOG2));
    try testing.expect(constants.isLog(constants.LOG3));
    try testing.expect(constants.isLog(constants.LOG4));
    
    // Test non-LOG opcodes
    try testing.expect(!constants.isLog(constants.ADD));
    try testing.expect(!constants.isLog(0x9f)); // Just before LOG0
    try testing.expect(!constants.isLog(0xa5)); // Just after LOG4
}

test "getPushSize function" {
    // Test PUSH0
    try testing.expectEqual(@as(u8, 0), constants.getPushSize(constants.PUSH0));
    
    // Test PUSH1 through PUSH32
    try testing.expectEqual(@as(u8, 1), constants.getPushSize(constants.PUSH1));
    try testing.expectEqual(@as(u8, 2), constants.getPushSize(constants.PUSH2));
    try testing.expectEqual(@as(u8, 16), constants.getPushSize(constants.PUSH16));
    try testing.expectEqual(@as(u8, 32), constants.getPushSize(constants.PUSH32));
    
    // Test non-PUSH opcodes
    try testing.expectEqual(@as(u8, 0), constants.getPushSize(constants.ADD));
    try testing.expectEqual(@as(u8, 0), constants.getPushSize(constants.DUP1));
}

test "getDupSize function" {
    // Test DUP1 through DUP16
    try testing.expectEqual(@as(u8, 1), constants.getDupSize(constants.DUP1));
    try testing.expectEqual(@as(u8, 2), constants.getDupSize(constants.DUP2));
    try testing.expectEqual(@as(u8, 8), constants.getDupSize(constants.DUP8));
    try testing.expectEqual(@as(u8, 16), constants.getDupSize(constants.DUP16));
    
    // Test non-DUP opcodes
    try testing.expectEqual(@as(u8, 0), constants.getDupSize(constants.ADD));
    try testing.expectEqual(@as(u8, 0), constants.getDupSize(constants.PUSH1));
}

test "getSwapSize function" {
    // Test SWAP1 through SWAP16
    try testing.expectEqual(@as(u8, 1), constants.getSwapSize(constants.SWAP1));
    try testing.expectEqual(@as(u8, 2), constants.getSwapSize(constants.SWAP2));
    try testing.expectEqual(@as(u8, 8), constants.getSwapSize(constants.SWAP8));
    try testing.expectEqual(@as(u8, 16), constants.getSwapSize(constants.SWAP16));
    
    // Test non-SWAP opcodes
    try testing.expectEqual(@as(u8, 0), constants.getSwapSize(constants.ADD));
    try testing.expectEqual(@as(u8, 0), constants.getSwapSize(constants.DUP1));
}

test "getLogTopics function" {
    // Test LOG0 through LOG4
    try testing.expectEqual(@as(u8, 0), constants.getLogTopics(constants.LOG0));
    try testing.expectEqual(@as(u8, 1), constants.getLogTopics(constants.LOG1));
    try testing.expectEqual(@as(u8, 2), constants.getLogTopics(constants.LOG2));
    try testing.expectEqual(@as(u8, 3), constants.getLogTopics(constants.LOG3));
    try testing.expectEqual(@as(u8, 4), constants.getLogTopics(constants.LOG4));
    
    // Test non-LOG opcodes
    try testing.expectEqual(@as(u8, 0), constants.getLogTopics(constants.ADD));
    try testing.expectEqual(@as(u8, 0), constants.getLogTopics(constants.PUSH1));
}

test "memoryGasCost function" {
    // Test zero memory size
    try testing.expectEqual(@as(u64, 0), constants.memoryGasCost(0));
    
    // Test small memory sizes
    try testing.expectEqual(@as(u64, 3), constants.memoryGasCost(1)); // 1 word = 3 gas + 0 quadratic
    try testing.expectEqual(@as(u64, 3), constants.memoryGasCost(32)); // 1 word = 3 gas + 0 quadratic
    try testing.expectEqual(@as(u64, 6), constants.memoryGasCost(33)); // 2 words = 6 gas + 0 quadratic
    try testing.expectEqual(@as(u64, 6), constants.memoryGasCost(64)); // 2 words = 6 gas + 0 quadratic
    
    // Test larger memory sizes with quadratic cost
    // 1024 bytes = 32 words
    // Linear: 32 * 3 = 96
    // Quadratic: (32 * 32) / 512 = 1024 / 512 = 2
    // Total: 96 + 2 = 98
    try testing.expectEqual(@as(u64, 98), constants.memoryGasCost(1024));
    
    // Test very large memory size
    // 32768 bytes = 1024 words  
    // Linear: 1024 * 3 = 3072
    // Quadratic: (1024 * 1024) / 512 = 1048576 / 512 = 2048
    // Total: 3072 + 2048 = 5120
    try testing.expectEqual(@as(u64, 5120), constants.memoryGasCost(32768));
}

test "memoryGasCostWithOverflow function" {
    // Test zero memory size
    const zero_result = constants.memoryGasCostWithOverflow(0);
    try testing.expectEqual(@as(u64, 0), zero_result.cost);
    try testing.expect(!zero_result.overflow);
    
    // Test normal memory size
    const normal_result = constants.memoryGasCostWithOverflow(1024);
    try testing.expectEqual(@as(u64, 98), normal_result.cost);
    try testing.expect(!normal_result.overflow);
    
    // Test maximum safe value
    const large_result = constants.memoryGasCostWithOverflow(0xFFFFFFFF);
    try testing.expect(!large_result.overflow);
}

test "initCodeGasCost function" {
    // Test zero size
    try testing.expectEqual(@as(u64, 0), constants.initCodeGasCost(0));
    
    // Test small sizes
    try testing.expectEqual(@as(u64, 2), constants.initCodeGasCost(1)); // 1 word
    try testing.expectEqual(@as(u64, 2), constants.initCodeGasCost(32)); // 1 word
    try testing.expectEqual(@as(u64, 4), constants.initCodeGasCost(33)); // 2 words
    
    // Test larger size
    try testing.expectEqual(@as(u64, 64), constants.initCodeGasCost(1024)); // 32 words
}

test "isPrecompile function" {
    // Test valid precompile addresses
    const ecrecover_addr = [_]u8{0} ** 19 ++ [_]u8{0x01};
    try testing.expect(constants.isPrecompile(ecrecover_addr));
    
    const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{0x02};
    try testing.expect(constants.isPrecompile(sha256_addr));
    
    const point_eval_addr = [_]u8{0} ** 19 ++ [_]u8{0x0a};
    try testing.expect(constants.isPrecompile(point_eval_addr));
    
    // Test invalid precompile addresses
    const zero_addr = [_]u8{0} ** 20;
    try testing.expect(!constants.isPrecompile(zero_addr));
    
    const too_high_addr = [_]u8{0} ** 19 ++ [_]u8{0x0b};
    try testing.expect(!constants.isPrecompile(too_high_addr));
    
    const non_zero_prefix = [_]u8{0x01} ++ [_]u8{0} ** 18 ++ [_]u8{0x01};
    try testing.expect(!constants.isPrecompile(non_zero_prefix));
}

test "accountAccessGasCost function" {
    // Test cold access
    try testing.expectEqual(@as(u64, constants.COLD_ACCOUNT_ACCESS_COST), constants.accountAccessGasCost(true));
    try testing.expectEqual(@as(u64, 2600), constants.accountAccessGasCost(true));
    
    // Test warm access
    try testing.expectEqual(@as(u64, 0), constants.accountAccessGasCost(false));
}

test "storageAccessGasCost function" {
    // Test cold access
    try testing.expectEqual(@as(u64, constants.COLD_SLOAD_COST), constants.storageAccessGasCost(true));
    try testing.expectEqual(@as(u64, 2100), constants.storageAccessGasCost(true));
    
    // Test warm access
    try testing.expectEqual(@as(u64, constants.WARM_STORAGE_READ_COST), constants.storageAccessGasCost(false));
    try testing.expectEqual(@as(u64, 100), constants.storageAccessGasCost(false));
}

test "isBlockHashAccessible function" {
    // Test accessible block hashes
    try testing.expect(constants.isBlockHashAccessible(1000, 999));
    try testing.expect(constants.isBlockHashAccessible(1000, 900));
    try testing.expect(constants.isBlockHashAccessible(1000, 745)); // 1000 - 255 = 745
    try testing.expect(constants.isBlockHashAccessible(1000, 744)); // 1000 - 256 = 744
    
    // Test inaccessible block hashes
    try testing.expect(!constants.isBlockHashAccessible(1000, 1000)); // Same block
    try testing.expect(!constants.isBlockHashAccessible(1000, 1001)); // Future block
    try testing.expect(!constants.isBlockHashAccessible(1000, 743)); // Too old (257 blocks ago)
    try testing.expect(!constants.isBlockHashAccessible(1000, 0)); // Genesis block from high block number
}

test "dataGasCost function" {
    // Test empty data
    const empty_data = [_]u8{};
    try testing.expectEqual(@as(u64, 0), constants.dataGasCost(&empty_data, false));
    try testing.expectEqual(@as(u64, 0), constants.dataGasCost(&empty_data, true));
    
    // Test all zeros
    const zero_data = [_]u8{0} ** 10;
    try testing.expectEqual(@as(u64, 40), constants.dataGasCost(&zero_data, false)); // 10 * 4
    
    // Test all non-zeros
    const nonzero_data = [_]u8{1} ** 10;
    try testing.expectEqual(@as(u64, 160), constants.dataGasCost(&nonzero_data, false)); // 10 * 16
    
    // Test mixed data
    const mixed_data = [_]u8{ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 };
    try testing.expectEqual(@as(u64, 100), constants.dataGasCost(&mixed_data, false)); // 5*4 + 5*16 = 20 + 80
    
    // Test contract creation adds initcode cost
    const code_data = [_]u8{1} ** 32;
    const base_cost = 32 * 16; // 512
    const initcode_cost = 1 * constants.G_INITCODE_WORD; // 2
    try testing.expectEqual(@as(u64, base_cost), constants.dataGasCost(&code_data, false));
    try testing.expectEqual(@as(u64, base_cost + initcode_cost), constants.dataGasCost(&code_data, true));
}

test "isTerminal function" {
    // Test terminal opcodes
    try testing.expect(constants.isTerminal(constants.STOP));
    try testing.expect(constants.isTerminal(constants.RETURN));
    try testing.expect(constants.isTerminal(constants.REVERT));
    try testing.expect(constants.isTerminal(constants.INVALID));
    try testing.expect(constants.isTerminal(constants.SELFDESTRUCT));
    
    // Test non-terminal opcodes
    try testing.expect(!constants.isTerminal(constants.ADD));
    try testing.expect(!constants.isTerminal(constants.PUSH1));
    try testing.expect(!constants.isTerminal(constants.JUMP));
    try testing.expect(!constants.isTerminal(constants.CALL));
    try testing.expect(!constants.isTerminal(constants.CREATE));
}

test "getOpcodeName function" {
    // Test common opcodes
    try testing.expectEqualStrings("STOP", constants.getOpcodeName(0x00));
    try testing.expectEqualStrings("ADD", constants.getOpcodeName(0x01));
    try testing.expectEqualStrings("MUL", constants.getOpcodeName(0x02));
    try testing.expectEqualStrings("KECCAK256", constants.getOpcodeName(0x20));
    try testing.expectEqualStrings("PUSH1", constants.getOpcodeName(0x60));
    try testing.expectEqualStrings("PUSH32", constants.getOpcodeName(0x7f));
    try testing.expectEqualStrings("DUP1", constants.getOpcodeName(0x80));
    try testing.expectEqualStrings("SWAP1", constants.getOpcodeName(0x90));
    try testing.expectEqualStrings("CALL", constants.getOpcodeName(0xf1));
    try testing.expectEqualStrings("RETURN", constants.getOpcodeName(0xf3));
    try testing.expectEqualStrings("SELFDESTRUCT", constants.getOpcodeName(0xff));
    
    // Test unknown opcodes
    try testing.expectEqualStrings("UNKNOWN", constants.getOpcodeName(0x0c)); // Gap in opcodes
    try testing.expectEqualStrings("UNKNOWN", constants.getOpcodeName(0x1e)); // Gap in opcodes
}

test "empty hash constants" {
    // Test KECCAK_EMPTY (Keccak256(""))
    const expected_empty = [_]u8{ 
        0xc5, 0xd2, 0x46, 0x01, 0x86, 0xf7, 0x23, 0x3c,
        0x92, 0x7e, 0x7d, 0xb2, 0xdc, 0xc7, 0x03, 0xc0,
        0xe5, 0x00, 0xb6, 0x53, 0xca, 0x82, 0x27, 0x3b,
        0x7b, 0xfa, 0xd8, 0x04, 0x5d, 0x85, 0xa4, 0x70
    };
    try testing.expectEqualSlices(u8, &expected_empty, &constants.KECCAK_EMPTY);
    
    // Test KECCAK_NULL_RLP (Keccak256(RLP(null)))
    const expected_null_rlp = [_]u8{
        0x56, 0xe8, 0x1f, 0x17, 0x1b, 0xcc, 0x55, 0xa6,
        0xff, 0x83, 0x45, 0xe6, 0x92, 0xc0, 0xf8, 0x6e,
        0x5b, 0x48, 0xe0, 0x1b, 0x99, 0x6c, 0xad, 0xc0,
        0x01, 0x62, 0x2f, 0xb5, 0xe3, 0x63, 0xb4, 0x21
    };
    try testing.expectEqualSlices(u8, &expected_null_rlp, &constants.KECCAK_NULL_RLP);
}

test "system addresses" {
    // Test SYSTEM_ADDRESS
    const expected_system = [_]u8{0xff} ** 19 ++ [_]u8{0xfe};
    try testing.expectEqualSlices(u8, &expected_system, &constants.SYSTEM_ADDRESS);
    
    // Test precompile-related addresses
    const expected_beacon = [_]u8{0} ** 19 ++ [_]u8{0x0b};
    try testing.expectEqualSlices(u8, &expected_beacon, &constants.BEACON_ROOTS_ADDRESS);
}

test "blob constants" {
    try testing.expectEqual(@as(u64, 786432), constants.MAX_BLOB_GAS_PER_BLOCK);
    try testing.expectEqual(@as(u64, 393216), constants.TARGET_BLOB_GAS_PER_BLOCK);
    try testing.expectEqual(@as(usize, 131072), constants.BLOB_SIZE);
    try testing.expectEqual(@as(usize, 4096), constants.FIELD_ELEMENTS_PER_BLOB);
}

test "hardfork gas constants" {
    // Test Frontier gas constants
    const frontier = constants.getGasConstants(.Frontier);
    try testing.expectEqual(@as(u64, 50), frontier.sload);
    try testing.expectEqual(@as(u64, 0), frontier.selfdestruct);
    try testing.expectEqual(@as(u64, 20), frontier.balance);
    
    // Test TangerineWhistle gas constants
    const tangerine = constants.getGasConstants(.TangerineWhistle);
    try testing.expectEqual(@as(u64, 200), tangerine.sload);
    try testing.expectEqual(@as(u64, 5000), tangerine.selfdestruct);
    try testing.expectEqual(@as(u64, 400), tangerine.balance);
    try testing.expectEqual(@as(u64, 700), tangerine.call);
    
    // Test Berlin gas constants
    const berlin = constants.getGasConstants(.Berlin);
    try testing.expectEqual(@as(u64, 2100), berlin.sload);
    try testing.expectEqual(@as(u64, 2600), berlin.balance);
    try testing.expectEqual(@as(u64, 2600), berlin.call);
    
    // Test London gas constants
    const london = constants.getGasConstants(.London);
    try testing.expectEqual(@as(u64, 4800), london.sstore_refund); // Reduced in London
}

test "calcBlobGasPrice function" {
    // Test with zero excess blob gas
    try testing.expectEqual(@as(u64, constants.MIN_BLOB_GASPRICE), constants.calcBlobGasPrice(0));
    
    // Test with some excess blob gas
    const price_with_excess = constants.calcBlobGasPrice(100000);
    try testing.expect(price_with_excess >= constants.MIN_BLOB_GASPRICE);
}

test "all precompile constants are unique" {
    const precompiles = [_]u8{
        constants.PRECOMPILE_ECRECOVER,
        constants.PRECOMPILE_SHA256,
        constants.PRECOMPILE_RIPEMD160,
        constants.PRECOMPILE_IDENTITY,
        constants.PRECOMPILE_MODEXP,
        constants.PRECOMPILE_ECADD,
        constants.PRECOMPILE_ECMUL,
        constants.PRECOMPILE_ECPAIRING,
        constants.PRECOMPILE_BLAKE2F,
        constants.PRECOMPILE_POINT_EVALUATION,
    };
    
    // Check all values are unique
    for (precompiles, 0..) |addr1, i| {
        for (precompiles[i + 1..]) |addr2| {
            try testing.expect(addr1 != addr2);
        }
    }
    
    // Check they are in expected range
    for (precompiles) |addr| {
        try testing.expect(addr >= 1 and addr <= 10);
    }
}
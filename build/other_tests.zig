const std = @import("std");
const TestInfo = @import("tests.zig").TestInfo;

// Core module tests
pub const coreTests = [_]TestInfo{
    // ABI tests
    .{ .name = "abi-test", .root = "src/Abi/abi_test.zig", .step_name = "test-abi" },
    
    // Address tests
    .{ .name = "address-test", .root = "src/Address/address.zig", .step_name = "test-address" },
    
    // Block tests
    .{ .name = "block-test", .root = "src/Block/block.zig", .step_name = "test-block" },
    
    // Bytecode tests
    .{ .name = "bytecode-test", .root = "src/Bytecode/bytecode.zig", .step_name = "test-bytecode" },
    
    // StateManager tests
    .{ .name = "statemanager-test", .root = "src/StateManager/StateManager.zig", .step_name = "test-statemanager" },
    
    // Signature tests
    .{ .name = "signature-test", .root = "src/Signature/signature_test.zig", .step_name = "test-signature" },
    
    // Token tests
    .{ .name = "token-test", .root = "src/Token/token_test.zig", .step_name = "test-token" },
    
    // Trie tests
    .{ .name = "trie-basic-test", .root = "src/Trie/trie_test.zig", .step_name = "test-trie-basic" },
    .{ .name = "trie-specific-test", .root = "src/Trie/trie_specific_test.zig", .step_name = "test-trie-specific" },
    .{ .name = "trie-simple-test", .root = "src/Trie/simple_test.zig", .step_name = "test-trie-simple" },
    .{ .name = "trie-known-roots-test", .root = "src/Trie/known_roots_test.zig", .step_name = "test-trie-known-roots" },
    .{ .name = "trie-proof-test", .root = "src/Trie/proof.test.zig", .step_name = "test-trie-proof" },
    .{ .name = "trie-update-test", .root = "src/Trie/test_simple_update.zig", .step_name = "test-trie-update" },
    .{ .name = "trie-v2-test", .root = "src/Trie/trie_v2_test.zig", .step_name = "test-trie-v2" },
    .{ .name = "trie-v3-test", .root = "src/Trie/trie_v3.zig", .step_name = "test-trie-v3" },
    
    // Utils tests
    .{ .name = "utils-test", .root = "src/Utils/utils_test.zig", .step_name = "test-utils" },
    
    // Types tests
    .{ .name = "b256-test", .root = "src/Types/B256.zig", .step_name = "test-b256" },
    .{ .name = "u256-test", .root = "src/Types/U256.spec.ts", .step_name = "test-u256", .link_c = false }, // Skip TypeScript file
    
    // Server tests
    .{ .name = "server-basic-test", .root = "src/Server/server_test.zig", .step_name = "test-server-basic" },
    .{ .name = "server-logger-test", .root = "src/Server/middleware/Logger_test.zig", .step_name = "test-server-logger" },
    
    // Test utilities
    .{ .name = "test-oz", .root = "src/Test/oz.zig", .step_name = "test-oz" },
    .{ .name = "test-simple-contract", .root = "src/Test/simple_contract.zig", .step_name = "test-simple-contract" },
    .{ .name = "test-block-reader", .root = "src/Test/block_reader.zig", .step_name = "test-block-reader" },
    .{ .name = "test-transports", .root = "src/Test/transports.zig", .step_name = "test-transports" },
    .{ .name = "test-withdrawal-processor", .root = "src/Test/WithdrawalProcessor.test.zig", .step_name = "test-test-withdrawal-processor" },
};
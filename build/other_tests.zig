const std = @import("std");
const TestInfo = @import("tests.zig").TestInfo;

// Core module tests
pub const coreTests = [_]TestInfo{
    // ABI tests
    .{ .name = "abi-test", .root = "test/Abi/abi_test.zig", .step_name = "test-abi" },
    
    // Address tests
    // Address tests are embedded in the source file
    
    // Block tests
    // Block tests are embedded in the source file
    
    // Bytecode tests
    // Bytecode tests are embedded in the source file
    
    // StateManager tests
    // StateManager tests are embedded in the source file
    
    // Signature tests
    .{ .name = "signature-test", .root = "test/Signature/signature_test.zig", .step_name = "test-signature" },
    
    // Token tests
    .{ .name = "token-test", .root = "test/Token/token_test.zig", .step_name = "test-token" },
    
    // Trie tests
    .{ .name = "trie-basic-test", .root = "test/Trie/trie_test.zig", .step_name = "test-trie-basic" },
    .{ .name = "trie-specific-test", .root = "test/Trie/trie_specific_test.zig", .step_name = "test-trie-specific" },
    .{ .name = "trie-simple-test", .root = "test/Trie/simple_test.zig", .step_name = "test-trie-simple" },
    .{ .name = "trie-known-roots-test", .root = "test/Trie/known_roots_test.zig", .step_name = "test-trie-known-roots" },
    .{ .name = "trie-proof-test", .root = "test/Trie/proof.test.zig", .step_name = "test-trie-proof" },
    .{ .name = "trie-update-test", .root = "test/Trie/test_simple_update.zig", .step_name = "test-trie-update" },
    .{ .name = "trie-v2-test", .root = "test/Trie/trie_v2_test.zig", .step_name = "test-trie-v2" },
    // Trie v3 tests are embedded in the source file
    
    // Utils tests
    .{ .name = "utils-test", .root = "test/Utils/utils_test.zig", .step_name = "test-utils" },
    
    // Types tests
    // B256 tests are embedded in the source file
    .{ .name = "u256-test", .root = "src/Types/U256.spec.ts", .step_name = "test-u256", .link_c = false }, // Skip TypeScript file
    
    // Server tests
    .{ .name = "server-basic-test", .root = "test/Server/server_test.zig", .step_name = "test-server-basic" },
    .{ .name = "server-logger-test", .root = "test/Server/middleware/Logger_test.zig", .step_name = "test-server-logger" },
    
    // Test utilities
    .{ .name = "test-oz", .root = "test/Test/oz.zig", .step_name = "test-oz" },
    .{ .name = "test-simple-contract", .root = "test/Test/simple_contract.zig", .step_name = "test-simple-contract" },
    .{ .name = "test-block-reader", .root = "test/Test/block_reader.zig", .step_name = "test-block-reader" },
    .{ .name = "test-transports", .root = "test/Test/transports.zig", .step_name = "test-transports" },
    .{ .name = "test-withdrawal-processor", .root = "test/Test/WithdrawalProcessor.test.zig", .step_name = "test-test-withdrawal-processor" },
};
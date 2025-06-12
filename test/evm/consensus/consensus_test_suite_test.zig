const std = @import("std");
const testing = std.testing;

const TestParser = @import("../../../src/evm/consensus/test_parser.zig");
const StateTestExecutor = @import("../../../src/evm/consensus/state_test_executor.zig");
const TestRunner = @import("../../../src/evm/consensus/test_runner.zig");
const CLI = @import("../../../src/evm/consensus/cli.zig");

test "test parser hex parsing" {
    const allocator = testing.allocator;
    
    // Test address parsing
    const address_str = "0x1000000000000000000000000000000000000000";
    const address = try TestParser.parseAddress(address_str);
    try testing.expect(address[0] == 0x10);
    for (address[1..]) |byte| {
        try testing.expect(byte == 0x00);
    }
    
    // Test U256 parsing
    const u256_str = "0x100";
    const u256_val = try TestParser.parseU256(u256_str);
    try testing.expect(u256_val == 256);
    
    // Test hex bytes parsing
    const hex_str = "0x1234abcd";
    const bytes = try TestParser.parseHexBytes(allocator, hex_str);
    defer allocator.free(bytes);
    
    try testing.expect(bytes.len == 4);
    try testing.expect(bytes[0] == 0x12);
    try testing.expect(bytes[1] == 0x34);
    try testing.expect(bytes[2] == 0xab);
    try testing.expect(bytes[3] == 0xcd);
}

test "test parser u64 parsing" {
    // Test hex U64 parsing
    const hex_str = "0x100";
    const value = try TestParser.parseU64(hex_str);
    try testing.expect(value == 256);
    
    // Test decimal U64 parsing
    const dec_str = "256";
    const value2 = try TestParser.parseU64(dec_str);
    try testing.expect(value2 == 256);
}

test "state test executor initialization" {
    const allocator = testing.allocator;
    const executor = StateTestExecutor.StateTestExecutor.init(allocator);
    try testing.expect(executor.allocator.ptr == allocator.ptr);
}

test "state test executor transaction building" {
    const allocator = testing.allocator;
    var executor = StateTestExecutor.StateTestExecutor.init(allocator);
    
    // Create test transaction data
    const sender = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    const to = [_]u8{0x20} ++ [_]u8{0x00} ** 19;
    const value: u256 = 100;
    const data = try allocator.dupe(u8, &[_]u8{ 0x60, 0x60, 0x60, 0x40 });
    defer allocator.free(data);
    
    var test_transaction = TestParser.TestTransaction{
        .data = try allocator.alloc([]const u8, 1),
        .gas_limit = try allocator.alloc(u64, 1),
        .gas_price = 20,
        .max_fee_per_gas = null,
        .max_priority_fee_per_gas = null,
        .nonce = 5,
        .to = to,
        .value = try allocator.alloc(u256, 1),
        .v = try allocator.alloc(u64, 1),
        .r = try allocator.alloc(u256, 1),
        .s = try allocator.alloc(u256, 1),
        .sender = sender,
        .secret_key = null,
        .max_fee_per_blob_gas = null,
        .blob_versioned_hashes = null,
    };
    defer {
        allocator.free(test_transaction.data);
        allocator.free(test_transaction.gas_limit);
        allocator.free(test_transaction.value);
        allocator.free(test_transaction.v);
        allocator.free(test_transaction.r);
        allocator.free(test_transaction.s);
    }
    
    test_transaction.data[0] = data;
    test_transaction.gas_limit[0] = 21000;
    test_transaction.value[0] = value;
    test_transaction.v[0] = 27;
    test_transaction.r[0] = 0;
    test_transaction.s[0] = 0;
    
    const transaction = try executor.build_transaction(&test_transaction, 0);
    defer transaction.deinit(allocator);
    
    try testing.expect(transaction.to != null);
    try testing.expect(std.mem.eql(u8, &transaction.to.?, &to));
    try testing.expect(transaction.value == value);
    try testing.expect(transaction.gas_limit == 21000);
    try testing.expect(transaction.gas_price == 20);
    try testing.expect(std.mem.eql(u8, &transaction.caller, &sender));
    try testing.expect(std.mem.eql(u8, transaction.data, data));
}

test "test runner suite initialization" {
    const allocator = testing.allocator;
    const config = TestRunner.TestConfiguration{
        .test_directory = "/tmp",
        .filter = .{},
        .parallel = false,
        .verbose = false,
    };
    
    var test_suite = TestRunner.TestSuite.init(allocator, config);
    defer test_suite.deinit();
    
    try testing.expect(test_suite.discovered_tests.items.len == 0);
    try testing.expect(std.mem.eql(u8, test_suite.configuration.test_directory, "/tmp"));
}

test "test runner filter matching" {
    const filter = TestRunner.TestFilter{
        .name_pattern = "basic",
        .fork_filter = null,
        .category_filter = .state_tests,
        .max_tests = null,
    };
    
    try testing.expect(filter.matches("basic_test.json"));
    try testing.expect(filter.matches("test_basic_example.json"));
    try testing.expect(!filter.matches("advanced_test.json"));
}

test "test category from string" {
    try testing.expect(TestRunner.TestCategory.from_string("state") == .state_tests);
    try testing.expect(TestRunner.TestCategory.from_string("blockchain") == .blockchain_tests);
    try testing.expect(TestRunner.TestCategory.from_string("transaction") == .transaction_tests);
    try testing.expect(TestRunner.TestCategory.from_string("all") == .all);
    try testing.expect(TestRunner.TestCategory.from_string("invalid") == null);
}

test "cli argument parsing - help" {
    const allocator = testing.allocator;
    
    {
        const args = [_][]const u8{ "program", "--help" };
        const result = try CLI.parse_arguments(allocator, &args);
        try testing.expect(result.help);
    }
    
    {
        const args = [_][]const u8{ "program", "-h" };
        const result = try CLI.parse_arguments(allocator, &args);
        try testing.expect(result.help);
    }
}

test "cli argument parsing - version" {
    const allocator = testing.allocator;
    
    {
        const args = [_][]const u8{ "program", "--version" };
        const result = try CLI.parse_arguments(allocator, &args);
        try testing.expect(result.version);
    }
    
    {
        const args = [_][]const u8{ "program", "-V" };
        const result = try CLI.parse_arguments(allocator, &args);
        try testing.expect(result.version);
    }
}

test "cli argument parsing - verbose and parallel" {
    const allocator = testing.allocator;
    
    const args = [_][]const u8{ "program", "--verbose", "--parallel", "--threads", "8" };
    const result = try CLI.parse_arguments(allocator, &args);
    
    try testing.expect(result.verbose);
    try testing.expect(result.parallel);
    try testing.expect(result.max_threads == 8);
}

test "cli argument parsing - filters" {
    const allocator = testing.allocator;
    
    const args = [_][]const u8{ 
        "program", 
        "--filter", "basic", 
        "--category", "state", 
        "--max-tests", "10" 
    };
    const result = try CLI.parse_arguments(allocator, &args);
    
    try testing.expect(std.mem.eql(u8, result.filter.name_pattern.?, "basic"));
    try testing.expect(result.filter.category_filter.? == .state_tests);
    try testing.expect(result.filter.max_tests.? == 10);
}

test "cli argument parsing - positional directory" {
    const allocator = testing.allocator;
    
    const args = [_][]const u8{ "program", "/path/to/ethereum-tests" };
    const result = try CLI.parse_arguments(allocator, &args);
    
    try testing.expect(std.mem.eql(u8, result.test_directory, "/path/to/ethereum-tests"));
}

test "cli argument parsing - output format" {
    const allocator = testing.allocator;
    
    {
        const args = [_][]const u8{ "program", "--format", "json" };
        const result = try CLI.parse_arguments(allocator, &args);
        try testing.expect(result.output_format == .json);
    }
    
    {
        const args = [_][]const u8{ "program", "--format", "junit" };
        const result = try CLI.parse_arguments(allocator, &args);
        try testing.expect(result.output_format == .junit);
    }
    
    {
        const args = [_][]const u8{ "program", "--format", "human" };
        const result = try CLI.parse_arguments(allocator, &args);
        try testing.expect(result.output_format == .human);
    }
}

test "execution result lifecycle" {
    const allocator = testing.allocator;
    
    var execution_result = StateTestExecutor.ExecutionResult{
        .success = true,
        .gas_used = 21000,
        .return_data = try allocator.dupe(u8, &[_]u8{ 0x01, 0x02, 0x03 }),
        .logs = &[_]StateTestExecutor.ExecutionResult.EventLog{},
        .error_message = null,
    };
    defer execution_result.deinit(allocator);
    
    try testing.expect(execution_result.success);
    try testing.expect(execution_result.gas_used == 21000);
    try testing.expect(execution_result.return_data.len == 3);
}

test "state test result lifecycle" {
    const allocator = testing.allocator;
    
    var state_test_result = StateTestExecutor.StateTestResult{
        .test_name = try allocator.dupe(u8, "test_basic"),
        .fork_results = StateTestExecutor.StateTestResult.fork_results.init(allocator),
    };
    defer state_test_result.deinit(allocator);
    
    try testing.expect(std.mem.eql(u8, state_test_result.test_name, "test_basic"));
    try testing.expect(state_test_result.fork_results.count() == 0);
}

test "mock evm state operations" {
    const allocator = testing.allocator;
    
    var mock_state = StateTestExecutor.StateTestExecutor.MockEvmState.init(allocator);
    defer mock_state.deinit();
    
    try testing.expect(mock_state.accounts.count() == 0);
}

// Integration test for the complete workflow (mock)
test "consensus test suite integration" {
    const allocator = testing.allocator;
    
    // Test configuration
    const config = TestRunner.TestConfiguration{
        .test_directory = "/tmp/mock-tests",
        .filter = .{
            .category_filter = .state_tests,
            .max_tests = 1,
        },
        .parallel = false,
        .verbose = false,
    };
    
    // Initialize test suite
    var test_suite = TestRunner.TestSuite.init(allocator, config);
    defer test_suite.deinit();
    
    // Test that configuration is set correctly
    try testing.expect(std.mem.eql(u8, test_suite.configuration.test_directory, "/tmp/mock-tests"));
    try testing.expect(test_suite.configuration.filter.category_filter.? == .state_tests);
    try testing.expect(test_suite.configuration.filter.max_tests.? == 1);
    try testing.expect(!test_suite.configuration.parallel);
    try testing.expect(!test_suite.configuration.verbose);
}

// Performance test for parsing operations
test "parsing performance" {
    const allocator = testing.allocator;
    
    const iterations = 1000;
    const start_time = std.time.nanoTimestamp();
    
    for (0..iterations) |_| {
        const address_str = "0x1234567890123456789012345678901234567890";
        const address = try TestParser.parseAddress(address_str);
        try testing.expect(address[0] == 0x12);
        
        const u256_str = "0x100";
        const u256_val = try TestParser.parseU256(u256_str);
        try testing.expect(u256_val == 256);
        
        const hex_str = "0x1234";
        const bytes = try TestParser.parseHexBytes(allocator, hex_str);
        defer allocator.free(bytes);
        try testing.expect(bytes.len == 2);
    }
    
    const end_time = std.time.nanoTimestamp();
    const duration_ms = @divTrunc(end_time - start_time, 1_000_000);
    
    std.log.debug("Parsing {d} iterations took {d}ms", .{ iterations, duration_ms });
    
    // Performance assertion - should complete within reasonable time
    try testing.expect(duration_ms < 1000); // Less than 1 second
}
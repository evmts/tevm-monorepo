const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const HashMap = std.HashMap;
const Thread = std.Thread;

const TestParser = @import("test_parser.zig");
const StateTestExecutor = @import("state_test_executor.zig");
const StateTest = TestParser.StateTest;
const StateTestResult = StateTestExecutor.StateTestResult;
// Mock logging for standalone testing
const Log = struct {
    pub fn err(comptime fmt: []const u8, args: anytype) void {
        std.log.err(fmt, args);
    }
    pub fn info(comptime fmt: []const u8, args: anytype) void {
        std.log.info(fmt, args);
    }
    pub fn debug(comptime fmt: []const u8, args: anytype) void {
        std.log.debug(fmt, args);
    }
    pub fn warn(comptime fmt: []const u8, args: anytype) void {
        std.log.warn(fmt, args);
    }
};

pub const TestRunnerError = error{
    TestDirectoryNotFound,
    TestDiscoveryFailed,
    TestExecutionFailed,
    InvalidConfiguration,
    OutOfMemory,
    FileSystemError,
};

pub const TestFilter = struct {
    name_pattern: ?[]const u8 = null,
    fork_filter: ?[]const u8 = null,
    category_filter: ?TestCategory = null,
    max_tests: ?usize = null,
    
    pub fn matches(self: *const TestFilter, test_name: []const u8) bool {
        if (self.name_pattern) |pattern| {
            if (std.mem.indexOf(u8, test_name, pattern) == null) {
                return false;
            }
        }
        return true;
    }
};

pub const TestCategory = enum {
    state_tests,
    blockchain_tests,
    transaction_tests,
    all,
    
    pub fn from_string(str: []const u8) ?TestCategory {
        if (std.mem.eql(u8, str, "state")) return .state_tests;
        if (std.mem.eql(u8, str, "blockchain")) return .blockchain_tests;
        if (std.mem.eql(u8, str, "transaction")) return .transaction_tests;
        if (std.mem.eql(u8, str, "all")) return .all;
        return null;
    }
};

pub const TestConfiguration = struct {
    test_directory: []const u8,
    filter: TestFilter = .{},
    parallel: bool = true,
    max_threads: usize = 0, // 0 = auto-detect
    verbose: bool = false,
    fail_fast: bool = false,
    timeout_seconds: u64 = 300, // 5 minutes per test
    output_format: OutputFormat = .human,
    
    pub const OutputFormat = enum {
        human,
        json,
        junit,
    };
};

pub const TestSuite = struct {
    allocator: Allocator,
    configuration: TestConfiguration,
    discovered_tests: ArrayList(TestFile),
    
    pub const TestFile = struct {
        path: []const u8,
        category: TestCategory,
        relative_path: []const u8,
        
        pub fn deinit(self: *TestFile, allocator: Allocator) void {
            allocator.free(self.path);
            allocator.free(self.relative_path);
        }
    };
    
    pub fn init(allocator: Allocator, configuration: TestConfiguration) TestSuite {
        return TestSuite{
            .allocator = allocator,
            .configuration = configuration,
            .discovered_tests = ArrayList(TestFile).init(allocator),
        };
    }
    
    pub fn deinit(self: *TestSuite) void {
        for (self.discovered_tests.items) |*test_file| {
            test_file.deinit(self.allocator);
        }
        self.discovered_tests.deinit();
    }
    
    pub fn discover_tests(self: *TestSuite) TestRunnerError!void {
        Log.debug("TestSuite.discover_tests: Starting test discovery in '{s}'", .{self.configuration.test_directory});
        
        const test_dir = std.fs.cwd().openDir(self.configuration.test_directory, .{ .iterate = true }) catch |err| {
            Log.err("TestSuite.discover_tests: Failed to open test directory '{s}': {}", .{ self.configuration.test_directory, err });
            return TestRunnerError.TestDirectoryNotFound;
        };
        defer test_dir.close();
        
        try self.discover_recursive(test_dir, "");
        
        Log.info("TestSuite.discover_tests: Discovered {d} test files", .{self.discovered_tests.items.len});
    }
    
    fn discover_recursive(self: *TestSuite, dir: std.fs.Dir, relative_path: []const u8) TestRunnerError!void {
        var iterator = dir.iterate();
        
        while (iterator.next() catch return TestRunnerError.TestDiscoveryFailed) |entry| {
            const full_relative_path = if (relative_path.len == 0) 
                try self.allocator.dupe(u8, entry.name)
            else 
                try std.fmt.allocPrint(self.allocator, "{s}/{s}", .{ relative_path, entry.name });
            defer self.allocator.free(full_relative_path);
            
            switch (entry.kind) {
                .directory => {
                    const subdir = dir.openDir(entry.name, .{ .iterate = true }) catch continue;
                    defer subdir.close();
                    try self.discover_recursive(subdir, full_relative_path);
                },
                .file => {
                    if (std.mem.endsWith(u8, entry.name, ".json")) {
                        const category = self.categorize_test_file(full_relative_path);
                        if (self.should_include_test(entry.name, category)) {
                            const absolute_path = try std.fmt.allocPrint(self.allocator, "{s}/{s}", .{ self.configuration.test_directory, full_relative_path });
                            
                            const test_file = TestFile{
                                .path = absolute_path,
                                .category = category,
                                .relative_path = try self.allocator.dupe(u8, full_relative_path),
                            };
                            
                            try self.discovered_tests.append(test_file);
                            
                            if (self.configuration.filter.max_tests) |max| {
                                if (self.discovered_tests.items.len >= max) {
                                    return;
                                }
                            }
                        }
                    }
                },
                else => {},
            }
        }
    }
    
    fn categorize_test_file(self: *TestSuite, path: []const u8) TestCategory {
        _ = self;
        
        if (std.mem.indexOf(u8, path, "GeneralStateTests") != null or
            std.mem.indexOf(u8, path, "stateTests") != null) {
            return .state_tests;
        }
        if (std.mem.indexOf(u8, path, "BlockchainTests") != null) {
            return .blockchain_tests;
        }
        if (std.mem.indexOf(u8, path, "TransactionTests") != null) {
            return .transaction_tests;
        }
        return .state_tests; // Default to state tests
    }
    
    fn should_include_test(self: *TestSuite, filename: []const u8, category: TestCategory) bool {
        // Apply category filter
        if (self.configuration.filter.category_filter) |filter_category| {
            if (filter_category != .all and filter_category != category) {
                return false;
            }
        }
        
        // Apply name pattern filter
        return self.configuration.filter.matches(filename);
    }
    
    pub fn run_tests(self: *TestSuite) TestRunnerError!TestResults {
        Log.info("TestSuite.run_tests: Starting execution of {d} tests", .{self.discovered_tests.items.len});
        
        var results = TestResults.init(self.allocator);
        errdefer results.deinit();
        
        if (self.configuration.parallel and self.discovered_tests.items.len > 1) {
            try self.run_tests_parallel(&results);
        } else {
            try self.run_tests_sequential(&results);
        }
        
        return results;
    }
    
    fn run_tests_sequential(self: *TestSuite, results: *TestResults) TestRunnerError!void {
        Log.debug("TestSuite.run_tests_sequential: Running tests sequentially");
        
        for (self.discovered_tests.items, 0..) |*test_file, index| {
            const progress_pct = (index * 100) / self.discovered_tests.items.len;
            Log.info("TestSuite.run_tests_sequential: Running test {d}/{d} ({d}%): {s}", .{ 
                index + 1, 
                self.discovered_tests.items.len, 
                progress_pct,
                test_file.relative_path 
            });
            
            const start_time = std.time.milliTimestamp();
            const test_result = self.run_single_test(test_file) catch |err| {
                Log.err("TestSuite.run_tests_sequential: Failed to run test '{s}': {}", .{ test_file.relative_path, err });
                try results.add_error(test_file.relative_path, @errorName(err));
                
                if (self.configuration.fail_fast) {
                    return TestRunnerError.TestExecutionFailed;
                }
                continue;
            };
            const elapsed_ms = std.time.milliTimestamp() - start_time;
            
            try results.add_result(test_result, elapsed_ms);
            
            if (self.configuration.verbose) {
                self.print_test_summary(&test_result, elapsed_ms);
            }
        }
    }
    
    fn run_tests_parallel(self: *TestSuite, results: *TestResults) TestRunnerError!void {
        const num_threads = if (self.configuration.max_threads == 0) 
            std.Thread.getCpuCount() catch 4 
        else 
            self.configuration.max_threads;
            
        Log.debug("TestSuite.run_tests_parallel: Running tests in parallel with {d} threads", .{num_threads});
        
        // For now, fall back to sequential execution
        // TODO: Implement parallel execution with thread pool
        try self.run_tests_sequential(results);
    }
    
    fn run_single_test(self: *TestSuite, test_file: *const TestFile) TestRunnerError!StateTestResult {
        Log.debug("TestSuite.run_single_test: Running test file '{s}'", .{test_file.path});
        
        switch (test_file.category) {
            .state_tests => {
                return self.run_state_test(test_file.path);
            },
            .blockchain_tests => {
                // TODO: Implement blockchain test execution
                return TestRunnerError.TestExecutionFailed;
            },
            .transaction_tests => {
                // TODO: Implement transaction test execution
                return TestRunnerError.TestExecutionFailed;
            },
            .all => unreachable,
        }
    }
    
    fn run_state_test(self: *TestSuite, test_file_path: []const u8) TestRunnerError!StateTestResult {
        Log.debug("TestSuite.run_state_test: Parsing state test file '{s}'", .{test_file_path});
        
        var state_tests = TestParser.parseStateTestFile(self.allocator, test_file_path) catch |err| {
            Log.err("TestSuite.run_state_test: Failed to parse test file '{s}': {}", .{ test_file_path, err });
            return TestRunnerError.TestExecutionFailed;
        };
        defer {
            for (state_tests.items) |*state_test| {
                state_test.deinit(self.allocator);
            }
            state_tests.deinit();
        }
        
        if (state_tests.items.len == 0) {
            Log.warn("TestSuite.run_state_test: No tests found in file '{s}'", .{test_file_path});
            return TestRunnerError.TestExecutionFailed;
        }
        
        // Execute the first test in the file
        // TODO: Handle multiple tests per file properly
        const state_test = &state_tests.items[0];
        
        var executor = StateTestExecutor.StateTestExecutor.init(self.allocator);
        const result = executor.execute_state_test(state_test) catch |err| {
            Log.err("TestSuite.run_state_test: Failed to execute state test '{s}': {}", .{ state_test.name, err });
            return TestRunnerError.TestExecutionFailed;
        };
        
        return result;
    }
    
    fn print_test_summary(self: *TestSuite, test_result: *const StateTestResult, elapsed_ms: i64) void {
        _ = self;
        
        var total_passed: usize = 0;
        var total_failed: usize = 0;
        
        var fork_iter = test_result.fork_results.iterator();
        while (fork_iter.next()) |entry| {
            const fork_result = entry.value_ptr;
            for (fork_result.index_results.items) |*index_result| {
                if (index_result.state_match and index_result.execution_result.success) {
                    total_passed += 1;
                } else {
                    total_failed += 1;
                }
            }
        }
        
        const status = if (total_failed == 0) "PASS" else "FAIL";
        Log.info("  {} {s} ({d}ms) - Passed: {d}, Failed: {d}", .{ status, test_result.test_name, elapsed_ms, total_passed, total_failed });
    }
};

pub const TestResults = struct {
    allocator: Allocator,
    results: ArrayList(StateTestResult),
    execution_times: ArrayList(i64),
    errors: ArrayList(TestError),
    start_time: i64,
    end_time: i64,
    
    pub const TestError = struct {
        test_name: []const u8,
        error_message: []const u8,
        
        pub fn deinit(self: *TestError, allocator: Allocator) void {
            allocator.free(self.test_name);
            allocator.free(self.error_message);
        }
    };
    
    pub fn init(allocator: Allocator) TestResults {
        return TestResults{
            .allocator = allocator,
            .results = ArrayList(StateTestResult).init(allocator),
            .execution_times = ArrayList(i64).init(allocator),
            .errors = ArrayList(TestError).init(allocator),
            .start_time = std.time.milliTimestamp(),
            .end_time = 0,
        };
    }
    
    pub fn deinit(self: *TestResults) void {
        for (self.results.items) |*result| {
            result.deinit(self.allocator);
        }
        self.results.deinit();
        self.execution_times.deinit();
        
        for (self.errors.items) |*error_item| {
            error_item.deinit(self.allocator);
        }
        self.errors.deinit();
    }
    
    pub fn add_result(self: *TestResults, result: StateTestResult, elapsed_ms: i64) !void {
        try self.results.append(result);
        try self.execution_times.append(elapsed_ms);
    }
    
    pub fn add_error(self: *TestResults, test_name: []const u8, error_message: []const u8) !void {
        const error_item = TestError{
            .test_name = try self.allocator.dupe(u8, test_name),
            .error_message = try self.allocator.dupe(u8, error_message),
        };
        try self.errors.append(error_item);
    }
    
    pub fn finalize(self: *TestResults) void {
        self.end_time = std.time.milliTimestamp();
    }
    
    pub fn print_summary(self: *const TestResults) void {
        const total_duration = self.end_time - self.start_time;
        
        var total_tests: usize = 0;
        var total_passed: usize = 0;
        var total_failed: usize = 0;
        
        for (self.results.items) |*result| {
            var fork_iter = result.fork_results.iterator();
            while (fork_iter.next()) |entry| {
                const fork_result = entry.value_ptr;
                for (fork_result.index_results.items) |*index_result| {
                    total_tests += 1;
                    if (index_result.state_match and index_result.execution_result.success) {
                        total_passed += 1;
                    } else {
                        total_failed += 1;
                    }
                }
            }
        }
        
        Log.info("=== Consensus Test Suite Results ===");
        Log.info("Total Tests: {d}", .{total_tests});
        Log.info("Passed: {d}", .{total_passed});
        Log.info("Failed: {d}", .{total_failed});
        Log.info("Errors: {d}", .{self.errors.items.len});
        Log.info("Duration: {d}ms", .{total_duration});
        
        if (total_failed == 0 and self.errors.items.len == 0) {
            Log.info("🎉 All tests passed!");
        } else {
            Log.info("❌ Some tests failed or encountered errors");
            
            if (self.errors.items.len > 0) {
                Log.info("\nErrors:");
                for (self.errors.items) |*error_item| {
                    Log.info("  - {s}: {s}", .{ error_item.test_name, error_item.error_message });
                }
            }
        }
    }
};

// Main entry point for running consensus tests
pub fn run_consensus_tests(allocator: Allocator, config: TestConfiguration) TestRunnerError!TestResults {
    Log.info("run_consensus_tests: Starting consensus test suite");
    
    var test_suite = TestSuite.init(allocator, config);
    defer test_suite.deinit();
    
    try test_suite.discover_tests();
    var results = try test_suite.run_tests();
    results.finalize();
    
    if (config.verbose) {
        results.print_summary();
    }
    
    return results;
}

test "test suite initialization" {
    const allocator = testing.allocator;
    const config = TestConfiguration{
        .test_directory = "/tmp",
        .filter = .{},
        .parallel = false,
        .verbose = false,
    };
    
    var test_suite = TestSuite.init(allocator, config);
    defer test_suite.deinit();
    
    try testing.expect(test_suite.discovered_tests.items.len == 0);
    try testing.expect(std.mem.eql(u8, test_suite.configuration.test_directory, "/tmp"));
}

test "test filter matching" {
    const filter = TestFilter{
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
    try testing.expect(TestCategory.from_string("state") == .state_tests);
    try testing.expect(TestCategory.from_string("blockchain") == .blockchain_tests);
    try testing.expect(TestCategory.from_string("transaction") == .transaction_tests);
    try testing.expect(TestCategory.from_string("all") == .all);
    try testing.expect(TestCategory.from_string("invalid") == null);
}
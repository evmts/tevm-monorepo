const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;

const TestRunner = @import("test_runner.zig");
const TestConfiguration = TestRunner.TestConfiguration;
const TestCategory = TestRunner.TestCategory;
const TestFilter = TestRunner.TestFilter;
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
};

pub const CliError = error{
    InvalidArguments,
    HelpRequested,
    VersionRequested,
    InvalidTestDirectory,
    InvalidConfiguration,
    OutOfMemory,
};

pub const CliArguments = struct {
    test_directory: []const u8,
    filter: TestFilter,
    parallel: bool,
    max_threads: usize,
    verbose: bool,
    fail_fast: bool,
    timeout_seconds: u64,
    output_format: TestConfiguration.OutputFormat,
    help: bool,
    version: bool,
    
    pub const default = CliArguments{
        .test_directory = "ethereum-tests",
        .filter = .{},
        .parallel = true,
        .max_threads = 0,
        .verbose = false,
        .fail_fast = false,
        .timeout_seconds = 300,
        .output_format = .human,
        .help = false,
        .version = false,
    };
};

const USAGE_TEXT =
    \\Tevm Consensus Test Suite
    \\
    \\USAGE:
    \\    consensus_tests [OPTIONS] [TEST_DIRECTORY]
    \\
    \\ARGS:
    \\    <TEST_DIRECTORY>    Path to ethereum/tests directory [default: ethereum-tests]
    \\
    \\OPTIONS:
    \\    -h, --help                    Print help information
    \\    -V, --version                 Print version information
    \\    -v, --verbose                 Enable verbose output
    \\    -j, --parallel                Enable parallel test execution [default: true]
    \\    -t, --threads <THREADS>       Number of threads for parallel execution [default: auto]
    \\        --sequential              Disable parallel execution
    \\        --fail-fast               Stop on first test failure
    \\        --timeout <SECONDS>       Test timeout in seconds [default: 300]
    \\        --filter <PATTERN>        Filter tests by name pattern
    \\        --fork <FORK>            Filter tests by fork name
    \\        --category <CATEGORY>     Filter by test category (state|blockchain|transaction|all) [default: all]
    \\        --max-tests <COUNT>       Maximum number of tests to run
    \\        --format <FORMAT>         Output format (human|json|junit) [default: human]
    \\
    \\EXAMPLES:
    \\    consensus_tests                                    # Run all tests in default directory
    \\    consensus_tests --category state --verbose         # Run only state tests with verbose output
    \\    consensus_tests --filter "basic" --max-tests 10   # Run max 10 tests matching "basic"
    \\    consensus_tests --sequential --fail-fast           # Run tests sequentially, stop on first failure
    \\    consensus_tests --fork "Shanghai" --format json   # Run Shanghai fork tests with JSON output
    \\
;

const VERSION_TEXT = "Tevm Consensus Test Suite v1.0.0";

pub fn parse_arguments(allocator: Allocator, args: []const []const u8) CliError!CliArguments {
    _ = allocator;
    var result = CliArguments.default;
    var i: usize = 1; // Skip program name
    
    while (i < args.len) {
        const arg = args[i];
        
        if (std.mem.eql(u8, arg, "-h") or std.mem.eql(u8, arg, "--help")) {
            result.help = true;
            return result;
        } else if (std.mem.eql(u8, arg, "-V") or std.mem.eql(u8, arg, "--version")) {
            result.version = true;
            return result;
        } else if (std.mem.eql(u8, arg, "-v") or std.mem.eql(u8, arg, "--verbose")) {
            result.verbose = true;
        } else if (std.mem.eql(u8, arg, "-j") or std.mem.eql(u8, arg, "--parallel")) {
            result.parallel = true;
        } else if (std.mem.eql(u8, arg, "--sequential")) {
            result.parallel = false;
        } else if (std.mem.eql(u8, arg, "--fail-fast")) {
            result.fail_fast = true;
        } else if (std.mem.eql(u8, arg, "-t") or std.mem.eql(u8, arg, "--threads")) {
            i += 1;
            if (i >= args.len) {
                Log.err("Missing value for {s}", .{arg});
                return CliError.InvalidArguments;
            }
            result.max_threads = std.fmt.parseInt(usize, args[i], 10) catch {
                Log.err("Invalid thread count: {s}", .{args[i]});
                return CliError.InvalidArguments;
            };
        } else if (std.mem.eql(u8, arg, "--timeout")) {
            i += 1;
            if (i >= args.len) {
                Log.err("Missing value for {s}", .{arg});
                return CliError.InvalidArguments;
            }
            result.timeout_seconds = std.fmt.parseInt(u64, args[i], 10) catch {
                Log.err("Invalid timeout: {s}", .{args[i]});
                return CliError.InvalidArguments;
            };
        } else if (std.mem.eql(u8, arg, "--filter")) {
            i += 1;
            if (i >= args.len) {
                Log.err("Missing value for {s}", .{arg});
                return CliError.InvalidArguments;
            }
            result.filter.name_pattern = args[i];
        } else if (std.mem.eql(u8, arg, "--fork")) {
            i += 1;
            if (i >= args.len) {
                Log.err("Missing value for {s}", .{arg});
                return CliError.InvalidArguments;
            }
            result.filter.fork_filter = args[i];
        } else if (std.mem.eql(u8, arg, "--category")) {
            i += 1;
            if (i >= args.len) {
                Log.err("Missing value for {s}", .{arg});
                return CliError.InvalidArguments;
            }
            result.filter.category_filter = TestCategory.from_string(args[i]) orelse {
                Log.err("Invalid category: {s}", .{args[i]});
                return CliError.InvalidArguments;
            };
        } else if (std.mem.eql(u8, arg, "--max-tests")) {
            i += 1;
            if (i >= args.len) {
                Log.err("Missing value for {s}", .{arg});
                return CliError.InvalidArguments;
            }
            result.filter.max_tests = std.fmt.parseInt(usize, args[i], 10) catch {
                Log.err("Invalid max tests count: {s}", .{args[i]});
                return CliError.InvalidArguments;
            };
        } else if (std.mem.eql(u8, arg, "--format")) {
            i += 1;
            if (i >= args.len) {
                Log.err("Missing value for {s}", .{arg});
                return CliError.InvalidArguments;
            }
            if (std.mem.eql(u8, args[i], "human")) {
                result.output_format = .human;
            } else if (std.mem.eql(u8, args[i], "json")) {
                result.output_format = .json;
            } else if (std.mem.eql(u8, args[i], "junit")) {
                result.output_format = .junit;
            } else {
                Log.err("Invalid output format: {s}", .{args[i]});
                return CliError.InvalidArguments;
            }
        } else if (std.mem.startsWith(u8, arg, "-")) {
            Log.err("Unknown option: {s}", .{arg});
            return CliError.InvalidArguments;
        } else {
            // Positional argument - test directory
            result.test_directory = arg;
        }
        
        i += 1;
    }
    
    return result;
}

pub fn print_help() void {
    std.debug.print("{s}\n", .{USAGE_TEXT});
}

pub fn print_version() void {
    std.debug.print("{s}\n", .{VERSION_TEXT});
}

pub fn run_cli(allocator: Allocator) !u8 {
    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);
    
    const cli_args = parse_arguments(allocator, args) catch |err| {
        switch (err) {
            CliError.HelpRequested => {
                print_help();
                return 0;
            },
            CliError.VersionRequested => {
                print_version();
                return 0;
            },
            CliError.InvalidArguments => {
                Log.err("Invalid arguments. Use --help for usage information.");
                return 1;
            },
            else => {
                Log.err("Failed to parse arguments: {}", .{err});
                return 1;
            },
        }
    };
    
    if (cli_args.help) {
        print_help();
        return 0;
    }
    
    if (cli_args.version) {
        print_version();
        return 0;
    }
    
    // Validate test directory exists
    std.fs.cwd().openDir(cli_args.test_directory, .{}) catch |err| {
        switch (err) {
            error.FileNotFound => {
                Log.err("Test directory not found: {s}", .{cli_args.test_directory});
                Log.err("Please ensure the ethereum/tests repository is cloned and accessible.");
                return 1;
            },
            error.AccessDenied => {
                Log.err("Access denied to test directory: {s}", .{cli_args.test_directory});
                return 1;
            },
            else => {
                Log.err("Failed to access test directory '{s}': {}", .{ cli_args.test_directory, err });
                return 1;
            },
        }
    };
    
    // Convert CLI arguments to test configuration
    const config = TestConfiguration{
        .test_directory = cli_args.test_directory,
        .filter = cli_args.filter,
        .parallel = cli_args.parallel,
        .max_threads = cli_args.max_threads,
        .verbose = cli_args.verbose,
        .fail_fast = cli_args.fail_fast,
        .timeout_seconds = cli_args.timeout_seconds,
        .output_format = cli_args.output_format,
    };
    
    // Print configuration if verbose
    if (config.verbose) {
        Log.info("=== Consensus Test Configuration ===");
        Log.info("Test Directory: {s}", .{config.test_directory});
        Log.info("Parallel: {}", .{config.parallel});
        if (config.max_threads > 0) {
            Log.info("Max Threads: {d}", .{config.max_threads});
        }
        Log.info("Verbose: {}", .{config.verbose});
        Log.info("Fail Fast: {}", .{config.fail_fast});
        Log.info("Timeout: {d}s", .{config.timeout_seconds});
        Log.info("Output Format: {s}", .{@tagName(config.output_format)});
        
        if (config.filter.name_pattern) |pattern| {
            Log.info("Name Filter: {s}", .{pattern});
        }
        if (config.filter.fork_filter) |fork| {
            Log.info("Fork Filter: {s}", .{fork});
        }
        if (config.filter.category_filter) |category| {
            Log.info("Category Filter: {s}", .{@tagName(category)});
        }
        if (config.filter.max_tests) |max| {
            Log.info("Max Tests: {d}", .{max});
        }
        Log.info("=====================================");
    }
    
    // Run the consensus tests
    var results = TestRunner.run_consensus_tests(allocator, config) catch |err| {
        Log.err("Failed to run consensus tests: {}", .{err});
        return 1;
    };
    defer results.deinit();
    
    // Print results based on output format
    switch (config.output_format) {
        .human => {
            results.print_summary();
        },
        .json => {
            try print_json_results(&results);
        },
        .junit => {
            try print_junit_results(&results);
        },
    }
    
    // Return appropriate exit code
    var has_failures = false;
    for (results.results.items) |*result| {
        var fork_iter = result.fork_results.iterator();
        while (fork_iter.next()) |entry| {
            const fork_result = entry.value_ptr;
            for (fork_result.index_results.items) |*index_result| {
                if (!index_result.state_match or !index_result.execution_result.success) {
                    has_failures = true;
                    break;
                }
            }
            if (has_failures) break;
        }
        if (has_failures) break;
    }
    
    if (has_failures or results.errors.items.len > 0) {
        return 1;
    }
    
    return 0;
}

fn print_json_results(results: *const TestRunner.TestResults) !void {
    _ = results;
    // TODO: Implement JSON output format
    std.debug.print("JSON output format not yet implemented\n", .{});
}

fn print_junit_results(results: *const TestRunner.TestResults) !void {
    // TODO: Implement JUnit XML output format
    std.debug.print("JUnit output format not yet implemented\n", .{});
    _ = results;
}

// Main entry point for the CLI application
pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    const exit_code = run_cli(allocator) catch |err| {
        Log.err("Fatal error: {}", .{err});
        return;
    };
    
    std.process.exit(exit_code);
}

test "parse help arguments" {
    const allocator = testing.allocator;
    
    {
        const args = [_][]const u8{ "program", "--help" };
        const result = try parse_arguments(allocator, &args);
        try testing.expect(result.help);
    }
    
    {
        const args = [_][]const u8{ "program", "-h" };
        const result = try parse_arguments(allocator, &args);
        try testing.expect(result.help);
    }
}

test "parse version arguments" {
    const allocator = testing.allocator;
    
    {
        const args = [_][]const u8{ "program", "--version" };
        const result = try parse_arguments(allocator, &args);
        try testing.expect(result.version);
    }
    
    {
        const args = [_][]const u8{ "program", "-V" };
        const result = try parse_arguments(allocator, &args);
        try testing.expect(result.version);
    }
}

test "parse verbose and parallel arguments" {
    const allocator = testing.allocator;
    
    const args = [_][]const u8{ "program", "--verbose", "--parallel", "--threads", "8" };
    const result = try parse_arguments(allocator, &args);
    
    try testing.expect(result.verbose);
    try testing.expect(result.parallel);
    try testing.expect(result.max_threads == 8);
}

test "parse filter arguments" {
    const allocator = testing.allocator;
    
    const args = [_][]const u8{ 
        "program", 
        "--filter", "basic", 
        "--category", "state", 
        "--max-tests", "10" 
    };
    const result = try parse_arguments(allocator, &args);
    
    try testing.expect(std.mem.eql(u8, result.filter.name_pattern.?, "basic"));
    try testing.expect(result.filter.category_filter.? == .state_tests);
    try testing.expect(result.filter.max_tests.? == 10);
}

test "parse positional test directory" {
    const allocator = testing.allocator;
    
    const args = [_][]const u8{ "program", "/path/to/ethereum-tests" };
    const result = try parse_arguments(allocator, &args);
    
    try testing.expect(std.mem.eql(u8, result.test_directory, "/path/to/ethereum-tests"));
}

test "parse output format" {
    const allocator = testing.allocator;
    
    {
        const args = [_][]const u8{ "program", "--format", "json" };
        const result = try parse_arguments(allocator, &args);
        try testing.expect(result.output_format == .json);
    }
    
    {
        const args = [_][]const u8{ "program", "--format", "junit" };
        const result = try parse_arguments(allocator, &args);
        try testing.expect(result.output_format == .junit);
    }
    
    {
        const args = [_][]const u8{ "program", "--format", "human" };
        const result = try parse_arguments(allocator, &args);
        try testing.expect(result.output_format == .human);
    }
}
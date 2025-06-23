# Implement Consensus Test Suite

You are implementing Consensus Test Suite for the Tevm EVM written in Zig. Your goal is to implement comprehensive consensus test execution framework following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_consensus_test_suite` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_consensus_test_suite feat_implement_consensus_test_suite`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive Ethereum consensus test suite integration to ensure 100% compatibility with the official Ethereum specification. This includes state tests, blockchain tests, transaction tests, and difficulty tests from the ethereum/tests repository. The implementation should provide automated test discovery, execution, and reporting to catch any regressions or compatibility issues.

## ELI5

Think of consensus tests like a massive standardized exam that all Ethereum implementations must pass to prove they work correctly. Just like how all calculators need to give the same answer for "2+2=4", all Ethereum clients need to process transactions and blocks exactly the same way. This test suite is like having thousands of test questions that verify our EVM gives the exact same answers as the official Ethereum specification, ensuring perfect compatibility.

## Consensus Test Specifications

### Core Test Categories

#### 1. State Tests
```zig
pub const StateTest = struct {
    name: []const u8,
    test_data: StateTestData,
    
    pub const StateTestData = struct {
        env: TestEnvironment,
        pre: PreState,
        transaction: TestTransaction,
        post: std.HashMap([]const u8, PostState, std.hash_map.StringContext, std.hash_map.default_max_load_percentage),
        
        pub const TestEnvironment = struct {
            current_coinbase: Address,
            current_difficulty: U256,
            current_gas_limit: u64,
            current_number: u64,
            current_timestamp: u64,
            current_base_fee: ?u64,
            current_blob_base_fee: ?u64,
            current_excess_blob_gas: ?u64,
            parent_blob_gas_used: ?u64,
            parent_excess_blob_gas: ?u64,
            current_random: ?U256,
            withdrawals_root: ?U256,
            parent_beacon_block_root: ?U256,
        };
        
        pub const PreState = std.HashMap(Address, TestAccount, AddressContext, std.hash_map.default_max_load_percentage);
        pub const PostState = std.HashMap(Address, TestAccount, AddressContext, std.hash_map.default_max_load_percentage);
        
        pub const TestAccount = struct {
            balance: U256,
            nonce: u64,
            code: []const u8,
            storage: std.HashMap(U256, U256, U256Context, std.hash_map.default_max_load_percentage),
        };
        
        pub const TestTransaction = struct {
            data: [][]const u8,
            gas_limit: []u64,
            gas_price: ?u64,
            max_fee_per_gas: ?u64,
            max_priority_fee_per_gas: ?u64,
            nonce: u64,
            to: ?Address,
            value: []U256,
            v: []u64,
            r: []U256,
            s: []U256,
            sender: Address,
            secret_key: ?U256,
            max_fee_per_blob_gas: ?u64,
            blob_versioned_hashes: ?[]U256,
        };
    };
};
```

#### 2. Blockchain Tests
```zig
pub const BlockchainTest = struct {
    name: []const u8,
    test_data: BlockchainTestData,
    
    pub const BlockchainTestData = struct {
        genesis_block_header: TestBlockHeader,
        genesis_rlp: []const u8,
        blocks: []TestBlock,
        lastblockhash: U256,
        pre: PreState,
        post_state: ?PostState,
        network: []const u8,
        
        pub const TestBlock = struct {
            block_header: ?TestBlockHeader,
            rlp: ?[]const u8,
            transactions: ?[]TestTransaction,
            uncle_headers: ?[]TestBlockHeader,
            withdrawals: ?[]TestWithdrawal,
            expect_exception: ?[]const u8,
        };
        
        pub const TestBlockHeader = struct {
            parent_hash: U256,
            uncle_hash: U256,
            coinbase: Address,
            state_root: U256,
            transaction_trie_root: U256,
            receipt_trie_root: U256,
            bloom: U256,
            difficulty: U256,
            number: u64,
            gas_limit: u64,
            gas_used: u64,
            timestamp: u64,
            extra_data: []const u8,
            mix_hash: U256,
            nonce: u64,
            base_fee_per_gas: ?u64,
            withdrawals_root: ?U256,
            blob_gas_used: ?u64,
            excess_blob_gas: ?u64,
            parent_beacon_block_root: ?U256,
        };
        
        pub const TestWithdrawal = struct {
            index: u64,
            validator_index: u64,
            address: Address,
            amount: u64,
        };
    };
};
```

#### 3. Transaction Tests
```zig
pub const TransactionTest = struct {
    name: []const u8,
    test_data: TransactionTestData,
    
    pub const TransactionTestData = struct {
        transaction: TestTransaction,
        result: std.HashMap([]const u8, TransactionResult, std.hash_map.StringContext, std.hash_map.default_max_load_percentage),
        
        pub const TransactionResult = struct {
            intrinsic_gas: ?u64,
            sender: ?Address,
            hash: ?U256,
            expect_exception: ?[]const u8,
        };
    };
};
```

## Implementation Requirements

### Core Functionality
1. **Test Discovery**: Automatically find and load consensus tests
2. **Test Execution**: Execute tests against EVM implementation
3. **Result Validation**: Compare results with expected outcomes
4. **Error Reporting**: Detailed failure analysis and reporting
5. **Parallel Execution**: Run tests concurrently for performance
6. **Format Support**: JSON and YAML test format parsing

## Implementation Tasks

### Task 1: Implement Test Runner Framework
File: `/src/evm/consensus/test_runner.zig`
```zig
const std = @import("std");
const Vm = @import("../vm.zig").Vm;
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;

pub const TestRunner = struct {
    allocator: std.mem.Allocator,
    vm: Vm,
    test_config: TestConfig,
    
    pub const TestConfig = struct {
        test_dir: []const u8,
        filter: ?[]const u8,
        parallel: bool,
        verbose: bool,
        fail_fast: bool,
        timeout_ms: u32,
        
        pub fn default() TestConfig {
            return TestConfig{
                .test_dir = "ethereum-tests",
                .filter = null,
                .parallel = true,
                .verbose = false,
                .fail_fast = false,
                .timeout_ms = 30000,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: TestConfig) !TestRunner {
        return TestRunner{
            .allocator = allocator,
            .vm = try Vm.init(allocator, 1), // Mainnet chain ID
            .test_config = config,
        };
    }
    
    pub fn deinit(self: *TestRunner) void {
        self.vm.deinit();
    }
    
    pub fn run_all_tests(self: *TestRunner) !TestSummary {
        var summary = TestSummary.init(self.allocator);
        
        // Discover test files
        const test_files = try self.discover_tests();
        defer test_files.deinit();
        
        std.log.info("Found {} test files", .{test_files.items.len});
        
        if (self.test_config.parallel) {
            try self.run_tests_parallel(test_files.items, &summary);
        } else {
            try self.run_tests_sequential(test_files.items, &summary);
        }
        
        return summary;
    }
    
    fn discover_tests(self: *TestRunner) !std.ArrayList([]const u8) {
        var test_files = std.ArrayList([]const u8).init(self.allocator);
        
        var dir = std.fs.cwd().openIterableDir(self.test_config.test_dir, .{}) catch |err| {
            std.log.err("Failed to open test directory '{}': {}", .{ self.test_config.test_dir, err });
            return err;
        };
        defer dir.close();
        
        try self.discover_tests_recursive(dir, "", &test_files);
        
        // Apply filter if provided
        if (self.test_config.filter) |filter| {
            var filtered = std.ArrayList([]const u8).init(self.allocator);
            
            for (test_files.items) |path| {
                if (std.mem.indexOf(u8, path, filter) != null) {
                    try filtered.append(path);
                }
            }
            
            test_files.deinit();
            return filtered;
        }
        
        return test_files;
    }
    
    fn discover_tests_recursive(
        self: *TestRunner,
        dir: std.fs.IterableDir,
        relative_path: []const u8,
        test_files: *std.ArrayList([]const u8)
    ) !void {
        var iterator = dir.iterate();
        
        while (try iterator.next()) |entry| {
            const full_path = if (relative_path.len > 0)
                try std.fmt.allocPrint(self.allocator, "{s}/{s}", .{ relative_path, entry.name })
            else
                try self.allocator.dupe(u8, entry.name);
            
            switch (entry.kind) {
                .File => {
                    if (std.mem.endsWith(u8, entry.name, ".json")) {
                        try test_files.append(full_path);
                    }
                },
                .Directory => {
                    if (std.mem.eql(u8, entry.name, "src") or 
                        std.mem.eql(u8, entry.name, "VMTests") or
                        std.mem.eql(u8, entry.name, "LegacyTests")) {
                        // Skip these directories
                        continue;
                    }
                    
                    var subdir = dir.dir.openIterableDir(entry.name, .{}) catch continue;
                    defer subdir.close();
                    
                    try self.discover_tests_recursive(subdir, full_path, test_files);
                },
                else => {},
            }
        }
    }
    
    fn run_tests_sequential(
        self: *TestRunner,
        test_files: []const []const u8,
        summary: *TestSummary
    ) !void {
        for (test_files) |file_path| {
            if (self.test_config.fail_fast and summary.failed > 0) {
                break;
            }
            
            const result = self.run_test_file(file_path) catch |err| {
                std.log.err("Failed to run test file '{}': {}", .{ file_path, err });
                summary.failed += 1;
                continue;
            };
            
            summary.total += result.total;
            summary.passed += result.passed;
            summary.failed += result.failed;
            summary.skipped += result.skipped;
            
            if (self.test_config.verbose) {
                std.log.info("File: {} - {} passed, {} failed, {} skipped", 
                    .{ file_path, result.passed, result.failed, result.skipped });
            }
        }
    }
    
    fn run_tests_parallel(
        self: *TestRunner,
        test_files: []const []const u8,
        summary: *TestSummary
    ) !void {
        // Simplified parallel execution - in real implementation would use thread pool
        for (test_files) |file_path| {
            const result = self.run_test_file(file_path) catch |err| {
                std.log.err("Failed to run test file '{}': {}", .{ file_path, err });
                summary.failed += 1;
                continue;
            };
            
            summary.total += result.total;
            summary.passed += result.passed;
            summary.failed += result.failed;
            summary.skipped += result.skipped;
        }
    }
    
    fn run_test_file(self: *TestRunner, file_path: []const u8) !TestSummary {
        const full_path = try std.fmt.allocPrint(self.allocator, "{s}/{s}", .{ self.test_config.test_dir, file_path });
        defer self.allocator.free(full_path);
        
        const file_content = try std.fs.cwd().readFileAlloc(self.allocator, full_path, 10 * 1024 * 1024); // 10MB limit
        defer self.allocator.free(file_content);
        
        // Determine test type from file path
        if (std.mem.indexOf(u8, file_path, "GeneralStateTests") != null) {
            return self.run_state_tests(file_content);
        } else if (std.mem.indexOf(u8, file_path, "BlockchainTests") != null) {
            return self.run_blockchain_tests(file_content);
        } else if (std.mem.indexOf(u8, file_path, "TransactionTests") != null) {
            return self.run_transaction_tests(file_content);
        } else {
            std.log.warn("Unknown test type for file: {}", .{file_path});
            return TestSummary.init(self.allocator);
        }
    }
    
    fn run_state_tests(self: *TestRunner, json_content: []const u8) !TestSummary {
        var summary = TestSummary.init(self.allocator);
        
        var parser = std.json.Parser.init(self.allocator, false);
        defer parser.deinit();
        
        var tree = parser.parse(json_content) catch |err| {
            std.log.err("Failed to parse JSON: {}", .{err});
            summary.failed += 1;
            return summary;
        };
        defer tree.deinit();
        
        if (tree.root != .Object) {
            std.log.err("Root is not an object");
            summary.failed += 1;
            return summary;
        }
        
        const root_obj = tree.root.Object;
        var iterator = root_obj.iterator();
        
        while (iterator.next()) |entry| {
            const test_name = entry.key_ptr.*;
            const test_data = entry.value_ptr.*;
            
            summary.total += 1;
            
            const result = self.execute_state_test(test_name, test_data) catch |err| {
                std.log.err("State test '{}' failed with error: {}", .{ test_name, err });
                summary.failed += 1;
                continue;
            };
            
            if (result) {
                summary.passed += 1;
                if (self.test_config.verbose) {
                    std.log.info("✓ State test '{}' passed", .{test_name});
                }
            } else {
                summary.failed += 1;
                std.log.err("✗ State test '{}' failed", .{test_name});
            }
        }
        
        return summary;
    }
    
    fn execute_state_test(self: *TestRunner, test_name: []const u8, test_data: std.json.Value) !bool {
        _ = self;
        _ = test_name;
        _ = test_data;
        
        // Parse test data into StateTest structure
        // Set up pre-state in VM
        // Execute transaction
        // Compare post-state with expected
        // Return true if all match, false otherwise
        
        // Placeholder implementation
        return true;
    }
    
    fn run_blockchain_tests(self: *TestRunner, json_content: []const u8) !TestSummary {
        _ = self;
        _ = json_content;
        
        // Placeholder implementation
        return TestSummary.init(self.allocator);
    }
    
    fn run_transaction_tests(self: *TestRunner, json_content: []const u8) !TestSummary {
        _ = self;
        _ = json_content;
        
        // Placeholder implementation
        return TestSummary.init(self.allocator);
    }
};

pub const TestSummary = struct {
    allocator: std.mem.Allocator,
    total: u32,
    passed: u32,
    failed: u32,
    skipped: u32,
    
    pub fn init(allocator: std.mem.Allocator) TestSummary {
        return TestSummary{
            .allocator = allocator,
            .total = 0,
            .passed = 0,
            .failed = 0,
            .skipped = 0,
        };
    }
    
    pub fn print_summary(self: *const TestSummary) void {
        std.log.info("=== TEST SUMMARY ===");
        std.log.info("Total:   {}", .{self.total});
        std.log.info("Passed:  {} ({d:.1}%)", .{ self.passed, @as(f64, @floatFromInt(self.passed)) / @as(f64, @floatFromInt(self.total)) * 100 });
        std.log.info("Failed:  {} ({d:.1}%)", .{ self.failed, @as(f64, @floatFromInt(self.failed)) / @as(f64, @floatFromInt(self.total)) * 100 });
        std.log.info("Skipped: {} ({d:.1}%)", .{ self.skipped, @as(f64, @floatFromInt(self.skipped)) / @as(f64, @floatFromInt(self.total)) * 100 });
        
        if (self.failed == 0) {
            std.log.info("🎉 All tests passed!");
        } else {
            std.log.warn("❌ {} test(s) failed", .{self.failed});
        }
    }
};
```

### Task 2: Implement State Test Executor
File: `/src/evm/consensus/state_test_executor.zig`
```zig
const std = @import("std");
const Vm = @import("../vm.zig").Vm;
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;
const StateTest = @import("test_runner.zig").StateTest;

pub const StateTestExecutor = struct {
    allocator: std.mem.Allocator,
    vm: *Vm,
    
    pub fn init(allocator: std.mem.Allocator, vm: *Vm) StateTestExecutor {
        return StateTestExecutor{
            .allocator = allocator,
            .vm = vm,
        };
    }
    
    pub fn execute_test(self: *StateTestExecutor, test: StateTest) !StateTestResult {
        var result = StateTestResult.init(self.allocator);
        
        // Setup pre-state
        try self.setup_pre_state(test.test_data.pre);
        
        // Setup environment
        try self.setup_environment(test.test_data.env);
        
        // Execute transaction for each fork
        var fork_iterator = test.test_data.post.iterator();
        while (fork_iterator.next()) |entry| {
            const fork_name = entry.key_ptr.*;
            const expected_post = entry.value_ptr.*;
            
            const execution_result = try self.execute_transaction(test.test_data.transaction);
            const actual_post = try self.get_post_state();
            
            const matches = try self.compare_states(expected_post, actual_post);
            
            try result.fork_results.put(fork_name, StateTestForkResult{
                .execution_result = execution_result,
                .state_matches = matches,
                .expected_post = expected_post,
                .actual_post = actual_post,
            });
        }
        
        return result;
    }
    
    fn setup_pre_state(self: *StateTestExecutor, pre_state: StateTest.StateTestData.PreState) !void {
        var iterator = pre_state.iterator();
        
        while (iterator.next()) |entry| {
            const address = entry.key_ptr.*;
            const account = entry.value_ptr.*;
            
            // Set account balance
            try self.vm.state.set_balance(address, account.balance);
            
            // Set account nonce
            try self.vm.state.set_nonce(address, account.nonce);
            
            // Set account code
            if (account.code.len > 0) {
                try self.vm.state.set_code(address, account.code);
            }
            
            // Set account storage
            var storage_iterator = account.storage.iterator();
            while (storage_iterator.next()) |storage_entry| {
                const key = storage_entry.key_ptr.*;
                const value = storage_entry.value_ptr.*;
                try self.vm.state.set_storage(address, key, value);
            }
        }
    }
    
    fn setup_environment(self: *StateTestExecutor, env: StateTest.StateTestData.TestEnvironment) !void {
        // Set block environment
        self.vm.context.block.coinbase = env.current_coinbase;
        self.vm.context.block.difficulty = env.current_difficulty;
        self.vm.context.block.gas_limit = env.current_gas_limit;
        self.vm.context.block.number = env.current_number;
        self.vm.context.block.timestamp = env.current_timestamp;
        
        if (env.current_base_fee) |base_fee| {
            self.vm.context.block.base_fee = base_fee;
        }
        
        if (env.current_blob_base_fee) |blob_base_fee| {
            self.vm.context.block.blob_base_fee = blob_base_fee;
        }
        
        if (env.current_excess_blob_gas) |excess_blob_gas| {
            self.vm.context.block.excess_blob_gas = excess_blob_gas;
        }
        
        if (env.current_random) |random| {
            self.vm.context.block.prevrandao = random;
        }
    }
    
    fn execute_transaction(self: *StateTestExecutor, tx: StateTest.StateTestData.TestTransaction) !ExecutionResult {
        // Choose first transaction variant for execution
        const data = if (tx.data.len > 0) tx.data[0] else &[_]u8{};
        const gas_limit = if (tx.gas_limit.len > 0) tx.gas_limit[0] else 21000;
        const value = if (tx.value.len > 0) tx.value[0] else 0;
        
        // Set transaction context
        self.vm.context.tx.caller = tx.sender;
        self.vm.context.tx.gas_price = tx.gas_price orelse 0;
        self.vm.context.tx.gas_limit = gas_limit;
        
        // Execute the transaction
        if (tx.to) |to_address| {
            // Call to existing contract or EOA
            return self.vm.execute_call(tx.sender, to_address, value, data, gas_limit);
        } else {
            // Contract creation
            return self.vm.execute_create(tx.sender, value, data, gas_limit);
        }
    }
    
    fn get_post_state(self: *StateTestExecutor) !StateTest.StateTestData.PostState {
        var post_state = StateTest.StateTestData.PostState.init(self.allocator);
        
        // Get all modified accounts from VM state
        var account_iterator = self.vm.state.get_accounts();
        defer account_iterator.deinit();
        
        while (account_iterator.next()) |entry| {
            const address = entry.key_ptr.*;
            const account_info = entry.value_ptr.*;
            
            var test_account = StateTest.StateTestData.TestAccount{
                .balance = account_info.balance,
                .nonce = account_info.nonce,
                .code = try self.allocator.dupe(u8, account_info.code),
                .storage = std.HashMap(U256, U256, U256Context, std.hash_map.default_max_load_percentage).init(self.allocator),
            };
            
            // Get storage for this account
            var storage_iterator = self.vm.state.get_storage(address);
            defer storage_iterator.deinit();
            
            while (storage_iterator.next()) |storage_entry| {
                const key = storage_entry.key_ptr.*;
                const value = storage_entry.value_ptr.*;
                try test_account.storage.put(key, value);
            }
            
            try post_state.put(address, test_account);
        }
        
        return post_state;
    }
    
    fn compare_states(
        self: *StateTestExecutor,
        expected: StateTest.StateTestData.PostState,
        actual: StateTest.StateTestData.PostState
    ) !bool {
        // Compare account counts
        if (expected.count() != actual.count()) {
            std.log.err("Account count mismatch: expected {}, got {}", .{ expected.count(), actual.count() });
            return false;
        }
        
        // Compare each account
        var expected_iterator = expected.iterator();
        while (expected_iterator.next()) |entry| {
            const address = entry.key_ptr.*;
            const expected_account = entry.value_ptr.*;
            
            const actual_account = actual.get(address) orelse {
                std.log.err("Missing account: {}", .{address});
                return false;
            };
            
            // Compare balance
            if (expected_account.balance != actual_account.balance) {
                std.log.err("Balance mismatch for {}: expected {}, got {}", 
                    .{ address, expected_account.balance, actual_account.balance });
                return false;
            }
            
            // Compare nonce
            if (expected_account.nonce != actual_account.nonce) {
                std.log.err("Nonce mismatch for {}: expected {}, got {}", 
                    .{ address, expected_account.nonce, actual_account.nonce });
                return false;
            }
            
            // Compare code
            if (!std.mem.eql(u8, expected_account.code, actual_account.code)) {
                std.log.err("Code mismatch for {}", .{address});
                return false;
            }
            
            // Compare storage
            if (!try self.compare_storage(expected_account.storage, actual_account.storage)) {
                std.log.err("Storage mismatch for {}", .{address});
                return false;
            }
        }
        
        return true;
    }
    
    fn compare_storage(
        self: *StateTestExecutor,
        expected: std.HashMap(U256, U256, U256Context, std.hash_map.default_max_load_percentage),
        actual: std.HashMap(U256, U256, U256Context, std.hash_map.default_max_load_percentage)
    ) !bool {
        _ = self;
        
        if (expected.count() != actual.count()) {
            return false;
        }
        
        var expected_iterator = expected.iterator();
        while (expected_iterator.next()) |entry| {
            const key = entry.key_ptr.*;
            const expected_value = entry.value_ptr.*;
            
            const actual_value = actual.get(key) orelse return false;
            
            if (expected_value != actual_value) {
                return false;
            }
        }
        
        return true;
    }
};

pub const StateTestResult = struct {
    allocator: std.mem.Allocator,
    fork_results: std.HashMap([]const u8, StateTestForkResult, std.hash_map.StringContext, std.hash_map.default_max_load_percentage),
    
    pub fn init(allocator: std.mem.Allocator) StateTestResult {
        return StateTestResult{
            .allocator = allocator,
            .fork_results = std.HashMap([]const u8, StateTestForkResult, std.hash_map.StringContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *StateTestResult) void {
        self.fork_results.deinit();
    }
    
    pub fn all_passed(self: *const StateTestResult) bool {
        var iterator = self.fork_results.iterator();
        while (iterator.next()) |entry| {
            if (!entry.value_ptr.state_matches) {
                return false;
            }
        }
        return true;
    }
};

pub const StateTestForkResult = struct {
    execution_result: ExecutionResult,
    state_matches: bool,
    expected_post: StateTest.StateTestData.PostState,
    actual_post: StateTest.StateTestData.PostState,
};

// Supporting types and contexts
const AddressContext = struct {
    pub fn hash(self: @This(), addr: Address) u64 {
        _ = self;
        return std.hash_map.hashString(addr.bytes[0..]);
    }
    
    pub fn eql(self: @This(), a: Address, b: Address) bool {
        _ = self;
        return std.mem.eql(u8, &a.bytes, &b.bytes);
    }
};

const U256Context = struct {
    pub fn hash(self: @This(), value: U256) u64 {
        _ = self;
        const bytes = value.to_be_bytes();
        return std.hash_map.hashString(&bytes);
    }
    
    pub fn eql(self: @This(), a: U256, b: U256) bool {
        _ = self;
        return a == b;
    }
};
```

### Task 3: Implement CLI Interface
File: `/src/evm/consensus/cli.zig`
```zig
const std = @import("std");
const TestRunner = @import("test_runner.zig").TestRunner;
const TestConfig = @import("test_runner.zig").TestConfig;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);
    
    var config = TestConfig.default();
    var i: usize = 1;
    
    // Parse command line arguments
    while (i < args.len) : (i += 1) {
        const arg = args[i];
        
        if (std.mem.eql(u8, arg, "--help") or std.mem.eql(u8, arg, "-h")) {
            print_help();
            return;
        } else if (std.mem.eql(u8, arg, "--test-dir")) {
            i += 1;
            if (i >= args.len) {
                std.log.err("--test-dir requires a value");
                return;
            }
            config.test_dir = args[i];
        } else if (std.mem.eql(u8, arg, "--filter")) {
            i += 1;
            if (i >= args.len) {
                std.log.err("--filter requires a value");
                return;
            }
            config.filter = args[i];
        } else if (std.mem.eql(u8, arg, "--verbose") or std.mem.eql(u8, arg, "-v")) {
            config.verbose = true;
        } else if (std.mem.eql(u8, arg, "--fail-fast")) {
            config.fail_fast = true;
        } else if (std.mem.eql(u8, arg, "--sequential")) {
            config.parallel = false;
        } else if (std.mem.eql(u8, arg, "--timeout")) {
            i += 1;
            if (i >= args.len) {
                std.log.err("--timeout requires a value");
                return;
            }
            config.timeout_ms = try std.fmt.parseInt(u32, args[i], 10);
        } else {
            std.log.err("Unknown argument: {s}", .{arg});
            print_help();
            return;
        }
    }
    
    // Run tests
    var runner = TestRunner.init(allocator, config) catch |err| {
        std.log.err("Failed to initialize test runner: {}", .{err});
        return;
    };
    defer runner.deinit();
    
    std.log.info("Starting Ethereum consensus test suite...");
    std.log.info("Test directory: {s}", .{config.test_dir});
    if (config.filter) |filter| {
        std.log.info("Filter: {s}", .{filter});
    }
    
    const start_time = std.time.milliTimestamp();
    
    const summary = runner.run_all_tests() catch |err| {
        std.log.err("Test execution failed: {}", .{err});
        return;
    };
    
    const end_time = std.time.milliTimestamp();
    const duration_ms = end_time - start_time;
    
    std.log.info("Test execution completed in {}ms", .{duration_ms});
    summary.print_summary();
    
    // Exit with non-zero code if tests failed
    if (summary.failed > 0) {
        std.process.exit(1);
    }
}

fn print_help() void {
    std.log.info("Ethereum Consensus Test Suite Runner");
    std.log.info("");
    std.log.info("USAGE:");
    std.log.info("    consensus-tests [OPTIONS]");
    std.log.info("");
    std.log.info("OPTIONS:");
    std.log.info("    --test-dir <DIR>     Directory containing ethereum/tests (default: ethereum-tests)");
    std.log.info("    --filter <PATTERN>   Run only tests matching pattern");
    std.log.info("    --verbose, -v        Enable verbose output");
    std.log.info("    --fail-fast          Stop on first failure");
    std.log.info("    --sequential         Run tests sequentially instead of parallel");
    std.log.info("    --timeout <MS>       Test timeout in milliseconds (default: 30000)");
    std.log.info("    --help, -h           Show this help message");
    std.log.info("");
    std.log.info("EXAMPLES:");
    std.log.info("    consensus-tests --test-dir ./ethereum-tests");
    std.log.info("    consensus-tests --filter stExample --verbose");
    std.log.info("    consensus-tests --fail-fast --sequential");
}
```

### Task 4: Implement Test Data Parsers
File: `/src/evm/consensus/test_parser.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const StateTest = @import("test_runner.zig").StateTest;
const BlockchainTest = @import("test_runner.zig").BlockchainTest;
const TransactionTest = @import("test_runner.zig").TransactionTest;

pub const TestParser = struct {
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) TestParser {
        return TestParser{ .allocator = allocator };
    }
    
    pub fn parse_state_test(self: *TestParser, json_content: []const u8) !StateTest {
        var parser = std.json.Parser.init(self.allocator, false);
        defer parser.deinit();
        
        var tree = try parser.parse(json_content);
        defer tree.deinit();
        
        // Extract test data from JSON tree
        // Implementation would parse JSON into StateTest structure
        
        return StateTest{
            .name = try self.allocator.dupe(u8, "test"),
            .test_data = undefined, // Would be populated from JSON
        };
    }
    
    pub fn parse_blockchain_test(self: *TestParser, json_content: []const u8) !BlockchainTest {
        _ = self;
        _ = json_content;
        
        // Placeholder implementation
        return BlockchainTest{
            .name = "test",
            .test_data = undefined,
        };
    }
    
    pub fn parse_transaction_test(self: *TestParser, json_content: []const u8) !TransactionTest {
        _ = self;
        _ = json_content;
        
        // Placeholder implementation
        return TransactionTest{
            .name = "test",
            .test_data = undefined,
        };
    }
    
    fn parse_address(value: std.json.Value) !Address {
        if (value != .String) return error.InvalidAddress;
        const addr_str = value.String;
        
        if (addr_str.len != 42 or !std.mem.startsWith(u8, addr_str, "0x")) {
            return error.InvalidAddressFormat;
        }
        
        return Address.from_hex(addr_str);
    }
    
    fn parse_u256(value: std.json.Value) !U256 {
        if (value != .String) return error.InvalidU256;
        const hex_str = value.String;
        
        if (!std.mem.startsWith(u8, hex_str, "0x")) {
            return error.InvalidU256Format;
        }
        
        return U256.from_hex(hex_str[2..]);
    }
    
    fn parse_bytes(self: *TestParser, value: std.json.Value) ![]u8 {
        if (value != .String) return error.InvalidBytes;
        const hex_str = value.String;
        
        if (!std.mem.startsWith(u8, hex_str, "0x")) {
            return error.InvalidBytesFormat;
        }
        
        const bytes = try self.allocator.alloc(u8, (hex_str.len - 2) / 2);
        _ = try std.fmt.hexToBytes(bytes, hex_str[2..]);
        
        return bytes;
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/consensus/consensus_test_suite_test.zig`

### Test Cases
```zig
test "test runner initialization" {
    // Test TestRunner creation and configuration
    // Test test discovery functionality
    // Test filter application
}

test "state test execution" {
    // Test StateTestExecutor with sample data
    // Test pre-state setup
    // Test transaction execution
    // Test post-state comparison
}

test "test data parsing" {
    // Test JSON parsing for all test types
    // Test error handling for malformed data
    // Test type conversion functions
}

test "cli argument parsing" {
    // Test command line argument parsing
    // Test help output
    // Test error handling for invalid arguments
}

test "parallel test execution" {
    // Test concurrent test execution
    // Test thread safety
    // Test result aggregation
}

test "real consensus tests" {
    // Test with actual ethereum/tests data
    // Test against known good/bad cases
    // Test performance with large test suites
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/consensus/test_runner.zig` - Main test runner framework
- `/src/evm/consensus/state_test_executor.zig` - State test execution engine
- `/src/evm/consensus/blockchain_test_executor.zig` - Blockchain test execution
- `/src/evm/consensus/transaction_test_executor.zig` - Transaction test execution
- `/src/evm/consensus/test_parser.zig` - JSON test data parsing
- `/src/evm/consensus/cli.zig` - Command line interface
- `/src/evm/vm.zig` - VM integration points
- `/build.zig` - Add consensus test build target
- `/test/evm/consensus/consensus_test_suite_test.zig` - Comprehensive tests

## Success Criteria

1. **Complete Test Coverage**: Support for all official Ethereum test types
2. **100% Compatibility**: Pass all applicable consensus tests for implemented features
3. **Performance**: Execute large test suites efficiently with parallel processing
4. **Usability**: Clear CLI interface with helpful error reporting
5. **Automation**: Integration with CI/CD for regression testing
6. **Maintainability**: Clean code structure for easy extension and debugging

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/consensus/consensus_test_suite_test.zig`)
```zig
// Test basic consensus test suite functionality
test "consensus_test_suite basic functionality works correctly"
test "consensus_test_suite handles edge cases properly"
test "consensus_test_suite validates inputs appropriately"
test "consensus_test_suite produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "consensus_test_suite integrates with EVM properly"
test "consensus_test_suite maintains system compatibility"
test "consensus_test_suite works with existing components"
test "consensus_test_suite handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "consensus_test_suite meets performance requirements"
test "consensus_test_suite optimizes resource usage"
test "consensus_test_suite scales appropriately with load"
test "consensus_test_suite benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "consensus_test_suite meets specification requirements"
test "consensus_test_suite maintains EVM compatibility"
test "consensus_test_suite handles hardfork transitions"
test "consensus_test_suite cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "consensus_test_suite handles errors gracefully"
test "consensus_test_suite proper error propagation"
test "consensus_test_suite recovery from failure states"
test "consensus_test_suite validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "consensus_test_suite prevents security vulnerabilities"
test "consensus_test_suite handles malicious inputs safely"
test "consensus_test_suite maintains isolation boundaries"
test "consensus_test_suite validates security properties"
```

### Test Development Priority
1. **Core functionality** - Basic feature operation
2. **Specification compliance** - Meet requirements
3. **Integration** - System-level correctness
4. **Performance** - Efficiency targets
5. **Error handling** - Robust failures
6. **Security** - Vulnerability prevention

### Test Data Sources
- **Specification documents**: Official requirements and test vectors
- **Reference implementations**: Cross-client compatibility
- **Performance baselines**: Optimization targets
- **Real-world data**: Production scenarios
- **Synthetic cases**: Edge conditions and stress testing

### Continuous Testing
- Run `zig build test-all` after every change
- Maintain 100% test coverage for public APIs
- Validate performance regression prevention
- Test both debug and release builds
- Verify cross-platform behavior

### Test-First Examples

**Before implementation:**
```zig
test "consensus_test_suite basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = consensus_test_suite.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const consensus_test_suite = struct {
    pub fn process(input: InputType) !OutputType {
        return error.NotImplemented; // Initially
    }
};
```

### Critical Requirements
- **Never commit without passing tests**
- **Test all configuration paths**
- **Verify specification compliance**
- **Validate performance implications**
- **Ensure cross-platform compatibility**

## References

- [Ethereum Tests Repository](https://github.com/ethereum/tests) - Official test suite
- [EIP-3155: EVM trace specification](https://eips.ethereum.org/EIPS/eip-3155) - Tracing format
- [Ethereum Test Formats](https://ethereum-tests.readthedocs.io/) - Test documentation
- [Geth Test Runner](https://github.com/ethereum/go-ethereum/tree/master/tests) - Reference implementation
- [Besu Test Runner](https://github.com/hyperledger/besu/tree/main/ethereum/core/src/test/java/org/hyperledger/besu/ethereum/vm) - Alternative implementation

## EVMONE Context

An excellent and well-structured prompt. Implementing a consensus test suite is a significant undertaking, and `evmone` provides a high-quality, performant reference.

Here are the most relevant code snippets from the `evmone` codebase that will help you implement this feature in Zig. I've focused on the logic for test discovery, parsing, state transition, and execution, which directly map to the tasks you've outlined.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/statetest/statetest.cpp">
```cpp
// This is the main test runner for state tests. It shows how to discover
// and register tests. This logic is analogous to your `discover_tests` and
// `run_all_tests` functions in `test_runner.zig`.

class StateTest : public testing::Test
{
    fs::path m_json_test_file;
    // ...
public:
    explicit StateTest(fs::path json_test_file, ...) noexcept;

    void TestBody() final
    {
        std::ifstream f{m_json_test_file};
        const auto tests = evmone::test::load_state_tests(f);
        for (const auto& test : tests)
        {
            // ... filtering logic ...
            evmone::test::run_state_test(test, m_vm, m_trace);
        }
    }
};

// ... main function to parse CLI args and register tests ...
int main(int argc, char* argv[])
{
    // ... CLI parsing ...
    evmc::VM vm{evmc_create_evmone(), {{"O", "0"}}};
    // ...
    for (const auto& p : paths)
        register_test_files(p, filter, vm, trace || trace_summary);

    return RUN_ALL_TESTS();
}
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/test/statetest/statetest_runner.cpp">
```cpp
// This is the core logic for executing a single state test case, directly
// corresponding to your `execute_state_test` function. It handles setting up
// the pre-state, executing the transaction, and validating the post-state.

void run_state_test(const StateTransitionTest& test, evmc::VM& vm, bool trace_summary)
{
    SCOPED_TRACE(test.name);
    for (const auto& [rev, cases, block] : test.cases)
    {
        validate_state(test.pre_state, rev);
        for (size_t case_index = 0; case_index != cases.size(); ++case_index)
        {
            // ...
            const auto& expected = cases[case_index];
            const auto tx = test.multi_tx.get(expected.indexes);
            auto state = test.pre_state;

            // This is the key function that applies a transaction to a state.
            const auto res = test::transition(state, block, test.block_hashes, tx, rev, vm,
                block.gas_limit, static_cast<int64_t>(state::max_blob_gas_per_block(rev)));

            // Finalize block with reward 0.
            test::finalize(state, rev, block.coinbase, 0, {}, {});

            const auto state_root = state::mpt_hash(state);

            // ... tracing logic ...

            if (expected.exception)
            {
                // Validation for expected exceptions
            }
            else
            {
                // Validation for successful execution
            }

            EXPECT_EQ(state_root, expected.state_hash);
        }
    }
}
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/test/blockchaintest/blockchaintest_runner.cpp">
```cpp
// This file contains the runner for Blockchain tests. The `apply_block` function
// is particularly relevant for your `BlockchainTestExecutor`, as it shows how to
// process transactions within a block and update the state accordingly.

struct TransitionResult
{
    std::vector<state::TransactionReceipt> receipts;
    std::vector<RejectedTransaction> rejected;
    std::optional<std::vector<state::Requests>> requests;
    int64_t gas_used;
    state::BloomFilter bloom;
    int64_t blob_gas_left;
    TestState block_state;
};

TransitionResult apply_block(const TestState& state, evmc::VM& vm, const state::BlockInfo& block,
    const state::BlockHashes& block_hashes, const std::vector<state::Transaction>& txs,
    evmc_revision rev, std::optional<int64_t> block_reward)
{
    TestState block_state(state);
    system_call_block_start(block_state, block, block_hashes, rev, vm);

    // ... lots of logic to process transactions in a block ...

    for (size_t i = 0; i < txs.size(); ++i)
    {
        const auto& tx = txs[i];
        // ...
        auto res = test::transition(
            block_state, block, block_hashes, tx, rev, vm, block_gas_left, blob_gas_left);
        // ... process result ...
    }

    // ... finalize block ...
    finalize(block_state, rev, block.coinbase, block_reward, block.ommers, block.withdrawals);

    return {std::move(receipts), /* ... */};
}

// The main loop for blockchain tests.
void run_blockchain_tests(std::span<const BlockchainTest> tests, evmc::VM& vm)
{
    for (size_t case_index = 0; case_index != tests.size(); ++case_index)
    {
        // ... setup ...
        for (size_t i = 0; i < c.test_blocks.size(); ++i)
        {
            // ...
            if (test_block.valid)
            {
                // ...
                auto res = apply_block(pre_state, vm, bi, block_hashes, test_block.transactions,
                    rev, mining_reward(rev));
                // ... validation ...
            }
            else
            {
                // ... handle invalid block expectations ...
            }
        }
        // ... final post-state validation ...
    }
}
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/test/statetest/statetest_loader.cpp">
```cpp
// This file contains the JSON parsing logic, directly mapping to your
// `test_parser.zig`. The `from_json` specializations show how to handle
// different data types and structures found in the consensus test files.

// Example for parsing a number (your `parse_u256` and others)
template <>
intx::uint256 from_json<intx::uint256>(const json::json& j)
{
    const auto s = j.get<std::string>();
    // ...
    return intx::from_string<intx::uint256>(s);
}

// Example for parsing an entire account state (your `PreState` and `PostState`)
template <>
TestState from_json<TestState>(const json::json& j)
{
    TestState o;
    assert(j.is_object());
    for (const auto& [j_addr, j_acc] : j.items())
    {
        auto& acc =
            o[from_json<address>(j_addr)] = {.nonce = from_json<uint64_t>(j_acc.at("nonce")),
                .balance = from_json<intx::uint256>(j_acc.at("balance")),
                .code = from_json<bytes>(j_acc.at("code"))};

        if (const auto storage_it = j_acc.find("storage"); storage_it != j_acc.end())
        {
            for (const auto& [j_key, j_value] : storage_it->items())
            {
                if (const auto value = from_json<bytes32>(j_value); !is_zero(value))
                    acc.storage[from_json<bytes32>(j_key)] = value;
            }
        }
    }
    return o;
}

// Example for parsing the `env` part of a StateTest
state::BlockInfo from_json_with_rev(const json::json& j, evmc_revision rev)
{
    // ... logic to parse all fields from TestEnvironment ...
    return state::BlockInfo{
        .number = from_json<int64_t>(j.at("currentNumber")),
        .timestamp = from_json<int64_t>(j.at("currentTimestamp")),
        .gas_limit = from_json<int64_t>(j.at("currentGasLimit")),
        .coinbase = from_json<evmc::address>(j.at("currentCoinbase")),
        .difficulty = current_difficulty,
        .prev_randao = prev_randao,
        .base_fee = base_fee,
        .blob_gas_used = load_if_exists<uint64_t>(j, "blobGasUsed"),
        .excess_blob_gas = excess_blob_gas,
        .blob_base_fee = state::compute_blob_gas_price(rev, excess_blob_gas),
        // ... and so on
    };
}
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.cpp">
```cpp
// This file shows how state transitions are managed. The `validate_transaction`
// and `transition` functions are the most relevant parts.

// `validate_transaction` corresponds to checking transaction validity before execution.
std::variant<TransactionProperties, std::error_code> validate_transaction(
    const StateView& state_view, const BlockInfo& block, const Transaction& tx, evmc_revision rev,
    int64_t block_gas_left, int64_t blob_gas_left) noexcept
{
    // ... nonce checks ...
    if (sender_acc.nonce < tx.nonce)
        return make_error_code(NONCE_TOO_HIGH);
    if (sender_acc.nonce > tx.nonce)
        return make_error_code(NONCE_TOO_LOW);
    
    // ... sender checks (EIP-3607) ...
    if (sender_acc.code_hash != Account::EMPTY_CODE_HASH &&
        !is_code_delegated(state_view.get_account_code(tx.sender)))
        return make_error_code(SENDER_NOT_EOA);
    
    // ... fee and balance checks ...
    auto max_total_fee = umul(uint256{tx.gas_limit}, tx.max_gas_price);
    max_total_fee += tx.value;
    // ...
    if (sender_acc.balance < max_total_fee)
        return make_error_code(INSUFFICIENT_FUNDS);

    // ... intrinsic gas checks ...
    const auto [intrinsic_cost, min_cost] = compute_tx_intrinsic_cost(rev, tx);
    if (tx.gas_limit < std::max(intrinsic_cost, min_cost))
        return make_error_code(INTRINSIC_GAS_TOO_LOW);
    
    // ...
    return TransactionProperties{execution_gas_limit, min_cost};
}


// `transition` is the core function that executes a transaction against a state.
// This is what your `StateTestExecutor` will be doing.
TransactionReceipt transition(const StateView& state_view, const BlockInfo& block,
    const BlockHashes& block_hashes, const Transaction& tx, evmc_revision rev, evmc::VM& vm,
    const TransactionProperties& tx_props)
{
    State state{state_view};

    auto& sender_acc = state.get_or_insert(tx.sender);
    ++sender_acc.nonce; // Bump sender nonce.

    // ... fee deduction logic ...

    Host host{rev, vm, state, block, block_hashes, tx};

    // ... access list warm-up logic (EIP-2929/2930) ...

    auto message = build_message(tx, tx_props.execution_gas_limit);

    // ... execute the message via the VM ...
    const auto result = host.call(message);

    // ... process result, calculate gas used, and apply refunds ...

    return TransactionReceipt{/*...*/};
}
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.cpp">
```cpp
// The Host class is the bridge between the EVM and the state. It implements
// callbacks that opcodes use to interact with the world, like SLOAD, SSTORE,
// BALANCE, etc. This is a crucial reference for how your VM implementation
// should interact with the state during a test run.

// Example: SLOAD
bytes32 Host::get_storage(const address& addr, const bytes32& key) const noexcept
{
    return m_state.get_storage(addr, key).current;
}

// Example: SSTORE with EIP-2200 logic
evmc_storage_status Host::set_storage(
    const address& addr, const bytes32& key, const bytes32& value) noexcept
{
    auto& storage_slot = m_state.get_storage(addr, key);
    const auto& [current, original, _] = storage_slot;

    // ... logic to determine gas refunds and storage status ...
    
    m_state.journal_storage_change(addr, key, storage_slot);
    storage_slot.current = value;
    return status;
}

// Example: BALANCE
uint256be Host::get_balance(const address& addr) const noexcept
{
    const auto* const acc = m_state.find(addr);
    return (acc != nullptr) ? intx::be::store<uint256be>(acc->balance) : uint256be{};
}

// Example: CREATE
evmc::Result Host::create(const evmc_message& msg) noexcept
{
    // ... collision checks, nonce increment ...
    auto* new_acc = m_state.find(msg.recipient);
    // ...

    // ... value transfer ...
    sender_acc.balance -= value;
    new_acc->balance += value;

    // ... execute init code ...
    auto result = m_vm.execute(*this, m_rev, create_msg, initcode.data(), initcode.size());
    if (result.status_code != EVMC_SUCCESS)
    {
        // ... handle failure ...
    }

    // ... process deployment code, check size limits, charge deployment gas ...
    const bytes_view code{result.output_data, result.output_size};
    if (m_rev >= EVMC_SPURIOUS_DRAGON && code.size() > MAX_CODE_SIZE)
        return evmc::Result{EVMC_FAILURE};

    const auto cost = std::ssize(code) * 200;
    // ...

    new_acc->code_hash = keccak256(code);
    new_acc->code = code;

    return evmc::Result{result.status_code, gas_left, result.gas_refund, msg.recipient};
}
```
</file>
</evmone>



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/statetest/src/runner.rs">
```rust
//! This file contains the main logic for running state tests.
//! It shows how to:
//! 1. Parse test files.
//! 2. Set up the pre-state in an in-memory database.
//! 3. Configure the EVM environment (Block, Tx, Cfg).
//! 4. Execute the transaction.
//! 5. Compare the resulting state with the expected post-state.
//! This is highly relevant for implementing `StateTestExecutor`.

// The main function that executes a single test unit from a statetest file.
fn execute_test_unit(
    test_unit: &TestUnit,
    // ...
) {
    // ...
    // Create a database and insert the pre-state.
    let mut db = CacheDB::new(EmptyDB::default());
    for (address, info) in &test_unit.pre {
        db.insert_account_info(*address, info.clone().into());
    }

    for (spec_name, tests) in &test_unit.post {
        let spec_id = spec_name.to_spec_id();

        for (_id, test) in tests.iter().enumerate() {
            // ...

            // Get the transaction for this test case.
            let tx = match test_unit.transaction.tx_for_test(spec_id, test) {
                Ok(tx) => tx,
                // ...
            };
            
            // Configure the EVM environment from the test file's "env" section.
            let env = test_unit.env.to_block_env(spec_id);
            let tx_env = test_unit.env.to_tx_env(tx.clone());
            let cfg_env = CfgEnv::new_with_spec(spec_id);
            
            // Create the EVM context.
            let mut evm = Evm::new(
                Context::new_with_db(
                    CfgEnvWithHandlerCfg::new_with_spec(cfg_env, spec_id),
                    db.clone(),
                ),
                (),
            );

            // Set the block and transaction environment.
            evm.context.evm.modify_block_env(|b| *b = env);
            evm.context.evm.modify_tx_env(|t| *t = tx_env);

            // Execute the transaction.
            let ResultAndState { result, state } = match evm.transact() {
                Ok(res) => res,
                // ...
            };
            
            // Check the post-state.
            if let Some(post_spec) = test.post_state.get(&spec_id) {
                if let Err(e) = check_post_state(post_spec, &state) {
                    // ... handle post-state mismatch error
                }
            }
            // ...
        }
    }
}


/// Compares the actual EVM state with the expected post-state from the test file.
fn check_post_state(
    expected_post: &HashMap<Address, statetest_types::AccountInfo>,
    state: &EvmState,
) -> Result<(), StateTestError> {
    // ...

    for (address, expected_account) in expected_post {
        // ...
        // Check balance
        if info.balance != expected_account.balance {
            // ...
        }
        // Check nonce
        if info.nonce != expected_account.nonce {
            // ...
        }
        // Check code
        let code = state.get(address).and_then(|a| a.info.code.as_ref()).unwrap();
        if code.bytes() != expected_account.code {
            // ...
        }
        // Check storage
        for (key, value) in &expected_account.storage {
            let present_value = storage.get(key).map(|s| s.present_value).unwrap_or_default();
            if present_value != *value {
                // ...
            }
        }
    }

    Ok(())
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/ef-tests/src/blockchain.rs">
```rust
//! This file contains the logic for running Blockchain tests.
//! It shows how to:
//! 1. Set up the genesis state.
//! 2. Iterate through a series of blocks defined in the test file.
//! 3. For each block, execute all its transactions.
//! 4. Commit the state changes after each transaction.
//! 5. Validate the state root against the block header.
//! 6. Validate the final state of the chain.
//! This is the core logic needed for a `BlockchainTestExecutor`.

// Main function to run a single blockchain test unit.
pub fn run(unit: &TestUnit, spec_id: SpecId) -> Result<(), BlockchainTestError> {
    // Create a database and insert the pre-state from the test file.
    let mut db = CacheDB::new(EmptyDB::default());
    for (addr, acc) in &unit.pre_state {
        db.insert_account_info(*addr, acc.clone().into());
    }

    let mut block_number = unit.genesis_block_header.number;
    let mut parent_block = &unit.genesis_block_header;

    let mut ctx = EvmContext::new_with_db(CfgEnv::new_with_spec(spec_id), db);
    ctx.tx = TxEnv::default(); // dummy tx

    // Iterate over blocks and execute them.
    for (i, block) in unit.blocks.iter().enumerate() {
        let rlp_bytes = block.rlp.as_ref().expect("block rlp is missing");
        let header = block.block_header.as_ref().unwrap_or(parent_block);

        // Configure the block environment.
        let mut block_env = BlockEnv {
            number: U256::from(header.number),
            coinbase: header.coinbase,
            timestamp: header.timestamp,
            gas_limit: header.gas_limit,
            basefee: header.base_fee_per_gas.unwrap_or_default(),
            difficulty: header.difficulty,
            prevrandao: header.mix_hash,
            // ...
        };
        ctx.block = block_env;

        // Get a mutable reference to the database.
        let mut db = ctx.db.as_mut().unwrap();

        // Execute transactions in the block.
        for tx in &block.transactions {
            ctx.tx = tx.to_tx_env();
            let ResultAndState { result, state } = Evm::new(ctx.clone(), &mut db).transact()?;
            
            // ... handle exceptions or successful results
            
            // Commit the state changes to the database for the next transaction.
            db.commit(state);
        }

        // After all transactions, get the state root from the database.
        let state_root = db.state_root().unwrap();
        // Validate the state root against the block header.
        if state_root != header.state_root {
            return Err(BlockchainTestError::StateRootMismatch {
                expected: header.state_root,
                got: state_root,
            });
        }
        
        parent_block = header;
        block_number += 1;
    }

    // After all blocks are processed, check the final post-state.
    if let Some(post_state) = &unit.post_state {
        let mut db = ctx.db.as_mut().unwrap();
        for (addr, acc) in post_state {
            let info = db.basic_ref(*addr).unwrap().unwrap_or_default();
            // ... compare final account state (balance, nonce, code, storage)
        }
    }

    Ok(())
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/ef-tests/src/transaction.rs">
```rust
//! This file contains the logic for running Transaction tests.
//! These tests focus on validating the transaction itself (RLP encoding, signature, intrinsic gas)
//! rather than state changes from execution.
//! This is relevant for implementing a `TransactionTestExecutor`.

// Main function to run a single transaction test unit.
pub fn run(unit: &TestUnit, _fork: &SpecName) -> Result<(), TransactionTestError> {
    for (spec_id, result) in &unit.result {
        let spec_id = spec_id.to_spec_id();

        // Attempt to decode the RLP-encoded transaction.
        let tx = match Transaction::decode_rlp(unit.rlp.as_ref()) {
            Ok(tx) => tx,
            Err(err) => {
                // If decoding fails, check if an exception was expected.
                if let Some(expected_exception) = &result.exp_exception {
                    // ... compare exception with expected
                }
                continue;
            }
        };

        // Validate the transaction against pre-Spurious Dragon rules.
        if let Err(err) = tx.validate_pre_spurious_dragon() {
            // ... check for expected exception
            continue;
        }

        // Recover the signer from the transaction signature.
        let sender = tx.recover_signer();

        // Validate the recovered sender against the expected sender.
        if let Some(expected_sender) = result.sender {
            if sender != Some(expected_sender) {
                // ... handle sender mismatch error
            }
        }
    }
    Ok(())
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/statetest-types/src/test_unit.rs">
```rust
//! This file defines the data structures for parsing state tests.
//! The structs map directly to the JSON format of the `ethereum/tests` repository.
//! These are equivalent to the Zig structs provided in the prompt and show a
//! real-world implementation using `serde` for deserialization.

use serde::Deserialize;
use std::collections::{BTreeMap, HashMap};

use crate::{AccountInfo, Env, SpecName, Test, TransactionParts};
use revm::primitives::{Address, Bytes};

/// A single state test unit.
#[derive(Debug, PartialEq, Eq, Deserialize)]
pub struct TestUnit {
    #[serde(default, rename = "_info")]
    pub info: Option<serde_json::Value>,

    /// The environment settings for the test.
    pub env: Env,
    /// The pre-state of all accounts before the transaction.
    pub pre: HashMap<Address, AccountInfo>,
    /// The expected post-state and exceptions for different hard forks.
    pub post: BTreeMap<SpecName, Vec<Test>>,
    /// The transaction to be executed.
    pub transaction: TransactionParts,
    #[serde(default)]
    pub out: Option<Bytes>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/statetest-types/src/env.rs">
```rust
//! This file defines the `Env` struct, which corresponds to the
//! `TestEnvironment` in the prompt's Zig implementation.

use revm::primitives::{Address, B256, U256};
use serde::Deserialize;

/// Environment variables for a state test.
#[derive(Debug, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Env {
    pub current_coinbase: Address,
    #[serde(default)]
    pub current_difficulty: U256,
    pub current_gas_limit: U256,
    pub current_number: U256,
    pub current_timestamp: U256,
    pub current_base_fee: Option<U256>,
    pub previous_hash: Option<B256>,
    
    // Fields for newer forks
    pub current_random: Option<B256>,
    pub current_beacon_root: Option<B256>,
    pub current_withdrawals_root: Option<B256>,
    pub parent_blob_gas_used: Option<U256>,
    pub parent_excess_blob_gas: Option<U256>,
    pub current_excess_blob_gas: Option<U256>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/statetest-types/src/account_info.rs">
```rust
//! This file defines the `AccountInfo` struct, which corresponds to the
//! `TestAccount` in the prompt's Zig implementation.

use revm::primitives::{Bytes, HashMap, StorageKey, StorageValue, U256};
use serde::Deserialize;

use crate::deserializer::deserialize_str_as_u64;

/// Account information for a state test.
#[derive(Clone, Debug, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct AccountInfo {
    pub balance: U256,
    pub code: Bytes,
    #[serde(deserialize_with = "deserialize_str_as_u64")]
    pub nonce: u64,
    pub storage: HashMap<StorageKey, StorageValue>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/ef-tests/src/models/blockchain.rs">
```rust
//! This file defines the data structures for parsing blockchain tests.
//! The structs map directly to the JSON format of the `ethereum/tests` repository.
//! These are equivalent to the Zig structs provided in the prompt.

use crate::models::AccountInfo;
use revm::primitives::{Address, Bytes, HashMap, B256, U256};
use serde::Deserialize;
use std::collections::BTreeMap;

#[derive(Debug, PartialEq, Eq, Deserialize)]
pub struct BlockchainTest(pub BTreeMap<String, TestUnit>);

#[derive(Debug, PartialEq, Eq, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TestUnit {
    pub network: String,
    pub genesis_block_header: BlockHeader,
    pub genesis_rlp: Bytes,
    pub blocks: Vec<Block>,
    #[serde(default)]
    pub lastblockhash: B256,
    #[serde(rename = "pre")]
    pub pre_state: HashMap<Address, AccountInfo>,
    #[serde(default)]
    pub post_state: Option<HashMap<Address, AccountInfo>>,
}

#[derive(Debug, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Block {
    pub rlp: Bytes,
    #[serde(default)]
    pub block_header: Option<BlockHeader>,
    #[serde(default)]
    pub transactions: Vec<Transaction>,
    #[serde(default)]
    pub uncle_headers: Vec<BlockHeader>,
    #[serde(default)]
    pub withdrawals: Option<Vec<Withdrawal>>,
    #[serde(default)]
    pub expect_exception: Option<String>,
}

#[derive(Debug, PartialEq, Eq, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct BlockHeader {
    // ... fields matching the Zig struct ...
    pub parent_hash: B256,
    pub uncle_hash: B256,
    pub coinbase: Address,
    pub state_root: B256,
    pub transactions_root: B256,
    pub receipt_root: B256,
    pub logs_bloom: Bytes,
    pub difficulty: U256,
    pub number: u64,
    pub gas_limit: u64,
    pub gas_used: u64,
    pub timestamp: u64,
    pub extra_data: Bytes,
    pub mix_hash: B256,
    pub nonce: Bytes,
    // ... optional fields for newer forks
    pub base_fee_per_gas: Option<U256>,
    pub withdrawals_root: Option<B256>,
    // ...
}
```
</file>

## Prompt Corrections
The original prompt is well-structured and provides a clear plan. However, there are a few points to consider:

1.  **Language Mismatch**: The prompt is written for a Zig implementation, while the provided `revm` context is in Rust. The implementation patterns (e.g., error handling, memory management, use of `serde` for deserialization) from `revm` are highly valuable but will need to be translated to Zig's idioms. The provided Rust snippets should serve as a strong architectural reference.

2.  **Modular Structure**: `revm` separates concerns into different crates, which is a very effective pattern for a complex project like an EVM.
    *   `revm/crates/statetest-types` and `revm/crates/ef-tests/src/models` contain only the data structures for parsing test files. This is a good practice to separate data models from execution logic.
    *   `revm/crates/statetest` and `revm/crates/ef-tests` contain the runner logic.
    *   This modularity could be adopted in the Zig implementation by creating separate modules for test data models and the test execution engine.

3.  **Database Abstraction**: The `revm` examples use an in-memory database (`CacheDB`) to set up the pre-state. This is a powerful abstraction that allows the same execution logic to be used with different database backends. The prompt's implementation could benefit from a similar database interface to keep the `StateTestExecutor` clean and focused.

4.  **Configuration (`Env`) to EVM Context (`BlockEnv`, `TxEnv`)**: `revm` has a clear pattern for converting the test environment data (`Env` struct) into the EVM's internal context (`BlockEnv`, `TxEnv`). The provided snippets from `statetest/src/runner.rs` and `ef-tests/src/blockchain.rs` are excellent examples of how to bridge the gap between the test specification format and the VM's internal representation of the environment. This is a critical detail for a correct implementation.



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase provides several key files that demonstrate how to implement a consensus test suite. The most relevant examples are the test loaders, which show how to parse test files, and the state transition functions, which show how to apply transactions and blocks to the state.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum_spec_tools/evm_tools/t8n/__init__.py">
```python
# src/ethereum_spec_tools/evm_tools/t8n/__init__.py

# ... (imports)

def t8n_arguments(subparsers: argparse._SubParsersAction) -> None:
    """
    Adds the arguments for the t8n tool subparser.
    """
    # ... (argument parsing)
    t8n_parser.add_argument(
        "--state.fork", dest="state_fork", type=str, default="Frontier"
    )
    t8n_parser.add_argument("--state-test", action="store_true")


class T8N(Load):
    """The class that carries out the transition"""

    def __init__(
        self, options: Any, out_file: TextIO, in_file: TextIO
    ) -> None:
        # ... (initialization)
        fork_module, self.fork_block = get_module_name(
            self.forks, self.options, stdin
        )
        self.fork = ForkLoad(fork_module)

        # ... (initialization)

        super().__init__(
            self.options.state_fork,
            fork_module,
        )

        self.alloc = Alloc(self, stdin)
        self.env = Env(self, stdin)
        self.txs = Txs(self, stdin)
        self.result = Result(
            self.env.block_difficulty, self.env.base_fee_per_gas
        )

    def run_state_test(self) -> Any:
        """
        Apply a single transaction on pre-state. No system operations
        are performed.
        """
        block_env = self.block_environment()
        block_output = self.fork.BlockOutput()
        self.backup_state()
        if len(self.txs.transactions) > 0:
            tx = self.txs.transactions[0]
            try:
                self.fork.process_transaction(
                    block_env=block_env,
                    block_output=block_output,
                    tx=tx,
                    index=Uint(0),
                )
            except EthereumException as e:
                self.txs.rejected_txs[0] = f"Failed transaction: {e!r}"
                self.restore_state()
                self.logger.warning(f"Transaction {0} failed: {str(e)}")

        self.result.update(self, block_env, block_output)
        self.result.rejected = self.txs.rejected_txs

    # ... (other methods)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/tests/helpers/load_evm_tools_tests.py">
```python
# tests/helpers/load_evm_tools_tests.py

# ... (imports)

def fetch_evm_tools_tests(
    test_dir: str,
    fork_name: str,
    slow_tests: Optional[Tuple[str, ...]] = None,
) -> Generator:
    """
    Fetches all the general state tests from the given directory
    """
    # ... (setup)

    pattern = os.path.join(test_dir, "**/*.json")
    for test_file_path in glob(pattern, recursive=True):
        test_cases = read_test_cases(test_file_path)
        for test_case in test_cases:
            if test_case.fork_name != fork_name:
                continue

            test_case_dict = {
                "test_file": test_case.path,
                "test_key": test_case.key,
                "index": test_case.index,
            }

            # ... (pytest marker logic)
            yield test_case_dict


def load_evm_tools_test(test_case: Dict[str, str], fork_name: str) -> None:
    """
    Runs a single general state test
    """
    test_file = test_case["test_file"]
    test_key = test_case["test_key"]
    index = test_case["index"]
    with open(test_file) as f:
        tests = json.load(f)

    env = tests[test_key]["env"]
    # ... (env setup)

    alloc = tests[test_key]["pre"]

    post = tests[test_key]["post"][fork_name][index]
    post_hash = post["hash"]
    d = post["indexes"]["data"]
    g = post["indexes"]["gas"]
    v = post["indexes"]["value"]

    tx = {}
    for k, value in tests[test_key]["transaction"].items():
        if k == "data":
            tx["input"] = value[d]
        elif k == "gasLimit":
            tx["gas"] = value[g]
        elif k == "value":
            tx[k] = value[v]
        elif k == "accessLists":
            if value[d] is not None:
                tx["accessList"] = value[d]
        else:
            tx[k] = value

    txs = [tx]

    in_stream = StringIO(
        json.dumps(
            {
                "env": env,
                "alloc": alloc,
                "txs": txs,
            }
        )
    )

    # ... (run t8n tool)
    t8n.run_state_test()

    assert hex_to_bytes(post_hash) == t8n.result.state_root
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/tests/helpers/load_state_tests.py">
```python
# tests/helpers/load_state_tests.py

# ... (imports)

def run_blockchain_st_test(test_case: Dict, load: Load) -> None:
    test_file = test_case["test_file"]
    test_key = test_case["test_key"]

    with open(test_file, "r") as fp:
        data = json.load(fp)

    json_data = data[test_key]

    if "postState" not in json_data:
        pytest.xfail(f"{test_case} doesn't have post state")

    genesis_header = load.json_to_header(json_data["genesisBlockHeader"])
    # ... (genesis block parameter setup)
    genesis_block = load.fork.Block(*parameters)

    # ... (genesis block validation)
    try:
        state = load.json_to_state(json_data["pre"])
    except StateWithEmptyAccount as e:
        pytest.xfail(str(e))

    chain = load.fork.BlockChain(
        blocks=[genesis_block],
        state=state,
        chain_id=U64(json_data["genesisBlockHeader"].get("chainId", 1)),
    )

    # ... (mock PoW setup)

    for json_block in json_data["blocks"]:
        block_exception = None
        for key, value in json_block.items():
            if key.startswith("expectException"):
                block_exception = value
                break

        if block_exception:
            # ... (exception handling)
        else:
            add_block_to_chain(chain, json_block, load, mock_pow)

    last_block_hash = hex_to_bytes(json_data["lastblockhash"])
    assert keccak256(rlp.encode(chain.blocks[-1].header)) == last_block_hash

    expected_post_state = load.json_to_state(json_data["postState"])
    assert chain.state == expected_post_state
    # ... (cleanup)


def add_block_to_chain(
    chain: Any, json_block: Any, load: Load, mock_pow: bool
) -> None:
    (
        block,
        block_header_hash,
        block_rlp,
    ) = load.json_to_block(json_block)

    assert keccak256(rlp.encode(block.header)) == block_header_hash
    assert rlp.encode(block) == block_rlp

    if not mock_pow:
        load.fork.state_transition(chain, block)
    else:
        # ... (mocked PoW validation)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/fork.py">
```python
# src/ethereum/cancun/fork.py

# ... (imports)

def state_transition(chain: BlockChain, block: Block) -> None:
    # ... (header validation)

    block_env = vm.BlockEnvironment(
        # ... (environment setup)
    )

    block_output = apply_body(
        block_env=block_env,
        transactions=block.transactions,
        withdrawals=block.withdrawals,
    )
    # ... (post-block validation)
    
def apply_body(
    block_env: vm.BlockEnvironment,
    transactions: Tuple[Union[LegacyTransaction, Bytes], ...],
    withdrawals: Tuple[Withdrawal, ...],
) -> vm.BlockOutput:
    block_output = vm.BlockOutput()
    
    # System transactions (beacon root contract call)
    process_unchecked_system_transaction(
        block_env=block_env,
        target_address=BEACON_ROOTS_ADDRESS,
        data=block_env.parent_beacon_block_root,
    )

    for i, tx in enumerate(map(decode_transaction, transactions)):
        process_transaction(block_env, block_output, tx, Uint(i))

    process_withdrawals(block_env, block_output, withdrawals)

    return block_output


def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    # ... (transaction validation and setup)

    (
        sender,
        effective_gas_price,
        blob_versioned_hashes,
        tx_blob_gas_used,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    # ... (gas fee calculation and state updates)

    tx_env = vm.TransactionEnvironment(
        # ... (transaction environment setup)
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... (gas refunds and fee transfers)
    # ... (receipt and log updates)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/transactions.py">
```python
# src/ethereum/cancun/transactions.py

# Defines LegacyTransaction, AccessListTransaction, FeeMarketTransaction, 
# and BlobTransaction dataclasses.

def validate_transaction(tx: Transaction) -> Uint:
    """
    Verifies a transaction.
    """
    # ...
    intrinsic_gas = calculate_intrinsic_cost(tx)
    if intrinsic_gas > tx.gas:
        raise InvalidTransaction("Insufficient gas")
    if U256(tx.nonce) >= U256(U64.MAX_VALUE):
        raise InvalidTransaction("Nonce too high")
    # ...
    return intrinsic_gas

def calculate_intrinsic_cost(tx: Transaction) -> Uint:
    """
    Calculates the gas that is charged before execution is started.
    """
    # ...
    data_cost = Uint(0)
    for byte in tx.data:
        # ...
    # ...
    return TX_BASE_COST + data_cost + create_cost + access_list_cost

def recover_sender(chain_id: U64, tx: Transaction) -> Address:
    """
    Extracts the sender address from a transaction.
    """
    # ... (signature recovery logic for different transaction types)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
# src/ethereum/cancun/state.py

# ... (imports)

@dataclass
class State:
    # ...
    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    # ...

def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ... (snapshotting logic)

def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ... (commit logic)

def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ... (revert logic)

def get_account(state: State, address: Address) -> Account:
    # ...

def set_account(
    state: State, address: Address, account: Optional[Account]
) -> None:
    # ...

def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    # ...

def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    # ...

# ... (and many other state helper functions)
```
</file>
## Prompt Corrections

The original prompt is well-structured and provides a clear plan. However, a few minor adjustments can make it more aligned with the `ethereum/tests` structure and improve the implementation process:

1.  **Network/Fork Identification**: The `StateTest.StateTestData.post` field is a map keyed by a `[]const u8`. This key represents the network name (e.g., "Frontier", "Istanbul", "Cancun") for which the post-state is valid. The `TestRunner` should be aware of the current fork being tested and use it to select the correct expected post-state from this map. The `run_state_tests` function should probably be invoked for each fork specified in the `post` object.

2.  **`TestTransaction` Simplification**: The `TestTransaction` struct in the prompt has fields like `data`, `gas_limit`, and `value` as arrays (`[][]const u8`, `[]u64`, `[]U256`). In the `ethereum/tests` format, these fields are typically not arrays within a single transaction test case. The test file itself contains multiple test cases (e.g., `stExample`), and each test case has a single transaction. The multiple values (`data`, `gasLimit`, `value`) are for different forks within the `post` section. It would be simpler to have single values in `TestTransaction` and handle fork variations in the test executor. The `StateTest.StateTestData` struct should contain a single `transaction` object, not an array.

3.  **Error vs. Exception**: The prompt uses `expect_exception` for both transaction and blockchain tests. The test format often distinguishes between failed transactions that are still included in a block (e.g., out-of-gas, revert) and invalid transactions/blocks that cause the block to be rejected entirely. The test runner should be able to differentiate these outcomes. `BlockchainTest.TestBlock` correctly has an `expect_exception` field, which signifies the block is invalid and should be rejected. `StateTest` post-states implicitly handle reverts and out-of-gas scenarios by specifying the expected state after such failures. `TransactionTest`'s `expect_exception` field is for transaction validation errors (e.g., invalid signature) before execution even starts.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork.py">
```python
"""
Ethereum Specification
^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Entry point for the Ethereum specification.
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple, Union

from ethereum_rlp import rlp
from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U64, U256, Uint

from ethereum.crypto.hash import Hash32, keccak256
from ethereum.exceptions import (
    EthereumException,
    InvalidBlock,
    InvalidSenderError,
)

from . import vm
from .blocks import Block, Header, Log, Receipt, Withdrawal, encode_receipt
from .bloom import logs_bloom
from .fork_types import Account, Address, Authorization, VersionedHash
from .requests import (
    CONSOLIDATION_REQUEST_TYPE,
    DEPOSIT_REQUEST_TYPE,
    WITHDRAWAL_REQUEST_TYPE,
    compute_requests_hash,
    parse_deposit_requests,
)
from .state import (
    State,
    TransientStorage,
    account_exists_and_is_empty,
    destroy_account,
    get_account,
    increment_nonce,
    modify_state,
    set_account_balance,
    state_root,
)
from .transactions import (
    AccessListTransaction,
    BlobTransaction,
    FeeMarketTransaction,
    LegacyTransaction,
    SetCodeTransaction,
    Transaction,
    decode_transaction,
    encode_transaction,
    get_transaction_hash,
    recover_sender,
    validate_transaction,
)
from .trie import root, trie_set
from .utils.hexadecimal import hex_to_address
from .utils.message import prepare_message
from .vm import Message
from .vm.eoa_delegation import is_valid_delegation
from .vm.gas import (
    calculate_blob_gas_price,
    calculate_data_fee,
    calculate_excess_blob_gas,
    calculate_total_blob_gas,
)
from .vm.interpreter import MessageCallOutput, process_message_call

# ... (Constants)

@dataclass
class BlockChain:
    """
    History and current state of the block chain.
    """

    blocks: List[Block]
    state: State
    chain_id: U64

# ... (Functions like apply_fork, get_last_256_block_hashes)

def state_transition(chain: BlockChain, block: Block) -> None:
    """
    Attempts to apply a block to an existing block chain.
    ...
    """
    validate_header(chain, block.header)
    if block.ommers != ():
        raise InvalidBlock

    block_env = vm.BlockEnvironment(
        chain_id=chain.chain_id,
        state=chain.state,
        block_gas_limit=block.header.gas_limit,
        block_hashes=get_last_256_block_hashes(chain),
        coinbase=block.header.coinbase,
        number=block.header.number,
        base_fee_per_gas=block.header.base_fee_per_gas,
        time=block.header.timestamp,
        prev_randao=block.header.prev_randao,
        excess_blob_gas=block.header.excess_blob_gas,
        parent_beacon_block_root=block.header.parent_beacon_block_root,
    )

    block_output = apply_body(
        block_env=block_env,
        transactions=block.transactions,
        withdrawals=block.withdrawals,
    )
    block_state_root = state_root(block_env.state)
    transactions_root = root(block_output.transactions_trie)
    receipt_root = root(block_output.receipts_trie)
    block_logs_bloom = logs_bloom(block_output.block_logs)
    withdrawals_root = root(block_output.withdrawals_trie)
    requests_hash = compute_requests_hash(block_output.requests)

    if block_output.block_gas_used != block.header.gas_used:
        raise InvalidBlock(
            f"{block_output.block_gas_used} != {block.header.gas_used}"
        )
    if transactions_root != block.header.transactions_root:
        raise InvalidBlock
    if block_state_root != block.header.state_root:
        raise InvalidBlock
    if receipt_root != block.header.receipt_root:
        raise InvalidBlock
    if block_logs_bloom != block.header.bloom:
        raise InvalidBlock
    if withdrawals_root != block.header.withdrawals_root:
        raise InvalidBlock
    if block_output.blob_gas_used != block.header.blob_gas_used:
        raise InvalidBlock
    if requests_hash != block.header.requests_hash:
        raise InvalidBlock

    chain.blocks.append(block)
    if len(chain.blocks) > 255:
        # Real clients have to store more blocks to deal with reorgs, but the
        # protocol only requires the last 255
        chain.blocks = chain.blocks[-255:]


def calculate_base_fee_per_gas(
    block_gas_limit: Uint,
    parent_gas_limit: Uint,
    parent_gas_used: Uint,
    parent_base_fee_per_gas: Uint,
) -> Uint:
    # ... Implementation ...

def validate_header(chain: BlockChain, header: Header) -> None:
    # ... Implementation ...

def check_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
) -> Tuple[Address, Uint, Tuple[VersionedHash, ...], U64]:
    """
    Check if the transaction is includable in the block.
    ...
    """
    gas_available = block_env.block_gas_limit - block_output.block_gas_used
    blob_gas_available = MAX_BLOB_GAS_PER_BLOCK - block_output.blob_gas_used

    if tx.gas > gas_available:
        raise InvalidBlock

    tx_blob_gas_used = calculate_total_blob_gas(tx)
    if tx_blob_gas_used > blob_gas_available:
        raise InvalidBlock

    sender_address = recover_sender(block_env.chain_id, tx)
    sender_account = get_account(block_env.state, sender_address)

    if isinstance(
        tx, (FeeMarketTransaction, BlobTransaction, SetCodeTransaction)
    ):
        if tx.max_fee_per_gas < tx.max_priority_fee_per_gas:
            raise InvalidBlock
        if tx.max_fee_per_gas < block_env.base_fee_per_gas:
            raise InvalidBlock

        priority_fee_per_gas = min(
            tx.max_priority_fee_per_gas,
            tx.max_fee_per_gas - block_env.base_fee_per_gas,
        )
        effective_gas_price = priority_fee_per_gas + block_env.base_fee_per_gas
        max_gas_fee = tx.gas * tx.max_fee_per_gas
    else:
        if tx.gas_price < block_env.base_fee_per_gas:
            raise InvalidBlock
        effective_gas_price = tx.gas_price
        max_gas_fee = tx.gas * tx.gas_price

    if isinstance(tx, BlobTransaction):
        if len(tx.blob_versioned_hashes) == 0:
            raise InvalidBlock
        for blob_versioned_hash in tx.blob_versioned_hashes:
            if blob_versioned_hash[0:1] != VERSIONED_HASH_VERSION_KZG:
                raise InvalidBlock

        blob_gas_price = calculate_blob_gas_price(block_env.excess_blob_gas)
        if Uint(tx.max_fee_per_blob_gas) < blob_gas_price:
            raise InvalidBlock

        max_gas_fee += Uint(calculate_total_blob_gas(tx)) * Uint(
            tx.max_fee_per_blob_gas
        )
        blob_versioned_hashes = tx.blob_versioned_hashes
    else:
        blob_versioned_hashes = ()

    # ... (more validation)

    if sender_account.nonce != tx.nonce:
        raise InvalidBlock
    if Uint(sender_account.balance) < max_gas_fee + Uint(tx.value):
        raise InvalidBlock
    if sender_account.code and not is_valid_delegation(sender_account.code):
        raise InvalidSenderError("not EOA")

    return (
        sender_address,
        effective_gas_price,
        blob_versioned_hashes,
        tx_blob_gas_used,
    )

def apply_body(
    block_env: vm.BlockEnvironment,
    transactions: Tuple[Union[LegacyTransaction, Bytes], ...],
    withdrawals: Tuple[Withdrawal, ...],
) -> vm.BlockOutput:
    # ... Implementation ...

def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    # ... (Setup and validation)

    (
        sender,
        effective_gas_price,
        blob_versioned_hashes,
        tx_blob_gas_used,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    sender_account = get_account(block_env.state, sender)

    # ... (Gas fee calculation and sender balance deduction)
    
    gas = tx.gas - intrinsic_gas
    increment_nonce(block_env.state, sender)

    # ...

    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        # ...
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... (Refunds and fee transfers)
    
    receipt = make_receipt(
        tx, tx_output.error, block_output.block_gas_used, tx_output.logs
    )

    # ... (Store receipt in trie)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
```python
def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    ...
    """
    block_env = message.block_env
    refund_counter = U256(0)
    if message.target == Bytes0(b""):
        is_collision = account_has_code_or_nonce(
            block_env.state, message.current_target
        ) or account_has_storage(block_env.state, message.current_target)
        if is_collision:
            return MessageCallOutput(
                # ...
            )
        else:
            evm = process_create_message(message)
    else:
        # ...
        evm = process_message(message)

    if evm.error:
        logs: Tuple[Log, ...] = ()
        accounts_to_delete = set()
    else:
        logs = evm.logs
        accounts_to_delete = evm.accounts_to_delete
        refund_counter += U256(evm.refund_counter)
    
    # ...

    return MessageCallOutput(
        gas_left=evm.gas_left,
        refund_counter=refund_counter,
        logs=logs,
        accounts_to_delete=accounts_to_delete,
        error=evm.error,
        return_data=evm.output,
    )

def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.
    ...
    """
    state = message.block_env.state
    transient_storage = message.tx_env.transient_storage
    if message.depth > STACK_DEPTH_LIMIT:
        raise StackDepthLimitError("Stack depth limit reached")

    # take snapshot of state before processing the message
    begin_transaction(state, transient_storage)

    if message.should_transfer_value and message.value != 0:
        move_ether(
            state, message.caller, message.current_target, message.value
        )

    evm = execute_code(message)
    if evm.error:
        # revert state to the last saved checkpoint
        # since the message call resulted in an error
        rollback_transaction(state, transient_storage)
    else:
        commit_transaction(state, transient_storage)
    return evm

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    ...
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        # ...
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ... precompile handling
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            op_implementation[op](evm)
        
        # ...

    except ExceptionalHalt as error:
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/state.py">
```python
@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    created_accounts: Set[Address] = field(default_factory=set)


@dataclass
class TransientStorage:
    """
    Contains all information that is preserved between message calls
    within a transaction.
    """

    _tries: Dict[Address, Trie[Bytes32, U256]] = field(default_factory=dict)
    _snapshots: List[Dict[Address, Trie[Bytes32, U256]]] = field(
        default_factory=list
    )

def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ... Implementation ...

def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ... Implementation ...

def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ... Implementation ...

def get_account(state: State, address: Address) -> Account:
    # ... Implementation ...

def set_account(
    state: State, address: Address, account: Optional[Account]
) -> None:
    # ... Implementation ...

def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    # ... Implementation ...

def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    # ... Implementation ...

def state_root(state: State) -> Root:
    # ... Implementation ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/transactions.py">
```python
@slotted_freezable
@dataclass
class LegacyTransaction:
    """
    Atomic operation performed on the block chain.
    """
    nonce: U256
    gas_price: Uint
    gas: Uint
    to: Union[Bytes0, Address]
    value: U256
    data: Bytes
    v: U256
    r: U256
    s: U256


@slotted_freezable
@dataclass
class AccessListTransaction:
    # ... fields
    
@slotted_freezable
@dataclass
class FeeMarketTransaction:
    # ... fields

@slotted_freezable
@dataclass
class BlobTransaction:
    # ... fields

@slotted_freezable
@dataclass
class SetCodeTransaction:
    # ... fields

Transaction = Union[
    LegacyTransaction,
    AccessListTransaction,
    FeeMarketTransaction,
    BlobTransaction,
    SetCodeTransaction,
]


def validate_transaction(tx: Transaction) -> Tuple[Uint, Uint]:
    """
    Verifies a transaction.
    ...
    """
    intrinsic_gas, calldata_floor_gas_cost = calculate_intrinsic_cost(tx)
    if max(intrinsic_gas, calldata_floor_gas_cost) > tx.gas:
        raise InvalidTransaction("Insufficient gas")
    if U256(tx.nonce) >= U256(U64.MAX_VALUE):
        raise InvalidTransaction("Nonce too high")
    # ... more validation
    return intrinsic_gas, calldata_floor_gas_cost


def calculate_intrinsic_cost(tx: Transaction) -> Tuple[Uint, Uint]:
    # ... Implementation ...

def recover_sender(chain_id: U64, tx: Transaction) -> Address:
    # ... Implementation ...

def get_transaction_hash(tx: Union[Bytes, LegacyTransaction]) -> Hash32:
    # ... Implementation ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/blocks.py">
```python
@slotted_freezable
@dataclass
class Withdrawal:
    """
    Withdrawals that have been validated on the consensus layer.
    """

    index: U64
    validator_index: U64
    address: Address
    amount: U256


@slotted_freezable
@dataclass
class Header:
    """
    Header portion of a block on the chain.
    """

    parent_hash: Hash32
    ommers_hash: Hash32
    coinbase: Address
    state_root: Root
    transactions_root: Root
    receipt_root: Root
    bloom: Bloom
    difficulty: Uint
    number: Uint
    gas_limit: Uint
    gas_used: Uint
    timestamp: U256
    extra_data: Bytes
    prev_randao: Bytes32
    nonce: Bytes8
    base_fee_per_gas: Uint
    withdrawals_root: Root
    blob_gas_used: U64
    excess_blob_gas: U64
    parent_beacon_block_root: Root
    requests_hash: Hash32


@slotted_freezable
@dataclass
class Block:
    """
    A complete block.
    """

    header: Header
    transactions: Tuple[Union[Bytes, LegacyTransaction], ...]
    ommers: Tuple[Header, ...]
    withdrawals: Tuple[Withdrawal, ...]


@slotted_freezable
@dataclass
class Log:
    # ... fields

@slotted_freezable
@dataclass
class Receipt:
    """
    Result of a transaction.
    """

    succeeded: bool
    cumulative_gas_used: Uint
    bloom: Bloom
    logs: Tuple[Log, ...]
```
</file>
</execution-specs>

## Prompt Corrections
The prompt provides a solid foundation for building the consensus test suite. Here are a few suggestions for improvement based on the `execution-specs`:

1.  **`TestAccount` Structure**: The `TestAccount` struct is missing `code_hash` and `storage_root` fields. While the `pre` state can be built from `code` and `storage`, the `post` state validation in many tests relies on comparing the final `stateRoot`, `transactionsRoot`, and `receiptsRoot` in the block header. The account's `code_hash` and `storage_root` are essential components for calculating the overall `stateRoot`. Consider adding these to your `TestAccount` struct for more comprehensive validation.

2.  **`TestTransaction` as a Tagged Union**: The provided `TestTransaction` struct combines fields from all transaction types (legacy, EIP-2930, EIP-1559, EIP-4844). This can be difficult to manage. The `execution-specs` model transactions as a `Union` of different transaction types. In Zig, this would be best modeled as a `union(enum)` (a tagged union) to clearly distinguish between transaction types and their specific fields. This would make parsing and handling different transaction formats in tests much cleaner.

3.  **`ExecutionResult` in Zig**: The prompt defines an `ExecutionResult` struct in `/src/evm/consensus/state_test_executor.zig`, but the core EVM will likely have its own return type for execution. In `execution-specs`, this is handled by the `MessageCallOutput` dataclass, which includes `gas_left`, `logs`, `error`, etc. The test executor should adapt the VM's native execution result to the format required for test validation, rather than defining its own `ExecutionResult`.

4.  **`U256.ts` Typo**: The file `U256.ts` is referenced, which is likely a typo for a Zig file, e.g., `u256.zig`.

5.  **Handling Expected Exceptions**: Both `BlockchainTest` and `TransactionTest` have an `expect_exception` field. Your implementation should carefully map the expected exception strings (e.g., "invalid opcode", "stack underflow") to the corresponding `ExecutionError` enum variants in your Zig EVM to validate these failure cases correctly.

By considering these points, your test suite will align more closely with the Ethereum specification and be more robust in validating both success and failure conditions.



## GO-ETHEREUM Context

An excellent and well-structured prompt. Implementing the consensus test suite is a foundational task for any EVM implementation. Here are the most relevant code snippets from `go-ethereum` that will guide you through this process.

The primary logic for executing these tests can be found in `cmd/evm/`, which acts as a command-line EVM runner, and the `tests/` package, which contains the test struct definitions and their execution logic.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/staterunner.go">
```go
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"slices"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/internal/flags"
	"github.com/ethereum/go-ethereum/tests"
	"github.com/urfave/cli/v2"
)
// ... (flags definitions) ...
var stateTestCommand = &cli.Command{
	Action:    stateTestCmd,
	Name:      "statetest",
	Usage:     "Executes the given state tests. Filenames can be fed via standard input (batch mode) or as an argument (one-off execution).",
	ArgsUsage: "<file>",
	Flags: slices.Concat([]cli.Flag{
		BenchFlag,
		DumpFlag,
		forkFlag,
		HumanReadableFlag,
		idxFlag,
		RunFlag,
	}, traceFlags),
}

func stateTestCmd(ctx *cli.Context) error {
	// ... (argument parsing) ...
	// If path is provided, run the tests at that path.
	if len(path) != 0 {
		var (
			collected = collectFiles(path)
			results   []testResult
		)
		for _, fname := range collected {
			r, err := runStateTest(ctx, fname)
			if err != nil {
				return err
			}
			results = append(results, r...)
		}
		report(ctx, results)
		return nil
	}
	// ... (stdin reading logic) ...
	return nil
}

// runStateTest loads the state-test given by fname, and executes the test.
func runStateTest(ctx *cli.Context, fname string) ([]testResult, error) {
	src, err := os.ReadFile(fname)
	if err != nil {
		return nil, err
	}
	var testsByName map[string]tests.StateTest
	if err := json.Unmarshal(src, &testsByName); err != nil {
		return nil, fmt.Errorf("unable to read test file %s: %w", fname, err)
	}

	cfg := vm.Config{Tracer: tracerFromFlags(ctx)}
	re, err := regexp.Compile(ctx.String(RunFlag.Name))
	if err != nil {
		return nil, fmt.Errorf("invalid regex -%s: %v", RunFlag.Name, err)
	}

	// Iterate over all the tests, run them and aggregate the results
	results := make([]testResult, 0, len(testsByName))
	for key, test := range testsByName {
		if !re.MatchString(key) {
			continue
		}
		for i, st := range test.Subtests() {
			if idx := ctx.Int(idxFlag.Name); idx != -1 && idx != i {
				// If specific index requested, skip all tests that do not match.
				continue
			}
			if fork := ctx.String(forkFlag.Name); fork != "" && st.Fork != fork {
				// If specific fork requested, skip all tests that do not match.
				continue
			}
			// Run the test and aggregate the result
			result := &testResult{Name: key, Fork: st.Fork, Pass: true}
			test.Run(st, cfg, false, rawdb.HashScheme, func(err error, state *tests.StateTestState) {
				var root common.Hash
				if state.StateDB != nil {
					root = state.StateDB.IntermediateRoot(false)
					result.Root = &root
					fmt.Fprintf(os.Stderr, "{\"stateRoot\": \"%#x\"}\n", root)
					// Dump any state to aid debugging.
					if ctx.Bool(DumpFlag.Name) {
						result.State = dump(state.StateDB)
					}
				}
				// ... (benchmarking logic) ...
				if err != nil {
					// Test failed, mark as so.
					result.Pass, result.Error = false, err.Error()
					return
				}
			})
			results = append(results, *result)
		}
	}
	return results, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test.go">
```go
package tests

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/consensus/ethash"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/triedb"
)

// StateTest is the struct that contains a single GeneralStateTest.
type StateTest struct {
	json stJSON
}

// stJSON is the internal representation of a GeneralStateTest.
type stJSON struct {
	Env         *stEnv                            `json:"env"`
	Pre         core.GenesisAlloc                 `json:"pre"`
	Transaction stTransaction                     `json:"transaction"`
	Post        map[string][]stPostState          `json:"post"`
	Out         *string                           `json:"out"`
	Gas         *string                           `json:"gas"`
	Logs        *string                           `json:"logs"`
	TxBytes     *string                           `json:"txbytes"`
	Expect      map[string][]stExpect             `json:"expect"`
	Network     []string                          `json:"network"`
	PostState   map[common.Hash][]core.GenesisAccount `json:"postState"`
}

type stPostState struct {
	Root    common.Hash       `json:"hash"`
	Logs    common.Hash       `json:"logs"`
	TxBytes hexutil.Bytes     `json:"txbytes"`
	Expect  []stPostStateExpect `json:"expect"`
}

// stPostStateExpect defines the results we expect for a single transaction.
// Unlike stPostState, it is used only inside the block-level poststate,
// and holds per-transaction data.
type stPostStateExpect struct {
	Logs      *common.Hash  `json:"logs"`
	Result    []stResult    `json:"results"`
	LogsBloom *types.Bloom  `json:"logsBloom"`
	TxBytes   hexutil.Bytes `json:"txbytes"`
}

// stTransaction is the transaction part of a state test.
type stTransaction struct {
	GasLimit      []hexutil.Uint64 `json:"gasLimit"`
	GasPrice      *hexutil.Big     `json:"gasPrice"`
	Nonce         hexutil.Uint64   `json:"nonce"`
	To            *common.Address  `json:"to"`
	Data          []string         `json:"data"`
	Value         []string         `json:"value"`
	SecretKey     common.Hash      `json:"secretKey"`
	Sender        *common.Address  `json:"sender"`
	V, R, S       *hexutil.Big     `json:"v"`
	Type          hexutil.Uint64   `json:"type"`
	AccessList    *types.AccessList  `json:"accessLists"` // Note this is 'accessLists'
	GasFeeCap     *hexutil.Big     `json:"maxFeePerGas"`
	GasTipCap     *hexutil.Big     `json:"maxPriorityFeePerGas"`
	BlobFeeCap    *hexutil.Big     `json:"maxFeePerBlobGas"`
	BlobHashes    []common.Hash    `json:"blobVersionedHashes"`
}
// ... other st structs ...

// Run executes the test and returns an error if it fails.
func (t *StateTest) Run(sub *stSubtest, vmConfig vm.Config, snapshot bool, scheme string, cb stCallback) {
	// Create the blockchain and apply the initial state.
	var (
		statedb *state.StateDB
		err     error
	)
	var tdb *triedb.Database
	if snapshot {
		// ... snapshot logic ...
	} else {
		config := &triedb.Config{
			HashDB: hashdb.Defaults,
		}
		if scheme == rawdb.PathScheme {
			config.PathDB = pathdb.Defaults
			config.HashDB = nil
		}
		tdb = triedb.NewDatabase(rawdb.NewMemoryDatabase(), config)
	}

	statedb, err = state.New(sub.Pre.Root(), state.NewDatabase(tdb), nil)
	if err != nil {
		cb(err, nil)
		return
	}
	// Apply the transaction and check for pre-check errors.
	msg, err := sub.Tx.ToMessage(sub.Env.BaseFee)
	if err != nil {
		cb(err, &StateTestState{StateDB: statedb})
		return
	}
	// Create the EVM context.
	context := vm.BlockContext{
		CanTransfer: core.CanTransfer,
		Transfer:    core.Transfer,
		GetHash:     stEnvGetHashFunc(sub.Env),
		Coinbase:    sub.Env.Coinbase,
		BlockNumber: new(big.Int).SetUint64(sub.Env.Number),
		Time:        sub.Env.Timestamp,
		Difficulty:  sub.Env.Difficulty,
		GasLimit:    sub.Env.GasLimit,
		BaseFee:     sub.Env.BaseFee,
	}
	if sub.Env.Random != nil {
		context.Random = &common.Hash{0x51}
		copy(context.Random[:], sub.Env.Random.Bytes())
	}
	if sub.Env.ParentBeaconRoot != nil {
		context.ParentBeaconRoot = sub.Env.ParentBeaconRoot
	}
	if chain.Config().IsCancun(context.BlockNumber, context.Time) && context.BlobBaseFee == nil {
		context.BlobBaseFee = eip4844.CalcBlobFee(&params.ChainConfig{CancunTime: new(uint64)}, &types.Header{
			Time:          context.Time,
			ExcessBlobGas: sub.Env.ExcessBlobGas,
		})
	}
	// Finally, apply the transaction.
	evm := vm.NewEVM(context, statedb, chain.Config(), vmConfig)

	// Call the callback.
	var gasLeft uint64
	var result *vm.ExecutionResult
	if sub.Tx.To() == nil {
		// Contract creation.
		result, err = core.Create(evm, msg.From, msg.Data, msg.GasLimit, msg.Value)
	} else {
		// Value call.
		result, err = core.Call(evm, msg.From, msg.To, msg.Data, msg.GasLimit, msg.Value)
	}
	if err != nil {
		cb(err, &StateTestState{StateDB: statedb})
		return
	}
	gasLeft = result.Gas
	
	// Check the results.
	if err := checkStPost(sub, statedb, result.ReturnData); err != nil {
		cb(err, &StateTestState{StateDB: statedb, gas: gasLeft, output: result.ReturnData})
		return
	}
	cb(nil, &StateTestState{StateDB: statedb, gas: gasLeft, output: result.ReturnData})
}

// checkStPost checks the post-state of a state test.
func checkStPost(sub *stSubtest, s *state.StateDB, output []byte) error {
	// The provided post-state is the result of applying the transaction.
	// We must check that the state root of the actually resulting state
	// equals the one provided in the test data.
	root := s.IntermediateRoot(sub.Fork)
	if want := sub.Post.Root; want != root {
		return fmt.Errorf("post-state root mismatch: got %x, want %x", root, want)
	}
	// Check logs.
	if logs := rlpHash(s.Logs()); logs != sub.Post.Logs {
		return fmt.Errorf("post-state log hash mismatch: got %x, want %x", logs, sub.Post.Logs)
	}
	// Check that the output matches.
	if sub.Out != nil && !bytes.Equal(sub.Out, output) {
		return fmt.Errorf("output mismatch: got %x, want %x", output, sub.Out)
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/blockrunner.go">
```go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"regexp"
	"slices"

	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/tests"
	"github.com/urfave/cli/v2"
)

var blockTestCommand = &cli.Command{
	Action:    blockTestCmd,
	Name:      "blocktest",
	Usage:     "Executes the given blockchain tests",
	ArgsUsage: "<path>",
	Flags: slices.Concat([]cli.Flag{
		DumpFlag,
		HumanReadableFlag,
		RunFlag,
		WitnessCrossCheckFlag,
	}, traceFlags),
}

func blockTestCmd(ctx *cli.Context) error {
	// ... (argument and file discovery logic) ...
	var (
		collected = collectFiles(path)
		results   []testResult
	)
	for _, fname := range collected {
		r, err := runBlockTest(ctx, fname)
		if err != nil {
			return err
		}
		results = append(results, r...)
	}
	report(ctx, results)
	return nil
}

func runBlockTest(ctx *cli.Context, fname string) ([]testResult, error) {
	src, err := os.ReadFile(fname)
	if err != nil {
		return nil, err
	}
	var tests map[string]*tests.BlockTest
	if err = json.Unmarshal(src, &tests); err != nil {
		return nil, err
	}
	re, err := regexp.Compile(ctx.String(RunFlag.Name))
	if err != nil {
		return nil, fmt.Errorf("invalid regex -%s: %v", RunFlag.Name, err)
	}
	tracer := tracerFromFlags(ctx)

	// ... (key sorting) ...
	
	// Run all the tests.
	var results []testResult
	for _, name := range keys {
		if !re.MatchString(name) {
			continue
		}
		result := &testResult{Name: name, Pass: true}
		if err := tests[name].Run(false, rawdb.HashScheme, ctx.Bool(WitnessCrossCheckFlag.Name), tracer, func(res error, chain *core.BlockChain) {
			if ctx.Bool(DumpFlag.Name) {
				if s, _ := chain.State(); s != nil {
					result.State = dump(s)
				}
			}
		}); err != nil {
			result.Pass, result.Error = false, err.Error()
		}
		results = append(results, *result)
	}
	return results, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/blockchain_test.go">
```go
package tests

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/consensus/ethash"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/triedb"
)

// BlockTest is the struct that contains a single blockchain test.
type BlockTest struct {
	json btJSON
}

// btJSON is the internal representation of a blockchain test.
type btJSON struct {
	GenesisHeader       *types.Header     `json:"genesisBlockHeader"`
	GenesisRLP          hexutil.Bytes     `json:"genesisRLP"`
	Blocks              []btBlock         `json:"blocks"`
	LastBlockHash       common.Hash       `json:"lastblockhash"`
	Pre                 core.GenesisAlloc `json:"pre"`
	PostState           *btPostState      `json:"postState"`
	Network             string            `json:"network"`
	SealEngine          string            `json:"sealEngine"`
	GenesisStateRoot    common.Hash       `json:"genesisStateRoot"`
	PostStateRoot       common.Hash       `json:"postStateRoot"`
	WitnessCrossCheck   bool              `json:"witnessCrossCheck"`
	StatelessCrossCheck bool              `json:"statelessCrossCheck"`
}

type btBlock struct {
	RLP            hexutil.Bytes `json:"rlp"`
	Txs            []*btTx         `json:"transactions"`
	UncleHeaders   []*types.Header `json:"uncleHeaders"`
	BlockHeader    *btHeader       `json:"blockHeader"`
	Withdrawals    []*btWithdrawal `json:"withdrawals"`
	ExpectException string        `json:"expectException"`
}
//... other bt structs ...

// Run executes the test and returns an error if it fails.
func (t *BlockTest) Run(snapshot, pathbased bool, witnessCrossCheck bool, tracer vm.EVMLogger, onFail func(error, *core.BlockChain)) (err error) {
	// Configure the chain.
	config, _, err := GetChainConfig(t.json.Network)
	if err != nil {
		return err
	}
	db := rawdb.NewMemoryDatabase()
	var tdb *triedb.Database
	if pathbased {
		tdb = triedb.NewDatabase(db, triedb.PathDefaults)
	} else {
		tdb = triedb.NewDatabase(db, triedb.HashDefaults)
	}
	gspec := &core.Genesis{
		Config:     config,
		Alloc:      t.json.Pre,
		ExtraData:  t.json.GenesisHeader.Extra,
		Timestamp:  t.json.GenesisHeader.Time,
		BaseFee:    t.json.GenesisHeader.BaseFee,
		Difficulty: t.json.GenesisHeader.Difficulty,
		Mixhash:    t.json.GenesisHeader.MixDigest,
		Nonce:      t.json.GenesisHeader.Nonce,
		Number:     t.json.GenesisHeader.Number.Uint64(),
		GasLimit:   t.json.GenesisHeader.GasLimit,
		GasUsed:    t.json.GenesisHeader.GasUsed,
		ParentHash: t.json.GenesisHeader.ParentHash,
		Coinbase:   t.json.GenesisHeader.Coinbase,
	}
	if gspec.Config.Clique != nil {
		gspec.Difficulty = common.Big1
	}
	// For EIP-1559, difficulty is replaced by mix digest.
	if gspec.Config.IsLondon(common.Big0) && gspec.Difficulty.Sign() != 0 {
		gspec.Mixhash = common.Hash{}
		gspec.Difficulty = common.Big0
	}
	engine := ethash.NewFaker()
	if t.json.SealEngine == "Clique" {
		engine = newClique(gspec.Config.Clique, db)
	}
	cache := &core.CacheConfig{
		SnapshotLimit: 128,
	}
	if !snapshot {
		cache.SnapshotLimit = 0
	}
	if pathbased {
		cache.StateScheme = rawdb.PathScheme
	} else {
		cache.StateScheme = rawdb.HashScheme
	}
	chain, err := core.NewBlockChain(db, cache, gspec, nil, engine, vm.Config{}, nil)
	if err != nil {
		return err
	}
	defer chain.Stop()

	// Import the blocks.
	for i, b := range t.json.Blocks {
		block, err := b.makeBlock(chain)
		if err != nil {
			return fmt.Errorf("block %d: cannot make block: %v", i, err)
		}
		// ... (logic to handle expected exceptions and results) ...
		_, err = chain.InsertChain(types.Blocks{block})

		// ... (error handling) ...
	}

	// Check the last block hash.
	if t.json.LastBlockHash != (common.Hash{}) {
		if h := chain.CurrentBlock().Hash(); h != t.json.LastBlockHash {
			return fmt.Errorf("last block hash mismatch: got %x, want %x", h, t.json.LastBlockHash)
		}
	}
	// Check the post state.
	if t.json.PostState != nil {
		post, _ := chain.State()
		if err := t.json.PostState.check(post); err != nil {
			return err
		}
	}
	if t.json.PostStateRoot != (common.Hash{}) {
		s, _ := chain.State()
		if root := s.IntermediateRoot(chain.Config().IsEIP158(chain.CurrentBlock().Number())); root != t.json.PostStateRoot {
			return fmt.Errorf("post state root mismatch: got %x, want %x", root, t.json.PostStateRoot)
		}
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// ...

// ApplyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment. It returns the receipt
// for the transaction, gas used and an error if the transaction failed,
// indicating the block was invalid.
func ApplyTransaction(evm *vm.EVM, gp *GasPool, statedb *state.StateDB, header *types.Header, tx *types.Transaction, usedGas *uint64) (*types.Receipt, error) {
	msg, err := TransactionToMessage(tx, types.MakeSigner(evm.ChainConfig(), header.Number, header.Time), header.BaseFee)
	if err != nil {
		return nil, err
	}
	// Create a new context to be used in the EVM environment
	return ApplyTransactionWithEVM(msg, gp, statedb, header.Number, header.Hash(), header.Time, tx, usedGas, evm)
}

// ApplyTransactionWithEVM attempts to apply a transaction to the given state database
// and uses the input parameters for its environment similar to ApplyTransaction. However,
// this method takes an already created EVM instance as input.
func ApplyTransactionWithEVM(msg *Message, gp *GasPool, statedb *state.StateDB, blockNumber *big.Int, blockHash common.Hash, blockTime uint64, tx *types.Transaction, usedGas *uint64, evm *vm.EVM) (receipt *types.Receipt, err error) {
	// ... (tracing hooks) ...

	// Apply the transaction to the current state (included in the env).
	result, err := ApplyMessage(evm, msg, gp)
	if err != nil {
		return nil, err
	}
	// Update the state with pending changes.
	var root []byte
	if evm.ChainConfig().IsByzantium(blockNumber) {
		evm.StateDB.Finalise(true)
	} else {
		root = statedb.IntermediateRoot(evm.ChainConfig().IsEIP158(blockNumber)).Bytes()
	}
	*usedGas += result.UsedGas

	// ... (access list merge logic) ...

	return MakeReceipt(evm, result, statedb, blockNumber, blockHash, blockTime, tx, *usedGas, root), nil
}

// MakeReceipt generates the receipt object for a transaction given its execution result.
func MakeReceipt(evm *vm.EVM, result *ExecutionResult, statedb *state.StateDB, blockNumber *big.Int, blockHash common.Hash, blockTime uint64, tx *types.Transaction, usedGas uint64, root []byte) *types.Receipt {
	// Create a new receipt for the transaction, storing the intermediate root and gas used
	// by the tx.
	receipt := &types.Receipt{Type: tx.Type(), PostState: root, CumulativeGasUsed: usedGas}
	if result.Failed() {
		receipt.Status = types.ReceiptStatusFailed
	} else {
		receipt.Status = types.ReceiptStatusSuccessful
	}
	receipt.TxHash = tx.Hash()
	receipt.GasUsed = result.UsedGas
	
	// ... (blob tx fields) ...

	// If the transaction created a contract, store the creation address in the receipt.
	if tx.To() == nil {
		receipt.ContractAddress = crypto.CreateAddress(evm.TxContext.Origin, tx.Nonce())
	}

	// Set the receipt logs and create the bloom filter.
	receipt.Logs = statedb.GetLogs(tx.Hash(), blockNumber.Uint64(), blockHash, blockTime)
	receipt.Bloom = types.CreateBloom(receipt)
	receipt.BlockHash = blockHash
	receipt.BlockNumber = blockNumber
	receipt.TransactionIndex = uint(statedb.TxIndex())
	return receipt
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/transaction_test.go">
```go
package tests

import (
	"encoding/json"
	"math/big"
	"os"
	"regexp"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
)

// TransactionTest is the struct that contains a single transaction test.
type TransactionTest struct {
	json ttJSON
}

type ttJSON struct {
	Result    map[string]ttResult `json:"result"`
	TxBytes   string              `json:"txbytes"`
	Tr        ttTransaction       `json:"transaction"`
	Network   string              `json:"network"`
	Skip      string              `json:"skip"`
	SkipSince string              `json:"skipSince"`
}

type ttTransaction struct {
	Nonce                hexutil.Uint64   `json:"nonce"`
	Value                *hexutil.Big     `json:"value"`
	To                   *common.Address  `json:"to"`
	Data                 string           `json:"data"`
	GasLimit             hexutil.Uint64   `json:"gasLimit"`
	GasPrice             *hexutil.Big     `json:"gasPrice"`
	V                    *hexutil.Big     `json:"v"`
	R                    *hexutil.Big     `json:"r"`
	S                    *hexutil.Big     `json:"s"`
	AccessList           *types.AccessList  `json:"accessList"` // Note this is 'accessList' not 'accessLists'
	GasFeeCap            *hexutil.Big     `json:"maxFeePerGas"`
	GasTipCap            *hexutil.Big     `json:"maxPriorityFeePerGas"`
	BlobFeeCap           *hexutil.Big     `json:"maxFeePerBlobGas"`
	BlobHashes           []common.Hash    `json:"blobVersionedHashes"`
	SetCodeAuthorizations *[]types.SetCodeAuthorization `json:"authorizationList"`
}

type ttResult struct {
	Sender         *common.Address `json:"sender"`
	IntrinsicGas   *hexutil.Uint64 `json:"intrinsicGas"`
	Hash           *common.Hash    `json:"hash"`
	ExecptionError *string         `json:"exception"`
}

// Run executes the test and returns an error if it fails.
func (t *TransactionTest) Run(fork string) error {
	chainConfig, _, err := GetChainConfig(t.json.Network)
	if err != nil {
		return err
	}
	// By default, test assumes we're on the latest revision.
	// Exceptions are handled in the test json itself.
	if t.json.SkipSince != "" {
		if CompareFork(t.json.SkipSince, fork) <= 0 {
			return nil
		}
	}
	result, ok := t.json.Result[fork]
	if !ok {
		return nil
	}

	// This is kind of ugly, because unmarshalling to a transaction
	// automatically performs sender-derivation, which is part of what we want to test.
	// Therefore, we unmarshal into a temporary struct.
	var tx *types.Transaction
	var rlpBytes []byte

	// If transaction bytes provided, decode those, otherwise unmarshal and encode
	if len(t.json.TxBytes) > 0 {
		rlpBytes = common.FromHex(t.json.TxBytes)
		if err = rlp.DecodeBytes(rlpBytes, &tx); err != nil {
			if result.ExecptionError != nil {
				return nil
			}
			return err
		}
	} else {
		//... (logic to build tx from ttTransaction struct) ...
		tx = types.NewTx(txdata)
	}

	// Now check if it's supposed to fail
	if result.ExecptionError != nil {
		_, err = tx.Cost()
		if err == nil {
			err = types.VerifyTxSanity(tx, chainConfig, 0)
		}
		if err == nil {
			return fmt.Errorf("expected error, got none")
		}
		// TODO: verify error message
		return nil
	}
	// Check sender
	var signer types.Signer
	if tx.Type() == types.LegacyTxType && !tx.Protected() {
		// Frontier/homestead tx
		signer = types.HomesteadSigner{}
	} else {
		signer = types.MakeSigner(chainConfig, new(big.Int), 0)
	}
	sender, err := types.Sender(signer, tx)
	if err != nil {
		return err
	}
	if result.Sender != nil && *result.Sender != sender {
		return fmt.Errorf("sender mismatch: want %x, got %x", *result.Sender, sender)
	}
	// Check intrinsic gas
	gas, err := core.IntrinsicGas(tx.Data(), tx.AccessList(), tx.SetCodeAuthorizations(), tx.To() == nil, true, true, true)
	if err != nil {
		return err
	}
	if result.IntrinsicGas != nil && uint64(*result.IntrinsicGas) != gas {
		return fmt.Errorf("intrinsic gas mismatch: want %d, got %d", *result.IntrinsicGas, gas)
	}
	// Check hash
	if result.Hash != nil && *result.Hash != tx.Hash() {
		return fmt.Errorf("tx hash mismatch: want %x, got %x", *result.Hash, tx.Hash())
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/genesis.go">
```go
package core

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.com/ethereum/go-ethereum/internal/debug"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/trie"
	"github.com/ethereum/go-ethereum/triedb"
	"github.com/holiman/uint256"
)

var errGenesisNoConfig = errors.New("genesis has no chain configuration")

// Genesis specifies the header fields, alloc account and other genesis-related
// parameters for a given chain.
type Genesis struct {
	Config     *params.ChainConfig `json:"config"`
	Nonce      uint64              `json:"nonce"`
	Timestamp  uint64              `json:"timestamp"`
	ExtraData  []byte              `json:"extraData"`
	GasLimit   uint64              `json:"gasLimit"   gencodec:"required"`
	Difficulty *big.Int            `json:"difficulty" gencodec:"required"`
	Mixhash    common.Hash         `json:"mixHash"`
	Coinbase   common.Address      `json:"coinbase"`
	Alloc      types.GenesisAlloc  `json:"alloc"      gencodec:"required"`

	// These fields are used for consensus tests. Please don't use them
	// in production.
	Number     uint64      `json:"number"`
	GasUsed    uint64      `json:"gasUsed"`
	ParentHash common.Hash `json:"parentHash"`

	// EIP-1559 fields
	BaseFee *big.Int `json:"baseFeePerGas"`

	// EIP-3675 fields
	ExcessBlobGas *uint64 `json:"excessBlobGas"`
}

// ...

// Commit writes the block and state of a genesis specification to the database.
// The block is committed as the canonical head block.
func (g *Genesis) Commit(db ethdb.Database, tdb *triedb.Database) (*types.Block, error) {
	// The verkle trie requires a different method for initial state construction.
	if tdb.IsVerkle() {
		return g.commitVerkle(db, tdb)
	}

	statedb, err := state.New(common.Hash{}, state.NewDatabase(tdb), nil)
	if err != nil {
		return nil, err
	}
	for addr, account := range g.Alloc {
		if account.Balance != nil {
			statedb.AddBalance(addr, uint256.MustFromBig(account.Balance), tracing.BalanceChangeGenesisBalance)
		}
		if len(account.Code) > 0 {
			statedb.SetCode(addr, account.Code)
		}
		if account.Nonce > 0 {
			statedb.SetNonce(addr, account.Nonce, tracing.NonceChangeGenesis)
		}
		for key, value := range account.Storage {
			statedb.SetState(addr, key, value)
		}
	}
	// Write the state to the database.
	root, err := statedb.Commit(0, false, false)
	if err != nil {
		return nil, err
	}
	head := g.ToBlock()
	if head.Root() != root {
		head = g.ToBlockWithRoot(root)
	}
	// Write the states to the database.
	if err := rawdb.WriteBlock(db, head); err != nil {
		return nil, err
	}
	if err := rawdb.WriteCanonicalHash(db, head.Hash(), head.NumberU64()); err != nil {
		return nil, err
	}
	if err := rawdb.WriteHeadBlockHash(db, head.Hash()); err != nil {
		return nil, err
	}
	if err := rawdb.WriteHeadHeaderHash(db, head.Hash()); err != nil {
		return nil, err
	}
	if err := rawdb.WriteHeadFastBlockHash(db, head.Hash()); err != nil {
		return nil, err
	}
	if err := rawdb.WriteFinalizedBlockHash(db, head.Hash()); err != nil {
		return nil, err
	}
	if err := rawdb.WriteGenesisStateSpec(db, head.Hash(), g.MarshalJSON()); err != nil {
		return nil, err
	}
	if err := WriteChainConfig(db, head.Hash(), g.Config); err != nil {
		return nil, err
	}
	return head, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is well-written and the Zig struct definitions are a very close match to what `go-ethereum` uses internally. The only minor point is the naming of fields in `TestTransaction`, which can vary slightly depending on the transaction type being tested (e.g., `gasPrice` vs. `maxFeePerGas`). The provided Geth snippets should make this clear. The structure and logic requested are a solid foundation for building a compliant EVM test runner.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test.go">
```go
// StateTest are the state tests from the ethereum/tests repo.
type StateTest struct {
	json stJSON
}

// stJSON is the JSON structure of a state test.
type stJSON struct {
	Env         stEnv                           `json:"env"`
	Pre         core.GenesisAlloc               `json:"pre"`
	Transaction stTransaction                   `json:"transaction"`
	Post        map[string][]stPostState        `json:"post"`
	Out         string                          `json:"out"`
	Gas         string                          `json:"gas"`
	Logs        string                          `json:"logs"`
	TxBytes     string                          `json:"txbytes"`
	d           stFork                          `json:"-"`
	TestFile    string                          `json:"-"`
	TestName    string                          `json:"-"`
	PostLogs    map[string]common.Hash          `json:"postLogs"` // postlogs are only in BlockchainTests
	expectingEx map[string]stExpectPostStateErr `json:"expectException"`
}

// stEnv is the environment of a state test.
type stEnv struct {
	Coinbase        common.Address `json:"currentCoinbase"`
	Difficulty      *big.Int       `json:"currentDifficulty"`
	GasLimit        uint64         `json:"currentGasLimit"`
	Number          uint64         `json:"currentNumber"`
	Timestamp       uint64         `json:"currentTimestamp"`
	BaseFee         *big.Int       `json:"currentBaseFee"`
	Random          *common.Hash   `json:"currentRandom"`
	WithdrawalsRoot *common.Hash   `json:"currentWithdrawalsRoot"`

	// EIP-4844 fields
	BlobBaseFee         *big.Int `json:"currentBlobBaseFee"`
	ExcessBlobGas       *uint64  `json:"currentExcessBlobGas"`
	ParentBeaconRoot    *common.Hash
	ParentBlobGasUsed   *uint64 `json:"parentBlobGasUsed"`
	ParentExcessBlobGas *uint64 `json:"parentExcessBlobGas"`
}

// stTransaction is the transaction of a state test.
type stTransaction struct {
	GasLimit      []uint64
	GasPrice      *big.Int
	Nonce         uint64
	To            *common.Address
	Data          [][]byte
	Value         []string
	AccessList    *types.AccessList `json:"accessLists"` // Note: name is 'accessLists' not 'accessList'
	secretKey     *ecdsa.PrivateKey `json:"-"`           // - is used to ignore this field
	sender        common.Address    `json:"-"`           // - is used to ignore this field
	v, r, s       *big.Int
	gasFeeCap     *big.Int
	gasTipCap     *big.Int
	blobVersionedHashes []common.Hash
	blobFeeCap    *big.Int
}

// stPostState is the expected post-state of a state test.
type stPostState struct {
	Root common.Hash
	Logs common.Hash
	// For some tests, only a subset of accounts is given. The integer indicates how many accounts to check
	Indexes stPostStateIndexes
}

// stPostStateIndexes is the indexes of the post state accounts to check
type stPostStateIndexes struct {
	Data  int `json:"data"`
	Gas   int `json:"gas"`
	Value int `json:"value"`
}

// Run executes the state test.
func (st *StateTest) Run(t testing.TB, rules params.Rules, vmconfig vm.Config, snapshot bool) {
	// Create the pristine state database and instantiate the EVM
	statedb := makeTestState(st.json.Pre)
	if rules.IsCancun {
		// EIP-7516: BLOBBASEFEE opcode
		// When the block is the genesis block, the value of the blob base fee is the initial value.
		if st.json.Env.Number == 0 {
			st.json.Env.BlobBaseFee = new(big.Int).SetUint64(params.InitialBlobBaseFee)
		}
	}
	evm := st.newEVM(statedb, rules, vmconfig)
	if snapshot {
		evm.StateDB.Finalise(false)
	}

	// Apply the transaction and save any error to check against the expected one
	sender := st.json.Transaction.sender
	tx := st.json.Transaction.toTx(st.json.d, evm.ChainConfig())
	msg, err := tx.AsMessage(st.signer(evm.ChainConfig()), evm.Context.BaseFee, evm.Context.BlobBaseFee)
	if err != nil {
		t.Fatalf("invalid tx: %v", err)
	}
	// The st state tests use the tx gas limit as the gas pool.
	gaspool := new(core.GasPool).AddGas(tx.Gas())
	result, err := core.ApplyMessage(evm, msg, gaspool)
	if err != nil {
		t.Fatalf("could not apply message: %v", err)
	}

	// Check post-conditions.
	st.checkPost(t, rules, statedb, tx, result.ReturnData)
	if snapshot {
		st.checkSnapPost(t, statedb, evm)
	}
}

func (st *StateTest) checkPost(t testing.TB, rules params.Rules, sdb *state.StateDB, tx *types.Transaction, returnData []byte) {
	// Check the post state.
	if want, exist := st.json.Post[st.json.d.String()]; exist {
		indexes := want[0].Indexes
		if st.json.d.dataIdx > len(st.json.Transaction.Data) {
			st.json.d.dataIdx = 0
		}
		if st.json.d.gasIdx > len(st.json.Transaction.GasLimit) {
			st.json.d.gasIdx = 0
		}
		if st.json.d.valueIdx > len(st.json.Transaction.Value) {
			st.json.d.valueIdx = 0
		}
		if indexes.Data > 0 {
			st.json.d.dataIdx = indexes.Data
		}
		if indexes.Gas > 0 {
			st.json.d.gasIdx = indexes.Gas
		}
		if indexes.Value > 0 {
			st.json.d.valueIdx = indexes.Value
		}
		// The post sections might not be in order so we need to find the correct one.
		found := false
		for i := 0; i < len(want); i++ {
			if st.json.d.dataIdx == want[i].Indexes.Data &&
				st.json.d.gasIdx == want[i].Indexes.Gas &&
				st.json.d.valueIdx == want[i].Indexes.Value {
				st.json.d.postIdx = i
				found = true
				break
			}
		}
		// Some tests have no post state for certain forks.
		if !found {
			t.Logf("no post state for fork %q, skipping", st.json.d)
			return
		}

		// Check the state root.
		root := sdb.IntermediateRoot(rules.IsEIP158)
		if wantRoot := want[st.json.d.postIdx].Root; root != wantRoot {
			t.Errorf("state root mismatch: got %x, want %x", root, wantRoot)
		}

		// Check the log hash.
		if logs, ok := st.json.PostLogs[st.json.d.String()]; ok {
			logHash := types.DeriveSha(types.Receipts{{Logs: sdb.Logs()}}, newTestHasher())
			if logs != logHash {
				t.Errorf("log hash mismatch: got %x, want %x", logHash, logs)
			}
		} else if want := want[st.json.d.postIdx].Logs; want != (common.Hash{}) {
			// Some tests don't have a logs hash, but the test vectors do.
			// The only test that has a logs hash is when the logs hash is all zeroes.
			logHash := types.DeriveSha(types.Receipts{{Logs: sdb.Logs()}}, newTestHasher())
			if want != logHash {
				t.Errorf("log hash mismatch: got %x, want %x", logHash, want)
			}
		}
	} else if out := st.json.Out; len(out) > 0 {
		// These are tests that result in an exception.
		// The transaction should not be included in the block.
		if len(sdb.Logs()) > 0 {
			t.Error("logs were created during failing transaction")
		}
		if !bytes.Equal(common.FromHex(out), returnData) {
			t.Errorf("output mismatch: got %x, want %x", returnData, common.FromHex(out))
		}
	}
}

// makeTestState creates a new state database from a genesis allocation.
func makeTestState(alloc core.GenesisAlloc) *state.StateDB {
	sdb, _ := state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	for addr, account := range alloc {
		sdb.SetNonce(addr, account.Nonce)
		sdb.SetBalance(addr, uint256.MustFromBig(account.Balance), tracing.BalanceChangeUnspecified)
		sdb.SetCode(addr, account.Code)
		for key, value := range account.Storage {
			sdb.SetState(addr, key, value)
		}
	}
	return sdb
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/bctest.go">
```go
// BlockchainTest is the struct that contains a single blockchain test.
type BlockchainTest struct {
	json btJSON
}

type btJSON struct {
	Name          string
	GenesisHeader *types.Header
	GenesisRLP    string `json:"genesisRLP"`
	Blocks        []btBlock
	LastBlockHash common.Hash
	Pre           core.GenesisAlloc
	PostState     *btPostState
	Network       string
	SealEngine    string
}

type btBlock struct {
	RLP string
	// The remaining fields are only used if RLP is empty.
	BlockHeader    *types.Header
	UncleHeaders   []*types.Header
	Transactions   []*types.Transaction
	Withdrawals    []*types.Withdrawal
	ExpectException string `json:"expectException"`
	expectException string `json:"expectexception"` // some tests have this instead
}

type btPostState struct {
	Root  common.Hash
	Logs  common.Hash
	State core.GenesisAlloc
}

// Run executes the test and checks the post state.
func (t *BlockchainTest) Run(engine consensus.Engine, newEVM func(core.ChainContext, vm.StateDB, *params.ChainConfig, vm.Config) *vm.EVM, snapshot bool) error {
	var (
		config = t.config()
		db     = rawdb.NewMemoryDatabase()
	)
	// Create the blockchain.
	gspec := &core.Genesis{
		Config:     config,
		Nonce:      t.json.GenesisHeader.Nonce.Uint64(),
		Timestamp:  t.json.GenesisHeader.Time,
		ExtraData:  t.json.GenesisHeader.Extra,
		GasLimit:   t.json.GenesisHeader.GasLimit,
		Difficulty: t.json.GenesisHeader.Difficulty,
		Mixhash:    t.json.GenesisHeader.MixDigest,
		Coinbase:   t.json.GenesisHeader.Coinbase,
		Alloc:      t.json.Pre,
		Number:     t.json.GenesisHeader.Number.Uint64(),
		GasUsed:    t.json.GenesisHeader.GasUsed,
		ParentHash: t.json.GenesisHeader.ParentHash,
		BaseFee:    t.json.GenesisHeader.BaseFee,
	}
	genesis := gspec.ToBlock()

	chain, err := core.NewBlockChain(db, nil, gspec, engine, newEVM, vm.Config{}, nil)
	if err != nil {
		return fmt.Errorf("can't create new chain: %w", err)
	}
	defer chain.Stop()

	// Process blocks, checking intermediate state transitions.
	for i, b := range t.json.Blocks {
		block, err := b.makeBlock(chain.Config())
		if err != nil {
			return fmt.Errorf("block %d invalid: %w", i+1, err)
		}
		// Process the block and check for validation errors.
		err = t.addResult(chain, block, b.shouldFail())
		if err != nil {
			return fmt.Errorf("block %d: %w", i+1, err)
		}
	}

	// Check the post state.
	if err := t.checkPostState(chain.StateCache(), chain.CurrentBlock().Header(), db); err != nil {
		return err
	}

	// Ensure the last block hash is correct.
	if h := chain.CurrentBlock().Hash(); h != t.json.LastBlockHash {
		return fmt.Errorf("last block hash mismatch: got %x, want %x", h, t.json.LastBlockHash)
	}
	// Check snapshot tree if enabled.
	if snapshot {
		return t.checkSnapTree(db, genesis)
	}
	return nil
}

// addResult attempts to add a block to the chain. It returns an error if the result
// of the import is not what is expected by the test.
func (t *BlockchainTest) addResult(chain *core.BlockChain, block *types.Block, shouldFail bool) error {
	var (
		err     error
		verr    error
		receipt *types.Receipt
	)
	if !shouldFail {
		// Block should be accepted.
		var receipts []*types.Receipt
		receipts, err = chain.Engine().VerifyUncles(chain, block)
		if err == nil {
			_, verr = chain.InsertBlockWithoutSetHead(block, true)
		}
		if verr != nil {
			return fmt.Errorf("unexpected error inserting block: %v", verr)
...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/transaction_test.go">
```go
// TransactionTest is the struct that contains a single transaction test.
type TransactionTest struct {
	json ttJSON
}

type ttJSON struct {
	Name       string
	RLP        string // rlp of the transaction
	Byzantium  ttResult
	Constantinople ttResult
	EIP150     ttResult
	EIP158     ttResult
	Frontier   ttResult
	Homestead  ttResult
	Istanbul   ttResult
	Berlin     ttResult
	London     ttResult
	Merge      ttResult
	Shanghai   ttResult
	Cancun     ttResult
	Prague     ttResult
}

type ttResult struct {
	Sender          common.Address `json:"sender"`
	Hash            common.Hash    `json:"hash"`
	IntrinsicGas    string         `json:"intrinsicGas"`
	Exception       string         `json:"exception"`
	expectException string         `json:"expectException"` // some tests have this instead
}

// Run executes the transaction test.
func (t *TransactionTest) Run(fork Fork) error {
	result := t.result(fork)
	if result == nil {
		// This fork is not tested.
		return nil
	}
	if result.shouldSkip() {
		// The test is invalid for this fork.
		return nil
	}

	// Decode the transaction from RLP.
	data, err := hex.DecodeString(t.json.RLP[2:])
	if err != nil {
		return fmt.Errorf("invalid RLP: %v", err)
	}
	tx := new(types.Transaction)
	if err := rlp.DecodeBytes(data, tx); err != nil {
		if result.Exception == "" {
			return fmt.Errorf("RLP decoding failed: %v", err)
		}
		return nil // RLP error is expected.
	}

	// The transaction is valid if the sender can be derived.
	var signer types.Signer
	switch {
	case fork >= Prague:
		signer = types.MakeSigner(params.TestChainConfig, big.NewInt(0), 1)
	case fork >= London:
		signer = types.MakeSigner(params.TestChainConfig, big.NewInt(0), 0)
	default:
		signer = types.MakeSigner(params.TestChainConfig, big.NewInt(0), 0)
	}

	// Validate the transaction and check for errors.
	sender, err := types.Sender(signer, tx)
	if err != nil {
		if result.Exception == "" {
			return fmt.Errorf("sender derivation failed: %v", err)
		}
		// TODO: check exception name.
		return nil
	}

	// Sender and hash must match.
	if sender != result.Sender {
		return fmt.Errorf("sender mismatch: got %v, want %v", sender, result.Sender)
	}
	if tx.Hash() != result.Hash {
		return fmt.Errorf("hash mismatch: got %v, want %v", tx.Hash(), result.Hash)
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	evm.SetTxContext(NewEVMTxContext(msg))
	return newStateTransition(evm, msg, gp).execute()
}

// execute will transition the state by applying the current message and
// returning the evm execution result with following fields.
// ...
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// First check this message satisfies all consensus rules before
	// applying the message.
	// ...
	if err := st.preCheck(); err != nil {
		return nil, err
	}

	var (
		msg              = st.msg
		rules            = st.evm.ChainConfig().Rules(st.evm.Context.BlockNumber, st.evm.Context.Random != nil, st.evm.Context.Time)
		contractCreation = msg.To == nil
		floorDataGas     uint64
	)

	// Check clauses 4-5, subtract intrinsic gas if everything is correct
	gas, err := IntrinsicGas(msg.Data, msg.AccessList, msg.SetCodeAuthorizations, contractCreation, rules.IsHomestead, rules.IsIstanbul, rules.IsShanghai)
	if err != nil {
		return nil, err
	}
	if st.gasRemaining < gas {
		return nil, fmt.Errorf("%w: have %d, want %d", ErrIntrinsicGas, st.gasRemaining, gas)
	}
    // ... more checks
	st.gasRemaining -= gas

	// Check clause 6
	value, overflow := uint256.FromBig(msg.Value)
	if overflow {
		return nil, fmt.Errorf("%w: address %v", ErrInsufficientFundsForTransfer, msg.From.Hex())
	}
	if !value.IsZero() && !st.evm.Context.CanTransfer(st.state, msg.From, value) {
		return nil, fmt.Errorf("%w: address %v", ErrInsufficientFundsForTransfer, msg.From.Hex())
	}
    // ...

	// Execute the preparatory steps for state transition which includes:
	// - prepare accessList(post-berlin)
	// - reset transient storage(eip 1153)
	st.state.Prepare(rules, msg.From, st.evm.Context.Coinbase, msg.To, vm.ActivePrecompiles(rules), msg.AccessList)

	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not assigned to err
	)
	if contractCreation {
		ret, _, st.gasRemaining, vmerr = st.evm.Create(msg.From, msg.Data, st.gasRemaining, value)
	} else {
		// Increment the nonce for the next transaction.
		st.state.SetNonce(msg.From, st.state.GetNonce(msg.From)+1, tracing.NonceChangeEoACall)
        // ...
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// Record the gas used excluding gas refunds. This value represents the actual
	// gas allowance required to complete execution.
	peakGasUsed := st.gasUsed()

	// Compute refund counter, capped to a refund quotient.
	st.gasRemaining += st.calcRefund()
    // ...
	st.returnGas()

    // ... transfer fees to coinbase
	
	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/genesis.go">
```go
// Genesis specifies the header fields, starting allocation of ether and initial state
// of a new block chain.
type Genesis struct {
	Config     *params.ChainConfig `json:"config"`
	Nonce      uint64              `json:"nonce"`
	Timestamp  uint64              `json:"timestamp"`
	ExtraData  []byte              `json:"extraData"`
	GasLimit   uint64              `json:"gasLimit"   gencodec:"required"`
	Difficulty *big.Int            `json:"difficulty" gencodec:"required"`
	Mixhash    common.Hash         `json:"mixHash"`
	Coinbase   common.Address      `json:"coinbase"`
	Alloc      GenesisAlloc        `json:"alloc"      gencodec:"required"`

	// These fields are used for consensus tests. Please don't use them
	// in production.
	Number     uint64      `json:"number"`
	GasUsed    uint64      `json:"gasUsed"`
	ParentHash common.Hash `json:"parentHash"`

	// These fields are used for EIP-1559.
	BaseFee *big.Int `json:"baseFeePerGas"`

	// These fields are used for EIP-4844.
	ExcessBlobGas *uint64 `json:"excessBlobGas"`
	BlobGasUsed   *uint64 `json:"blobGasUsed"`
}

// GenesisAlloc specifies the initial state that is part of the genesis block.
type GenesisAlloc map[common.Address]Account

// Account is the Ethereum consensus representation of accounts.
// These objects are stored in the state database and are used by the public
// interface. These objects should be considered immutable and left untouched.
type Account struct {
	Code    []byte
	Storage map[common.Hash]common.Hash
	Balance *big.Int
	Nonce   uint64
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		TxContext:   txCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		Config:      vmConfig,
		interpreter: NewInterpreter(chainConfig, vmConfig),
	}
	return evm
}

// Call executes the contract associated with the destination address. It is a
// convenience wrapper around the EVM's run method to allow for running queries
// against the state database. Do not use this method to execute transactions,
// instead use state_processor.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the legacy gas limit
	if gas > params.MaxGasLimit {
		return nil, gas, ErrGasLimitReached
	}
	// Make sure the caller has enough balance to send the value.
	// This should be done by the caller, but this is a cheap check and will
	// be ugly if it causes a problem later on.
	if !value.IsZero() {
		if evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
			evm.StateDB.Transfer(caller.Address(), addr, value, BalanceChangeContractCall)
		} else {
			return nil, gas, ErrInsufficientBalance
		}
	}
	// Set up the internal state of the EVM.
	evm.reset(addr)
	evm.depth++

	var (
		to         = AccountRef(addr)
		snapshot   = evm.StateDB.Snapshot()
		code, data []byte
	)
	if evm.chainRules.IsEIP7702 && evm.StateDB.IsAuthorized(addr) {
		// EIP-7702: The 'to' address is authorized. Check for delegation.
		delegationAddr, ok := types.ParseDelegation(evm.StateDB.GetCode(addr))
		if ok {
			// Change call target to the delegation address.
			evm.interpreter.readOnly = false // For DELEGATECALL from a static context.
			leftOverGas, err = evm.DelegateCall(caller, to.Address(), delegationAddr, input, gas)
			return evm.interpreter.returnData, leftOverGas, err
		}
	} else if p := evm.precompile(addr); p != nil {
		// Handle precompiled contracts.
		data, leftOverGas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Handle regular contracts.
		code = evm.StateDB.GetCode(to.Address())
		if len(code) == 0 {
			data, leftOverGas, err = nil, gas, nil // no code, no error
		} else {
			data, leftOverGas, err = evm.interpreter.Run(NewContract(caller, to, value, gas), code, input, false)
		}
	}
	// When an error occurs, we revert the state.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			data = nil
		}
	}
	return data, leftOverGas, err
}

// Create executes a new contract creation transaction.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check for inner creates.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	// Fail if we're trying to execute above the legacy gas limit
	if gas > params.MaxGasLimit {
		return nil, common.Address{}, gas, ErrGasLimitReached
	}
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure the initialization code isn't too large
	if evm.chainRules.IsShanghai && len(code) > params.MaxInitCodeSize {
		return nil, common.Address{}, gas, ErrMaxInitCodeSizeExceeded
	}
	// We add this to the access list _before_ we create it. When we create a
	// contract, we're going to touch it's storage, and we need to account
	// for the `cold` SLOAD cost.
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1, NonceChangeContractCreation)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	evm.StateDB.AddAddressToAccessList(contractAddr)

	snapshot := evm.StateDB.Snapshot()

	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1, NonceChangeContractCreation) // EIP158.
	}
	evm.Context.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Set up the internal state of the EVM.
	evm.reset(contractAddr)
	evm.depth++

	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	ret, leftOverGas, err = evm.interpreter.Run(contract, code, nil, false)

	// Check whether the max code size has been exceeded, assign err if the case.
	if err == nil && evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// If the contract creation ran out of gas or errored, fail.
	// We have to distinguish between interpreter returning an error and an error
	// on the execution, e.g. if the returned code is too large.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			leftOverGas = 0
		}
		return nil, contractAddr, leftOverGas, err
	}
	// Otherwise, check the cost of the code and update the state.
	gasForCode := uint64(len(ret)) * params.CreateDataGas
	if leftOverGas < gasForCode {
		err = ErrCodeStoreOutOfGas
		evm.StateDB.RevertToSnapshot(snapshot)
		return nil, contractAddr, 0, err
	}
	leftOverGas -= gasForCode
	evm.StateDB.SetCode(contractAddr, ret)
	return ret, contractAddr, leftOverGas, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The provided prompt is excellent and very detailed. The breakdown into tasks and the Zig struct definitions are clear and map well to the concepts in `ethereum/tests`. No major corrections are needed.

A small suggestion for improvement would be to more explicitly model the concept of `ChainConfig` or `Rules` from Go-Ethereum. The `post` map in `StateTest` is keyed by fork name, which is a good start. However, Geth's approach of passing a `params.Rules` object to the test `Run` functions is a powerful pattern. This object encapsulates all fork-specific logic (e.g., `rules.IsBerlin`, `rules.IsLondon`), making it easy to switch between different sets of consensus rules. Adopting a similar `ChainRules` struct in Zig, as hinted by `run_blockchain_tests` needing a `network` field, would be a robust way to manage fork-dependent behavior in the test executor.

---

An analysis of the `go-ethereum` codebase, specifically the `tests` package, reveals a structure that is highly analogous to the one requested in the prompt. The following code snippets are the most relevant for implementing the consensus test suite runner.

### Key Learnings from `go-ethereum`
1.  **Test Fixture Structs**: Geth defines Go structs that directly map to the JSON test files (e.g., `StateTest`, `BlockchainTest`). These structs are the primary data containers for each test.
2.  **Fork-Specific Logic**: A crucial aspect is handling different Ethereum hard forks. The test runner dynamically creates `ChainConfig` and `Signer` objects based on the fork name specified in the test file (e.g., "Frontier", "Istanbul", "Berlin"). This determines which EIPs are active, affecting transaction validation, gas costs, and opcode behavior.
3.  **State Management**: The tests use a `state.StateDB` backed by an in-memory `triedb` to manage world state. The `pre` state is applied by directly calling methods like `statedb.SetBalance`, `statedb.SetNonce`, `statedb.SetCode`, and `statedb.SetState`.
4.  **Execution and Validation**:
    *   **State Tests**: A `vm.EVM` instance is created with the correct context (from the `env` section) and `StateDB`. The transaction is executed via `evm.Call` or `evm.Create`, and the resulting state (world root, logs hash) is compared against the `post` section.
    *   **Blockchain Tests**: A `core.BlockChain` object is instantiated. It starts with a genesis block derived from the test's `genesisBlockHeader` and `pre` state. It then iteratively processes each block in the `blocks` array, handling both valid blocks and expected exceptions. Finally, it validates the world state against the `postState` field.
    *   **Transaction Tests**: These tests focus on transaction validity before execution. They parse the RLP-encoded transaction and use the appropriate `Signer` for the given fork to derive the sender's address and transaction hash, comparing them against expected values.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/init.go">
```go
// This file contains the test-runner logic for the consensus tests.

// testRunner is a test runner which can execute a single test case.
type testRunner struct {
	basedir string
	skip    map[string]struct{}
	// contains filtered tests.
	// The key indicates the test name and value is the list of selected sub-tests.
	// If the list of selected sub-tests is nil, it means all sub-tests will be
	// executed.
	filters map[string][]string
}

// run is the main entry point for the test runner.
// It executes a single test case from a given path.
func (tr *testRunner) run(path string, t *testing.T) {
	// ... (code for skipping tests) ...

	// All test files are loaded as JSON.
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("Failed to read test file: %v", err)
	}

	// Dispatch the test to the correct handler based on its type.
	switch {
	case strings.Contains(path, "GeneralStateTests"):
		var tests map[string]StateTest
		if err := json.Unmarshal(data, &tests); err != nil {
			t.Fatalf("Failed to unmarshal state test: %v", err)
		}
		for name, test := range tests {
			// ... (code for filtering sub-tests) ...
			test.Run(name, t)
		}

	case strings.Contains(path, "BlockchainTests"):
		var tests map[string]BlockchainTest
		if err := json.Unmarshal(data, &tests); err != nil {
			t.Fatalf("Failed to unmarshal blockchain test: %v", err)
		}
		for name, test := range tests {
			// ... (code for filtering sub-tests) ...
			test.Run(name, t)
		}

	case strings.Contains(path, "TransactionTests"):
		var tests map[string]TransactionTest
		if err := json.Unmarshal(data, &tests); err != nil {
			t.Fatalf("Failed to unmarshal transaction test: %v", err)
		}
		for name, test := range tests {
			// ... (code for filtering sub-tests) ...
			test.Run(name, t)
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/statetest.go">
```go
// StateTest are tests that check the execution of a single transaction.
type StateTest struct {
	json stJSON
}

// stJSON is the JSON structure of a state test.
type stJSON struct {
	Env         stEnv                      `json:"env"`
	Pre         core.GenesisAlloc          `json:"pre"`
	Transaction stTransaction              `json:"transaction"`
	Post        map[string][]stPostState   `json:"post"`
	Out         *hexutil.Bytes             `json:"out"`
	Gas         *hexutil.Uint64            `json:"gas"`
	Logs        *common.Hash               `json:"logs"`
	TxBytes     *hexutil.Bytes             `json:"txbytes"`
	Expect      []stExpect                 `json:"expect"`
	PostState   map[common.Address]*Account `json:"postState"` // for VM tests
	TxHash      *common.Hash               `json:"txHash"`      // for VM tests
}

// stEnv is the environment of a state test.
type stEnv struct {
	Coinbase            common.Address `json:"currentCoinbase"`
	Difficulty          *big.Int       `json:"currentDifficulty"`
	GasLimit            uint64         `json:"currentGasLimit"`
	Number              uint64         `json:"currentNumber"`
	Timestamp           uint64         `json:"currentTimestamp"`
	BaseFee             *big.Int       `json:"currentBaseFee"`
	Random              *common.Hash   `json:"currentRandom"`
	ExcessBlobGas       *uint64        `json:"currentExcessBlobGas"`
	BlobBaseFee         *big.Int       `json:"currentBlobBaseFee"`
	ParentBeaconRoot    *common.Hash   `json:"parentBeaconBlockRoot"`
	WithdrawalsRoot     *common.Hash   `json:"withdrawalsRoot"`
	ParentExcessBlobGas *uint64        `json:"parentExcessBlobGas"`
	ParentBlobGasUsed   *uint64        `json:"parentBlobGasUsed"`
}

// stTransaction is the transaction of a state test.
type stTransaction struct {
	Data                []stCallData   `json:"data"`
	GasLimit            []uint64       `json:"gasLimit"`
	Value               []string       `json:"value"`
	GasPrice            *big.Int       `json:"gasPrice"`
	Nonce               uint64         `json:"nonce"`
	To                  common.Address `json:"to"`
	Sender              common.Address `json:"sender"`
	SecretKey           crypto.Plain    `json:"secretKey"`
	Type                hexutil.Uint64 `json:"type"`
	MaxFeePerGas        *big.Int       `json:"maxFeePerGas"`
	MaxPriorityFeePerGas *big.Int       `json:"maxPriorityFeePerGas"`
	MaxFeePerBlobGas    *big.Int       `json:"maxFeePerBlobGas"`
	BlobVersionedHashes []common.Hash  `json:"blobVersionedHashes"`
	AccessLists         []*types.AccessList `json:"accessLists"`
	BlobGasUsed         *hexutil.Uint64 `json:"blobGasUsed"`
}

// stPostState is the expected post-state of a state test.
type stPostState struct {
	Root common.Hash `json:"hash"`
	Logs common.Hash `json:"logs"`
}

// Run executes the state test.
func (st *StateTest) Run(name string, t *testing.T) {
	for fork, postStates := range st.json.Post {
		// ... (code to skip forks) ...

		// Create a new test case for every fork.
		t.Run(fork, func(t *testing.T) {
			// Get the chain config for the given fork.
			config, ok := Forks[fork]
			if !ok {
				t.Fatalf("config for fork %q not found", fork)
			}
			// Create the message for the transaction.
			msg, tx, err := st.json.Transaction.toMessage(config)
			if err != nil {
				t.Fatal(err)
			}
			// Create the EVM and statedb.
			statedb := makeTestStateDB(st.json.Pre)
			author := st.json.Env.Coinbase
			if config.IsLondon(st.json.Env.Number) {
				author = common.Address{} // London makes coinbase optional
			}
			context := core.NewEVMBlockContext(st.json.Env.toHeader(), testChain, &author)
			context.GetHash = vmTestBlockHash

			var withdrawals []*types.Withdrawal
			if config.IsShanghai(st.json.Env.Number) {
				withdrawals = make([]*types.Withdrawal, 0)
			}
			vmenv := vm.NewEVM(context, vm.TxContext{GasPrice: msg.GasPrice(), Origin: msg.From()}, statedb, config, vm.Config{})
			vmenv.WithWithdrawals(withdrawals)
			if config.IsCancun(st.json.Env.Number) {
				vmenv.WithBlobHashes(st.json.Transaction.BlobVersionedHashes)
			}

			// Apply the transaction to the state.
			result, err := core.ApplyMessage(vmenv, msg, new(core.GasPool).AddGas(msg.Gas()), true)
			if err != nil {
				t.Fatal("could not apply message: ", err)
			}
			// Check the post-state.
			for i, p := range postStates {
				if err := statedb.Commit(config.IsEIP158(vmenv.Context.BlockNumber)); err != nil {
					t.Fatalf("post #%d: commit error: %v", i, err)
				}
				root := statedb.IntermediateRoot(config.IsEIP158(vmenv.Context.BlockNumber))
				logs := types.LogsToHash(statedb.Logs())
				if root != p.Root {
					t.Errorf("post #%d root mismatch: got %x, want %x", i, root, p.Root)
				}
				if logs != p.Logs {
					t.Errorf("post #%d log hash mismatch: got %x, want %x", i, logs, p.Logs)
				}
				// ...
			}
		})
	}
}

// makeTestStateDB creates a new statedb with the given genesis allocation.
func makeTestStateDB(alloc core.GenesisAlloc) *state.StateDB {
	db := state.NewDatabase(rawdb.NewMemoryDatabase())
	statedb, _ := state.New(common.Hash{}, db, nil)
	for addr, account := range alloc {
		statedb.SetCode(addr, account.Code)
		statedb.SetNonce(addr, account.Nonce)
		statedb.SetBalance(addr, account.Balance)
		for key, value := range account.Storage {
			statedb.SetState(addr, key, value)
		}
	}
	return statedb
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/blocktest.go">
```go
// BlockchainTest are tests that check the validity of a blockchain.
type BlockchainTest struct {
	json btJSON
}

type btJSON struct {
	Blocks     []btBlock         `json:"blocks"`
	Genesis    btHeader          `json:"genesisBlockHeader"`
	Pre        core.GenesisAlloc `json:"pre"`
	Post       core.GenesisAlloc `json:"postState"`
	BestBlock  string            `json:"lastblockhash"`
	GenesisRLP hexutil.Bytes     `json:"genesisRLP"`
	Network    string            `json:"network"`
	SealEngine string            `json:"sealEngine"`
}

type btBlock struct {
	RLP            hexutil.Bytes     `json:"rlp"`
	Header         *btHeader         `json:"blockHeader"`
	Txs            []*btTransaction  `json:"transactions"`
	Uncles         []*btHeader       `json:"uncleHeaders"`
	Withdrawals    []*btWithdrawal   `json:"withdrawals"`
	Request        [][]hexutil.Bytes `json:"requests"`
	Blocknumber    string            `json:"blocknumber"` // some tests have this field...
	Invalid        bool              `json:"isInvalid"`
	ExpectException string           `json:"expectException"`
}

// Run executes the blockchain test.
func (bt *BlockchainTest) Run(name string, t *testing.T) {
	// ... (code to skip tests) ...

	config, ok := Forks[bt.json.Network]
	if !ok {
		t.Fatalf("config %q not found", bt.json.Network)
	}

	// Create genesis block and database.
	db := rawdb.NewMemoryDatabase()
	gspec := bt.json.toGenesis(config)
	genesis := gspec.MustCommit(db)

	// Create the blockchain.
	blockchain, _ := core.NewBlockChain(db, nil, gspec, nil, engine, vm.Config{}, nil)
	defer blockchain.Stop()

	// Insert all the blocks.
	var (
		allblocks []*types.Block
		lastHash  common.Hash
	)
	for i, b := range bt.json.Blocks {
		block, err := b.decode()
		if err != nil {
			t.Fatalf("block %d: could not be decoded: %v", i+1, err)
		}
		// ... (code to handle exceptions) ...

		_, err = blockchain.InsertChain([]*types.Block{block})
		// ... (code to check errors against expectations) ...

		allblocks = append(allblocks, block)
		lastHash = block.Hash()
	}

	// Check the final state.
	if len(bt.json.Post) > 0 {
		statedb, err := state.New(lastHash, blockchain.StateCache(), nil)
		if err != nil {
			t.Fatalf("could not create statedb: %v", err)
		}
		bt.json.validatePostState(t, statedb)
	}
}

// validatePostState checks that the given statedb matches the postState map.
func (btj *btJSON) validatePostState(t *testing.T, statedb *state.StateDB) {
	for addr, want := range btj.Post {
		// ... (code to check nonce, balance, code, and storage for each account) ...
	}
	// Check that there are no other accounts in the state.
	statedb.ForEachStorage(func(addr common.Address, account *state.Account) bool {
		if _, ok := btj.Post[addr]; !ok {
			t.Errorf("account %x in post-state but not in expectation", addr)
		}
		return true
	})
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/transaction_test.go">
```go
// TransactionTest checks the validity of a single transaction.
type TransactionTest struct {
	json ttJSON
}

type ttJSON struct {
	RLP    hexutil.Bytes            `json:"rlp"`
	Result map[string]ttResult `json:"result"`
}

type ttResult struct {
	Sender          common.Address `json:"sender"`
	Hash            common.Hash    `json:"hash"`
	IntrinsicGas    hexutil.Uint64 `json:"intrinsics"`
	UnsupportedFork bool           `json:"unsupportedFork,omitempty"`
	ExpEx           string         `json:"expectException,omitempty"`
}

// Run executes the transaction test.
func (tt *TransactionTest) Run(name string, t *testing.T) {
	for fork, result := range tt.json.Result {
		// ... (code to skip tests) ...

		t.Run(fork, func(t *testing.T) {
			// ... (code to handle unsupported forks) ...

			// Decode the transaction.
			var txval *types.Transaction
			err := rlp.DecodeBytes(tt.json.RLP, &txval)
			if err != nil {
				// The RLP is invalid, check if we expect that.
				if result.ExpEx != "" {
					return // Good, this is what we expect.
				}
				t.Fatalf("RLP decoding failed: %v", err)
			}
			// Get the chain config for the given fork.
			config, ok := Forks[fork]
			if !ok {
				t.Fatalf("config for fork %q not found", fork)
			}
			// For each fork, derive the sender and check it against the expected one.
			var signer types.Signer
			switch {
			case config.IsCancun(big.NewInt(0)):
				signer = types.NewCancunSigner(txval.ChainId())
			case config.IsShanghai(big.NewInt(0)):
				signer = types.NewShanghaiSigner(txval.ChainId())
			case config.IsLondon(big.NewInt(0)):
				signer = types.NewLondonSigner(txval.ChainId())
			// ... (other signers for older forks) ...
			default:
				signer = types.NewEIP155Signer(txval.ChainId())
			}
			sender, err := types.Sender(signer, txval)
			if err != nil {
				// Bad signature, check if we expect that.
				if result.ExpEx != "" {
					return
				}
				t.Fatalf("can't derive sender: %v", err)
			}
			// Check sender and hash.
			if sender != result.Sender {
				t.Errorf("sender mismatch: got %x, want %x", sender, result.Sender)
			}
			if h := txval.Hash(); h != result.Hash {
				t.Errorf("tx hash mismatch: got %x, want %x", h, result.Hash)
			}
		})
	}
}

```
</file>
</go-ethereum>

### Prompt Corrections
The original prompt is of high quality and provides an excellent structure for the task. The Zig struct definitions for the test types are well-aligned with the JSON format used in `ethereum/tests`. The following are minor suggestions and points of clarification based on the `go-ethereum` reference implementation:

1.  **Fork-Specific Signers**: A critical detail for correctly validating state and transaction tests is using the right `Signer` for each hardfork. The `Signer` is responsible for deriving the sender from the transaction signature, and the signing hash (`sighash`) algorithm changes between forks (e.g., EIP-155, EIP-1559, EIP-2718). The `TestTransaction` struct should implicitly handle this by using the correct signer based on the active fork (`post` map key in StateTests, `result` map key in TransactionTests).

2.  **VM Context (`env`)**: In the `StateTest.StateTestData.TestEnvironment` struct, the field `current_random` should be mapped to the `prevrandao` field in the VM's block context for post-Merge forks. This is a direct replacement for `difficulty`. The prompt correctly uses a nullable `?` for this, which is good.

3.  **Genesis Block in BlockchainTests**: The `go-ethereum` implementation creates the genesis block for `BlockchainTests` by combining the `genesisBlockHeader` and the `pre` state. The test runner should use the `pre` state to populate a `StateDB`, compute the state root, and then set that root in the genesis header before committing it as block #0. The prompt's data structure is correct, but this implementation detail is important.

4.  **Error vs. Exception**: The `go-ethereum` tests often check for an `ExpectException` field. This is important to differentiate from other test failures. A test that correctly throws an expected exception (e.g., "invalid transaction") should be considered a *pass*. Your test runner should account for this. The `BlockchainTest.TestBlock` and `TransactionTest.TransactionResult` structs in the prompt correctly include this field.

5.  **Test Discovery**: The `go-ethereum` test runner uses the file path to determine the test type (e.g., `GeneralStateTests`, `BlockchainTests`). Your `run_test_file` function does exactly this, which is the correct approach. The list of directories to skip (`src`, `VMTests`, etc.) is also a good practical detail to include, as seen in Geth's runner.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/ethtests.go">
```go
// ethtests.go contains the top-level logic for running the consensus tests.

// StateTest are tests that check state transitions.
type StateTest struct {
	Env         *stEnv              `json:"env"`
	Pre         core.GenesisAlloc   `json:"pre"`
	Post        PostStateMap        `json:"post"`
	Transaction stTransaction       `json:"transaction"`
	expectFail  int                 `json:"expectFail,omitempty"`
	comment     string              `json:"_comment,omitempty"`
	fillerPath  string              // The path to the filler file.
	testName    string              // The name of the test within the filler.
}

// BlockchainTest are tests that check the validity of a blockchain.
type BlockchainTest struct {
	GenesisHeader    *types.Header         `json:"genesisBlockHeader"`
	GenesisRLP       hexutil.Bytes         `json:"genesisRLP"`
	Blocks           []btBlock             `json:"blocks"`
	LastBlockHash    common.Hash           `json:"lastblockhash"`
	Pre              core.GenesisAlloc     `json:"pre"`
	PostState        *core.GenesisAlloc    `json:"postState"`
	Network          string                `json:"network"`
	SealEngine       string                `json:"sealEngine"`
	Fork             string                `json:"fork"` // a non-standard property of some hive tests
	GenesisFeeConfig *params.FeeConfig     `json:"genesisFeeConfig"`
	fillerPath       string                // The path to the filler file.
	testName         string                // The name of the test within the filler.
}

// TransactionTest are tests that check the validity of transactions.
// It is a wrapper around a single transaction that can be checked
// against multiple states.
type TransactionTest struct {
	transaction txData
	result      map[string]txResult
}

// RunStateTests runs the state tests from the given directory.
func RunStateTests(dir string, included, excluded *regexp.Regexp, vmTrace bool, vmStats bool) []error {
	var results []error
	var files []string
	if err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() {
			files = append(files, path)
		}
		return err
	}); err != nil {
		return []error{err}
	}

	start := time.Now()
	for _, file := range files {
		if !strings.HasSuffix(file, ".json") {
			continue
		}
		var tests map[string]StateTest
		if err := loadJSON(file, &tests); err != nil {
			results = append(results, fmt.Errorf("%s: %v", file, err))
			continue
		}
		for name, test := range tests {
			test.fillerPath = file
			test.testName = name
			if included != nil && !included.MatchString(test.path()) {
				continue
			}
			if excluded != nil && excluded.MatchString(test.path()) {
				continue
			}
			results = append(results, test.Run(vmTrace, vmStats))
		}
	}
	log.Info("Completed state tests", "elapsed", time.Since(start), "errors", len(results))
	return results
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/gen_stenv.go">
```go
// stEnv is the state test environment section which is loaded from JSON.
//
// Note, this struct is generated from student.go, but due to it's size is
// not included there to reduce the size of the initial test binary.
type stEnv struct {
	Coinbase      common.UnprefixedAddress `json:"currentCoinbase"      gencodec:"required"`
	Difficulty    *math.HexOrDecimal256    `json:"currentDifficulty"    gencodec:"optional"`
	Random        *math.HexOrDecimal256    `json:"currentRandom"        gencodec:"optional"`
	GasLimit      math.HexOrDecimal64      `json:"currentGasLimit"      gencodec:"required"`
	Number        math.HexOrDecimal64      `json:"currentNumber"        gencodec:"required"`
	Timestamp     math.HexOrDecimal64      `json:"currentTimestamp"     gencodec:"required"`
	BaseFee       *math.HexOrDecimal256    `json:"currentBaseFee"       gencodec:"optional"`
	ExcessBlobGas *math.HexOrDecimal64     `json:"currentExcessBlobGas" gencodec:"optional"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test.go">
```go
// Run executes the state test and reports any errors.
func (st *StateTest) Run(t *testing.T, vmTrace bool, vmStats bool) {
	// ... (test skipping logic omitted)

	for forkName, post := range st.Post {
		// Create a new state database for every test.
		prestate := st.Pre.toStateDB(t)

		// Create the EVM context.
		txctx := core.NewEVMTxContext(st.Transaction.msg(0)) // fees are ignored in state tests
		vmctx := st.makeVmctx(txctx)

		// This has to be done after setting the rules, so we can check for
		// an EIP that changes consensus rules, like EIP-4762.
		if st.Transaction.GasLimit[0] > vmctx.GasLimit && !vmctx.Rules.IsEIP4762 {
			// This is a test that's pushing the boundaries of gas available,
			// but needs to be run. Set the block gas limit to the tx gas limit.
			vmctx.GasLimit = st.Transaction.GasLimit[0]
		}
		// Create a new EVM and apply the transaction message.
		vmenv := vm.NewEVM(vmctx, txctx, prestate, st.config(t, forkName), vm.Config{})
		if vmTrace {
			vmenv.Config.Tracer = logger.NewMarkdownLogger(&logger.Config{}, os.Stdout)
		}
		if vmStats {
			vmenv.Config.Tracer = logger.NewStatsLogger(nil)
		}
		// Apply the transaction and check for execution errors.
		_, gas, err := core.ApplyMessage(vmenv, st.Transaction.msg(0), new(core.GasPool).AddGas(math.MaxUint64))

		// The test is expected to fail if an error is returned.
		if st.expectFail != 0 {
			if err == nil {
				t.Errorf("%v: state test succeeded, but expected failure", st.path())
			} else {
				t.Logf("%v: state test failed as expected: %v", st.path(), err)
			}
			continue
		} else if err != nil {
			t.Errorf("%v: state test failed: %v", st.path(), err)
			continue
		}

		// The state of the EVM is verified against the post state of the test.
		st.verify(t, 0, post, prestate, gas)
	}
}

// verify compares the post state of a state test against the given stateDB.
func (st *StateTest) verify(t *testing.T, txIndex int, post PostState, s *state.StateDB, gasLeft uint64) {
	// Check the post state root.
	root := s.IntermediateRoot(true)
	if post.Root != root {
		t.Errorf("%v: post-state root mismatch (tx %d)\n  got:  %x\n  want: %x", st.path(), txIndex, root, post.Root)
	}

	// Check the log hash.
	logs := s.Logs()
	if logs == nil {
		logs = []*types.Log{}
	}
	if h := types.DeriveSha(types.Receipts{(&types.Receipt{Logs: logs})}, trie.NewStackTrie(nil)); h != post.Logs {
		t.Errorf("%v: post-state logs hash mismatch (tx %d)\n  got:  %x\n  want: %x", st.path(), txIndex, h, post.Logs)
	}
	if gasLeft != post.GasLeft {
		t.Errorf("%v: post-state gas left mismatch (tx %d)\n got: %d\n want: %d", st.path(), txIndex, gasLeft, post.GasLeft)
	}

	// Check the created contract address.
	if created := s.GetNonTerryCreated(); len(created) > 0 {
		if len(created) > 1 {
			t.Errorf("%v: more than one contract created", st.path())
		}
		if created[0] != post.ExpectCreated {
			t.Errorf("%v: created address mismatch: got %x want %x", st.path(), created[0], post.ExpectCreated)
		}
	} else if post.ExpectCreated != (common.Address{}) {
		t.Errorf("%v: expected contract creation", st.path())
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/blockchain_test.go">
```go
// run an individual blockchain test.
func (test *BlockchainTest) Run(t *testing.T) {
	// ... (test skipping logic omitted)

	// Create the blockchain and initialize its state.
	blockchain, _ := test.newBlockChain(t)
	defer blockchain.Stop()

	// Sequentially import all the blocks, validating the results
	test.runBlocks(t, blockchain)

	// If a post state is defined, verify the final state against it
	if test.PostState != nil {
		// Finalize the chain to have a sane state database
		finalBlock := blockchain.CurrentBlock()
		if _, err := blockchain.StateAt(finalBlock.Root); err != nil {
			t.Fatalf("failed to retrieve final state: %v", err)
		}
		// Verify the post state
		if err := test.PostState.check(t, blockchain.StateCache()); err != nil {
			t.Error(err)
		}
	}
}

// newBlockChain creates a new blockchain instance from the test definition.
func (test *BlockchainTest) newBlockChain(t *testing.T) (*core.BlockChain, core.GenesisAlloc) {
	// Create the genesis block and initialize the database with it
	gspec := &core.Genesis{
		Config:        test.config(t),
		Nonce:         test.GenesisHeader.Nonce.Uint64(),
		ExtraData:     test.GenesisHeader.Extra,
		GasLimit:      test.GenesisHeader.GasLimit,
		Difficulty:    test.GenesisHeader.Difficulty,
		Mixhash:       test.GenesisHeader.MixDigest,
		Coinbase:      test.GenesisHeader.Coinbase,
		BaseFee:       test.GenesisHeader.BaseFee,
		Alloc:         test.Pre,
		Number:        test.GenesisHeader.Number.Uint64(),
		GasUsed:       test.GenesisHeader.GasUsed,
		ParentHash:    test.GenesisHeader.ParentHash,
		ExcessBlobGas: test.GenesisHeader.ExcessBlobGas,
		BlobGasUsed:   test.GenesisHeader.BlobGasUsed,
	}
	if test.GenesisFeeConfig != nil {
		gspec.BaseFee = new(big.Int).SetUint64(test.GenesisFeeConfig.BaseFee)
	}

	db := rawdb.NewMemoryDatabase()
	genesis := gspec.MustCommit(db, nil) // TODO(rjl493456442): path-based scheme

	// Create the blockchain and feed it the initial state
	var engine consensus.Engine
	switch test.SealEngine {
	case "NoProof":
		engine = ethash.NewFullFaker()
	case "Ethash":
		engine = ethash.NewFaker()
	case "Clique":
		engine = clique.New(gspec.Config.Clique, db)
	default:
		t.Fatalf("unsupported seal engine: %s", test.SealEngine)
	}
	blockchain, _ := core.NewBlockChain(db, nil, gspec, nil, engine, vm.Config{}, nil)
	return blockchain, genesis.Alloc
}

// runBlocks imports the blocks from the test definition and verifies the state.
func (test *BlockchainTest) runBlocks(t *testing.T, blockchain *core.BlockChain) {
	t.Helper()
	var (
		statedb *state.StateDB
		err     error
	)
	// Iterate over the blocks and import them
	for i, b := range test.Blocks {
		var block *types.Block
		if b.rlp() != "" {
			// Block is in RLP format.
			if err := rlp.DecodeBytes(b.rlp(), &block); err != nil {
				t.Fatalf("block %d: invalid RLP: %v", i+1, err)
			}
		} else {
			// Create the block from its components.
			block, err = b.makeBlock(blockchain)
			if err != nil {
				t.Fatalf("block %d: %v", i+1, err)
			}
		}
		// Get the state of the parent block.
		parent := blockchain.GetBlockByHash(block.ParentHash())
		if parent == nil {
			t.Fatalf("block %d: could not find parent %x", i+1, block.ParentHash())
		}
		statedb, err = blockchain.StateAt(parent.Root())
		if err != nil {
			t.Fatalf("block %d: could not get parent state: %v", i+1, err)
		}
		// Process the block and check for validation errors.
		receipts, logs, usedGas, err := blockchain.Processor().Process(block, statedb, vm.Config{})

		// The test is expected to fail if an exception is declared.
		if b.ExpectException != "" {
			if err == nil {
				t.Fatalf("block %d: expected exception %q", i+1, b.ExpectException)
			}
			if !strings.Contains(err.Error(), b.ExpectException) {
				t.Fatalf("block %d: exception mismatch: got %q, want %q", i+1, err, b.ExpectException)
			}
			// Re-execute the block to check that the exception can be reproduced.
			// This is needed because some invalid blocks can pass the validation due to
			// the incomplete trie data. The check should be performed here not in the
			// beginning because of some blocks are expected to fail only if their
			// parents have been applied successfully.
			if _, err := blockchain.InsertChain(types.Blocks{block}); err == nil {
				t.Fatalf("block %d: invalid block imported successfully", i+1)
			}
			// Exception matched, stop processing more blocks.
			return
		}
		if err != nil {
			t.Fatalf("block %d: failed to process block: %v", i+1, err)
		}
		// Run validator.
		if err := blockchain.Validator().ValidateState(block, statedb, receipts, usedGas); err != nil {
			t.Fatalf("block %d: invalid state: %v", i+1, err)
		}
		// Write the block to the chain.
		root := statedb.IntermediateRoot(blockchain.Config().IsEIP158(block.Number()))
		if root != block.Root() {
			t.Fatalf("block %d: state root mismatch: got %x, want %x", i+1, root, block.Root())
		}
		if _, err := blockchain.InsertChain(types.Blocks{block}); err != nil {
			t.Fatalf("block %d: failed to insert block: %v", i+1, err)
		}
		// Check the logs.
		if h := types.DeriveSha(types.Receipts{(&types.Receipt{Logs: logs})}, trie.NewStackTrie(nil)); h != b.expectLogHash() {
			t.Errorf("block %d: log hash mismatch: got %x, want %x", i+1, h, b.expectLogHash())
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/transaction_test.go">
```go
// TestTransaction runs a single transaction test.
func (tt *TransactionTest) Run(t *testing.T, config *params.ChainConfig, snapshotter bool) {
	for fork, result := range tt.result {
		t.Run(fork, func(t *testing.T) {
			if err := tt.run(config.RuleSet(fork), result, snapshotter); err != nil {
				t.Error(err)
			}
		})
	}
}

func (tt *TransactionTest) run(rules params.Rules, result txResult, snapshotter bool) error {
	var config *params.ChainConfig
	if rules.IsShanghai {
		config = params.TestChainConfig
	} else {
		// Before Shanghai, the chain ID is a uint64
		// But in tests, some of them are pretty large, for example `e3105a38`
		config = &params.ChainConfig{ChainID: big.NewInt(0)}
	}
	signer := types.MakeSigner(config, big.NewInt(0), 0)

	// Create the transaction.
	tx, err := tt.transaction.toTx(config)
	if err != nil {
		if result.Exception == "" {
			return fmt.Errorf("tx creation failed: %v", err)
		} else {
			// This is a bit of a hack.
			if e := strings.ToLower(err.Error()); !strings.Contains(e, strings.ToLower(result.Exception)) {
				return fmt.Errorf("tx creation error mismatch: got %q, want %q", err, result.Exception)
			}
		}
		return nil
	}

	// In case of any exception, validate if the sender can be derived.
	sender, err := types.Sender(signer, tx)
	if err != nil {
		if result.Exception == "" {
			return fmt.Errorf("sender recovery failed: %v", err)
		} else if !strings.HasPrefix(result.Exception, "TR_") {
			return fmt.Errorf("sender recovery error mismatch: got %q, want %q", err, result.Exception)
		}
		return nil
	}

	// Validate the intrinsic gas of the transaction.
	gas, err := core.IntrinsicGas(tx.Data(), tx.AccessList(), tx.To() == nil, true, true, true, rules.IsShanghai)
	if err != nil {
		if result.Exception == "" {
			return fmt.Errorf("intrinsic gas calculation failed: %v", err)
		} else if !strings.HasPrefix(result.Exception, "TR_") {
			return fmt.Errorf("intrinsic gas error mismatch: got %q, want %q", err, result.Exception)
		}
		return nil
	}
	if gas != result.IntrinsicGas {
		return fmt.Errorf("intrinsic gas mismatch: got %d, want %d", gas, result.IntrinsicGas)
	}

	// If no exception was expected, check the derived sender.
	if result.Exception != "" {
		return fmt.Errorf("tx valid, but expected exception %q", result.Exception)
	}
	if sender != result.Sender {
		return fmt.Errorf("sender mismatch: got %v, want %v", sender, result.Sender)
	}
	if tx.Hash() != result.Hash {
		return fmt.Errorf("hash mismatch: got %v, want %v", tx.Hash(), result.Hash)
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// GetOrNewStateObject retrieves a state object or create a new state object if nil.
func (s *StateDB) getOrNewStateObject(addr common.Address) *stateObject {
	obj := s.getStateObject(addr)
	if obj == nil {
		obj = s.createObject(addr)
	}
	return obj
}

// createObject creates a new state object. If there is an existing account with
// the given address, it is overwritten and returned as the second return value.
func (s *StateDB) createObject(addr common.Address) *stateObject {
	// ... (implementation omitted for brevity, see full file for details) ...
	obj := newObject(s, addr, nil)
	s.journal.createObject(addr)
	s.setStateObject(obj)
	return obj
}

// IntermediateRoot computes the current root hash of the state trie.
// It is called in between transactions to get the root hash that
// goes into transaction receipts.
func (s *StateDB) IntermediateRoot(deleteEmptyObjects bool) common.Hash {
	// Finalise all the dirty storage states and write them into the tries
	s.Finalise(deleteEmptyObjects)

	// ... (prefetcher logic omitted) ...

	// Perform updates before deletions.
	for addr, op := range s.mutations {
		if op.applied || op.isDelete() {
			continue
		}
		op.applied = true

		s.updateStateObject(s.stateObjects[addr])
		s.AccountUpdated += 1
	}
	for _, deletedAddr := range deletedAddrs {
		s.deleteStateObject(deletedAddr)
		s.AccountDeleted += 1
	}
	// ... (prefetcher logic omitted) ...
	return s.trie.Hash()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journal contains the list of state modifications applied since the last state
// commit. These are tracked to be able to be reverted in the case of an execution
// exception or request for reversal.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes

	validRevisions []revision
	nextRevisionId int
}

// journalEntry is a modification entry in the state change journal that can be
// reverted on demand.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the Ethereum address modified by this journal entry.
	dirtied() *common.Address

	// copy returns a deep-copied journal entry.
	copy() journalEntry
}

// snapshot returns an identifier for the current revision of the state.
func (j *journal) snapshot() int {
	id := j.nextRevisionId
	j.nextRevisionId++
	j.validRevisions = append(j.validRevisions, revision{id, j.length()})
	return id
}

// revertToSnapshot reverts all state changes made since the given revision.
func (j *journal) revertToSnapshot(revid int, s *StateDB) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(j.validRevisions), func(i int) bool {
		return j.validRevisions[i].id >= revid
	})
	if idx == len(j.validRevisions) || j.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := j.validRevisions[idx].journalIndex

	// Replay the journal to undo changes and remove invalidated snapshots
	j.revert(s, snapshot)
	j.validRevisions = j.validRevisions[:idx]
}

// revert undoes a batch of journalled modifications along with any reverted
// dirty handling too.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		j.entries[i].revert(statedb)

		// Drop any dirty tracking induced by the change
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// append inserts a new modification entry to the end of the change journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (depth and balance checks) ...

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	if !evm.StateDB.Exist(addr) {
		// ... (account creation logic) ...
		evm.StateDB.CreateAccount(addr)
	}
	evm.Context.Transfer(evm.StateDB, caller, addr, value)

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas, evm.Config.Tracer)
	} else {
		code := evm.resolveCode(addr)
		if len(code) == 0 {
			ret, err = nil, nil // gas is unchanged
		} else {
			contract := NewContract(caller, addr, value, gas, evm.jumpDests)
			contract.SetCallCode(evm.resolveCodeHash(addr), code)
			ret, err = evm.interpreter.Run(contract, input, false)
			gas = contract.Gas
		}
	}
	// Handle errors and revert state if necessary
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			gas = 0
		}
	}
	return ret, gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller common.Address, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	contractAddr = crypto.CreateAddress(caller, evm.StateDB.GetNonce(caller))
	return evm.create(caller, code, gas, value, contractAddr, CREATE)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/database.go">
```go
// Database wraps access to tries and contract code.
type Database interface {
	// Reader returns a state reader associated with the specified state root.
	Reader(root common.Hash) (Reader, error)

	// OpenTrie opens the main account trie.
	OpenTrie(root common.Hash) (Trie, error)

	// OpenStorageTrie opens the storage trie of an account.
	OpenStorageTrie(stateRoot common.Hash, address common.Address, root common.Hash, trie Trie) (Trie, error)

	// ... (other methods)
}

// NewDatabaseForTesting is similar to NewDatabase, but it initializes the caching
// db by using an ephemeral memory db with default config for testing.
func NewDatabaseForTesting() *CachingDB {
	return NewDatabase(triedb.NewDatabase(rawdb.NewMemoryDatabase(), nil), nil)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/receipt.go">
```go
// DeriveSha returns the RLP hash of the receipts.
func DeriveSha(receipts Receipts, hasher trie.Hasher) common.Hash {
	if hasher == nil {
		hasher = trie.NewStackTrie(nil)
	}
	hasher.Reset()

	// Receipts are not stored in a Merkle-Patricia trie, they are simply a list of
	// RLP encoded receipts. Thus, the derived hash is just the RLP hash of the
	// list of receipts.
	rlp.Encode(hasher, receipts)
	return hasher.Hash()
}
```
</file>
## Prompt Corrections
The original prompt's Zig structs for test data are excellent and closely match the structure of the `ethereum/tests` JSON files. No major corrections are needed. A minor improvement could be to clarify the purpose of array fields in `TestTransaction` (e.g., `data`, `gas_limit`, `value`). These represent different transaction variants executed against the same pre-state for a given test case, which is a key concept in state tests. The go-ethereum implementation shows this clearly where it iterates through these variants. The provided Zig `StateTestExecutor` skeleton correctly simplifies this by just using the first variant, which is a good starting point.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test_util.go">
```go
// StateTest checks transaction processing without block context.
// See https://github.com/ethereum/EIPs/issues/176 for the test format specification.
type StateTest struct {
	json stJSON
}

func (t *StateTest) UnmarshalJSON(in []byte) error {
	return json.Unmarshal(in, &t.json)
}

type stJSON struct {
	Env  stEnv                    `json:"env"`
	Pre  types.GenesisAlloc       `json:"pre"`
	Tx   stTransaction            `json:"transaction"`
	Out  hexutil.Bytes            `json:"out"`
	Post map[string][]stPostState `json:"post"`
}

type stPostState struct {
	Root            common.UnprefixedHash `json:"hash"`
	Logs            common.UnprefixedHash `json:"logs"`
	TxBytes         hexutil.Bytes         `json:"txbytes"`
	ExpectException string                `json:"expectException"`
	Indexes         struct {
		Data  int `json:"data"`
		Gas   int `json:"gas"`
		Value int `json:"value"`
	}
}

// stEnv corresponds to the `env` block of a state test.
type stEnv struct {
	Coinbase      common.Address `json:"currentCoinbase"      gencodec:"required"`
	Difficulty    *big.Int       `json:"currentDifficulty"    gencodec:"optional"`
	Random        *big.Int       `json:"currentRandom"        gencodec:"optional"`
	GasLimit      uint64         `json:"currentGasLimit"      gencodec:"required"`
	Number        uint64         `json:"currentNumber"        gencodec:"required"`
	Timestamp     uint64         `json:"currentTimestamp"     gencodec:"required"`
	BaseFee       *big.Int       `json:"currentBaseFee"       gencodec:"optional"`
	ExcessBlobGas *uint64        `json:"currentExcessBlobGas" gencodec:"optional"`
}

// stTransaction corresponds to the `transaction` block of a state test.
type stTransaction struct {
	GasPrice             *big.Int            `json:"gasPrice"`
	MaxFeePerGas         *big.Int            `json:"maxFeePerGas"`
	MaxPriorityFeePerGas *big.Int            `json:"maxPriorityFeePerGas"`
	Nonce                uint64              `json:"nonce"`
	To                   string              `json:"to"`
	Data                 []string            `json:"data"`
	AccessLists          []*types.AccessList `json:"accessLists,omitempty"`
	GasLimit             []uint64            `json:"gasLimit"`
	Value                []string            `json:"value"`
	PrivateKey           []byte              `json:"secretKey"`
	Sender               *common.Address     `json:"sender"`
	BlobVersionedHashes  []common.Hash       `json:"blobVersionedHashes,omitempty"`
	BlobGasFeeCap        *big.Int            `json:"maxFeePerBlobGas,omitempty"`
	AuthorizationList    []*stAuthorization  `json:"authorizationList,omitempty"`
}

// Run executes a specific subtest and verifies the post-state and logs
func (t *StateTest) Run(subtest StateSubtest, vmconfig vm.Config, snapshotter bool, scheme string, postCheck func(err error, st *StateTestState)) (result error) {
	st, root, _, err := t.RunNoVerify(subtest, vmconfig, snapshotter, scheme)
	// Invoke the callback at the end of function for further analysis.
	defer func() {
		postCheck(result, &st)
		st.Close()
	}()

	checkedErr := t.checkError(subtest, err)
	if checkedErr != nil {
		return checkedErr
	}
	// The error has been checked; if it was unexpected, it's already returned.
	if err != nil {
		// Here, an error exists but it was expected.
		// We do not check the post state or logs.
		return nil
	}
	post := t.json.Post[subtest.Fork][subtest.Index]

	if root != common.Hash(post.Root) {
		return fmt.Errorf("post state root mismatch: got %x, want %x", root, post.Root)
	}
	if logs := rlpHash(st.StateDB.Logs()); logs != common.Hash(post.Logs) {
		return fmt.Errorf("post state logs hash mismatch: got %x, want %x", logs, post.Logs)
	}
	st.StateDB, _ = state.New(root, st.StateDB.Database())
	return nil
}

// RunNoVerify runs a specific subtest and returns the statedb and post-state root.
func (t *StateTest) RunNoVerify(subtest StateSubtest, vmconfig vm.Config, snapshotter bool, scheme string) (st StateTestState, root common.Hash, gasUsed uint64, err error) {
	config, eips, err := GetChainConfig(subtest.Fork)
	if err != nil {
		return st, common.Hash{}, 0, UnsupportedForkError{subtest.Fork}
	}
	vmconfig.ExtraEips = eips

	block := t.genesis(config).ToBlock()
	st = MakePreState(rawdb.NewMemoryDatabase(), t.json.Pre, snapshotter, scheme)

	var baseFee *big.Int
	if config.IsLondon(new(big.Int)) {
		baseFee = t.json.Env.BaseFee
		// ... base fee defaults ...
	}
	post := t.json.Post[subtest.Fork][subtest.Index]
	msg, err := t.json.Tx.toMessage(post, baseFee)
	if err != nil {
		return st, common.Hash{}, 0, err
	}

	// Prepare the EVM.
	context := core.NewEVMBlockContext(block.Header(), &dummyChain{config: config}, &t.json.Env.Coinbase)
	context.GetHash = vmTestBlockHash
	context.BaseFee = baseFee
	// ... set other context fields ...
	evm := vm.NewEVM(context, st.StateDB, config, vmconfig)

	// Execute the message.
	gaspool := new(core.GasPool)
	gaspool.AddGas(block.GasLimit())
	vmRet, err := core.ApplyMessage(evm, msg, gaspool)
	if err != nil {
		// ... handle error ...
		return st, common.Hash{}, 0, err
	}
	
	st.StateDB.AddBalance(block.Coinbase(), new(uint256.Int), tracing.BalanceChangeUnspecified)

	// Commit state mutations into database.
	root, _ = st.StateDB.Commit(block.NumberU64(), config.IsEIP158(block.Number()), config.IsCancun(block.Number(), block.Time()))
	
	return st, root, vmRet.UsedGas, nil
}

// MakePreState creates a state containing the given allocation.
func MakePreState(db ethdb.Database, accounts types.GenesisAlloc, snapshotter bool, scheme string) StateTestState {
	// ...
	statedb, _ := state.New(types.EmptyRootHash, sdb)
	for addr, a := range accounts {
		statedb.SetCode(addr, a.Code)
		statedb.SetNonce(addr, a.Nonce, tracing.NonceChangeUnspecified)
		statedb.SetBalance(addr, uint256.MustFromBig(a.Balance), tracing.BalanceChangeUnspecified)
		for k, v := range a.Storage {
			statedb.SetState(addr, k, v)
		}
	}
	root, _ := statedb.Commit(0, false, false)
	// ... re-open with snapshotter if enabled ...
	statedb, _ = state.New(root, sdb)
	return StateTestState{statedb, triedb, snaps}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/block_test_util.go">
```go
// A BlockTest checks handling of entire blocks.
type BlockTest struct {
	json btJSON
}

type btJSON struct {
	Blocks     []btBlock             `json:"blocks"`
	Genesis    btHeader              `json:"genesisBlockHeader"`
	Pre        types.GenesisAlloc    `json:"pre"`
	Post       types.GenesisAlloc    `json:"postState"`
	BestBlock  common.UnprefixedHash `json:"lastblockhash"`
	Network    string                `json:"network"`
	SealEngine string                `json:"sealEngine"`
}

type btBlock struct {
	BlockHeader     *btHeader
	ExpectException string
	Rlp             string
	UncleHeaders    []*btHeader
}

type btHeader struct {
	Bloom                 types.Bloom
	Coinbase              common.Address
	MixHash               common.Hash
	Nonce                 types.BlockNonce
	Number                *big.Int
	Hash                  common.Hash
	ParentHash            common.Hash
	ReceiptTrie           common.Hash
	StateRoot             common.Hash
	TransactionsTrie      common.Hash
	UncleHash             common.Hash
	ExtraData             []byte
	Difficulty            *big.Int
	GasLimit              uint64
	GasUsed               uint64
	Timestamp             uint64
	BaseFeePerGas         *big.Int
	WithdrawalsRoot       *common.Hash
	BlobGasUsed           *uint64
	ExcessBlobGas         *uint64
	ParentBeaconBlockRoot *common.Hash
}

func (t *BlockTest) Run(snapshotter bool, scheme string, witness bool, tracer *tracing.Hooks, postCheck func(error, *core.BlockChain)) (result error) {
	config, ok := Forks[t.json.Network]
	if !ok {
		return UnsupportedForkError{t.json.Network}
	}
	// ...
	gspec := t.genesis(config)
	gblock, err := gspec.Commit(db, triedb)
	// ...
	
	engine := beacon.New(ethash.NewFaker())

	chain, err := core.NewBlockChain(db, cache, gspec, nil, engine, vm.Config{
		Tracer:                  tracer,
		StatelessSelfValidation: witness,
	}, nil)
	// ...

	validBlocks, err := t.insertBlocks(chain)
	if err != nil {
		return err
	}
	// ...
	cmlast := chain.CurrentBlock().Hash()
	if common.Hash(t.json.BestBlock) != cmlast {
		return fmt.Errorf("last block hash validation mismatch: want: %x, have: %x", t.json.BestBlock, cmlast)
	}
	newDB, err := chain.State()
	if err != nil {
		return err
	}
	if err = t.validatePostState(newDB); err != nil {
		return fmt.Errorf("post state validation failed: %v", err)
	}
	// ...
	return t.validateImportedHeaders(chain, validBlocks)
}

func (t *BlockTest) insertBlocks(blockchain *core.BlockChain) ([]btBlock, error) {
	validBlocks := make([]btBlock, 0)
	// insert the test blocks, which will execute all transactions
	for bi, b := range t.json.Blocks {
		cb, err := b.decode()
		if err != nil {
			if b.BlockHeader == nil {
				log.Info("Block decoding failed", "index", bi, "err", err)
				continue // OK - block is supposed to be invalid, continue with next block
			} else {
				return nil, fmt.Errorf("block RLP decoding failed when expected to succeed: %v", err)
			}
		}
		// RLP decoding worked, try to insert into chain:
		blocks := types.Blocks{cb}
		i, err := blockchain.InsertChain(blocks)
		if err != nil {
			if b.BlockHeader == nil {
				continue // OK - block is supposed to be invalid, continue with next block
			} else {
				return nil, fmt.Errorf("block #%v insertion into chain failed: %v", blocks[i].Number(), err)
			}
		}
		if b.BlockHeader == nil {
			// ... handle unexpected success ...
			return nil, fmt.Errorf("block (index %d) insertion should have failed due to: %v",
				bi, b.ExpectException)
		}
		validBlocks = append(validBlocks, b)
	}
	return validBlocks, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/transaction_test_util.go">
```go
// TransactionTest checks RLP decoding and sender derivation of transactions.
type TransactionTest struct {
	Txbytes hexutil.Bytes `json:"txbytes"`
	Result  map[string]*ttFork
}

type ttFork struct {
	Sender       *common.UnprefixedAddress `json:"sender"`
	Hash         *common.UnprefixedHash    `json:"hash"`
	Exception    *string                   `json:"exception"`
	IntrinsicGas math.HexOrDecimal64       `json:"intrinsicGas"`
}

func (tt *TransactionTest) Run() error {
	if err := tt.validate(); err != nil {
		return err
	}
	validateTx := func(rlpData hexutil.Bytes, signer types.Signer, rules *params.Rules) (sender common.Address, hash common.Hash, requiredGas uint64, err error) {
		tx := new(types.Transaction)
		if err = tx.UnmarshalBinary(rlpData); err != nil {
			return
		}
		sender, err = types.Sender(signer, tx)
		if err != nil {
			return
		}
		// Intrinsic gas
		requiredGas, err = core.IntrinsicGas(tx.Data(), tx.AccessList(), tx.SetCodeAuthorizations(), tx.To() == nil, rules.IsHomestead, rules.IsIstanbul, rules.IsShanghai)
		if err != nil {
			return
		}
		if requiredGas > tx.Gas() {
			return sender, hash, 0, fmt.Errorf("insufficient gas ( %d < %d )", tx.Gas(), requiredGas)
		}
		// ... more validation ...
		hash = tx.Hash()
		return sender, hash, requiredGas, nil
	}
	for _, testcase := range []struct {
		name    string
		isMerge bool
	}{
		// ... list of forks ...
		{"Frontier", false},
		{"Homestead", false},
		// ...
		{"Prague", true},
	} {
		expected := tt.Result[testcase.name]
		if expected == nil {
			continue
		}
		config, ok := Forks[testcase.name]
		// ...
		var (
			rules  = config.Rules(new(big.Int), testcase.isMerge, 0)
			signer = types.MakeSigner(config, new(big.Int), 0)
		)
		sender, hash, gas, err := validateTx(tt.Txbytes, signer, &rules)
		if err != nil {
			// ... check expected exception ...
			continue
		}
		if expected.Exception != nil {
			return fmt.Errorf("expected error %v, got none (%v), fork %s", *expected.Exception, err, testcase.name)
		}
		if common.Hash(*expected.Hash) != hash {
			return fmt.Errorf("hash mismatch: got %x, want %x", hash, common.Hash(*expected.Hash))
		}
		if common.Address(*expected.Sender) != sender {
			return fmt.Errorf("sender mismatch: got %x, want %x", sender, expected.Sender)
		}
		if uint64(expected.IntrinsicGas) != gas {
			return fmt.Errorf("intrinsic gas mismatch: got %d, want %d", gas, uint64(expected.IntrinsicGas))
		}
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/difficulty_test_util.go">
```go
// DifficultyTest defines a single test vector for the difficulty calculation.
type DifficultyTest struct {
	ParentTimestamp    uint64      `json:"parentTimestamp"`
	ParentDifficulty   *big.Int    `json:"parentDifficulty"`
	UncleHash          common.Hash `json:"parentUncles"`
	CurrentTimestamp   uint64      `json:"currentTimestamp"`
	CurrentBlockNumber uint64      `json:"currentBlockNumber"`
	CurrentDifficulty  *big.Int    `json:"currentDifficulty"`
}

// Run executes the test and returns an error if the calculated difficulty does not match the
// expected value.
func (test *DifficultyTest) Run(config *params.ChainConfig) error {
	parentNumber := big.NewInt(int64(test.CurrentBlockNumber - 1))
	parent := &types.Header{
		Difficulty: test.ParentDifficulty,
		Time:       test.ParentTimestamp,
		Number:     parentNumber,
		UncleHash:  test.UncleHash,
	}

	actual := ethash.CalcDifficulty(config, test.CurrentTimestamp, parent)
	exp := test.CurrentDifficulty

	if actual.Cmp(exp) != 0 {
		return fmt.Errorf("parent[time %v diff %v unclehash:%x] child[time %v number %v] diff %v != expected %v",
			test.ParentTimestamp, test.ParentDifficulty, test.UncleHash,
			test.CurrentTimestamp, test.CurrentBlockNumber, actual, exp)
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/init.go">
```go
// Forks table defines supported forks and their chain config.
var Forks = map[string]*params.ChainConfig{
	"Frontier": {
		ChainID: big.NewInt(1),
	},
	"Homestead": {
		ChainID:        big.NewInt(1),
		HomesteadBlock: big.NewInt(0),
	},
	"EIP150": {
		ChainID:        big.NewInt(1),
		HomesteadBlock: big.NewInt(0),
		EIP150Block:    big.NewInt(0),
	},
	"EIP158": {
		ChainID:        big.NewInt(1),
		HomesteadBlock: big.NewInt(0),
		EIP150Block:    big.NewInt(0),
		EIP155Block:    big.NewInt(0),
		EIP158Block:    big.NewInt(0),
	},
	"Byzantium": {
		ChainID:        big.NewInt(1),
		HomesteadBlock: big.NewInt(0),
		EIP150Block:    big.NewInt(0),
		EIP155Block:    big.NewInt(0),
		EIP158Block:    big.NewInt(0),
		DAOForkBlock:   big.NewInt(0),
		ByzantiumBlock: big.NewInt(0),
	},
	"ConstantinopleFix": { // Constantinople is the same as Petersburg.
		ChainID:             big.NewInt(1),
		HomesteadBlock:      big.NewInt(0),
		EIP150Block:         big.NewInt(0),
		EIP155Block:         big.NewInt(0),
		EIP158Block:         big.NewInt(0),
		DAOForkBlock:        big.NewInt(0),
		ByzantiumBlock:      big.NewInt(0),
		ConstantinopleBlock: big.NewInt(0),
		PetersburgBlock:     big.NewInt(0),
	},
	"Istanbul": {
		// ...
		IstanbulBlock: big.NewInt(0),
	},
	"Berlin": {
		// ...
		BerlinBlock: big.NewInt(0),
	},
	"London": {
		// ...
		LondonBlock: big.NewInt(0),
	},
	"Paris": { // Paris is The Merge
		// ...
		TerminalTotalDifficulty: big.NewInt(0),
	},
	"Shanghai": {
		// ...
		ShanghaiTime: u64(0),
	},
	"Cancun": {
		// ...
		CancunTime: u64(0),
		BlobScheduleConfig: &params.BlobScheduleConfig{
			Cancun: params.DefaultCancunBlobConfig,
		},
	},
	// ... Other transitional forks
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provided excellent Zig struct definitions for State, Blockchain, and Transaction tests. However, it omitted a struct for **Difficulty Tests**. Based on the `go-ethereum` implementation, I suggest adding the following struct to your test specifications to handle difficulty tests:

```zig
pub const DifficultyTest = struct {
    name: []const u8,
    test_data: DifficultyTestData,

    pub const DifficultyTestData = struct {
        parent_timestamp: u64,
        parent_difficulty: U256,
        parent_uncles: ?U256, // Note: The uncle hash is used in difficulty calculations
        current_timestamp: u64,
        current_block_number: u64,
        current_difficulty: U256,
        network: []const u8,
    };
};
```

This addition will ensure your test suite can also cover the difficulty calculation tests found in `ethereum/tests`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test.go">
```go
// StateTest are the state tests from the ethereum/tests repo.
type StateTest struct {
	Name       string
	Fork       string
	ForkBlocks ForkBlocks
	Tests      map[string]StateSubtest
}

// StateSubtest is a single state_test from the ethereum/tests repo.
type StateSubtest struct {
	Env         core.Genesis      `json:"env"`
	Pre         core.GenesisAlloc `json:"pre"`
	Transaction stTransaction     `json:"transaction"`
	Post        map[string][]stPost
	Out         hexutil.Bytes `json:"out"`
}

// stPost is the post-state of a state subtest.
type stPost struct {
	Root    common.Hash       `json:"hash"`
	Logs    common.Hash       `json:"logs"`
	TxBytes hexutil.Bytes     `json:"txbytes"`
	Expect  []stExpect        `json:"expect"` // for post-state specific exceptions
	Indexes map[string]uint64 `json:"indexes"`
}

// stTransaction is the transaction part of a state subtest.
type stTransaction struct {
	Data                stCallArgs        `json:"data"`
	GasLimit            hexutil.Uint64    `json:"gasLimit"`
	Value               *hexutil.Big      `json:"value"`
	GasPrice            *hexutil.Big      `json:"gasPrice"`
	Nonce               hexutil.Uint64    `json:"nonce"`
	To                  *common.Address   `json:"to"`
	SecretKey           *crypto.PrivateKey
	Sender              *common.Address
	MaxFeePerGas        *hexutil.Big      `json:"maxFeePerGas"`
	MaxPriorityFeePerGas *hexutil.Big      `json:"maxPriorityFeePerGas"`
	AccessLists         *types.AccessList `json:"accessLists"`
	BlobVersionedHashes []common.Hash     `json:"blobVersionedHashes"`
	MaxFeePerBlobGas    *hexutil.Big      `json:"maxFeePerBlobGas"`
}

// run runs the state test.
func (st *StateTest) run(t *testing.T, vmconfig vm.Config, snapshotter bool) {
	// ... (file loading and setup)

	for name, test := range st.Tests {
	forfork:
		for fork, postStates := range test.Post {
			// ... (fork skipping logic) ...

			// Run the test for each post state.
			for i, post := range postStates {
				// Create the environment for the test.
				rules := st.genesis(fork).Config.Rules(new(big.Int).SetUint64(test.Env.Number), true, test.Env.Timestamp)
				statedb, _ := state.New(common.Hash{}, st.db, nil)
				for addr, acc := range test.Pre {
					statedb.SetCode(addr, acc.Code)
					statedb.SetNonce(addr, acc.Nonce)
					statedb.SetBalance(addr, acc.Balance.ToInt())
					for key, val := range acc.Storage {
						statedb.SetState(addr, key, val)
					}
				}

				// Create the transaction and apply it.
				var (
					gaspool  = new(core.GasPool).AddGas(math.MaxUint64)
					tx, err  = st.newTx(test.Transaction, i)
					// ...
				)

				// Apply the transaction.
				context := st.newBlockContext(test.Env)
				vmenv := vm.NewEVM(context, core.NewEVMTxContext(tx), statedb, st.genesis(fork).Config, vmconfig)
				result, err := core.ApplyMessage(vmenv, tx, gaspool)
				
				// ... (error and exception checking) ...

				// Check post-state.
				if len(post.Root) > 0 {
					// Check state root.
					root := statedb.IntermediateRoot(rules.IsEIP158)
					if root != post.Root {
						// ... error reporting ...
					}
					// Check logs.
					logs := statedb.Logs()
					logHash := types.DeriveSha(types.Receipts{(&types.Receipt{Logs: logs, Status: result.Status()})}, trie.NewStackTrie(nil))
					if logHash != post.Logs {
						// ... error reporting ...
					}
				}
				//...
			}
		}
	}
}

// newBlockContext creates a new BlockContext for use in the EVM.
func (st *StateTest) newBlockContext(env core.Genesis) vm.BlockContext {
	context := vm.BlockContext{
		CanTransfer: core.CanTransfer,
		Transfer:    core.Transfer,
		GetHash:     st.getHash,
		Coinbase:    env.Coinbase,
		BlockNumber: new(big.Int).SetUint64(env.Number),
		Time:        env.Timestamp,
		Difficulty:  env.Difficulty,
		GasLimit:    env.GasLimit,
		BaseFee:     env.BaseFee,
	}
	if env.Random != nil {
		context.Random = env.Random
	} else {
		context.Random = &common.Hash{}
	}
	if env.ParentBeaconRoot != nil {
		context.ParentBeaconRoot = env.ParentBeaconRoot
	}
	if env.BlobBaseFee != nil {
		context.BlobBaseFee = env.BlobBaseFee
	}
	if len(st.Fork) > 0 {
		cfg := st.genesis(st.Fork).Config
		if cfg.IsCancun(context.BlockNumber, context.Time) {
			context.ExcessBlobGas = env.ExcessBlobGas
		}
	}
	return context
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides auxiliary blockchain related information
	BlockContext
	// TxContext provides auxiliary transaction related information
	TxContext
	// StateDB gives access to the underlying state
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules
	// vmConfig contains configuration options for the EVM
	vmConfig Config
	// interpreter is the contract interpreter
	interpreter *Interpreter
	// Gas is the amount of gas available for the current execution
	Gas uint64
	// gasprice is the price of gas in the current execution
	gasprice *big.Int
	// value is the value of the transaction
	value *big.Int
	// usedGas is the amount of gas used in the current execution
	usedGas uint64
	// err is the error that occurred during the execution
	err error

	// returnData is the returned data from the last call
	returnData []byte

	// ActivePrecompiles is the list of precompiles which are active on a given chain at a
	// given time.
	ActivePrecompiles [256]PrecompiledContract
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single goroutine.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// Initialize the active precompiles based on the chain configuration
	// - some precompiles are activated at a certain block number
	// - some are activated at a specific timestamp
	rules := chainConfig.Rules(blockCtx.BlockNumber, true, blockCtx.Time)
	var precompiles [256]PrecompiledContract
	for i, p := range PrecompiledContractsHomestead {
		if p != nil {
			precompiles[i+1] = p
		}
	}
	// ... (rest of precompile setup for different forks) ...

	evm := &EVM{
		BlockContext:      blockCtx,
		TxContext:         txCtx,
		StateDB:           statedb,
		chainConfig:       chainConfig,
		chainRules:        rules,
		vmConfig:          vmConfig,
		ActivePrecompiles: precompiles,
	}
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// ApplyMessage computes the new state by applying the given message
// against the old state.
//
// ApplyMessage returns the receipt and the total gas used. If the transaction
// failed, the receipt will be returned with a nil contract address.
func ApplyMessage(evm *vm.EVM, msg Message, gp *GasPool) (*ExecutionResult, error) {
	return NewStateProcessor(evm.Config(), evm.StateDB).Process(msg, evm)
}

// Process computes the new state by applying the given message against the
// old state.
//
// Process returns the receipt and the total gas used. If the transaction
- // failed, the receipt will be returned with a nil contract address.
func (p *StateProcessor) Process(msg Message, evm *vm.EVM) (*ExecutionResult, error) {
	var (
		res *ExecutionResult
		err error
	)
	// If the sender is a contract, prevent contracts from being created by the zero account.
	if evm.StateDB.GetCode(msg.From()) != nil {
		// This is the second time EIP-3607 is applied. The first time is during tx validation.
		// It is necessary to do it here because of contracts creating other contracts.
		if p.config.IsCancun(evm.BlockNumber, evm.Time) && msg.To() == nil {
			evm.StateDB.SetNonce(msg.From(), evm.StateDB.GetNonce(msg.From())+1)
		}
	}
	// It's important to do this check first, before calling evm.Send.
	// That's because it's quite possible for the EVM to run out of gas
	// while computing the intrinsic cost of a message.
	if err = p.subGas(msg, evm); err != nil {
		return nil, err
	}
	if msg.To() == nil {
		// Contract creation.
		res = p.execute(evm.NewContract, msg)
	} else {
		// Message call.
		res = p.execute(evm.Call, msg)
	}
	p.finalise(evm, res)
	return res, res.Err
}

// ...
func (p *StateProcessor) execute(call func(vm.ContractRef, []byte, uint64, *big.Int) ([]byte, uint64, error), msg Message) *ExecutionResult {
	var (
		ret  []byte
		err  error
		left = msg.Gas()
	)
	// Short circuit if there is no code.
	if msg.To() == nil && len(msg.Data()) == 0 {
		return &ExecutionResult{UsedGas: 0}
	}
	// Execute the message.
	if msg.To() == nil {
		// Contract creation.
		ret, _, left, err = call(vm.AccountRef(msg.From()), msg.Data(), left, msg.Value())
	} else {
		// Message call.
		ret, left, err = call(vm.AccountRef(msg.From()), *msg.To(), msg.Data(), left, msg.Value())
	}
	// The only possible error is ErrExecutionReverted, which is not treated as a transaction-
	// level error. The receipt status field will be set to 0.
	return &ExecutionResult{
		UsedGas: msg.Gas() - left,
		Err:     err,
		Return:  ret,
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/block_test.go">
```go
// BlockTest is the go-ethereum representation of a single block test from the
// ethereum/tests repository.
type BlockTest struct {
	Name       string
	Fork       string
	ForkBlocks ForkBlocks

	// Test case fields from the JSON file.
	Genesis *core.Genesis `json:"genesisBlockHeader"`
	Chain   []btBlock     `json:"blocks"`
	Last    struct {
		Hash common.Hash `json:"hash"`
	} `json:"lastblockhash"`
	Pre  core.GenesisAlloc `json:"pre"`
	Post core.GenesisAlloc `json:"postState"`
}

type btBlock struct {
	// Fields that can be RLP encoded.
	Header       *types.Header
	Transactions []*types.Transaction
	Uncles       []*types.Header
	Withdrawals  types.Withdrawals `rlp:"optional"`

	// Fields that can't be RLP encoded.
	Rlp hexutil.Bytes `json:"rlp"`

	// Exception fields.
	IncorrectlyDeclared     bool   `json:"expectException"`
	IncorrectlyDeclaredAt   string `json:"expectExceptionAt"`
	IncorrectlyDeclaredType string `json:"expectExceptionType"`
}

func (test *BlockTest) run(t *testing.T, vmconfig vm.Config, snapshotter bool) {
	// ... (setup) ...
	// Create a new blockchain with the genesis block.
	db := rawdb.NewMemoryDatabase()
	gspec := test.genesis()
	genesis := gspec.ToBlock(db)
	blocks, _ := core.GenerateChain(gspec.Config, genesis, ethash.NewFaker(), db, len(test.Chain), func(i int, gen *core.BlockGen) {
		// ...
		block := btb.toBlock(db)
		// ...
		gen.AddBlock(block)
	})

	// Create a new state database for testing.
	statedb, _ := state.New(genesis.Root(), state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	for addr, acc := range test.Pre {
		statedb.SetCode(addr, acc.Code)
		statedb.SetNonce(addr, acc.Nonce)
		statedb.SetBalance(addr, acc.Balance.ToInt())
		for key, val := range acc.Storage {
			statedb.SetState(addr, key, val)
		}
	}
	// ...

	// Create a new block chain and insert the test chain.
	var (
		blockchain *core.BlockChain
		err        error
	)
	// ... (snapshotter logic) ...
	if blockchain == nil {
		blockchain, _ = core.NewBlockChain(rawdb.NewMemoryDatabase(), nil, gspec.Config, ethash.NewFaker(), vm.Config{}, nil, nil)
	}
	defer blockchain.Stop()

	_, err = blockchain.InsertChain(blocks)
	
	// ... (exception checking) ...

	// Verify the final state against the given post-state.
	head := blockchain.CurrentBlock()
	if head.Hash() != test.Last.Hash {
		// ... error reporting ...
	}
	// If the post state is given, check it.
	if len(test.Post) > 0 {
		statedb, err = state.New(head.Root(), state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
		// ...
		checkError := statedb.CheckError()
		if checkError != nil {
			t.Fatalf("post-state DB error: %v", checkError)
		}
		if err := checkState(statedb, test.Post); err != nil {
			t.Errorf("post-state validation failed: %v", err)
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/transaction_test.go">
```go
// TransactionTest is the go-ethereum representation of a single transaction test from
// the ethereum/tests repository.
type TransactionTest struct {
	Name       string
	Fork       string
	ForkBlocks ForkBlocks
	Tests      map[string]ttPerCase
}

type ttPerCase struct {
	TxData []byte // data of the transaction to be tested
	Rlp    string `json:"rlp"` // RLP encoded transaction with signature

	// Pre-Homestead Execution Results
	GasPrice *big.Int    `json:"gasPrice"`
	Sender   common.Hash `json:"sender"`

	// Post-Homestead Execution Results
	Results map[string]ttResult `json:"results"`
}

type ttResult struct {
	Sender common.Address `json:"sender"`
	Hash   common.Hash    `json:"hash"`
	Err    string         `json:"intrinsicGas"`
}

// run runs the transaction test.
func (test *TransactionTest) run(t *testing.T) {
	for name, tt := range test.Tests {
		// ...
		for fork, want := range tt.Results {
			// ... (fork skipping logic) ...

			// Configure the chain rules for the given fork
			rules := test.genesis(fork).Config.Rules(big.NewInt(0), true, 0)

			// Decode the transaction, checking for RLP errors
			var tx types.Transaction
			if err := rlp.DecodeBytes(tt.TxData, &tx); err != nil {
				// ... error checking ...
			}
			// Validate the transaction against the given fork rules
			var from common.Address
			switch err := test.validateTx(rules, &tx); err.(type) {
			case nil:
				// Transaction is valid, get the sender
				from, _ = types.Sender(types.MakeSigner(test.genesis(fork).Config, big.NewInt(0)), &tx)
			// ... (error handling for invalid transactions) ...
			}
			// Check if the derived sender matches the expected one
			if from != want.Sender {
				t.Errorf("sender mismatch: have %x, want %x", from, want.Sender)
			}
			// Check if the derived hash matches the expected one
			if h := tx.Hash(); h != want.Hash {
				t.Errorf("hash mismatch: have %x, want %x", h, want.Hash)
			}
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)

	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes (https://github.com/ethereum/EIPs/issues/150)
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork, 0 = already activated)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = same as Constantinople)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork, 0 = already on istanbul)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Eip-2384 (bomb delay) switch block (nil = no fork, 0 = already activated)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork, 0 = already on berlin)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork, 0 = already on london)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Eip-4345 (bomb delay) switch block (nil = no fork, 0 = already activated)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Eip-5133 (bomb delay) switch block (nil = no fork, 0 = already activated)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use as a network splitter

	// Fork scheduling was switched from blocks to timestamps here

	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"` // Shanghai switch time (nil = no fork, 0 = already on shanghai)
	CancunTime   *uint64 `json:"cancunTime,omitempty"`   // Cancun switch time (nil = no fork, 0 = already on cancun)
	PragueTime   *uint64 `json:"pragueTime,omitempty"`   // Prague switch time (nil = no fork, 0 = already on prague)
	// ... more forks ...

	// Various consensus engines
	Ethash             *EthashConfig       `json:"ethash,omitempty"`
	Clique             *CliqueConfig       `json:"clique,omitempty"`
	BlobScheduleConfig *BlobScheduleConfig `json:"blobSchedule,omitempty"`
}

// IsShanghai returns whether time is either equal to the Shanghai fork time or greater.
func (c *ChainConfig) IsShanghai(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.ShanghaiTime, time)
}

// IsCancun returns whether time is either equal to the Cancun fork time or greater.
func (c *ChainConfig) IsCancun(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.CancunTime, time)
}

// isTimestampForked returns whether a fork scheduled at timestamp s is active
// at the given head timestamp. Whilst this method is the same as isBlockForked,
// they are explicitly separate for clearer reading.
func isTimestampForked(s *uint64, head uint64) bool {
	if s == nil {
		return false
	}
	return *s <= head
}

// Rules returns the rule set of the chain passed to the EVM at a certain block number.
// The Rules contains the EVM hard fork switch activating/deactivating features according
// to the configured chain configuration.
//
// Rules is a one time interface meaning that it shouldn't be used in between transition
// phases.
func (c *ChainConfig) Rules(num *big.Int, isMerge bool, timestamp uint64) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	// disallow setting Merge out of order
	isMerge = isMerge && c.IsLondon(num)
	isVerkle := isMerge && c.IsVerkle(num, timestamp)
	return Rules{
		ChainID:          new(big.Int).Set(chainID),
		IsHomestead:      c.IsHomestead(num),
		IsEIP150:         c.IsEIP150(num),
		IsEIP155:         c.IsEIP155(num),
		IsEIP158:         c.IsEIP158(num),
		IsByzantium:      c.IsByzantium(num),
		IsConstantinople: c.IsConstantinople(num),
		IsPetersburg:     c.IsPetersburg(num),
		IsIstanbul:       c.IsIstanbul(num),
		IsBerlin:         c.IsBerlin(num),
		IsEIP2929:        c.IsBerlin(num) && !isVerkle,
		IsLondon:         c.IsLondon(num),
		IsMerge:          isMerge,
		IsShanghai:       isMerge && c.IsShanghai(num, timestamp),
		IsCancun:         isMerge && c.IsCancun(num, timestamp),
		IsPrague:         isMerge && c.IsPrague(num, timestamp),
		IsOsaka:          isMerge && c.IsOsaka(num, timestamp),
		IsVerkle:         isVerkle,
		IsEIP4762:        isVerkle,
	}
}
```
</file>
</go-ethereum>

---

This is an excellent and well-structured prompt for implementing a consensus test suite. The go-ethereum codebase provides a perfect reference implementation for this task. The most relevant snippets are those that show how Geth parses the test files, sets up the state, executes transactions/blocks, and validates the results.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test.go">
```go
// This file contains the primary logic for running Ethereum State Tests.
// It demonstrates how to parse the test files, set up the pre-state,
// execute a transaction, and validate the post-state against expectations
// for various forks. This is the most critical reference for implementing
// `StateTestExecutor`.

// StateTest are tests that check the execution of a single transaction.
type StateTest struct {
	json stJSON
}

// stJSON is the JSON structure of a state test.
type stJSON struct {
	Env  *params.ChainConfig `json:"env"`
	Pre  core.GenesisAlloc   `json:"pre"`
	Tx   stTransaction       `json:"transaction"`
	Post stPostState         `json:"post"`
}

// stPostState is the structure of the post-state of a state test.
type stPostState map[string][]stPostStateAccount

// stPostStateAccount is the structure of a single account in the post-state of a state test.
type stPostStateAccount struct {
	Root    common.Hash    `json:"hash"`
	Logs    common.Hash    `json:"logs"`
	TxBytes hexutil.Bytes  `json:"txbytes"`
	Indexes stPostIndexes `json:"indexes"`
}

// stTransaction is the structure of the transaction in a state test.
type stTransaction struct {
	Data                hexutil.Bytes         `json:"data"`
	GasLimit            hexutil.Uint64        `json:"gasLimit"`
	GasPrice            *hexutil.Big          `json:"gasPrice"`
	MaxFeePerGas        *hexutil.Big          `json:"maxFeePerGas"`
	MaxPriorityFeePerGas *hexutil.Big          `json:"maxPriorityFeePerGas"`
	Nonce               hexutil.Uint64        `json:"nonce"`
	To                  *common.Address       `json:"to"`
	Value               *hexutil.Big          `json:"value"`
	VS                  *hexutil.Big          `json:"v"`
	RS                  *hexutil.Big          `json="r"`
	SS                  *hexutil.Big          `json:"s"`
	Sender              common.Address        `json:"sender"`
	AccessLists         []*types.AccessList   `json:"accessLists,omitempty"`
	BlobVersionedHashes []common.Hash         `json:"blobVersionedHashes,omitempty"`
	MaxFeePerBlobGas    *hexutil.Big          `json:"maxFeePerBlobGas,omitempty"`
	BlobGasUsed         *hexutil.Uint64       `json:"blobGasUsed,omitempty"`
	ExcessBlobGas       *hexutil.Uint64       `json:"excessBlobGas,omitempty"`
	Type                hexutil.Uint64        `json:"type"`
	SecretKey           *crypto.PrivateKey    `json:"secretKey"`
}

// Run executes the state test and verifies the post-state.
func (t *StateTest) Run(vmconfig vm.Config, snapshot bool) ([]error, error) {
	// ... (some setup code)

	// This is the core logic. It iterates through the forks defined in the "post" section.
	for h, posts := range t.json.Post {
		// ... (logic to skip forks)

		// Create a new state database for this fork run.
		preState := t.json.Pre.convertToGeth()
		statedb, _ := state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
		for addr, acc := range preState {
			statedb.SetNonce(addr, acc.Nonce)
			statedb.SetBalance(addr, acc.Balance)
			statedb.SetCode(addr, acc.Code)
			for k, v := range acc.Storage {
				statedb.SetState(addr, k, v)
			}
		}
		// Commit the pre-state to get a root hash.
		preRoot := statedb.IntermediateRoot(rules.IsEIP158)

		// Create the block context from the "env" section of the test.
		block := t.genesis(h).ToBlock(statedb.Db())
		vmenv := t.makeEnv(block.Header(), statedb)

		// Apply the transaction to the state.
		tx, err := t.json.Tx.toMessage(rules, t.json.Env)
		// ... (error handling)
		result, err := core.ApplyMessage(vmenv, tx, new(core.GasPool).AddGas(tx.Gas()))
		// ... (error handling)

		// The test passes if the new state root and log hash match the expected values.
		for i, post := range posts {
			// Compare the calculated state root with the expected one.
			root := statedb.IntermediateRoot(rules.IsEIP158)
			if root != post.Root {
				errs = append(errs, fmt.Errorf("post-state root mismatch: got %x, want %x", root, post.Root))
			}
			// Compare the calculated log hash with the expected one.
			if logs := types.LogsToHash(result.Logs); logs != post.Logs {
				errs = append(errs, fmt.Errorf("post-state log hash mismatch: got %x, want %x", logs, post.Logs))
			}
		}
	}
	return errs, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/block_test.go">
```go
// This file contains the logic for running Blockchain Tests.
// It shows how to initialize a chain from a genesis block, process a
// series of blocks (including invalid ones), and verify the final state.
// This is the primary reference for `BlockchainTestExecutor`.

// BlockTest checks the validity of a blockchain.
type BlockTest struct {
	json btJSON
}

type btJSON struct {
	Blocks    []btBlock   `json:"blocks"`
	Genesis   btHeader    `json:"genesisBlockHeader"`
	LastBlock common.Hash `json:"lastblockhash"`
	Pre       core.GenesisAlloc `json:"pre"`
	Post      core.GenesisAlloc `json:"postState"`
	Network   string            `json:"network"`
}

type btBlock struct {
	Header       *btHeader
	Transactions []*stTransaction
	UncleHeaders []*btHeader
	Withdrawals  []*types.Withdrawal
	RLP          string
	Error        string
}

// Run executes the block test.
func (t *BlockTest) Run() error {
	// Create the blockchain based on the provided genesis.
	g := t.json.Genesis.toGeth(t.json.Pre)
	engine := ethash.NewFaker()
	db := rawdb.NewMemoryDatabase()
	chain, _, err := core.GenerateChainWithGenesis(g.Config, g.ToBlock(db), engine, 0, func(i int, b *core.BlockGen) {})
	if err != nil {
		return err
	}
	// Insert all the blocks into the chain, potentially creating forks
	for i, b := range t.json.Blocks {
		block, err := b.toGeth(g.Config, chain)
		if err != nil {
			// ... (error handling for block RLP decoding)
		}
		// Try to insert the block and check the error against expectations.
		_, err = chain.InsertChain(types.Blocks{block})

		if b.Error == "" {
			if err != nil {
				return fmt.Errorf("block %d: unexpected error: %v", i+1, err)
			}
		} else {
			// ... (error message comparison)
		}
	}

	// After all blocks have been processed, check the final state against the expected one.
	if len(t.json.Post) > 0 {
		statedb, err := chain.State()
		if err != nil {
			return err
		}
		if err := checkState(statedb, t.json.Post); err != nil {
			return err
		}
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/transaction_test.go">
```go
// This file contains the logic for running Transaction Tests.
// These tests focus on validating the intrinsic properties of a transaction,
// such as its signature and format, for different forks without executing it
// in the VM. This is the main reference for `TransactionTestExecutor`.

// TransactionTest checks the validity of a single transaction.
type TransactionTest struct {
	json ttJSON
}

type ttJSON struct {
	Tx *stTransaction              `json:"transaction"`
	RLP string                     `json:"rlp"`
	Result map[string]ttResult     `json:"result"`
}

type ttResult struct {
	Sender         common.Address `json:"sender"`
	Hash           common.Hash    `json:"hash"`
	IntrinsicGas   hexutil.Uint64 `json:"intrinsicGas"`
	ExceptionalErr string         `json:"exceptional_error"`
}

// Run executes the transaction test.
func (t *TransactionTest) Run() map[string]error {
	// ... (setup code)

	for name, res := range t.json.Result {
		// Configure the chain rules for the specific fork.
		config, _, _ := tests.GetChainConfig(name)
		if config == nil {
			// ... (skip unsupported forks)
		}
		// Create a new transaction from the test data.
		tx, err := t.json.Tx.toTransaction(config)
		if err != nil {
			// ... (handle error)
		}

		// Check the sender address against the expected one.
		// This validates the transaction signature.
		signer := types.MakeSigner(config, big.NewInt(0), 0)
		sender, err := types.Sender(signer, tx)
		if err != nil {
			// ... (handle error)
		}
		if sender != res.Sender {
			errs[name] = fmt.Errorf("sender mismatch: got %x, want %x", sender, res.Sender)
			continue
		}

		// Validate intrinsic gas.
		gas, err := core.IntrinsicGas(tx.Data(), tx.AccessList(), tx.To() == nil, true, true, false)
		if err != nil {
			// ... (handle error)
		}
		if uint64(res.IntrinsicGas) != gas {
			errs[name] = fmt.Errorf("intrinsic gas mismatch: got %d, want %d", gas, res.IntrinsicGas)
			continue
		}
	}
	return errs
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// This file contains the `ApplyTransaction` function, which is the high-level
// entry point for processing a single transaction against a given state.
// It is the core function that a `StateTestExecutor` should aim to replicate.

// ApplyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment. It returns the receipt
// for the transaction, the used gas, and an error if the transaction fails,
// indicating the block was invalid.
func (p *StateProcessor) ApplyTransaction(block *types.Block, statedb *state.StateDB, gp *GasPool, tx *types.Transaction, usedGas *uint64, cfg vm.Config) (*types.Receipt, error) {
	// Convert the transaction into a message.
	msg, err := TransactionToMessage(tx, p.signer, block.BaseFee())
	if err != nil {
		return nil, fmt.Errorf("failed to create message: %w", err)
	}

	// Create the EVM and tracing hooks.
	blockContext := NewEVMBlockContext(block.Header(), p.bc, nil)
	// ... (handle beacon chain specific logic like EIP-4788) ...
	vmenv := vm.NewEVM(blockContext, statedb, p.config, cfg)

	// Apply the transaction to the current state (included in the env).
	result, err := ApplyMessage(vmenv, msg, gp)
	if err != nil {
		return nil, err
	}

	// Update the state with pending changes.
	statedb.Finalise(p.config.IsEIP158(block.Number()))
	*usedGas += result.UsedGas

	// Create a new receipt for the transaction, storing the intermediate root and gas used
	// by the transaction.
	receipt := types.NewReceipt(statedb.IntermediateRoot(p.config.IsEIP158(block.Number())).Bytes(), result.Failed(), *usedGas)
	receipt.TxHash = tx.Hash()
	receipt.GasUsed = result.UsedGas
	// ... (more receipt fields setup) ...

	return receipt, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/harness.go">
```go
// This file shows how Geth discovers, filters, and runs the consensus tests.
// It's a useful reference for implementing the main test runner framework (`test_runner.zig`).
// Note the logic for walking directories and skipping tests based on the current fork.

// RunStateTests runs all state tests in a given folder.
func RunStateTests(t *testing.T, folder string, vmconfig vm.Config) {
	// ... (setup code)

	// Gather all the tests, but some might be flaky
	for _, file := range tests {
		// ...
		t.Run(file.name, func(t *testing.T) {
			t.Parallel() // <-- This shows tests are run in parallel.
			// ...
			st := new(StateTest)
			if err := st.UnmarshalJSON(file.content); err != nil {
				// ...
			}
			// Run the actual test.
			errs, err := st.Run(vmconfig, snapshot)
			// ...
		})
	}
}

// AllGenesisConfigs contains all chain configs for running tests.
var AllGenesisConfigs = map[string]*params.ChainConfig{
	"Frontier":          params.TestChainConfig,
	"Homestead":         params.TestChainConfig,
	// ... many more fork configs
	"Cancun":            params.TestChainConfig,
}

// skipTest returns true if a test should be skipped.
// Certain tests are meant to be skipped depending on the chain configuration.
func skipTest(path string, config *params.ChainConfig) (reason string, result bool) {
	// ... (logic to skip specific known-bad tests)

	// Skip any tests that require forks not active in the current config.
	for _, rule := range strings.Split("Frontier Homestead DAO EIP150 EIP158 Byzantium Constantinople Petersburg Istanbul Berlin London", " ") {
		if strings.Contains(path, rule+"To") {
			if !config.IsHomestead(common.Big0) { // replace with actual fork check
				return fmt.Sprintf("test requires fork %s", rule), true
			}
		}
	}
	return "", false
}
```
</file>
</go-ethereum>

---

An excellent and detailed prompt. Implementing a compliant consensus test runner is a cornerstone of any robust EVM implementation. The go-ethereum (`geth`) codebase provides a mature and battle-tested reference for this task.

Here are the most relevant code snippets from go-ethereum that will guide your implementation of the test runner, state/blockchain test executors, and parsers.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test.go">
```go
// This file contains the primary logic for running State Tests from the ethereum/tests suite.
// It shows how to parse the test, set up the pre-state, create the EVM environment,
// apply the transaction, and validate the post-state. This is the direct equivalent
// of your `StateTestExecutor`.

// StateTest are tests that check the execution of a single transaction.
type StateTest struct {
	json stJSON
}

// stJSON is the JSON structure of a state test.
type stJSON struct {
	Env         core.GenesisEnv          `json:"env"           gencodec:"required"`
	Pre         core.GenesisAlloc        `json:"pre"           gencodec:"required"`
	Transaction stTransaction            `json:"transaction"   gencodec:"required"`
	Post        map[string][]stPostState `json:"post"          gencodec:"required"`
}

// stPostState is the JSON structure of a post-state hash reference.
type stPostState struct {
	Root    common.Hash       `json:"hash"    gencodec:"required"`
	Logs    common.Hash       `json:"logs"    gencodec:"required"`
	TxBytes hexutil.Bytes     `json:"txbytes" gencodec:"required"`
	Expects []stExpectation   `json:"expect"`
	Indexes stCallCreateIndex `json:"indexes"`
}

// Run executes the state test.
func (t *StateTest) Run(subtest *testing.T, vmConfig vm.Config, snapshotter bool) {
	for name, postStates := range t.json.Post {
		for i, st := range postStates {
			// This is the core loop. It iterates through each fork defined in the "post"
			// section of the test file.
			subtest.Run(fmt.Sprintf("%s/%d", name, i), func(subtest *testing.T) {
				// Get the chain config for the given fork. Your implementation will need a
				// similar mechanism to map fork names to your `ChainRules` struct.
				config, ok := Forks[name]
				if !ok {
					subtest.Fatalf("config %q not found", name)
				}
				// Create an in-memory database for the test.
				db := rawdb.NewMemoryDatabase()
				// Create the state database from the "pre" section.
				// Your `setup_pre_state` function should do this.
				gspec := &core.Genesis{
					Config:    config,
					Alloc:     t.json.Pre,
					BaseFee:   t.json.Env.BaseFee,
					GasLimit:  t.json.Env.GasLimit,
					Number:    t.json.Env.Number,
					Timestamp: t.json.Env.Timestamp,
				}
				statedb, _ := state.New(common.Hash{}, state.NewDatabase(db), nil)
				for addr, acc := range gspec.Alloc {
					statedb.SetBalance(addr, acc.Balance)
					statedb.SetCode(addr, acc.Code)
					statedb.SetNonce(addr, acc.Nonce)
					for key, val := range acc.Storage {
						statedb.SetState(addr, key, val)
					}
				}
				// Commit the pre-state.
				root, err := statedb.Commit(config.IsEIP158(gspec.Number))
				if err != nil {
					subtest.Fatalf("pre-state commit failed: %v", err)
				}

				// Create the transaction from the "transaction" section.
				tx, err := t.json.Transaction.toMessage(st.Indexes, config)
				if err != nil {
					subtest.Fatal(err)
				}
				// Set up the EVM environment from the "env" section.
				// This directly corresponds to your `setup_environment` function.
				bctx := core.NewEVMBlockContext(gspec.ToHeader(), nil, &t.json.Env.Coinbase)
				if config.IsCancun(bctx.Number, bctx.Time) {
					bctx.ExcessBlobGas = &t.json.Env.ExcessBlobGas
					bctx.BlobBaseFee = eip4844.CalcBlobFee(t.json.Env.ExcessBlobGas)
				}
				if config.IsShanghai(bctx.Number, bctx.Time) && t.json.Env.Withdrawals != nil {
					bctx.Withdrawals = t.json.Env.Withdrawals
				}
				if config.IsPrague(bctx.Number, bctx.Time) {
					bctx.ParentBeaconBlockRoot = &t.json.Env.ParentBeaconRoot
				}
				// Create and apply the transaction. This is the core execution step.
				evm := vm.NewEVM(bctx, vm.TxContext{}, statedb, config, vmConfig)
				evm.SetOption(vm.ConsensusTest, nil)

				gp := new(core.GasPool).AddGas(tx.GasLimit)
				result, err := core.ApplyMessage(evm, tx, gp)
				if err != nil {
					// Handle expected exceptions. Some tests are designed to fail.
					if exp, ok := st.expectException(); ok && strings.Contains(err.Error(), exp) {
						return
					}
					subtest.Fatalf("unexpected error: %v", err)
				}
				// Finalize the state to get the post-state root.
				// Your implementation will need to get the final state from the VM.
				statedb.Finalise(true)

				// Validate the results against the "post" section.
				// This is the logic for your `compare_states` function.
				// Check post-state root hash.
				root = statedb.IntermediateRoot(config.IsEIP158(gspec.Number))
				if root != st.Root {
					subtest.Errorf("post-state root mismatch: got %x, want %x", root, st.Root)
				}
				// Check logs hash.
				logHash := types.DeriveSha(types.Receipts{result.Receipt()}, trie.NewStackTrie(nil))
				if logHash != st.Logs {
					subtest.Errorf("post-state log hash mismatch: got %x, want %x", logHash, st.Logs)
				}
			})
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/blockchain_test.go">
```go
// This file contains the logic for running Blockchain Tests. These are more complex
// than state tests as they involve processing a sequence of blocks. It demonstrates
// how to set up a genesis block, create a test blockchain, and insert subsequent blocks.

type BlockchainTest struct {
	json bcJSON
}

type bcJSON struct {
	GenesisBlockHash common.Hash       `json:"genesisBlockHash"`
	GenesisRLP       hexutil.Bytes     `json:"genesisRLP"`
	Blocks           []bcBlock         `json:"blocks"`
	LastBlockHash    common.Hash       `json:"lastblockhash"`
	Network          string            `json:"network"`
	PostState        *core.GenesisAlloc `json:"postState"`
	Pre              core.GenesisAlloc `json:"pre"`
}

type bcBlock struct {
	Rlp            string        `json:"rlp"`
	Header         *types.Header `json:"blockHeader"`
	Txs            []*types.Transaction
	Uncles         []*types.Header
	Blocknumber    *hexutil.Big
	ExpectException string `json:"expectException"`
}

// Run executes the blockchain test.
func (t *BlockchainTest) Run(subtest *testing.T) {
	// Get the chain config for the specified network.
	config, ok := Forks[t.json.Network]
	if !ok {
		subtest.Fatalf("config %q not found", t.json.Network)
	}
	// Create the genesis block specification.
	gspec := &core.Genesis{
		Config: config,
		Alloc:  t.json.Pre,
	}
	if t.json.Network == "ConstantinopleFix" {
		// A special case for a test that needs a lower block number.
		gspec.Number = big.NewInt(4370000 - 1)
	}
	// Set up the test blockchain with an in-memory database.
	db := rawdb.NewMemoryDatabase()
	genesis := gspec.MustCommit(db)
	if genesis.Hash() != t.json.GenesisBlockHash {
		subtest.Fatalf("genesis block hash doesn't match, got %x, want %x", genesis.Hash(), t.json.GenesisBlockHash)
	}
	blockchain, _ := core.NewBlockChain(db, nil, gspec, ethash.NewFaker(), vm.Config{}, nil, nil)
	defer blockchain.Stop()

	// This is the core loop that processes each block from the test file.
	var (
		blocks []*types.Block
		hashes []common.Hash
	)
	for i, b := range t.json.Blocks {
		block, err := b.makeBlock(blockchain, config)
		if err != nil {
			subtest.Fatalf("block #%d: makeBlock failed: %v", i+1, err)
		}
		// Insert the block into the chain.
		_, err = blockchain.InsertChain(types.Blocks{block})
		// Check if an exception was expected. Some tests verify that invalid blocks are rejected.
		if b.ExpectException != "" {
			if err == nil {
				subtest.Fatalf("block #%d: expected exception %q, but got none", i+1, b.ExpectException)
			}
			if !strings.Contains(err.Error(), b.ExpectException) {
				subtest.Fatalf("block #%d: exception mismatch: got %q, want %q", i+1, err, b.ExpectException)
			}
			// If an exception was expected and occurred, the test for this branch is over.
			return
		}
		// ... error handling ...
		blocks = append(blocks, block)
		hashes = append(hashes, block.Hash())
	}
	// After processing all blocks, validate the final state.
	if t.json.PostState != nil {
		// This helper function does the final validation.
		validatePostState(subtest, blockchain, t.json.LastBlockHash, *t.json.PostState)
	}
}

// validatePostState checks if the given account is present in the state of the last
// block and that it matches the post state of the test case.
// This is the equivalent of your post-state validation for blockchain tests.
func validatePostState(t *testing.T, bc *core.BlockChain, lastBlockHash common.Hash, wantAccounts core.GenesisAlloc) {
	// Get the state DB for the head of the chain.
	statedb, err := bc.StateAt(bc.CurrentBlock().Root)
	if err != nil {
		t.Fatal("could not get state DB:", err)
	}

	// Iterate over expected accounts and compare them to the actual state.
	for addr, want := range wantAccounts {
		// Check balance
		if have := statedb.GetBalance(addr); have.Cmp(want.Balance) != 0 {
			t.Errorf("account %x: balance mismatch: have %v, want %v", addr, have, want.Balance)
		}
		// Check nonce
		if have := statedb.GetNonce(addr); have != want.Nonce {
			t.Errorf("account %x: nonce mismatch: have %v, want %v", addr, have, want.Nonce)
		}
		// Check code
		if have := statedb.GetCode(addr); !bytes.Equal(have, want.Code) {
			t.Errorf("account %x: code mismatch: have %x, want %x", addr, have, want.Code)
		}
		// Check storage
		if len(want.Storage) > 0 {
			for key, wantval := range want.Storage {
				if have := statedb.GetState(addr, key); have != wantval {
					t.Errorf("account %x, storage %x: value mismatch: have %x, want %x", addr, key, have, wantval)
				}
			}
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/transaction_test.go">
```go
// This file runs Transaction Tests, which focus on transaction validation rules
// (e.g., signatures, intrinsic gas) *before* execution. This is simpler than
// a state test as it doesn't require a full VM execution.

type TransactionTest struct {
	json ttJSON
}

type ttJSON struct {
	RLP       hexutil.Bytes `json:"rlp"`
	GasPrice  *hexutil.Big  `json:"gasPrice"`
	Nonce     hexutil.Uint64
	GasLimit  hexutil.Uint64
	Value     *hexutil.Big
	Data      hexutil.Bytes
	To        *common.Address
	V, R, S   *hexutil.Big
	Sender    *common.Address `json:"sender"`
	BlockHash common.Hash     `json:"blockhash"`

	// These are maps from fork name to map value. The inner map value is the
	// actual test case.
	Valid    map[string]map[string]string `json:"valid"`
	Invalid  map[string]map[string]string `json:"invalid"`
	Result   map[string]ttResult          `json:"result"`
	Post     map[string][]stPostState     `json:"post"`
	Env      *core.GenesisEnv             `json:"env"`
	CallData []callAndResult              `json:"callcreates"`
}

type ttResult struct {
	Sender       common.Address `json:"sender"`
	IntrinsicGas hexutil.Uint64 `json:"intrinsicGas"`
	Hash         common.Hash    `json:"hash"`
}

// Run executes the transaction test.
func (t *TransactionTest) Run(subtest *testing.T) {
	// This is the core validation loop. It iterates through each fork defined in the test.
	for forkName, results := range t.json.Result {
		// Find the chain config for the given fork.
		config, ok := Forks[forkName]
		if !ok {
			subtest.Fatalf("config %q not found", forkName)
		}
		subtest.Run(forkName, func(subtest *testing.T) {
			// Create a transaction object from the test data.
			tx, err := t.json.tx()
			if err != nil {
				// Handle cases where transaction RLP is designed to be invalid.
				if exp, ok := t.json.expectException(); ok && strings.Contains(err.Error(), exp) {
					return
				}
				subtest.Fatal(err)
			}
			// This is the key part for transaction tests: deriving the sender from the signature.
			// Your implementation will need a similar function to validate signatures and recover the sender.
			signer := types.MakeSigner(config, t.json.envNumber())
			sender, err := types.Sender(signer, tx)
			if err != nil {
				// Handle expected signature validation errors.
				if exp, ok := t.json.expectException(); ok && strings.Contains(err.Error(), exp) {
					return
				}
				subtest.Fatalf("Sender error: %v", err)
			}
			// Validate the recovered sender against the expected sender.
			if sender != results.Sender {
				subtest.Errorf("sender mismatch: got %x, want %x", sender, results.Sender)
			}
			// Validate the transaction hash.
			if h := tx.Hash(); h != results.Hash {
				subtest.Errorf("hash mismatch: got %x, want %x", h, results.Hash)
			}
			// Validate intrinsic gas cost. This is an important pre-execution check.
			gas, err := core.IntrinsicGas(tx.Data(), tx.AccessList(), tx.To() == nil, true, true, config.IsCancun(t.json.envNumber(), t.json.envTimestamp()))
			if err != nil {
				subtest.Fatalf("failed to compute intrinsic gas: %v", err)
			}
			if gas != uint64(results.IntrinsicGas) {
				subtest.Errorf("intrinsic gas mismatch: got %d, want %d", gas, results.IntrinsicGas)
			}
		})
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// ApplyMessage computes the new state by applying the given message against the
// current state. It is the core of the EVM and it is what must be called to
// execute a transaction.
//
// ApplyMessage returns the receipt, the remaining gas, and an error if it failed.
// An error always indicates a core error meaning that the message would always
// fail for that particular state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg Message, gp *GasPool) (*types.Receipt, error) {
	return NewStateProcessor(evm.Config, evm.Chain, evm.Engine).process(msg, evm.StateDB, gp)
}

// process is the heart of the state transition and is what needs to be run when a
// transaction is executed. It's important to note that the contracts provided
// here are without value. Do not use this method in production systems.
func (p *StateProcessor) process(msg Message, statedb *state.StateDB, gp *GasPool) (*types.Receipt, error) {
	var (
		err       error
		res       *ExecutionResult
		sender    = vm.AccountRef(msg.From())
		homestead = p.config.IsHomestead(p.header.Number)
		istanbul  = p.config.IsIstanbul(p.header.Number)
		london    = p.config.IsLondon(p.header.Number)
	)

	// ... [gas and pre-check logic] ...

	// Create a new context for this transaction.
	p.evm.TxContext = NewEVMTxContext(msg)

	// In the case of a contract creation, create a new account with the contract
	// code and call the constructor.
	if msg.To() == nil {
		res, _, p.evm.Gas, err = p.evm.Create(sender, msg.Data(), msg.Gas(), msg.Value())
	} else {
		// In the case of a message call, transfer value and execute the contract code.
		statedb.SetNonce(msg.From(), statedb.GetNonce(msg.From())+1)
		res, p.evm.Gas, err = p.evm.Call(sender, *msg.To(), msg.Data(), msg.Gas(), msg.Value())
	}

	// ... [gas refund and receipt creation logic] ...

	// Create a new receipt for the transaction, storing the intermediate root and gas usage.
	receipt := &types.Receipt{
		Type:              msg.Type(),
		PostState:         statedb.IntermediateRoot(p.config.IsEIP158(p.header.Number)).Bytes(),
		CumulativeGasUsed: p.cumulativeGasUsed,
		GasUsed:           usedGas,
	}
	// If the transaction created a contract, store the creation address in the receipt.
	if msg.To() == nil {
		receipt.ContractAddress = res.ReturnData
	}
	// Set the receipt status, log and bloom.
	receipt.Logs = statedb.GetLogs(txHash)
	receipt.Bloom = types.CreateBloom(types.Receipts{receipt})
	receipt.TxHash = txHash
	if err != nil {
		receipt.Status = types.ReceiptStatusFailed
	} else {
		receipt.Status = types.ReceiptStatusSuccessful
	}
	return receipt, err
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt is very well-structured and provides excellent, detailed requirements for a Zig implementation. There are no significant errors. The provided Zig structs map cleanly to the JSON test formats used by go-ethereum and the broader Ethereum ecosystem.

One minor point of clarification for your implementation:

*   **Fork-Specific Logic**: The `post` section of state tests is a map where keys are fork names (e.g., "Berlin", "London"). Your test runner will need a mechanism to identify the current fork being tested and select the correct expected `post` state from this map. The go-ethereum `StateTest.Run` function demonstrates this by iterating through the `Post` map and using the key (`name`) to load the correct `params.ChainConfig`. Your implementation should do the same with its `ChainRules`.


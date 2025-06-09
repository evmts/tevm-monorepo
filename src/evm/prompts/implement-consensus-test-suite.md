# Implement Consensus Test Suite

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_consensus_test_suite` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_consensus_test_suite feat_implement_consensus_test_suite`
3. **Work in isolation**: `cd g/feat_implement_consensus_test_suite`
4. **Commit message**: `✨ feat: implement Ethereum consensus test suite integration and compliance framework`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive Ethereum consensus test suite integration to ensure 100% compatibility with the official Ethereum specification. This includes state tests, blockchain tests, transaction tests, and difficulty tests from the ethereum/tests repository. The implementation should provide automated test discovery, execution, and reporting to catch any regressions or compatibility issues.

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test accuracy** - Results must exactly match official Ethereum behavior
3. **Performance** - Handle large test suites (10,000+ tests) efficiently
4. **Memory safety** - No memory leaks during long test runs
5. **Error handling** - Graceful failure handling and clear error reporting
6. **CI integration** - Ready for automated testing in continuous integration

## References

- [Ethereum Tests Repository](https://github.com/ethereum/tests) - Official test suite
- [EIP-3155: EVM trace specification](https://eips.ethereum.org/EIPS/eip-3155) - Tracing format
- [Ethereum Test Formats](https://ethereum-tests.readthedocs.io/) - Test documentation
- [Geth Test Runner](https://github.com/ethereum/go-ethereum/tree/master/tests) - Reference implementation
- [Besu Test Runner](https://github.com/hyperledger/besu/tree/main/ethereum/core/src/test/java/org/hyperledger/besu/ethereum/vm) - Alternative implementation
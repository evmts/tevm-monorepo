const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const HashMap = std.HashMap;

const TestParser = @import("test_parser.zig");
const StateTest = TestParser.StateTest;
const TestAccount = TestParser.TestAccount;
const TestEnvironment = TestParser.TestEnvironment;
const TestTransaction = TestParser.TestTransaction;

pub const StateTestExecutorError = error{
    ExecutionFailed,
    StateValidationFailed,
    InvalidTransaction,
    PreStateSetupFailed,
    PostStateValidationFailed,
    OutOfMemory,
    InvalidTestData,
    UnsupportedFork,
};

pub const ExecutionResult = struct {
    success: bool,
    gas_used: u64,
    return_data: []const u8,
    logs: []EventLog,
    error_message: ?[]const u8,
    
    pub const EventLog = struct {
        address: [20]u8,
        topics: []u256,
        data: []const u8,
        
        pub fn deinit(self: *EventLog, allocator: Allocator) void {
            allocator.free(self.topics);
            allocator.free(self.data);
        }
    };
    
    pub fn deinit(self: *ExecutionResult, allocator: Allocator) void {
        if (self.return_data.len > 0) {
            allocator.free(self.return_data);
        }
        if (self.logs.len > 0) {
            for (self.logs) |*log| {
                log.deinit(allocator);
            }
            allocator.free(self.logs);
        }
        if (self.error_message) |msg| {
            allocator.free(msg);
        }
    }
};

pub const StateTestResult = struct {
    test_name: []const u8,
    fork_results: HashMap([]const u8, ForkTestResult, std.hash_map.StringContext, std.hash_map.default_max_load_percentage),
    
    pub const ForkTestResult = struct {
        fork_name: []const u8,
        index_results: ArrayList(IndexTestResult),
        
        pub const IndexTestResult = struct {
            index: usize,
            execution_result: ExecutionResult,
            state_match: bool,
            validation_errors: ArrayList([]const u8),
            
            pub fn deinit(self: *IndexTestResult, allocator: Allocator) void {
                self.execution_result.deinit(allocator);
                for (self.validation_errors.items) |error_msg| {
                    allocator.free(error_msg);
                }
                self.validation_errors.deinit();
            }
        };
        
        pub fn deinit(self: *ForkTestResult, allocator: Allocator) void {
            allocator.free(self.fork_name);
            for (self.index_results.items) |*result| {
                result.deinit(allocator);
            }
            self.index_results.deinit();
        }
    };
    
    pub fn deinit(self: *StateTestResult, allocator: Allocator) void {
        allocator.free(self.test_name);
        var iterator = self.fork_results.iterator();
        while (iterator.next()) |entry| {
            allocator.free(entry.key_ptr.*);
            entry.value_ptr.deinit(allocator);
        }
        self.fork_results.deinit();
    }
};

pub const StateTestExecutor = struct {
    allocator: Allocator,
    
    pub fn init(allocator: Allocator) StateTestExecutor {
        return StateTestExecutor{
            .allocator = allocator,
        };
    }
    
    pub fn execute_state_test(self: *StateTestExecutor, state_test: *const StateTest) StateTestExecutorError!StateTestResult {
        std.log.debug("StateTestExecutor.execute_state_test: Starting execution of test '{s}'", .{state_test.name});
        
        var result = StateTestResult{
            .test_name = try self.allocator.dupe(u8, state_test.name),
            .fork_results = HashMap([]const u8, StateTestResult.ForkTestResult, std.hash_map.StringContext, std.hash_map.default_max_load_percentage).init(self.allocator),
        };
        errdefer result.deinit(self.allocator);
        
        // Execute test for each fork in post state
        var post_iterator = state_test.post.iterator();
        while (post_iterator.next()) |entry| {
            const fork_name = entry.key_ptr.*;
            const expected_post_state = entry.value_ptr.*;
            
            std.log.debug("StateTestExecutor.execute_state_test: Executing for fork '{s}'", .{fork_name});
            
            const fork_result = try self.execute_fork_test(state_test, fork_name, expected_post_state);
            const fork_name_copy = try self.allocator.dupe(u8, fork_name);
            try result.fork_results.put(fork_name_copy, fork_result);
        }
        
        return result;
    }
    
    fn execute_fork_test(
        self: *StateTestExecutor,
        state_test: *const StateTest,
        fork_name: []const u8,
        expected_post_state: *const HashMap([20]u8, TestAccount, std.hash_map.AutoContext([20]u8), std.hash_map.default_max_load_percentage)
    ) StateTestExecutorError!StateTestResult.ForkTestResult {
        std.log.debug("StateTestExecutor.execute_fork_test: Starting fork test '{s}'", .{fork_name});
        
        var fork_result = StateTestResult.ForkTestResult{
            .fork_name = try self.allocator.dupe(u8, fork_name),
            .index_results = ArrayList(StateTestResult.ForkTestResult.IndexTestResult).init(self.allocator),
        };
        errdefer fork_result.deinit(self.allocator);
        
        // Execute test for each transaction index combination
        const num_indices = @min(@min(state_test.transaction.data.len, state_test.transaction.gas_limit.len), state_test.transaction.value.len);
        
        for (0..num_indices) |index| {
            std.log.debug("StateTestExecutor.execute_fork_test: Executing index {d}", .{index});
            
            const index_result = try self.execute_index_test(state_test, fork_name, index, expected_post_state);
            try fork_result.index_results.append(index_result);
        }
        
        return fork_result;
    }
    
    fn execute_index_test(
        self: *StateTestExecutor,
        state_test: *const StateTest,
        fork_name: []const u8,
        index: usize,
        expected_post_state: *const HashMap([20]u8, TestAccount, std.hash_map.AutoContext([20]u8), std.hash_map.default_max_load_percentage)
    ) StateTestExecutorError!StateTestResult.ForkTestResult.IndexTestResult {
        _ = state_test;
        _ = fork_name;
        _ = expected_post_state;
        
        std.log.debug("StateTestExecutor.execute_index_test: Starting index test {d}", .{index});
        
        // Create mock execution result for now
        const execution_result = ExecutionResult{
            .success = true,
            .gas_used = 21000,
            .return_data = &[_]u8{},
            .logs = &[_]ExecutionResult.EventLog{},
            .error_message = null,
        };
        
        const validation_errors = ArrayList([]const u8).init(self.allocator);
        const state_match = true; // Mock validation for now
        
        return StateTestResult.ForkTestResult.IndexTestResult{
            .index = index,
            .execution_result = execution_result,
            .state_match = state_match,
            .validation_errors = validation_errors,
        };
    }
    
    // Mock EVM state for testing
    const MockEvmState = struct {
        accounts: HashMap([20]u8, MockAccount, std.hash_map.AutoContext([20]u8), std.hash_map.default_max_load_percentage),
        
        const MockAccount = struct {
            balance: u256,
            nonce: u64,
            code: []const u8,
            storage: HashMap(u256, u256, std.hash_map.AutoContext(u256), std.hash_map.default_max_load_percentage),
        };
        
        pub fn init(allocator: Allocator) MockEvmState {
            return MockEvmState{
                .accounts = HashMap([20]u8, MockAccount, std.hash_map.AutoContext([20]u8), std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *MockEvmState) void {
            var iterator = self.accounts.iterator();
            while (iterator.next()) |entry| {
                entry.value_ptr.storage.deinit();
            }
            self.accounts.deinit();
        }
    };
    
    fn setup_pre_state(self: *StateTestExecutor, pre_state: *const HashMap([20]u8, TestAccount, std.hash_map.AutoContext([20]u8), std.hash_map.default_max_load_percentage)) StateTestExecutorError!MockEvmState {
        std.log.debug("StateTestExecutor.setup_pre_state: Setting up pre-state with {d} accounts", .{pre_state.count()});
        
        var vm_state = MockEvmState.init(self.allocator);
        errdefer vm_state.deinit();
        
        // For now, return empty mock state
        // TODO: Implement full pre-state setup
        return vm_state;
    }
    
    const TransactionData = struct {
        to: ?[20]u8,
        value: u256,
        gas_limit: u64,
        gas_price: u64,
        data: []const u8,
        caller: [20]u8,
        
        pub fn deinit(self: *const TransactionData, allocator: Allocator) void {
            allocator.free(self.data);
        }
    };
    
    fn build_transaction(self: *StateTestExecutor, test_transaction: *const TestTransaction, index: usize) StateTestExecutorError!TransactionData {
        if (index >= test_transaction.data.len or 
            index >= test_transaction.gas_limit.len or 
            index >= test_transaction.value.len) {
            return StateTestExecutorError.InvalidTransaction;
        }
        
        std.log.debug("StateTestExecutor.build_transaction: Building transaction at index {d}", .{index});
        
        const gas_price = test_transaction.gas_price orelse test_transaction.max_fee_per_gas orelse 0;
        
        return TransactionData{
            .to = test_transaction.to,
            .value = test_transaction.value[index],
            .gas_limit = test_transaction.gas_limit[index],
            .gas_price = gas_price,
            .data = try self.allocator.dupe(u8, test_transaction.data[index]),
            .caller = test_transaction.sender,
        };
    }
    
    fn execute_transaction(
        self: *StateTestExecutor,
        vm_state: *MockEvmState,
        env: *const TestEnvironment,
        transaction: *const TransactionData
    ) StateTestExecutorError!ExecutionResult {
        _ = self;
        _ = vm_state;
        _ = env;
        _ = transaction;
        
        std.log.debug("StateTestExecutor.execute_transaction: Executing transaction", .{});
        
        // Mock execution for now
        return ExecutionResult{
            .success = true,
            .gas_used = 21000,
            .return_data = &[_]u8{},
            .logs = &[_]ExecutionResult.EventLog{},
            .error_message = null,
        };
    }
    
    fn validate_post_state(
        self: *StateTestExecutor,
        vm_state: *MockEvmState,
        expected_post_state: *const HashMap([20]u8, TestAccount, std.hash_map.AutoContext([20]u8), std.hash_map.default_max_load_percentage),
        validation_errors: *ArrayList([]const u8)
    ) StateTestExecutorError!bool {
        _ = self;
        _ = vm_state;
        _ = expected_post_state;
        _ = validation_errors;
        
        std.log.debug("StateTestExecutor.validate_post_state: Validating post-state");
        
        // Mock validation for now
        return true;
    }
};

test "state test executor init" {
    const allocator = testing.allocator;
    const executor = StateTestExecutor.init(allocator);
    try testing.expect(executor.allocator.ptr == allocator.ptr);
}

test "build transaction" {
    const allocator = testing.allocator;
    var executor = StateTestExecutor.init(allocator);
    
    // Create test transaction data
    const sender = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    const to = [_]u8{0x20} ++ [_]u8{0x00} ** 19;
    const value: u256 = 100;
    const data = try allocator.dupe(u8, &[_]u8{ 0x60, 0x60, 0x60, 0x40 });
    defer allocator.free(data);
    
    var test_transaction = TestTransaction{
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
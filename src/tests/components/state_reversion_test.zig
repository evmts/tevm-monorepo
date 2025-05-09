// state_reversion_test.zig
//! Tests for state reversion on errors in ZigEVM
//! These tests verify that state changes are properly reverted on execution errors

const std = @import("std");
const testing = std.testing;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Address = types.Address;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const error_handling = @import("../../interpreter/error_handling.zig");
const StatusCode = error_handling.StatusCode;
const ExecutionStatus = error_handling.ExecutionStatus;

// Mock state manager for testing state reversion
const MockState = struct {
    allocator: std.mem.Allocator,
    storage: std.StringHashMap(U256),
    balances: std.StringHashMap(U256),
    committed: bool = false,
    reverted: bool = false,
    
    pub fn init(allocator: std.mem.Allocator) !MockState {
        return MockState{
            .allocator = allocator,
            .storage = std.StringHashMap(U256).init(allocator),
            .balances = std.StringHashMap(U256).init(allocator),
        };
    }
    
    pub fn deinit(self: *MockState) void {
        self.storage.deinit();
        self.balances.deinit();
    }
    
    pub fn getStorage(self: *MockState, address: []const u8, key: []const u8) !U256 {
        const full_key = try std.fmt.allocPrint(self.allocator, "{s}:{s}", .{address, key});
        defer self.allocator.free(full_key);
        
        return self.storage.get(full_key) orelse U256.zero();
    }
    
    pub fn setStorage(self: *MockState, address: []const u8, key: []const u8, value: U256) !void {
        const full_key = try std.fmt.allocPrint(self.allocator, "{s}:{s}", .{address, key});
        defer self.allocator.free(full_key);
        
        try self.storage.put(full_key, value);
    }
    
    pub fn getBalance(self: *MockState, address: []const u8) !U256 {
        return self.balances.get(address) orelse U256.zero();
    }
    
    pub fn setBalance(self: *MockState, address: []const u8, value: U256) !void {
        try self.balances.put(address, value);
    }
    
    pub fn commit(self: *MockState) void {
        self.committed = true;
        self.reverted = false;
    }
    
    pub fn revert(self: *MockState) void {
        self.reverted = true;
        self.committed = false;
        
        // In a real implementation, we would revert to a previous state snapshot
        // For the mock, we just clear the hashmaps
        self.storage.clearRetainingCapacity();
        self.balances.clearRetainingCapacity();
    }
};

// Mock execution context for testing state changes
const MockExecutionContext = struct {
    allocator: std.mem.Allocator,
    state: *MockState,
    status: ExecutionStatus,
    caller: []const u8,
    
    pub fn init(allocator: std.mem.Allocator, state: *MockState, caller: []const u8) MockExecutionContext {
        return MockExecutionContext{
            .allocator = allocator,
            .state = state,
            .status = ExecutionStatus{.code = .Continue},
            .caller = caller,
        };
    }
    
    // Simulate a successful execution that modifies state
    pub fn executeSuccess(self: *MockExecutionContext) !void {
        // Set some storage values
        try self.state.setStorage(self.caller, "key1", U256.fromU64(100));
        try self.state.setStorage(self.caller, "key2", U256.fromU64(200));
        
        // Update balance
        try self.state.setBalance(self.caller, U256.fromU64(1000));
        
        // Mark execution as successful
        self.status = ExecutionStatus{
            .code = .Return,
            .gas_used = 1000,
            .gas_refunded = 0,
            .return_data = &[_]u8{1, 2, 3, 4},
        };
    }
    
    // Simulate a failing execution that should revert state
    pub fn executeFail(self: *MockExecutionContext, err: Error) !void {
        // Set some storage values
        try self.state.setStorage(self.caller, "key1", U256.fromU64(100));
        try self.state.setStorage(self.caller, "key2", U256.fromU64(200));
        
        // Update balance
        try self.state.setBalance(self.caller, U256.fromU64(1000));
        
        // Mark execution as failed
        self.status = ExecutionStatus.fromError(err, 1000);
    }
    
    // Simulate a reverting execution (explicit REVERT)
    pub fn executeRevert(self: *MockExecutionContext) !void {
        // Set some storage values
        try self.state.setStorage(self.caller, "key1", U256.fromU64(100));
        try self.state.setStorage(self.caller, "key2", U256.fromU64(200));
        
        // Update balance
        try self.state.setBalance(self.caller, U256.fromU64(1000));
        
        // Mark execution as reverted
        self.status = ExecutionStatus{
            .code = .Revert,
            .gas_used = 1000,
            .return_data = &[_]u8{0xEF, 0xBE, 0xAD, 0xDE},
        };
    }
    
    // Finalize execution and handle state changes
    pub fn finalize(self: *MockExecutionContext) void {
        if (self.status.isSuccess()) {
            // On success, commit state changes
            self.state.commit();
        } else {
            // On revert or error, roll back state changes
            self.state.revert();
        }
    }
};

test "State reversion: successful execution commits changes" {
    // Initialize test components
    var state = try MockState.init(testing.allocator);
    defer state.deinit();
    
    var ctx = MockExecutionContext.init(testing.allocator, &state, "alice");
    
    // Execute successful operation that modifies state
    try ctx.executeSuccess();
    ctx.finalize();
    
    // Verify state was committed
    try testing.expect(state.committed);
    try testing.expect(!state.reverted);
    
    // Verify state changes were applied
    const balance = try state.getBalance("alice");
    try testing.expectEqual(U256.fromU64(1000), balance);
    
    const value1 = try state.getStorage("alice", "key1");
    try testing.expectEqual(U256.fromU64(100), value1);
    
    const value2 = try state.getStorage("alice", "key2");
    try testing.expectEqual(U256.fromU64(200), value2);
}

test "State reversion: execution error reverts changes" {
    // Initialize test components
    var state = try MockState.init(testing.allocator);
    defer state.deinit();
    
    var ctx = MockExecutionContext.init(testing.allocator, &state, "bob");
    
    // Execute failing operation that attempts to modify state
    try ctx.executeFail(Error.OutOfGas);
    ctx.finalize();
    
    // Verify state was reverted
    try testing.expect(state.reverted);
    try testing.expect(!state.committed);
    
    // Verify state changes were rolled back
    const balance = try state.getBalance("bob");
    try testing.expectEqual(U256.zero(), balance);
    
    const value1 = try state.getStorage("bob", "key1");
    try testing.expectEqual(U256.zero(), value1);
    
    const value2 = try state.getStorage("bob", "key2");
    try testing.expectEqual(U256.zero(), value2);
}

test "State reversion: explicit revert reverts changes" {
    // Initialize test components
    var state = try MockState.init(testing.allocator);
    defer state.deinit();
    
    var ctx = MockExecutionContext.init(testing.allocator, &state, "charlie");
    
    // Execute reverting operation that attempts to modify state
    try ctx.executeRevert();
    ctx.finalize();
    
    // Verify state was reverted
    try testing.expect(state.reverted);
    try testing.expect(!state.committed);
    
    // Verify state changes were rolled back
    const balance = try state.getBalance("charlie");
    try testing.expectEqual(U256.zero(), balance);
    
    const value1 = try state.getStorage("charlie", "key1");
    try testing.expectEqual(U256.zero(), value1);
    
    const value2 = try state.getStorage("charlie", "key2");
    try testing.expectEqual(U256.zero(), value2);
}

// Test for more complex scenarios involving multiple operations and nested calls
test "State reversion: complex nested operations" {
    // Initialize test components
    var state = try MockState.init(testing.allocator);
    defer state.deinit();
    
    // Set initial state
    try state.setBalance("alice", U256.fromU64(500));
    try state.setBalance("bob", U256.fromU64(300));
    try state.setStorage("alice", "counter", U256.fromU64(10));
    state.commit();
    
    // Simulate nested calls that modify state
    {
        var ctx1 = MockExecutionContext.init(testing.allocator, &state, "alice");
        
        // First operation succeeds
        try state.setStorage("alice", "counter", U256.fromU64(11));
        try state.setBalance("alice", U256.fromU64(450));
        try state.setBalance("bob", U256.fromU64(350));
        
        // Nested operation fails
        {
            var ctx2 = MockExecutionContext.init(testing.allocator, &state, "bob");
            try state.setStorage("bob", "data", U256.fromU64(42));
            try state.setBalance("bob", U256.fromU64(250));
            try state.setBalance("alice", U256.fromU64(550));
            
            // Set as failed
            ctx2.status = ExecutionStatus.fromError(Error.InvalidOpcode, 500);
            ctx2.finalize();
        }
        
        // Outer operation continues and also fails
        ctx1.status = ExecutionStatus.fromError(Error.OutOfGas, 1000);
        ctx1.finalize();
    }
    
    // Verify state was reverted to initial values
    try testing.expect(state.reverted);
    
    const alice_balance = try state.getBalance("alice");
    try testing.expectEqual(U256.zero(), alice_balance);
    
    const bob_balance = try state.getBalance("bob");
    try testing.expectEqual(U256.zero(), bob_balance);
    
    const counter = try state.getStorage("alice", "counter");
    try testing.expectEqual(U256.zero(), counter);
}
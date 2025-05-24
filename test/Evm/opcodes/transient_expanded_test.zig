const std = @import("std");
const testing = std.testing;
const transient = @import("transient.zig");

// ---------------- Test Mocks and Helper Structures ----------------

// Mock B256 implementation
const B256 = struct {
    bytes: [32]u8,
    
    pub fn fromBytes(bytes: []const u8) B256 {
        var result = B256{ .bytes = undefined };
        if (bytes.len >= 32) {
            @memcpy(&result.bytes, bytes[0..32]);
        } else {
            // Zero-pad if less than 32 bytes
            @memset(&result.bytes, 0);
            @memcpy(result.bytes[0..bytes.len], bytes);
        }
        return result;
    }
    
    pub fn fromInt(value: u64) B256 {
        var result = B256{ .bytes = [_]u8{0} ** 32 };
        var temp = value;
        var i: usize = 31;
        while (temp > 0 and i < 32) : (i -= 1) {
            result.bytes[i] = @truncate(temp & 0xFF);
            temp >>= 8;
        }
        return result;
    }
    
    pub fn equal(a: B256, b: B256) bool {
        return std.mem.eql(u8, &a.bytes, &b.bytes);
    }
    
    pub fn isZero(b: B256) bool {
        for (b.bytes) |byte| {
            if (byte != 0) return false;
        }
        return true;
    }
};

// Mock Frame implementation
const Frame = struct {
    stack: *Stack,
    memory: *Memory,
    contract: *Contract,
    ret_data: ?[]const u8 = null,
    return_data_size: usize = 0,
    pc: usize = 0,
    gas_remaining: u64 = 100000,
    err: ?ExecutionError = null,
    depth: u16 = 0,
    ret_offset: usize = 0,
    ret_size: usize = 0,
    call_depth: u16 = 0,
    
    pub fn address(self: *Frame) []const u8 {
        _ = self;
        return "0x1234567890123456789012345678901234567890";
    }
};

// Mock Interpreter implementation
const Interpreter = struct {
    evm: *Evm,
    cfg: usize = 0,
    readOnly: bool = false,
    returnData: []const u8 = &[_]u8{},
};

// Mock Evm implementation
const Evm = struct {
    chainRules: ChainRules = ChainRules{},
    state_manager: ?*StateManager = null,
};

// Mock ChainRules implementation
const ChainRules = struct {
    IsEIP1153: bool = true,
};

// Mock StateManager implementation with transient storage support
const StateManager = struct {
    transient_storage: TransientStorage,
    
    pub fn init() StateManager {
        return StateManager{
            .transient_storage = TransientStorage.init(testing.allocator),
        };
    }
    
    pub fn deinit(self: *StateManager) void {
        self.transient_storage.deinit();
    }
    
    pub fn getTransientStorage(self: *StateManager, addr: []const u8, key: B256) ![32]u8 {
        return self.transient_storage.get(addr, key);
    }
    
    pub fn putTransientStorage(self: *StateManager, addr: []const u8, key: B256, value: *const [32]u8) !void {
        try self.transient_storage.put(addr, key, value);
    }
    
    pub fn checkpoint(self: *StateManager) !void {
        try self.transient_storage.checkpoint();
    }
    
    pub fn revert(self: *StateManager) !void {
        try self.transient_storage.revert();
    }
    
    pub fn commit(self: *StateManager) !void {
        try self.transient_storage.commit();
    }
    
    pub fn clear(self: *StateManager) void {
        self.transient_storage.clear();
    }
};

// Mock TransientStorage implementation
const TransientStorage = struct {
    // Map from address -> (Map from key -> value)
    storage: std.StringHashMap(std.AutoHashMap(B256, [32]u8)),
    
    // Journal for tracking changes
    journal: std.ArrayList(JournalEntry),
    
    // Checkpoint indices
    checkpoints: std.ArrayList(usize),
    
    allocator: std.mem.Allocator,
    
    const JournalEntry = struct {
        address: []const u8,
        key: B256,
        prev_value: [32]u8,
    };
    
    pub fn init(allocator: std.mem.Allocator) TransientStorage {
        return TransientStorage{
            .storage = std.StringHashMap(std.AutoHashMap(B256, [32]u8)).init(allocator),
            .journal = std.ArrayList(JournalEntry).init(allocator),
            .checkpoints = std.ArrayList(usize).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *TransientStorage) void {
        var it = self.storage.iterator();
        while (it.next()) |entry| {
            entry.value_ptr.deinit();
        }
        self.storage.deinit();
        
        for (self.journal.items) |entry| {
            self.allocator.free(entry.address);
        }
        self.journal.deinit();
        self.checkpoints.deinit();
    }
    
    pub fn get(self: *TransientStorage, addr: []const u8, key: B256) ![32]u8 {
        // Get or initialize the address's storage map
        if (self.storage.get(addr)) |address_storage| {
            // If key exists, return its value
            if (address_storage.get(key)) |value| {
                return value;
            }
        }
        
        // Default return is all zeros
        return [_]u8{0} ** 32;
    }
    
    pub fn put(self: *TransientStorage, addr: []const u8, key: B256, value: *const [32]u8) !void {
        // Get or initialize the address's storage map
        var address_storage = if (self.storage.getPtr(addr)) |address_storage|
            address_storage
        else blk: {
            try self.storage.put(addr, std.AutoHashMap(B256, [32]u8).init(self.allocator));
            break :blk self.storage.getPtr(addr).?;
        };
        
        // Get the previous value or default to all zeros
        var prev_value = if (address_storage.get(key)) |prev|
            prev
        else
            [_]u8{0} ** 32;
        
        // Add to the journal
        try self.journal.append(JournalEntry{
            .address = try self.allocator.dupe(u8, addr),
            .key = key,
            .prev_value = prev_value,
        });
        
        // Set the new value
        try address_storage.put(key, value.*);
    }
    
    pub fn checkpoint(self: *TransientStorage) !void {
        try self.checkpoints.append(self.journal.items.len);
    }
    
    pub fn commit(self: *TransientStorage) !void {
        if (self.checkpoints.items.len == 0) {
            return error.NoCheckpoint;
        }
        _ = self.checkpoints.pop();
    }
    
    pub fn revert(self: *TransientStorage) !void {
        if (self.checkpoints.items.len == 0) {
            return error.NoCheckpoint;
        }
        
        const checkpoint_index = self.checkpoints.pop();
        
        // Revert all changes since the checkpoint
        var i = self.journal.items.len;
        while (i > checkpoint_index) : (i -= 1) {
            if (i == 0) break;
            const entry = self.journal.items[i - 1];
            
            if (self.storage.getPtr(entry.address)) |address_storage| {
                if (std.mem.eql(u8, &entry.prev_value, &[_]u8{0} ** 32)) {
                    // If prev was zero, just remove the key
                    _ = address_storage.remove(entry.key);
                } else {
                    // Otherwise restore the previous value
                    try address_storage.put(entry.key, entry.prev_value);
                }
            }
            
            self.allocator.free(entry.address);
        }
        
        // Remove journal entries
        self.journal.shrinkRetainingCapacity(checkpoint_index);
    }
    
    pub fn clear(self: *TransientStorage) void {
        var it = self.storage.iterator();
        while (it.next()) |entry| {
            entry.value_ptr.clearRetainingCapacity();
        }
        
        for (self.journal.items) |entry| {
            self.allocator.free(entry.address);
        }
        
        self.journal.clearRetainingCapacity();
        self.checkpoints.clearRetainingCapacity();
    }
};

const Memory = struct {
    allocator: std.mem.Allocator,
    memory: std.ArrayList(u8),
    
    pub fn init(allocator: std.mem.Allocator) Memory {
        return Memory{
            .allocator = allocator,
            .memory = std.ArrayList(u8).init(allocator),
        };
    }
    
    pub fn deinit(self: *Memory) void {
        self.memory.deinit();
    }
};

const Stack = struct {
    allocator: std.mem.Allocator,
    data: std.ArrayList(TestValue),
    size: usize = 0,
    
    pub fn init(allocator: std.mem.Allocator) Stack {
        return Stack{
            .allocator = allocator,
            .data = std.ArrayList(TestValue).init(allocator),
        };
    }
    
    pub fn deinit(self: *Stack) void {
        self.data.deinit();
    }
    
    pub fn push(self: *Stack, value: TestValue) !void {
        try self.data.append(value);
        self.size += 1;
    }
    
    pub fn pop(self: *Stack) !TestValue {
        if (self.size == 0) return ExecutionError.StackUnderflow;
        self.size -= 1;
        return self.data.items[self.size];
    }
};

const Contract = struct {
    gas: u64 = 100000,
    code_address: usize = 0,
    address: usize = 0,
    input: []const u8 = &[_]u8{},
    value: TestValue = 0,
    gas_refund: u64 = 0,
};

// Use a different name to avoid shadowing the builtin
const TestValue = u64;

const ExecutionError = error{
    StackUnderflow,
    StackOverflow,
    WriteProtection,
    InvalidStateAccess,
    InvalidOpcode,
    NoCheckpoint,
};

// ---------------- Test Helper Functions ----------------

fn createTestFrame() !struct {
    frame: *Frame,
    stack: *Stack,
    memory: *Memory,
    interpreter: *Interpreter,
    evm: *Evm,
    state_manager: *StateManager,
} {
    const allocator = testing.allocator;
    
    const stack = try allocator.create(Stack);
    stack.* = Stack.init(allocator);
    
    const memory = try allocator.create(Memory);
    memory.* = Memory.init(allocator);
    
    const contract = try allocator.create(Contract);
    contract.* = Contract{
        .gas = 100000,
        .code_address = undefined,
        .address = undefined,
        .input = &[_]u8{},
        .value = 0,
        .gas_refund = 0,
    };
    
    const frame = try allocator.create(Frame);
    frame.* = Frame{
        .stack = stack,
        .memory = memory,
        .contract = contract,
        .ret_data = undefined,
        .return_data_size = 0,
        .pc = 0,
        .gas_remaining = 100000,
        .err = null,
        .depth = 0,
        .ret_offset = 0,
        .ret_size = 0,
        .call_depth = 0,
    };
    
    const state_manager = try allocator.create(StateManager);
    state_manager.* = StateManager.init();
    
    const evm = try allocator.create(Evm);
    evm.* = Evm{
        .chainRules = ChainRules{ .IsEIP1153 = true },
        .state_manager = state_manager,
    };
    
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = evm,
        .cfg = undefined,
        .readOnly = false,
        .returnData = &[_]u8{},
    };
    
    return .{
        .frame = frame,
        .stack = stack,
        .memory = memory,
        .interpreter = interpreter,
        .evm = evm,
        .state_manager = state_manager,
    };
}

fn cleanupTestFrame(test_frame: anytype, allocator: std.mem.Allocator) void {
    test_frame.state_manager.deinit();
    test_frame.memory.deinit();
    test_frame.stack.deinit();
    allocator.destroy(test_frame.memory);
    allocator.destroy(test_frame.stack);
    allocator.destroy(test_frame.frame.contract);
    allocator.destroy(test_frame.frame);
    allocator.destroy(test_frame.state_manager);
    allocator.destroy(test_frame.evm);
    allocator.destroy(test_frame.interpreter);
}

// ---------------- Test Cases ----------------

test "TLOAD/TSTORE basic operations" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Set up test values
    const key = 0x123456;
    const value = 0x789abc;
    
    // Push key and value onto stack for TSTORE
    try test_frame.stack.push(key);
    try test_frame.stack.push(value);
    
    // Execute TSTORE operation
    _ = try transient.opTstore(0, test_frame.interpreter, test_frame.frame);
    
    // Check that the stack is empty after TSTORE
    try testing.expectEqual(@as(usize, 0), test_frame.stack.size);
    
    // Now push the key back onto the stack to read the value
    try test_frame.stack.push(key);
    
    // Execute TLOAD operation
    _ = try transient.opTload(0, test_frame.interpreter, test_frame.frame);
    
    // Check the result - stack should have the value we stored
    try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
    try testing.expectEqual(value, test_frame.stack.data.items[0]);
}

test "TLOAD missing key returns zero" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Push a key onto stack that has not been stored
    const unused_key = 0xabcdef;
    try test_frame.stack.push(unused_key);
    
    // Execute TLOAD operation on non-existent key
    _ = try transient.opTload(0, test_frame.interpreter, test_frame.frame);
    
    // Check the result - should have zero value
    try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
    try testing.expectEqual(@as(TestValue, 0), test_frame.stack.data.items[0]);
}

test "TSTORE in read-only mode fails" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Enable read-only mode
    test_frame.interpreter.readOnly = true;
    
    // Push key and value onto stack for TSTORE
    try test_frame.stack.push(0x123);
    try test_frame.stack.push(0x456);
    
    // Execute TSTORE operation - should fail with WriteProtection
    const result = transient.opTstore(0, test_frame.interpreter, test_frame.frame);
    try testing.expectError(error.WriteProtection, result);
}

test "TLOAD with empty stack fails" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Stack is empty, so TLOAD should fail
    const result = transient.opTload(0, test_frame.interpreter, test_frame.frame);
    try testing.expectError(error.StackUnderflow, result);
}

test "TSTORE with insufficient stack items fails" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Push only a key (need key and value)
    try test_frame.stack.push(0x123);
    
    // Execute TSTORE operation - should fail with StackUnderflow
    const result = transient.opTstore(0, test_frame.interpreter, test_frame.frame);
    try testing.expectError(error.StackUnderflow, result);
}

test "TLOAD/TSTORE with EIP-1153 disabled fails" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Disable EIP-1153
    test_frame.evm.chainRules.IsEIP1153 = false;
    
    // Push key onto stack
    try test_frame.stack.push(0x123);
    
    // Execute TLOAD operation - should fail with InvalidOpcode
    var result = transient.opTload(0, test_frame.interpreter, test_frame.frame);
    try testing.expectError(error.InvalidOpcode, result);
    
    // Push value onto stack
    try test_frame.stack.push(0x456);
    
    // Execute TSTORE operation - should fail with InvalidOpcode
    result = transient.opTstore(0, test_frame.interpreter, test_frame.frame);
    try testing.expectError(error.InvalidOpcode, result);
}

test "TransientStorage checkpoint and revert functionality" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Get address for the test contract
    const addr = test_frame.frame.address();
    
    // Create keys and values
    const key = B256.fromInt(0x123);
    const value1 = [_]u8{1} ** 32;
    const value2 = [_]u8{2} ** 32;
    const value3 = [_]u8{3} ** 32;
    
    // Initial storage is empty (all zeros)
    var retrieved = try test_frame.state_manager.getTransientStorage(addr, key);
    try testing.expectEqualSlices(u8, &[_]u8{0} ** 32, &retrieved);
    
    // Store value1
    try test_frame.state_manager.putTransientStorage(addr, key, &value1);
    retrieved = try test_frame.state_manager.getTransientStorage(addr, key);
    try testing.expectEqualSlices(u8, &value1, &retrieved);
    
    // Create a checkpoint
    try test_frame.state_manager.checkpoint();
    
    // Update to value2
    try test_frame.state_manager.putTransientStorage(addr, key, &value2);
    retrieved = try test_frame.state_manager.getTransientStorage(addr, key);
    try testing.expectEqualSlices(u8, &value2, &retrieved);
    
    // Create another nested checkpoint
    try test_frame.state_manager.checkpoint();
    
    // Update to value3
    try test_frame.state_manager.putTransientStorage(addr, key, &value3);
    retrieved = try test_frame.state_manager.getTransientStorage(addr, key);
    try testing.expectEqualSlices(u8, &value3, &retrieved);
    
    // Revert to previous checkpoint (should go back to value2)
    try test_frame.state_manager.revert();
    retrieved = try test_frame.state_manager.getTransientStorage(addr, key);
    try testing.expectEqualSlices(u8, &value2, &retrieved);
    
    // Revert to initial checkpoint (should go back to value1)
    try test_frame.state_manager.revert();
    retrieved = try test_frame.state_manager.getTransientStorage(addr, key);
    try testing.expectEqualSlices(u8, &value1, &retrieved);
}

test "TransientStorage commit functionality" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Get address for the test contract
    const addr = test_frame.frame.address();
    
    // Create keys and values
    const key = B256.fromInt(0x123);
    const value1 = [_]u8{1} ** 32;
    const value2 = [_]u8{2} ** 32;
    const value3 = [_]u8{3} ** 32;
    
    // Store value1
    try test_frame.state_manager.putTransientStorage(addr, key, &value1);
    
    // Create first checkpoint
    try test_frame.state_manager.checkpoint();
    
    // Update to value2
    try test_frame.state_manager.putTransientStorage(addr, key, &value2);
    
    // Create second nested checkpoint
    try test_frame.state_manager.checkpoint();
    
    // Update to value3
    try test_frame.state_manager.putTransientStorage(addr, key, &value3);
    
    // Commit the latest checkpoint (this merges the changes with the previous checkpoint)
    try test_frame.state_manager.commit();
    
    // The value should still be value3
    var retrieved = try test_frame.state_manager.getTransientStorage(addr, key);
    try testing.expectEqualSlices(u8, &value3, &retrieved);
    
    // Commit again (this commits all changes to the base state)
    try test_frame.state_manager.commit();
    
    // Value should still be value3
    retrieved = try test_frame.state_manager.getTransientStorage(addr, key);
    try testing.expectEqualSlices(u8, &value3, &retrieved);
    
    // Attempting to revert should fail since all checkpoints have been committed
    try testing.expectError(error.NoCheckpoint, test_frame.state_manager.revert());
}

test "TransientStorage clear functionality" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Get address for the test contract
    const addr = test_frame.frame.address();
    
    // Create keys and values
    const key1 = B256.fromInt(0x123);
    const key2 = B256.fromInt(0x456);
    const value = [_]u8{1} ** 32;
    
    // Store values
    try test_frame.state_manager.putTransientStorage(addr, key1, &value);
    try test_frame.state_manager.putTransientStorage(addr, key2, &value);
    
    // Verify values were stored
    var retrieved1 = try test_frame.state_manager.getTransientStorage(addr, key1);
    var retrieved2 = try test_frame.state_manager.getTransientStorage(addr, key2);
    try testing.expectEqualSlices(u8, &value, &retrieved1);
    try testing.expectEqualSlices(u8, &value, &retrieved2);
    
    // Clear the storage
    test_frame.state_manager.clear();
    
    // Verify values were cleared
    retrieved1 = try test_frame.state_manager.getTransientStorage(addr, key1);
    retrieved2 = try test_frame.state_manager.getTransientStorage(addr, key2);
    try testing.expectEqualSlices(u8, &[_]u8{0} ** 32, &retrieved1);
    try testing.expectEqualSlices(u8, &[_]u8{0} ** 32, &retrieved2);
}

test "TransientStorage handling different addresses" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Create two different addresses
    const addr1 = "0x1111111111111111111111111111111111111111";
    const addr2 = "0x2222222222222222222222222222222222222222";
    
    // Create key and value
    const key = B256.fromInt(0x123);
    const value1 = [_]u8{1} ** 32;
    const value2 = [_]u8{2} ** 32;
    
    // Store different values under the same key at different addresses
    try test_frame.state_manager.putTransientStorage(addr1, key, &value1);
    try test_frame.state_manager.putTransientStorage(addr2, key, &value2);
    
    // Verify values for each address
    var retrieved1 = try test_frame.state_manager.getTransientStorage(addr1, key);
    var retrieved2 = try test_frame.state_manager.getTransientStorage(addr2, key);
    try testing.expectEqualSlices(u8, &value1, &retrieved1);
    try testing.expectEqualSlices(u8, &value2, &retrieved2);
    
    // Create a checkpoint
    try test_frame.state_manager.checkpoint();
    
    // Update value for addr1
    const value3 = [_]u8{3} ** 32;
    try test_frame.state_manager.putTransientStorage(addr1, key, &value3);
    
    // Verify values
    retrieved1 = try test_frame.state_manager.getTransientStorage(addr1, key);
    retrieved2 = try test_frame.state_manager.getTransientStorage(addr2, key);
    try testing.expectEqualSlices(u8, &value3, &retrieved1);
    try testing.expectEqualSlices(u8, &value2, &retrieved2);
    
    // Revert the checkpoint
    try test_frame.state_manager.revert();
    
    // Verify values are restored correctly
    retrieved1 = try test_frame.state_manager.getTransientStorage(addr1, key);
    retrieved2 = try test_frame.state_manager.getTransientStorage(addr2, key);
    try testing.expectEqualSlices(u8, &value1, &retrieved1);
    try testing.expectEqualSlices(u8, &value2, &retrieved2);
}

test "TransientStorage with multiple keys at same address" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Get address for the test contract
    const addr = test_frame.frame.address();
    
    // Create multiple keys and values
    const key1 = B256.fromInt(0x111);
    const key2 = B256.fromInt(0x222);
    const key3 = B256.fromInt(0x333);
    const value1 = [_]u8{1} ** 32;
    const value2 = [_]u8{2} ** 32;
    const value3 = [_]u8{3} ** 32;
    
    // Store values for different keys
    try test_frame.state_manager.putTransientStorage(addr, key1, &value1);
    try test_frame.state_manager.putTransientStorage(addr, key2, &value2);
    try test_frame.state_manager.putTransientStorage(addr, key3, &value3);
    
    // Create checkpoint
    try test_frame.state_manager.checkpoint();
    
    // Update values for key1 and key3
    const new_value1 = [_]u8{9} ** 32;
    const new_value3 = [_]u8{8} ** 32;
    try test_frame.state_manager.putTransientStorage(addr, key1, &new_value1);
    try test_frame.state_manager.putTransientStorage(addr, key3, &new_value3);
    
    // Verify values
    var retrieved1 = try test_frame.state_manager.getTransientStorage(addr, key1);
    var retrieved2 = try test_frame.state_manager.getTransientStorage(addr, key2);
    var retrieved3 = try test_frame.state_manager.getTransientStorage(addr, key3);
    try testing.expectEqualSlices(u8, &new_value1, &retrieved1);
    try testing.expectEqualSlices(u8, &value2, &retrieved2);
    try testing.expectEqualSlices(u8, &new_value3, &retrieved3);
    
    // Revert the checkpoint
    try test_frame.state_manager.revert();
    
    // Verify values are restored correctly
    retrieved1 = try test_frame.state_manager.getTransientStorage(addr, key1);
    retrieved2 = try test_frame.state_manager.getTransientStorage(addr, key2);
    retrieved3 = try test_frame.state_manager.getTransientStorage(addr, key3);
    try testing.expectEqualSlices(u8, &value1, &retrieved1);
    try testing.expectEqualSlices(u8, &value2, &retrieved2);
    try testing.expectEqualSlices(u8, &value3, &retrieved3);
}

test "TLOAD/TSTORE opcodes with storage simulation" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Create multiple key-value pairs to test
    const test_values = [_]struct { key: TestValue, value: TestValue }{
        .{ .key = 0x111, .value = 0xaaa },
        .{ .key = 0x222, .value = 0xbbb },
        .{ .key = 0x333, .value = 0xccc },
    };
    
    // Store all values using TSTORE
    for (test_values) |pair| {
        // Push key and value for TSTORE
        try test_frame.stack.push(pair.key);
        try test_frame.stack.push(pair.value);
        
        // Execute TSTORE
        _ = try transient.opTstore(0, test_frame.interpreter, test_frame.frame);
        
        // Stack should be empty after each TSTORE
        try testing.expectEqual(@as(usize, 0), test_frame.stack.size);
    }
    
    // Retrieve and verify all values using TLOAD
    for (test_values) |pair| {
        // Push key for TLOAD
        try test_frame.stack.push(pair.key);
        
        // Execute TLOAD
        _ = try transient.opTload(0, test_frame.interpreter, test_frame.frame);
        
        // Verify the loaded value
        try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
        try testing.expectEqual(pair.value, test_frame.stack.data.items[0]);
        
        // Clear the stack for the next iteration
        _ = try test_frame.stack.pop();
    }
}
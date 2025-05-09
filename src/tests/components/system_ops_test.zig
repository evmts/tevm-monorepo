//! Tests for system operation opcodes
//! Tests LOG0-LOG4, SELFDESTRUCT, CALL, CALLCODE, DELEGATECALL, STATICCALL, CREATE, CREATE2

const std = @import("std");
const testing = std.testing;
const system_ops = @import("../../opcodes/system.zig");
const types = @import("../../util/types.zig");
const Error = types.Error;
const U256 = types.U256;
const Address = types.Address;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;

/// Storage for emitted logs during testing
const LogStorage = struct {
    /// A single log entry
    const LogEntry = struct {
        address: Address,
        topics: []U256,
        data: []u8,
        
        fn deinit(self: *LogEntry, allocator: std.mem.Allocator) void {
            allocator.free(self.topics);
            allocator.free(self.data);
        }
    };
    
    /// Array of log entries
    logs: std.ArrayList(LogEntry),
    allocator: std.mem.Allocator,
    
    fn init(allocator: std.mem.Allocator) LogStorage {
        return LogStorage{
            .logs = std.ArrayList(LogEntry).init(allocator),
            .allocator = allocator,
        };
    }
    
    fn deinit(self: *LogStorage) void {
        for (self.logs.items) |*log| {
            log.deinit(self.allocator);
        }
        self.logs.deinit();
    }
    
    /// Handler function for log emission
    fn emitLog(address: Address, topics: []const U256, data: []const u8) Error!void {
        // This function is used indirectly via function pointer in LogEmitter
        // Since we can't capture context in a function pointer in Zig,
        // we'll use a global for testing purposes
        var log_entry = LogEntry{
            .address = address,
            .topics = global_log_storage.allocator.dupe(U256, topics) catch return Error.InternalError,
            .data = global_log_storage.allocator.dupe(u8, data) catch return Error.InternalError,
        };
        
        global_log_storage.logs.append(log_entry) catch return Error.InternalError;
    }
    
    /// Clear all logs
    fn clear(self: *LogStorage) void {
        for (self.logs.items) |*log| {
            log.deinit(self.allocator);
        }
        self.logs.clearRetainingCapacity();
    }
};

// Global for testing logs
// Note: This is not a pattern to use in production code, but simplifies
// testing with function pointers that can't capture context
var global_log_storage: LogStorage = undefined;

/// Storage for tracking self-destructed accounts during testing
const SelfDestructStorage = struct {
    const SelfDestructEntry = struct {
        address: Address,
        beneficiary: Address,
    };
    
    /// Array of self-destruct entries
    entries: std.ArrayList(SelfDestructEntry),
    
    fn init(allocator: std.mem.Allocator) SelfDestructStorage {
        return SelfDestructStorage{
            .entries = std.ArrayList(SelfDestructEntry).init(allocator),
        };
    }
    
    fn deinit(self: *SelfDestructStorage) void {
        self.entries.deinit();
    }
    
    /// Handler function for self-destruct
    fn selfDestruct(address: Address, beneficiary: Address) Error!void {
        // This is used indirectly via function pointer
        const entry = SelfDestructEntry{
            .address = address,
            .beneficiary = beneficiary,
        };
        
        global_selfdestruct_storage.entries.append(entry) catch return Error.InternalError;
    }
    
    /// Handler for loading account balance
    fn loadAccount(address: Address) Error!?U256 {
        _ = address;
        // For testing purposes, just return a fixed value
        return U256.fromU64(1000);
    }
    
    /// Clear all self-destruct entries
    fn clear(self: *SelfDestructStorage) void {
        self.entries.clearRetainingCapacity();
    }
};

// Global for testing self-destructs
var global_selfdestruct_storage: SelfDestructStorage = undefined;

test "Initialize test globals" {
    // Initialize test globals
    global_log_storage = LogStorage.init(testing.allocator);
    defer global_log_storage.deinit();
    
    global_selfdestruct_storage = SelfDestructStorage.init(testing.allocator);
    defer global_selfdestruct_storage.deinit();
}

/// Test LOG0 opcode
test "LOG0 operation" {
    // Initialize test storage
    global_log_storage = LogStorage.init(testing.allocator);
    defer global_log_storage.deinit();
    global_log_storage.clear();
    
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Store data in memory
    const test_data = [_]u8{0xAA, 0xBB, 0xCC, 0xDD};
    memory.store(100, &test_data);
    
    // Set up stack for LOG0: [offset, size]
    try stack.push(U256.fromU64(100)); // offset
    try stack.push(U256.fromU64(4));   // size
    
    // Create log emitter
    const log_emitter = system_ops.LogEmitter.init(LogStorage.emitLog);
    
    // Create caller address
    const caller = Address.fromBytes(&[_]u8{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}) catch unreachable;
    
    // Execute LOG0
    try system_ops.log0(&stack, &memory, &log_emitter, caller);
    
    // Verify stack is empty
    try testing.expect(stack.isEmpty());
    
    // Verify log was emitted
    try testing.expectEqual(@as(usize, 1), global_log_storage.logs.items.len);
    
    const log = global_log_storage.logs.items[0];
    try testing.expectEqualSlices(u8, &caller.bytes, &log.address.bytes);
    try testing.expectEqual(@as(usize, 0), log.topics.len);
    try testing.expectEqualSlices(u8, &test_data, log.data);
}

/// Test LOG1, LOG2, LOG3, LOG4 opcodes
test "LOG1-LOG4 operations" {
    // Initialize test storage
    global_log_storage = LogStorage.init(testing.allocator);
    defer global_log_storage.deinit();
    global_log_storage.clear();
    
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Store data in memory
    const test_data = [_]u8{0x11, 0x22, 0x33, 0x44};
    memory.store(200, &test_data);
    
    // Create log emitter and caller address
    const log_emitter = system_ops.LogEmitter.init(LogStorage.emitLog);
    const caller = Address.fromBytes(&[_]u8{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}) catch unreachable;
    
    // Test LOG1
    try stack.push(U256.fromU64(200)); // offset
    try stack.push(U256.fromU64(4));   // size
    try stack.push(U256.fromU64(0xAAAA)); // topic1
    
    try system_ops.log1(&stack, &memory, &log_emitter, caller);
    try testing.expectEqual(@as(usize, 1), global_log_storage.logs.items.len);
    try testing.expectEqual(@as(usize, 1), global_log_storage.logs.items[0].topics.len);
    try testing.expectEqual(U256.fromU64(0xAAAA), global_log_storage.logs.items[0].topics[0]);
    
    // Test LOG2
    global_log_storage.clear();
    try stack.push(U256.fromU64(200)); // offset
    try stack.push(U256.fromU64(4));   // size
    try stack.push(U256.fromU64(0xBBBB)); // topic1
    try stack.push(U256.fromU64(0xCCCC)); // topic2
    
    try system_ops.log2(&stack, &memory, &log_emitter, caller);
    try testing.expectEqual(@as(usize, 1), global_log_storage.logs.items.len);
    try testing.expectEqual(@as(usize, 2), global_log_storage.logs.items[0].topics.len);
    try testing.expectEqual(U256.fromU64(0xBBBB), global_log_storage.logs.items[0].topics[0]);
    try testing.expectEqual(U256.fromU64(0xCCCC), global_log_storage.logs.items[0].topics[1]);
    
    // Test LOG3
    global_log_storage.clear();
    try stack.push(U256.fromU64(200)); // offset
    try stack.push(U256.fromU64(4));   // size
    try stack.push(U256.fromU64(0x1111)); // topic1
    try stack.push(U256.fromU64(0x2222)); // topic2
    try stack.push(U256.fromU64(0x3333)); // topic3
    
    try system_ops.log3(&stack, &memory, &log_emitter, caller);
    try testing.expectEqual(@as(usize, 1), global_log_storage.logs.items.len);
    try testing.expectEqual(@as(usize, 3), global_log_storage.logs.items[0].topics.len);
    
    // Test LOG4
    global_log_storage.clear();
    try stack.push(U256.fromU64(200)); // offset
    try stack.push(U256.fromU64(4));   // size
    try stack.push(U256.fromU64(0xAAAA)); // topic1
    try stack.push(U256.fromU64(0xBBBB)); // topic2
    try stack.push(U256.fromU64(0xCCCC)); // topic3
    try stack.push(U256.fromU64(0xDDDD)); // topic4
    
    try system_ops.log4(&stack, &memory, &log_emitter, caller);
    try testing.expectEqual(@as(usize, 1), global_log_storage.logs.items.len);
    try testing.expectEqual(@as(usize, 4), global_log_storage.logs.items[0].topics.len);
    try testing.expectEqual(U256.fromU64(0xAAAA), global_log_storage.logs.items[0].topics[0]);
    try testing.expectEqual(U256.fromU64(0xBBBB), global_log_storage.logs.items[0].topics[1]);
    try testing.expectEqual(U256.fromU64(0xCCCC), global_log_storage.logs.items[0].topics[2]);
    try testing.expectEqual(U256.fromU64(0xDDDD), global_log_storage.logs.items[0].topics[3]);
}

/// Test LOG with empty data
test "LOG with empty data" {
    // Initialize test storage
    global_log_storage = LogStorage.init(testing.allocator);
    defer global_log_storage.deinit();
    global_log_storage.clear();
    
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Create log emitter and caller address
    const log_emitter = system_ops.LogEmitter.init(LogStorage.emitLog);
    const caller = Address.fromBytes(&[_]u8{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}) catch unreachable;
    
    // Test LOG0 with zero size
    try stack.push(U256.fromU64(100)); // offset
    try stack.push(U256.fromU64(0));   // size
    
    try system_ops.log0(&stack, &memory, &log_emitter, caller);
    try testing.expectEqual(@as(usize, 1), global_log_storage.logs.items.len);
    try testing.expectEqual(@as(usize, 0), global_log_storage.logs.items[0].data.len);
}

/// Test SELFDESTRUCT opcode
test "SELFDESTRUCT operation" {
    // Initialize test storage
    global_selfdestruct_storage = SelfDestructStorage.init(testing.allocator);
    defer global_selfdestruct_storage.deinit();
    global_selfdestruct_storage.clear();
    
    var stack = Stack.init();
    
    // Create account operator
    const account_operator = system_ops.AccountOperator.init(
        SelfDestructStorage.selfDestruct,
        SelfDestructStorage.loadAccount
    );
    
    // Create addresses
    const caller = Address.fromBytes(&[_]u8{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}) catch unreachable;
    
    // Create beneficiary address as U256
    // Bytes 12-31 of the U256 will be used as the address
    var beneficiary_bytes: [32]u8 = [_]u8{0} ** 32;
    for (0..20) |i| {
        beneficiary_bytes[12 + i] = @as(u8, @intCast(i + 100));
    }
    
    const beneficiary_u256 = U256.fromBytes(&beneficiary_bytes) catch unreachable;
    
    // Set up stack for SELFDESTRUCT
    try stack.push(beneficiary_u256);
    
    // Execute SELFDESTRUCT
    try system_ops.selfdestruct(&stack, &account_operator, caller);
    
    // Verify stack is empty
    try testing.expect(stack.isEmpty());
    
    // Verify selfdestruct was called
    try testing.expectEqual(@as(usize, 1), global_selfdestruct_storage.entries.items.len);
    
    const entry = global_selfdestruct_storage.entries.items[0];
    try testing.expectEqualSlices(u8, &caller.bytes, &entry.address.bytes);
    
    // Beneficiary address should be bytes 12-31 of the U256 value
    for (0..20) |i| {
        try testing.expectEqual(@as(u8, @intCast(i + 100)), entry.beneficiary.bytes[i]);
    }
}

/// Test call opcodes (placeholders for now)
test "CALL operation placeholders" {
    // For now, just verify the placeholders return the expected error
    try testing.expectError(Error.InvalidOpcode, system_ops.call());
    try testing.expectError(Error.InvalidOpcode, system_ops.callcode());
    try testing.expectError(Error.InvalidOpcode, system_ops.delegatecall());
    try testing.expectError(Error.InvalidOpcode, system_ops.staticcall());
}

/// Test create opcodes (placeholders for now)
test "CREATE operation placeholders" {
    // For now, just verify the placeholders return the expected error
    try testing.expectError(Error.InvalidOpcode, system_ops.create());
    try testing.expectError(Error.InvalidOpcode, system_ops.create2());
}
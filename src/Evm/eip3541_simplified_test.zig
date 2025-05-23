const std = @import("std");
const testing = std.testing;

// Constants for our simplified tests
const MAX_MEMORY_SIZE = 10 * 1024 * 1024; // 10 MB
pub const Address = @import("../Address/package.zig").Address;

// Logger for debug output
const DebugLogger = struct {
    name: []const u8,
    
    pub fn init(name: []const u8) DebugLogger {
        return DebugLogger{ .name = name };
    }
    
    pub fn debug(self: DebugLogger, comptime fmt: []const u8, args: anytype) void {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("[DEBUG {s}] " ++ fmt ++ "\n", .{self.name} ++ args);
        }
    }
    
    pub fn info(self: DebugLogger, comptime fmt: []const u8, args: anytype) void {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("[INFO {s}] " ++ fmt ++ "\n", .{self.name} ++ args);
        }
    }
    
    pub fn err(self: DebugLogger, comptime fmt: []const u8, args: anytype) void {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("[ERROR {s}] " ++ fmt ++ "\n", .{self.name} ++ args);
        }
    }
};

var logger = DebugLogger.init("EIP-3541 Test");

// Simplified Memory implementation
const Memory = struct {
    data: std.ArrayList(u8),
    
    pub fn init(allocator: std.mem.Allocator) !Memory {
        return Memory{
            .data = std.ArrayList(u8).init(allocator),
        };
    }
    
    pub fn deinit(self: *Memory) void {
        self.data.deinit();
    }
    
    pub fn resize(self: *Memory, size: usize) !void {
        logger.debug("Memory.resize: Called with size {d}", .{size});
        
        if (size > MAX_MEMORY_SIZE) {
            logger.err("Memory.resize: Size {d} too large", .{size});
            return error.OutOfMemory;
        }
        
        try self.data.resize(size);
        
        // Zero out any newly added memory
        for (self.data.items[self.data.items.len - @min(self.data.items.len, size)..self.data.items.len]) |*b| {
            b.* = 0;
        }
        
        logger.debug("Memory.resize: Resized to {d} bytes", .{self.data.items.len});
    }
    
    pub fn get(self: *const Memory, offset: usize, size: usize) ![]const u8 {
        if (offset + size > self.data.items.len) {
            logger.err("Memory.get: Attempt to read beyond memory bounds: offset={d}, size={d}, memory_size={d}", 
                       .{offset, size, self.data.items.len});
            return error.OutOfBounds;
        }
        
        return self.data.items[offset..offset+size];
    }
    
    pub fn set(self: *Memory, offset: usize, data_: []const u8) !void {
        const end_offset = offset + data_.len;
        
        if (end_offset > self.data.items.len) {
            try self.resize(end_offset);
        }
        
        @memcpy(self.data.items[offset..end_offset], data_);
    }
    
    pub fn items(self: *const Memory) []const u8 {
        return self.data.items;
    }
};

// Stack for our simplified EVM implementation
const Stack = struct {
    data: std.ArrayList(u64),
    
    pub fn init(allocator: std.mem.Allocator) !Stack {
        return Stack{
            .data = std.ArrayList(u64).init(allocator),
        };
    }
    
    pub fn deinit(self: *Stack) void {
        self.data.deinit();
    }
    
    pub fn push(self: *Stack, value: u64) !void {
        try self.data.append(value);
    }
    
    pub fn pop(self: *Stack) !u64 {
        if (self.data.items.len == 0) {
            return error.StackUnderflow;
        }
        
        const value = self.data.items[self.data.items.len - 1];
        _ = self.data.pop();
        return value;
    }
    
    pub fn peek(self: *const Stack, index: usize) !u64 {
        if (index >= self.data.items.len) {
            return error.StackUnderflow;
        }
        
        return self.data.items[self.data.items.len - 1 - index];
    }
};

// Implementation of the ChainRules, which determine which EIPs are active
const ChainRules = struct {
    // EIP-3541: Reject new contracts starting with the 0xEF byte
    IsEIP3541: bool = false,
    
    pub fn init(eip3541_enabled: bool) ChainRules {
        return ChainRules{
            .IsEIP3541 = eip3541_enabled,
        };
    }
};

// Frame for our simplified EVM tests
const Frame = struct {
    memory: Memory,
    stack: Stack,
    
    pub fn init(allocator: std.mem.Allocator) !Frame {
        return Frame{
            .memory = try Memory.init(allocator),
            .stack = try Stack.init(allocator),
        };
    }
    
    pub fn deinit(self: *Frame) void {
        self.memory.deinit();
        self.stack.deinit();
    }
};

// Minimalistic implementation of EIP-3541 CREATE validation
fn isValidCreateCode(rules: ChainRules, code: []const u8) bool {
    logger.debug("isValidCreateCode: Checking code validity with EIP-3541={}", .{rules.IsEIP3541});
    
    if (code.len == 0) {
        logger.debug("isValidCreateCode: Empty code is valid", .{});
        return true;
    }
    
    // EIP-3541: Reject new contracts starting with 0xEF when enabled
    if (rules.IsEIP3541 and code[0] == 0xEF) {
        logger.debug("isValidCreateCode: Code starts with 0xEF, invalid with EIP-3541", .{});
        return false;
    }
    
    logger.debug("isValidCreateCode: Code is valid", .{});
    return true;
}

// Simulated CREATE operation that incorporates EIP-3541 logic
fn opCreateSimulated(rules: ChainRules, frame: *Frame) !u64 {
    // In real implementation, we'd pop value, offset and size from stack
    const size = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const value = try frame.stack.pop();
    
    logger.debug("opCreateSimulated: Called with value={d}, offset={d}, size={d}", .{value, offset, size});
    
    // Get contract initialization code from memory
    const code = try frame.memory.get(@intCast(offset), @intCast(size));
    
    // Check if the code is valid according to EIP-3541
    const is_valid = isValidCreateCode(rules, code);
    
    // In our simulated environment, if code is valid, we return a fake address
    // Otherwise, we return 0 to indicate failure
    if (is_valid) {
        logger.debug("opCreateSimulated: CREATE successful, returning fake address", .{});
        return 0x1234;
    } else {
        logger.debug("opCreateSimulated: CREATE failed due to invalid code", .{});
        return 0;
    }
}

// Simulated CREATE2 operation that incorporates EIP-3541 logic
fn opCreate2Simulated(rules: ChainRules, frame: *Frame) !u64 {
    // In real implementation, we'd pop value, offset, size and salt from stack
    const salt = try frame.stack.pop();
    const size = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const value = try frame.stack.pop();
    
    logger.debug("opCreate2Simulated: Called with value={d}, offset={d}, size={d}, salt={d}", 
               .{value, offset, size, salt});
    
    // Get contract initialization code from memory
    const code = try frame.memory.get(@intCast(offset), @intCast(size));
    
    // Check if the code is valid according to EIP-3541
    const is_valid = isValidCreateCode(rules, code);
    
    // In our simulated environment, if code is valid, we return a fake address
    // Otherwise, we return 0 to indicate failure
    if (is_valid) {
        logger.debug("opCreate2Simulated: CREATE2 successful, returning fake address", .{});
        return 0x5678;
    } else {
        logger.debug("opCreate2Simulated: CREATE2 failed due to invalid code", .{});
        return 0;
    }
}

// Test that CREATE rejects contracts starting with 0xEF when EIP-3541 is enabled
test "CREATE rejects contracts starting with 0xEF with EIP-3541 enabled" {
    logger.info("Starting test: CREATE rejects contracts starting with 0xEF with EIP-3541 enabled", .{});
    
    // Setup test environment
    var frame = try Frame.init(testing.allocator);
    defer frame.deinit();
    
    // Create chain rules with EIP-3541 enabled
    const rules = ChainRules.init(true);
    
    // Push CREATE parameters to stack: value, offset, size
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10
    
    // Allocate memory and set first byte to 0xEF
    try frame.memory.resize(10);
    try frame.memory.set(0, &[_]u8{0xEF} ++ &[_]u8{0} ** 9);
    
    // Execute CREATE operation
    const result = try opCreateSimulated(rules, &frame);
    
    // Verify CREATE failed with 0xEF as first byte
    try testing.expectEqual(@as(u64, 0), result);
    
    logger.info("Test PASSED: CREATE rejected contract starting with 0xEF with EIP-3541 enabled", .{});
}

// Test that CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled
test "CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled" {
    logger.info("Starting test: CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled", .{});
    
    // Setup test environment
    var frame = try Frame.init(testing.allocator);
    defer frame.deinit();
    
    // Create chain rules with EIP-3541 enabled
    const rules = ChainRules.init(true);
    
    // Push CREATE parameters to stack: value, offset, size
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10
    
    // Allocate memory and set first byte to 0x60 (not 0xEF)
    try frame.memory.resize(10);
    try frame.memory.set(0, &[_]u8{0x60} ++ &[_]u8{0} ** 9);
    
    // Execute CREATE operation
    const result = try opCreateSimulated(rules, &frame);
    
    // Verify CREATE succeeded with non-0xEF as first byte
    try testing.expectEqual(@as(u64, 0x1234), result);
    
    logger.info("Test PASSED: CREATE accepted contract not starting with 0xEF with EIP-3541 enabled", .{});
}

// Test that CREATE2 rejects contracts starting with 0xEF when EIP-3541 is enabled
test "CREATE2 rejects contracts starting with 0xEF with EIP-3541 enabled" {
    logger.info("Starting test: CREATE2 rejects contracts starting with 0xEF with EIP-3541 enabled", .{});
    
    // Setup test environment
    var frame = try Frame.init(testing.allocator);
    defer frame.deinit();
    
    // Create chain rules with EIP-3541 enabled
    const rules = ChainRules.init(true);
    
    // Push CREATE2 parameters to stack: value, offset, size, salt
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10
    try frame.stack.push(0); // salt: 0
    
    // Allocate memory and set first byte to 0xEF
    try frame.memory.resize(10);
    try frame.memory.set(0, &[_]u8{0xEF} ++ &[_]u8{0} ** 9);
    
    // Execute CREATE2 operation
    const result = try opCreate2Simulated(rules, &frame);
    
    // Verify CREATE2 failed with 0xEF as first byte
    try testing.expectEqual(@as(u64, 0), result);
    
    logger.info("Test PASSED: CREATE2 rejected contract starting with 0xEF with EIP-3541 enabled", .{});
}

// Test that CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled
test "CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled" {
    logger.info("Starting test: CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled", .{});
    
    // Setup test environment
    var frame = try Frame.init(testing.allocator);
    defer frame.deinit();
    
    // Create chain rules with EIP-3541 enabled
    const rules = ChainRules.init(true);
    
    // Push CREATE2 parameters to stack: value, offset, size, salt
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10
    try frame.stack.push(0); // salt: 0
    
    // Allocate memory and set first byte to 0x60 (not 0xEF)
    try frame.memory.resize(10);
    try frame.memory.set(0, &[_]u8{0x60} ++ &[_]u8{0} ** 9);
    
    // Execute CREATE2 operation
    const result = try opCreate2Simulated(rules, &frame);
    
    // Verify CREATE2 succeeded with non-0xEF as first byte
    try testing.expectEqual(@as(u64, 0x5678), result);
    
    logger.info("Test PASSED: CREATE2 accepted contract not starting with 0xEF with EIP-3541 enabled", .{});
}

// Test that CREATE accepts contracts starting with 0xEF when EIP-3541 is disabled
test "CREATE accepts contracts starting with 0xEF with EIP-3541 disabled" {
    logger.info("Starting test: CREATE accepts contracts starting with 0xEF with EIP-3541 disabled", .{});
    
    // Setup test environment
    var frame = try Frame.init(testing.allocator);
    defer frame.deinit();
    
    // Create chain rules with EIP-3541 disabled
    const rules = ChainRules.init(false);
    
    // Push CREATE parameters to stack: value, offset, size
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10
    
    // Allocate memory and set first byte to 0xEF
    try frame.memory.resize(10);
    try frame.memory.set(0, &[_]u8{0xEF} ++ &[_]u8{0} ** 9);
    
    // Execute CREATE operation
    const result = try opCreateSimulated(rules, &frame);
    
    // Verify CREATE succeeded with 0xEF as first byte when EIP-3541 is disabled
    try testing.expectEqual(@as(u64, 0x1234), result);
    
    logger.info("Test PASSED: CREATE accepted contract starting with 0xEF with EIP-3541 disabled", .{});
}

// Test that CREATE2 accepts contracts starting with 0xEF when EIP-3541 is disabled
test "CREATE2 accepts contracts starting with 0xEF with EIP-3541 disabled" {
    logger.info("Starting test: CREATE2 accepts contracts starting with 0xEF with EIP-3541 disabled", .{});
    
    // Setup test environment
    var frame = try Frame.init(testing.allocator);
    defer frame.deinit();
    
    // Create chain rules with EIP-3541 disabled
    const rules = ChainRules.init(false);
    
    // Push CREATE2 parameters to stack: value, offset, size, salt
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10
    try frame.stack.push(0); // salt: 0
    
    // Allocate memory and set first byte to 0xEF
    try frame.memory.resize(10);
    try frame.memory.set(0, &[_]u8{0xEF} ++ &[_]u8{0} ** 9);
    
    // Execute CREATE2 operation
    const result = try opCreate2Simulated(rules, &frame);
    
    // Verify CREATE2 succeeded with 0xEF as first byte when EIP-3541 is disabled
    try testing.expectEqual(@as(u64, 0x5678), result);
    
    logger.info("Test PASSED: CREATE2 accepted contract starting with 0xEF with EIP-3541 disabled", .{});
}
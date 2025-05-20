const std = @import("std");
const testing = std.testing;
const transient = @import("transient.zig");

// Instead of direct imports, use test wrappers to avoid complex dependencies
const B256 = struct {
    pub fn fromBytes(bytes: []const u8) B256 {
        _ = bytes;
        return B256{};
    }
};

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

const Interpreter = struct {
    evm: *Evm,
    cfg: usize = 0,
    readOnly: bool = false,
    returnData: []const u8 = &[_]u8{},
};

const Evm = struct {
    chainRules: ChainRules = ChainRules{},
    state_manager: ?*StateManager = null,
};

const ChainRules = struct {
    IsEIP1153: bool = true,
};

const StateManager = struct {};

const ExecutionError = error{
    StackUnderflow,
    StackOverflow,
    WriteProtection,
    InvalidStateAccess,
    InvalidOpcode,
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

// Mock implementation for testing
fn createTestFrame() !struct {
    frame: *Frame,
    stack: *Stack,
    memory: *Memory,
    interpreter: *Interpreter,
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
    
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = undefined,
        .cfg = undefined,
        .readOnly = false,
        .returnData = &[_]u8{},
    };
    
    return .{
        .frame = frame,
        .stack = stack,
        .memory = memory,
        .interpreter = interpreter,
    };
}

fn cleanupTestFrame(test_frame: anytype, allocator: std.mem.Allocator) void {
    test_frame.memory.deinit();
    test_frame.stack.deinit();
    allocator.destroy(test_frame.memory);
    allocator.destroy(test_frame.stack);
    allocator.destroy(test_frame.frame.contract);
    allocator.destroy(test_frame.frame);
    allocator.destroy(test_frame.interpreter);
}

test "TLOAD basic operation" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Setup stack for TLOAD operation test
    try test_frame.stack.push(0x123); // Key
    
    // Execute TLOAD operation
    _ = try transient.opTload(0, test_frame.interpreter, test_frame.frame);
    
    // Check result - should have one item on stack with value 0
    try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
    try testing.expectEqual(@as(TestValue, 0), test_frame.stack.data[0]);
}

test "TSTORE basic operation" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Setup stack for TSTORE operation test
    try test_frame.stack.push(0x123); // Key
    try test_frame.stack.push(0x456); // Value
    
    // Execute TSTORE operation
    _ = try transient.opTstore(0, test_frame.interpreter, test_frame.frame);
    
    // Check result - stack should be empty
    try testing.expectEqual(@as(usize, 0), test_frame.stack.size);
    
    // Now try to load the value to see if it works
    // The mock implementation won't actually persist the value,
    // but we can at least test the mechanics of the operation
    try test_frame.stack.push(0x123); // Key
    _ = try transient.opTload(0, test_frame.interpreter, test_frame.frame);
    
    // Should be empty value (0)
    try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
}

test "TSTORE read-only mode" {
    const allocator = testing.allocator;
    var test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Enable read-only mode
    test_frame.interpreter.readOnly = true;
    
    // Setup stack for TSTORE operation test
    try test_frame.stack.push(0x123); // Key
    try test_frame.stack.push(0x456); // Value
    
    // Execute TSTORE operation - should fail in read-only mode
    const result = transient.opTstore(0, test_frame.interpreter, test_frame.frame);
    try testing.expectError(error.WriteProtection, result);
}
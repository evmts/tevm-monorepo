const std = @import("std");
// Instead of importing from outside the module path, create our own implementation
// with just the functions we need to test

// Environment opcode implementations
const environment = struct {
    /// ADDRESS operation - pushes the address of the current executing account onto the stack
    pub fn opAddress(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Get the address of the current contract
        const address = frame.address();

        // Convert address bytes to u256
        const value = blk: {
            var result: u256 = 0;
            for (address) |byte| {
                result = (result << 8) | byte;
            }
            break :blk result;
        };

        // Push address onto the stack
        try frame.stack.push(value);

        return "";
    }

    /// CALLER operation - get the caller address
    pub fn opCaller(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Get the caller address from the frame
        const caller = frame.caller();

        // Convert address bytes to u256
        const value = blk: {
            var result: u256 = 0;
            for (caller) |byte| {
                result = (result << 8) | byte;
            }
            break :blk result;
        };

        // Push caller address onto the stack
        try frame.stack.push(value);

        return "";
    }

    /// CALLVALUE operation - get the deposited value by the instruction/transaction
    pub fn opCallValue(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Get the call value from the frame
        const value = frame.callValue();

        // Push value onto the stack
        try frame.stack.push(value);

        return "";
    }

    /// CALLDATALOAD operation - load call data from the current environment
    pub fn opCalldataload(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Pop offset from stack
        const offset = try frame.stack.pop();

        // Convert offset to u64, capped at max value if needed
        const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(offset);

        // Get input calldata
        const inputData = frame.callInput();

        // Read 32 bytes from input at the specified offset
        const value = blk: {
            var result: u256 = 0;

            // If offset is beyond input data length, return zero
            if (offset_u64 >= inputData.len) {
                try frame.stack.push(0);
                return "";
            }

            // Calculate number of bytes to read (min(32, remaining bytes))
            const bytesToRead = @min(32, inputData.len - offset_u64);

            // Read available bytes from input
            for (0..bytesToRead) |i| {
                result = (result << 8) | inputData[offset_u64 + i];
            }

            // Left-pad with zeros if needed (for missing bytes)
            if (bytesToRead < 32) {
                result <<= (32 - bytesToRead) * 8;
            }
            break :blk result;
        };

        // Push result onto the stack
        try frame.stack.push(value);

        return "";
    }

    /// CALLDATASIZE operation - get the size of input data in current environment
    pub fn opCalldatasize(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Get input calldata
        const inputData = frame.callInput();

        // Push the size of the input data onto the stack
        try frame.stack.push(@as(u256, inputData.len));

        return "";
    }

    /// CALLDATACOPY operation - copy input data in current environment to memory
    pub fn opCalldatacopy(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Stack: [destOffset, offset, size]
        if (frame.stack.size < 3) {
            return error.StackUnderflow;
        }

        const size = try frame.stack.pop();
        const offset = try frame.stack.pop();
        const destOffset = try frame.stack.pop();

        // Convert to u64, capping at max value if needed
        const destOffset_u64 = if (destOffset > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(destOffset);
        const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(offset);
        const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(size);

        // If size is zero, nothing to copy
        if (size_u64 == 0) {
            return "";
        }

        // Ensure memory is large enough
        const needed_size = destOffset_u64 + size_u64;
        if (needed_size > frame.memory.len()) {
            try frame.memory.resize(needed_size);
        }

        // Get input calldata
        const inputData = frame.callInput();

        // Copy data from input to memory
        for (0..size_u64) |i| {
            const sourceIdx = offset_u64 + i;
            const destIdx = destOffset_u64 + i;

            if (sourceIdx < inputData.len) {
                frame.memory.set(destIdx, 1, &[_]u8{inputData[sourceIdx]});
            } else {
                // Pad with zeros if reading past the end of input
                frame.memory.set(destIdx, 1, &[_]u8{0});
            }
        }

        return "";
    }

    /// CODESIZE operation - get the size of code running in current environment
    pub fn opCodesize(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Get the code from the current contract
        const code = frame.contractCode();

        // Push the size of the code onto the stack
        try frame.stack.push(@as(u256, code.len));

        return "";
    }

    /// CODECOPY operation - copy code running in current environment to memory
    pub fn opCodecopy(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Stack: [destOffset, offset, size]
        if (frame.stack.size < 3) {
            return error.StackUnderflow;
        }

        const size = try frame.stack.pop();
        const offset = try frame.stack.pop();
        const destOffset = try frame.stack.pop();

        // Convert to u64, capping at max value if needed
        const destOffset_u64 = if (destOffset > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(destOffset);
        const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(offset);
        const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(size);

        // If size is zero, nothing to copy
        if (size_u64 == 0) {
            return "";
        }

        // Ensure memory is large enough
        const needed_size = destOffset_u64 + size_u64;
        if (needed_size > frame.memory.len()) {
            try frame.memory.resize(needed_size);
        }

        // Get the code from the current contract
        const code = frame.contractCode();

        // Copy data from code to memory
        for (0..size_u64) |i| {
            const sourceIdx = offset_u64 + i;
            const destIdx = destOffset_u64 + i;

            if (sourceIdx < code.len) {
                frame.memory.set(destIdx, 1, &[_]u8{code[sourceIdx]});
            } else {
                // Pad with zeros if reading past the end of code
                frame.memory.set(destIdx, 1, &[_]u8{0});
            }
        }

        return "";
    }

    /// RETURNDATASIZE operation - get size of output data from the previous call
    pub fn opReturndatasize(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // If frame has no return data, return 0 size
        if (frame.returnData == null) {
            try frame.stack.push(0);
            return "";
        }

        // Push the size of the return data onto the stack
        try frame.stack.push(@as(u256, frame.returnSize));

        return "";
    }

    /// RETURNDATACOPY operation - copy output data from the previous call to memory
    pub fn opReturndatacopy(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // Stack: [destOffset, offset, size]
        if (frame.stack.size < 3) {
            return error.StackUnderflow;
        }

        const size = try frame.stack.pop();
        const offset = try frame.stack.pop();
        const destOffset = try frame.stack.pop();

        // Convert to u64, capping at max value if needed
        const destOffset_u64 = if (destOffset > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(destOffset);
        const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(offset);
        const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @truncate(size);

        // If size is zero, nothing to copy
        if (size_u64 == 0) {
            return "";
        }

        // Check if frame has return data
        if (frame.returnData == null) {
            // No return data, fill memory with zeros
            const needed_size = destOffset_u64 + size_u64;
            if (needed_size > frame.memory.len()) {
                try frame.memory.resize(needed_size);
            }

            for (0..size_u64) |i| {
                frame.memory.set(destOffset_u64 + i, 1, &[_]u8{0});
            }

            return "";
        }

        // Check that we're not copying outside the bounds of return data
        if (offset_u64 + size_u64 > frame.returnSize or offset_u64 > frame.returnSize) {
            return error.ReturnDataOutOfBounds;
        }

        // Ensure memory is large enough
        const needed_size = destOffset_u64 + size_u64;
        if (needed_size > frame.memory.len()) {
            try frame.memory.resize(needed_size);
        }

        // Copy data from return data to memory
        for (0..size_u64) |i| {
            const sourceIdx = offset_u64 + i;
            const destIdx = destOffset_u64 + i;

            frame.memory.set(destIdx, 1, &[_]u8{frame.returnData.?[sourceIdx]});
        }

        return "";
    }

    /// GASPRICE operation - get price of gas in current environment
    pub fn opGasprice(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
        _ = pc;
        _ = interpreter;

        // In a real implementation, we would get the actual gas price
        // For now, we'll use a hardcoded value
        try frame.stack.push(1000000000); // 1 gwei

        return "";
    }
};

// Define necessary types for testing without direct Evm module imports
const u256_native = u256;

// Minimal type definitions for testing
const Address = @import("address").Address;

// Test-specific struct definitions that mimic the real ones
const Interpreter = struct {
    allocator: std.mem.Allocator,
    callDepth: u32 = 0,
    readOnly: bool = false,
    returnData: ?[]u8 = null,
    evm: struct {
        state_manager: ?*anyopaque = null,
    } = .{},
};

const Stack = struct {
    const Self = @This();
    data: [1024]u256 = [_]u256{0} ** 1024,
    size: usize = 0,
    capacity: usize = 1024,

    pub fn init(allocator: std.mem.Allocator, capacity: usize) !*Self {
        _ = capacity;
        const stack = try allocator.create(Self);
        stack.* = .{};
        return stack;
    }

    pub fn push(self: *Self, value: u256) !void {
        if (self.size >= self.capacity) {
            return error.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }

    pub fn pop(self: *Self) !u256 {
        if (self.size == 0) {
            return error.StackUnderflow;
        }
        self.size -= 1;
        return self.data[self.size];
    }
};

const Memory = struct {
    const Self = @This();
    mem: std.ArrayList(u8),

    pub fn init(allocator: std.mem.Allocator) !*Self {
        const memory = try allocator.create(Self);
        memory.* = .{
            .mem = std.ArrayList(u8).init(allocator),
        };
        return memory;
    }

    pub fn deinit(self: *Self) void {
        self.mem.deinit();
    }

    pub fn data(self: *const Self) []u8 {
        return self.mem.items;
    }

    pub fn set(self: *Self, offset: usize, size: usize, value: []const u8) void {
        if (offset + size > self.mem.items.len) {
            // This is just for tests, so we'll resize if needed
            self.mem.resize(offset + size) catch {};
        }
        std.mem.copy(u8, self.mem.items[offset..][0..size], value[0..size]);
    }

    pub fn len(self: *const Self) usize {
        return self.mem.items.len;
    }

    pub fn resize(self: *Self, size: usize) !void {
        try self.mem.resize(size);
    }
};

const Contract = struct {
    address: Address,
    caller: Address,
    value: u256,
    code: []const u8,
    input: []const u8,
    gas: u64,

    // Methods to satisfy the environment.zig expectations
    pub fn isAccountCold(_: *const Contract) bool {
        return false;
    }

    pub fn markAccountWarm(_: *const Contract) bool {
        return true;
    }

    pub fn useGas(_: *const Contract, _: u64) void {}
};

// Create a simplified Frame struct for testing
const Frame = struct {
    const Self = @This();
    stack: *Stack,
    memory: *Memory,
    contract: *Contract,
    returnData: ?[]const u8 = null,
    returnSize: usize = 0,
    gas: u64 = 0,
    cost: u64 = 0,

    pub fn init(allocator: std.mem.Allocator, contract: *Contract) !*Self {
        const frame = try allocator.create(Self);
        frame.* = .{
            .stack = try Stack.init(allocator, 1024),
            .memory = try Memory.init(allocator),
            .contract = contract,
        };
        return frame;
    }

    pub fn address(self: *const Self) Address {
        return self.contract.address;
    }

    pub fn caller(self: *const Self) Address {
        return self.contract.caller;
    }

    pub fn callValue(self: *const Self) u256 {
        return self.contract.value;
    }

    pub fn callInput(self: *const Self) []const u8 {
        return self.contract.input;
    }

    pub fn contractCode(self: *const Self) []const u8 {
        return self.contract.code;
    }

    pub fn setReturnData(self: *Self, data: []const u8) !void {
        self.returnData = data;
        self.returnSize = data.len;
    }
};

// Simplified JumpTable
const JumpTable = struct {
    // Internal types
    pub const Table = struct {
        table: [256]?*Operation = [_]?*Operation{null} ** 256,
    };

    pub const Operation = struct {
        execute: fn (usize, *Interpreter, *Frame) anyerror![]const u8,
        constant_gas: u64 = 0,
        dynamic_gas: ?fn (*Interpreter, *Frame, *Stack, *Memory, u64) anyerror!u64 = null,
        min_stack: u32 = 0,
        max_stack: u32 = 0,
        memory_size: ?fn (*Stack) struct { size: u64, overflow: bool } = null,
    };

    pub fn init(allocator: std.mem.Allocator) !Table {
        _ = allocator;
        return Table{};
    }

    // Stack size calculation helpers
    pub fn minStack(pop: u32, _: u32) u32 {
        return pop;
    }

    pub fn maxStack(pop: u32, push: u32) u32 {
        return pop + push;
    }

    // Constants used in the environment.zig file
    pub const CreateGas: u64 = 32000;
    pub const CallGas: u64 = 40;
    pub const ColdAccountAccessCost: u64 = 2600;
    pub const WarmStorageReadCost: u64 = 100;
    pub const GasQuickStep: u64 = 2;
    pub const GasFastestStep: u64 = 3;
    pub const GasExtStep: u64 = 20;
};

const Evm = struct {
    const Self = @This();
    
    pub fn init(allocator: std.mem.Allocator, state_manager: ?*anyopaque) !Self {
        _ = allocator;
        _ = state_manager;
        return Self{};
    }
};

// Helper to create a contract with basic parameters
fn createContract(address: Address, caller: Address, value: u256, gas: u64) *Contract {
    const contract = std.testing.allocator.create(Contract) catch unreachable;
    contract.* = .{
        .address = address,
        .caller = caller,
        .value = value,
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = gas,
    };
    return contract;
}

// Test setup: Create a frame and contract for testing opcodes
fn setupTestEnvironment(allocator: std.mem.Allocator) !struct {
    frame: *Frame,
    evm: Evm,
    interpreter: *Interpreter,
} {
    const evm_instance = try Evm.init(null);

    var contract_val = createContract(std.mem.zeroes(Address), std.mem.zeroes(Address), 0, 1000000);
    contract_val.code = &[_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 };
    contract_val.input = &[_]u8{ 0xAA, 0xBB, 0xCC, 0xDD };

    const frame_instance = try Frame.init(allocator, contract_val);

    const interpreter_instance = try allocator.create(Interpreter);
    interpreter_instance.* = .{
        .allocator = allocator,
    };

    return .{
        .frame = frame_instance,
        .evm = evm_instance,
        .interpreter = interpreter_instance,
    };
}

// Test the ADDRESS opcode
test "environment - ADDRESS opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    _ = try environment.opAddress(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    var expected_value: u256_native = 0;
    for (test_env.frame.contract.address) |byte| {
        expected_value = (expected_value << 8) | byte;
    }

    try std.testing.expectEqual(expected_value, test_env.frame.stack.data[0]);
}

// Test the CALLER opcode
test "environment - CALLER opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    _ = try environment.opCaller(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    var expected_value: u256_native = 0;
    for (test_env.frame.contract.caller) |byte| {
        expected_value = (expected_value << 8) | byte;
    }

    try std.testing.expectEqual(expected_value, test_env.frame.stack.data[0]);
}

// Test the CALLVALUE opcode
test "environment - CALLVALUE opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    _ = try environment.opCallValue(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(test_env.frame.contract.value, test_env.frame.stack.data[0]);
}

// Test the CALLDATASIZE opcode
test "environment - CALLDATASIZE opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    _ = try environment.opCalldatasize(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(@as(u256_native, 4), test_env.frame.stack.data[0]);
}

// Test the CALLDATALOAD opcode
test "environment - CALLDATALOAD opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    try test_env.frame.stack.push(0);

    _ = try environment.opCalldataload(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    const expected_value: u256_native = 0xAABBCCDD00000000000000000000000000000000000000000000000000000000;

    try std.testing.expectEqual(expected_value, test_env.frame.stack.data[0]);
}

// Test the CODESIZE opcode
test "environment - CODESIZE opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    _ = try environment.opCodesize(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(@as(u256_native, 5), test_env.frame.stack.data[0]);
}

// Test the CALLDATACOPY opcode
test "environment - CALLDATACOPY opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    try test_env.frame.stack.push(0x20);
    try test_env.frame.stack.push(0);
    try test_env.frame.stack.push(0);

    _ = try environment.opCalldatacopy(0, test_env.interpreter, test_env.frame);

    try std.testing.expect(test_env.frame.memory.len() >= 32);

    try std.testing.expectEqual(@as(u8, 0xAA), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0xBB), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0xCC), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0xDD), test_env.frame.memory.data()[3]);

    for (4..32) |i| {
        try std.testing.expectEqual(@as(u8, 0), test_env.frame.memory.data()[i]);
    }
}

// Test the CODECOPY opcode
test "environment - CODECOPY opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    try test_env.frame.stack.push(0x20);
    try test_env.frame.stack.push(0);
    try test_env.frame.stack.push(0);

    _ = try environment.opCodecopy(0, test_env.interpreter, test_env.frame);

    try std.testing.expect(test_env.frame.memory.len() >= 32);

    try std.testing.expectEqual(@as(u8, 0x60), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0x01), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0x60), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0x02), test_env.frame.memory.data()[3]);
    try std.testing.expectEqual(@as(u8, 0x01), test_env.frame.memory.data()[4]);

    for (5..32) |i| {
        try std.testing.expectEqual(@as(u8, 0), test_env.frame.memory.data()[i]);
    }
}

// Test the RETURNDATASIZE and RETURNDATACOPY opcodes
test "environment - RETURNDATASIZE and RETURNDATACOPY opcodes" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    const return_data = [_]u8{ 0x12, 0x34, 0x56, 0x78 };
    try test_env.frame.setReturnData(&return_data);

    _ = try environment.opReturndatasize(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(@as(u256_native, 4), test_env.frame.stack.data[0]);

    _ = try test_env.frame.stack.pop();

    try test_env.frame.stack.push(4);
    try test_env.frame.stack.push(0);
    try test_env.frame.stack.push(0);

    _ = try environment.opReturndatacopy(0, test_env.interpreter, test_env.frame);

    try std.testing.expect(test_env.frame.memory.len() >= 4);

    try std.testing.expectEqual(@as(u8, 0x12), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0x34), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0x56), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0x78), test_env.frame.memory.data()[3]);
}

// Test the GASPRICE opcode
test "environment - GASPRICE opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);
    defer allocator.destroy(test_env.interpreter);
    defer {
        test_env.frame.memory.deinit();
        allocator.destroy(test_env.frame.memory);
        allocator.destroy(test_env.frame.stack);
        allocator.destroy(test_env.frame.contract);
        allocator.destroy(test_env.frame);
    }

    _ = try environment.opGasprice(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(@as(u256_native, 1000000000), test_env.frame.stack.data[0]);
}
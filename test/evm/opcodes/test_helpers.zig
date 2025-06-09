const std = @import("std");
const testing = std.testing;

// Import necessary EVM components
// Import through evm module to avoid path issues
const evm = @import("evm");
pub const Stack = evm.Stack;
pub const Memory = evm.Memory;
pub const Frame = evm.Frame;
pub const Contract = evm.Contract;
pub const Address = evm.Address;
pub const Vm = evm.Vm;
pub const Operation = evm.Operation;
pub const OperationModule = evm.OperationModule;
pub const ExecutionError = evm.ExecutionError;
pub const opcodes = evm.opcodes;
pub const Hardfork = evm.Hardfork.Hardfork;
pub const JumpTable = evm.JumpTable;
pub const ChainRules = evm.chain_rules;

/// Mock settings for testing
pub const TestVm = struct {
    vm: *Vm,

    const Self = @This();

    pub fn init(allocator: std.mem.Allocator) !Self {
        const vm = try allocator.create(Vm);
        vm.* = try Vm.init(allocator, null, null);
        return Self{
            .vm = vm,
        };
    }

    pub fn init_with_hardfork(allocator: std.mem.Allocator, hardfork: evm.Hardfork.Hardfork) !Self {
        const vm = try allocator.create(Vm);
        vm.* = try Vm.init_with_hardfork(allocator, hardfork);
        return Self{
            .vm = vm,
        };
    }

    pub fn deinit(self: *Self, allocator: std.mem.Allocator) void {
        self.vm.deinit();
        allocator.destroy(self.vm);
    }
};

/// Test frame with standard setup for opcode testing
pub const TestFrame = struct {
    frame: *Frame,
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator, contract: *Contract, gas: u64) !TestFrame {
        const frame_ptr = try allocator.create(Frame);
        errdefer allocator.destroy(frame_ptr);

        frame_ptr.* = try Frame.init(allocator, contract);
        frame_ptr.gas_remaining = gas;
        // Set the frame input from the contract input for testing
        frame_ptr.input = contract.input;

        // Now that frame is at its final location, finalize the memory
        frame_ptr.memory.finalize_root();

        return TestFrame{
            .frame = frame_ptr,
            .allocator = allocator,
        };
    }

    pub fn deinit(self: *TestFrame) void {
        self.frame.deinit();
        self.allocator.destroy(self.frame);
    }

    /// Push values to stack
    pub fn pushStack(self: *TestFrame, values: []const u256) !void {
        for (values) |value| {
            try self.frame.stack.append(value);
        }
    }

    /// Pop value from stack
    pub fn popStack(self: *TestFrame) !u256 {
        return try self.frame.stack.pop();
    }

    /// Get stack size
    pub fn stackSize(self: *const TestFrame) usize {
        return self.frame.stack.size;
    }

    /// Set memory at offset
    pub fn setMemory(self: *TestFrame, offset: usize, data: []const u8) !void {
        try self.frame.memory.set_data(offset, data);
    }

    /// Get memory slice
    pub fn getMemory(self: *const TestFrame, offset: usize, size: usize) ![]const u8 {
        return try self.frame.memory.get_slice(offset, size);
    }

    /// Set input data
    pub fn setInput(self: *TestFrame, data: []const u8) void {
        self.frame.input = data;
    }

    /// Set return data buffer
    pub fn setReturnData(self: *TestFrame, data: []u8) void {
        self.frame.return_data_buffer = data;
    }

    /// Check if frame is static
    pub fn setStatic(self: *TestFrame, is_static: bool) void {
        self.frame.is_static = is_static;
    }

    /// Get remaining gas
    pub fn gasRemaining(self: *const TestFrame) u64 {
        return self.frame.gas_remaining;
    }

    /// Get gas used
    pub fn gasUsed(self: *const TestFrame, initial_gas: u64) u64 {
        return initial_gas - self.frame.gas_remaining;
    }
};

/// Create a test contract with default values
pub fn createTestContract(
    allocator: std.mem.Allocator,
    address: Address.Address,
    caller: Address.Address,
    value: u256,
    code: []const u8,
) !Contract {
    _ = allocator; // Not needed for Contract.init

    // Calculate proper code hash
    var code_hash: [32]u8 = undefined;
    if (code.len > 0) {
        var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
        hasher.update(code);
        hasher.final(&code_hash);
    } else {
        code_hash = [_]u8{0} ** 32;
    }

    return Contract.init(
        caller,
        address,
        value,
        1_000_000, // Default gas
        code,
        code_hash,
        &[_]u8{}, // Empty input
        false, // Not static
    );
}

/// Execute an opcode and return the result
pub fn executeOpcode(
    opcode_byte: u8,
    vm: *Vm,
    frame: *Frame,
) ExecutionError.Error!OperationModule.ExecutionResult {
    const interpreter_ptr: *OperationModule.Interpreter = @ptrCast(vm);
    const state_ptr: *OperationModule.State = @ptrCast(frame);

    // Debug: Check if jump table has the opcode
    // const operation = vm.table.get_operation(opcode_byte);

    // Use the Vm's jump table to execute the opcode
    // For PC opcode (0x58), use the frame's program counter
    // For PUSH opcodes (0x60-0x7F), use the frame's program counter so they can read immediate data
    const pc_value = if (opcode_byte == 0x58 or (opcode_byte >= 0x60 and opcode_byte <= 0x7F))
        frame.pc
    else
        0;
    return try vm.table.execute(pc_value, interpreter_ptr, state_ptr, opcode_byte);
}

/// Execute an opcode through the jump table (with gas consumption)
pub fn executeOpcodeWithGas(
    jump_table: *const JumpTable,
    opcode: u8,
    vm: *Vm,
    frame: *Frame,
) !OperationModule.ExecutionResult {
    const interpreter_ptr: *OperationModule.Interpreter = @ptrCast(vm);
    const state_ptr: *OperationModule.State = @ptrCast(frame);
    return try jump_table.execute(0, interpreter_ptr, state_ptr, opcode);
}

/// Assert stack value at position (0 is top)
pub fn expectStackValue(frame: *const Frame, position: usize, expected: u256) !void {
    const actual = frame.stack.peek_n(position) catch |err| {
        std.debug.print("Failed to peek stack at position {d}: {any}\n", .{ position, err });
        return err;
    };
    try testing.expectEqual(expected, actual);
}

/// Assert memory value at offset
pub fn expectMemoryValue(frame: *const Frame, offset: usize, expected: []const u8) !void {
    const actual = try frame.memory.get_slice(offset, expected.len);
    try testing.expectEqualSlices(u8, expected, actual);
}

/// Assert gas consumption
pub fn expectGasUsed(frame: *const Frame, initial_gas: u64, expected_used: u64) !void {
    const actual_used = initial_gas - frame.gas_remaining;
    try testing.expectEqual(expected_used, actual_used);
}

/// Create test addresses
pub const TestAddresses = struct {
    pub const ALICE = Address.from_u256(0x1111111111111111111111111111111111111111);
    pub const BOB = Address.from_u256(0x2222222222222222222222222222222222222222);
    pub const CONTRACT = Address.from_u256(0x3333333333333333333333333333333333333333);
    pub const CHARLIE = Address.from_u256(0x4444444444444444444444444444444444444444);
    pub const RANDOM = Address.from_u256(0x5555555555555555555555555555555555555555);
};

/// Common test values
pub const TestValues = struct {
    pub const ONE_ETHER: u256 = 1_000_000_000_000_000_000;
    pub const ONE_GWEI: u256 = 1_000_000_000;
    pub const ONE_WEI: u256 = 1;
};

/// Helper to create byte arrays from hex strings
pub fn hexToBytes(comptime hex: []const u8) [hex.len / 2]u8 {
    comptime {
        var bytes: [hex.len / 2]u8 = undefined;
        var i: usize = 0;
        while (i < hex.len) : (i += 2) {
            const byte = std.fmt.parseInt(u8, hex[i .. i + 2], 16) catch unreachable;
            bytes[i / 2] = byte;
        }
        return bytes;
    }
}

/// Helper to convert u256 to 32-byte array (big-endian)
pub fn u256ToBytes(value: u256) [32]u8 {
    var bytes: [32]u8 = [_]u8{0} ** 32;
    var v = value;
    var i: usize = 31;
    while (v > 0) : (i -%= 1) {
        bytes[i] = @truncate(v & 0xFF);
        v >>= 8;
        if (i == 0) break;
    }
    return bytes;
}

/// Helper to convert byte array to u256 (big-endian)
pub fn bytesToU256(bytes: []const u8) u256 {
    var value: u256 = 0;
    for (bytes) |byte| {
        value = (value << 8) | byte;
    }
    return value;
}

/// Helper to convert Address to u256
pub fn toU256(address: Address.Address) u256 {
    return Address.to_u256(address);
}

/// Print stack contents for debugging
pub fn printStack(frame: *const Frame) void {
    std.debug.print("Stack (size={d}): ", .{frame.stack.size});
    var i: usize = 0;
    while (i < frame.stack.size) : (i += 1) {
        const value = frame.stack.peek_n(i) catch break;
        std.debug.print("0x{x} ", .{value});
    }
    std.debug.print("\n", .{});
}

/// Print memory contents for debugging
pub fn printMemory(frame: *const Frame, offset: usize, size: usize) void {
    const data = frame.memory.get_slice(offset, size) catch {
        std.debug.print("Failed to read memory at offset {}\n", .{offset});
        return;
    };
    std.debug.print("Memory[{}..{}]: ", .{ offset, offset + size });
    for (data) |byte| {
        std.debug.print("{x:0>2} ", .{byte});
    }
    std.debug.print("\n", .{});
}

/// Helper function to run bytecode for testing (replaces vm.run_bytecode)
/// This sets up a contract at the given address with the bytecode and executes it
pub const RunBytecodeError = std.mem.Allocator.Error || ExecutionError.Error;
pub fn runBytecode(
    vm: *Vm,
    bytecode: []const u8,
    address: Address.Address,
    gas: u64,
    input: ?[]const u8,
) RunBytecodeError!evm.RunResult {
    // Create a contract at the specified address
    var contract = Contract.init_at_address(
        address, // caller
        address, // address where code executes
        0, // value
        gas,
        bytecode,
        input orelse &[_]u8{},
        false, // not static
    );
    defer contract.deinit(vm.allocator, null);

    // Set the code for the contract address in VM state
    try vm.state.set_code(address, bytecode);

    // Execute the contract
    return try vm.interpret(&contract, input orelse &[_]u8{});
}

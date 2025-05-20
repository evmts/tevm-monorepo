const std = @import("std");

// Let's create simplified mock types for testing
pub const ExecutionError = error{
    StackUnderflow,
    StackOverflow,
    OutOfGas,
    InvalidJump,
    InvalidOpcode,
};

pub const Address = struct {
    data: [20]u8,
    
    pub fn zero() Address {
        return Address{ .data = [_]u8{0} ** 20 };
    }
};

// Define a simplified Stack implementation for testing
pub const Stack = struct {
    data: []u64,
    size: usize = 0,
    
    pub fn pop(self: *Stack) !u64 {
        if (self.size == 0) return ExecutionError.StackUnderflow;
        self.size -= 1;
        const value = self.data[self.size];
        // Clear the popped value for security
        self.data[self.size] = 0;
        return value;
    }
    
    pub fn push(self: *Stack, value: u64) !void {
        if (self.size >= self.data.len) return ExecutionError.StackOverflow;
        self.data[self.size] = value;
        self.size += 1;
    }
    
    pub fn peek(self: *Stack) !*u64 {
        if (self.size == 0) return ExecutionError.StackUnderflow;
        return &self.data[self.size - 1];
    }
};

// Mock Frame type with only what we need for tests
pub const Frame = struct {
    stack: Stack,
    
    pub fn init(allocator: std.mem.Allocator, _: *Contract) !Frame {
        _ = allocator;
        
        return Frame {
            .stack = Stack{
                .data = undefined,  // Will be initialized by the test
            },
        };
    }
    
    pub fn deinit(self: *Frame) void {
        _ = self;
    }
};

// Mock Interpreter type
pub const Interpreter = struct {
    evm: *Evm,
    cfg: u32 = 0,
    readOnly: bool = false,
    returnData: []const u8 = &[_]u8{},
};

// Mock Evm type
pub const Evm = struct {
    depth: u64 = 0,
    readOnly: bool = false,
    chainRules: struct {
        IsEIP4844: bool = true,
        IsEIP5656: bool = true,
    } = .{},
    state_manager: ?*anyopaque = null,
};

// Mock Contract type
pub const Contract = struct {
    code: []u8,
    input: []const u8 = &[_]u8{},
    address: Address = Address.zero(),
    code_address: Address = Address.zero(),
    value: u64 = 0,
    gas: u64 = 1000000,
    gas_refund: u64 = 0,
};

// Mock Memory type
pub const Memory = struct {
    data: []u8 = &[_]u8{},
};

// Mock JumpTable and related types
pub const JumpTable = struct {
    pub const GasFastStep: u64 = 5;
    pub const GasMidStep: u64 = 8;
    pub const GasSlowStep: u64 = 10;
    
    pub fn minStack(pop: u64, _: u64) u64 {
        return pop;
    }
    
    pub fn maxStack(pop: u64, push: u64) u64 {
        return pop + push;
    }
    
    pub const Operation = struct {
        execute: fn (usize, *Interpreter, *Frame) ExecutionError![]const u8,
        constant_gas: u64 = 0,
        dynamic_gas: ?fn(*Interpreter, *Frame, *Stack, *Memory, u64) error{OutOfGas}!u64 = null,
        min_stack: u64 = 0,
        max_stack: u64 = 0,
    };
    
    pub const JumpTable = struct {
        table: [256]?*Operation = [_]?*Operation{null} ** 256,
    };
};

// Mock LogEntry type
pub const Log = struct {
    address: Address,
    topics: []u64,
    data: []u8,
};

// Mock ExecutionStatus type
pub const ExecutionStatus = enum {
    Success,
    Failure,
    Revert,
};

/// Creates a mock contract for testing
pub fn createMockContract(allocator: std.mem.Allocator, code: []const u8) !*Contract {
    const contract = try allocator.create(Contract);
    
    contract.* = Contract{
        .code = try allocator.dupe(u8, code),
    };
    return contract;
}

/// Creates a mock EVM instance
pub fn createMockEvm(allocator: std.mem.Allocator) !*Evm {
    const evm = try allocator.create(Evm);
    evm.* = Evm{};
    return evm;
}

/// Creates a mock interpreter
pub fn createMockInterpreter(allocator: std.mem.Allocator, evm: *Evm) !*Interpreter {
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = evm,
    };
    return interpreter;
}
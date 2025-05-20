// Simplified package module for opcodes tests only
// This uses simplified types that don't rely on external dependencies

const std = @import("std");

// Error type for test simplicity
pub const ExecutionError = error{
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    InvalidOpcode,
    OutOfGas,
    STOP,
    REVERT,
    WriteProtection,
    StaticStateChange,
    INVALID,
};

// Define a u256 type for testing - matches what's used in math2.test.zig
pub const @"u256" = u64;

// Minimal Address implementation for testing
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
    capacity: usize,
    
    pub fn pop(self: *Stack) !@"u256" {
        if (self.size == 0) return ExecutionError.StackUnderflow;
        self.size -= 1;
        const value = self.data[self.size];
        // Clear the popped value for security
        self.data[self.size] = 0;
        return value;
    }
    
    pub fn push(self: *Stack, value: @"u256") !void {
        if (self.size >= self.capacity) return ExecutionError.StackOverflow;
        self.data[self.size] = value;
        self.size += 1;
    }
    
    pub fn peek(self: *Stack) !*@"u256" {
        if (self.size == 0) return ExecutionError.StackUnderflow;
        return &self.data[self.size - 1];
    }
};

// Minimal Memory implementation for testing
pub const Memory = struct {
    data: []u8 = undefined,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) Memory {
        return Memory{
            .allocator = allocator,
            .data = allocator.alloc(u8, 64) catch unreachable,
        };
    }
    
    pub fn deinit(self: *Memory) void {
        self.allocator.free(self.data);
    }
    
    pub fn size(self: *const Memory) usize {
        return self.data.len;
    }
    
    pub fn get8(self: *const Memory, offset: usize) u8 {
        if (offset >= self.data.len) {
            // Safety - return 0 for out of bounds but also ensure memory is sized correctly
            @panic("Memory access out of bounds");
        }
        return self.data[offset];
    }
    
    pub fn store8(self: *Memory, offset: usize, value: u8) !void {
        try self.requireMemory(offset, 1);
        self.data[offset] = value;
    }
    
    pub fn resize(self: *Memory, new_size: usize) !void {
        // Safety check - don't allow resizing to unreasonable sizes
        const max_size: usize = 1024 * 1024 * 10; // 10 MB max for safety
        if (new_size > max_size) {
            return ExecutionError.OutOfGas;
        }
        
        self.data = try self.allocator.realloc(self.data, new_size);
        
        // Zero out the newly allocated space
        if (new_size > self.data.len) {
            @memset(self.data[self.data.len..new_size], 0);
        }
    }
    
    pub fn require(self: *Memory, offset: usize, length: usize) !void {
        try self.requireMemory(offset, length);
    }

    pub fn requireMemory(self: *Memory, offset: usize, length: usize) !void {
        // Check for overflow
        if (length > 0 and offset > std.math.maxInt(usize) - length) {
            return ExecutionError.OutOfGas;
        }
        
        const required_size = offset + length;
        if (required_size > self.data.len) {
            try self.resize(required_size);
        }
    }
};

// Simplified Contract implementation
pub const Contract = struct {
    code: []u8,
    input: []const u8 = &[_]u8{},
    address: Address = Address.zero(),
    code_address: Address = Address.zero(),
    value: u64 = 0,
    gas: u64 = 1000000,
    
    pub fn init(address: Address, code_address: Address) Contract {
        return Contract{
            .address = address,
            .code_address = code_address,
            .code = &[_]u8{},
        };
    }
};

// Evm structure for testing
pub const Evm = struct {
    pub const Log = struct {
        address: Address,
        topics: []u64,
        data: []u8,
    };
    
    depth: u64 = 0,
    readOnly: bool = false,
    chainRules: struct {
        IsEIP4844: bool = true,
        IsEIP5656: bool = true,
    } = .{},
    gas_used: u64 = 0,
    remaining_gas: u64 = 1000000,
    refund: u64 = 0,
    chainDB: ?*anyopaque = null,
    state_manager: ?*anyopaque = null,
    context: ?*anyopaque = null,
    logs: std.ArrayList(Log),
};

// Simplified Frame for testing
pub const Frame = struct {
    pc: usize = 0,
    stack: Stack,
    memory: Memory,
    contract: *Contract,
    returnData: ?[]u8 = null,
    logger: *Logger = undefined,
    
    pub fn init(allocator: std.mem.Allocator, contract: *Contract) !Frame {
        const memory = Memory.init(allocator);
        
        // Initialize a stack with 1024 slots
        const stack_capacity = 1024;
        const stack_data = try allocator.alloc(u64, stack_capacity);
        @memset(stack_data, 0);

        // Create a dummy logger
        const logger = try allocator.create(Logger);
        logger.* = Logger.init("test-frame");
        
        return Frame{
            .contract = contract,
            .memory = memory,
            .stack = Stack{
                .data = stack_data,
                .size = 0,
                .capacity = stack_capacity,
            },
            .logger = logger,
        };
    }
    
    pub fn deinit(self: *Frame) void {
        if (self.returnData) |data| {
            self.memory.allocator.free(data);
            self.returnData = null;
        }
        
        self.memory.allocator.free(self.stack.data);
        self.memory.deinit();
        
        // Free the logger
        self.memory.allocator.destroy(self.logger);
    }
    
    pub fn setReturnData(self: *Frame, data: []u8) !void {
        // Free existing return data if any
        if (self.returnData) |old_data| {
            // Only free if it's not a static empty slice
            if (@intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                self.memory.allocator.free(old_data);
            }
        }
        
        self.returnData = data;
    }
};

// Dummy logger for testing
pub const Logger = struct {
    name: []const u8,

    pub fn init(name: []const u8) Logger {
        return Logger{
            .name = name,
        };
    }

    pub fn debug(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
    }

    pub fn info(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
    }

    pub fn warn(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
    }

    pub fn err(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
    }
};

// Mock EVM Logger for testing
pub const EvmLogger = struct {
    pub const ENABLE_DEBUG_LOGS = false;

    pub fn init(name: []const u8) *Logger {
        _ = name;
        return undefined;
    }

    pub fn createLogger(name: []const u8) *Logger {
        _ = name;
        return undefined;
    }

    pub fn logStack(logger: *Logger, stack: []const u64, name: []const u8, pc: usize) void {
        _ = logger;
        _ = stack;
        _ = name;
        _ = pc;
    }

    pub fn logStackSlop(logger: *Logger, stack: []const u64, name: []const u8, pc: usize) void {
        _ = logger;
        _ = stack;
        _ = name;
        _ = pc;
    }

    pub fn logMemory(logger: *Logger, memory: []const u8, name: []const u8) void {
        _ = logger;
        _ = memory;
        _ = name;
    }

    pub fn logHexBytes(logger: *Logger, bytes: []const u8, name: []const u8) void {
        _ = logger;
        _ = bytes;
        _ = name;
    }

    pub fn createScopedLogger(logger: *Logger, name: []const u8) ScopedLogger {
        _ = logger;
        _ = name;
        return ScopedLogger{};
    }

    pub fn debugOnly(comptime Callback: type) void {
        _ = Callback;
    }

    pub const ScopedLogger = struct {
        pub fn deinit(self: ScopedLogger) void {
            _ = self;
        }
    };
};

// Simple Interpreter for testing
pub const Interpreter = struct {
    evm: *Evm,
    cfg: u32 = 0,
    readOnly: bool = false,
    returnData: []const u8 = &[_]u8{},
    returnSize: usize = 0,
    memory: Memory = undefined,
    stack: Stack = undefined,
    contract: ?*Contract = null,
    gas: u64 = 1000000,
    gas_used: u64 = 0,
    jumpTable: ?*anyopaque = null,
    running: bool = false,
    stop: bool = false,
    err: ?ExecutionError = null,
};

// JumpTable related types and constants
pub const JumpTable = struct {
    pub const GasFastStep: u64 = 5;
    pub const GasMidStep: u64 = 8;
    pub const GasSlowStep: u64 = 10;
    pub const GasQuickStep: u64 = 2;
    pub const JumpdestGas: u64 = 1;
    
    // Gas costs for LOG operations
    pub const LogGas: u64 = 375;
    pub const LogTopicGas: u64 = 375;
    pub const LogDataGas: u64 = 8;
    
    pub fn minStack(pop: u64, _: u64) u64 {
        return pop;
    }
    
    pub fn maxStack(pop: u64, push: u64) u64 {
        return pop + push;
    }
    
    pub const MemorySizeFunc = struct {
        pub const ReturnType = struct { size: u64, overflow: bool };
    };
    
    pub fn memoryGasCost(memory: *Memory, size: u64) !u64 {
        _ = memory;
        // Simplified gas calculation for testing
        return size / 32 * 3;
    }
    
    pub const Operation = struct {
        execute: fn (usize, *Interpreter, *Frame) ExecutionError![]const u8,
        constant_gas: u64 = 0,
        dynamic_gas: ?fn(*Interpreter, *Frame, *Stack, *Memory, u64) error{OutOfGas}!u64 = null,
        min_stack: u64 = 0,
        max_stack: u64 = 0,
        memory_size: ?fn(*Stack, *Memory) MemorySizeFunc.ReturnType = null,
    };
    
    pub const JumpTable = struct {
        table: [256]?*Operation = [_]?*Operation{null} ** 256,
    };
};
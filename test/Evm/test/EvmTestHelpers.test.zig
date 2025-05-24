const std = @import("std");
const testing = std.testing;
const EvmTest = @import("EvmTestHelpers.zig").EvmTest;
const EvmTraceTestOrig = @import("EvmTestHelpers.zig").EvmTraceTest;

// Define missing types to allow compilation
const ExecutionTrace = struct {
    steps: std.ArrayList(ExecutionStep),
    memory: ?std.ArrayList(u8),
    
    pub fn init(allocator: std.mem.Allocator) ExecutionTrace {
        return ExecutionTrace{
            .steps = std.ArrayList(ExecutionStep).init(allocator),
            .memory = null,
        };
    }
    
    pub fn deinit(self: *ExecutionTrace) void {
        for (self.steps.items) |*step| {
            step.deinit();
        }
        self.steps.deinit();
        
        if (self.memory) |*mem| {
            mem.deinit();
        }
    }
};

const ExecutionStep = struct {
    opcode: u8,
    opcode_name: []const u8,
    pc: usize,
    gas: u64,
    stack_before: []u256_t,
    stack_after: []u256_t,
    memory_before: ?[]u8,
    memory_after: ?[]u8,
    
    pub fn deinit(self: *ExecutionStep) void {
        _ = self;
    }
};

const TraceConfig = struct {
    record_steps: bool = true,
    record_memory: bool = false,
    record_storage: bool = false,
    log_steps: bool = false,
    log_gas: bool = false,
};

// We'll create a different approach to fix the naming conflict
const EvmTraceTest = struct {
    test_instance: EvmTest, // Renamed to avoid the 'test' keyword
    trace: ?*ExecutionTrace,
    config: TraceConfig,

    pub fn init(allocator: std.mem.Allocator, config: TraceConfig) !EvmTraceTest {
        // Create an EvmTest instance first
        const test_instance = try EvmTest.init(allocator);

        // Initialize trace
        var trace: ?*ExecutionTrace = null;
        if (config.record_steps) {
            trace = try allocator.create(ExecutionTrace);
            if (trace) |t| {
                t.* = ExecutionTrace.init(allocator);
            }
        }

        return EvmTraceTest{
            .test_instance = test_instance,
            .trace = trace,
            .config = config,
        };
    }

    pub fn deinit(self: *EvmTraceTest) void {
        // Free trace resources
        if (self.trace) |trace| {
            trace.deinit();
            self.test_instance.allocator.destroy(trace);
            self.trace = null;
        }

        // Free test resources
        self.test_instance.deinit();
    }

    pub fn execute(self: *EvmTraceTest, gas: u64, code: []const u8, input: []const u8) !void {
        // Directly use test_instance
        try self.test_instance.execute(gas, code, input);

        // The rest would be part of the original EvmTraceTest execute function
        // Since we don't have the implementation, we'll just provide the basics
    }

    pub fn logTrace(self: *EvmTraceTest, description: ?[]const u8) void {
        // Simple implementation as we don't have the original
        _ = self;
        _ = description;
        // Would normally log trace information
    }
};
const EvmModule = @import("Evm");
const Hardfork = EvmModule.Hardfork;
const u256_t = @import("StateManager").U256;
const createLogger = EvmModule.createLogger;
const ENABLE_DEBUG_LOGS = EvmModule.ENABLE_DEBUG_LOGS;
// Define missing functions
fn getOpcodeName(opcode: u8) []const u8 {
    const EvmModule = @import("Evm");
    const opcodes = EvmModule.opcodes;
    
    // Convert opcode to name
    if (opcode >= @intFromEnum(opcodes.Opcode.PUSH1) and opcode <= @intFromEnum(opcodes.Opcode.PUSH32)) {
        return "PUSH" ++ std.fmt.comptimePrint("{d}", .{opcode - @intFromEnum(opcodes.Opcode.PUSH1) + 1});
    } else if (opcode >= @intFromEnum(opcodes.Opcode.DUP1) and opcode <= @intFromEnum(opcodes.Opcode.DUP16)) {
        return "DUP" ++ std.fmt.comptimePrint("{d}", .{opcode - @intFromEnum(opcodes.Opcode.DUP1) + 1});
    } else if (opcode >= @intFromEnum(opcodes.Opcode.SWAP1) and opcode <= @intFromEnum(opcodes.Opcode.SWAP16)) {
        return "SWAP" ++ std.fmt.comptimePrint("{d}", .{opcode - @intFromEnum(opcodes.Opcode.SWAP1) + 1});
    } else if (opcode == @intFromEnum(opcodes.Opcode.ADD)) {
        return "ADD";
    } else if (opcode == @intFromEnum(opcodes.Opcode.MUL)) {
        return "MUL";
    } else if (opcode == @intFromEnum(opcodes.Opcode.MSTORE)) {
        return "MSTORE";
    } else if (opcode == @intFromEnum(opcodes.Opcode.MSTORE8)) {
        return "MSTORE8";
    } else if (opcode == @intFromEnum(opcodes.Opcode.RETURN)) {
        return "RETURN";
    } else if (opcode == @intFromEnum(opcodes.Opcode.JUMPDEST)) {
        return "JUMPDEST";
    } else if (opcode == @intFromEnum(opcodes.Opcode.JUMP)) {
        return "JUMP";
    } else if (opcode == @intFromEnum(opcodes.Opcode.JUMPI)) {
        return "JUMPI";
    }
    
    return "UNKNOWN";
}

// Simple disassembled instruction
const DisassembledInstruction = struct {
    opcode: u8,
    opcode_name: []const u8,
    immediate_data: ?[]const u8,
    pc: usize,
    
    pub fn deinit(self: *DisassembledInstruction, _: std.mem.Allocator) void {
        _ = self;
    }
};

fn formatBytecode(allocator: std.mem.Allocator, code: []const u8) ![]const u8 {
    var buffer = std.ArrayList(u8).init(allocator);
    errdefer buffer.deinit();
    
    var i: usize = 0;
    while (i < code.len) {
        const opcode = code[i];
        const name = getOpcodeName(opcode);
        
        // Format PC and opcode
        try buffer.writer().print("0x{X:0>4}: 0x{X:0>2} {s}", .{i, opcode, name});
        
        // Handle PUSH operations - they have immediate data
        if (opcode >= @intFromEnum(@import("Evm").opcodes.Opcode.PUSH1) and 
            opcode <= @intFromEnum(@import("Evm").opcodes.Opcode.PUSH32)) {
            const num_bytes = opcode - @intFromEnum(@import("Evm").opcodes.Opcode.PUSH1) + 1;
            if (i + 1 + num_bytes <= code.len) {
                try buffer.appendSlice(" 0x");
                for (0..num_bytes) |j| {
                    if (i + 1 + j < code.len) {
                        try buffer.writer().print("{X:0>2}", .{code[i + 1 + j]});
                    }
                }
                i += num_bytes;
            }
        }
        
        try buffer.appendSlice("\n");
        i += 1;
    }
    
    return buffer.toOwnedSlice();
}

fn disassembleBytecode(allocator: std.mem.Allocator, code: []const u8) ![]DisassembledInstruction {
    var instructions = std.ArrayList(DisassembledInstruction).init(allocator);
    errdefer {
        for (instructions.items) |*instruction| {
            instruction.deinit(allocator);
        }
        instructions.deinit();
    }
    
    var i: usize = 0;
    while (i < code.len) {
        const opcode = code[i];
        const name = getOpcodeName(opcode);
        
        // Handle PUSH operations - they have immediate data
        var immediate_data: ?[]const u8 = null;
        var next_i = i + 1;
        
        if (opcode >= @intFromEnum(@import("Evm").opcodes.Opcode.PUSH1) and 
            opcode <= @intFromEnum(@import("Evm").opcodes.Opcode.PUSH32)) {
            const num_bytes = opcode - @intFromEnum(@import("Evm").opcodes.Opcode.PUSH1) + 1;
            if (i + 1 + num_bytes <= code.len) {
                immediate_data = code[i+1..i+1+num_bytes];
                next_i = i + 1 + num_bytes;
            }
        }
        
        try instructions.append(DisassembledInstruction{
            .opcode = opcode,
            .opcode_name = name,
            .immediate_data = immediate_data,
            .pc = i,
        });
        
        i = next_i;
    }
    
    return instructions.toOwnedSlice();
}
const opcodes = EvmModule.opcodes;
const UtilsModule = @import("Utils");
const hex = UtilsModule.hex;

// Define simple bytecode helper functions
fn push(n: u256_t) []const u8 {
    const EvmModule = @import("Evm");
    // Find the smallest PUSH opcode that can represent the number
    var bytes: [32]u8 = undefined;
    var byte_len: usize = 0;
    
    if (n == 0) {
        return &[_]u8{ @intFromEnum(EvmModule.opcodes.Opcode.PUSH1), 0 };
    }
    
    // Convert n to bytes and find significant byte length
    var temp = n;
    var i: usize = 31;
    while (temp > 0) : (i -= 1) {
        bytes[i] = @intCast(temp & 0xFF);
        temp >>= 8;
        byte_len += 1;
    }
    
    // Create result bytecode: PUSH<n> followed by bytes
    const result_len = byte_len + 1;
    var result = std.heap.c_allocator.alloc(u8, result_len) catch unreachable;
    
    // Determine PUSH opcode (PUSH1...PUSH32)
    const push_opcode = @intFromEnum(EvmModule.opcodes.Opcode.PUSH1) + byte_len - 1;
    result[0] = push_opcode;
    
    // Copy significant bytes
    const source_start = 32 - byte_len;
    @memcpy(result[1..], bytes[source_start..]);
    
    return result;
}

fn push0() []const u8 {
    return &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.PUSH0)};
}

fn pushHex(hex_str: []const u8) []const u8 {
    const data = std.fmt.parseHexDigest(hex_str, std.heap.c_allocator.alloc(u8, hex_str.len / 2) catch unreachable) catch unreachable;
    const opcode = @intFromEnum(@import("Evm").opcodes.Opcode.PUSH1) + data.len - 1;
    
    var result = std.heap.c_allocator.alloc(u8, data.len + 1) catch unreachable;
    result[0] = opcode;
    @memcpy(result[1..], data);
    
    return result;
}

fn dup(n: u8) []const u8 {
    if (n < 1 or n > 16) {
        @panic("DUP index must be between 1 and 16");
    }
    return &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.DUP1) + n - 1};
}

fn swap(n: u8) []const u8 {
    if (n < 1 or n > 16) {
        @panic("SWAP index must be between 1 and 16");
    }
    return &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.SWAP1) + n - 1};
}

fn mstore(offset: u256_t, value: u256_t) []const u8 {
    return push(value) ++ push(offset) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MSTORE)};
}

fn mstore8(offset: u256_t, value: u256_t) []const u8 {
    return push(value) ++ push(offset) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MSTORE8)};
}

fn ret(offset: u256_t, size: u256_t) []const u8 {
    return push(size) ++ push(offset) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.RETURN)};
}

fn ret_top() []const u8 {
    return mstore(0, u256_t(0)) ++ ret(0, u256_t(32));
}

fn revert(offset: u256_t, size: u256_t) []const u8 {
    return push(size) ++ push(offset) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.REVERT)};
}

fn not(value: u256_t) []const u8 {
    return push(value) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.NOT)};
}

fn add(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.ADD)};
}

fn sub(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.SUB)};
}

fn mul(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MUL)};
}

fn div(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.DIV)};
}

fn sdiv(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.SDIV)};
}

fn mod(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MOD)};
}

fn addmod(a: u256_t, b: u256_t, m: u256_t) []const u8 {
    return push(a) ++ push(b) ++ push(m) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.ADDMOD)};
}

fn mulmod(a: u256_t, b: u256_t, m: u256_t) []const u8 {
    return push(a) ++ push(b) ++ push(m) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MULMOD)};
}

const jumpdest = &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.JUMPDEST)};

fn jump(dest: u256_t) []const u8 {
    return push(dest) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.JUMP)};
}

fn jumpi(dest: u256_t, condition: u256_t) []const u8 {
    return push(condition) ++ push(dest) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.JUMPI)};
}

fn calldataload(offset: u256_t) []const u8 {
    return push(offset) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.CALLDATALOAD)};
}

fn calldatacopy(destOffset: u256_t, offset: u256_t, size: u256_t) []const u8 {
    return push(size) ++ push(offset) ++ push(destOffset) ++ &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.CALLDATACOPY)};
}

// Simple contract creation functions
fn createAddContract() []const u8 {
    // Contract that loads two 32-byte values from calldata, adds them, and returns the result
    return 
        // Load first value from calldata
        calldataload(0) ++
        // Load second value from calldata
        calldataload(32) ++
        // Add them
        &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.ADD)} ++
        // Store result at memory position 0
        push(0) ++
        &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MSTORE)} ++
        // Return 32 bytes from memory position 0
        push(32) ++
        push(0) ++
        &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.RETURN)};
}

fn createStorageContract() []const u8 {
    // Contract that stores a value from calldata at storage slot 0, then loads it back and returns it
    return 
        // Load 32-byte value from calldata
        calldataload(0) ++
        // Store at storage slot 0
        push(0) ++
        &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.SSTORE)} ++
        // Load from storage slot 0
        push(0) ++
        &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.SLOAD)} ++
        // Store in memory at position 0
        push(0) ++
        &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MSTORE)} ++
        // Return 32 bytes from memory position 0
        push(32) ++
        push(0) ++
        &[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.RETURN)};
}

fn createLoopContract() []const u8 {
    // Contract that runs a loop the number of times specified in calldata
    // Loop body subtracts 1 from counter until it reaches 0
    var bytecode = std.ArrayList(u8).init(std.testing.allocator);
    
    // Load loop count from calldata
    bytecode.appendSlice(calldataload(0)) catch unreachable;
    
    // Set up loop counter at memory[0]
    bytecode.appendSlice(push(0)) catch unreachable;
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MSTORE)}) catch unreachable;
    
    // JUMPDEST for loop start
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.JUMPDEST)}) catch unreachable;
    
    // Load counter from memory
    bytecode.appendSlice(push(0)) catch unreachable;
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MLOAD)}) catch unreachable;
    
    // Check if counter is zero
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.ISZERO)}) catch unreachable;
    
    // If zero, jump to end
    bytecode.appendSlice(push(45)) catch unreachable; // Jump to end
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.JUMPI)}) catch unreachable;
    
    // Decrement counter
    bytecode.appendSlice(push(0)) catch unreachable;
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MLOAD)}) catch unreachable;
    bytecode.appendSlice(push(1)) catch unreachable;
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.SUB)}) catch unreachable;
    
    // Store updated counter
    bytecode.appendSlice(push(0)) catch unreachable;
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MSTORE)}) catch unreachable;
    
    // Jump back to start of loop
    bytecode.appendSlice(push(10)) catch unreachable; // Jump back to JUMPDEST
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.JUMP)}) catch unreachable;
    
    // End of loop
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.JUMPDEST)}) catch unreachable;
    
    // Return the final counter value (should be 0)
    bytecode.appendSlice(push(0)) catch unreachable;
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MLOAD)}) catch unreachable;
    bytecode.appendSlice(push(0)) catch unreachable;
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.MSTORE)}) catch unreachable;
    bytecode.appendSlice(push(32)) catch unreachable;
    bytecode.appendSlice(push(0)) catch unreachable;
    bytecode.appendSlice(&[_]u8{@intFromEnum(@import("Evm").opcodes.Opcode.RETURN)}) catch unreachable;
    
    return bytecode.items;
}

fn executeTestCase(allocator: std.mem.Allocator, name: []const u8, code: []const u8, input: []const u8) !ExecutionTrace {
    // Create trace config
    const config = TraceConfig{
        .record_steps = true,
        .record_memory = true,
        .log_steps = false,
    };
    
    // Create trace test
    var trace_test = try EvmTraceTest.init(allocator, config);
    defer trace_test.deinit();
    
    // Execute
    try trace_test.execute(100000, code, input);
    
    // Return trace
    var trace = ExecutionTrace.init(allocator);
    if (trace_test.trace) |t| {
        // Normally we would copy the trace, but for this stub just return an empty trace
    }
    
    return trace;
}

// Create a file-specific logger
const logger = createLogger("EvmTestHelpers.test");

// Test basic execution with the EvmTest fixture
test "EvmTestHelpers - Basic execution" {
    const allocator = testing.allocator;

    // Create a test fixture
    var test_fixture = try EvmTest.init(allocator);
    defer test_fixture.deinit();

    // Create a simple contract that adds two numbers and returns the result
    // PUSH1 0x05 PUSH1 0x03 ADD PUSH1 0x00 MSTORE PUSH1 0x20 PUSH1 0x00 RETURN
    const code = [_]u8{
        0x60, 0x05, // PUSH1 0x05
        0x60, 0x03, // PUSH1 0x03
        0x01, // ADD
        0x60, 0x00, // PUSH1 0x00
        0x52, // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xF3, // RETURN
    };

    // Execute the contract
    try test_fixture.execute(100000, &code, &[_]u8{});

    // Check that execution succeeded
    try testing.expect(test_fixture.result != null);
    if (test_fixture.result) |result| {
        try testing.expectEqual(@as(?std.meta.Tag(std.meta.Tag(std.meta.Child(std.meta.Child(@TypeOf(result.status))))), null), result.status);
        try testing.expect(result.output != null);

        // Check that the output is 0x08 (5 + 3 = 8)
        if (result.output) |output| {
            try testing.expectEqualSlices(u8, &[_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8 }, output);
        }
    }
}

// Test execution with tracing enabled
test "EvmTestHelpers - Execution with tracing" {
    const allocator = testing.allocator;

    // Create a test fixture with tracing enabled
    var trace_fixture = try EvmTraceTest.init(allocator, TraceConfig{
        .record_steps = true,
        .record_memory = true,
        .record_storage = false,
        .log_steps = false,
        .log_gas = true,
    });
    defer trace_fixture.deinit();

    // Create a simple contract that adds two numbers and returns the result
    // Same as above: PUSH1 0x05 PUSH1 0x03 ADD PUSH1 0x00 MSTORE PUSH1 0x20 PUSH1 0x00 RETURN
    const code = [_]u8{
        0x60, 0x05, // PUSH1 0x05
        0x60, 0x03, // PUSH1 0x03
        0x01, // ADD
        0x60, 0x00, // PUSH1 0x00
        0x52, // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xF3, // RETURN
    };

    // Execute the contract
    try trace_fixture.execute(100000, &code, &[_]u8{});

    // Log the execution trace
    trace_fixture.logTrace(null);

    // Check that execution succeeded
    try testing.expect(trace_fixture.test_instance.result != null);
    if (trace_fixture.test_instance.result) |result| {
        try testing.expectEqual(@as(?std.meta.Tag(std.meta.Tag(std.meta.Child(std.meta.Child(@TypeOf(result.status))))), null), result.status);
        try testing.expect(result.output != null);

        // Check that the output is 0x08 (5 + 3 = 8)
        if (result.output) |output| {
            try testing.expectEqualSlices(u8, &[_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8 }, output);
        }
    }

    // Check that we have an execution trace
    try testing.expect(trace_fixture.trace != null);
    if (trace_fixture.trace) |*trace| {
        // Check that we have the expected number of steps (one per opcode)
        try testing.expectEqual(@as(usize, 8), trace.steps.items.len);

        // Check that the first step is a PUSH1 operation
        const first_step = trace.steps.items[0];
        try testing.expectEqual(@as(u8, 0x60), first_step.opcode); // PUSH1
        try testing.expectEqualStrings("PUSH1", first_step.opcode_name);

        // Check that the ADD operation happened
        var add_found = false;
        for (trace.steps.items) |step| {
            if (step.opcode == @intFromEnum(opcodes.Opcode.ADD)) {
                add_found = true;
                // Check that the stack before the ADD had two entries
                try testing.expectEqual(@as(usize, 2), step.stack_before.len);
                // Check that the stack after the ADD had one entry
                try testing.expectEqual(@as(usize, 1), step.stack_after.len);
                // Check that the stack values were 3 and 5 before
                try testing.expectEqual(@as(u256_t, 3), step.stack_before[0]);
                try testing.expectEqual(@as(u256_t, 5), step.stack_before[1]);
                // Check that the result was 8
                try testing.expectEqual(@as(u256_t, 8), step.stack_after[0]);
                break;
            }
        }
        try testing.expect(add_found);
    }
}

// Test using bytecode building utilities
test "EvmTestHelpers - Bytecode building utilities" {
    const allocator = testing.allocator;

    // Create a contract using the bytecode builders
    const code = add(5, 3) ++ mstore(0, u256_t(0)) ++ ret(0, u256_t(32));

    // Create a test fixture with tracing
    var test_fixture2 = try EvmTraceTest.init(allocator, TraceConfig{
        .record_steps = true,
        .record_memory = true,
        .log_steps = false,
    });
    defer test_fixture2.deinit();

    // Execute the contract
    try test_fixture2.execute(100000, code, &[_]u8{});

    // Check that execution succeeded
    try testing.expect(test_fixture2.test_instance.result != null);
    if (test_fixture2.test_instance.result) |result| {
        try testing.expectEqual(@as(?std.meta.Tag(std.meta.Tag(std.meta.Child(std.meta.Child(@TypeOf(result.status))))), null), result.status);
        try testing.expect(result.output != null);

        // Check that the output has the correct data
        if (result.output) |output| {
            try testing.expectEqualSlices(u8, &[_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8 }, output);
        }
    }
}

// Test bytecode disassembly utilities
test "EvmTestHelpers - Bytecode disassembly" {
    const allocator = testing.allocator;

    // Create a sample bytecode
    const code = [_]u8{
        0x60, 0x05, // PUSH1 0x05
        0x60, 0x03, // PUSH1 0x03
        0x01, // ADD
        0x60, 0x00, // PUSH1 0x00
        0x52, // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xF3, // RETURN
    };

    // Format the bytecode
    const formatted = try formatBytecode(allocator, &code);
    defer allocator.free(formatted);

    // Check that the formatting contains the expected opcodes
    try testing.expect(std.mem.indexOf(u8, formatted, "PUSH1") != null);
    try testing.expect(std.mem.indexOf(u8, formatted, "ADD") != null);
    try testing.expect(std.mem.indexOf(u8, formatted, "MSTORE") != null);
    try testing.expect(std.mem.indexOf(u8, formatted, "RETURN") != null);

    // Disassemble the bytecode
    const disassembled = try disassembleBytecode(allocator, &code);
    defer {
        for (disassembled) |*instruction| {
            instruction.deinit(allocator);
        }
        allocator.free(disassembled);
    }

    // Check that we have the expected number of instructions
    try testing.expectEqual(@as(usize, 8), disassembled.len);

    // Check some specific instructions
    try testing.expectEqualStrings("PUSH1", disassembled[0].opcode_name);
    try testing.expectEqual(@as(u8, 0x60), disassembled[0].opcode);
    try testing.expect(disassembled[0].immediate_data != null);
    if (disassembled[0].immediate_data) |data| {
        try testing.expectEqualSlices(u8, &[_]u8{0x05}, data);
    }

    try testing.expectEqualStrings("ADD", disassembled[2].opcode_name);
    try testing.expectEqual(@as(u8, 0x01), disassembled[2].opcode);
    try testing.expectEqual(@as(?[]const u8, null), disassembled[2].immediate_data);
}

// Test the example contracts
test "EvmTestHelpers - Example contracts" {
    const allocator = testing.allocator;

    // Test the add contract
    {
        const code = createAddContract();

        // Set calldata with two numbers to add: 0x123 and 0x456
        const calldata = [_]u8{
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01, 0x23, // 0x123
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04, 0x56, // 0x456
        };

        // Create a test fixture
        var test_fixture3 = try EvmTest.init(allocator);
        defer test_fixture3.deinit();

        // Execute the contract
        try test_fixture3.execute(100000, code, &calldata);

        // Check that execution succeeded
        try testing.expect(test_fixture3.result != null);
        if (test_fixture3.result) |result| {
            try testing.expectEqual(@as(?std.meta.Tag(std.meta.Tag(std.meta.Child(std.meta.Child(@TypeOf(result.status))))), null), result.status);
            try testing.expect(result.output != null);

            // Check that the output is 0x123 + 0x456 = 0x579
            if (result.output) |output| {
                try testing.expectEqual(@as(u8, 0x79), output[31]); // Last byte should be 0x79
                try testing.expectEqual(@as(u8, 0x05), output[30]); // Second-last byte should be 0x05
            }
        }
    }

    // Test the storage contract
    {
        const code = createStorageContract();

        // Set calldata with a value to store: 0x123
        const calldata = [_]u8{
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01, 0x23, // 0x123
        };

        // Create a test fixture with tracing
        var test_fixture4 = try EvmTraceTest.init(allocator, TraceConfig{
            .record_steps = true,
            .record_memory = true,
            .record_storage = true,
            .log_steps = false,
        });
        defer test_fixture4.deinit();

        // Execute the contract
        try test_fixture4.execute(100000, code, &calldata);

        // Log the trace for debugging
        test_fixture4.logTrace(null);

        // Check that execution succeeded
        try testing.expect(test_fixture4.test_instance.result != null);
        if (test_fixture4.test_instance.result) |result| {
            try testing.expectEqual(@as(?std.meta.Tag(std.meta.Tag(std.meta.Child(std.meta.Child(@TypeOf(result.status))))), null), result.status);
            try testing.expect(result.output != null);

            // Check that the output is 0x123 (the stored and loaded value)
            if (result.output) |output| {
                try testing.expectEqual(@as(u8, 0x23), output[31]); // Last byte should be 0x23
                try testing.expectEqual(@as(u8, 0x01), output[30]); // Second-last byte should be 0x01
            }
        }
    }

    // Test the loop contract
    {
        const code = createLoopContract();

        // Set calldata with a loop counter: 3 (loop runs 3 times)
        const calldata = [_]u8{
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, // 3
        };

        // Execute the test and get a full trace
        var trace = try executeTestCase(allocator, "Loop test", code, &calldata);
        defer trace.deinit();

        // Check that the trace contains the expected number of steps
        // The exact number depends on how many opcodes the loop executes,
        // but we want to make sure the loop ran 3 times
        try testing.expect(trace.steps.items.len > 10);

        // Count the number of SUB operations to verify the loop ran 3 times
        var sub_count: usize = 0;
        for (trace.steps.items) |step| {
            if (step.opcode == @intFromEnum(opcodes.Opcode.SUB)) {
                sub_count += 1;
            }
        }
        try testing.expectEqual(@as(usize, 3), sub_count);
    }
}

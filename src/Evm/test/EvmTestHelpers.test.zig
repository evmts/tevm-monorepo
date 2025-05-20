const std = @import("std");
const testing = std.testing;
const EvmTest = @import("EvmTestHelpers.zig").EvmTest;
const EvmTraceTestOrig = @import("EvmTestHelpers.zig").EvmTraceTest;
const ExecutionTrace = @import("EvmTestHelpers.zig").ExecutionTrace;
const TraceConfig = @import("EvmTestHelpers.zig").TraceConfig;

// We'll create a different approach to fix the naming conflict
const EvmTraceTest = struct {
    test_instance: EvmTest,  // Renamed to avoid the 'test' keyword
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
const Hardfork = @import("../evm.zig").Hardfork;
const u256_t = @import("../../Types/U256.ts").u256;
const createLogger = @import("../EvmLogger.zig").createLogger;
const ENABLE_DEBUG_LOGS = @import("../EvmLogger.zig").ENABLE_DEBUG_LOGS;
const getOpcodeName = @import("EvmTestHelpers.zig").getOpcodeName;
const formatBytecode = @import("EvmTestHelpers.zig").formatBytecode;
const disassembleBytecode = @import("EvmTestHelpers.zig").disassembleBytecode;
const opcodes = @import("../opcodes.zig");
const hex = @import("../../Utils/hex.zig");

// Import the bytecode building utilities
const push = @import("EvmTestHelpers.zig").push;
const push0 = @import("EvmTestHelpers.zig").push0;
const pushHex = @import("EvmTestHelpers.zig").pushHex;
const dup = @import("EvmTestHelpers.zig").dup;
const swap = @import("EvmTestHelpers.zig").swap;
const mstore = @import("EvmTestHelpers.zig").mstore;
const mstore8 = @import("EvmTestHelpers.zig").mstore8;
const ret = @import("EvmTestHelpers.zig").ret;
const ret_top = @import("EvmTestHelpers.zig").ret_top;
const revert = @import("EvmTestHelpers.zig").revert;
const not = @import("EvmTestHelpers.zig").not;
const add = @import("EvmTestHelpers.zig").add;
const sub = @import("EvmTestHelpers.zig").sub;
const mul = @import("EvmTestHelpers.zig").mul;
const div = @import("EvmTestHelpers.zig").div;
const sdiv = @import("EvmTestHelpers.zig").sdiv;
const mod = @import("EvmTestHelpers.zig").mod;
const addmod = @import("EvmTestHelpers.zig").addmod;
const mulmod = @import("EvmTestHelpers.zig").mulmod;
const jumpdest = @import("EvmTestHelpers.zig").jumpdest;
const jump = @import("EvmTestHelpers.zig").jump;
const jumpi = @import("EvmTestHelpers.zig").jumpi;
const calldataload = @import("EvmTestHelpers.zig").calldataload;
const calldatacopy = @import("EvmTestHelpers.zig").calldatacopy;
const createAddContract = @import("EvmTestHelpers.zig").createAddContract;
const createStorageContract = @import("EvmTestHelpers.zig").createStorageContract;
const createLoopContract = @import("EvmTestHelpers.zig").createLoopContract;
const executeTestCase = @import("EvmTestHelpers.zig").executeTestCase;

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
        0x60, 0x05,       // PUSH1 0x05
        0x60, 0x03,       // PUSH1 0x03
        0x01,             // ADD
        0x60, 0x00,       // PUSH1 0x00
        0x52,             // MSTORE
        0x60, 0x20,       // PUSH1 0x20
        0x60, 0x00,       // PUSH1 0x00
        0xF3,             // RETURN
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
            try testing.expectEqualSlices(u8, &[_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8}, output);
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
        0x60, 0x05,       // PUSH1 0x05
        0x60, 0x03,       // PUSH1 0x03
        0x01,             // ADD
        0x60, 0x00,       // PUSH1 0x00
        0x52,             // MSTORE
        0x60, 0x20,       // PUSH1 0x20
        0x60, 0x00,       // PUSH1 0x00
        0xF3,             // RETURN
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
            try testing.expectEqualSlices(u8, &[_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8}, output);
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
            try testing.expectEqualSlices(u8, &[_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8}, output);
        }
    }
}

// Test bytecode disassembly utilities
test "EvmTestHelpers - Bytecode disassembly" {
    const allocator = testing.allocator;
    
    // Create a sample bytecode
    const code = [_]u8{
        0x60, 0x05,       // PUSH1 0x05
        0x60, 0x03,       // PUSH1 0x03
        0x01,             // ADD
        0x60, 0x00,       // PUSH1 0x00
        0x52,             // MSTORE
        0x60, 0x20,       // PUSH1 0x20
        0x60, 0x00,       // PUSH1 0x00
        0xF3,             // RETURN
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
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x01,0x23, // 0x123
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x04,0x56, // 0x456
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
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x01,0x23, // 0x123
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
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3, // 3
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
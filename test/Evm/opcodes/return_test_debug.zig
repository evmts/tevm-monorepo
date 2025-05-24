const std = @import("std");
const test_utils = @import("fixed_test_utils.zig");
const debug_func = @import("fixed_controlflow_debug.zig");

// Import everything via test_utils
const Frame = test_utils.Frame;
const ExecutionError = test_utils.ExecutionError;
const Interpreter = test_utils.Interpreter;
const Evm = test_utils.Evm;
const Contract = test_utils.Contract;
const Memory = test_utils.Memory;
const Stack = test_utils.Stack;

// Test the RETURN opcode with debug
test "RETURN opcode debug" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xF3 }; // RETURN
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Print starting memory size
    std.debug.print("Initial memory size: {d}\n", .{frame.memory.data.len});
    
    // Set up memory with some data
    for (0..4) |i| {
        try frame.memory.store8(i, @truncate(0xaa + i));
        std.debug.print("Stored 0x{X:0>2} at memory position {d}\n", .{0xaa + i, i});
    }
    
    // Print memory contents
    for (0..4) |i| {
        std.debug.print("Memory[{d}] = 0x{X:0>2}\n", .{i, frame.memory.get8(i)});
    }
    
    // Set up the stack with offset and size
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(4); // size: 4 bytes
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the RETURN opcode with debugging and expect STOP error
    const result = debug_func.opReturnDebug(0, interpreter, &frame);
    std.debug.print("Result: {any}\n", .{result});
    
    std.debug.print("Checking return data\n", .{});
    
    // Check that return data was set correctly
    try std.testing.expect(frame.returnData != null);
    if (frame.returnData) |data| {
        std.debug.print("Return data length: {d}\n", .{data.len});
        for (0..data.len) |i| {
            std.debug.print("data[{d}] = 0x{X:0>2}\n", .{i, data[i]});
        }
        try std.testing.expectEqualSlices(u8, &[_]u8{ 0xaa, 0xab, 0xac, 0xad }, data);
    } else {
        std.debug.print("Return data is null\n", .{});
    }
}
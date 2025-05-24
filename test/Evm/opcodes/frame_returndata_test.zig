const std = @import("std");
const test_utils = @import("fixed_test_utils.zig");

// Import everything via test_utils
const Frame = test_utils.Frame;
const Memory = test_utils.Memory;
const Contract = test_utils.Contract;

test "Frame returnData setting and testing" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0x00 }; // STOP
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up memory with some data
    for (0..4) |i| {
        try frame.memory.store8(i, @truncate(0xaa + i));
    }
    
    // Manually create a return buffer and set it
    var return_buffer = allocator.alloc(u8, 4) catch unreachable;
    for (0..4) |i| {
        return_buffer[i] = frame.memory.get8(i);
    }
    frame.returnData = return_buffer;
    
    // Check if the return data is correctly set
    try std.testing.expect(frame.returnData != null);
    if (frame.returnData) |data| {
        try std.testing.expectEqualSlices(u8, &[_]u8{ 0xaa, 0xab, 0xac, 0xad }, data);
    }
}
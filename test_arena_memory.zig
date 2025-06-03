const std = @import("std");
const testing = std.testing;

// Import the modules
const ArenaMemory = @import("src/evm/arena_memory.zig").ArenaMemory;

test "ArenaMemory: basic test" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    try testing.expect(mem.context_is_empty());
    try testing.expectEqual(@as(usize, 0), mem.context_size());
    
    // Test setByte and getByte
    try mem.set_byte(10, 0xAB);
    try testing.expectEqual(@as(usize, 11), mem.context_size());
    try testing.expectEqual(@as(u8, 0xAB), try mem.get_byte(10));
}

pub fn main() !void {
    std.debug.print("Running ArenaMemory test...\n", .{});
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    
    var mem = try ArenaMemory.init(gpa.allocator(), ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    try mem.set_data(0, "Hello Arena!");
    const data = try mem.get_slice(0, 12);
    std.debug.print("Data: {s}\n", .{data});
    
    std.debug.print("Test passed!\n", .{});
}
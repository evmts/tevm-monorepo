const std = @import("std");
const testing = std.testing;
const helpers = @import("test/evm/opcodes/test_helpers.zig");

// Import opcodes through evm module
const evm = @import("src/evm/evm.zig");

pub fn main() !void {
    const allocator = std.heap.page_allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Helper function to print stack
    const print = std.debug.print;
    
    // Initialize with 0, 1
    try test_frame.pushStack(&[_]u256{0, 1}); // Push 0, then 1
    print("Initial stack (bottom to top): ", .{});
    for (0..test_frame.stackSize()) |i| {
        const val = test_frame.frame.stack.data[i];
        print("{} ", .{val});
    }
    print("\n", .{});
    
    // DUP2 (0x81)
    print("\nExecuting DUP2 (0x81)...\n", .{});
    _ = try helpers.executeOpcode(0x81, &test_vm.vm, test_frame.frame);
    print("Stack after DUP2: ", .{});
    for (0..test_frame.stackSize()) |i| {
        const val = test_frame.frame.stack.data[i];
        print("{} ", .{val});
    }
    print("\n", .{});
    
    // DUP2 (0x81) again
    print("\nExecuting DUP2 (0x81) again...\n", .{});
    _ = try helpers.executeOpcode(0x81, &test_vm.vm, test_frame.frame);
    print("Stack after second DUP2: ", .{});
    for (0..test_frame.stackSize()) |i| {
        const val = test_frame.frame.stack.data[i];
        print("{} ", .{val});
    }
    print("\n", .{});
    
    // ADD (0x01)
    print("\nExecuting ADD (0x01)...\n", .{});
    _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    print("Stack after ADD: ", .{});
    for (0..test_frame.stackSize()) |i| {
        const val = test_frame.frame.stack.data[i];
        print("{} ", .{val});
    }
    print("\n", .{});
    
    print("\nExpected fib(2) = 1, but stack top is {}\n", .{test_frame.frame.stack.data[test_frame.stackSize() - 1]});
}
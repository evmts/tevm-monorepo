const std = @import("std");
const testing = std.testing;

// Import test helpers
const helpers = @import("test/evm/opcodes/test_helpers.zig");

test "Simple RETURN test" {
    const allocator = testing.allocator;
    
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push values to stack: offset=10, size=4
    try test_frame.pushStack(&[_]u256{10, 4});
    
    std.debug.print("\nBefore executeOpcode:\n", .{});
    std.debug.print("  Stack size: {}\n", .{test_frame.stackSize()});
    std.debug.print("  Stack[0]: {}\n", .{test_frame.frame.stack.data[0]});
    std.debug.print("  Stack[1]: {}\n", .{test_frame.frame.stack.data[1]});
    
    // Check jump table
    const operation = test_vm.vm.table.get_operation(0xF3);
    std.debug.print("  RETURN operation defined: {}\n", .{!operation.undefined});
    std.debug.print("  RETURN min_stack: {}\n", .{operation.min_stack});
    std.debug.print("  RETURN max_stack: {}\n", .{operation.max_stack});
    
    const result = helpers.executeOpcode(0xF3, &test_vm.vm, test_frame.frame);
    
    if (result) |_| {
        std.debug.print("\nRETURN succeeded unexpectedly\n", .{});
    } else |err| {
        std.debug.print("\nRETURN error: {}\n", .{err});
    }
}
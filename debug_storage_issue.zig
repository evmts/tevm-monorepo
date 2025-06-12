const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const test_helpers = @import("test/evm/opcodes/test_helpers.zig");

test "Debug storage issue" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Debug: Print addresses to ensure they match
    std.debug.print("test_helpers.TestAddresses.CONTRACT = {any}\n", .{test_helpers.TestAddresses.CONTRACT});
    std.debug.print("contract.address = {any}\n", .{contract.address});
    std.debug.print("test_frame.frame.contract.address = {any}\n", .{test_frame.frame.contract.address});
    
    // Verify they're the same
    try testing.expect(std.mem.eql(u8, &test_helpers.TestAddresses.CONTRACT, &contract.address));
    try testing.expect(std.mem.eql(u8, &contract.address, &test_frame.frame.contract.address));
    
    // Set storage value via state
    try test_vm.vm.state.set_storage(test_helpers.TestAddresses.CONTRACT, 0x123, 0x456789);
    
    // Read it back via state to confirm it was stored
    const stored_value = test_vm.vm.state.get_storage(test_helpers.TestAddresses.CONTRACT, 0x123);
    std.debug.print("Direct state get_storage returned: {}\n", .{stored_value});
    try testing.expectEqual(@as(u256, 0x456789), stored_value);
    
    // Now try reading via the contract's address
    const contract_stored_value = test_vm.vm.state.get_storage(test_frame.frame.contract.address, 0x123);
    std.debug.print("Contract address get_storage returned: {}\n", .{contract_stored_value});
    try testing.expectEqual(@as(u256, 0x456789), contract_stored_value);
    
    // Push storage slot and execute SLOAD
    try test_frame.pushStack(&[_]u256{0x123});
    
    // Execute SLOAD opcode
    _ = try test_helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    
    // Check the result
    const sload_result = try test_frame.popStack();
    std.debug.print("SLOAD opcode result: {}\n", .{sload_result});
    try testing.expectEqual(@as(u256, 0x456789), sload_result);
}
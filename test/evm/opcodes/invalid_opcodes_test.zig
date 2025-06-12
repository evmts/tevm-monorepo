const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Test invalid opcodes in the 0x21-0x2F range
test "Invalid Opcodes: 0x21-0x24 should fail" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test each invalid opcode from 0x21 to 0x24
    const invalid_opcodes = [_]u8{ 0x21, 0x22, 0x23, 0x24 };
    
    for (invalid_opcodes) |opcode| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 1000;
        
        // Push some dummy values on stack in case the opcode tries to pop
        try test_frame.pushStack(&[_]u256{ 42, 100 });
        
        // Executing an invalid opcode should fail
<<<<<<< HEAD
        const result = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
=======
        const result = helpers.executeOpcode(opcode, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        // We expect an error (likely InvalidOpcode or similar)
        try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, result);
        
        // All gas should be consumed
        try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);
    }
}

// Test that all opcodes in the 0x21-0x2F range are invalid
test "Invalid Opcodes: Full 0x21-0x2F range" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test all opcodes from 0x21 to 0x2F
    var opcode: u8 = 0x21;
    while (opcode <= 0x2F) : (opcode += 1) {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 1000;
        
        // Push some dummy values
        try test_frame.pushStack(&[_]u256{ 1, 2, 3 });
        
        // All these should be invalid
<<<<<<< HEAD
        const result = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
=======
        const result = helpers.executeOpcode(opcode, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, result);
        
        // Verify gas consumption
        try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);
    }
}
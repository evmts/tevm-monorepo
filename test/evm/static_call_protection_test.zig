const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const VM = evm.Vm;
const Address = evm.Address;
const ExecutionError = evm.ExecutionError;
<<<<<<< HEAD

test "Static call protection - validate_static_context" {
    const allocator = testing.allocator;
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
const MemoryDatabase = evm.MemoryDatabase;
const DatabaseInterface = evm.DatabaseInterface;

// Helper function to create VM with memory database
fn createTestVm(allocator: std.mem.Allocator) !struct { vm: VM, memory_db: *MemoryDatabase } {
    const memory_db = try allocator.create(MemoryDatabase);
    memory_db.* = MemoryDatabase.init(allocator);
    const db_interface = memory_db.to_database_interface();
    const vm = try VM.init(allocator, db_interface, null, null);
    return .{ .vm = vm, .memory_db = memory_db };
}

fn destroyTestVm(allocator: std.mem.Allocator, vm: *VM, memory_db: *MemoryDatabase) void {
    vm.deinit();
    memory_db.deinit();
    allocator.destroy(memory_db);
}

test "Static call protection - validate_static_context" {
    const allocator = testing.allocator;
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    // Test 1: Normal context should allow modifications
    vm.read_only = false;
    try vm.validate_static_context(); // Should not error
    
    // Test 2: Static context should prevent modifications
    vm.read_only = true;
    const result = vm.validate_static_context();
    try testing.expectError(error.WriteProtection, result);
}

test "Static call protection - storage operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_address = [_]u8{0x01} ** 20;
    const test_slot: u256 = 42;
    const test_value: u256 = 100;
    
    // Test 1: Normal context allows storage writes
    vm.read_only = false;
    try vm.set_storage_protected(test_address, test_slot, test_value);
<<<<<<< HEAD
    const stored_value = try vm.get_storage(test_address, test_slot);
=======
    const stored_value = vm.state.get_storage(test_address, test_slot);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try testing.expectEqual(test_value, stored_value);
    
    // Test 2: Static context prevents storage writes
    vm.read_only = true;
    const result = vm.set_storage_protected(test_address, test_slot, 200);
    try testing.expectError(error.WriteProtection, result);
    
    // Verify value didn't change
<<<<<<< HEAD
    const unchanged_value = try vm.get_storage(test_address, test_slot);
=======
    const unchanged_value = vm.state.get_storage(test_address, test_slot);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try testing.expectEqual(test_value, unchanged_value);
}

test "Static call protection - transient storage operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_address = [_]u8{0x02} ** 20;
    const test_slot: u256 = 50;
    const test_value: u256 = 150;
    
    // Test 1: Normal context allows transient storage writes
    vm.read_only = false;
    try vm.set_transient_storage_protected(test_address, test_slot, test_value);
<<<<<<< HEAD
    const stored_value = try vm.get_transient_storage(test_address, test_slot);
=======
    const stored_value = vm.state.get_transient_storage(test_address, test_slot);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try testing.expectEqual(test_value, stored_value);
    
    // Test 2: Static context prevents transient storage writes
    vm.read_only = true;
    const result = vm.set_transient_storage_protected(test_address, test_slot, 250);
    try testing.expectError(error.WriteProtection, result);
}

test "Static call protection - balance operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_address = [_]u8{0x03} ** 20;
    const test_balance: u256 = 1000;
    
    // Test 1: Normal context allows balance updates
    vm.read_only = false;
    try vm.set_balance_protected(test_address, test_balance);
<<<<<<< HEAD
    const balance = try vm.get_balance(test_address);
=======
    const balance = vm.state.get_balance(test_address);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try testing.expectEqual(test_balance, balance);
    
    // Test 2: Static context prevents balance updates
    vm.read_only = true;
    const result = vm.set_balance_protected(test_address, 2000);
    try testing.expectError(error.WriteProtection, result);
}

test "Static call protection - code operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_address = [_]u8{0x04} ** 20;
    const test_code = [_]u8{0x60, 0x01, 0x60, 0x02}; // PUSH1 1 PUSH1 2
    
    // Test 1: Normal context allows code updates
    vm.read_only = false;
    try vm.set_code_protected(test_address, &test_code);
<<<<<<< HEAD
    const code = try vm.get_code(test_address);
=======
    const code = vm.state.get_code(test_address);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try testing.expectEqualSlices(u8, &test_code, code);
    
    // Test 2: Static context prevents code updates
    vm.read_only = true;
    const new_code = [_]u8{0x60, 0x03}; // PUSH1 3
    const result = vm.set_code_protected(test_address, &new_code);
    try testing.expectError(error.WriteProtection, result);
}

test "Static call protection - log operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_address = [_]u8{0x05} ** 20;
    const topics = [_]u256{0x123, 0x456};
    const data = [_]u8{0x01, 0x02, 0x03};
    
    // Test 1: Normal context allows log emission
    vm.read_only = false;
    try vm.emit_log_protected(test_address, &topics, &data);
<<<<<<< HEAD
    try testing.expectEqual(@as(usize, 1), vm.logs.items.len);
=======
    try testing.expectEqual(@as(usize, 1), vm.state.logs.items.len);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    // Test 2: Static context prevents log emission
    vm.read_only = true;
    const result = vm.emit_log_protected(test_address, &topics, &data);
    try testing.expectError(error.WriteProtection, result);
    
    // Verify no new log was added
<<<<<<< HEAD
    try testing.expectEqual(@as(usize, 1), vm.logs.items.len);
=======
    try testing.expectEqual(@as(usize, 1), vm.state.logs.items.len);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
}

test "Static call protection - contract creation" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const creator = [_]u8{0x06} ** 20;
    const value: u256 = 1000;
    const init_code = [_]u8{0x60, 0x00}; // PUSH1 0
    const gas: u64 = 100000;
    
    // Test 1: Normal context allows contract creation
    vm.read_only = false;
    _ = try vm.create_contract_protected(creator, value, &init_code, gas);
    
    // Test 2: Static context prevents contract creation
    vm.read_only = true;
    const result = vm.create_contract_protected(creator, value, &init_code, gas);
    try testing.expectError(error.WriteProtection, result);
}

test "Static call protection - CREATE2 contract creation" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const creator = [_]u8{0x07} ** 20;
    const value: u256 = 1000;
    const init_code = [_]u8{0x60, 0x00}; // PUSH1 0
    const salt: u256 = 0xdeadbeef;
    const gas: u64 = 100000;
    
    // Test 1: Normal context allows CREATE2
    vm.read_only = false;
    _ = try vm.create2_contract_protected(creator, value, &init_code, salt, gas);
    
    // Test 2: Static context prevents CREATE2
    vm.read_only = true;
    const result = vm.create2_contract_protected(creator, value, &init_code, salt, gas);
    try testing.expectError(error.WriteProtection, result);
}

test "Static call protection - value transfer validation" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    // Test 1: Normal context allows value transfers
    vm.read_only = false;
    try vm.validate_value_transfer(1000); // Should not error
    
    // Test 2: Static context allows zero value
    vm.read_only = true;
    try vm.validate_value_transfer(0); // Should not error
    
    // Test 3: Static context prevents non-zero value transfers
    vm.read_only = true;
    const result = vm.validate_value_transfer(1);
    try testing.expectError(error.WriteProtection, result);
}

test "Static call protection - selfdestruct" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const contract = [_]u8{0x08} ** 20;
    const beneficiary = [_]u8{0x09} ** 20;
    
    // Test 1: Normal context allows selfdestruct
    vm.read_only = false;
    try vm.selfdestruct_protected(contract, beneficiary);
    
    // Test 2: Static context prevents selfdestruct
    vm.read_only = true;
    const result = vm.selfdestruct_protected(contract, beneficiary);
    try testing.expectError(error.WriteProtection, result);
}

test "Static call protection - comprehensive scenario" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    var vm = try VM.init(allocator);
    defer vm.deinit();
=======
    const test_setup = try createTestVm(allocator);
    var vm = test_setup.vm;
    defer destroyTestVm(allocator, &vm, test_setup.memory_db);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_address = [_]u8{0x0A} ** 20;
    
    // Set up initial state in normal context
    vm.read_only = false;
    try vm.set_balance_protected(test_address, 5000);
    try vm.set_storage_protected(test_address, 1, 100);
    
    // Switch to static context
    vm.read_only = true;
    
    // Verify reads still work
<<<<<<< HEAD
    const balance = try vm.get_balance(test_address);
    try testing.expectEqual(@as(u256, 5000), balance);
    
    const storage_value = try vm.get_storage(test_address, 1);
=======
    const balance = vm.state.get_balance(test_address);
    try testing.expectEqual(@as(u256, 5000), balance);
    
    const storage_value = vm.state.get_storage(test_address, 1);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try testing.expectEqual(@as(u256, 100), storage_value);
    
    // Verify all writes fail
    try testing.expectError(error.WriteProtection, vm.set_balance_protected(test_address, 6000));
    try testing.expectError(error.WriteProtection, vm.set_storage_protected(test_address, 1, 200));
    try testing.expectError(error.WriteProtection, vm.set_transient_storage_protected(test_address, 1, 300));
    try testing.expectError(error.WriteProtection, vm.emit_log_protected(test_address, &[_]u256{}, &[_]u8{}));
    try testing.expectError(error.WriteProtection, vm.create_contract_protected(test_address, 0, &[_]u8{}, 0));
    try testing.expectError(error.WriteProtection, vm.selfdestruct_protected(test_address, test_address));
    
    // Verify state unchanged
<<<<<<< HEAD
    const final_balance = try vm.get_balance(test_address);
    try testing.expectEqual(@as(u256, 5000), final_balance);
    
    const final_storage = try vm.get_storage(test_address, 1);
=======
    const final_balance = vm.state.get_balance(test_address);
    try testing.expectEqual(@as(u256, 5000), final_balance);
    
    const final_storage = vm.state.get_storage(test_address, 1);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try testing.expectEqual(@as(u256, 100), final_storage);
}
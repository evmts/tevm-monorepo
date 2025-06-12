// Simple test for database interface without full EVM integration
const std = @import("std");
const testing = std.testing;

// Import our database modules directly
const DatabaseInterface = @import("src/evm/state/database_interface.zig").DatabaseInterface;
const DatabaseError = @import("src/evm/state/database_interface.zig").DatabaseError;
const Account = @import("src/evm/state/database_interface.zig").Account;
const MemoryDatabase = @import("src/evm/state/memory_database.zig").MemoryDatabase;

// Test helper
fn createTestAddress(value: u8) [20]u8 {
    var addr = [_]u8{0} ** 20;
    addr[19] = value;
    return addr;
}

test "memory database basic operations" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    const addr = createTestAddress(1);
    const account = Account{
        .balance = 1000,
        .nonce = 1,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };

    // Test account operations
    try testing.expect(!db_interface.account_exists(addr));
    try testing.expect(try db_interface.get_account(addr) == null);

    try db_interface.set_account(addr, account);
    try testing.expect(db_interface.account_exists(addr));
    
    const retrieved_account = try db_interface.get_account(addr);
    try testing.expect(retrieved_account != null);
    try testing.expectEqual(account.balance, retrieved_account.?.balance);
    try testing.expectEqual(account.nonce, retrieved_account.?.nonce);

    // Test storage operations
    try testing.expectEqual(@as(u256, 0), try db_interface.get_storage(addr, 0));
    try db_interface.set_storage(addr, 0, 123);
    try testing.expectEqual(@as(u256, 123), try db_interface.get_storage(addr, 0));

    // Test code operations
    const test_code = [_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 };
    const code_hash = try db_interface.set_code(&test_code);
    const retrieved_code = try db_interface.get_code(code_hash);
    try testing.expectEqualSlices(u8, &test_code, retrieved_code);
}

test "memory database snapshots" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    const addr = createTestAddress(1);
    const account1 = Account{
        .balance = 1000,
        .nonce = 1,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };
    const account2 = Account{
        .balance = 2000,
        .nonce = 2,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };

    // Set initial state
    try db_interface.set_account(addr, account1);
    try db_interface.set_storage(addr, 0, 100);

    // Create snapshot
    const snapshot_id = try db_interface.create_snapshot();

    // Modify state
    try db_interface.set_account(addr, account2);
    try db_interface.set_storage(addr, 0, 200);

    // Verify modified state
    const modified_account = try db_interface.get_account(addr);
    try testing.expectEqual(account2.balance, modified_account.?.balance);
    try testing.expectEqual(@as(u256, 200), try db_interface.get_storage(addr, 0));

    // Revert to snapshot
    try db_interface.revert_to_snapshot(snapshot_id);

    // Verify reverted state
    const reverted_account = try db_interface.get_account(addr);
    try testing.expectEqual(account1.balance, reverted_account.?.balance);
    try testing.expectEqual(@as(u256, 100), try db_interface.get_storage(addr, 0));
}

test "memory database batch operations" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    const addr1 = createTestAddress(1);
    const addr2 = createTestAddress(2);
    const account1 = Account{
        .balance = 1000,
        .nonce = 1,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };
    const account2 = Account{
        .balance = 2000,
        .nonce = 2,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };

    // Test batch commit
    try db_interface.begin_batch();
    try db_interface.set_account(addr1, account1);
    try db_interface.set_account(addr2, account2);
    try db_interface.set_storage(addr1, 0, 123);
    try db_interface.commit_batch();

    // Verify batch was committed
    try testing.expect(db_interface.account_exists(addr1));
    try testing.expect(db_interface.account_exists(addr2));
    try testing.expectEqual(@as(u256, 123), try db_interface.get_storage(addr1, 0));
}

test "debug storage through full VM stack" {
    // Import the EVM components we need
    const EvmState = @import("src/evm/state/state.zig");
    const Vm = @import("src/evm/vm.zig");
    const Contract = @import("src/evm/contract/contract.zig");
    const Frame = @import("src/evm/frame.zig");
    const Address = @import("src/address/address.zig");
    
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();
    
    const db_interface = memory_db.to_database_interface();
    
    // Create EVM state
    var state = try EvmState.init(testing.allocator, db_interface);
    defer state.deinit();
    
    // Create VM
    var vm = try Vm.init(testing.allocator, db_interface, null, null);
    defer vm.deinit();
    
    // Test addresses
    const contract_address = Address.from_u256(0x3333333333333333333333333333333333333333);
    const caller_address = Address.from_u256(0x1111111111111111111111111111111111111111);
    
    // Create contract
    var contract = Contract.init(
        caller_address,
        contract_address,
        0, // value
        1_000_000, // gas
        &[_]u8{}, // code
        [_]u8{0} ** 32, // code hash
        &[_]u8{}, // input
        false, // not static
    );
    defer contract.deinit(testing.allocator, null);
    
    // Create frame
    var frame = try Frame.init(testing.allocator, &contract);
    defer frame.deinit();
    
    // Debug: Print addresses
    std.debug.print("contract_address = {any}\n", .{contract_address});
    std.debug.print("contract.address = {any}\n", .{contract.address});
    std.debug.print("frame.contract.address = {any}\n", .{frame.contract.address});
    
    // Verify they're the same
    try testing.expect(std.mem.eql(u8, &contract_address, &contract.address));
    try testing.expect(std.mem.eql(u8, &contract.address, &frame.contract.address));
    
    // Test 1: Set storage via state using contract address
    try state.set_storage(contract_address, 0x123, 0x456789);
    
    // Test 2: Read it back via state to confirm storage
    const stored_value = state.get_storage(contract_address, 0x123);
    std.debug.print("Direct state get_storage returned: {}\n", .{stored_value});
    try testing.expectEqual(@as(u256, 0x456789), stored_value);
    
    // Test 3: Read via frame's contract address (should be same)
    const frame_stored_value = state.get_storage(frame.contract.address, 0x123);
    std.debug.print("Frame contract address get_storage returned: {}\n", .{frame_stored_value});
    try testing.expectEqual(@as(u256, 0x456789), frame_stored_value);
    
    // Test 4: Read via VM's state (should be same)
    const vm_stored_value = vm.state.get_storage(frame.contract.address, 0x123);
    std.debug.print("VM state get_storage returned: {}\n", .{vm_stored_value});
    try testing.expectEqual(@as(u256, 0x456789), vm_stored_value);
}
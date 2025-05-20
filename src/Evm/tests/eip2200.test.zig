const std = @import("std");
const testing = std.testing;
const Evm = @import("Evm");
const Interpreter = Evm.Interpreter;
const Frame = Evm.Frame;
const Contract = Evm.Contract;
const createContract = Evm.createContract;
const JumpTable = Evm.JumpTable;
const StateManager = @import("StateManager").StateManager;
const Address = @import("Address").Address;
const ExecutionError = Evm.Frame.ExecutionError; // Assuming Frame exports ExecutionError or it's Evm.ExecutionError
const B256 = @import("StateManager").B256; // Using B256 from StateManager module

// Test constants
const TEST_GAS = 10000000;

/// A struct that maps storage slots to values for testing
const TestStorage = struct {
    values: std.AutoHashMap(u256, u256),
    accessed_slots: std.AutoHashMap(u256, bool),

    fn init(allocator: std.mem.Allocator) TestStorage {
        return TestStorage{
            .values = std.AutoHashMap(u256, u256).init(allocator),
            .accessed_slots = std.AutoHashMap(u256, bool).init(allocator),
        };
    }

    fn deinit(self: *TestStorage) void {
        self.values.deinit();
        self.accessed_slots.deinit();
    }
};

/// A mock State Manager implementation for testing SSTORE/SLOAD
const TestStateManager = struct {
    allocator: std.mem.Allocator,
    storage: std.AutoHashMap(Address, TestStorage),

    pub fn init(allocator: std.mem.Allocator) TestStateManager {
        return TestStateManager{
            .allocator = allocator,
            .storage = std.AutoHashMap(Address, TestStorage).init(allocator),
        };
    }

    pub fn deinit(self: *TestStateManager) void {
        var it = self.storage.iterator();
        while (it.next()) |kv| {
            var test_storage = kv.value_ptr;
            test_storage.deinit();
        }
        self.storage.deinit();
    }

    pub fn getContractStorage(self: *TestStateManager, address: Address, key: B256) ![]u8 {
        // Convert B256 key to u256
        var key_value: u256 = 0;
        for (key.bytes.bytes) |byte| {
            key_value = (key_value << 8) | byte;
        }

        // Get test storage for address or create if it doesn't exist
        if (!self.storage.contains(address)) {
            try self.storage.put(address, TestStorage.init(self.allocator));
        }

        var test_storage = self.storage.getPtr(address).?;
        test_storage.accessed_slots.put(key_value, true) catch {};

        // Get value from storage or default to 0
        const value = test_storage.values.get(key_value) orelse 0;

        // Convert to bytes
        var result = try self.allocator.alloc(u8, 32);
        @memset(result, 0);

        var temp_value = value;
        var i: usize = 31;
        while (i <= 31) : (i -= 1) {
            result[i] = @truncate(temp_value);
            temp_value >>= 8;
            if (i == 0) break;
        }

        return result;
    }

    pub fn putContractStorage(self: *TestStateManager, address: Address, key: B256, value_bytes: *const [32]u8) !void {
        // Convert B256 key to u256
        var key_value: u256 = 0;
        for (key.bytes.bytes) |byte| {
            key_value = (key_value << 8) | byte;
        }

        // Convert value bytes to u256
        var value: u256 = 0;
        for (value_bytes) |byte| {
            value = (value << 8) | byte;
        }

        // Get test storage for address or create if it doesn't exist
        if (!self.storage.contains(address)) {
            try self.storage.put(address, TestStorage.init(self.allocator));
        }

        var test_storage = self.storage.getPtr(address).?;

        // Store value
        try test_storage.values.put(key_value, value);
    }

    pub fn getAccount(self: *TestStateManager, address: Address) !?struct {
        balance: struct { value: u256 },
        codeHash: struct { bytes: [32]u8 },
    } {
        _ = address;
        _ = self;

        return null;
    }

    pub fn getContractCode(self: *TestStateManager, address: Address) ![]u8 {
        _ = address;
        _ = self;

        // Return empty code
        return &[_]u8{};
    }
};

// Helper function to convert hex string to Address
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    _ = try std.fmt.hexToBytes(&addr, hex_str[2..]);
    _ = allocator; // Keep allocator if needed elsewhere or for consistency
    return addr;
}

test "EIP-2200: SSTORE original value tracking" {
    const allocator = std.testing.allocator;
    // _ = allocator; // Removed as allocator is not used in this test block directly by createContract or deinit

    // Create test contract
    var contract = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    defer contract.deinit();

    // Test tracking original values
    const slot1: u256 = 1;
    const slot2: u256 = 2;

    // Initial value
    const value1: u256 = 100;
    const value2: u256 = 200;

    // Track original value for slot1
    contract.trackOriginalStorageValue(slot1, value1);

    // Value should be retrieved correctly
    try testing.expectEqual(value1, contract.getOriginalStorageValue(slot1, 999));

    // When we track a second value for the same slot, it should not change
    contract.trackOriginalStorageValue(slot1, 500);
    try testing.expectEqual(value1, contract.getOriginalStorageValue(slot1, 999));

    // Track original value for slot2
    contract.trackOriginalStorageValue(slot2, value2);
    try testing.expectEqual(value2, contract.getOriginalStorageValue(slot2, 999));

    // Untracked slots should return default value
    try testing.expectEqual(@as(u256, 777), contract.getOriginalStorageValue(999, 777));
}

test "EIP-2200: SSTORE gas costs and refunds" {
    const allocator = std.testing.allocator;

    // Create mock state manager
    var state_manager = TestStateManager.init(allocator);
    defer state_manager.deinit();

    // Create EVM
    var evm_instance = try Evm.init(allocator, null);
    var jump_table = JumpTable.init();
    defer jump_table.deinit(allocator);
    try JumpTable.initMainnetJumpTable(allocator, &jump_table);
    var evm_interpreter = Interpreter.create(allocator, &evm_instance, jump_table);
    // Set the state manager
    evm_instance.state_manager = @ptrCast(@alignCast(&state_manager));

    defer evm_interpreter.deinit();

    // Create contract
    var contract = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    defer contract.deinit();

    // First scenario: Set storage slot from 0 to non-zero
    {
        // Create bytecode: PUSH1 value, PUSH1 key, SSTORE, STOP
        const bytecode = &[_]u8{ 0x60, 0x01, 0x60, 0x01, 0x55, 0x00 };
        contract.code = bytecode;
        contract.gas = TEST_GAS; // Reset gas
        contract.gas_refund = 0; // Reset refund

        // Create frame
        var frame = try Frame.init(allocator, &contract);
        defer frame.deinit();

        // Execute the code
        _ = try evm_interpreter.execute(&frame);

        // Calculate gas used - should be ~SstoreSetGas plus small overhead
        const gas_used = TEST_GAS - contract.gas;
        try testing.expect(gas_used >= JumpTable.SstoreSetGas);
        try testing.expect(gas_used < JumpTable.SstoreSetGas + 100); // Some small overhead

        // No refund should be granted
        try testing.expectEqual(@as(u64, 0), contract.gas_refund);
    }

    // Second scenario: Update existing storage from non-zero to different non-zero
    {
        // Create bytecode: PUSH1 new_value, PUSH1 key, SSTORE, STOP
        const bytecode = &[_]u8{ 0x60, 0x02, 0x60, 0x01, 0x55, 0x00 };
        contract.code = bytecode;
        contract.gas = TEST_GAS; // Reset gas
        contract.gas_refund = 0; // Reset refund

        // Create frame
        var frame = try Frame.init(allocator, &contract);
        defer frame.deinit();

        // Execute the code
        _ = try evm_interpreter.execute(&frame);

        // Calculate gas used - should be ~SstoreResetGas plus overhead
        const gas_used = TEST_GAS - contract.gas;
        try testing.expect(gas_used >= JumpTable.SstoreResetGas);
        try testing.expect(gas_used < JumpTable.SstoreResetGas + 100);

        // No refund for updating to a new non-zero value
        try testing.expectEqual(@as(u64, 0), contract.gas_refund);
    }

    // Third scenario: Clear storage (set to zero)
    {
        // Create bytecode: PUSH1 0 (zero value), PUSH1 key, SSTORE, STOP
        const bytecode = &[_]u8{ 0x60, 0x00, 0x60, 0x01, 0x55, 0x00 };
        contract.code = bytecode;
        contract.gas = TEST_GAS; // Reset gas
        contract.gas_refund = 0; // Reset refund

        // Create frame
        var frame = try Frame.init(allocator, &contract);
        defer frame.deinit();

        // Execute the code
        _ = try evm_interpreter.execute(&frame);

        // Calculate gas used - should be ~SstoreClearGas plus overhead
        const gas_used = TEST_GAS - contract.gas;
        try testing.expect(gas_used >= JumpTable.SstoreClearGas);
        try testing.expect(gas_used < JumpTable.SstoreClearGas + 100);

        // Should get a SstoreRefundGas refund (EIP-3529 value)
        try testing.expectEqual(JumpTable.SstoreRefundGas, contract.gas_refund);
        try testing.expectEqual(@as(u64, 4800), contract.gas_refund); // Explicit check for EIP-3529 refund value
    }

    // Fourth scenario: Restore to original value
    // First set a value, then change it, then restore it
    {
        // Step 1: Set slot to 5
        {
            // Create bytecode: PUSH1 5, PUSH1 key, SSTORE, STOP
            const bytecode = &[_]u8{ 0x60, 0x05, 0x60, 0x02, 0x55, 0x00 };
            contract.code = bytecode;
            contract.gas = TEST_GAS; // Reset gas
            contract.gas_refund = 0; // Reset refund

            // Create frame and execute
            var frame = try Frame.init(allocator, &contract);
            defer frame.deinit();
            _ = try evm_interpreter.execute(&frame);
        }

        // Step 2: Change to 8
        {
            // Create bytecode: PUSH1 8, PUSH1 key, SSTORE, STOP
            const bytecode = &[_]u8{ 0x60, 0x08, 0x60, 0x02, 0x55, 0x00 };
            contract.code = bytecode;
            contract.gas = TEST_GAS; // Reset gas
            contract.gas_refund = 0; // Reset refund

            // Create frame and execute
            var frame = try Frame.init(allocator, &contract);
            defer frame.deinit();
            _ = try evm_interpreter.execute(&frame);
        }

        // Step 3: Restore to 5 (original value)
        {
            // Create bytecode: PUSH1 5, PUSH1 key, SSTORE, STOP
            const bytecode = &[_]u8{ 0x60, 0x05, 0x60, 0x02, 0x55, 0x00 };
            contract.code = bytecode;
            contract.gas = TEST_GAS; // Reset gas
            contract.gas_refund = 0; // Reset refund

            // Create frame and execute
            var frame = try Frame.init(allocator, &contract);
            defer frame.deinit();
            _ = try evm_interpreter.execute(&frame);

            // Should get a refund for restoring to original value
            // SstoreResetGas - SstoreClearGas = 5000 - 5000 = 0
            // This should be zero in current Ethereum, but we check the actual calculation
            const expected_refund = JumpTable.SstoreResetGas - JumpTable.SstoreClearGas;
            try testing.expectEqual(expected_refund, contract.gas_refund);
        }
    }
}

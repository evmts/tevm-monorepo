const std = @import("std");
const testing = std.testing;

const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const ExecutionError = EvmModule.InterpreterError;
const Evm = EvmModule.Evm;
const B256 = EvmModule.B256;

const StateManagerModule = @import("StateManager");
const StateManager = StateManagerModule.StateManager;

const AddressModule = @import("Address");
const Address = AddressModule.Address;

// Helper function to convert hex string to Address
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    _ = allocator;
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    _ = try std.fmt.hexToBytes(&addr, hex_str[2..]);
    return addr;
}

// Test constants
const TEST_GAS = 10000000;

test "EIP-2929: SLOAD warm and cold access" {
    const allocator = testing.allocator;
    var contract = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    defer contract.deinit();

    // Initial state: everything is cold
    try testing.expect(contract.isStorageSlotCold(123));

    // Mark a slot as warm
    const was_cold = contract.markStorageSlotWarm(123);
    try testing.expect(was_cold);

    // Now the slot should be warm
    try testing.expect(!contract.isStorageSlotCold(123));

    // Marking again should return false (was not cold)
    const was_still_cold = contract.markStorageSlotWarm(123);
    try testing.expect(!was_still_cold);

    // Other slots should still be cold
    try testing.expect(contract.isStorageSlotCold(456));
}

test "EIP-2929: Account warm and cold access" {
    const allocator = testing.allocator;
    var contract = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    defer contract.deinit();

    // Initial state: account is cold
    try testing.expect(contract.isAccountCold());

    // Mark account as warm
    const was_cold = contract.markAccountWarm();
    try testing.expect(was_cold);

    // Now the account should be warm
    try testing.expect(!contract.isAccountCold());

    // Marking again should return false (was not cold)
    const was_still_cold = contract.markAccountWarm();
    try testing.expect(!was_still_cold);
}

// Mock StateManager for testing
const MockStateManager = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) MockStateManager {
        return MockStateManager{
            .allocator = allocator,
        };
    }

    pub fn getContractStorage(self: *MockStateManager, address: Address, key: B256) ![]u8 {
        _ = address;
        _ = key;
        _ = self;

        // Return empty data
        const result = try self.allocator.alloc(u8, 32);
        @memset(result, 0);
        return result;
    }

    pub fn putContractStorage(self: *MockStateManager, address: Address, key: B256, value: *const [32]u8) !void {
        _ = address;
        _ = key;
        _ = value;
        _ = self;
    }

    pub fn getAccount(self: *MockStateManager, address: Address) !?struct {
        balance: struct { value: u256 },
        codeHash: struct { bytes: [32]u8 },
    } {
        _ = address;
        _ = self;

        return null;
    }

    pub fn getContractCode(self: *MockStateManager, address: Address) ![]u8 {
        _ = address;
        _ = self;

        // Return empty code
        return &[_]u8{};
    }
};

test "EIP-2929: SLOAD Gas Cost Differences" {
    const allocator = testing.allocator;
    var state_manager = MockStateManager.init(allocator);

    var evm_instance = try Evm.init(allocator, null);
    evm_instance.state_manager = @ptrCast(&state_manager);

    var interpreter = try Interpreter.init(allocator, &evm_instance);

    const bytecode = &[_]u8{ 0x60, 0x00, 0x54, 0x60, 0x00, 0x54, 0x00 };
    var contract_instance = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    contract_instance.code = bytecode;

    _ = try interpreter.run(&contract_instance, &[_]u8{}, false);

    const gas_used = TEST_GAS - contract_instance.gas;
    try testing.expect(gas_used < 2100 * 2);
    try testing.expect(gas_used > 2100);
}

test "EIP-2929: EXTCODEHASH Gas Cost Differences" {
    const allocator = testing.allocator;
    var state_manager = MockStateManager.init(allocator);

    var evm_instance = try Evm.init(allocator, null);
    evm_instance.state_manager = @ptrCast(&state_manager);

    var interpreter = try Interpreter.init(allocator, &evm_instance);

    var bytecode = [_]u8{ 0x73, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0x3F, 0x73, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0x3F, 0x00 };

    var contract_instance = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    contract_instance.code = &bytecode;

    _ = try interpreter.run(&contract_instance, &[_]u8{}, false);

    const gas_used = TEST_GAS - contract_instance.gas;
    try testing.expect(gas_used < 2600 * 2);
    try testing.expect(gas_used > 2600);
}

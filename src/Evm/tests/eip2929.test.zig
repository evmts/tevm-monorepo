const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const Contract = @import("../Contract.zig").Contract;
const createContract = @import("../Contract.zig").createContract;
const StateManager = @import("../../StateManager/StateManager.zig").StateManager;
const createAddress = @import("../../Address/address.zig").createAddress;
const Address = @import("../../Address/address.zig").Address;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const B256 = @import("../../Types/B256.ts");

// Test constants
const TEST_GAS = 10000000;

test "EIP-2929: SLOAD warm and cold access" {
    // Create test contract
    var contract = createContract(
        createAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
        createAddress("0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"),
        0,
        TEST_GAS
    );
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
    // Create test contract
    var contract = createContract(
        createAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
        createAddress("0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"),
        0,
        TEST_GAS
    );
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
    const allocator = std.testing.allocator;
    
    // Create mock state manager
    var state_manager = MockStateManager.init(allocator);
    
    // Create EVM
    var evm = try Interpreter.init(allocator);
    evm.state_manager = &state_manager;
    defer evm.deinit();
    
    // Create bytecode for a contract that does SLOAD twice on the same slot
    // 0x60 0x00 - PUSH1 0 (push key 0 to stack)
    // 0x54 - SLOAD (load from key 0) - cold access
    // 0x60 0x00 - PUSH1 0 (push key 0 to stack again)
    // 0x54 - SLOAD (load from key 0 again) - warm access
    // 0x00 - STOP
    const bytecode = &[_]u8{ 0x60, 0x00, 0x54, 0x60, 0x00, 0x54, 0x00 };
    
    // Create contract
    var contract = createContract(
        createAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
        createAddress("0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"),
        0,
        TEST_GAS
    );
    contract.code = bytecode;
    defer contract.deinit();
    
    // Create frame
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Execute the code
    _ = try evm.execute(&frame);
    
    // Calculate gas used
    const gas_used = TEST_GAS - contract.gas;
    
    // We expect gas used to be around 2100 (cold SLOAD) + 100 (warm SLOAD) plus some overhead
    // But we can't predict exactly due to other costs, so just make sure it's less than if both were cold
    try testing.expect(gas_used < 2100 * 2);
    try testing.expect(gas_used > 2100); // But more than just one cold access
}

test "EIP-2929: EXTCODEHASH Gas Cost Differences" {
    const allocator = std.testing.allocator;
    
    // Create mock state manager
    var state_manager = MockStateManager.init(allocator);
    
    // Create EVM
    var evm = try Interpreter.init(allocator);
    evm.state_manager = &state_manager;
    defer evm.deinit();
    
    // Create bytecode for a contract that does EXTCODEHASH twice on the same address
    // 0x73 followed by 20 bytes - PUSH20 (address)
    // 0x3F - EXTCODEHASH - cold access
    // 0x73 followed by same 20 bytes - PUSH20 (same address)
    // 0x3F - EXTCODEHASH - warm access
    // 0x00 - STOP
    var bytecode = [_]u8{
        0x73, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 
        0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0x3F,
        0x73, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 
        0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0x3F,
        0x00
    };
    
    // Create contract
    var contract = createContract(
        createAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
        createAddress("0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"),
        0,
        TEST_GAS
    );
    contract.code = &bytecode;
    defer contract.deinit();
    
    // Create frame
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Execute the code
    _ = try evm.execute(&frame);
    
    // Calculate gas used
    const gas_used = TEST_GAS - contract.gas;
    
    // We expect gas used to be around 2600 (cold account access) + 100 (warm account access) plus some overhead
    // But we can't predict exactly due to other costs, so just make sure it's less than if both were cold
    try testing.expect(gas_used < 2600 * 2);
    try testing.expect(gas_used > 2600); // But more than just one cold access
}
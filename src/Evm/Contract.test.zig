const std = @import("std");
// Import from evm module
const evm = @import("evm");
const Contract = evm.Contract;
const createContract = evm.createContract;

// Define Address type for testing
const Address = @import("../Address/package.zig").Address;

test "Contract warm/cold storage tracking" {
    // Use allocator if needed later
    _ = std.testing.allocator;
    
    // Create a test contract - set dummy addresses
    const caller_addr: Address = [_]u8{1} ** 20;
    const contract_addr: Address = [_]u8{2} ** 20;
    var contract = createContract(caller_addr, contract_addr, 100, 1000000);
    defer {
        // Clean up resources
        // Just skip the analysis handling for the test to avoid issues
        // The real code would handle this differently
        if (contract.storage_access) |*storage_access| {
            storage_access.deinit();
        }
        if (contract.jumpdests) |*jumpdests| {
            jumpdests.deinit();
        }
    }
    
    // Check initial cold status
    try std.testing.expect(contract.isAccountCold());
    
    // Test marking account warm
    const was_cold = contract.markAccountWarm();
    try std.testing.expect(was_cold);
    try std.testing.expect(!contract.isAccountCold());
    
    // Test marking account warm again (should return false)
    const was_cold_again = contract.markAccountWarm();
    try std.testing.expect(!was_cold_again);
    
    // Initialize storage tracking by marking a slot warm
    // This will internally call ensureStorageAccess()
    _ = contract.markStorageSlotWarm(0);
    
    // Test storage slot tracking
    const slot1 = 1;
    const slot2 = 2;
    
    // Check initial cold status for slots
    try std.testing.expect(contract.isStorageSlotCold(slot1));
    try std.testing.expect(contract.isStorageSlotCold(slot2));
    
    // Mark slot1 as warm
    const slot1_was_cold = contract.markStorageSlotWarm(slot1);
    try std.testing.expect(slot1_was_cold);
    try std.testing.expect(!contract.isStorageSlotCold(slot1));
    try std.testing.expect(contract.isStorageSlotCold(slot2));
    
    // Mark slot1 as warm again (should return false)
    const slot1_was_cold_again = contract.markStorageSlotWarm(slot1);
    try std.testing.expect(!slot1_was_cold_again);
    
    // Mark slot2 as warm
    const slot2_was_cold = contract.markStorageSlotWarm(slot2);
    try std.testing.expect(slot2_was_cold);
    try std.testing.expect(!contract.isStorageSlotCold(slot2));
}
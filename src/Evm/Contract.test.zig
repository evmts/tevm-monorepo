const std = @import("std");
const EvmModule = @import("Evm");
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const address = @import("Address");

test "Contract warm/cold storage tracking" {
    const allocator = std.testing.allocator;
    
    // Create a test contract
    const caller_addr = address.Address.fromString("0x1234567890123456789012345678901234567890");
    const contract_addr = address.Address.fromString("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd");
    var contract = createContract(caller_addr, contract_addr, 100, 1000000);
    defer {
        // Clean up resources
        if (contract.analysis) |analysis| {
            if (contract.jumpdests == null) {
                analysis.deinit(std.heap.page_allocator);
            }
        }
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
    
    // Initialize storage tracking
    contract.ensureStorageAccess();
    
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
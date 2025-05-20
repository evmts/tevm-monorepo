const std = @import("std");
const Contract = @import("../Contract.zig").Contract;
const createContract = @import("../Contract.zig").createContract;
const Address = @import("../../Address/address.zig").Address;
const createAddress = @import("../../Address/address.zig").createAddress;
const Evm = @import("../evm.zig").Evm;
const ChainRules = @import("../evm.zig").ChainRules;
const JumpTable = @import("../JumpTable.zig").JumpTable;
const Interpreter = @import("../interpreter.zig").Interpreter;
const StateManager = @import("../../StateManager/StateManager.zig").StateManager;
const createStateManager = @import("../../StateManager/StateManager.zig").createStateManager;

// Create test contract with MCOPY opcode (0x5E)
fn createTestContract() !Contract {
    const caller = createAddress("0x1111111111111111111111111111111111111111");
    const contract_addr = createAddress("0x2222222222222222222222222222222222222222");
    const value = 0;
    const gas = 100000;

    var contract = createContract(caller, contract_addr, value, gas);
    
    // Contract that initializes memory, uses MCOPY, and returns a portion
    // 1. Initialize first 64 bytes of memory with MSTORE operations
    // 2. Use MCOPY to copy bytes from offset 0 to offset 64
    // 3. Return 32 bytes from offset 64 (which should contain the copied data)
    
    // bytecode:
    // Initialize memory at offset 0 with value 0x1234...
    // 0x7F123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF - PUSH32 0x1234...
    // 0x6000 - PUSH1 0x00 (destination in memory)
    // 0x52 - MSTORE (store value at memory offset 0)
    // 
    // Initialize memory at offset 32 with a different value 0xABCD...
    // 0x7FABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF01234567 - PUSH32 0xABCD...
    // 0x6020 - PUSH1 0x20 (destination in memory)
    // 0x52 - MSTORE (store value at memory offset 32)
    // 
    // Copy memory from offset 0-63 to offset 64-127
    // 0x6040 - PUSH1 0x40 (64 bytes to copy)
    // 0x6000 - PUSH1 0x00 (source offset)
    // 0x6040 - PUSH1 0x40 (destination offset)
    // 0x5E - MCOPY (0x5E = 94 in decimal)
    // 
    // Return the copied data from memory[64:96]
    // 0x6020 - PUSH1 0x20 (length 32 bytes)
    // 0x6040 - PUSH1 0x40 (offset 64)
    // 0xF3 - RETURN
    
    const code = [_]u8{
        // Initialize memory[0:32]
        0x7F, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE,
        0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE,
        0xF0, 0x60, 0x00, 0x52,
        
        // Initialize memory[32:64]
        0x7F, 0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67,
        0x89, 0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67,
        0x89, 0x60, 0x20, 0x52,
        
        // MCOPY memory[0:64] to memory[64:128]
        0x60, 0x40, 0x60, 0x00, 0x60, 0x40, 0x5E,
        
        // Return memory[64:96]
        0x60, 0x20, 0x60, 0x40, 0xF3
    };
    
    const code_hash = [_]u8{0} ** 32; // Dummy hash
    contract.setCallCode(code_hash, &code);
    
    return contract;
}

// Test EIP-5656: MCOPY opcode
test "EIP-5656: MCOPY opcode with EIP-5656 enabled" {
    const allocator = std.testing.allocator;
    
    // Create EVM with EIP-5656 enabled
    var evm = Evm.init();
    var chainRules = evm.chainRules;
    chainRules.IsEIP5656 = true;
    evm.setChainRules(chainRules);
    
    // Create state manager
    var state_manager = try createStateManager(allocator);
    defer state_manager.deinit();
    evm.setStateManager(&state_manager);
    
    // Create jump table
    var jt = JumpTable.init();
    defer jt.deinit(allocator);
    try JumpTable.initMainnetJumpTable(allocator, &jt);
    
    // Create interpreter
    var interpreter = Interpreter.create(allocator, &evm, jt);
    defer interpreter.deinit();
    
    // Create test contract with MCOPY opcode
    var contract = try createTestContract();
    defer contract.deinit();
    
    // Execute the contract
    const result = try interpreter.run(&contract, &[_]u8{}, false);
    
    // Verify that the execution completed successfully (result is non-null)
    try std.testing.expect(result != null);
    
    // The result should be the first 32 bytes that were copied
    // This should match the data we initialized at memory offset 0
    if (result) |data| {
        // Expected value is what we stored at memory[0:32]
        const expected = [_]u8{
            0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 
            0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 
            0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 
            0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0
        };
        
        try std.testing.expectEqualSlices(u8, &expected, data);
    }
}

// Test that MCOPY opcode fails when EIP-5656 is disabled
test "EIP-5656: MCOPY opcode with EIP-5656 disabled" {
    const allocator = std.testing.allocator;
    
    // Create EVM with EIP-5656 disabled
    var evm = Evm.init();
    var chainRules = evm.chainRules;
    chainRules.IsEIP5656 = false;
    evm.setChainRules(chainRules);
    
    // Create state manager
    var state_manager = try createStateManager(allocator);
    defer state_manager.deinit();
    evm.setStateManager(&state_manager);
    
    // Create jump table
    var jt = JumpTable.init();
    defer jt.deinit(allocator);
    try JumpTable.initMainnetJumpTable(allocator, &jt);
    
    // Create interpreter
    var interpreter = Interpreter.create(allocator, &evm, jt);
    defer interpreter.deinit();
    
    // Create test contract with MCOPY opcode
    var contract = try createTestContract();
    defer contract.deinit();
    
    // Execute the contract - should fail with InvalidOpcode error
    const result = interpreter.run(&contract, &[_]u8{}, false);
    
    // Verify that the execution failed with InvalidOpcode error
    try std.testing.expectError(Interpreter.InterpreterError.InvalidOpcode, result);
}
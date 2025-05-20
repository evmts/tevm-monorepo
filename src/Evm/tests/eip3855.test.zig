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

// Create test contract with PUSH0 opcode (0x5F)
fn createTestContract() !Contract {
    const caller = createAddress("0x1111111111111111111111111111111111111111");
    const contract_addr = createAddress("0x2222222222222222222222222222222222222222");
    const value = 0;
    const gas = 100000;

    var contract = createContract(caller, contract_addr, value, gas);
    
    // Simple contract that calls PUSH0 (0x5F) and returns it
    const code = [_]u8{0x5F, 0x60, 0x00, 0x53, 0x60, 0x20, 0x60, 0x00, 0xf3};
    // 0x5F - PUSH0 (push 0 onto stack)
    // 0x6000 - PUSH1 0 (push storage slot 0)
    // 0x53 - SSTORE (store 0 at slot 0)
    // 0x6020 - PUSH1 32 (size of data to return - 32 bytes)
    // 0x6000 - PUSH1 0 (offset in memory to return)
    // 0xf3 - RETURN (return data)
    
    const code_hash = [_]u8{0} ** 32; // Dummy hash
    contract.setCallCode(code_hash, &code);
    
    return contract;
}

// Test EIP-3855: PUSH0 opcode
test "EIP-3855: PUSH0 opcode with EIP-3855 enabled" {
    const allocator = std.testing.allocator;
    
    // Create EVM with EIP-3855 enabled
    var evm = Evm.init();
    var chainRules = evm.chainRules;
    chainRules.IsEIP3855 = true;
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
    
    // Create test contract with PUSH0 opcode
    var contract = try createTestContract();
    defer contract.deinit();
    
    // Execute the contract
    const result = try interpreter.run(&contract, &[_]u8{}, false);
    
    // Verify that the execution completed successfully (result is non-null)
    std.testing.expect(result != null) catch |err| {
        std.debug.print("Test failed: {}\n", .{err});
        return err;
    };
}

// Test that PUSH0 opcode fails when EIP-3855 is disabled
test "EIP-3855: PUSH0 opcode with EIP-3855 disabled" {
    const allocator = std.testing.allocator;
    
    // Create EVM with EIP-3855 disabled
    var evm = Evm.init();
    var chainRules = evm.chainRules;
    chainRules.IsEIP3855 = false;
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
    
    // Create test contract with PUSH0 opcode
    var contract = try createTestContract();
    defer contract.deinit();
    
    // Execute the contract - should fail with InvalidOpcode error
    const result = interpreter.run(&contract, &[_]u8{}, false);
    
    // Verify that the execution failed with InvalidOpcode error
    std.testing.expectError(Interpreter.InterpreterError.InvalidOpcode, result) catch |err| {
        std.debug.print("Test failed: {}\n", .{err});
        return err;
    };
}
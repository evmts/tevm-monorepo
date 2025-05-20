const std = @import("std");

const EvmModule = @import("Evm");
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const Evm = EvmModule.Evm;
const ChainRules = EvmModule.ChainRules;
const JumpTable = EvmModule.JumpTable;
const Interpreter = EvmModule.Interpreter;

const AddressModule = @import("Address");
const Address = AddressModule.Address;

const StateManagerModule = @import("StateManager");
const StateManager = StateManagerModule.StateManager;

// Helper function to convert hex string to Address (similar to eip2200.test.zig)
// This should ideally be in a shared test utilities file
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    _ = try std.fmt.hexToBytes(&addr, hex_str[2..]);
    _ = allocator;
    return addr;
}

// Create test contract with PUSH0 opcode (0x5F)
fn createTestContract(allocator: std.mem.Allocator) !Contract {
    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    const value = 0;
    const gas = 100000;

    var contract = createContract(caller, contract_addr, value, gas);

    // Simple contract that calls PUSH0 (0x5F) and returns it
    const code = [_]u8{ 0x5F, 0x60, 0x00, 0x53, 0x60, 0x20, 0x60, 0x00, 0xf3 };
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
    // EIP-3855 PUSH0 opcode test
    const allocator = std.testing.allocator;

    // Create EVM with EIP-3855 enabled
    // Fix the initialization syntax for Evm
    var evm = try Evm.init(allocator, null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP3855 = true;
    evm.setChainRules(chainRules);

    // Create state manager
    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(@alignCast(&state_manager)));

    // Create jump table
    var jt = try JumpTable.newJumpTable(allocator, "latest");
    defer jt.deinit(allocator);

    // Create interpreter
    var interpreter = try Interpreter.create(allocator, &evm, jt);
    defer interpreter.deinit();

    // Create test contract with PUSH0 opcode
    var contract = try createTestContract(allocator);
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
    // EIP-3855 PUSH0 opcode test
    const allocator = std.testing.allocator;

    // Create EVM with EIP-3855 disabled
    // Fix the initialization syntax for Evm
    var evm = try Evm.init(allocator, null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP3855 = false;
    evm.setChainRules(chainRules);

    // Create state manager
    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(@alignCast(&state_manager)));

    // Create jump table
    var jt = try JumpTable.newJumpTable(allocator, "latest");
    defer jt.deinit(allocator);

    // Create interpreter
    var interpreter = try Interpreter.create(allocator, &evm, jt);
    defer interpreter.deinit();

    // Create test contract with PUSH0 opcode
    var contract = try createTestContract(allocator);
    defer contract.deinit();

    // Execute the contract - should fail with InvalidOpcode error
    const result = interpreter.run(&contract, &[_]u8{}, false);

    // Verify that the execution failed with InvalidOpcode error
    std.testing.expectError(EvmModule.InterpreterError.InvalidOpcode, result) catch |err| {
        std.debug.print("Test failed: {}\n", .{err});
        return err;
    };
}

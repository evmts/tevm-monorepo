const std = @import("std");
const testing = std.testing;

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
const StateOptions = StateManagerModule.StateOptions;

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

// Create test contract with BASEFEE opcode (0x48)
fn createTestContract(allocator: std.mem.Allocator) !Contract {
    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    const value = 0;
    const gas = 100000;

    var contract = createContract(caller, contract_addr, value, gas);

    // Simple contract that calls BASEFEE (0x48) and returns it
    const code = [_]u8{ 0x48, 0x60, 0x00, 0x53, 0x60, 0x20, 0x60, 0x00, 0xf3 };
    // 0x48 - BASEFEE (push block's base fee to stack)
    // 0x6000 - PUSH1 0 (push storage slot 0)
    // 0x53 - SSTORE (store base fee at slot 0)
    // 0x6020 - PUSH1 32 (size of data to return - 32 bytes)
    // 0x6000 - PUSH1 0 (offset in memory to return)
    // 0xf3 - RETURN (return data)

    const code_hash = [_]u8{0} ** 32; // Dummy hash
    contract.setCallCode(code_hash, &code);

    return contract;
}

// Test EIP-3198: BASEFEE opcode
test "EIP-3198: BASEFEE opcode with EIP-3198 enabled" {
    const allocator = std.testing.allocator;

    var evm = try Evm.init(allocator, null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP3198 = true;
    evm.setChainRules(chainRules);

    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(@alignCast(&state_manager)));

    var jt = try JumpTable.newJumpTable(allocator, "latest");

    var interpreter = try Interpreter.create(allocator, &evm, jt);

    var contract = try createTestContract(allocator);

    const result = try interpreter.run(&contract, &[_]u8{}, false);

    std.testing.expect(result != null) catch |err| {
        std.debug.print("Test failed: {}\n", .{err});
        return err;
    };
}

// Test that BASEFEE opcode fails when EIP-3198 is disabled
test "EIP-3198: BASEFEE opcode with EIP-3198 disabled" {
    const allocator = std.testing.allocator;

    var evm = try Evm.init(allocator, null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP3198 = false;
    evm.setChainRules(chainRules);

    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(@alignCast(&state_manager)));

    var jt = try JumpTable.newJumpTable(allocator, "latest");

    var interpreter = try Interpreter.create(allocator, &evm, jt);

    var contract = try createTestContract(allocator);

    const result = interpreter.run(&contract, &[_]u8{}, false);
    try testing.expectError(EvmModule.InterpreterError.InvalidOpcode, result);
}

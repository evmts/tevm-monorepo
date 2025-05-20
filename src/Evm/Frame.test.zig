const std = @import("std");
const testing = std.testing;

const EvmModule = @import("Evm");
const Frame = EvmModule.Frame;
const ExecutionError = EvmModule.InterpreterError;
const Contract = EvmModule.Contract;
const u256_native = u256;

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

test "Frame initialization and basic operations" {
    const allocator = std.testing.allocator;

    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);

    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();

    try std.testing.expectEqual(@as(usize, 0), frame.pc);
    try std.testing.expectEqual(@as(u64, 0), frame.cost);
    try std.testing.expect(frame.err == null);

    try frame.memory.resize(64);
    try std.testing.expectEqual(@as(u64, 64), frame.memory.len());

    try frame.stack.push(42);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.len());

    const test_data = [_]u8{ 1, 2, 3, 4 };
    try frame.setReturnData(&test_data);
    try std.testing.expectEqual(@as(usize, 4), frame.returnSize);
    try std.testing.expectEqualSlices(u8, &test_data, frame.returnData.?);

    try std.testing.expectEqual(caller, frame.caller());
    try std.testing.expectEqual(contract_addr, frame.address());
    try std.testing.expectEqual(@as(u256, 100), frame.callValue());
}

test "Frame memory and stack access" {
    const allocator = std.testing.allocator;

    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);

    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();

    try frame.memory.resize(32);
    const data = [_]u8{0xFF} ** 8;
    if (@hasDecl(@TypeOf(frame.memory), "set")) {
        frame.memory.set(0, data.len, &data);
    } else if (@hasDecl(@TypeOf(frame.memory), "store")) {
        try frame.memory.store(0, &data);
    }

    const mem_data = frame.memoryData();
    try std.testing.expectEqualSlices(u8, &data, mem_data[0..data.len]);

    try frame.stack.push(123);
    try frame.stack.push(456);

    const stack_data = frame.stackData();
    try std.testing.expectEqual(@as(usize, 2), stack_data.len);
    try std.testing.expectEqual(@as(u256, 123), stack_data[0]);
    try std.testing.expectEqual(@as(u256, 456), stack_data[1]);
}

test "Frame error handling" {
    const allocator = std.testing.allocator;

    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);

    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();

    frame.err = ExecutionError.OutOfGas;

    try std.testing.expectEqual(ExecutionError.OutOfGas, frame.err.?);
}

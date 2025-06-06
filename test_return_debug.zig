const std = @import("std");
const testing = std.testing;

// Import EVM components
const evm = @import("src/evm/evm.zig");
const Address = @import("src/Address/address.zig");
const Frame = evm.Frame;
const Contract = evm.Contract;
const Vm = evm.Vm;
const control = evm.opcodes.control;
const Operation = evm.Operation;
const ExecutionError = evm.ExecutionError;

test "Debug RETURN opcode" {
    const allocator = testing.allocator;
    
    // Create VM
    var vm = try Vm.init(allocator);
    defer vm.deinit();
    
    // Create contract
    var code = [_]u8{0xF3}; // RETURN opcode
    const addr = Address.from_slice(&[_]u8{1} ** 20);
    const caller = Address.from_slice(&[_]u8{2} ** 20);
    
    var contract = Contract.init(
        addr,
        caller,
        0, // value
        code[0..],
        &[_]u8{}, // input
        0, // gas_price
        [_]u8{0} ** 32, // code_hash
        false, // is_static
    );
    defer contract.deinit(null);
    
    // Create frame
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    frame.gas_remaining = 1000;
    
    // Set up test data in memory
    const test_data = [_]u8{0xde, 0xad, 0xbe, 0xef};
    try frame.memory.set_data(10, &test_data);
    
    // Push stack values: offset=10, size=4
    try frame.stack.append(10); // offset
    try frame.stack.append(4);  // size
    
    std.debug.print("\nStack before RETURN:\n", .{});
    std.debug.print("  Size: {}\n", .{frame.stack.size});
    std.debug.print("  Top: {}\n", .{if (frame.stack.size > 0) frame.stack.data[frame.stack.size - 1] else 0});
    std.debug.print("  Second: {}\n", .{if (frame.stack.size > 1) frame.stack.data[frame.stack.size - 2] else 0});
    
    // Execute RETURN directly
    const frame_ptr = @as(*Frame, &frame);
    const state_ptr = @as(*Operation.State, @ptrCast(@alignCast(frame_ptr)));
    const vm_ptr = @as(*Operation.Interpreter, @ptrCast(@alignCast(&vm)));
    
    const result = control.op_return(0, vm_ptr, state_ptr);
    
    if (result) |_| {
        std.debug.print("\nRETURN succeeded unexpectedly\n", .{});
    } else |err| {
        std.debug.print("\nRETURN error: {}\n", .{err});
        if (err == ExecutionError.Error.STOP) {
            std.debug.print("Return data buffer length: {}\n", .{frame.return_data_buffer.len});
            if (frame.return_data_buffer.len > 0) {
                std.debug.print("Return data: ", .{});
                for (frame.return_data_buffer) |byte| {
                    std.debug.print("{x:0>2} ", .{byte});
                }
                std.debug.print("\n", .{});
            }
        }
    }
}
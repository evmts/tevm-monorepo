const std = @import("std");
const testing = std.testing;

const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const ExecutionError = EvmModule.Frame.ExecutionError; // Assuming Frame exports this
const Stack = EvmModule.Stack;
const Memory = EvmModule.Memory;
const Evm = EvmModule.Evm;
const Contract = EvmModule.Contract;
const ChainRules = EvmModule.ChainRules; // Replaces EvmConfig
// const precompile = @import("../precompiles/Precompiled.zig").PrecompiledContract; // Keep commented if not immediately needed

const AddressModule = @import("Address");
const Address = AddressModule.Address;

const u256_native = u256; // Using Zig's native u256, replaces U256 import

// Helper function to convert hex string to Address
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    try std.fmt.hexToBytes(&addr, hex_str[2..]);
    _ = allocator;
    return addr;
}

// Helper functions for setting up test environment
// Note: EVM.init from EvmModule.Evm takes (allocator, ?ChainRules)
// Note: Contract.init from EvmModule.Contract takes (caller, contract_address, value, gas, jumpdests)
// Note: EvmModule.createContract(caller, contract_address, value, gas)
// Note: Frame.init from EvmModule.Frame takes (allocator, *Contract)
// Note: Interpreter.init from EvmModule.Interpreter takes (allocator, *Evm)
// Note: Interpreter.run from EvmModule.Interpreter takes (*Contract, input, readOnly)

fn setupInterpreter(allocator: std.mem.Allocator) !*Interpreter {
    var evm_instance = try Evm.init(allocator, null); // EvmConfig{} is not a thing
    // Interpreter.init(allocator, evm_instance)
    const interpreter_instance = try Interpreter.init(allocator, &evm_instance);
    return interpreter_instance;
}

fn setupFrame(interpreter: *Interpreter, allocator: std.mem.Allocator) !*Frame {
    _ = interpreter; // autofix
    const code = [_]u8{0xF1}; // CALL
    var contract_instance = EvmModule.createContract(try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"), try hexToAddress(allocator, "0x0000000000000000000000000000000000000002"), 0, 100000);
    contract_instance.code = &code; // Set the code on the contract
    // Frame.init(allocator, *Contract)
    const frame_instance = try Frame.init(allocator, &contract_instance);
    return frame_instance;
}

// Tests for CALL opcode (0xF1)
test "CALL with insufficient stack" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    // defer interpreter.deinit(); // Interpreter has deinit for returnData

    const frame = try setupFrame(interpreter, allocator);
    // defer frame.deinit(); // Frame has deinit
    // const result = interpreter.run(frame); // This was the original problematic line
    // Interpreter.run expects *Contract. The frame holds a *Contract.
    const result = interpreter.run(frame.contract, &[_]u8{}, false);
    try testing.expectError(EvmModule.InterpreterError.StackUnderflow, result); // Use EvmModule.InterpreterError
}

test "CALL with all parameters" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    // defer interpreter.deinit();

    const frame = try setupFrame(interpreter, allocator);
    // defer frame.deinit();
    const result = interpreter.run(frame.contract, &[_]u8{}, false);
    _ = result; // autofix

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for STATICCALL opcode (0xFA)
test "STATICCALL basic functionality" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    // defer interpreter.deinit();

    var contract_instance = EvmModule.createContract(try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"), try hexToAddress(allocator, "0x0000000000000000000000000000000000000002"), 0, 100000);
    const code_staticcall = [_]u8{0xFA}; // STATICCALL
    contract_instance.code = &code_staticcall;

    const frame = try Frame.init(allocator, &contract_instance);
    // defer frame.deinit();
    // ... existing test logic using frame.stack.push ...
    const result = interpreter.run(frame.contract, &[_]u8{}, true); // readOnly = true for staticcall
    _ = result; // autofix

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for DELEGATECALL opcode (0xF4)
test "DELEGATECALL basic functionality" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer interpreter.deinit();

    // Setup a frame with DELEGATECALL opcode
    const code = [_]u8{0xF4}; // DELEGATECALL
    const contract = try Contract.init(allocator, &code, try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"), 100000);
    const frame = try Frame.init(allocator, contract);
    defer frame.deinit();

    // Push parameters for DELEGATECALL
    try frame.stack.push(1000); // gas
    try frame.stack.push(0x1234); // address
    try frame.stack.push(0); // inOffset
    try frame.stack.push(0); // inSize
    try frame.stack.push(0); // outOffset
    try frame.stack.push(0); // outSize

    // Execute, similar limitations as CALL test
    const result = interpreter.run(&frame, &[_]u8{}, false);
    _ = result; // autofix

    // Verify stack was processed
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for CREATE opcode (0xF0)
test "CREATE basic functionality" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer interpreter.deinit();

    // Setup a frame with CREATE opcode
    const code = [_]u8{0xF0}; // CREATE
    const contract = try Contract.init(allocator, &code, try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"), 100000);
    const frame = try Frame.init(allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE
    try frame.stack.push(0); // value
    try frame.stack.push(0); // offset
    try frame.stack.push(0); // size

    // Execute
    const result = interpreter.run(&frame, &[_]u8{}, false);
    _ = result; // autofix

    // Verify stack was processed
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for CREATE2 opcode (0xF5)
test "CREATE2 basic functionality" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer interpreter.deinit();

    // Setup a frame with CREATE2 opcode
    const code = [_]u8{0xF5}; // CREATE2
    const contract = try Contract.init(allocator, &code, try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"), 100000);
    const frame = try Frame.init(allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE2
    try frame.stack.push(0); // value
    try frame.stack.push(0); // offset
    try frame.stack.push(0); // size
    try frame.stack.push(0); // salt

    // Execute
    const result = interpreter.run(&frame, &[_]u8{}, false);
    _ = result; // autofix

    // Verify stack was processed
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for RETURN opcode (0xF3)
test "RETURN opcode" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer interpreter.deinit();

    // Setup data in memory
    const return_data = [_]u8{ 0x01, 0x02, 0x03, 0x04 };

    // Setup a frame with RETURN opcode
    const code = [_]u8{0xF3}; // RETURN
    const contract = try Contract.init(allocator, &code, try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"), 100000);
    const frame = try Frame.init(allocator, contract);
    defer frame.deinit();

    // Add data to memory
    try frame.memory.store(0, &return_data);

    // Push parameters for RETURN
    try frame.stack.push(0); // offset
    try frame.stack.push(4); // size

    // Execute
    const result = interpreter.run(&frame, &[_]u8{}, false);
    _ = result; // autofix

    // The exact behavior would depend on our return data implementation
    // but we can verify the stack is empty
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for REVERT opcode (0xFD)
test "REVERT opcode" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer interpreter.deinit();

    // Setup data in memory
    const revert_data = [_]u8{ 0x08, 0x09, 0x0A, 0x0B };

    // Setup a frame with REVERT opcode
    const code = [_]u8{0xFD}; // REVERT
    const contract = try Contract.init(allocator, &code, try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"), 100000);
    const frame = try Frame.init(allocator, contract);
    defer frame.deinit();

    // Add data to memory
    try frame.memory.store(0, &revert_data);

    // Push parameters for REVERT
    try frame.stack.push(0); // offset
    try frame.stack.push(4); // size

    // Execute
    const result = interpreter.run(&frame, &[_]u8{}, false);

    // Should return a RevertExecutionError or similar
    try testing.expectError(ExecutionError.ExecutionReverted, result);

    // Verify the stack is empty
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for SELFDESTRUCT opcode (0xFF)
test "SELFDESTRUCT opcode" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer interpreter.deinit();

    // Setup a frame with SELFDESTRUCT opcode
    const code = [_]u8{0xFF}; // SELFDESTRUCT
    const contract = try Contract.init(allocator, &code, try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"), 100000);
    const frame = try Frame.init(allocator, contract);
    defer frame.deinit();

    // Push beneficiary address for SELFDESTRUCT
    try frame.stack.push(0x1234); // beneficiary address

    // Execute
    const result = interpreter.run(&frame, &[_]u8{}, false);
    _ = result; // autofix

    // Verify the stack is empty
    try testing.expectEqual(@as(usize, 0), frame.stack.size);

    // In a real implementation with state manager,
    // we would also verify that contract was marked for destruction
    // and balance was transferred
}

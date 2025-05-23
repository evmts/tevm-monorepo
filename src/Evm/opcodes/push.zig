const std = @import("std");
const jumpTableModule = @import("../jumpTable/JumpTable.zig");
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../interpreter.zig").InterpreterError;
const stackModule = @import("../Stack.zig");
const Stack = stackModule.Stack;
const StackError = stackModule.StackError;

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}

/// Helper for implementing PUSH opcodes
fn pushN(pc: usize, interpreter: *Interpreter, frame: *Frame, n: u8) ExecutionError![]const u8 {
    _ = interpreter;
    
    // Check if we have enough bytes in the code
    if (pc + 1 + n > frame.contract.code.len) {
        return ExecutionError.OutOfOffset;
    }
    
    // Extract n bytes from the code
    var value: u256 = 0;
    for (0..n) |i| {
        value = (value << 8) | frame.contract.code[pc + 1 + i];
    }
    
    // Push the value onto the stack
    frame.stack.push(value) catch |err| return mapStackError(err);
    
    // Update the program counter (skip the opcode + n bytes)
    frame.pc = pc + 1 + n;
    
    return "";
}

/// PUSH0 opcode - pushes 0 onto the stack (EIP-3855)
pub fn opPush0(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-3855 (PUSH0) is active
    if (!interpreter.evm.chainRules.IsShanghai) {
        return ExecutionError.InvalidOpcode;
    }
    
    // Push 0 onto the stack
    frame.stack.push(0) catch |err| return mapStackError(err);
    
    return "";
}

/// PUSH1 opcode - pushes 1 byte onto the stack
pub fn opPush1(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 1);
}

/// PUSH2 opcode - pushes 2 bytes onto the stack
pub fn opPush2(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 2);
}

/// PUSH3 opcode - pushes 3 bytes onto the stack
pub fn opPush3(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 3);
}

/// PUSH4 opcode - pushes 4 bytes onto the stack
pub fn opPush4(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 4);
}

/// PUSH5 opcode - pushes 5 bytes onto the stack
pub fn opPush5(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 5);
}

/// PUSH6 opcode - pushes 6 bytes onto the stack
pub fn opPush6(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 6);
}

/// PUSH7 opcode - pushes 7 bytes onto the stack
pub fn opPush7(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 7);
}

/// PUSH8 opcode - pushes 8 bytes onto the stack
pub fn opPush8(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 8);
}

/// PUSH9 opcode - pushes 9 bytes onto the stack
pub fn opPush9(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 9);
}

/// PUSH10 opcode - pushes 10 bytes onto the stack
pub fn opPush10(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 10);
}

/// PUSH11 opcode - pushes 11 bytes onto the stack
pub fn opPush11(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 11);
}

/// PUSH12 opcode - pushes 12 bytes onto the stack
pub fn opPush12(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 12);
}

/// PUSH13 opcode - pushes 13 bytes onto the stack
pub fn opPush13(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 13);
}

/// PUSH14 opcode - pushes 14 bytes onto the stack
pub fn opPush14(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 14);
}

/// PUSH15 opcode - pushes 15 bytes onto the stack
pub fn opPush15(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 15);
}

/// PUSH16 opcode - pushes 16 bytes onto the stack
pub fn opPush16(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 16);
}

/// PUSH17 opcode - pushes 17 bytes onto the stack
pub fn opPush17(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 17);
}

/// PUSH18 opcode - pushes 18 bytes onto the stack
pub fn opPush18(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 18);
}

/// PUSH19 opcode - pushes 19 bytes onto the stack
pub fn opPush19(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 19);
}

/// PUSH20 opcode - pushes 20 bytes onto the stack
pub fn opPush20(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 20);
}

/// PUSH21 opcode - pushes 21 bytes onto the stack
pub fn opPush21(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 21);
}

/// PUSH22 opcode - pushes 22 bytes onto the stack
pub fn opPush22(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 22);
}

/// PUSH23 opcode - pushes 23 bytes onto the stack
pub fn opPush23(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 23);
}

/// PUSH24 opcode - pushes 24 bytes onto the stack
pub fn opPush24(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 24);
}

/// PUSH25 opcode - pushes 25 bytes onto the stack
pub fn opPush25(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 25);
}

/// PUSH26 opcode - pushes 26 bytes onto the stack
pub fn opPush26(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 26);
}

/// PUSH27 opcode - pushes 27 bytes onto the stack
pub fn opPush27(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 27);
}

/// PUSH28 opcode - pushes 28 bytes onto the stack
pub fn opPush28(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 28);
}

/// PUSH29 opcode - pushes 29 bytes onto the stack
pub fn opPush29(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 29);
}

/// PUSH30 opcode - pushes 30 bytes onto the stack
pub fn opPush30(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 30);
}

/// PUSH31 opcode - pushes 31 bytes onto the stack
pub fn opPush31(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 31);
}

/// PUSH32 opcode - pushes 32 bytes onto the stack
pub fn opPush32(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return pushN(pc, interpreter, frame, 32);
}

/// Register PUSH opcodes in the jump table
pub fn registerPushOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // PUSH0 (0x5F) - Shanghai+
    const push0_op = try allocator.create(Operation);
    push0_op.* = Operation{
        .execute = opPush0,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x5F] = push0_op;
    
    // PUSH1-PUSH32 (0x60-0x7F)
    const push_ops = [_]*const fn(usize, *Interpreter, *Frame) ExecutionError![]const u8{
        opPush1, opPush2, opPush3, opPush4, opPush5, opPush6, opPush7, opPush8,
        opPush9, opPush10, opPush11, opPush12, opPush13, opPush14, opPush15, opPush16,
        opPush17, opPush18, opPush19, opPush20, opPush21, opPush22, opPush23, opPush24,
        opPush25, opPush26, opPush27, opPush28, opPush29, opPush30, opPush31, opPush32,
    };
    
    for (push_ops, 0..) |op, i| {
        const push_op = try allocator.create(Operation);
        push_op.* = Operation{
            .execute = op,
            .constant_gas = jumpTableModule.GasFastestStep,
            .min_stack = jumpTableModule.minStack(0, 1),
            .max_stack = jumpTableModule.maxStack(0, 1),
        };
        jump_table.table[0x60 + i] = push_op;
    }
}
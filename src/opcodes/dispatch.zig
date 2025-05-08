//! Opcode dispatch for ZigEVM
//! This module implements the opcode dispatch mechanism for the EVM

const std = @import("std");
const opcodes = @import("opcodes.zig");
const Opcode = opcodes.Opcode;
const arithmetic = @import("arithmetic.zig");
const bitwise = @import("bitwise.zig");
const memory_ops = @import("memory.zig");
const types = @import("../util/types.zig");
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;
const Error = types.Error;
const U256 = types.U256;
const Address = types.Address;

/// Instruction handler function type
pub const InstructionFn = *const fn(
    *Stack,
    *Memory,
    []const u8, // code
    *usize, // pc
    *u64, // gas_left
    ?*u64, // gas_refund
) Error!void;

/// No-op placeholder for unimplemented instructions
fn unimplementedInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = stack;
    _ = memory;
    _ = code;
    _ = pc;
    _ = gas_left;
    _ = gas_refund;
    return Error.InvalidOpcode;
}

/// Implementation of the STOP opcode
fn stopInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = stack;
    _ = memory;
    _ = code;
    _ = pc;
    _ = gas_left;
    _ = gas_refund;
    return Error.InvalidOpcode; // Special case, will be handled by interpreter
}

/// Implementation of the ADD opcode
fn addInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try arithmetic.add(stack);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the MUL opcode
fn mulInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 5) {
        return Error.OutOfGas;
    }
    gas_left.* -= 5;
    
    // Execute the operation
    try arithmetic.mul(stack);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the SUB opcode
fn subInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try arithmetic.sub(stack);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the DIV opcode
fn divInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 5) {
        return Error.OutOfGas;
    }
    gas_left.* -= 5;
    
    // Execute the operation
    try arithmetic.div(stack);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the AND opcode
fn andInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try bitwise.bitAnd(stack);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the OR opcode
fn orInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try bitwise.bitOr(stack);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the XOR opcode
fn xorInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try bitwise.bitXor(stack);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the NOT opcode
fn notInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try bitwise.bitNot(stack);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the MLOAD opcode
fn mloadInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) { // Base cost
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try memory_ops.mload(stack, memory);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the MSTORE opcode
fn mstoreInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) { // Base cost
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try memory_ops.mstore(stack, memory);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the MSTORE8 opcode
fn mstore8Instruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) { // Base cost
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Execute the operation
    try memory_ops.mstore8(stack, memory);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the MSIZE opcode
fn msizeInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 2) { // Base cost
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Execute the operation
    try memory_ops.msize(stack, memory);
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the PUSH opcode
fn pushInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Get the current opcode
    const op = @as(Opcode, @enumFromInt(code[pc.*]));
    
    // Handle PUSH0 specially
    if (op == Opcode.PUSH0) {
        try stack.push(U256.zero());
        pc.* += 1;
        return;
    }
    
    // Determine bytes to push
    const bytes_to_push = op.pushBytes();
    
    // Check code bounds
    if (pc.* + 1 + bytes_to_push > code.len) {
        // According to EVM spec, if we read out of bounds, we push zeros
        try stack.push(U256.zero());
    } else {
        // Read the immediate bytes
        var value = U256.zero();
        
        // For small pushes (up to 8 bytes), we can optimize by direct u64 conversion
        if (bytes_to_push <= 8) {
            var val: u64 = 0;
            for (0..bytes_to_push) |i| {
                val = (val << 8) | code[pc.* + 1 + i];
            }
            value = U256.fromU64(val);
        } else {
            // For larger pushes, use the full byte array conversion
            var bytes: [32]u8 = [_]u8{0} ** 32;
            for (0..bytes_to_push) |i| {
                bytes[32 - bytes_to_push + i] = code[pc.* + 1 + i];
            }
            value = U256.fromBytes(&bytes) catch U256.zero();
        }
        
        try stack.push(value);
    }
    
    // Advance PC past the opcode and pushed bytes
    pc.* += 1 + bytes_to_push;
}

/// Implementation of the DUP opcode
fn dupInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Get the current opcode
    const op = @as(Opcode, @enumFromInt(code[pc.*]));
    
    // Perform the DUP operation
    try stack.dup(op.dupPosition());
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the SWAP opcode
fn swapInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Get the current opcode
    const op = @as(Opcode, @enumFromInt(code[pc.*]));
    
    // Perform the SWAP operation
    try stack.swap(op.swapPosition());
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the JUMP opcode
fn jumpInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 8) {
        return Error.OutOfGas;
    }
    gas_left.* -= 8;
    
    // Get the jump destination from the stack
    const dest = try stack.pop();
    
    // EVM requires jump destinations to fit in u64
    if (dest.words[1] != 0 or dest.words[2] != 0 or dest.words[3] != 0) {
        return Error.InvalidJump;
    }
    
    // Set the new PC (validator will check if it's a valid JUMPDEST)
    pc.* = @intCast(dest.words[0]);
    
    // The calling interpreter will validate the jump destination
}

/// Implementation of the JUMPI opcode
fn jumpiInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 10) {
        return Error.OutOfGas;
    }
    gas_left.* -= 10;
    
    // Get the condition and jump destination from the stack
    const condition = try stack.pop();
    const dest = try stack.pop();
    
    // Only jump if condition is non-zero
    if (!condition.isZero()) {
        // EVM requires jump destinations to fit in u64
        if (dest.words[1] != 0 or dest.words[2] != 0 or dest.words[3] != 0) {
            return Error.InvalidJump;
        }
        
        // Set the new PC (validator will check if it's a valid JUMPDEST)
        pc.* = @intCast(dest.words[0]);
        
        // The calling interpreter will validate the jump destination
    } else {
        // If condition is zero, just move to the next instruction
        pc.* += 1;
    }
}

/// The dispatch table that maps opcodes to their implementation functions
pub const dispatch_table = blk: {
    var table: [256]InstructionFn = undefined;
    
    // Initialize all entries with the unimplemented placeholder
    for (&table) |*entry| {
        entry.* = unimplementedInstruction;
    }
    
    // Implement specific opcodes
    table[@intFromEnum(Opcode.STOP)] = stopInstruction;
    
    // Arithmetic operations
    table[@intFromEnum(Opcode.ADD)] = addInstruction;
    table[@intFromEnum(Opcode.MUL)] = mulInstruction;
    table[@intFromEnum(Opcode.SUB)] = subInstruction;
    table[@intFromEnum(Opcode.DIV)] = divInstruction;
    
    // Bitwise operations
    table[@intFromEnum(Opcode.AND)] = andInstruction;
    table[@intFromEnum(Opcode.OR)] = orInstruction;
    table[@intFromEnum(Opcode.XOR)] = xorInstruction;
    table[@intFromEnum(Opcode.NOT)] = notInstruction;
    
    // Flow control
    table[@intFromEnum(Opcode.JUMP)] = jumpInstruction;
    table[@intFromEnum(Opcode.JUMPI)] = jumpiInstruction;
    
    // Memory operations
    table[@intFromEnum(Opcode.MLOAD)] = mloadInstruction;
    table[@intFromEnum(Opcode.MSTORE)] = mstoreInstruction;
    table[@intFromEnum(Opcode.MSTORE8)] = mstore8Instruction;
    table[@intFromEnum(Opcode.MSIZE)] = msizeInstruction;
    
    // Handle all PUSH opcodes
    table[@intFromEnum(Opcode.PUSH0)] = pushInstruction;
    for (0..32) |i| {
        const push_op = @intFromEnum(Opcode.PUSH1) + @as(u8, @intCast(i));
        table[push_op] = pushInstruction;
    }
    
    // Handle all DUP opcodes
    for (0..16) |i| {
        const dup_op = @intFromEnum(Opcode.DUP1) + @as(u8, @intCast(i));
        table[dup_op] = dupInstruction;
    }
    
    // Handle all SWAP opcodes
    for (0..16) |i| {
        const swap_op = @intFromEnum(Opcode.SWAP1) + @as(u8, @intCast(i));
        table[swap_op] = swapInstruction;
    }
    
    break :blk table;
};

/// Implementation of the RETURN opcode
fn returnInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 0) {
        return Error.OutOfGas;
    }
    
    // Get memory offset and size
    const offset = try stack.pop();
    const size = try stack.pop();
    
    // Ensure they're u64 sized
    if (offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0 or
        size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Calculate gas cost for memory expansion
    const mem_offset = @intCast(offset.words[0]);
    const mem_size = @intCast(size.words[0]);
    
    // This will expand memory if needed and return the gas cost
    const mem_gas = memory.expand(mem_offset + mem_size);
    if (gas_left.* < mem_gas) {
        return Error.OutOfGas;
    }
    gas_left.* -= mem_gas;
    
    // RETURN is a halting operation, so the interpreter will handle the return data
    // The PC is not updated as the execution will stop
    
    // Will be handled by the interpreter's execute method
    return Error.InvalidOpcode; // Special halt case
}

/// Implementation of the REVERT opcode
fn revertInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = code;
    _ = gas_refund;
    
    // Consume gas
    if (gas_left.* < 0) {
        return Error.OutOfGas;
    }
    
    // Get memory offset and size
    const offset = try stack.pop();
    const size = try stack.pop();
    
    // Ensure they're u64 sized
    if (offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0 or
        size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Calculate gas cost for memory expansion
    const mem_offset = @intCast(offset.words[0]);
    const mem_size = @intCast(size.words[0]);
    
    // This will expand memory if needed and return the gas cost
    const mem_gas = memory.expand(mem_offset + mem_size);
    if (gas_left.* < mem_gas) {
        return Error.OutOfGas;
    }
    gas_left.* -= mem_gas;
    
    // REVERT is a halting operation, so the interpreter will handle the return data
    // The PC is not updated as the execution will stop
    
    // Will be handled by the interpreter's execute method
    return Error.InvalidOpcode; // Special halt case
}

/// Execute a single instruction from the bytecode
pub fn executeInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    if (pc.* >= code.len) {
        return Error.OutOfGas;
    }
    
    const opcode = code[pc.*];
    
    // Special handling for RETURN and REVERT since they're halting operations
    if (opcode == @intFromEnum(Opcode.RETURN)) {
        try returnInstruction(stack, memory, code, pc, gas_left, gas_refund);
        // The interpreter will check the opcode and handle the return data
        return;
    } else if (opcode == @intFromEnum(Opcode.REVERT)) {
        try revertInstruction(stack, memory, code, pc, gas_left, gas_refund);
        // The interpreter will check the opcode and handle the return data
        return;
    }
    
    const handler = dispatch_table[opcode];
    return handler(stack, memory, code, pc, gas_left, gas_refund);
}

// Tests
test "executeInstruction ADD" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    try stack.push(U256.fromU64(3));
    try stack.push(U256.fromU64(4));
    
    const code = [_]u8{@intFromEnum(Opcode.ADD)};
    var pc: usize = 0;
    var gas_left: u64 = 100;
    var gas_refund: u64 = 0;
    
    try executeInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    
    try std.testing.expectEqual(@as(usize, 1), pc);
    try std.testing.expectEqual(@as(u64, 97), gas_left);
    try std.testing.expectEqual(U256.fromU64(7), try stack.pop());
    try std.testing.expect(stack.isEmpty());
}

test "executeInstruction PUSH and JUMP" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // PUSH1 0x05 JUMP
    const code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x05,
        @intFromEnum(Opcode.JUMP),
        0xFF, 0xFF, // Invalid opcodes in the middle
        @intFromEnum(Opcode.JUMPDEST), // Destination at offset 5
        @intFromEnum(Opcode.PUSH1), 0x42,
    };
    
    var pc: usize = 0;
    var gas_left: u64 = 100;
    var gas_refund: u64 = 0;
    
    // Execute PUSH1 0x05
    try executeInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(@as(usize, 2), pc);
    try std.testing.expectEqual(U256.fromU64(5), try stack.peek().*);
    
    // Execute JUMP
    try executeInstruction(&stack, &memory, &code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(@as(usize, 5), pc); // PC should now be at JUMPDEST
    try std.testing.expect(stack.isEmpty());
    
    // Verify JUMPDEST is a no-op (just increments PC)
    // In reality, this would be handled by the interpreter's jump validator
}
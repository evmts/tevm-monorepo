const std = @import("std");
const Opcode = @import("opcode.zig");
const Operation = @import("operation.zig");
const Hardfork = @import("hardfork.zig");
const ExecutionError = @import("execution_error.zig");
// TODO: Add these when files are created
// const Interpreter = @import("interpreter.zig").Interpreter;
// const InterpreterState = @import("InterpreterState.zig").InterpreterState;
const Stack = @import("Stack.zig");
const Memory = @import("memory.zig");

// Constants for gas calculation
pub const GasQuickStep: u64 = 2;
pub const GasFastestStep: u64 = 3;
pub const GasFastStep: u64 = 5;
pub const GasMidStep: u64 = 8;
pub const GasSlowStep: u64 = 10;
pub const GasExtStep: u64 = 20;

// Parameter costs
pub const Keccak256Gas: u64 = 30;
pub const Keccak256WordGas: u64 = 6;
pub const SloadGas: u64 = 50;
pub const SstoreSentryGas: u64 = 2300;
pub const SstoreSetGas: u64 = 20000;
pub const SstoreResetGas: u64 = 5000;
pub const SstoreClearGas: u64 = 5000;
pub const SstoreRefundGas: u64 = 15000;
pub const JumpdestGas: u64 = 1;
pub const LogGas: u64 = 375;
pub const LogDataGas: u64 = 8;
pub const LogTopicGas: u64 = 375;
pub const CreateGas: u64 = 32000;
pub const CallGas: u64 = 40;
pub const CallStipend: u64 = 2300;
pub const CallValueTransferGas: u64 = 9000;
pub const CallNewAccountGas: u64 = 25000;
pub const SelfdestructRefundGas: u64 = 24000;
pub const MemoryGas: u64 = 3;
pub const QuadCoeffDiv: u64 = 512;
pub const CreateDataGas: u64 = 200;
pub const TxGas: u64 = 21000;
pub const TxGasContractCreation: u64 = 53000;
pub const TxDataZeroGas: u64 = 4;
pub const TxDataNonZeroGas: u64 = 16;
pub const CopyGas: u64 = 3;

// Define a default undefined operation
var UNDEFINED = Operation{
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = 0,
    .undefined = true,
};

/// JumpTable contains the EVM opcodes supported at a given fork
const Self = @This();
table: [256]?*const Operation,

pub fn init() Self {
    return Self{
        .table = [_]?*const Operation{null} ** 256,
    };
}

pub fn get_operation(self: *const Self, opcode: u8) *const Operation {
    return self.table[opcode] orelse &Operation.NULL;
}

pub fn validate(self: *Self) void {
        for (0..256) |i| {
            if (self.table[i] == null) {
                // Fill unassigned slots with UNDEFINED
                self.table[i] = &UNDEFINED;
            } else if (self.table[i].?.memory_size != null and self.table[i].?.dynamic_gas == null) {
                @panic("Operation has memory size but no dynamic gas calculation");
            }
        }
    }

// Get a copy of the jump table
pub fn copy(self: *const Self, allocator: std.mem.Allocator) !Self {
    var new_table = Self.init();
    for (0..256) |i| {
        if (self.table[i] != null) {
            const op_copy = try allocator.create(Operation);
            op_copy.* = self.table[i].?.*;
            new_table.table[i] = op_copy;
        }
    }
    return new_table;
}

pub fn init_from_hardfork(allocator: std.mem.Allocator, hardfork: Hardfork) Self {
    var jump_table = Self{};
    _ = hardfork;
    const add_op = allocator.create(Operation);
    add_op.* = Operation{
        .execute = dummy_execute, // TODO: implement opAdd
        .constant_gas = GasFastestStep,
        .min_stack = 2,
        .max_stack = Stack.CAPACITY,
    };
    jump_table.table[0x01] = add_op;

    return jump_table;
}

// Helper function to calculate min/max stack values
pub fn min_stack(min_pop: u32, min_push: u32) u32 {
    _ = min_push; // autofix
    return min_pop;
}

pub fn max_stack(max_pop: u32, max_push: u32) u32 {
    _ = max_pop; // autofix
    return max_push;
}

pub fn min_dup_stack(n: u32) u32 {
    return n;
}

pub fn max_dup_stack(n: u32) u32 {
    return n + 1;
}

pub fn min_swap_stack(n: u32) u32 {
    return n;
}

pub fn max_swap_stack(n: u32) u32 {
    return n;
}

fn undefined_execute(pc: usize, interpreter: anytype, state: anytype) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.INVALID;
}

fn stop_execute(pc: usize, interpreter: anytype, state: anytype) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.STOP;
}

fn dummy_execute(pc: usize, interpreter: anytype, state: anytype) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = state;
    return "";
}

// Create a new frontier instruction set
pub fn new_frontier_instruction_set(allocator: std.mem.Allocator) !Self {
    var jt = Self.init();

    // Setup operation table manually instead of using opcodes structs directly
    const stop_op = try allocator.create(Operation);
    stop_op.* = Operation{
        .execute = stop_execute,
        .constant_gas = 0,
        .min_stack = min_stack(0, 0),
        .max_stack = max_stack(0, 0),
    };
    jt.table[0x00] = stop_op;

    const add_op = try allocator.create(Operation);
    add_op.* = Operation{
        .execute = dummy_execute,
        .constant_gas = GasFastestStep,
        .min_stack = min_stack(2, 1),
        .max_stack = max_stack(2, 1),
    };
    jt.table[0x01] = add_op;

    // Add more operations based on Geth's frontier implementation
    // This would continue for all opcodes...

    jt.validate();
    return jt;
}

// Create test for the Self
test "JumpTable basic operations" {
    const allocator = std.testing.allocator;

    var jt = try new_frontier_instruction_set(allocator);
    defer {
        // Free allocated operations
        for (0..256) |i| {
            if (jt.table[i] != null and !jt.table[i].?.undefined) {
                allocator.destroy(jt.table[i].?);
            }
        }
    }

    // Test a couple of operations
    const stop_op = jt.get_operation(0x00);
    try std.testing.expectEqual(@as(u64, 0), stop_op.constant_gas);

    const add_op = jt.get_operation(0x01);
    try std.testing.expectEqual(@as(u64, GasFastestStep), add_op.constant_gas);

    // Test an undefined operation
    const undef_op = jt.get_operation(0xFF);
    try std.testing.expect(undef_op.undefined);
}

// Create a very basic test for JumpTable that doesn't depend on external implementation details
test "JumpTable initialization and validation" {
    const jt = Self.init();
    try std.testing.expectEqual(@as(usize, 256), jt.table.len);

    // Check that all entries are initially null
    for (jt.table) |entry| {
        try std.testing.expectEqual(true, entry == null);
    }

    // Validate should fill all nulls with UNDEFINED
    var mutable_jt = jt;
    mutable_jt.validate();

    // Now check that all entries have been filled
    for (mutable_jt.table) |entry| {
        try std.testing.expectEqual(false, entry == null);
        try std.testing.expectEqual(true, entry.?.undefined);
    }
}

test "JumpTable stack calculation helpers" {
    try std.testing.expectEqual(@as(u32, 2), min_stack(2, 1));
    try std.testing.expectEqual(@as(u32, 1), max_stack(2, 1));

    try std.testing.expectEqual(@as(u32, 3), min_dup_stack(3));
    try std.testing.expectEqual(@as(u32, 4), max_dup_stack(3));

    try std.testing.expectEqual(@as(u32, 4), min_swap_stack(4));
    try std.testing.expectEqual(@as(u32, 4), max_swap_stack(4));
}

test "JumpTable gas constants" {
    try std.testing.expectEqual(@as(u64, 2), GasQuickStep);
    try std.testing.expectEqual(@as(u64, 3), GasFastestStep);
    try std.testing.expectEqual(@as(u64, 5), GasFastStep);
    try std.testing.expectEqual(@as(u64, 8), GasMidStep);
    try std.testing.expectEqual(@as(u64, 10), GasSlowStep);
    try std.testing.expectEqual(@as(u64, 20), GasExtStep);

    try std.testing.expectEqual(@as(u64, 30), Keccak256Gas);
    try std.testing.expectEqual(@as(u64, 375), LogGas);
    try std.testing.expectEqual(@as(u64, 32000), CreateGas);
}

const std = @import("std");
const opcodes = @import("opcodes.zig");
const Interpreter = @import("interpreter.zig").Interpreter;
const Frame = @import("Frame.zig").Frame;
const ExecutionError = @import("Frame.zig").ExecutionError;
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;

/// ExecutionFunc is a function executed by the EVM during interpretation
pub const ExecutionFunc = *const fn (pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8;

/// GasFunc calculates the gas required for an operation
pub const GasFunc = *const fn (interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

/// MemorySizeFunc calculates the memory size required for an operation
pub const MemorySizeFunc = *const fn (stack: *Stack) struct { size: u64, overflow: bool };

/// Operation represents an opcode in the EVM
pub const Operation = struct {
    // Execute is the operation function
    execute: ExecutionFunc,
    // ConstantGas is the base gas required for the operation
    constant_gas: u64,
    // DynamicGas calculates the dynamic portion of gas for the operation
    dynamic_gas: ?GasFunc = null,
    // MinStack tells how many stack items are required
    min_stack: u32,
    // MaxStack specifies the max length the stack can have for this operation
    // to not overflow the stack
    max_stack: u32,
    // Memory size returns the memory size required for the operation
    memory_size: ?MemorySizeFunc = null,
    // Undefined denotes if the instruction is not officially defined in the jump table
    undefined: bool = false,
};

/// JumpTable contains the EVM opcodes supported at a given fork
pub const JumpTable = struct {
    table: [256]?*const Operation,

    pub fn init() JumpTable {
        return JumpTable{
            .table = [_]?*const Operation{null} ** 256,
        };
    }

    pub fn getOperation(self: *const JumpTable, opcode: u8) *const Operation {
        return self.table[opcode] orelse &UNDEFINED;
    }

    pub fn validate(self: *JumpTable) void {
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
    pub fn copy(self: *const JumpTable, allocator: std.mem.Allocator) !JumpTable {
        var new_table = JumpTable.init();
        for (0..256) |i| {
            if (self.table[i] != null) {
                const op_copy = try allocator.create(Operation);
                op_copy.* = self.table[i].?.*;
                new_table.table[i] = op_copy;
            }
        }
        return new_table;
    }
};

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

// Helper function to calculate min/max stack values
pub fn minStack(min_pop: u32, min_push: u32) u32 {
    _ = min_push; // autofix
    return min_pop;
}

pub fn maxStack(max_pop: u32, max_push: u32) u32 {
    _ = max_pop; // autofix
    return max_push;
}

pub fn minDupStack(n: u32) u32 {
    return n;
}

pub fn maxDupStack(n: u32) u32 {
    return n + 1;
}

pub fn minSwapStack(n: u32) u32 {
    return n;
}

pub fn maxSwapStack(n: u32) u32 {
    return n;
}

// Define a default undefined operation
var UNDEFINED = Operation{
    .execute = undefinedExecute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = 0,
    .undefined = true,
};

fn undefinedExecute(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = frame;
    return ExecutionError.INVALID;
}

fn stopExecute(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = frame;
    return ExecutionError.STOP;
}

fn dummyExecute(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = frame;
    return "";
}

// Create a new frontier instruction set
pub fn newFrontierInstructionSet(allocator: std.mem.Allocator) !JumpTable {
    var jt = JumpTable.init();

    // Setup operation table manually instead of using opcodes structs directly
    const stop_op = try allocator.create(Operation);
    stop_op.* = Operation{
        .execute = stopExecute,
        .constant_gas = 0,
        .min_stack = minStack(0, 0),
        .max_stack = maxStack(0, 0),
    };
    jt.table[0x00] = stop_op;

    const add_op = try allocator.create(Operation);
    add_op.* = Operation{
        .execute = dummyExecute,
        .constant_gas = GasFastestStep,
        .min_stack = minStack(2, 1),
        .max_stack = maxStack(2, 1),
    };
    jt.table[0x01] = add_op;

    // Add more operations based on Geth's frontier implementation
    // This would continue for all opcodes...

    jt.validate();
    return jt;
}

// Create test for the JumpTable
test "JumpTable basic operations" {
    const allocator = std.testing.allocator;

    var jt = try newFrontierInstructionSet(allocator);
    defer {
        // Free allocated operations
        for (0..256) |i| {
            if (jt.table[i] != null and !jt.table[i].?.undefined) {
                allocator.destroy(jt.table[i].?);
            }
        }
    }

    // Test a couple of operations
    const stop_op = jt.getOperation(0x00);
    try std.testing.expectEqual(@as(u64, 0), stop_op.constant_gas);

    const add_op = jt.getOperation(0x01);
    try std.testing.expectEqual(@as(u64, GasFastestStep), add_op.constant_gas);

    // Test an undefined operation
    const undef_op = jt.getOperation(0xFF);
    try std.testing.expect(undef_op.undefined);
}

// Create a very basic test for JumpTable that doesn't depend on external implementation details
test "JumpTable initialization and validation" {
    const jt = JumpTable.init();
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
    try std.testing.expectEqual(@as(u32, 2), minStack(2, 1));
    try std.testing.expectEqual(@as(u32, 1), maxStack(2, 1));

    try std.testing.expectEqual(@as(u32, 3), minDupStack(3));
    try std.testing.expectEqual(@as(u32, 4), maxDupStack(3));

    try std.testing.expectEqual(@as(u32, 4), minSwapStack(4));
    try std.testing.expectEqual(@as(u32, 4), maxSwapStack(4));
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
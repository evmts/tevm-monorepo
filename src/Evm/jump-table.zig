

fn build_jump_table(spec: Spec) [256]JumpTable {
    var table: [256]JumpTable = undefined;

    for (&table) |*entry| {
        entry.* = .{
            .execute_fn = invalid_opcode,
            .gas = 0,
            .min_stack = 0,
            .stack_growth = 0,
        };
    }

    table[0x00] = .{ .execute_fn = stop, .gas = 0, .min_stack = 0, .stack_growth = 0 };
    table[0x01] = .{ .execute_fn = add, .gas = 3, .min_stack = 2, .stack_growth = -1 };
    // ...TODO

    // Apply EIP-specific changes based on spec
    if (spec.istanbul_enabled) {
        table[0x54].gas = 800; // SLOAD gas cost increase in Istanbul
    }

    return table;
}

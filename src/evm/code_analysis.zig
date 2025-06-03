const std = @import("std");
const bitvec = @import("bitvec.zig");

/// Advanced code analysis for optimization
const Self = @This();

/// Bit vector marking code vs data bytes
code_segments: bitvec,
/// Sorted array of JUMPDEST positions for binary search
jumpdest_positions: []const u32,
/// Pre-computed gas costs per basic block
block_gas_costs: ?[]const u32,
/// Maximum stack depth required
max_stack_depth: u16,
/// Whether code contains certain opcodes
has_dynamic_jumps: bool,
has_static_jumps: bool,
has_selfdestruct: bool,
has_create: bool,

/// Clean up analysis resources
pub fn deinit(self: *Self, allocator: std.mem.Allocator) void {
    self.code_segments.deinit(allocator);
    if (self.jumpdest_positions.len > 0) {
        allocator.free(self.jumpdest_positions);
    }
    if (self.block_gas_costs) |costs| {
        allocator.free(costs);
    }
}
const std = @import("std");
const bitvec = @import("bitvec.zig");

/// Advanced code analysis for EVM bytecode optimization.
///
/// This structure holds pre-computed analysis results for a contract's bytecode,
/// enabling efficient execution by pre-identifying jump destinations, code segments,
/// and other properties that would otherwise need to be computed at runtime.
///
/// The analysis is performed once when a contract is first loaded and cached for
/// subsequent executions, significantly improving performance for frequently-used
/// contracts.
///
/// ## Fields
/// - `code_segments`: Bit vector marking which bytes are executable code vs data
/// - `jumpdest_positions`: Sorted array of valid JUMPDEST positions for O(log n) validation
/// - `block_gas_costs`: Optional pre-computed gas costs for basic blocks
/// - `max_stack_depth`: Maximum stack depth required by the contract
/// - `has_dynamic_jumps`: Whether the code contains JUMP/JUMPI with dynamic targets
/// - `has_static_jumps`: Whether the code contains JUMP/JUMPI with static targets
/// - `has_selfdestruct`: Whether the code contains SELFDESTRUCT opcode
/// - `has_create`: Whether the code contains CREATE/CREATE2 opcodes
///
/// ## Performance
/// - Jump destination validation: O(log n) using binary search
/// - Code segment checking: O(1) using bit vector
/// - Enables dead code elimination and other optimizations
///
/// ## Memory Management
/// The analysis owns its allocated memory and must be properly cleaned up
/// using the `deinit` method to prevent memory leaks.
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
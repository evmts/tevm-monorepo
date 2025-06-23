const std = @import("std");
const Address = @import("Address");
const Vm = @import("../vm.zig");

pub const EmitLogError = std.mem.Allocator.Error;

/// Emit an event log (LOG0-LOG4 opcodes).
/// Records an event that will be included in the transaction receipt.
pub fn emit_log(self: *Vm, address: Address.Address, topics: []const u256, data: []const u8) EmitLogError!void {
    try self.state.emit_log(address, topics, data);
}
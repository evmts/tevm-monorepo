const Address = @import("Address");
const Vm = @import("../vm.zig");
const ValidateStaticContextError = @import("validate_static_context.zig").ValidateStaticContextError;
const EmitLogError = @import("emit_log.zig").EmitLogError;

pub const EmitLogProtectedError = ValidateStaticContextError || EmitLogError;

/// Emit a log with static context protection.
/// Prevents log emission during static calls as logs modify the transaction state.
pub fn emit_log_protected(self: *Vm, address: Address.Address, topics: []const u256, data: []const u8) EmitLogProtectedError!void {
    try self.validate_static_context();
    try self.emit_log(address, topics, data);
}
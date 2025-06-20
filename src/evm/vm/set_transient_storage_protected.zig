const std = @import("std");
const Address = @import("Address");
const Vm = @import("../vm.zig");
const ValidateStaticContextError = @import("validate_static_context.zig").ValidateStaticContextError;

pub const SetTransientStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a transient storage value with static context protection.
/// Transient storage (EIP-1153) is cleared at the end of each transaction.
pub fn set_transient_storage_protected(self: *Vm, address: Address.Address, slot: u256, value: u256) SetTransientStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_transient_storage(address, slot, value);
}
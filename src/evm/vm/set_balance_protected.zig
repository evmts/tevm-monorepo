const std = @import("std");
const Address = @import("Address");
const Vm = @import("../vm.zig");
const ValidateStaticContextError = @import("validate_static_context.zig").ValidateStaticContextError;

pub const SetBalanceProtectedError = ValidateStaticContextError || std.mem.Allocator.Error || @import("../state/database_interface.zig").DatabaseError;

/// Set an account balance with static context protection.
/// Prevents balance modifications during static calls.
pub fn set_balance_protected(self: *Vm, address: Address.Address, balance: u256) SetBalanceProtectedError!void {
    try self.validate_static_context();
    try self.state.set_balance(address, balance);
}
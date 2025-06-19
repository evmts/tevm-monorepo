const Vm = @import("../vm.zig");

pub const ValidateValueTransferError = error{WriteProtection};

/// Validate that value transfer is allowed in the current context.
/// Static calls cannot transfer value (msg.value must be 0).
pub fn validate_value_transfer(self: *const Vm, value: u256) ValidateValueTransferError!void {
    if (self.read_only and value != 0) return error.WriteProtection;
}
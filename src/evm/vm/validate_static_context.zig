const Vm = @import("../vm.zig");

pub const ValidateStaticContextError = error{WriteProtection};

/// Validate that state modifications are allowed in the current context.
/// Returns WriteProtection error if called within a static (read-only) context.
pub fn validate_static_context(self: *const Vm) ValidateStaticContextError!void {
    if (self.read_only) return error.WriteProtection;
}
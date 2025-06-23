const std = @import("std");
const Vm = @import("../vm.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const Address = @import("Address");

/// Error type for set_storage_protected operation
pub const SetStorageProtectedError = ExecutionError.Error;

/// Set storage value with static context protection.
/// In static context (read-only mode), storage modifications are not allowed.
///
/// @param self The VM instance
/// @param address The address of the contract whose storage to modify
/// @param slot The storage slot to write to
/// @param value The value to store
/// @return SetStorageProtectedError if in static context, otherwise void
///
/// Example:
/// ```zig
/// // In normal context
/// vm.read_only = false;
/// try vm.set_storage_protected(address, slot, value); // Succeeds
///
/// // In static context
/// vm.read_only = true;
/// const result = vm.set_storage_protected(address, slot, value); // Returns error.WriteProtection
/// ```
pub fn set_storage_protected(self: *Vm, address: Address.Address, slot: u256, value: u256) SetStorageProtectedError!void {
    if (self.read_only) {
        return ExecutionError.Error.WriteProtection;
    }
    
    try self.state.set_storage(address, slot, value);
}
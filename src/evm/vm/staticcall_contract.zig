const std = @import("std");
const Address = @import("Address");
const CallResult = @import("call_result.zig").CallResult;
const Log = @import("../log.zig");
const Vm = @import("../vm.zig");

pub const StaticcallContractError = std.mem.Allocator.Error;

/// Execute a STATICCALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target contract in guaranteed read-only mode.
pub fn staticcall_contract(self: *Vm, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) StaticcallContractError!CallResult {
    _ = self;
    Log.debug("VM.staticcall_contract: STATICCALL from {any} to {any}, gas={}", .{ caller, to, gas });
    
    // STATICCALL not implemented yet
    Log.debug("VM.staticcall_contract: STATICCALL not implemented yet", .{});
    _ = input;
    
    return CallResult{ .success = false, .gas_left = gas, .output = null };
}
const std = @import("std");
const Address = @import("Address");
const CallResult = @import("call_result.zig").CallResult;
const Log = @import("../log.zig");
const Vm = @import("../vm.zig");

pub const DelegatecallContractError = std.mem.Allocator.Error;

/// Execute a DELEGATECALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code with current caller and value context preserved.
pub fn delegatecall_contract(self: *Vm, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) DelegatecallContractError!CallResult {
    _ = self;
    Log.debug("VM.delegatecall_contract: DELEGATECALL from {any} to {any}, gas={}, static={}", .{ current, code_address, gas, is_static });
    
    // DELEGATECALL not implemented yet
    Log.debug("VM.delegatecall_contract: DELEGATECALL not implemented yet", .{});
    _ = input;
    
    return CallResult{ .success = false, .gas_left = gas, .output = null };
}
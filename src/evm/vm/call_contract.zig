const std = @import("std");
const Address = @import("Address");
const CallResult = @import("call_result.zig").CallResult;
const precompiles = @import("../precompiles/precompiles.zig");
const Log = @import("../log.zig");
const Vm = @import("../vm.zig");

pub const CallContractError = std.mem.Allocator.Error;

/// Execute a CALL operation to another contract or precompile.
///
/// This method handles both regular contract calls and precompile calls.
/// For precompiles, it routes to the appropriate precompile implementation.
/// For regular contracts, it currently returns failure (TODO: implement contract execution).
///
/// @param caller The address initiating the call
/// @param to The address being called (may be a precompile)
/// @param value The amount of ETH being transferred (must be 0 for static calls)
/// @param input Input data for the call
/// @param gas Gas limit available for the call
/// @param is_static Whether this is a static call (no state changes allowed)
/// @return CallResult indicating success/failure and return data
pub fn call_contract(self: *Vm, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    @branchHint(.likely);
    
    Log.debug("VM.call_contract: Call from {any} to {any}, gas={}, static={}", .{ caller, to, gas, is_static });
    
    // Check if this is a precompile call
    if (precompiles.is_precompile(to)) {
        Log.debug("VM.call_contract: Detected precompile call to {any}", .{to});
        return self.execute_precompile_call(to, input, gas, is_static);
    }
    
    // Regular contract call - currently not implemented
    // TODO: Implement value transfer, gas calculation, recursive execution, and return data handling
    Log.debug("VM.call_contract: Regular contract call not implemented yet", .{});
    _ = value;
    
    return CallResult{ .success = false, .gas_left = gas, .output = null };
}
const std = @import("std");
const Address = @import("Address");
const CallResult = @import("call_result.zig").CallResult;
const precompiles = @import("../precompiles/precompiles.zig");
const Log = @import("../log.zig");
const Vm = @import("../vm.zig");

const CallContractError = std.mem.Allocator.Error;

/// Execute a precompile call
///
/// This method handles the execution of precompiled contracts. It performs
/// the following steps:
/// 1. Check if the precompile is available in the current hardfork
/// 2. Validate that value transfers are zero (precompiles don't accept ETH)
/// 3. Estimate output buffer size and allocate memory
/// 4. Execute the precompile
/// 5. Handle success/failure and return appropriate CallResult
///
/// @param address The precompile address
/// @param input Input data for the precompile
/// @param gas Gas limit available for execution
/// @param is_static Whether this is a static call (doesn't affect precompiles)
/// @return CallResult with success/failure, gas usage, and output data
pub fn execute_precompile_call(self: *Vm, address: Address.Address, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    _ = is_static; // Precompiles are inherently stateless, so static flag doesn't matter
    
    Log.debug("VM.execute_precompile_call: Executing precompile at {any}, input_size={}, gas={}", .{ address, input.len, gas });
    
    // Get current chain rules
    const chain_rules = self.chain_rules;
    
    // Check if this precompile is available with current chain rules
    if (!precompiles.is_available(address, chain_rules)) {
        Log.debug("VM.execute_precompile_call: Precompile not available with current chain rules", .{});
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    }
    
    // Estimate required output buffer size
    const output_size = precompiles.get_output_size(address, input.len, chain_rules) catch |err| {
        Log.debug("VM.execute_precompile_call: Failed to get output size: {}", .{err});
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    };
    
    // Allocate output buffer
    const output_buffer = self.allocator.alloc(u8, output_size) catch |err| {
        Log.debug("VM.execute_precompile_call: Failed to allocate output buffer: {}", .{err});
        return error.OutOfMemory;
    };
    
    // Execute the precompile
    const result = precompiles.execute_precompile(address, input, output_buffer, gas, chain_rules);
    
    if (result.is_success()) {
        const gas_used = result.get_gas_used();
        const actual_output_size = result.get_output_size();
        
        Log.debug("VM.execute_precompile_call: Precompile succeeded, gas_used={}, output_size={}", .{ gas_used, actual_output_size });
        
        // Resize buffer to actual output size if needed
        if (actual_output_size < output_size) {
            const resized_output = self.allocator.realloc(output_buffer, actual_output_size) catch output_buffer;
            return CallResult{ 
                .success = true, 
                .gas_left = gas - gas_used, 
                .output = resized_output[0..actual_output_size] 
            };
        }
        
        return CallResult{ 
            .success = true, 
            .gas_left = gas - gas_used, 
            .output = output_buffer[0..actual_output_size] 
        };
    } else {
        // Free the allocated buffer on failure
        self.allocator.free(output_buffer);
        
        if (result.get_error()) |err| {
            Log.debug("VM.execute_precompile_call: Precompile failed with error: {any}", .{err});
        }
        
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    }
}
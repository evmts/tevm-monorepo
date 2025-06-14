const std = @import("std");
const precompiles = @import("precompiles_wasm.zig");

/// WASM allocator - using page allocator for WASM environment
var wasm_allocator: std.mem.Allocator = undefined;
var wasm_allocator_initialized: bool = false;

/// Global precompiles instance for WASM
var global_precompiles: ?precompiles.Precompiles = null;

/// Error codes matching the Rust implementation for consistency
const PrecompileErrorCode = enum(c_int) {
    Success = 0,
    OutOfGas = 1,
    OutOfMemory = 2,
    InvalidInput = 3,
    InvalidAddress = 4,
    UnsupportedPrecompile = 5,
    Other = 99,
};

/// C-compatible result structure
const CPrecompileResult = extern struct {
    success: bool,
    error_code: PrecompileErrorCode,
    output: ?[*]u8,
    output_len: usize,
    gas_used: u64,
};

/// Initialize the WASM precompiles environment
export fn wasm_precompiles_init() bool {
    if (wasm_allocator_initialized) return true;
    
    wasm_allocator = std.heap.page_allocator;
    wasm_allocator_initialized = true;
    
    global_precompiles = precompiles.Precompiles.create(wasm_allocator);
    return true;
}

/// Clean up the WASM precompiles environment
export fn wasm_precompiles_deinit() void {
    if (global_precompiles) |*precomp| {
        precomp.deinit();
        global_precompiles = null;
    }
    wasm_allocator_initialized = false;
}

/// Check if a precompile exists at the given address
export fn wasm_precompiles_contains(address_ptr: [*]const u8) bool {
    if (!wasm_allocator_initialized) return false;
    if (global_precompiles == null) return false;
    
    // Convert pointer to address array
    var address: [20]u8 = undefined;
    @memcpy(&address, address_ptr[0..20]);
    
    return global_precompiles.?.contains(address);
}

/// Execute a precompiled contract
export fn wasm_precompiles_run(
    address_ptr: [*]const u8,
    input_ptr: ?[*]const u8,
    input_len: usize,
    gas_limit: u64,
) CPrecompileResult {
    // Initialize with error result
    var result = CPrecompileResult{
        .success = false,
        .error_code = .Other,
        .output = null,
        .output_len = 0,
        .gas_used = 0,
    };
    
    if (!wasm_allocator_initialized or global_precompiles == null) {
        result.error_code = .Other;
        return result;
    }
    
    // Convert address pointer to array
    var address: [20]u8 = undefined;
    @memcpy(&address, address_ptr[0..20]);
    
    // Handle input data
    const input_slice = if (input_ptr == null or input_len == 0) 
        &[_]u8{} 
    else 
        input_ptr.?[0..input_len];
    
    // Execute precompile
    const exec_result = global_precompiles.?.run(address, input_slice, gas_limit) catch |err| {
        result.error_code = switch (err) {
            error.OutOfMemory => .OutOfMemory,
            error.InvalidInput => .InvalidInput,
            error.InvalidAddress => .InvalidAddress,
            error.UnsupportedPrecompile => .UnsupportedPrecompile,
            error.InsufficientGas => .OutOfGas,
        };
        result.gas_used = gas_limit; // Consume all gas on error
        return result;
    };
    
    // Success case
    result.success = true;
    result.error_code = .Success;
    result.gas_used = exec_result.gas_used;
    result.output = exec_result.output.ptr;
    result.output_len = exec_result.output.len;
    
    return result;
}

/// Free result memory (important for WASM memory management)
export fn wasm_precompiles_free_result(result_ptr: *CPrecompileResult) void {
    if (!wasm_allocator_initialized) return;
    
    if (result_ptr.output != null and result_ptr.output_len > 0) {
        const output_slice = result_ptr.output.?[0..result_ptr.output_len];
        wasm_allocator.free(output_slice);
        result_ptr.output = null;
        result_ptr.output_len = 0;
    }
}

/// Get address for a precompile type
export fn wasm_precompiles_get_address(precompile_type: u32, address_out: [*]u8) bool {
    const precompile_enum = switch (precompile_type) {
        2 => precompiles.PrecompileType.sha256,
        4 => precompiles.PrecompileType.identity,
        else => return false,
    };
    
    const address = precompiles.Precompiles.get_address(precompile_enum) catch return false;
    @memcpy(address_out[0..20], &address);
    return true;
}

/// Get gas cost for a precompile operation (estimation)
export fn wasm_precompiles_gas_cost(
    address_ptr: [*]const u8,
    input_ptr: ?[*]const u8,
    input_len: usize,
) u64 {
    // Convert address
    var address: [20]u8 = undefined;
    @memcpy(&address, address_ptr[0..20]);
    
    const precompile_type = precompiles.PrecompileType.fromAddress(address) orelse return std.math.maxInt(u64);
    
    // Handle input
    const input_slice = if (input_ptr == null or input_len == 0) 
        &[_]u8{} 
    else 
        input_ptr.?[0..input_len];
    
    return switch (precompile_type) {
        .sha256 => @import("sha256.zig").gasCost(input_slice),
        .identity => @import("identity.zig").gasCost(input_slice),
    };
}

/// Get version information
export fn wasm_precompiles_version() [*:0]const u8 {
    return "tevm-precompiles-wasm-1.0.0";
}

/// Get supported precompiles count
export fn wasm_precompiles_count() u32 {
    return 2; // SHA256 and IDENTITY only in WASM
}

/// Check if specific precompile is supported
export fn wasm_precompiles_is_supported(precompile_type: u32) bool {
    return precompile_type == 2 or precompile_type == 4; // SHA256 or IDENTITY
}

// Helper exports for debugging in WASM environment
export fn wasm_precompiles_debug_allocator_status() bool {
    return wasm_allocator_initialized;
}

export fn wasm_precompiles_debug_instance_status() bool {
    return global_precompiles != null;
}

comptime {
    // Ensure all exports are properly linked
    _ = wasm_precompiles_init;
    _ = wasm_precompiles_deinit;
    _ = wasm_precompiles_contains;
    _ = wasm_precompiles_run;
    _ = wasm_precompiles_free_result;
    _ = wasm_precompiles_get_address;
    _ = wasm_precompiles_gas_cost;
    _ = wasm_precompiles_version;
    _ = wasm_precompiles_count;
    _ = wasm_precompiles_is_supported;
    _ = wasm_precompiles_debug_allocator_status;
    _ = wasm_precompiles_debug_instance_status;
}
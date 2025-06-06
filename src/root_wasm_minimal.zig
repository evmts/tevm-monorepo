const std = @import("std");

// Export stub for __zig_probe_stack to satisfy linker
export fn __zig_probe_stack() callconv(.C) void {}

// Simple test exports to verify WASM build works
export fn add(a: u32, b: u32) u32 {
    return a + b;
}

export fn getVersion() u32 {
    return 100; // v1.0.0
}

// Memory allocation for WASM
export fn alloc(len: usize) ?[*]u8 {
    const allocator = std.heap.wasm_allocator;
    const slice = allocator.alloc(u8, len) catch return null;
    return slice.ptr;
}

export fn free(ptr: [*]u8, len: usize) void {
    const allocator = std.heap.wasm_allocator;
    const slice = ptr[0..len];
    allocator.free(slice);
}

// Minimal EVM-like call that just returns success
export fn evmCall(
    input_ptr: [*]const u8,
    input_len: usize,
    output_ptr: [*]u8,
    output_max_len: usize,
) i32 {
    _ = input_ptr;
    _ = input_len;
    
    // Just write a simple success response
    if (output_max_len >= 8) {
        // Write length 0
        @memset(output_ptr[0..8], 0);
        return 0; // Success
    }
    
    return -1; // Buffer too small
}
const std = @import("std");

// Export stub for __zig_probe_stack to satisfy linker when linking with Rust
export fn __zig_probe_stack() callconv(.C) void {
    // This is a no-op stub. Stack checking is disabled in build.zig
}

// Use WASM allocator for memory management
var gpa = std.heap.wasm_allocator;

// Memory allocation functions for WASM
export fn alloc(len: usize) ?[*]u8 {
    const slice = gpa.alloc(u8, len) catch return null;
    return slice.ptr;
}

export fn free(ptr: [*]u8, len: usize) void {
    const slice = ptr[0..len];
    gpa.free(slice);
}

// Get the minimum required WASM build size info
export fn getVersion() u32 {
    return 101; // Version 1.0.1 - enhanced with basic EVM interpreter
}

// Simple add function for testing
export fn add(a: i32, b: i32) i32 {
    return a + b;
}

// Basic EVM call that interprets simple bytecode
export fn evmCall(
    input_ptr: [*]const u8,
    input_len: usize,
    output_ptr: [*]u8,
    output_max_len: usize,
) i32 {
    if (output_max_len < 8) {
        return -1; // Buffer too small
    }

    // Initialize output length to 0
    @memset(output_ptr[0..8], 0);

    // If no bytecode, return success with empty output
    if (input_len == 0) {
        return 0;
    }

    const bytecode = input_ptr[0..input_len];

    // Simple interpreter for basic opcodes
    var stack: [8]u32 = undefined;
    var stack_size: usize = 0;
    var pc: usize = 0;
    var memory: [256]u8 = undefined; // Simple memory for MSTORE/MLOAD
    @memset(&memory, 0);

    while (pc < bytecode.len) {
        const opcode = bytecode[pc];
        pc += 1;

        switch (opcode) {
            // PUSH1 (0x60)
            0x60 => {
                if (pc >= bytecode.len or stack_size >= stack.len) {
                    return -2; // Invalid bytecode or stack overflow
                }
                stack[stack_size] = bytecode[pc];
                stack_size += 1;
                pc += 1;
            },
            // ADD (0x01)
            0x01 => {
                if (stack_size < 2) {
                    return -2; // Stack underflow
                }
                const b = stack[stack_size - 1];
                const a = stack[stack_size - 2];
                stack[stack_size - 2] = a + b;
                stack_size -= 1;
            },
            // SUB (0x03)
            0x03 => {
                if (stack_size < 2) {
                    return -2; // Stack underflow
                }
                const b = stack[stack_size - 1];
                const a = stack[stack_size - 2];
                stack[stack_size - 2] = a - b;
                stack_size -= 1;
            },
            // MUL (0x02)
            0x02 => {
                if (stack_size < 2) {
                    return -2; // Stack underflow
                }
                const b = stack[stack_size - 1];
                const a = stack[stack_size - 2];
                stack[stack_size - 2] = a * b;
                stack_size -= 1;
            },
            // MSTORE (0x52) - simplified version
            0x52 => {
                if (stack_size < 2) {
                    return -2; // Stack underflow
                }
                const offset = stack[stack_size - 2];
                const value = stack[stack_size - 1];
                stack_size -= 2;
                
                // Store 32-byte value in memory (we only store the low 4 bytes for simplicity)
                if (offset < memory.len - 4) {
                    memory[offset] = @intCast((value >> 24) & 0xFF);
                    memory[offset + 1] = @intCast((value >> 16) & 0xFF);
                    memory[offset + 2] = @intCast((value >> 8) & 0xFF);
                    memory[offset + 3] = @intCast(value & 0xFF);
                }
            },
            // RETURN (0xf3)
            0xf3 => {
                if (stack_size < 2) {
                    return -2; // Stack underflow
                }
                // Stack order: [bottom] ... offset size [top]
                const size_u32 = stack[stack_size - 1];    // top of stack
                const offset_u32 = stack[stack_size - 2];  // second from top
                
                // Convert to usize for memory operations
                const size: usize = @intCast(size_u32);
                const offset: usize = @intCast(offset_u32);
                
                // Validate memory bounds  
                if (offset >= memory.len) {
                    return -2; // Memory out of bounds
                }
                
                // Clamp size to available memory
                const available_memory = memory.len - offset;
                const clamped_size = @min(size, available_memory);
                
                // Limit size to what we can output
                const actual_size = @min(clamped_size, output_max_len - 8);
                const total_size = 8 + actual_size;
                
                if (total_size > output_max_len) {
                    return -3; // Output too large
                }
                
                // Write output length  
                const output_len_u64: u64 = @intCast(actual_size);
                const output_len_bytes = std.mem.asBytes(&output_len_u64);
                @memcpy(output_ptr[0..8], output_len_bytes);
                
                // Write output data from memory
                if (actual_size > 0) {
                    @memcpy(output_ptr[8..8 + actual_size], memory[offset..offset + actual_size]);
                }
                
                return 0; // Success
            },
            // STOP (0x00)
            0x00 => {
                return 0; // Success with empty output
            },
            else => {
                // Unknown opcode - ignore for now
            }
        }
    }

    // Execution ended without explicit return
    return 0;
}
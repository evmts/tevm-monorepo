const std = @import("std");
<<<<<<< HEAD
const evm = @import("evm");
const Address = @import("address");
=======
const evm = @import("evm_wasm.zig");
const Address = @import("Address");
const Vm = evm.Vm;
const Contract = evm.Contract;
>>>>>>> 85879379a (✨ feat: implement minimal working WASM EVM interface)

// Export stub for __zig_probe_stack to satisfy linker when linking with Rust
export fn __zig_probe_stack() callconv(.C) void {
    // This is a no-op stub. Stack checking is disabled in build.zig
}

// Use WASM allocator for memory management
var gpa = std.heap.wasm_allocator;

// Global VM instance
var global_vm: ?*Vm = null;

// Memory allocation functions for WASM
export fn alloc(len: usize) ?[*]u8 {
    const slice = gpa.alloc(u8, len) catch return null;
    return slice.ptr;
}

export fn free(ptr: [*]u8, len: usize) void {
    const slice = ptr[0..len];
    gpa.free(slice);
}

// Initialize the EVM
export fn evmInit() i32 {
    if (global_vm != null) return -1; // Already initialized

    // Initialize VM with default jump table and chain rules
    const vm = Vm.init(gpa, null, null) catch return -2;
    global_vm = gpa.create(Vm) catch return -3;
    global_vm.?.* = vm;

    return 0;
}

// Deinitialize the EVM
export fn evmDeinit() void {
    if (global_vm) |vm| {
        vm.deinit();
        gpa.destroy(vm);
        global_vm = null;
    }
}

// Simple call function that executes bytecode and returns result
// Returns: 0 on success, negative on error
// Output format: first 8 bytes = output length, followed by output data
export fn evmCall(
    bytecode_ptr: [*]const u8,
    bytecode_len: usize,
    gas_limit: u64,
    output_ptr: [*]u8,
    output_max_len: usize,
) i32 {
    const vm = global_vm orelse return -1;

    const bytecode = bytecode_ptr[0..bytecode_len];

    // Calculate code hash for the bytecode
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    // Create a contract to execute the bytecode
    var contract = Contract.init_at_address(
        Address.zero(), // caller
        Address.zero(), // contract address
        0, // value
        gas_limit, // gas
        bytecode, // bytecode
        &[_]u8{}, // input
        false, // is_static
    );
    defer contract.deinit(gpa, null);

    // Execute the bytecode using the VM
    const result = vm.interpret(&contract, &[_]u8{}) catch {
        return -2;
    };

    // Get output data
    const output_data = result.output orelse &[_]u8{};

    // Check if output fits in buffer
    if (output_data.len + 8 > output_max_len) {
        return -3; // Output too large
    }

    // Write output length as first 8 bytes (little-endian)
    const output_len: u64 = @intCast(output_data.len);
    const output_len_bytes = std.mem.asBytes(&output_len);
    @memcpy(output_ptr[0..8], output_len_bytes);

    // Write output data after length
    if (output_data.len > 0) {
        @memcpy(output_ptr[8 .. 8 + output_data.len], output_data);
    }

    return if (result.status == .Success) 0 else -4;
}

// Get the minimum required WASM build size info
export fn getVersion() u32 {
    return 1; // Version 1.0.0
}

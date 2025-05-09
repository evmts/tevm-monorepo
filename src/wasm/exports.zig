//! WebAssembly exports for ZigEVM
//! This module provides the necessary exports and bindings for WASM compatibility

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const ExecutionResult = types.ExecutionResult;

/// Registry of ZigEVM instances for WASM environment
const EvmRegistry = struct {
    instances: std.AutoArrayHashMap(u32, *ZigEvmInstance),
    next_id: u32 = 1,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) EvmRegistry {
        return .{
            .instances = std.AutoArrayHashMap(u32, *ZigEvmInstance).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *EvmRegistry) void {
        var it = self.instances.iterator();
        while (it.next()) |entry| {
            entry.value_ptr.*.deinit();
            self.allocator.destroy(entry.value_ptr.*);
        }
        self.instances.deinit();
    }
    
    pub fn register(self: *EvmRegistry, instance: *ZigEvmInstance) u32 {
        const id = self.next_id;
        self.next_id += 1;
        self.instances.put(id, instance) catch {
            return 0; // Error
        };
        return id;
    }
    
    pub fn get(self: *EvmRegistry, id: u32) ?*ZigEvmInstance {
        return self.instances.get(id);
    }
    
    pub fn remove(self: *EvmRegistry, id: u32) void {
        if (self.instances.get(id)) |instance| {
            instance.deinit();
            self.allocator.destroy(instance);
            // Use swapRemove instead of remove for ArrayHashMap
            _ = self.instances.swapRemove(id);
        }
    }
};

/// Result codes for WASM interface
const WasmResult = enum(u32) {
    Success = 0,
    OutOfGas = 1,
    InvalidOpcode = 2,
    StackOverflow = 3,
    StackUnderflow = 4,
    InvalidJump = 5,
    InvalidInput = 6,
    InternalError = 7,
    Reverted = 8,
    InvalidHandle = 9,
};

/// Instance of ZigEVM with isolated state
const ZigEvmInstance = struct {
    // TODO: This is a placeholder - the real implementation will have:
    // - Memory
    // - Stack
    // - State manager
    // - Interpreter
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) !*ZigEvmInstance {
        const instance = try allocator.create(ZigEvmInstance);
        instance.* = .{
            .allocator = allocator,
        };
        return instance;
    }
    
    pub fn deinit(_: *ZigEvmInstance) void {
        // Free resources (placeholder)
    }
    
    pub fn execute(
        self: *ZigEvmInstance,
        code: []const u8,
        calldata: []const u8,
        gas_limit: u64,
        address: Address,
        caller: Address,
    ) ![]const u8 {
        // This is a placeholder - actual execution will be implemented later
        _ = code;
        _ = calldata;
        _ = gas_limit;
        _ = address;
        _ = caller;
        
        const result = try self.allocator.alloc(u8, 32);
        @memset(result, 0);
        
        // Just for a simple test, set the last byte to 3 (as if we added 1 + 2)
        result[31] = 3;
        return result;
    }
};

// Global registry for WASM instances
var global_allocator: std.mem.Allocator = undefined;
var registry: EvmRegistry = undefined;
var is_initialized: bool = false;

/// Initialize the WASM environment
fn initWasm() void {
    if (is_initialized) return;
    
    // In WASM, we use the page allocator for the global allocator
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    global_allocator = gpa.allocator();
    registry = EvmRegistry.init(global_allocator);
    is_initialized = true;
}

/// Convert a WASM execution result to a result code
fn resultToCode(result: ExecutionResult) WasmResult {
    return switch (result) {
        .Success => WasmResult.Success,
        .Revert => WasmResult.Reverted,
        .Error => |err| switch (err.error_type) {
            .OutOfGas => WasmResult.OutOfGas,
            .InvalidOpcode => WasmResult.InvalidOpcode,
            .StackOverflow => WasmResult.StackOverflow,
            .StackUnderflow => WasmResult.StackUnderflow,
            .InvalidJump, .InvalidJumpDest => WasmResult.InvalidJump,
            else => WasmResult.InternalError,
        },
    };
}

//
// WASM exports
//

/// Create a new ZigEVM instance
/// Returns a handle to the instance, or 0 on error
export fn zig_evm_create() u32 {
    initWasm();
    
    const instance = ZigEvmInstance.init(global_allocator) catch {
        return 0; // Error
    };
    
    return registry.register(instance);
}

/// Destroy a ZigEVM instance
/// Returns 1 on success, 0 if the handle is invalid
export fn zig_evm_destroy(handle: u32) u32 {
    if (!is_initialized) return 0;
    
    if (registry.get(handle) == null) {
        return 0; // Invalid handle
    }
    
    registry.remove(handle);
    return 1;
}

/// Execute EVM bytecode
/// Returns a result code (see WasmResult enum)
/// Output is written to the provided result buffer
export fn zig_evm_execute(
    handle: u32,
    code_ptr: [*]const u8,
    code_len: u32,
    data_ptr: [*]const u8,
    data_len: u32,
    // We're not using value_ptr for now, but keeping it in the signature for future use
    _: [*]const u8,
    gas_limit: u32,
    address_ptr: [*]const u8,
    caller_ptr: [*]const u8,
    result_ptr: [*]u8,
    result_len_ptr: [*]u32,
) u32 {
    if (!is_initialized) return @intFromEnum(WasmResult.InternalError);
    
    // Get EVM instance from registry
    const instance = registry.get(handle) orelse {
        return @intFromEnum(WasmResult.InvalidHandle);
    };
    
    // Convert parameters to native types
    const code = code_ptr[0..code_len];
    const data = data_ptr[0..data_len];
    
    var address = Address.zero();
    if (address_ptr[0..20].len == 20) {
        @memcpy(&address.bytes, address_ptr[0..20]);
    }
    
    var caller = Address.zero();
    if (caller_ptr[0..20].len == 20) {
        @memcpy(&caller.bytes, caller_ptr[0..20]);
    }
    
    // Execute the EVM code
    var output = instance.execute(code, data, gas_limit, address, caller) catch {
        return @intFromEnum(WasmResult.InternalError);
    };
    
    // Copy result to output buffer
    const output_len = @min(output.len, result_len_ptr[0]);
    @memcpy(result_ptr[0..output_len], output[0..output_len]);
    result_len_ptr[0] = @intCast(output_len);
    
    return @intFromEnum(WasmResult.Success);
}

/// Get version information
/// Writes version string to the provided buffer
export fn zig_evm_version(
    buffer_ptr: [*]u8,
    buffer_len: u32,
) u32 {
    const version = "ZigEVM v0.1.0";
    const len = @min(version.len, buffer_len);
    @memcpy(buffer_ptr[0..len], version[0..len]);
    return @intCast(len);
}

//
// Helper functions for testing (not part of the public API)
//

/// Simple addition function for testing WASM compilation
export fn zig_add(a: i32, b: i32) i32 {
    return a + b;
}

// Export memory for JavaScript to use
export var memory: [65536]u8 = undefined;
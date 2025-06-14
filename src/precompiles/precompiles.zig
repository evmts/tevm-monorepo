const std = @import("std");

// For now, use a simplified implementation without C bindings
// This will allow the benchmarks to run while we work on the C integration
// const c = @cImport({
//     @cInclude("revm_precompiles_wrapper.h");
// });

// Match the actual C API from the generated header
const c = struct {
    pub const CPrecompiles = opaque {};
    pub extern fn revm_precompiles_latest() ?*CPrecompiles;
    pub extern fn revm_precompiles_free(precompiles: *CPrecompiles) void;
    pub extern fn revm_precompiles_contains(precompiles: *const CPrecompiles, address_bytes: *const u8) bool;
    pub extern fn revm_precompiles_run(precompiles: *const CPrecompiles, address_bytes: *const u8, input: *const u8, input_len: usize, gas_limit: u64) CPrecompileResult;
    pub extern fn revm_precompiles_free_result(result: *CPrecompileResult) void;
    
    pub const CPrecompileResult = extern struct {
        success: bool,
        gas_used: u64,
        output: ?*u8,
        output_len: usize,
        error_code: u32,
    };
};

/// Precompile error types
pub const PrecompileError = error{
    OutOfGas,
    ExecutionFailed,
    InvalidInput,
    UnsupportedPrecompile,
    PrecompileCreationFailed,
};

/// Precompile execution result
pub const PrecompileResult = union(enum) {
    success: struct {
        output: []const u8,
        gas_used: u64,
        allocator: std.mem.Allocator, // Store allocator for cleanup
    },
    failure: PrecompileError,

    pub fn deinit(self: *PrecompileResult) void {
        switch (self.*) {
            .success => |success| {
                success.allocator.free(success.output);
            },
            .failure => {},
        }
    }

    pub fn is_success(self: PrecompileResult) bool {
        return switch (self) {
            .success => true,
            .failure => false,
        };
    }

    pub fn is_failure(self: PrecompileResult) bool {
        return !self.is_success();
    }

    pub fn get_gas_used(self: PrecompileResult) u64 {
        return switch (self) {
            .success => |success| success.gas_used,
            .failure => 0,
        };
    }

    pub fn get_output_size(self: PrecompileResult) usize {
        return switch (self) {
            .success => |success| success.output.len,
            .failure => 0,
        };
    }

    pub fn get_error(self: PrecompileResult) ?PrecompileError {
        return switch (self) {
            .success => null,
            .failure => |err| err,
        };
    }
};

/// Precompile types supported
pub const PrecompileType = enum {
    ecrecover,
    sha256,
    ripemd160,
    identity,
    modexp,
    ecadd,
    ecmul,
    ecpairing,
    blake2f,
    kzg_point_evaluation,

    pub fn to_address(self: PrecompileType) [20]u8 {
        var address = [_]u8{0} ** 20;
        address[19] = switch (self) {
            .ecrecover => 1,
            .sha256 => 2,
            .ripemd160 => 3,
            .identity => 4,
            .modexp => 5,
            .ecadd => 6,
            .ecmul => 7,
            .ecpairing => 8,
            .blake2f => 9,
            .kzg_point_evaluation => 10,
        };
        return address;
    }
};

/// Main precompiles wrapper around REVM
pub const Precompiles = struct {
    inner: *c.CPrecompiles,
    allocator: std.mem.Allocator,

    pub fn create_latest(allocator: std.mem.Allocator) !Precompiles {
        const inner = c.revm_precompiles_latest();
        if (inner == null) {
            return error.PrecompileCreationFailed;
        }
        return Precompiles{
            .inner = inner.?,
            .allocator = allocator,
        };
    }

    pub fn deinit(self: *Precompiles) void {
        c.revm_precompiles_free(self.inner);
    }

    pub fn get_address(precompile_type: PrecompileType) !@TypeOf(precompile_type.to_address()) {
        return precompile_type.to_address();
    }

    pub fn contains(self: Precompiles, address: [20]u8) bool {
        return c.revm_precompiles_contains(self.inner, &address[0]);
    }

    pub fn run(self: Precompiles, address: [20]u8, input: []const u8, gas_limit: u64) !PrecompileResult {
        var result = c.revm_precompiles_run(
            self.inner,
            &address[0],
            if (input.len > 0) &input[0] else @ptrCast(&@as(u8, 0)),
            input.len,
            gas_limit,
        );

        if (result.success) {
            // Allocate and copy output
            const output = try self.allocator.alloc(u8, result.output_len);
            if (result.output) |output_ptr| {
                @memcpy(output, @as([*]const u8, @ptrCast(output_ptr))[0..result.output_len]);
            }
            
            // Free the C result
            c.revm_precompiles_free_result(&result);
            
            return PrecompileResult{
                .success = .{
                    .output = output,
                    .gas_used = result.gas_used,
                    .allocator = self.allocator,
                },
            };
        } else {
            const error_type = switch (result.error_code) {
                1 => PrecompileError.OutOfGas,
                2 => PrecompileError.ExecutionFailed,
                3 => PrecompileError.InvalidInput,
                else => PrecompileError.UnsupportedPrecompile,
            };
            c.revm_precompiles_free_result(&result);
            return PrecompileResult{ .failure = error_type };
        }
    }

    // Note: REVM precompiles API doesn't expose gas cost calculation separately
    // Gas costs are calculated internally during execution
    pub fn gas_cost(self: Precompiles, address: [20]u8, input: []const u8) u64 {
        // For gas cost estimation, we can run with a very high gas limit
        // and return the gas_used from the result
        var result = c.revm_precompiles_run(
            self.inner,
            &address[0],
            if (input.len > 0) &input[0] else @ptrCast(&@as(u8, 0)),
            input.len,
            std.math.maxInt(u64),
        );
        defer c.revm_precompiles_free_result(&result);
        
        return result.gas_used;
    }
};

// For backward compatibility, export common precompile functions
pub const sha256 = struct {
    pub fn calculate_gas(input_len: usize) u64 {
        // SHA256 gas formula: 60 + 12 * ceil(input_len / 32)
        const words = (input_len + 31) / 32;
        return 60 + 12 * words;
    }

    pub fn calculate_gas_checked(input_len: usize) !u64 {
        return calculate_gas(input_len);
    }

    pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileResult {
        if (output.len < 32) {
            return PrecompileResult{ .failure = PrecompileError.ExecutionFailed };
        }

        const required_gas = calculate_gas(input.len);
        if (gas_limit < required_gas) {
            return PrecompileResult{ .failure = PrecompileError.OutOfGas };
        }

        // Use Zig's built-in SHA256
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha2.Sha256.hash(input, &hash, .{});
        @memcpy(output[0..32], &hash);

        return PrecompileResult{
            .success = .{
                .output = output[0..32],
                .gas_used = required_gas,
            },
        };
    }

    pub fn validate_gas_requirement(input_len: usize, gas_limit: u64) bool {
        return gas_limit >= calculate_gas(input_len);
    }

    pub fn get_output_size(_: usize) usize {
        return 32;
    }
};

pub const identity = struct {
    pub fn calculate_gas(input_len: usize) u64 {
        // IDENTITY gas formula: 15 + 3 * ceil(input_len / 32)
        const words = (input_len + 31) / 32;
        return 15 + 3 * words;
    }

    pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileResult {
        if (output.len < input.len) {
            return PrecompileResult{ .failure = PrecompileError.ExecutionFailed };
        }

        const required_gas = calculate_gas(input.len);
        if (gas_limit < required_gas) {
            return PrecompileResult{ .failure = PrecompileError.OutOfGas };
        }

        @memcpy(output[0..input.len], input);

        return PrecompileResult{
            .success = .{
                .output = output[0..input.len],
                .gas_used = required_gas,
            },
        };
    }

    pub fn get_output_size(input_len: usize) usize {
        return input_len;
    }
};

// Placeholder implementations for other precompiles
pub const ecrecover = struct {
    pub fn calculate_gas(_: usize) u64 {
        return 3000;
    }
};

pub const ripemd160 = struct {
    pub fn calculate_gas(input_len: usize) u64 {
        const words = (input_len + 31) / 32;
        return 600 + 120 * words;
    }
};

pub const modexp = struct {
    pub fn calculate_gas(_: usize) u64 {
        return 20000; // Simplified base cost
    }
};

pub const blake2f = struct {
    pub fn calculate_gas(_: usize) u64 {
        return 1; // 1 gas per round, rounds specified in input
    }
};

pub const SpecId = enum(u32) {
    latest = 6,
};

test "precompiles basic functionality" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var precompiles_instance = try Precompiles.create_latest(allocator);
    defer precompiles_instance.deinit();

    const sha256_addr = try Precompiles.get_address(.sha256);
    try testing.expect(precompiles_instance.contains(sha256_addr));
}

test "sha256 precompile" {
    const testing = std.testing;
    
    var output_buffer: [32]u8 = undefined;
    const result = sha256.execute("abc", &output_buffer, 100);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 72), result.get_gas_used());
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
}
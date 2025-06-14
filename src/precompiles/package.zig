const std = @import("std");

// Package module for precompiles
// This file exports the appropriate implementation based on the target

pub const precompiles = if (@import("builtin").target.cpu.arch.isWasm())
    @import("precompiles_wasm.zig")
else
    @import("precompiles.zig");

// Re-export main types and functions
pub const Precompiles = precompiles.Precompiles;
pub const PrecompileResult = precompiles.PrecompileResult;
pub const PrecompileError = precompiles.PrecompileError;
pub const PrecompileType = precompiles.PrecompileType;

// Re-export convenience functions
pub const sha256 = precompiles.sha256;
pub const identity = precompiles.identity;

// Export additional functions only if available (non-WASM)
pub const ecrecover = if (@hasDecl(precompiles, "ecrecover")) precompiles.ecrecover else struct {
    pub fn ecrecover(_: anytype, _: anytype, _: anytype) !PrecompileResult {
        return error.UnsupportedInWasm;
    }
}.ecrecover;

pub const ripemd160 = if (@hasDecl(precompiles, "ripemd160")) precompiles.ripemd160 else struct {
    pub fn ripemd160(_: anytype, _: anytype, _: anytype) !PrecompileResult {
        return error.UnsupportedInWasm;
    }
}.ripemd160;

pub const modexp = if (@hasDecl(precompiles, "modexp")) precompiles.modexp else struct {
    pub fn modexp(_: anytype, _: anytype, _: anytype) !PrecompileResult {
        return error.UnsupportedInWasm;
    }
}.modexp;

pub const blake2f = if (@hasDecl(precompiles, "blake2f")) precompiles.blake2f else struct {
    pub fn blake2f(_: anytype, _: anytype, _: anytype) !PrecompileResult {
        return error.UnsupportedInWasm;
    }
}.blake2f;

// Export SpecId only if available (non-WASM)
pub const SpecId = if (@hasDecl(precompiles, "SpecId")) precompiles.SpecId else enum(u32) {
    latest = 6,
};

test "package exports" {
    const testing = std.testing;
    const allocator = testing.allocator;

    // Test that we can create precompiles
    const precomp = if (@import("builtin").target.cpu.arch.isWasm()) 
        Precompiles.create(allocator)
    else 
        try Precompiles.create_latest(allocator);
    
    var precompiles_instance = precomp;
    defer precompiles_instance.deinit();

    // Test that we can get addresses
    const sha256_addr = try Precompiles.get_address(.sha256);
    try testing.expect(sha256_addr[19] == 2);

    // Test basic functionality
    try testing.expect(precompiles_instance.contains(sha256_addr));
}
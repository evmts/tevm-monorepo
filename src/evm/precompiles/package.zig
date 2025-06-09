/// Precompiles package exports
/// 
/// This module provides the public API for all Ethereum precompile functionality.
/// It includes address management, execution dispatch, and individual precompile implementations.

// Core precompile system
pub const addresses = @import("precompile_addresses.zig");
pub const result = @import("precompile_result.zig");
pub const precompiles = @import("precompiles.zig");

// Individual precompile implementations
pub const sha256 = @import("sha256.zig");

// Re-export commonly used types for convenience
pub const PrecompileError = result.PrecompileError;
pub const PrecompileResult = result.PrecompileResult;
pub const PrecompileExecutionResult = result.PrecompileExecutionResult;

// Re-export commonly used functions
pub const is_precompile = addresses.is_precompile;
pub const get_precompile_id = addresses.get_precompile_id;
pub const execute_precompile = precompiles.execute_precompile;
pub const calculate_precompile_gas = precompiles.calculate_precompile_gas;
pub const is_precompile_available = precompiles.is_precompile_available;

// Re-export precompile addresses
pub const ECRECOVER_ADDRESS = addresses.ECRECOVER_ADDRESS;
pub const SHA256_ADDRESS = addresses.SHA256_ADDRESS;
pub const RIPEMD160_ADDRESS = addresses.RIPEMD160_ADDRESS;
pub const IDENTITY_ADDRESS = addresses.IDENTITY_ADDRESS;
pub const MODEXP_ADDRESS = addresses.MODEXP_ADDRESS;
pub const ECADD_ADDRESS = addresses.ECADD_ADDRESS;
pub const ECMUL_ADDRESS = addresses.ECMUL_ADDRESS;
pub const ECPAIRING_ADDRESS = addresses.ECPAIRING_ADDRESS;
pub const BLAKE2F_ADDRESS = addresses.BLAKE2F_ADDRESS;
pub const MAX_PRECOMPILE_ADDRESS = addresses.MAX_PRECOMPILE_ADDRESS;
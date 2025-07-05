const std = @import("std");
const Address = @import("Address").Address;
const addresses = @import("precompile_addresses.zig");
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const ecrecover = @import("ecrecover.zig");
const identity = @import("identity.zig");
const sha256 = @import("sha256.zig");
const ripemd160 = @import("ripemd160.zig");
const kzg_point_evaluation = @import("kzg_point_evaluation.zig");
const ChainRules = @import("../hardforks/chain_rules.zig");

/// Main precompile dispatcher module
///
/// This module provides the main interface for precompile execution. It handles:
/// - Address-based precompile detection and routing
/// - Hardfork-based availability checks
/// - Unified execution interface for all precompiles
/// - Error handling and result management
///
/// The dispatcher is designed to be easily extensible for future precompiles.
/// Adding a new precompile requires:
/// 1. Adding the address constant to precompile_addresses.zig
/// 2. Implementing the precompile logic in its own module
/// 3. Adding the dispatch case to execute_precompile()
/// 4. Adding availability check to is_available()
/// Checks if the given address is a precompile address
///
/// This function determines whether a given address corresponds to a known precompile.
/// It serves as the entry point for precompile detection during contract calls.
///
/// @param address The address to check
/// @return true if the address is a known precompile, false otherwise
pub fn is_precompile(address: Address) bool {
    return addresses.is_precompile(address);
}

/// Checks if a precompile is available in the given chain rules
///
/// Different precompiles were introduced in different hardforks. This function
/// ensures that precompiles are only available when they should be according
/// to the Ethereum specification.
///
/// @param address The precompile address to check
/// @param chain_rules The current chain rules configuration
/// @return true if the precompile is available with these chain rules
pub fn is_available(address: Address, chain_rules: ChainRules) bool {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return false;
    }

    const precompile_id = addresses.get_precompile_id(address);

    return switch (precompile_id) {
        1, 2, 3, 4 => true, // ECRECOVER, SHA256, RIPEMD160, IDENTITY available from Frontier
        5 => chain_rules.IsByzantium, // MODEXP from Byzantium
        6, 7, 8 => chain_rules.IsByzantium, // ECADD, ECMUL, ECPAIRING from Byzantium
        9 => chain_rules.IsIstanbul, // BLAKE2F from Istanbul
        10 => chain_rules.IsCancun, // POINT_EVALUATION from Cancun
        else => false,
    };
}

/// Executes a precompile with the given parameters
///
/// This is the main execution function that routes precompile calls to their
/// specific implementations. It handles:
/// - Precompile address validation
/// - Hardfork availability checks
/// - Routing to specific precompile implementations
/// - Consistent error handling
///
/// @param address The precompile address being called
/// @param input Input data for the precompile
/// @param output Output buffer to write results (must be large enough)
/// @param gas_limit Maximum gas available for execution
/// @param chain_rules Current chain rules for availability checking
/// @return PrecompileOutput containing success/failure and gas usage
pub fn execute_precompile(address: Address, input: []const u8, output: []u8, gas_limit: u64, chain_rules: ChainRules) PrecompileOutput {
    // Check if this is a valid precompile address
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }

    // Check if this precompile is available with the current chain rules
    if (!is_available(address, chain_rules)) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }

    const precompile_id = addresses.get_precompile_id(address);

    // Route to specific precompile implementation
    return switch (precompile_id) {
        4 => {
            @branchHint(.likely);
            return identity.execute(input, output, gas_limit);
        }, // IDENTITY

        // Placeholder implementations for future precompiles
        1 => {
            @branchHint(.likely);
            return ecrecover.execute(input, output, gas_limit);
        }, // ECRECOVER
        2 => {
            @branchHint(.likely);
            return sha256.execute(input, output, gas_limit);
        }, // SHA256
        3 => {
            @branchHint(.likely);
            return ripemd160.execute(input, output, gas_limit);
        }, // RIPEMD160
        5 => {
            @branchHint(.likely);
            // MODEXP - Unimplemented
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // MODEXP
        6 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // ECADD - TODO
        7 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // ECMUL - TODO
        8 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // ECPAIRING - TODO
        9 => {
            @branchHint(.unlikely);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // BLAKE2F - TODO
        10 => {
            @branchHint(.unlikely);
            return kzg_point_evaluation.execute(input, output, gas_limit);
        }, // POINT_EVALUATION

        else => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        },
    };
}

/// Estimates the gas cost for a precompile call
///
/// This function calculates the gas cost for a precompile call without actually
/// executing it. Useful for gas estimation and transaction validation.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param chain_rules Current chain rules
/// @return Estimated gas cost or error if not available
pub fn estimate_gas(address: Address, input_size: usize, chain_rules: ChainRules) !u64 {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return error.InvalidPrecompile;
    }

    if (!is_available(address, chain_rules)) {
        @branchHint(.cold);
        return error.PrecompileNotAvailable;
    }

    const precompile_id = addresses.get_precompile_id(address);

    return switch (precompile_id) {
        4 => identity.calculate_gas_checked(input_size), // IDENTITY

        // Placeholder gas calculations for future precompiles
        1 => ecrecover.calculate_gas_checked(input_size), // ECRECOVER
        2 => sha256.calculate_gas_checked(input_size), // SHA256
        3 => ripemd160.calculate_gas_checked(input_size), // RIPEMD160
        5 => error.InvalidInput, // MODEXP - TODO
        6 => error.InvalidInput, // ECADD - TODO
        7 => error.InvalidInput, // ECMUL - TODO
        8 => error.InvalidInput, // ECPAIRING - TODO
        9 => error.InvalidInput, // BLAKE2F - TODO
        10 => kzg_point_evaluation.calculate_gas_checked(input_size), // POINT_EVALUATION

        else => error.InvalidPrecompile,
    };
}

/// Gets the expected output size for a precompile call
///
/// Some precompiles have fixed output sizes, while others depend on the input.
/// This function provides a way to determine the required output buffer size.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param chain_rules Current chain rules
/// @return Expected output size or error if not available
pub fn get_output_size(address: Address, input_size: usize, chain_rules: ChainRules) !usize {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return error.InvalidPrecompile;
    }

    if (!is_available(address, chain_rules)) {
        @branchHint(.cold);
        return error.PrecompileNotAvailable;
    }

    const precompile_id = addresses.get_precompile_id(address);

    return switch (precompile_id) {
        4 => identity.get_output_size(input_size), // IDENTITY

        // Placeholder output sizes for future precompiles
        1 => ecrecover.get_output_size(input_size), // ECRECOVER
        2 => sha256.get_output_size(input_size), // SHA256
        3 => ripemd160.get_output_size(input_size), // RIPEMD160
        // TODO we need to do this
        5 => 420, // modexp.get_output_size(input_size), // MODEXP
        6 => 64, // ECADD - fixed 64 bytes (point)
        7 => 64, // ECMUL - fixed 64 bytes (point)
        8 => 32, // ECPAIRING - fixed 32 bytes (boolean result)
        9 => 64, // BLAKE2F - fixed 64 bytes (hash)
        10 => kzg_point_evaluation.get_output_size(input_size), // POINT_EVALUATION

        else => error.InvalidPrecompile,
    };
}

/// Validates that a precompile call would succeed
///
/// This function performs all validation checks without executing the precompile.
/// Useful for transaction validation and gas estimation.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param gas_limit Available gas limit
/// @param chain_rules Current chain rules
/// @return true if the call would succeed
pub fn validate_call(address: Address, input_size: usize, gas_limit: u64, chain_rules: ChainRules) bool {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return false;
    }
    if (!is_available(address, chain_rules)) {
        @branchHint(.cold);
        return false;
    }

    const gas_cost = estimate_gas(address, input_size, chain_rules) catch {
        @branchHint(.cold);
        return false;
    };
    return gas_cost <= gas_limit;
}

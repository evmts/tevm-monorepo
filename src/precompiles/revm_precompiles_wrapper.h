#ifndef REVM_PRECOMPILES_WRAPPER_H
#define REVM_PRECOMPILES_WRAPPER_H

#pragma once

#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include "stdint.h"
#include "stdbool.h"
#include "stddef.h"

/**
 * Error codes for C interop
 *
 * These error codes map directly to REVM's PrecompileError enum variants,
 * providing detailed error information for each type of precompile failure.
 * The numeric values are stable and safe for FFI communication.
 */
typedef enum PrecompileErrorCode {
  /**
   * Operation completed successfully
   */
  Success = 0,
  /**
   * Insufficient gas provided for the operation
   * All precompiles have minimum gas requirements based on Ethereum specifications
   */
  OutOfGas = 1,
  /**
   * BLAKE2F input has wrong length (must be exactly 213 bytes)
   */
  Blake2WrongLength = 2,
  /**
   * BLAKE2F final indicator flag is invalid (must be 0 or 1)
   */
  Blake2WrongFinalIndicatorFlag = 3,
  /**
   * Exponent value exceeds maximum allowed size causing overflow
   */
  ModexpExpOverflow = 4,
  /**
   * Base value exceeds maximum allowed size causing overflow
   */
  ModexpBaseOverflow = 5,
  /**
   * Modulus value exceeds maximum allowed size causing overflow
   */
  ModexpModOverflow = 6,
  /**
   * EIP-7823 size limit exceeded
   */
  ModexpEip7823LimitSize = 7,
  /**
   * Point coordinates are not valid members of the BN128 finite field
   */
  Bn128FieldPointNotAMember = 8,
  /**
   * Failed to create affine G1 point representation (point at infinity or invalid)
   */
  Bn128AffineGFailedToCreate = 9,
  /**
   * Pairing input length is invalid (must be multiple of 192 bytes for point pairs)
   */
  Bn128PairLength = 10,
  /**
   * KZG blob input data has invalid length (must be specific multiples)
   */
  BlobInvalidInputLength = 11,
  /**
   * KZG blob version field doesn't match expected value
   */
  BlobMismatchedVersion = 12,
  /**
   * KZG proof verification failed (polynomial commitment doesn't match)
   */
  BlobVerifyKzgProofFailed = 13,
  /**
   * Fatal error during precompile execution
   */
  Fatal = 98,
  /**
   * Generic error for any other precompile failure not covered by specific codes
   */
  Other = 99,
} PrecompileErrorCode;

/**
 * Precompiles wrapper for C interop
 *
 * This opaque structure wraps REVM's Precompiles instance, which contains
 * the complete set of precompiled contracts for a specific Ethereum hardfork.
 * Each hardfork (Homestead, Byzantium, Istanbul, Berlin, Cancun, etc.) has
 * different precompiles available with potentially different gas costs.
 */
typedef struct CPrecompiles {
  /**
   * Reference to the static REVM Precompiles instance
   * This points to a static instance managed by REVM
   */
  const Precompiles *inner;
} CPrecompiles;

/**
 * Precompile execution result structure for C interop
 *
 * This structure contains the complete result of a precompile execution,
 * including success status, detailed error information, output data, and gas consumption.
 * The output data is allocated using libc::malloc and must be freed by the caller.
 */
typedef struct CPrecompileResult {
  /**
   * Whether the precompile execution completed successfully
   */
  bool success;
  /**
   * Detailed error code if execution failed (Success if successful)
   */
  enum PrecompileErrorCode error_code;
  /**
   * Pointer to output data allocated with libc::malloc
   * NULL if no output or execution failed
   * Caller must free with revm_precompiles_free_result()
   */
  uint8_t *output;
  /**
   * Length of output data in bytes
   * 0 if no output or execution failed
   */
  uintptr_t output_len;
  /**
   * Amount of gas consumed by the precompile execution
   * On failure, this is typically set to the gas limit (all gas consumed)
   */
  uint64_t gas_used;
} CPrecompileResult;

/**
 * Create precompiles for the latest Ethereum specification
 *
 * This function creates a precompiles instance configured for the most recent
 * Ethereum hardfork supported by REVM. Currently this includes all precompiles
 * from Frontier through the latest supported fork (Osaka).
 *
 * # Returns
 * - Pointer to CPrecompiles instance on success
 * - NULL if creation fails (should never happen in practice)
 *
 * # Safety
 * - The returned pointer must be freed with revm_precompiles_free()
 * - The pointer is valid until freed
 *
 * # Supported Precompiles in Latest Spec
 * - All Frontier precompiles (ECRECOVER, SHA256, RIPEMD160, IDENTITY)
 * - Byzantium additions (MODEXP, BN128 operations)
 * - Istanbul gas optimizations for BN128
 * - Berlin MODEXP repricing
 * - Cancun KZG point evaluation (if c-kzg feature enabled)
 * - Optional BLS12-381 operations (if blst feature enabled)
 */
struct CPrecompiles *revm_precompiles_latest(void);

/**
 * Create precompiles for a specific Ethereum hardfork specification
 *
 * This function creates a precompiles instance configured for a specific Ethereum
 * hardfork, allowing you to test or execute contracts as they would behave on
 * different network upgrade states.
 *
 * # Parameters
 * - `spec_id`: Numeric hardfork identifier:
 *   - 0: HOMESTEAD - Basic precompiles (ECRECOVER, SHA256, RIPEMD160, IDENTITY)
 *   - 1: BYZANTIUM - Adds MODEXP and BN128 operations with original gas costs
 *   - 2: ISTANBUL - Reduces gas costs for BN128 operations (major optimization)
 *   - 3: BERLIN - Reprices MODEXP operation (EIP-2565)
 *   - 4: CANCUN - Adds KZG point evaluation for proto-danksharding
 *   - 5: PRAGUE - Future Ethereum upgrade
 *   - 6: OSAKA - Future Ethereum upgrade
 *   - Other values default to OSAKA (latest)
 *
 * # Returns
 * - Pointer to CPrecompiles instance on success
 * - NULL if creation fails (should never happen in practice)
 *
 * # Safety
 * - The returned pointer must be freed with revm_precompiles_free()
 * - The pointer is valid until freed
 *
 * # Hardfork Evolution
 * Each hardfork builds upon previous ones but may change gas costs:
 * - Istanbul made BN128 operations much cheaper (enabling more complex ZK proofs)
 * - Berlin adjusted MODEXP pricing to be more fair for large exponents
 * - Cancun added KZG for Ethereum's data availability scaling
 */
struct CPrecompiles *revm_precompiles_new(uint32_t spec_id);

/**
 * Free precompiles instance
 *
 * This function properly deallocates a precompiles instance created by
 * revm_precompiles_latest() or revm_precompiles_new().
 *
 * # Parameters
 * - `precompiles`: Pointer to CPrecompiles instance to free (can be NULL)
 *
 * # Safety
 * - The pointer must have been created by this library
 * - The pointer must not be used after calling this function
 * - It's safe to pass NULL (function will do nothing)
 * - Double-free is prevented by internal null checks
 */
void revm_precompiles_free(struct CPrecompiles *precompiles);

/**
 * Check if a precompile exists at the given address
 *
 * This function determines whether a precompiled contract exists at the specified
 * address for the given hardfork specification. Different hardforks have different
 * sets of available precompiles.
 *
 * # Parameters
 * - `precompiles`: Pointer to CPrecompiles instance
 * - `address_bytes`: Pointer to 20-byte Ethereum address
 *
 * # Returns
 * - `true` if a precompile exists at the address
 * - `false` if no precompile exists or parameters are invalid
 *
 * # Safety
 * - `precompiles` must be a valid pointer from this library
 * - `address_bytes` must point to at least 20 bytes of valid memory
 * - Both pointers can be NULL (function returns false)
 *
 * # Example Addresses
 * - 0x01: ECRECOVER (available in all hardforks)
 * - 0x05: MODEXP (available from Byzantium onwards)
 * - 0x0A: KZG_POINT_EVALUATION (available from Cancun onwards)
 */
bool revm_precompiles_contains(const struct CPrecompiles *precompiles,
                               const uint8_t *address_bytes);

/**
 * Execute a precompiled contract
 *
 * This is the core function that executes a precompiled contract at the specified address
 * with the given input data and gas limit. It handles all the complexity of REVM's
 * precompile execution including gas cost calculation, input validation, and output generation.
 *
 * # Parameters
 * - `precompiles`: Pointer to CPrecompiles instance
 * - `address_bytes`: Pointer to 20-byte Ethereum address of the precompile
 * - `input`: Pointer to input data bytes (can be NULL if input_len is 0)
 * - `input_len`: Length of input data in bytes
 * - `gas_limit`: Maximum gas that can be consumed by the operation
 *
 * # Returns
 * CPrecompileResult containing:
 * - `success`: true if execution completed successfully
 * - `error_code`: Detailed error information (Success on success)
 * - `output`: Allocated output data (must be freed with revm_precompiles_free_result)
 * - `output_len`: Length of output data
 * - `gas_used`: Actual gas consumed
 *
 * # Gas Consumption
 * Each precompile has its own gas cost formula:
 * - **ECRECOVER**: Fixed 3000 gas
 * - **SHA256**: 60 + 12 * ceil(input_len / 32) gas
 * - **RIPEMD160**: 600 + 120 * ceil(input_len / 32) gas
 * - **IDENTITY**: 15 + 3 * ceil(input_len / 32) gas
 * - **MODEXP**: Complex formula based on input sizes (EIP-2565)
 * - **BN128 operations**: Fixed costs (reduced in Istanbul)
 * - **BLAKE2F**: 1 gas per round
 * - **KZG_POINT_EVALUATION**: Fixed 50000 gas
 *
 * # Input/Output Formats
 * Each precompile expects specific input formats:
 * - **ECRECOVER**: 128 bytes (32 hash + 32 v + 32 r + 32 s) → 32 bytes (address)
 * - **SHA256/RIPEMD160**: Any length → 32 bytes (hash)
 * - **IDENTITY**: Any length → Same data unchanged
 * - **MODEXP**: Variable (base_len + exp_len + mod_len) → mod_len bytes
 * - **BN128 ADD**: 128 bytes (2 points) → 64 bytes (result point)
 * - **BN128 MUL**: 96 bytes (point + scalar) → 64 bytes (result point)
 * - **BN128 PAIRING**: Multiple of 192 bytes → 32 bytes (0x00...00 or 0x00...01)
 *
 * # Safety
 * - `precompiles` must be a valid pointer from this library
 * - `address_bytes` must point to at least 20 bytes
 * - `input` must point to at least `input_len` bytes (or be NULL if input_len is 0)
 * - The returned output must be freed by the caller
 * - On failure, output is NULL and doesn't need to be freed
 *
 * # Error Handling
 * The function returns detailed error codes for different failure modes:
 * - Invalid input formats trigger specific precompile errors
 * - Insufficient gas triggers OutOfGas error
 * - Cryptographic validation failures trigger curve-specific errors
 */
struct CPrecompileResult revm_precompiles_run(const struct CPrecompiles *precompiles,
                                              const uint8_t *address_bytes,
                                              const uint8_t *input,
                                              uintptr_t input_len,
                                              uint64_t gas_limit);

/**
 * Free precompile result output memory
 *
 * This function properly deallocates the output memory from a CPrecompileResult
 * that was allocated by revm_precompiles_run(). After calling this function,
 * the output pointer in the result structure will be set to NULL.
 *
 * # Parameters
 * - `result`: Pointer to CPrecompileResult structure (can be NULL)
 *
 * # Safety
 * - The result must have been returned by revm_precompiles_run()
 * - It's safe to call this multiple times on the same result
 * - It's safe to pass NULL (function will do nothing)
 * - After calling this, the output field should not be accessed
 *
 * # Memory Management
 * The output data is allocated using libc::malloc in revm_precompiles_run()
 * and must be freed using libc::free to avoid memory leaks.
 */
void revm_precompiles_free_result(struct CPrecompileResult *result);

/**
 * Get Ethereum address for a well-known precompile type
 *
 * This utility function converts precompile type identifiers into their
 * corresponding Ethereum addresses. This is useful for address lookup
 * without needing to hardcode addresses in client code.
 *
 * # Parameters
 * - `precompile_type`: Numeric identifier for the precompile:
 *   - 1: ECRECOVER (0x01) - secp256k1 signature recovery
 *   - 2: SHA256 (0x02) - SHA-256 hashing
 *   - 3: RIPEMD160 (0x03) - RIPEMD-160 hashing
 *   - 4: IDENTITY (0x04) - data passthrough
 *   - 5: MODEXP (0x05) - big integer modular exponentiation
 *   - 6: ECADD (0x06) - BN128 elliptic curve addition
 *   - 7: ECMUL (0x07) - BN128 elliptic curve multiplication
 *   - 8: ECPAIRING (0x08) - BN128 pairing check
 *   - 9: BLAKE2F (0x09) - BLAKE2b compression function
 *   - 10: KZG_POINT_EVALUATION (0x0A) - KZG polynomial commitment verification
 *   - 11-17: BLS12_381_* (0x0B-0x11) - BLS12-381 curve operations
 * - `address_out`: Pointer to 20-byte buffer to receive the address
 *
 * # Returns
 * - `true` if the precompile type is valid and address was written
 * - `false` if the precompile type is invalid or address_out is NULL
 *
 * # Safety
 * - `address_out` must point to at least 20 bytes of writable memory
 * - The function will write exactly 20 bytes to the output buffer
 *
 * # Note
 * These addresses are standardized across all Ethereum implementations.
 * The mapping is: address = [0x00, 0x00, ..., 0x00, precompile_number]
 */
bool revm_precompiles_get_address(uint32_t precompile_type, uint8_t *address_out);

#endif /* REVM_PRECOMPILES_WRAPPER_H */

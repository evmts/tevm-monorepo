const std = @import("std");
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const blob_types = @import("../blob/blob_types.zig");
const kzg_verification = @import("../blob/kzg_verification.zig");

/// KZG Point Evaluation Precompile (EIP-4844)
///
/// Address: 0x000000000000000000000000000000000000000A
/// Gas cost: 50,000 (static)
///
/// This precompile verifies KZG polynomial commitment proofs for EIP-4844 blob transactions.
/// It takes a versioned hash, evaluation point, claimed value, commitment, and proof as input,
/// and returns a success indicator if the proof is valid.

/// Gas cost for KZG point evaluation (EIP-4844)
pub const KZG_POINT_EVALUATION_GAS_COST: u64 = 50000;

/// Expected input length (192 bytes total):
/// - versioned_hash: 32 bytes
/// - z: 32 bytes (evaluation point)
/// - y: 32 bytes (claimed evaluation)
/// - commitment: 48 bytes (KZG commitment)
/// - proof: 48 bytes (KZG proof)
pub const KZG_POINT_EVALUATION_INPUT_LENGTH: usize = 192;

/// Expected output length (64 bytes):
/// - FIELD_ELEMENTS_PER_BLOB: 32 bytes (0x1000)
/// - BLS_MODULUS: 32 bytes
pub const KZG_POINT_EVALUATION_OUTPUT_LENGTH: usize = 64;

/// Success return value for KZG point evaluation
/// First 32 bytes: FIELD_ELEMENTS_PER_BLOB (0x1000)
/// Second 32 bytes: BLS_MODULUS
const KZG_POINT_EVALUATION_SUCCESS: [64]u8 = blk: {
    var result: [64]u8 = [_]u8{0} ** 64;
    
    // First 32 bytes: FIELD_ELEMENTS_PER_BLOB (0x1000 = 4096)
    result[30] = 0x10; // 0x1000 in big-endian
    result[31] = 0x00;
    
    // Second 32 bytes: BLS_MODULUS (0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001)
    result[32] = 0x73; result[33] = 0xed; result[34] = 0xa7; result[35] = 0x53;
    result[36] = 0x29; result[37] = 0x9d; result[38] = 0x7d; result[39] = 0x48;
    result[40] = 0x33; result[41] = 0x39; result[42] = 0xd8; result[43] = 0x08;
    result[44] = 0x09; result[45] = 0xa1; result[46] = 0xd8; result[47] = 0x05;
    result[48] = 0x53; result[49] = 0xbd; result[50] = 0xa4; result[51] = 0x02;
    result[52] = 0xff; result[53] = 0xfe; result[54] = 0x5b; result[55] = 0xfe;
    result[56] = 0xff; result[57] = 0xff; result[58] = 0xff; result[59] = 0xff;
    result[60] = 0x00; result[61] = 0x00; result[62] = 0x00; result[63] = 0x01;
    
    break :blk result;
};

/// Execute the KZG point evaluation precompile
///
/// Validates the input format and performs KZG proof verification for the given parameters.
/// Returns success value if verification passes, or error if verification fails.
///
/// @param input Input data (must be exactly 192 bytes)
/// @param output Output buffer (must be at least 64 bytes)
/// @param gas_limit Available gas (must be at least KZG_POINT_EVALUATION_GAS_COST)
/// @return PrecompileOutput with success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    // Check gas limit
    if (gas_limit < KZG_POINT_EVALUATION_GAS_COST) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }

    // Validate input length
    if (input.len != KZG_POINT_EVALUATION_INPUT_LENGTH) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    }

    // Validate output buffer size
    if (output.len < KZG_POINT_EVALUATION_OUTPUT_LENGTH) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    }

    // Parse input parameters
    const versioned_hash = parse_versioned_hash(input[0..32]) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    };

    const z = parse_field_element(input[32..64]) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    };

    const y = parse_field_element(input[64..96]) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    };

    const commitment = parse_commitment(input[96..144]) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    };

    const proof = parse_proof(input[144..192]) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    };

    // Validate that the versioned hash matches the commitment
    if (!blob_types.validate_commitment_hash(&commitment, &versioned_hash)) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }

    // Perform KZG point evaluation verification
    const verification_result = perform_kzg_verification(&commitment, &z, &y, &proof) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    };

    if (!verification_result) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }

    // Copy success result to output
    @memcpy(output[0..KZG_POINT_EVALUATION_OUTPUT_LENGTH], &KZG_POINT_EVALUATION_SUCCESS);

    return PrecompileOutput.success_result(KZG_POINT_EVALUATION_GAS_COST, KZG_POINT_EVALUATION_OUTPUT_LENGTH);
}

/// Calculate gas cost for KZG point evaluation
///
/// @param input_size Size of input data (must be 192 bytes)
/// @return Static gas cost or error if input size is invalid
pub fn calculate_gas(input_size: usize) !u64 {
    if (input_size != KZG_POINT_EVALUATION_INPUT_LENGTH) {
        return error.InvalidInputSize;
    }
    return KZG_POINT_EVALUATION_GAS_COST;
}

/// Calculate gas cost with bounds checking
///
/// @param input_size Size of input data
/// @return Gas cost or error
pub fn calculate_gas_checked(input_size: usize) !u64 {
    return calculate_gas(input_size);
}

/// Get expected output size for KZG point evaluation
///
/// @param input_size Size of input data
/// @return Output size (always 64 bytes for valid input)
pub fn get_output_size(input_size: usize) usize {
    return if (input_size == KZG_POINT_EVALUATION_INPUT_LENGTH)
        KZG_POINT_EVALUATION_OUTPUT_LENGTH
    else
        0;
}

/// Parse versioned hash from input bytes
fn parse_versioned_hash(bytes: []const u8) !blob_types.VersionedHash {
    if (bytes.len != 32) {
        return error.InvalidLength;
    }
    return blob_types.VersionedHash.from_bytes(bytes);
}

/// Parse field element from input bytes
fn parse_field_element(bytes: []const u8) !blob_types.FieldElement {
    if (bytes.len != 32) {
        return error.InvalidLength;
    }
    const element = blob_types.FieldElement.from_bytes(bytes);
    if (!element.is_valid()) {
        return error.InvalidFieldElement;
    }
    return element;
}

/// Parse KZG commitment from input bytes
fn parse_commitment(bytes: []const u8) !blob_types.KZGCommitment {
    if (bytes.len != 48) {
        return error.InvalidLength;
    }
    return blob_types.KZGCommitment.from_bytes(bytes);
}

/// Parse KZG proof from input bytes
fn parse_proof(bytes: []const u8) !blob_types.KZGProof {
    if (bytes.len != 48) {
        return error.InvalidLength;
    }
    return blob_types.KZGProof.from_bytes(bytes);
}

/// Perform KZG verification using the global verifier
fn perform_kzg_verification(
    commitment: *const blob_types.KZGCommitment,
    z: *const blob_types.FieldElement,
    y: *const blob_types.FieldElement,
    proof: *const blob_types.KZGProof,
) !bool {
    // Get the global KZG verifier
    const verifier = kzg_verification.get_global_verifier() orelse {
        @branchHint(.cold);
        return error.KZGVerifierNotAvailable;
    };

    // Perform the verification
    return verifier.verify_kzg_proof(commitment, z, y, proof);
}

/// Initialize KZG point evaluation precompile
///
/// This function should be called during EVM initialization to set up
/// the KZG verifier with trusted setup parameters.
///
/// @param allocator Memory allocator for trusted setup
/// @return true if initialization succeeded
pub fn init(allocator: std.mem.Allocator) bool {
    return kzg_verification.init_global_verifier(allocator);
}

/// Clean up KZG point evaluation precompile resources
pub fn deinit() void {
    kzg_verification.deinit_global_verifier();
}
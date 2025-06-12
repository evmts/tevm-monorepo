const Address = @import("Address");

/// Result structure for contract creation operations in the EVM.
///
/// This structure encapsulates the outcome of deploying a new smart contract
/// through CREATE or CREATE2 opcodes. It provides all necessary information
/// about the deployment result, including the new contract's address and any
/// revert data if the deployment failed.
///
/// ## Contract Creation Flow
/// 1. Execute initcode (constructor bytecode)
/// 2. Initcode returns runtime bytecode
/// 3. Runtime bytecode is stored at computed address
/// 4. This result structure is returned
///
/// ## Address Computation
/// - **CREATE**: address = keccak256(rlp([sender, nonce]))[12:]
/// - **CREATE2**: address = keccak256(0xff ++ sender ++ salt ++ keccak256(initcode))[12:]
///
/// ## Success Conditions
/// A creation succeeds when:
/// - Initcode executes without reverting
/// - Sufficient gas remains for code storage
/// - Returned bytecode size ≤ 24,576 bytes (EIP-170)
/// - No address collision occurs
///
/// ## Failure Modes
/// - Initcode reverts (REVERT opcode or error)
/// - Out of gas during execution
/// - Returned bytecode exceeds size limit
/// - Address collision (extremely rare)
/// - Stack depth exceeded
///
/// ## Example Usage
/// ```zig
/// const result = try vm.create_contract(value, initcode, gas, salt);
/// if (result.success) {
///     // Contract deployed at result.address
///     log.info("Deployed to: {}", .{result.address});
/// } else {
///     // Deployment failed, check output for revert reason
///     if (result.output) |revert_data| {
///         log.err("Deployment failed: {}", .{revert_data});
///     }
/// }
/// defer if (result.output) |output| allocator.free(output);
/// ```
pub const CreateResult = @This();

/// Indicates whether the contract creation succeeded.
///
/// - `true`: Contract successfully deployed and code stored on-chain
/// - `false`: Creation failed due to revert, gas, or other errors
///
/// ## State Changes
/// - Success: All state changes are committed, contract exists at address
/// - Failure: All state changes are reverted, no contract is deployed
success: bool,

/// The address where the contract was (or would have been) deployed.
///
/// This address is computed deterministically before execution begins:
/// - For CREATE: Based on sender address and nonce
/// - For CREATE2: Based on sender, salt, and initcode hash
///
/// ## Important Notes
/// - Address is computed even if creation fails
/// - Can be used to predict addresses before deployment
/// - Useful for counterfactual instantiation patterns
///
/// ## Address Collision
/// If this address already contains a contract, creation fails.
/// The probability of collision is negligible (2^-160).
address: Address.Address,

/// Amount of gas remaining after the creation attempt.
///
/// ## Gas Accounting
/// - Deducted: Initcode execution + code storage (200 per byte)
/// - Refunded: Unused gas returns to caller
/// - Minimum: 32,000 gas for CREATE/CREATE2 base cost
///
/// ## Usage Patterns
/// - Success: Add back to calling context's available gas
/// - Failure with revert: Some gas may remain (unlike out-of-gas)
/// - Failure out-of-gas: Will be 0 or very low
gas_left: u64,

/// Optional data returned by the contract creation.
///
/// ## Success Case
/// - Contains the runtime bytecode to be stored on-chain
/// - Size must be ≤ 24,576 bytes (MAX_CODE_SIZE)
/// - Empty output creates a contract with no code
///
/// ## Failure Case
/// - Contains revert reason if REVERT was used
/// - `null` for out-of-gas or invalid operations
/// - Useful for debugging deployment failures
///
/// ## Memory Management
/// The output buffer is allocated by the VM and ownership transfers
/// to the caller, who must free it when no longer needed.
///
/// ## Examples
/// ```zig
/// // Success: output contains runtime bytecode
/// if (result.success and result.output) |bytecode| {
///     assert(bytecode.len <= MAX_CODE_SIZE);
/// }
///
/// // Failure: output may contain revert message
/// if (!result.success and result.output) |reason| {
///     // Decode revert reason (often ABI-encoded string)
/// }
/// ```
output: ?[]const u8,

pub fn initFailure(gas_left: u64, output: ?[]const u8) CreateResult {
    return CreateResult{
        .success = false,
        .address = Address.zero(),
        .gas_left = gas_left,
        .output = output,
    };
}

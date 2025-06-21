/// EVM gas cost constants for opcode execution
///
/// This module defines all gas cost constants used in EVM execution according
/// to the Ethereum Yellow Paper and various EIPs. Gas costs are critical for
/// preventing denial-of-service attacks and fairly pricing computational resources.
///
/// ## Gas Cost Categories
///
/// Operations are grouped by computational complexity:
/// - **Quick** (2 gas): Trivial operations like PC, MSIZE, GAS
/// - **Fastest** (3 gas): Simple arithmetic like ADD, SUB, NOT, LT, GT
/// - **Fast** (5 gas): More complex arithmetic like MUL, DIV, MOD
/// - **Mid** (8 gas): Advanced arithmetic like ADDMOD, MULMOD, SIGNEXTEND
/// - **Slow** (10 gas): Operations requiring more computation
/// - **Ext** (20+ gas): External operations like BALANCE, EXTCODESIZE
///
/// ## Historical Changes
///
/// Gas costs have evolved through various EIPs:
/// - EIP-150: Increased costs for IO-heavy operations
/// - EIP-2200: SSTORE net gas metering
/// - EIP-2929: Increased costs for cold storage/account access
/// - EIP-3529: Reduced refunds and cold access costs
/// - EIP-3860: Initcode metering
///
/// ## Usage
/// ```zig
/// const gas_cost = switch (opcode) {
///     0x01 => GasFastestStep, // ADD
///     0x02 => GasFastStep,    // MUL
///     0x20 => Keccak256Gas + (data_size_words * Keccak256WordGas),
///     else => 0,
/// };
/// ```
/// Gas cost for very cheap operations
/// Operations: ADDRESS, ORIGIN, CALLER, CALLVALUE, CALLDATASIZE, CODESIZE,
/// GASPRICE, RETURNDATASIZE, PC, MSIZE, GAS, CHAINID, SELFBALANCE
pub const GasQuickStep: u64 = 2;

/// Gas cost for simple arithmetic and logic operations
/// Operations: ADD, SUB, NOT, LT, GT, SLT, SGT, EQ, ISZERO, AND, OR, XOR,
/// CALLDATALOAD, MLOAD, MSTORE, MSTORE8, PUSH operations, DUP operations,
/// SWAP operations
pub const GasFastestStep: u64 = 3;

/// Gas cost for multiplication and division operations
/// Operations: MUL, DIV, SDIV, MOD, SMOD, EXP (per byte of exponent)
pub const GasFastStep: u64 = 5;

/// Gas cost for advanced arithmetic operations
/// Operations: ADDMOD, MULMOD, SIGNEXTEND, KECCAK256 (base cost)
pub const GasMidStep: u64 = 8;

/// Gas cost for operations requiring moderate computation
/// Operations: JUMPI
pub const GasSlowStep: u64 = 10;

/// Gas cost for operations that interact with other accounts/contracts
/// Operations: BALANCE, EXTCODESIZE, BLOCKHASH
pub const GasExtStep: u64 = 20;

// ============================================================================
// Hashing Operation Costs
// ============================================================================

/// Base gas cost for KECCAK256 (SHA3) operation
/// This is the fixed cost regardless of input size
pub const Keccak256Gas: u64 = 30;

/// Additional gas cost per 32-byte word for KECCAK256
/// Total cost = Keccak256Gas + (word_count * Keccak256WordGas)
pub const Keccak256WordGas: u64 = 6;

// ============================================================================
// Storage Operation Costs (EIP-2929 & EIP-2200)
// ============================================================================

/// Gas cost for SLOAD on a warm storage slot
/// After EIP-2929, warm access is significantly cheaper than cold
pub const SloadGas: u64 = 100;

/// Gas cost for first-time (cold) SLOAD access in a transaction
/// EIP-2929: Prevents underpriced state access attacks
pub const ColdSloadCost: u64 = 2100;

/// Gas cost for first-time (cold) account access in a transaction
/// EIP-2929: Applied to BALANCE, EXTCODESIZE, EXTCODECOPY, EXTCODEHASH, CALL family
pub const ColdAccountAccessCost: u64 = 2600;

/// Gas cost for warm storage read operations
/// EIP-2929: Subsequent accesses to the same slot/account in a transaction
pub const WarmStorageReadCost: u64 = 100;

/// Minimum gas that must remain for SSTORE to succeed
/// Prevents storage modifications when gas is nearly exhausted
pub const SstoreSentryGas: u64 = 2300;

/// Gas cost for SSTORE when setting a storage slot from zero to non-zero
/// This is the most expensive storage operation as it increases state size
pub const SstoreSetGas: u64 = 20000;

/// Gas cost for SSTORE when changing an existing non-zero value to another non-zero value
/// Cheaper than initial set since slot is already allocated
pub const SstoreResetGas: u64 = 5000;

/// Gas cost for SSTORE when clearing a storage slot (non-zero to zero)
/// Same cost as reset, but eligible for gas refund
pub const SstoreClearGas: u64 = 5000;

/// Gas refund for clearing storage slot to zero
/// EIP-3529: Reduced from 15000 to prevent gas refund abuse
pub const SstoreRefundGas: u64 = 4800;
// ============================================================================
// Control Flow Costs
// ============================================================================

/// Gas cost for JUMPDEST opcode
/// Minimal cost as it's just a marker for valid jump destinations
pub const JumpdestGas: u64 = 1;

// ============================================================================
// Logging Operation Costs
// ============================================================================

/// Base gas cost for LOG operations (LOG0-LOG4)
/// This is the fixed cost before considering data size and topics
pub const LogGas: u64 = 375;

/// Gas cost per byte of data in LOG operations
/// Incentivizes efficient event data usage
pub const LogDataGas: u64 = 8;

/// Gas cost per topic in LOG operations
/// Each additional topic (LOG1, LOG2, etc.) adds this cost
pub const LogTopicGas: u64 = 375;

// ============================================================================
// Contract Creation and Call Costs
// ============================================================================

/// Base gas cost for CREATE opcode
/// High cost reflects the expense of deploying new contracts
pub const CreateGas: u64 = 32000;
/// Base gas cost for CALL operations
/// This is the minimum cost before additional charges
pub const CallGas: u64 = 40;

/// Gas stipend provided to called contract when transferring value
/// Ensures called contract has minimum gas to execute basic operations
pub const CallStipend: u64 = 2300;

/// Additional gas cost when CALL transfers value (ETH)
/// Makes value transfers more expensive to prevent spam
pub const CallValueTransferGas: u64 = 9000;

/// Additional gas cost when CALL creates a new account
/// Reflects the cost of adding a new entry to the state trie
pub const CallNewAccountGas: u64 = 25000;

// ============================================================================
// Call Operation Specific Costs (EIP-150)
// ============================================================================

/// Gas cost for CALL operations with value transfer
/// EIP-150: IO-heavy operations cost adjustments
pub const CallValueCost: u64 = 9000;

/// Gas cost for CALLCODE operations
/// EIP-150: Same base cost as other call operations
pub const CallCodeCost: u64 = 700;

/// Gas cost for DELEGATECALL operations
/// EIP-150: Introduced in Homestead hardfork
pub const DelegateCallCost: u64 = 700;

/// Gas cost for STATICCALL operations
/// EIP-214: Introduced in Byzantium hardfork
pub const StaticCallCost: u64 = 700;

/// Cost for creating a new account during calls
/// Applied when target account doesn't exist and value > 0
pub const NewAccountCost: u64 = 25000;

/// Base gas cost for SELFDESTRUCT operation
/// EIP-150 (Tangerine Whistle): Increased from 0 to 5000 gas
pub const SelfdestructGas: u64 = 5000;

/// Gas refund for SELFDESTRUCT operation
/// Incentivizes cleaning up unused contracts
/// Note: Removed in EIP-3529 (London)
pub const SelfdestructRefundGas: u64 = 24000;
// ============================================================================
// Memory Expansion Costs
// ============================================================================

/// Linear coefficient for memory gas calculation
/// Part of the formula: gas = MemoryGas * words + words² / QuadCoeffDiv
pub const MemoryGas: u64 = 3;

/// Quadratic coefficient divisor for memory gas calculation
/// Makes memory expansion quadratically expensive to prevent DoS attacks
pub const QuadCoeffDiv: u64 = 512;

// ============================================================================
// Contract Deployment Costs
// ============================================================================

/// Gas cost per byte of contract deployment code
/// Applied to the bytecode being deployed via CREATE/CREATE2
pub const CreateDataGas: u64 = 200;

/// Gas cost per 32-byte word of initcode
/// EIP-3860: Prevents deploying excessively large contracts
pub const InitcodeWordGas: u64 = 2;

/// Maximum allowed initcode size in bytes
/// EIP-3860: Limit is 49152 bytes (2 * MAX_CODE_SIZE)
pub const MaxInitcodeSize: u64 = 49152;

// ============================================================================
// Transaction Costs
// ============================================================================

/// Base gas cost for a standard transaction
/// Minimum cost for any transaction regardless of data or computation
pub const TxGas: u64 = 21000;

/// Base gas cost for contract creation transaction
/// Higher than standard tx due to contract deployment overhead
pub const TxGasContractCreation: u64 = 53000;

/// Gas cost per zero byte in transaction data
/// Cheaper than non-zero bytes to incentivize data efficiency
pub const TxDataZeroGas: u64 = 4;

/// Gas cost per non-zero byte in transaction data
/// Higher cost reflects increased storage and bandwidth requirements
pub const TxDataNonZeroGas: u64 = 16;

/// Gas cost per word for copy operations
/// Applied to CODECOPY, EXTCODECOPY, RETURNDATACOPY, etc.
pub const CopyGas: u64 = 3;

/// Maximum gas refund as a fraction of gas used
/// EIP-3529: Reduced from 1/2 to 1/5 to prevent refund abuse
pub const MaxRefundQuotient: u64 = 5;

// ============================================================================
// EIP-4844: Shard Blob Transactions
// ============================================================================

/// Gas cost for BLOBHASH opcode
/// Returns the hash of a blob associated with the transaction
pub const BlobHashGas: u64 = 3;

/// Gas cost for BLOBBASEFEE opcode
/// Returns the base fee for blob gas
pub const BlobBaseFeeGas: u64 = 2;

// ============================================================================
// EIP-1153: Transient Storage
// ============================================================================

/// Gas cost for TLOAD (transient storage load)
/// Transient storage is cleared after each transaction
pub const TLoadGas: u64 = 100;

/// Gas cost for TSTORE (transient storage store)
/// Same cost as TLOAD, much cheaper than persistent storage
pub const TStoreGas: u64 = 100;

// ============================================================================
// Precompile Operation Costs
// ============================================================================

/// Base gas cost for IDENTITY precompile (address 0x04)
/// Minimum cost regardless of input size
pub const IDENTITY_BASE_COST: u64 = 15;

/// Gas cost per 32-byte word for IDENTITY precompile
/// Total cost = IDENTITY_BASE_COST + (word_count * IDENTITY_WORD_COST)
pub const IDENTITY_WORD_COST: u64 = 3;

/// Base gas cost for SHA256 precompile (address 0x02)
/// Minimum cost regardless of input size
pub const SHA256_BASE_COST: u64 = 60;

/// Gas cost per 32-byte word for SHA256 precompile
/// Total cost = SHA256_BASE_COST + (word_count * SHA256_WORD_COST)
pub const SHA256_WORD_COST: u64 = 12;

/// Base gas cost for RIPEMD160 precompile (address 0x03)
/// Minimum cost regardless of input size
pub const RIPEMD160_BASE_COST: u64 = 600;

/// Gas cost per 32-byte word for RIPEMD160 precompile
/// Total cost = RIPEMD160_BASE_COST + (word_count * RIPEMD160_WORD_COST)
pub const RIPEMD160_WORD_COST: u64 = 120;

/// Base gas cost for ECRECOVER precompile (address 0x01)
/// Fixed cost for elliptic curve signature recovery
pub const ECRECOVER_COST: u64 = 3000;

// MODEXP Precompile Costs (EIP-2565)
// ============================================================================

/// Minimum gas cost for MODEXP precompile (address 0x05)
/// EIP-2565: Reduced from previous higher costs to provide gas optimization
pub const MODEXP_MIN_GAS: u64 = 200;

/// Threshold for quadratic complexity in MODEXP gas calculation
/// Inputs smaller than this use simple quadratic cost formula
pub const MODEXP_QUADRATIC_THRESHOLD: usize = 64;

/// Threshold for linear complexity in MODEXP gas calculation
/// Inputs between quadratic and linear thresholds use optimized formula
pub const MODEXP_LINEAR_THRESHOLD: usize = 1024;

// ============================================================================
// Call Operation Gas Constants (EIP-150 & EIP-2929)
// ============================================================================

/// Base gas cost for CALL operations when target account is warm
/// This is the minimum cost for any call operation
pub const CALL_BASE_COST: u64 = 100;

/// Gas cost for CALL operations when target account is cold (EIP-2929)
/// Cold account access is more expensive to prevent state access attacks
pub const CALL_COLD_ACCOUNT_COST: u64 = 2600;

/// Additional gas cost when CALL transfers value (ETH)
/// Makes value transfers more expensive to prevent spam
pub const CALL_VALUE_TRANSFER_COST: u64 = 9000;

/// Additional gas cost when CALL creates a new account
/// Reflects the cost of adding a new entry to the state trie
pub const CALL_NEW_ACCOUNT_COST: u64 = 25000;

/// Gas stipend provided to called contract when transferring value
/// Ensures called contract has minimum gas to execute basic operations
/// This gas cannot be used for value calls to prevent attack vectors
pub const GAS_STIPEND_VALUE_TRANSFER: u64 = 2300;

/// Divisor for the 63/64 gas retention rule
/// Caller retains 1/64 of available gas, forwards the rest
/// Formula: retained_gas = available_gas / CALL_GAS_RETENTION_DIVISOR
pub const CALL_GAS_RETENTION_DIVISOR: u64 = 64;

/// Calculate memory expansion gas cost
///
/// Computes the gas cost for expanding EVM memory from current_size to new_size bytes.
/// Memory expansion follows a quadratic cost formula to prevent DoS attacks.
///
/// ## Parameters
/// - `current_size`: Current memory size in bytes
/// - `new_size`: Requested new memory size in bytes
///
/// ## Returns
/// - Gas cost for the expansion (0 if new_size <= current_size)
///
/// ## Formula
/// The total memory cost for n words is: 3n + n²/512
/// Where a word is 32 bytes.
///
/// Pre-computed memory expansion costs for common sizes.
///
/// This lookup table stores the total memory cost for sizes up to 32KB (1024 words).
/// Using a LUT converts runtime calculations to O(1) lookups for common cases.
/// The formula is: 3n + n²/512 where n is the number of 32-byte words.
pub const MEMORY_EXPANSION_LUT = blk: {
    @setEvalBranchQuota(10000);
    const max_words = 1024; // Pre-compute for up to 32KB of memory
    var costs: [max_words]u64 = undefined;

    for (0..max_words) |words| {
        costs[words] = MemoryGas * words + (words * words) / QuadCoeffDiv;
    }

    break :blk costs;
};

/// The expansion cost is: total_cost(new_size) - total_cost(current_size)
///
/// ## Examples
/// - Expanding from 0 to 32 bytes (1 word): 3 + 0 = 3 gas
/// - Expanding from 0 to 64 bytes (2 words): 6 + 0 = 6 gas
/// - Expanding from 0 to 1024 bytes (32 words): 96 + 2 = 98 gas
/// - Expanding from 1024 to 2048 bytes: 294 - 98 = 196 gas
///
/// ## Edge Cases
/// - If new_size <= current_size, no expansion needed, returns 0
/// - Sizes are rounded up to the nearest word (32 bytes)
/// - At 32MB, gas cost exceeds 2 billion, effectively preventing larger allocations
///
/// ## Performance
/// - Uses pre-computed lookup table for sizes up to 32KB (O(1) lookup)
/// - Falls back to calculation for larger sizes
pub fn memory_gas_cost(current_size: u64, new_size: u64) u64 {
    if (new_size <= current_size) return 0;

    const current_words = (current_size + 31) / 32;
    const new_words = (new_size + 31) / 32;

    // Use lookup table for common cases (up to 32KB)
    if (new_words < MEMORY_EXPANSION_LUT.len) {
        const current_cost = if (current_words < MEMORY_EXPANSION_LUT.len)
            MEMORY_EXPANSION_LUT[@intCast(current_words)]
        else
            MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;

        return MEMORY_EXPANSION_LUT[@intCast(new_words)] - current_cost;
    }

    // Fall back to calculation for larger sizes
    const current_cost = MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
    const new_cost = MemoryGas * new_words + (new_words * new_words) / QuadCoeffDiv;
    return new_cost - current_cost;
}

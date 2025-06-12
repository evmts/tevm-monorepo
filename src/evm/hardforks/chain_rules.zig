const std = @import("std");
const Hardfork = @import("hardfork.zig").Hardfork;
const Log = @import("../log.zig");

/// Configuration for Ethereum protocol rules and EIP activations across hardforks.
///
/// This structure defines which Ethereum Improvement Proposals (EIPs) and protocol
/// rules are active during EVM execution. It serves as the central configuration
/// point for hardfork-specific behavior, enabling the EVM to correctly execute
/// transactions according to the rules of any supported Ethereum hardfork.
///
/// ## Purpose
/// The Ethereum protocol evolves through hardforks that introduce new features,
/// change gas costs, add opcodes, or modify execution semantics. This structure
/// encapsulates all these changes, allowing the EVM to maintain compatibility
/// with any point in Ethereum's history.
///
/// ## Default Configuration
/// By default, all fields are set to support the latest stable hardfork (Cancun),
/// ensuring new deployments get the most recent protocol features. Use the
/// `for_hardfork()` method to configure for specific historical hardforks.
///
/// ## Usage Pattern
/// ```zig
/// // Create rules for a specific hardfork
/// const rules = ChainRules.for_hardfork(.LONDON);
/// 
/// // Check if specific features are enabled
/// if (rules.IsEIP1559) {
///     // Use EIP-1559 fee market logic
/// }
/// ```
///
/// ## Hardfork Progression
/// The Ethereum mainnet hardfork progression:
/// 1. Frontier (July 2015) - Initial release
/// 2. Homestead (March 2016) - First major improvements
/// 3. DAO Fork (July 2016) - Emergency fork after DAO hack
/// 4. Tangerine Whistle (October 2016) - Gas repricing (EIP-150)
/// 5. Spurious Dragon (November 2016) - State cleaning (EIP-158)
/// 6. Byzantium (October 2017) - Major protocol upgrade
/// 7. Constantinople (February 2019) - Efficiency improvements
/// 8. Petersburg (February 2019) - Constantinople fix
/// 9. Istanbul (December 2019) - Gas cost adjustments
/// 10. Muir Glacier (January 2020) - Difficulty bomb delay
/// 11. Berlin (April 2021) - Gas improvements (EIP-2929)
/// 12. London (August 2021) - EIP-1559 fee market
/// 13. Arrow Glacier (December 2021) - Difficulty bomb delay
/// 14. Gray Glacier (June 2022) - Difficulty bomb delay
/// 15. The Merge (September 2022) - Proof of Stake transition
/// 16. Shanghai (April 2023) - Withdrawals enabled
/// 17. Cancun (March 2024) - Proto-danksharding
///
/// ## Memory Layout
/// This structure uses bool fields for efficient memory usage and fast access.
/// The compiler typically packs multiple bools together for cache efficiency.
pub const ChainRules = @This();

/// Homestead hardfork activation flag (March 2016).
///
/// ## Key Changes
/// - Fixed critical issues from Frontier release
/// - Introduced DELEGATECALL opcode (0xF4) for library pattern
/// - Changed difficulty adjustment algorithm
/// - Removed canary contracts
/// - Fixed gas cost inconsistencies
///
/// ## EVM Impact
/// - New opcode: DELEGATECALL for code reuse with caller's context
/// - Modified CREATE behavior for out-of-gas scenarios
/// - Changed gas costs for CALL operations
IsHomestead: bool = true,

/// EIP-150 "Tangerine Whistle" hardfork activation (October 2016).
///
/// ## Purpose
/// Addressed denial-of-service attack vectors by repricing operations
/// that were underpriced relative to their computational complexity.
///
/// ## Key Changes
/// - Increased gas costs for EXTCODESIZE, EXTCODECOPY, BALANCE, CALL, CALLCODE, DELEGATECALL
/// - Increased gas costs for SLOAD from 50 to 200
/// - 63/64 rule for CALL operations gas forwarding
/// - Max call depth reduced from 1024 to 1024 (stack-based)
///
/// ## Security Impact
/// Mitigated "Shanghai attacks" that exploited underpriced opcodes
/// to create transactions consuming excessive resources.
IsEIP150: bool = true,

/// EIP-158 "Spurious Dragon" hardfork activation (November 2016).
///
/// ## Purpose
/// State size reduction through removal of empty accounts,
/// complementing EIP-150's gas repricing.
///
/// ## Key Changes  
/// - Empty account deletion (nonce=0, balance=0, code empty)
/// - Changed SELFDESTRUCT refund behavior
/// - Introduced EXP cost increase for large exponents
/// - Replay attack protection via chain ID
///
/// ## State Impact
/// Significantly reduced state size by removing ~20 million empty
/// accounts created by previous attacks.
IsEIP158: bool = true,

/// EIP-1559 fee market mechanism activation (London hardfork).
///
/// ## Purpose
/// Revolutionary change to Ethereum's fee mechanism introducing
/// base fee burning and priority fees (tips).
///
/// ## Key Changes
/// - Dynamic base fee adjusted per block based on utilization
/// - Base fee burned, reducing ETH supply
/// - Priority fee (tip) goes to miners/validators
/// - New transaction type (Type 2) with maxFeePerGas and maxPriorityFeePerGas
/// - BASEFEE opcode (0x48) to access current base fee
///
/// ## Economic Impact
/// - More predictable gas prices
/// - ETH becomes deflationary under high usage
/// - Better UX with fee estimation
IsEIP1559: bool = true,

/// Constantinople hardfork activation (February 2019).
///
/// ## Purpose
/// Optimization-focused upgrade adding cheaper operations and
/// preparing for future scaling solutions.
///
/// ## Key Changes
/// - New opcodes: SHL (0x1B), SHR (0x1C), SAR (0x1D) for bitwise shifting
/// - New opcode: EXTCODEHASH (0x3F) for cheaper code hash access
/// - CREATE2 (0xF5) for deterministic contract addresses
/// - Reduced gas costs for SSTORE operations (EIP-1283)
/// - Delayed difficulty bomb by 12 months
///
/// ## Developer Impact
/// - Bitwise operations enable more efficient algorithms
/// - CREATE2 enables counterfactual instantiation patterns
/// - Cheaper storage operations for certain patterns
IsConstantinople: bool = true,

/// Petersburg hardfork activation (February 2019).
///
/// ## Purpose
/// Emergency fix to Constantinople, disabling EIP-1283 due to
/// reentrancy concerns discovered before mainnet deployment.
///
/// ## Key Changes
/// - Removed EIP-1283 (SSTORE gas metering) from Constantinople
/// - Kept all other Constantinople features
/// - Essentially Constantinople minus problematic EIP
///
/// ## Historical Note
/// Constantinople was deployed on testnet but postponed on mainnet
/// when security researchers found the reentrancy issue. Petersburg
/// represents the actually deployed version.
IsPetersburg: bool = true,

/// Istanbul hardfork activation (December 2019).
///
/// ## Purpose
/// Gas cost adjustments based on real-world usage data and addition
/// of new opcodes for layer 2 support.
///
/// ## Key Changes
/// - EIP-152: Blake2b precompile for interoperability
/// - EIP-1108: Reduced alt_bn128 precompile gas costs
/// - EIP-1344: CHAINID opcode (0x46) for replay protection  
/// - EIP-1884: Repricing for trie-size dependent opcodes
/// - EIP-2028: Reduced calldata gas cost (16 gas per non-zero byte)
/// - EIP-2200: Rebalanced SSTORE gas cost with stipend
///
/// ## Opcodes Added
/// - CHAINID (0x46): Returns the current chain ID
/// - SELFBALANCE (0x47): Get balance without expensive BALANCE call
///
/// ## Performance Impact
/// Significant reduction in costs for L2 solutions using calldata.
IsIstanbul: bool = true,

/// Berlin hardfork activation (April 2021).
///
/// ## Purpose
/// Major gas model reform introducing access lists and fixing
/// long-standing issues with state access pricing.
///
/// ## Key Changes
/// - EIP-2565: Reduced ModExp precompile gas cost
/// - EIP-2718: Typed transaction envelope framework
/// - EIP-2929: Gas cost increase for state access opcodes
/// - EIP-2930: Optional access lists (Type 1 transactions)
///
/// ## Access List Impact
/// - First-time SLOAD: 2100 gas (cold) vs 100 gas (warm)
/// - First-time account access: 2600 gas (cold) vs 100 gas (warm)
/// - Transactions can pre-declare accessed state for gas savings
///
/// ## Developer Considerations
/// Access lists allow contracts to optimize gas usage by pre-warming
/// storage slots and addresses they'll interact with.
IsBerlin: bool = true,

/// London hardfork activation (August 2021).
///
/// ## Purpose  
/// Most significant economic change to Ethereum, introducing base fee
/// burning and dramatically improving fee predictability.
///
/// ## Key Changes
/// - EIP-1559: Fee market reform with base fee burning
/// - EIP-3198: BASEFEE opcode (0x48) to read current base fee
/// - EIP-3529: Reduction in refunds (SELFDESTRUCT, SSTORE)
/// - EIP-3541: Reject contracts starting with 0xEF byte
/// - EIP-3554: Difficulty bomb delay
///
/// ## EIP-3541 Impact
/// Reserves 0xEF prefix for future EVM Object Format (EOF),
/// preventing deployment of contracts with this prefix.
///
/// ## Economic Changes
/// - Base fee burned makes ETH potentially deflationary
/// - Gas price volatility significantly reduced
/// - Better fee estimation and user experience
IsLondon: bool = true,

/// The Merge activation (September 2022).
///
/// ## Purpose
/// Historic transition from Proof of Work to Proof of Stake,
/// reducing energy consumption by ~99.95%.
///
/// ## Key Changes
/// - EIP-3675: Consensus layer transition
/// - EIP-4399: DIFFICULTY (0x44) renamed to PREVRANDAO
/// - Removed block mining rewards
/// - Block time fixed at ~12 seconds
///
/// ## PREVRANDAO Usage
/// The DIFFICULTY opcode now returns the previous block's RANDAO
/// value, providing a source of randomness from the beacon chain.
/// Not suitable for high-security randomness needs.
///
/// ## Network Impact
/// - No more uncle blocks
/// - Predictable block times
/// - Validators replace miners
IsMerge: bool = true,

/// Shanghai hardfork activation (April 2023).
///
/// ## Purpose
/// First major upgrade post-Merge, enabling validator withdrawals
/// and introducing efficiency improvements.
///
/// ## Key Changes
/// - EIP-3651: Warm COINBASE address (reduced gas for MEV)
/// - EIP-3855: PUSH0 opcode (0x5F) for gas efficiency
/// - EIP-3860: Limit and meter initcode size
/// - EIP-4895: Beacon chain withdrawals
///
/// ## PUSH0 Impact
/// New opcode that pushes zero onto stack for 2 gas,
/// replacing common pattern of `PUSH1 0` (3 gas).
///
/// ## Withdrawal Mechanism
/// Validators can finally withdraw staked ETH, completing
/// the Proof of Stake transition.
IsShanghai: bool = true,

/// Cancun hardfork activation (March 2024).
///
/// ## Purpose
/// Major scalability upgrade introducing blob transactions for L2s
/// and transient storage for advanced contract patterns.
///
/// ## Key Changes
/// - EIP-1153: Transient storage opcodes (TLOAD 0x5C, TSTORE 0x5D)
/// - EIP-4844: Proto-danksharding with blob transactions
/// - EIP-4788: Beacon block root in EVM
/// - EIP-5656: MCOPY opcode (0x5E) for memory copying
/// - EIP-6780: SELFDESTRUCT only in same transaction
/// - EIP-7516: BLOBBASEFEE opcode (0x4A)
///
/// ## Blob Transactions
/// New transaction type carrying data blobs (4096 field elements)
/// for L2 data availability at ~10x lower cost.
///
/// ## Transient Storage
/// Storage that persists only within a transaction, enabling
/// reentrancy locks and other patterns without permanent storage.
IsCancun: bool = true,

/// Prague hardfork activation flag (future upgrade).
///
/// ## Status
/// Not yet scheduled or fully specified. Expected to include:
/// - EOF (EVM Object Format) implementation
/// - Account abstraction improvements
/// - Further gas optimizations
///
/// ## Note
/// This flag is reserved for future use and should remain
/// false until Prague specifications are finalized.
IsPrague: bool = false,

/// Verkle trees activation flag (future upgrade).
///
/// ## Purpose
/// Fundamental change to Ethereum's state storage using Verkle trees
/// instead of Merkle Patricia tries for massive witness size reduction.
///
/// ## Expected Benefits
/// - Witness sizes reduced from ~10MB to ~200KB
/// - Enables stateless clients
/// - Improved sync times and network efficiency
///
/// ## Status
/// Under active research and development. Will require extensive
/// testing before mainnet deployment.
IsVerkle: bool = false,

/// Byzantium hardfork activation (October 2017).
///
/// ## Purpose
/// Major protocol upgrade adding privacy features and improving
/// smart contract capabilities.
///
/// ## Key Changes
/// - New opcodes: REVERT (0xFD), RETURNDATASIZE (0x3D), RETURNDATACOPY (0x3E)
/// - New opcode: STATICCALL (0xFA) for read-only calls
/// - Added precompiles for zkSNARK verification (alt_bn128)
/// - Difficulty bomb delay by 18 months
/// - Block reward reduced from 5 to 3 ETH
///
/// ## REVERT Impact
/// Allows contracts to revert with data, enabling better error
/// messages while still refunding remaining gas.
///
/// ## Privacy Features
/// zkSNARK precompiles enable privacy-preserving applications
/// like private transactions and scalability solutions.
IsByzantium: bool = true,

/// EIP-2930 optional access lists activation (Berlin hardfork).
///
/// ## Purpose
/// Introduces Type 1 transactions with optional access lists,
/// allowing senders to pre-declare state they'll access.
///
/// ## Benefits
/// - Mitigates breaking changes from EIP-2929 gas increases
/// - Allows gas savings by pre-warming storage slots
/// - Provides predictable gas costs for complex interactions
///
/// ## Transaction Format
/// Type 1 transactions include an access list of:
/// - Addresses to be accessed
/// - Storage keys per address to be accessed
///
/// ## Gas Savings
/// Pre-declaring access saves ~2000 gas per address and
/// ~2000 gas per storage slot on first access.
IsEIP2930: bool = true,

/// EIP-3198 BASEFEE opcode activation (London hardfork).
///
/// ## Purpose
/// Provides smart contracts access to the current block's base fee,
/// enabling on-chain fee market awareness.
///
/// ## Opcode Details
/// - BASEFEE (0x48): Pushes current block's base fee onto stack
/// - Gas cost: 2 (same as other block context opcodes)
///
/// ## Use Cases
/// - Fee estimation within contracts
/// - Conditional execution based on network congestion
/// - MEV-aware contract patterns
/// - Gas price oracles
///
/// ## Complementary to EIP-1559
/// Essential for contracts to interact properly with the
/// new fee market mechanism.
IsEIP3198: bool = true,

/// EIP-3651 warm COINBASE activation (Shanghai hardfork).
///
/// ## Purpose
/// Pre-warms the COINBASE address (block producer) to reduce gas costs
/// for common patterns, especially in MEV transactions.
///
/// ## Gas Impact
/// - Before: First COINBASE access costs 2600 gas (cold)
/// - After: COINBASE always costs 100 gas (warm)
///
/// ## MEV Considerations
/// Critical for MEV searchers and builders who frequently
/// interact with the block producer address for payments.
///
/// ## Implementation
/// The COINBASE address is added to the warm address set
/// at the beginning of transaction execution.
IsEIP3651: bool = true,

/// EIP-3855 PUSH0 instruction activation (Shanghai hardfork).
///
/// ## Purpose
/// Introduces dedicated opcode for pushing zero onto the stack,
/// optimizing a very common pattern in smart contracts.
///
/// ## Opcode Details
/// - PUSH0 (0x5F): Pushes 0 onto the stack
/// - Gas cost: 2 (base opcode cost)
/// - Replaces: PUSH1 0x00 (costs 3 gas)
///
/// ## Benefits
/// - 33% gas reduction for pushing zero
/// - Smaller bytecode (1 byte vs 2 bytes)
/// - Cleaner assembly code
///
/// ## Usage Statistics
/// Analysis showed ~11% of all PUSH operations push zero,
/// making this a significant optimization.
IsEIP3855: bool = true,

/// EIP-3860 initcode size limit activation (Shanghai hardfork).
///
/// ## Purpose
/// Introduces explicit limits and gas metering for contract creation
/// code to prevent DoS vectors and ensure predictable costs.
///
/// ## Key Limits
/// - Maximum initcode size: 49152 bytes (2x max contract size)
/// - Gas cost: 2 gas per 32-byte word of initcode
///
/// ## Affected Operations
/// - CREATE: Limited initcode size
/// - CREATE2: Limited initcode size
/// - Contract creation transactions
///
/// ## Security Rationale
/// Previously unlimited initcode could cause nodes to consume
/// excessive resources during contract deployment verification.
IsEIP3860: bool = true,

/// EIP-4895 beacon chain withdrawals activation (Shanghai hardfork).
///
/// ## Purpose
/// Enables validators to withdraw staked ETH from the beacon chain
/// to the execution layer, completing the PoS transition.
///
/// ## Mechanism
/// - Withdrawals are processed as system-level operations
/// - Not regular transactions - no gas cost or signature
/// - Automatically credited to withdrawal addresses
/// - Up to 16 withdrawals per block
///
/// ## Validator Operations
/// - Partial withdrawals: Excess balance above 32 ETH
/// - Full withdrawals: Complete exit from validation
///
/// ## Network Impact
/// Completes the Ethereum staking lifecycle, allowing validators
/// to access their staked funds and rewards.
IsEIP4895: bool = true,

/// EIP-4844 proto-danksharding activation (Cancun hardfork).
///
/// ## Purpose
/// Introduces blob-carrying transactions for scalable data availability,
/// reducing L2 costs by ~10-100x through temporary data storage.
///
/// ## Blob Details
/// - Size: 4096 field elements (~125 KB)
/// - Max per block: 6 blobs (~750 KB)
/// - Retention: ~18 days (4096 epochs)
/// - Separate fee market with blob base fee
///
/// ## New Components
/// - Type 3 transactions with blob commitments
/// - KZG commitments for data availability proofs
/// - Blob fee market independent of execution gas
/// - BLOBHASH opcode (0x49) to access blob commitments
///
/// ## L2 Impact
/// Dramatically reduces costs for rollups by providing
/// dedicated data availability layer.
IsEIP4844: bool = true,

/// EIP-1153 transient storage activation (Cancun hardfork).
///
/// ## Purpose
/// Introduces transaction-scoped storage that automatically clears
/// after execution, enabling efficient temporary data patterns.
///
/// ## New Opcodes
/// - TLOAD (0x5C): Load from transient storage
/// - TSTORE (0x5D): Store to transient storage
/// - Gas costs: 100 for TLOAD, 100 for TSTORE
///
/// ## Key Properties
/// - Cleared after each transaction (not persisted)
/// - Reverted on transaction failure
/// - Separate namespace from persistent storage
/// - More gas efficient than SSTORE/SLOAD for temporary data
///
/// ## Use Cases
/// - Reentrancy guards without storage slots
/// - Temporary computation results
/// - Cross-contract communication within transaction
IsEIP1153: bool = true,

/// EIP-5656 MCOPY instruction activation (Cancun hardfork).
///
/// ## Purpose
/// Native memory copying instruction replacing inefficient
/// loop-based implementations in smart contracts.
///
/// ## Opcode Details
/// - MCOPY (0x5E): Copy memory regions
/// - Stack: [dest_offset, src_offset, length]
/// - Gas: 3 + 3 * ceil(length / 32) + memory expansion
///
/// ## Performance Impact
/// - ~10x faster than Solidity's loop-based copying
/// - Reduces bytecode size for memory operations
/// - Critical for data-heavy operations
///
/// ## Common Patterns
/// Optimizes array copying, string manipulation, and
/// data structure operations in smart contracts.
IsEIP5656: bool = true,

/// EIP-3541 contract code prefix restriction (London hardfork).
///
/// ## Purpose
/// Reserves the 0xEF byte prefix for future EVM Object Format (EOF),
/// preventing deployment of contracts with this prefix.
///
/// ## Restrictions
/// - New contracts cannot start with 0xEF byte
/// - Applies to CREATE, CREATE2, and deployment transactions
/// - Existing contracts with 0xEF prefix remain valid
///
/// ## EOF Preparation
/// This reservation enables future introduction of:
/// - Structured contract format with metadata
/// - Separate code and data sections
/// - Static jumps and improved analysis
/// - Versioning for EVM upgrades
///
/// ## Developer Impact
/// Extremely rare in practice as 0xEF was not a valid opcode,
/// making accidental conflicts unlikely.
IsEIP3541: bool = true,

/// Creates a ChainRules configuration for a specific Ethereum hardfork.
///
/// This factory function generates the appropriate set of protocol rules
/// for any supported hardfork, enabling the EVM to execute transactions
/// according to historical consensus rules.
///
/// ## Parameters
/// - `hardfork`: The target hardfork to configure rules for
///
/// ## Returns
/// A fully configured ChainRules instance with all flags set appropriately
/// for the specified hardfork.
///
/// ## Algorithm
/// The function starts with all features enabled (latest hardfork) and then
/// selectively disables features that weren't available at the specified
/// hardfork. This approach ensures new features are automatically included
/// in the latest configuration.
///
/// ## Example
/// ```zig
/// // Configure EVM for London hardfork rules
/// const london_rules = ChainRules.for_hardfork(.LONDON);
/// 
/// // Configure EVM for historical execution (e.g., replaying old blocks)
/// const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
/// ```
///
/// ## Hardfork Ordering
/// Each hardfork case disables all features introduced after it,
/// maintaining historical accuracy for transaction replay and testing.
/// Mapping of chain rule fields to the hardfork in which they were introduced.
const HardforkRule = struct {
    field_name: []const u8,
    introduced_in: Hardfork,
};

/// Comptime-generated mapping of all chain rules to their introduction hardforks.
/// This data-driven approach replaces the massive switch statement.
/// Default chain rules for the latest hardfork (CANCUN).
/// Pre-generated at compile time for zero runtime overhead.
pub const DEFAULT = for_hardfork(.DEFAULT);

const HARDFORK_RULES = [_]HardforkRule{
    .{ .field_name = "IsHomestead", .introduced_in = .HOMESTEAD },
    .{ .field_name = "IsEIP150", .introduced_in = .TANGERINE_WHISTLE },
    .{ .field_name = "IsEIP158", .introduced_in = .SPURIOUS_DRAGON },
    .{ .field_name = "IsByzantium", .introduced_in = .BYZANTIUM },
    .{ .field_name = "IsConstantinople", .introduced_in = .CONSTANTINOPLE },
    .{ .field_name = "IsPetersburg", .introduced_in = .PETERSBURG },
    .{ .field_name = "IsIstanbul", .introduced_in = .ISTANBUL },
    .{ .field_name = "IsBerlin", .introduced_in = .BERLIN },
    .{ .field_name = "IsLondon", .introduced_in = .LONDON },
    .{ .field_name = "IsMerge", .introduced_in = .MERGE },
    .{ .field_name = "IsShanghai", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsCancun", .introduced_in = .CANCUN },
    // EIPs grouped by their hardfork
    .{ .field_name = "IsEIP1559", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP2930", .introduced_in = .BERLIN },
    .{ .field_name = "IsEIP3198", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP3541", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP3651", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP3855", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP3860", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP4895", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP4844", .introduced_in = .CANCUN },
    .{ .field_name = "IsEIP1153", .introduced_in = .CANCUN },
    .{ .field_name = "IsEIP5656", .introduced_in = .CANCUN },
};

pub fn for_hardfork(hardfork: Hardfork) ChainRules {
    var rules = ChainRules{}; // All fields default to true
    
    // Disable features that were introduced after the target hardfork
    inline for (HARDFORK_RULES) |rule| {
        // Use branch hint for the common case (later hardforks with more features)
        if (@intFromEnum(hardfork) < @intFromEnum(rule.introduced_in)) {
            @branchHint(.cold);
            @field(rules, rule.field_name) = false;
        } else {
            @branchHint(.likely);
        }
    }
    
    return rules;
}

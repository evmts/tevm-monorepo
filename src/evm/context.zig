const std = @import("std");
const Address = @import("Address");

/// Execution context providing transaction and block information to the EVM.
///
/// This structure encapsulates all environmental data that smart contracts
/// can access during execution. It provides the context needed for opcodes
/// like ORIGIN, TIMESTAMP, COINBASE, etc. to return appropriate values.
///
/// ## Purpose
/// The context separates environmental information from the VM's execution
/// state, enabling:
/// - Consistent environment across nested calls
/// - Easy testing with mock environments
/// - Support for historical block execution
/// - Fork simulation with custom parameters
///
/// ## Opcode Mapping
/// Context fields map directly to EVM opcodes:
/// - `tx_origin` → ORIGIN (0x32)
/// - `gas_price` → GASPRICE (0x3A)
/// - `block_number` → NUMBER (0x43)
/// - `block_timestamp` → TIMESTAMP (0x42)
/// - `block_coinbase` → COINBASE (0x41)
/// - `block_difficulty` → DIFFICULTY/PREVRANDAO (0x44)
/// - `block_gas_limit` → GASLIMIT (0x45)
/// - `chain_id` → CHAINID (0x46)
/// - `block_base_fee` → BASEFEE (0x48)
/// - `blob_hashes` → BLOBHASH (0x49)
///
/// ## Usage Example
/// ```zig
/// const context = Context.init_with_values(
///     .tx_origin = sender_address,
///     .gas_price = 20_000_000_000, // 20 gwei
///     .block_number = 15_000_000,
///     .block_timestamp = 1656633600,
///     .block_coinbase = miner_address,
///     .block_difficulty = 0, // post-merge
///     .block_gas_limit = 30_000_000,
///     .chain_id = 1, // mainnet
///     .block_base_fee = 15_000_000_000,
///     .blob_hashes = &.{},
///     .blob_base_fee = 1,
/// );
/// ```
const Context = @This();

/// The original sender address that initiated the transaction.
///
/// ## ORIGIN Opcode (0x32)
/// This value remains constant throughout all nested calls and
/// represents the externally-owned account (EOA) that signed the
/// transaction.
///
/// ## Security Warning
/// Using tx.origin for authentication is dangerous as it can be
/// exploited through phishing attacks. Always use msg.sender instead.
///
/// ## Example
/// EOA → Contract A → Contract B → Contract C
/// - tx.origin = EOA (same for all)
/// - msg.sender differs at each level
tx_origin: Address.Address = Address.zero(),
/// The gas price for the current transaction in wei.
///
/// ## GASPRICE Opcode (0x3A)
/// Returns the effective gas price that the transaction is paying:
/// - Legacy transactions: The specified gas price
/// - EIP-1559 transactions: min(maxFeePerGas, baseFee + maxPriorityFeePerGas)
///
/// ## Typical Values
/// - 1 gwei = 1,000,000,000 wei
/// - Mainnet: Usually 10-100 gwei
/// - Test networks: Often 0 or 1 gwei
gas_price: u256 = 0,
/// The current block number (height).
///
/// ## NUMBER Opcode (0x43)
/// Returns the number of the block being executed. Block numbers
/// start at 0 (genesis) and increment by 1 for each block.
///
/// ## Network Examples
/// - Mainnet genesis: 0
/// - The Merge: ~15,537,394
/// - Typical mainnet: >18,000,000
///
/// ## Use Cases
/// - Time-locked functionality
/// - Random number generation (pre-Merge)
/// - Historical reference points
block_number: u64 = 0,
/// The current block's timestamp in Unix seconds.
///
/// ## TIMESTAMP Opcode (0x42)
/// Returns seconds since Unix epoch (January 1, 1970).
/// Miners/validators can manipulate this within limits:
/// - Must be > parent timestamp
/// - Should be close to real time
///
/// ## Time Precision
/// - Pre-Merge: ~13 second blocks, loose precision
/// - Post-Merge: 12 second slots, more predictable
///
/// ## Security Note
/// Can be manipulated by miners/validators within ~15 seconds.
/// Not suitable for precise timing or as randomness source.
block_timestamp: u64 = 0,
/// The address of the block's miner/validator (beneficiary).
///
/// ## COINBASE Opcode (0x41)
/// Returns the address that receives block rewards and fees:
/// - Pre-Merge: Miner who found the block
/// - Post-Merge: Validator proposing the block
///
/// ## Special Values
/// - Zero address: Often used in tests
/// - Burn address: Some L2s burn fees
///
/// ## MEV Considerations
/// Searchers often send payments to block.coinbase for
/// transaction inclusion guarantees.
block_coinbase: Address.Address = Address.zero(),
/// Block difficulty (pre-Merge) or PREVRANDAO (post-Merge).
///
/// ## DIFFICULTY/PREVRANDAO Opcode (0x44)
/// The meaning changed at The Merge:
/// - Pre-Merge: Mining difficulty value
/// - Post-Merge: Previous block's RANDAO value
///
/// ## PREVRANDAO Usage
/// Provides weak randomness from beacon chain:
/// - NOT cryptographically secure
/// - Can be biased by validators
/// - Suitable only for non-critical randomness
///
/// ## Typical Values
/// - Pre-Merge: 10^15 to 10^16 range
/// - Post-Merge: Random 256-bit value
block_difficulty: u256 = 0,
/// Maximum gas allowed in the current block.
///
/// ## GASLIMIT Opcode (0x45)
/// Returns the total gas limit for all transactions in the block.
/// This limit is adjusted by miners/validators within protocol rules:
/// - Can change by max 1/1024 per block
/// - Target: 15M gas (100% full blocks)
/// - Max: 30M gas (200% full blocks)
///
/// ## Typical Values
/// - Mainnet: ~30,000,000
/// - Some L2s: 100,000,000+
///
/// ## EIP-1559 Impact
/// Elastic block sizes allow temporary increases to 2x target.
block_gas_limit: u64 = 0,
/// The chain identifier for replay protection.
///
/// ## CHAINID Opcode (0x46)
/// Returns the unique identifier for the current chain,
/// preventing transaction replay across different networks.
///
/// ## Common Values
/// - 1: Ethereum Mainnet
/// - 5: Goerli (deprecated)
/// - 11155111: Sepolia
/// - 137: Polygon
/// - 10: Optimism
/// - 42161: Arbitrum One
///
/// ## EIP-155
/// Introduced chain ID to prevent replay attacks where
/// signed transactions could be valid on multiple chains.
chain_id: u256 = 1,
/// The base fee per gas for the current block (EIP-1559).
///
/// ## BASEFEE Opcode (0x48)
/// Returns the minimum fee per gas that must be paid for
/// transaction inclusion. Dynamically adjusted based on
/// parent block's gas usage:
/// - Increases if blocks are >50% full
/// - Decreases if blocks are <50% full
/// - Changes by max 12.5% per block
///
/// ## Fee Calculation
/// Total fee = (base fee + priority fee) * gas used
/// Base fee is burned, priority fee goes to validator.
///
/// ## Typical Values
/// - Low congestion: 5-10 gwei
/// - Normal: 15-30 gwei  
/// - High congestion: 100+ gwei
block_base_fee: u256 = 0,
/// List of blob hashes for EIP-4844 blob transactions.
///
/// ## BLOBHASH Opcode (0x49)
/// Returns the hash of a blob at the specified index.
/// Blob transactions can include up to 6 blobs, each
/// containing ~125KB of data for L2 data availability.
///
/// ## Blob Properties
/// - Size: 4096 field elements (~125KB)
/// - Hash: KZG commitment of blob data
/// - Lifetime: ~18 days on chain
/// - Cost: Separate blob fee market
///
/// ## Empty for Non-Blob Transactions
/// Regular transactions have no blob hashes.
blob_hashes: []const u256 = &[_]u256{},
/// The base fee per blob gas for the current block (EIP-4844).
///
/// ## BLOBBASEFEE Opcode (0x4A)  
/// Returns the current base fee for blob gas, which uses
/// a separate fee market from regular transaction gas.
///
/// ## Blob Fee Market
/// - Independent from regular gas fees
/// - Target: 3 blobs per block
/// - Max: 6 blobs per block
/// - Adjusts similar to EIP-1559
///
/// ## Cost Calculation
/// Blob cost = blob_base_fee * blob_gas_used
/// Where blob_gas_used = num_blobs * 131,072
///
/// ## Typical Values
/// - Low usage: 1 wei
/// - High usage: Can spike significantly
blob_base_fee: u256 = 0,

/// Creates a new context with default values.
///
/// ## Default Values
/// - All addresses: Zero address (0x0000...0000)
/// - All numbers: 0
/// - Chain ID: 1 (Ethereum mainnet)
/// - Blob hashes: Empty array
///
/// ## Usage
/// ```zig
/// const context = Context.init();
/// // Suitable for basic testing, but usually you'll want
/// // to set more realistic values
/// ```
///
/// ## Warning
/// Default values may not be suitable for production use.
/// Consider using `init_with_values` for realistic contexts.
pub fn init() Context {
    return .{};
}

/// Creates a new context with specified values.
///
/// This constructor allows full control over all environmental
/// parameters, enabling accurate simulation of any blockchain state.
///
/// ## Parameters
/// - `tx_origin`: EOA that initiated the transaction
/// - `gas_price`: Effective gas price in wei
/// - `block_number`: Current block height
/// - `block_timestamp`: Unix timestamp in seconds
/// - `block_coinbase`: Block producer address
/// - `block_difficulty`: Difficulty or PREVRANDAO value
/// - `block_gas_limit`: Maximum gas for the block
/// - `chain_id`: Network identifier
/// - `block_base_fee`: EIP-1559 base fee
/// - `blob_hashes`: Array of blob hashes for EIP-4844
/// - `blob_base_fee`: Base fee for blob gas
///
/// ## Example
/// ```zig
/// const context = Context.init_with_values(
///     sender_address,           // tx_origin
///     20_000_000_000,          // gas_price: 20 gwei
///     18_500_000,              // block_number
///     1_700_000_000,           // block_timestamp
///     validator_address,        // block_coinbase
///     0,                       // block_difficulty (post-merge)
///     30_000_000,              // block_gas_limit
///     1,                       // chain_id: mainnet
///     15_000_000_000,          // block_base_fee: 15 gwei
///     &[_]u256{},              // blob_hashes: none
///     1,                       // blob_base_fee: minimum
/// );
/// ```
pub fn init_with_values(
    tx_origin: Address.Address,
    gas_price: u256,
    block_number: u64,
    block_timestamp: u64,
    block_coinbase: Address.Address,
    block_difficulty: u256,
    block_gas_limit: u64,
    chain_id: u256,
    block_base_fee: u256,
    blob_hashes: []const u256,
    blob_base_fee: u256,
) Context {
    return .{
        .tx_origin = tx_origin,
        .gas_price = gas_price,
        .block_number = block_number,
        .block_timestamp = block_timestamp,
        .block_coinbase = block_coinbase,
        .block_difficulty = block_difficulty,
        .block_gas_limit = block_gas_limit,
        .chain_id = chain_id,
        .block_base_fee = block_base_fee,
        .blob_hashes = blob_hashes,
        .blob_base_fee = blob_base_fee,
    };
}

/// Checks if the context represents Ethereum mainnet.
///
/// ## Returns
/// - `true` if chain_id == 1 (Ethereum mainnet)
/// - `false` for all other networks
///
/// ## Common Chain IDs
/// - 1: Ethereum Mainnet ✓
/// - 5: Goerli Testnet ✗
/// - 137: Polygon ✗
/// - 10: Optimism ✗
///
/// ## Usage
/// ```zig
/// if (context.is_eth_mainnet()) {
///     // Apply mainnet-specific logic
///     // e.g., different gas limits, precompiles
/// }
/// ```
///
/// ## Note
/// This is a convenience method. For checking other chains,
/// compare chain_id directly.
pub fn is_eth_mainnet(self: Context) bool {
    return self.chain_id == 1;
}

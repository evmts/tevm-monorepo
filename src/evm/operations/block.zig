/// Block information operations module for the EVM
/// 
/// This module defines operations that provide access to block-level information
/// such as block numbers, timestamps, hashes, and other blockchain metadata.
/// These operations are essential for smart contracts that need to interact with
/// blockchain state or implement time-based logic.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const block = opcodes.block;

/// BLOCKHASH operation (0x40): Get Block Hash
/// 
/// Returns the hash of one of the 256 most recent complete blocks.
/// The block number must be within the range [current_block - 256, current_block - 1].
/// Returns 0 if the block number is out of range or the block is not available.
/// 
/// Stack: [..., block_number] → [..., hash]
/// Gas: 20 (GasExtStep)
/// 
/// This operation is commonly used for randomness sources (though not truly random)
/// and for verifying recent blockchain history.
pub const BLOCKHASH = Operation{
    .execute = block.op_blockhash,
    .constant_gas = opcodes.gas_constants.GasExtStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// COINBASE operation (0x41): Get Block Miner Address
/// 
/// Pushes the address of the miner/validator who produced the current block.
/// This is the address that receives the block reward and transaction fees.
/// 
/// Stack: [...] → [..., coinbase_address]
/// Gas: 2 (GasQuickStep)
/// 
/// Often used in mining pool contracts or fee distribution mechanisms.
pub const COINBASE = Operation{
    .execute = block.op_coinbase,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// TIMESTAMP operation (0x42): Get Block Timestamp
/// 
/// Pushes the timestamp of the current block in Unix time (seconds since epoch).
/// Set by the block producer and must be greater than the parent block's timestamp.
/// 
/// Stack: [...] → [..., timestamp]
/// Gas: 2 (GasQuickStep)
/// 
/// Commonly used for time-based logic, though miners have some flexibility
/// in setting timestamps (typically ±15 seconds).
pub const TIMESTAMP = Operation{
    .execute = block.op_timestamp,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// NUMBER operation (0x43): Get Block Number
/// 
/// Pushes the current block number (height) onto the stack.
/// The genesis block is block 0.
/// 
/// Stack: [...] → [..., block_number]
/// Gas: 2 (GasQuickStep)
/// 
/// Used for logic that depends on blockchain progression or for
/// implementing time-locks based on block height.
pub const NUMBER = Operation{
    .execute = block.op_number,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// DIFFICULTY operation (0x44): Get Block Difficulty
/// 
/// Pushes the difficulty of the current block onto the stack.
/// After the merge (PoS transition), this opcode returns the PREVRANDAO value instead.
/// 
/// Stack: [...] → [..., difficulty/prevrandao]
/// Gas: 2 (GasQuickStep)
/// 
/// Pre-merge: Returns the proof-of-work difficulty.
/// Post-merge: Returns the PREVRANDAO beacon chain randomness value.
pub const DIFFICULTY = Operation{
    .execute = block.op_difficulty,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// GASLIMIT operation (0x45): Get Block Gas Limit
/// 
/// Pushes the gas limit of the current block onto the stack.
/// This is the maximum amount of gas that can be consumed by all transactions
/// in the block combined.
/// 
/// Stack: [...] → [..., gas_limit]
/// Gas: 2 (GasQuickStep)
/// 
/// Useful for contracts that need to adjust behavior based on network capacity.
pub const GASLIMIT = Operation{
    .execute = block.op_gaslimit,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// BASEFEE operation (0x48): Get Base Fee
/// 
/// Pushes the base fee per gas of the current block onto the stack.
/// The base fee is the minimum fee per gas required for transaction inclusion.
/// 
/// Stack: [...] → [..., base_fee]
/// Gas: 2 (GasQuickStep)
/// 
/// Introduced in London (EIP-1559) for dynamic fee markets.
/// Useful for contracts that need to calculate transaction costs or
/// implement gas price oracles.
pub const BASEFEE = Operation{
    .execute = block.op_basefee,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// BLOBHASH operation (0x49): Get Blob Versioned Hash
/// 
/// Returns the versioned hash of a blob associated with the current transaction.
/// Takes an index and returns the corresponding blob hash, or 0 if out of bounds.
/// 
/// Stack: [..., index] → [..., versioned_hash]
/// Gas: 3 (GasFastestStep)
/// 
/// Introduced in Cancun (EIP-4844) for blob transactions.
/// Used for data availability in Layer 2 scaling solutions.
pub const BLOBHASH = Operation{
    .execute = block.op_blobhash,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// BLOBBASEFEE operation (0x4A): Get Blob Base Fee
/// 
/// Pushes the current base fee per blob gas onto the stack.
/// This fee adjusts dynamically based on blob gas usage.
/// 
/// Stack: [...] → [..., blob_base_fee]
/// Gas: 2 (GasQuickStep)
/// 
/// Introduced in Cancun (EIP-4844) for blob transaction pricing.
/// Used by contracts that interact with blob data or need to calculate
/// blob transaction costs.
pub const BLOBBASEFEE = Operation{
    .execute = block.op_blobbasefee,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

# EIP-4844: Shard Blob Transactions

## Summary

EIP-4844 (aka Proto-Danksharding) introduces a new transaction type to Ethereum that handles "blobs" of data. This is a step toward full implementation of Danksharding, which is Ethereum's long-term scalability solution. Blob transactions allow for data to be temporarily available to the Ethereum network without being stored permanently in the EVM state, making it particularly useful for Layer 2 rollups.

## Key Features

1. **New Transaction Type**: A new transaction type (`BLOB_TX_TYPE = 0x03`) that can include large blobs of data not accessible to the EVM.

2. **Data Availability**: Blobs are committed to using KZG commitments, and the data is guaranteed to be available to the network for a limited time.

3. **New Opcodes**: Adds two new opcodes:
   - `BLOBHASH` (0x49): Returns the versioned hash of a blob at the provided index.
   - `BLOBBASEFEE` (0x4A): Returns the current blob base fee.

4. **Fee Market**: A separate fee market for blob data, which uses an elastic supply mechanism similar to EIP-1559.

5. **KZG Cryptography**: Introduces KZG cryptography via a new precompile for point evaluation verification.

## Opcodes Introduced

1. **BLOBHASH** (0x49)
   - Takes an index from the stack
   - Returns the versioned hash of the blob at that index
   - Gas cost: 3 gas

2. **BLOBBASEFEE** (0x4A)
   - Takes no inputs
   - Returns the current blob base fee
   - Gas cost: 2 gas

## Precompile Added

- **KZG Point Evaluation Precompile** (address 0x0A)
  - Verifies that a given evaluation point corresponds to a blob using KZG proof
  - Gas cost: 50,000 gas

## Practical Benefits

1. **Layer 2 Scalability**: Significantly reduces the cost for Layer 2 rollups to post data to Ethereum.

2. **Reduced Congestion**: Separates the blob data market from the execution fee market, reducing contention for block space.

3. **Data Availability**: Ensures data is available for a period of time without permanent storage costs.

4. **Decentralization**: Maintains Ethereum's decentralization by keeping data requirements manageable for node operators.

## Implementation Details

- Blobs are limited to 128 KB each
- Transactions can include up to 6 blobs
- Blob data is prunable after a period of time
- Blocks have a target of 3 blobs and a maximum of 6 blobs
- Blob gas price adjusts according to demand with a target of 3 blobs per block

## Added in Hardfork

- Cancun (March 2024)
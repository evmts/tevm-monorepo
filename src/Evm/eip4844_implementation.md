# EIP-4844 Implementation Details

## Overview

EIP-4844 (Shard Blob Transactions) adds support for blob-carrying transactions in Ethereum, which are designed to be more efficient for rollups. This implementation focuses on:

1. The two new opcodes: `BLOBHASH` and `BLOBBASEFEE`
2. The KZG Point Evaluation precompile
3. The necessary EVM and chain rule changes to support these features

## Implementation Components

### 1. Chain Rules Flag

In `Evm.zig`, we've added the `IsEIP4844` flag to the `ChainRules` struct to control whether EIP-4844 features are active:

```zig
/// Is EIP4844 rules enabled (Cancun, shard blob transactions)
/// Adds a new transaction type for data blobs (proto-danksharding)
IsEIP4844: bool = true,
```

This flag is properly set for different hardforks in the `forHardfork` method, ensuring it's only enabled for Cancun and later hardforks.

### 2. BLOBHASH Opcode (0x49)

The `BLOBHASH` opcode is implemented in `blob.zig`:

```zig
/// BLOBHASH opcode (EIP-4844)
/// Returns the versioned hash of the shard blob at the given index
pub fn opBlobHash(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-4844 is enabled
    if (!interpreter.evm.chainRules.IsEIP4844) {
        return ExecutionError.InvalidOpcode;
    }
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop the blob index from the stack
    const index = try frame.stack.pop();
    
    // Get blob versioned hash for the given index
    // Note: In a full implementation, we would check if the index is valid
    // and get the actual blob hash from the transaction
    var placeholder_hash: u256 = 0;
    
    // Push the blob hash onto the stack
    try frame.stack.push(placeholder_hash);
    
    return "";
}
```

The opcode:
- Checks if EIP-4844 is enabled
- Takes an index from the stack
- Would normally retrieve the hash of the blob at that index from transaction data
- Currently returns a placeholder value (in a full implementation, it would access real blob hashes)
- Has a gas cost of 3 (set in `JumpTable.zig` as `BlobHashGas`)

### 3. BLOBBASEFEE Opcode (0x4A)

The `BLOBBASEFEE` opcode is also implemented in `blob.zig`:

```zig
/// BLOBBASEFEE opcode (EIP-4844)
/// Returns the current blob base fee
pub fn opBlobBaseFee(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-4844 is enabled
    if (!interpreter.evm.chainRules.IsEIP4844) {
        return ExecutionError.InvalidOpcode;
    }
    
    // Get the current blob base fee
    // Note: In a full implementation, we would get the actual blob base fee
    // from the block header or environment
    var blob_base_fee: u256 = 1000000; // Placeholder value
    
    // Push the blob base fee onto the stack
    try frame.stack.push(blob_base_fee);
    
    return "";
}
```

The opcode:
- Checks if EIP-4844 is enabled
- Takes no inputs
- Would normally retrieve the current blob base fee from the block header
- Currently returns a placeholder value (in a full implementation, it would return the actual blob base fee)
- Has a gas cost of 2 (set in `JumpTable.zig` as `BlobBaseFeeGas`)

### 4. KZG Point Evaluation Precompile

The KZG Point Evaluation precompile is implemented in `precompile/kzg.zig`:

```zig
/// KZG point evaluation precompiled contract
pub const PointEvaluation = PrecompiledContract{
    .requiredGas = pointEvaluationRequiredGas,
    .run = pointEvaluationRun,
};

// Constants
const blobVerifyInputLength: usize = 192; // Expected input length for point evaluation
const blobCommitmentVersionKZG: u8 = 0x01; // Version byte for KZG commitments
// Returned when verification succeeds - specific value defined in the EIP-4844
const blobPrecompileReturnValue = "000000000000000000000000000000000000000000000000000000000000100073eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001";

// Implementation of gas calculation function
fn pointEvaluationRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.BlobTxPointEvaluationPrecompileGas;
}

// Implementation of execution function
fn pointEvaluationRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Check input length
    if (input.len != blobVerifyInputLength) {
        return error.InvalidInputLength;
    }
    
    // TODO: Implement actual KZG proof verification
    // For now, return the success value as a placeholder
    
    // Convert hex string to bytes
    const retLen = blobPrecompileReturnValue.len / 2;
    var output = try allocator.alloc(u8, retLen);
    
    var i: usize = 0;
    while (i < retLen) : (i += 1) {
        const highNibble = try hexCharToU4(blobPrecompileReturnValue[i * 2]);
        const lowNibble = try hexCharToU4(blobPrecompileReturnValue[i * 2 + 1]);
        output[i] = (highNibble << 4) | lowNibble;
    }
    
    return output;
}
```

The precompile:
- Verifies that the input follows the expected format (192 bytes)
- Would normally perform KZG proof verification
- Currently returns a placeholder success value
- Has a gas cost of 50,000 (set in `params.zig` as `BlobTxPointEvaluationPrecompileGas`)

### 5. Registration in Jump Table

The blob opcodes are registered in the jump table through the `registerBlobOpcodes` function in `blob.zig`:

```zig
/// Register blob opcodes in the jump table
pub fn registerBlobOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // BLOBHASH (0x49)
    const blobhash_op = try allocator.create(JumpTable.Operation);
    blobhash_op.* = JumpTable.Operation{
        .execute = opBlobHash,
        .constant_gas = BlobHashGas,
        .min_stack = JumpTable.minStack(1, 1),
        .max_stack = JumpTable.maxStack(1, 1),
    };
    jump_table.table[0x49] = blobhash_op;
    
    // BLOBBASEFEE (0x4A)
    const blobbasefee_op = try allocator.create(JumpTable.Operation);
    blobbasefee_op.* = JumpTable.Operation{
        .execute = opBlobBaseFee,
        .constant_gas = BlobBaseFeeGas,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x4A] = blobbasefee_op;
}
```

This ensures the opcodes are available at the correct locations in the EVM.

## Future Enhancements

While this implementation provides the basic infrastructure for EIP-4844, a full implementation would require:

1. **Transaction Type Support**: Add support for the new blob transaction type (0x03)

2. **Blob Data Handling**: Implement data structures to store and manage blobs

3. **Blob Gas Pricing**: Implement the elastic supply mechanism for blob gas pricing

4. **KZG Library Integration**: Integrate a KZG library for actual cryptographic operations

5. **Data Availability Sampling**: Implement mechanisms to ensure data availability

## Gas Costs

The gas costs for EIP-4844 operations are defined in `JumpTable.zig`:

```zig
// EIP-4844: Shard Blob Transactions
pub const BlobHashGas: u64 = 3;
pub const BlobBaseFeeGas: u64 = 2;
```

And for the precompile in `params.zig`:

```zig
// Cancun precompiles
pub const BlobTxPointEvaluationPrecompileGas: u64 = 50000; // Gas for KZG point evaluation
```

## Hardfork Configuration

The EIP-4844 flag is set in the hardfork configuration in `Evm.zig`:

```zig
pub fn forHardfork(hardfork: Hardfork) ChainRules {
    // ...
    switch (hardfork) {
        // Earlier hardforks...
        .Shanghai => {
            rules.IsCancun = false;
            rules.IsEIP4844 = false;
            // ...
        },
        .Cancun => {},  // All flags enabled by default
        // ...
    }
    // ...
}
```

## Usage Notes

1. **Blob Access**: Contracts can only access the versioned hashes of blobs, not the blob data itself.

2. **Transaction Limitations**: Blob transactions have certain limitations:
   - They cannot create contracts
   - They have a separate gas fee for the blob data
   - Blobs are limited in size and number per transaction

3. **Blob Lifecycle**: Blobs are only guaranteed to be available for a certain period, after which they may be pruned from the network.

4. **Fee Market**: The blob fee market operates separately from the regular transaction fee market, with its own target gas usage (equivalent to 3 blobs per block).
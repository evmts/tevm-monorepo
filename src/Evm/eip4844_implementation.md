# EIP-4844 Implementation: Shard Blob Transactions

## Overview

EIP-4844 (Shard Blob Transactions) adds support for blob-carrying transactions in Ethereum, which are designed to be more efficient for rollups. This implementation focuses on:

1. Two new opcodes: `BLOBHASH` (0x49) and `BLOBBASEFEE` (0x4A)
2. The KZG Point Evaluation precompile (0x0A)
3. The necessary EVM and chain rule changes to support these features

## Implementation Details

### 1. Chain Rules Flag

A new flag `IsEIP4844` has been added to the `ChainRules` struct in `Evm.zig`:

```zig
/// Is EIP4844 rules enabled (Cancun, shard blob transactions)
/// Adds a new transaction type for data blobs (proto-danksharding)
IsEIP4844: bool = true,
```

This flag is set appropriately for different hardforks in the `forHardfork` method, ensuring it's only enabled for Cancun and later.

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

#### Stack Behavior
- Pop: 1 item (blob index)
- Push: 1 item (versioned hash of the blob)

#### Gas Considerations
- Fixed cost: 3 gas (defined as `BlobHashGas` in JumpTable.zig)

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

#### Stack Behavior
- Pop: 0 items
- Push: 1 item (current blob base fee)

#### Gas Considerations
- Fixed cost: 2 gas (defined as `BlobBaseFeeGas` in JumpTable.zig)

### 4. KZG Point Evaluation Precompile (0x0A)

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

#### Gas Considerations
- Fixed cost: 50,000 gas (defined as `BlobTxPointEvaluationPrecompileGas` in params.zig)

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

## Activation

EIP-4844 is activated when the chain rules have `IsEIP4844` set to true. This is enabled by default for the Cancun hardfork and later, as specified in the `forHardfork` method:

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

## Testing

The implementation includes a test file (`eip4844.test.zig`) that verifies:
- The BLOBHASH opcode works as expected when EIP-4844 is enabled
- The BLOBBASEFEE opcode works as expected when EIP-4844 is enabled
- Both opcodes fail with an InvalidOpcode error when EIP-4844 is disabled
- The KZG Point Evaluation precompile handles inputs correctly

## Integration with Other EIPs

EIP-4844 builds on:
- EIP-1559 (Fee market change) - The blob fee market uses a similar elastic supply mechanism
- EIP-2718 (Typed transactions) - Defines a new transaction type (0x03) for blob transactions

## Future Enhancements

While this implementation provides the basic infrastructure for EIP-4844, a full implementation would require:

1. **Transaction Type Support**: Add support for the new blob transaction type (0x03)
2. **Blob Data Handling**: Implement data structures to store and manage blobs
3. **Blob Gas Pricing**: Implement the elastic supply mechanism for blob gas pricing
4. **KZG Library Integration**: Integrate a KZG library for actual cryptographic operations
5. **Data Availability Sampling**: Implement mechanisms to ensure data availability

## References

1. [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844)
2. [EIP-1559: Fee market change](https://eips.ethereum.org/EIPS/eip-1559)
3. [EIP-2718: Typed Transaction Envelope](https://eips.ethereum.org/EIPS/eip-2718)
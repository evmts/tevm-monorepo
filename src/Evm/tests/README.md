# EVM EIP Implementation Tests

This directory contains integration tests specifically focused on verifying the correct implementation of various Ethereum Improvement Proposals (EIPs) in the Tevm Ethereum Virtual Machine implementation.

Unlike the unit tests in the `../test` directory that focus on individual opcode behavior, these tests verify that the EVM correctly implements the complex state transition rules, gas calculations, and other behaviors defined in specific EIPs that have been included in Ethereum hardforks.

## Test Structure

Each file in this directory typically corresponds to a specific EIP, with tests that verify the implementation conforms to the specifications outlined in that proposal. The naming convention is `eip{number}.test.zig`, where `{number}` corresponds to the EIP number.

## Key EIPs Tested

### EIP-2200: Rebalance Storage Costs

Tests in `eip2200.test.zig` verify the implementation of net gas metering for SSTORE operations. This includes:

- Original value tracking for storage slots
- Correct gas cost calculation for various storage update scenarios
- Gas refunds for storage clearing and restoration
- Transaction atomicity with respect to storage updates

### EIP-2929: Gas Cost Increases for State Access Operations

Tests in `eip2929.test.zig` verify:

- Warm/cold account access cost differences
- Warm/cold storage access cost differences
- Access list functionality
- Proper state tracking for addresses and storage slots

### EIP-3198: BASEFEE Opcode

Tests in `eip3198.test.zig` confirm:

- The BASEFEE opcode correctly returns the block's base fee
- Appropriate gas costs are charged
- The opcode behaves correctly across different hardforks

### EIP-3541: Reject New Contracts Starting with the 0xEF Byte

Tests in `eip3541.test.zig` verify that:

- Contract creation fails if the code starts with the 0xEF byte
- The correct error is returned
- Pre-existing contracts with 0xEF byte still function

### EIP-3651: Warm COINBASE

Tests in `eip3651.test.zig` confirm:

- The COINBASE address is treated as warm by default
- Correct gas costs are applied for accessing the COINBASE address

### EIP-3855: PUSH0 Instruction

Tests in `eip3855.test.zig` verify:

- The PUSH0 opcode correctly pushes a zero value onto the stack
- Appropriate gas costs are charged
- The opcode behaves correctly in post-London hardforks

### EIP-3860: Limit and Meter Initcode

Tests in `eip3860.test.zig` verify:

- Proper limitation of contract initialization code
- Correct gas charging for contract creation based on code size
- Enforcement of maximum initcode size

### EIP-5656: MCOPY - Memory Copy

Tests in `eip5656.test.zig` confirm:

- The MCOPY instruction correctly copies data within memory
- Proper gas cost calculation including memory expansion costs
- Edge cases with overlapping source and destination regions

## Testing Methodology

These tests typically work by:

1. Setting up a controlled EVM environment with specific hardfork rules
2. Creating contracts or transactions that exercise the functionality specified by the EIP
3. Executing the EVM code and verifying the results
4. Validating gas consumption is correct according to the EIP specification
5. Testing edge cases and potential issues in the EIP implementation

## Mock Components

Many tests implement mock components to isolate testing to specific EIP functionality:

- `TestStateManager`: A mock state manager for testing storage operations
- `TestStorage`: A simplified storage implementation for testing

These mocks allow for controlled testing environments that focus on the specific rules and behaviors introduced by each EIP, without requiring a full blockchain implementation.

## Example Test Case

Here's a simplified example from the EIP-2200 tests:

```zig
// Test: Set storage slot from 0 to non-zero
{
    // Create bytecode: PUSH1 value, PUSH1 key, SSTORE, STOP
    const bytecode = &[_]u8{ 0x60, 0x01, 0x60, 0x01, 0x55, 0x00 };
    contract.code = bytecode;
    contract.gas = TEST_GAS;
    contract.gas_refund = 0;
    
    // Create frame and execute
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    _ = try evm.execute(&frame);
    
    // Calculate gas used - should be ~SstoreSetGas plus small overhead
    const gas_used = TEST_GAS - contract.gas;
    try testing.expect(gas_used >= JumpTable.SstoreSetGas);
    try testing.expect(gas_used < JumpTable.SstoreSetGas + 100);
    
    // No refund should be granted
    try testing.expectEqual(@as(u64, 0), contract.gas_refund);
}
```

## Real-World Compatibility

The EIP tests in this directory are particularly important for ensuring compatibility with the Ethereum mainnet, as they verify that the EVM implementation correctly handles the same state transition rules that were introduced through the Ethereum improvement process over time.

By ensuring that each EIP is correctly implemented, Tevm can maintain compatibility with smart contracts deployed on Ethereum and other EVM-compatible chains, regardless of which hardfork the contracts were deployed under.
# EIP-3855 Implementation: PUSH0 Opcode

## Overview

EIP-3855 (PUSH0 Opcode) introduces a new opcode, PUSH0 (0x5F), that pushes the constant value 0 onto the stack. This provides a gas-efficient way to push a zero value, which is a common operation in EVM code. The PUSH0 opcode was introduced in the Shanghai hardfork.

## Implementation Details

The implementation of EIP-3855 involves:

1. **PUSH0 Opcode**:
   - The opcode (0x5F) was already defined in the memory.zig file
   - Updated the implementation to check for `IsEIP3855` flag
   - The opcode simply pushes a 0 onto the stack when executed
   - Returns `ExecutionError.InvalidOpcode` if EIP-3855 is not enabled

2. **Gas Cost**:
   - The PUSH0 opcode has a fixed gas cost of 2 (GasQuickStep), consistent with other PUSH opcodes

3. **Jump Table Registration**:
   - The opcode (0x5F) is registered in the jump table in the `registerMemoryOpcodes` function

## Stack Behavior

- Push: 1 item (the constant value 0 as a 256-bit integer)
- Pop: 0 items

## Gas Considerations

- Fixed cost: 2 gas (GasQuickStep)
- No dynamic gas calculation needed as the operation is simple
- This provides a gas advantage over the previous approach of using PUSH1 followed by a zero byte, which costs 3 gas

## Activation

EIP-3855 is activated when the chain rules have `IsEIP3855` set to true. By default, this is enabled for the Shanghai hardfork and later.

## Testing

We've included a test file (`eip3855.test.zig`) that verifies:
- The PUSH0 opcode works as expected when EIP-3855 is enabled
- The PUSH0 opcode fails with an InvalidOpcode error when EIP-3855 is disabled

## Advantages

The addition of PUSH0 provides several benefits:

1. **Gas Efficiency**: Using PUSH0 (2 gas) instead of PUSH1 0x00 (3 gas) saves 1 gas for each zero push operation
2. **Code Size Reduction**: PUSH0 is 1 byte, while PUSH1 0x00 is 2 bytes, reducing contract size
3. **Compiler Optimization**: Allows compilers to generate more efficient bytecode when pushing zeros

## References

1. [EIP-3855: PUSH0 instruction](https://eips.ethereum.org/EIPS/eip-3855)
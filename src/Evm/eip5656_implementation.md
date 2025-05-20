# EIP-5656 Implementation: MCOPY Opcode

## Overview

EIP-5656 (MCOPY Opcode) introduces a new opcode, MCOPY (0x5E), that efficiently copies data within EVM memory. Before this EIP, to copy memory, contracts had to use a loop of MLOAD and MSTORE operations, which was inefficient in terms of both gas and code size. The MCOPY opcode provides a single instruction to copy a chunk of memory from one location to another.

## Implementation Details

The implementation of EIP-5656 involves:

1. **MCOPY Opcode**:
   - Adds a new opcode (0x5E) that takes three parameters from the stack:
     - Destination offset (where to copy to)
     - Source offset (where to copy from)
     - Length (how many bytes to copy)
   - Implements the memory copy operation using a temporary buffer to handle overlapping regions
   - Checks for out-of-bounds memory access and other error conditions
   - Returns `ExecutionError.InvalidOpcode` if EIP-5656 is not enabled

2. **Gas Calculation**:
   - Implements dynamic gas calculation based on memory expansion
   - Uses a fixed base cost plus a variable cost based on the number of words copied
   - Includes proper overflow checking to prevent gas calculation exploits

3. **Jump Table Registration**:
   - Registers the opcode (0x5E) in the jump table in the `registerBlobOpcodes` function
   - Sets up the operation with proper stack requirements (3 stack items required)
   - Configures memory size calculation for memory expansion costs

## Stack Behavior

- Pop: 3 items (destination offset, source offset, length)
- Push: 0 items

The operation pops its three arguments from the stack and does not push any result.

## Gas Considerations

- Dynamic gas calculation based on:
  - Memory expansion cost (same formula as other memory operations)
  - Base cost (CopyGas = 3 gas)
  - Additional cost of 1 gas per 32-byte word copied (rounded up)

## Activation

EIP-5656 is activated when the chain rules have `IsEIP5656` set to true. By default, this is enabled for the Cancun hardfork and later.

## Testing

We've included a test file (`eip5656.test.zig`) that verifies:
- The MCOPY opcode works as expected when EIP-5656 is enabled
- The MCOPY opcode fails with an InvalidOpcode error when EIP-5656 is disabled
- Memory is correctly copied from the source to the destination

The test creates a contract that initializes memory with values, uses MCOPY to copy a chunk of memory, and then returns part of the copied memory to verify the operation worked correctly.

## Advantages

The addition of MCOPY provides several benefits:

1. **Gas Efficiency**: Significantly more efficient than a loop of MLOAD and MSTORE operations
2. **Code Size Reduction**: Reduces contract bytecode size by replacing multiple instructions
3. **Safety**: Handles overlapping memory regions correctly, which can be error-prone with manual implementations
4. **Simplicity**: Makes memory copy operations easier to implement in high-level languages

## References

1. [EIP-5656: MCOPY - Memory Copy Instruction](https://eips.ethereum.org/EIPS/eip-5656)
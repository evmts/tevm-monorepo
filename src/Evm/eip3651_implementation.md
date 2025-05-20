# EIP-3651 Implementation: Warm COINBASE

## Overview

EIP-3651 (Warm COINBASE) is a simple improvement that makes the COINBASE address warm by default according to the EIP-2929 access list rules. This means that the first access to the COINBASE address in a transaction should be charged the warm access gas cost rather than the cold access gas cost.

## Implementation Details

The implementation of EIP-3651 involves two main changes:

1. **Transaction Initialization**:
   - At the start of transaction execution (Interpreter.run method), when the call depth is 1 (top-level call), we check if EIP-3651 is enabled.
   - If enabled, we mark the COINBASE address as warm in the access list.
   - This ensures that any subsequent access to the COINBASE address within the transaction is charged the warm access gas cost.

2. **COINBASE Opcode**:
   - The COINBASE opcode implementation remains unchanged, as it already has fixed gas costs.
   - However, we added documentation to clarify that the COINBASE address is already marked as warm due to EIP-3651.

## Gas Considerations

- Before EIP-3651: First access to COINBASE would cost 2,600 gas (cold access)
- After EIP-3651: Access to COINBASE always costs 100 gas (warm access)

This change is particularly beneficial for contracts that frequently access the COINBASE address, such as those implementing fee distribution to the block proposer.

## Activation

EIP-3651 is activated when the chain rules have IsEIP3651 set to true. By default, this is enabled for Shanghai hard fork and later.

## Testing

We've included a test file (`eip3651.test.zig`) that verifies:
- The COINBASE opcode works as expected
- The implementation marks the COINBASE address as warm at transaction start

## Integration with Other EIPs

EIP-3651 depends on:
- EIP-2929 (Gas cost increases for state access operations)

It works alongside other EIPs without conflicts, as it only affects the initial warmth status of the COINBASE address.

## References

1. [EIP-3651: Warm COINBASE](https://eips.ethereum.org/EIPS/eip-3651)
2. [EIP-2929: Gas cost increases for state access operations](https://eips.ethereum.org/EIPS/eip-2929)
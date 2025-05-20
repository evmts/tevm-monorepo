# EIP-3198 Implementation: BASEFEE Opcode

## Overview

EIP-3198 (BASEFEE Opcode) adds a new opcode, BASEFEE (0x48), that pushes the value of the block's base fee onto the stack. This base fee was introduced as part of the EIP-1559 fee market changes in the London hardfork.

## Implementation Details

The implementation of EIP-3198 involves:

1. **New Flag in Chain Rules**:
   - Added `IsEIP3198` flag to the `ChainRules` struct in `Evm.zig`
   - Set it to `true` by default for London hardfork and later
   - This flag clearly separates the EIP-1559 fee market feature from the BASEFEE opcode

2. **BASEFEE Opcode**:
   - The opcode (0x48) was already implemented in `block.zig`
   - Updated the implementation to check for `IsEIP3198` flag instead of `IsEIP1559`
   - The opcode returns the block's base fee (for testing, a constant value is used)

3. **Gas Cost**:
   - The BASEFEE opcode has a fixed gas cost of 2 (GasQuickStep), consistent with other similar opcodes like TIMESTAMP and COINBASE

## Stack Behavior

- Push: 1 item (the current block's base fee as a 256-bit integer)
- Pop: 0 items

## Gas Considerations

- Fixed cost: 2 gas (GasQuickStep)
- No dynamic gas calculation needed as the operation is simple

## Activation

EIP-3198 is activated when the chain rules have `IsEIP3198` set to true. By default, this is enabled for the London hardfork and later.

## Testing

We've included a test file (`eip3198.test.zig`) that verifies:
- The BASEFEE opcode works as expected when EIP-3198 is enabled
- The BASEFEE opcode fails with an InvalidOpcode error when EIP-3198 is disabled

## Integration with Other EIPs

EIP-3198 is related to:
- EIP-1559 (Fee market change) - The base fee value itself comes from the EIP-1559 fee market mechanism
- However, the opcode can be used independently of the fee market change, as it's just an accessor

In a complete implementation, this would retrieve the actual base fee from the block header, which is set according to the EIP-1559 mechanics.

## References

1. [EIP-3198: BASEFEE opcode](https://eips.ethereum.org/EIPS/eip-3198)
2. [EIP-1559: Fee market change](https://eips.ethereum.org/EIPS/eip-1559)
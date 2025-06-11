# Implement Call Gas Management

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_call_gas_management` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_call_gas_management feat_implement_call_gas_management`
3. **Work in isolation**: `cd g/feat_implement_call_gas_management`
4. **Commit message**: `✨ feat: implement 63/64th gas forwarding rule for call operations`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the 63/64th gas forwarding rule for call operations in the EVM. This is a critical system feature that determines how much gas is forwarded to subcalls, preventing malicious contracts from consuming all available gas while still allowing legitimate operations to complete.

## ELI5

Think of gas like fuel in a car - when one contract calls another contract, it's like one driver asking another driver to help with an errand. The 63/64th rule says the first driver must keep at least 1/64th of their fuel for themselves (about 1.6%), so they can still drive home even if the second driver uses up most of the shared fuel. This prevents the second driver from stranding the first driver by using all the gas.

## EVM Specification

### Gas Forwarding Rule
- **Rule**: When making a call, forward at most 63/64th of available gas
- **Retention**: Always retain at least 1/64th of gas for post-call operations
- **Applies to**: CALL, CALLCODE, DELEGATECALL, STATICCALL, CREATE, CREATE2
- **Purpose**: Prevent gas exhaustion attacks while allowing deep call stacks

### Mathematical Formula
```
gas_to_forward = min(requested_gas, available_gas - floor(available_gas / 64))
retained_gas = available_gas - gas_to_forward
```

## Implementation Requirements

### Core Functionality
1. **Gas Calculation**: Implement 63/64th forwarding calculation
2. **Call Integration**: Apply rule to all call operations
3. **Error Handling**: Proper out-of-gas detection
4. **Post-Call Gas**: Track remaining gas after call completion

### Files to Modify
- `/src/evm/execution/system.zig` - Update call operations
- `/src/evm/constants/gas_constants.zig` - Add gas forwarding constants
- `/src/evm/frame.zig` - Gas tracking utilities
- `/test/evm/gas/gas_accounting_test.zig` - Add comprehensive tests

## Success Criteria

1. **Gas Forwarding**: Correctly implements 63/64th rule for all call types
2. **Gas Retention**: Always retains minimum 1/64th gas for caller
3. **Ethereum Compatibility**: Matches mainnet behavior for gas calculations
4. **Test Coverage**: Comprehensive tests for edge cases and gas accounting
5. **Integration**: Works properly with existing call infrastructure

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test gas calculations thoroughly** - Use known test vectors
3. **Handle edge cases** - Zero gas, minimal gas, maximum gas scenarios
4. **Maintain call compatibility** - Don't break existing call operations
# Implement Call Gas Management

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_call_gas_management` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_call_gas_management feat_implement_call_gas_management`
3. **Work in isolation**: `cd g/feat_implement_call_gas_management`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

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

## Relevant Implementation Files

**Primary Files to Modify:**
- `/src/evm/execution/system.zig` - Contains call operations (CALL, CALLCODE, DELEGATECALL, STATICCALL, CREATE, CREATE2) that need 63/64th gas forwarding rule
- `/src/evm/constants/gas_constants.zig` - Gas constants and calculations where forwarding constants should be added
- `/src/evm/frame.zig` - Call frame management with gas tracking utilities and frame lifecycle

**Supporting Files:**
- `/src/evm/call_result.zig` - Call result handling that tracks remaining gas after calls
- `/src/evm/vm.zig` - Main VM execution loop that coordinates call gas management

**Test Files:**
- `/test/evm/opcodes/system_test.zig` - Tests for system opcodes including call operations
- `/test/evm/gas/gas_accounting_test.zig` - Gas accounting verification and 63/64th rule tests

**Why These Files:**
- system.zig contains CallInput and CallType structures that need gas forwarding logic implementation
- frame.zig manages gas tracking across call boundaries and needs updates for retained gas calculation
- The VM currently has basic call infrastructure but lacks proper gas forwarding rules
- Existing gas tests provide framework for validating the 63/64th rule implementation

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
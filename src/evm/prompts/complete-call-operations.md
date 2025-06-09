# Complete CALL Operations Implementation

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_complete_call_operations` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_complete_call_operations feat_complete_call_operations`
3. **Work in isolation**: `cd g/feat_complete_call_operations`
4. **Commit message**: `✨ feat: complete CALL operations implementation`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Complete the implementation of CALL operations (CALL, CALLCODE, DELEGATECALL, STATICCALL) with proper gas tracking, execution flow, and context switching. The basic implementation exists but needs full gas validation, 63/64th gas forwarding rule, return data handling, and value transfer logic.

## Ethereum Specification

### CALL Operations Overview
- **CALL** (0xF1) - External call with new context and ETH transfer
- **CALLCODE** (0xF2) - External call with caller's context (deprecated)
- **DELEGATECALL** (0xF4) - External call preserving msg.sender and msg.value
- **STATICCALL** (0xFA) - Read-only external call (no state changes)

### Gas Forwarding Rules (EIP-150)
- **63/64th Rule**: Maximum 63/64 of available gas forwarded to sub-call
- **Gas Stipend**: 2300 gas provided for value transfers
- **Call Cost**: Base cost varies by operation and conditions

## Implementation Requirements

### Core Components
1. **Gas Management** - 63/64th forwarding rule and stipends
2. **Context Switching** - Proper isolation between call contexts
3. **Value Transfer** - ETH transfer mechanics and validation
4. **Return Data** - Complete RETURNDATASIZE/RETURNDATACOPY handling
5. **Static Call Protection** - Enforce read-only semantics
6. **Call Depth Limits** - 1024 call depth enforcement

## Implementation Tasks

### Task 1: Complete Gas Management
File: `/src/evm/execution/system.zig`

### Task 2: Implement Context Switching
File: `/src/evm/frame.zig`

### Task 3: Value Transfer Implementation
File: `/src/evm/vm.zig`

### Task 4: Return Data Handling
File: `/src/evm/execution/environment.zig`

### Task 5: Static Call Protection
File: `/src/evm/execution/storage.zig`

### Task 6: Call Depth Limits
File: `/src/evm/vm.zig`

## Testing Requirements

### Test File
Create `/test/evm/opcodes/call_operations_test.zig`

### Test Cases
1. **Gas Forwarding**: Verify 63/64th rule implementation
2. **Value Transfers**: ETH transfer mechanics and edge cases
3. **Context Switching**: Proper caller/address/value contexts
4. **Return Data**: RETURNDATASIZE/RETURNDATACOPY after calls
5. **Static Call Protection**: State modification prevention
6. **Call Depth Limits**: 1024 depth enforcement

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Verify gas accounting** - Must match Ethereum specification exactly
3. **Test all call types** - CALL, CALLCODE, DELEGATECALL, STATICCALL
4. **Context isolation** - Proper separation between call contexts
5. **Return data handling** - Complete implementation of return data opcodes
6. **Static call enforcement** - All state modifications must be prevented

## Success Criteria

1. **Gas Accuracy**: Exact gas costs and forwarding match specification
2. **Context Correctness**: All call types maintain proper contexts
3. **Value Transfer**: ETH transfers work correctly with proper validation
4. **Return Data**: RETURNDATASIZE/RETURNDATACOPY work correctly
5. **Static Protection**: Static calls properly prevent state changes
6. **Performance**: No significant regression in call performance

## References

- [Ethereum Yellow Paper - Message Calls](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EIP-150: Gas cost changes for IO-heavy operations](https://eips.ethereum.org/EIPS/eip-150)
- [EIP-214: New opcode STATICCALL](https://eips.ethereum.org/EIPS/eip-214)
- [EIP-2929: Gas cost increases for state access opcodes](https://eips.ethereum.org/EIPS/eip-2929)
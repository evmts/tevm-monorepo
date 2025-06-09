# Implement SELFDESTRUCT Opcode

**BEING WORKED ON** - Started by Claude on 2025-01-08

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_selfdestruct_opcode` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_selfdestruct_opcode feat_implement_selfdestruct_opcode`
3. **Work in isolation**: `cd g/feat_implement_selfdestruct_opcode`
4. **Commit message**: `✨ feat: implement SELFDESTRUCT opcode`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the SELFDESTRUCT (0xFF) opcode for Ethereum Virtual Machine compatibility. SELFDESTRUCT is a complex opcode that destroys a contract, sends its balance to a recipient, and has nuanced behavior across different hardforks.

## Ethereum Specification

### Basic Operation
- **Opcode**: `0xFF` (255)
- **Stack**: `address` → (empty)
- **Function**: Destroys current contract and sends balance to target address
- **Gas**: Base cost varies by hardfork, plus potential recipient creation cost

### Hardfork Evolution
1. **Frontier-Tangerine Whistle**: 0 gas cost
2. **Tangerine Whistle (EIP-150)**: 5000 gas base cost
3. **Spurious Dragon (EIP-161)**: Added account creation cost (25000 gas)
4. **London (EIP-3529)**: Removed gas refunds
5. **Cancun (EIP-6780)**: Only works in same transaction as contract creation

## Reference Implementations

### evmone Implementation
File: Search for `selfdestruct` in evmone codebase for gas costs and implementation details

### revm Implementation  
File: Search for `selfdestruct` in revm codebase for modern EIP-6780 behavior

## Implementation Requirements

### Core Functionality
1. **Balance Transfer**: Move contract balance to recipient address
2. **Contract Destruction**: Mark contract for destruction (happens at end of transaction)
3. **Gas Calculation**: Complex gas costs based on hardfork and recipient state
4. **Static Call Protection**: SELFDESTRUCT is forbidden in static contexts
5. **EIP-6780 Compliance**: Restricted behavior in Cancun+ hardforks

### Gas Cost Calculation
```zig
// Pseudo-code for gas calculation
pub fn calculate_selfdestruct_gas(recipient: Address, hardfork: Hardfork, state: *State) u64 {
    var gas_cost: u64 = switch (hardfork) {
        .Frontier, .Homestead, .DAO => 0,
        .TangerineWhistle => 5000,
        else => 5000,
    };
    
    // EIP-161: Add account creation cost if recipient doesn't exist
    if (hardfork >= .SpuriousDragon) {
        if (!state.account_exists(recipient)) {
            gas_cost += 25000;
        }
    }
    
    return gas_cost;
}
```

### EIP-6780 Restrictions (Cancun+)
```zig
// SELFDESTRUCT only works if contract was created in same transaction
if (hardfork >= .Cancun) {
    if (!frame.contract_created_in_current_tx) {
        // Only transfer balance, don't destroy contract
        return transfer_balance_only();
    }
}
```

## Integration Points

### Files to Modify
- `/src/evm/execution/system.zig` - Add `op_selfdestruct` function
- `/src/evm/jump_table/jump_table.zig` - Add SELFDESTRUCT operation config
- `/src/evm/opcodes/opcode.zig` - Add SELFDESTRUCT opcode enum
- `/src/evm/constants/gas_constants.zig` - Add SELFDESTRUCT gas costs
- `/src/evm/state/state.zig` - Add contract destruction tracking

### State Management
- Track contracts marked for destruction
- Handle balance transfers
- Implement end-of-transaction cleanup
- Track contract creation for EIP-6780

## Implementation Tasks

### Task 1: Add Opcode Definition
File: `/src/evm/opcodes/opcode.zig`
```zig
pub const SELFDESTRUCT: u8 = 0xFF;
```

### Task 2: Implement Operation
File: `/src/evm/execution/system.zig`
```zig
pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    // Implementation details
}
```

### Task 3: Add Jump Table Entry
File: `/src/evm/jump_table/jump_table.zig`
Add SELFDESTRUCT operation with appropriate gas costs and hardfork availability

### Task 4: State Destruction Tracking
File: `/src/evm/state/state.zig`
- Add `mark_for_destruction` method
- Add `is_marked_for_destruction` method
- Handle balance transfers
- Implement cleanup logic

### Task 5: Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
pub const SELFDESTRUCT_BASE_COST: u64 = 5000;
pub const ACCOUNT_CREATION_COST: u64 = 25000;
```

### Task 6: Hardfork Rules
File: `/src/evm/hardforks/chain_rules.zig`
Add validation for SELFDESTRUCT availability and behavior

## Testing Requirements

### Test File
Create `/test/evm/opcodes/selfdestruct_test.zig`

### Test Cases
1. **Basic Functionality**: Contract destruction and balance transfer
2. **Gas Costs**: Verify gas consumption across hardforks
3. **Recipient Creation**: Test 25000 gas cost for new accounts
4. **Static Call Protection**: Verify failure in static contexts
5. **EIP-6780 Restrictions**: Test Cancun+ behavior
6. **Edge Cases**: Zero balance, self-destruction to self, non-existent recipients
7. **Hardfork Compatibility**: Test behavior across all hardforks

## Complex Scenarios

### State Tracking Challenges
1. **Transaction Scope**: Destruction happens at transaction end, not immediately
2. **Reentrancy**: Multiple SELFDESTRUCT calls in same transaction
3. **Balance Updates**: Handling balance changes after marking for destruction
4. **Storage Access**: Contract can still access storage after SELFDESTRUCT

### EIP-6780 Implementation
```zig
// Track contract creation in current transaction
pub const Frame = struct {
    contract_created_in_tx: bool = false,
    // ... other fields
};
```

## Success Criteria

1. **Ethereum Compatibility**: Passes all Ethereum Foundation SELFDESTRUCT tests
2. **Hardfork Support**: Correct behavior from Frontier through Cancun+
3. **Gas Accuracy**: Exact gas costs match reference implementations
4. **State Consistency**: Proper destruction tracking and cleanup
5. **EIP-6780 Compliance**: Restricted behavior in Cancun+ hardforks
6. **Performance**: No significant impact on EVM execution speed

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test across all hardforks** - Behavior changes significantly
3. **Handle transaction-scope destruction** - Not immediate destruction
4. **Implement EIP-6780 restrictions** - Critical for Cancun+ compatibility
5. **Verify gas costs exactly** - Complex calculation with multiple factors
6. **Static call protection** - Must fail in read-only contexts

## References

- [EIP-6780: SELFDESTRUCT only in same transaction](https://eips.ethereum.org/EIPS/eip-6780)
- [EIP-150: Gas cost changes](https://eips.ethereum.org/EIPS/eip-150)
- [EIP-161: State trie clearing](https://eips.ethereum.org/EIPS/eip-161)
- [EIP-3529: Removal of refunds](https://eips.ethereum.org/EIPS/eip-3529)
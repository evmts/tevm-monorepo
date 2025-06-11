# Implement SELFDESTRUCT Opcode

**BEING WORKED ON** - Started by Claude on 2025-01-08

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_selfdestruct_opcode` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_selfdestruct_opcode feat_implement_selfdestruct_opcode`
3. **Work in isolation**: `cd g/feat_implement_selfdestruct_opcode`
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

Implement the SELFDESTRUCT (0xFF) opcode for Ethereum Virtual Machine compatibility. SELFDESTRUCT is a complex opcode that destroys a contract, sends its balance to a recipient, and has nuanced behavior across different hardforks.

## Relevant Implementation Files

**Primary Files to Modify:**
- `/src/evm/execution/system.zig` - System operations including SELFDESTRUCT
- `/src/evm/state/state.zig` - State modifications for contract deletion

**Supporting Files:**
- `/src/evm/opcodes/operation.zig` - Opcode definitions
- `/src/evm/constants/gas_constants.zig` - SELFDESTRUCT gas costs
- `/src/evm/hardforks/chain_rules.zig` - Hardfork-specific behavior changes

**Test Files:**
- `/test/evm/opcodes/system_test.zig` - System opcode tests
- `/test/evm/selfdestruct_test.zig` - SELFDESTRUCT specific tests

**Why These Files:**
- System operations handle the SELFDESTRUCT opcode implementation
- State management handles contract deletion and balance transfers
- Hardfork rules determine behavior changes across different Ethereum versions
- Gas constants define costs that vary by hardfork
- Comprehensive tests ensure proper behavior across all scenarios

## ELI5

SELFDESTRUCT is like a controlled demolition of a building. When a smart contract calls SELFDESTRUCT, it's saying "tear down this building and send all the money inside to this specific address." Just like real demolition, there are strict rules about when and how it can happen - newer Ethereum versions have made the rules stricter to prevent abuse, similar to requiring more permits for demolition in densely populated areas.

The complexity comes from different Ethereum "eras" having different demolition rules:
- **Pre-London**: Like having loose demolition permits - contracts could self-destruct easily and even get gas refunds
- **Post-London**: Like stricter building codes - no more gas refunds and tighter restrictions
- **Future versions**: Even more controlled, ensuring demolished contracts can't cause unexpected side effects

This opcode needs careful implementation because a contract's self-destruction affects not just itself, but potentially other contracts that interact with it, like how demolishing a building affects the whole neighborhood.

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

### geth

<explanation>
The go-ethereum implementation shows two distinct SELFDESTRUCT implementations: the original (opSelfdestruct) and EIP-6780 version (opSelfdestruct6780). Key patterns include read-only protection, balance transfer logic, state destruction calling, proper tracing, and returning errStopToken to halt execution. The gas calculation handles different hardfork rules and recipient creation costs.
</explanation>

**Gas Constants** - `/go-ethereum/params/protocol_params.go` (lines 90, 115, 126-129):
```go
SelfdestructRefundGas uint64 = 24000 // Refunded following a selfdestruct operation.
SelfdestructGasEIP150        uint64 = 5000 // Cost of SELFDESTRUCT post EIP 150 (Tangerine)
// CreateBySelfdestructGas is used when the refunded account is one that does
// not exist. This logic is similar to call.
// Comes from EIP161 spec: http://eips.ethereum.org/EIPS/eip-161
CreateBySelfdestructGas uint64 = 25000
```

**Original SELFDESTRUCT Implementation** - `/go-ethereum/core/vm/instructions.go` (lines 885-900):
```go
func opSelfdestruct(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	beneficiary := scope.Stack.pop()
	balance := interpreter.evm.StateDB.GetBalance(scope.Contract.Address())
	interpreter.evm.StateDB.AddBalance(beneficiary.Bytes20(), balance, tracing.BalanceIncreaseSelfdestruct)
	interpreter.evm.StateDB.SelfDestruct(scope.Contract.Address())
	if tracer := interpreter.evm.Config.Tracer; tracer != nil {
		if tracer.OnEnter != nil {
			tracer.OnEnter(interpreter.evm.depth, byte(SELFDESTRUCT), scope.Contract.Address(), beneficiary.Bytes20(), []byte{}, 0, balance.ToBig())
		}
		if tracer.OnExit != nil {
			tracer.OnExit(interpreter.evm.depth, []byte{}, 0, nil, false)
		}
	}
	return nil, errStopToken
}
```

**EIP-6780 SELFDESTRUCT Implementation** - `/go-ethereum/core/vm/instructions.go` (lines 904-920):
```go
func opSelfdestruct6780(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	beneficiary := scope.Stack.pop()
	balance := interpreter.evm.StateDB.GetBalance(scope.Contract.Address())
	interpreter.evm.StateDB.SubBalance(scope.Contract.Address(), balance, tracing.BalanceDecreaseSelfdestruct)
	interpreter.evm.StateDB.AddBalance(beneficiary.Bytes20(), balance, tracing.BalanceIncreaseSelfdestruct)
	interpreter.evm.StateDB.SelfDestruct6780(scope.Contract.Address())
	// ... tracing code similar to original
	return nil, errStopToken
}
```

**Gas Calculation** - `/go-ethereum/core/vm/gas_table.go` (lines 466-485):
```go
func gasSelfdestruct(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	var gas uint64
	// EIP150 homestead gas reprice fork:
	if evm.chainRules.IsEIP150 {
		gas = params.SelfdestructGasEIP150
		var address = common.Address(stack.Back(0).Bytes20())

		if evm.chainRules.IsEIP158 {
			// if empty and transfers value
			if evm.StateDB.Empty(address) && evm.StateDB.GetBalance(contract.Address()).Sign() != 0 {
				gas += params.CreateBySelfdestructGas
			}
		} else if !evm.StateDB.Exist(address) {
			gas += params.CreateBySelfdestructGas
		}
	}

	if !evm.StateDB.HasSelfDestructed(contract.Address()) {
		evm.StateDB.AddRefund(params.SelfdestructRefundGas)
	}
	return gas, nil
}
```

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
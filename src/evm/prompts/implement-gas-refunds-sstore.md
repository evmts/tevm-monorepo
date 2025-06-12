# Implement Gas Refunds for SSTORE Operations

You are implementing gas refunds for SSTORE operations in the Tevm EVM written in Zig. Your goal is to implement Ethereum's gas refund mechanism that provides economic incentives for reducing blockchain state size, following EIP-2200 and EIP-3529 specifications across all hardforks.

## Development Workflow
- **Branch**: `feat_implement_gas_refunds_sstore` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_gas_refunds_sstore feat_implement_gas_refunds_sstore`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format
<<<<<<< HEAD
=======

<review>
**Implementation Status: PARTIALLY IMPLEMENTED 🟡**

**What exists:**
- ✅ SSTORE opcode is defined (found in grep results)
- ✅ Basic storage operations exist in execution/storage.zig
- ✅ Gas constants framework exists in constants/gas_constants.zig
- ✅ Frame structure exists for gas tracking

**What's missing:**
- ❌ Gas refund accumulation and tracking mechanism
- ❌ EIP-2200 complex refund rules implementation
- ❌ EIP-3529 refund cap (20% vs 50%) enforcement
- ❌ Hardfork-specific refund behavior
- ❌ Integration with transaction-level refund processing

**Critical EVM Feature:**
- 🟡 **IMPORTANT**: Gas refunds are essential for economic correctness
- 🟡 **COMPATIBILITY**: Required for Ethereum equivalence
- 🟡 **COMPLEXITY**: EIP-2200 rules are complex and bug-prone

**Implementation Priority:**
- 🔥 **HIGH**: Core EVM feature affecting gas economics
- 🔥 **COMPLEX**: Requires careful implementation of multiple EIP specifications
- 🔥 **TESTING**: Needs extensive test coverage for all hardfork variants

**Next Steps:**
1. Implement gas refund tracking in Frame structure
2. Add EIP-2200 SSTORE refund logic to storage.zig
3. Add hardfork-specific refund rules
4. Implement EIP-3529 refund cap enforcement
5. Add comprehensive test coverage
</review>
>>>>>>> origin/main

## Context
SSTORE operations can receive gas refunds when storage is cleared (set to zero), providing economic incentives for reducing blockchain state size. The refund mechanism has evolved significantly across hardforks, from simple models to complex EIP-2200 rules with refund caps.

## File Structure

**Primary Files to Modify:**
- `/src/evm/execution/storage.zig` - SSTORE implementation with refund logic
- `/src/evm/constants/gas_constants.zig` - SSTORE and refund constants
- `/src/evm/frame.zig` - Gas tracking and refund accumulation
- `/src/evm/hardforks/chain_rules.zig` - Hardfork-specific refund rules

**Test Files:**
- `/test/evm/opcodes/storage_test.zig` - SSTORE refund test cases
- `/test/evm/gas/gas_accounting_test.zig` - Gas refund mechanism tests

## ELI5

Think of blockchain storage like a giant shared filing cabinet that everyone has to pay to maintain. When you delete files (set storage to zero), you get a partial refund on your storage fees as a "thank you" for cleaning up and making space for others. It's like getting money back for recycling - you paid to store something, but when you remove it, you get some compensation for helping keep the blockchain tidy.

## Specification

### Gas Refund Evolution
1. **Frontier-Byzantium**: Simple refund model (15000 gas for clearing storage)
2. **Constantinople (EIP-1283)**: Complex refund model (briefly deployed)
3. **Petersburg**: EIP-1283 disabled due to reentrancy concerns
4. **Istanbul (EIP-2200)**: Re-enabled EIP-1283 with gas sentry
5. **Berlin (EIP-2929)**: Access list warm/cold costs
6. **London (EIP-3529)**: Refund cap reduced from 50% to 20%

### SSTORE Gas Model (EIP-2200)
```
No change (value == current):
  - Warm: 100 gas
  - Cold: 2100 gas

Value change:
  - Cold access: +2000 gas
  - If current == original:
    - Creating (original=0): 20000 gas
    - Clearing (value=0): 2500 gas + 15000 refund
    - Modifying: 2500 gas
  - If current != original (dirty slot):
    - Various refund adjustments based on transitions
```

## Reference Implementations

### geth

<explanation>
The go-ethereum implementation shows two distinct SSTORE gas calculation methods: legacy (gasSStore) for pre-Constantinople and EIP-2200 (gasSStoreEIP2200) for modern rules. Key patterns include original vs current state comparison, refund tracking via AddRefund/SubRefund, and reentrancy protection with gas sentry checks.
</explanation>

**Legacy SSTORE Gas** - `/go-ethereum/core/vm/gas_table.go` (lines 99-125):
```go
func gasSStore(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	var (
		y, x    = stack.Back(1), stack.Back(0)
		current = evm.StateDB.GetState(contract.Address(), x.Bytes32())
	)
	// The legacy gas metering only takes into consideration the current state
	// Legacy rules should be applied if we are in Petersburg (removal of EIP-1283)
	// OR Constantinople is not active
	if evm.chainRules.IsPetersburg || !evm.chainRules.IsConstantinople {
		// This checks for 3 scenarios and calculates gas accordingly:
		//
		// 1. From a zero-value address to a non-zero value         (NEW VALUE)
		// 2. From a non-zero value address to a zero-value address (DELETE)
		// 3. From a non-zero to a non-zero                         (CHANGE)
		switch {
		case current == (common.Hash{}) && y.Sign() != 0: // 0 => non 0
			return params.SstoreSetGas, nil
		case current != (common.Hash{}) && y.Sign() == 0: // non 0 => 0
			evm.StateDB.AddRefund(params.SstoreRefundGas)
			return params.SstoreClearGas, nil
		default: // non 0 => non 0 (or 0 => 0)
			return params.SstoreResetGas, nil
		}
	}
	// ... (continues with EIP-1283 logic)
}
```

**EIP-2200 SSTORE Gas** - `/go-ethereum/core/vm/gas_table.go` (lines 184-215):
```go
func gasSStoreEIP2200(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// If we fail the minimum gas availability invariant, fail (0)
	if contract.Gas <= params.SstoreSentryGasEIP2200 {
		return 0, errors.New("not enough gas for reentrancy sentry")
	}
	// Gas sentry honoured, do the actual gas calculation based on the stored value
	var (
		y, x    = stack.Back(1), stack.Back(0)
		current = evm.StateDB.GetState(contract.Address(), x.Bytes32())
	)
	value := common.Hash(y.Bytes32())

	if current == value { // noop (1)
		return params.SloadGasEIP2200, nil
	}
	original := evm.StateDB.GetCommittedState(contract.Address(), x.Bytes32())
	if original == current {
		if original == (common.Hash{}) { // create slot (2.1.1)
			return params.SstoreSetGasEIP2200, nil
		}
		if value == (common.Hash{}) { // delete slot (2.1.2b)
			evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200)
		}
		return params.SstoreResetGasEIP2200, nil // write existing slot (2.1.2)
	}
	if original != (common.Hash{}) {
		if current == (common.Hash{}) { // recreate slot (2.2.1.1)
			evm.StateDB.SubRefund(params.SstoreClearsScheduleRefundEIP2200)
		} else if value == (common.Hash{}) { // delete slot (2.2.1.2)
			evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200)
		}
	}
	if original == value {
		if original == (common.Hash{}) { // reset to original inexistent slot (2.2.2.1)
			evm.StateDB.AddRefund(params.SstoreSetGasEIP2200 - params.SloadGasEIP2200)
		} else { // reset to original existing slot (2.2.2.2)
			evm.StateDB.AddRefund(params.SstoreResetGasEIP2200 - params.SloadGasEIP2200)
		}
	}
	return params.SloadGasEIP2200, nil // dirty update (2.2)
}
```
    - Otherwise: 2500 gas
```

### Refund Caps
- **Pre-London**: Max 50% of transaction gas used
- **London+ (EIP-3529)**: Max 20% of transaction gas used

## Current Implementation Analysis

### SSTORE Implementation
File: `/Users/williamcory/tevm/main/src/evm/execution/storage.zig`
Current SSTORE implementation likely handles basic gas costs but may not implement the full refund mechanism.

### Gas Tracking
Need to track:
1. **Gas used in transaction** - For refund cap calculation
2. **Total refunds earned** - Sum of all refunds in transaction
3. **Original storage values** - Values at start of transaction
4. **Current storage values** - Current state during execution

## Implementation Requirements

### Core Components
1. **Transaction-level refund tracking**
2. **Original value tracking** - Storage values at transaction start
3. **SSTORE gas calculation** - Complex logic based on value changes
4. **Refund application** - Apply refunds at transaction end
5. **Hardfork compatibility** - Different rules for different hardforks

### Refund Data Structures
```zig
pub const RefundTracker = struct {
    total_refunds: u64 = 0,
    gas_used: u64 = 0,
    hardfork: Hardfork,
    
    pub fn add_refund(self: *RefundTracker, amount: u64) void {
        self.total_refunds += amount;
    }
    
    pub fn calculate_final_refund(self: RefundTracker) u64 {
        const max_refund = switch (self.hardfork) {
            .London, .ParisArrowGlacier, .GrayGlacier, .Merge, .Shanghai, .Cancun => self.gas_used / 5, // 20%
            else => self.gas_used / 2, // 50%
        };
        return @min(self.total_refunds, max_refund);
    }
};

pub const StorageOriginalValues = std.HashMap(StorageKey, U256, StorageKeyContext, std.hash_map.default_max_load_percentage);

pub const StorageKey = struct {
    address: Address,
    key: U256,
};
```

## Implementation Tasks

### Task 1: Add Refund Tracking to VM
File: `/src/evm/vm.zig`
```zig
pub const Vm = struct {
    // ... existing fields
    refund_tracker: RefundTracker,
    original_storage_values: StorageOriginalValues,
    
    pub fn init(allocator: Allocator, hardfork: Hardfork) Vm {
        return Vm{
            // ... existing initialization
            .refund_tracker = RefundTracker{ .hardfork = hardfork },
            .original_storage_values = StorageOriginalValues.init(allocator),
        };
    }
    
    pub fn get_original_storage_value(self: *Vm, address: Address, key: U256) U256 {
        const storage_key = StorageKey{ .address = address, .key = key };
        if (self.original_storage_values.get(storage_key)) |value| {
            return value;
        }
        // First access - store original value
        const original_value = self.state.get_storage(address, key);
        self.original_storage_values.put(storage_key, original_value) catch unreachable;
        return original_value;
    }
};
```

### Task 2: Update SSTORE Implementation
File: `/src/evm/execution/storage.zig`
```zig
pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const key = try frame.stack.pop();
    const value = try frame.stack.pop();
    
    const address = frame.contract.address;
    const current_value = vm.state.get_storage(address, key);
    const original_value = vm.get_original_storage_value(address, key);
    
    const gas_cost = calculate_sstore_gas(
        original_value,
        current_value,
        value,
        vm.hardfork,
        vm.access_list.is_storage_warm(address, key)
    );
    
    const refund = calculate_sstore_refund(
        original_value,
        current_value,
        value,
        vm.hardfork
    );
    
    if (gas_cost > frame.gas_remaining) {
        return ExecutionError.Error.OutOfGas;
    }
    
    frame.gas_remaining -= gas_cost;
    vm.refund_tracker.add_refund(refund);
    vm.state.set_storage(address, key, value);
    
    return Operation.ExecutionResult{};
}

fn calculate_sstore_gas(
    original: U256,
    current: U256,
    new: U256,
    hardfork: Hardfork,
    is_warm: bool
) u64 {
    // Implement EIP-2200 gas calculation logic
    if (current.eql(new)) {
        // No change
        return if (is_warm) 100 else 2100;
    }
    
    var gas_cost: u64 = if (is_warm) 100 else 2100;
    
    if (!is_warm) {
        gas_cost += 2000; // Cold access penalty
    }
    
    if (original.eql(current)) {
        if (original.isZero()) {
            gas_cost += 20000; // Creating new storage
        } else if (new.isZero()) {
            gas_cost += 2500; // Clearing storage
        } else {
            gas_cost += 2500; // Modifying existing storage
        }
    } else {
        gas_cost += 2500; // Already modified in this transaction
    }
    
    return gas_cost;
}

fn calculate_sstore_refund(
    original: U256,
    current: U256,
    new: U256,
    hardfork: Hardfork
) u64 {
    // Implement EIP-2200 refund logic
    if (current.eql(new)) {
        return 0; // No change, no refund
    }
    
    var refund: i64 = 0;
    
    if (original.eql(current)) {
        if (!original.isZero() and new.isZero()) {
            refund += 15000; // Clearing storage
        }
    } else {
        // Storage was already modified in this transaction
        if (!original.isZero()) {
            if (current.isZero()) {
                refund -= 15000; // Un-clearing
            }
            if (new.isZero()) {
                refund += 15000; // Clearing again
            }
        }
        if (original.isZero()) {
            if (!current.isZero()) {
                refund -= 20000; // Un-creating
            }
            if (new.isZero()) {
                refund += 20000; // Creating again
            }
        }
        if (original.eql(new)) {
            if (original.isZero()) {
                refund += 19900; // Reset to original zero
            } else {
                refund += 4900; // Reset to original non-zero
            }
        }
    }
    
    return @as(u64, @intCast(@max(refund, 0)));
}
```

### Task 3: Add Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// SSTORE gas costs (EIP-2200)
pub const SSTORE_SET: u64 = 20000;
pub const SSTORE_RESET: u64 = 2500;
pub const SSTORE_CLEAR_REFUND: u64 = 15000;
pub const SSTORE_SET_REFUND: u64 = 19900;
pub const SSTORE_RESET_REFUND: u64 = 4900;

// Access list costs (EIP-2929)
pub const COLD_SLOAD_COST: u64 = 2100;
pub const WARM_STORAGE_READ_COST: u64 = 100;
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_ACCOUNT_ACCESS_COST: u64 = 100;
```

### Task 4: Transaction-level Refund Application
File: `/src/evm/vm.zig`
```zig
pub fn finalize_transaction(self: *Vm) u64 {
    const final_refund = self.refund_tracker.calculate_final_refund();
    
    // Reset refund tracker for next transaction
    self.refund_tracker = RefundTracker{ .hardfork = self.hardfork };
    self.original_storage_values.clearAndFree();
    
    return final_refund;
}
```

### Task 5: Update Access List Integration
Ensure SSTORE properly integrates with access list for warm/cold storage:
```zig
// In SSTORE operation
const is_storage_warm = vm.access_list.is_storage_warm(address, key);
if (!is_storage_warm) {
    vm.access_list.access_storage(address, key);
}
```

### Task 6: Comprehensive Testing
File: `/test/evm/gas/sstore_refunds_test.zig`

### Test Cases
1. **Basic Refunds**: Setting storage to zero and getting refund
2. **Refund Caps**: Test 20% cap (London+) and 50% cap (pre-London)
3. **Complex Scenarios**: Multiple SSTORE operations in same transaction
4. **Original Value Tracking**: Verify original values are tracked correctly
5. **Hardfork Compatibility**: Test across all relevant hardforks
6. **Access List Integration**: Test warm/cold storage access costs
7. **Edge Cases**: Zero to zero, non-zero to same non-zero, etc.

## Complex Scenarios

### Multiple SSTORE Operations
```zig
test "multiple sstore operations in transaction" {
    // Set up VM with initial storage state
    // Perform sequence: set A=1, set A=0, set A=2, set A=0
    // Verify gas costs and refunds for each operation
    // Check final refund calculation
}
```

### Refund Cap Testing
```zig
test "refund cap enforcement" {
    // Create transaction that would generate large refunds
    // Verify refunds are capped at 20% of gas used (London+)
    // Test edge case where refunds exceed cap
}
```

### Cross-Hardfork Compatibility
```zig
test "sstore gas across hardforks" {
    // Test same operations across different hardforks
    // Verify gas costs and refund rules change appropriately
    // Ensure no regression in older hardfork support
}
```

## Integration Points

### Files to Modify
- `/src/evm/vm.zig` - Add refund tracking and original value storage
- `/src/evm/execution/storage.zig` - Update SSTORE implementation
- `/src/evm/constants/gas_constants.zig` - Add SSTORE-related constants
- `/src/evm/hardforks/chain_rules.zig` - Add hardfork-specific refund rules

### Build System
No changes needed - uses existing modules.

## Performance Considerations

### Memory Usage
```zig
// Original values only stored once per storage slot per transaction
// Use efficient HashMap with custom key type
pub const StorageKeyContext = struct {
    pub fn hash(self: @This(), key: StorageKey) u64 {
        _ = self;
        var hasher = std.hash.Wyhash.init(0);
        hasher.update(&key.address.bytes);
        hasher.update(std.mem.asBytes(&key.key));
        return hasher.final();
    }
    
    pub fn eql(self: @This(), a: StorageKey, b: StorageKey) bool {
        _ = self;
        return a.address.eql(b.address) and a.key.eql(b.key);
    }
};
```

### Gas Calculation Optimization
```zig
// Cache common calculations
const is_original_zero = original.isZero();
const is_current_zero = current.isZero();
const is_new_zero = new.isZero();
const original_eq_current = original.eql(current);
const current_eq_new = current.eql(new);
```

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST test across all hardforks (refund rules change significantly)
✅ MUST verify refund cap enforcement (prevents gas attacks)
✅ MUST validate against EIP-2200, EIP-2929, EIP-3529 specifications
✅ MUST maintain backward compatibility with existing SSTORE implementation

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Gas costs and refunds match Ethereum specification exactly
✅ Refund caps properly enforced (20%/50% based on hardfork)
✅ Original value tracking works correctly across complex scenarios
✅ Performance maintains or improves SSTORE operation speed
✅ Memory usage for refund tracking is reasonable and bounded

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/opcodes/sstore_test.zig`)
```zig
// Test basic SSTORE functionality
test "sstore basic functionality with known scenarios"
test "sstore handles edge cases correctly"
test "sstore validates state changes"
test "sstore correct gas calculation"
```

#### 2. **State Management Tests**
```zig
test "sstore state transitions work correctly"
test "sstore handles state conflicts properly"
test "sstore maintains state consistency"
test "sstore reverts state on failure"
```

#### 3. **Gas Calculation Tests**
```zig
test "sstore gas cost calculation accuracy"
test "sstore gas refund mechanics"
test "sstore gas edge cases and overflow protection"
test "sstore gas accounting in EVM context"
```

#### 4. **Integration Tests**
```zig
test "sstore EVM context integration"
test "sstore called from contract execution"
test "sstore hardfork behavior changes"
test "sstore interaction with other opcodes"
```

#### 5. **Error Handling Tests**
```zig
test "sstore error propagation"
test "sstore proper error types returned"
test "sstore handles corrupted state gracefully"
test "sstore never panics on malformed input"
```

#### 6. **Performance Tests**
```zig
test "sstore performance with realistic workloads"
test "sstore memory efficiency"
test "sstore execution time bounds"
test "sstore benchmark against reference implementations"
```

### Test Development Priority
1. **Start with specification test vectors** - Ensures spec compliance from day one
2. **Add core functionality tests** - Critical behavior verification
3. **Implement gas/state management** - Economic and state security
4. **Add performance benchmarks** - Ensures production readiness
5. **Test error cases** - Robust error handling

### Test Data Sources
- **EIP/Specification test vectors**: Primary compliance verification
- **Reference implementation tests**: Cross-client compatibility
- **Ethereum test suite**: Official test cases
- **Edge case generation**: Boundary value and malformed input testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public functions
- Validate performance benchmarks don't regress
- Test both debug and release builds

### Test-First Examples

**Before writing any implementation:**
```zig
test "sstore basic functionality" {
    // This test MUST fail initially
    const input = test_vectors.valid_input;
    const expected = test_vectors.expected_output;
    
    const result = sstore(input);
    try testing.expectEqual(expected, result);
}
```

**Only then implement:**
```zig
pub fn sstore(input: InputType) !OutputType {
    // Minimal implementation to make test pass
    return error.NotImplemented; // Initially
}
```

## References

- [EIP-2200: Structured Definitions for Net Gas Metering](https://eips.ethereum.org/EIPS/eip-2200)
- [EIP-2929: Gas cost increases for state access opcodes](https://eips.ethereum.org/EIPS/eip-2929)
- [EIP-3529: Reduction in refunds](https://eips.ethereum.org/EIPS/eip-3529)
- [EIP-1283: Net gas metering for SSTORE](https://eips.ethereum.org/EIPS/eip-1283)
- [Ethereum Yellow Paper - Gas Costs](https://ethereum.github.io/yellowpaper/paper.pdf)
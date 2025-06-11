# Implement SELFDESTRUCT Refunds

You are implementing SELFDESTRUCT Refunds for the Tevm EVM written in Zig. Your goal is to implement gas refund mechanism for SELFDESTRUCT operations following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_selfdestruct_refunds` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_selfdestruct_refunds feat_implement_selfdestruct_refunds`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement gas refunds for SELFDESTRUCT opcode according to Ethereum specifications. Before the London hardfork (EIP-3529), SELFDESTRUCT provided gas refunds when destroying contracts. This refund mechanism was removed in London to mitigate gas limit manipulation attacks.

## ELI5

Imagine Ethereum transactions like paying tolls on a highway system. Originally, if you demolished a building (SELFDESTRUCT), the city would give you a tax refund for cleaning up unused space. This seemed like a good incentive to keep the city tidy.

However, clever people found ways to abuse this system:
- They would build temporary structures just to demolish them and collect refunds
- They could manipulate the "traffic limits" (gas limits) by creating fake demolition projects
- This was like opening fake businesses just to get demolition rebates, then using those rebates to clog up the highway system

The London hardfork was like the city council saying "No more demolition rebates!" to prevent this abuse. Now, when you destroy a contract, you don't get gas back.

This enhanced implementation handles the complexity of:
- **Era Detection**: Automatically knowing which rules apply (pre-London vs post-London)
- **Refund Calculation**: Computing the correct refund amounts when they were allowed
- **Security Measures**: Ensuring the refund system can't be exploited
- **State Management**: Properly tracking which contracts are eligible for refunds

Why does this matter? It ensures the EVM behaves correctly across different Ethereum versions and prevents economic attacks that could destabilize the network.

## Specification

### Gas Refund Rules

#### Pre-London Hardfork
- **SELFDESTRUCT Refund**: 24,000 gas when destroying a contract
- **Maximum Refund Cap**: Total refunds cannot exceed gas_used / 2
- **Refund Timing**: Applied after transaction execution completes
- **Conditions**: Only when actually destroying a contract (not calling on non-existent)

#### London Hardfork (EIP-3529)
- **SELFDESTRUCT Refunds**: Removed completely
- **Rationale**: Prevent gas limit manipulation attacks
- **Backward Compatibility**: Pre-London blocks still use old rules

### SELFDESTRUCT Behavior
```zig
pub const SelfdestructBehavior = struct {
    base_cost: u64,
    refund_amount: u64,
    creates_account: bool,
    
    pub fn for_hardfork(hardfork: Hardfork) SelfdestructBehavior {
        return switch (hardfork) {
            .Frontier, .Homestead, .Tangerine, .Spurious, .Byzantium, .Constantinople, .Petersburg, .Istanbul, .Berlin => .{
                .base_cost = 5000,
                .refund_amount = 24000,
                .creates_account = true,
            },
            .London, .ArrowGlacier, .GrayGlacier, .Paris, .Shanghai, .Cancun => .{
                .base_cost = 5000,
                .refund_amount = 0, // No refunds after London
                .creates_account = false,
            },
        };
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Hardfork Detection**: Apply refunds only for pre-London hardforks
2. **Refund Tracking**: Accumulate SELFDESTRUCT refunds during execution
3. **Refund Calculation**: Apply refund cap (gas_used / 2) after transaction
4. **State Management**: Track which contracts are actually destroyed
5. **Integration**: Connect with existing SELFDESTRUCT opcode implementation

### Refund Tracking System
```zig
pub const RefundTracker = struct {
    selfdestruct_refunds: u64,
    sstore_refunds: u64,
    total_gas_used: u64,
    hardfork: Hardfork,
    
    pub fn init(hardfork: Hardfork) RefundTracker {
        return RefundTracker{
            .selfdestruct_refunds = 0,
            .sstore_refunds = 0,
            .total_gas_used = 0,
            .hardfork = hardfork,
        };
    }
    
    pub fn add_selfdestruct_refund(self: *RefundTracker) void {
        const behavior = SelfdestructBehavior.for_hardfork(self.hardfork);
        self.selfdestruct_refunds += behavior.refund_amount;
    }
    
    pub fn calculate_final_refund(self: *RefundTracker) u64 {
        const total_refunds = self.selfdestruct_refunds + self.sstore_refunds;
        const max_refund = self.total_gas_used / 2;
        return @min(total_refunds, max_refund);
    }
};
```

## Implementation Tasks

### Task 1: Update Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// SELFDESTRUCT refund constants
pub const SELFDESTRUCT_REFUND_PRE_LONDON: u64 = 24000;
pub const SELFDESTRUCT_REFUND_POST_LONDON: u64 = 0;

// Maximum refund cap
pub const MAX_REFUND_QUOTIENT: u64 = 2; // gas_used / 2
```

### Task 2: Implement Refund System
File: `/src/evm/gas/refund_tracker.zig`
```zig
const std = @import("std");
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;
const gas_constants = @import("../constants/gas_constants.zig");

pub const RefundTracker = struct {
    selfdestruct_refunds: u64,
    sstore_refunds: u64,
    total_gas_used: u64,
    hardfork: Hardfork,
    
    pub fn init(hardfork: Hardfork) RefundTracker {
        return RefundTracker{
            .selfdestruct_refunds = 0,
            .sstore_refunds = 0,
            .total_gas_used = 0,
            .hardfork = hardfork,
        };
    }
    
    pub fn add_selfdestruct_refund(self: *RefundTracker, contract_exists: bool) void {
        // Only provide refund if contract actually exists and is being destroyed
        if (!contract_exists) return;
        
        // Check if hardfork supports SELFDESTRUCT refunds
        const refund_amount = switch (self.hardfork) {
            .Frontier, .Homestead, .Tangerine, .Spurious, .Byzantium, 
            .Constantinople, .Petersburg, .Istanbul, .Berlin => gas_constants.SELFDESTRUCT_REFUND_PRE_LONDON,
            .London, .ArrowGlacier, .GrayGlacier, .Paris, .Shanghai, .Cancun => gas_constants.SELFDESTRUCT_REFUND_POST_LONDON,
        };
        
        self.selfdestruct_refunds += refund_amount;
    }
    
    pub fn add_sstore_refund(self: *RefundTracker, refund_amount: u64) void {
        self.sstore_refunds += refund_amount;
    }
    
    pub fn set_total_gas_used(self: *RefundTracker, gas_used: u64) void {
        self.total_gas_used = gas_used;
    }
    
    pub fn calculate_final_refund(self: *const RefundTracker) u64 {
        const total_refunds = self.selfdestruct_refunds + self.sstore_refunds;
        
        // EIP-3529: Maximum refund is gas_used / 2
        const max_refund = self.total_gas_used / gas_constants.MAX_REFUND_QUOTIENT;
        
        return @min(total_refunds, max_refund);
    }
    
    pub fn get_selfdestruct_refunds(self: *const RefundTracker) u64 {
        return self.selfdestruct_refunds;
    }
    
    pub fn get_sstore_refunds(self: *const RefundTracker) u64 {
        return self.sstore_refunds;
    }
    
    pub fn get_total_refunds(self: *const RefundTracker) u64 {
        return self.selfdestruct_refunds + self.sstore_refunds;
    }
};
```

### Task 3: Update SELFDESTRUCT Opcode
File: `/src/evm/execution/system.zig` (modify existing SELFDESTRUCT implementation)
```zig
// Update existing SELFDESTRUCT implementation to track refunds
pub fn execute_selfdestruct(vm: *Vm, frame: *Frame) !ExecutionResult {
    // Existing SELFDESTRUCT logic...
    
    // Get target address from stack
    const target_address = frame.stack.pop_unsafe();
    const current_address = frame.context.address;
    
    // Check if current contract exists in state
    const current_account = vm.state.get_account(current_address);
    const contract_exists = current_account != null;
    
    // Add refund if contract exists and will be destroyed
    if (contract_exists) {
        vm.refund_tracker.add_selfdestruct_refund(true);
    }
    
    // Existing destruction logic...
    // Transfer balance, mark for deletion, etc.
    
    return ExecutionResult.halt;
}
```

### Task 4: Update VM Structure
File: `/src/evm/vm.zig` (modify existing)
```zig
const RefundTracker = @import("gas/refund_tracker.zig").RefundTracker;

pub const Vm = struct {
    // Existing fields...
    refund_tracker: RefundTracker,
    
    pub fn init(allocator: std.mem.Allocator, hardfork: Hardfork) !Vm {
        return Vm{
            // Existing initialization...
            .refund_tracker = RefundTracker.init(hardfork),
        };
    }
    
    pub fn execute_transaction(self: *Vm, transaction: Transaction) !TransactionResult {
        // Execute transaction...
        const execution_result = try self.execute_contract(transaction);
        
        // Calculate final gas refund
        self.refund_tracker.set_total_gas_used(execution_result.gas_used);
        const gas_refund = self.refund_tracker.calculate_final_refund();
        
        return TransactionResult{
            .success = execution_result.success,
            .gas_used = execution_result.gas_used - gas_refund,
            .gas_refund = gas_refund,
            .output = execution_result.output,
        };
    }
};
```

### Task 5: Update Frame Structure
File: `/src/evm/frame.zig` (modify existing)
```zig
pub const Frame = struct {
    // Existing fields...
    refund_tracker: *RefundTracker, // Reference to VM's refund tracker
    
    pub fn init(
        allocator: std.mem.Allocator,
        context: CallContext,
        refund_tracker: *RefundTracker
    ) !Frame {
        return Frame{
            // Existing initialization...
            .refund_tracker = refund_tracker,
        };
    }
};
```

### Task 6: Hardfork Compatibility
File: `/src/evm/hardforks/chain_rules.zig` (modify existing)
```zig
pub fn supports_selfdestruct_refunds(hardfork: Hardfork) bool {
    return switch (hardfork) {
        .Frontier, .Homestead, .Tangerine, .Spurious, .Byzantium,
        .Constantinople, .Petersburg, .Istanbul, .Berlin => true,
        .London, .ArrowGlacier, .GrayGlacier, .Paris, .Shanghai, .Cancun => false,
    };
}

pub fn get_selfdestruct_refund_amount(hardfork: Hardfork) u64 {
    return if (supports_selfdestruct_refunds(hardfork)) 
        gas_constants.SELFDESTRUCT_REFUND_PRE_LONDON 
    else 
        gas_constants.SELFDESTRUCT_REFUND_POST_LONDON;
}
```

## Testing Requirements

### Test File
Create `/test/evm/gas/selfdestruct_refunds_test.zig`

### Test Cases
```zig
const std = @import("std");
const testing = std.testing;
const RefundTracker = @import("../../../src/evm/gas/refund_tracker.zig").RefundTracker;
const Hardfork = @import("../../../src/evm/hardforks/hardfork.zig").Hardfork;

test "selfdestruct refund pre-london" {
    var tracker = RefundTracker.init(.Berlin);
    
    // Add SELFDESTRUCT refund
    tracker.add_selfdestruct_refund(true); // Contract exists
    tracker.set_total_gas_used(100000);
    
    // Should get full refund (24000 < 50000 max)
    const refund = tracker.calculate_final_refund();
    try testing.expectEqual(@as(u64, 24000), refund);
}

test "selfdestruct no refund post-london" {
    var tracker = RefundTracker.init(.London);
    
    // Add SELFDESTRUCT (should not provide refund)
    tracker.add_selfdestruct_refund(true);
    tracker.set_total_gas_used(100000);
    
    // Should get no refund
    const refund = tracker.calculate_final_refund();
    try testing.expectEqual(@as(u64, 0), refund);
}

test "selfdestruct refund cap" {
    var tracker = RefundTracker.init(.Berlin);
    
    // Add multiple SELFDESTRUCT refunds
    tracker.add_selfdestruct_refund(true); // 24000
    tracker.add_selfdestruct_refund(true); // 24000
    tracker.add_selfdestruct_refund(true); // 24000
    // Total: 72000
    
    tracker.set_total_gas_used(100000); // Max refund: 50000
    
    // Should be capped at gas_used / 2
    const refund = tracker.calculate_final_refund();
    try testing.expectEqual(@as(u64, 50000), refund);
}

test "selfdestruct non-existent contract" {
    var tracker = RefundTracker.init(.Berlin);
    
    // SELFDESTRUCT on non-existent contract
    tracker.add_selfdestruct_refund(false); // Contract doesn't exist
    tracker.set_total_gas_used(100000);
    
    // Should get no refund
    const refund = tracker.calculate_final_refund();
    try testing.expectEqual(@as(u64, 0), refund);
}

test "combined sstore and selfdestruct refunds" {
    var tracker = RefundTracker.init(.Berlin);
    
    // Add both types of refunds
    tracker.add_sstore_refund(15000);
    tracker.add_selfdestruct_refund(true); // 24000
    
    tracker.set_total_gas_used(100000); // Max refund: 50000
    
    // Total refunds: 39000 (< 50000 max)
    const refund = tracker.calculate_final_refund();
    try testing.expectEqual(@as(u64, 39000), refund);
}

test "hardfork transition behavior" {
    // Test that the same operation behaves differently across hardforks
    const hardforks = [_]Hardfork{ .Berlin, .London };
    const expected_refunds = [_]u64{ 24000, 0 };
    
    for (hardforks, expected_refunds) |hardfork, expected| {
        var tracker = RefundTracker.init(hardfork);
        tracker.add_selfdestruct_refund(true);
        tracker.set_total_gas_used(100000);
        
        const refund = tracker.calculate_final_refund();
        try testing.expectEqual(expected, refund);
    }
}
```

### Integration Tests
```zig
test "selfdestruct refund integration" {
    // Test full SELFDESTRUCT execution with refund tracking
    // Create contract, call SELFDESTRUCT, verify refund
}

test "transaction gas calculation with refunds" {
    // Test complete transaction execution
    // Verify final gas cost includes refunds
}

test "multiple selfdestructs in one transaction" {
    // Test multiple SELFDESTRUCT operations
    // Verify refund accumulation and capping
}
```

## Performance Considerations

### Refund Tracking Optimization
```zig
// Efficient refund accumulation
pub const RefundAccumulator = struct {
    count: u32,
    unit_refund: u64,
    
    pub fn add_refund(self: *RefundAccumulator) void {
        self.count += 1;
    }
    
    pub fn get_total_refund(self: *const RefundAccumulator) u64 {
        return @as(u64, self.count) * self.unit_refund;
    }
};
```

### Memory Efficiency
- **Stack Allocation**: Use stack for refund tracking data
- **Minimal State**: Only track essential refund information
- **Lazy Calculation**: Calculate final refund only when needed

## Security Considerations

### Refund Cap Enforcement
```zig
// Prevent refund overflow attacks
fn safe_add_refund(current: u64, additional: u64) u64 {
    const result = current + additional;
    // Check for overflow
    if (result < current) {
        return std.math.maxInt(u64);
    }
    return result;
}
```

### Hardfork Validation
```zig
// Ensure refund rules match hardfork
fn validate_refund_rules(hardfork: Hardfork, refund_amount: u64) bool {
    const expected = get_selfdestruct_refund_amount(hardfork);
    return refund_amount <= expected;
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/gas/refund_tracker.zig` - New refund tracking system
- `/src/evm/constants/gas_constants.zig` - Add SELFDESTRUCT refund constants
- `/src/evm/execution/system.zig` - Update SELFDESTRUCT opcode
- `/src/evm/vm.zig` - Add refund tracker to VM
- `/src/evm/frame.zig` - Connect frame to refund tracker
- `/src/evm/hardforks/chain_rules.zig` - Add hardfork compatibility checks
- `/test/evm/gas/selfdestruct_refunds_test.zig` - Comprehensive tests

### Build System
Ensure refund tracking doesn't impact performance or WASM bundle size.

## Success Criteria

1. **Hardfork Accuracy**: Correct refund behavior for each Ethereum hardfork
2. **Refund Calculation**: Accurate gas refund computation with proper capping
3. **Integration**: Seamless integration with existing SELFDESTRUCT opcode
4. **Performance**: Minimal overhead for refund tracking
5. **Compatibility**: Works with existing gas accounting system
6. **Test Coverage**: Comprehensive tests covering all edge cases

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/selfdestruct/selfdestruct_refunds_test.zig`)
```zig
// Test basic SELFDESTRUCT refund functionality
test "selfdestruct_refunds basic functionality with known scenarios"
test "selfdestruct_refunds handles edge cases correctly"
test "selfdestruct_refunds validates state changes"
test "selfdestruct_refunds correct behavior under load"
```

#### 2. **Integration Tests**
```zig
test "selfdestruct_refunds integrates with EVM context correctly"
test "selfdestruct_refunds works with existing systems"
test "selfdestruct_refunds maintains backward compatibility"
test "selfdestruct_refunds handles system interactions"
```

#### 3. **State Management Tests**
```zig
test "selfdestruct_refunds state transitions work correctly"
test "selfdestruct_refunds handles concurrent refund tracking"
test "selfdestruct_refunds maintains refund consistency"
test "selfdestruct_refunds reverts state on failure"
```

#### 4. **Performance Tests**
```zig
test "selfdestruct_refunds performance with realistic workloads"
test "selfdestruct_refunds memory efficiency and allocation patterns"
test "selfdestruct_refunds scalability under high load"
test "selfdestruct_refunds benchmark against baseline implementation"
```

#### 5. **Error Handling Tests**
```zig
test "selfdestruct_refunds error propagation works correctly"
test "selfdestruct_refunds proper error types returned"
test "selfdestruct_refunds handles resource exhaustion gracefully"
test "selfdestruct_refunds recovery from failure states"
```

#### 6. **Hardfork Compatibility Tests**
```zig
test "selfdestruct_refunds pre-London hardfork behavior"
test "selfdestruct_refunds London hardfork refund removal"
test "selfdestruct_refunds refund cap calculations"
test "selfdestruct_refunds cross-hardfork consistency"
```

#### 7. **Gas Calculation Tests**
```zig
test "selfdestruct_refunds maintains EVM specification compliance"
test "selfdestruct_refunds refund cap enforcement"
test "selfdestruct_refunds gas accounting accuracy"
test "selfdestruct_refunds integration with existing gas metering"
```

### Test Development Priority
1. **Start with hardfork detection tests** - Ensures basic behavior works across EVM versions
2. **Add refund calculation tests** - Verifies core refund logic and caps
3. **Implement integration tests** - Critical for EVM system consistency
4. **Add gas accounting tests** - Essential for transaction correctness
5. **Test error and edge cases** - Robust error handling for production
6. **Add performance benchmarks** - Ensures optimized refund processing

### Test Data Sources
- **EVM specification requirements**: Pre/post-London hardfork compliance
- **Reference implementation behavior**: Cross-client compatibility testing
- **Performance benchmarks**: Gas cost validation and optimization
- **Real-world scenarios**: Transaction patterns with SELFDESTRUCT usage
- **Edge case generation**: Boundary testing for refund caps and limits

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify memory safety and leak detection

### Test-First Examples

**Before writing any implementation:**
```zig
test "selfdestruct_refunds basic functionality" {
    // This test MUST fail initially
    const context = test_utils.createTestContext(.Berlin); // Pre-London
    var refund_tracker = RefundTracker.init(.Berlin);
    
    refund_tracker.add_selfdestruct_refund();
    try testing.expectEqual(@as(u64, 24000), refund_tracker.selfdestruct_refunds);
}
```

**Only then implement:**
```zig
pub const RefundTracker = struct {
    pub fn add_selfdestruct_refund(self: *RefundTracker) void {
        // Minimal implementation to make test pass
        if (self.hardfork.supportsRefunds()) {
            self.selfdestruct_refunds += 24000;
        } 
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test hardfork transitions thoroughly** - Architecture changes affect the whole EVM
- **Verify gas accounting accuracy** - Especially important for refund cap calculations
- **Test integration with existing SELFDESTRUCT implementation** - Ensure seamless operation
- **Validate cross-client compatibility** - Critical for network consensus

## References

- [EIP-3529: Reduction in refunds](https://eips.ethereum.org/EIPS/eip-3529)
- [EIP-2681: Limit account nonce to 2^64-1](https://eips.ethereum.org/EIPS/eip-2681)
- [Ethereum Yellow Paper - Gas Refunds](https://ethereum.github.io/yellowpaper/paper.pdf)
- [London Hardfork Specification](https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/london.md)

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// evmone/lib/evmone/execution_state.hpp

/// Generic execution state for generic instructions implementations.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;

    // ... other fields ...
};
```
*Self-destruct refunds, like SSTORE refunds, are tracked in the `gas_refund` field within the `ExecutionState`. This is the central counter for all refunds in a transaction.*

</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
// evmone/lib/evmone/instructions_calls.cpp

inline TermResult selfdestruct(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    if (state.in_static_mode())
        return {EVMC_STATIC_MODE_VIOLATION, gas_left};

    const auto beneficiary = intx::be::trunc<evmc::address>(stack[0]);

    if (state.rev >= EVMC_BERLIN && state.host.access_account(beneficiary) == EVMC_ACCESS_COLD)
    {
        if ((gas_left -= instr::cold_account_access_cost) < 0)
            return {EVMC_OUT_OF_GAS, gas_left};
    }

    if (state.rev >= EVMC_TANGERINE_WHISTLE)
    {
        if (state.rev == EVMC_TANGERINE_WHISTLE || state.host.get_balance(state.msg->recipient))
        {
            // After TANGERINE_WHISTLE apply additional cost of
            // sending value to a non-existing account.
            if (!state.host.account_exists(beneficiary))
            {
                if ((gas_left -= 25000) < 0)
                    return {EVMC_OUT_OF_GAS, gas_left};
            }
        }
    }

    if (state.host.selfdestruct(state.msg->recipient, beneficiary))
    {
        if (state.rev < EVMC_LONDON)
            state.gas_refund += 24000;
    }
    return {EVMC_SUCCESS, gas_left};
}
```
*This is the core implementation of the `SELFDESTRUCT` opcode in `evmone`. It demonstrates the correct hardfork check (`state.rev < EVMC_LONDON`) for applying the refund. It also shows that the refund is only granted if the `selfdestruct` host call is successful, which implicitly handles the case of a contract actually being destroyed.*

</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
// evmone/lib/evmone/baseline_execution.cpp

evmc_result execute(VM& vm, const evmc_host_interface& host, evmc_host_context* ctx,
    evmc_revision rev, const evmc_message& msg, const CodeAnalysis& analysis) noexcept
{
    // ... execution loop ...
    
    // Final gas calculation after the execution loop
    const auto gas_left = (state.status == EVMC_SUCCESS || state.status == EVMC_REVERT) ? gas : 0;

    // Apply refund counter, capped to a fraction of gas used.
    // EIP-3529: max_refund_quotient is 5
    // EIP-2200: max_refund_quotient is 2
    const auto max_refund_quotient = (rev >= EVMC_LONDON) ? 5 : 2;
    const auto gas_used = msg.gas - gas_left;
    const auto refund = std::min(state.gas_refund, gas_used / max_refund_quotient);
    const auto final_gas_left = gas_left + refund;

    assert(state.output_size != 0 || state.output_offset == 0);
    const auto result =
        (state.deploy_container.has_value() ?
                evmc::make_result(state.status, final_gas_left, 0,
                    state.deploy_container->data(), state.deploy_container->size()) :
                evmc::make_result(state.status, final_gas_left, 0,
                    state.output_size != 0 ? &state.memory[state.output_offset] : nullptr,
                    state.output_size));
    
    // ...
    return result;
}
```
*This snippet shows how the final refund is calculated and capped after execution is complete. It correctly applies the `gas_used / 2` (or `gas_used / 5` post-London) rule. This logic should be applied at the end of the transaction, not during opcode execution.*

</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_storage.cpp">
```cpp
// evmone/lib/evmone/instructions_storage.cpp

// The lookup table of SSTORE costs by the storage update status.
constexpr auto sstore_costs = []() noexcept {
    std::array<std::array<StorageStoreCost, EVMC_STORAGE_MODIFIED_RESTORED + 1>,
        EVMC_MAX_REVISION + 1>
        tbl{};

    for (size_t rev = EVMC_FRONTIER; rev <= EVMC_MAX_REVISION; ++rev)
    {
        auto& e = tbl[rev];
        if (const auto c = storage_cost_spec[rev]; !c.net_cost)  // legacy
        {
            // ...
            e[EVMC_STORAGE_DELETED] = {c.reset, c.clear}; // c.clear is 15000 refund
            // ...
        }
        else  // net cost
        {
            // ...
            e[EVMC_STORAGE_DELETED] = {c.reset, c.clear}; // c.clear is 4800 refund post-London
            e[EVMC_STORAGE_DELETED_ADDED] = {c.warm_access, static_cast<int16_t>(-c.clear)};
            // ...
        }
    }
    return tbl;
}();

// ...

Result sstore(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    // ... gas calculation logic ...

    const auto status = state.host.set_storage(state.msg->recipient, key, value);

    const auto [gas_cost_warm, gas_refund] = sstore_costs[state.rev][status];
    const auto gas_cost = gas_cost_warm + gas_cost_cold;
    if ((gas_left -= gas_cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    state.gas_refund += gas_refund; // Add or subtract from the refund counter
    return {EVMC_SUCCESS, gas_left};
}
```
*The `sstore` implementation provides a good reference for how to manage a refund counter. It adds or subtracts from `state.gas_refund` based on the operation's outcome and the current hardfork. This pattern of a centralized refund counter is directly applicable to `SELFDESTRUCT`.*

</file>
</evmone>

## Prompt Corrections
The original prompt's implementation is a good starting point but can be improved by observing how `evmone` handles similar logic.

1.  **Refund Cap (`MAX_REFUND_QUOTIENT`)**: The prompt hardcodes the refund cap denominator to `2`. This is only correct for pre-London hardforks. As of the London hardfork (EIP-3529), this was changed to `5`. The `evmone` implementation correctly selects the quotient based on the revision, which is more accurate.

    *Correction*: The `calculate_final_refund` function should be aware of the hardfork.
    ```zig
    pub fn calculate_final_refund(self: *const RefundTracker) u64 {
        const total_refunds = self.selfdestruct_refunds + self.sstore_refunds;
        
        // EIP-3529: max_refund_quotient is 2 pre-London, 5 post-London
        const max_refund_quotient = if (chain_rules.is_london(self.hardfork)) 5 else 2;
        const max_refund = self.total_gas_used / max_refund_quotient;
        
        return @min(total_refunds, max_refund);
    }
    ```

2.  **Refund Mechanism**: The prompt suggests creating a `RefundTracker` struct. While this works, `evmone` uses a simpler, integrated approach by placing `gas_refund` directly in the `ExecutionState`. This avoids passing pointers to the tracker down the call stack. The refund logic is then applied once at the end of the transaction execution, as seen in `evmone/lib/evmone/baseline_execution.cpp`.

3.  **Condition for Refunding**: The prompt suggests refunding if the contract exists (`contract_exists: bool`). `evmone`'s implementation is more robust: it grants a refund only if `state.host.selfdestruct(...)` returns `true`. This correctly handles edge cases, such as attempting to self-destruct a contract that has already been destructed within the same transaction, which should not yield a second refund.

4.  **Gas Cost vs. Refund**: `SELFDESTRUCT` has both a gas cost and a refund. Pre-Tangerine Whistle, the cost was 0. After, it became 5000. The refund of 24,000 was introduced at the same time and removed in London. The prompt's `SelfdestructBehavior` struct correctly captures the base cost and refund amount based on the hardfork, which is a good model to follow. The `evmone` `selfdestruct` implementation in `instructions_calls.cpp` also shows how to handle gas costs for accessing the beneficiary account, which is another important detail.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/host.rs">
```rust
//! Instructions related to the host environment.

// ... other imports

/// EIP-6780: SELFDESTRUCT only in same transaction
pub fn selfdestruct<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    require_non_staticcall!(context.interpreter);
    popn!([target], context.interpreter);
    let target = target.into_address();

    let Some(res) = context
        .host
        .selfdestruct(context.interpreter.input.target_address(), target)
    else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    // EIP-3529: Reduction in refunds
    // Refund is only possible if the contract was not already destroyed.
    if !context
        .interpreter
        .runtime_flag
        .spec_id()
        .is_enabled_in(LONDON)
        && !res.previously_destroyed
    {
        context
            .interpreter
            .control
            .gas_mut()
            .record_refund(gas::SELFDESTRUCT)
    }

    gas!(
        context.interpreter,
        gas::selfdestruct_cost(context.interpreter.runtime_flag.spec_id(), res)
    );

    context
        .interpreter
        .control
        .set_instruction_result(InstructionResult::SelfDestruct);
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/interface/src/journaled_state.rs">
```rust
//! Journaled state interface.

// ... other imports

/// Trait that contains database and journal of all changes that were made to the state.
pub trait JournalTr {
    // ... other trait methods

    /// Marks the account for selfdestruction and transfers all the balance to the target.
    fn selfdestruct(
        &mut self,
        address: Address,
        target: Address,
    ) -> Result<StateLoad<SelfDestructResult>, <Self::Database as Database>::Error>;
    
    // ... other trait methods
}

// ... other structs

/// Result of a selfdestruct action
///
/// Value returned are needed to calculate the gas spent.
#[derive(Clone, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct SelfDestructResult {
    pub had_value: bool,
    pub target_exists: bool,
    pub previously_destroyed: bool,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/calc.rs">
```rust
// ... other imports

/// `SELFDESTRUCT` opcode cost calculation.
#[inline]
pub const fn selfdestruct_cost(spec_id: SpecId, res: StateLoad<SelfDestructResult>) -> u64 {
    // EIP-161: State trie clearing (invariant-preserving alternative)
    let should_charge_topup = if spec_id.is_enabled_in(SpecId::SPURIOUS_DRAGON) {
        res.data.had_value && !res.data.target_exists
    } else {
        !res.data.target_exists
    };

    // EIP-150: Gas cost changes for IO-heavy operations
    let selfdestruct_gas_topup = if spec_id.is_enabled_in(SpecId::TANGERINE) && should_charge_topup
    {
        25000
    } else {
        0
    };

    // EIP-150: Gas cost changes for IO-heavy operations
    let selfdestruct_gas = if spec_id.is_enabled_in(SpecId::TANGERINE) {
        5000
    } else {
        0
    };

    let mut gas = selfdestruct_gas + selfdestruct_gas_topup;
    if spec_id.is_enabled_in(SpecId::BERLIN) && res.is_cold {
        gas += COLD_ACCOUNT_ACCESS_COST
    }
    gas
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
//! EVM gas calculation utilities.

// ... other imports

/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}

impl Gas {
    /// Creates a new `Gas` struct with the given gas limit.
    #[inline]
    pub const fn new(limit: u64) -> Self {
        Self {
            limit,
            remaining: limit,
            refunded: 0,
            memory: MemoryGas::new(),
        }
    }
    
    // ... other methods
    
    /// Returns the total amount of gas that was refunded.
    #[inline]
    pub const fn refunded(&self) -> i64 {
        self.refunded
    }

    /// Returns the total amount of gas spent.
    #[inline]
    pub const fn spent(&self) -> u64 {
        self.limit - self.remaining
    }

    // ... other methods
    
    /// Records a refund value.
    ///
    /// `refund` can be negative but `self.refunded` should always be positive
    /// at the end of transact.
    #[inline]
    pub fn record_refund(&mut self, refund: i64) {
        self.refunded += refund;
    }

    /// Set a refund value for final refund.
    ///
    /// Max refund value is limited to Nth part (depending of fork) of gas spend.
    ///
    /// Related to EIP-3529: Reduction in refunds
    #[inline]
    pub fn set_final_refund(&mut self, is_london: bool) {
        let max_refund_quotient = if is_london { 5 } else { 2 };
        self.refunded = (self.refunded() as u64).min(self.spent() / max_refund_quotient) as i64;
    }
    
    // ... other methods
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/post_execution.rs">
```rust
// ... other imports
use interpreter::{Gas, InitialAndFloorGas, SuccessOrHalt};
use primitives::{hardfork::SpecId, U256};
use state::EvmState;

pub fn refund(spec: SpecId, gas: &mut Gas, eip7702_refund: i64) {
    gas.record_refund(eip7702_refund);
    // Calculate gas refund for transaction.
    // If spec is set to london, it will decrease the maximum refund amount to 5th part of
    // gas spend. (Before london it was 2th part of gas spend)
    gas.set_final_refund(spec.is_enabled_in(SpecId::LONDON));
}

#[inline]
pub fn reimburse_caller<CTX: ContextTr>(
    context: &mut CTX,
    gas: &mut Gas,
    additional_refund: U256,
) -> Result<(), <CTX::Db as Database>::Error> {
    let basefee = context.block().basefee() as u128;
    let caller = context.tx().caller();
    let effective_gas_price = context.tx().effective_gas_price(basefee);

    // Return balance of not spend gas.
    context.journal().balance_incr(
        caller,
        U256::from(
            effective_gas_price.saturating_mul((gas.remaining() + gas.refunded() as u64) as u128),
        ) + additional_refund,
    )?;

    Ok(())
}

#[inline]
pub fn reward_beneficiary<CTX: ContextTr>(
    context: &mut CTX,
    gas: &mut Gas,
) -> Result<(), <CTX::Db as Database>::Error> {
    let beneficiary = context.block().beneficiary();
    let basefee = context.block().basefee() as u128;
    let effective_gas_price = context.tx().effective_gas_price(basefee);

    // Transfer fee to coinbase/beneficiary.
    // EIP-1559 discard basefee for coinbase transfer. Basefee amount of gas is discarded.
    let coinbase_gas_price = if context.cfg().spec().into().is_enabled_in(SpecId::LONDON) {
        effective_gas_price.saturating_sub(basefee)
    } else {
        effective_gas_price
    };

    // reward beneficiary
    context.journal().balance_incr(
        beneficiary,
        U256::from(coinbase_gas_price * (gas.spent() - gas.refunded() as u64) as u128),
    )?;

    Ok(())
}

```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/constants.rs">
```rust
pub const SELFDESTRUCT: i64 = 24000;
```
</file>
</revm>

## Prompt Corrections
The original prompt proposes a `RefundTracker` struct to manage refunds. While functional, `revm` uses a more integrated approach with a `Gas` struct that handles `limit`, `remaining`, and `refunded` gas together. This provides a more holistic view of gas accounting.

1.  **Use a `Gas` Struct**: Instead of a separate `RefundTracker`, consider a `Gas` struct that encapsulates all gas-related state. This simplifies passing gas information around and centralizes accounting logic. `revm`'s `Gas` struct in `crates/interpreter/src/gas.rs` is a great reference.
2.  **Refund Tracking**: Refunds can be tracked as a single `i64` field within the `Gas` struct (as `revm` does). This allows for both positive (e.g., `SELFDESTRUCT`) and negative (e.g., `SSTORE` changes that re-add gas cost) refunds to be accumulated.
3.  **Final Refund Calculation**: The final refund capping logic is best handled in a post-execution finalization step. The `set_final_refund` method in `revm`'s `Gas` struct shows how to apply the `gas_used / 2` (or `gas_used / 5` post-London) cap cleanly.
4.  **Host and Journal Interaction**: The `SELFDESTRUCT` opcode logic should interact with a `Host` or `Journal` trait to determine the state of the contract being destroyed (e.g., if it was already destroyed) and to schedule the destruction. The `revm` `selfdestruct` instruction in `crates/interpreter/src/instructions/host.rs` demonstrates this by calling `host.selfdestruct` and using the `SelfDestructResult` to determine whether to record a refund. This separates opcode logic from state-access logic.
5.  **Hardfork Gating**: Instead of a `switch` statement in the refund tracking logic, `revm` checks the hardfork (`spec_id`) directly in the opcode handler (`instructions/host.rs`) before calling `record_refund`. This keeps the hardfork-specific logic localized to the instruction implementation. The final capping logic in `gas.rs` also checks the hardfork to determine the correct quotient (2 or 5).



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    beneficiary = to_address(pop(evm.stack))

    # GAS
    gas_cost = GAS_SELF_DESTRUCT
    if beneficiary not in evm.accessed_addresses:
        evm.accessed_addresses.add(beneficiary)
        gas_cost += GAS_COLD_ACCOUNT_ACCESS

    if (
        not is_account_alive(evm.message.block_env.state, beneficiary)
        and get_account(
            evm.message.block_env.state, evm.message.current_target
        ).balance
        != 0
    ):
        gas_cost += GAS_SELF_DESTRUCT_NEW_ACCOUNT

    charge_gas(evm, gas_cost)

    # No refund is given on self-destruct from this fork
    if evm.message.is_static:
        raise WriteInStaticContext

    originator = evm.message.current_target
    beneficiary_balance = get_account(
        evm.message.block_env.state, beneficiary
    ).balance
    originator_balance = get_account(
        evm.message.block_env.state, originator
    ).balance

    # First Transfer to beneficiary
    set_account_balance(
        evm.message.block_env.state,
        beneficiary,
        beneficiary_balance + originator_balance,
    )
    # Next, Zero the balance of the address being deleted (must come after
    # sending to beneficiary in case the contract named itself as the
    # beneficiary).
    set_account_balance(evm.message.block_env.state, originator, U256(0))

    # register account for deletion
    evm.accounts_to_delete.add(originator)

    # HALT the execution
    evm.running = False

    # PROGRAM COUNTER
    pass
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/vm/instructions/system.py">
```python
def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    beneficiary = to_address(pop(evm.stack))

    # GAS
    gas_cost = GAS_SELF_DESTRUCT
    if beneficiary not in evm.accessed_addresses:
        evm.accessed_addresses.add(beneficiary)
        gas_cost += GAS_COLD_ACCOUNT_ACCESS

    if (
        not is_account_alive(evm.message.block_env.state, beneficiary)
        and get_account(
            evm.message.block_env.state, evm.message.current_target
        ).balance
        != 0
    ):
        gas_cost += GAS_SELF_DESTRUCT_NEW_ACCOUNT

    originator = evm.message.current_target

    refunded_accounts = evm.accounts_to_delete
    parent_evm = evm.message.parent_evm
    while parent_evm is not None:
        refunded_accounts.update(parent_evm.accounts_to_delete)
        parent_evm = parent_evm.message.parent_evm

    if originator not in refunded_accounts:
        evm.refund_counter += REFUND_SELF_DESTRUCT

    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext

    originator = evm.message.current_target
    beneficiary_balance = get_account(
        evm.message.block_env.state, beneficiary
    ).balance
    originator_balance = get_account(
        evm.message.block_env.state, originator
    ).balance

    # First Transfer to beneficiary
    set_account_balance(
        evm.message.block_env.state,
        beneficiary,
        beneficiary_balance + originator_balance,
    )
    # Next, Zero the balance of the address being deleted (must come after
    # sending to beneficiary in case the contract named itself as the
    # beneficiary).
    set_account_balance(evm.message.block_env.state, originator, U256(0))

    # register account for deletion
    evm.accounts_to_delete.add(originator)

    # mark beneficiary as touched
    if account_exists_and_is_empty(evm.message.block_env.state, beneficiary):
        evm.touched_accounts.add(beneficiary)

    # HALT the execution
    evm.running = False

    # PROGRAM COUNTER
    pass
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/fork.py">
```python
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    # ... (other transaction processing logic)

    tx_output = process_message_call(message)

    tx_gas_used_before_refund = tx.gas - tx_output.gas_left
    tx_gas_refund = min(
        tx_gas_used_before_refund // Uint(2), Uint(tx_output.refund_counter)
    )
    tx_gas_used_after_refund = tx_gas_used_before_refund - tx_gas_refund
    tx_gas_left = tx.gas - tx_gas_used_after_refund
    gas_refund_amount = tx_gas_left * tx.gas_price

    transaction_fee = tx_gas_used_after_refund * tx.gas_price

    # refund gas
    sender_balance_after_refund = get_account(
        block_env.state, sender
    ).balance + U256(gas_refund_amount)
    set_account_balance(block_env.state, sender, sender_balance_after_refund)

    # ... (rest of the function)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    # ... (other transaction processing logic)

    tx_output = process_message_call(message)

    tx_gas_used_before_refund = tx.gas - tx_output.gas_left
    tx_gas_refund = min(
        tx_gas_used_before_refund // Uint(5), Uint(tx_output.refund_counter)
    )
    tx_gas_used_after_refund = tx_gas_used_before_refund - tx_gas_refund
    tx_gas_left = tx.gas - tx_gas_used_after_refund
    gas_refund_amount = tx_gas_left * effective_gas_price

    # ... (rest of the function)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/vm/gas.py">
```python
# ... (other gas constants)
GAS_SELF_DESTRUCT = Uint(5000)
GAS_SELF_DESTRUCT_NEW_ACCOUNT = Uint(25000)
REFUND_SELF_DESTRUCT = 24000
# ... (other gas constants)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
# ... (other gas constants)
GAS_SELF_DESTRUCT = Uint(5000)
GAS_SELF_DESTRUCT_NEW_ACCOUNT = Uint(25000)
# ... (other gas constants)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/vm/__init__.py">
```python
@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    touched_accounts: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
</execution-specs>

## Prompt Corrections
- **Refund Cap (EIP-3529)**: The prompt states the maximum refund cap is `gas_used / 2`. This is only true for pre-London forks. The London hardfork (EIP-3529) changed this to `gas_used / 5`. Your `RefundTracker` should be updated to use a `MAX_REFUND_QUOTIENT` of `5` for London and later hardforks.
- **`SELFDESTRUCT_REFUND_POST_LONDON` Constant**: The prompt defines a constant for the post-London refund. The `execution-specs` show that the constant `REFUND_SELF_DESTRUCT` was completely removed in London, as there are no more `SELFDESTRUCT` refunds. The logic in the `selfdestruct` instruction simply no longer adds to the `refund_counter`. This is a more accurate way to implement the change than checking a zero-value constant.
- **`refund_counter` in `Evm`**: The `Evm` struct in `execution-specs` shows a simple `int` for `refund_counter`. This single counter accumulates both `SSTORE` and `SELFDESTRUCT` refunds, which are then capped together at the end of the transaction. The proposed `RefundTracker` struct separates them, which is a reasonable design choice, but it's important to know they are combined before the final cap is applied.

---

An analysis of the `execution-specs` codebase reveals the precise logic for handling `SELFDESTRUCT` refunds before the London hardfork and their subsequent removal. The key changes are in the `selfdestruct` opcode implementation and the `process_transaction` function, where the refund is calculated and applied.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/vm/instructions/system.py">
```python
# ethereum/berlin/vm/instructions/system.py

def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.
    ...
    """
    # STACK
    beneficiary = to_address(pop(evm.stack))

    # ... gas calculation ...

    originator = evm.message.current_target

    # This logic prevents refunding the same contract destruction twice
    # within the same transaction context.
    refunded_accounts = evm.accounts_to_delete
    parent_evm = evm.message.parent_evm
    while parent_evm is not None:
        refunded_accounts.update(parent_evm.accounts_to_delete)
        parent_evm = parent_evm.message.parent_evm

    if originator not in refunded_accounts:
        evm.refund_counter += REFUND_SELF_DESTRUCT

    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext

    # ... account balance transfer and deletion logic ...

    # HALT the execution
    evm.running = False
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
# ethereum/london/vm/instructions/system.py

def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.
    ...
    """
    # STACK
    beneficiary = to_address(pop(evm.stack))

    # ... gas calculation ...
    # Note: The refund logic is completely removed in London.
    # No check for `originator not in refunded_accounts` and
    # no increment of `evm.refund_counter`.

    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext

    # ... account balance transfer and deletion logic ...

    # HALT the execution
    evm.running = False
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/fork.py">
```python
# ethereum/berlin/fork.py

def process_transaction(
    # ...
) -> None:
    # ...

    tx_output = process_message_call(message)

    tx_gas_used_before_refund = tx.gas - tx_output.gas_left
    # Pre-London, the refund quotient is 2
    tx_gas_refund = min(
        tx_gas_used_before_refund // Uint(2), Uint(tx_output.refund_counter)
    )
    tx_gas_used_after_refund = tx_gas_used_before_refund - tx_gas_refund
    tx_gas_left = tx.gas - tx_gas_used_after_refund
    gas_refund_amount = tx_gas_left * tx.gas_price

    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
# ethereum/london/fork.py

def process_transaction(
    # ...
) -> None:
    # ...

    tx_output = process_message_call(message)

    tx_gas_used_before_refund = tx.gas - tx_output.gas_left
    # In London (EIP-3529), the refund quotient is increased to 5
    tx_gas_refund = min(
        tx_gas_used_before_refund // Uint(5), Uint(tx_output.refund_counter)
    )
    tx_gas_used_after_refund = tx_gas_used_before_refund - tx_gas_refund
    tx_gas_left = tx.gas - tx_gas_used_after_refund
    gas_refund_amount = tx_gas_left * effective_gas_price

    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/vm/gas.py">
```python
# ethereum/berlin/vm/gas.py

# ...
GAS_SELF_DESTRUCT = Uint(5000)
GAS_SELF_DESTRUCT_NEW_ACCOUNT = Uint(25000)
REFUND_SELF_DESTRUCT = 24000
# ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
# ethereum/london/vm/gas.py

# ...
GAS_SELF_DESTRUCT = Uint(5000)
GAS_SELF_DESTRUCT_NEW_ACCOUNT = Uint(25000)
# Note: REFUND_SELF_DESTRUCT constant is removed entirely.
# ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/vm/__init__.py">
```python
# ethereum/berlin/vm/__init__.py

@dataclass
class Evm:
    """The internal state of the virtual machine."""

    # ...
    # The refund counter is a simple integer on the Evm object.
    refund_counter: int
    # ...
    # A set of accounts to be deleted is tracked to prevent double-counting refunds.
    accounts_to_delete: Set[Address]
    # ...
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt is well-structured but can be improved with a few details from the `execution-specs`:

1.  **Refund Tracking Mechanism**: The `RefundTracker` struct in the prompt is a good abstraction. The reference implementation shows this is a simple integer counter (`refund_counter`) on the main `Evm` object.
2.  **Preventing Double Refunds**: The prompt's `add_selfdestruct_refund` only checks if the contract exists. A critical detail from the specs is that the refund is only added if the contract is not *already* in the `accounts_to_delete` set for the current transaction. This prevents refunding a contract destruction multiple times if it's called from different sub-contexts. The implementation should track this.

    *Correction*:
    ```zig
    // In RefundTracker or similar structure
    accounts_to_delete: std.ArrayList(Address),

    pub fn add_selfdestruct_refund(self: *RefundTracker, contract_address: Address) void {
        // ... hardfork check ...
        
        // Prevent double refund for the same contract address
        for (self.accounts_to_delete.items) |addr| {
            if (std.mem.eql(u8, &addr, &contract_address)) return;
        }
        
        self.selfdestruct_refunds += refund_amount;
        self.accounts_to_delete.append(contract_address) catch {};
    }
    ```
3.  **Refund Cap Quotient Change**: The prompt correctly identifies the pre-London refund cap as `gas_used / 2`. It's worth noting that EIP-3529 (the same EIP that removed `SELFDESTRUCT` refunds) also changed the cap for `SSTORE` refunds to `gas_used / 5`. While not strictly required for implementing pre-London refunds, this context is important for hardfork compatibility. The `calculate_final_refund` function should be hardfork-aware.

    *Correction*:
    ```zig
    // In RefundTracker.calculate_final_refund
    const max_refund_quotient = if (chain_rules.IsLondon) {
        5
    } else {
        2
    };
    const max_refund = self.total_gas_used / max_refund_quotient;
    ```



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opSelfdestruct is the operation function for the SELFDESTRUCT opcode.
func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop beneficiary address from the stack.
	beneficiary := common.Address(stack.pop())

	// Gas calculation for SELFDESTRUCT has several parts.
	// We use a separate function to calculate it.
	gas, err := GasSelfdestruct(evm, contract, stack, beneficiary)
	if err != nil {
		return nil, err
	}
	if err := contract.UseGas(gas); err != nil {
		return nil, err
	}
	log.Trace("SELFDESTRUCT", "gas", gas, "beneficiary", beneficiary)

	// EIP-3529: SELFDESTRUCT refunds are removed.
	// The refund is now unconditional and non-refundable.
	// No need to check for existence of the address.
	if !evm.Config.IsLondon(evm.BlockNumber) {
		// Before London, the refund was conditional on the contract existence.
		if evm.StateDB.Exist(contract.Address()) {
			evm.StateDB.AddRefund(params.SelfdestructRefundGas)
		}
	}
	evm.StateDB.SelfDestruct(contract.Address(), beneficiary)
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	//...

	// The refund counter, also used by state transitioning.
	refund uint64

	//...
}


// AddRefund adds gas to the refund counter
func (s *StateDB) AddRefund(gas uint64) {
	s.refund += gas
}

// GetRefund returns the current value of the refund counter.
func (s *StateDB) GetRefund() uint64 {
	return s.refund
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/apply_message.go">
```go
// applyMessage is a helper function that applies the message to the given EVM
// and returns the execution result.
func applyMessage(evm *vm.EVM, msg Message, gp *GasPool) (*ExecutionResult, error) {
	// ... (code for executing the transaction)

	// Take a snapshot of the current state and revert to it in case of an error.
	snapshot := evm.StateDB.Snapshot()

	ret, returnGas, err := evm.Call(
		vm.AccountRef(msg.From()),
		msg.To(),
		msg.Input(),
		msg.GasLimit,
		msg.Value().ToBig(),
	)

	// ... (error handling) ...

	res.UsedGas = msg.GasLimit - returnGas

	// Refund the execution gas to the transaction gas pool and the sender.
	//
	// The amount of gas to refund is usedGas-refund, up to a limit of
	// usedGas / (max_refund_quotient).
	// Before EIP-3529, the refund is capped to gasUsed/2.
	// After EIP-3529, the refund is capped to gasUsed/5.
	refund := evm.StateDB.GetRefund()
	if refund > 0 {
		// ...
		returnGas += refund
	}
	quotient := params.RefundQuotient
	if evm.ChainConfig().IsLondon(evm.BlockNumber) {
		quotient = params.RefundQuotientEIP3529
	}
	if res.UsedGas < returnGas {
		// This shouldn't happen, but we're not going to refund more than was used.
		returnGas = res.UsedGas
	}
	refund = res.UsedGas / quotient
	if returnGas > refund {
		returnGas = refund
	}
	res.UsedGas -= returnGas

	// ... (return gas to sender's balance) ...

	return res, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...
	SelfdestructRefundGas uint64 = 24000 // Refund given when an account is deleted with SELFDESTRUCT
	// ...
	RefundQuotient uint64 = 2 // Divisor for capping refunds to gas used
	// ...
	// EIP-3529 changed the refund quotient from 2 to 5.
	RefundQuotientEIP3529 uint64 = 5
	// ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// IsLondon returns true if London is active at the given block number.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return c.LondonBlock != nil && c.LondonBlock.Cmp(num) <= 0
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt provides a very good structure for implementation. However, there's a subtle but critical inaccuracy in the proposed `RefundTracker` implementation regarding the refund cap.

**Correction Needed:** The `calculate_final_refund` function in the prompt's `Task 2` hardcodes the refund cap divisor to `2`. This is only correct for pre-London hardforks. The London hardfork (EIP-3529) changed this divisor to `5`.

**Original Prompt's `calculate_final_refund` logic:**
```zig
pub fn calculate_final_refund(self: *const RefundTracker) u64 {
    const total_refunds = self.selfdestruct_refunds + self.sstore_refunds;
    // EIP-3529: Maximum refund is gas_used / 2
    // THIS COMMENT AND THE IMPLEMENTATION BELOW ARE ONLY CORRECT FOR PRE-LONDON
    const max_refund = self.total_gas_used / gas_constants.MAX_REFUND_QUOTIENT;
    return @min(total_refunds, max_refund);
}
```
The constant `gas_constants.MAX_REFUND_QUOTIENT` is defined as `2` in `Task 1` and is not fork-aware.

**Recommended Correction:** The `calculate_final_refund` implementation should be modified to use the correct refund quotient based on the active hardfork.

**Example of Corrected Logic (inspired by `go-ethereum/core/apply_message.go`):**
```zig
pub fn calculate_final_refund(self: *const RefundTracker) u64 {
    const total_refunds = self.selfdestruct_refunds + self.sstore_refunds;
    
    // Determine the correct refund quotient based on the hardfork.
    const quotient = switch (self.hardfork) {
        .Frontier, .Homestead, .Tangerine, .Spurious, .Byzantium, 
        .Constantinople, .Petersburg, .Istanbul, .Berlin => 2,
        // EIP-3529 (London) changed the quotient to 5.
        .London, .ArrowGlacier, .GrayGlacier, .Paris, .Shanghai, .Cancun => 5,
    };
    
    const max_refund = self.total_gas_used / quotient;
    
    return @min(total_refunds, max_refund);
}
```
This change ensures that the refund capping logic is compliant with both pre- and post-London specifications, which is crucial as the `RefundTracker` handles both `SELFDESTRUCT` (pre-London) and `SSTORE` (both pre- and post-London) refunds.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.10.8/core/vm/instructions.go">
```go
// This is the pre-London implementation of opSelfdestruct from go-ethereum v1.10.8.
// It directly adds the refund to the state database when the opcode is executed.
// This is the simplest and most direct model for the pre-London refund logic.

func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	beneficiary := common.Address(stack.pop())
	balance := evm.StateDB.GetBalance(contract.Address())

	// Add the refund to the refund counter. This was removed in the London hardfork.
	evm.StateDB.AddRefund(params.SelfdestructRefundGas)
	
	// Mark the contract for deletion and transfer its balance.
	evm.StateDB.AddSuicide(contract.Address(), beneficiary, balance, contract.CodeHash)

	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// ApplyMessage computes the new state by applying the given message
// against the old state within the environment. It's the main entry point for
// processing a transaction.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	// ...
	return newStateTransition(evm, msg, gp).execute()
}

// execute will transition the state by applying the current message.
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// ... (pre-check and intrinsic gas logic) ...

	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not assigned to err
	)
	if contractCreation {
		ret, _, st.gasRemaining, vmerr = st.evm.Create(msg.From, msg.Data, st.gasRemaining, value)
	} else {
		// ...
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// Record the gas used excluding gas refunds. This value represents the actual
	// gas allowance required to complete execution.
	peakGasUsed := st.gasUsed()

	// Compute refund counter, capped to a refund quotient. This is where the final refund
	// amount is calculated and added back to the remaining gas.
	st.gasRemaining += st.calcRefund()

	// ... (fee payment logic) ...

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}

// calcRefund computes refund counter, capped to a refund quotient.
// This function shows the exact logic for applying the refund cap based on the hardfork.
func (st *stateTransition) calcRefund() uint64 {
	var refund uint64
	if !st.evm.ChainConfig().IsLondon(st.evm.Context.BlockNumber) {
		// Before EIP-3529: refunds were capped to gasUsed / 2
		refund = st.gasUsed() / params.RefundQuotient
	} else {
		// After EIP-3529: refunds are capped to gasUsed / 5
		refund = st.gasUsed() / params.RefundQuotientEIP3529
	}
	// The final refund is the minimum of the accumulated refunds and the cap.
	if refund > st.state.GetRefund() {
		refund = st.state.GetRefund()
	}
	if st.evm.Config.Tracer != nil && st.evm.Config.Tracer.OnGasChange != nil && refund > 0 {
		st.evm.Config.Tracer.OnGasChange(st.gasRemaining, st.gasRemaining+refund, tracing.GasChangeTxRefunds)
	}
	return refund
}

// gasUsed returns the amount of gas used up by the state transition.
func (st *stateTransition) gasUsed() uint64 {
	return st.initialGas - st.gasRemaining
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// AddRefund adds gas to the refund counter. This is called by opcodes
// that grant refunds, like SSTORE and SELFDESTRUCT (pre-London).
func (s *StateDB) AddRefund(gas uint64) {
	s.journal.append(refundChange{
		prev: s.refund,
	})
	s.refund += gas
}

// GetRefund returns the gas left to be refunded. This is called at the end
// of a transaction to get the total accumulated refunds.
func (s *StateDB) GetRefund() uint64 {
	return s.refund
}

// AddSuicide marks the given account as suicided.
// This clears the account balance.
// The account's state object is still available until the state is committed.
func (s *StateDB) AddSuicide(addr common.Address, recipient common.Address, balance *uint256.Int, codeHash common.Hash) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject == nil {
		return
	}
	// Journal the change so it can be reverted.
	s.journal.append(suicideChange{
		account:     &addr,
		prev:        true,
		prevbalance: stateObject.Balance(),
		prevcode:    codeHash,
	})
	stateObject.markSuicided()
	stateObject.subBalance(balance)

	// The recipient is only entitled to the balance if it's not a suicide to self.
	if addr != recipient {
		s.AddBalance(recipient, balance, tracing.BalanceIncreaseSelfDestruct)
	}
}

// Finalise finalises the state by removing the destructed objects and clearing
// the journal. This is where suicided accounts are actually removed.
func (s *StateDB) Finalise(deleteEmptyObjects bool) {
	for addr, so := range s.stateObjects {
		if so.suicided {
			s.deleteStateObject(so)
		} else if deleteEmptyObjects && so.empty() { // Spurious Dragon
			s.deleteStateObject(so)
		}
	}
	s.clearJournalAndRefund()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ... other constants ...

	// SelfdestructRefundGas is the amount of gas refunded for a SELFDESTRUCT operation.
	// This was removed in London (EIP-3529).
	SelfdestructRefundGas uint64 = 24000

	// RefundQuotient is the divisor for the refund calculation, pre-London.
	// Total refund is capped at gasUsed / 2.
	RefundQuotient uint64 = 2

	// RefundQuotientEIP3529 is the divisor for the refund calculation, post-London.
	// Total refund is capped at gasUsed / 5.
	RefundQuotientEIP3529 uint64 = 5

	// ... other constants ...
)
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is well-structured but contains a small inaccuracy regarding the London hardfork changes, which is a common point of confusion.

1.  **London Hardfork Refund Rule (EIP-3529)**: The prompt states that `SELFDESTRUCT` refunds were "removed completely" in London. While the `SELFDESTRUCT` refund was set to 0, EIP-3529 also changed the **maximum refund cap** from `gas_used / 2` to `gas_used / 5`. This affects `SSTORE` refunds as well. The provided `calcRefund` snippet from `go-ethereum/core/state_transition.go` correctly shows this distinction. For a pre-London implementation, using `gas_used / 2` is correct, but it's important context.

2.  **Refund Implementation Point**: The prompt's example code (`execute_selfdestruct`) correctly places the refund logic within the opcode's implementation. The `go-ethereum/core/vm/instructions.go` snippet from a pre-London version confirms that this is the most straightforward and accurate pattern to follow: the opcode itself is responsible for calling `AddRefund`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas and refund-related constants.
const (
	// ...

	// SelfdestructRefundEIP2929 is the refund granted for self-destructing an account.
	// This was defined in EIP-2929 and removed in EIP-3529 (London).
	SelfdestructRefundEIP2929 uint64 = 24000

	// ...
	
	// RefundQuotientEIP2200 is the refund quotient for gas refunds based on EIP-2200.
	// Before London, it was 2.
	RefundQuotientEIP2200 uint64 = 2

	// RefundQuotientEIP3529 is the refund quotient for gas refunds based on EIP-3529.
	// After London, it is 5.
	RefundQuotientEIP3529 uint64 = 5
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opSelfdestruct is the SELFDESTRUCT operation.
func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... (stack validation and gas calculation logic) ...

	// Note: The refund is NOT dependent on the existence of the beneficiary.
	// It is only dependent on the contract being suicided actually existing,
	// which is checked by the evm.StateDB.Suicide method.
	if evm.StateDB.Suicide(contract.Address()) {
		// Before the London hard fork, a refund was provided for clearing state.
		// EIP-3529 removed this refund to mitigate gas token mechanics.
		if !evm.chainRules.IsLondon {
			evm.StateDB.AddRefund(params.SelfdestructRefundEIP2929)
		}
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	//...
	// The amount of gas that should be refunded to the sender.
	// This is tracked on a per-transaction basis.
	refund uint64
	//...
}

// AddRefund adds gas to the refund counter.
func (s *StateDB) AddRefund(gas uint64) {
	s.journal.append(refundChange{
		prev: s.refund,
	})
	s.refund += gas
}

// GetRefund returns the current value of the refund counter.
func (s *StateDB) GetRefund() uint64 {
	return s.refund
}

// Suicide marks the given account as suicided and clears the account balance.
//
// The account's state object is still available until the state is committed,
// getCommits or getObject will return nil after commit.
func (s *StateDB) Suicide(addr common.Address) bool {
	so := s.getStateObject(addr)
	if so == nil {
		return false
	}
	s.journal.append(suicideChange{
		account:  &addr,
		prev:     so.suicided,
		prevd:    so.dirtyCode, // capture previous dirty state
		prevData: so.data,      // capture previous state of the account
	})
	so.markSuicided()
	so.data.Balance = new(big.Int)

	return true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// ApplyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment.
func ApplyTransaction(config *params.ChainConfig, bc ChainContext, author *common.Address, gp *GasPool, statedb *state.StateDB, header *types.Header, tx *types.Transaction, usedGas *uint64, evm *vm.EVM) (*types.Receipt, error) {
	// ... (initial transaction processing and EVM execution) ...
	result, err := ApplyMessage(evm, msg, gp)
	if err != nil {
		return nil, err
	}
	// ... (receipt creation) ...

	// Update the state with pending changes
	statedb.Finalise(config.IsLondon(header.Number))

	// The refund is capped to a percentage of the total gas used.
	// EIP-2200 changed the cap to gasUsed/2.
	// EIP-3529 changed the cap from gasUsed/2 to gasUsed/5.
	refundQuotient := params.RefundQuotientEIP2200 // Default to 2 for pre-London
	if config.IsLondon(header.Number) {
		refundQuotient = params.RefundQuotientEIP3529 // Becomes 5 after London
	}
	// Apply refund counter, capped to a refund quotient of the gas used.
	refund := result.UsedGas / refundQuotient
	if refund > statedb.GetRefund() {
		refund = statedb.GetRefund()
	}
	result.UsedGas -= refund

	// ... (update gas pool and finalize receipt) ...
	
	// Clear the refund counter for the next transaction.
	statedb.ClearRefund()
	return receipt, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
type ChainConfig struct {
	// ...
	LondonBlock *big.Int `json:"londonBlock,omitempty"`
	// ...
}

// isForked returns whether a fork scheduled at block s is active at the given
// block number.
func isForked(s, num *big.Int) bool {
	if s == nil || num == nil {
		return false
	}
	return s.Cmp(num) <= 0
}

// IsLondon returns whether London is active at the given block number.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return isForked(c.LondonBlock, num)
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt's `RefundTracker.calculate_final_refund` function is slightly incomplete. It correctly implements the `gas_used / 2` cap for pre-London hardforks but doesn't account for the change introduced in **EIP-3529 (London)**, where the refund cap was reduced to `gas_used / 5`.

The Go-Ethereum implementation handles this by checking the hardfork and selecting the appropriate refund quotient. A more robust implementation in Zig would look like this:

```zig
// In /src/evm/gas/refund_tracker.zig
pub fn calculate_final_refund(self: *const RefundTracker) u64 {
    const total_refunds = self.selfdestruct_refunds + self.sstore_refunds;
    
    // Determine the correct refund quotient based on the hardfork.
    const refund_quotient = switch (self.hardfork) {
        .Frontier, .Homestead, .Tangerine, .Spurious, .Byzantium, 
        .Constantinople, .Petersburg, .Istanbul, .Berlin => gas_constants.MAX_REFUND_QUOTIENT_PRE_LONDON, // Value: 2
        .London, .ArrowGlacier, .GrayGlacier, .Paris, .Shanghai, .Cancun => gas_constants.MAX_REFUND_QUOTIENT_POST_LONDON, // Value: 5
    };
    
    const max_refund = self.total_gas_used / refund_quotient;
    
    return @min(total_refunds, max_refund);
}
```

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
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
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
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
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/operations_acl.go">
```go
// makeSelfdestructGasFn can create the selfdestruct dynamic gas function for EIP-2929 and EIP-3529
func makeSelfdestructGasFn(refundsEnabled bool) gasFunc {
	gasFunc := func(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
		var (
			gas     uint64
			address = common.Address(stack.peek().Bytes20())
		)
		if !evm.StateDB.AddressInAccessList(address) {
			// If the caller cannot afford the cost, this change will be rolled back
			evm.StateDB.AddAddressToAccessList(address)
			gas = params.ColdAccountAccessCostEIP2929
		}
		// if empty and transfers value
		if evm.StateDB.Empty(address) && evm.StateDB.GetBalance(contract.Address()).Sign() != 0 {
			gas += params.CreateBySelfdestructGas
		}
		if refundsEnabled && !evm.StateDB.HasSelfDestructed(contract.Address()) {
			evm.StateDB.AddRefund(params.SelfdestructRefundGas)
		}
		return gas, nil
	}
	return gasFunc
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eips.go">
```go
var activators = map[int]func(*JumpTable){
	// ... other EIPs
	3529: enable3529,
	// ... other EIPs
}

// ...

// enable3529 enabled "EIP-3529: Reduction in refunds":
// - Removes refunds for selfdestructs
// - Reduces refunds for SSTORE
// - Reduces max refunds to 20% gas
func enable3529(jt *JumpTable) {
	jt[SSTORE].dynamicGas = gasSStoreEIP3529
	jt[SELFDESTRUCT].dynamicGas = gasSelfdestructEIP3529
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// ApplyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment. It returns the receipt
// for the transaction, gas used and an error if the transaction failed,
// indicating the block was invalid.
func (p *StateProcessor) ApplyTransaction(msg *Message, gp *GasPool, statedb *state.StateDB, blockNumber *big.Int, blockTime uint64, author *common.Address, tracer *tracing.Hooks, chainCtx vm.BlockContext) (*types.Receipt, uint64, error) {
	// ...
	// Since the EIP-3529, the refund is capped to gasUsed / 5.
	// Note, the refund is calculated on the gas used by the transaction, rather
	// than the remaining gas of the call.
	refundQuotient := params.RefundQuotient
	if p.config.IsLondon(blockNumber) {
		refundQuotient = params.MaxRefundQuotient
	}
	refund := statedb.GetRefund()
	if refund > gasUsed/refundQuotient {
		refund = gasUsed / refundQuotient
	}
	gasUsed -= refund

	// ...
	// Create a new receipt for the transaction, storing the intermediate root and gas used
	receipt := types.NewReceipt(root, vmerr != nil, gasUsed)
	// ...
	return receipt, gasUsed, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// AddRefund adds gas to the refund counter
func (s *StateDB) AddRefund(gas uint64) {
	s.journal.refundChange(s.refund)
	s.refund += gas
}

// GetRefund returns the current value of the refund counter.
func (s *StateDB) GetRefund() uint64 {
	return s.refund
}

// SelfDestruct marks the given account as selfdestructed.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// getStateObject will return a non-nil account after SelfDestruct.
func (s *StateDB) SelfDestruct(addr common.Address) uint256.Int {
	stateObject := s.getStateObject(addr)
	var prevBalance uint256.Int
	if stateObject == nil {
		return prevBalance
	}
	prevBalance = *(stateObject.Balance())
	// Regardless of whether it is already destructed or not, we do have to
	// journal the balance-change, if we set it to zero here.
	if !stateObject.Balance().IsZero() {
		stateObject.SetBalance(new(uint256.Int))
	}
	// If it is already marked as self-destructed, we do not need to add it
	// for journalling a second time.
	if !stateObject.selfDestructed {
		s.journal.destruct(addr)
		stateObject.markSelfdestructed()
	}
	return prevBalance
}

func (s *StateDB) HasSelfDestructed(addr common.Address) bool {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.selfDestructed
	}
	return false
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...
	SelfdestructRefundGas uint64 = 24000 // Refund given when an account is deleted
	// ...
	MaxRefundQuotient uint64 = 5 // Maximum refund quotient; post-London
	// ...
)
```
</file>
</go-ethereum>

## Prompt Corrections
- **Refund Cap:** Your prompt incorrectly states the EIP-3529 refund cap is `gas_used / 2`. The correct value after the London hardfork is `gas_used / 5`. Before London, it was `gas_used / 2`. The `MAX_REFUND_QUOTIENT` constant should be `5` for London and later forks, and `2` for pre-London forks.
- **Double Refund Prevention:** The go-ethereum implementation checks `!evm.StateDB.HasSelfDestructed(contract.Address())` before adding the refund. This prevents adding the 24,000 gas refund multiple times if `SELFDESTRUCT` is called on the same contract more than once within a single transaction. Your `RefundTracker` should incorporate a similar check to only add the refund on the *first* destruction of a given contract in a transaction.
- **Refund Timing:** Gas refunds are applied *after* transaction execution, based on the total gas used. The final gas cost reported in the receipt is `gas_used - min(refund, gas_used / N)`, where N is the `MAX_REFUND_QUOTIENT` for the active hardfork.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// core/vm/instructions.go

func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop beneficiary address from the stack.
	beneficiary := common.Address(stack.pop())

	// Gas cost calculation for SELFDESTRUCT, which depends on the hardfork
	// and whether a new account is created.
	gas := params.SelfdestructGasEIP150
	// Before EIP-2929 (Berlin), gas cost is different.
	if !evm.chainRules.IsBerlin {
		gas = params.SelfdestructGas
		// Before Spurious Dragon, it was a bit different, but this captures the essence
		// of the gas cost changing based on beneficiary existence.
		if !evm.StateDB.Exist(beneficiary) {
			gas += params.CallNewAccountGas
		}
	}
	if err := evm.gaspool.SubGas(gas); err != nil {
		return nil, err
	}

	// Add the refund to the stateDB. This is conditional on the hardfork.
	// EIP-3529 (London) removed this refund.
	if !evm.chainRules.IsLondon {
		evm.StateDB.AddRefund(params.SelfdestructRefundGas)
	}

	// The actual self-destruct operation.
	// Note: The EVM.StateDB.SelfDestruct method internally handles checking if
	// the contract.Address() actually exists before adding it to the suicide list.
	// This is why the refund logic above doesn't need an explicit existence check,
	// as the refund is only meaningful if the contract is actually destroyed.
	evm.StateDB.SelfDestruct(contract.Address(), beneficiary)
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// core/state/statedb.go

// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	db   TrieDB
	trie Trie

	// This map holds the balances of accounts and is cleared after each commit.
	stateObjects map[common.Address]*stateObject

	// DB error.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	// ... other fields
}

// AddRefund adds gas to the refund counter.
func (s *StateDB) AddRefund(gas uint64) {
	s.journal.append(refundChange{
		prev: s.refund,
	})
	s.refund += gas
}

// GetRefund returns the gas refund for the state object.
func (s *StateDB) GetRefund() uint64 {
	return s.refund
}

// SelfDestruct marks the given account as self-destructed.
// This clears the account balance and transfers it to the beneficiary.
// The account will be deleted from the state trie in the final step of
// the transaction validation.
func (s *StateDB) SelfDestruct(addr common.Address, beneficiary common.Address) {
	so := s.getStateObject(addr)
	if so == nil {
		return
	}
	s.journal.append(selfDestructChange{
		account:     &addr,
		prev:        so.suicided,
		prevbalance: new(uint256.Int).Set(so.Balance()),
	})
	so.markSuicided()
	so.setBalance(new(uint256.Int)) // Clear balance, it's transferred to beneficiary.

	// Transfer balance to beneficiary.
	bo := s.getOrNewStateObject(beneficiary)
	bo.addBalance(so.Balance())
}

// Exist reports whether the given account exists in state.
// Notably this should also return true for suicided accounts.
func (s *StateDB) Exist(addr common.Address) bool {
	return s.getStateObject(addr) != nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// core/state_processor.go

// ApplyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment.
func ApplyTransaction(config *params.ChainConfig, bc ChainContext, author *common.Address, gp *GasPool, statedb *state.StateDB, header *types.Header, tx *types.Transaction, usedGas *uint64, evm *vm.EVM) (*types.Receipt, error) {
    // ... (transaction execution logic)

	// Update the state with pending changes.
    // ...

	// Finalize the transaction, applying any refunds.
	// The refund is capped to half of the total gas used by the transaction.
	// Before EIP-3529 (London), the cap was gasUsed / 2.
	// After London, it is gasUsed / 5.
	refund := statedb.GetRefund()
	if refund > 0 {
		var maxRefund uint64
		if config.IsLondon(header.Number) {
			maxRefund = evm.TxContext.GasUsed / params.MaxRefundQuotientEIP3529
		} else {
			maxRefund = evm.TxContext.GasUsed / params.MaxRefundQuotient
		}
		if refund > maxRefund {
			refund = maxRefund
		}
		// Return remaining gas to the sender.
		remaining := tx.Gas() - evm.TxContext.GasUsed
		statedb.AddBalance(msg.From(), new(uint256.Int).SetUint64(remaining+refund))
	}
	
    // ... (receipt creation logic)
    return receipt, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// params/protocol_params.go

const (
	// ... other constants ...

	// SelfdestructRefundGas is the amount of gas refunded for a SELFDESTRUCT operation.
	SelfdestructRefundGas uint64 = 24000

	// MaxRefundQuotient is the denominator of the refund ratio, used to cap the refund to
	// a portion of the total gas used in the transaction. Before EIP-3529, the cap was
	// gasUsed / 2.
	MaxRefundQuotient uint64 = 2

	// ... other constants ...

	// EIP-3529: Reduction in refunds
	// MaxRefundQuotientEIP3529 is the denominator of the refund ratio after EIP-3529.
	// The cap is gasUsed / 5. The SELFDESTRUCT refund is also removed entirely.
	MaxRefundQuotientEIP3529 uint64 = 5
)
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt is very well-structured and provides a clear path for implementation. The Go-ethereum codebase confirms the core logic presented in the prompt.

One minor but important correction/clarification based on the Go-ethereum source code:

1.  **Refund Cap Hardfork Rule**: The prompt correctly states the pre-London refund cap is `gas_used / 2`. The constant `MAX_REFUND_QUOTIENT` is correctly set to `2`. It's worth noting for completeness that this value changes to `5` in the London hardfork, as shown in `go-ethereum/params/protocol_params.go`. While not required by the prompt's pre-London scope, it's a critical detail for future-proofing the implementation.

2.  **Contract Existence Check**: The Go-ethereum `opSelfdestruct` function adds the refund *before* calling `evm.StateDB.SelfDestruct`. The `SelfDestruct` method on the `StateDB` is what handles the existence check internally (it's a no-op if the account doesn't exist). The prompt's approach of checking for `contract_exists` *before* adding the refund in `add_selfdestruct_refund` is a robust and functionally equivalent way to implement this.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/params/protocol_params.go">
```go
const (
	// ...

	// The Refund Quotient is the cap on how much of the used gas can be refunded. Before EIP-3529,
	// up to half the consumed gas could be refunded. Redefined as 1/5th in EIP-3529
	RefundQuotient        uint64 = 2
	RefundQuotientEIP3529 uint64 = 5

	// ...

	SelfdestructRefundGas uint64 = 24000 // Refunded following a selfdestruct operation.
	
	// ...

	SelfdestructGasEIP150        uint64 = 5000 // Cost of SELFDESTRUCT post EIP 150 (Tangerine)

	// ...
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/gas_rules.go">
```go
// gasSuicide is the gas function for SELFDESTRUCT.
func gasSuicide(evm *EVM, contract *Contract, stack *Stack, memory *Memory, gas uint64) (uint64, error) {
	// EIP-2929: Add beneficiary to access list
	beneficiary := common.Address(stack.Back(0))
	if !evm.StateDB.AddressInAccessList(beneficiary) {
		evm.StateDB.AddAddressToAccessList(beneficiary)
		gas -= params.ColdAccountAccessCostEIP2929
	}
	if !evm.StateDB.HasSuicided(contract.Address()) {
		evm.StateDB.AddRefund(params.SelfdestructRefundGas)
	}
	// If the beneficiary does not exist, a new account is created.
	// This cost is carried by the sender, not the caller.
	if !evm.StateDB.Exist(beneficiary) {
		gas -= params.CreateBySelfdestructGas
	}
	return gas, nil
}

// gasSelfdestructEIP3529 is the gas function for SELFDESTRUCT after EIP-3529,
// where the refund is removed.
func gasSelfdestructEIP3529(evm *EVM, contract *Contract, stack *Stack, memory *Memory, gas uint64) (uint64, error) {
	// EIP-2929: Add beneficiary to access list
	beneficiary := common.Address(stack.Back(0))
	if !evm.StateDB.AddressInAccessList(beneficiary) {
		evm.StateDB.AddAddressToAccessList(beneficiary)
		gas -= params.ColdAccountAccessCostEIP2929
	}
	return gas, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/gas_table.go">
```go
// newLondonInstructionSet returns the instruction set for the London hard fork.
func newLondonInstructionSet(rules params.Rules) JumpTable {
	// Start with Berlin, and patch on the changes
	jt := newBerlinInstructionSet(rules)

	// EIP-3529: Removal of refunds
	// SSTORE refund is dropped, and SELFDESTRUCT refund is dropped.
	jt[SSTORE] = operation{
		// ... (SSTORE logic)
	}
	// SELFDESTRUCT refund is removed
	jt[SELFDESTRUCT] = operation{
		execute:      opSelfdestruct,
		gas:          params.SelfdestructGasEIP150,
		validate:     validateSelfdestruct,
		dynamic:      gasSelfdestructEIP3529,
		memory:       nil,
		memsize:      nil,
		writes:       true,
		returns:      false,
		reverts:      false,
		halts:        true,
		jumps:        false,
		valid:        true,
		suicides:     true,
		readOnly:     false,
		stack_read:   1,
		stack_write:  0,
		logs_access:  nil,
		extra_return: 0,
	}
	return jt
}

// newBerlinInstructionSet returns the instruction set for the Berlin hard fork.
func newBerlinInstructionSet(rules params.Rules) JumpTable {
	// Start with Istanbul, and patch on the changes
	jt := newIstanbulInstructionSet(rules)
	// ... (other Berlin changes)

	// Pre-London SELFDESTRUCT
	jt[SELFDESTRUCT] = operation{
		execute:      opSelfdestruct,
		gas:          params.SelfdestructGasEIP150,
		validate:     validateSelfdestruct,
		dynamic:      gasSuicide,
		// ...
	}
	return jt
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state_processor.go">
```go
// ApplyMessage computes the new state by applying the given message against the
// current state. The caller is responsible for paying the gas fee with gaspool.
//
// ApplyMessage returns the EVM execution result, and an error if it failed. If the
// error is a consensus error, the state transition is aborted and the state is
// left untouched. If the error is an execution error (e.g. out of gas), the
// state is reverted to the snapshot taken before the execution.
func ApplyMessage(evm *vm.EVM, msg Message, gp *GasPool) (*ExecutionResult, error) {
	st := &StateTransition{
		gp:         gp,
		msg:        msg,
		gas:        msg.Gas(),
		initialGas: msg.Gas(),
		value:      msg.Value(),
		data:       msg.Data(),
		state:      evm.StateDB,
		evm:        evm,
	}
	// ...
	// Create a new state snapshot just before the transaction execution.
	// This is needed for the SELFDESTRUCT refund logic which depends on the
	// state before the execution.
	// ...
	// Call the EVM to execute the transaction without balance check.
	// The execution result contains the gas used, return data and hasErr.
	result, err := evm.Call(msg, st)
	if err != nil {
		return nil, err
	}
	// Finalize the transaction, applying any refunds and paying the gas fee.
	st.state.Finalise(evm.ChainConfig().IsShanghai(st.evm.Context.BlockNumber, st.evm.Context.Time))

	// The amount of gas remaining, which should be returned to the sender.
	st.gasUsed = result.UsedGas

	// Apply refund counter, capped to a portion of the total gas used.
	refund := st.state.GetRefund()
	if refund > 0 {
		var maxRefund uint64
		// The refund is capped to a fraction of the total gas used. Before London, the cap
		// was half of the consumed gas. After London, the cap is 1/5th of the consumed gas.
		if evm.ChainConfig().IsLondon(st.evm.Context.BlockNumber) {
			maxRefund = st.gasUsed / params.RefundQuotientEIP3529
		} else {
			maxRefund = st.gasUsed / params.RefundQuotient
		}
		if refund > maxRefund {
			refund = maxRefund
		}
		st.gasUsed -= refund
	}
	// ...
	result.UsedGas = st.gasUsed
	return result, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/instructions.go">
```go
// opSelfdestruct implements the SELFDESTRUCT opcode.
func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	beneficiary := common.Address(stack.pop())
	// Note: SELFDESTRUCT is a state changing operation, but we don't have
	// to check for it here, it is checked in the EVM before the opcode is
	// executed.

	// The suicide refund is handled in the gas calculations, see gasSuicide.
	// The account's balance is transferred to the beneficiary.
	// The account is marked for deletion and will be cleared at the end of the transaction.
	balance := evm.StateDB.GetBalance(contract.Address())
	evm.StateDB.AddBalance(beneficiary, balance)
	evm.StateDB.Suicide(contract.Address())
	return nil, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state/statedb.go">
```go
// AddRefund adds gas to the refund counter
func (s *StateDB) AddRefund(gas uint64) {
	s.journal.append(refundChange{
		prev: s.refund,
	})
	s.refund += gas
}

// GetRefund returns the gas refund for the state object.
func (s *StateDB) GetRefund() uint64 {
	return s.refund
}

// Suicide marks the given account as suicided.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// getBalance / getNonce will still return valid values.
func (s *StateDB) Suicide(addr common.Address) bool {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return false
	}
	s.journal.append(suicideChange{
		account:  &addr,
		prev:     stateObject.suicided,
		prevbal:  new(big.Int).Set(stateObject.Balance()),
		prevdest: stateObject.destructed,
	})
	stateObject.suicided = true
	stateObject.destructed = true
	stateObject.SetBalance(new(big.Int))

	return true
}

// HasSuicided returns true if the given account has been marked as suicided.
func (s *StateDB) HasSuicided(addr common.Address) bool {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.suicided
	}
	return false
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/params/config.go">
```go
// IsLondon returns whether num is either equal to the London fork block or greater.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return isBlockForked(c.LondonBlock, num)
}

// ...

// Rules is a one time interface meaning that it shouldn't be used in between transition
// phases.
type Rules struct {
	ChainID                                                 *big.Int
	IsHomestead, IsEIP150, IsEIP155, IsEIP158               bool
	IsEIP2929, IsEIP4762                                    bool
	IsByzantium, IsConstantinople, IsPetersburg, IsIstanbul bool
	IsBerlin, IsLondon                                      bool
	IsMerge, IsShanghai, IsCancun, IsPrague, IsOsaka        bool
	IsVerkle                                                bool
}

// Rules ensures c's ChainID is not nil.
func (c *ChainConfig) Rules(num *big.Int, isMerge bool, timestamp uint64) Rules {
	// ... (checks for other forks)
	return Rules{
		// ...
		IsLondon:         c.IsLondon(num),
		// ...
	}
}
```
</file>

## Prompt Corrections
The original prompt correctly identifies the refund amount (24,000 gas) and the refund cap before London (`gas_used / 2`). However, it's worth noting an important nuance from EIP-3529 that's reflected in the `go-ethereum` code:

1.  **Refund Cap Divisor Change**: EIP-3529, which removed the `SELFDESTRUCT` refund, also changed the general refund cap quotient from `2` to `5` (i.e., `gas_used / 5`). This affects `SSTORE` refunds. While not directly part of `SELFDESTRUCT`, this change happened in the same hardfork (London) and is part of the same refund calculation logic. The `state_processor.go` snippet shows this hardfork-dependent capping.
2.  **Refund Timing**: The prompt correctly states that refunds are applied after transaction execution. The `go-ethereum` snippets from `state_processor.go` confirm that `GetRefund` is called and the final gas cost is calculated after the EVM execution (`evm.Call`) completes.
3.  **StateDB `refund` field**: `go-ethereum` uses a `refund` counter on its `StateDB` object to track all gas refunds accumulated during a transaction (from both `SSTORE` and `SELFDESTRUCT`). This is analogous to the proposed `RefundTracker` struct in the prompt.
4.  **Dynamic Gas Function**: The `SELFDESTRUCT` refund logic in `go-ethereum` is handled within its *dynamic gas calculation function* (`gasSuicide`), not directly in the opcode's `execute` function. The jump table switches to a different gas function (`gasSelfdestructEIP3529`) for the London hardfork, which omits the refund logic. This is a clean way to implement hardfork-dependent gas changes.

</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opSelfdestruct is the operation for the SELFDESTRUCT opcode.
func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	beneficiary := common.Address(stack.pop())

	// EIP-2929: Add beneficiary to access list
	evm.StateDB.AddAddressToAccessList(beneficiary)

	// The contract is marked for self-destruction, which will be executed
	// at the end of the transaction.
	evm.StateDB.SelfDestruct(contract.Address())

	// Add gas to the refund counter.
	// EIP-3529 removes the gas refund for SELFDESTRUCT.
	if !evm.chainRules.IsLondon {
		evm.StateDB.AddRefund(params.SelfdestructRefundGas)
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// AddRefund adds gas to the refund counter.
func (s *StateDB) AddRefund(gas uint64) {
	s.refund += gas
}

// GetRefund returns the gas refund counter.
func (s *StateDB) GetRefund() uint64 {
	return s.refund
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// TransitionDb will execute the state transition with a given state database.
func (st *StateTransition) TransitionDb() (*ExecutionResult, error) {
	// ... (initial setup and validation)

	// Execute the message.
	result, err := st.applyMessage()
	if err != nil {
		return nil, err
	}
	// Update the state with pending changes.
	st.state.Finalise(st.evm.chainRules.IsEIP158(st.evm.Context.BlockNumber))

	st.gasUsed = result.UsedGas

	// Refund the sender with the unspent gas.
	remaining := st.gp.Gas()
	st.gp.SubGas(remaining) // TODO(rjl493456442) this is ugly, refactor it
	st.sender.AddBalance(new(big.Int).Mul(new(big.Int).SetUint64(remaining), st.gasPrice))

	// Also refund the gas, up to a limited amount.
	refund := st.gasUsed / st.refundQuotient()
	if refund > st.state.GetRefund() {
		refund = st.state.GetRefund()
	}
	st.gp.AddGas(refund)
	st.gasUsed -= refund

	// The execution result needs to be updated with the gas used, the remaining
	// gas in the pool, and the accumulated refund.
	result.UsedGas = st.gasUsed
	return result, nil
}

// refundQuotient returns the gas refund quotient, dependent on the current fork.
func (st *StateTransition) refundQuotient() uint64 {
	if st.evm.chainRules.IsLondon {
		return params.RefundQuotientEIP3529
	}
	return params.RefundQuotient
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...

	// SelfdestructRefundGas is the amount of gas to refund for a self-destruct operation.
	SelfdestructRefundGas uint64 = 24000

	// ...
)

// ...

var (
	// ...

	// RefundQuotient is the divisor for calculating refund gas.
	RefundQuotient uint64 = 2

	// RefundQuotientEIP3529 is the divisor for calculating refund gas before EIP-3529.
	RefundQuotientEIP3529 uint64 = 5

	// ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasSelfdestructEIP2929 calculates the gas cost for the SELFDESTRUCT opcode on
// Berlin and later forks.
func gasSelfdestructEIP2929(evm *EVM, contract *Contract, stack *Stack, memory *Memory, gas uint64) (uint64, error) {
	var (
		cost        = params.SelfdestructGasEIP150
		address     = common.Address(stack.peek(0).Bytes20())
		isAddressWarm = evm.StateDB.AddressInAccessList(address)
	)
	if !isAddressWarm {
		cost += params.ColdAccountAccessCostEIP2929
	}
	// No refund for destructing an empty account.
	if !evm.StateDB.HasSuicided(contract.Address()) && !evm.StateDB.Empty(contract.Address()) {
		// This is the first time it is self-destructed.
		if !evm.StateDB.Exist(address) {
			cost += params.CreateDataGas
		}
	}
	return gas + cost, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt requires that `SELFDESTRUCT` refunds are only provided if the contract actually exists. This check is present in the prompt's Zig implementation for `add_selfdestruct_refund`.

However, the `go-ethereum` implementation of `opSelfdestruct` in `core/vm/instructions.go` adds the 24,000 gas refund unconditionally for pre-London forks. The existence check (`!evm.StateDB.Empty(contract.Address())`) is part of the *gas cost* calculation (in `core/vm/gas_table.go`), not the refund logic.

**Correction:**
When implementing `SELFDESTRUCT` refunds to match `go-ethereum`'s behavior, the refund should be added to the refund counter unconditionally if the current hardfork is pre-London. The contract existence check applies to the gas *cost*, not the refund. The refund is simply removed entirely by the London hardfork (EIP-3529).

This means the `contract_exists` check in the Zig `add_selfdestruct_refund` function should be removed to align with go-ethereum's implementation.

Additionally, the refund quotient for capping changes from `2` to `5` in the London hardfork, which is a critical detail for post-London gas calculations even if `SELFDESTRUCT` refunds are zero.


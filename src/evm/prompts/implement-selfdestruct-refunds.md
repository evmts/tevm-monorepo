# Implement SELFDESTRUCT Refunds

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_selfdestruct_refunds` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_selfdestruct_refunds feat_implement_selfdestruct_refunds`
3. **Work in isolation**: `cd g/feat_implement_selfdestruct_refunds`
4. **Commit message**: `✨ feat: implement SELFDESTRUCT refunds for pre-London hardfork`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement gas refunds for SELFDESTRUCT opcode according to Ethereum specifications. Before the London hardfork (EIP-3529), SELFDESTRUCT provided gas refunds when destroying contracts. This refund mechanism was removed in London to mitigate gas limit manipulation attacks.

## Ethereum Specification

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Follow hardfork specifications exactly** - Refund rules must be precise
3. **Implement refund cap correctly** - Maximum refund is gas_used / 2
4. **Handle contract existence properly** - Only refund for actual destruction
5. **Test hardfork transitions** - Verify behavior changes at London
6. **Integrate with existing systems** - Work with current SELFDESTRUCT implementation

## References

- [EIP-3529: Reduction in refunds](https://eips.ethereum.org/EIPS/eip-3529)
- [EIP-2681: Limit account nonce to 2^64-1](https://eips.ethereum.org/EIPS/eip-2681)
- [Ethereum Yellow Paper - Gas Refunds](https://ethereum.github.io/yellowpaper/paper.pdf)
- [London Hardfork Specification](https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/london.md)
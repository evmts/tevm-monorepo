# Implement Call Gas Stipend

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_call_gas_stipend` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_call_gas_stipend feat_implement_call_gas_stipend`
3. **Work in isolation**: `cd g/feat_implement_call_gas_stipend`
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

Implement proper gas stipend handling for value transfers in CALL operations. When a CALL transfers value (ETH), the called contract receives a gas stipend of 2300 gas to perform basic operations like logging. This mechanism ensures that simple receiver contracts can execute even when the caller provides insufficient gas.

## ELI5

When you send money (ETH) to a smart contract, it's like paying someone to do a job. The gas stipend is like giving them a small emergency phone allowance (2300 gas) so they can at least call to say "thanks, I got the money!" even if you didn't give them enough budget for the main work. This ensures simple wallet contracts can always acknowledge receiving payments without failing.

## Ethereum Specification

### Gas Stipend Rules

#### Value Transfer Stipend
- **Amount**: 2300 gas
- **Trigger**: When CALL transfers value > 0
- **Recipient**: Called contract receives stipend regardless of gas parameter
- **Limitation**: Stipend is only for basic operations (logging, state reading)
- **No Recursion**: Stipend gas cannot be used for further CALLs with value

#### Applicable Operations
- **CALL**: Gets stipend when transferring value
- **CALLCODE**: Gets stipend when transferring value (deprecated)
- **DELEGATECALL**: No stipend (no value transfer)
- **STATICCALL**: No stipend (no value transfer)

### Gas Forwarding with Stipend
```zig
pub fn calculate_call_gas(
    available_gas: u64,
    gas_parameter: u64,
    transfers_value: bool,
    is_cold_account: bool
) CallGasCalculation {
    // Base cost for call operation
    var base_cost: u64 = if (is_cold_account) 2600 else 100;
    
    // Additional cost for value transfer
    if (transfers_value) {
        base_cost += 9000; // Value transfer cost
    }
    
    // Calculate gas to forward using 63/64 rule
    const gas_available_for_call = if (available_gas > base_cost) 
        available_gas - base_cost 
    else 
        0;
    
    const gas_to_forward = if (gas_parameter == 0) {
        // All available gas (minus 1/64 kept by caller)
        gas_available_for_call - (gas_available_for_call / 64)
    } else {
        // Requested gas (capped by available)
        @min(gas_parameter, gas_available_for_call - (gas_available_for_call / 64))
    };
    
    // Add stipend for value transfers
    const final_gas = if (transfers_value) 
        gas_to_forward + GAS_STIPEND_VALUE_TRANSFER
    else 
        gas_to_forward;
    
    return CallGasCalculation{
        .base_cost = base_cost,
        .gas_forwarded = final_gas,
        .gas_stipend = if (transfers_value) GAS_STIPEND_VALUE_TRANSFER else 0,
    };
}
```

## Implementation Requirements

### Core Functionality
1. **Stipend Detection**: Automatically provide stipend for value transfers
2. **Gas Calculation**: Correctly compute gas forwarding with stipend
3. **Stipend Tracking**: Track stipend usage separately from regular gas
4. **Execution Limits**: Ensure stipend cannot enable recursive value calls
5. **Compatibility**: Work with existing call operation implementations

### Gas Stipend System
```zig
pub const GAS_STIPEND_VALUE_TRANSFER: u64 = 2300;

pub const CallGasCalculation = struct {
    base_cost: u64,        // Gas cost for the call operation itself
    gas_forwarded: u64,    // Total gas sent to called contract
    gas_stipend: u64,      // Stipend amount (if any)
    
    pub fn total_cost(self: *const CallGasCalculation) u64 {
        return self.base_cost;
    }
    
    pub fn recipient_gas(self: *const CallGasCalculation) u64 {
        return self.gas_forwarded;
    }
};

pub const StipendTracker = struct {
    in_stipend_context: bool,
    stipend_gas_remaining: u64,
    
    pub fn init() StipendTracker {
        return StipendTracker{
            .in_stipend_context = false,
            .stipend_gas_remaining = 0,
        };
    }
    
    pub fn start_stipend_context(self: *StipendTracker) void {
        self.in_stipend_context = true;
        self.stipend_gas_remaining = GAS_STIPEND_VALUE_TRANSFER;
    }
    
    pub fn is_in_stipend(self: *const StipendTracker) bool {
        return self.in_stipend_context and self.stipend_gas_remaining > 0;
    }
    
    pub fn consume_stipend_gas(self: *StipendTracker, amount: u64) bool {
        if (!self.in_stipend_context) return false;
        if (amount > self.stipend_gas_remaining) return false;
        
        self.stipend_gas_remaining -= amount;
        return true;
    }
};
```

## Implementation Tasks

### Task 1: Add Gas Stipend Constants
File: `/src/evm/constants/gas_constants.zig` (modify existing)
```zig
// Call gas stipend constants
pub const GAS_STIPEND_VALUE_TRANSFER: u64 = 2300;

// Call operation costs
pub const CALL_BASE_COST: u64 = 100;
pub const CALL_COLD_ACCOUNT_COST: u64 = 2600;
pub const CALL_VALUE_TRANSFER_COST: u64 = 9000;
pub const CALL_NEW_ACCOUNT_COST: u64 = 25000;

// Gas retention for 63/64 rule
pub const CALL_GAS_RETENTION_DIVISOR: u64 = 64;
```

### Task 2: Implement Call Gas Calculator
File: `/src/evm/gas/call_gas_calculator.zig`
```zig
const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");

pub const CallGasCalculation = struct {
    base_cost: u64,
    gas_forwarded: u64,
    gas_stipend: u64,
    
    pub fn total_caller_cost(self: *const CallGasCalculation) u64 {
        return self.base_cost;
    }
    
    pub fn total_recipient_gas(self: *const CallGasCalculation) u64 {
        return self.gas_forwarded;
    }
    
    pub fn has_stipend(self: *const CallGasCalculation) bool {
        return self.gas_stipend > 0;
    }
};

pub fn calculate_call_gas(
    available_gas: u64,
    gas_parameter: u64,
    transfers_value: bool,
    is_cold_account: bool,
    creates_new_account: bool
) CallGasCalculation {
    // Calculate base cost
    var base_cost: u64 = if (is_cold_account) 
        gas_constants.CALL_COLD_ACCOUNT_COST 
    else 
        gas_constants.CALL_BASE_COST;
    
    // Add value transfer cost
    if (transfers_value) {
        base_cost += gas_constants.CALL_VALUE_TRANSFER_COST;
        
        // Add new account creation cost
        if (creates_new_account) {
            base_cost += gas_constants.CALL_NEW_ACCOUNT_COST;
        }
    }
    
    // Check if we have enough gas for the call
    if (available_gas < base_cost) {
        return CallGasCalculation{
            .base_cost = base_cost,
            .gas_forwarded = 0,
            .gas_stipend = 0,
        };
    }
    
    // Calculate gas available for forwarding
    const gas_available_for_call = available_gas - base_cost;
    
    // Apply 63/64 rule: caller retains 1/64 of available gas
    const gas_retained = gas_available_for_call / gas_constants.CALL_GAS_RETENTION_DIVISOR;
    const max_forwardable = gas_available_for_call - gas_retained;
    
    // Determine gas to forward
    var gas_to_forward: u64 = if (gas_parameter == 0) {
        // Forward all available gas (minus retention)
        max_forwardable
    } else {
        // Forward requested amount (capped by available)
        @min(gas_parameter, max_forwardable)
    };
    
    // Add stipend for value transfers
    const stipend_amount = if (transfers_value) gas_constants.GAS_STIPEND_VALUE_TRANSFER else 0;
    gas_to_forward += stipend_amount;
    
    return CallGasCalculation{
        .base_cost = base_cost,
        .gas_forwarded = gas_to_forward,
        .gas_stipend = stipend_amount,
    };
}

pub const StipendTracker = struct {
    in_stipend_context: bool,
    stipend_gas_remaining: u64,
    regular_gas_remaining: u64,
    
    pub fn init(initial_gas: u64, has_stipend: bool) StipendTracker {
        return StipendTracker{
            .in_stipend_context = has_stipend,
            .stipend_gas_remaining = if (has_stipend) gas_constants.GAS_STIPEND_VALUE_TRANSFER else 0,
            .regular_gas_remaining = initial_gas - (if (has_stipend) gas_constants.GAS_STIPEND_VALUE_TRANSFER else 0),
        };
    }
    
    pub fn consume_gas(self: *StipendTracker, amount: u64) bool {
        // Try to consume from regular gas first
        if (amount <= self.regular_gas_remaining) {
            self.regular_gas_remaining -= amount;
            return true;
        }
        
        // If in stipend context, try to consume from stipend
        if (self.in_stipend_context) {
            const remaining_needed = amount - self.regular_gas_remaining;
            if (remaining_needed <= self.stipend_gas_remaining) {
                self.stipend_gas_remaining -= remaining_needed;
                self.regular_gas_remaining = 0;
                return true;
            }
        }
        
        return false; // Insufficient gas
    }
    
    pub fn total_remaining(self: *const StipendTracker) u64 {
        return self.regular_gas_remaining + self.stipend_gas_remaining;
    }
    
    pub fn can_make_value_call(self: *const StipendTracker, required_gas: u64) bool {
        // Value calls require regular gas (not stipend gas)
        return self.regular_gas_remaining >= required_gas;
    }
    
    pub fn is_using_stipend_only(self: *const StipendTracker) bool {
        return self.in_stipend_context and self.regular_gas_remaining == 0 and self.stipend_gas_remaining > 0;
    }
};
```

### Task 3: Update Frame with Stipend Tracking
File: `/src/evm/frame.zig` (modify existing)
```zig
const StipendTracker = @import("gas/call_gas_calculator.zig").StipendTracker;

pub const Frame = struct {
    // Existing fields...
    stipend_tracker: StipendTracker,
    
    pub fn init(
        allocator: std.mem.Allocator,
        context: CallContext,
        initial_gas: u64,
        has_stipend: bool
    ) !Frame {
        return Frame{
            // Existing initialization...
            .stipend_tracker = StipendTracker.init(initial_gas, has_stipend),
        };
    }
    
    pub fn consume_gas(self: *Frame, amount: u64) bool {
        return self.stipend_tracker.consume_gas(amount);
    }
    
    pub fn gas_remaining(self: *const Frame) u64 {
        return self.stipend_tracker.total_remaining();
    }
    
    pub fn can_make_value_call(self: *const Frame, required_gas: u64) bool {
        return self.stipend_tracker.can_make_value_call(required_gas);
    }
    
    pub fn is_stipend_only_context(self: *const Frame) bool {
        return self.stipend_tracker.is_using_stipend_only();
    }
};
```

### Task 4: Update Call Operations
File: `/src/evm/execution/system.zig` (modify existing)
```zig
const call_gas_calculator = @import("../gas/call_gas_calculator.zig");

pub fn execute_call(vm: *Vm, frame: *Frame) !ExecutionResult {
    // Parse call parameters
    const gas_limit = frame.stack.pop_unsafe();
    const target_address = frame.stack.pop_unsafe();
    const value = frame.stack.pop_unsafe();
    const input_offset = frame.stack.pop_unsafe();
    const input_size = frame.stack.pop_unsafe();
    const output_offset = frame.stack.pop_unsafe();
    const output_size = frame.stack.pop_unsafe();
    
    // Check if this is a value transfer
    const transfers_value = value > 0;
    
    // Check account access (warm/cold)
    const is_cold_account = !vm.access_list.is_address_warm(target_address);
    if (is_cold_account) {
        vm.access_list.mark_address_warm(target_address);
    }
    
    // Check if call creates new account
    const target_account = vm.state.get_account(target_address);
    const creates_new_account = (target_account == null or target_account.is_empty()) and transfers_value;
    
    // Calculate call gas costs
    const gas_calc = call_gas_calculator.calculate_call_gas(
        frame.gas_remaining(),
        gas_limit,
        transfers_value,
        is_cold_account,
        creates_new_account
    );
    
    // Check if caller has enough gas
    if (!frame.consume_gas(gas_calc.base_cost)) {
        return ExecutionError.OutOfGas;
    }
    
    // Validate value transfer in stipend-only context
    if (transfers_value and frame.is_stipend_only_context()) {
        // Cannot make value calls with only stipend gas
        frame.stack.push_unsafe(0); // Call failed
        return ExecutionResult.continue_execution;
    }
    
    // Prepare call input data
    const input_data = try frame.memory.get_slice(input_offset, input_size);
    
    // Perform value transfer if needed
    if (transfers_value) {
        const sender_balance = vm.state.get_balance(frame.context.address);
        if (sender_balance < value) {
            // Insufficient balance
            frame.stack.push_unsafe(0); // Call failed
            return ExecutionResult.continue_execution;
        }
        
        // Transfer value
        vm.state.sub_balance(frame.context.address, value);
        vm.state.add_balance(target_address, value);
    }
    
    // Create new frame for called contract
    const call_context = CallContext{
        .address = target_address,
        .caller = frame.context.address,
        .value = value,
        .call_data = input_data,
        .gas_limit = gas_calc.gas_forwarded,
    };
    
    var child_frame = try Frame.init(
        vm.allocator,
        call_context,
        gas_calc.gas_forwarded,
        gas_calc.has_stipend()
    );
    defer child_frame.deinit();
    
    // Execute called contract
    const call_result = vm.execute_frame(&child_frame);
    
    // Handle call result
    const success = switch (call_result) {
        .success => |result| {
            // Copy return data to caller's memory
            if (result.output.len > 0) {
                try frame.memory.store_slice(output_offset, result.output[0..@min(output_size, result.output.len)]);
            }
            true
        },
        .revert => |result| {
            // Revert value transfer
            if (transfers_value) {
                vm.state.add_balance(frame.context.address, value);
                vm.state.sub_balance(target_address, value);
            }
            
            // Copy revert data to caller's memory
            if (result.output.len > 0) {
                try frame.memory.store_slice(output_offset, result.output[0..@min(output_size, result.output.len)]);
            }
            false
        },
        .out_of_gas => {
            // Revert value transfer
            if (transfers_value) {
                vm.state.add_balance(frame.context.address, value);
                vm.state.sub_balance(target_address, value);
            }
            false
        },
    };
    
    // Return unused gas (excluding stipend)
    const unused_gas = child_frame.stipend_tracker.regular_gas_remaining;
    frame.stipend_tracker.regular_gas_remaining += unused_gas;
    
    // Push success/failure to stack
    frame.stack.push_unsafe(if (success) 1 else 0);
    
    return ExecutionResult.continue_execution;
}
```

### Task 5: Update Gas Metering in Opcodes
File: `/src/evm/execution/` (modify gas consumption in opcodes)
```zig
// Update opcodes to use frame's gas consumption method
pub fn execute_add(vm: *Vm, frame: *Frame) !ExecutionResult {
    // Consume gas through frame's stipend-aware system
    if (!frame.consume_gas(gas_constants.ADD_COST)) {
        return ExecutionError.OutOfGas;
    }
    
    const a = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    frame.stack.push_unsafe(a +% b);
    
    return ExecutionResult.continue_execution;
}

// Similar updates for all other opcodes...
```

## Testing Requirements

### Test File
Create `/test/evm/gas/call_gas_stipend_test.zig`

### Test Cases
```zig
const std = @import("std");
const testing = std.testing;
const call_gas_calculator = @import("../../../src/evm/gas/call_gas_calculator.zig");
const StipendTracker = call_gas_calculator.StipendTracker;

test "call gas calculation with value transfer" {
    // Test gas calculation for value-transferring call
    const gas_calc = call_gas_calculator.calculate_call_gas(
        10000,  // available gas
        0,      // gas parameter (all available)
        true,   // transfers value
        false,  // warm account
        false   // doesn't create account
    );
    
    // Should include base cost + value transfer cost
    const expected_base = 100 + 9000; // CALL_BASE + VALUE_TRANSFER
    try testing.expectEqual(expected_base, gas_calc.base_cost);
    
    // Should include stipend
    try testing.expectEqual(@as(u64, 2300), gas_calc.gas_stipend);
    
    // Should forward available gas minus retention plus stipend
    const available_for_call = 10000 - expected_base;
    const retained = available_for_call / 64;
    const expected_forward = (available_for_call - retained) + 2300;
    try testing.expectEqual(expected_forward, gas_calc.gas_forwarded);
}

test "call gas calculation without value transfer" {
    // Test gas calculation for non-value call
    const gas_calc = call_gas_calculator.calculate_call_gas(
        10000,  // available gas
        5000,   // gas parameter
        false,  // no value transfer
        false,  // warm account
        false   // doesn't create account
    );
    
    // Should not include value transfer cost
    try testing.expectEqual(@as(u64, 100), gas_calc.base_cost);
    
    // Should not include stipend
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_stipend);
    
    // Should forward requested gas (capped by 63/64 rule)
    const available_for_call = 10000 - 100;
    const retained = available_for_call / 64;
    const max_forwardable = available_for_call - retained;
    const expected_forward = @min(5000, max_forwardable);
    try testing.expectEqual(expected_forward, gas_calc.gas_forwarded);
}

test "stipend tracker gas consumption" {
    var tracker = StipendTracker.init(5000, true); // 5000 gas + 2300 stipend
    
    // Should have regular gas and stipend
    try testing.expectEqual(@as(u64, 7300), tracker.total_remaining());
    
    // Consume from regular gas first
    try testing.expect(tracker.consume_gas(3000));
    try testing.expectEqual(@as(u64, 4300), tracker.total_remaining());
    
    // Consume remaining regular gas + some stipend
    try testing.expect(tracker.consume_gas(2500)); // 2000 regular + 500 stipend
    try testing.expectEqual(@as(u64, 1800), tracker.total_remaining()); // 1800 stipend left
    
    // Should not be able to make value calls with only stipend
    try testing.expect(!tracker.can_make_value_call(1000));
    
    // Should be in stipend-only context
    try testing.expect(tracker.is_using_stipend_only());
}

test "cold account gas calculation" {
    // Test cold account access cost
    const gas_calc = call_gas_calculator.calculate_call_gas(
        30000,  // available gas
        0,      // gas parameter
        true,   // transfers value
        true,   // cold account
        true    // creates new account
    );
    
    // Should include cold access + value transfer + new account costs
    const expected_base = 2600 + 9000 + 25000; // COLD + VALUE + NEW_ACCOUNT
    try testing.expectEqual(expected_base, gas_calc.base_cost);
    
    // Should still include stipend
    try testing.expectEqual(@as(u64, 2300), gas_calc.gas_stipend);
}

test "insufficient gas for call" {
    // Test when available gas is less than base cost
    const gas_calc = call_gas_calculator.calculate_call_gas(
        1000,   // available gas (insufficient)
        0,      // gas parameter
        true,   // transfers value
        false,  // warm account
        false   // doesn't create account
    );
    
    // Should set base cost but no gas forwarded
    try testing.expectEqual(@as(u64, 9100), gas_calc.base_cost); // 100 + 9000
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_forwarded);
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_stipend);
}
```

### Integration Tests
```zig
test "call with stipend integration" {
    // Test complete CALL execution with stipend
    // Verify called contract receives stipend
    // Verify stipend limitations
}

test "value transfer stipend behavior" {
    // Test that only value transfers get stipend
    // Test DELEGATECALL doesn't get stipend
    // Test STATICCALL doesn't get stipend
}

test "stipend prevents recursive value calls" {
    // Test that stipend gas cannot be used for further value calls
    // Verify proper error handling
}

test "gas refund with stipend" {
    // Test unused gas refund (excluding stipend)
    // Verify stipend doesn't affect refund calculations
}
```

## Performance Considerations

### Gas Calculation Optimization
```zig
// Pre-compute common gas costs
const CALL_BASE_COSTS = [4]u64{
    100,    // Warm account, no value
    2600,   // Cold account, no value
    9100,   // Warm account, with value
    11600,  // Cold account, with value
};

fn get_base_cost_fast(transfers_value: bool, is_cold: bool) u64 {
    const index = (@as(u8, if (is_cold) 2 else 0)) | (@as(u8, if (transfers_value) 1 else 0));
    return CALL_BASE_COSTS[index];
}
```

### Stipend Tracking Efficiency
```zig
// Pack stipend tracker for better memory usage
pub const CompactStipendTracker = packed struct {
    regular_gas: u32,      // Sufficient for most cases
    stipend_gas: u16,      // 2300 max
    has_stipend: bool,
    _padding: u7 = 0,
};
```

## Security Considerations

### Stipend Limitations
```zig
// Ensure stipend cannot enable attacks
fn validate_stipend_operation(op: Opcode, tracker: *const StipendTracker) bool {
    if (tracker.is_using_stipend_only()) {
        return switch (op) {
            .CALL, .CALLCODE => false,     // No value calls with stipend
            .CREATE, .CREATE2 => false,   // No contract creation with stipend
            .SSTORE => false,             // No state changes with stipend
            else => true,                 // Allow other operations
        };
    }
    return true;
}
```

### Value Transfer Validation
```zig
// Validate value transfers properly
fn validate_value_transfer(
    sender: Address,
    receiver: Address,
    value: u256,
    state: *State
) bool {
    if (value == 0) return true;
    
    const sender_balance = state.get_balance(sender);
    return sender_balance >= value;
}
```

## Success Criteria

1. **Stipend Accuracy**: Correct 2300 gas stipend for value transfers
2. **Gas Calculation**: Accurate call gas computation with 63/64 rule
3. **Stipend Limitations**: Proper restrictions on stipend usage
4. **Integration**: Seamless integration with existing call operations
5. **Compatibility**: Works across all hardforks and call types
6. **Performance**: Minimal overhead for stipend tracking

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Follow EVM specification exactly** - Stipend rules must be precise
3. **Test stipend limitations** - Verify stipend cannot enable attacks
4. **Handle gas edge cases** - Correct behavior when gas is insufficient
5. **Maintain call semantics** - Don't break existing call behavior
6. **Test all call types** - CALL, CALLCODE, DELEGATECALL, STATICCALL

## References

- [Ethereum Yellow Paper - Appendix H](https://ethereum.github.io/yellowpaper/paper.pdf) - Call operations
- [EIP-150: Gas cost changes](https://eips.ethereum.org/EIPS/eip-150) - 63/64 rule
- [Go-Ethereum Call Implementation](https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go)
- [Gas Stipend Security Analysis](https://github.com/ethereum/EIPs/issues/1285) - Security considerations
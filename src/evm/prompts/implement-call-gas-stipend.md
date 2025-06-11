# Implement Call Gas Stipend

You are implementing Call Gas Stipend for the Tevm EVM written in Zig. Your goal is to implement gas stipend calculations for value-transferring calls following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_call_gas_stipend` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_call_gas_stipend feat_implement_call_gas_stipend`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement proper gas stipend handling for value transfers in CALL operations. When a CALL transfers value (ETH), the called contract receives a gas stipend of 2300 gas to perform basic operations like logging. This mechanism ensures that simple receiver contracts can execute even when the caller provides insufficient gas.

## ELI5

Think of gas stipends like sending money through the mail with a small prepaid envelope attached. When you send ETH to a smart contract, it's like mailing money to someone. The gas stipend is like including a small prepaid return envelope (2300 gas) so the recipient can at least send you a "thank you" note or receipt.

This prevents a common problem: imagine if someone sent you money but didn't include enough postage for you to even acknowledge receiving it. The gas stipend ensures that even if the sender didn't provide enough gas, the receiving contract can still do basic things like:
- Log that it received the money (like sending a receipt)
- Update simple internal records
- Emit events to notify others

However, this "prepaid envelope" is quite small - you can't use it to send more money to other people or do complex operations. It's just enough for basic bookkeeping, which prevents contracts from getting "stuck" when they receive unexpected payments.

## Specification

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

#### 1. **Unit Tests** (`/test/evm/gas/call_gas_stipend_test.zig`)
```zig
// Test basic call gas stipend functionality
test "call_gas_stipend basic stipend calculation with known scenarios"
test "call_gas_stipend handles value transfer detection correctly"
test "call_gas_stipend validates stipend application rules"
test "call_gas_stipend produces expected stipend amounts"
```

#### 2. **Integration Tests**
```zig
test "call_gas_stipend integrates with EVM call operations"
test "call_gas_stipend works with existing gas forwarding"
test "call_gas_stipend maintains hardfork compatibility"
test "call_gas_stipend handles stipend with 63/64 rule interaction"
```

#### 3. **Performance Tests**
```zig
test "call_gas_stipend meets stipend calculation speed targets"
test "call_gas_stipend overhead measurement vs baseline"
test "call_gas_stipend scalability under high value transfer frequency"
test "call_gas_stipend benchmark stipend application scenarios"
```

#### 4. **Error Handling Tests**
```zig
test "call_gas_stipend proper stipend error handling"
test "call_gas_stipend handles invalid value amounts"
test "call_gas_stipend graceful degradation on stipend calculation errors"
test "call_gas_stipend recovery from stipend system failures"
```

#### 5. **Compliance Tests**
```zig
test "call_gas_stipend EVM specification stipend compliance"
test "call_gas_stipend cross-client stipend behavior consistency"
test "call_gas_stipend hardfork stipend rule adherence"
test "call_gas_stipend deterministic stipend calculations"
```

#### 6. **Security Tests**
```zig
test "call_gas_stipend handles malicious value transfers safely"
test "call_gas_stipend prevents stipend manipulation attacks"
test "call_gas_stipend validates stipend-based security guarantees"
test "call_gas_stipend maintains stipend isolation properties"
```

### Test Development Priority
1. **Core stipend functionality tests** - Ensure basic stipend calculation works
2. **Compliance tests** - Meet EVM specification stipend requirements
3. **Performance tests** - Achieve stipend calculation efficiency targets
4. **Security tests** - Prevent stipend-related vulnerabilities
5. **Error handling tests** - Robust stipend failure management
6. **Edge case tests** - Handle stipend boundary conditions

### Test Data Sources
- **EVM specification**: Official stipend calculation requirements
- **Reference implementations**: Cross-client stipend compatibility data
- **Performance baselines**: Stipend calculation speed measurements
- **Security test vectors**: Stipend manipulation prevention cases
- **Real-world scenarios**: Production value transfer pattern validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public stipend APIs
- Validate stipend calculation accuracy regression prevention
- Test debug and release builds with different stipend scenarios
- Verify cross-platform stipend calculation consistency

### Test-First Examples

**Before writing any implementation:**
```zig
test "call_gas_stipend basic stipend for value transfer" {
    // This test MUST fail initially
    const call_value: u256 = 1000; // Non-zero value
    const base_gas: u64 = 5000;
    
    const result = call_gas_stipend.calculateStipend(call_value, base_gas);
    const expected_stipend: u64 = 2300; // Standard stipend amount
    try testing.expectEqual(base_gas + expected_stipend, result.total_gas);
}
```

**Only then implement:**
```zig
pub const call_gas_stipend = struct {
    pub fn calculateStipend(value: u256, base_gas: u64) !StipendResult {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all stipend rule combinations** - Especially for different call types
- **Verify EVM specification compliance** - Critical for protocol stipend correctness
- **Test stipend performance implications** - Especially for high-frequency value transfers
- **Validate stipend security properties** - Prevent stipend manipulation and bypass attacks

## References

- [Ethereum Yellow Paper - Appendix H](https://ethereum.github.io/yellowpaper/paper.pdf) - Call operations
- [EIP-150: Gas cost changes](https://eips.ethereum.org/EIPS/eip-150) - 63/64 rule
- [Go-Ethereum Call Implementation](https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go)
- [Gas Stipend Security Analysis](https://github.com/ethereum/EIPs/issues/1285) - Security considerations

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
constexpr int64_t MIN_RETAINED_GAS = 5000;
constexpr int64_t MIN_CALLEE_GAS = 2300;
constexpr int64_t CALL_VALUE_COST = 9000;
constexpr int64_t ACCOUNT_CREATION_COST = 25000;

template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    static_assert(
        Op == OP_CALL || Op == OP_CALLCODE || Op == OP_DELEGATECALL || Op == OP_STATICCALL);

    const auto gas = stack.pop();
    const auto dst = intx::be::trunc<evmc::address>(stack.pop());
    const auto value = (Op == OP_STATICCALL || Op == OP_DELEGATECALL) ? 0 : stack.pop();
    const auto has_value = value != 0;
    const auto input_offset_u256 = stack.pop();
    const auto input_size_u256 = stack.pop();
    const auto output_offset_u256 = stack.pop();
    const auto output_size_u256 = stack.pop();

    stack.push(0);  // Assume failure.
    state.return_data.clear();

    if (state.rev >= EVMC_BERLIN && state.host.access_account(dst) == EVMC_ACCESS_COLD)
    {
        if ((gas_left -= instr::additional_cold_account_access_cost) < 0)
            return {EVMC_OUT_OF_GAS, gas_left};
    }

    const auto target_addr_or_result = get_target_address(dst, gas_left, state);
    if (const auto* result = std::get_if<Result>(&target_addr_or_result))
        return *result;

    const auto& code_addr = std::get<evmc::address>(target_addr_or_result);

    if (!check_memory(gas_left, state.memory, input_offset_u256, input_size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};

    if (!check_memory(gas_left, state.memory, output_offset_u256, output_size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};

    const auto input_offset = static_cast<size_t>(input_offset_u256);
    const auto input_size = static_cast<size_t>(input_size_u256);
    const auto output_offset = static_cast<size_t>(output_offset_u256);
    const auto output_size = static_cast<size_t>(output_size_u256);

    evmc_message msg{.kind = to_call_kind(Op)};
    msg.flags = (Op == OP_STATICCALL) ? uint32_t{EVMC_STATIC} : state.msg->flags;
    if (dst != code_addr)
        msg.flags |= EVMC_DELEGATED;
    else
        msg.flags &= ~std::underlying_type_t<evmc_flags>{EVMC_DELEGATED};
    msg.depth = state.msg->depth + 1;
    msg.recipient = (Op == OP_CALL || Op == OP_STATICCALL) ? dst : state.msg->recipient;
    msg.code_address = code_addr;
    msg.sender = (Op == OP_DELEGATECALL) ? state.msg->sender : state.msg->recipient;
    msg.value =
        (Op == OP_DELEGATECALL) ? state.msg->value : intx::be::store<evmc::uint256be>(value);

    if (input_size > 0)
    {
        // input_offset may be garbage if input_size == 0.
        msg.input_data = &state.memory[input_offset];
        msg.input_size = input_size;
    }

    auto cost = has_value ? CALL_VALUE_COST : 0;

    if constexpr (Op == OP_CALL)
    {
        if (has_value && state.in_static_mode())
            return {EVMC_STATIC_MODE_VIOLATION, gas_left};

        if ((has_value || state.rev < EVMC_SPURIOUS_DRAGON) && !state.host.account_exists(dst))
            cost += ACCOUNT_CREATION_COST;
    }

    if ((gas_left -= cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};

    msg.gas = std::numeric_limits<int64_t>::max();
    if (gas < msg.gas)
        msg.gas = static_cast<int64_t>(gas);

    if (state.rev >= EVMC_TANGERINE_WHISTLE)  // TODO: Always true for STATICCALL.
        msg.gas = std::min(msg.gas, gas_left - gas_left / 64);
    else if (msg.gas > gas_left)
        return {EVMC_OUT_OF_GAS, gas_left};

    if (has_value)
    {
        msg.gas += 2300;  // Add stipend.
        gas_left += 2300;
    }

    if (state.msg->depth >= 1024)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    if (has_value && intx::be::load<uint256>(state.host.get_balance(state.msg->recipient)) < value)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    if (const auto copy_size = std::min(output_size, result.output_size); copy_size > 0)
        std::memcpy(&state.memory[output_offset], result.output_data, copy_size);

    const auto gas_used = msg.gas - result.gas_left;
    gas_left -= gas_used;
    state.gas_refund += result.gas_refund;
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
/// The special gas cost value marking an EVM instruction as "undefined".
constexpr int16_t undefined = -1;

/// EIP-2929 constants (https://eips.ethereum.org/EIPS/eip-2929).
/// @{
inline constexpr auto cold_sload_cost = 2100;
inline constexpr auto cold_account_access_cost = 2600;
inline constexpr auto warm_storage_read_cost = 100;

/// Additional cold account access cost.
///
/// The warm access cost is unconditionally applied for every account access instruction.
/// If the access turns out to be cold, this cost must be applied additionally.
inline constexpr auto additional_cold_account_access_cost =
    cold_account_access_cost - warm_storage_read_cost;
/// @}


/// The table of instruction gas costs per EVM revision.
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

/// The EVM revision specific table of EVM instructions gas costs. For instructions undefined
/// in given EVM revision, the value is instr::undefined.
constexpr inline GasCostTable gas_costs = []() noexcept {
    GasCostTable table{};

    // ... (omitted other revisions for brevity)

    table[EVMC_BERLIN] = table[EVMC_ISTANBUL];
    table[EVMC_BERLIN][OP_EXTCODESIZE] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_EXTCODECOPY] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_EXTCODEHASH] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_BALANCE] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_CALL] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_CALLCODE] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_DELEGATECALL] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_STATICCALL] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_SLOAD] = warm_storage_read_cost;

    // ... (omitted other revisions for brevity)

    return table;
}();
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;

    /// Reference to original EVM code container.
    /// For legacy code this is a reference to entire original code.
    /// For EOF-formatted code this is a reference to entire container.
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;
    
    // ...
};

/// The execution state specialized for the Advanced interpreter.
struct AdvancedExecutionState : ExecutionState
{
    int64_t gas_left = 0;

    /// Pointer to the stack top.
    StackTop stack = stack_space.bottom();

    /// The gas cost of the current block.
    ///
    /// This is only needed to correctly calculate the "current gas left" value.
    uint32_t current_block_cost = 0;

    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/unittests/evm_calls_test.cpp">
```cpp
TEST_P(evm, call_with_value_low_gas)
{
    // Create the call destination account.
    host.accounts[0x0000000000000000000000000000000000000000_address] = {};
    for (auto call_op : {OP_CALL, OP_CALLCODE})
    {
        auto code = 4 * push(0) + push(1) + 2 * push(0) + call_op + OP_POP;
        execute(9721, code);
        EXPECT_EQ(result.status_code, EVMC_SUCCESS);
        EXPECT_EQ(result.gas_left, 2300 - 2);
    }
}
```
</file>
</evmone>
## Prompt Corrections
The original prompt proposes a `StipendTracker` struct to explicitly separate regular gas from stipend gas. This is a valid design, but it's worth noting that `evmone` takes a simpler approach.

-   **No Explicit Stipend Tracking**: `evmone` does not track the 2300 gas stipend separately. As seen in `call_impl`, it simply adds 2300 to the total gas forwarded to the callee: `msg.gas += 2300;`.
-   **Implicit Re-entrancy Protection**: The protection against using the stipend for recursive value-transferring calls is handled implicitly by the `63/64` rule (EIP-150). Any sub-call's available gas is calculated as `gas_left - gas_left / 64`. Even if a contract only has the 2300 stipend gas left, this amount is not enough to cover the `CALL_VALUE_TRANSFER_COST` (9000 gas) plus the base call cost of a subsequent value-transferring `CALL`. This design avoids the complexity of a dedicated stipend tracker.
-   **Gas Calculation Context**: In `evmone`, the `63/64` rule is applied to the *caller's* `gas_left` *after* the intrinsic costs of the call (like `CALL_VALUE_COST`) have been deducted, which is the correct interpretation of EIP-150. The prompt's pseudo-code should be reviewed to ensure it aligns with this.



## REVM Context

An analysis of the `revm` codebase reveals a more implicit but effective way of handling the gas stipend compared to the proposed `StipendTracker`. Instead of tracking stipend gas separately, `revm` adds it to the total gas forwarded to the sub-call. The `63/64` rule for subsequent calls from that sub-context naturally prevents the full stipend from being re-used for another value-transferring call.

This approach is simpler and avoids the overhead of a dedicated tracker struct. The provided code snippets focus on this integrated gas calculation logic.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/contract.rs">
```rust
//! Contains instructions for contract calls, creation, and self-destruction.
// ... (imports)

// ...

/// Main call instruction
pub fn call<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([local_gas_limit, to, value], context.interpreter);
    let to = to.into_address();
    // Max gas limit is not possible in real ethereum situation.
    let local_gas_limit = u64::try_from(local_gas_limit).unwrap_or(u64::MAX);

    let has_transfer = !value.is_zero();
    // Static call check
    if context.interpreter.runtime_flag.is_static() && has_transfer {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::CallNotAllowedInsideStatic);
        return;
    }

    // Memory resize and get input/output memory ranges.
    let Some((input, return_memory_offset)) = get_memory_input_and_out_ranges(context.interpreter)
    else {
        return;
    };

    // Load account and calculate gas cost.
    let Some(account_load) = context.host.load_account_delegated(to) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    // calculate gas limit for call.
    let Some(mut gas_limit) = calc_call_gas(
        context.interpreter,
        account_load,
        has_transfer,
        local_gas_limit,
    ) else {
        return;
    };

    // spend the gas from interpreter.
    gas!(context.interpreter, gas_limit);

    // Add call stipend if there is value to be transferred.
    if has_transfer {
        gas_limit = gas_limit.saturating_add(gas::CALL_STIPEND);
    }

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::SharedBuffer(input),
            gas_limit,
            target_address: to,
            caller: context.interpreter.input.target_address(),
            bytecode_address: to,
            value: CallValue::Transfer(value),
            scheme: CallScheme::Call,
            is_static: context.interpreter.runtime_flag.is_static(),
            is_eof: false,
            return_memory_offset,
        }))),
        InstructionResult::CallOrCreate,
    );
}

// ... (other call-like instructions: CALLCODE, DELEGATECALL, STATICCALL)
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/contract/call_helpers.rs">
```rust
// ... (imports)

// ...

/// Calculates the gas limit for a call operation.
///
/// This function determines the amount of gas to be forwarded to the callee based on the
/// available gas, the requested gas limit, and the rules of the current hardfork.
/// It also handles the gas cost for the call operation itself.
#[inline]
pub fn calc_call_gas(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    account_load: StateLoad<AccountLoad>,
    has_transfer: bool,
    local_gas_limit: u64,
) -> Option<u64> {
    // Calculate the initial cost of the call operation, including costs for account access
    // and value transfers, as defined by different hardforks.
    let call_cost = gas::call_cost(
        interpreter.runtime_flag.spec_id(),
        has_transfer,
        account_load,
    );
    // Deduct the initial call cost from the interpreter's gas.
    gas!(interpreter, call_cost, None);

    // EIP-150: Gas cost changes for IO-heavy operations.
    // The amount of gas that can be forwarded is limited to 63/64 of the remaining gas.
    let gas_limit = if interpreter.runtime_flag.spec_id().is_enabled_in(TANGERINE) {
        // Calculate the maximum gas that can be forwarded (all but 1/64th).
        let max_forwardable_gas = interpreter.control.gas().remaining_63_of_64_parts();
        // The actual gas limit is the minimum of the requested limit and the maximum forwardable.
        min(max_forwardable_gas, local_gas_limit)
    } else {
        // Pre-Tangerine, the full requested gas limit could be forwarded.
        local_gas_limit
    };

    Some(gas_limit)
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/calc.rs">
```rust
// ... (imports)

// ...

/// `CALL` opcode cost calculation.
///
/// There are three types of gas costs associated with a `CALL`:
/// * **Account access gas**: Cost for accessing the callee's account, which can be cold or warm after the Berlin hardfork.
/// * **Value transfer gas**: Additional cost if the call transfers value.
/// * **Account creation gas**: Cost for creating a new account if it does not exist. After the Spurious Dragon hardfork,
///   this is only accounted for if value is transferred.
#[inline]
pub const fn call_cost(
    spec_id: SpecId,
    transfers_value: bool,
    account_load: StateLoad<AccountLoad>,
) -> u64 {
    let is_empty = account_load.data.is_empty;
    // Account access cost.
    let mut gas = if spec_id.is_enabled_in(SpecId::BERLIN) {
        warm_cold_cost_with_delegation(account_load)
    } else if spec_id.is_enabled_in(SpecId::TANGERINE) {
        // EIP-150: Gas cost changes for IO-heavy operations
        700
    } else {
        40
    };

    // Transfer value cost
    if transfers_value {
        gas += CALLVALUE;
    }

    // New account cost
    if is_empty {
        // EIP-161: State trie clearing (invariant-preserving alternative)
        if spec_id.is_enabled_in(SpecId::SPURIOUS_DRAGON) {
            // Accounted only if there is value transferred.
            if transfers_value {
                gas += NEWACCOUNT;
            }
        } else {
            gas += NEWACCOUNT;
        }
    }

    gas
}

// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/constants.rs">
```rust
// ... (other constants)
pub const CALLVALUE: u64 = 9000;
pub const NEWACCOUNT: u64 = 25000;

// ...

/// EIP-2929 constants for cold/warm access
pub const COLD_SLOAD_COST: u64 = 2100;
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_STORAGE_READ_COST: u64 = 100;

// ...

/// Gas stipend for CALL operations with value transfer.
/// This ensures the callee has enough gas to execute basic operations like logging.
pub const CALL_STIPEND: u64 = 2300;
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
// ... (imports)
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
    // ...
}

impl Gas {
    // ...

    /// Returns the amount of gas remaining.
    #[inline]
    pub const fn remaining(&self) -> u64 {
        self.remaining
    }

    /// Return remaining gas after subtracting 63/64 parts.
    /// This is a key part of EIP-150, preventing all gas from being forwarded in a call.
    pub const fn remaining_63_of_64_parts(&self) -> u64 {
        self.remaining - self.remaining / 64
    }

    /// Erases a gas cost from the totals.
    /// Used to refund gas to the caller's context after a sub-call returns.
    #[inline]
    pub fn erase_cost(&mut self, returned: u64) {
        self.remaining += returned;
    }
    
    // ...
}
```
</file>
</revm>
## Prompt Corrections
The original prompt proposes a `StipendTracker` struct to explicitly manage the 2300 gas stipend. While a valid approach, `revm` handles this more implicitly and efficiently.

1.  **No Explicit Stipend Tracker**: `revm` does not use a separate `StipendTracker`. Instead, it adds the `CALL_STIPEND` (2300 gas) directly to the gas forwarded to the sub-call. This simplifies the logic within the execution frame.

2.  **Implicit Stipend Limitation**: The rule that "stipend gas cannot be used for further value calls" is handled implicitly by the `63/64` gas forwarding rule (EIP-150).
    *   When a contract enters a sub-call, it has a total gas pool (regular forwarded gas + stipend).
    *   If that contract then makes *another* value-transferring `CALL`, it can only forward `remaining_gas - remaining_gas/64`.
    *   If the contract is down to only its stipend gas (e.g., 2300 gas), the amount it can forward is `2300 - (2300/64) = 2264` gas.
    *   This amount (`2264`) is insufficient to cover the base cost of another value-transferring `CALL` (which requires at least 2300 gas just for the stipend, plus other access costs), thus naturally preventing recursive value calls funded only by the stipend.

This approach avoids the need to add a `StipendTracker` to the `Frame` struct and check its state before every call, leading to a leaner implementation. The provided `revm` code snippets reflect this integrated design.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

EVM gas constants and calculators.
"""
# ... (other constants)

GAS_NEW_ACCOUNT = Uint(25000)
GAS_CALL_VALUE = Uint(9000)
GAS_CALL_STIPEND = Uint(2300)
GAS_SELF_DESTRUCT = Uint(5000)
# ... (other constants)
GAS_COLD_ACCOUNT_ACCESS = Uint(2600)
GAS_WARM_ACCESS = Uint(100)

# ... (other classes and functions)

@dataclass
class MessageCallGas:
    """
    Define the gas cost and gas given to the sub-call for
    executing the call opcodes.

    `cost`: `ethereum.base_types.Uint`
        The gas required to execute the call opcode, excludes
        memory expansion costs.
    `sub_call`: `ethereum.base_types.Uint`
        The portion of gas available to sub-calls that is refundable
        if not consumed.
    """

    cost: Uint
    sub_call: Uint

# ...

def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.

    Parameters
    ----------
    value:
        The amount of `ETH` that needs to be transferred.
    gas :
        The amount of gas provided to the message-call.
    gas_left :
        The amount of gas left in the current frame.
    memory_cost :
        The amount needed to extend the memory in the current frame.
    extra_gas :
        The amount of gas needed for transferring value + creating a new
        account inside a message call.
    call_stipend :
        The amount of stipend provided to a message call to execute code while
        transferring value(ETH).

    Returns
    -------
    message_call_gas: `MessageCallGas`
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)


def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call

    Parameters
    ----------
    gas :
        The amount of gas provided to the message-call.

    Returns
    -------
    max_allowed_message_call_gas: `ethereum.base_types.Uint`
        The maximum gas allowed for making the message-call.
    """
    return gas - (gas // Uint(64))
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
"""
Ethereum Virtual Machine (EVM) System Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM system related instructions.
"""
# ... (imports)

def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    memory_input_start_position: U256,
    memory_input_size: U256,
    memory_output_start_position: U256,
    memory_output_size: U256,
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    evm.return_data = b""

    if evm.message.depth + Uint(1) > STACK_DEPTH_LIMIT:
        evm.gas_left += gas
        push(evm.stack, U256(0))
        return

    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )
    code = get_account(evm.message.block_env.state, code_address).code
    child_message = Message(
        block_env=evm.message.block_env,
        tx_env=evm.message.tx_env,
        caller=caller,
        target=to,
        gas=gas,
        value=value,
        data=call_data,
        code=code,
        current_target=to,
        depth=evm.message.depth + Uint(1),
        code_address=code_address,
        should_transfer_value=should_transfer_value,
        is_static=True if is_staticcall else evm.message.is_static,
        accessed_addresses=evm.accessed_addresses.copy(),
        accessed_storage_keys=evm.accessed_storage_keys.copy(),
        parent_evm=evm,
    )
    child_evm = process_message(child_message)

    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(1))

    actual_output_size = min(memory_output_size, U256(len(child_evm.output)))
    memory_write(
        evm.memory,
        memory_output_start_position,
        child_evm.output[:actual_output_size],
    )


def call(evm: Evm) -> None:
    """
    Message-call into an account.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    gas = Uint(pop(evm.stack))
    to = to_address(pop(evm.stack))
    value = pop(evm.stack)
    memory_input_start_position = pop(evm.stack)
    memory_input_size = pop(evm.stack)
    memory_output_start_position = pop(evm.stack)
    memory_output_size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory,
        [
            (memory_input_start_position, memory_input_size),
            (memory_output_start_position, memory_output_size),
        ],
    )

    if to in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(to)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    code_address = to

    create_gas_cost = (
        Uint(0)
        if is_account_alive(evm.message.block_env.state, to) or value == 0
        else GAS_NEW_ACCOUNT
    )
    transfer_gas_cost = Uint(0) if value == 0 else GAS_CALL_VALUE
    message_call_gas = calculate_message_call_gas(
        value,
        gas,
        Uint(evm.gas_left),
        extend_memory.cost,
        access_gas_cost + create_gas_cost + transfer_gas_cost,
    )
    charge_gas(evm, message_call_gas.cost + extend_memory.cost)
    if evm.message.is_static and value != U256(0):
        raise WriteInStaticContext
    evm.memory += b"\x00" * extend_memory.expand_by
    sender_balance = get_account(
        evm.message.block_env.state, evm.message.current_target
    ).balance
    if sender_balance < value:
        push(evm.stack, U256(0))
        evm.return_data = b""
        evm.gas_left += message_call_gas.sub_call
    else:
        generic_call(
            evm,
            message_call_gas.sub_call,
            value,
            evm.message.current_target,
            to,
            code_address,
            True,
            False,
            memory_input_start_position,
            memory_input_size,
            memory_output_start_position,
            memory_output_size,
        )

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/storage.py">
```python
def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    if evm.gas_left <= GAS_CALL_STIPEND:
        raise OutOfGasError
    # ... more logic ...
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt's implementation plan is solid, but here are some details from the execution-specs that provide a more complete picture of the stipend mechanism:

1.  **Stipend Limitation is Implicit**: The prompt's `StipendTracker` explicitly separates regular gas from stipend gas to prevent stipend gas from funding another value-call. The `execution-specs` achieve this implicitly. The key mechanism is the `SSTORE` opcode itself.

2.  **SSTORE Gas Check**: A critical detail for preventing stipend-funded re-entrancy attacks is found in the `SSTORE` implementation. Before executing, it checks if the remaining gas is less than or equal to the call stipend (2300 gas). If it is, an `OutOfGas` error is thrown. This effectively prevents a contract running only on stipend gas from modifying its own state, which is a common action in re-entrancy attacks.

    The implementation should ensure this check exists for `SSTORE`:
    ```zig
    // Inside SSTORE opcode implementation
    if (frame.gas_remaining() <= gas_constants.GAS_STIPEND_VALUE_TRANSFER) {
        return ExecutionError.OutOfGas;
    }
    ```

3.  **Gas Calculation Nuances**: The `calculate_message_call_gas` function shows the precise order of gas calculation. The forwarded gas is `min(gas_parameter, 63/64 * (gas_left - base_costs))`, and the stipend is added *after* this calculation. The prompt's `calculate_call_gas` correctly reflects this logic.

4.  **No `StipendTracker` in Specs**: The specs do not have an explicit `StipendTracker`. The gas forwarded to a child context is a single `Uint` value which includes the stipend. The security is maintained by the gas check in `SSTORE` rather than tracking stipend separately. The prompt's `StipendTracker` is a valid and potentially clearer way to implement the same security guarantee.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

EVM gas constants and calculators.
"""
from dataclasses import dataclass
from typing import List, Tuple

from ethereum_types.numeric import U256, Uint

from ethereum.trace import GasAndRefund, evm_trace
from ethereum.utils.numeric import ceil32

from . import Evm
from .exceptions import OutOfGasError

# ... other gas constants ...
GAS_NEW_ACCOUNT = Uint(25000)
GAS_CALL_VALUE = Uint(9000)
GAS_CALL_STIPEND = Uint(2300)
# ... other gas constants ...
GAS_COLD_ACCOUNT_ACCESS = Uint(2600)
GAS_WARM_ACCESS = Uint(100)


@dataclass
class MessageCallGas:
    """
    Define the gas cost and gas given to the sub-call for
    executing the call opcodes.

    `cost`: `ethereum.base_types.Uint`
        The gas required to execute the call opcode, excludes
        memory expansion costs.
    `sub_call`: `ethereum.base_types.Uint`
        The portion of gas available to sub-calls that is refundable
        if not consumed.
    """

    cost: Uint
    sub_call: Uint


def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.

    Parameters
    ----------
    value:
        The amount of `ETH` that needs to be transferred.
    gas :
        The amount of gas provided to the message-call.
    gas_left :
        The amount of gas left in the current frame.
    memory_cost :
        The amount needed to extend the memory in the current frame.
    extra_gas :
        The amount of gas needed for transferring value + creating a new
        account inside a message call.
    call_stipend :
        The amount of stipend provided to a message call to execute code while
        transferring value(ETH).

    Returns
    -------
    message_call_gas: `MessageCallGas`
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)


def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call

    Parameters
    ----------
    gas :
        The amount of gas provided to the message-call.

    Returns
    -------
    max_allowed_message_call_gas: `ethereum.base_types.Uint`
        The maximum gas allowed for making the message-call.
    """
    return gas - (gas // Uint(64))
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    memory_input_start_position: U256,
    memory_input_size: U256,
    memory_output_start_position: U256,
    memory_output_size: U256,
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    evm.return_data = b""

    if evm.message.depth + Uint(1) > STACK_DEPTH_LIMIT:
        evm.gas_left += gas
        push(evm.stack, U256(0))
        return

    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )
    code = get_account(evm.message.block_env.state, code_address).code
    child_message = Message(
        block_env=evm.message.block_env,
        tx_env=evm.message.tx_env,
        caller=caller,
        target=to,
        gas=gas,
        value=value,
        data=call_data,
        code=code,
        current_target=to,
        depth=evm.message.depth + Uint(1),
        code_address=code_address,
        should_transfer_value=should_transfer_value,
        is_static=True if is_staticcall else evm.message.is_static,
        accessed_addresses=evm.accessed_addresses.copy(),
        accessed_storage_keys=evm.accessed_storage_keys.copy(),
        parent_evm=evm,
    )
    child_evm = process_message(child_message)

    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(1))

    actual_output_size = min(memory_output_size, U256(len(child_evm.output)))
    memory_write(
        evm.memory,
        memory_output_start_position,
        child_evm.output[:actual_output_size],
    )


def call(evm: Evm) -> None:
    """
    Message-call into an account.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    gas = Uint(pop(evm.stack))
    to = to_address(pop(evm.stack))
    value = pop(evm.stack)
    memory_input_start_position = pop(evm.stack)
    memory_input_size = pop(evm.stack)
    memory_output_start_position = pop(evm.stack)
    memory_output_size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory,
        [
            (memory_input_start_position, memory_input_size),
            (memory_output_start_position, memory_output_size),
        ],
    )

    if to in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(to)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    code_address = to

    create_gas_cost = (
        Uint(0)
        if is_account_alive(evm.message.block_env.state, to) or value == 0
        else GAS_NEW_ACCOUNT
    )
    transfer_gas_cost = Uint(0) if value == 0 else GAS_CALL_VALUE
    message_call_gas = calculate_message_call_gas(
        value,
        gas,
        Uint(evm.gas_left),
        extend_memory.cost,
        access_gas_cost + create_gas_cost + transfer_gas_cost,
    )
    charge_gas(evm, message_call_gas.cost + extend_memory.cost)
    if evm.message.is_static and value != U256(0):
        raise WriteInStaticContext
    evm.memory += b"\x00" * extend_memory.expand_by
    sender_balance = get_account(
        evm.message.block_env.state, evm.message.current_target
    ).balance
    if sender_balance < value:
        push(evm.stack, U256(0))
        evm.return_data = b""
        evm.gas_left += message_call_gas.sub_call
    else:
        generic_call(
            evm,
            message_call_gas.sub_call,
            value,
            evm.message.current_target,
            to,
            code_address,
            True,
            False,
            memory_input_start_position,
            memory_input_size,
            memory_output_start_position,
            memory_output_size,
        )

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
def incorporate_child_on_success(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of a successful `child_evm` into the parent `evm`.

    Parameters
    ----------
    evm :
        The parent `EVM`.
    child_evm :
        The child evm to incorporate.
    """
    evm.gas_left += child_evm.gas_left
    evm.logs += child_evm.logs
    evm.refund_counter += child_evm.refund_counter
    evm.accounts_to_delete.update(child_evm.accounts_to_delete)
    evm.touched_accounts.update(child_evm.touched_accounts)
    if account_exists_and_is_empty(
        evm.message.block_env.state, child_evm.message.current_target
    ):
        evm.touched_accounts.add(child_evm.message.current_target)
    evm.accessed_addresses.update(child_evm.accessed_addresses)
    evm.accessed_storage_keys.update(child_evm.accessed_storage_keys)


def incorporate_child_on_error(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of an unsuccessful `child_evm` into the parent `evm`.

    Parameters
    ----------
    evm :
        The parent `EVM`.
    child_evm :
        The child evm to incorporate.
    """
    # ...
    evm.gas_left += child_evm.gas_left
```
</file>
</execution-specs>
## Prompt Corrections
The provided prompt is very detailed and well-structured. Here are a few clarifications based on the `execution-specs` that might improve the implementation:

1.  **Stipend Gas Refund**: The prompt's `StipendTracker` implementation suggests that stipend gas is not refundable to the caller. In `execution-specs` (and other clients like Geth), the stipend is simply extra gas given to the callee. Any gas remaining at the end of the sub-call, including unused stipend gas, is returned to the caller's `gas_left`. The caller pays for the forwarded gas (including the stipend) as part of the `CALL` instruction's cost.
    - **Recommendation**: Consider if the explicit non-refund behavior is a desired deviation. If aiming for spec-compliance, the unused stipend should be refunded. The `incorporate_child_on_success` function shows `evm.gas_left += child_evm.gas_left`, which includes any unused gas from the stipend.

2.  **Stipend-Only Context Check**: The prompt's `is_using_stipend_only()` and `can_make_value_call()` functions are excellent abstractions for safety. In the specs, this is handled implicitly. A `CALL` with `value > 0` costs at least `GAS_WARM_ACCESS` (100) + `GAS_CALL_VALUE` (9000). If a contract only has the 2300 gas stipend left, attempting another value-transfer call will naturally fail with an `OutOfGasError` because the cost of the instruction itself exceeds the available gas. The explicit check in the prompt is a robust way to implement this protection.

3.  **Gas Calculation**: The `calculate_message_call_gas` function in `gas.py` is the canonical reference. It shows that the stipend is only added to the gas forwarded to the child (`sub_call`), not the `cost` charged to the parent for the operation itself (the parent pays for the forwarded gas, but the stipend is an "extra" on top). The provided `calculate_call_gas` function in the prompt correctly adds the stipend to `gas_to_forward`.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas stipend for CALL and CALLCODE when transferring value.
const CallStipend uint64 = 2300

// Gas cost of a CALL operation.
const CallGas uint64 = 0 // Overridden by EIP-150

// Gas costs for specified EIPs
const (
	CallValueTransferGas   uint64 = 9000 // Paid for CALL when the value transfer is non-zero
	CallNewAccountGas      uint64 = 25000 // Paid for CALL when the destination address is non-existent and non-empty
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasCall is the gas cost of a CALL operation.
func gasCall(interpreter *Interpreter, contract *Contract, stack *Stack, memory *Memory, evm *EVM) (uint64, error) {
	// Gas check for transaction being created, charge for the creation
	// of a new account (EIP-2929).
	var (
		gas            = uint64(0)
		addr           = common.BytesToAddress(stack.Peek(1).Bytes())
		value          = stack.Peek(2)
		transfersValue = value.Sign() > 0
		addressExists  = evm.StateDB.Exist(addr)
	)
	if evm.chainRules.IsBerlin {
		// Gas cost of warming the destination address.
		if !evm.StateDB.AddressInAccessList(addr) {
			gas += params.ColdAccountAccessCostEIP2929
		}
	}
	if transfersValue && !addressExists {
		// Account creation in call
		gas += params.CallNewAccountGas
	}
	if transfersValue {
		gas += params.CallValueTransferGas
	}
	// Memory expansion gas
	m, _, err := memorySize(stack, 3, 4)
	if err != nil {
		return 0, err
	}
	var memoryGas uint64
	if memoryGas, err = memory.Gas(m); err != nil {
		return 0, err
	}
	gas += memoryGas
	// Dynamic gas cost for the call itself
	evm.callGasTemp, err = callGas(interpreter.gasPool, gas, stack.Peek(0), value)
	if err != nil {
		return 0, err
	}
	gas += evm.callGasTemp // add the gas for the call
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the gas function for the CALL opcode.
func opCall(interpreter *Interpreter, contract *Contract, stack *Stack, memory *Memory, evm *EVM) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, addr, value, inOffset, inSize, retOffset, retSize := stack.Pop7()
	toAddr := common.BytesToAddress(addr.Bytes())

	// Don't allow passing value in read-only mode
	if interpreter.readOnly && value.Sign() > 0 {
		return nil, ErrWriteProtection
	}

	// Get memory location of input data.
	// The words are loaded in little-endian order.
	var input []byte
	if inSize.Sign() > 0 {
		input = memory.GetPtr(inOffset.Uint64(), inSize.Uint64())
	}

	// Pass gas stipend if value is being transferred
	if value.Sign() > 0 {
		gas.Add(gas, big.NewInt(params.CallStipend))
	}
	// Take stipend out of passed gas
	stipend := int64(0)
	if value.Sign() > 0 {
		stipend = params.CallStipend
	}

	ret, returnGas, err := interpreter.evm.Call(contract, toAddr, input, gas.Uint64(), value.ToBig())

	// EIP-211, all gas is consumed on error, but not on revert
	if err != nil {
		if err != ErrExecutionReverted {
			returnGas = 0
		}
	}
	stack.Push(uint256.NewInt(0).SetBool(err == nil))

	if err == nil || err == ErrExecutionReverted {
		memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}

	// remove stipend from remaining gas
	if returnGas < uint64(stipend) {
		return nil, fmt.Errorf("stipend (%d) is greater than remaining gas (%d)", stipend, returnGas)
	}
	returnGas -= uint64(stipend)
	// Return gas to the call pool
	interpreter.gasPool.AddGas(returnGas)
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the EVM code of a contract.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > 1024 {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// Fail if we're trying to transfer more than the available balance
	if value.Sign() > 0 && !evm.Context.CanTransfer(evm.StateDB, caller.Address(), uint256.MustFromBig(value)) {
		return nil, gas, ErrInsufficientBalance
	}

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	// Transfer value, and create account if necessary
	if isPrecompile {
		evm.StateDB.AddAddressToAccessList(addr)
	}
	if value.Sign() > 0 {
		evm.Context.Transfer(evm.StateDB, caller.Address(), addr, uint256.MustFromBig(value))
	}
	var (
		code     []byte
		codeHash common.Hash
	)
	if !isPrecompile {
		code = evm.StateDB.GetCode(addr)
		codeHash = evm.StateDB.GetCodeHash(addr)
	}
	// If the destination has no code and no precompile is available, fall back
	// to simple value transfer if no input is provided.
	if len(code) == 0 && !isPrecompile {
		return nil, gas, nil
	}

	contract := NewContract(caller, AccountRef(addr), new(uint256.Int).SetFromBig(value), gas)
	contract.Code = code
	contract.CodeHash = codeHash

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Create a new interpreter and execute the code
		ret, err = run(evm, contract, input, false)
	}
	// When an error occurs, consume all gas but return whatever is left
	// otherwise return the left over gas.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, ErrExecutionReverted) {
			gas = 0
		}
	}
	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// ApplyTransactionWithEVM attempts to apply a transaction to the given state database
// and uses the input parameters for its environment similar to ApplyTransaction. However,
// this method takes an already created EVM instance as input.
func ApplyTransactionWithEVM(msg *Message, gp *GasPool, statedb *state.StateDB, blockNumber *big.Int, blockHash common.Hash, blockTime uint64, tx *types.Transaction, usedGas *uint64, evm *vm.EVM) (receipt *types.Receipt, err error) {
    // ... (omitted hooks logic)
	// Apply the transaction to the current state (included in the env).
	result, err := ApplyMessage(evm, msg, gp)
	if err != nil {
		return nil, err
	}
    // ... (omitted state finalization logic)
	*usedGas += result.UsedGas
    // ... (omitted access list merging)

	return MakeReceipt(evm, result, statedb, blockNumber, blockHash, blockTime, tx, *usedGas, root), nil
}

// ApplyMessage computes the new state by applying the given message against the
// state database. It returns the receipt, the remaining gas, and an error if it
// failed. An error always indicates a core error meaning that the message would
// always fail for that particular state and would never be accepted within a
// block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	return applyMessage(evm, msg, gp, false)
}

func applyMessage(evm *vm.EVM, msg *Message, gp *GasPool, isPrecheck bool) (*ExecutionResult, error) {
	// ... (omitted setup and error handling)

	// If the caller has sufficient balance for the transfer, deduct the gas from
	// the pool. This is done here rather than just before the execution because
	// the EVM run loop will be running even if the balance is insufficient, but
	// the SUB opcode will causing an error causing the account state to be restored
	// to the snapshot created at the beginning of this procedure.
	if err := gp.SubGas(msg.GasLimit); err != nil {
		return nil, err
	}

	// Create a new context to be used in the EVM environment.
	evm.SetTxContext(NewEVMTxContext(msg))

	var (
		res *ExecutionResult
		err error
	)
	if msg.To == nil {
		res, _, err = evm.Create(msg.From, msg.Data, msg.GasLimit, uint256.MustFromBig(msg.Value))
	} else {
		res, _, err = evm.Call(msg.From, *msg.To, msg.Data, msg.GasLimit, uint256.MustFromBig(msg.Value))
	}
    // ... (omitted error handling)

	return res, nil
}
```
</file>
## Prompt Corrections

The original prompt includes a design for a `StipendTracker` which implies that stipend gas and regular gas should be tracked as separate pools. The `go-ethereum` implementation achieves the same security goal (preventing stipend gas from funding another value-transferring call) via a more elegant and implicit mechanism:

1.  **Stipend is Added to Total Gas**: When a `CALL` with `value > 0` occurs, the 2300 gas stipend is simply added to the total gas forwarded to the callee. There is no separate "stipend pool".

2.  **Implicit Prevention of Recursion**: A subsequent `CALL` with `value > 0` inside the sub-context costs `CallValueTransferGas` (9000 gas) plus other base costs. This cost is significantly higher than the `CallStipend` (2300 gas). If the sub-context only has the stipend gas (or slightly more), the check `if available_gas < call_cost` will naturally fail, preventing the recursive value call without needing to explicitly track whether the gas is "regular" or "stipend".

This approach is simpler and avoids the overhead of a dedicated tracking struct. The implementation should follow this implicit model from `go-ethereum` rather than the explicit `StipendTracker` proposed in the prompt. The provided `go-ethereum` snippets illustrate this more efficient design.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas costs for expensive operations.
const (
	// ...
	CallStipend:             2300,   // Free gas given to account when calling
	CallValueTransferGas:    9000,   // Paid for CALL when the value transfer is non-zero
	CallNewAccountGas:       25000,  // Paid for CALL when the destination address is new
	// ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall implements the CALL opcode.
// This is a simplified representation of the logic in go-ethereum, combining
// elements for clarity on gas calculation and stipend handling.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop arguments from the stack including gas, address, and value.
	gas, addr, value, inoffset, insize, retoffset, retsize := stack.Pop6()

	// ... [memory expansion logic] ...

	// Part 1: Calculate and pay for the gas cost of the CALL operation itself.
	// This cost is paid by the *caller*.
	var cost uint64
	isEip150 := evm.chainRules.IsEIP150 // EIP-150 changed gas calculations

	transfersValue := !value.IsZero()
	if transfersValue {
		// Add cost for transferring value.
		cost += params.CallValueTransferGas
		// Add cost if the call creates a new account.
		if !evm.StateDB.Exist(addr.Address()) {
			cost += params.CallNewAccountGas
		}
	}
	// ... [add cost for cold account access under EIP-2929] ...

	// Consume this base cost from the caller's gas pool.
	if !contract.UseGas(cost) {
		return nil, ErrOutOfGas
	}

	// Part 2: Calculate the gas to be forwarded to the *callee*.
	gasForCall := contract.Gas // Start with all remaining gas.

	// Apply EIP-150's 63/64 rule: caller keeps 1/64 of available gas.
	if isEip150 {
		gasForCall = gasForCall - gasForCall/64
	}

	// The `gas` parameter from the stack can further limit the forwarded gas.
	if gas.IsUint64() {
		gasForCall = min(gasForCall, gas.Uint64())
	}
	
	// Add the 2300 gas stipend if value is being transferred.
	// This is added to the callee's gas pool.
	if transfersValue {
		gasForCall += params.CallStipend
	}
	// Ensure we don't gift gas; forwarded gas cannot exceed what the caller has left.
	if gasForCall > contract.Gas {
		gasForCall = contract.Gas
	}

	// Part 3: Execute the sub-call.
	ret, returnGas, err := evm.Call(contract, addr.Address(), memory.GetPtr(int(inoffset.Uint64()), int(insize.Uint64())), gasForCall, value)

	// ... [handle return data and success/failure status] ...

	// Part 4: Refund any unused gas from the sub-call back to the caller.
	// This includes any part of the stipend that was not used.
	contract.Gas += returnGas

	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the code of a contract in a new EVM frame.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Fail if we're trying to execute above the call depth limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static context.
	if !value.IsZero() && evm.readOnly {
		return nil, gas, ErrWriteProtection
	}
	// ...
	evm.StateDB.Snapshot()

	to := ToAddress(addr)
	// Create a new contract object for the callee.
	// The `gas` parameter, which includes the stipend, becomes the callee's total gas.
	contract := NewContract(caller, to, value, gas)
	
	// ... [precompile and code loading logic] ...

	// Run the interpreter for the new frame.
	ret, err = evm.interpreter.Run(contract, input, evm.readOnly)

	// After execution, the leftover gas is whatever remains in the contract's gas pool.
	if err == nil {
		leftOverGas = contract.Gas
	}
	// ... [handle reverts] ...
	return ret, leftOverGas, err
}
```
</file>
</go-ethereum>
## Prompt Corrections

After reviewing the go-ethereum implementation, here are two key improvements for the original prompt's implementation plan:

1.  **Stipend Refund Mechanism**:
    *   **Prompt's Proposal**: The `StipendTracker` in the prompt suggests that only unused *regular* gas is refunded to the caller, and the stipend is treated as a separate, non-refundable pool.
    *   **Go-Ethereum's Implementation**: The stipend is simply added to the total gas forwarded to the callee (`gasForCall += params.CallStipend`). Any gas remaining in the callee's context after its execution finishes—whether it came from the original forwarded gas or the stipend—is returned to the caller as a single amount. This is simpler, more efficient, and aligns directly with the EVM specification, which does not differentiate between gas pools for refund purposes.
    *   **Recommendation**: The `StipendTracker` is an unnecessary complication. The implementation should add the stipend to the total gas for the sub-call and refund all `gas_left` from the sub-call to the caller.

2.  **Stipend Re-entrancy Protection**:
    *   **Prompt's Proposal**: The prompt suggests an explicit check for a "stipend-only context" (`is_stipend_only_context()`) to prevent a contract from using its stipend to fund another value-transferring call.
    *   **Go-Ethereum's Implementation**: This protection is achieved implicitly through gas economics, not an explicit state check. The cost for a `CALL` that transfers value is **9000 gas** (`CallValueTransferGas`). The stipend is only **2300 gas**. Therefore, a contract running only on stipend gas will not have enough gas to make another value-transferring `CALL`, as the initial `UseGas(9000)` check will fail.
    *   **Recommendation**: Remove the `StipendTracker` and the `is_stipend_only_context` check. The re-entrancy protection is an emergent property of the existing gas cost rules and does not require special logic.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas cost parameters for value-transferring CALL operations.
const (
	CallValueTransferGas   uint64 = 9000 // Paid for CALL when the value transfer is non-zero.
	CallNewAccountGas      uint64 = 25000 // Paid for CALL when the destination address didn't exist prior.
	CallStipend            uint64 = 2300 // Free gas given to account when CALL transfers value.
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// callGas returns the gas required for calling a contract.
//
// The cost of gas was changed during the Tangerine Whistle fork.
// The cost is calculated as follows:
//
//   - If the transfers value, C_callvalue.
//   - If the call creates a new account, C_newaccount.
//   - If the call is a C_call, C_callgas.
//   - If the called account is not warm, C_coldaccountaccess.
func callGas(rules Rules, gas, availableGas uint64, value *big.Int, isCold bool) (uint64, error) {
	var (
		cost    uint64
		transfers = value.Sign() != 0
	)
	if rules.IsBerlin {
		if isCold {
			cost += ColdAccountAccessCost
		}
	}
	if transfers {
		cost += CallValueTransferGas
	}
	// This is the gas that will be available for the callee.
	// We need to check it against the gas that the caller has left.
	if rules.IsEIP150 {
		availableGas = availableGas - cost
		gas = min(gas, availableGas)
	}
	// Add stipend for value transfers.
	if transfers {
		gas += CallStipend
	}
	// This is the total gas to be deducted from the sender's account.
	cost += gas
	return cost, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the general call operation.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	var (
		gas            = stack.pop()
		addr           = stack.pop()
		value          = stack.pop()
		inOffset, inSize = stack.pop(), stack.pop()
		retOffset, retSize = stack.pop(), stack.pop()
	)
	// Don't use gas object as it's expensive and this is the only place it's
	// needed. The only reason we use it is for the GASCAP check.
	gas.SetUint64(min(gas.Uint64(), evm.interpreter.gas))

	toAddr := common.Address(addr.Bytes20())
	args := memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	// Handle the value transfer stipend.
	if value.Sign() != 0 {
		gas.Add(gas, params.CallStipend)
	}

	ret, returnGas, err := evm.Call(contract, toAddr, args, gas.Uint64(), value)

	if err == nil {
		stack.push(uint256.NewInt(1))
	} else {
		stack.push(uint256.NewInt(0))
	}
	if err == nil || err == ErrExecutionReverted {
		memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}
	contract.Gas += returnGas

	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the code of a contract in a new EVM frame.
//
// Call is a low-level method and expects the parent to have-
//  - checked memory
//  - checked nonce against transaction-nonce
//  - checked for pending state changes with IsSuicide
//  - deducted all gas for the call from the parent.
//
// This method is not intended to be used directly, instead use the higher-level
// methods such as Create, Call, CallCode, DelegateCall and StaticCall.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	//...
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}

	// Ensure the called account is warm. This has to be done here, because we might
	// have recurred into a hitherto untouched account.
	snapshot := evm.StateDB.Snapshot()
	if !evm.StateDB.Exist(addr) {
		//...
	} else {
		// In pre-EIP150 forks, transfer value up-front, and if that fails,
		// use all gas and fail silently. In post-EIP150, we first check
		// the available gas, and only then perform the value transfer.
		if value.Sign() > 0 && !evm.chainRules.IsEIP150 {
			//...
		}
	}
	// Check if this is a precompiled contract
	if isPrecompiled(addr) {
		//...
	}
	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	code, codeHash := evm.StateDB.GetCode(addr), evm.StateDB.GetCodeHash(addr)
	if len(code) == 0 {
		//...
	}

	// If the endowment is sent to a non-existing account, take a snapshot after the
	// account is created. We need to do this because the code needs to be rolled
	// back to an empty value if the CREATE op fails.
	if !evm.StateDB.Exist(addr) && value.Sign() > 0 {
		//...
	}
	// Main call logic.
	//
	// The gas for this particular contract is a subset of the total gas given
	// to the call instruction. The exact amount of gas is important, and takes
	// part in the gas refund scheme.
	//
	// The `gas` parameter is the total gas given for the call instruction,
	// and `callCost` is the gas used by the call instruction itself.
	//
	// `availableGas` is the gas available to this call, which is `gas - callCost`.
	// However, if `gas` is less than `callCost`, then `availableGas` is `0`.
	//
	// In EIP-150, a stipend is given to the callee for **value-transfer** calls.
	// The stipend is `CallStipend`.
	if evm.chainRules.IsEIP150 {
		// The available gas is the gas passed to the call, minus what's charged
		// for the call itself.
		//
		// According to EIP-150, all but 1/64 of the passed gas is available to
		// the callee.
		availableGas := gas - gas/64
		// The caller can also specify a gas limit, which is `gas`.
		// Take the minimum of those two values.
		if gas < availableGas {
			availableGas = gas
		}
		// If this is a value-transfer, and the callee has no code, the stipend
		// is added to the gas available for the call.
		if value.Sign() > 0 {
			availableGas += params.CallStipend
			// We can't use more gas than what's available in the parent context.
			if gas < availableGas {
				availableGas = gas
			}
		}
		// Before Spurious Dragon, we need to do the balance check just before
		// we call the code.
		if value.Sign() > 0 {
			// The sub-call cannot create a new account, so we need to check
			// the balance *before* the transfer.
			if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
				return nil, gas, ErrInsufficientBalance
			}
		}
		gas = availableGas
	}

	// This is the actual gas available to the child call.
	// The cost of the call has already been deducted at the calling site
	// and that is not what this variable is.
	// This is the gas that can be used by the callee for execution.
	//
	// This check is needed for legacy reasons. The available gas is not part of the
	// call constraints, and could be anything. A badly configured VM might even have
	// more gas available than what's in the caller.
	if gas > evm.gas {
		gas = evm.gas
	}
	// Run the contract-code
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, codeHash, code)
	contract.Input = input
	//...
	// When an account is called with a value transfer, the cost of the transfer
	// is paid by the caller. If the call fails, the gas is not returned, but the
	// state changes are reverted. This is a special case in the EIP-150 spec.
	var stipend uint64
	if value.Sign() > 0 {
		stipend = params.CallStipend
	}
	if evm.chainRules.IsEIP150 && gas < stipend {
		gas = stipend
	}
	// It's important that we set the readOnly flag to false here, because we
	// are not in a static call, and it may have been enabled earlier.
	// But it's also important that we remember the previous value, and restore
	// it when we're done.
	oldReadOnly := evm.readOnly
	if caller.IsStatic() {
		evm.readOnly = true
	}
	// Check for code existence first, to prevent a state-change for a non-existent account
	// to enter the state trie. The Call operation is different from a transfer in that
	// it can be executed on a non-existent account.
	//
	// The value transfer is performed after the gas check has been performed.
	// This is to prevent a call from failing because of an OOG during the first
	// part of the call op.
	if value.Sign() > 0 {
		// This is the gas-first check for value transfers, EIP-150.
		// If there's not enough gas for the call, then we don't have to do the
		// transfer. The cost of the call is still deducted from the caller.
		//
		// We have to check this here, because the gas available to the callee is
		// not the same as the gas limit passed to the call instruction.
		if evm.gas < gas {
			return nil, evm.gas, ErrOutOfGas
		}
		evm.Transfer(evm.StateDB, caller.Address(), addr, value)
	}

	ret, err = run(evm, contract, input, false)
	// The leftover gas is the gas remaining in the child context
	leftOverGas = contract.Gas()
	evm.readOnly = oldReadOnly
	//...
	return ret, leftOverGas, err
}
```
</file>

## Prompt Corrections
The prompt provides a solid foundation for implementing the call gas stipend. However, the Go-Ethereum implementation reveals a few subtle differences in approach that are worth noting for a more accurate implementation.

1.  **Stipend Limitation Check is More Direct in Geth**:
    The prompt suggests a `StipendTracker` with a `can_make_value_call` method, which checks if there's enough *regular* gas. Geth's approach is more direct and arguably simpler. Inside `EVM.Call`, *before* the value transfer and recursive execution, it checks if the gas available to the child context is sufficient *without* counting the stipend.

    Specifically, `EVM.Call` has this logic:
    ```go
    // This is the gas available to the callee.
    gasForCall := gas
    if value.Sign() > 0 {
        gasForCall += params.CallStipend
    }

    // ...
    // Later, before actually transferring value and running code:
    // It checks if the gas passed *to the call operation* is sufficient,
    // which implicitly excludes the stipend.
    if evm.gas < gasForCall {
        return nil, evm.gas, ErrOutOfGas
    }
    ```
    This ensures that the stipend is a bonus for the recipient to execute code but cannot be used by the caller to fund deeper value-transferring calls. This is a more direct way to enforce the "stipend cannot enable recursive value calls" rule than tracking separate gas pools.

2.  **Gas Calculation Flow**:
    The prompt's `calculate_call_gas` function is well-structured. However, the Go-Ethereum `callGas` function in `core/vm/gas.go` provides a slightly different but equivalent perspective. It calculates the base cost (`cost`) first, then determines the gas to forward (`gas`) using the 63/64 rule, and *then* adds the `stipend` to the forwarded `gas`. The total cost for the caller is `cost + gas` (where `gas` is the amount before the stipend is added). The recipient receives `gas + stipend`. This distinction is subtle but important for precise gas accounting.

3.  **No Unused Stipend Refund**:
    The prompt's `execute_call` has a section for returning unused gas:
    ```zig
    // Return unused gas (excluding stipend)
    const unused_gas = child_frame.stipend_tracker.regular_gas_remaining;
    frame.stipend_tracker.regular_gas_remaining += unused_gas;
    ```
    In Go-Ethereum, there's no concept of returning "unused stipend gas" separately. The stipend is added to the child frame's total gas pool. If the child frame runs out of its "regular" gas, it starts consuming the stipend. Any gas remaining at the end of the child's execution (`leftOverGas`) is returned to the caller, regardless of whether it was originally part of the stipend or not. The stipend is essentially a "use it or lose it" bonus for the recipient. The security is handled by the check mentioned in point #1, not by restricting the refund.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas costs
const (
	...
	CallStipend:          2300,   // A stipend for calls resolving lazy accounts
	CallValueTransferGas: 9000,   // Paid for CALL when the value transfer is non-zero
	CallNewAccountGas:    25000,  // Paid for CALL when the destination address is create
	...
	// EIP-2929 related gas constants
	ColdAccountAccessCostEIP2929: 2600, // EIP-2929: Gas cost of accessing an account for the first time
	WarmStorageReadCostEIP2929:   100,  // EIP-2929: Gas cost of reading a warm storage slot.
	...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opCall(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	stack := scope.Stack
	// Pop gas. The actual gas in interpreter.evm.callGasTemp.
	// We can use this as a temporary value
	temp := stack.pop()
	gas := interpreter.evm.callGasTemp
	// Pop other call parameters.
	addr, value, inOffset, inSize, retOffset, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()
	toAddr := common.Address(addr.Bytes20())
	// Get the arguments from the memory.
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	if interpreter.readOnly && !value.IsZero() {
		return nil, ErrWriteProtection
	}
	if !value.IsZero() {
		gas += params.CallStipend
	}
	ret, returnGas, err := interpreter.evm.Call(scope.Contract.Address(), toAddr, args, gas, &value)

	if err != nil {
		temp.Clear()
	} else {
		temp.SetOne()
	}
	stack.push(&temp)
	if err == nil || err == ErrExecutionReverted {
		scope.Memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}

	scope.Contract.RefundGas(returnGas, interpreter.evm.Config.Tracer, tracing.GasChangeCallLeftOverRefunded)

	interpreter.returnData = ret
	return ret, nil
}

func opCallCode(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	// Pop gas. The actual gas is in interpreter.evm.callGasTemp.
	stack := scope.Stack
	// We use it as a temporary value
	temp := stack.pop()
	gas := interpreter.evm.callGasTemp
	// Pop other call parameters.
	addr, value, inOffset, inSize, retOffset, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()
	toAddr := common.Address(addr.Bytes20())
	// Get arguments from the memory.
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	if !value.IsZero() {
		gas += params.CallStipend
	}

	ret, returnGas, err := interpreter.evm.CallCode(scope.Contract.Address(), toAddr, args, gas, &value)
    // ... (rest of the function is similar to opCall)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
func gasCall(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	var (
		gas            uint64
		transfersValue = !stack.Back(2).IsZero()
		address        = common.Address(stack.Back(1).Bytes20())
	)
	if evm.chainRules.IsBerlin {
		if !evm.StateDB.AddressInAccessList(address) {
			gas += params.ColdAccountAccessCostEIP2929
		}
	}
	if evm.chainRules.IsEIP158 {
		if transfersValue && evm.StateDB.Empty(address) {
			gas += params.CallNewAccountGas
		}
	} else if !evm.StateDB.Exist(address) {
		gas += params.CallNewAccountGas
	}
	if transfersValue {
		gas += params.CallValueTransferGas
	}
	memoryGas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	var overflow bool
	if gas, overflow = math.SafeAdd(gas, memoryGas); overflow {
		return 0, ErrGasUintOverflow
	}

	evm.callGasTemp, err = callGas(evm.chainRules.IsEIP150, contract.Gas, gas, stack.Back(0))
	if err != nil {
		return 0, err
	}
	if gas, overflow = math.SafeAdd(gas, evm.callGasTemp); overflow {
		return 0, ErrGasUintOverflow
	}

	return gas, nil
}

func gasCallCode(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	memoryGas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	var (
		gas      uint64
		overflow bool
	)
	if stack.Back(2).Sign() != 0 && !evm.chainRules.IsEIP4762 {
		gas += params.CallValueTransferGas
	}
	if gas, overflow = math.SafeAdd(gas, memoryGas); overflow {
		return 0, ErrGasUintOverflow
	}
	evm.callGasTemp, err = callGas(evm.chainRules.IsEIP150, contract.Gas, gas, stack.Back(0))
	if err != nil {
		return 0, err
	}
	if gas, overflow = math.SafeAdd(gas, evm.callGasTemp); overflow {
		return 0, ErrGasUintOverflow
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// callGas returns the actual gas cost of the call.
//
// The cost of gas was changed during the homestead price change HF.
// As part of EIP 150 (TangerineWhistle), the returned gas is gas - base * 63 / 64.
func callGas(isEip150 bool, availableGas, base uint64, callCost *uint256.Int) (uint64, error) {
	if isEip150 {
		availableGas = availableGas - base
		gas := availableGas - availableGas/64
		// If the bit length exceeds 64 bit we know that the newly calculated "gas" for EIP150
		// is smaller than the requested amount. Therefore we return the new gas instead
		// of returning an error.
		if !callCost.IsUint64() || gas < callCost.Uint64() {
			return gas, nil
		}
	}
	if !callCost.IsUint64() {
		return 0, ErrGasUintOverflow
	}

	return callCost.Uint64(), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	//...
	for {
		// ...
		// Get the operation from the jump table and validate the stack ...
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas // For tracing
		// Validate stack
		if sLen := stack.len(); sLen < operation.minStack {
			return nil, &ErrStackUnderflow{stackLen: sLen, required: operation.minStack}
		} else if sLen > operation.maxStack {
			return nil, &ErrStackOverflow{stackLen: sLen, limit: operation.maxStack}
		}
		// ...
		if contract.Gas < cost {
			return nil, ErrOutOfGas
		}
		// ...
		// All ops with a dynamic memory usage also has a dynamic gas cost.
		var memorySize uint64
		if operation.dynamicGas != nil {
			// ...
			// Consume the gas and return an error if not enough gas is available.
			// cost is explicitly set so that the capture state defer method can get the proper cost
			var dynamicCost uint64
			dynamicCost, err = operation.dynamicGas(in.evm, contract, stack, mem, memorySize)
			cost += dynamicCost // for tracing
			if err != nil {
				return nil, fmt.Errorf("%w: %v", ErrOutOfGas, err)
			}
			if contract.Gas < dynamicCost {
				return nil, ErrOutOfGas
			}
			contract.UseGas(dynamicCost, in.evm.Config.Tracer, tracing.GasChangeCallOpCode)
		}
		// ...
		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		// ...
	}
    // ...
}
```
</file>
</go-ethereum>
## Prompt Corrections
The prompt's `StipendTracker` struct is a valid but potentially over-engineered way to implement stipend limitations. Go-Ethereum's implementation is simpler and more implicit:

1.  **Combined Gas Pool**: The recipient of a value-transferring call receives a single gas pool equal to `(forwarded_gas + stipend)`. There's no explicit separation of "regular" vs "stipend" gas.
2.  **Implicit Restriction**: The mechanism preventing the stipend from funding a recursive value-transferring call is the high base cost of the `CALL` opcode itself. A `CALL` with `value > 0` costs the caller at least `9000` gas (`CallValueTransferGas`).
3.  **The Check**: When the recipient contract (now the caller) attempts a subsequent value call, the interpreter checks if its *current total gas* is sufficient to cover the `9000+` base cost of that new call. Since the stipend is only `2300`, a contract left with only stipend gas will fail this check with an "out of gas" error, naturally preventing the re-entrancy attack vector.

This approach avoids the complexity of tracking and consuming from two separate gas pools. The key insight is that the stipend is large enough for simple operations (like logging) but too small to pay the entry fee for another state-changing, value-transferring call. The `core/vm/interpreter.go` snippet shows this check (`if contract.Gas < dynamicCost`).

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ... (other gas constants)

	// CallStipend is the gas stipend provided to a frame for making a call
	// that transfers value. This ensures that the recipient can execute code,
	// even if the caller sent all available gas.
	CallStipend uint64 = 2300

	// CallValueTransferGas is the gas required for a call that transfers value.
	CallValueTransferGas uint64 = 9000

	// CallNewAccountGas is the gas required for a call that creates a new account.
	CallNewAccountGas uint64 = 25000

	// ... (other gas constants)
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// allBut64th returns the amount of gas less 1/64th of it.
func allBut64th(gas uint64) uint64 {
	return gas - gas/64
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasCall calculates the gas requirement for a CALL-type opcode.
//
// memorySize can be safely ignored here, as it is only used by a few opcodes,
// and otherwise empty. Instead, the memory expansion cost is returned as the
// second value.
func gasCall(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// ... (stack access and memory cost calculation) ...

	// Gas cost for warming the address, we don't need to check for coldness here.
	// The access list will charge the correct amount of gas.
	gas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	evm.StateDB.AddAddressToAccessList(address)
	// The warm-cold access cost is already applied by accessAddress.
	// If the access is cold, the cost is 2600. If warm, 100.
	cost, _ := evm.accessList.AddressAccessCost(address)
	gas += cost

	if transfersValue {
		gas += params.CallValueTransferGas
	}
	if !evm.StateDB.Exist(address) {
		// Tentative account creation should be journaled.
		// It's not a permanent creation. The CALL might not have sufficient balance
		// to make the payment.
		// In that case, the StateDB will be reverted to the state before this CALL.
		// This is a special corner case that other opcodes don't have.
		// Thus, we don't need to journal the `Exist` state for the address.
		gas += params.CallNewAccountGas
	}
	// ... (gas capping logic) ...
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no gas refund should be
// provided.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initial setup) ...

	for {
		// ... (opcode fetch and validation) ...

		// Get the operation from the jump table and validate the stack
		operation := in.cfg.JumpTable[op]

		// ... (stack validation) ...

		// If the operation is a call, calculate the call gas and create the call object
		if operation.call != nil {
			// ... (stack popping for call arguments) ...

			// Gas check for value transfers, this is performed before any persistent
			// state changes, so in case of an error state reversal is not necessary.
			if op == CALL && value.Sign() > 0 {
				if !evm.CanTransfer(evm.StateDB, contract.Address(), value) {
					stack.push(zero)
					continue
				}
			}

			// ... (access list prep work) ...
			
			// Calculate the gas cost for the call.
			cost, err := operation.gasCost(evm, contract, stack, mem)
			if err != nil {
				return nil, err
			}
			if err = contract.UseGas(cost); err != nil {
				return nil, err
			}
			availableGas := contract.Gas()
			
			// EIP-150: all but 1/64 of the available gas is forwarded
			// to the callee. The call gas still needs to be paid by
			// the caller.
			gasForCall := allBut64th(availableGas)

			// ensure that the explicitly requested gas is not excessed
			if gas > 0 {
				gasForCall = min(gasForCall, gas)
			}

			// add stipend for value transfers
			if op == CALL && value.Sign() > 0 {
				gasForCall += params.CallStipend
			}

			// Create the new call and execute it
			ret, _, err = operation.call(&callParams)

			// ... (handle result and refund gas) ...
		}
		// ... (other operations) ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// CanTransfer checks whether the given account has enough balance for a transfer.
// This enters the account into the access list.
func (evm *EVM) CanTransfer(db StateDB, addr common.Address, balance *uint256.Int) bool {
	// If the originator is a contract, and the call is not static,
	// it can be run using only the call stipend if the value is zero.
	if !db.HasSuicided(addr) && balance.IsZero() && evm.interpreter.IsStatic() {
		return true
	}
	return db.GetBalance(addr).Cmp(balance) >= 0
}

// Call executes the message call using the current EVM and returns the result as
// bytes, the gas left on the stack and an error if it failed.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call.
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// Ensure the callees account is warm, this is necessary for EIP-2929, if we're
	// running a version of the EVM that is post-berlin.
	if evm.Context.Rules.IsBerlin {
		evm.StateDB.AddAddressToAccessList(addr)
	}
	// Fail if the sender has insufficient balance for the transfer.
	// This is checked for Berlin in `evm.Run` before the first opcode.
	if !evm.Context.Rules.IsBerlin && value.Sign() > 0 && !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	// ... (precompile handling) ...

	// Regular call:
	// Transfer value from caller to callee, create account if necessary.
	// The `evm.CanTransfer` check is already done at the top.
	evm.Transfer(caller.Address(), addr, value)

	code, codeHash := evm.StateDB.GetCode(addr), evm.StateDB.GetCodeHash(addr)

	// ... (handle empty code, create and run new interpreter) ...

	// The `err` is returned with the gas leftover. It is important to not set
	// the gas left to zero otherwise the caller with receive no gas back
	// and is not able to revert the state change.
	return ret, contract.Gas(), err
}
```
</file>

## Prompt Corrections
The original prompt proposes a `StipendTracker` to manage stipend gas separately. While this is a valid design, `go-ethereum` uses a simpler and more elegant mechanism that achieves the same security goal (preventing recursive value-calls using only stipend gas).

**Go-Ethereum's Stipend Mechanism:**

1.  The 2300 gas stipend is simply added to the total gas forwarded to the sub-context. It is not "special" or tracked separately.
2.  The security guarantee comes from the high base cost of a subsequent `CALL` that transfers value. This cost is defined as `CallValueTransferGas` (9000 gas) plus access list costs (at least 100 gas).
3.  If a contract has only the 2300 gas stipend remaining and attempts another value-transferring `CALL`, the EVM will calculate the `base_cost` for that new call (e.g., 9100 gas).
4.  The EVM will check if the contract has enough gas to cover this `base_cost` (`available_gas >= base_cost`). Since `2300 < 9100`, the check fails, and the recursive value-transferring call is not made with any gas.

This approach is more efficient as it doesn't require extra logic to track stipend vs. regular gas. The implementation should focus on correctly calculating the `base_cost` of a call (`gasCall` in go-ethereum) and ensuring the `available_gas` is sufficient before proceeding. The stipend is then a simple addition to the forwarded gas amount for value transfers.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas costs for performing CALL and other expensive operations.
const (
	CallValueTransferGas  uint64 = 9000  // Paid for CALL when the value transfer is non-zero.
	CallNewAccountGas     uint64 = 25000 // Paid for CALL when the destination address didn't exist prior.
	CallStipend           uint64 = 2300  // Free gas given at beginning of call.
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// gasCall returns the gas required for calling a contract.
//
// The cost of gas was changed during the Tangerine Whistle HF. Before that the gas cost was
// charged only for the base cost of the call and the call data. After the HF, the gas cost
// was changed to also charge for the value sent with the call and the gas required to create
// a new account when the destination of the call is empty.
//
// After the Cancun hardfork, the gas cost for calling a precompile is handled differently.
func gasCall(evm *EVM, contract *Contract, stack *Stack, memory *Memory, length, gas uint64) (uint64, error) {
	// After the Cancun hardfork, the cost for precompile calls is handled differently.
	// We delegate the gas calculation to the specific precompile's `Run` function.
	if contract.CodeAddr != nil && isPrecompiled(contract.CodeAddr) {
		return precompileGas(evm, contract, stack, memory, length, gas)
	}

	// Determine the params
	value := stack.peek(2)
	// EIP-2929: Start with warming up the address.
	evm.StateDB.AddAddressToAccessList(contract.Address())
	// Base fee, value transfer and account creation costs
	cost, err := callGas(evm.chainRules, value.Sign() > 0, !evm.StateDB.Exist(contract.Address()))
	if err != nil {
		return 0, err
	}
	// Memory expansion gas
	mcost, err := memoryGasCost(memory, length)
	if err != nil {
		return 0, err
	}
	// Gas for copying data.
	gcopy, err := copyGasCost(length)
	if err != nil {
		return 0, err
	}
	// And now, the final gas cost is composed of all previous costs.
	cost, err = math.SafeAdd(cost, mcost)
	if err != nil {
		return 0, err
	}
	cost, err = math.SafeAdd(cost, gcopy)
	if err != nil {
		return 0, err
	}
	return cost, nil
}

// callGas returns the actual gas cost of the call.
//
// The cost of gas was changed during the Tangerine Whistle HF. Before that the gas cost was
// charged only for the base cost of the call and the call data. After the HF, the gas cost
// was changed to also charge for the value sent with the call and the gas required to create
// a new account when the destination of the call is empty.
func callGas(rules Rules, transfersValue, newAccount bool) (uint64, error) {
	var (
		cost uint64
		err  error
	)
	if rules.IsEIP150 {
		cost = params.CallGasEIP150
	} else {
		cost = params.CallGasFrontier
	}
	if transfersValue {
		cost, err = math.SafeAdd(cost, params.CallValueTransferGas)
		if err != nil {
			return 0, err
		}
	}
	if newAccount {
		cost, err = math.SafeAdd(cost, params.CallNewAccountGas)
		if err != nil {
			return 0, err
		}
	}
	return cost, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the generic call operation.
func opCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, memory *Memory) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, to, value, inoffset, insize, retoffset, retsize := stack.PopN(7)

	// Check if the call is to a precompiled contract.
	if to.IsPrecompiled() {
		// precompiled contracts are handled in a different code path
		// ...
		return nil, nil
	}

	// Make sure we have enough gas to pay for the call.
	g, err := gasCall(evm, contract, stack, memory, inoffset.Uint64(), gas.Uint64())
	if err != nil {
		return nil, err
	}
	if !contract.UseGas(g) {
		return nil, ErrOutOfGas
	}
	gas.SetUint64(g)

	// For EIP-150: all but 1/64 of the available gas is passed to the sub-context.
	// The warm-up costs are already deducted.
	availableGas := contract.Gas
	if evm.chainRules.IsEIP150 {
		availableGas -= availableGas / 64
	}
	// Cap the gas to the amount available.
	if gas.Uint64() > availableGas {
		gas.SetUint64(availableGas)
	}

	// Add the call stipend if transfers value
	if value.Sign() > 0 {
		gas.Add(gas, big.NewInt(int64(params.CallStipend)))
	}

	// Get the arguments from the memory and execute the call
	args := memory.GetPtr(inoffset.Uint64(), insize.Uint64())
	ret, returnGas, err := evm.Call(contract, common.Address(to.Address()), args, gas.Uint64(), value)

	// After the call returns, we need to handle the return data and gas.
	stack.Push(new(uint256.Int).SetOne()) // Assume success (1)
	if err != nil {
		stack.Back(0).Clear() // Set to failure (0)
		if err != ErrExecutionReverted {
			returnGas = 0
		}
	}

	// Copy the return data to memory
	if retsize.Uint64() > 0 {
		// ... memory copy logic
	}

	contract.Gas += returnGas
	return ret, err
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the destination address.
//
// It can be called from the outside, meaning that the memory is initialized,
// but the context is the caller's context and the data has been put on the
// stack.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}

	// Fail if we're trying to execute above the gas limit
	if gas > caller.Gas() {
		return nil, gas, ErrOutOfGas
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}

	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	// ... (account creation and value transfer logic)

	// Set up the new contract and execute.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))

	ret, err = run(evm, contract, input, false)
	// When the execution finishes, retrieve the remaining gas and return it
	return ret, contract.Gas, err
}
```
</file>

## Prompt Corrections
The original prompt proposes a `StipendTracker` to manage stipend gas separately. While this is a valid design, the `go-ethereum` implementation uses a simpler and equally effective method. It's worth considering this alternative for its simplicity and because it is battle-tested in a major client.

**Key points from the `go-ethereum` implementation:**

1.  **No Separate Stipend Tracking**: `go-ethereum` does not track the stipend separately. It simply adds the `CallStipend` (2300 gas) to the total gas forwarded to the callee if the call involves a value transfer (`value > 0`).

2.  **Implicit Security Against Recursive Value Calls**: The security mechanism that prevents the stipend from being used for further value-transferring calls is implicit in the gas rules.
    *   Any `CALL` that transfers value costs an additional `CallValueTransferGas` (9000 gas) on top of other costs.
    *   When a sub-call is made, the EVM checks if the *available gas* is sufficient to cover the operation's cost.
    *   If a contract only has the 2300 gas stipend left, it cannot afford the 9000 gas cost for another value-transferring `CALL`. This check naturally fails, preventing the misuse of the stipend without needing a special tracker.

3.  **Gas Calculation Flow**:
    a. The base cost of the `CALL` is calculated (including `CallValueTransferGas` if applicable).
    b. This base cost is subtracted from the caller's available gas.
    c. The 63/64 rule is applied to the remaining gas to determine the maximum gas that can be forwarded.
    d. The gas requested by the caller is capped by this maximum.
    e. **Finally**, the 2300 gas stipend is added to the capped, forwarded gas amount.

This approach is simpler to implement as it doesn't require modifying the gas consumption logic for every other opcode. The stipend becomes part of the callee's general gas pool, but the high cost of value transfers naturally restricts its use.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
package params

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

// Gas costs of things that are not specified as EVM opcodes.
const (
	// ... other constants ...
	
	// CallStipend is the gas stipend given to a callRecipient for the processing of a value transfer.
	CallStipend uint64 = 2300

	// ... other constants ...

	// Gas costs for expensive operations.
	CallNewAccountGas      uint64 = 25000 // Paid for CALL when the recipient does not exist.
	CallValueTransferGas   uint64 = 9000  // Paid for CALL when the transfer value is non-zero.

	// ... other constants ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
package vm

import (
	"github.com/ethereum/go-ethereum/params"
)

// callGas calculates the gas available for a call.
//
// This is the gas that gets passed to the callee. The cost of the call is
// deducted from the caller's gas and not included in this value.
func callGas(rules params.Rules, availableGas, requestedGas, stipend uint64) (uint64, error) {
	// EIP-150: calculated gas cannot be more than 63/64 of the remaining gas.
	if rules.IsEIP150 {
		availableGas = availableGas - availableGas/64
	}
	// If the requested gas is greater than the amount of gas available, then
	// the call uses all available gas.
	if requestedGas > availableGas {
		requestedGas = availableGas
	}
	gas := requestedGas + stipend
	// And cap it with the amount of gas available.
	if gas > availableGas {
		gas = availableGas
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
package vm

import (
	"errors"
	"math"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

// opCall is the general call operation.
func opCall(pc *uint64, i *Interpreter, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop 7 items from the stack.
	gas, dst, value, argsOffset, argsSize, retOffset, retSize := stack.pop7()
	toAddr := common.Address(dst.Bytes20())

	// ... (memory resize logic)

	// Gas calculation.
	var (
		gasCost    uint64
		stipend    uint64
		isTransfer = value.Sign() != 0
	)

	// ... (EIP-2929 cold/warm access cost logic) ...

	// Value transfer cost.
	if isTransfer {
		gasCost += params.CallValueTransferGas
		stipend = params.CallStipend
	}
	// Account creation cost.
	if i.chainRules.IsEIP158 {
		if !i.StateDB.Exist(toAddr) && isTransfer {
			gasCost += params.CallNewAccountGas
		}
	}
	// Consume the gas for the call.
	if err := contract.UseGas(gasCost); err != nil {
		return nil, err
	}

	// Set up the gas for the call.
	callGas, err := callGas(i.chainRules, contract.Gas, gas.Uint64(), stipend)
	if err != nil {
		return nil, err
	}
	// ... (memory management) ...

	// Execute the call.
	ret, returnGas, err := i.Call(contract, toAddr, value, callGas, memory.GetPtr(int64(argsOffset.Uint64()), int64(argsSize.Uint64())))
	if err != nil {
		return nil, err
	}
	// ... (handle return data and gas refund) ...
	return nil, nil
}

// opCallCode is the call code operation.
func opCallCode(pc *uint64, i *Interpreter, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... (similar setup to opCall) ...

	// Gas calculation.
	var (
		gasCost    uint64
		stipend    uint64
		isTransfer = value.Sign() != 0
	)
	// ... (access cost logic) ...
	if isTransfer {
		gasCost += params.CallValueTransferGas
		stipend = params.CallStipend
	}
	// ...
	if err := contract.UseGas(gasCost); err != nil {
		return nil, err
	}

	// Set up the gas for the call.
	callGas, err := callGas(i.chainRules, contract.Gas, gas.Uint64(), stipend)
	if err != nil {
		return nil, err
	}

	// Execute the call.
	ret, returnGas, err := i.CallCode(contract, toAddr, value, callGas, memory.GetPtr(int64(argsOffset.Uint64()), int64(argsSize.Uint64())))
	// ... (handle return data and gas refund) ...
	return nil, nil
}

// opDelegateCall is the DELEGATECALL operation.
// No value transfer is possible, so it does not get a stipend.
func opDelegateCall(pc *uint64, i *Interpreter, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... pop stack ...
	gas, dst, argsOffset, argsSize, retOffset, retSize := stack.pop6()
	// ...
	// Gas calculation.
	var gasCost uint64
	// ... (access cost logic) ...
	if err := contract.UseGas(gasCost); err != nil {
		return nil, err
	}
	// Set up the gas for the call. Note: no stipend for delegatecall
	callGas, err := callGas(i.chainRules, contract.Gas, gas.Uint64(), 0)
	if err != nil {
		return nil, err
	}
	// ...
	// Execute the call.
	ret, returnGas, err := i.DelegateCall(contract, toAddr, callGas, memory.GetPtr(int64(argsOffset.Uint64()), int64(argsSize.Uint64())))
	// ...
	return nil, nil
}

// opStaticCall is the STATICCALL operation.
// No value transfer is possible, so it does not get a stipend.
func opStaticCall(pc *uint64, i *Interpreter, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... pop stack ...
	gas, dst, argsOffset, argsSize, retOffset, retSize := stack.pop6()
	// ...
	// Gas calculation.
	var gasCost uint64
	// ... (access cost logic) ...
	if err := contract.UseGas(gasCost); err != nil {
		return nil, err
	}
	// Set up the gas for the call. Note: no stipend for staticcall
	callGas, err := callGas(i.chainRules, contract.Gas, gas.Uint64(), 0)
	if err != nil {
		return nil, err
	}
	// ...
	// Execute the call.
	ret, returnGas, err := i.StaticCall(contract, toAddr, callGas, memory.GetPtr(int64(argsOffset.Uint64()), int64(argsSize.Uint64())))
	// ...
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
package vm

// ... imports ...

// Interpreter is an EVM interpreter for use in EVM
type Interpreter struct {
	// ... fields ...
}

// ... other methods ...

// Call executes the contract associated with the destination address.
// It returns the returned data and the remaining gas.
func (in *Interpreter) Call(caller Contract, addr common.Address, data []byte, gas uint64, value *uint256.Int) (ret []byte, err error) {
	// ...

	// Ensure that the gas is not greater than the amount of gas running in the current context.
	if gas > caller.Gas() {
		gas = caller.Gas()
	}
	// Fail if we're trying to transfer value in a static call.
	if in.readOnly && value.Sign() > 0 {
		return nil, ErrWriteProtection
	}

	// ... (snapshot and state preparation logic) ...
	
	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, AccountRef(addr), value, gas, in.StateDB.GetCode(addr))
	contract.Input = data

	// ... (precompile logic) ...

	// If the contract has no code, refund the gas and return.
	if in.StateDB.GetCodeSize(addr) == 0 {
		caller.ReturnGas(contract.Gas)
		in.StateDB.RevertToSnapshot(snapshot)
		return nil, nil
	}
	ret, err = in.run(contract, nil)
	return ret, err
}

```
</file>
</go-ethereum>
<prompt_corrections>
### Prompt Correction: Gas Capping for Stipend

The provided Zig implementation for `calculate_call_gas` correctly adds the stipend for value transfers, but the calling `execute_call` function seems to use the returned `gas_forwarded` directly without a final cap against the caller's available gas.

The go-ethereum implementation reveals a critical final check. After the 63/64 rule is applied and the stipend is added, the final amount of gas passed to the callee (`gasForCall`) is capped by the caller's *current remaining gas*.

This "no gas out of thin air" rule is crucial. If the caller has only 1000 gas left, and a value-transferring call is made (which would get a 2300 gas stipend), the callee should only receive 1000 gas, not 1000 + 2300. The stipend cannot create gas; it only ensures that if the caller *has* enough gas, a minimum amount is forwarded.

The `callGas` function in `go-ethereum/core/vm/gas_table.go` implements this perfectly:

```go
// go-ethereum/core/vm/gas_table.go
func callGas(rules params.Rules, availableGas, requestedGas, stipend uint64) (uint64, error) {
    // EIP-150: calculated gas cannot be more than 63/64 of the remaining gas.
    if rules.IsEIP150 {
        availableGas = availableGas - availableGas/64
    }
    // If the requested gas is greater than the amount of gas available, then
    // the call uses all available gas.
    if requestedGas > availableGas {
        requestedGas = availableGas
    }
    gas := requestedGas + stipend
    // And cap it with the amount of gas available.
    if gas > availableGas {
        gas = availableGas
    }
    return gas, nil
}
```

The `opCall` implementation in `go-ethereum/core/vm/instructions.go` shows that `availableGas` is the caller's gas *after* deducting the base cost of the `CALL` itself.

**Recommendation:** Update the Zig `execute_call` implementation to perform this final capping check after calculating `gas_forwarded` to ensure correctness.

```zig
// In execute_call, after calling calculate_call_gas
var gas_to_forward = gas_calc.gas_forwarded;
if (gas_to_forward > frame.gas_remaining()) {
    gas_to_forward = frame.gas_remaining();
}

const call_context = CallContext{
    // ...
    .gas_limit = gas_to_forward,
};
```

This ensures the EVM implementation correctly handles the gas stipend without creating gas.

### Stipend Usage Limitation
The prompt requirement "Ensure stipend cannot enable recursive value calls" is implicitly handled by the EVM's gas mechanics, not a special check. A subsequent value-transfer `CALL` costs 9000 gas (`CallValueTransferGas`). The 2300 gas stipend is insufficient to cover this cost, naturally preventing such recursive calls if the contract only has stipend gas remaining. No special `StipendTracker` logic is needed to enforce this specific rule, as the existing gas consumption model already covers it.
</prompt_corrections>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas cost parameters for value-transferring CALL operations
const (
	CallValueTransferGas uint64 = 9000 // Paid for CALL when the value transfer is non-zero
	CallNewAccountGas    uint64 = 25000 // Paid for CALL when the destination address didn't exist prior
	CallStipend          uint64 = 2300  // Free gas given to account receiving value to execute basic logic
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// callGas returns the actual gas cost of the call.
//
// The cost of gas was changed during the Tangerine Whistle hardfork to account for the price of IO operations.
// The returned gas is not gas that is consumed by the operation, but the gas that is passed to the callee.
//
// EIP150:
//
// All but one 64th of the caller's gas is forwarded to the callee.
// This ensures that the caller has enough gas to execution after the call returns.
func callGas(gasTable GasTable, availableGas, base, callCost uint64) (uint64, error) {
	if availableGas < base {
		return 0, ErrOutOfGas
	}
	gas := availableGas - base
	// EIP150: call breaks trace in geth, so we can't get the gas used directly.
	// To get the gas used, we would have to add a special case for call to the EVM.
	// It's not worth it, so we're just going to assume that the call takes all gas.
	if gasTable.CreateBySuicide > 0 { // EIP150 applies this rule to all calls
		gas = gas - gas/64
	}

	// if specified gas is less than available gas, use specified gas
	if callCost < gas {
		gas = callCost
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the gas-charging, param-packing, value-transferring CALL instruction.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	var (
		gas,                   // gas
		addr,                  // address
		value,                 // value
		in,                    // in offset
		inSize,                // in size
		ret,                   // ret offset
		retSize common.Uint256 // ret size
	)
	stack.pop(&gas)
	stack.pop(&addr)
	stack.pop(&value)
	stack.pop(&in)
	stack.pop(&inSize)
	stack.pop(&ret)
	stack.pop(&retSize)

	// Memory expansion for both input and output data.
	// Both in and ret are base offsets and we must calculate the actual size
	// of the memory that is being read and written respectively.
	inOffset, inLen := in.Uint64(), inSize.Uint64()
	if err := memory.resize(inOffset, inLen); err != nil {
		return nil, err
	}
	retOffset, retLen := ret.Uint64(), retSize.Uint64()
	if err := memory.resize(retOffset, retLen); err != nil {
		return nil, err
	}
	data := memory.GetPtr(inOffset, inLen)

	// The call is to a pre-compiled contract
	if evm.isPrecompiled(common.Address(addr.Bytes20())) {
		// Calculate gas cost of pre-compiled contract
		cost, err := evm.precompileGas(common.Address(addr.Bytes20()), data)
		if err != nil {
			return nil, err
		}
		if !contract.UseGas(cost) {
			return nil, ErrOutOfGas
		}
		// Execute pre-compiled contract
		evm.callPrecompile(contract, common.Address(addr.Bytes20()), data, retOffset, retLen)
		stack.push(uint256.NewInt(1))
		return nil, nil
	}

	// Ensure the call has enough gas for the call stipend
	if value.Sign() != 0 {
		if contract.Gas < params.CallStipend {
			return nil, ErrInsufficientBalance
		}
		gas.Add(&gas, uint256.NewInt(params.CallStipend))
	}
	// The call is to a regular contract
	// TODO(MariusVanDerWijden) we can probably drop this now.
	stack.push(new(uint256.Int)) // Add a placeholder for the CALL's return value

	// Check the call depth, and also whether the call can be executed using
	// the remaining gas.
	if evm.depth > int(params.CallCreateDepth) {
		evm.interpreter.intPool.put(stack.pop())
		stack.push(uint256.NewInt(0)) // push 0 to stack
		return nil, nil
	}
	if value.Sign() != 0 && contract.value.Cmp(value.ToBig()) < 0 {
		evm.interpreter.intPool.put(stack.pop())
		stack.push(uint256.NewInt(0)) // push 0 to stack
		return nil, nil
	}

	// Get the address of the callee
	address := common.Address(addr.Bytes20())

	// Take snapshot of state.
	snapshot := evm.StateDB.Snapshot()

	// Transfer value from caller to callee. This may create a new account.
	created := !evm.StateDB.Exist(address)
	evm.Transfer(contract.self, address, value.ToBig())

	// Execute the call, grab the return value and leftover gas.
	retVal, returnGas, err := evm.Call(contract, address, data, gas.Uint64(), value.ToBig())
	if err != nil {
		// If the call failed revert the state and consume all the gas.
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas)
		}
	}
	// Verify that the return value is not greater than the given return size.
	// If it is, truncate it to the size specified.
	if retLen < uint64(len(retVal)) {
		retVal = retVal[:retLen]
	}

	// Push result to stack and copy return value to memory.
	evm.interpreter.intPool.put(stack.pop())
	stack.push(uint256.NewInt(uint64(btoi(err == nil))))
	memory.Set(retOffset, retLen, retVal)

	// Add the leftover gas to the contract's gas and also add the refunded gas
	// to the contracts gas.
	contract.Gas += returnGas

	return nil, nil
}

// opCallCode is the gas-charging, param-packing, value-transferring CALLCODE instruction.
func opCallCode(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	var (
		gas,
		addr,

		// value is ignored for callcode, but it's still a part of the instruction.
		// We're not getting rid of this unless it's a new instruction.
		value,
		in,
		inSize,
		ret,
		retSize common.Uint256
	)
	stack.pop(&gas)
	stack.pop(&addr)
	stack.pop(&value)
	stack.pop(&in)
	stack.pop(&inSize)
	stack.pop(&ret)
	stack.pop(&retSize)

	// Memory expansion for both input and output data.
	inOffset, inLen := in.Uint64(), inSize.Uint64()
	if err := memory.resize(inOffset, inLen); err != nil {
		return nil, err
	}
	retOffset, retLen := ret.Uint64(), retSize.Uint64()
	if err := memory.resize(retOffset, retLen); err != nil {
		return nil, err
	}
	data := memory.GetPtr(inOffset, inLen)

	// Ensure the call has enough gas for the call stipend
	if value.Sign() != 0 {
		if contract.Gas < params.CallStipend {
			return nil, ErrInsufficientBalance
		}
		gas.Add(&gas, uint256.NewInt(params.CallStipend))
	}

	// Get the address of the callee
	address := contract.Address()

	// The call is to a pre-compiled contract
	if evm.isPrecompiled(common.Address(addr.Bytes20())) {
		cost, err := evm.precompileGas(common.Address(addr.Bytes20()), data)
		if err != nil {
			return nil, err
		}
		if !contract.UseGas(cost) {
			return nil, ErrOutOfGas
		}
		evm.callPrecompile(contract, common.Address(addr.Bytes20()), data, retOffset, retLen)
		stack.push(uint256.NewInt(1))
		return nil, nil
	}
	// The call is to a regular contract
	stack.push(new(uint256.Int)) // Add a placeholder for the call's return value

	// Check the call depth, and also whether the call can be executed using
	// the remaining gas.
	if evm.depth > int(params.CallCreateDepth) {
		evm.interpreter.intPool.put(stack.pop())
		stack.push(uint256.NewInt(0)) // push 0 to stack
		return nil, nil
	}
	// Value is not transferred in callcode.

	// Take snapshot of state.
	snapshot := evm.StateDB.Snapshot()

	// Execute the call, grab the return value and leftover gas.
	retVal, returnGas, err := evm.CallCode(contract, address, data, gas.Uint64(), value.ToBig())
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas)
		}
	}

	// Verify that the return value is not greater than the given return size.
	if retLen < uint64(len(retVal)) {
		retVal = retVal[:retLen]
	}
	// Push result to stack and copy return value to memory.
	evm.interpreter.intPool.put(stack.pop())
	stack.push(uint256.NewInt(uint64(btoi(err == nil))))
	memory.Set(retOffset, retLen, retVal)

	// Add the leftover gas to the contract's gas and also add the refunded gas
	// to the contracts gas.
	contract.Gas += returnGas

	return nil, nil
}

// opDelegateCall is the gas-charging, param-packing, value-transferring DELEGATECALL instruction.
func opDelegateCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, argument offset, argument length, return offset, return length
	var (
		gas,
		addr,
		in,
		inSize,
		ret,
		retSize common.Uint256
	)
	stack.pop(&gas)
	stack.pop(&addr)
	stack.pop(&in)
	stack.pop(&inSize)
	stack.pop(&ret)
	stack.pop(&retSize)

	// Memory expansion for both input and output data.
	inOffset, inLen := in.Uint64(), inSize.Uint64()
	if err := memory.resize(inOffset, inLen); err != nil {
		return nil, err
	}
	retOffset, retLen := ret.Uint64(), retSize.Uint64()
	if err := memory.resize(retOffset, retLen); err != nil {
		return nil, err
	}
	data := memory.GetPtr(inOffset, inLen)

	// Get the address of the callee
	address := common.Address(addr.Bytes20())

	// The call is to a pre-compiled contract
	if evm.isPrecompiled(address) {
		cost, err := evm.precompileGas(address, data)
		if err != nil {
			return nil, err
		}
		if !contract.UseGas(cost) {
			return nil, ErrOutOfGas
		}
		evm.callPrecompile(contract, address, data, retOffset, retLen)
		stack.push(uint256.NewInt(1))
		return nil, nil
	}

	// The call is to a regular contract
	stack.push(new(uint256.Int)) // Add a placeholder for the call's return value

	// Check the call depth, and also whether the call can be executed using
	// the remaining gas.
	if evm.depth > int(params.CallCreateDepth) {
		evm.interpreter.intPool.put(stack.pop())
		stack.push(uint256.NewInt(0)) // push 0 to stack
		return nil, nil
	}

	// Take snapshot of state.
	snapshot := evm.StateDB.Snapshot()

	// Execute the call, grab the return value and leftover gas.
	// The deposited value is not transferred in delegatecall. The value of the
	// call is that of the caller.
	retVal, returnGas, err := evm.DelegateCall(contract, address, data, gas.Uint64())
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas)
		}
	}
	// Verify that the return value is not greater than the given return size.
	if retLen < uint64(len(retVal)) {
		retVal = retVal[:retLen]
	}
	// Push result to stack and copy return value to memory.
	evm.interpreter.intPool.put(stack.pop())
	stack.push(uint256.NewInt(uint64(btoi(err == nil))))
	memory.Set(retOffset, retLen, retVal)

	// Add the leftover gas to the contract's gas and also add the refunded gas
	// to the contracts gas.
	contract.Gas += returnGas

	return nil, nil
}

// opStaticCall is the gas-charging, param-packing, value-transferring STATICCALL instruction.
func opStaticCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, argument offset, argument length, return offset, return length
	var (
		gas,
		addr,
		in,
		inSize,
		ret,
		retSize common.Uint256
	)
	stack.pop(&gas)
	stack.pop(&addr)
	stack.pop(&in)
	stack.pop(&inSize)
	stack.pop(&ret)
	stack.pop(&retSize)

	// Memory expansion for both input and output data.
	inOffset, inLen := in.Uint64(), inSize.Uint64()
	if err := memory.resize(inOffset, inLen); err != nil {
		return nil, err
	}
	retOffset, retLen := ret.Uint64(), retSize.Uint64()
	if err := memory.resize(retOffset, retLen); err != nil {
		return nil, err
	}
	data := memory.GetPtr(inOffset, inLen)

	// Get the address of the callee
	address := common.Address(addr.Bytes20())

	// The call is to a pre-compiled contract
	if evm.isPrecompiled(address) {
		cost, err := evm.precompileGas(address, data)
		if err != nil {
			return nil, err
		}
		if !contract.UseGas(cost) {
			return nil, ErrOutOfGas
		}
		evm.callPrecompile(contract, address, data, retOffset, retLen)
		stack.push(uint256.NewInt(1))
		return nil, nil
	}

	// The call is to a regular contract
	stack.push(new(uint256.Int)) // Add a placeholder for the call's return value

	// Check the call depth, and also whether the call can be executed using
	// the remaining gas.
	if evm.depth > int(params.CallCreateDepth) {
		evm.interpreter.intPool.put(stack.pop())
		stack.push(uint256.NewInt(0)) // push 0 to stack
		return nil, nil
	}

	// Take snapshot of state.
	snapshot := evm.StateDB.Snapshot()

	// Execute the call, grab the return value and leftover gas.
	// The deposited value is not transferred in staticcall.
	retVal, returnGas, err := evm.StaticCall(contract, address, data, gas.Uint64())
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas)
		}
	}
	// Verify that the return value is not greater than the given return size.
	if retLen < uint64(len(retVal)) {
		retVal = retVal[:retLen]
	}

	// Push result to stack and copy return value to memory.
	evm.interpreter.intPool.put(stack.pop())
	stack.push(uint256.NewInt(uint64(btoi(err == nil))))
	memory.Set(retOffset, retLen, retVal)

	// Add the leftover gas to the contract's gas and also add the refunded gas
	// to the contracts gas.
	contract.Gas += returnGas

	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles the necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.chainRules.IsEIP158 {
		// After EIP-158, the transaction execution will not be aborted if the
		// an account does not exist. Instead, it will be treated as an empty
		// account.
		// So we can safely ignore the returned error.
		//
		// Note that the isPrecompiled check is handled in opCall/opCallCode/opDelegateCall.
		// We can do it here too, but it would be a duplication.
		evm.StateDB.CreateAccount(addr)
	}

	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// Value transfer.
	// This takes care of creating the account if it doesn't exist.
	// But it won't be created if the value is zero.
	// It's kind of a weird corner case.
	// E.g. `call(0x1, 0, 0, 0, 0, 0, 0)` will not create an account at 0x1.
	err = evm.Transfer(caller, addr, value)
	if err != nil {
		return nil, gas, err
	}
	// Interpret the call. It may be a precompile, or a regular contract.
	p, isPrecompile := evm.precompile(addr)
	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Initialise a new contract and set the code that is to be used by the
		// EVM. The contract is a scoped environment for this execution context
		// only.
		code := evm.StateDB.GetCode(addr)
		if len(code) == 0 {
			ret, err = nil, nil // return nil if contract does not exist
		} else {
			// Even if the account has no code, we have to continue because it might be a
			// precompile. The isPrecompile check is performed above.
			contract := NewContract(caller, AccountRef(addr), value, gas)
			contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), code)

			// We need to create a new EVM, which is the same as the current one, but
			// with a new readOnly setting. This is because the readOnly setting is not
			// part of the contract's scope, but of the EVM.
			// The readOnly setting is not inherited by the caller, so we have to
			// create a new EVM with the same configuration, but with a new readOnly
			// setting.
			//
			// This is not ideal, but it's the only way to do it without changing the
			// EVM struct to be a pointer.
			newEvm := NewEVM(evm.BlockContext, evm.TxContext, evm.StateDB, evm.chainConfig, *evm.Config)
			newEvm.depth = evm.depth + 1
			newEvm.readOnly = evm.readOnly

			ret, err = newEvm.interpreter.Run(contract, input, false)
			gas = contract.Gas
		}
	}
	return ret, gas, err
}

// CallCode executes the contract associated with the addr with the given input
// as parameters. It also handles the necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
//
// CallCode differs from Call in the sense that it executes the given address'
// code with the caller as context.
func (evm *EVM) CallCode(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// Call depth check
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Value transfer is not supported in callcode.
	if evm.readOnly {
		// Ensure that the value being sent is zero
		if value.Sign() > 0 {
			return nil, gas, ErrWriteProtection
		}
	}
	// For callcode, we need to create a new contract object with the same
	// address and value, but with the code of the callee.
	contract := NewContract(caller, caller, value, gas)
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))

	ret, err = evm.interpreter.Run(contract, input, false)
	return ret, contract.Gas, err
}

// DelegateCall executes the contract associated with the addr with the given input
// as parameters. It reverses the state in case of an execution error.
//
// DelegateCall differs from CallCode in the sense that it executes the given address'
// code with the caller as context and the original sender and original value
// are forwarded as part of the call.
func (evm *EVM) DelegateCall(caller ContractRef, addr common.Address, input []byte, gas uint64) (ret []byte, leftOverGas uint64, err error) {
	// Call depth check
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// For delegatecall, we need to create a new contract object with the same
	// address and value, but with the code of the callee.
	// The value passed to the delegated code is that of the caller.
	contract := NewContract(caller, caller, nil, gas).AsDelegate()
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))

	ret, err = evm.interpreter.Run(contract, input, false)
	return ret, contract.Gas, err
}
```
</file>

## Prompt Corrections
The prompt proposes a `StipendTracker` to manage regular gas vs. stipend gas separately. This is a valid implementation strategy. However, it's worth noting that `go-ethereum` achieves the same outcome without explicit stipend tracking.

In `go-ethereum`:
1.  The 2300 gas stipend is simply added to the total gas forwarded to the callee if `value > 0`.
2.  The callee receives a single pool of gas; it doesn't distinguish between "regular" gas and "stipend" gas.
3.  The restriction on using the stipend for further value-transferring calls is enforced *implicitly* by the gas schedule. A `CALL` that transfers value costs a minimum of `9000` gas (`CallValueTransferGas`). Since the stipend is only `2300`, a callee that *only* has the stipend gas will not have enough gas to pay the base cost of another value-transferring call. The `contract.UseGas(cost)` check would fail.

This implicit mechanism avoids the complexity of tracking separate gas pools within a frame, which could be a simpler and more efficient implementation path.


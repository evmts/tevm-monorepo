const std = @import("std");
const testing = std.testing;
const call_gas_calculator = @import("../../../src/evm/gas/call_gas_calculator.zig");
const gas_constants = @import("../../../src/evm/constants/gas_constants.zig");
const StipendTracker = call_gas_calculator.StipendTracker;
const CallGasCalculation = call_gas_calculator.CallGasCalculation;

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
    const expected_base = gas_constants.CALL_BASE_COST + gas_constants.CALL_VALUE_TRANSFER_COST; // 100 + 9000
    try testing.expectEqual(expected_base, gas_calc.base_cost);
    
    // Should include stipend
    try testing.expectEqual(gas_constants.GAS_STIPEND_VALUE_TRANSFER, gas_calc.gas_stipend);
    try testing.expect(gas_calc.has_stipend());
    
    // Should forward available gas minus retention plus stipend
    const available_for_call = 10000 - expected_base; // 900
    const retained = available_for_call / gas_constants.CALL_GAS_RETENTION_DIVISOR; // 900/64 = 14
    const expected_forward = (available_for_call - retained) + gas_constants.GAS_STIPEND_VALUE_TRANSFER; // 886 + 2300
    try testing.expectEqual(expected_forward, gas_calc.gas_forwarded);
    
    // Validate calculation
    try testing.expect(call_gas_calculator.validate_calculation(&gas_calc));
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
    try testing.expectEqual(gas_constants.CALL_BASE_COST, gas_calc.base_cost);
    
    // Should not include stipend
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_stipend);
    try testing.expect(!gas_calc.has_stipend());
    
    // Should forward requested gas (capped by 63/64 rule)
    const available_for_call = 10000 - gas_constants.CALL_BASE_COST; // 9900
    const retained = available_for_call / gas_constants.CALL_GAS_RETENTION_DIVISOR; // 9900/64 = 154
    const max_forwardable = available_for_call - retained; // 9746
    const expected_forward = @min(5000, max_forwardable); // 5000
    try testing.expectEqual(expected_forward, gas_calc.gas_forwarded);
    
    // Validate calculation
    try testing.expect(call_gas_calculator.validate_calculation(&gas_calc));
}

test "call gas calculation cold account with value" {
    // Test cold account access cost
    const gas_calc = call_gas_calculator.calculate_call_gas(
        30000,  // available gas
        0,      // gas parameter
        true,   // transfers value
        true,   // cold account
        true    // creates new account
    );
    
    // Should include cold access + value transfer + new account costs
    const expected_base = gas_constants.CALL_COLD_ACCOUNT_COST + 
                         gas_constants.CALL_VALUE_TRANSFER_COST + 
                         gas_constants.CALL_NEW_ACCOUNT_COST; // 2600 + 9000 + 25000
    try testing.expectEqual(expected_base, gas_calc.base_cost);
    
    // Should still include stipend
    try testing.expectEqual(gas_constants.GAS_STIPEND_VALUE_TRANSFER, gas_calc.gas_stipend);
    try testing.expect(gas_calc.has_stipend());
    
    // Validate calculation
    try testing.expect(call_gas_calculator.validate_calculation(&gas_calc));
}

test "call gas calculation insufficient gas" {
    // Test when available gas is less than base cost
    const gas_calc = call_gas_calculator.calculate_call_gas(
        1000,   // available gas (insufficient)
        0,      // gas parameter
        true,   // transfers value
        false,  // warm account
        false   // doesn't create account
    );
    
    // Should set base cost but no gas forwarded
    const expected_base = gas_constants.CALL_BASE_COST + gas_constants.CALL_VALUE_TRANSFER_COST; // 100 + 9000
    try testing.expectEqual(expected_base, gas_calc.base_cost);
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_forwarded);
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_stipend);
    try testing.expect(!gas_calc.has_stipend());
    
    // Validate calculation
    try testing.expect(call_gas_calculator.validate_calculation(&gas_calc));
}

test "stipend tracker initialization" {
    // Test initialization without stipend
    {
        var tracker = StipendTracker.init(5000, false);
        try testing.expectEqual(@as(u64, 5000), tracker.total_remaining());
        try testing.expectEqual(@as(u64, 5000), tracker.regular_gas_remaining);
        try testing.expectEqual(@as(u64, 0), tracker.stipend_gas_remaining);
        try testing.expect(!tracker.in_stipend_context);
        try testing.expect(!tracker.is_using_stipend_only());
    }
    
    // Test initialization with stipend
    {
        var tracker = StipendTracker.init(5000, true);
        try testing.expectEqual(@as(u64, 5000), tracker.total_remaining()); // 2700 regular + 2300 stipend
        try testing.expectEqual(@as(u64, 2700), tracker.regular_gas_remaining); // 5000 - 2300
        try testing.expectEqual(@as(u64, 2300), tracker.stipend_gas_remaining);
        try testing.expect(tracker.in_stipend_context);
        try testing.expect(!tracker.is_using_stipend_only()); // Still has regular gas
    }
    
    // Test initialization with insufficient gas for stipend
    {
        var tracker = StipendTracker.init(1000, true);
        try testing.expectEqual(@as(u64, 2300), tracker.total_remaining()); // 0 regular + 2300 stipend
        try testing.expectEqual(@as(u64, 0), tracker.regular_gas_remaining);
        try testing.expectEqual(@as(u64, 2300), tracker.stipend_gas_remaining);
        try testing.expect(tracker.in_stipend_context);
        try testing.expect(tracker.is_using_stipend_only());
    }
}

test "stipend tracker gas consumption" {
    var tracker = StipendTracker.init(5000, true); // 2700 regular + 2300 stipend
    
    // Should have total gas
    try testing.expectEqual(@as(u64, 5000), tracker.total_remaining());
    
    // Consume from regular gas first
    try testing.expect(tracker.consume_gas(2000));
    try testing.expectEqual(@as(u64, 700), tracker.regular_gas_remaining);
    try testing.expectEqual(@as(u64, 2300), tracker.stipend_gas_remaining);
    try testing.expectEqual(@as(u64, 3000), tracker.total_remaining());
    
    // Consume remaining regular gas + some stipend
    try testing.expect(tracker.consume_gas(1200)); // 700 regular + 500 stipend
    try testing.expectEqual(@as(u64, 0), tracker.regular_gas_remaining);
    try testing.expectEqual(@as(u64, 1800), tracker.stipend_gas_remaining); // 2300 - 500
    try testing.expectEqual(@as(u64, 1800), tracker.total_remaining());
    
    // Should now be in stipend-only context
    try testing.expect(tracker.is_using_stipend_only());
    
    // Should not be able to make value calls with only stipend
    try testing.expect(!tracker.can_make_value_call(1000));
    try testing.expect(!tracker.can_make_value_call(1));
    
    // Should be able to consume remaining stipend
    try testing.expect(tracker.consume_gas(1800));
    try testing.expectEqual(@as(u64, 0), tracker.total_remaining());
    
    // Should fail to consume more gas
    try testing.expect(!tracker.consume_gas(1));
}

test "stipend tracker value call validation" {
    var tracker = StipendTracker.init(5000, true);
    
    // Should be able to make value calls with regular gas
    try testing.expect(tracker.can_make_value_call(2000));
    try testing.expect(tracker.can_make_value_call(2700)); // All regular gas
    try testing.expect(!tracker.can_make_value_call(2701)); // More than regular gas
    
    // Consume all regular gas
    try testing.expect(tracker.consume_gas(2700));
    
    // Should not be able to make value calls with only stipend
    try testing.expect(!tracker.can_make_value_call(1));
    try testing.expect(!tracker.can_make_value_call(2300));
    try testing.expect(tracker.is_using_stipend_only());
}

test "stipend tracker gas refunds" {
    var tracker = StipendTracker.init(5000, true);
    
    // Consume some gas
    try testing.expect(tracker.consume_gas(3000)); // 2700 regular + 300 stipend
    try testing.expectEqual(@as(u64, 0), tracker.regular_gas_remaining);
    try testing.expectEqual(@as(u64, 2000), tracker.stipend_gas_remaining); // 2300 - 300
    
    // Check refundable gas (should be 0 since no regular gas left)
    try testing.expectEqual(@as(u64, 0), tracker.get_refundable_gas());
    
    // Add refunded gas
    tracker.add_refunded_gas(1500);
    try testing.expectEqual(@as(u64, 1500), tracker.regular_gas_remaining);
    try testing.expectEqual(@as(u64, 1500), tracker.get_refundable_gas());
    try testing.expectEqual(@as(u64, 3500), tracker.total_remaining()); // 1500 + 2000
    
    // Should now be able to make value calls again
    try testing.expect(tracker.can_make_value_call(1000));
    try testing.expect(!tracker.is_using_stipend_only());
}

test "fast base cost calculation" {
    // Test all combinations
    const warm_no_value = call_gas_calculator.get_base_cost_fast(false, false);
    const cold_no_value = call_gas_calculator.get_base_cost_fast(false, true);
    const warm_with_value = call_gas_calculator.get_base_cost_fast(true, false);
    const cold_with_value = call_gas_calculator.get_base_cost_fast(true, true);
    
    try testing.expectEqual(gas_constants.CALL_BASE_COST, warm_no_value);
    try testing.expectEqual(gas_constants.CALL_COLD_ACCOUNT_COST, cold_no_value);
    try testing.expectEqual(gas_constants.CALL_BASE_COST + gas_constants.CALL_VALUE_TRANSFER_COST, warm_with_value);
    try testing.expectEqual(gas_constants.CALL_COLD_ACCOUNT_COST + gas_constants.CALL_VALUE_TRANSFER_COST, cold_with_value);
}

test "call gas calculation edge cases" {
    // Test with exact gas for base cost
    {
        const base_cost = gas_constants.CALL_BASE_COST + gas_constants.CALL_VALUE_TRANSFER_COST; // 9100
        const gas_calc = call_gas_calculator.calculate_call_gas(
            base_cost,  // exact gas for base cost
            0,          // gas parameter
            true,       // transfers value
            false,      // warm account
            false       // doesn't create account
        );
        
        try testing.expectEqual(base_cost, gas_calc.base_cost);
        try testing.expectEqual(@as(u64, 0), gas_calc.gas_forwarded); // No gas left to forward
        try testing.expectEqual(@as(u64, 0), gas_calc.gas_stipend); // No stipend if no gas to forward
    }
    
    // Test with just enough gas for stipend
    {
        const base_cost = gas_constants.CALL_BASE_COST + gas_constants.CALL_VALUE_TRANSFER_COST; // 9100
        const available_gas = base_cost + 1; // 9101
        const gas_calc = call_gas_calculator.calculate_call_gas(
            available_gas,
            0,
            true,   // transfers value
            false,  // warm account
            false   // doesn't create account
        );
        
        try testing.expectEqual(base_cost, gas_calc.base_cost);
        try testing.expectEqual(gas_constants.GAS_STIPEND_VALUE_TRANSFER, gas_calc.gas_forwarded); // Only stipend
        try testing.expectEqual(gas_constants.GAS_STIPEND_VALUE_TRANSFER, gas_calc.gas_stipend);
    }
}

test "63/64 gas retention rule" {
    // Test with large gas amounts to verify 63/64 rule
    const gas_calc = call_gas_calculator.calculate_call_gas(
        100000, // large amount
        0,      // forward all
        false,  // no value transfer
        false,  // warm account
        false   // no new account
    );
    
    const available_for_call = 100000 - gas_constants.CALL_BASE_COST; // 99900
    const retained = available_for_call / 64; // 1560.9375 = 1560 (integer division)
    const expected_forward = available_for_call - retained; // 98340
    
    try testing.expectEqual(expected_forward, gas_calc.gas_forwarded);
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_stipend); // No value transfer
    
    // Test that gas parameter is respected when less than max
    const gas_calc2 = call_gas_calculator.calculate_call_gas(
        100000,
        50000,  // request 50000 gas
        false,
        false,
        false
    );
    
    try testing.expectEqual(@as(u64, 50000), gas_calc2.gas_forwarded); // Should get requested amount
}

test "call gas calculation validation" {
    // Valid calculations should pass validation
    {
        const calc = CallGasCalculation{
            .base_cost = 100,
            .gas_forwarded = 5000,
            .gas_stipend = 0,
        };
        try testing.expect(call_gas_calculator.validate_calculation(&calc));
    }
    
    {
        const calc = CallGasCalculation{
            .base_cost = 9100,
            .gas_forwarded = 7300, // 5000 + 2300 stipend
            .gas_stipend = 2300,
        };
        try testing.expect(call_gas_calculator.validate_calculation(&calc));
    }
    
    // Invalid calculations should fail validation
    {
        // Gas forwarded less than stipend
        const calc = CallGasCalculation{
            .base_cost = 100,
            .gas_forwarded = 1000,
            .gas_stipend = 2300,
        };
        try testing.expect(!call_gas_calculator.validate_calculation(&calc));
    }
    
    {
        // Invalid stipend amount
        const calc = CallGasCalculation{
            .base_cost = 100,
            .gas_forwarded = 1500,
            .gas_stipend = 1500, // Not 0 or 2300
        };
        try testing.expect(!call_gas_calculator.validate_calculation(&calc));
    }
}

test "stipend tracker edge cases" {
    // Test tracker with zero initial gas
    {
        var tracker = StipendTracker.init(0, false);
        try testing.expectEqual(@as(u64, 0), tracker.total_remaining());
        try testing.expect(!tracker.consume_gas(1));
    }
    
    // Test tracker with zero gas but stipend
    {
        var tracker = StipendTracker.init(0, true);
        try testing.expectEqual(@as(u64, 2300), tracker.total_remaining()); // Only stipend
        try testing.expect(tracker.is_using_stipend_only());
        try testing.expect(!tracker.can_make_value_call(1));
    }
    
    // Test setting regular gas directly
    {
        var tracker = StipendTracker.init(1000, true);
        tracker.set_regular_gas(5000);
        try testing.expectEqual(@as(u64, 5000), tracker.regular_gas_remaining);
        try testing.expectEqual(@as(u64, 7300), tracker.total_remaining()); // 5000 + 2300
    }
}
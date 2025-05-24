# FeeMarket.zig - EIP-1559 Fee Market Implementation

This document describes the Tevm EIP-1559 fee market implementation in `FeeMarket.zig` and compares it with other major EVM implementations.

## Overview

The FeeMarket module implements Ethereum's EIP-1559 transaction fee mechanism, which introduced:
- Dynamic base fee adjustment based on network congestion
- Predictable fee changes (±12.5% maximum per block)
- Base fee burning to reduce ETH supply
- Priority fees (tips) for miner incentives

## Implementation Details

### Core Structure

```zig
pub const FeeMarket = struct {
    // All functions are static - no instance state needed
}
```

### Constants

```zig
pub const MIN_BASE_FEE: u64 = 7;                      // Minimum base fee (wei)
pub const BASE_FEE_CHANGE_DENOMINATOR: u64 = 8;       // Limits change to ±12.5%
```

### Core Functions

#### Base Fee Calculation

```zig
pub fn nextBaseFee(parent_gas_used: u64, parent_gas_limit: u64, parent_base_fee: u64) u64
```

Calculates the base fee for the next block based on parent block's gas usage:

**Algorithm**:
1. If parent used more than target (50% of limit): increase base fee
2. If parent used less than target: decrease base fee  
3. If parent used exactly target: no change
4. Empty blocks: no change (special case)
5. Maximum change: ±12.5% per block

**Formula**:
```
If gas_used > gas_target:
    delta = base_fee * (gas_used - gas_target) / gas_target / denominator
    next_base_fee = base_fee + delta

If gas_used < gas_target:
    delta = base_fee * (gas_target - gas_used) / gas_target / denominator
    next_base_fee = base_fee - delta
```

#### Initial Base Fee

```zig
pub fn initialBaseFee(parent_gas_used: u64, parent_gas_limit: u64) u64
```

Calculates the first base fee when EIP-1559 activates:
- Starts with 1 gwei baseline
- Adjusts based on parent block congestion
- Ensures smooth transition to new fee model

#### Effective Gas Price

```zig
pub fn getEffectiveGasPrice(
    base_fee: u64,
    max_fee_per_gas: u64,
    max_priority_fee_per_gas: u64
) struct { effective_price: u64, miner_tip: u64 }
```

Calculates actual transaction costs:
- **Effective Price**: `min(max_fee_per_gas, base_fee + max_priority_fee_per_gas)`
- **Miner Tip**: `effective_price - base_fee`
- Handles edge cases where max_fee < base_fee

#### Gas Target

```zig
pub fn getGasTarget(gas_limit: u64) u64
```

Returns the target gas usage (50% of limit) - the equilibrium point for stable fees.

### Helper Functions

#### Fee Delta Calculation

```zig
fn calculateFeeDelta(base_fee: u64, gas_delta: u64, parent_gas_target: u64) u64
```

Safe calculation of fee adjustments:
- Uses u128 for overflow protection
- Ensures minimum delta of 1
- Prevents division by zero

## EIP-1559 Mechanics

### Fee Components

1. **Base Fee**:
   - Algorithmically determined
   - Burned (removed from circulation)
   - Predictable changes

2. **Priority Fee (Tip)**:
   - Set by transaction sender
   - Paid to block producer
   - Incentivizes inclusion

3. **Max Fee**:
   - Maximum user is willing to pay
   - Provides cost certainty
   - Refunded if not used

### Adjustment Algorithm

```
Block Utilization → Base Fee Change
0%                → -12.5%
< 50%             → Decrease proportionally
50%               → No change
> 50%             → Increase proportionally
100%              → +12.5%
```

## Comparison with Other Implementations

### Implementation Approaches

| Implementation | Structure | Overflow Protection | Special Cases | Testing |
|----------------|-----------|-------------------|---------------|---------|
| Tevm (Zig) | Static functions | u128 math | Empty blocks | Comprehensive |
| go-ethereum | Method on type | big.Int | Multiple | Extensive |
| revm (Rust) | Free functions | Checked ops | Standard | Good |
| evmone | Inline | Manual checks | Minimal | Basic |

### Key Differences

#### 1. Mathematical Safety

**Tevm**:
```zig
// Uses u128 for intermediate calculations
const numerator = @as(u128, base_fee) * @as(u128, gas_delta);
const denominator = @as(u128, parent_gas_target) * BASE_FEE_CHANGE_DENOMINATOR;
```

**go-ethereum**:
- Uses big.Int throughout
- No overflow possible
- Higher overhead

**revm**:
- Checked arithmetic
- Saturating operations
- Rust safety

**evmone**:
- Manual overflow checks
- Optimized for speed
- Less safety

#### 2. Edge Case Handling

**Tevm**:
- Empty blocks: no change
- Zero gas target: MIN_BASE_FEE
- Minimum delta: 1
- Comprehensive guards

**Others**:
- Varying approaches
- Different edge cases
- Less explicit handling

#### 3. API Design

**Tevm**:
```zig
// Returns structured data
pub fn getEffectiveGasPrice(...) struct { 
    effective_price: u64, 
    miner_tip: u64 
}
```

**go-ethereum**:
- Multiple return values
- Method chaining
- More complex API

## Usage Examples

### Calculate Next Block's Base Fee
```zig
const parent_gas_used = 15_000_000;
const parent_gas_limit = 30_000_000;
const parent_base_fee = 50_000_000_000; // 50 gwei

const next_base_fee = FeeMarket.nextBaseFee(
    parent_gas_used,
    parent_gas_limit,
    parent_base_fee
);
// Result: 50 gwei (no change - exactly at target)
```

### Calculate Transaction Costs
```zig
const base_fee = 50_000_000_000; // 50 gwei
const max_fee = 100_000_000_000; // 100 gwei
const max_priority = 2_000_000_000; // 2 gwei

const result = FeeMarket.getEffectiveGasPrice(base_fee, max_fee, max_priority);
// result.effective_price = 52 gwei
// result.miner_tip = 2 gwei
```

### Initial EIP-1559 Activation
```zig
// Pre-1559 block at 90% capacity
const initial = FeeMarket.initialBaseFee(27_000_000, 30_000_000);
// Starts above 1 gwei due to high usage
```

## Integration with EVM

### Block Processing
```zig
// After processing a block
const next_base_fee = FeeMarket.nextBaseFee(
    block.gas_used,
    block.gas_limit,
    block.base_fee
);
// Store for next block
```

### Transaction Validation
```zig
// Check if transaction can pay base fee
if (tx.max_fee_per_gas < current_base_fee) {
    return error.FeeTooLow;
}
```

### Fee Calculation
```zig
// Calculate actual transaction cost
const fees = FeeMarket.getEffectiveGasPrice(
    block.base_fee,
    tx.max_fee_per_gas,
    tx.max_priority_fee_per_gas
);
const total_cost = fees.effective_price * gas_used;
const miner_payment = fees.miner_tip * gas_used;
const burned_amount = (fees.effective_price - fees.miner_tip) * gas_used;
```

## Best Practices

1. **Always Check Edge Cases**:
   ```zig
   // Handle empty blocks
   if (parent_gas_used == 0) {
       return parent_base_fee;
   }
   ```

2. **Use Safe Math**:
   ```zig
   // Prevent overflow with u128
   const safe_product = @as(u128, a) * @as(u128, b);
   ```

3. **Validate Inputs**:
   ```zig
   if (gas_limit == 0) return MIN_BASE_FEE;
   ```

## Testing Coverage

The implementation includes comprehensive tests for:
- Normal fee adjustments (increase/decrease)
- Edge cases (empty blocks, zero limits)
- Overflow conditions
- Boundary values
- Initial base fee calculation
- Effective gas price scenarios

## Performance Considerations

1. **No Heap Allocation**: All calculations use stack
2. **Efficient Math**: u128 only when needed
3. **Branch Prediction**: Common cases first
4. **Inline Candidates**: Small functions can be inlined

## Future Enhancements

1. **Alternative Algorithms**:
   - Exponential adjustment
   - PID controller approach
   - Multi-block smoothing

2. **Analytics**:
   - Fee prediction
   - Congestion metrics
   - Historical analysis

3. **Optimizations**:
   - SIMD for batch processing
   - Lookup tables for common values
   - Caching recent calculations

## Security Considerations

1. **Overflow Protection**: All arithmetic checked
2. **Minimum Base Fee**: Prevents going to zero
3. **Maximum Change Rate**: Limits manipulation
4. **No External Dependencies**: Self-contained logic

## Conclusion

The Tevm FeeMarket implementation provides a clean, safe, and efficient implementation of EIP-1559's fee mechanism. The code prioritizes correctness and clarity while maintaining good performance. The comprehensive test coverage and edge case handling make it suitable for production use.
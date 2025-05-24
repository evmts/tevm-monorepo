# FeeMarket Implementation Issue

## Overview

FeeMarket.zig implements the EIP-1559 fee market mechanism for dynamic gas pricing, including base fee calculation, adjustment algorithms, and support for EIP-4844 blob fees with proper overflow protection.

## Requirements

- Calculate initial base fee for EIP-1559 transition
- Implement base fee adjustment algorithm
- Support elasticity multiplier for block size variance
- Handle EIP-4844 blob base fee calculations
- Ensure minimum base fee enforcement
- Prevent integer overflow in calculations
- Support different network configurations
- Provide gas price estimation helpers
- Handle priority fee calculations
- Support legacy gas price compatibility

## Interface

```zig
const std = @import("std");

pub const FeeMarketError = error{
    Overflow,
    InvalidParameters,
    BaseFeeOverflow,
};

/// EIP-1559 Fee Market constants
pub const FeeMarketConstants = struct {
    /// Minimum base fee per gas (in wei)
    pub const MIN_BASE_FEE: u64 = 7;
    
    /// Base fee change denominator (max 12.5% change per block)
    pub const BASE_FEE_CHANGE_DENOMINATOR: u64 = 8;
    
    /// Elasticity multiplier for gas limit
    pub const ELASTICITY_MULTIPLIER: u64 = 2;
    
    /// Target gas per block (gas_limit / ELASTICITY_MULTIPLIER)
    pub const TARGET_GAS_DIVISOR: u64 = ELASTICITY_MULTIPLIER;
    
    /// EIP-4844 constants
    pub const MIN_BLOB_BASE_FEE: u64 = 1;
    pub const BLOB_BASE_FEE_UPDATE_FRACTION: u64 = 3338477;
    pub const TARGET_BLOB_GAS_PER_BLOCK: u64 = 393216; // 3 * 131072
    pub const MAX_BLOB_GAS_PER_BLOCK: u64 = 786432; // 6 * 131072
};

pub const FeeMarket = struct {
    /// Current base fee per gas
    base_fee: u64,
    /// Current blob base fee (EIP-4844)
    blob_base_fee: u64,
    /// Block gas limit
    gas_limit: u64,
    /// Elasticity multiplier
    elasticity: u64,

    // Initialization

    /// Create fee market for genesis block
    pub fn initGenesis(gas_limit: u64) FeeMarket {
        return .{
            .base_fee = FeeMarketConstants.MIN_BASE_FEE,
            .blob_base_fee = FeeMarketConstants.MIN_BLOB_BASE_FEE,
            .gas_limit = gas_limit,
            .elasticity = FeeMarketConstants.ELASTICITY_MULTIPLIER,
        };
    }

    /// Initialize base fee for first EIP-1559 block
    pub fn initEIP1559(
        parent_gas_used: u64,
        parent_gas_limit: u64,
        parent_base_fee: u64,
    ) FeeMarket {
        const initial_base_fee = calculateInitialBaseFee(
            parent_gas_used,
            parent_gas_limit,
            parent_base_fee,
        );
        
        return .{
            .base_fee = initial_base_fee,
            .blob_base_fee = FeeMarketConstants.MIN_BLOB_BASE_FEE,
            .gas_limit = parent_gas_limit,
            .elasticity = FeeMarketConstants.ELASTICITY_MULTIPLIER,
        };
    }

    // Base Fee Calculations

    /// Calculate initial base fee for EIP-1559 transition
    pub fn calculateInitialBaseFee(
        parent_gas_used: u64,
        parent_gas_limit: u64,
        parent_base_fee: u64,
    ) u64 {
        // If parent had base fee, use it
        if (parent_base_fee > 0) {
            return parent_base_fee;
        }
        
        // Otherwise calculate from parent usage
        const parent_gas_target = parent_gas_limit / FeeMarketConstants.ELASTICITY_MULTIPLIER;
        var initial_base_fee: u64 = 1_000_000_000; // 1 gwei
        
        if (parent_gas_used > parent_gas_target) {
            const gas_delta = parent_gas_used - parent_gas_target;
            const fee_delta = calculateFeeDelta(
                initial_base_fee,
                gas_delta,
                parent_gas_target,
                FeeMarketConstants.BASE_FEE_CHANGE_DENOMINATOR,
            );
            initial_base_fee = initial_base_fee + fee_delta;
        }
        
        return @max(initial_base_fee, FeeMarketConstants.MIN_BASE_FEE);
    }

    /// Calculate next block's base fee
    pub fn calculateNextBaseFee(
        parent_gas_used: u64,
        parent_gas_limit: u64,
        parent_base_fee: u64,
    ) u64 {
        const parent_gas_target = parent_gas_limit / FeeMarketConstants.ELASTICITY_MULTIPLIER;
        
        if (parent_gas_used == parent_gas_target) {
            return parent_base_fee;
        }
        
        if (parent_gas_used > parent_gas_target) {
            // Increase base fee
            const gas_delta = parent_gas_used - parent_gas_target;
            const fee_delta = calculateFeeDelta(
                parent_base_fee,
                gas_delta,
                parent_gas_target,
                FeeMarketConstants.BASE_FEE_CHANGE_DENOMINATOR,
            );
            
            // Check for overflow
            if (parent_base_fee > std.math.maxInt(u64) - fee_delta) {
                return std.math.maxInt(u64);
            }
            
            return parent_base_fee + fee_delta;
        } else {
            // Decrease base fee
            const gas_delta = parent_gas_target - parent_gas_used;
            const fee_delta = calculateFeeDelta(
                parent_base_fee,
                gas_delta,
                parent_gas_target,
                FeeMarketConstants.BASE_FEE_CHANGE_DENOMINATOR,
            );
            
            if (parent_base_fee > fee_delta) {
                return @max(parent_base_fee - fee_delta, FeeMarketConstants.MIN_BASE_FEE);
            }
            
            return FeeMarketConstants.MIN_BASE_FEE;
        }
    }

    /// Calculate fee delta avoiding overflow
    fn calculateFeeDelta(fee: u64, gas_delta: u64, gas_target: u64, denominator: u64) u64 {
        // Use u128 to avoid overflow
        const intermediate: u128 = @as(u128, fee) * @as(u128, gas_delta);
        const divisor: u128 = @max(1, @as(u128, gas_target) * @as(u128, denominator));
        const result: u64 = @intCast(@min(@as(u128, std.math.maxInt(u64)), intermediate / divisor));
        
        return @max(1, result);
    }

    // Blob Fee Calculations (EIP-4844)

    /// Calculate next blob base fee
    pub fn calculateNextBlobBaseFee(
        excess_blob_gas: u64,
        parent_blob_base_fee: u64,
    ) u64 {
        const blob_gas_delta = excess_blob_gas;
        const fee_delta = calculateBlobFeeDelta(parent_blob_base_fee, blob_gas_delta);
        
        return @max(parent_blob_base_fee + fee_delta, FeeMarketConstants.MIN_BLOB_BASE_FEE);
    }

    /// Calculate blob fee delta using exponential formula
    fn calculateBlobFeeDelta(base_fee: u64, excess_gas: u64) u64 {
        // Simplified approximation of exponential formula
        // Real implementation would use more precise calculation
        const update_fraction = FeeMarketConstants.BLOB_BASE_FEE_UPDATE_FRACTION;
        const target = FeeMarketConstants.TARGET_BLOB_GAS_PER_BLOCK;
        
        const intermediate: u128 = @as(u128, base_fee) * @as(u128, excess_gas);
        const divisor: u128 = @as(u128, target) * @as(u128, update_fraction);
        
        return @intCast(@min(@as(u128, std.math.maxInt(u64)), intermediate / divisor));
    }

    /// Calculate excess blob gas for next block
    pub fn calculateExcessBlobGas(
        parent_excess_blob_gas: u64,
        parent_blob_gas_used: u64,
    ) u64 {
        const target = FeeMarketConstants.TARGET_BLOB_GAS_PER_BLOCK;
        const gas_delta = parent_excess_blob_gas + parent_blob_gas_used;
        
        if (gas_delta < target) {
            return 0;
        }
        
        return gas_delta - target;
    }

    // Gas Price Helpers

    /// Calculate effective gas price for transaction
    pub fn effectiveGasPrice(
        self: *const FeeMarket,
        max_fee_per_gas: u64,
        max_priority_fee: u64,
    ) u64 {
        const priority_fee = @min(max_priority_fee, max_fee_per_gas - self.base_fee);
        return self.base_fee + priority_fee;
    }

    /// Check if transaction can afford current base fee
    pub fn canAffordTx(
        self: *const FeeMarket,
        max_fee_per_gas: u64,
    ) bool {
        return max_fee_per_gas >= self.base_fee;
    }

    /// Get effective priority fee
    pub fn effectivePriorityFee(
        self: *const FeeMarket,
        max_fee_per_gas: u64,
        max_priority_fee: u64,
    ) u64 {
        if (max_fee_per_gas < self.base_fee) {
            return 0;
        }
        
        return @min(max_priority_fee, max_fee_per_gas - self.base_fee);
    }

    /// Calculate total gas fee for transaction
    pub fn calculateGasFee(
        self: *const FeeMarket,
        gas_used: u64,
        max_fee_per_gas: u64,
        max_priority_fee: u64,
    ) struct { base_fee_payment: u64, priority_fee_payment: u64 } {
        const effective_price = self.effectiveGasPrice(max_fee_per_gas, max_priority_fee);
        const priority_fee = self.effectivePriorityFee(max_fee_per_gas, max_priority_fee);
        
        return .{
            .base_fee_payment = gas_used * self.base_fee,
            .priority_fee_payment = gas_used * priority_fee,
        };
    }
};
```

## Code Reference from Existing Implementation

From the existing FeeMarket.zig:

```zig
/// Helper function to calculate fee delta safely avoiding overflow and division by zero
fn calculateFeeDelta(fee: u64, gas_delta: u64, gas_target: u64, denominator: u64) u64 {
    // Using u128 for intermediate calculation to avoid overflow
    const intermediate: u128 = @as(u128, fee) * @as(u128, gas_delta);
    // Avoid division by zero
    const divisor: u128 = @max(1, @as(u128, gas_target) * @as(u128, denominator));
    const result: u64 = @intCast(@min(@as(u128, std.math.maxInt(u64)), intermediate / divisor));
    
    // Always return at least 1 to ensure some movement
    return @max(1, result);
}
```

## Reference Implementations

### Go-Ethereum (consensus/misc/eip1559.go)

```go
// CalcBaseFee calculates the basefee of the header.
func CalcBaseFee(config *params.ChainConfig, parent *types.Header) *big.Int {
    // If the current block is the first EIP-1559 block, return the InitialBaseFee.
    if !config.IsLondon(parent.Number) {
        return new(big.Int).SetUint64(params.InitialBaseFee)
    }
    
    parentGasTarget := parent.GasLimit / params.ElasticityMultiplier
    // If the parent gasUsed is the same as the target, the baseFee remains unchanged.
    if parent.GasUsed == parentGasTarget {
        return new(big.Int).Set(parent.BaseFee)
    }
    
    var (
        num   = new(big.Int)
        denom = new(big.Int)
    )
    
    if parent.GasUsed > parentGasTarget {
        // If the parent block used more gas than its target, the baseFee should increase.
        // max(1, parentBaseFee * gasUsedDelta / parentGasTarget / baseFeeChangeDenominator)
        num.SetUint64(parent.GasUsed - parentGasTarget)
        num.Mul(num, parent.BaseFee)
        num.Div(num, denom.SetUint64(parentGasTarget))
        num.Div(num, denom.SetUint64(params.BaseFeeChangeDenominator))
        baseFeeDelta := math.BigMax(num, common.Big1)
        
        return num.Add(parent.BaseFee, baseFeeDelta)
    } else {
        // Otherwise if the parent block used less gas than its target, the baseFee should decrease.
        // max(0, parentBaseFee * gasUsedDelta / parentGasTarget / baseFeeChangeDenominator)
        num.SetUint64(parentGasTarget - parent.GasUsed)
        num.Mul(num, parent.BaseFee)
        num.Div(num, denom.SetUint64(parentGasTarget))
        num.Div(num, denom.SetUint64(params.BaseFeeChangeDenominator))
        baseFee := num.Sub(parent.BaseFee, num)
        
        return math.BigMax(baseFee, common.Big1)
    }
}
```

### revm (crates/primitives/src/eip4844.rs)

```rust
/// Calculates the excess blob gas from the parent header's blob gas fields.
pub fn calc_excess_blob_gas(parent_excess_blob_gas: u64, parent_blob_gas_used: u64) -> u64 {
    (parent_excess_blob_gas + parent_blob_gas_used).saturating_sub(TARGET_BLOB_GAS_PER_BLOCK)
}

/// Calculates the blob gas price from the header's excess blob gas field.
pub fn calc_blob_gasprice(excess_blob_gas: u64) -> u128 {
    fake_exponential(
        MIN_BLOB_BASE_FEE as u128,
        excess_blob_gas as u128,
        BLOB_BASE_FEE_UPDATE_FRACTION as u128,
    )
}

/// Approximates factor * e ** (numerator / denominator) using a taylor expansion.
fn fake_exponential(factor: u128, numerator: u128, denominator: u128) -> u128 {
    let mut output = 0;
    let mut numerator_accum = factor * denominator;
    let mut i = 1;
    while numerator_accum > 0 {
        output += numerator_accum;
        numerator_accum = (numerator_accum * numerator) / (denominator * i);
        i += 1;
    }
    output / denominator
}
```

## Usage Example

```zig
// Initialize fee market for EIP-1559 transition
var fee_market = FeeMarket.initEIP1559(
    parent_gas_used,
    parent_gas_limit,
    0, // No base fee before EIP-1559
);

// Calculate next block's base fee
const next_base_fee = FeeMarket.calculateNextBaseFee(
    current_gas_used,
    current_gas_limit,
    fee_market.base_fee,
);

// Update fee market
fee_market.base_fee = next_base_fee;

// Check if transaction can be included
if (fee_market.canAffordTx(tx.max_fee_per_gas)) {
    const effective_price = fee_market.effectiveGasPrice(
        tx.max_fee_per_gas,
        tx.max_priority_fee_per_gas,
    );
    
    // Process transaction with effective price
}

// Calculate fees for executed transaction
const fees = fee_market.calculateGasFee(
    gas_used,
    tx.max_fee_per_gas,
    tx.max_priority_fee_per_gas,
);

// Base fee is burned, priority fee goes to validator
burn_amount += fees.base_fee_payment;
validator_payment += fees.priority_fee_payment;
```

## Testing Requirements

1. **Base Fee Calculations**:
   - Test initial base fee calculation
   - Test base fee increases when over target
   - Test base fee decreases when under target
   - Test minimum base fee enforcement
   - Test overflow protection

2. **EIP-4844 Blob Fees**:
   - Test excess blob gas calculation
   - Test blob base fee updates
   - Test exponential approximation

3. **Transaction Processing**:
   - Test effective gas price calculation
   - Test priority fee extraction
   - Test fee payment calculations

4. **Edge Cases**:
   - Test with zero gas usage
   - Test with maximum gas usage
   - Test integer overflow scenarios
   - Test network transitions

## References

- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee market change
- [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) - Shard blob transactions
- [Go-Ethereum eip1559.go](https://github.com/ethereum/go-ethereum/blob/master/consensus/misc/eip1559.go)
- [revm eip4844.rs](https://github.com/bluealloy/revm/blob/main/crates/primitives/src/eip4844.rs)
# Gas Metering Implementation Issue

## Overview

Gas.zig provides comprehensive gas metering functionality for EVM operations including dynamic gas calculation, memory expansion costs, call stipends, and EIP-specific gas rules with optimizations from production EVMs.

## Requirements

- Calculate static and dynamic gas costs for all opcodes
- Handle memory expansion gas costs
- Track gas consumption and enforce limits
- Support gas refunds with proper limits
- Implement call gas calculations with stipends
- Handle EIP-specific gas changes (Berlin, London, Shanghai)
- Optimize hot-path gas calculations
- Support sub-call gas allocation
- Handle gas overflow protection
- Integrate with warm/cold access tracking

## Interface

```zig
const std = @import("std");
const Address = @import("address").Address;
const B256 = @import("utils").B256;

pub const GasError = error{
    OutOfGas,
    GasOverflow,
    InsufficientGasForCall,
    GasLimitExceeded,
};

/// Gas calculation result
pub const GasResult = struct {
    /// Gas cost to charge
    cost: u64,
    /// Whether calculation overflowed
    overflow: bool,
    /// Memory expansion cost (if any)
    memory_cost: u64 = 0,
    /// Whether this is a cold access
    is_cold: bool = false,
};

/// Gas costs for common operations (latest hardfork)
pub const GasCosts = struct {
    // Base costs
    pub const ZERO: u64 = 0;
    pub const JUMPDEST: u64 = 1;
    pub const BASE: u64 = 2;
    pub const VERYLOW: u64 = 3;
    pub const LOW: u64 = 5;
    pub const MID: u64 = 8;
    pub const HIGH: u64 = 10;
    
    // Memory and storage
    pub const MEMORY: u64 = 3;
    pub const STORAGE_SET: u64 = 20000;
    pub const STORAGE_RESET: u64 = 5000;
    pub const STORAGE_CLEAR_REFUND: u64 = 15000;
    
    // Call-related
    pub const CALL: u64 = 700;
    pub const CALLVALUE: u64 = 9000;
    pub const NEWACCOUNT: u64 = 25000;
    pub const EXP: u64 = 10;
    pub const EXPBYTE: u64 = 50;
    
    // Create
    pub const CREATE: u64 = 32000;
    pub const CREATE2: u64 = 32000;
    pub const CREATE_DATA: u64 = 200;
    
    // Transaction
    pub const TRANSACTION: u64 = 21000;
    pub const TRANSACTION_CREATE: u64 = 53000;
    pub const TRANSACTION_ZERO_DATA: u64 = 4;
    pub const TRANSACTION_NON_ZERO_DATA: u64 = 16;
    
    // Logs
    pub const LOG: u64 = 375;
    pub const LOGDATA: u64 = 8;
    pub const LOGTOPIC: u64 = 375;
    
    // Other
    pub const KECCAK256: u64 = 30;
    pub const KECCAK256_WORD: u64 = 6;
    pub const COPY: u64 = 3;
    pub const BLOCKHASH: u64 = 20;
    pub const CODEDEPOSIT: u64 = 200;
    
    // EIP-2929 (Berlin) - Access lists
    pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
    pub const COLD_SLOAD_COST: u64 = 2100;
    pub const WARM_STORAGE_READ_COST: u64 = 100;
    
    // EIP-3529 (London) - Refund changes
    pub const STORAGE_CLEAR_REFUND_REDUCED: u64 = 4800;
    pub const MAX_REFUND_QUOTIENT: u64 = 5;
};

pub const Gas = struct {
    /// Current gas remaining
    remaining: u64,
    /// Gas limit for this execution
    limit: u64,
    /// Gas used so far
    used: u64,
    /// Refund counter
    refund: u64,
    /// Memory size last paid for
    memory_size: u64,

    // Initialization

    /// Create new gas meter with given limit
    pub fn init(gas_limit: u64) Gas {
        return .{
            .remaining = gas_limit,
            .limit = gas_limit,
            .used = 0,
            .refund = 0,
            .memory_size = 0,
        };
    }

    // Basic gas operations

    /// Consume gas, returns error if insufficient
    pub inline fn consume(self: *Gas, amount: u64) GasError!void {
        if (amount > self.remaining) {
            return error.OutOfGas;
        }
        self.remaining -= amount;
        self.used += amount;
    }

    /// Try to consume gas, returns false if insufficient (no error)
    pub inline fn tryConsume(self: *Gas, amount: u64) bool {
        if (amount > self.remaining) {
            return false;
        }
        self.remaining -= amount;
        self.used += amount;
        return true;
    }

    /// Add gas (for gas refunds or call returns)
    pub inline fn refundGas(self: *Gas, amount: u64) void {
        self.remaining = @min(self.remaining + amount, self.limit);
        self.used = self.limit - self.remaining;
    }

    /// Add to refund counter
    pub fn addRefund(self: *Gas, amount: u64) void {
        self.refund = self.refund + amount;
    }

    /// Subtract from refund counter (with underflow protection)
    pub fn subRefund(self: *Gas, amount: u64) void {
        if (amount > self.refund) {
            self.refund = 0;
        } else {
            self.refund -= amount;
        }
    }

    /// Get effective refund (capped by London rules)
    pub fn getEffectiveRefund(self: *const Gas) u64 {
        // EIP-3529: Refund is capped at used_gas / 5
        const max_refund = self.used / GasCosts.MAX_REFUND_QUOTIENT;
        return @min(self.refund, max_refund);
    }

    // Memory gas calculations

    /// Calculate memory expansion cost
    pub fn memoryGasCost(self: *const Gas, offset: u64, size: u64) GasResult {
        if (size == 0) {
            return .{ .cost = 0, .overflow = false };
        }

        // Check for overflow
        const end_offset = offset +% size;
        if (end_offset < offset) {
            return .{ .cost = 0, .overflow = true };
        }

        // Calculate new memory size (rounded up to 32-byte words)
        const new_mem_size = (end_offset + 31) / 32 * 32;
        
        if (new_mem_size <= self.memory_size) {
            return .{ .cost = 0, .overflow = false };
        }

        const new_mem_size_words = new_mem_size / 32;
        const old_mem_size_words = self.memory_size / 32;

        // Memory cost formula: memory_cost = (memory_size_word ** 2) / 512 + (3 * memory_size_word)
        const new_cost = (new_mem_size_words * new_mem_size_words) / 512 + (3 * new_mem_size_words);
        const old_cost = (old_mem_size_words * old_mem_size_words) / 512 + (3 * old_mem_size_words);

        const cost = new_cost - old_cost;

        return .{
            .cost = cost,
            .overflow = false,
            .memory_cost = cost,
        };
    }

    /// Update memory size after expansion
    pub fn expandMemory(self: *Gas, new_size: u64) void {
        if (new_size > self.memory_size) {
            self.memory_size = new_size;
        }
    }

    // Storage gas calculations

    /// Calculate SSTORE gas cost (EIP-2200 with EIP-2929)
    pub fn sstoreGasCost(
        self: *Gas,
        original: B256,
        current: B256,
        new: B256,
        is_cold: bool,
    ) GasResult {
        // Base cost
        var cost: u64 = if (is_cold) GasCosts.COLD_SLOAD_COST else GasCosts.WARM_STORAGE_READ_COST;

        // EIP-2200 logic
        if (new.eql(current)) {
            // No-op
            return .{ .cost = cost, .overflow = false, .is_cold = is_cold };
        }

        if (original.eql(current)) {
            // First modification in transaction
            if (original.isZero()) {
                // Creating new storage
                cost += GasCosts.STORAGE_SET;
            } else if (new.isZero()) {
                // Clearing storage
                cost += GasCosts.STORAGE_RESET;
                self.addRefund(GasCosts.STORAGE_CLEAR_REFUND_REDUCED);
            } else {
                // Changing existing value
                cost += GasCosts.STORAGE_RESET;
            }
        } else {
            // Subsequent modification
            cost += GasCosts.WARM_STORAGE_READ_COST;
            
            if (!original.isZero()) {
                if (current.isZero()) {
                    // Recreating in same transaction
                    self.subRefund(GasCosts.STORAGE_CLEAR_REFUND_REDUCED);
                } else if (new.isZero()) {
                    // Clearing again
                    self.addRefund(GasCosts.STORAGE_CLEAR_REFUND_REDUCED);
                }
            }
            
            if (original.eql(new)) {
                // Reverting to original
                if (original.isZero()) {
                    self.addRefund(GasCosts.STORAGE_SET - GasCosts.WARM_STORAGE_READ_COST);
                } else {
                    self.addRefund(GasCosts.STORAGE_RESET - GasCosts.WARM_STORAGE_READ_COST);
                }
            }
        }

        return .{ .cost = cost, .overflow = false, .is_cold = is_cold };
    }

    // Call gas calculations

    /// Calculate gas for CALL operations
    pub fn callGasCost(
        self: *Gas,
        value: u256,
        target_exists: bool,
        is_cold: bool,
    ) GasResult {
        var cost: u64 = if (is_cold) GasCosts.COLD_ACCOUNT_ACCESS_COST else GasCosts.WARM_STORAGE_READ_COST;

        if (value > 0) {
            cost += GasCosts.CALLVALUE;
            if (!target_exists) {
                cost += GasCosts.NEWACCOUNT;
            }
        }

        return .{ .cost = cost, .overflow = false, .is_cold = is_cold };
    }

    /// Calculate gas allocation for sub-call
    pub fn callGasAllocation(self: *const Gas, gas_param: u64) u64 {
        // All but one 64th of gas can be passed to sub-call
        const remaining_after_call = self.remaining / 64;
        const available_for_call = self.remaining - remaining_after_call;
        
        return @min(gas_param, available_for_call);
    }

    /// Calculate stipend for calls with value
    pub fn callStipend(value: u256) u64 {
        return if (value > 0) 2300 else 0;
    }

    // Other dynamic costs

    /// Calculate EXP gas cost
    pub fn expGasCost(exponent: u256) GasResult {
        if (exponent == 0) {
            return .{ .cost = GasCosts.EXP, .overflow = false };
        }

        // Count significant bytes in exponent
        const bytes = (256 - @clz(exponent) + 7) / 8;
        const cost = GasCosts.EXP + GasCosts.EXPBYTE * bytes;

        return .{ .cost = cost, .overflow = false };
    }

    /// Calculate KECCAK256 gas cost
    pub fn keccak256GasCost(size: u64) GasResult {
        const word_size = (size + 31) / 32;
        const cost = GasCosts.KECCAK256 + GasCosts.KECCAK256_WORD * word_size;
        
        return .{ .cost = cost, .overflow = false };
    }

    /// Calculate *COPY operations gas cost
    pub fn copyGasCost(size: u64) GasResult {
        const word_size = (size + 31) / 32;
        const cost = GasCosts.COPY * word_size;
        
        return .{ .cost = cost, .overflow = false };
    }

    /// Calculate LOG* operations gas cost
    pub fn logGasCost(size: u64, topic_count: u8) GasResult {
        const cost = GasCosts.LOG + 
                    GasCosts.LOGDATA * size + 
                    GasCosts.LOGTOPIC * topic_count;
        
        return .{ .cost = cost, .overflow = false };
    }

    /// Calculate CREATE/CREATE2 gas cost
    pub fn createGasCost(init_code_size: u64) GasResult {
        const word_size = (init_code_size + 31) / 32;
        const cost = GasCosts.CREATE + GasCosts.CREATE_DATA * word_size;
        
        return .{ .cost = cost, .overflow = false };
    }

    // Transaction costs

    /// Calculate intrinsic gas for transaction
    pub fn transactionIntrinsicGas(
        data: []const u8,
        is_contract_creation: bool,
        access_list_addresses: usize,
        access_list_storage_keys: usize,
    ) GasResult {
        var cost: u64 = if (is_contract_creation) 
            GasCosts.TRANSACTION_CREATE 
        else 
            GasCosts.TRANSACTION;

        // Data costs
        for (data) |byte| {
            if (byte == 0) {
                cost += GasCosts.TRANSACTION_ZERO_DATA;
            } else {
                cost += GasCosts.TRANSACTION_NON_ZERO_DATA;
            }
        }

        // EIP-2930: Access list costs
        cost += 2400 * access_list_addresses;
        cost += 1900 * access_list_storage_keys;

        return .{ .cost = cost, .overflow = false };
    }
};

/// Fast opcode gas lookup table
pub const OPCODE_GAS_COSTS = [256]u64{
    GasCosts.ZERO,       // 0x00 STOP
    GasCosts.VERYLOW,    // 0x01 ADD
    GasCosts.LOW,        // 0x02 MUL
    GasCosts.VERYLOW,    // 0x03 SUB
    GasCosts.LOW,        // 0x04 DIV
    GasCosts.LOW,        // 0x05 SDIV
    GasCosts.LOW,        // 0x06 MOD
    GasCosts.LOW,        // 0x07 SMOD
    GasCosts.MID,        // 0x08 ADDMOD
    GasCosts.MID,        // 0x09 MULMOD
    0,                   // 0x0a EXP (dynamic)
    GasCosts.HIGH,       // 0x0b SIGNEXTEND
    // ... continue for all 256 opcodes
};

/// Get static gas cost for opcode
pub inline fn getStaticGasCost(opcode: u8) u64 {
    return OPCODE_GAS_COSTS[opcode];
}
```

## Implementation Notes

### Memory Cost Optimization

Memory expansion uses quadratic pricing to prevent abuse:
```zig
// Optimized memory cost calculation avoiding overflow
pub fn memoryGasCost(old_size: u64, new_size: u64) u64 {
    if (new_size <= old_size) return 0;
    
    const new_size_word = (new_size + 31) / 32;
    const old_size_word = (old_size + 31) / 32;
    
    // Use formula rearrangement to avoid overflow
    // cost = words^2/512 + 3*words
    const new_cost = (new_size_word * new_size_word) / 512 + (3 * new_size_word);
    const old_cost = (old_size_word * old_size_word) / 512 + (3 * old_size_word);
    
    return new_cost - old_cost;
}
```

### Call Gas Allocation

The 63/64 rule prevents call depth attacks:
```zig
// Ensure 1/64th of gas remains for parent
pub fn maxCallGas(available: u64) u64 {
    return available - (available / 64);
}
```

## Usage Example

```zig
// Initialize gas for transaction
var gas = Gas.init(3000000);

// Simple operation
try gas.consume(GasCosts.VERYLOW);

// Memory expansion
const mem_result = gas.memoryGasCost(current_offset, size);
if (mem_result.overflow) return error.GasOverflow;
try gas.consume(mem_result.cost);
gas.expandMemory(new_memory_size);

// Storage operation
const sstore_result = gas.sstoreGasCost(original, current, new_value, is_cold);
try gas.consume(sstore_result.cost);

// Call with gas allocation
const call_cost = gas.callGasCost(value, target_exists, is_cold);
try gas.consume(call_cost.cost);

const sub_gas = gas.callGasAllocation(gas_param);
const stipend = Gas.callStipend(value);

// Execute sub-call with allocated gas
var sub_gas_meter = Gas.init(sub_gas + stipend);
```

## Performance Considerations

1. **Inline Critical Functions**: Use `inline` for hot-path functions
2. **Avoid Overflow Checks**: Pre-validate inputs where possible
3. **Static Lookup Tables**: Use compile-time arrays for opcode costs
4. **Branch Prediction**: Order conditions by likelihood
5. **Cache Memory Size**: Track last paid memory size to avoid recalculation

## Testing Requirements

1. **Basic Operations**:
   - Test gas consumption and limits
   - Test refund calculations
   - Test overflow protection

2. **Memory Costs**:
   - Test quadratic memory pricing
   - Test large memory expansions
   - Test zero-size operations

3. **Storage Costs**:
   - Test all SSTORE scenarios
   - Test refund calculations
   - Test cold/warm transitions

4. **Call Costs**:
   - Test gas allocation rules
   - Test stipend calculations
   - Test account creation costs

5. **Edge Cases**:
   - Test gas exactly at limit
   - Test refund edge cases
   - Test overflow scenarios

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) Appendix G
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
- [Go-Ethereum gas_table.go](https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go)
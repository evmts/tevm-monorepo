# Implement MODEXP Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_modexp_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_modexp_precompile feat_implement_modexp_precompile`
3. **Work in isolation**: `cd g/feat_implement_modexp_precompile`
4. **Commit message**: `✨ feat: implement MODEXP precompile with EIP-2565 optimizations`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the MODEXP precompile (address 0x05) for Ethereum Virtual Machine compatibility. This precompile performs modular exponentiation (base^exp % mod) and is crucial for RSA verification and other cryptographic operations. The implementation must handle EIP-2565 gas cost optimizations.

## Ethereum Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000005`
- **Function**: Computes `(base^exp) mod modulus`
- **Available**: Byzantium hardfork onwards
- **Gas Cost**: Complex calculation based on input sizes (EIP-198, EIP-2565)

### Input Format
```
Input format (variable length):
- base_length (32 bytes): Length of base in bytes
- exp_length (32 bytes): Length of exponent in bytes  
- mod_length (32 bytes): Length of modulus in bytes
- base (base_length bytes): Base value
- exp (exp_length bytes): Exponent value
- mod (mod_length bytes): Modulus value
```

### Output Format
- **Success**: mod_length bytes containing result of (base^exp) mod modulus
- **Special Cases**: 
  - If modulus = 0: return 0
  - If modulus = 1: return 0
  - If base = 0 and exp = 0: return 1

## Reference Implementations

### evmone Implementation
File: Search for `modexp` in evmone precompiles for gas calculation and execution

### revm Implementation  
File: Search for `modexp` in revm for modern optimization patterns

### EIP Specifications
- **EIP-198**: Original MODEXP precompile specification
- **EIP-2565**: Gas cost optimization (reduced costs for common cases)

## Implementation Requirements

### Core Functionality
1. **Input Parsing**: Parse variable-length input format
2. **Big Integer Arithmetic**: Handle arbitrary precision integers
3. **Modular Exponentiation**: Efficient computation using square-and-multiply
4. **Gas Calculation**: Complex gas cost based on input sizes and exponent
5. **Edge Case Handling**: Special mathematical cases

### Gas Calculation (EIP-2565)
```zig
fn calculate_modexp_gas(base_len: usize, exp_len: usize, mod_len: usize, exp_bytes: []const u8) u64 {
    // Calculate multiplication complexity
    const max_len = @max(@max(base_len, exp_len), mod_len);
    const multiplication_complexity = calculate_multiplication_complexity(max_len);
    
    // Calculate iteration count based on exponent
    const iteration_count = calculate_iteration_count(exp_len, exp_bytes);
    
    // Gas cost = max(200, multiplication_complexity * iteration_count / 3)
    const calculated_gas = (multiplication_complexity * iteration_count) / 3;
    return @max(200, calculated_gas);
}

fn calculate_multiplication_complexity(max_len: usize) u64 {
    if (max_len <= 64) {
        return max_len * max_len;
    } else if (max_len <= 1024) {
        return (max_len * max_len) / 4 + 96 * max_len - 3072;
    } else {
        return (max_len * max_len) / 16 + 480 * max_len - 199680;
    }
}

fn calculate_iteration_count(exp_len: usize, exp_bytes: []const u8) u64 {
    if (exp_len <= 32 and exp_bytes.len > 0) {
        // For small exponents, count actual bits
        const exp_value = bytes_to_u256(exp_bytes);
        if (exp_value == 0) return 0;
        
        // Count bits in exponent
        return 256 - @clz(exp_value);
    } else {
        // For large exponents, use approximation
        const adjusted_exp_len = if (exp_len <= 32) exp_len else exp_len - 32;
        return @max(1, adjusted_exp_len * 8);
    }
}
```

## Implementation Tasks

### Task 1: Add MODEXP Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// MODEXP precompile constants
pub const MODEXP_MIN_GAS: u64 = 200;
pub const MODEXP_QUADRATIC_THRESHOLD: usize = 64;
pub const MODEXP_LINEAR_THRESHOLD: usize = 1024;
```

### Task 2: Implement Big Integer Support
File: `/src/evm/crypto/big_integer.zig`
```zig
const std = @import("std");

pub const BigInteger = struct {
    limbs: []u64,
    len: usize,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator, capacity: usize) !BigInteger {
        const limb_count = (capacity + 7) / 8; // 8 bytes per limb
        const limbs = try allocator.alloc(u64, limb_count);
        @memset(limbs, 0);
        
        return BigInteger{
            .limbs = limbs,
            .len = 0,
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *BigInteger) void {
        self.allocator.free(self.limbs);
    }
    
    pub fn from_bytes(allocator: std.mem.Allocator, bytes: []const u8) !BigInteger {
        var big_int = try BigInteger.init(allocator, bytes.len);
        try big_int.set_from_bytes(bytes);
        return big_int;
    }
    
    pub fn set_from_bytes(self: *BigInteger, bytes: []const u8) !void {
        // Convert big-endian bytes to limbs
        var i: usize = bytes.len;
        var limb_index: usize = 0;
        
        while (i > 0 and limb_index < self.limbs.len) {
            var limb: u64 = 0;
            var byte_count: usize = 0;
            
            while (byte_count < 8 and i > 0) {
                i -= 1;
                limb |= (@as(u64, bytes[i]) << @intCast(byte_count * 8));
                byte_count += 1;
            }
            
            self.limbs[limb_index] = limb;
            limb_index += 1;
        }
        
        self.len = limb_index;
    }
    
    pub fn to_bytes(self: *const BigInteger, output: []u8) void {
        @memset(output, 0);
        
        var byte_index: usize = output.len;
        for (self.limbs[0..self.len]) |limb| {
            var current_limb = limb;
            var byte_count: usize = 0;
            
            while (byte_count < 8 and byte_index > 0) {
                byte_index -= 1;
                output[byte_index] = @intCast(current_limb & 0xFF);
                current_limb >>= 8;
                byte_count += 1;
            }
            
            if (byte_index == 0) break;
        }
    }
    
    // Modular exponentiation using square-and-multiply
    pub fn mod_exp(base: *const BigInteger, exp: *const BigInteger, modulus: *const BigInteger, allocator: std.mem.Allocator) !BigInteger {
        // Handle special cases
        if (modulus.is_zero()) {
            return BigInteger.init(allocator, 1);
        }
        
        if (modulus.is_one()) {
            return BigInteger.init(allocator, 1);
        }
        
        // Montgomery ladder or square-and-multiply algorithm
        return square_and_multiply(base, exp, modulus, allocator);
    }
    
    fn square_and_multiply(base: *const BigInteger, exp: *const BigInteger, modulus: *const BigInteger, allocator: std.mem.Allocator) !BigInteger {
        var result = try BigInteger.from_value(allocator, 1);
        var base_copy = try base.clone(allocator);
        defer result.deinit();
        defer base_copy.deinit();
        
        // Iterate through exponent bits
        for (exp.limbs[0..exp.len]) |limb| {
            var bit_mask: u64 = 1;
            while (bit_mask != 0) {
                if (limb & bit_mask != 0) {
                    try result.mul_mod(&base_copy, modulus);
                }
                try base_copy.square_mod(modulus);
                bit_mask <<= 1;
            }
        }
        
        return result;
    }
    
    // Additional methods: add_mod, mul_mod, square_mod, is_zero, is_one, etc.
};
```

### Task 3: Implement MODEXP Precompile
File: `/src/evm/precompiles/modexp.zig`
```zig
const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const BigInteger = @import("../crypto/big_integer.zig").BigInteger;

pub fn calculate_gas(input: []const u8) u64 {
    if (input.len < 96) {
        // Invalid input format
        return gas_constants.MODEXP_MIN_GAS;
    }
    
    // Parse input lengths
    const base_len = bytes_to_usize(input[0..32]);
    const exp_len = bytes_to_usize(input[32..64]);
    const mod_len = bytes_to_usize(input[64..96]);
    
    // Calculate expected input size
    const expected_len = 96 + base_len + exp_len + mod_len;
    if (input.len < expected_len) {
        return gas_constants.MODEXP_MIN_GAS;
    }
    
    // Extract exponent bytes for gas calculation
    const exp_start = 96 + base_len;
    const exp_bytes = if (exp_len > 0 and exp_start + exp_len <= input.len)
        input[exp_start..exp_start + exp_len]
    else
        &[_]u8{};
    
    // Calculate gas using EIP-2565 formula
    return calculate_modexp_gas(base_len, exp_len, mod_len, exp_bytes);
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64, allocator: std.mem.Allocator) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    
    // Validate minimum input size
    if (input.len < 96) {
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
    }
    
    // Parse input parameters
    const base_len = bytes_to_usize(input[0..32]);
    const exp_len = bytes_to_usize(input[32..64]);
    const mod_len = bytes_to_usize(input[64..96]);
    
    // Validate input size
    const expected_len = 96 + base_len + exp_len + mod_len;
    if (input.len < expected_len) {
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
    }
    
    // Validate output size
    if (output.len < mod_len) {
        return PrecompileError.InvalidOutput;
    }
    
    // Extract input components
    const base_start = 96;
    const exp_start = base_start + base_len;
    const mod_start = exp_start + exp_len;
    
    const base_bytes = if (base_len > 0) input[base_start..base_start + base_len] else &[_]u8{};
    const exp_bytes = if (exp_len > 0) input[exp_start..exp_start + exp_len] else &[_]u8{};
    const mod_bytes = if (mod_len > 0) input[mod_start..mod_start + mod_len] else &[_]u8{};
    
    // Handle special case: modulus = 0
    if (mod_len == 0 or is_zero_bytes(mod_bytes)) {
        @memset(output[0..mod_len], 0);
        return PrecompileResult{ .gas_used = gas_cost, .output_size = mod_len };
    }
    
    // Create big integers
    var base = BigInteger.from_bytes(allocator, base_bytes) catch {
        return PrecompileError.OutOfMemory;
    };
    defer base.deinit();
    
    var exp = BigInteger.from_bytes(allocator, exp_bytes) catch {
        return PrecompileError.OutOfMemory;
    };
    defer exp.deinit();
    
    var modulus = BigInteger.from_bytes(allocator, mod_bytes) catch {
        return PrecompileError.OutOfMemory;
    };
    defer modulus.deinit();
    
    // Perform modular exponentiation
    var result = BigInteger.mod_exp(&base, &exp, &modulus, allocator) catch {
        return PrecompileError.OutOfMemory;
    };
    defer result.deinit();
    
    // Convert result to bytes
    result.to_bytes(output[0..mod_len]);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = mod_len };
}

fn bytes_to_usize(bytes: []const u8) usize {
    var result: usize = 0;
    for (bytes) |byte| {
        result = (result << 8) | byte;
    }
    return result;
}

fn is_zero_bytes(bytes: []const u8) bool {
    for (bytes) |byte| {
        if (byte != 0) return false;
    }
    return true;
}

fn calculate_modexp_gas(base_len: usize, exp_len: usize, mod_len: usize, exp_bytes: []const u8) u64 {
    // EIP-2565 gas calculation
    const max_len = @max(@max(base_len, exp_len), mod_len);
    const multiplication_complexity = calculate_multiplication_complexity(max_len);
    const iteration_count = calculate_iteration_count(exp_len, exp_bytes);
    
    const calculated_gas = (multiplication_complexity * iteration_count) / 3;
    return @max(gas_constants.MODEXP_MIN_GAS, calculated_gas);
}

fn calculate_multiplication_complexity(max_len: usize) u64 {
    const len = @as(u64, @intCast(max_len));
    
    if (max_len <= gas_constants.MODEXP_QUADRATIC_THRESHOLD) {
        return len * len;
    } else if (max_len <= gas_constants.MODEXP_LINEAR_THRESHOLD) {
        return (len * len) / 4 + 96 * len - 3072;
    } else {
        return (len * len) / 16 + 480 * len - 199680;
    }
}

fn calculate_iteration_count(exp_len: usize, exp_bytes: []const u8) u64 {
    if (exp_len <= 32 and exp_bytes.len > 0) {
        // Calculate based on actual exponent value
        var exp_value: u256 = 0;
        for (exp_bytes) |byte| {
            exp_value = (exp_value << 8) | byte;
        }
        
        if (exp_value == 0) return 0;
        
        // Count bits in exponent
        return @as(u64, @intCast(256 - @clz(exp_value)));
    } else {
        // For large exponents, use approximation
        const adjusted_exp_len = if (exp_len <= 32) exp_len else exp_len - 32;
        return @max(1, @as(u64, @intCast(adjusted_exp_len * 8)));
    }
}
```

### Task 4: Update Precompile System
File: `/src/evm/precompiles/precompiles.zig` (modify existing)
Add MODEXP to the precompile dispatcher.

File: `/src/evm/precompiles/precompile_addresses.zig` (modify existing)
```zig
pub const MODEXP_ADDRESS: u8 = 0x05;
```

### Task 5: Comprehensive Testing
File: `/test/evm/precompiles/modexp_test.zig`

### Test Cases
```zig
test "modexp basic functionality" {
    // Test simple cases: 2^3 mod 5 = 3
    // Test: 5^10 mod 13 = 12
    // Test known test vectors from Ethereum test suite
}

test "modexp special cases" {
    // Test modulus = 0 (should return 0)
    // Test modulus = 1 (should return 0)
    // Test base = 0, exp = 0 (should return 1)
    // Test base = 0, exp > 0 (should return 0)
}

test "modexp gas calculation" {
    // Test EIP-2565 gas costs
    // Compare with reference implementations
    // Test edge cases in gas calculation
}

test "modexp large numbers" {
    // Test with 2048-bit numbers
    // Test performance with very large exponents
    // Test memory usage patterns
}

test "modexp integration" {
    // Test via CALL opcode
    // Test return data handling
    // Test gas consumption in VM context
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/precompiles/modexp.zig` - New MODEXP implementation
- `/src/evm/crypto/big_integer.zig` - New big integer arithmetic
- `/src/evm/precompiles/precompiles.zig` - Add MODEXP to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add MODEXP address
- `/src/evm/constants/gas_constants.zig` - Add MODEXP gas constants
- `/test/evm/precompiles/modexp_test.zig` - Comprehensive tests

### Build System
Ensure big integer arithmetic doesn't significantly impact WASM bundle size.

## Performance Considerations

### Big Integer Optimization
```zig
// Use efficient algorithms for large numbers
pub const ModExpOptimizations = struct {
    // Montgomery multiplication for repeated modular operations
    pub fn montgomery_mod_exp(base: *const BigInteger, exp: *const BigInteger, modulus: *const BigInteger) !BigInteger {
        // Convert to Montgomery form
        // Perform exponentiation in Montgomery space
        // Convert back to normal form
    }
    
    // Sliding window exponentiation for large exponents
    pub fn sliding_window_mod_exp(base: *const BigInteger, exp: *const BigInteger, modulus: *const BigInteger) !BigInteger {
        // Use sliding window algorithm to reduce multiplications
    }
    
    // Karatsuba multiplication for very large numbers
    pub fn karatsuba_multiply(a: *const BigInteger, b: *const BigInteger) !BigInteger {
        // Implement Karatsuba algorithm for O(n^1.585) multiplication
    }
};
```

### Memory Management
- **Temporary Allocation**: Minimize temporary big integer allocations
- **Reuse Buffers**: Reuse computation buffers where possible
- **Stack vs Heap**: Use stack allocation for small operations

### Gas Cost Optimization
- **Early Termination**: Return early for expensive operations
- **Precision**: Use exact gas calculations to avoid overcharging
- **Caching**: Cache multiplication complexity calculations

## Security Considerations

### Input Validation
```zig
// Validate input sizes to prevent DoS
const MAX_INPUT_SIZE = 1024 * 1024; // 1MB limit

fn validate_modexp_input(base_len: usize, exp_len: usize, mod_len: usize) bool {
    // Prevent extremely large inputs
    if (base_len > MAX_INPUT_SIZE) return false;
    if (exp_len > MAX_INPUT_SIZE) return false;
    if (mod_len > MAX_INPUT_SIZE) return false;
    
    // Prevent integer overflow in size calculations
    const total_size = base_len + exp_len + mod_len;
    if (total_size < base_len) return false; // Overflow check
    
    return true;
}
```

### Constant-Time Operations
- **Side-Channel Resistance**: Implement constant-time big integer operations where possible
- **Branch-Free Code**: Avoid data-dependent branches in crypto operations
- **Memory Access Patterns**: Consistent memory access to prevent cache timing attacks

## Complex Test Cases

### Edge Cases
```zig
test "modexp edge cases" {
    // Very large numbers (2048+ bits)
    // Exponent with many trailing zeros
    // Modulus with special mathematical properties
    // Maximum gas consumption scenarios
}
```

### Fuzzing Targets
```zig
test "modexp fuzzing" {
    // Random input generation
    // Property-based testing
    // Cross-reference with reference implementations
    // Performance regression testing
}
```

## Success Criteria

1. **Ethereum Compatibility**: Matches reference implementation results exactly
2. **EIP-2565 Compliance**: Correct gas cost calculation per specification
3. **Performance**: Efficient for both small and large number operations
4. **Memory Safety**: No buffer overflows or memory leaks
5. **Security**: Resistant to timing attacks and DoS attempts
6. **Test Coverage**: Comprehensive test suite including edge cases

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Implement big integer arithmetic correctly** - Mathematical correctness is critical
3. **Follow EIP-2565 gas costs exactly** - Must match specification precisely
4. **Handle all edge cases** - Zero values, large numbers, special moduli
5. **Optimize for WASM bundle size** - Big integer code can be large
6. **Test with Ethereum test vectors** - Use official test suite for validation

## References

- [EIP-198: Big integer modular exponentiation](https://eips.ethereum.org/EIPS/eip-198)
- [EIP-2565: ModExp Gas Cost](https://eips.ethereum.org/EIPS/eip-2565)
- [Montgomery Modular Multiplication](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication)
- [Handbook of Applied Cryptography](http://cacr.uwaterloo.ca/hac/) - Chapter 14
- [Ethereum Test Vectors](https://github.com/ethereum/tests)
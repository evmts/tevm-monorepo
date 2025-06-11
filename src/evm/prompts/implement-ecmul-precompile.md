# Implement ECMUL Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_ecmul_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_ecmul_precompile feat_implement_ecmul_precompile`
3. **Work in isolation**: `cd g/feat_implement_ecmul_precompile`
4. **Commit message**: `✨ feat: implement ECMUL precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the ECMUL precompile (address 0x07) for Ethereum Virtual Machine compatibility. This precompile provides elliptic curve scalar multiplication on the alt_bn128 curve and is available from the Byzantium hardfork.

## ELI5

Think of elliptic curve multiplication as a special kind of math operation used in cryptography. Imagine you have a point on a mathematical curve, and you want to "multiply" it by a large number. This isn't regular multiplication - it's a complex cryptographic operation that takes a point on the curve and a scalar (big number) and produces a new point. This operation is essential for zero-knowledge proofs and other advanced crypto features that make Ethereum secure and private.

## Ethereum Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000007`
- **Gas Cost**: 6,000 (static cost as of Istanbul hardfork)
- **Function**: Multiplies a point on alt_bn128 curve by a scalar
- **Available**: Byzantium hardfork onwards
- **Input**: 96 bytes (3 × 32-byte values: x, y, scalar)
- **Output**: 64 bytes (2 × 32-byte coordinates: x, y)

### Mathematical Operation
- **Operation**: P × s = Q (where P is input point, s is scalar, Q is result)
- **Curve**: alt_bn128 (BN254)
- **Scalar Field**: Up to curve order (large prime number)
- **Point at Infinity**: Multiplication by 0 returns (0, 0)

## Reference Implementations

### revm Implementation
Search for `ecmul` and scalar multiplication in revm codebase.

### EIP-196 Specification
Reference the official EIP-196 for exact behavior and test vectors.

### Optimization References
- Binary method for scalar multiplication
- Montgomery ladder algorithm
- Windowed methods for performance

## Implementation Requirements

### Core Functionality
1. **Scalar Multiplication**: Multiply point by arbitrary scalar
2. **Input Validation**: Validate point is on curve, scalar in range
3. **Gas Calculation**: Static gas cost (hardfork dependent)
4. **Optimization**: Efficient scalar multiplication algorithm
5. **Edge Cases**: Zero scalar, invalid points, large scalars

### Algorithm Implementation
```zig
pub fn scalar_multiply(point: G1Point, scalar: U256) G1Point {
    if (scalar.eq(0) or point.is_zero()) {
        return G1Point{ .x = 0, .y = 0 }; // Point at infinity
    }
    
    // Binary method (double-and-add)
    var result = G1Point{ .x = 0, .y = 0 }; // Point at infinity
    var addend = point;
    var s = scalar;
    
    while (!s.eq(0)) {
        if (s.bit(0)) { // If least significant bit is 1
            result = result.add(addend);
        }
        addend = addend.double();
        s = s.shr(1);
    }
    
    return result;
}
```

## Implementation Tasks

### Task 1: Add ECMUL Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// ECMUL precompile gas costs
pub const ECMUL_GAS_COST: u64 = 6000; // Istanbul hardfork
pub const ECMUL_GAS_COST_BYZANTIUM: u64 = 40000; // Pre-Istanbul
```

### Task 2: Extend BN254 Implementation
File: `/src/evm/precompiles/bn254.zig` (extend existing)
```zig
// Add to existing G1Point implementation
pub fn scalar_multiply(self: G1Point, scalar: U256) G1Point {
    if (scalar.eq(0) or self.is_zero()) {
        return G1Point{ .x = 0, .y = 0 };
    }
    
    // Optimized binary method
    var result = G1Point{ .x = 0, .y = 0 };
    var base = self;
    var exp = scalar;
    
    while (!exp.eq(0)) {
        if (exp.and(1).eq(1)) {
            result = result.add(base);
        }
        base = base.double();
        exp = exp.shr(1);
    }
    
    return result;
}

// Optimized version using window method for better performance
pub fn scalar_multiply_windowed(self: G1Point, scalar: U256) G1Point {
    const WINDOW_SIZE = 4;
    const TABLE_SIZE = 1 << WINDOW_SIZE; // 16 entries
    
    if (scalar.eq(0) or self.is_zero()) {
        return G1Point{ .x = 0, .y = 0 };
    }
    
    // Precompute table: [0, P, 2P, 3P, ..., 15P]
    var table: [TABLE_SIZE]G1Point = undefined;
    table[0] = G1Point{ .x = 0, .y = 0 }; // Point at infinity
    table[1] = self;
    
    var i: usize = 2;
    while (i < TABLE_SIZE) : (i += 1) {
        table[i] = table[i - 1].add(self);
    }
    
    // Process scalar in windows from most significant to least
    var result = G1Point{ .x = 0, .y = 0 };
    var remaining_bits = 256;
    
    while (remaining_bits > 0) {
        const shift = if (remaining_bits >= WINDOW_SIZE) WINDOW_SIZE else remaining_bits;
        remaining_bits -= shift;
        
        // Shift result left by window size
        var j: usize = 0;
        while (j < shift) : (j += 1) {
            result = result.double();
        }
        
        // Add table entry for current window
        const window_mask = (1 << shift) - 1;
        const window_value = scalar.shr(remaining_bits).and(window_mask).to_u64();
        if (window_value > 0) {
            result = result.add(table[window_value]);
        }
    }
    
    return result;
}
```

### Task 3: Implement ECMUL Precompile
File: `/src/evm/precompiles/ecmul.zig`
```zig
const std = @import("std");
const bn254 = @import("bn254.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;
const U256 = @import("../Types/U256.ts").U256;

pub fn calculate_gas(hardfork: Hardfork) u64 {
    return switch (hardfork) {
        .ISTANBUL, .BERLIN, .LONDON, .SHANGHAI, .CANCUN => gas_constants.ECMUL_GAS_COST,
        else => gas_constants.ECMUL_GAS_COST_BYZANTIUM,
    };
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64, hardfork: Hardfork) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(hardfork);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    if (output.len < 64) return PrecompileError.InvalidOutput;
    
    // Pad input to 96 bytes if shorter
    var padded_input: [96]u8 = [_]u8{0} ** 96;
    const copy_len = @min(input.len, 96);
    @memcpy(padded_input[0..copy_len], input[0..copy_len]);
    
    // Parse input: point (64 bytes) + scalar (32 bytes)
    const point = bn254.G1Point.from_bytes(padded_input[0..64]) catch {
        // Invalid point returns zero (point at infinity)
        @memset(output[0..64], 0);
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 64 };
    };
    
    const scalar = U256.from_bytes(padded_input[64..96]);
    
    // Perform scalar multiplication
    const result_point = point.scalar_multiply(scalar);
    result_point.to_bytes(output[0..64]);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 64 };
}
```

### Task 4: Comprehensive Testing
File: `/test/evm/precompiles/ecmul_test.zig`

### Test Cases
1. **EIP-196 Test Vectors**: Official test cases
2. **Zero Scalar**: Multiplication by 0
3. **Unit Scalar**: Multiplication by 1
4. **Large Scalars**: Near curve order values
5. **Invalid Points**: Points not on curve
6. **Performance**: Large scalar multiplication timing
7. **Integration**: CALL/STATICCALL integration

### Known Test Vectors
```zig
test "ecmul known vectors" {
    // Test vector: (1, 2) × 2 = (point doubling result)
    // Test vector: (1, 2) × 0 = (0, 0)
    // Test vector: (1, 2) × 1 = (1, 2)
    // Test vector: large scalar multiplication
}
```

## Performance Optimization

### Algorithm Selection
1. **Binary Method**: Simple double-and-add for basic implementation
2. **Windowed Method**: Precompute table for 4-bit windows
3. **Montgomery Ladder**: Constant-time implementation
4. **NAF (Non-Adjacent Form)**: Reduce number of additions

### Implementation Strategy
```zig
// Performance-optimized scalar multiplication
pub fn scalar_multiply_optimized(self: G1Point, scalar: U256) G1Point {
    // Use windowed method for large scalars
    if (scalar.bit_length() > 64) {
        return self.scalar_multiply_windowed(scalar);
    } else {
        return self.scalar_multiply_binary(scalar);
    }
}
```

## Security Considerations

### Constant-Time Implementation
```zig
// Constant-time scalar multiplication to prevent timing attacks
pub fn scalar_multiply_constant_time(self: G1Point, scalar: U256) G1Point {
    var result = G1Point{ .x = 0, .y = 0 };
    var temp = self;
    
    var i: usize = 0;
    while (i < 256) : (i += 1) {
        // Always perform operations, use conditional assignment
        const bit = scalar.bit(i);
        result = conditional_add(result, temp, bit);
        temp = temp.double();
    }
    
    return result;
}

fn conditional_add(p1: G1Point, p2: G1Point, condition: bool) G1Point {
    if (condition) {
        return p1.add(p2);
    } else {
        return p1;
    }
}
```

### Input Validation
- Validate point is on curve before multiplication
- Check scalar is within valid range
- Handle edge cases gracefully
- Prevent side-channel attacks

## Integration Points

### Files to Modify
- `/src/evm/precompiles/precompiles.zig` - Add ECMUL to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add ECMUL address constant
- `/src/evm/constants/gas_constants.zig` - Add ECMUL gas constants
- `/src/evm/precompiles/bn254.zig` - Extend with scalar multiplication
- `/test/evm/precompiles/ecmul_test.zig` - New test file

### Dependencies
- Requires ECADD implementation for point addition
- Shares BN254 curve implementation with ECADD and ECPAIRING
- Uses same field arithmetic as other elliptic curve precompiles

## Performance Benchmarks

### Target Performance
- Should be competitive with Go-Ethereum implementation
- Optimize for common scalar sizes (160-256 bits)
- Balance between code size and execution speed
- Consider WASM performance characteristics

### Measurement Points
```zig
test "ecmul performance benchmarks" {
    // Benchmark different scalar sizes
    // Compare windowed vs binary methods
    // Measure memory usage
    // Test against reference implementations
}
```

## Success Criteria

1. **EIP-196 Compliance**: Passes all official test vectors
2. **Gas Accuracy**: Correct gas costs for all hardforks
3. **Performance**: Sub-millisecond execution for typical scalars
4. **Security**: Constant-time execution, no side channels
5. **Integration**: Seamless operation with existing precompiles
6. **Correctness**: Mathematically correct scalar multiplication

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Implement constant-time operations** - Prevent timing attacks
3. **Optimize for performance** - This is heavily used in ZK applications
4. **Test extensively** - Scalar multiplication has many edge cases
5. **Validate all inputs** - Handle malformed data gracefully
6. **Use proven algorithms** - Don't invent new scalar multiplication methods

## References

- [EIP-196: Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128](https://eips.ethereum.org/EIPS/eip-196)
- [Guide to Elliptic Curve Cryptography](https://link.springer.com/book/10.1007/b97644)
- [Efficient Implementation of Elliptic Curve Cryptography](https://cryptojedi.org/peter/data/eccss-20130911b.pdf)
- [Montgomery Ladder Algorithm](https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication#Montgomery_ladder)
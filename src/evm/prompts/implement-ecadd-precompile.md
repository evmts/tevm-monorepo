# Implement ECADD Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_ecadd_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_ecadd_precompile feat_implement_ecadd_precompile`
3. **Work in isolation**: `cd g/feat_implement_ecadd_precompile`
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

Implement the ECADD precompile (address 0x06) for Ethereum Virtual Machine compatibility. This precompile provides elliptic curve point addition on the alt_bn128 curve and is available from the Byzantium hardfork.

## Relevant Implementation Files

**Primary Files to Modify:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Supporting Files:**
- `/src/evm/precompiles/precompile_addresses.zig` - Address constants
- `/src/evm/precompiles/precompile_gas.zig` - Gas calculation for precompiles
- `/src/evm/precompiles/precompile_result.zig` - Result types for precompile execution

**New Files to Create:**
- `/src/evm/precompiles/ecadd.zig` - ECADD precompile implementation
- `/src/evm/precompiles/bn254.zig` - BN254 elliptic curve mathematics

**Test Files:**
- `/test/evm/precompiles/` (directory) - Precompile test infrastructure
- `/test/evm/precompiles/ecadd_test.zig` - ECADD specific tests

**Why These Files:**
- The main precompile dispatcher needs to route calls to the ECADD implementation
- Address constants define the precompile address (0x06)
- New implementation files handle elliptic curve point addition on alt_bn128 curve
- Comprehensive tests ensure EIP-196 compliance

## ELI5

Elliptic curves are special mathematical curves used in cryptography. ECADD is like a calculator that can "add" two points on a specific elliptic curve called alt_bn128. This isn't regular addition - it's a special mathematical operation where you take two points on the curve and get a third point that's also on the curve. This is crucial for advanced cryptographic protocols like zkSNARKs (zero-knowledge proofs) that help make blockchain transactions private and efficient. Having this as a precompile means smart contracts can do this complex math without having to implement all the curve arithmetic themselves.

## Ethereum Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000006`
- **Gas Cost**: 150 (static cost as of Istanbul hardfork)
- **Function**: Adds two points on the alt_bn128 elliptic curve
- **Available**: Byzantium hardfork onwards
- **Input**: 128 bytes (4 × 32-byte coordinates: x1, y1, x2, y2)
- **Output**: 64 bytes (2 × 32-byte coordinates: x, y)

### Curve Parameters
- **Curve**: alt_bn128 (also known as BN254)
- **Field Prime**: 21888242871839275222246405745257275088696311157297823662689037894645226208583
- **Curve Equation**: y² = x³ + 3
- **Point at Infinity**: Represented as (0, 0) in output

## Reference Implementations

### revm Implementation
Search for `bn` and `ecadd` in revm codebase for elliptic curve implementations.

### EIP-196 Specification
Reference the official EIP-196 for exact behavior and test vectors.

### Rust Libraries
- `ark-bn254` - High-performance elliptic curve library
- `blst` - Fast BLS signature library with BN254 support

## Implementation Requirements

### Core Functionality
1. **Point Addition**: Add two elliptic curve points
2. **Input Validation**: Validate points are on curve
3. **Gas Calculation**: Static 150 gas cost
4. **Error Handling**: Invalid points, malformed input
5. **Point at Infinity**: Proper handling of identity element

### Mathematical Operations
```zig
// Point representation
pub const G1Point = struct {
    x: U256,
    y: U256,
    
    pub fn is_valid(self: G1Point) bool {
        // Check if point is on curve: y² = x³ + 3 (mod p)
    }
    
    pub fn is_zero(self: G1Point) bool {
        return self.x == 0 and self.y == 0;
    }
    
    pub fn add(self: G1Point, other: G1Point) G1Point {
        // Elliptic curve point addition
    }
};
```

## Implementation Tasks

### Task 1: Add ECADD Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// ECADD precompile gas costs
pub const ECADD_GAS_COST: u64 = 150; // Istanbul hardfork
pub const ECADD_GAS_COST_BYZANTIUM: u64 = 500; // Pre-Istanbul
```

### Task 2: Implement Elliptic Curve Math
File: `/src/evm/precompiles/bn254.zig`
```zig
const std = @import("std");
const U256 = @import("../Types/U256.ts").U256;

// BN254 field prime
pub const FIELD_PRIME: U256 = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

pub const G1Point = struct {
    x: U256,
    y: U256,
    
    pub fn from_bytes(input: []const u8) !G1Point {
        if (input.len != 64) return error.InvalidInput;
        
        const x = U256.from_bytes(input[0..32]);
        const y = U256.from_bytes(input[32..64]);
        
        const point = G1Point{ .x = x, .y = y };
        if (!point.is_valid()) return error.InvalidPoint;
        
        return point;
    }
    
    pub fn to_bytes(self: G1Point, output: []u8) void {
        self.x.to_bytes(output[0..32]);
        self.y.to_bytes(output[32..64]);
    }
    
    pub fn is_valid(self: G1Point) bool {
        if (self.is_zero()) return true; // Point at infinity
        
        // Check y² = x³ + 3 (mod p)
        const y_squared = self.y.mul(self.y).mod(FIELD_PRIME);
        const x_cubed = self.x.mul(self.x).mul(self.x).mod(FIELD_PRIME);
        const rhs = x_cubed.add(3).mod(FIELD_PRIME);
        
        return y_squared.eq(rhs);
    }
    
    pub fn is_zero(self: G1Point) bool {
        return self.x.eq(0) and self.y.eq(0);
    }
    
    pub fn add(self: G1Point, other: G1Point) G1Point {
        // Handle point at infinity cases
        if (self.is_zero()) return other;
        if (other.is_zero()) return self;
        
        // Handle point doubling
        if (self.x.eq(other.x)) {
            if (self.y.eq(other.y)) {
                return self.double();
            } else {
                // Points are inverses, return point at infinity
                return G1Point{ .x = 0, .y = 0 };
            }
        }
        
        // Standard point addition formula
        const dx = other.x.sub(self.x).mod(FIELD_PRIME);
        const dy = other.y.sub(self.y).mod(FIELD_PRIME);
        const slope = dy.mul(dx.mod_inverse(FIELD_PRIME)).mod(FIELD_PRIME);
        
        const x3 = slope.mul(slope).sub(self.x).sub(other.x).mod(FIELD_PRIME);
        const y3 = slope.mul(self.x.sub(x3)).sub(self.y).mod(FIELD_PRIME);
        
        return G1Point{ .x = x3, .y = y3 };
    }
    
    fn double(self: G1Point) G1Point {
        if (self.is_zero()) return self;
        
        // Point doubling formula
        const three_x_squared = self.x.mul(self.x).mul(3).mod(FIELD_PRIME);
        const two_y = self.y.mul(2).mod(FIELD_PRIME);
        const slope = three_x_squared.mul(two_y.mod_inverse(FIELD_PRIME)).mod(FIELD_PRIME);
        
        const x3 = slope.mul(slope).sub(self.x.mul(2)).mod(FIELD_PRIME);
        const y3 = slope.mul(self.x.sub(x3)).sub(self.y).mod(FIELD_PRIME);
        
        return G1Point{ .x = x3, .y = y3 };
    }
};
```

### Task 3: Implement ECADD Precompile
File: `/src/evm/precompiles/ecadd.zig`
```zig
const std = @import("std");
const bn254 = @import("bn254.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;

pub fn calculate_gas(hardfork: Hardfork) u64 {
    return switch (hardfork) {
        .ISTANBUL, .BERLIN, .LONDON, .SHANGHAI, .CANCUN => gas_constants.ECADD_GAS_COST,
        else => gas_constants.ECADD_GAS_COST_BYZANTIUM,
    };
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64, hardfork: Hardfork) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(hardfork);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    if (output.len < 64) return PrecompileError.InvalidOutput;
    
    // Pad input to 128 bytes if shorter
    var padded_input: [128]u8 = [_]u8{0} ** 128;
    const copy_len = @min(input.len, 128);
    @memcpy(padded_input[0..copy_len], input[0..copy_len]);
    
    // Parse input points
    const point1 = bn254.G1Point.from_bytes(padded_input[0..64]) catch {
        // Invalid points return zero (point at infinity)
        @memset(output[0..64], 0);
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 64 };
    };
    
    const point2 = bn254.G1Point.from_bytes(padded_input[64..128]) catch {
        // Invalid points return zero (point at infinity)
        @memset(output[0..64], 0);
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 64 };
    };
    
    // Perform point addition
    const result_point = point1.add(point2);
    result_point.to_bytes(output[0..64]);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 64 };
}
```

### Task 4: Comprehensive Testing
File: `/test/evm/precompiles/ecadd_test.zig`

### Test Cases
1. **EIP-196 Test Vectors**: Official test cases from the EIP
2. **Point at Infinity**: Addition with zero point
3. **Invalid Points**: Points not on curve
4. **Point Doubling**: Adding point to itself
5. **Gas Calculation**: Verify correct gas costs by hardfork
6. **Edge Cases**: Maximum field values, malformed input
7. **Integration**: Test via CALL/STATICCALL opcodes

### Known Test Vectors
```zig
test "ecadd known vectors" {
    // Test vector from EIP-196
    // Input: (1, 2) + (1, 2) = point doubling
    // Expected output: specific coordinates
    
    // Test vector: addition resulting in point at infinity
    // Input: (1, 2) + (1, -2) = (0, 0)
}
```

## Integration Points

### Files to Modify
- `/src/evm/precompiles/precompiles.zig` - Add ECADD to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add ECADD address constant
- `/src/evm/constants/gas_constants.zig` - Add ECADD gas constants
- `/test/evm/precompiles/ecadd_test.zig` - New test file

### Hardfork Integration
- Byzantium: First introduction with 500 gas cost
- Istanbul: Reduced to 150 gas cost
- All subsequent hardforks: 150 gas cost

## Performance Considerations

### Optimization Strategies
1. **Field Arithmetic**: Optimized modular arithmetic for BN254 field
2. **Montgomery Representation**: Use Montgomery form for faster multiplication
3. **Precomputed Constants**: Cache frequently used curve parameters
4. **SIMD**: Vectorized operations where applicable

### Memory Management
```zig
// Efficient point operations without allocations
pub fn add_no_alloc(p1: G1Point, p2: G1Point, result: *G1Point) void {
    // In-place point addition
}
```

## Security Considerations

### Input Validation
- Verify points are on the correct curve
- Handle malformed input gracefully
- Prevent integer overflow in field operations
- Validate field element ranges

### Constant-Time Operations
- Ensure timing attacks are not possible
- Use constant-time field arithmetic
- Avoid conditional branches on secret data

## Success Criteria

1. **EIP-196 Compliance**: Passes all official test vectors
2. **Gas Accuracy**: Correct gas costs for all hardforks
3. **Mathematical Correctness**: Proper elliptic curve operations
4. **Performance**: Competitive with reference implementations
5. **Security**: Constant-time execution, proper validation
6. **Integration**: Works with existing precompile infrastructure

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use constant-time arithmetic** - Prevent timing attacks
3. **Validate all inputs thoroughly** - Handle malformed data gracefully
4. **Test against EIP-196 vectors** - Ensure specification compliance
5. **Handle edge cases** - Point at infinity, invalid points, etc.
6. **Optimize for performance** - This is a hot path in many applications

## References

- [EIP-196: Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128](https://eips.ethereum.org/EIPS/eip-196)
- [BN254 Curve Specification](https://tools.ietf.org/id/draft-yoneyama-pairing-friendly-curves-02.html)
- [Elliptic Curve Point Addition](https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication)
- [Montgomery Arithmetic](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication)
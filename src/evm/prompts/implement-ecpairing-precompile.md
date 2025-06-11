# Implement ECPAIRING Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_ecpairing_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_ecpairing_precompile feat_implement_ecpairing_precompile`
3. **Work in isolation**: `cd g/feat_implement_ecpairing_precompile`
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

Implement the ECPAIRING precompile (address 0x08) for Ethereum Virtual Machine compatibility. This precompile performs pairing checks on the alt_bn128 curve and is critical for zkSNARK verification. Available from Byzantium hardfork.

## ELI5

Pairing is like a super-advanced cryptographic function that can check if multiple cryptographic "puzzles" fit together correctly. Imagine you have several pairs of special cryptographic keys, and you need to verify that they all work together as intended. The pairing operation does this verification in a way that's essential for zero-knowledge proofs (zkSNARKs) - allowing someone to prove they know something without revealing what they know. This is the most mathematically complex precompile in Ethereum.

## Ethereum Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000008`
- **Gas Cost**: 45,000 + 34,000 × k (where k is number of pairs, Istanbul hardfork)
- **Function**: Pairing check on alt_bn128 curve (e(a1, b1) × e(a2, b2) × ... = 1)
- **Available**: Byzantium hardfork onwards
- **Input**: 192k bytes (k pairs of G1 and G2 points)
- **Output**: 32 bytes (1 if pairing equals identity, 0 otherwise)

### Pairing Operation
- **Curve**: alt_bn128 (BN254) with embedding degree 12
- **Groups**: G1 (base field), G2 (quadratic extension), GT (12th extension)
- **Check**: Verifies if product of pairings equals identity element
- **Applications**: zkSNARKs, BLS signatures, identity-based cryptography

## Reference Implementations

### revm Implementation
Search for `pairing` and `bn254` in revm codebase for implementation patterns.

### EIP-197 Specification
Reference the official EIP-197 for exact behavior and test vectors.

### Cryptographic Libraries
- `ark-bn254` - Comprehensive pairing implementation
- `blst` - High-performance pairing library
- Academic papers on optimal ate pairing

## Implementation Requirements

### Core Functionality
1. **Pairing Computation**: Optimal ate pairing on BN254
2. **Input Parsing**: Parse G1 and G2 points from input
3. **Input Validation**: Verify points are valid and on correct curves
4. **Gas Calculation**: Dynamic gas based on number of pairs
5. **Final Exponentiation**: Complete pairing computation

### Mathematical Components
```zig
// G2 point in BN254 (quadratic extension field)
pub const G2Point = struct {
    x: Fq2, // x-coordinate in Fq2
    y: Fq2, // y-coordinate in Fq2
    
    pub fn is_valid(self: G2Point) bool {
        // Check if point is on G2 curve: y² = x³ + 3/(9+u)
    }
    
    pub fn is_zero(self: G2Point) bool {
        // Point at infinity representation
    }
};

// Quadratic extension field Fq2 = Fq[u]/(u²+1)
pub const Fq2 = struct {
    c0: U256, // Real part
    c1: U256, // Imaginary part
    
    pub fn mul(self: Fq2, other: Fq2) Fq2 {
        // (a + bu)(c + du) = (ac - bd) + (ad + bc)u
    }
    
    pub fn square(self: Fq2) Fq2 {
        // Optimized squaring in Fq2
    }
};
```

## Implementation Tasks

### Task 1: Add ECPAIRING Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// ECPAIRING precompile gas costs
pub const ECPAIRING_BASE_GAS: u64 = 45000; // Istanbul hardfork
pub const ECPAIRING_PAIR_GAS: u64 = 34000; // Per pair, Istanbul
pub const ECPAIRING_BASE_GAS_BYZANTIUM: u64 = 100000; // Pre-Istanbul
pub const ECPAIRING_PAIR_GAS_BYZANTIUM: u64 = 80000; // Per pair, pre-Istanbul
```

### Task 2: Implement Field Extensions
File: `/src/evm/precompiles/bn254_fields.zig`
```zig
const std = @import("std");
const U256 = @import("../Types/U256.ts").U256;

// Base field Fq for BN254
pub const FIELD_PRIME: U256 = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

// Quadratic extension Fq2 = Fq[u]/(u²+1)
pub const Fq2 = struct {
    c0: U256, // Real part
    c1: U256, // Imaginary part
    
    pub fn zero() Fq2 {
        return Fq2{ .c0 = 0, .c1 = 0 };
    }
    
    pub fn one() Fq2 {
        return Fq2{ .c0 = 1, .c1 = 0 };
    }
    
    pub fn add(self: Fq2, other: Fq2) Fq2 {
        return Fq2{
            .c0 = self.c0.add(other.c0).mod(FIELD_PRIME),
            .c1 = self.c1.add(other.c1).mod(FIELD_PRIME),
        };
    }
    
    pub fn mul(self: Fq2, other: Fq2) Fq2 {
        // (a + bu)(c + du) = (ac - bd) + (ad + bc)u
        // where u² = -1 in this representation
        const ac = self.c0.mul(other.c0).mod(FIELD_PRIME);
        const bd = self.c1.mul(other.c1).mod(FIELD_PRIME);
        const ad = self.c0.mul(other.c1).mod(FIELD_PRIME);
        const bc = self.c1.mul(other.c0).mod(FIELD_PRIME);
        
        return Fq2{
            .c0 = ac.sub(bd).mod(FIELD_PRIME),
            .c1 = ad.add(bc).mod(FIELD_PRIME),
        };
    }
    
    pub fn square(self: Fq2) Fq2 {
        // Optimized: (a + bu)² = (a² - b²) + 2abu
        const a_squared = self.c0.mul(self.c0).mod(FIELD_PRIME);
        const b_squared = self.c1.mul(self.c1).mod(FIELD_PRIME);
        const two_ab = self.c0.mul(self.c1).mul(2).mod(FIELD_PRIME);
        
        return Fq2{
            .c0 = a_squared.sub(b_squared).mod(FIELD_PRIME),
            .c1 = two_ab,
        };
    }
    
    pub fn inverse(self: Fq2) Fq2 {
        // 1/(a + bu) = (a - bu)/(a² + b²)
        const norm = self.c0.mul(self.c0).add(self.c1.mul(self.c1)).mod(FIELD_PRIME);
        const norm_inv = norm.mod_inverse(FIELD_PRIME);
        
        return Fq2{
            .c0 = self.c0.mul(norm_inv).mod(FIELD_PRIME),
            .c1 = FIELD_PRIME.sub(self.c1.mul(norm_inv)).mod(FIELD_PRIME),
        };
    }
};

// 12th extension field Fq12 for pairing target group
pub const Fq12 = struct {
    // Represented as tower: Fq12 = Fq6[w]/(w²-v), Fq6 = Fq2[v]/(v³-ξ)
    c0: Fq6, // Coefficient of w⁰
    c1: Fq6, // Coefficient of w¹
    
    // Implementation of Fq12 arithmetic...
};
```

### Task 3: Implement G2 Points
File: `/src/evm/precompiles/bn254.zig` (extend existing)
```zig
// Add G2 point implementation
pub const G2Point = struct {
    x: Fq2,
    y: Fq2,
    
    pub fn from_bytes(input: []const u8) !G2Point {
        if (input.len != 128) return error.InvalidInput;
        
        // Parse 4 × 32-byte field elements (x.c1, x.c0, y.c1, y.c0)
        const x_c1 = U256.from_bytes(input[0..32]);
        const x_c0 = U256.from_bytes(input[32..64]);
        const y_c1 = U256.from_bytes(input[64..96]);
        const y_c0 = U256.from_bytes(input[96..128]);
        
        const point = G2Point{
            .x = Fq2{ .c0 = x_c0, .c1 = x_c1 },
            .y = Fq2{ .c0 = y_c0, .c1 = y_c1 },
        };
        
        if (!point.is_valid()) return error.InvalidPoint;
        return point;
    }
    
    pub fn is_valid(self: G2Point) bool {
        if (self.is_zero()) return true;
        
        // Check y² = x³ + 3/(9+u) where (9+u)⁻¹ = (9-u)/82
        const rhs = self.x.square().mul(self.x).add(G2_B);
        const lhs = self.y.square();
        return lhs.eq(rhs);
    }
    
    pub fn is_zero(self: G2Point) bool {
        return self.x.eq(Fq2.zero()) and self.y.eq(Fq2.zero());
    }
};

// G2 curve parameter: 3/(9+u)
const G2_B = Fq2{
    .c0 = 19485874751759354771024239261021720505790618469301721065564631296452457478373,
    .c1 = 266929791119991161246907387137283842545076965332900288569378510910307636690,
};
```

### Task 4: Implement Pairing Algorithm
File: `/src/evm/precompiles/pairing.zig`
```zig
const std = @import("std");
const bn254 = @import("bn254.zig");
const fields = @import("bn254_fields.zig");

pub fn pairing_check(pairs: []const PairingInput) bool {
    if (pairs.len == 0) return true; // Empty input returns true
    
    var result = fields.Fq12.one();
    
    for (pairs) |pair| {
        const pairing_result = optimal_ate_pairing(pair.g1, pair.g2);
        result = result.mul(pairing_result);
    }
    
    // Final exponentiation
    result = final_exponentiation(result);
    
    // Check if result equals 1 (identity element)
    return result.eq(fields.Fq12.one());
}

fn optimal_ate_pairing(g1: bn254.G1Point, g2: bn254.G2Point) fields.Fq12 {
    // Optimal ate pairing implementation
    // This is a complex algorithm involving:
    // 1. Miller loop with specific BN254 parameters
    // 2. Line functions and point doubling/addition in G2
    // 3. Evaluation of line functions at G1 points
    
    if (g1.is_zero() or g2.is_zero()) {
        return fields.Fq12.one();
    }
    
    // Miller loop implementation
    var f = fields.Fq12.one();
    var t = g2;
    
    // BN254 optimal ate loop length (trace - 1)
    const ATE_LOOP_COUNT: u64 = 29793968203157093288; // 6u + 2
    
    var i: usize = 62; // bit length - 1
    while (i > 0) {
        i -= 1;
        
        // Square f and double T
        f = f.square();
        const line = line_double(&t, g1);
        f = f.mul(line);
        
        if (((ATE_LOOP_COUNT >> i) & 1) == 1) {
            const line_add = line_add_mixed(&t, g2, g1);
            f = f.mul(line_add);
        }
    }
    
    // Additional steps for BN curves
    // ...
    
    return f;
}

fn final_exponentiation(f: fields.Fq12) fields.Fq12 {
    // Final exponentiation: f^((q^12 - 1) / r)
    // This is split into easy and hard parts for efficiency
    
    // Easy part: f^(q^6 - 1)
    const f_conj = f.frobenius(6); // f^(q^6)
    const f_inv = f.inverse();
    var result = f_conj.mul(f_inv);
    
    // Hard part: specific to BN254
    result = hard_part_exponentiation(result);
    
    return result;
}

const PairingInput = struct {
    g1: bn254.G1Point,
    g2: bn254.G2Point,
};
```

### Task 5: Implement ECPAIRING Precompile
File: `/src/evm/precompiles/ecpairing.zig`
```zig
const std = @import("std");
const bn254 = @import("bn254.zig");
const pairing = @import("pairing.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;

pub fn calculate_gas(input_size: usize, hardfork: Hardfork) u64 {
    if (input_size % 192 != 0) return 0; // Invalid input
    const num_pairs = input_size / 192;
    
    return switch (hardfork) {
        .ISTANBUL, .BERLIN, .LONDON, .SHANGHAI, .CANCUN => {
            gas_constants.ECPAIRING_BASE_GAS + gas_constants.ECPAIRING_PAIR_GAS * @as(u64, @intCast(num_pairs))
        },
        else => {
            gas_constants.ECPAIRING_BASE_GAS_BYZANTIUM + gas_constants.ECPAIRING_PAIR_GAS_BYZANTIUM * @as(u64, @intCast(num_pairs))
        },
    };
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64, hardfork: Hardfork) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input.len, hardfork);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    if (output.len < 32) return PrecompileError.InvalidOutput;
    
    // Input must be multiple of 192 bytes (6 × 32 per pair)
    if (input.len % 192 != 0) {
        // Invalid input length
        @memset(output[0..32], 0);
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
    }
    
    const num_pairs = input.len / 192;
    var pairs = std.ArrayList(pairing.PairingInput).init(std.heap.page_allocator);
    defer pairs.deinit();
    
    // Parse all pairs
    var i: usize = 0;
    while (i < num_pairs) : (i += 1) {
        const offset = i * 192;
        
        // Parse G1 point (64 bytes)
        const g1 = bn254.G1Point.from_bytes(input[offset..offset + 64]) catch {
            // Invalid G1 point
            @memset(output[0..32], 0);
            return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
        };
        
        // Parse G2 point (128 bytes)
        const g2 = bn254.G2Point.from_bytes(input[offset + 64..offset + 192]) catch {
            // Invalid G2 point
            @memset(output[0..32], 0);
            return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
        };
        
        try pairs.append(pairing.PairingInput{ .g1 = g1, .g2 = g2 });
    }
    
    // Perform pairing check
    const result = pairing.pairing_check(pairs.items);
    
    // Write result (1 if true, 0 if false)
    @memset(output[0..32], 0);
    if (result) {
        output[31] = 1;
    }
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}
```

## Performance Considerations

### Critical Optimizations
1. **Field Arithmetic**: Highly optimized Fq, Fq2, Fq12 operations
2. **Miller Loop**: Efficient line function computations
3. **Final Exponentiation**: Use cyclotomic subgroup properties
4. **Memory Management**: Avoid allocations in hot paths
5. **Lazy Reduction**: Minimize modular reductions

### Implementation Strategy
- Use Montgomery representation for field elements
- Implement specialized squaring and multiplication
- Optimize frobenius operations
- Cache commonly used constants

## Security Considerations

### Input Validation
- Verify all points are on correct curves
- Check field elements are in valid range
- Handle edge cases (points at infinity)
- Prevent malformed input from causing crashes

### Constant-Time Operations
- Implement constant-time field arithmetic where possible
- Avoid conditional branches on secret data
- Use secure random number generation if needed

## Integration Points

### Files to Modify
- `/src/evm/precompiles/precompiles.zig` - Add ECPAIRING to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add ECPAIRING address
- `/src/evm/constants/gas_constants.zig` - Add ECPAIRING gas constants
- `/src/evm/precompiles/bn254.zig` - Extend with G2 points
- `/test/evm/precompiles/ecpairing_test.zig` - New comprehensive tests

### Dependencies
- Requires ECADD and ECMUL for elliptic curve operations
- Needs optimized field arithmetic for Fq, Fq2, Fq12
- Depends on proper input validation and error handling

## Success Criteria

1. **EIP-197 Compliance**: Passes all official test vectors
2. **Performance**: Competitive pairing computation speed
3. **Gas Accuracy**: Correct gas costs for all hardforks
4. **zkSNARK Compatibility**: Works with real zkSNARK verifiers
5. **Security**: Constant-time operations, proper validation
6. **Integration**: Seamless operation with existing precompiles

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test against EIP-197 vectors** - Pairing is mathematically complex
3. **Optimize aggressively** - This is the most expensive precompile
4. **Validate inputs thoroughly** - Invalid curves can cause undefined behavior
5. **Handle edge cases** - Points at infinity, empty input, etc.
6. **Consider WASM performance** - Pairing is compute-intensive

## References

- [EIP-197: Precompiled contracts for optimal ate pairing check on the elliptic curve alt_bn128](https://eips.ethereum.org/EIPS/eip-197)
- [Optimal Ate Pairing over BN Curves](https://eprint.iacr.org/2008/096.pdf)
- [BN254 Curve Implementation Guide](https://hackmd.io/@jpw/bn254)
- [Pairing-Based Cryptography Library](https://github.com/arkworks-rs/curves/tree/master/bn254)
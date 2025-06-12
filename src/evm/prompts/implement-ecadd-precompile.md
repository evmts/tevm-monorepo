# Implement ECADD Precompile

<<<<<<< HEAD
You are implementing ECADD Precompile for the Tevm EVM written in Zig. Your goal is to implement elliptic curve addition precompile for secp256k1 following Ethereum specifications and maintaining compatibility with existing implementations.

=======
<review>
**Implementation Status: NOT IMPLEMENTED ❌ - INCORRECT PREVIOUS STATUS**

**Previous Status Was Wrong:**
- ❌ **NO ECADD.ZIG EXISTS**: The file `src/evm/precompiles/ecadd.zig` does not exist
- ❌ **NO BN254.ZIG EXISTS**: The file `src/evm/precompiles/bn254.zig` does not exist
- ❌ **RETURNS EXECUTION FAILED**: precompiles.zig:122 returns ExecutionFailed for address 0x06
- ❌ **NOT INTEGRATED**: estimate_gas() returns NotImplemented for ECADD

**Current Reality:**
- ❌ No ECADD implementation in src/evm/precompiles/
- ❌ precompiles.zig comments show "ECADD - TODO"
- ❌ No BN254 elliptic curve mathematics implementation
- ❌ Smart contracts using ecAdd() will fail with ExecutionFailed

**Implementation Requirements:**
- Create src/evm/precompiles/ecadd.zig
- Implement BN254 elliptic curve point addition (EIP-196)
- 128-byte input: x1(32) + y1(32) + x2(32) + y2(32) - big-endian
- 64-byte output: x(32) + y(32) - point addition result
- Gas cost: 500 (Byzantium) → 150 (Istanbul+) per EIP-1108
- Handle point-at-infinity correctly
- Validate points are on curve y² = x³ + 3

**Security Requirements:**
- Use established BN254 curve implementation (NOT custom crypto)
- Point validation to prevent invalid curve attacks
- Proper modular arithmetic for field operations
- Handle edge cases (point at infinity, invalid points)

**Priority: MEDIUM-HIGH - Important for ZK applications and cryptographic contracts**
</review>
- ✅ Comprehensive input validation and bounds checking
- ✅ Performance optimized with branch hints for hot/cold paths
- ✅ Proper hardfork gas cost handling (Byzantium 500 → Istanbul+ 150)

**Overall Assessment: Fully implemented and production-ready ECADD precompile with excellent test coverage and EIP-196 compliance.**
</review>

You are implementing ECADD Precompile for the Tevm EVM written in Zig. Your goal is to implement elliptic curve addition precompile for secp256k1 following Ethereum specifications and maintaining compatibility with existing implementations.

>>>>>>> origin/main
## Development Workflow
- **Branch**: `feat_implement_ecadd_precompile` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_ecadd_precompile feat_implement_ecadd_precompile`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement the ECADD precompile (address 0x06) for Ethereum Virtual Machine compatibility. This precompile provides elliptic curve point addition on the alt_bn128 curve and is available from the Byzantium hardfork.

## File Structure

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

## 🚨 CRITICAL SECURITY WARNING: DO NOT IMPLEMENT CUSTOM CRYPTO

**❌ NEVER IMPLEMENT CRYPTOGRAPHIC ALGORITHMS FROM SCRATCH**

This prompt involves elliptic curve cryptography. Follow these security principles:

### ✅ **DO THIS:**
- **Use established crypto libraries** (noble-curves for BN254, arkworks-rs bindings)
- **Import proven implementations** from well-audited libraries
- **Follow reference implementations** from go-ethereum, revm, evmone exactly
- **Use official test vectors** from EIP-196 and EIP-197 specifications
- **Implement constant-time algorithms** to prevent timing attacks
- **Validate all curve points** are on the correct curve and in correct subgroup

### ❌ **NEVER DO THIS:**
- Write your own elliptic curve point addition or field arithmetic
- Implement BN254/alt_bn128 curve operations "from scratch" or "for learning"
- Modify cryptographic algorithms or add "optimizations"
- Copy-paste crypto code from tutorials or unofficial sources
- Implement crypto without extensive peer review and testing
- Skip subgroup checks or point validation

### 🎯 **Implementation Strategy:**
1. **First choice**: Use noble-curves BN254 implementation (WASM compatible)
2. **Second choice**: Bind to arkworks-rs or other audited Rust crypto libraries
3. **Third choice**: Use established C libraries (libff, mcl)
4. **Never**: Write custom elliptic curve implementations

**Remember**: ECADD is critical for zkSNARKs and privacy protocols. Bugs can compromise zero-knowledge proofs, leak private information, and break cryptographic protocols. Always use proven, audited implementations.

## Specification

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
const U256 = @import("../Types/U256.zig").U256;

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

#### 1. **Unit Tests** (`/test/evm/precompiles/ecadd_test.zig`)
```zig
// Test basic elliptic curve addition functionality
test "ecadd basic functionality with known vectors"
test "ecadd handles edge cases correctly"
test "ecadd validates input format"
test "ecadd produces correct output format"
```

#### 2. **Input Validation Tests**
```zig
test "ecadd handles various input lengths"
test "ecadd validates input parameters"
test "ecadd rejects invalid inputs gracefully"
test "ecadd handles empty input"
```

#### 3. **Gas Calculation Tests**
```zig
test "ecadd gas cost calculation accuracy"
test "ecadd gas cost edge cases"
test "ecadd gas overflow protection"
test "ecadd gas deduction in EVM context"
```

#### 4. **Specification Compliance Tests**
```zig
test "ecadd matches specification test vectors"
test "ecadd matches reference implementation output"
test "ecadd hardfork availability requirements"
test "ecadd address registration correct"
```

#### 5. **Performance Tests**
```zig
test "ecadd performance with large inputs"
test "ecadd memory efficiency"
test "ecadd WASM bundle size impact"
test "ecadd benchmark against reference implementations"
```

#### 6. **Error Handling Tests**
```zig
test "ecadd error propagation"
test "ecadd proper error types returned"
test "ecadd handles corrupted input gracefully"
test "ecadd never panics on malformed input"
```

#### 7. **Integration Tests**
```zig
test "ecadd precompile registration"
test "ecadd called from EVM execution"
test "ecadd gas deduction in EVM context"
test "ecadd hardfork availability"
```

### Test Development Priority
1. **Start with specification test vectors** - Ensures spec compliance from day one
2. **Add input validation** - Prevents invalid states early
3. **Implement gas calculation** - Core economic security
4. **Add performance benchmarks** - Ensures production readiness
5. **Test error cases** - Robust error handling

### Test Data Sources
- **EIP/Specification test vectors**: Primary compliance verification
- **Reference implementation tests**: Cross-client compatibility
- **Mathematical test vectors**: Algorithm correctness
- **Edge case generation**: Boundary value testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public functions
- Validate performance benchmarks don't regress
- Test both debug and release builds

### Test-First Examples

**Before writing any implementation:**
```zig
test "ecadd basic functionality" {
    // This test MUST fail initially
    const input = test_vectors.valid_input;
    const expected = test_vectors.expected_output;
    
    const result = ecadd.run(input);
    try testing.expectEqualSlices(u8, expected, result);
}
```

**Only then implement:**
```zig
pub fn run(input: []const u8) ![]u8 {
    // Minimal implementation to make test pass
    return error.NotImplemented; // Initially
}
```

## References

- [EIP-196: Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128](https://eips.ethereum.org/EIPS/eip-196)
- [BN254 Curve Specification](https://tools.ietf.org/id/draft-yoneyama-pairing-friendly-curves-02.html)
- [Elliptic Curve Point Addition](https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication)
- [Montgomery Arithmetic](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication)
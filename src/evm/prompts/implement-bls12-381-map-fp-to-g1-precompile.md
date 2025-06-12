# Implement BLS12-381 MAP_FP_TO_G1 Precompile

You are implementing BLS12-381 MAP_FP_TO_G1 Precompile for the Tevm EVM written in Zig. Your goal is to implement BLS12-381 map field element to G1 precompile following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_bls` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_bls feat_implement_bls`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement the BLS12-381 MAP_FP_TO_G1 precompile (address 0x10) as defined in EIP-2537. This precompile maps a field element to a point on the G1 curve using a deterministic hash-to-curve algorithm, essential for hash-to-curve operations in BLS signature schemes.

## ELI5

Imagine you have a random number and you want to convert it into a valid point on the BLS12-381 curve - like turning a random coordinate into a valid location on a specific curved road. The MAP_FP_TO_G1 precompile does exactly this: it takes a field element (a special kind of number that fits within the BLS12-381 system) and deterministically maps it to a G1 point on the curve. This is essential for "hash-to-curve" operations, where you need to convert hash values or other data into valid curve points. Think of it like having a GPS that can take any random coordinate and snap it to the nearest valid road - but in this case, the "road" is the mathematical curve. This operation is used in advanced signature schemes and cryptographic protocols where you need to convert arbitrary data into curve points for further processing.

## 🚨 CRITICAL SECURITY WARNING: DO NOT IMPLEMENT CUSTOM CRYPTO

**❌ NEVER IMPLEMENT CRYPTOGRAPHIC ALGORITHMS FROM SCRATCH**

This prompt involves BLS12-381 hash-to-curve operations. Follow these security principles:

### ✅ **DO THIS:**
- **Use blst library** - The only production-ready BLS12-381 implementation
- **Import proven implementations** from well-audited libraries (blst, arkworks-rs)
- **Follow reference implementations** from go-ethereum, revm, evmone exactly
- **Use official test vectors** from EIP-2537 and hash-to-curve standards
- **Implement deterministic algorithms** - same input must always produce same output
- **Use standard hash-to-curve methods** (SWU, SVDW) from RFCs

### ❌ **NEVER DO THIS:**
- Write your own hash-to-curve or field-to-curve mapping algorithms
- Implement BLS12-381 curve operations "from scratch" or "for learning"
- Modify cryptographic algorithms or add "optimizations"
- Copy-paste crypto code from tutorials or unofficial sources
- Implement crypto without extensive peer review and testing
- Use non-standard or custom mapping functions

### 🎯 **Implementation Strategy:**
1. **ONLY choice**: Use blst library (Ethereum Foundation standard)
2. **Fallback**: Use arkworks-rs BLS12-381 with proven hash-to-curve
3. **Never**: Write custom field-to-curve mapping implementations

**Remember**: Hash-to-curve is critical for BLS signatures and advanced cryptographic protocols. Non-deterministic or biased mappings can compromise security. Always use proven, standardized algorithms from RFCs.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000010`
- **Gas Cost**: 5500 (fixed cost)
- **Input**: 64 bytes (field element in Fp)
- **Output**: 128 bytes (G1 point)
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input (64 bytes):
- Field element in Fp (64 bytes, big-endian)

Requirements:
- Input must be a valid field element (< BLS12-381 prime modulus)
- Invalid field elements should cause the operation to fail
```

### Output Format
```
Output (128 bytes):
- G1 point in uncompressed format
- x coordinate (64 bytes)
- y coordinate (64 bytes)
```

## Implementation Requirements

### Core Functionality
1. **Field Validation**: Verify input is valid Fp element
2. **Hash-to-Curve**: Implement deterministic map from Fp to G1
3. **Point Validation**: Ensure output point is on curve and in subgroup
4. **Deterministic Mapping**: Same input always produces same output
5. **Error Handling**: Reject invalid field elements

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_map_fp_to_g1.zig` - New MAP_FP_TO_G1 implementation
- `/src/evm/crypto/bls12_381.zig` - Hash-to-curve operations (extend)
- `/src/evm/precompiles/precompiles.zig` - Add MAP_FP_TO_G1 to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add MAP_FP_TO_G1 address
- `/src/evm/constants/gas_constants.zig` - Add MAP_FP_TO_G1 gas cost
- `/test/evm/precompiles/bls12_381_map_fp_to_g1_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 MAP_FP_TO_G1 specification
2. **Field Validation**: Correctly validates Fp field elements
3. **Mapping Correctness**: Produces valid G1 points from field elements
4. **Deterministic**: Same input always produces same output
5. **Gas Accuracy**: Consumes exactly 5500 gas per operation
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

#### 1. **Unit Tests** (`/test/evm/precompiles/bls12_381_map_fp_to_g1_test.zig`)
```zig
// Test basic BLS12-381 MAP_FP_TO_G1 functionality
test "bls12_381_map_fp_to_g1 basic functionality with known vectors"
test "bls12_381_map_fp_to_g1 handles edge cases correctly"
test "bls12_381_map_fp_to_g1 validates input format"
test "bls12_381_map_fp_to_g1 produces correct output format"
```

#### 2. **Input Validation Tests**
```zig
test "bls12_381_map_fp_to_g1 handles various input lengths"
test "bls12_381_map_fp_to_g1 validates cryptographic parameters"
test "bls12_381_map_fp_to_g1 rejects invalid inputs gracefully"
test "bls12_381_map_fp_to_g1 handles malformed field elements"
```

#### 3. **Cryptographic Correctness Tests**
```zig
test "bls12_381_map_fp_to_g1 mathematical correctness with test vectors"
test "bls12_381_map_fp_to_g1 handles edge cases in field arithmetic"
test "bls12_381_map_fp_to_g1 validates curve point membership"
test "bls12_381_map_fp_to_g1 cryptographic security properties"
```

#### 4. **Integration Tests**
```zig
test "bls12_381_map_fp_to_g1 EVM context integration"
test "bls12_381_map_fp_to_g1 called from contract execution"
test "bls12_381_map_fp_to_g1 hardfork behavior changes"
test "bls12_381_map_fp_to_g1 interaction with other precompiles"
```

#### 5. **Error Handling Tests**
```zig
test "bls12_381_map_fp_to_g1 error propagation"
test "bls12_381_map_fp_to_g1 proper error types returned"
test "bls12_381_map_fp_to_g1 handles corrupted state gracefully"
test "bls12_381_map_fp_to_g1 never panics on malformed input"
```

#### 6. **Performance Tests**
```zig
test "bls12_381_map_fp_to_g1 performance with realistic workloads"
test "bls12_381_map_fp_to_g1 memory efficiency"
test "bls12_381_map_fp_to_g1 execution time bounds"
test "bls12_381_map_fp_to_g1 benchmark against reference implementations"
```

### Test Development Priority
1. **Start with specification test vectors** - Ensures spec compliance from day one
2. **Add core functionality tests** - Critical behavior verification
3. **Implement gas/state management** - Economic and state security
4. **Add performance benchmarks** - Ensures production readiness
5. **Test error cases** - Robust error handling

### Test Data Sources
- **EIP/Specification test vectors**: Primary compliance verification
- **Reference implementation tests**: Cross-client compatibility
- **Ethereum test suite**: Official test cases
- **Edge case generation**: Boundary value and malformed input testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public functions
- Validate performance benchmarks don't regress
- Test both debug and release builds

### Test-First Examples

**Before writing any implementation:**
```zig
test "bls12_381_map_fp_to_g1 basic functionality" {
    // This test MUST fail initially
    const input = test_vectors.valid_input;
    const expected = test_vectors.expected_output;
    
    const result = bls12_381_map_fp_to_g1(input);
    try testing.expectEqual(expected, result);
}
```

**Only then implement:**
```zig
pub fn bls12_381_map_fp_to_g1(input: InputType) !OutputType {
    // Minimal implementation to make test pass
    return error.NotImplemented; // Initially
}
```


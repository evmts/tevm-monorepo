# Implement BLS12-381 G1MSM Precompile

You are implementing BLS12-381 G1MSM Precompile for the Tevm EVM written in Zig. Your goal is to implement BLS12-381 G1 multi-scalar multiplication precompile following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_bls` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_bls feat_implement_bls`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement the BLS12-381 G1 multi-scalar multiplication precompile (address 0x0C) as defined in EIP-2537. This precompile performs efficient multi-scalar multiplication operations on the G1 group of the BLS12-381 elliptic curve, essential for BLS signature verification and other cryptographic protocols.

## ELI5

Imagine you're at a farmer's market and need to calculate the total cost of buying different quantities of various items. Multi-scalar multiplication is like having a super-fast calculator that can multiply many different numbers by many different amounts all at once, instead of doing each calculation one by one.

In the BLS12-381 G1 context, we're working with points on a special mathematical curve. Instead of regular numbers, we're multiplying curve points by scalar values (regular numbers). The "multi" part means we can do many of these multiplications simultaneously and then add all the results together in one efficient operation.

This enhanced version includes cutting-edge optimizations like:
- **Smart batching**: Grouping similar calculations to process them more efficiently
- **Windowing techniques**: Pre-calculating common values to speed up repeated operations
- **Parallel processing**: Using multiple CPU cores simultaneously
- **Algorithm selection**: Automatically choosing the fastest method based on input characteristics

Why is this important? Zero-knowledge proofs and advanced cryptographic systems need to perform thousands of these operations. Having them optimized means applications like private transactions, identity verification, and scalability solutions can run much faster and cost less gas.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x000000000000000000000000000000000000000C`
- **Gas Cost**: Variable based on input size and complexity
- **Input**: Multiple (scalar, point) pairs for multi-scalar multiplication
- **Output**: Single G1 point result
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input format (variable length):
- Each pair: 32 bytes (scalar) + 128 bytes (G1 point) = 160 bytes
- Total input must be multiple of 160 bytes
- Minimum: 160 bytes (1 pair)
- Maximum: Implementation dependent
```

### Gas Calculation
```
base_cost = 12275
per_pair_cost = 15900
total_cost = base_cost + (num_pairs * per_pair_cost)
```

## Implementation Requirements

### Core Functionality
1. **Input Validation**: Verify G1 point validity and scalar range
2. **Multi-Scalar Multiplication**: Efficient MSM algorithm implementation
3. **Gas Calculation**: Accurate cost based on input size
4. **Point Serialization**: Proper BLS12-381 G1 point encoding/decoding
5. **Error Handling**: Handle invalid points and out-of-gas conditions

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_g1msm.zig` - New G1MSM implementation
- `/src/evm/crypto/bls12_381.zig` - BLS12-381 curve operations
- `/src/evm/precompiles/precompiles.zig` - Add G1MSM to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add G1MSM address
- `/src/evm/constants/gas_constants.zig` - Add G1MSM gas costs
- `/test/evm/precompiles/bls12_381_g1msm_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 G1MSM specification
2. **Point Validation**: Correctly validates G1 points and rejects invalid inputs
3. **MSM Correctness**: Produces correct multi-scalar multiplication results
4. **Gas Accuracy**: Implements correct gas pricing model
5. **Performance**: Efficient implementation suitable for production use
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

#### 1. **Unit Tests** (`/test/evm/precompiles/bls12_381_g1_msm_test.zig`)
```zig
// Test basic G1 multi-scalar multiplication functionality
test "bls12_381_g1_msm basic functionality with known vectors"
test "bls12_381_g1_msm handles edge cases correctly"
test "bls12_381_g1_msm validates input format"
test "bls12_381_g1_msm produces correct output format"
```

#### 2. **Input Validation Tests**
```zig
test "bls12_381_g1_msm handles various input lengths"
test "bls12_381_g1_msm validates input parameters"
test "bls12_381_g1_msm rejects invalid inputs gracefully"
test "bls12_381_g1_msm handles empty input"
```

#### 3. **Gas Calculation Tests**
```zig
test "bls12_381_g1_msm gas cost calculation accuracy"
test "bls12_381_g1_msm gas cost edge cases"
test "bls12_381_g1_msm gas overflow protection"
test "bls12_381_g1_msm gas deduction in EVM context"
```

#### 4. **Specification Compliance Tests**
```zig
test "bls12_381_g1_msm matches specification test vectors"
test "bls12_381_g1_msm matches reference implementation output"
test "bls12_381_g1_msm hardfork availability requirements"
test "bls12_381_g1_msm address registration correct"
```

#### 5. **Elliptic Curve/Cryptographic Tests**
```zig
test "bls12_381_g1_msm handles point at infinity correctly"
test "bls12_381_g1_msm validates points on curve"
test "bls12_381_g1_msm handles invalid curve points"
test "bls12_381_g1_msm cryptographic edge cases"
```

#### 6. **Performance Tests**
```zig
test "bls12_381_g1_msm performance with large inputs"
test "bls12_381_g1_msm memory efficiency"
test "bls12_381_g1_msm WASM bundle size impact"
test "bls12_381_g1_msm benchmark against reference implementations"
```

#### 7. **Error Handling Tests**
```zig
test "bls12_381_g1_msm error propagation"
test "bls12_381_g1_msm proper error types returned"
test "bls12_381_g1_msm handles corrupted input gracefully"
test "bls12_381_g1_msm never panics on malformed input"
```

#### 8. **Integration Tests**
```zig
test "bls12_381_g1_msm precompile registration"
test "bls12_381_g1_msm called from EVM execution"
test "bls12_381_g1_msm gas deduction in EVM context"
test "bls12_381_g1_msm hardfork availability"
```

### Test Development Priority
1. **Start with EIP test vectors** - Ensures spec compliance from day one
2. **Add cryptographic validation** - Critical for elliptic curve operations
3. **Implement gas calculation** - Core economic security
4. **Add performance benchmarks** - Ensures production readiness
5. **Test error cases** - Robust error handling

### Test Data Sources
- **EIP test vectors**: Primary compliance verification (EIP-2537)
- **Reference implementation tests**: Cross-client compatibility
- **Cryptographic test vectors**: Mathematical correctness
- **Edge case generation**: Boundary value and malformed input testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public functions
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify cryptographic correctness with known vectors

### Test-First Examples

**Before writing any implementation:**
```zig
test "bls12_381_g1_msm basic functionality" {
    // This test MUST fail initially
    const input = test_vectors.valid_curve_points;
    const expected = test_vectors.expected_result;
    
    const result = bls12_381_g1_msm.run(input);
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

### Critical Testing Notes
- **Cryptographic correctness is paramount** - Never compromise on test coverage
- **Test against malicious inputs** - Elliptic curve operations are security-critical
- **Verify constant-time execution** - Prevent timing attack vulnerabilities
- **Test hardfork transitions** - Ensure availability at correct block numbers


# Implement BLAKE2F Precompile

## Implementation Status: ✅ COMPLETED

**PR Information:**
- **Merged PR**: [#1834 - ✨ feat: implement BLAKE2F precompile (address 0x09)](https://github.com/evmts/tevm-monorepo/pull/1834)
- **Commit Hash**: `c381a96b0` - ✨ feat: implement BLAKE2F precompile (EIP-152)
- **Merged**: June 12, 2025
- **Status**: ✅ Successfully implemented and merged

**Current Status:**
- ✅ blake2f.zig exists in src/evm/precompiles/
- ✅ Complete BLAKE2F compression function implementation
- ✅ EIP-152 compliance for BLAKE2b compression function
- ✅ 213-byte input validation (rounds + hash state + message + counters + flag)
- ✅ Dynamic gas calculation (1 gas per round)
- ✅ 64-byte output (compressed hash state)
- ✅ All tests passing with `zig build test-all`

**Implementation Completed:**
- ✅ Created src/evm/precompiles/blake2f.zig with execute() and calculate_gas_checked() functions
- ✅ Full EIP-152 specification compliance
- ✅ Comprehensive test coverage
- ✅ Production-ready implementation
You are implementing the BLAKE2F precompile (address 0x09) for the Tevm EVM written in Zig. Your goal is to provide the BLAKE2b compression function that enables efficient cryptographic operations for smart contracts, following EIP-152 specification and maintaining compatibility with all Ethereum clients.

## Context
The BLAKE2F precompile enables efficient cryptographic operations for smart contracts that require BLAKE2b hashing, which is faster and more secure than older hash functions. This is essential for advanced cryptographic protocols, zero-knowledge proofs, and other applications that need high-performance hashing capabilities within the EVM.

## Development Workflow
- **Branch**: `feat_implement_blake2f_precompile` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_blake2f_precompile feat_implement_blake2f_precompile`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format

## Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000009`
- **Gas Cost**: Dynamic - 1 gas per round
- **Input**: 213 bytes (rounds + hash state + message block + counters + final flag)
- **Output**: 64 bytes (compressed hash state)
- **Available**: Istanbul hardfork onwards
- **Function**: BLAKE2b compression function (F function)

### Input Format (213 bytes)
```
- rounds (4 bytes): Number of compression rounds (big-endian)
- h (64 bytes): Hash state (8×8 bytes, little-endian)
- m (128 bytes): Message block (16×8 bytes, little-endian)
- t (16 bytes): Offset counters (2×8 bytes, little-endian)
- f (1 byte): Final block flag (0x00 or 0x01)
```

## File Structure

**Primary Files to Modify:**
- `/src/evm/precompiles/precompiles.zig` - Register BLAKE2F precompile (address 0x09)
- `/src/evm/precompiles/precompile_addresses.zig` - Add BLAKE2F address constant
- `/src/evm/precompiles/precompile_gas.zig` - Dynamic gas calculation (1 per round)

**New Files to Create:**
- `/src/evm/precompiles/blake2f.zig` - BLAKE2F precompile implementation
- `/src/evm/crypto/blake2b.zig` - BLAKE2b compression function utilities

**Test Files:**
- `/test/evm/precompiles/blake2f_test.zig` - EIP-152 test vectors and edge cases

## ELI5

Think of BLAKE2F as a special cryptographic "blender" that takes a fixed amount of data and mixes it up in a very specific, reproducible way. Just like how Ethereum has built-in functions for basic math (add, multiply), it also has built-in functions for cryptography. BLAKE2F is one of these - it's a hash function that's faster and more secure than older ones like SHA-1. When smart contracts need to do BLAKE2 hashing (often for advanced cryptographic protocols), they can call this precompile instead of implementing the complex algorithm themselves, which saves gas and ensures correctness.

## 🚨 CRITICAL SECURITY WARNING: DO NOT IMPLEMENT CUSTOM CRYPTO

**❌ NEVER IMPLEMENT CRYPTOGRAPHIC ALGORITHMS FROM SCRATCH**

This prompt involves cryptographic operations. Follow these security principles:

### ✅ **DO THIS:**
- **Use established crypto libraries** (Zig std.crypto, noble-hashes, libsecp256k1)
- **Import proven implementations** from well-audited libraries
- **Leverage existing WASM crypto libraries** when Zig stdlib lacks algorithms
- **Follow reference implementations** from go-ethereum, revm, evmone exactly
- **Use test vectors** from official specifications to verify correctness

### ❌ **NEVER DO THIS:**
- Write your own hash functions, signature verification, or elliptic curve operations
- Implement cryptographic primitives "from scratch" or "for learning"
- Modify cryptographic algorithms or add "optimizations"
- Copy-paste crypto code from tutorials or unofficial sources
- Implement crypto without extensive peer review and testing

### 🎯 **Implementation Strategy:**
1. **First choice**: Use Zig standard library crypto functions when available
2. **Second choice**: Use well-established WASM crypto libraries (noble-hashes, etc.)
3. **Third choice**: Bind to audited C libraries (libsecp256k1, OpenSSL)
4. **Never**: Write custom cryptographic implementations

**Remember**: Cryptographic bugs can lead to fund loss, private key exposure, and complete system compromise. Always use proven, audited implementations.

## Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000009`
- **Gas Cost**: Dynamic based on number of rounds
- **Function**: BLAKE2b compression function (F function)
- **Available**: Istanbul hardfork onwards
- **Input**: 213 bytes (rounds + h + m + t + f)
- **Output**: 64 bytes (new hash state)

## Implementation Requirements

### Core Components
1. **F Compression Function**: BLAKE2b compression following RFC 7693
2. **Input Validation**: 213-byte format, valid final flag (0x00 or 0x01)
3. **Gas Calculation**: 1 gas per round with overflow protection
4. **Endianness Handling**: Big-endian rounds, little-endian hash data
5. **Performance Optimization**: Efficient for large round counts
6. **Error Handling**: Proper validation and error responses

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against EIP-152 test vectors exactly
✅ MUST handle large round counts (up to u32 max)
✅ MUST optimize for performance (compute-intensive operation)
✅ MUST follow BLAKE2b RFC 7693 specification exactly

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Gas costs match Ethereum specification (1 per round)
✅ Input validation handles all edge cases (invalid flags, overflow)
✅ Output format matches reference implementations exactly
✅ Performance meets or exceeds other precompiles
✅ Passes all EIP-152 test vectors

## Reference Implementations

### geth

<explanation>
The go-ethereum implementation demonstrates the complete BLAKE2F precompile pattern: gas calculation based on rounds count (1 gas per round), strict input validation (213 bytes exactly), proper endianness handling (big-endian for rounds, little-endian for hash data), and calling the optimized blake2b.F compression function.
</explanation>

**Constants and Errors** - `/go-ethereum/core/vm/contracts.go` (lines 707-714):
```go
const (
	blake2FInputLength        = 213
	blake2FFinalBlockBytes    = byte(1)
	blake2FNonFinalBlockBytes = byte(0)
)

var (
	errBlake2FInvalidInputLength = errors.New("invalid input length")
	errBlake2FInvalidFinalFlag   = errors.New("invalid final flag")
)
```

**Gas Calculation** - `/go-ethereum/core/vm/contracts.go` (lines 697-703):
```go
func (c *blake2F) RequiredGas(input []byte) uint64 {
	// If the input is malformed, we can't calculate the gas, return 0 and let the
	// actual call choke and fault.
	if len(input) != blake2FInputLength {
		return 0
	}
	return uint64(binary.BigEndian.Uint32(input[0:4]))
}
```

**Full Implementation** - `/go-ethereum/core/vm/contracts.go` (lines 717-753):
```go
func (c *blake2F) Run(input []byte) ([]byte, error) {
	// Make sure the input is valid (correct length and final flag)
	if len(input) != blake2FInputLength {
		return nil, errBlake2FInvalidInputLength
	}
	if input[212] != blake2FNonFinalBlockBytes && input[212] != blake2FFinalBlockBytes {
		return nil, errBlake2FInvalidFinalFlag
	}
	// Parse the input into the Blake2b call parameters
	var (
		rounds = binary.BigEndian.Uint32(input[0:4])
		final  = input[212] == blake2FFinalBlockBytes

		h [8]uint64
		m [16]uint64
		t [2]uint64
	)
	for i := 0; i < 8; i++ {
		offset := 4 + i*8
		h[i] = binary.LittleEndian.Uint64(input[offset : offset+8])
	}
	for i := 0; i < 16; i++ {
		offset := 68 + i*8
		m[i] = binary.LittleEndian.Uint64(input[offset : offset+8])
	}
	t[0] = binary.LittleEndian.Uint64(input[196:204])
	t[1] = binary.LittleEndian.Uint64(input[204:212])

	// Execute the compression function, extract and return the result
	blake2b.F(&h, m, t, final, rounds)

	output := make([]byte, 64)
	for i := 0; i < 8; i++ {
		offset := i * 8
		binary.LittleEndian.PutUint64(output[offset:offset+8], h[i])
	}
	return output, nil
}
```

## Implementation Strategy & Research

### Recommended Approach: Zig Standard Library First

**Primary Option: Zig `std.crypto.hash.blake2`**
- ✅ **Pros**: Native Zig implementation, optimal WASM bundle size, no external dependencies
- ❓ **Unknown**: Need to verify if F compression function is exposed directly
- 📦 **Bundle Impact**: Minimal - only includes used functions
- 🎯 **Compatibility**: Perfect WASM compilation via Zig

**Fallback Option: WASM Blake2 Library**  
- 🔄 **Backup**: [blake2-wasm](https://github.com/emn178/blake2-wasm) or similar optimized WASM implementation
- ⚠️ **Tradeoff**: Slightly larger bundle size but still WASM-compatible
- 🎯 **Use Case**: If Zig stdlib doesn't expose F function directly

### Investigation Steps
1. **Check Zig stdlib**: Examine `std.crypto.hash.blake2` for F function access
2. **Benchmark**: Compare Zig native vs WASM implementations for performance
3. **Bundle analysis**: Measure size impact of each approach

### Bundle Size Priority
Following Tevm's preference hierarchy:
1. ✅ Zig stdlib (preferred) - minimal bundle impact
2. 🔄 WASM Blake2 library (fallback) - moderate bundle impact  
3. ❌ Full crypto library (avoid) - significant bundle impact

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/precompiles/blake2f_test.zig`)
```zig
// Test basic compression function
test "blake2f basic compression with known vectors"
test "blake2f handles zero rounds correctly"
test "blake2f handles maximum rounds (u32 max)"
test "blake2f final flag variations"
```

#### 2. **Input Validation Tests**
```zig
test "blake2f rejects invalid input length (< 213 bytes)"
test "blake2f rejects invalid input length (> 213 bytes)"
test "blake2f rejects invalid final flag (not 0x00 or 0x01)"
test "blake2f accepts valid final flags (0x00 and 0x01)"
```

#### 3. **Gas Calculation Tests**
```zig
test "blake2f gas cost calculation (1 per round)"
test "blake2f gas overflow protection"
test "blake2f zero rounds gas cost"
test "blake2f maximum rounds gas cost"
```

#### 4. **EIP-152 Compliance Tests**
```zig
test "blake2f EIP-152 test vector 1"
test "blake2f EIP-152 test vector 2"  
test "blake2f EIP-152 test vector 3"
test "blake2f EIP-152 test vector 4"
test "blake2f matches reference implementation output"
```

#### 5. **Endianness Tests**
```zig
test "blake2f big-endian rounds parsing"
test "blake2f little-endian hash state parsing"
test "blake2f little-endian message block parsing"
test "blake2f little-endian output formatting"
```

#### 6. **Performance Tests**
```zig
test "blake2f performance with large round counts"
test "blake2f memory efficiency"
test "blake2f WASM bundle size impact"
```

#### 7. **Error Handling Tests**
```zig
test "blake2f error propagation"
test "blake2f proper error types returned"
test "blake2f handles corrupted input gracefully"
```

#### 8. **Integration Tests**
```zig
test "blake2f precompile registration"
test "blake2f called from EVM execution"
test "blake2f gas deduction in EVM context"
test "blake2f hardfork availability (Istanbul+)"
```

### Test Development Priority
1. **Start with EIP-152 test vectors** - Ensures spec compliance from day one
2. **Add input validation** - Prevents invalid states early
3. **Implement gas calculation** - Core economic security
4. **Add performance benchmarks** - Ensures production readiness
5. **Test error cases** - Robust error handling

### Test Data Sources
- **EIP-152 official test vectors**: Primary compliance verification
- **Geth test suite**: Cross-client compatibility
- **RFC 7693 test vectors**: BLAKE2b algorithm correctness
- **Edge case generation**: Boundary value testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public functions
- Validate performance benchmarks don't regress
- Test both debug and release builds

### Test-First Examples

**Before writing any implementation:**
```zig
test "blake2f basic functionality" {
    // This test MUST fail initially
    const input = test_vectors.eip152_vector_1;
    const expected = test_vectors.eip152_expected_1;
    
    const result = blake2f.run(input);
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

- [EIP-152: Add BLAKE2 compression function F precompile](https://eips.ethereum.org/EIPS/eip-152)
- [RFC 7693: The BLAKE2 Cryptographic Hash and Message Authentication Code (MAC)](https://tools.ietf.org/rfc/rfc7693.txt)
- [BLAKE2 Official Website](https://www.blake2.net/)
- [BLAKE2b Implementation Guide](https://github.com/BLAKE2/BLAKE2/blob/master/ref/blake2b-ref.c)
- [Zig Crypto Documentation](https://ziglang.org/documentation/master/std/#std;crypto.hash.blake2)
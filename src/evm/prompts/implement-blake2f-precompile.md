# Implement BLAKE2F Precompile

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

## Ethereum Specification

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

## References

- [EIP-152: Add BLAKE2 compression function F precompile](https://eips.ethereum.org/EIPS/eip-152)
- [RFC 7693: The BLAKE2 Cryptographic Hash and Message Authentication Code (MAC)](https://tools.ietf.org/rfc/rfc7693.txt)
- [BLAKE2 Official Website](https://www.blake2.net/)
- [BLAKE2b Implementation Guide](https://github.com/BLAKE2/BLAKE2/blob/master/ref/blake2b-ref.c)
- [Zig Crypto Documentation](https://ziglang.org/documentation/master/std/#std;crypto.hash.blake2)
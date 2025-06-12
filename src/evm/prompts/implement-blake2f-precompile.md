# Implement BLAKE2F Precompile

## 🚨 CRITICAL SECURITY WARNING: DO NOT IMPLEMENT CUSTOM CRYPTO

### ❌ DO NOT:
- Implement the BLAKE2F algorithm from scratch
- Create custom cryptographic functions
- Use untested or unaudited crypto libraries
- Implement your own compression functions

### ✅ DO USE:
- **blst** - Optimized, audited cryptographic library
- **noble-curves** - Well-tested JS/TS crypto implementations  
- **arkworks-rs** - Rust ecosystem standard for cryptographic curves
- **Official BLAKE2 reference implementations**

### 🎯 Implementation Strategy:
1. **Find existing BLAKE2F bindings** for established crypto libraries
2. **Wrap proven implementations** rather than reimplementing
3. **Validate against known test vectors** from EIP-152
4. **Use FFI bindings** to audited C/Rust implementations when possible

**Why this matters**: Custom cryptographic implementations are prone to timing attacks, incorrect algorithm implementation, and subtle vulnerabilities that can compromise the entire system. Always use battle-tested, audited implementations.

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_blake2f_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_blake2f_precompile feat_implement_blake2f_precompile`
3. **Work in isolation**: `cd g/feat_implement_blake2f_precompile`
4. **Commit message**: `✨ feat: implement BLAKE2F precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the BLAKE2F precompile (address 0x09) for Ethereum Virtual Machine compatibility. This precompile provides the BLAKE2b compression function and is available from the Istanbul hardfork.

## Ethereum Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000009`
- **Gas Cost**: Dynamic based on number of rounds
- **Function**: BLAKE2b compression function (F function)
- **Available**: Istanbul hardfork onwards
- **Input**: 213 bytes (rounds + h + m + t + f)
- **Output**: 64 bytes (new hash state)

## Implementation Requirements

### Core Functionality
1. **Compression Function**: BLAKE2b F function implementation
2. **Input Validation**: Validate rounds count and input format
3. **Gas Calculation**: 1 gas per round
4. **Endianness Handling**: Proper little-endian/big-endian conversion
5. **Performance**: Optimized for multiple rounds

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test against EIP-152 vectors** - Ensure exact specification compliance
3. **Handle large round counts** - Test with maximum u32 values
4. **Optimize for performance** - This can be compute-intensive
5. **Validate inputs thoroughly** - Prevent malformed input issues
6. **Use proven algorithms** - Follow BLAKE2b specification exactly

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

## References

- [EIP-152: Add BLAKE2 compression function F precompile](https://eips.ethereum.org/EIPS/eip-152)
- [RFC 7693: The BLAKE2 Cryptographic Hash and Message Authentication Code (MAC)](https://tools.ietf.org/rfc/rfc7693.txt)
- [BLAKE2 Official Website](https://www.blake2.net/)
- [BLAKE2b Implementation Guide](https://github.com/BLAKE2/BLAKE2/blob/master/ref/blake2b-ref.c)
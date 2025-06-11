# Implement BLS12-381 G1ADD Precompile

## What
<eli5>
Imagine you have special mathematical points on a curved surface, and you want to "add" two points together to get a third point. This isn't regular addition - it's a special kind of math used in advanced cryptography. BLS12-381 is a specific type of elliptic curve that's really good for creating digital signatures that multiple parties can combine together. The G1 point addition precompile is like having a built-in calculator in Ethereum that can do this special curve math super efficiently. This is essential for things like proof systems and advanced signature schemes that help make blockchain more scalable and private.
</eli5>

Implement BLS12-381 G1 point addition precompile (EIP-2537) that performs elliptic curve point addition on the BLS12-381 G1 group. Takes 256 bytes input (two 128-byte G1 points) and returns 128 bytes output (resulting G1 point) with fixed gas cost of 375.

## Why
BLS12-381 G1 point addition is fundamental for BLS signature verification, zero-knowledge proof systems, and other advanced cryptographic protocols. This precompile provides efficient elliptic curve operations that would be prohibitively expensive to implement in EVM bytecode, enabling scalable cryptographic applications on Ethereum.

## How
1. Implement BLS12-381 field arithmetic for 381-bit prime field operations
2. Add G1 point decoding/encoding with proper validation
3. Implement elliptic curve point addition using optimized algorithms
4. Handle point at infinity (identity element) correctly
5. Validate all input points are on the correct curve and in correct subgroup
6. Optimize performance for the specific BLS12-381 curve parameters

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_bls12_381_g1add_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_g1add_precompile feat_implement_bls12_381_g1add_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_g1add_precompile`
4. **Commit message**: `✨ feat: implement BLS12-381 G1 point addition precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement BLS12-381 G1 point addition precompile for EIP-2537 support. This precompile enables efficient elliptic curve operations on the BLS12-381 curve.

<eli5>
Imagine you have special mathematical points on a curved surface, and you want to "add" two points together to get a third point. This isn't regular addition - it's a special kind of math used in advanced cryptography. BLS12-381 is a specific type of elliptic curve that's really good for creating digital signatures that multiple parties can combine together. The G1 point addition precompile is like having a built-in calculator in Ethereum that can do this special curve math super efficiently. This is essential for things like proof systems and advanced signature schemes that help make blockchain more scalable and private.
</eli5>

## Implementation Requirements

### Core Functionality
1. **G1 Point Addition**: BLS12-381 elliptic curve point addition
2. **Input Validation**: Validate points are on correct curve
3. **Gas Calculation**: Appropriate gas costs and metering
4. **Error Handling**: Handle invalid points and edge cases
5. **Performance**: Optimized for BLS12-381 curve parameters

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test against EIP-2537 vectors** - Essential for specification compliance
3. **Implement BLS12-381 field arithmetic** - Requires 381-bit prime field
4. **Handle point at infinity** - Proper identity element handling
5. **Validate all inputs thoroughly** - Invalid points can cause undefined behavior
6. **Optimize for performance** - Used in BLS signature verification

## References

- [EIP-2537: Precompile for BLS12-381 curve operations](https://eips.ethereum.org/EIPS/eip-2537)
- [BLS12-381 Curve Specification](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/)
- [BLS12-381 Implementation Guide](https://hackmd.io/@benjaminion/bls12-381)

## Reference Implementations

### geth

<explanation>
The go-ethereum implementation shows the standard BLS12-381 G1 point addition pattern: constant gas cost (375), strict input validation (256 bytes exactly), point decoding/validation, curve arithmetic using the consensys/gnark-crypto library, and proper encoding of the result. The key insight is that it uses a well-tested external crypto library for the complex elliptic curve operations.
</explanation>

**Gas Constant** - `/go-ethereum/params/protocol_params.go` (line 157):
```go
Bls12381G1AddGas          uint64 = 375   // Price for BLS12-381 elliptic curve G1 point addition
```

**Precompile Implementation** - `/go-ethereum/core/vm/contracts.go` (lines 763-795):
```go
// bls12381G1Add implements EIP-2537 G1Add precompile.
type bls12381G1Add struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *bls12381G1Add) RequiredGas(input []byte) uint64 {
	return params.Bls12381G1AddGas
}

func (c *bls12381G1Add) Run(input []byte) ([]byte, error) {
	// Implements EIP-2537 G1Add precompile.
	// > G1 addition call expects `256` bytes as an input that is interpreted as byte concatenation of two G1 points (`128` bytes each).
	// > Output is an encoding of addition operation result - single G1 point (`128` bytes).
	if len(input) != 256 {
		return nil, errBLS12381InvalidInputLength
	}
	var err error
	var p0, p1 *bls12381.G1Affine

	// Decode G1 point p_0
	if p0, err = decodePointG1(input[:128]); err != nil {
		return nil, err
	}
	// Decode G1 point p_1
	if p1, err = decodePointG1(input[128:]); err != nil {
		return nil, err
	}

	// No need to check the subgroup here, as specified by EIP-2537

	// Compute r = p_0 + p_1
	p0.Add(p0, p1)

	// Encode the G1 point result into 128 bytes
	return encodePointG1(p0), nil
}
```

**Import Dependencies** - `/go-ethereum/core/vm/contracts.go` (lines 28-29):
```go
"github.com/consensys/gnark-crypto/ecc"
bls12381 "github.com/consensys/gnark-crypto/ecc/bls12-381"
```
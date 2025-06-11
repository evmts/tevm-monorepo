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

## Development Workflow
- **Branch**: `feat_implement_bls` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_bls feat_implement_bls`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement BLS12-381 G1 point addition precompile for EIP-2537 support. This precompile enables efficient elliptic curve operations on the BLS12-381 curve.

## ELI5

Think of BLS12-381 G1 addition like a special calculator that can add points on a curved surface (imagine adding coordinates on a globe, but with more complex math). This isn't regular addition - it's "elliptic curve addition" which follows special rules.

Here's what it does:
- **Takes two points** on the BLS12-381 curve (each point has x,y coordinates, but they're very large numbers)
- **Adds them together** using special mathematical rules for elliptic curves
- **Returns the result point** that represents their sum on the curve

Why this matters:
- **BLS Signatures**: These operations are building blocks for BLS signatures used in Ethereum 2.0
- **Advanced Cryptography**: Enables privacy-preserving protocols and multi-party computations
- **Efficient Operations**: Having this as a precompile makes it much faster and cheaper than doing the math in regular smart contract code

Real-world analogy:
- Like having a specialized GPS calculator that can compute complex navigation between two points on a curved Earth
- Instead of doing all the spherical trigonometry yourself, you use a built-in function
- The math is complex, but the interface is simple: "add these two points"

This specific precompile (G1ADD) is one piece of a larger cryptographic toolkit. G1 refers to one of two groups of points on the BLS12-381 curve - think of it as one "layer" of the mathematical structure that makes advanced cryptography possible.

## File Structure

**Primary Files to Modify:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Address constants
- `/src/evm/hardforks/chain_rules.zig` - Hardfork availability rules

**Supporting Files:**
- `/src/evm/precompiles/precompile_gas.zig` - Gas calculation for precompiles
- `/src/evm/precompiles/precompile_result.zig` - Result types for precompile execution

**New Files to Create:**
- `/src/evm/precompiles/bls12_381_g1_add.zig` - BLS12-381 G1 addition implementation

**Test Files:**
- `/test/evm/precompiles/` (directory) - Precompile test infrastructure
- `/test/evm/precompiles/bls12_381_g1_add_test.zig` - BLS12-381 G1 addition specific tests

**Why These Files:**
- The main precompile dispatcher needs to route calls to the new BLS12-381 G1 addition implementation
- Address constants define the precompile address (0x0b for G1 addition)
- Chain rules determine when this precompile becomes available (Berlin hardfork)
- New implementation file handles the complex elliptic curve mathematics
- Comprehensive tests ensure EIP-2537 compliance

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
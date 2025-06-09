# Implement KZG Point Evaluation Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_kzg_point_evaluation_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_kzg_point_evaluation_precompile feat_implement_kzg_point_evaluation_precompile`
3. **Work in isolation**: `cd g/feat_implement_kzg_point_evaluation_precompile`
4. **Commit message**: `✨ feat: implement KZG point evaluation precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the KZG Point Evaluation precompile (address 0x0A) for Ethereum Virtual Machine compatibility. This precompile is critical for EIP-4844 blob verification and enables efficient polynomial commitment verification.

## Ethereum Specification

### Basic Operation
- **Address**: `0x000000000000000000000000000000000000000A`
- **Gas Cost**: 50,000 static gas cost
- **Function**: Verifies KZG polynomial commitment proof
- **Available**: Cancun hardfork onwards (EIP-4844)
- **Input**: 192 bytes (commitment + z + y + proof)
- **Output**: 32 bytes (verification result: 1 for success, 0 for failure)

## Implementation Requirements

### Core Functionality
1. **KZG Verification**: Polynomial commitment proof verification
2. **BLS12-381 Operations**: Uses BLS12-381 curve for commitments
3. **Input Validation**: Validate all curve points and field elements
4. **Gas Calculation**: Static 50,000 gas cost
5. **Trusted Setup**: Uses ceremony-generated setup parameters

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test against EIP-4844 vectors** - Essential for blob transaction support
3. **Implement BLS12-381 operations** - Requires complex elliptic curve math
4. **Use trusted setup parameters** - Must match official ceremony output
5. **Validate all inputs thoroughly** - Invalid points can cause undefined behavior
6. **Optimize for performance** - This is used in every blob transaction

## Reference Implementations

### geth

<explanation>
The go-ethereum implementation demonstrates the complete KZG point evaluation precompile pattern with proper input validation, versioned hash verification, and KZG proof verification. Key aspects include fixed gas cost (50,000), exact input length validation (192 bytes), versioned hash matching, and integration with the trusted setup for polynomial commitment verification.
</explanation>

**Gas Constant** - `/go-ethereum/params/protocol_params.go` (line 189):
```go
BlobTxPointEvaluationPrecompileGas uint64 = 50000 // Gas price for point evaluation precompile
```

**Full Implementation** - `/go-ethereum/core/vm/contracts.go` (lines 1170-1232):
```go
// pointEvaluation implements the EIP-4844 point evaluation precompile.
type pointEvaluation struct{}

func (c *pointEvaluation) RequiredGas(input []byte) uint64 {
	return params.BlobTxPointEvaluationPrecompileGas
}

func (c *pointEvaluation) Run(input []byte) ([]byte, error) {
	const blobVerifyInputLength = 192
	if len(input) != blobVerifyInputLength {
		return nil, errBlobVerifyInvalidInputLength
	}
	// versioned hash: first 32 bytes
	var versionedHash common.Hash
	copy(versionedHash[:], input[:32])

	var (
		point kzg4844.Point
		claim kzg4844.Claim
	)
	copy(point[:], input[32:64])
	copy(claim[:], input[64:96])

	// commitment: next 48 bytes
	var commitment kzg4844.Commitment
	copy(commitment[:], input[96:144])

	// proof: next 48 bytes
	var proof kzg4844.Proof
	copy(proof[:], input[144:192])

	if kZGToVersionedHash(commitment) != versionedHash {
		return nil, errBlobVerifyMismatchedVersion
	}

	if err := kzg4844.VerifyProof(commitment, point, claim, proof); err != nil {
		return nil, fmt.Errorf("%w: %v", errBlobVerifyKZGProof, err)
	}

	return common.CopyBytes(blobTxPointEvaluationPrecompileReturnValue[:]), nil
}

func kZGToVersionedHash(kzg kzg4844.Commitment) common.Hash {
	h := sha256.Sum256(kzg[:])
	h[0] = blobCommitmentVersionKZG

	return h
}
```

**Error Definitions** - `/go-ethereum/core/vm/contracts.go` (lines 55-70):
```go
var (
	errBlobVerifyInvalidInputLength = errors.New("invalid input length")
	errBlobVerifyMismatchedVersion  = errors.New("mismatched versioned hash")
	errBlobVerifyKZGProof           = errors.New("error verifying kzg proof")
)

const (
	blobCommitmentVersionKZG uint8 = 0x01 // Version byte for KZG commitments
)

// The return value when point evaluation succeeds
var blobTxPointEvaluationPrecompileReturnValue = [...]byte{
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00,
	0x73, 0xed, 0xa7, 0x53, 0x29, 0x9d, 0x7d, 0x48,
	0x33, 0x39, 0xd8, 0x08, 0x09, 0xa1, 0xd8, 0x05,
	0x53, 0xbd, 0xa4, 0x02, 0xff, 0xfe, 0x5b, 0xfe,
	0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01,
}
```

**KZG Data Types** - `/go-ethereum/crypto/kzg4844/kzg4844.go` (lines 33-45):
```go
// Blob represents a 4096 field element blob.
type Blob [131072]byte

// Commitment is a serialized commitment to a polynomial.
type Commitment [48]byte

// Proof is a serialized commitment to the quotient polynomial.
type Proof [48]byte

// Point is a BLS field element.
type Point [32]byte

// Claim is a BLS field element.
type Claim [32]byte
```

**BLS12-381 Gas Constants** - `/go-ethereum/params/protocol_params.go` (lines 164-188):
```go
// BLS12-381 elliptic curve precompiles
Bls12381G1AddGas         uint64 = 600       // Gas price for BLS12-381 elliptic curve G1 point addition
Bls12381G1MulGas         uint64 = 12000     // Gas price for BLS12-381 elliptic curve G1 point scalar multiplication
Bls12381G2AddGas         uint64 = 4500      // Gas price for BLS12-381 elliptic curve G2 point addition
Bls12381G2MulGas         uint64 = 55000     // Gas price for BLS12-381 elliptic curve G2 point scalar multiplication
Bls12381PairingBaseGas   uint64 = 115000    // Base gas price for BLS12-381 elliptic curve pairing check
Bls12381PairingPerPairGas uint64 = 23000    // Per-pair gas price for BLS12-381 elliptic curve pairing check
Bls12381MapG1Gas         uint64 = 5500      // Gas price for BLS12-381 mapping field element to G1 operation
Bls12381MapG2Gas         uint64 = 110000    // Gas price for BLS12-381 mapping field element to G2 operation
```

## References

- [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844)
- [KZG Polynomial Commitments](https://dankradfeist.de/ethereum/2020/06/16/kate-polynomial-commitments.html)
- [BLS12-381 Curve Specification](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/)
- [Trusted Setup Ceremony](https://ceremony.ethereum.org/)
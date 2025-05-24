// Gas costs for different precompiled contracts

// Homestead precompiles
pub const EcrecoverGas: u64 = 3000; // Gas for ECRECOVER
pub const Sha256BaseGas: u64 = 60; // Base gas for SHA256
pub const Sha256PerWordGas: u64 = 12; // Additional gas per word for SHA256
pub const Ripemd160BaseGas: u64 = 600; // Base gas for RIPEMD160
pub const Ripemd160PerWordGas: u64 = 120; // Additional gas per word for RIPEMD160
pub const IdentityBaseGas: u64 = 15; // Base gas for data copy (identity)
pub const IdentityPerWordGas: u64 = 3; // Additional gas per word for data copy

// Byzantium precompiles
pub const Bn256AddGasByzantium: u64 = 500; // Gas for BN256 addition in Byzantium
pub const Bn256ScalarMulGasByzantium: u64 = 40000; // Gas for BN256 scalar multiplication in Byzantium
pub const Bn256PairingBaseGasByzantium: u64 = 100000; // Base gas for BN256 pairing in Byzantium
pub const Bn256PairingPerPointGasByzantium: u64 = 80000; // Additional gas per point for BN256 pairing in Byzantium

// Istanbul precompiles
pub const Bn256AddGasIstanbul: u64 = 150; // Gas for BN256 addition in Istanbul
pub const Bn256ScalarMulGasIstanbul: u64 = 6000; // Gas for BN256 scalar multiplication in Istanbul
pub const Bn256PairingBaseGasIstanbul: u64 = 45000; // Base gas for BN256 pairing in Istanbul
pub const Bn256PairingPerPointGasIstanbul: u64 = 34000; // Additional gas per point for BN256 pairing in Istanbul
pub const Blake2FPerRoundGas: u64 = 1; // Gas per round for Blake2F, defined in EIP-152

// Minimum gas for ModExp
pub const ModExpMinGas: u64 = 200;

// BLS12-381 precompiles (Prague)
pub const Bls12381G1AddGas: u64 = 500; // Gas for BLS12-381 G1 addition
pub const Bls12381G1MulGas: u64 = 12000; // Gas for BLS12-381 G1 scalar multiplication
pub const Bls12381G2AddGas: u64 = 800; // Gas for BLS12-381 G2 addition
pub const Bls12381G2MulGas: u64 = 45000; // Gas for BLS12-381 G2 scalar multiplication
pub const Bls12381PairingBaseGas: u64 = 115000; // Base gas for BLS12-381 pairing
pub const Bls12381PairingPerPairGas: u64 = 23000; // Additional gas per pair for BLS12-381 pairing
pub const Bls12381MapG1Gas: u64 = 5500; // Gas for BLS12-381 MapG1
pub const Bls12381MapG2Gas: u64 = 110000; // Gas for BLS12-381 MapG2

// Multi-Exponentiation discount table
pub const Bls12381G1MultiExpDiscountTable = [_]u64{
    1200, 888, 764, 641, 594, 547, 500, 453, 438, 423, 408, 394, 379, 364, 349, 334, 319, 304, 289, 274, 259, 244, 229, 214, 199, 184, 169, 154, 139, 124, 109
};

pub const Bls12381G2MultiExpDiscountTable = [_]u64{
    1200, 888, 764, 641, 594, 547, 500, 453, 438, 423, 408, 394, 379, 364, 349, 334, 319, 304, 289, 274, 259, 244, 229, 214, 199, 184, 169, 154, 139, 124, 109
};

// Cancun precompiles
pub const BlobTxPointEvaluationPrecompileGas: u64 = 50000; // Gas for KZG point evaluation
# Implement BLS12-381 G1ADD Precompile

<review>
**Implementation Status: NOT IMPLEMENTED ❌**

**Current Status:**
- BLS12-381 curve references exist in KZG verification for blob transactions
- No BLS12-381 G1 point addition precompile exists
- Precompile infrastructure is in place in precompiles.zig

**Implementation Requirements:**
- BLS12-381 G1 point addition implementation (address 0x0a)
- Integration with existing precompile framework
- EIP-2537 compliance for gas costs and validation

**Priority: LOW - Advanced cryptographic feature for specific use cases, not essential for core EVM**
</review>

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

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.hpp">
```hpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2022 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "../utils/stdx/utility.hpp"
#include <evmc/evmc.hpp>
#include <optional>

namespace evmone::state
{
/// The precompile identifiers and their corresponding addresses.
enum class PrecompileId : uint8_t
{
    ecrecover = 0x01,
    sha256 = 0x02,
    ripemd160 = 0x03,
    identity = 0x04,
    expmod = 0x05,
    ecadd = 0x06,
    ecmul = 0x07,
    ecpairing = 0x08,
    blake2bf = 0x09,
    point_evaluation = 0x0a,
    bls12_g1add = 0x0b,
    bls12_g1msm = 0x0c,
    bls12_g2add = 0x0d,
    bls12_g2msm = 0x0e,
    bls12_pairing_check = 0x0f,
    bls12_map_fp_to_g1 = 0x10,
    bls12_map_fp2_to_g2 = 0x11,

    since_byzantium = expmod,         ///< The first precompile introduced in Byzantium.
    since_istanbul = blake2bf,        ///< The first precompile introduced in Istanbul.
    since_cancun = point_evaluation,  ///< The first precompile introduced in Cancun.
    since_prague = bls12_g1add,       ///< The first precompile introduced in Prague.
    latest = bls12_map_fp2_to_g2      ///< The latest introduced precompile (highest address).
};
...
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
...
constexpr auto BLS12_G1_POINT_SIZE = 2 * BLS12_FIELD_ELEMENT_SIZE;
...
PrecompileAnalysis bls12_g1add_analyze(bytes_view, evmc_revision) noexcept
{
    static constexpr auto BLS12_G1ADD_PRECOMPILE_GAS = 375;
    return {BLS12_G1ADD_PRECOMPILE_GAS, BLS12_G1_POINT_SIZE};
}
...
ExecutionResult bls12_g1add_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    if (input_size != 2 * BLS12_G1_POINT_SIZE)
        return {EVMC_PRECOMPILE_FAILURE, 0};

    assert(output_size == BLS12_G1_POINT_SIZE);

    if (!crypto::bls::g1_add(output, &output[64], input, &input[64], &input[128], &input[192]))
        return {EVMC_PRECOMPILE_FAILURE, 0};

    return {EVMC_SUCCESS, BLS12_G1_POINT_SIZE};
}
...
evmc::Result call_precompile(evmc_revision rev, const evmc_message& msg) noexcept
{
    assert(msg.gas >= 0);

    const auto id = msg.code_address.bytes[19];
    const auto [analyze, execute] = traits[id];

    const bytes_view input{msg.input_data, msg.input_size};
    const auto [gas_cost, max_output_size] = analyze(input, rev);
    const auto gas_left = msg.gas - gas_cost;
    if (gas_left < 0)
        return evmc::Result{EVMC_OUT_OF_GAS};

    // Allocate buffer for the precompile's output and pass its ownership to evmc::Result.
    // TODO: This can be done more elegantly by providing constructor evmc::Result(std::unique_ptr).
    const auto output_data = new (std::nothrow) uint8_t[max_output_size];
    const auto [status_code, output_size] =
        execute(msg.input_data, msg.input_size, output_data, max_output_size);
    const evmc_result result{status_code, status_code == EVMC_SUCCESS ? gas_left : 0, 0,
        output_data, output_size,
        [](const evmc_result* res) noexcept { delete[] res->output_data; }};
    return evmc::Result{result};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone_precompiles/bls.hpp">
```hpp
#pragma once

#include <intx/intx.hpp>

using namespace intx::literals;

namespace evmone::crypto::bls
{
/// The BLS12-381 field prime number.
inline constexpr auto BLS_FIELD_MODULUS =
    0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab_u384;

/// Addition in BLS12-381 curve group.
///
/// Computes P ⊕ Q for two points in affine coordinates on the BLS12-381 curve,
[[nodiscard]] bool g1_add(uint8_t _rx[64], uint8_t _ry[64], const uint8_t _x0[64],
    const uint8_t _y0[64], const uint8_t _x1[64], const uint8_t _y1[64]) noexcept;

...
}  // namespace evmone::crypto::bls
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone_precompiles/bls.cpp">
```cpp
#include "bls.hpp"
#include <blst.h>
#include <memory>
#include <optional>
#include <vector>

namespace evmone::crypto::bls
{
namespace
{
/// Offset of the beginning of field element. First 16 bytes must be zero according to spec
/// https://eips.ethereum.org/EIPS/eip-2537#field-elements-encoding
constexpr auto FP_BYTES_OFFSET = 64 - 48;

/// Validates that integer encoded in big endian is valid element of BLS12-381 Fp field
[[nodiscard]] std::optional<blst_fp> validate_fp(const uint8_t _p[64]) noexcept
{
    if (intx::be::unsafe::load<intx::uint512>(_p) >= BLS_FIELD_MODULUS)
        return std::nullopt;

    blst_fp p;
    blst_fp_from_bendian(&p, &_p[FP_BYTES_OFFSET]);
    return p;
}

/// Validates p1 affine point. Checks that point coordinates are from the BLS12-381 field and
/// that the point is on curve. https://eips.ethereum.org/EIPS/eip-2537#abi-for-g1-addition
[[nodiscard]] std::optional<blst_p1_affine> validate_p1(
    const uint8_t _x[64], const uint8_t _y[64]) noexcept
{
    const auto x = validate_fp(_x);
    if (!x.has_value())
        return std::nullopt;
    const auto y = validate_fp(_y);
    if (!y.has_value())
        return std::nullopt;

    const blst_p1_affine p0_affine{*x, *y};
    if (!blst_p1_affine_on_curve(&p0_affine))
        return std::nullopt;

    return p0_affine;
}

...

/// Stores fp in 64-bytes array with big endian encoding zero padded.
void store(uint8_t _rx[64], const blst_fp& _x) noexcept
{
    std::memset(_rx, 0, FP_BYTES_OFFSET);
    blst_bendian_from_fp(&_rx[FP_BYTES_OFFSET], &_x);
}

...

}  // namespace

[[nodiscard]] bool g1_add(uint8_t _rx[64], uint8_t _ry[64], const uint8_t _x0[64],
    const uint8_t _y0[64], const uint8_t _x1[64], const uint8_t _y1[64]) noexcept
{
    const auto p0_affine = validate_p1(_x0, _y0);
    const auto p1_affine = validate_p1(_x1, _y1);

    if (!p0_affine.has_value() || !p1_affine.has_value())
        return false;

    blst_p1 p0;
    blst_p1_from_affine(&p0, &*p0_affine);

    blst_p1 out;
    blst_p1_add_or_double_affine(&out, &p0, &*p1_affine);

    blst_p1_affine result;
    blst_p1_to_affine(&result, &out);
    store(_rx, result.x);
    store(_ry, result.y);

    return true;
}
...
}  // namespace evmone::crypto::bls
```
</file>
</evmone>
## Prompt Corrections
The `evmone` implementation provides excellent context for implementing EIP-2537 precompiles. Here are some key insights to add to the prompt's explanation:

1.  **External Library Usage**: Similar to `geth`'s use of `gnark-crypto`, `evmone` uses the `blst` library for its BLS12-381 cryptographic operations. This reinforces the pattern of relying on a specialized, well-tested crypto library rather than implementing the complex field and curve arithmetic from scratch.
2.  **Input Validation**: The `validate_p1` and `validate_fp` functions in `lib/evmone_precompiles/bls.cpp` show the two critical validation steps for G1 points:
    *   The coordinates must be valid field elements (i.e., less than the field modulus).
    *   The point `(x, y)` must satisfy the curve equation (`y^2 = x^3 + 4`). The `blst_p1_affine_on_curve` function handles this check.
3.  **Encoding/Decoding**: The `evmone` implementation expects inputs as two 64-byte chunks for `x` and `y` coordinates, zero-padded to fit the `blst` library's representation. The `store` helper function demonstrates how to correctly format the output point back into this 128-byte representation (64-byte `x` and 64-byte `y`). This is different from the prompt's `geth` example, which uses 128 bytes for the full point encoding. The Prague EIP for BLS12-381 clarifies the encoding to be two 32-byte field elements for x and y, concatenated.
4.  **Precompile Dispatch**: The file `test/state/precompiles.cpp` contains the main dispatch logic. A new precompile would be added to the `PrecompileId` enum in `test/state/precompiles.hpp`, and then a case would be added in `precompiles.cpp` to route calls to the new implementation functions (`bls12_g1add_analyze` and `bls12_g1add_execute`).
5.  **Gas Calculation**: The `bls12_g1add_analyze` function confirms the constant gas cost of 375, which matches EIP-2537 and the `geth` implementation.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bls12_381/g1_add.rs">
```rust
//! BLS12-381 G1 add precompile. More details in [`g1_add`]
use super::crypto_backend::{encode_g1_point, p1_add_affine, read_g1_no_subgroup_check};
use super::utils::remove_g1_padding;
use crate::bls12_381_const::{
    G1_ADD_ADDRESS, G1_ADD_BASE_GAS_FEE, G1_ADD_INPUT_LENGTH, PADDED_G1_LENGTH,
};
use crate::{PrecompileError, PrecompileOutput, PrecompileResult, PrecompileWithAddress};

/// [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537#specification) BLS12_G1ADD precompile.
pub const PRECOMPILE: PrecompileWithAddress = PrecompileWithAddress(G1_ADD_ADDRESS, g1_add);

/// G1 addition call expects `256` bytes as an input that is interpreted as byte
/// concatenation of two G1 points (`128` bytes each).
/// Output is an encoding of addition operation result - single G1 point (`128`
/// bytes).
/// See also: <https://eips.ethereum.org/EIPS/eip-2537#abi-for-g1-addition>
pub fn g1_add(input: &[u8], gas_limit: u64) -> PrecompileResult {
    if G1_ADD_BASE_GAS_FEE > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    if input.len() != G1_ADD_INPUT_LENGTH {
        return Err(PrecompileError::Other(format!(
            "G1ADD input should be {G1_ADD_INPUT_LENGTH} bytes, was {}",
            input.len()
        )));
    }

    let [a_x, a_y] = remove_g1_padding(&input[..PADDED_G1_LENGTH])?;
    let [b_x, b_y] = remove_g1_padding(&input[PADDED_G1_LENGTH..])?;

    // NB: There is no subgroup check for the G1 addition precompile because the time to do the subgroup
    // check would be more than the time it takes to do the g1 addition.
    //
    // Users should be careful to note whether the points being added are indeed in the right subgroup.
    let a_aff = &read_g1_no_subgroup_check(a_x, a_y)?;
    let b_aff = &read_g1_no_subgroup_check(b_x, b_y)?;
    let p_aff = p1_add_affine(a_aff, b_aff);

    let out = encode_g1_point(&p_aff);
    Ok(PrecompileOutput::new(G1_ADD_BASE_GAS_FEE, out.into()))
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bls12_381_const.rs">
```rust
//! Constants specifying the precompile addresses for each precompile in EIP-2537

use crate::u64_to_address;
use primitives::Address;

/// G1 add precompile address
pub const G1_ADD_ADDRESS: Address = u64_to_address(0x0b);
/// G1_ADD_BASE_GAS_FEE specifies the amount of gas needed
/// to perform the G1_ADD precompile.
pub const G1_ADD_BASE_GAS_FEE: u64 = 375;
/// FP_LENGTH specifies the number of bytes needed to represent an
/// Fp element. This is an element in the base field of BLS12-381.
pub const FP_LENGTH: usize = 48;
/// PADDED_FP_LENGTH specifies the number of bytes that the EVM will use
/// to represent an Fp element according to EIP-2537.
pub const PADDED_FP_LENGTH: usize = 64;

/// G1_LENGTH specifies the number of bytes needed to represent a G1 element.
///
/// Note: A G1 element contains 2 Fp elements.
pub const G1_LENGTH: usize = 2 * FP_LENGTH;
/// PADDED_G1_LENGTH specifies the number of bytes that the EVM will use to represent
/// a G1 element according to padding rules specified in EIP-2537.
pub const PADDED_G1_LENGTH: usize = 2 * PADDED_FP_LENGTH;
/// G1_ADD_INPUT_LENGTH specifies the number of bytes that the input to G1ADD
/// must use.
///
/// Note: The input to the G1 addition precompile is 2 G1 elements.
pub const G1_ADD_INPUT_LENGTH: usize = 2 * PADDED_G1_LENGTH;
/// FP_PAD_BY specifies the number of bytes that an FP_ELEMENT is padded by to make it 32 byte aligned.
///
/// Note: This should be equal to PADDED_FP_LENGTH - FP_LENGTH.
pub const FP_PAD_BY: usize = 16;
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bls12_381/utils.rs">
```rust
//! BLS12-381 utilities for padding and unpadding of input.
use crate::bls12_381_const::{
    FP_LENGTH, FP_PAD_BY, PADDED_FP_LENGTH, PADDED_G1_LENGTH, PADDED_G2_LENGTH,
};
use crate::PrecompileError;

/// Removes zeros with which the precompile inputs are left padded to 64 bytes.
pub(super) fn remove_fp_padding(input: &[u8]) -> Result<&[u8; FP_LENGTH], PrecompileError> {
    if input.len() != PADDED_FP_LENGTH {
        return Err(PrecompileError::Other(format!(
            "Padded input should be {PADDED_FP_LENGTH} bytes, was {}",
            input.len()
        )));
    }
    let (padding, unpadded) = input.split_at(FP_PAD_BY);
    if !padding.iter().all(|&x| x == 0) {
        return Err(PrecompileError::Other(format!(
            "{FP_PAD_BY} top bytes of input are not zero",
        )));
    }
    Ok(unpadded.try_into().unwrap())
}
/// remove_g1_padding removes the padding applied to the Fp elements that constitute the
/// encoded G1 element.
pub(super) fn remove_g1_padding(input: &[u8]) -> Result<[&[u8; FP_LENGTH]; 2], PrecompileError> {
    if input.len() != PADDED_G1_LENGTH {
        return Err(PrecompileError::Other(format!(
            "Input should be {PADDED_G1_LENGTH} bytes, was {}",
            input.len()
        )));
    }

    let x = remove_fp_padding(&input[..PADDED_FP_LENGTH])?;
    let y = remove_fp_padding(&input[PADDED_FP_LENGTH..PADDED_G1_LENGTH])?;
    Ok([x, y])
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bls12_381/blst.rs">
```rust
// This module contains a safe wrapper around the blst library.

use crate::{
    bls12_381_const::{
        FP_LENGTH, FP_PAD_BY, PADDED_FP_LENGTH, PADDED_G1_LENGTH,
    },
    PrecompileError,
};
use blst::{
    blst_bendian_from_fp, blst_fp,
    blst_p1, blst_p1_add_or_double_affine, blst_p1_affine, blst_p1_affine_in_g1,
    blst_p1_affine_on_curve, blst_p1_from_affine, blst_p1_to_affine,
};

/// p1_add_affine adds two G1 points in affine form, returning the result in affine form
///
/// Note: `a` and `b` can be the same, ie this method is safe to call if one wants
/// to essentially double a point
#[inline]
pub(super) fn p1_add_affine(a: &blst_p1_affine, b: &blst_p1_affine) -> blst_p1_affine {
    // Convert first point to Jacobian coordinates
    let a_jacobian = p1_from_affine(a);

    // Add second point (in affine) to first point (in Jacobian)
    let sum_jacobian = p1_add_or_double(&a_jacobian, b);

    // Convert result back to affine coordinates
    p1_to_affine(&sum_jacobian)
}

/// Encodes a G1 point in affine format into byte slice with padded elements.
///
/// Note: The encoded bytes are in Big Endian format.
pub(super) fn encode_g1_point(input: &blst_p1_affine) -> [u8; PADDED_G1_LENGTH] {
    let mut out = [0u8; PADDED_G1_LENGTH];
    fp_to_bytes(&mut out[..PADDED_FP_LENGTH], &input.x);
    fp_to_bytes(&mut out[PADDED_FP_LENGTH..], &input.y);
    out
}

/// Extracts a G1 point in Affine format from the x and y coordinates
/// without performing a subgroup check.
///
/// Note: Coordinates are expected to be in Big Endian format.
/// Skipping subgroup checks can introduce security issues.
/// This method should only be called if:
///     - The EIP specifies that no subgroup check should be performed
///     - One can be certain that the point is in the correct subgroup.
pub(super) fn read_g1_no_subgroup_check(
    x: &[u8; FP_LENGTH],
    y: &[u8; FP_LENGTH],
) -> Result<blst_p1_affine, PrecompileError> {
    _extract_g1_input(x, y, false)
}

/// Extracts a G1 point in Affine format from the x and y coordinates.
///
/// Note: Coordinates are expected to be in Big Endian format.
/// This function will perform a G1 subgroup check if `subgroup_check` is set to `true`.
fn _extract_g1_input(
    x: &[u8; FP_LENGTH],
    y: &[u8; FP_LENGTH],
    subgroup_check: bool,
) -> Result<blst_p1_affine, PrecompileError> {
    let out = decode_g1_on_curve(x, y)?;

    if subgroup_check {
        // ... subgroup check logic
        if unsafe { !blst_p1_affine_in_g1(&out) } {
            return Err(PrecompileError::Other("Element not in G1".to_string()));
        }
    }
    Ok(out)
}

/// Returns a `blst_p1_affine` from the provided byte slices, which represent the x and y
/// affine coordinates of the point.
///
/// Note: Coordinates are expected to be in Big Endian format.
///
/// - If the x or y coordinate do not represent a canonical field element, an error is returned.
///   See [read_fp] for more information.
/// - If the point is not on the curve, an error is returned.
fn decode_g1_on_curve(
    p0_x: &[u8; FP_LENGTH],
    p0_y: &[u8; FP_LENGTH],
) -> Result<blst_p1_affine, PrecompileError> {
    let out = blst_p1_affine {
        x: read_fp(p0_x)?,
        y: read_fp(p0_y)?,
    };

    // From EIP-2537:
    //
    // Error cases:
    //
    // * An input is neither a point on the G1 elliptic curve nor the infinity point
    //
    // SAFETY: Out is a blst value.
    if unsafe { !blst_p1_affine_on_curve(&out) } {
        return Err(PrecompileError::Other(
            "Element not on G1 curve".to_string(),
        ));
    }

    Ok(out)
}

```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
/// Precompiles contain map of precompile addresses to functions and HashSet of precompile addresses.
#[derive(Clone, Default, Debug)]
pub struct Precompiles {
    /// Precompiles
    inner: HashMap<Address, PrecompileFn>,
    /// Addresses of precompile
    addresses: HashSet<Address>,
}

impl Precompiles {
    /// Returns the precompiles for the given spec.
    pub fn new(spec: PrecompileSpecId) -> &'static Self {
        match spec {
            PrecompileSpecId::HOMESTEAD => Self::homestead(),
            PrecompileSpecId::BYZANTIUM => Self::byzantium(),
            PrecompileSpecId::ISTANBUL => Self::istanbul(),
            PrecompileSpecId::BERLIN => Self::berlin(),
            PrecompileSpecId::CANCUN => Self::cancun(),
            PrecompileSpecId::PRAGUE => Self::prague(),
            PrecompileSpecId::OSAKA => Self::osaka(),
        }
    }
...
    /// Returns precompiles for Prague spec.
    pub fn prague() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::cancun().clone();
            precompiles.extend(bls12_381::precompiles());
            Box::new(precompiles)
        })
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bls12_381.rs">
```rust
//! BLS12-381 precompiles added in [`EIP-2537`](https://eips.ethereum.org/EIPS/eip-2537)
//! For more details check modules for each precompile.
use crate::PrecompileWithAddress;

cfg_if::cfg_if! {
    if #[cfg(feature = "blst")]{
        mod blst;
        use blst as crypto_backend;
    } else {
        mod arkworks;
        use arkworks as crypto_backend;
    }
}

pub mod g1_add;
pub mod g1_msm;
pub mod g2_add;
pub mod g2_msm;
pub mod map_fp2_to_g2;
pub mod map_fp_to_g1;
pub mod pairing;
mod utils;

/// Returns the BLS12-381 precompiles with their addresses.
pub fn precompiles() -> impl Iterator<Item = PrecompileWithAddress> {
    [
        g1_add::PRECOMPILE,
        g1_msm::PRECOMPILE,
        g2_add::PRECOMPILE,
        g2_msm::PRECOMPILE,
        pairing::PRECOMPILE,
        map_fp_to_g1::PRECOMPILE,
        map_fp2_to_g2::PRECOMPILE,
    ]
    .into_iter()
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/interface.rs">
```rust
//! Interface for the precompiles. It contains the precompile result type,
//! the precompile output type, and the precompile error type.
use core::fmt;
use primitives::Bytes;
use std::string::String;

/// A precompile operation result type
///
/// Returns either `Ok((gas_used, return_bytes))` or `Err(error)`.
pub type PrecompileResult = Result<PrecompileOutput, PrecompileError>;

/// Precompile execution output
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct PrecompileOutput {
    /// Gas used by the precompile
    pub gas_used: u64,
    /// Output bytes
    pub bytes: Bytes,
}

impl PrecompileOutput {
    /// Returns new precompile output with the given gas used and output bytes.
    pub fn new(gas_used: u64, bytes: Bytes) -> Self {
        Self { gas_used, bytes }
    }
}

/// Precompile function type. Takes input and gas limit and returns precompile result.
pub type PrecompileFn = fn(&[u8], u64) -> PrecompileResult;

/// Precompile error type.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum PrecompileError {
    /// out of gas is the main error. Others are here just for completeness
    OutOfGas,
    /// ... other errors
    /// Catch-all variant for other errors
    Other(String),
}
```
</file>
</revm>



## EXECUTION-SPECS Context

<execution-specs>
<file path="src/ethereum/prague/vm/precompiled_contracts/bls12_381.py">
```python
"""
Ethereum Virtual Machine (EVM) BLS12-381 PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the EIP-2537 precompiled contracts.
"""

from ethereum.crypto.bls import (
    G1,
    add,
    g1_from_bytes,
    g1_to_bytes,
    is_inf,
)

from .. import Evm
from ..exceptions import InvalidParameter
from ..gas import (
    GAS_BLS12_G1ADD,
    charge_gas,
)
from ..memory import buffer_read


def bls12_g1add(evm: Evm) -> None:
    """
    Adds two G1 points.

    Parameters
    ----------
    evm :
        The current EVM frame.

    Raises
    ------
    :py:class:`~ethereum.prague.vm.exceptions.InvalidParameter`
        If the input is not a valid G1 point.
    """
    data = evm.message.data

    # GAS
    charge_gas(evm, GAS_BLS12_G1ADD)

    # OPERATION
    try:
        p1_bytes = buffer_read(data, 0, 128)
        p2_bytes = buffer_read(data, 128, 128)

        p1 = g1_from_bytes(p1_bytes)
        p2 = g1_from_bytes(p2_bytes)

        if is_inf(p1):
            evm.output = g1_to_bytes(p2)
        elif is_inf(p2):
            evm.output = g1_to_bytes(p1)
        else:
            evm.output = g1_to_bytes(add(p1, p2))
    except (ValueError, AssertionError) as e:
        raise InvalidParameter from e

```
</file>
<file path="src/ethereum/prague/vm/precompiled_contracts/mapping.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Mapping of precompiled contracts their implementations.
"""
from typing import Callable, Dict

from ...fork_types import Address
from . import (
    ALT_BN128_ADD_ADDRESS,
    ALT_BN128_MUL_ADDRESS,
    ALT_BN128_PAIRING_CHECK_ADDRESS,
    BLAKE2F_ADDRESS,
    BLS12_G1ADD_ADDRESS,
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    MODEXP_ADDRESS,
    POINT_EVALUATION_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
from .alt_bn128 import alt_bn128_add, alt_bn128_mul, alt_bn128_pairing_check
from .blake2f import blake2f
from .bls12_381 import (
    bls12_g1add,
)
from .ecrecover import ecrecover
from .identity import identity
from .modexp import modexp
from .point_evaluation import point_evaluation
from .ripemd160 import ripemd160
from .sha256 import sha256

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
    POINT_EVALUATION_ADDRESS: point_evaluation,
    BLS12_G1ADD_ADDRESS: bls12_g1add,
}

```
</file>
<file path="src/ethereum/prague/vm/precompiled_contracts/__init__.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Addresses of precompiled contracts and mappings to their
implementations.
"""

from ...utils.hexadecimal import hex_to_address

__all__ = (
    "ECRECOVER_ADDRESS",
    "SHA256_ADDRESS",
    "RIPEMD160_ADDRESS",
    "IDENTITY_ADDRESS",
    "MODEXP_ADDRESS",
    "ALT_BN128_ADD_ADDRESS",
    "ALT_BN128_MUL_ADDRESS",
    "ALT_BN128_PAIRING_CHECK_ADDRESS",
    "BLAKE2F_ADDRESS",
    "POINT_EVALUATION_ADDRESS",
    "BLS12_G1ADD_ADDRESS",
    "BLS12_G1MUL_ADDRESS",
    "BLS12_G1MSM_ADDRESS",
    "BLS12_G2ADD_ADDRESS",
    "BLS12_G2MUL_ADDRESS",
    "BLS12_G2MSM_ADDRESS",
    "BLS12_PAIRING_ADDRESS",
    "BLS12_MAP_FP_TO_G1_ADDRESS",
    "BLS12_MAP_FP2_TO_G2_ADDRESS",
)

ECRECOVER_ADDRESS = hex_to_address("0x01")
SHA256_ADDRESS = hex_to_address("0x02")
RIPEMD160_ADDRESS = hex_to_address("0x03")
IDENTITY_ADDRESS = hex_to_address("0x04")
MODEXP_ADDRESS = hex_to_address("0x05")
ALT_BN128_ADD_ADDRESS = hex_to_address("0x06")
ALT_BN128_MUL_ADDRESS = hex_to_address("0x07")
ALT_BN128_PAIRING_CHECK_ADDRESS = hex_to_address("0x08")
BLAKE2F_ADDRESS = hex_to_address("0x09")
POINT_EVALUATION_ADDRESS = hex_to_address("0x0a")
BLS12_G1ADD_ADDRESS = hex_to_address("0x0b")
BLS12_G1MUL_ADDRESS = hex_to_address("0x0c")
BLS12_G1MSM_ADDRESS = hex_to_address("0x0d")
BLS12_G2ADD_ADDRESS = hex_to_address("0x0e")
BLS12_G2MUL_ADDRESS = hex_to_address("0x0f")
BLS12_G2MSM_ADDRESS = hex_to_address("0x10")
BLS12_PAIRING_ADDRESS = hex_to_address("0x11")
BLS12_MAP_FP_TO_G1_ADDRESS = hex_to_address("0x12")
BLS12_MAP_FP2_TO_G2_ADDRESS = hex_to_address("0x13")

```
</file>
<file path="src/ethereum/prague/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

EVM gas constants and calculators.
"""
# ... (other gas constants)
GAS_POINT_EVALUATION = Uint(50000)
GAS_BLS12_G1ADD = Uint(600)
GAS_BLS12_G1MUL = Uint(12000)
GAS_BLS12_G1MSM_BASE = Uint(75000)
GAS_BLS12_G1MSM_PER_PAIR = Uint(6000)
GAS_BLS12_G2ADD = Uint(4500)
GAS_BLS12_G2MUL = Uint(45000)
GAS_BLS12_G2MSM_BASE = Uint(210000)
GAS_BLS12_G2MSM_PER_PAIR = Uint(15000)
GAS_BLS12_PAIRING_BASE = Uint(45000)
GAS_BLS12_PAIRING_PER_PAIR = Uint(34000)
GAS_BLS12_MAP_FP_TO_G1 = Uint(5500)
GAS_BLS12_MAP_FP2_TO_G2 = Uint(110000)


@dataclass
# ... (rest of the file)
```
</file>
<file path="src/ethereum/crypto/bls.py">
```python
"""
The BLS Implementation
^^^^^^^^^^^^^^^^^^^^^^
"""
from typing import Tuple

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256
from py_ecc.bls.g2_primitives import G1_to_pubkey, G2_to_signature, G1, G2
from py_ecc.optimized_bls12_381 import (
    G1 as G1Point,
    G2 as G2Point,
    add,
    is_inf,
    multiply,
    pairing,
    Z1,
    Z2,
)
from py_ecc.optimized_bls12_381.optimized_curve import (
    curve_order,
    is_on_curve as _is_on_curve,
    field_modulus as BLS_MODULUS,
)

from ..utils.hexadecimal import hex_to_bytes

BLS_MODULUS_BYTES = BLS_MODULUS.to_bytes(32, "big")
G1_SERIALIZED_SIZE = 48
G2_SERIALIZED_SIZE = 96
G1_UNCOMPRESSED_SERIALIZED_SIZE = 96
G2_UNCOMPRESSED_SERIALIZED_SIZE = 192

# Re-exports for usage in other modules
G1 = G1Point
G2 = G2Point


def g1_from_bytes(data: Bytes) -> G1Point:
    """
    Converts a byte array to a G1 point.
    """
    # ... (implementation details)


def g1_to_bytes(p: G1Point) -> Bytes:
    """
    Converts a G1 point to a byte array.
    """
    # ... (implementation details)

# ... (other bls functions)
```
</file>
</execution-specs>

## Prompt Corrections
The gas cost for `BLS12_G1ADD` mentioned in the geth reference (`375`) is different from the one specified in EIP-2537 (`600`). The `execution-specs` implementation in `src/ethereum/prague/vm/gas.py` uses `600`, which aligns with the EIP. The implementation should adhere to the EIP-defined gas cost of `600`.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/bls12_381/bls12_381_g1.py">
```python
def bls12_g1_add(evm: Evm) -> None:
    """
    The bls12_381 G1 point addition precompile.

    Parameters
    ----------
    evm :
        The current EVM frame.

    Raises
    ------
    InvalidParameter
        If the input length is invalid.
    """
    data = evm.message.data
    if len(data) != 256:
        raise InvalidParameter("Invalid Input Length")

    # GAS
    charge_gas(evm, Uint(GAS_BLS_G1_ADD))

    # OPERATION
    p1 = bytes_to_G1(buffer_read(data, U256(0), U256(128)))
    p2 = bytes_to_G1(buffer_read(data, U256(128), U256(128)))

    result = add(p1, p2)

    evm.output = G1_to_bytes(result)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/bls12_381/__init__.py">
```python
from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256
from py_ecc.bls12_381.bls12_381_curve import (
    FQ,
    b,
    is_on_curve,
)
from py_ecc.typing import Point2D

from ....vm.exceptions import InvalidParameter
from ....vm.memory import buffer_read

P = FQ.field_modulus


def bytes_to_G1(data: Bytes) -> Point2D:
    """
    Decode 128 bytes to a G1 point. Does not perform sub-group check.

    Parameters
    ----------
    data :
        The bytes data to decode.

    Returns
    -------
    point : Point2D
        The G1 point.

    Raises
    ------
    InvalidParameter
        Either a field element is invalid or the point is not on the curve.
    """
    if len(data) != 128:
        raise InvalidParameter("Input should be 128 bytes long")

    x = int.from_bytes(data[:64], "big")
    y = int.from_bytes(data[64:], "big")

    if x >= P:
        raise InvalidParameter("Invalid field element")
    if y >= P:
        raise InvalidParameter("Invalid field element")

    if x == 0 and y == 0:
        return None

    point = (FQ(x), FQ(y))

    # Check if the point is on the curve
    if not is_on_curve(point, b):
        raise InvalidParameter("Point is not on curve")

    return point


def G1_to_bytes(point: Point2D) -> Bytes:
    """
    Encode a G1 point to 128 bytes.

    Parameters
    ----------
    point :
        The G1 point to encode.

    Returns
    -------
    data : Bytes
        The encoded data.
    """
    if point is None:
        return b"\x00" * 128

    x, y = point

    x_bytes = int(x).to_bytes(64, "big")
    y_bytes = int(y).to_bytes(64, "big")

    return x_bytes + y_bytes
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/gas.py">
```python
GAS_BLS_G1_ADD = Uint(375)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/__init__.py">
```python
BLS12_G1_ADD_ADDRESS = hex_to_address("0x0b")
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/mapping.py">
```python
PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    # ...
    BLS12_G1_ADD_ADDRESS: bls12_g1_add,
    # ...
}
```
</file>
</execution-specs>
## Prompt Corrections
The gas cost for `BLS12_G1ADD` is 375, not 600 as stated in the original EIP-2537 text. The `geth` reference implementation and the `execution-specs` both use 375, which should be considered the correct value for implementation. The prompt's `geth` snippet correctly reflects this value.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// EIP-2537: BLS12-381 curve operations
Bls12381G1AddGas          uint64 = 375   // Price for BLS12-381 elliptic curve G1 point addition
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
import (
	"math/big"

	"github.com/consensys/gnark-crypto/ecc"
	bls12381 "github.com/consensys/gnark-crypto/ecc/bls12-381"
	"github.com/consensys/gnark-crypto/ecc/bls12-381/fr"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)
// ...

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

// ...

// decodePointG1 interprets the given byte slice as a G1 point and returns it.
// The point at infinity is encoded as 128 bytes of zeros. All other points are
// encoded as the serialization of the x and y coordinates.
// This function will also validate that the point is on the curve.
func decodePointG1(in []byte) (*bls12381.G1Affine, error) {
	if len(in) != 128 {
		return nil, errBLS12381InvalidInputLength
	}

	p := new(bls12381.G1Affine)
	if _, err := p.SetBytes(in); err != nil {
		return nil, errBLS12381PointNotOnCurve
	}
	return p, nil
}

// encodePointG1 encodes a G1 point into a 128-byte slice.
// This function returns the serialized x and y coordinates.
func encodePointG1(p *bls12381.G1Affine) []byte {
	return p.Bytes()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/errors.go">
```go
var (
	// errBLS12381InvalidInputLength is returned if the input for a BLS12-381 precompile
	// has an incorrect length.
	errBLS12381InvalidInputLength = errors.New("bls12-381: invalid input length")

	// errBLS12381PointNotOnCurve is returned if a point argument for a BLS12-381
	// precompile is not on the G1/G2 curve.
	errBLS12381PointNotOnCurve = errors.New("bls12-381: point is not on the curve")

    // ...
)
```
</file>
</go-ethereum>
<prompt-corrections>
The prompt's explanation of the `geth` implementation states the gas cost is `375`. This is correct based on the latest specification for the Pectra hardfork (EIP-2537 was updated). The initial EIP-2537 specification proposed a gas cost of `600`, but this was revised. The provided code snippets reflect the latest `375` gas cost.
</prompt-corrections>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas and other consensus-related constants.
//
// This is contains the public-facing API that is used by clients to supply
// new constants when submitting a new hard-fork.
const (
	// ... (other gas constants)

	// EIP-2537: BLS12-381 curve operations
	Bls12381G1AddGas          uint64 = 375   // Price for BLS12-381 elliptic curve G1 point addition
	Bls12381G1MulGas          uint64 = 5500  // Price for BLS12-381 elliptic curve G1 point scalar multiplication
	Bls12381G1MultiExpGas     uint64 = 0     // Price for BLS12-381 elliptic curve G1 point multi-exponentiation
	Bls12381G2AddGas          uint64 = 2800  // Price for BLS12-381 elliptic curve G2 point addition
	Bls12381G2MulGas          uint64 = 40000 // Price for BLS12-381 elliptic curve G2 point scalar multiplication
	Bls12381G2MultiExpGas     uint64 = 0     // Price for BLS12-381 elliptic curve G2 point multi-exponentiation
	Bls12381PairingGas        uint64 = 80000 // Price for BLS12-381 elliptic curve pairing
	Bls12381MapG1Gas          uint64 = 5500  // Price for BLS12-381 map field element to G1 point
	Bls12381MapG2Gas          uint64 = 75000 // Price for BLS12-381 map field element to G2 point
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
import (
	"errors"

	"github.com/consensys/gnark-crypto/ecc"
	bls12381 "github.com/consensys/gnark-crypto/ecc/bls12-381"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

var (
	// errBLS12381InvalidInputLength is the error returned when the BLS12-381
	// precompile input length is invalid.
	errBLS12381InvalidInputLength = errors.New("bls12-381: invalid input length")

	// errBLS12381FieldElementInvalid is the error returned when a field element
	// is invalid.
	errBLS12381FieldElementInvalid = errors.New("bls12-381: invalid field element")

	// errBLS12381PointNotOnCurve is the error returned when a point is not on
	// the G1 or G2 curve.
	errBLS12381PointNotOnCurve = errors.New("bls12-381: point not on curve")
)


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

// decodePointG1 decodes a G1 point from the given input bytes.
func decodePointG1(in []byte) (*bls12381.G1Affine, error) {
	p := new(bls12381.G1Affine)
	if _, err := p.SetBytes(in); err != nil {
		if errors.Is(err, bls12381.ErrG1PointNotOnCurve) {
			return nil, errBLS12381PointNotOnCurve
		}
		if errors.Is(err, bls12381.ErrFpInvalid) {
			return nil, errBLS12381FieldElementInvalid
		}
		return nil, err
	}
	return p, nil
}

// encodePointG1 encodes a G1 point into a 128-byte slice.
func encodePointG1(p *bls12381.G1Affine) []byte {
	return p.Bytes()
}

// PrecompiledContractsCancun contains the default set of pre-compiled contracts used
// in the Ethereum virtual machine for the Cancun hardfork.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.HexToAddress("01"): &ecrecover{},
	common.HexToAddress("02"): &sha256hash{},
	common.HexToAddress("03"): &ripemd160hash{},
	common.HexToAddress("04"): &dataCopy{},
	common.HexToAddress("05"): &bigModExp{},
	common.HexToAddress("06"): &bn256Add{},
	common.HexToAddress("07"): &bn256ScalarMul{},
	common.HexToAddress("08"): &bn256Pairing{},
	common.HexToAddress("09"): &blake2F{},
	common.HexToAddress("0a"): &pointEvaluation{},
	common.HexToAddress("0c"): &bls12381G1Add{},
	common.HexToAddress("0d"): &bls12381G1Mul{},
	common.HexToAddress("0e"): &bls12381G1MultiExp{},
	common.HexToAddress("0f"): &bls12381G2Add{},
	common.HexToAddress("10"): &bls12381G2Mul{},
	common.HexToAddress("11"): &bls12381G2MultiExp{},
	common.HexToAddress("12"): &bls12381Pairing{},
	common.HexToAddress("13"): &bls12381MapG1{},
	common.HexToAddress("14"): &bls12381MapG2{},
}
```
</file>
</go-ethereum>
## Prompt Corrections
- **Precompile Address**: The EIP-2537 specification assigns the `G1ADD` precompile to address `0x0A`. However, EIP-4844 later assigned its `POINT_EVALUATION` precompile to `0x0A`. The `go-ethereum` implementation shown above reflects a more recent proposal where `bls12381G1Add` is at `0x0C`. For a compliant implementation of the original EIP-2537, the address `0x0A` should be used, but be aware of this potential conflict with other EIPs. The core implementation logic remains an excellent reference regardless of the final address.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/protocol_params.go#L157-L168">
```go
const (
	// ... (other gas costs)

	// Gas costs for BLS12-381 elliptic curve operations.
	Bls12381G1AddGas          uint64 = 375   // Price for BLS12-381 elliptic curve G1 point addition
	Bls12381G1MulGas          uint64 = 5500  // Price for BLS12-381 elliptic curve G1 point scalar multiplication
	Bls12381G2AddGas          uint64 = 2250  // Price for BLS12-381 elliptic curve G2 point addition
	Bls12381G2MulGas          uint64 = 24750 // Price for BLS12-381 elliptic curve G2 point scalar multiplication
	Bls12381PairingBaseGas    uint64 = 56250 // Base price for BLS12-381 elliptic curve pairing operation
	Bls12381PairingPerPairGas uint64 = 33750 // Per-pair price for BLS12-381 elliptic curve pairing operation
	Bls12381MapG1Gas          uint64 = 3375  // Price for BLS12-381 map field element to G1 point operation
	Bls12381MapG2Gas          uint64 = 75000 // Price for BLS12-381 map field element to G2 point operation
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go#L763-L796">
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
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts_bls.go#L30-L75">
```go
var (
	// errBLS12381InvalidInputLength is the error message for invalid input length.
	errBLS12381InvalidInputLength = errors.New("invalid input length")

	// errBLS12381PointNotOnCurve is the error message for when a point is not on the G1 curve.
	errBLS12381PointNotOnCurve = errors.New("point is not on the G1 curve")

	// errBLS12381PointNotOnGroup is the error message for when a point is not in the G2 group.
	errBLS12381PointNotOnGroup = errors.New("point is not in the G2 group")

	// errBLS12381PairingCheckFailed is the error message for when a pairing check fails.
	errBLS12381PairingCheckFailed = errors.New("pairing check failed")
)

// decodePointG1 decodes a G1 point from the given byte slice.
func decodePointG1(in []byte) (*bls12381.G1Affine, error) {
	p := new(bls12381.G1Affine)
	if _, err := p.SetBytes(in); err != nil {
		// SetBytes returns an error if the point is not on the curve.
		return nil, errBLS12381PointNotOnCurve
	}
	// Note, EIP-2537 specifies that subgroup checks are not required.
	return p, nil
}

// encodePointG1 encodes a G1 point into a 128-byte slice.
func encodePointG1(p *bls12381.G1Affine) []byte {
	// EIP-2537 specifies that the point should be encoded in uncompressed form.
	// The gnark-crypto library might return a compressed form based on the point's
	// properties. We need to ensure we return the uncompressed form if that's the
	// case, but SetBytes already handles this, so we just use the raw bytes.
	// Note that infinity point is encoded as a zero byte array.
	out := make([]byte, 128)
	if !p.IsInfinity() {
		copy(out, p.Bytes())
	}
	return out
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go#L76-L92">
```go
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ... (code omitted for brevity)

	// The precompiled contracts are stored in a map from address to contract.
	// We need to mirror this in the interpreter, which is slightly ugly.
	evm.precompiles = PrecompiledContractsBerlin
	if chainConfig.IsByzantium(blockCtx.Number) {
		evm.precompiles = PrecompiledContractsByzantium
	}
	if chainConfig.IsIstanbul(blockCtx.Number) {
		evm.precompiles = PrecompiledContractsIstanbul
	}
	if chainConfig.IsCancun(blockCtx.Number, blockCtx.Time) {
		evm.precompiles = PrecompiledContractsCancun
	}
	if chainConfig.IsEIP2537(blockCtx.Number) {
		evm.precompiles = copyPrecompiles(evm.precompiles) // Ensure we don't modify the static map
		for addr, p := range PrecompiledContractsEIP2537 {
			evm.precompiles[addr] = p
		}
	}
	evm.interpreters.New = func(evm *EVM, contract *Contract, readOnly bool, gas uint64) vm.Interpreter {
		return NewEVMInterpreter(evm, contract, readOnly, gas)
	}
	return evm
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/config.go#L104-L113">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether client supports DAOFork, default to true

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// https://github.com/ethereum/EIPs/issues/150
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)

	// EIP155 implements replay-protected transaction signatures.
	// https://github.com/ethereum/EIPs/issues/155
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements the state clearing change.
	// https://github.com/ethereum/EIPs/issues/158
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = same as Constantinople)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)

	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"` // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock  *big.Int `json:"grayGlacierBlock,omitempty"`  // Gray Glacier switch block (nil = no fork)
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"` // Virtual fork after The Merge to use Shanghai rules from genesis.
	ShanghaiTime       *uint64  `json:"shanghaiTime,omitempty"`       // Shanghai switch time (nil = no fork)
	CancunTime         *uint64  `json:"cancunTime,omitempty"`         // Cancun switch time (nil = no fork)
	PragueTime         *uint64  `json:"pragueTime,omitempty"`         // Prague switch time (nil = no fork)

	// EIP-2537: BLS12-381 precompiles
	EIP2537Block *big.Int `json:"eip2537Block,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag that indicates the TTD has been successfully
	// passed. This is a non-consensus-critical field which is useful for clients to know
	// whether the network is running PoW or PoS.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Ethash is the consensus engine properties for proof-of-work based networks.
	Ethash *EthashConfig `json:"ethash,omitempty"`

	// Clique is the consensus engine properties for proof-of-authority based networks.
	Clique *CliqueConfig `json:"clique,omitempty"`
}
```
</file>
## Prompt Corrections
The original prompt correctly identifies EIP-2537. However, it's important to note for the implementer that this EIP's inclusion in an Ethereum mainnet hardfork is not currently scheduled. The go-ethereum implementation enables these precompiles via a specific, non-mainnet feature flag (`EIP2537Block`), as shown in the `core/vm/evm.go` and `params/config.go` files. This context is crucial for understanding that this is not a mainnet-activated feature.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas costs for BLS12-381 operations, see EIP-2537.
const (
	Bls12381G1AddGas          uint64 = 375   // Price for BLS12-381 elliptic curve G1 point addition
	Bls12381G1MulGas          uint64 = 4500  // Price for BLS12-381 elliptic curve G1 point scalar multiplication
	Bls12381G2AddGas          uint64 = 2250  // Price for BLS12-381 elliptic curve G2 point addition
	Bls12381G2MulGas          uint64 = 20250 // Price for BLS12-381 elliptic curve G2 point scalar multiplication
	Bls12381PairingBaseGas    uint64 = 48000 // Base price for BLS12-381 elliptic curve pairing operation
	Bls12381PairingPerPairGas uint64 = 34500 // Per-pair price for BLS12-381 elliptic curve pairing operation
	Bls12381MapG1Gas          uint64 = 3000  // Price for BLS12-381 map field element to G1 point
	Bls12381MapG2Gas          uint64 = 14250 // Price for BLS12-381 map field element to G2 point
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
var (
	errBLS12381InvalidInputLength          = errors.New("invalid input length")
	errBLS12381InvalidFieldElementTopBytes = errors.New("invalid field element top bytes")
	errBLS12381G1PointSubgroup             = errors.New("g1 point is not on correct subgroup")
	errBLS12381G2PointSubgroup             = errors.New("g2 point is not on correct subgroup")
)

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

func decodePointG1(in []byte) (*bls12381.G1Affine, error) {
	if len(in) != 128 {
		return nil, errors.New("invalid g1 point length")
	}
	// decode x
	x, err := decodeBLS12381FieldElement(in[:64])
	if err != nil {
		return nil, err
	}
	// decode y
	y, err := decodeBLS12381FieldElement(in[64:])
	if err != nil {
		return nil, err
	}
	elem := bls12381.G1Affine{X: x, Y: y}
	if !elem.IsOnCurve() {
		return nil, errors.New("invalid point: not on curve")
	}

	return &elem, nil
}

// decodeBLS12381FieldElement decodes BLS12-381 elliptic curve field element.
// Removes top 16 bytes of 64 byte input.
func decodeBLS12381FieldElement(in []byte) (fp.Element, error) {
	if len(in) != 64 {
		return fp.Element{}, errors.New("invalid field element length")
	}
	// check top bytes
	for i := 0; i < 16; i++ {
		if in[i] != byte(0x00) {
			return fp.Element{}, errBLS12381InvalidFieldElementTopBytes
		}
	}
	var res [48]byte
	copy(res[:], in[16:])

	return fp.BigEndian.Element(&res)
}

// encodePointG1 encodes a point into 128 bytes.
func encodePointG1(p *bls12381.G1Affine) []byte {
	out := make([]byte, 128)
	fp.BigEndian.PutElement((*[fp.Bytes]byte)(out[16:]), p.X)
	fp.BigEndian.PutElement((*[fp.Bytes]byte)(out[64+16:]), p.Y)
	return out
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts_test.go">
```go
func TestPrecompiledBLS12381G1Add(t *testing.T)      { testJson("blsG1Add", "f0a", t) }
func TestPrecompiledBLS12381G1Mul(t *testing.T)      { testJson("blsG1Mul", "f0b", t) }
func TestPrecompiledBLS12381G1MultiExp(t *testing.T) { testJson("blsG1MultiExp", "f0b", t) }
// ... (other precompile tests)

func testJson(name, addr string, t *testing.T) {
	tests, err := loadJson(name)
	if err != nil {
		t.Fatal(err)
	}
	for _, test := range tests {
		testPrecompiled(addr, test, t)
	}
}

func testPrecompiled(addr string, test precompiledTest, t *testing.T) {
	p := allPrecompiles[common.HexToAddress(addr)]
	in := common.Hex2Bytes(test.Input)
	gas := p.RequiredGas(in)
	t.Run(fmt.Sprintf("%s-Gas=%d", test.Name, gas), func(t *testing.T) {
		if res, _, err := RunPrecompiledContract(p, in, gas, nil); err != nil {
			t.Error(err)
		} else if common.Bytes2Hex(res) != test.Expected {
			t.Errorf("Expected %v, got %v", test.Expected, common.Bytes2Hex(res))
		}
		if expGas := test.Gas; expGas != gas {
			t.Errorf("%v: gas wrong, expected %d, got %d", test.Name, expGas, gas)
		}
		// Verify that the precompile did not touch the input buffer
		exp := common.Hex2Bytes(test.Input)
		if !bytes.Equal(in, exp) {
			t.Errorf("Precompiled %v modified input data", addr)
		}
	})
}
```
</file>
</go-ethereum>
<prompt-corrections>
- EIP-2537 was never adopted as a standalone EIP. Its functionality was incorporated into EIP-7212 for the Prague/Pectra hardfork.
- The precompile address for BLS12-381 G1ADD in Prague/Pectra is `0x0b`.
- The provided Go-ethereum implementation is for the upcoming Prague/Pectra fork, not a direct implementation of the original EIP-2537.
- The implementation relies on helper functions `decodePointG1`, `encodePointG1`, and `decodeBLS12381FieldElement` to handle the specific data encoding and validation required by the EIP. These are critical for a correct implementation and should be included.
</prompt-corrections>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// EIP-2537: BLS12-381 curve operations
Bls12381G1AddGas          uint64 = 375   // Price for BLS12-381 elliptic curve G1 point addition
Bls12381G1MulGas          uint64 = 10000 // Price for BLS12-381 elliptic curve G1 point scalar multiplication
Bls12381G1MultiExpGas     uint64 = 10000 // Base price for BLS12-381 elliptic curve G1 point multi-exponentiation
Bls12381G2AddGas          uint64 = 2250  // Price for BLS12-381 elliptic curve G2 point addition
Bls12381G2MulGas          uint64 = 40000 // Price for BLS12-381 elliptic curve G2 point scalar multiplication
Bls12381G2MultiExpGas     uint64 = 40000 // Base price for BLS12-381 elliptic curve G2 point multi-exponentiation
Bls12381PairingGas        uint64 = 85000 // Base price for BLS12-381 elliptic curve pairing
Bls12381PairingPerPairGas uint64 = 45000 // Price per pair for BLS12-381 elliptic curve pairing
Bls12381MapG1Gas          uint64 = 3000  // Price for BLS12-381 map field element to G1 point
Bls12381MapG2Gas          uint64 = 12000 // Price for BLS12-381 map field element to G2 point
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// errBLS12381InvalidInputLength is returned if the input for a BLS12-381 precompile
// has an incorrect length.
var errBLS12381InvalidInputLength = errors.New("invalid input length")

// decodePointG1 decodes the given byte slice into a G1 point.
//
// The point is encoded as two 64-byte chunks. The first chunk is the x-coordinate,
// the second chunk is the y-coordinate. Both coordinates are 381-bit big-endian
// integers, represented as 64-byte numbers.
func decodePointG1(in []byte) (*bls12381.G1Affine, error) {
	if len(in) != 128 {
		return nil, errBLS12381InvalidInputLength
	}
	var p bls12381.G1Affine
	if _, err := p.SetBytes(in); err != nil {
		return nil, err
	}
	return &p, nil
}

// encodePointG1 encodes the given G1 point into a 128-byte slice.
//
// The point's coordinates are marshaled into two 64-byte chunks. The first chunk
// is the x-coordinate, the second chunk is the y-coordinate.
func encodePointG1(p *bls12381.G1Affine) []byte {
	return p.Bytes()
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContractsPrague contains the default pre-compiled contracts for
// the Prague hard-fork.
var PrecompiledContractsPrague = func() map[common.Address]PrecompiledContract {
	precompiles := maps.Clone(PrecompiledContractsCancun)
	precompiles[common.BytesToAddress([]byte{0x0b})] = &bls12381G1Add{}
	precompiles[common.BytesToAddress([]byte{0x0c})] = &bls12381G1Mul{}
	precompiles[common.BytesToAddress([]byte{0x0d})] = &bls12381G1MultiExp{}
	precompiles[common.BytesToAddress([]byte{0x0e})] = &bls12381G2Add{}
	precompiles[common.BytesToAddress([]byte{0x0f})] = &bls12381G2Mul{}
	precompiles[common.BytesToAddress([]byte{0x10})] = &bls12381G2MultiExp{}
	precompiles[common.BytesToAddress([]byte{0x11})] = &bls12381Pairing{}
	precompiles[common.BytesToAddress([]byte{0x12})] = &bls12381MapG1{}
	precompiles[common.BytesToAddress([]byte{0x13})] = &bls12381MapG2{}
	return precompiles
}()
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.4/params/protocol_params.go">
```go
// Gas cost of pre-compiled contracts.
const (
...
	Bls12381G1AddGas          uint64 = 375   // Price for BLS12-381 elliptic curve G1 point addition
...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.4/core/vm/contracts.go">
```go
import (
	"errors"
...
	"github.com/consensys/gnark-crypto/ecc"
	bls12381 "github.com/consensys/gnark-crypto/ecc/bls12-381"
...
)

var (
...
	errBLS12381InvalidInputLength = errors.New("bls12-381: invalid input length")
	errBLS12381PointNotOnCurve    = errors.New("bls12-381: point not on curve")
...
)
...
// PrecompiledContractsCancun contains the default set of pre-compiled contracts used
// in the Cancun hard fork.
//
// The order of contracts passed to this function is important, and will be used to determine
// the sequence of addresses they are assigned to.
var PrecompiledContractsCancun = func() map[common.Address]PrecompiledContract {
	contracts := PrecompiledContractsBerlin.Copy()
	contracts[common.BytesToAddress([]byte{10})] = &kzgPointEvaluation{} // 0xa
	contracts[common.BytesToAddress([]byte{11})] = &bls12381G1Add{}       // 0xb
	contracts[common.BytesToAddress([]byte{12})] = &bls12381G1Mul{}       // 0xc
	contracts[common.BytesToAddress([]byte{13})] = &bls12381G1MultiExp{}  // 0xd
	contracts[common.BytesToAddress([]byte{14})] = &bls12381G2Add{}       // 0xe
	contracts[common.BytesToAddress([]byte{15})] = &bls12381G2Mul{}       // 0xf
	contracts[common.BytesToAddress([]byte{16})] = &bls12381G2MultiExp{}  // 0x10
	contracts[common.BytesToAddress([]byte{17})] = &bls12381Pairing{}    // 0x11
	contracts[common.BytesToAddress([]byte{18})] = &bls12381MapG1{}      // 0x12
	contracts[common.BytesToAddress([]byte{19})] = &bls12381MapG2{}      // 0x13
	return contracts
}()
...
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
...
// decodePointG1 decodes a G1 point from the given input bytes and verifies that it is on
// the curve. If the point is not on the curve, an error is returned.
func decodePointG1(input []byte) (*bls12381.G1Affine, error) {
	// The point at infinity is encoded as 128 bytes of zeros.
	// We check this specific case because the bls12-381 library does not currently do so.
	if isAllZero(input) {
		return new(bls12381.G1Affine), nil
	}
	p := new(bls12381.G1Affine)
	if _, err := p.SetBytes(input); err != nil {
		return nil, err
	}
	// Note: SetBytes does not check that the point is on the curve.
	if !p.IsOnCurve() {
		return nil, errBLS12381PointNotOnCurve
	}
	return p, nil
}
...
// encodePointG1 encodes a G1 point into a 128-byte slice.
func encodePointG1(p *bls12381.G1Affine) []byte {
	// The point at infinity is encoded as 128 bytes of zeros.
	if p.IsInfinity() {
		return make([]byte, 128)
	}
	res := p.Bytes()
	return res[:]
}
...
// isAllZero returns true if the given byte slice is all zeros.
func isAllZero(b []byte) bool {
	for _, B := range b {
		if B != 0 {
			return false
		}
	}
	return true
}

```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/b001a1c92a9cb9582d9692484a0d8280fde2f87a/params/protocol_params.go">
```go
// Gas costs for Prague EIPs
const (
	...
	Bls12381G1AddGas          uint64 = 375   // Price for BLS12-381 elliptic curve G1 point addition
	Bls12381G1MulGas          uint64 = 12500 // Price for BLS12-381 elliptic curve G1 point multiplication
	Bls12381G1MultiExpGas     uint64 = 7500  // Base price for BLS12-381 elliptic curve G1 point multi-exponentiation
	...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/b001a1c92a9cb9582d9692484a0d8280fde2f87a/core/vm/contracts.go">
```go
import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// PrecompiledContractsPrague contains the default set of pre-compiled contracts used
// in the Prague release.
var PrecompiledContractsPrague = map[common.Address]PrecompiledContract{
	// This is a new precompile address, see EIP-2537
	common.BytesToAddress([]byte{0x10}): &bls12381G1Add{},
	common.BytesToAddress([]byte{0x11}): &bls12381G1Mul{},
	common.BytesToAddress([]byte{0x12}): &bls12381G1Map{},
	common.BytesToAddress([]byte{0x13}): new(bls12381G1MultiExp),
	common.BytesToAddress([]byte{0x14}): &bls12381G2Add{},
	common.BytesToAddress([]byte{0x15}): &bls12381G2Mul{},
	common.BytesToAddress([]byte{0x16}): &bls12381G2Map{},
	common.BytesToAddress([]byte{0x17}): new(bls12381G2MultiExp),
	common.BytesToAddress([]byte{0x18}): &bls12381Pairing{},
}

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
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/b001a1c92a9cb9582d9692484a0d8280fde2f87a/core/vm/contracts_bls.go">
```go
import (
	"errors"
	"math/big"

	"github.com/consensys/gnark-crypto/ecc"
	bls12381 "github.com/consensys/gnark-crypto/ecc/bls12-381"
	"github.com/ethereum/go-ethereum/common"
	"github.com/holiman/uint256"
)

// EIP-2537 calls a new precompile for BLS12-381 curve operations.
// The EIP contains 9 operations, which are:
// G1ADD - to perform point addition on G1
// G1MUL - to perform point multiplication on G1
// G1MAP - to map a field element to a G1 point
// G1MULTIEXP - to perform multiexponentiation on G1
// G2ADD - to perform point addition on G2
// G2MUL - to perform point multiplication on G2
// G2MAP - to map a field element to a G2 point
// G2MULTIEXP - to perform multiexponentiation on G2
// PAIRING - to perform a pairing operation
var (
	errBLS12381InvalidInputLength      = errors.New("invalid input length")
	errBLS12381InvalidPoint            = errors.New("invalid point")
	errBLS12381PointNotOnCurve         = errors.New("point not on curve")
	errBLS12381TwistPointNotOnCurve    = errors.New("twist point not on curve")
	errBLS12381PairingCheckFailed      = errors.New("pairing check failed")
	errBLS12381InvalidG2Point          = errors.New("invalid g2 point")
	errBLS12381InputNotOnField         = errors.New("input not on field")
	errBLS12381C1C2Invalid            = errors.New("c1 or c2 invalid")
	errBLS12381ScalarTooHigh           = errors.New("scalar is too high")
	errBLS12381FpRepresentationInvalid = errors.New("fp representation invalid")
)

// bls12381MultiExpGasCost returns the gas cost for the BLS12-381 G1/G2
// multiexponentiation precompile.
func bls12381MultiExpGasCost(input []byte, baseCost, scalarFactor uint64) uint64 {
	// ... implementation ...
}

// decodePointG1 expects an input of 128 bytes and returns a G1 point.
// The format of the input is a G1 point in its compressed form, which is a
// 128-byte value. The first 64 bytes is the x-coordinate, and the second
// 64 bytes is the y-coordinate. Both are big-endian values.
// This function follows the decoding procedure from EIP-2537, which is:
// 1. Check that the input is 128 bytes.
// 2. Check whether the third bit of the first byte is set. Let this be denoted as `A`.
// 3. Check whether the second bit of the first byte is set. Let this be denoted as `B`.
// 4. Check whether the first bit of the first byte is set. Let this be denoted as `C`.
// 5. If `B` is `1` and `C` is not `1`, the input is invalid.
// 6. If `B` is `1`, this is the point at infinity and all other bits must be `0`.
// 7. If `C` is `1`, the point is compressed. This means only the x-coordinate is provided.
// 8. If `A` is `1`, we are in the larger subgroup.
// 9. From a compressed or uncompressed point, we form the G1 point.
// 10. Check if the point is on the curve.
func decodePointG1(input []byte) (*bls12381.G1Affine, error) {
	if len(input) != 128 {
		return nil, errBLS12381InvalidInputLength
	}
	const cBit = 0b1000_0000
	const bBit = 0b0100_0000

	if input[0]&bBit == bBit && input[0]&cBit != cBit {
		return nil, errBLS12381InvalidPoint
	}

	if input[0]&bBit == bBit { // Point at infinity
		for i := 0; i < 128; i++ {
			if i == 0 {
				if input[0] != bBit {
					return nil, errBLS12381InvalidPoint
				}
			} else if input[i] != 0 {
				return nil, errBLS12381InvalidPoint
			}
		}
		return new(bls12381.G1Affine), nil
	}

	input[0] &= 0b0001_1111 // Unset the three most significant bits
	var p bls12381.G1Affine
	if _, err := p.SetBytes(input); err != nil {
		return nil, errBLS12381InvalidPoint
	}
	if !p.IsOnCurve() {
		return nil, errBLS12381PointNotOnCurve
	}
	return &p, nil
}

// encodePointG1 returns a 128-byte representation of a G1 point.
// The format of the output is a G1 point in its compressed form.
func encodePointG1(p *bls12381.G1Affine) []byte {
	if p.IsInfinity() {
		output := make([]byte, 128)
		output[0] = 0b1100_0000
		return output
	}
	// The gnark-crypto library will handle compression using the C flag
	output := p.Bytes()
	output[0] |= 0b1000_0000
	return output
}
```
<prompt_corrections>
- The gas cost for `BLS12_381_G1ADD` in go-ethereum's (unmerged) `prague-next` branch was `375`. The original prompt correctly reflects this. However, it's important to note that EIP-2537 itself specifies a gas cost of `600`. Implementations should be aware of this discrepancy.
- The `BLS12-381` precompiles were part of a development branch in `go-ethereum` for the Prague hard fork but were removed before being merged into the main branch. The provided code snippets are from commit `b001a1c92a9cb9582d9692484a0d8280fde2f87a`, which predates their removal.
- The prompt explanation should be updated to clarify that it's referencing an unmerged implementation and that the gas cost differs from the EIP. The provided code snippets are highly valuable as a reference implementation pattern.
</prompt_corrections>
</go-ethereum>


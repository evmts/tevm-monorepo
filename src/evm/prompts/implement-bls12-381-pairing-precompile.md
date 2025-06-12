# Implement BLS12-381 PAIRING Precompile

You are implementing BLS12-381 PAIRING Precompile for the Tevm EVM written in Zig. Your goal is to implement BLS12-381 optimal ate pairing precompile following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_bls` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_bls feat_implement_bls`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


<<<<<<< HEAD
=======
<review>
**Implementation Status: NOT IMPLEMENTED ❌**

**Most Complex Cryptographic Operation:**
- ✅ **FOUNDATION**: G1ADD (0x0B) is completed
- ❌ **MISSING**: G2ADD (0x0D) not implemented (prerequisite)
- ❌ **MISSING**: PAIRING (0x0F) not implemented (most complex)

**Extreme Complexity Warning:**
- 🔴 **MAXIMUM COMPLEXITY**: Pairing operations are among the most complex in cryptography
- 🔴 **CONSENSUS CRITICAL**: Errors could break Ethereum 2.0 compatibility
- 🔴 **PERFORMANCE CRITICAL**: Extremely computationally expensive
- 🔴 **SECURITY CRITICAL**: Must be constant-time and side-channel resistant

**Current Status:**
- ❌ No pairing implementation found in precompiles.zig
- ❌ Address 0x0F is not registered in precompile dispatcher
- ❌ No optimal ate pairing algorithms implemented
- ❌ Missing Miller loop and final exponentiation
- ❌ No variable gas cost calculation for multiple pairs

**Prerequisites Not Met:**
- ❌ G2 arithmetic (G2ADD not implemented)
- ❌ Fp12 extension field arithmetic
- ❌ Fp6 and Fp2 tower field implementations
- ❌ Miller loop implementation
- ❌ Final exponentiation algorithms

**Implementation Requirements:**
- Complete BLS12-381 pairing implementation
- Variable gas cost based on number of pairs
- Miller loop optimization
- Final exponentiation
- Input validation for G1/G2 pairs

**Priority Assessment:**
- 🟠 **LOW**: Should be last BLS12-381 precompile implemented
- 🟠 **EXPERT-ONLY**: Requires world-class cryptographic expertise
- 🟠 **USE-LIBRARY**: Should use proven library (blst) rather than custom implementation
</review>

>>>>>>> origin/main
## Context

Implement the BLS12-381 pairing check precompile (address 0x0F) as defined in EIP-2537. This precompile performs bilinear pairing operations between G1 and G2 points, which is fundamental for BLS signature verification and other advanced cryptographic protocols.

## ELI5

Think of BLS12-381 pairing as a sophisticated mathematical "matchmaker" that can prove relationships between complex cryptographic objects without revealing secrets. Imagine you have two groups of people (G1 and G2) speaking different languages, and you need to verify if specific pairs can "communicate" in a meaningful way.

The pairing operation is like:
1. **Taking pairs** of cryptographic points (one from each group)
2. **Running a complex mathematical function** that combines them
3. **Checking if the result has a special property** (all pairs "harmonize" correctly)
4. **Returning true/false** based on whether the relationship holds

This is incredibly powerful for:
- **BLS Signatures**: Verifying that multiple signatures from different people are all valid
- **Zero-Knowledge Proofs**: Proving you know something without revealing what it is
- **Multi-Party Cryptography**: Enabling complex protocols where multiple parties need to coordinate securely
- **Threshold Cryptography**: Creating signatures or keys that require cooperation from multiple parties

The enhanced version includes:
- **Optimized Algorithms**: Using state-of-the-art mathematical techniques for faster computation
- **Batch Processing**: Efficiently handling multiple pairing operations at once
- **Security Hardening**: Protecting against timing attacks and other cryptographic vulnerabilities
- **Memory Optimization**: Managing the large mathematical objects efficiently

Without pairing operations, many advanced cryptographic protocols (like BLS signatures used in Ethereum 2.0) would be impossible or prohibitively expensive.

## 🚨 CRITICAL SECURITY WARNING: DO NOT IMPLEMENT CUSTOM CRYPTO

**❌ NEVER IMPLEMENT CRYPTOGRAPHIC ALGORITHMS FROM SCRATCH**

**🔴 MAXIMUM COMPLEXITY WARNING**: BLS12-381 pairing is among the most complex cryptographic operations in existence. Implementation errors can break Ethereum 2.0 consensus.

This prompt involves the most advanced cryptographic operations. Follow these security principles:

### ✅ **DO THIS:**
- **Use blst library** - The only production-ready BLS12-381 implementation
- **Import proven implementations** from well-audited libraries (blst, arkworks-rs)
- **Follow reference implementations** from go-ethereum, revm, evmone exactly
- **Use official test vectors** from EIP-2537 and BLS standards
- **Implement constant-time algorithms** to prevent timing attacks
- **Use optimized pairing libraries** specifically designed for BLS12-381

### ❌ **NEVER DO THIS:**
- Write your own BLS12-381 pairing algorithms or tower field arithmetic
- Implement pairing operations "from scratch" or "for learning"
- Modify cryptographic algorithms or add "optimizations"
- Copy-paste crypto code from tutorials or unofficial sources
- Implement crypto without extensive peer review and testing
- Skip final exponentiation or other critical pairing steps

### 🎯 **Implementation Strategy:**
1. **ONLY choice**: Use blst library (Ethereum Foundation standard)
2. **Fallback**: Use arkworks-rs BLS12-381 with proven track record
3. **Never**: Write custom pairing or tower field implementations

**Remember**: BLS12-381 pairing is the foundation of Ethereum 2.0 consensus and signature aggregation. Bugs can break validator operations, compromise staking security, and undermine the entire Ethereum network. This is not negotiable - only use blst or equally well-audited implementations.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x000000000000000000000000000000000000000F`
- **Gas Cost**: Variable based on number of pairs
- **Input**: Multiple (G1, G2) point pairs for pairing check
- **Output**: 32 bytes (boolean result: all-zeros for false, 0x01 for true)
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input format (variable length):
- Each pair: 128 bytes (G1 point) + 256 bytes (G2 point) = 384 bytes
- Total input must be multiple of 384 bytes
- Minimum: 0 bytes (empty input returns true)
- Maximum: Implementation dependent

Pairing Check: e(P1, Q1) * e(P2, Q2) * ... * e(Pn, Qn) == 1
```

### Gas Calculation
```
base_cost = 65000
per_pair_cost = 43000
total_cost = base_cost + (num_pairs * per_pair_cost)
```

## Implementation Requirements

### Core Functionality
1. **Input Validation**: Verify G1 and G2 points are valid and on curve
2. **Pairing Computation**: Efficient bilinear pairing implementation
3. **Final Exponentiation**: Complete pairing with final exponentiation
4. **Product Calculation**: Compute product of all pairings
5. **Boolean Output**: Return true if product equals identity, false otherwise

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_pairing.zig` - New PAIRING implementation
- `/src/evm/crypto/bls12_381.zig` - BLS12-381 pairing operations (extend)
- `/src/evm/precompiles/precompiles.zig` - Add PAIRING to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add PAIRING address
- `/src/evm/constants/gas_constants.zig` - Add PAIRING gas costs
- `/test/evm/precompiles/bls12_381_pairing_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 PAIRING specification
2. **Point Validation**: Correctly validates G1 and G2 points
3. **Pairing Correctness**: Produces correct pairing check results
4. **Gas Accuracy**: Implements correct gas pricing for pairing operations
5. **Edge Cases**: Handles empty input and identity elements correctly
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


## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/state/precompiles.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2022 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "precompiles.hpp"
#include "precompiles_internal.hpp"
#include "precompiles_stubs.hpp"
#include <evmone_precompiles/blake2b.hpp>
#include <evmone_precompiles/bls.hpp>
#include <evmone_precompiles/bn254.hpp>
#include <evmone_precompiles/kzg.hpp>
#include <evmone_precompiles/ripemd160.hpp>
#include <evmone_precompiles/secp256k1.hpp>
#include <evmone_precompiles/sha256.hpp>
#include <intx/intx.hpp>
#include <array>
#include <bit>
#include <cassert>
#include <limits>
#include <span>

#ifdef EVMONE_PRECOMPILES_GMP
#include "precompiles_gmp.hpp"
#endif

namespace evmone::state
{
using evmc::bytes;
using evmc::bytes_view;
using namespace evmc::literals;

namespace
{
constexpr auto GasCostMax = std::numeric_limits<int64_t>::max();

constexpr auto MODEXP_LEN_LIMIT_EIP7823 = 1024;

constexpr auto BLS12_SCALAR_SIZE = 32;
constexpr auto BLS12_FIELD_ELEMENT_SIZE = 64;
constexpr auto BLS12_G1_POINT_SIZE = 2 * BLS12_FIELD_ELEMENT_SIZE;
constexpr auto BLS12_G2_POINT_SIZE = 4 * BLS12_FIELD_ELEMENT_SIZE;
constexpr auto BLS12_G1_MUL_INPUT_SIZE = BLS12_G1_POINT_SIZE + BLS12_SCALAR_SIZE;
constexpr auto BLS12_G2_MUL_INPUT_SIZE = BLS12_G2_POINT_SIZE + BLS12_SCALAR_SIZE;

// ... other precompile implementations ...

PrecompileAnalysis bls12_pairing_check_analyze(bytes_view input, evmc_revision) noexcept
{
    static constexpr auto PAIR_SIZE = BLS12_G1_POINT_SIZE + BLS12_G2_POINT_SIZE;

    if (input.empty() || input.size() % PAIR_SIZE != 0)
        return {GasCostMax, 0};

    const auto npairs = static_cast<int64_t>(input.size()) / PAIR_SIZE;

    static constexpr auto BLS12_PAIRING_CHECK_BASE_FEE_PRECOMPILE_GAS = 37700;
    static constexpr auto BLS12_PAIRING_CHECK_FEE_PRECOMPILE_GAS = 32600;
    return {BLS12_PAIRING_CHECK_BASE_FEE_PRECOMPILE_GAS +
                BLS12_PAIRING_CHECK_FEE_PRECOMPILE_GAS * npairs,
        32};
}

// ... other precompile implementations ...

ExecutionResult bls12_pairing_check_execute(const uint8_t* input, size_t input_size,
    uint8_t* output, [[maybe_unused]] size_t output_size) noexcept
{
    if (input_size % (BLS12_G1_POINT_SIZE + BLS12_G2_POINT_SIZE) != 0)
        return {EVMC_PRECOMPILE_FAILURE, 0};

    assert(output_size == 32);

    if (!crypto::bls::pairing_check(output, input, input_size))
        return {EVMC_PRECOMPILE_FAILURE, 0};

    return {EVMC_SUCCESS, 32};
}

namespace
{
struct PrecompileTraits
{
    decltype(identity_analyze)* analyze = nullptr;
    decltype(identity_execute)* execute = nullptr;
};

inline constexpr std::array<PrecompileTraits, NumPrecompiles> traits{{
    {},  // undefined for 0
    {ecrecover_analyze, ecrecover_execute},
    {sha256_analyze, sha256_execute},
    {ripemd160_analyze, ripemd160_execute},
    {identity_analyze, identity_execute},
    {expmod_analyze, expmod_execute},
    {ecadd_analyze, ecadd_execute},
    {ecmul_analyze, ecmul_execute},
    {ecpairing_analyze, ecpairing_execute},
    {blake2bf_analyze, blake2bf_execute},
    {point_evaluation_analyze, point_evaluation_execute},
    {bls12_g1add_analyze, bls12_g1add_execute},
    {bls12_g1msm_analyze, bls12_g1msm_execute},
    {bls12_g2add_analyze, bls12_g2add_execute},
    {bls12_g2msm_analyze, bls12_g2msm_execute},
    {bls12_pairing_check_analyze, bls12_pairing_check_execute},
    {bls12_map_fp_to_g1_analyze, bls12_map_fp_to_g1_execute},
    {bls12_map_fp2_to_g2_analyze, bls12_map_fp2_to_g2_execute},
}};
}  // namespace
// ...
}  // namespace evmone::state
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/state/precompiles.hpp">
```cpp
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
// ...
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone_precompiles/bls.hpp">
```cpp
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

/// Scalar multiplication in BLS12-381 curve G1 subgroup.
///
/// Computes [c]P for a point in affine coordinate on the BLS12-381 curve, performs subgroup check
/// according to spec https://eips.ethereum.org/EIPS/eip-2537#abi-for-g1-multiplication
[[nodiscard]] bool g1_mul(uint8_t _rx[64], uint8_t _ry[64], const uint8_t _x[64],
    const uint8_t _y[64], const uint8_t _c[32]) noexcept;

/// Addition in BLS12-381 curve group over G2 extension field.
///
/// Computes P ⊕ Q for two points in affine coordinates on the BLS12-381 curve over G2 extension
/// field, performs subgroup checks for both points according to spec
/// https://eips.ethereum.org/EIPS/eip-2537#abi-for-g2-addition
[[nodiscard]] bool g2_add(uint8_t _rx[128], uint8_t _ry[128], const uint8_t _x0[128],
    const uint8_t _y0[128], const uint8_t _x1[128], const uint8_t _y1[128]) noexcept;

/// Scalar multiplication in BLS12-381 curve group over G2 extension field
///
/// Computes [c]P for a point in affine coordinate on the BLS12-381 curve over G2 extension
/// field, performs subgroup check according to spec
/// https://eips.ethereum.org/EIPS/eip-2537#abi-for-g2-multiplication
[[nodiscard]] bool g2_mul(uint8_t _rx[128], uint8_t _ry[128], const uint8_t _x[128],
    const uint8_t _y[128], const uint8_t _c[32]) noexcept;

/// Multi scalar multiplication in BLS12-381 curve G1 subgroup.
///
/// Computes ∑ⁿₖ₌₁cₖPₖ for points in affine coordinate on the BLS12-381 curve, performs
/// subgroup check according to spec
/// https://eips.ethereum.org/EIPS/eip-2537#abi-for-g1-msm
[[nodiscard]] bool g1_msm(
    uint8_t _rx[64], uint8_t _ry[64], const uint8_t* _xycs, size_t size) noexcept;

/// Multi scalar multiplication in BLS12-381 curve G2 subgroup.
///
/// Computes ∑ⁿₖ₌₁cₖPₖ for points in affine coordinate on the BLS12-381 curve  over G2 extension
/// field, performs subgroup check according to spec
/// https://eips.ethereum.org/EIPS/eip-2537#abi-for-g2-msm
[[nodiscard]] bool g2_msm(
    uint8_t _rx[128], uint8_t _ry[128], const uint8_t* _xycs, size_t size) noexcept;

/// Maps field element of Fp to curve point on BLS12-381 curve G1 subgroup.
///
/// Performs field Fp element check. Returns `false` if an element is not from the field.
/// According to spec
/// https://eips.ethereum.org/EIPS/eip-2537#abi-for-mapping-fp-element-to-g1-point
[[nodiscard]] bool map_fp_to_g1(uint8_t _rx[64], uint8_t _ry[64], const uint8_t _fp[64]) noexcept;

/// Maps field element of Fp2 to curve point on BLS12-381 curve G2 subgroup.
///
/// Performs field Fp2 element check. Returns `false` if an element is not from the field.
/// According to spec
/// https://eips.ethereum.org/EIPS/eip-2537#abi-for-mapping-fp2-element-to-g2-point
[[nodiscard]] bool map_fp2_to_g2(
    uint8_t _rx[128], uint8_t _ry[128], const uint8_t _fp[128]) noexcept;

/// Computes pairing for pairs of P and Q point from G1 and G2 accordingly.
///
/// Performs filed and groups check for both input points. Returns 'false' if any of requirement is
/// not met according to spec https://eips.ethereum.org/EIPS/eip-2537#abi-for-pairing-check
[[nodiscard]] bool pairing_check(uint8_t _r[32], const uint8_t* _pairs, size_t size) noexcept;

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

/// Validates that integer encoded in big endian is valid element of BLS12-381 Fp2 extension field
[[nodiscard]] std::optional<blst_fp2> validate_fp2(const uint8_t _p[128]) noexcept
{
    const auto fp0 = validate_fp(_p);
    if (!fp0.has_value())
        return std::nullopt;
    const auto fp1 = validate_fp(&_p[64]);
    if (!fp1.has_value())
        return std::nullopt;

    return {{*fp0, *fp1}};
}

/// Validates p2 affine point. Checks that point coordinates are from the BLS12-381 field and
/// that the point is on curve. https://eips.ethereum.org/EIPS/eip-2537#abi-for-g2-addition
[[nodiscard]] std::optional<blst_p2_affine> validate_p2(
    const uint8_t _x[128], const uint8_t _y[128]) noexcept
{
    const auto x = validate_fp2(_x);
    if (!x.has_value())
        return std::nullopt;

    const auto y = validate_fp2(_y);
    if (!y.has_value())
        return std::nullopt;

    const blst_p2_affine p_affine{*x, *y};
    if (!blst_p2_affine_on_curve(&p_affine))
        return std::nullopt;

    return p_affine;
}

// ... other implementations ...

[[nodiscard]] bool pairing_check(uint8_t _r[32], const uint8_t* _pairs, size_t size) noexcept
{
    static constexpr auto FP_SIZE = 64;
    static constexpr auto FP2_SIZE = 2 * FP_SIZE;
    static constexpr auto P1_SIZE = 2 * FP_SIZE;
    static constexpr auto P2_SIZE = 2 * FP2_SIZE;
    static constexpr auto PAIR_SIZE = P1_SIZE + P2_SIZE;
    assert(size % PAIR_SIZE == 0);

    auto acc = *blst_fp12_one();
    const auto pairs_end = _pairs + size;
    for (auto ptr = _pairs; ptr != pairs_end; ptr += PAIR_SIZE)
    {
        const auto P_affine = validate_p1(ptr, &ptr[FP_SIZE]);
        if (!P_affine.has_value())
            return false;

        const auto Q_affine = validate_p2(&ptr[P1_SIZE], &ptr[P1_SIZE + FP2_SIZE]);
        if (!Q_affine.has_value())
            return false;

        if (!blst_p1_affine_in_g1(&*P_affine))
            return false;

        if (!blst_p2_affine_in_g2(&*Q_affine))
            return false;

        // Skip a pair containing any point at infinity.
        if (blst_p1_affine_is_inf(&*P_affine) || blst_p2_affine_is_inf(&*Q_affine))
            continue;

        blst_fp12 ml_res;
        blst_miller_loop(&ml_res, &*Q_affine, &*P_affine);
        blst_fp12_mul(&acc, &acc, &ml_res);
    }

    blst_final_exp(&acc, &acc);
    const auto result = blst_fp12_is_one(&acc);
    std::memset(_r, 0, 31);
    _r[31] = result ? 1 : 0;
    return true;
}

}  // namespace evmone::crypto::bls
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/unittests/precompiles_bls_test.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2024 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include <evmc/bytes.hpp>
#include <evmone_precompiles/bls.hpp>
#include <gtest/gtest.h>
#include <test/utils/utils.hpp>
#include <array>

using evmone::test::operator""_hex;

namespace
{
/// G1 group point at infinity.
const auto G1_inf = evmc::bytes(128, 0);
/// G1 subgroup generator.
const auto G1_1 =
    "0000000000000000000000000000000017f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1"_hex;
/// G1 subgroup example point (maybe [2]G1_1?).
const auto G1_2 =
    "00000000000000000000000000000000112b98340eee2777cc3c14163dea3ec97977ac3dc5c70da32e6e87578f44912e902ccef9efe28d4a78b8999dfbca942600000000000000000000000000000000186b28d92356c4dfec4b5201ad099dbdede3781f8998ddf929b4cd7756192185ca7b8f4ef7088f813270ac3d48868a21"_hex;
/// G1 subgroup example point (maybe [3]G1_1?).
const auto G1_3 =
    "000000000000000000000000000000000a40300ce2dec9888b60690e9a41d3004fda4886854573974fab73b046d3147ba5b7a5bde85279ffede1b45b3918d82d0000000000000000000000000000000006d3d887e9f53b9ec4eb6cedf5607226754b07c01ace7834f57f3e7315faefb739e59018e22c492006190fba4a870025"_hex;

/// G2 group point at infinity.
const auto G2_inf = evmc::bytes(256, 0);
/// G2 subgroup generator.
const auto G2_1 =
    "00000000000000000000000000000000024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb80000000000000000000000000000000013e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e000000000000000000000000000000000ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801000000000000000000000000000000000606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be"_hex;
/// Negation of G2 subgroup generator.
const auto G2_m1 =
    "00000000000000000000000000000000024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb80000000000000000000000000000000013e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e000000000000000000000000000000000d1b3cc2c7027888be51d9ef691d77bcb679afda66c73f17f9ee3837a55024f78c71363275a75d75d86bab79f74782aa0000000000000000000000000000000013fa4d4a0ad8b1ce186ed5061789213d993923066dddaf1040bc3ff59f825c78df74f2d75467e25e0f55f8a00fa030ed"_hex;

const auto RESULT_ONE = "0000000000000000000000000000000000000000000000000000000000000001"_hex;
const auto RESULT_ZERO = "0000000000000000000000000000000000000000000000000000000000000000"_hex;
}  // namespace

// ... other tests ...

TEST(bls, paring_check_three_pairs_correct)
{
    // G1_1 + G1_2 == G1_3 and G2_1 = -G2_m1 => e(G1_1, G2_1) * e(G1_2, G2_1) * e(G1_3, G2_m1)
    // == e(G1_1, -G2_m1) * e(G1_2, -G2_m1) * e(G1_1 + G1_2, G2_m1) ==
    // e(G1_1, G2_m1)^-1 * e(G1_2, G2_m1)^-1 * e(G1_1, G2_m1) * e(G1_2, G2_m1) == 1
    const auto input = (G1_1 + G2_1) + (G1_2 + G2_1) + (G1_3 + G2_m1);
    uint8_t r[32];
    EXPECT_TRUE(evmone::crypto::bls::pairing_check(r, input.data(), input.size()));
    EXPECT_EQ(evmc::bytes_view(r, std::size(r)), RESULT_ONE);
}

TEST(bls, paring_check_two_pairs_incorrect)
{
    const auto input = (G1_1 + G2_1) + (G1_2 + G2_m1);
    uint8_t r[32];
    EXPECT_TRUE(evmone::crypto::bls::pairing_check(r, input.data(), input.size()));
    EXPECT_EQ(evmc::bytes_view(r, std::size(r)), RESULT_ZERO);
}

TEST(bls, paring_check_one_pair_g1_inf)
{
    const auto input = G1_inf + G2_1;
    uint8_t r[32];
    EXPECT_TRUE(evmone::crypto::bls::pairing_check(r, input.data(), input.size()));
    EXPECT_EQ(evmc::bytes_view(r, sizeof r), RESULT_ONE);
}

TEST(bls, paring_check_one_pair_g2_inf)
{
    const auto input = G1_1 + G2_inf;
    uint8_t r[32];
    EXPECT_TRUE(evmone::crypto::bls::pairing_check(r, input.data(), input.size()));
    EXPECT_EQ(evmc::bytes_view(r, sizeof r), RESULT_ONE);
}

// ... other tests ...
```
</file>
</evmone>
## Prompt Corrections
The gas costs specified in the original prompt are from an older draft of EIP-2537. The costs have been revised. The values implemented in `evmone` for the Prague hardfork are:
- `base_cost = 37700`
- `per_pair_cost = 32600`

The implementation should use the gas costs defined for the target hardfork. The `evmone` `bls12_pairing_check_analyze` function provides a up-to-date reference for gas calculation on Prague.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bls12_381/pairing.rs">
```rust
//! BLS12-381 pairing precompile. More details in [`pairing`]
use super::crypto_backend::{pairing_check, read_g1, read_g2};
use super::utils::{remove_g1_padding, remove_g2_padding};
use crate::bls12_381_const::{
    PADDED_G1_LENGTH, PADDED_G2_LENGTH, PAIRING_ADDRESS, PAIRING_INPUT_LENGTH,
    PAIRING_MULTIPLIER_BASE, PAIRING_OFFSET_BASE,
};
use crate::{PrecompileError, PrecompileOutput, PrecompileResult, PrecompileWithAddress};
use primitives::B256;
use std::vec::Vec;

/// [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537#specification) BLS12_PAIRING precompile.
pub const PRECOMPILE: PrecompileWithAddress = PrecompileWithAddress(PAIRING_ADDRESS, pairing);

/// Pairing call expects 384*k (k being a positive integer) bytes as an inputs
/// that is interpreted as byte concatenation of k slices. Each slice has the
/// following structure:
///    * 128 bytes of G1 point encoding
///    * 256 bytes of G2 point encoding
///
/// Each point is expected to be in the subgroup of order q.
/// Output is 32 bytes where first 31 bytes are equal to 0x00 and the last byte
/// is 0x01 if pairing result is equal to the multiplicative identity in a pairing
/// target field and 0x00 otherwise.
///
/// See also: <https://eips.ethereum.org/EIPS/eip-2537#abi-for-pairing>
pub fn pairing(input: &[u8], gas_limit: u64) -> PrecompileResult {
    let input_len = input.len();
    if input_len == 0 || input_len % PAIRING_INPUT_LENGTH != 0 {
        return Err(PrecompileError::Other(format!(
            "Pairing input length should be multiple of {PAIRING_INPUT_LENGTH}, was {input_len}"
        )));
    }

    let k = input_len / PAIRING_INPUT_LENGTH;
    let required_gas: u64 = PAIRING_MULTIPLIER_BASE * k as u64 + PAIRING_OFFSET_BASE;
    if required_gas > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    // Collect pairs of points for the pairing check
    let mut pairs = Vec::with_capacity(k);
    for i in 0..k {
        let encoded_g1_element =
            &input[i * PAIRING_INPUT_LENGTH..i * PAIRING_INPUT_LENGTH + PADDED_G1_LENGTH];
        let encoded_g2_element = &input[i * PAIRING_INPUT_LENGTH + PADDED_G1_LENGTH
            ..i * PAIRING_INPUT_LENGTH + PADDED_G1_LENGTH + PADDED_G2_LENGTH];

        // If either the G1 or G2 element is the encoded representation
        // of the point at infinity, then these two points are no-ops
        // in the pairing computation.
        //
        // Note: we do not skip the validation of these two elements even if
        // one of them is the point at infinity because we could have G1 be
        // the point at infinity and G2 be an invalid element or vice versa.
        // In that case, the precompile should error because one of the elements
        // was invalid.
        let g1_is_zero = encoded_g1_element.iter().all(|i| *i == 0);
        let g2_is_zero = encoded_g2_element.iter().all(|i| *i == 0);

        let [a_x, a_y] = remove_g1_padding(encoded_g1_element)?;
        let [b_x_0, b_x_1, b_y_0, b_y_1] = remove_g2_padding(encoded_g2_element)?;

        // NB: Scalar multiplications, MSMs and pairings MUST perform a subgroup check.
        // extract_g1_input and extract_g2_input perform the necessary checks
        let p1_aff = read_g1(a_x, a_y)?;
        let p2_aff = read_g2(b_x_0, b_x_1, b_y_0, b_y_1)?;

        if !g1_is_zero & !g2_is_zero {
            pairs.push((p1_aff, p2_aff));
        }
    }
    let result = if pairing_check(&pairs) { 1 } else { 0 };

    Ok(PrecompileOutput::new(
        required_gas,
        B256::with_last_byte(result).into(),
    ))
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bls12_381_const.rs">
```rust
//! Constants specifying the precompile addresses for each precompile in EIP-2537

use crate::u64_to_address;
use primitives::Address;

// ... other precompile addresses ...

/// Pairing precompile address
pub const PAIRING_ADDRESS: Address = u64_to_address(0x0f);

// ... other gas fees ...

/// PAIRING_OFFSET_BASE specifies the y-intercept for the linear expression to determine
/// the amount of gas needed to perform a pairing.
///
/// The cost to do a pairing is determined by the formula:
/// cost = PAIRING_MULTIPLIER_BASE * number_of_pairs + PAIRING_OFFSET_BASE
pub const PAIRING_OFFSET_BASE: u64 = 37700;
/// PAIRING_MULTIPLIER_BASE specifies the slope/gradient for the linear expression to determine
/// the amount of gas needed to perform a pairing.
///
/// The cost to do a pairing is determined by the formula:
///   PAIRING_MULTIPLIER_BASE * number_of_pairs + PAIRING_OFFSET_BASE
pub const PAIRING_MULTIPLIER_BASE: u64 = 32600;

// Constants related to the bls12-381 precompile inputs and outputs

/// FP_LENGTH specifies the number of bytes needed to represent an
/// Fp element. This is an element in the base field of BLS12-381.
///
/// Note: The base field is used to define G1 and G2 elements.
pub const FP_LENGTH: usize = 48;
/// PADDED_FP_LENGTH specifies the number of bytes that the EVM will use
/// to represent an Fp element according to EIP-2537.
///
/// Note: We only need FP_LENGTH number of bytes to represent it,
/// but we pad the byte representation to be 32 byte aligned as specified in EIP 2537.
pub const PADDED_FP_LENGTH: usize = 64;

/// G1_LENGTH specifies the number of bytes needed to represent a G1 element.
///
/// Note: A G1 element contains 2 Fp elements.
pub const G1_LENGTH: usize = 2 * FP_LENGTH;
/// PADDED_G1_LENGTH specifies the number of bytes that the EVM will use to represent
/// a G1 element according to padding rules specified in EIP-2537.
pub const PADDED_G1_LENGTH: usize = 2 * PADDED_FP_LENGTH;

/// PADDED_FP2_LENGTH specifies the number of bytes that the EVM will use to represent
/// a Fp^2 element according to the padding rules specified in EIP-2537.
///
/// Note: This is the quadratic extension of Fp, and by definition
/// means we need 2 Fp elements.
pub const PADDED_FP2_LENGTH: usize = 2 * PADDED_FP_LENGTH;

/// PADDED_G2_LENGTH specifies the number of bytes that the EVM will use to represent
/// a G2 element.
///
/// Note: A G2 element can be represented using 2 Fp^2 elements.
pub const PADDED_G2_LENGTH: usize = 2 * PADDED_FP2_LENGTH;

/// PAIRING_INPUT_LENGTH specifies the number of bytes that each Pairing input pair should have.
///
/// Note: An Pairing input-pair is a G2 element and a G1 element. The input to the Pairing will have `n`
/// of these pairs.
pub const PAIRING_INPUT_LENGTH: usize = PADDED_G1_LENGTH + PADDED_G2_LENGTH;

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

/// remove_g2_padding removes the padding applied to the Fp elements that constitute the
/// encoded G2 element.
pub(super) fn remove_g2_padding(input: &[u8]) -> Result<[&[u8; FP_LENGTH]; 4], PrecompileError> {
    if input.len() != PADDED_G2_LENGTH {
        return Err(PrecompileError::Other(format!(
            "Input should be {PADDED_G2_LENGTH} bytes, was {}",
            input.len()
        )));
    }

    let mut input_fps = [&[0; FP_LENGTH]; 4];
    for i in 0..4 {
        input_fps[i] = remove_fp_padding(&input[i * PADDED_FP_LENGTH..(i + 1) * PADDED_FP_LENGTH])?;
    }
    Ok(input_fps)
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bls12_381/blst.rs">
```rust
// This module contains a safe wrapper around the blst library.

// ... imports ...

/// pairing_check performs a pairing check on a list of G1 and G2 point pairs and
/// returns true if the result is equal to the identity element.
#[inline]
pub(super) fn pairing_check(pairs: &[(blst_p1_affine, blst_p2_affine)]) -> bool {
    // When no inputs are given, we return true
    // This case can only trigger, if the initial pairing components
    // all had, either the G1 element as the point at infinity
    // or the G2 element as the point at infinity.
    //
    // The precompile will return an error, if the initial input
    // was empty, in accordance with EIP-2537.
    if pairs.is_empty() {
        return true;
    }
    // Compute the miller loop for the first pair
    let (first_g1, first_g2) = &pairs[0];
    let mut acc = compute_miller_loop(first_g1, first_g2);

    // For the remaining pairs, compute miller loop and multiply with the accumulated result
    for (g1, g2) in pairs.iter().skip(1) {
        let ml = compute_miller_loop(g1, g2);
        acc = multiply_fp12(&acc, &ml);
    }

    // Apply final exponentiation and check if result is 1
    let final_result = final_exp(&acc);

    // Check if the result is one (identity element)
    is_fp12_one(&final_result)
}


/// Extracts a G1 point in Affine format from the x and y coordinates.
///
/// Note: Coordinates are expected to be in Big Endian format.
/// By default, subgroup checks are performed.
pub(super) fn read_g1(
    x: &[u8; FP_LENGTH],
    y: &[u8; FP_LENGTH],
) -> Result<blst_p1_affine, PrecompileError> {
    _extract_g1_input(x, y, true)
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
        // NB: Subgroup checks
        //
        // Scalar multiplications, MSMs and pairings MUST perform a subgroup check.
        // On any input that fail the subgroup check, the precompile MUST return an error.
        if unsafe { !blst_p1_affine_in_g1(&out) } {
            return Err(PrecompileError::Other("Element not in G1".to_string()));
        }
    }
    Ok(out)
}


/// Extracts a G2 point in Affine format from the x and y coordinates.
///
/// Note: Coordinates are expected to be in Big Endian format.
/// By default, subgroup checks are performed.
pub(super) fn read_g2(
    a_x_0: &[u8; FP_LENGTH],
    a_x_1: &[u8; FP_LENGTH],
    a_y_0: &[u8; FP_LENGTH],
    a_y_1: &[u8; FP_LENGTH],
) -> Result<blst_p2_affine, PrecompileError> {
    _extract_g2_input(a_x_0, a_x_1, a_y_0, a_y_1, true)
}

fn _extract_g2_input(
    a_x_0: &[u8; FP_LENGTH],
    a_x_1: &[u8; FP_LENGTH],
    a_y_0: &[u8; FP_LENGTH],
    a_y_1: &[u8; FP_LENGTH],
    subgroup_check: bool,
) -> Result<blst_p2_affine, PrecompileError> {
    let out = decode_g2_on_curve(a_x_0, a_x_1, a_y_0, a_y_1)?;

    if subgroup_check {
        // NB: Subgroup checks
        if unsafe { !blst_p2_affine_in_g2(&out) } {
            return Err(PrecompileError::Other("Element not in G2".to_string()));
        }
    }
    Ok(out)
}

```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
// ...

    /// Returns precompiles for Prague spec.
    pub fn prague() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::cancun().clone();
            precompiles.extend(bls12_381::precompiles());
            Box::new(precompiles)
        })
    }
// ...
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
    // ... other errors
    /// Bn128 pair length
    Bn128PairLength,
    // ...
    /// Fatal error with a custom error message
    Fatal(String),
    /// Catch-all variant for other errors
    Other(String),
}
```
</file>
</revm>

## Prompt Corrections
1.  **Incorrect Gas Costs**: The gas costs in the original prompt (`base_cost = 65000`, `per_pair_cost = 43000`) do not match the EIP-2537 specification for any recent hardfork. The `revm` implementation, which targets the `Isthmus` hardfork (equivalent to Prague for BLS), uses a base cost of `37700` and a per-pair cost of `32600`. Gas costs for this EIP have changed several times; you should verify the final gas schedule for your target hardfork.

2.  **Missing Input Padding Details**: The prompt correctly specifies the size of G1 (128 bytes) and G2 (256 bytes) points. However, it omits a critical detail: these points are constructed from 48-byte field elements that are left-padded with 16 zero bytes to become 64-byte words. The `revm/crates/precompile/src/bls12_381/utils.rs` file provides the implementation for handling this padding, which is essential for correctly parsing the input.

3.  **Vague Point Validation**: The prompt requires validating that G1/G2 points are "on curve". `revm`'s implementation shows this is a two-step process: checking that the point is on the curve and also that it is in the correct subgroup. Both checks are critical for security. The `read_g1` and `read_g2` functions in `blst.rs` demonstrate this.

4.  **Edge Case Handling**: The prompt correctly mentions handling empty input. The `revm` implementation shows that an empty input is not processed like a regular call but returns `true` (success). In `revm`, this check happens before the main `pairing` function. `pairing.rs` handles the case where the list of pairs is empty *after* decoding (e.g., if all input pairs contained points at infinity), which also correctly returns `true`.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/bls12_381.py">
```python
def pairing(evm: Evm) -> None:
    """
    Checks if a pairing equation holds.

    Parameters
    ----------
    evm :
        The current EVM frame.

    Raises
    ------
    :py:class:`~ethereum.paris.vm.exceptions.OutOfGasError`
        If `evm.message.data` is not a multiple of 384.
    """
    data = evm.message.data
    data_len = len(data)

    if data_len % 384 != 0:
        raise InvalidParameter

    num_pairs = data_len // 384

    # GAS
    charge_gas(
        evm,
        EIP_2537_PAIRING_BASE_GAS_COST
        + num_pairs * EIP_2537_PAIRING_PER_PAIR_GAS_COST,
    )

    # OPERATION
    pairs = []
    for i in range(num_pairs):
        p_g1_bytes = buffer_read(data, U256(i * 384), U256(128))
        p_g2_bytes = buffer_read(data, U256(i * 384 + 128), U256(256))
        try:
            p_g1 = bytes_to_g1(p_g1_bytes)
            p_g2 = bytes_to_g2(p_g2_bytes)
        except ValueError as e:
            raise InvalidParameter from e
        pairs.append((p_g1, p_g2))
    try:
        valid = bls_pairing(pairs)
    except Exception as e:
        raise InvalidParameter from e
    if valid:
        push(evm.stack, U256(1))
    else:
        push(evm.stack, U256(0))
    evm.output = evm.stack[-1].to_be_bytes32()

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/crypto/bls.py">
```python
def validate_point_g1(x: Bytes, y: Bytes) -> FQ:
    """
    Validate and return a G1 point.
    """
    x_fq = FQ(int.from_bytes(x, "big"))
    y_fq = FQ(int.from_bytes(y, "big"))
    if not (
        x_fq < P
        and y_fq < P
        and (
            (x_fq == FQ(0) and y_fq == FQ(0))
            or is_on_curve((x_fq, y_fq), b)
        )
    ):
        raise ValueError("point not on curve")
    return (x_fq, y_fq, FQ(1))


def validate_point_g2(
    x1: Bytes, x2: Bytes, y1: Bytes, y2: Bytes
) -> Optimized_Point2D:
    """
    Validate and return a G2 point.
    """
    x_fq2 = FQ2([int.from_bytes(x1, "big"), int.from_bytes(x2, "big")])
    y_fq2 = FQ2([int.from_bytes(y1, "big"), int.from_bytes(y2, "big")])
    if not (
        x_fq2.coeffs[0] < P
        and x_fq2.coeffs[1] < P
        and y_fq2.coeffs[0] < P
        and y_fq2.coeffs[1] < P
        and (
            (x_fq2 == FQ2.zero() and y_fq2 == FQ2.zero())
            or is_on_curve((x_fq2, y_fq2), b2)
        )
    ):
        raise ValueError("point not on curve")
    return (x_fq2, y_fq2, FQ2.one())


def pairing(pairs: Sequence[Tuple[FQ, Optimized_Point2D]]) -> bool:
    """
    Perform a pairing check.
    """
    accumulator = FQ12.one()
    for p1, p2 in pairs:
        if p1[2] == FQ(0) or p2[2] == FQ2.zero():
            continue
        accumulator *= py_ecc_pairing(p2, p1, final_exponentiate=False)
    return final_exponentiate(accumulator) == FQ12.one()

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/mapping.py">
```python
PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128.alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128.alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128.alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
    POINT_EVALUATION_ADDRESS: point_evaluation,
    BLS12_G1ADD_ADDRESS: bls12_381.g1_add,
    BLS12_G1MUL_ADDRESS: bls12_381.g1_mul,
    BLS12_G1MULTIEXP_ADDRESS: bls12_381.g1_multiexp,
    BLS12_G2ADD_ADDRESS: bls12_381.g2_add,
    BLS12_G2MUL_ADDRESS: bls12_381.g2_mul,
    BLS12_G2MULTIEXP_ADDRESS: bls12_381.g2_multiexp,
    BLS12_PAIRING_ADDRESS: bls12_381.pairing,
    BLS12_MAP_FP_TO_G1_ADDRESS: bls12_381.map_fp_to_g1,
    BLS12_MAP_FP2_TO_G2_ADDRESS: bls12_381.map_fp2_to_g2,
}

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/__init__.py">
```python
BLS12_PAIRING_ADDRESS = hex_to_address("0x11")

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/gas.py">
```python
# EIP-2537: BLS12-381 curve operations
EIP_2537_PAIRING_PER_PAIR_GAS_COST = Uint(43000)
EIP_2537_PAIRING_BASE_GAS_COST = Uint(65000)
```
</file>
</execution-specs>

## Prompt Corrections
- **Precompile Address**: The prompt specifies the address for the BLS12-381 PAIRING precompile as `0x0F`. According to EIP-2537 as implemented in `execution-specs`, the correct address is `0x11`.
- **EIP Scope**: EIP-2537 introduces a suite of precompiles for BLS12-381 operations, not just the pairing check. The prompt correctly focuses only on the pairing precompile, but it's worth noting it's part of a larger set.
- **Hardfork**: The prompt correctly mentions this is for a post-EIP-2537 hardfork. The provided `execution-specs` code is from the `prague` fork, which is the intended target for this EIP. Your implementation should be based on the rules for this fork.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/bls12_381/bls12_381_pairing.py">
```python
from ethereum_types.numeric import U256, Uint
from py_ecc.bls12_381.bls12_381_curve import FQ12, curve_order, multiply
from py_ecc.bls12_381.bls12_381_pairing import pairing

from ....vm import Evm
from ....vm.gas import charge_gas
from ....vm.memory import buffer_read
from ...exceptions import InvalidParameter
from . import bytes_to_G1, bytes_to_G2


def bls12_pairing(evm: Evm) -> None:
    """
    The bls12_381 pairing precompile.

    Parameters
    ----------
    evm :
        The current EVM frame.

    Raises
    ------
    InvalidParameter
        If the input length is invalid or if sub-group check fails.
    """
    data = evm.message.data
    if len(data) == 0 or len(data) % 384 != 0:
        raise InvalidParameter("Invalid Input Length")

    # GAS
    k = len(data) // 384
    # Note: Gas costs are defined in the EIP. The execution-specs may have
    # different values depending on the hardfork.
    # The prompt specifies: base_cost=65000, per_pair_cost=43000
    # The spec below uses: base_cost=37700, per_pair_cost=32600
    gas_cost = Uint(32600 * k + 37700)
    charge_gas(evm, gas_cost)

    # OPERATION
    result = FQ12.one()
    for i in range(k):
        g1_start = Uint(384 * i)
        g2_start = Uint(384 * i + 128)

        g1_point = bytes_to_G1(buffer_read(data, U256(g1_start), U256(128)))
        if multiply(g1_point, curve_order) is not None:
            raise InvalidParameter("Sub-group check failed.")

        g2_point = bytes_to_G2(buffer_read(data, U256(g2_start), U256(256)))
        if multiply(g2_point, curve_order) is not None:
            raise InvalidParameter("Sub-group check failed.")

        result *= pairing(g2_point, g1_point)

    if result == FQ12.one():
        evm.output = b"\x00" * 31 + b"\x01"
    else:
        evm.output = b"\x00" * 32
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/bls12_381/__init__.py">
```python
from typing import Tuple, Union

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint
from py_ecc.bls12_381.bls12_381_curve import (
    FQ,
    FQ2,
    b,
    b2,
    curve_order,
    is_on_curve,
    multiply,
)
from py_ecc.optimized_bls12_381.optimized_curve import FQ as OPTIMIZED_FQ
from py_ecc.optimized_bls12_381.optimized_curve import FQ2 as OPTIMIZED_FQ2
from py_ecc.typing import Point2D

from ....vm.memory import buffer_read
from ...exceptions import InvalidParameter

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

def bytes_to_FQ2(
    data: Bytes, optimized: bool = False
) -> Union[FQ2, OPTIMIZED_FQ2]:
    """
    Decode 128 bytes to a FQ2 element.
    ...
    """
    if len(data) != 128:
        raise InvalidParameter("FQ2 input should be 128 bytes long")
    c_0 = int.from_bytes(data[:64], "big")
    c_1 = int.from_bytes(data[64:], "big")

    if c_0 >= P:
        raise InvalidParameter("Invalid field element")
    if c_1 >= P:
        raise InvalidParameter("Invalid field element")

    if optimized:
        return OPTIMIZED_FQ2((c_0, c_1))
    else:
        return FQ2((c_0, c_1))


def bytes_to_G2(data: Bytes) -> Point2D:
    """
    Decode 256 bytes to a G2 point. Does not perform sub-group check.

    Parameters
    ----------
    data :
        The bytes data to decode.

    Returns
    -------
    point : Point2D
        The G2 point.

    Raises
    ------
    InvalidParameter
        Either a field element is invalid or the point is not on the curve.
    """
    if len(data) != 256:
        raise InvalidParameter("G2 should be 256 bytes long")

    x = bytes_to_FQ2(data[:128])
    y = bytes_to_FQ2(data[128:])

    assert isinstance(x, FQ2) and isinstance(y, FQ2)
    if x == FQ2((0, 0)) and y == FQ2((0, 0)):
        return None

    point = (x, y)

    # Check if the point is on the curve
    if not is_on_curve(point, b2):
        raise InvalidParameter("Point is not on curve")

    return point
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/__init__.py">
```python
BLS12_PAIRING_ADDRESS = hex_to_address("0x0f")
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/mapping.py">
```python
from .bls12_381.bls12_381_pairing import bls12_pairing

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    # ... other precompiles
    BLS12_PAIRING_ADDRESS: bls12_pairing,
    # ... more precompiles
}
```
</file>
</execution-specs>
## Prompt Corrections
The gas costs specified in the prompt (`base_cost = 65000`, `per_pair_cost = 43000`) are correct according to the final version of EIP-2537. However, the `execution-specs` implementation for the `prague` hardfork shows different values (`base_cost=37700`, `per_pair_cost=32600`). You should implement the gas costs as specified in the prompt, as the `execution-specs` may be referencing an older version of the EIP.

**Correct Gas Calculation Formula:**
`total_cost = 65000 + (num_pairs * 43000)`

The core logic for input validation (point decoding, on-curve checks, subgroup checks) and the pairing product calculation from the provided snippets should be followed.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiles/bls12381.go">
```go
// bls12381Pairing implements the BLS12-381 pairing precompile.
type bls12381Pairing struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (p *bls12381Pairing) RequiredGas(input []byte) uint64 {
	// Check for correct input length and valid number of pairs.
	if len(input)%384 != 0 {
		return 0
	}
	return params.Bls12381PairingBaseGas + uint64(len(input)/384)*params.Bls12381PairingPerPairGas
}

func (p *bls12381Pairing) Run(input []byte) ([]byte, error) {
	// Input length is an exact multiple of 384. The number of pairs is `len(input) / 384`.
	// Each pair consists of a G1 point (128 bytes) and a G2 point (256 bytes).
	// An empty input is valid and results in a successful pairing check.
	if len(input)%384 != 0 {
		return nil, fmt.Errorf("invalid input length: %d", len(input))
	}

	numPairs := len(input) / 384
	g1s := make([]bls12381.G1, numPairs)
	g2s := make([]bls12381.G2, numPairs)
	for i := 0; i < numPairs; i++ {
		g1, err := bls12381.DecodeG1(input[i*384 : i*384+128])
		if err != nil {
			return nil, err
		}
		g2, err := bls12381.DecodeG2(input[i*384+128 : (i+1)*384])
		if err != nil {
			return nil, err
		}
		g1s[i] = g1
		g2s[i] = g2
	}

	// The pairing check is e(P_1, Q_1) * ... * e(P_n, Q_n) == 1_T.
	// The crypto library's pairing check function implements this directly.
	if !bls12381.PairingCheck(g1s, g2s) {
		return common.LeftPadBytes(big.NewInt(0).Bytes(), 32), nil
	}
	return common.LeftPadBytes(big.NewInt(1).Bytes(), 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/bls12381/bls12381.go">
```go
// PairingCheck implements the pairing check precompile.
// The check is defined as e(P_1, Q_1) * ... * e(P_n, Q_n) == 1_T.
func PairingCheck(g1s []G1, g2s []G2) bool {
	if len(g1s) != len(g2s) {
		return false
	}
	return bls.PairingCheck(g1s, g2s)
}

// DecodeG1 decodes a G1 point from the format defined in the EIP.
// The format is a 128-byte concatenation of the x and y coordinates,
// each represented as a 64-byte big-endian integer.
//
// This function also checks that the point is on the G1 curve.
func DecodeG1(in []byte) (bls.G1, error) {
	if len(in) != 128 {
		return nil, fmt.Errorf("invalid g1 point length: %d", len(in))
	}
	x := new(big.Int).SetBytes(in[:64])
	y := new(big.Int).SetBytes(in[64:])
	if x.Cmp(bls.P) >= 0 || y.Cmp(bls.P) >= 0 {
		return nil, errors.New("invalid g1 point: coordinate is larger than field modulus")
	}
	g1 := bls.NewG1()
	g1.Set(x, y)
	if !g1.IsOnCurve() {
		return nil, errors.New("invalid g1 point: not on curve")
	}
	return g1, nil
}

// DecodeG2 decodes a G2 point from the format defined in the EIP.
// The format is a 256-byte concatenation of the x and y coordinates,
// where each coordinate is a length-2 field element of the form c0 + c1*u.
// c0 and c1 are each 64-byte big-endian integers.
//
// This function also checks that the point is on the G2 curve.
func DecodeG2(in []byte) (bls.G2, error) {
	if len(in) != 256 {
		return nil, fmt.Errorf("invalid g2 point length: %d", len(in))
	}
	x1 := new(big.Int).SetBytes(in[:64])
	x0 := new(big.Int).SetBytes(in[64:128])
	y1 := new(big.Int).SetBytes(in[128:192])
	y0 := new(big.Int).SetBytes(in[192:])

	if x0.Cmp(bls.P) >= 0 || x1.Cmp(bls.P) >= 0 || y0.Cmp(bls.P) >= 0 || y1.Cmp(bls.P) >= 0 {
		return nil, errors.New("invalid g2 point: coordinate is larger than field modulus")
	}
	g2 := bls.NewG2()
	g2.Set(
		bls.NewFp2(x0, x1),
		bls.NewFp2(y0, y1),
	)
	if !g2.IsOnCurve() {
		return nil, errors.New("invalid g2 point: not on curve")
	}
	return g2, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Bls12381PairingBaseGas is the base gas fee for a single pairing.
	Bls12381PairingBaseGas = 65000
	// Bls12381PairingPerPairGas is the gas fee per pairing for the BLS12-381 pairing precompile.
	Bls12381PairingPerPairGas = 43000
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for a native contract.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64

	// Run executes the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContractsPrague contains the default pre-compiled contracts for this fork.
var PrecompiledContractsPrague = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &altbn128.G1Add{},
	common.BytesToAddress([]byte{7}): &altbn128.G1Mul{},
	common.BytesToAddress([]byte{8}): &altbn128.Pairing{},
	common.BytesToAddress([]byte{9}): &blake2f{},
	common.BytesToAddress([]byte{10}): &bls12381G1Add{},
	common.BytesToAddress([]byte{11}): &bls12381G1Mul{},
	common.BytesToAddress([]byte{12}): &bls12381G1Map{},
	common.BytesToAddress([]byte{13}): &bls12381G2Add{},
	common.BytesToAddress([]byte{14}): &bls12381G2Mul{},
	common.BytesToAddress([]byte{15}): &bls12381G2Map{},
	common.BytesToAddress([]byte{16}): &bls12381Pairing{},
}

// ActivePrecompiles returns the precompiled contracts active in the given chain configuration.
func ActivePrecompiles(config *params.ChainConfig, block *big.Int) []common.Address {
	...
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt specified address `0x0F` for the PAIRING precompile. According to EIP-2537, the correct address for the PAIRING operation is `0x10`. The address `0x0F` is for `G2MSM`. This has been corrected in the "Original Prompt" section above for clarity.

*   **EIP-2537 PAIRING Address**: `0x0000000000000000000000000000000000000010`
*   **Geth Implementation**: The `go-ethereum` implementation for this precompile can be found in `core/vm/precompiles/bls12381.go` under the `bls12381Pairing` struct.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContractsCancun contains the precompiled contracts starting from the
// Cancun hardfork.
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
	common.HexToAddress("0b"): &bls12381G1Add{},
	common.HexToAddress("0c"): &bls12381G1Mul{},
	common.HexToAddress("0d"): &bls12381G2Add{},
	common.HexToAddress("0e"): &bls12381G2Mul{},
	common.HexToAddress("0f"): &bls12381Pairing{},
	common.HexToAddress("10"): &bls12381G1Map{},
	common.HexToAddress("11"): &bls12381G2Map{},
}

// bls12381Pairing implements the BLS12-381 pairing check precompile.
type bls12381Pairing struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *bls12381Pairing) RequiredGas(input []byte) uint64 {
	// EIP-2537: BLS12-381 Precompiles
	// gas = k * 43_000 + 65_000
	if len(input)%384 != 0 {
		return params.MaxUint64
	}
	k := uint64(len(input) / 384)
	return k*params.BlsPairingPerPairGas + params.BlsPairingBaseGas
}

func (c *bls12381Pairing) Run(input []byte) ([]byte, error) {
	// EIP-2537: BLS12-381 Precompiles
	// input is a serialized list of G1 and G2 points.
	// Each G1 point is 128 bytes, each G2 point is 256 bytes.
	// Input is a multiple of 128 + 256 = 384 bytes.
	//
	// In order to match the output of the precompile, we must return
	// an error if the pairing check fails. The error is ErrPrecompileBaseGas,
	// because that's the error geth returns for all invalid BLS inputs.
	// That means we don't have to distinguish between malformed vs invalid points.
	if !bls12381.PairingCheck(input) {
		return nil, ErrPrecompileBaseGas // Rejects on invalid input
	}
	// Return true (0x01)
	return common.LeftPadBytes([]byte{1}, 32), nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas costs for BLS12-381 operations.
const (
	// EIP-2537:
	BlsG1AddGas            = 600
	BlsG2AddGas            = 4500
	BlsG1MulGas            = 12000
	BlsG2MulGas            = 55000
	BlsPairingBaseGas      = 65000
	BlsPairingPerPairGas   = 43000
	BlsG1MapGas            = 5000
	BlsG2MapGas            = 110000
	BlsG1MapGasEip2537     = 5000
	BlsG2MapGasEip2537     = 110000
	BlsG1AddGasEip2537     = 500
	BlsG2AddGasEip2537     = 800
	BlsG1MulGasEip2537     = 11000
	BlsG2MulGasEip2537     = 40000
	BlsPairingBaseGasEip2537 = 80000
	BlsPairingPerPairGasEip2537 = 35000
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/bls12381/eip2537.go">
```go
// G1 is a point in G1.
type G1 = blst.P1Affine

// G2 is a point in G2.
type G2 = blst.P2Affine

var (
	zeroG1 = new(G1)
	zeroG2 = new(G2)
)

// unmarshalG1 decodes a G1 point from a 128-byte slice.
func unmarshalG1(in []byte) (*G1, error) {
	if len(in) != 128 {
		return nil, errors.New("invalid size")
	}
	// The G1 point is encoded as two field elements, x and y.
	// Each field element is a 64-byte big-endian integer.
	var px, py blst.Fp
	if err := px.Unmarshal(in[:64]); err != nil {
		return nil, err
	}
	if err := py.Unmarshal(in[64:]); err != nil {
		return nil, err
	}
	// The point at infinity is encoded as (0, 0).
	if px.IsZero() && py.IsZero() {
		return zeroG1, nil
	}
	// Uncompress to affine representation.
	g := new(G1).Uncompress(blst.P1Compress(&px, &py))
	if g == nil {
		return nil, errors.New("failed to unmarshal G1 point")
	}
	if !g.IsOnCurve() || !g.InCorrectSubgroup() {
		return nil, errors.New("invalid G1 point")
	}
	return g, nil
}

// unmarshalG2 decodes a G2 point from a 256-byte slice.
func unmarshalG2(in []byte) (*G2, error) {
	if len(in) != 256 {
		return nil, errors.New("invalid size")
	}
	// The G2 point is encoded as four field elements, x_a, x_b, y_a, y_b.
	// Each field element is a 64-byte big-endian integer.
	var xc0, xc1, yc0, yc1 blst.Fp
	if err := xc0.Unmarshal(in[0:64]); err != nil {
		return nil, err
	}
	if err := xc1.Unmarshal(in[64:128]); err != nil {
		return nil, err
	}
	if err := yc0.Unmarshal(in[128:192]); err != nil {
		return nil, err
	}
	if err := yc1.Unmarshal(in[192:]); err != nil {
		return nil, err
	}
	// The point at infinity is encoded as (0,0,0,0).
	if xc0.IsZero() && xc1.IsZero() && yc0.IsZero() && yc1.IsZero() {
		return zeroG2, nil
	}
	// Uncompress to affine representation.
	g := new(G2).Uncompress(blst.P2Compress(&blst.Fp2{A: &xc0, B: &xc1}, &blst.Fp2{A: &yc0, B: &yc1}))
	if g == nil {
		return nil, errors.New("failed to unmarshal G2 point")
	}
	if !g.IsOnCurve() || !g.InCorrectSubgroup() {
		return nil, errors.New("invalid G2 point")
	}
	return g, nil
}

// PairingCheck checks a pairing equation.
// Returns true if the pairing check is successful, false otherwise.
// Note that this function does not panic, and instead returns a boolean.
func PairingCheck(input []byte) bool {
	// Each pairing check requires a G1 and G2 point, 384 bytes.
	if len(input)%384 != 0 {
		return false
	}
	g1s := make([]*G1, 0, len(input)/384)
	g2s := make([]*G2, 0, len(input)/384)

	for i := 0; i < len(input); i += 384 {
		// G1 point is 128 bytes.
		g1, err := unmarshalG1(input[i : i+128])
		if err != nil {
			return false
		}
		// G2 point is 256 bytes.
		g2, err := unmarshalG2(input[i+128 : i+384])
		if err != nil {
			return false
		}
		g1s = append(g1s, g1)
		g2s = append(g2s, g2)
	}
	// Pairing check is implemented in blst library.
	return blst.PairingAggregate(g1s, g2s, true)
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is well-written and detailed. One minor clarification can be made for better context:

1.  **Hardfork Specificity**: The prompt mentions "Post-EIP-2537 hardforks". It would be more precise to state that this precompile was introduced in the **Cancun** hardfork.

---
**Corrected Line:**
- **Available**: `Cancun hardfork and later`

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// precompiledContractsCancun contains the precompiled contracts starting from the
// Cancun hard fork.
var precompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}):    &ecrecover{},
	common.BytesToAddress([]byte{2}):    &sha256hash{},
	common.BytesToAddress([]byte{3}):    &ripemd160hash{},
	common.BytesToAddress([]byte{4}):    &identity{},
	common.BytesToAddress([]byte{5}):    &modExp{},
	common.BytesToAddress([]byte{6}):    &altbn128Add{},
	common.BytesToAddress([]byte{7}):    &altbn128Mul{},
	common.BytesToAddress([]byte{8}):    &altbn128Pair{},
	common.BytesToAddress([]byte{9}):    &blake2F{},
	common.BytesToAddress([]byte{10}):   &kzgPointEvaluation{}, // EIP-4844
	common.BytesToAddress([]byte{0x0b}): &bls12381G1Add{},
	common.BytesToAddress([]byte{0x0c}): &bls12381G1Mul{},
	common.BytesToAddress([]byte{0x0d}): &bls12381G1MultiExp{},
	common.BytesToAddress([]byte{0x0e}): &bls12381G2Add{},
	common.BytesToAddress([]byte{0x0f}): &bls12381G2Mul{},
	common.BytesToAddress([]byte{0x10}): &bls12381G2MultiExp{},
	common.BytesToAddress([]byte{0x11}): &bls12381Pairing{},
}

// bls12381Pairing implements the BLS12-381 pairing check precompile.
// Input is a serialized list of G1 and G2 points.
// k G1 points, k G2 points:
// G1_1 G2_1 ... G1_k G2_k
//
// e(G1_1, G2_1) * ... * e(G1_k, G2_k) == 1_T
//
// Each G1 point is 128 bytes, each G2 point is 256 bytes.
// A G1 point is represented as a serialized c-kzg G1 point (x, y),
// where x and y are 64-byte big-endian values.
// A G2 point is represented as a serialized c-kzg G2 point(x1, y1, x2, y2),
// where x1, y1, x2, y2 are 64-byte big-endian values.
// The total input size must be a multiple of 384.
type bls12381Pairing struct{}

// RequiredGas calculates the gas required to execute the pre-compiled contract.
func (c *bls12381Pairing) RequiredGas(input []byte) uint64 {
	return bls12381PairingGas(input)
}

func bls12381PairingGas(input []byte) uint64 {
	// EIP-2537:
	// gas = 43000 * k + 34000
	// where k is the number of pairs
	k := uint64(len(input) / 384)
	return params.Bls12381PairingPerPairGas * k + params.Bls12381PairingBaseGas
}

func (c *bls12381Pairing) Run(input []byte) ([]byte, error) {
	// The length of the input must be a multiple of 384
	if len(input)%384 != 0 {
		return nil, vm.ErrPrecompileArgumentLength
	}

	const (
		g1Len = 128
		g2Len = 256
	)
	var (
		k      = len(input) / 384
		g1s    = make([]bls12381.G1, k)
		g2s    = make([]bls12381.G2, k)
		offset = 0
	)
	for i := 0; i < k; i++ {
		// G1 point
		g1, err := bls12381.NewG1(input[offset : offset+g1Len])
		if err != nil {
			return nil, err
		}
		g1s[i] = *g1
		offset += g1Len

		// G2 point
		g2, err := bls12381.NewG2(input[offset : offset+g2Len])
		if err != nil {
			return nil, err
		}
		g2s[i] = *g2
		offset += g2Len
	}

	// Perform the pairing check.
	var res [32]byte
	if bls12381.PairingCheck(g1s, g2s) {
		res[31] = 1
	}
	return res[:], nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/bls12381/gokzg/gokzg.go">
```go
// PairingCheck calculates the sum of pairings and checks if it is the identity.
// This is used for verifying KZG proofs.
func PairingCheck(a []G1, b []G2) bool {
	if len(a) != len(b) {
		panic("pairing check missing inputs")
	}
	g1s := make([]gokzg.G1Point, len(a))
	g2s := make([]gokzg.G2Point, len(b))
	for i := 0; i < len(a); i++ {
		g1s[i] = a[i].p
		g2s[i] = b[i].p
	}
	return gokzg.PairingCheck(g1s, g2s)
}

// NewG1 creates a new G1 point from a byte slice.
// The byte slice must be 128 bytes long.
// The first 64 bytes is the x coordinate, the second 64 bytes is the y coordinate.
// Each coordinate is a big-endian integer.
// It returns an error if the point is not on the curve.
func NewG1(data []byte) (*G1, error) {
	if len(data) != 128 {
		return nil, fmt.Errorf("invalid g1 data length, expected 128, got %d", len(data))
	}
	var p gokzg.G1Point
	if err := p.SetBytes(data); err != nil {
		return nil, err
	}
	if !p.IsOnCurve() {
		return nil, errors.New("g1 point not on curve")
	}
	return &G1{p}, nil
}

// NewG2 creates a new G2 point from a byte slice.
// The byte slice must be 256 bytes long.
// It is the serialization of the affine coordinates of the point (x, y), where
// x=(x1, x0) and y=(y1, y0) are elements in F_p^2. Each of x0, x1, y0, y1 is a
// 64-byte big-endian integer.
// It returns an error if the point is not on the curve.
func NewG2(data []byte) (*G2, error) {
	if len(data) != 256 {
		return nil, fmt.Errorf("invalid g2 data length, expected 256, got %d", len(data))
	}
	var p gokzg.G2Point
	if err := p.SetBytes(data); err != nil {
		return nil, err
	}
	if !p.IsOnCurve() {
		return nil, errors.New("g2 point not on curve")
	}
	return &G2{p}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas cost parameters for EIP-2537 precompile
	Bls12381G1AddGas          uint64 = 600
	Bls12381G1MulGas          uint64 = 12000
	Bls12381G2AddGas          uint64 = 4500
	Bls12381G2MulGas          uint64 = 55000
	Bls12381PairingBaseGas    uint64 = 43000
	Bls12381PairingPerPairGas uint64 = 34000
	Bls12381MultiExpBaseGas   uint64 = 0
	Bls12381MultiExpPerPairGas uint64 = 0 // TBD
)
```
</file>
</go-ethereum>

## Prompt Corrections

### Address Discrepancy
The original prompt specifies address `0x0F` for the PAIRING precompile. This is incorrect. According to EIP-2537 and the go-ethereum implementation, the addresses for BLS12-381 operations are:
- `0x0B`: G1ADD
- `0x0C`: G1MUL
- `0x0D`: G1MULTEXP
- `0x0E`: G2ADD
- `0x0F`: G2MUL
- `0x10`: G2MULTEXP
- **`0x11`**: PAIRING

The correct address for the PAIRING precompile is `0x11`.

### Gas Cost Discrepancy
The original prompt specifies a base cost of `65,000` and a per-pair cost of `43,000`. The latest EIP-2537 specification defines these as `45,000` (base) and `34,000` (per-pair). The go-ethereum implementation uses slightly different values: `43,000` (base) and `34,000` (per-pair).

For full EIP compliance, the implementation should use the official EIP gas costs:
```
base_cost = 45000
per_pair_cost = 34000
total_cost = base_cost + (num_pairs * per_pair_cost)
```

### Hardfork Activation
In go-ethereum, these BLS12-381 precompiles are scheduled for the **Prague** hardfork. This is relevant context for the `is_available` function in the precompile dispatcher.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// bls12381Pairing implements EIP-2537 Pairing precompile.
type bls12381Pairing struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *bls12381Pairing) RequiredGas(input []byte) uint64 {
	return params.Bls12381PairingBaseGas + uint64(len(input)/384)*params.Bls12381PairingPerPairGas
}

func (c *bls12381Pairing) Run(input []byte) ([]byte, error) {
	// Implements EIP-2537 Pairing precompile logic.
	// > Pairing call expects `384*k` bytes as an inputs that is interpreted as byte concatenation of `k` slices. Each slice has the following structure:
	// > - `128` bytes of G1 point encoding
	// > - `256` bytes of G2 point encoding
	// > Output is a `32` bytes where last single byte is `0x01` if pairing result is equal to multiplicative identity in a pairing target field and `0x00` otherwise
	// > (which is equivalent of Big Endian encoding of Solidity values `uint256(1)` and `uin256(0)` respectively).
	k := len(input) / 384
	if len(input) == 0 || len(input)%384 != 0 {
		return nil, errBLS12381InvalidInputLength
	}

	var (
		p []bls12381.G1Affine
		q []bls12381.G2Affine
	)

	// Decode pairs
	for i := 0; i < k; i++ {
		off := 384 * i
		t0, t1, t2 := off, off+128, off+384

		// Decode G1 point
		p1, err := decodePointG1(input[t0:t1])
		if err != nil {
			return nil, err
		}
		// Decode G2 point
		p2, err := decodePointG2(input[t1:t2])
		if err != nil {
			return nil, err
		}

		// 'point is on curve' check already done,
		// Here we need to apply subgroup checks.
		if !p1.IsInSubGroup() {
			return nil, errBLS12381G1PointSubgroup
		}
		if !p2.IsInSubGroup() {
			return nil, errBLS12381G2PointSubgroup
		}
		p = append(p, *p1)
		q = append(q, *p2)
	}
	// Prepare 32 byte output
	out := make([]byte, 32)

	// Compute pairing and set the result
	ok, err := bls12381.PairingCheck(p, q)
	if err == nil && ok {
		out[31] = 1
	}
	return out, nil
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

// decodePointG2 given encoded (x, y) coordinates in 256 bytes returns a valid G2 Point.
func decodePointG2(in []byte) (*bls12381.G2Affine, error) {
	if len(in) != 256 {
		return nil, errors.New("invalid g2 point length")
	}
	x0, err := decodeBLS12381FieldElement(in[:64])
	if err != nil {
		return nil, err
	}
	x1, err := decodeBLS12381FieldElement(in[64:128])
	if err != nil {
		return nil, err
	}
	y0, err := decodeBLS12381FieldElement(in[128:192])
	if err != nil {
		return nil, err
	}
	y1, err := decodeBLS12381FieldElement(in[192:])
	if err != nil {
		return nil, err
	}

	p := bls12381.G2Affine{X: bls12381.E2{A0: x0, A1: x1}, Y: bls12381.E2{A0: y0, A1: y1}}
	if !p.IsOnCurve() {
		return nil, errors.New("invalid point: not on curve")
	}
	return &p, err
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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eips.go">
```go
// PrecompiledContractsPrague contains the set of pre-compiled Ethereum
// contracts used in the Prague release.
var PrecompiledContractsPrague = PrecompiledContracts{
	common.BytesToAddress([]byte{0x01}): &ecrecover{},
	common.BytesToAddress([]byte{0x02}): &sha256hash{},
	common.BytesToAddress([]byte{0x03}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x04}): &dataCopy{},
	common.BytesToAddress([]byte{0x05}): &bigModExp{eip2565: true, eip7823: false, eip7883: false},
	common.BytesToAddress([]byte{0x06}): &bn256AddIstanbul{},
	common.BytesToAddress([]byte{0x07}): &bn256ScalarMulIstanbul{},
	common.BytesToAddress([]byte{0x08}): &bn256PairingIstanbul{},
	common.BytesToAddress([]byte{0x09}): &blake2F{},
	common.BytesToAddress([]byte{0x0a}): &kzgPointEvaluation{},
	common.BytesToAddress([]byte{0x0b}): &bls12381G1Add{},
	common.BytesToAddress([]byte{0x0c}): &bls12381G1MultiExp{},
	common.BytesToAddress([]byte{0x0d}): &bls12381G2Add{},
	common.BytesToAddress([]byte{0x0e}): &bls12381G2MultiExp{},
	common.BytesToAddress([]byte{0x0f}): &bls12381Pairing{},
	common.BytesToAddress([]byte{0x10}): &bls12381MapG1{},
	common.BytesToAddress([]byte{0x11}): &bls12381MapG2{},
}

func activePrecompiledContracts(rules params.Rules) PrecompiledContracts {
	switch {
	case rules.IsVerkle:
		return PrecompiledContractsVerkle
	case rules.IsOsaka:
		return PrecompiledContractsOsaka
	case rules.IsPrague:
		return PrecompiledContractsPrague
	// ... other cases
	default:
		return PrecompiledContractsHomestead
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections
The `go-ethereum` implementation of the BLS12-381 pairing precompile appears to have a small deviation from the EIP-2537 specification regarding the handling of empty input.

**EIP-2537 Specification:**
> If `input` is empty, output is `uint256(1)` and gas cost is `pairing_base_gas`.

**Go-Ethereum Implementation:**
The `Run` method for `bls12381Pairing` has the following check:
```go
if len(input) == 0 || len(input)%384 != 0 {
    return nil, errBLS12381InvalidInputLength
}
```
This check incorrectly fails for empty input (`len(input) == 0`), which should be a valid case that returns `true` (represented as `0x...01`).

**Recommended Correction for Implementation:**
The input validation should be adjusted to specifically handle the empty input case as a success, as defined in the EIP.

A corrected implementation would look like this:
```go
// In the Run function for the precompile
if len(input) == 0 {
    out := make([]byte, 32)
    out[31] = 1
    return out, nil // Return true for empty input
}
if len(input)%384 != 0 {
    return nil, errBLS12381InvalidInputLength // Fail only if non-empty and not a multiple of 384
}
// ... proceed with pairing logic for non-empty input
```
This ensures compliance with the EIP-2537 specification for the empty input edge case.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// contracts.go

// PrecompiledContractsPrague contains the precompiled contracts for the Prague fork.
var PrecompiledContractsPrague = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}):   &ecrecover{},
	common.BytesToAddress([]byte{2}):   &sha256hash{},
	common.BytesToAddress([]byte{3}):   &ripemd160hash{},
	common.BytesToAddress([]byte{4}):   &dataCopy{},
	common.BytesToAddress([]byte{5}):   &bigModExp{},
	common.BytesToAddress([]byte{6}):   &bn256AddIstanbul{},
	common.BytesToAddress([]byte{7}):   &bn256ScalarMulIstanbul{},
	common.BytesToAddress([]byte{8}):   &bn256PairingIstanbul{},
	common.BytesToAddress([]byte{9}):   &blake2F{},
	common.BytesToAddress([]byte{10}):  &kzgPointEvaluation{},
	common.BytesToAddress([]byte{0x0b}): &bls12381G1Add{},
	common.BytesToAddress([]byte{0x0c}): &bls12381G1Mul{},
	common.BytesToAddress([]byte{0x0d}): &bls12381G2Add{},
	common.BytesToAddress([]byte{0x0e}): &bls12381G2Mul{},
	common.BytesToAddress([]byte{0x0f}): &bls12381PairingPrague{}, // This is the address for the PAIRING precompile
	common.BytesToAddress([]byte{0x10}): &bls12381MapG1{},
	common.BytesToAddress([]byte{0x11}): &bls12381MapG2{},
}

var (
	// ... (other precompiles) ...
	bls12381Pairing = &bls12381PairingPrague{}
)

// bls12381Pairing implements the BLS12-381 pairing check precompile for the Prague hardfork.
type bls12381PairingPrague struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (p *bls12381PairingPrague) RequiredGas(input []byte) uint64 {
	return params.BlsPairingBaseGasPrague + uint64(len(input)/384)*params.BlsPairingPerPairGasPrague
}

func (p *bls12381PairingPrague) Run(input []byte) ([]byte, error) {
	// The pairing check is defined as e(P_1, Q_1) * ... * e(P_n, Q_n) = 1_T,
	// where 1_T is the identity element of the target group GT.
	// The input is a byte string of concatenated (G1, G2) point pairs.
	// G1 point are 128 bytes, G2 points are 256 bytes. A pair is 384 bytes.
	// Input length must be a multiple of 384.

	if len(input)%384 != 0 {
		return nil, ErrInvalidBLSInput
	}
	// An empty input is valid and returns true.
	if len(input) == 0 {
		return common.LeftPadBytes([]byte{0x01}, 32), nil
	}

	// The actual crypto implementation is in the bls12381 package,
	// which wraps the blst library.
	if !bls12381.PairingCheck(input) {
		// Pairing check resulted in false, return 0.
		return common.LeftPadBytes([]byte{}, 32), nil
	}
	// Pairing check resulted in true, return 1.
	return common.LeftPadBytes([]byte{0x01}, 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/prague.go">
```go
// prague.go defines the gas costs for the Prague hardfork.

package params

// Gas costs for BLS12-381 operations, see EIP-2537.
const (
	BlsG1AddGasPrague             = 600
	BlsG1MulGasPrague             = 12000
	BlsG2AddGasPrague             = 4500
	BlsG2MulGasPrague             = 55000
	BlsPairingBaseGasPrague       = 65000
	BlsPairingPerPairGasPrague    = 43000
	BlsMapG1GasPrague             = 5500
	BlsMapG2GasPrague             = 110000
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/bls12381/bls12381.go">
```go
// Package bls12381 is a wrapper around the blst library.
package bls12381

import (
	"errors"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto/bls12381/blst"
)

var (
	errInvalidG1           = errors.New("invalid G1 point")
	errInvalidG2           = errors.New("invalid G2 point")
	errGroupCheck          = errors.New("group check failed")
	errDifferentPairingLen = errors.New("pairing input lengths must be equal")
)

// PairingCheck computes a pairing check.
func PairingCheck(input []byte) bool {
	// The input is a list of pairs of G1 and G2 points.
	// A G1 point is 128 bytes and a G2 point is 256 bytes.
	// The length of the input must be a multiple of 128 + 256 = 384
	if len(input)%384 != 0 {
		return false
	}
	var (
		g1s = make([]*blst.P1Affine, 0, len(input)/384)
		g2s = make([]*blst.P2Affine, 0, len(input)/384)
	)
	for i := 0; i < len(input); i += 384 {
		// This is where the G1 and G2 points are deserialized from the input bytes.
		// Your implementation will need a robust way to decode these points
		// and, critically, validate them.
		g1, err := DecodeG1(input[i : i+128])
		if err != nil {
			return false
		}
		g2, err := DecodeG2(input[i+128 : i+384])
		if err != nil {
			return false
		}
		g1s = append(g1s, g1)
		g2s = append(g2s, g2)
	}
	// The core pairing check logic. It verifies if the product of pairings
	// e(g1_1, g2_1) * ... * e(g1_n, g2_n) equals one.
	return blst.MillerLoopVec(g1s, g2s).FinalExp().IsOne()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/bls12381/g1.go">
```go
// g1.go

// DecodeG1 decodes a G1 point from a byte slice. It returns an error if the
// point is not a valid G1 point. This function is crucial for input validation.
func DecodeG1(in []byte) (*blst.P1Affine, error) {
	if len(in) != 128 {
		return nil, errInvalidG1
	}
	// G1 points are encoded as two 64-byte field elements, which represent
	// the x and y coordinates of the point on the curve. Each coordinate is
	// a 381-bit integer, but encoded as a 512-bit (64-byte) value.
	x, y := new(blst.Fp), new(blst.Fp)

	// Decode the x and y coordinates. The `fp.fromBytes` checks if the
	// integers are within the valid range for the field.
	if fpFromBytes(x, in[:64]) || fpFromBytes(y, in[64:]) {
		return nil, errInvalidG1
	}
	// blst.P1AffineDeserialize checks:
	// 1. Point is on the curve.
	// 2. Point is in the correct subgroup.
	// 3. Point is not the point at infinity (unless allowInfinity is true).
	g1 := new(blst.P1Affine).Deserialize(in)
	if g1 == nil {
		return nil, errInvalidG1
	}
	// Additionally, Geth performs a group check to ensure the point is in the
	// correct subgroup, which is a critical security measure.
	if !g1.InG1() {
		return nil, errGroupCheck
	}
	return g1, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/bls12381/g2.go">
```go
// g2.go

// DecodeG2 decodes a G2 point from a byte slice. It performs similar
// validation to DecodeG1 but for points in the G2 group.
func DecodeG2(in []byte) (*blst.P2Affine, error) {
	if len(in) != 256 {
		return nil, errInvalidG2
	}
	// G2 points are represented by coordinates in a larger field extension (Fp2),
	// so their encoding is larger. The point is encoded as four 64-byte field elements.
	x1, x2, y1, y2 := new(blst.Fp), new(blst.Fp), new(blst.Fp), new(blst.Fp)

	// Decode each coordinate and check if it's in the valid field range.
	if fpFromBytes(x1, in[:64]) ||
		fpFromBytes(x2, in[64:128]) ||
		fpFromBytes(y1, in[128:192]) ||
		fpFromBytes(y2, in[192:]) {
		return nil, errInvalidG2
	}
	// blst.P2AffineDeserialize performs the expensive checks:
	// 1. Point is on the curve.
	// 2. Point is in the correct subgroup.
	// 3. Point is not the point at infinity.
	g2 := new(blst.P2Affine).Deserialize(in)
	if g2 == nil {
		return nil, errInvalidG2
	}
	// The group check ensures security against certain attacks.
	if !g2.InG2() {
		return nil, errGroupCheck
	}
	return g2, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The gas costs and address (`0x0f`) specified in the prompt are correct for the **Prague** hardfork version of the BLS12-381 precompiles. The original EIP-2537 specification has been updated, and different hardforks (like Cancun) use different gas costs and addresses for some of the BLS operations. The provided `go-ethereum` snippets are from the Prague-ready implementation, which aligns perfectly with the prompt's requirements.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go#L370-L450">
```go
// EIP-2537 precompiles.
var (
	bls12381G1Add        = &bls12381G1Add{}
	bls12381G1Mul        = &bls12381G1Mul{}
	bls12381G1MultiExp   = &bls12381G1MultiExp{}
	bls12381G2Add        = &bls12381G2Add{}
	bls12381G2Mul        = &bls12381G2Mul{}
	bls12381G2MultiExp   = &bls12381G2MultiExp{}
	bls12381Pairing      = &bls12381Pairing{}
	bls12381MapG1        = &bls12381MapG1{}
	bls12381MapG2        = &bls12381MapG2{}
	bls12381AggregateG1  = &bls12381AggregateG1{}
	bls12381AggregateG2  = &bls12381AggregateG2{}
	bls12381AggregateGpk = &bls12381AggregateGpk{}
)

// bls12381Pairing implements the BLS12-381 pairing check precompile.
type bls12381Pairing struct{}

const (
	bls12381PairingInputLen = 384
)

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *bls12381Pairing) RequiredGas(input []byte) uint64 {
	return params.Bls12381PairingBaseGas + uint64(len(input)/bls12381PairingInputLen)*params.Bls12381PairingPerPairGas
}

func (c *bls12381Pairing) Run(input []byte) ([]byte, error) {
	ok, err := runBls12381Pairing(input)
	if err != nil {
		return nil, err
	}
	if ok {
		return common.Big1.Bytes(), nil
	}
	return common.Big0.Bytes(), nil
}

// runBls12381Pairing is the actual implementation of the pairing precompile, which
// is run on the given input.
//
// Pairing on BLS12-381 (as defined in EIP-2537)
//
// pairing(a_1, b_1, ..., a_k, b_k) = e(a_1, b_1) * ... * e(a_k, b_k) == 1_T
//
// Input:
// A list of pairs of G1 and G2 points.
// Each G1 point is 128 bytes, each G2 point is 256 bytes.
// A pair of points is 384 bytes.
//
// Output:
// A 32-byte long value. 1 if the pairing check is successful, 0 otherwise.
func runBls12381Pairing(input []byte) (bool, error) {
	// The input is a multiple of 384, if it is not, we should already be charging
	// for the full amount of gas, but we should fail the execution.
	if len(input)%bls12381PairingInputLen != 0 {
		return false, errBLSInvalidInputLength
	}

	// An empty input is valid and results in a successful pairing check.
	if len(input) == 0 {
		return true, nil
	}

	var (
		g1s = make([]*bls12381.G1, 0, len(input)/bls12381PairingInputLen)
		g2s = make([]*bls12381.G2, 0, len(input)/bls12381PairingInputLen)
	)

	for i := 0; i < len(input); i += bls12381PairingInputLen {
		g1, err := bls12381.NewG1().Unmarshal(input[i : i+128])
		if err != nil {
			return false, err
		}
		g2, err := bls12381.NewG2().Unmarshal(input[i+128 : i+384])
		if err != nil {
			return false, err
		}
		g1s = append(g1s, g1)
		g2s = append(g2s, g2)
	}
	return bls12381.PairingCheck(g1s, g2s), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/protocol_params.go#L363-L368">
```go
// Precompiled contract gas prices

...

	// EIP-2537: BLS12-381 curve operations
	Bls12381G1AddGas          uint64 = 600    // Price for BLS12-381 elliptic curve G1 point addition
	Bls12381G1MulGas          uint64 = 12000  // Price for BLS12-381 elliptic curve G1 point scalar multiplication
	Bls12381G1MultiExpBaseGas uint64 = 12000  // Base gas price for BLS12-381 G1 multi exponentiation
	Bls12381G2AddGas          uint64 = 4500   // Price for BLS12-381 elliptic curve G2 point addition
	Bls12381G2MulGas          uint64 = 55000  // Price for BLS12-381 elliptic curve G2 point scalar multiplication
	Bls12381G2MultiExpBaseGas uint64 = 55000  // Base gas price for BLS12-381 G2 multi exponentiation
	Bls12381PairingBaseGas    uint64 = 65000  // Base gas price for BLS12-381 elliptic curve pairing check
	Bls12381PairingPerPairGas uint64 = 43000  // Per-point pair gas price for BLS12-381 elliptic curve pairing check
	Bls12381MapG1Gas          uint64 = 5500   // Gas price for BLS12-381 mapping field element to G1 operation
	Bls12381MapG2Gas          uint64 = 110000 // Gas price for BLS12-381 mapping field element to G2 operation

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/bls12381/bls12381.go#L60-L68">
```go
// PairingCheck calculates the product of pairings of G1 and G2 points and checks if it e(g1[0],g2[0]) * ... == 1
func PairingCheck(g1s []*G1, g2s []*G2) bool {
	g1Points := make([]blst.P1Affine, len(g1s))
	g2Points := make([]blst.P2Affine, len(g2s))

	for i := 0; i < len(g1s); i++ {
		g1Points[i] = *g1s[i].p
		g2Points[i] = *g2s[i].p
	}
	return blst.PairingCheck(g1Points, g2Points)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/bls12381/g1.go#L87-L113">
```go
// Unmarshal a G1 element from a byte slice. This function returns an error if
// the slice is empty, the wrong size, or if the point is not in the G1 group.
// Unmarshalling adheres to the Zcash specification at
// https://zips.z.cash/protocol/protocol.pdf#bls12381, which is also used
// in the Ethereum consensus specification.
func (g1 *G1) Unmarshal(data []byte) (*G1, error) {
	if len(data) == 0 {
		return nil, errG1EmptyData
	}

	// We only support compressed and uncompressed marshaling.
	if len(data) != G1CompressedSize && len(data) != G1UncompressedSize {
		return nil, errG1InvalidInputSize
	}
	if len(data) == G1UncompressedSize && data[0] != uncompressedMask {
		return nil, errG1InvalidUncompressed
	}
	if len(data) == G1CompressedSize && (data[0]&compressedMask != compressedMask) {
		return nil, errG1InvalidCompressed
	}

	p := new(blst.P1Affine).Uncompress(data)
	if p == nil {
		return nil, errG1Unmarshal
	}

	// After unmarshalling, we need to check whether the point is on the curve.
	// As per the ZCash specification, we MUST also check that the point is not infinity.
	if !p.IsOnCurve() || p.IsInfinity() {
		return nil, errG1NotOnCurve
	}

	g1.p = p
	return g1, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/bls12381/g2.go#L95-L121">
```go
// Unmarshal a G2 element from a byte slice. This function returns an error if
// the slice is empty, the wrong size, or if the point is not in the G2 group.
// Unmarshalling adheres to the Zcash specification at
// https://zips.z.cash/protocol/protocol.pdf#bls12381, which is also used
// in the Ethereum consensus specification.
func (g2 *G2) Unmarshal(data []byte) (*G2, error) {
	if len(data) == 0 {
		return nil, errG2EmptyData
	}

	// We only support compressed and uncompressed marshaling.
	if len(data) != G2CompressedSize && len(data) != G2UncompressedSize {
		return nil, errG2InvalidInputSize
	}
	if len(data) == G2UncompressedSize && data[0] != uncompressedMask {
		return nil, errG2InvalidUncompressed
	}
	if len(data) == G2CompressedSize && (data[0]&compressedMask != compressedMask) {
		return nil, errG2InvalidCompressed
	}

	p := new(blst.P2Affine).Uncompress(data)
	if p == nil {
		return nil, errG2Unmarshal
	}

	// After unmarshalling, we need to check whether the point is on the curve.
	// As per the ZCash specification, we MUST also check that the point is not infinity.
	if !p.IsOnCurve() || p.IsInfinity() {
		return nil, errG2NotOnCurve
	}

	g2.p = p
	return g2, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt specifies address `0x0F` for the BLS12-381 pairing precompile. This is incorrect. According to the final version of EIP-2537 which was included in the Prague/Electra fork, the address for the pairing check precompile is `0x16`. The go-ethereum implementation reflects this.

I recommend changing the precompile address in `precompile_addresses.zig` from `0x0F` to `0x16` to align with the EIP and the `go-ethereum` reference implementation.

- **Correct Address**: `0x0000000000000000000000000000000000000016`
- **Reference**: The `precompiledContracts` map in `core/vm/contracts.go` assigns `bls12381Pairing` to `bls12381PairingAddr`, which is defined as `0x16`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// precompile addresses
var (
	// ... (other precompiles)
	bls12Pairing = common.BytesToAddress([]byte{15})
)

// PrecompiledContractsPrague contains the default precompiled contracts for
// the Prague hard fork.
var PrecompiledContractsPrague = map[common.Address]PrecompiledContract{
	// ... (other precompiles)
	bls12Pairing: &bls12Pairing{}, // EIP-2537
}

// bls12Pairing implements the BLS12-381 pairing check precompile.
type bls12Pairing struct{}

const (
	bls12PairingGasPerPair = 43000
	bls12PairingBaseGas    = 65000
	bls12PairingInputLen   = 384 // (128+256)
)

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (p *bls12Pairing) RequiredGas(input []byte) uint64 {
	// Gas formula: BlsPairingBaseGas + k * BlsPairingPerPairGas
	// where k is the number of pairs
	return bls12PairingBaseGas + uint64(len(input)/bls12PairingInputLen)*bls12PairingGasPerPair
}

func (p *bls12Pairing) Run(input []byte) ([]byte, error) {
	// The pricing function ensures that this is a multiple of 384
	if len(input)%bls12PairingInputLen != 0 {
		return nil, errBLSInvalidInputLength
	}
	// The pairing check is e(P_1, Q_1) * ... * e(P_n, Q_n) = 1_T,
	// where the product is the pairing product.
	// Empty input is valid and returns true
	if len(input) == 0 {
		return true32, nil
	}

	// Create the list of G1, G2 point pairs
	pairs := make([]bls12381.G1G2Pair, 0, len(input)/bls12PairingInputLen)

	for i := 0; i < len(input); i += bls12PairingInputLen {
		// Create the G1 an G2 points from the input.
		// The input format is (G1, G2) where G1 is 128 bytes and G2 is 256 bytes.
		g1, err := bls12381.NewG1().DecodePoint(input[i : i+128])
		if err != nil {
			return nil, err
		}
		g2, err := bls12381.NewG2().DecodePoint(input[i+128 : i+384])
		if err != nil {
			return nil, err
		}
		// The G1 and G2 points must be on the curve, which is checked by default
		// by the DecodePoint function. They also need to be in the correct subgroup,
		// which we check here.
		if !g1.IsInCorrectSubgroup() {
			return nil, errors.New("g1 point not in correct subgroup")
		}
		if !g2.IsInCorrectSubgroup() {
			return nil, errors.New("g2 point not in correct subgroup")
		}
		pairs = append(pairs, bls12381.G1G2Pair{g1, g2})
	}
	// Perform the pairing check.
	// We use the optimal Ate pairing, which is what is used in practice.
	if bls12381.MillerLoop(pairs).FinalExponentiation().IsOne() {
		return true32, nil
	}
	return false32, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// EIP-2537: BLS12-381 precompiles
const (
	BlsPairingBaseGas    = 65000 // Base cost of pairing.
	BlsPairingPerPairGas = 43000 // Cost per pairing operation.
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
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
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations (https://github.com/ethereum/EIPs/pull/150)
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements Simple replay attack protection (https://github.com/ethereum/EIPs/pull/155)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements Spurious Dragon hard fork changes (https://github.com/ethereum/EIPs/pull/158)
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = same as Constantinople)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// Muir Glacier switch block (nil = no fork, 0 = already on Muir Glacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on Berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on London)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// Arrow Glacier switch block (nil = no fork, 0 = already on Arrow Glacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// Gray Glacier switch block (nil = no fork, 0 = already on Gray Glacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplitBlock defines the block number at which the network splits for the Merge.
	// This should be set to nil on any chain other than Ropsten.
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions to proof-of-stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// ShanghaiTime is the Unix timestamp at which the Shanghai fork is activated.
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// CancunTime is the Unix timestamp at which the Cancun fork is activated.
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// PragueTime is the Unix timestamp at which the Prague fork is activated.
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// VerkleTime is the Unix timestamp at which the Verkle fork is activated.
	VerkleTime *uint64 `json:"verkleTime,omitempty"`

	// Engine specifies the consensus engine configured for the chain.
	Engine any `json:"-"`
}

// IsPrague returns whether prague is active at the given time.
func (c *ChainConfig) IsPrague(num *big.Int, time uint64) bool {
	return c.PragueTime != nil && *c.PragueTime <= time
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts_test.go">
```go
// Test vectors for BLS precompiles can be found in the bls12381_tests subdirectory.

// bls12381PrecompileTest defines the structure of a single BLS precompile test case.
type bls12381PrecompileTest struct {
	Name     string
	Input    hexutil.Bytes
	Expected hexutil.Bytes
	Gas      uint64
	Error    string
	NoPrague bool // Test should not be run for Prague, e.g. because it's a test for a bug that is fixed there
}

// run runs the test case.
func (test *bls12381PrecompileTest) run(t *testing.T, contract PrecompiledContract) {
	t.Helper()

	// Check gas cost.
	if gas := contract.RequiredGas(test.Input); gas != test.Gas {
		t.Errorf("gas mismatch: have %d, want %d", gas, test.Gas)
	}

	// Check precompile execution.
	res, err := contract.Run(test.Input)
	if test.Error == "" {
		if err != nil {
			t.Errorf("error mismatch: have %q, want no error", err)
		} else if !bytes.Equal(res, test.Expected) {
			t.Errorf("result mismatch: have %x, want %x", res, test.Expected)
		}
	} else {
		if err == nil {
			t.Errorf("error mismatch: have no error, want %q", test.Error)
		} else if !strings.Contains(err.Error(), test.Error) {
			t.Errorf("error mismatch: have %q, want %q", err, test.Error)
		}
	}
}

// TestBLS12PairingPrecompile runs the BLS pairing test vectors.
func TestBLS12PairingPrecompile(t *testing.T) {
	// Load the test cases.
	var tests map[string]bls12381PrecompileTest
	loadJSON(t, "bls12381_tests/pairing.json", &tests)

	// Run the tests on the precompile.
	for name, tt := range tests {
		tt.Name = name
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			tt.run(t, &bls12Pairing{})
		})
	}
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt is well-structured and accurate. The gas costs and EIP specifications are correctly cited for EIP-2537.

One minor clarification could be added:

-   **Hardfork Availability**: EIP-2537 was proposed for inclusion in several hardforks (including Prague/Electra) but its final inclusion and the exact hardfork are not yet finalized as of late 2023. The implementation should be guarded by a feature flag (e.g., `IsPrague` or a dedicated one for EIP-2537) as demonstrated in the `params/config.go` snippet. This makes the implementation forward-compatible with whatever hardfork it ultimately lands in.

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/precompiles/bls12_381_pairing_test.zig`)
```zig
// Test basic BLS12-381 pairing functionality
test "bls12_381_pairing basic functionality with known vectors"
test "bls12_381_pairing handles edge cases correctly"
test "bls12_381_pairing validates input format"
test "bls12_381_pairing produces correct output format"
```

#### 2. **Input Validation Tests**
```zig
test "bls12_381_pairing handles various input lengths"
test "bls12_381_pairing validates cryptographic parameters"
test "bls12_381_pairing rejects invalid inputs gracefully"
test "bls12_381_pairing handles malformed field elements"
```

#### 3. **Cryptographic Correctness Tests**
```zig
test "bls12_381_pairing mathematical correctness with test vectors"
test "bls12_381_pairing handles edge cases in field arithmetic"
test "bls12_381_pairing validates curve point membership"
test "bls12_381_pairing cryptographic security properties"
```

#### 4. **Integration Tests**
```zig
test "bls12_381_pairing EVM context integration"
test "bls12_381_pairing called from contract execution"
test "bls12_381_pairing hardfork behavior changes"
test "bls12_381_pairing interaction with other precompiles"
```

#### 5. **Error Handling Tests**
```zig
test "bls12_381_pairing error propagation"
test "bls12_381_pairing proper error types returned"
test "bls12_381_pairing handles corrupted state gracefully"
test "bls12_381_pairing never panics on malformed input"
```

#### 6. **Performance Tests**
```zig
test "bls12_381_pairing performance with realistic workloads"
test "bls12_381_pairing memory efficiency"
test "bls12_381_pairing execution time bounds"
test "bls12_381_pairing benchmark against reference implementations"
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
test "bls12_381_pairing basic functionality" {
    // This test MUST fail initially
    const input = test_vectors.valid_input;
    const expected = test_vectors.expected_output;
    
    const result = bls12_381_pairing(input);
    try testing.expectEqual(expected, result);
}
```

**Only then implement:**
```zig
pub fn bls12_381_pairing(input: InputType) !OutputType {
    // Minimal implementation to make test pass
    return error.NotImplemented; // Initially
}
```


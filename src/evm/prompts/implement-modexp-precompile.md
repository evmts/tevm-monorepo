# Implement MODEXP Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_modexp_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_modexp_precompile feat_implement_modexp_precompile`
3. **Work in isolation**: `cd g/feat_implement_modexp_precompile`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the MODEXP precompile (address 0x05) for Ethereum Virtual Machine compatibility. This precompile performs modular exponentiation (base^exp % mod) and is crucial for RSA verification and other cryptographic operations. The implementation must handle EIP-2565 gas cost optimizations.

## Relevant Implementation Files

**Primary Files to Modify:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_gas.zig` - Complex gas calculation based on input sizes

**Supporting Files:**
- `/src/evm/precompiles/precompile_addresses.zig` - Address constants
- `/src/evm/precompiles/precompile_result.zig` - Result types for precompile execution

**New Files to Create:**
- `/src/evm/precompiles/modexp.zig` - Modular exponentiation implementation

**Test Files:**
- `/test/evm/precompiles/` (directory) - Precompile test infrastructure
- `/test/evm/precompiles/modexp_test.zig` - MODEXP specific tests

**Why These Files:**
- The main precompile dispatcher needs to route calls to the MODEXP implementation
- Gas calculation is complex for MODEXP as it depends on input sizes and computational complexity
- New implementation file handles efficient modular exponentiation algorithms
- Comprehensive tests ensure EIP-198 and EIP-2565 compliance

## ELI5

Modular exponentiation is like taking a number, raising it to a huge power, but then only keeping the remainder when divided by another number. For example, calculating (5^1000) mod 13 gives you just the remainder. This operation is fundamental to RSA encryption and many other cryptographic systems. Smart contracts use this precompile when they need to verify RSA signatures or perform other advanced mathematical operations that would be too expensive to compute directly in the EVM.

## Ethereum Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000005`
- **Function**: Computes `(base^exp) mod modulus`
- **Available**: Byzantium hardfork onwards
- **Gas Cost**: Complex calculation based on input sizes (EIP-198, EIP-2565)

### Input Format
```
Input format (variable length):
- base_length (32 bytes): Length of base in bytes
- exp_length (32 bytes): Length of exponent in bytes  
- mod_length (32 bytes): Length of modulus in bytes
- base (base_length bytes): Base value
- exp (exp_length bytes): Exponent value
- mod (mod_length bytes): Modulus value
```

### Output Format
- **Success**: mod_length bytes containing result of (base^exp) mod modulus
- **Special Cases**: 
  - If modulus = 0: return 0
  - If modulus = 1: return 0
  - If base = 0 and exp = 0: return 1

## Reference Implementations

### geth

<explanation>
The go-ethereum implementation demonstrates the complete MODEXP precompile pattern with proper EIP-2565 gas calculation, input parsing for variable-length format, and big integer modular exponentiation using the Go crypto/big library. Key aspects include complexity-based gas calculation, overflow protection in size parsing, and special case handling for zero modulus.
</explanation>

**Gas Calculation** - `/go-ethereum/core/vm/contracts.go` (lines 430-471):
```go
func (c *bigModExp) RequiredGas(input []byte) uint64 {
	var (
		baseLen = new(big.Int).SetBytes(getData(input, 0, 32))
		expLen  = new(big.Int).SetBytes(getData(input, 32, 32))
		modLen  = new(big.Int).SetBytes(getData(input, 64, 32))
	)
	if len(input) > 96 {
		input = input[96:]
	} else {
		input = input[:0]
	}
	// Retrieve the head 32 bytes of exp for the adjusted exponent length
	var expHead *big.Int
	if big.NewInt(int64(len(input))).Cmp(baseLen) > 0 {
		if expLen.Cmp(big.NewInt(32)) > 0 {
			expHead = new(big.Int).SetBytes(getData(input, baseLen.Uint64(), 32))
		} else {
			expHead = new(big.Int).SetBytes(getData(input, baseLen.Uint64(), expLen.Uint64()))
		}
	} else {
		expHead = new(big.Int)
	}

	// Calculate the adjusted exponent length
	var msb int
	if bitlen := expHead.BitLen(); bitlen > 0 {
		msb = bitlen - 1
	}
	adjExpLen := new(big.Int)
	if expLen.Cmp(big.NewInt(32)) > 0 {
		adjExpLen.Sub(expLen, big.NewInt(32))
		adjExpLen.Mul(big.NewInt(8), adjExpLen)
	}
	adjExpLen.Add(adjExpLen, big.NewInt(int64(msb)))

	// Calculate the gas cost
	gas := new(big.Int)
	gas.Set(math.BigMax(modLen, baseLen))
	gas.Mul(gas, gas)

	gas.Mul(gas, math.BigMax(adjExpLen, big.NewInt(1)))
	gas.Div(gas, big.NewInt(3))

	if gas.BitLen() > 64 {
		return math.MaxUint64
	}
	return math.Max64(200, gas.Uint64())
}
```

**Execution Logic** - `/go-ethereum/core/vm/contracts.go` (lines 473-510):
```go
func (c *bigModExp) Run(input []byte) ([]byte, error) {
	var (
		baseLen = new(big.Int).SetBytes(getData(input, 0, 32)).Uint64()
		expLen  = new(big.Int).SetBytes(getData(input, 32, 32)).Uint64()
		modLen  = new(big.Int).SetBytes(getData(input, 64, 32)).Uint64()
	)
	if len(input) > 96 {
		input = input[96:]
	} else {
		input = input[:0]
	}
	// Handle a special case when both the base and mod length is zero
	if baseLen == 0 && modLen == 0 {
		return []byte{}, nil
	}
	// Retrieve the operands and execute the exponentiation
	var (
		base = new(big.Int).SetBytes(getData(input, 0, baseLen))
		exp  = new(big.Int).SetBytes(getData(input, baseLen, expLen))
		mod  = new(big.Int).SetBytes(getData(input, baseLen+expLen, modLen))
	)
	if mod.BitLen() == 0 {
		// Modulo 0 is undefined, return zero
		return common.LeftPadBytes([]byte{}, int(modLen)), nil
	}
	return common.LeftPadBytes(base.Exp(base, exp, mod).Bytes(), int(modLen)), nil
}
```

### revm

<explanation>
Revm provides an excellent MODEXP implementation that demonstrates proper EIP-2565 gas calculation and uses an external optimized library (aurora-engine-modexp) for the actual computation. Key patterns:

1. **Hardfork Support**: Different gas calculation functions for Byzantium, Berlin, and Osaka
2. **Gas Calculation**: Sophisticated gas calculation that considers multiplication complexity and iteration count
3. **Input Parsing**: Robust parsing of variable-length input format with proper bounds checking
4. **Size Limits**: EIP-7823 size limits for large inputs in Osaka hardfork
5. **External Library**: Uses aurora-engine-modexp for optimized modular exponentiation

The implementation shows excellent separation between gas calculation logic and actual computation.
</explanation>

**Main Execution** - `/revm/crates/precompile/src/modexp.rs` (lines 62-144):
```rust
/// Run the modexp precompile.
pub fn run_inner<F, const OSAKA: bool>(
    input: &[u8],
    gas_limit: u64,
    min_gas: u64,
    calc_gas: F,
) -> PrecompileResult
where
    F: FnOnce(u64, u64, u64, &U256) -> u64,
{
    // If there is no minimum gas, return error.
    if min_gas > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    // The format of input is:
    // <length_of_BASE> <length_of_EXPONENT> <length_of_MODULUS> <BASE> <EXPONENT> <MODULUS>
    // Where every length is a 32-byte left-padded integer representing the number of bytes
    // to be taken up by the next value.
    const HEADER_LENGTH: usize = 96;

    // Extract the header
    let base_len = U256::from_be_bytes(right_pad_with_offset::<32>(input, 0).into_owned());
    let exp_len = U256::from_be_bytes(right_pad_with_offset::<32>(input, 32).into_owned());
    let mod_len = U256::from_be_bytes(right_pad_with_offset::<32>(input, 64).into_owned());

    // Cast base and modulus to usize, it does not make sense to handle larger values
    let base_len =
        usize::try_from(base_len).map_err(|_| PrecompileError::ModexpEip7823LimitSize)?;
    let mod_len = usize::try_from(mod_len).map_err(|_| PrecompileError::ModexpEip7823LimitSize)?;
    // cast exp len to the max size, it will fail later in gas calculation if it is too large.
    let exp_len = usize::try_from(exp_len).unwrap_or(usize::MAX);

    // for EIP-7823 we need to check size of imputs
    if OSAKA
        && (base_len > eip7823::INPUT_SIZE_LIMIT
            || mod_len > eip7823::INPUT_SIZE_LIMIT
            || exp_len > eip7823::INPUT_SIZE_LIMIT)
    {
        return Err(PrecompileError::ModexpEip7823LimitSize);
    }

    // special case for both base and mod length being 0.
    if base_len == 0 && mod_len == 0 {
        return Ok(PrecompileOutput::new(min_gas, Bytes::new()));
    }

    // Used to extract ADJUSTED_EXPONENT_LENGTH.
    let exp_highp_len = min(exp_len, 32);

    // Throw away the header data as we already extracted lengths.
    let input = input.get(HEADER_LENGTH..).unwrap_or_default();

    let exp_highp = {
        // Get right padded bytes so if data.len is less then exp_len we will get right padded zeroes.
        let right_padded_highp = right_pad_with_offset::<32>(input, base_len);
        // If exp_len is less then 32 bytes get only exp_len bytes and do left padding.
        let out = left_pad::<32>(&right_padded_highp[..exp_highp_len]);
        U256::from_be_bytes(out.into_owned())
    };

    // Check if we have enough gas.
    let gas_cost = calc_gas(base_len as u64, exp_len as u64, mod_len as u64, &exp_highp);
    if gas_cost > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    // Padding is needed if the input does not contain all 3 values.
    let input_len = base_len.saturating_add(exp_len).saturating_add(mod_len);
    let input = right_pad_vec(input, input_len);
    let (base, input) = input.split_at(base_len);
    let (exponent, modulus) = input.split_at(exp_len);
    debug_assert_eq!(modulus.len(), mod_len);

    // Call the modexp.
    let output = modexp(base, exponent, modulus);

    // Left pad the result to modulus length. bytes will always by less or equal to modulus length.
    Ok(PrecompileOutput::new(
        gas_cost,
        left_pad_vec(&output, mod_len).into_owned().into(),
    ))
}
```

**Gas Calculation** - `/revm/crates/precompile/src/modexp.rs` (lines 163-205):
```rust
/// Calculate gas cost according to EIP 2565:
/// <https://eips.ethereum.org/EIPS/eip-2565>
pub fn berlin_gas_calc(base_len: u64, exp_len: u64, mod_len: u64, exp_highp: &U256) -> u64 {
    gas_calc::<200, 8, 3, _>(base_len, exp_len, mod_len, exp_highp, |max_len| -> U256 {
        let words = U256::from(max_len.div_ceil(8));
        words * words
    })
}

/// Calculate gas cost.
pub fn gas_calc<const MIN_PRICE: u64, const MULTIPLIER: u64, const GAS_DIVISOR: u64, F>(
    base_len: u64,
    exp_len: u64,
    mod_len: u64,
    exp_highp: &U256,
    calculate_multiplication_complexity: F,
) -> u64
where
    F: Fn(u64) -> U256,
{
    let multiplication_complexity = calculate_multiplication_complexity(max(base_len, mod_len));
    let iteration_count = calculate_iteration_count::<MULTIPLIER>(exp_len, exp_highp);
    let gas = (multiplication_complexity * U256::from(iteration_count)) / U256::from(GAS_DIVISOR);
    max(MIN_PRICE, gas.saturating_to())
}
```

**Iteration Count Calculation** - `/revm/crates/precompile/src/modexp.rs` (lines 46-60):
```rust
/// Calculate the iteration count for the modexp precompile.
pub fn calculate_iteration_count<const MULTIPLIER: u64>(exp_length: u64, exp_highp: &U256) -> u64 {
    let mut iteration_count: u64 = 0;

    if exp_length <= 32 && exp_highp.is_zero() {
        iteration_count = 0;
    } else if exp_length <= 32 {
        iteration_count = exp_highp.bit_len() as u64 - 1;
    } else if exp_length > 32 {
        iteration_count = (MULTIPLIER.saturating_mul(exp_length - 32))
            .saturating_add(max(1, exp_highp.bit_len() as u64) - 1);
    }

    max(iteration_count, 1)
}
```

### EIP Specifications
- **EIP-198**: Original MODEXP precompile specification
- **EIP-2565**: Gas cost optimization (reduced costs for common cases)

## Implementation Requirements

### Core Functionality
1. **Input Parsing**: Parse variable-length input format
2. **Big Integer Arithmetic**: Handle arbitrary precision integers
3. **Modular Exponentiation**: Efficient computation using square-and-multiply
4. **Gas Calculation**: Complex gas cost based on input sizes and exponent
5. **Edge Case Handling**: Special mathematical cases

### Gas Calculation (EIP-2565)
```zig
fn calculate_modexp_gas(base_len: usize, exp_len: usize, mod_len: usize, exp_bytes: []const u8) u64 {
    // Calculate multiplication complexity
    const max_len = @max(@max(base_len, exp_len), mod_len);
    const multiplication_complexity = calculate_multiplication_complexity(max_len);
    
    // Calculate iteration count based on exponent
    const iteration_count = calculate_iteration_count(exp_len, exp_bytes);
    
    // Gas cost = max(200, multiplication_complexity * iteration_count / 3)
    const calculated_gas = (multiplication_complexity * iteration_count) / 3;
    return @max(200, calculated_gas);
}

fn calculate_multiplication_complexity(max_len: usize) u64 {
    if (max_len <= 64) {
        return max_len * max_len;
    } else if (max_len <= 1024) {
        return (max_len * max_len) / 4 + 96 * max_len - 3072;
    } else {
        return (max_len * max_len) / 16 + 480 * max_len - 199680;
    }
}

fn calculate_iteration_count(exp_len: usize, exp_bytes: []const u8) u64 {
    if (exp_len <= 32 and exp_bytes.len > 0) {
        // For small exponents, count actual bits
        const exp_value = bytes_to_u256(exp_bytes);
        if (exp_value == 0) return 0;
        
        // Count bits in exponent
        return 256 - @clz(exp_value);
    } else {
        // For large exponents, use approximation
        const adjusted_exp_len = if (exp_len <= 32) exp_len else exp_len - 32;
        return @max(1, adjusted_exp_len * 8);
    }
}
```

## Implementation Tasks

### Task 1: Add MODEXP Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// MODEXP precompile constants
pub const MODEXP_MIN_GAS: u64 = 200;
pub const MODEXP_QUADRATIC_THRESHOLD: usize = 64;
pub const MODEXP_LINEAR_THRESHOLD: usize = 1024;
```

### Task 2: Implement Big Integer Support
File: `/src/evm/crypto/big_integer.zig`
```zig
const std = @import("std");

pub const BigInteger = struct {
    limbs: []u64,
    len: usize,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator, capacity: usize) !BigInteger {
        const limb_count = (capacity + 7) / 8; // 8 bytes per limb
        const limbs = try allocator.alloc(u64, limb_count);
        @memset(limbs, 0);
        
        return BigInteger{
            .limbs = limbs,
            .len = 0,
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *BigInteger) void {
        self.allocator.free(self.limbs);
    }
    
    pub fn from_bytes(allocator: std.mem.Allocator, bytes: []const u8) !BigInteger {
        var big_int = try BigInteger.init(allocator, bytes.len);
        try big_int.set_from_bytes(bytes);
        return big_int;
    }
    
    pub fn set_from_bytes(self: *BigInteger, bytes: []const u8) !void {
        // Convert big-endian bytes to limbs
        var i: usize = bytes.len;
        var limb_index: usize = 0;
        
        while (i > 0 and limb_index < self.limbs.len) {
            var limb: u64 = 0;
            var byte_count: usize = 0;
            
            while (byte_count < 8 and i > 0) {
                i -= 1;
                limb |= (@as(u64, bytes[i]) << @intCast(byte_count * 8));
                byte_count += 1;
            }
            
            self.limbs[limb_index] = limb;
            limb_index += 1;
        }
        
        self.len = limb_index;
    }
    
    pub fn to_bytes(self: *const BigInteger, output: []u8) void {
        @memset(output, 0);
        
        var byte_index: usize = output.len;
        for (self.limbs[0..self.len]) |limb| {
            var current_limb = limb;
            var byte_count: usize = 0;
            
            while (byte_count < 8 and byte_index > 0) {
                byte_index -= 1;
                output[byte_index] = @intCast(current_limb & 0xFF);
                current_limb >>= 8;
                byte_count += 1;
            }
            
            if (byte_index == 0) break;
        }
    }
    
    // Modular exponentiation using square-and-multiply
    pub fn mod_exp(base: *const BigInteger, exp: *const BigInteger, modulus: *const BigInteger, allocator: std.mem.Allocator) !BigInteger {
        // Handle special cases
        if (modulus.is_zero()) {
            return BigInteger.init(allocator, 1);
        }
        
        if (modulus.is_one()) {
            return BigInteger.init(allocator, 1);
        }
        
        // Montgomery ladder or square-and-multiply algorithm
        return square_and_multiply(base, exp, modulus, allocator);
    }
    
    fn square_and_multiply(base: *const BigInteger, exp: *const BigInteger, modulus: *const BigInteger, allocator: std.mem.Allocator) !BigInteger {
        var result = try BigInteger.from_value(allocator, 1);
        var base_copy = try base.clone(allocator);
        defer result.deinit();
        defer base_copy.deinit();
        
        // Iterate through exponent bits
        for (exp.limbs[0..exp.len]) |limb| {
            var bit_mask: u64 = 1;
            while (bit_mask != 0) {
                if (limb & bit_mask != 0) {
                    try result.mul_mod(&base_copy, modulus);
                }
                try base_copy.square_mod(modulus);
                bit_mask <<= 1;
            }
        }
        
        return result;
    }
    
    // Additional methods: add_mod, mul_mod, square_mod, is_zero, is_one, etc.
};
```

### Task 3: Implement MODEXP Precompile
File: `/src/evm/precompiles/modexp.zig`
```zig
const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const BigInteger = @import("../crypto/big_integer.zig").BigInteger;

pub fn calculate_gas(input: []const u8) u64 {
    if (input.len < 96) {
        // Invalid input format
        return gas_constants.MODEXP_MIN_GAS;
    }
    
    // Parse input lengths
    const base_len = bytes_to_usize(input[0..32]);
    const exp_len = bytes_to_usize(input[32..64]);
    const mod_len = bytes_to_usize(input[64..96]);
    
    // Calculate expected input size
    const expected_len = 96 + base_len + exp_len + mod_len;
    if (input.len < expected_len) {
        return gas_constants.MODEXP_MIN_GAS;
    }
    
    // Extract exponent bytes for gas calculation
    const exp_start = 96 + base_len;
    const exp_bytes = if (exp_len > 0 and exp_start + exp_len <= input.len)
        input[exp_start..exp_start + exp_len]
    else
        &[_]u8{};
    
    // Calculate gas using EIP-2565 formula
    return calculate_modexp_gas(base_len, exp_len, mod_len, exp_bytes);
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64, allocator: std.mem.Allocator) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    
    // Validate minimum input size
    if (input.len < 96) {
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
    }
    
    // Parse input parameters
    const base_len = bytes_to_usize(input[0..32]);
    const exp_len = bytes_to_usize(input[32..64]);
    const mod_len = bytes_to_usize(input[64..96]);
    
    // Validate input size
    const expected_len = 96 + base_len + exp_len + mod_len;
    if (input.len < expected_len) {
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
    }
    
    // Validate output size
    if (output.len < mod_len) {
        return PrecompileError.InvalidOutput;
    }
    
    // Extract input components
    const base_start = 96;
    const exp_start = base_start + base_len;
    const mod_start = exp_start + exp_len;
    
    const base_bytes = if (base_len > 0) input[base_start..base_start + base_len] else &[_]u8{};
    const exp_bytes = if (exp_len > 0) input[exp_start..exp_start + exp_len] else &[_]u8{};
    const mod_bytes = if (mod_len > 0) input[mod_start..mod_start + mod_len] else &[_]u8{};
    
    // Handle special case: modulus = 0
    if (mod_len == 0 or is_zero_bytes(mod_bytes)) {
        @memset(output[0..mod_len], 0);
        return PrecompileResult{ .gas_used = gas_cost, .output_size = mod_len };
    }
    
    // Create big integers
    var base = BigInteger.from_bytes(allocator, base_bytes) catch {
        return PrecompileError.OutOfMemory;
    };
    defer base.deinit();
    
    var exp = BigInteger.from_bytes(allocator, exp_bytes) catch {
        return PrecompileError.OutOfMemory;
    };
    defer exp.deinit();
    
    var modulus = BigInteger.from_bytes(allocator, mod_bytes) catch {
        return PrecompileError.OutOfMemory;
    };
    defer modulus.deinit();
    
    // Perform modular exponentiation
    var result = BigInteger.mod_exp(&base, &exp, &modulus, allocator) catch {
        return PrecompileError.OutOfMemory;
    };
    defer result.deinit();
    
    // Convert result to bytes
    result.to_bytes(output[0..mod_len]);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = mod_len };
}

fn bytes_to_usize(bytes: []const u8) usize {
    var result: usize = 0;
    for (bytes) |byte| {
        result = (result << 8) | byte;
    }
    return result;
}

fn is_zero_bytes(bytes: []const u8) bool {
    for (bytes) |byte| {
        if (byte != 0) return false;
    }
    return true;
}

fn calculate_modexp_gas(base_len: usize, exp_len: usize, mod_len: usize, exp_bytes: []const u8) u64 {
    // EIP-2565 gas calculation
    const max_len = @max(@max(base_len, exp_len), mod_len);
    const multiplication_complexity = calculate_multiplication_complexity(max_len);
    const iteration_count = calculate_iteration_count(exp_len, exp_bytes);
    
    const calculated_gas = (multiplication_complexity * iteration_count) / 3;
    return @max(gas_constants.MODEXP_MIN_GAS, calculated_gas);
}

fn calculate_multiplication_complexity(max_len: usize) u64 {
    const len = @as(u64, @intCast(max_len));
    
    if (max_len <= gas_constants.MODEXP_QUADRATIC_THRESHOLD) {
        return len * len;
    } else if (max_len <= gas_constants.MODEXP_LINEAR_THRESHOLD) {
        return (len * len) / 4 + 96 * len - 3072;
    } else {
        return (len * len) / 16 + 480 * len - 199680;
    }
}

fn calculate_iteration_count(exp_len: usize, exp_bytes: []const u8) u64 {
    if (exp_len <= 32 and exp_bytes.len > 0) {
        // Calculate based on actual exponent value
        var exp_value: u256 = 0;
        for (exp_bytes) |byte| {
            exp_value = (exp_value << 8) | byte;
        }
        
        if (exp_value == 0) return 0;
        
        // Count bits in exponent
        return @as(u64, @intCast(256 - @clz(exp_value)));
    } else {
        // For large exponents, use approximation
        const adjusted_exp_len = if (exp_len <= 32) exp_len else exp_len - 32;
        return @max(1, @as(u64, @intCast(adjusted_exp_len * 8)));
    }
}
```

### Task 4: Update Precompile System
File: `/src/evm/precompiles/precompiles.zig` (modify existing)
Add MODEXP to the precompile dispatcher.

File: `/src/evm/precompiles/precompile_addresses.zig` (modify existing)
```zig
pub const MODEXP_ADDRESS: u8 = 0x05;
```

### Task 5: Comprehensive Testing
File: `/test/evm/precompiles/modexp_test.zig`

### Test Cases
```zig
test "modexp basic functionality" {
    // Test simple cases: 2^3 mod 5 = 3
    // Test: 5^10 mod 13 = 12
    // Test known test vectors from Ethereum test suite
}

test "modexp special cases" {
    // Test modulus = 0 (should return 0)
    // Test modulus = 1 (should return 0)
    // Test base = 0, exp = 0 (should return 1)
    // Test base = 0, exp > 0 (should return 0)
}

test "modexp gas calculation" {
    // Test EIP-2565 gas costs
    // Compare with reference implementations
    // Test edge cases in gas calculation
}

test "modexp large numbers" {
    // Test with 2048-bit numbers
    // Test performance with very large exponents
    // Test memory usage patterns
}

test "modexp integration" {
    // Test via CALL opcode
    // Test return data handling
    // Test gas consumption in VM context
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/precompiles/modexp.zig` - New MODEXP implementation
- `/src/evm/crypto/big_integer.zig` - New big integer arithmetic
- `/src/evm/precompiles/precompiles.zig` - Add MODEXP to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add MODEXP address
- `/src/evm/constants/gas_constants.zig` - Add MODEXP gas constants
- `/test/evm/precompiles/modexp_test.zig` - Comprehensive tests

### Build System
Ensure big integer arithmetic doesn't significantly impact WASM bundle size.

## Performance Considerations

### Big Integer Optimization
```zig
// Use efficient algorithms for large numbers
pub const ModExpOptimizations = struct {
    // Montgomery multiplication for repeated modular operations
    pub fn montgomery_mod_exp(base: *const BigInteger, exp: *const BigInteger, modulus: *const BigInteger) !BigInteger {
        // Convert to Montgomery form
        // Perform exponentiation in Montgomery space
        // Convert back to normal form
    }
    
    // Sliding window exponentiation for large exponents
    pub fn sliding_window_mod_exp(base: *const BigInteger, exp: *const BigInteger, modulus: *const BigInteger) !BigInteger {
        // Use sliding window algorithm to reduce multiplications
    }
    
    // Karatsuba multiplication for very large numbers
    pub fn karatsuba_multiply(a: *const BigInteger, b: *const BigInteger) !BigInteger {
        // Implement Karatsuba algorithm for O(n^1.585) multiplication
    }
};
```

### Memory Management
- **Temporary Allocation**: Minimize temporary big integer allocations
- **Reuse Buffers**: Reuse computation buffers where possible
- **Stack vs Heap**: Use stack allocation for small operations

### Gas Cost Optimization
- **Early Termination**: Return early for expensive operations
- **Precision**: Use exact gas calculations to avoid overcharging
- **Caching**: Cache multiplication complexity calculations

## Security Considerations

### Input Validation
```zig
// Validate input sizes to prevent DoS
const MAX_INPUT_SIZE = 1024 * 1024; // 1MB limit

fn validate_modexp_input(base_len: usize, exp_len: usize, mod_len: usize) bool {
    // Prevent extremely large inputs
    if (base_len > MAX_INPUT_SIZE) return false;
    if (exp_len > MAX_INPUT_SIZE) return false;
    if (mod_len > MAX_INPUT_SIZE) return false;
    
    // Prevent integer overflow in size calculations
    const total_size = base_len + exp_len + mod_len;
    if (total_size < base_len) return false; // Overflow check
    
    return true;
}
```

### Constant-Time Operations
- **Side-Channel Resistance**: Implement constant-time big integer operations where possible
- **Branch-Free Code**: Avoid data-dependent branches in crypto operations
- **Memory Access Patterns**: Consistent memory access to prevent cache timing attacks

## Complex Test Cases

### Edge Cases
```zig
test "modexp edge cases" {
    // Very large numbers (2048+ bits)
    // Exponent with many trailing zeros
    // Modulus with special mathematical properties
    // Maximum gas consumption scenarios
}
```

### Fuzzing Targets
```zig
test "modexp fuzzing" {
    // Random input generation
    // Property-based testing
    // Cross-reference with reference implementations
    // Performance regression testing
}
```

## Success Criteria

1. **Ethereum Compatibility**: Matches reference implementation results exactly
2. **EIP-2565 Compliance**: Correct gas cost calculation per specification
3. **Performance**: Efficient for both small and large number operations
4. **Memory Safety**: No buffer overflows or memory leaks
5. **Security**: Resistant to timing attacks and DoS attempts
6. **Test Coverage**: Comprehensive test suite including edge cases

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Implement big integer arithmetic correctly** - Mathematical correctness is critical
3. **Follow EIP-2565 gas costs exactly** - Must match specification precisely
4. **Handle all edge cases** - Zero values, large numbers, special moduli
5. **Optimize for WASM bundle size** - Big integer code can be large
6. **Test with Ethereum test vectors** - Use official test suite for validation

## References

- [EIP-198: Big integer modular exponentiation](https://eips.ethereum.org/EIPS/eip-198)
- [EIP-2565: ModExp Gas Cost](https://eips.ethereum.org/EIPS/eip-2565)
- [Montgomery Modular Multiplication](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication)
- [Handbook of Applied Cryptography](http://cacr.uwaterloo.ca/hac/) - Chapter 14
- [Ethereum Test Vectors](https://github.com/ethereum/tests)

## Reference Implementations

### revm

<explanation>
Revm provides an excellent MODEXP implementation that demonstrates proper EIP-2565 gas calculation and uses an external optimized library (aurora-engine-modexp) for the actual computation. Key patterns:

1. **Hardfork Support**: Different gas calculation functions for Byzantium, Berlin, and Osaka
2. **Gas Calculation**: Sophisticated gas calculation that considers multiplication complexity and iteration count
3. **Input Parsing**: Robust parsing of variable-length input format with proper bounds checking
4. **Size Limits**: EIP-7823 size limits for large inputs in Osaka hardfork
5. **External Library**: Uses aurora-engine-modexp for optimized modular exponentiation

The implementation shows excellent separation between gas calculation logic and actual computation.
</explanation>

<filename>revm/crates/precompile/src/modexp.rs</filename>
<line start="62" end="144">
```rust
/// Run the modexp precompile.
pub fn run_inner<F, const OSAKA: bool>(
    input: &[u8],
    gas_limit: u64,
    min_gas: u64,
    calc_gas: F,
) -> PrecompileResult
where
    F: FnOnce(u64, u64, u64, &U256) -> u64,
{
    // If there is no minimum gas, return error.
    if min_gas > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    // The format of input is:
    // <length_of_BASE> <length_of_EXPONENT> <length_of_MODULUS> <BASE> <EXPONENT> <MODULUS>
    // Where every length is a 32-byte left-padded integer representing the number of bytes
    // to be taken up by the next value.
    const HEADER_LENGTH: usize = 96;

    // Extract the header
    let base_len = U256::from_be_bytes(right_pad_with_offset::<32>(input, 0).into_owned());
    let exp_len = U256::from_be_bytes(right_pad_with_offset::<32>(input, 32).into_owned());
    let mod_len = U256::from_be_bytes(right_pad_with_offset::<32>(input, 64).into_owned());

    // Cast base and modulus to usize, it does not make sense to handle larger values
    let base_len =
        usize::try_from(base_len).map_err(|_| PrecompileError::ModexpEip7823LimitSize)?;
    let mod_len = usize::try_from(mod_len).map_err(|_| PrecompileError::ModexpEip7823LimitSize)?;
    // cast exp len to the max size, it will fail later in gas calculation if it is too large.
    let exp_len = usize::try_from(exp_len).unwrap_or(usize::MAX);

    // for EIP-7823 we need to check size of imputs
    if OSAKA
        && (base_len > eip7823::INPUT_SIZE_LIMIT
            || mod_len > eip7823::INPUT_SIZE_LIMIT
            || exp_len > eip7823::INPUT_SIZE_LIMIT)
    {
        return Err(PrecompileError::ModexpEip7823LimitSize);
    }

    // special case for both base and mod length being 0.
    if base_len == 0 && mod_len == 0 {
        return Ok(PrecompileOutput::new(min_gas, Bytes::new()));
    }

    // Used to extract ADJUSTED_EXPONENT_LENGTH.
    let exp_highp_len = min(exp_len, 32);

    // Throw away the header data as we already extracted lengths.
    let input = input.get(HEADER_LENGTH..).unwrap_or_default();

    let exp_highp = {
        // Get right padded bytes so if data.len is less then exp_len we will get right padded zeroes.
        let right_padded_highp = right_pad_with_offset::<32>(input, base_len);
        // If exp_len is less then 32 bytes get only exp_len bytes and do left padding.
        let out = left_pad::<32>(&right_padded_highp[..exp_highp_len]);
        U256::from_be_bytes(out.into_owned())
    };

    // Check if we have enough gas.
    let gas_cost = calc_gas(base_len as u64, exp_len as u64, mod_len as u64, &exp_highp);
    if gas_cost > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    // Padding is needed if the input does not contain all 3 values.
    let input_len = base_len.saturating_add(exp_len).saturating_add(mod_len);
    let input = right_pad_vec(input, input_len);
    let (base, input) = input.split_at(base_len);
    let (exponent, modulus) = input.split_at(exp_len);
    debug_assert_eq!(modulus.len(), mod_len);

    // Call the modexp.
    let output = modexp(base, exponent, modulus);

    // Left pad the result to modulus length. bytes will always by less or equal to modulus length.
    Ok(PrecompileOutput::new(
        gas_cost,
        left_pad_vec(&output, mod_len).into_owned().into(),
    ))
}
```
</line>

<filename>revm/crates/precompile/src/modexp.rs</filename>
<line start="163" end="188">
```rust
/// Calculate gas cost according to EIP 2565:
/// <https://eips.ethereum.org/EIPS/eip-2565>
pub fn berlin_gas_calc(base_len: u64, exp_len: u64, mod_len: u64, exp_highp: &U256) -> u64 {
    gas_calc::<200, 8, 3, _>(base_len, exp_len, mod_len, exp_highp, |max_len| -> U256 {
        let words = U256::from(max_len.div_ceil(8));
        words * words
    })
}

/// Calculate gas cost according to EIP-7883:
/// <https://eips.ethereum.org/EIPS/eip-7883>
///
/// There are three changes:
/// 1. Increase minimal price from 200 to 500
/// 2. Increase cost when exponent is larger than 32 bytes
/// 3. Increase cost when base or modulus is larger than 32 bytes
pub fn osaka_gas_calc(base_len: u64, exp_len: u64, mod_len: u64, exp_highp: &U256) -> u64 {
    gas_calc::<500, 16, 3, _>(base_len, exp_len, mod_len, exp_highp, |max_len| -> U256 {
        let words = U256::from(max_len.div_ceil(8));
        let words_square = words * words;
        if max_len > 32 {
            return words_square * U256::from(2);
        }
        words_square
    })
}
```
</line>

<filename>revm/crates/precompile/src/modexp.rs</filename>
<line start="190" end="205">
```rust
/// Calculate gas cost.
pub fn gas_calc<const MIN_PRICE: u64, const MULTIPLIER: u64, const GAS_DIVISOR: u64, F>(
    base_len: u64,
    exp_len: u64,
    mod_len: u64,
    exp_highp: &U256,
    calculate_multiplication_complexity: F,
) -> u64
where
    F: Fn(u64) -> U256,
{
    let multiplication_complexity = calculate_multiplication_complexity(max(base_len, mod_len));
    let iteration_count = calculate_iteration_count::<MULTIPLIER>(exp_len, exp_highp);
    let gas = (multiplication_complexity * U256::from(iteration_count)) / U256::from(GAS_DIVISOR);
    max(MIN_PRICE, gas.saturating_to())
}
```
</line>

<filename>revm/crates/precompile/src/modexp.rs</filename>
<line start="46" end="60">
```rust
/// Calculate the iteration count for the modexp precompile.
pub fn calculate_iteration_count<const MULTIPLIER: u64>(exp_length: u64, exp_highp: &U256) -> u64 {
    let mut iteration_count: u64 = 0;

    if exp_length <= 32 && exp_highp.is_zero() {
        iteration_count = 0;
    } else if exp_length <= 32 {
        iteration_count = exp_highp.bit_len() as u64 - 1;
    } else if exp_length > 32 {
        iteration_count = (MULTIPLIER.saturating_mul(exp_length - 32))
            .saturating_add(max(1, exp_highp.bit_len() as u64) - 1);
    }

    max(iteration_count, 1)
}
```
</line>
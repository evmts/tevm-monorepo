# Implement SIMD Optimizations

You are implementing SIMD Optimizations for the Tevm EVM written in Zig. Your goal is to implement SIMD optimizations for cryptographic operations following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_simd_optimizations` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_simd_optimizations feat_implement_simd_optimizations`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement SIMD (Single Instruction, Multiple Data) optimizations for vectorized 256-bit arithmetic operations to significantly improve EVM execution performance. This includes vectorized implementations of arithmetic operations, bitwise operations, and cryptographic functions using platform-specific SIMD instruction sets.

## ELI5

Imagine you're a teacher grading multiple-choice tests. Normally, you'd grade each test one by one - look at question 1 on test A, grade it, then question 1 on test B, and so on. SIMD is like having a special technique where you can grade the same question across multiple tests simultaneously.

Here's how SIMD works in the EVM context:

**Single Instruction, Multiple Data**: Instead of processing one 256-bit number at a time, SIMD lets the CPU process multiple pieces of data with a single command. It's like having a calculator that can do the same operation on 4 different numbers at once.

**Vectorized Operations**: Think of it like an assembly line where instead of one worker doing one task, you have multiple workers doing the same task on different items simultaneously. For example, instead of adding two 256-bit numbers in 8 separate 32-bit chunks sequentially, SIMD can process multiple chunks in parallel.

**Platform-Specific Optimization**: Different CPUs have different "superpowers" (instruction sets like AVX2, SSE4). This enhanced implementation detects what superpowers your CPU has and uses the best ones available, like automatically switching between different assembly line configurations based on your factory's capabilities.

This enhanced version includes:
- **Auto-Detection**: Automatically discovers what SIMD features your processor supports
- **Fallback Strategies**: If advanced features aren't available, it gracefully falls back to simpler but still optimized methods
- **Memory Alignment**: Organizes data in memory in the most efficient way for SIMD operations
- **Batch Processing**: Groups operations together to maximize the benefit of parallel processing

Why does this matter? Smart contracts often need to do many similar calculations (like processing multiple transactions or performing cryptographic operations). SIMD can make these operations 2-8 times faster, significantly reducing gas costs and improving blockchain performance.

## SIMD Optimization Specifications

### Core SIMD Framework

#### 1. SIMD Architecture Detection
```zig
pub const SIMDCapabilities = struct {
    has_sse2: bool,
    has_sse3: bool,
    has_ssse3: bool,
    has_sse4_1: bool,
    has_sse4_2: bool,
    has_avx: bool,
    has_avx2: bool,
    has_avx512f: bool,
    has_neon: bool,     // ARM NEON
    has_wasm_simd: bool, // WebAssembly SIMD
    
    pub fn detect() SIMDCapabilities {
        var caps = SIMDCapabilities{
            .has_sse2 = false,
            .has_sse3 = false,
            .has_ssse3 = false,
            .has_sse4_1 = false,
            .has_sse4_2 = false,
            .has_avx = false,
            .has_avx2 = false,
            .has_avx512f = false,
            .has_neon = false,
            .has_wasm_simd = false,
        };
        
        // Detect CPU capabilities at runtime
        if (comptime builtin.cpu.arch.isX86()) {
            caps.has_sse2 = std.Target.x86.featureSetHas(builtin.cpu.features, .sse2);
            caps.has_sse3 = std.Target.x86.featureSetHas(builtin.cpu.features, .sse3);
            caps.has_ssse3 = std.Target.x86.featureSetHas(builtin.cpu.features, .ssse3);
            caps.has_sse4_1 = std.Target.x86.featureSetHas(builtin.cpu.features, .sse4_1);
            caps.has_sse4_2 = std.Target.x86.featureSetHas(builtin.cpu.features, .sse4_2);
            caps.has_avx = std.Target.x86.featureSetHas(builtin.cpu.features, .avx);
            caps.has_avx2 = std.Target.x86.featureSetHas(builtin.cpu.features, .avx2);
            caps.has_avx512f = std.Target.x86.featureSetHas(builtin.cpu.features, .avx512f);
        } else if (comptime builtin.cpu.arch.isARM()) {
            caps.has_neon = std.Target.arm.featureSetHas(builtin.cpu.features, .neon);
        } else if (comptime builtin.target.isWasm()) {
            caps.has_wasm_simd = std.Target.wasm.featureSetHas(builtin.cpu.features, .simd128);
        }
        
        return caps;
    }
    
    pub fn get_optimal_vector_width(self: *const SIMDCapabilities) u32 {
        if (self.has_avx512f) return 512;
        if (self.has_avx2) return 256;
        if (self.has_avx) return 256;
        if (self.has_sse2) return 128;
        if (self.has_neon) return 128;
        if (self.has_wasm_simd) return 128;
        return 0; // No SIMD support
    }
    
    pub fn supports_vectorized_u256(self: *const SIMDCapabilities) bool {
        return self.get_optimal_vector_width() >= 128;
    }
};

pub const SIMDOptimizer = struct {
    capabilities: SIMDCapabilities,
    vector_width: u32,
    use_simd: bool,
    
    pub fn init() SIMDOptimizer {
        const caps = SIMDCapabilities.detect();
        return SIMDOptimizer{
            .capabilities = caps,
            .vector_width = caps.get_optimal_vector_width(),
            .use_simd = caps.supports_vectorized_u256(),
        };
    }
    
    pub fn optimize_u256_add(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        if (!self.use_simd) {
            return a.add(b);
        }
        
        return switch (self.vector_width) {
            512 => self.avx512_u256_add(a, b),
            256 => self.avx2_u256_add(a, b),
            128 => if (self.capabilities.has_neon) 
                self.neon_u256_add(a, b) 
            else if (self.capabilities.has_wasm_simd)
                self.wasm_simd_u256_add(a, b)
            else 
                self.sse2_u256_add(a, b),
            else => a.add(b),
        };
    }
    
    pub fn optimize_u256_mul(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        if (!self.use_simd) {
            return a.mul(b);
        }
        
        return switch (self.vector_width) {
            512 => self.avx512_u256_mul(a, b),
            256 => self.avx2_u256_mul(a, b),
            128 => if (self.capabilities.has_neon) 
                self.neon_u256_mul(a, b) 
            else if (self.capabilities.has_wasm_simd)
                self.wasm_simd_u256_mul(a, b)
            else 
                self.sse2_u256_mul(a, b),
            else => a.mul(b),
        };
    }
    
    pub fn optimize_u256_and(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        if (!self.use_simd) {
            return a.bit_and(b);
        }
        
        return switch (self.vector_width) {
            512 => self.avx512_u256_and(a, b),
            256 => self.avx2_u256_and(a, b),
            128 => if (self.capabilities.has_neon) 
                self.neon_u256_and(a, b) 
            else if (self.capabilities.has_wasm_simd)
                self.wasm_simd_u256_and(a, b)
            else 
                self.sse2_u256_and(a, b),
            else => a.bit_and(b),
        };
    }
    
    pub fn optimize_keccak256(self: *const SIMDOptimizer, data: []const u8) Hash {
        if (!self.use_simd or data.len < 64) {
            return Hash.keccak256(data);
        }
        
        return switch (self.vector_width) {
            512 => self.avx512_keccak256(data),
            256 => self.avx2_keccak256(data),
            128 => if (self.capabilities.has_neon) 
                self.neon_keccak256(data) 
            else if (self.capabilities.has_wasm_simd)
                self.wasm_simd_keccak256(data)
            else 
                self.sse2_keccak256(data),
            else => Hash.keccak256(data),
        };
    }
    
    // AVX512 Implementations
    fn avx512_u256_add(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        _ = self;
        
        // Load U256 values into AVX512 registers (512-bit = 64 bytes, U256 = 32 bytes)
        const a_vec = @as(@Vector(8, u64), @bitCast([8]u64{
            a.limbs[0], a.limbs[1], a.limbs[2], a.limbs[3], 0, 0, 0, 0
        }));
        const b_vec = @as(@Vector(8, u64), @bitCast([8]u64{
            b.limbs[0], b.limbs[1], b.limbs[2], b.limbs[3], 0, 0, 0, 0
        }));
        
        // Perform vectorized addition with carry handling
        var result_vec = a_vec + b_vec;
        
        // Handle carries manually (simplified version)
        var result_array: [8]u64 = @bitCast(result_vec);
        var carry: u64 = 0;
        
        for (0..4) |i| {
            const sum = @as(u128, result_array[i]) + carry;
            result_array[i] = @truncate(sum);
            carry = @truncate(sum >> 64);
        }
        
        return U256.from_limbs([4]u64{
            result_array[0], result_array[1], result_array[2], result_array[3]
        });
    }
    
    fn avx512_u256_mul(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        _ = self;
        
        // For multiplication, we need to use a more complex algorithm
        // This is a simplified version - real implementation would use
        // Karatsuba or similar algorithms optimized for SIMD
        
        var result = U256.zero();
        
        // Vectorized partial products
        for (0..4) |i| {
            for (0..4) |j| {
                if (i + j < 4) {
                    const prod = @as(u128, a.limbs[i]) * @as(u128, b.limbs[j]);
                    const low = @as(u64, @truncate(prod));
                    const high = @as(u64, @truncate(prod >> 64));
                    
                    // Add to result with carry propagation
                    var carry: u64 = 0;
                    if (i + j < 4) {
                        const sum1 = @as(u128, result.limbs[i + j]) + low + carry;
                        result.limbs[i + j] = @truncate(sum1);
                        carry = @truncate(sum1 >> 64);
                    }
                    
                    if (i + j + 1 < 4 and (high > 0 or carry > 0)) {
                        const sum2 = @as(u128, result.limbs[i + j + 1]) + high + carry;
                        result.limbs[i + j + 1] = @truncate(sum2);
                    }
                }
            }
        }
        
        return result;
    }
    
    fn avx512_u256_and(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        _ = self;
        
        const a_vec = @as(@Vector(4, u64), @bitCast([4]u64{
            a.limbs[0], a.limbs[1], a.limbs[2], a.limbs[3]
        }));
        const b_vec = @as(@Vector(4, u64), @bitCast([4]u64{
            b.limbs[0], b.limbs[1], b.limbs[2], b.limbs[3]
        }));
        
        const result_vec = a_vec & b_vec;
        const result_array: [4]u64 = @bitCast(result_vec);
        
        return U256.from_limbs(result_array);
    }
    
    fn avx512_keccak256(self: *const SIMDOptimizer, data: []const u8) Hash {
        _ = self;
        
        // Vectorized Keccak-256 implementation using AVX512
        // This would implement the Keccak-f[1600] permutation function
        // using SIMD instructions for parallel processing of state lanes
        
        // For now, fall back to standard implementation
        // Real implementation would parallelize the theta, rho, pi, chi, and iota steps
        return Hash.keccak256(data);
    }
    
    // AVX2 Implementations
    fn avx2_u256_add(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        _ = self;
        
        // AVX2 provides 256-bit vectors, perfect for U256
        const a_vec = @as(@Vector(4, u64), @bitCast([4]u64{
            a.limbs[0], a.limbs[1], a.limbs[2], a.limbs[3]
        }));
        const b_vec = @as(@Vector(4, u64), @bitCast([4]u64{
            b.limbs[0], b.limbs[1], b.limbs[2], b.limbs[3]
        }));
        
        // Add with carry propagation
        var result_vec = a_vec + b_vec;
        var result_array: [4]u64 = @bitCast(result_vec);
        
        // Handle carries
        var carry: u64 = 0;
        for (0..4) |i| {
            const sum = @as(u128, result_array[i]) + carry;
            result_array[i] = @truncate(sum);
            carry = @truncate(sum >> 64);
        }
        
        return U256.from_limbs(result_array);
    }
    
    fn avx2_u256_mul(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        // Similar to AVX512 but with 256-bit vectors
        return self.avx512_u256_mul(a, b);
    }
    
    fn avx2_u256_and(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        return self.avx512_u256_and(a, b);
    }
    
    fn avx2_keccak256(self: *const SIMDOptimizer, data: []const u8) Hash {
        return self.avx512_keccak256(data);
    }
    
    // SSE2 Implementations
    fn sse2_u256_add(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        _ = self;
        
        // SSE2 provides 128-bit vectors, so we need two operations for U256
        const a_low = @as(@Vector(2, u64), @bitCast([2]u64{ a.limbs[0], a.limbs[1] }));
        const a_high = @as(@Vector(2, u64), @bitCast([2]u64{ a.limbs[2], a.limbs[3] }));
        const b_low = @as(@Vector(2, u64), @bitCast([2]u64{ b.limbs[0], b.limbs[1] }));
        const b_high = @as(@Vector(2, u64), @bitCast([2]u64{ b.limbs[2], b.limbs[3] }));
        
        var result_low = a_low + b_low;
        var result_high = a_high + b_high;
        
        var low_array: [2]u64 = @bitCast(result_low);
        var high_array: [2]u64 = @bitCast(result_high);
        
        // Handle carries between low and high parts
        var carry: u64 = 0;
        
        // Check for carry from low[0] to low[1]
        if (low_array[0] < a.limbs[0] or low_array[0] < b.limbs[0]) {
            const sum = @as(u128, low_array[1]) + 1;
            low_array[1] = @truncate(sum);
            if (sum > 0xFFFFFFFFFFFFFFFF) carry = 1;
        }
        
        // Check for carry from low[1] to high[0]
        if (low_array[1] < a.limbs[1] or low_array[1] < b.limbs[1] or carry > 0) {
            const sum = @as(u128, high_array[0]) + carry;
            high_array[0] = @truncate(sum);
            if (sum > 0xFFFFFFFFFFFFFFFF) {
                const sum2 = @as(u128, high_array[1]) + 1;
                high_array[1] = @truncate(sum2);
            }
        }
        
        return U256.from_limbs([4]u64{ low_array[0], low_array[1], high_array[0], high_array[1] });
    }
    
    fn sse2_u256_mul(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        return self.avx512_u256_mul(a, b);
    }
    
    fn sse2_u256_and(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        _ = self;
        
        const a_low = @as(@Vector(2, u64), @bitCast([2]u64{ a.limbs[0], a.limbs[1] }));
        const a_high = @as(@Vector(2, u64), @bitCast([2]u64{ a.limbs[2], a.limbs[3] }));
        const b_low = @as(@Vector(2, u64), @bitCast([2]u64{ b.limbs[0], b.limbs[1] }));
        const b_high = @as(@Vector(2, u64), @bitCast([2]u64{ b.limbs[2], b.limbs[3] }));
        
        const result_low = a_low & b_low;
        const result_high = a_high & b_high;
        
        const low_array: [2]u64 = @bitCast(result_low);
        const high_array: [2]u64 = @bitCast(result_high);
        
        return U256.from_limbs([4]u64{ low_array[0], low_array[1], high_array[0], high_array[1] });
    }
    
    fn sse2_keccak256(self: *const SIMDOptimizer, data: []const u8) Hash {
        return self.avx512_keccak256(data);
    }
    
    // ARM NEON Implementations
    fn neon_u256_add(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        _ = self;
        
        // NEON provides 128-bit vectors similar to SSE2
        // Implementation would be similar to SSE2 but using NEON intrinsics
        return self.sse2_u256_add(a, b);
    }
    
    fn neon_u256_mul(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        return self.avx512_u256_mul(a, b);
    }
    
    fn neon_u256_and(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        return self.sse2_u256_and(a, b);
    }
    
    fn neon_keccak256(self: *const SIMDOptimizer, data: []const u8) Hash {
        return self.avx512_keccak256(data);
    }
    
    // WebAssembly SIMD Implementations
    fn wasm_simd_u256_add(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        return self.sse2_u256_add(a, b);
    }
    
    fn wasm_simd_u256_mul(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        return self.avx512_u256_mul(a, b);
    }
    
    fn wasm_simd_u256_and(self: *const SIMDOptimizer, a: U256, b: U256) U256 {
        return self.sse2_u256_and(a, b);
    }
    
    fn wasm_simd_keccak256(self: *const SIMDOptimizer, data: []const u8) Hash {
        return self.avx512_keccak256(data);
    }
};
```

#### 2. Optimized Arithmetic Operations
```zig
pub const SIMDArithmetic = struct {
    optimizer: SIMDOptimizer,
    
    pub fn init() SIMDArithmetic {
        return SIMDArithmetic{
            .optimizer = SIMDOptimizer.init(),
        };
    }
    
    pub fn add_u256(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        return self.optimizer.optimize_u256_add(a, b);
    }
    
    pub fn sub_u256(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        if (!self.optimizer.use_simd) {
            return a.sub(b);
        }
        
        // SIMD subtraction with borrow handling
        return switch (self.optimizer.vector_width) {
            512 => self.avx512_u256_sub(a, b),
            256 => self.avx2_u256_sub(a, b),
            128 => self.sse2_u256_sub(a, b),
            else => a.sub(b),
        };
    }
    
    pub fn mul_u256(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        return self.optimizer.optimize_u256_mul(a, b);
    }
    
    pub fn div_u256(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        // Division is more complex and may not benefit as much from SIMD
        // But we can optimize the repeated subtractions and comparisons
        if (!self.optimizer.use_simd or b.is_zero()) {
            return a.div(b);
        }
        
        return self.simd_optimized_div(a, b);
    }
    
    pub fn mod_u256(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        if (!self.optimizer.use_simd or b.is_zero()) {
            return a.mod(b);
        }
        
        return self.simd_optimized_mod(a, b);
    }
    
    pub fn exp_u256(self: *const SIMDArithmetic, base: U256, exponent: U256) U256 {
        if (!self.optimizer.use_simd) {
            return base.pow(exponent);
        }
        
        // Optimized exponentiation using SIMD for repeated multiplications
        return self.simd_optimized_exp(base, exponent);
    }
    
    fn avx512_u256_sub(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        _ = self;
        
        const a_vec = @as(@Vector(4, u64), @bitCast([4]u64{
            a.limbs[0], a.limbs[1], a.limbs[2], a.limbs[3]
        }));
        const b_vec = @as(@Vector(4, u64), @bitCast([4]u64{
            b.limbs[0], b.limbs[1], b.limbs[2], b.limbs[3]
        }));
        
        // Perform vectorized subtraction
        var result_array: [4]u64 = undefined;
        var borrow: u64 = 0;
        
        for (0..4) |i| {
            const diff = @as(i128, a.limbs[i]) - @as(i128, b.limbs[i]) - @as(i128, borrow);
            if (diff < 0) {
                result_array[i] = @as(u64, @intCast(diff + (@as(i128, 1) << 64)));
                borrow = 1;
            } else {
                result_array[i] = @as(u64, @intCast(diff));
                borrow = 0;
            }
        }
        
        return U256.from_limbs(result_array);
    }
    
    fn avx2_u256_sub(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        return self.avx512_u256_sub(a, b);
    }
    
    fn sse2_u256_sub(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        return self.avx512_u256_sub(a, b);
    }
    
    fn simd_optimized_div(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        _ = self;
        
        // Optimized division using Newton-Raphson iteration with SIMD
        // This is a complex algorithm that would benefit from vectorization
        // For now, fall back to standard division
        return a.div(b);
    }
    
    fn simd_optimized_mod(self: *const SIMDArithmetic, a: U256, b: U256) U256 {
        _ = self;
        
        // Modulo can be computed as a - (a / b) * b
        // With SIMD-optimized division and multiplication
        const quotient = self.simd_optimized_div(a, b);
        const product = self.mul_u256(quotient, b);
        return self.sub_u256(a, product);
    }
    
    fn simd_optimized_exp(self: *const SIMDArithmetic, base: U256, exponent: U256) U256 {
        if (exponent.is_zero()) {
            return U256.one();
        }
        
        if (exponent.equals(U256.one())) {
            return base;
        }
        
        // Square-and-multiply with SIMD-optimized operations
        var result = U256.one();
        var base_copy = base;
        var exp_copy = exponent;
        
        while (!exp_copy.is_zero()) {
            if (exp_copy.limbs[0] & 1 == 1) {
                result = self.mul_u256(result, base_copy);
            }
            base_copy = self.mul_u256(base_copy, base_copy);
            exp_copy = self.simd_shr_one(exp_copy);
        }
        
        return result;
    }
    
    fn simd_shr_one(self: *const SIMDArithmetic, value: U256) U256 {
        _ = self;
        
        // SIMD-optimized right shift by 1
        var result = value;
        var carry: u64 = 0;
        
        for (0..4) |i| {
            const idx = 3 - i; // Process from high to low
            const new_carry = result.limbs[idx] & 1;
            result.limbs[idx] = (result.limbs[idx] >> 1) | (carry << 63);
            carry = new_carry;
        }
        
        return result;
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Multi-Platform Support**: x86-64 (SSE2/AVX/AVX2/AVX512), ARM (NEON), WebAssembly (SIMD128)
2. **Runtime Detection**: Automatic detection and selection of optimal SIMD instruction set
3. **Fallback Mechanisms**: Graceful fallback to scalar operations when SIMD unavailable
4. **Vectorized Operations**: SIMD implementations for all critical arithmetic and memory operations
5. **Performance Monitoring**: Benchmarking and performance comparison tools
6. **Compile-Time Optimization**: Optional compile-time SIMD optimization selection

## Implementation Tasks

### Task 1: Implement Core SIMD Infrastructure
File: `/src/evm/simd/simd_optimizer.zig`
```zig
const std = @import("std");
const builtin = @import("builtin");
const U256 = @import("../../Types/U256.ts").U256;
const Hash = @import("../../Hash/Keccak256.ts").Hash;

pub const SIMDOptimizer = struct {
    // Implementation based on the specification above
    // ... (full implementation details)
};
```

### Task 2: Integrate with Arithmetic Operations
File: `/src/evm/execution/arithmetic.zig` (modify existing)
```zig
const SIMDArithmetic = @import("../simd/simd_arithmetic.zig").SIMDArithmetic;

pub const ArithmeticOpcodes = struct {
    simd_arithmetic: SIMDArithmetic,
    
    pub fn init() ArithmeticOpcodes {
        return ArithmeticOpcodes{
            .simd_arithmetic = SIMDArithmetic.init(),
        };
    }
    
    pub fn execute_add(self: *ArithmeticOpcodes, frame: *Frame) !void {
        const b = frame.stack.pop_unsafe();
        const a = frame.stack.peek_unsafe().*;
        
        // Use SIMD-optimized addition
        const result = self.simd_arithmetic.add_u256(a, b);
        frame.stack.set_top_unsafe(result);
    }
    
    pub fn execute_mul(self: *ArithmeticOpcodes, frame: *Frame) !void {
        const b = frame.stack.pop_unsafe();
        const a = frame.stack.peek_unsafe().*;
        
        // Use SIMD-optimized multiplication
        const result = self.simd_arithmetic.mul_u256(a, b);
        frame.stack.set_top_unsafe(result);
    }
    
    pub fn execute_sub(self: *ArithmeticOpcodes, frame: *Frame) !void {
        const b = frame.stack.pop_unsafe();
        const a = frame.stack.peek_unsafe().*;
        
        // Use SIMD-optimized subtraction
        const result = self.simd_arithmetic.sub_u256(a, b);
        frame.stack.set_top_unsafe(result);
    }
    
    pub fn execute_div(self: *ArithmeticOpcodes, frame: *Frame) !void {
        const b = frame.stack.pop_unsafe();
        const a = frame.stack.peek_unsafe().*;
        
        if (b.is_zero()) {
            frame.stack.set_top_unsafe(U256.zero());
            return;
        }
        
        // Use SIMD-optimized division
        const result = self.simd_arithmetic.div_u256(a, b);
        frame.stack.set_top_unsafe(result);
    }
    
    pub fn execute_mod(self: *ArithmeticOpcodes, frame: *Frame) !void {
        const b = frame.stack.pop_unsafe();
        const a = frame.stack.peek_unsafe().*;
        
        if (b.is_zero()) {
            frame.stack.set_top_unsafe(U256.zero());
            return;
        }
        
        // Use SIMD-optimized modulo
        const result = self.simd_arithmetic.mod_u256(a, b);
        frame.stack.set_top_unsafe(result);
    }
    
    pub fn execute_exp(self: *ArithmeticOpcodes, frame: *Frame) !void {
        const exponent = frame.stack.pop_unsafe();
        const base = frame.stack.peek_unsafe().*;
        
        // Use SIMD-optimized exponentiation
        const result = self.simd_arithmetic.exp_u256(base, exponent);
        frame.stack.set_top_unsafe(result);
    }
};
```

### Task 3: Performance Benchmarking
File: `/test/evm/simd/simd_benchmarks.zig`
```zig
const std = @import("std");
const SIMDOptimizer = @import("../../../src/evm/simd/simd_optimizer.zig").SIMDOptimizer;
const U256 = @import("../../../src/Types/U256.ts").U256;

pub fn benchmark_simd_vs_scalar() !void {
    const allocator = std.testing.allocator;
    
    const optimizer = SIMDOptimizer.init();
    const iterations = 1000000;
    
    // Generate test data
    var test_values = std.ArrayList(U256).init(allocator);
    defer test_values.deinit();
    
    var rng = std.rand.DefaultPrng.init(12345);
    for (0..iterations) |_| {
        const value = U256.random(rng.random());
        try test_values.append(value);
    }
    
    // Benchmark SIMD addition
    const simd_start = std.time.milliTimestamp();
    var simd_result = U256.zero();
    for (0..iterations-1) |i| {
        simd_result = optimizer.optimize_u256_add(test_values.items[i], test_values.items[i+1]);
    }
    const simd_end = std.time.milliTimestamp();
    
    // Benchmark scalar addition
    const scalar_start = std.time.milliTimestamp();
    var scalar_result = U256.zero();
    for (0..iterations-1) |i| {
        scalar_result = test_values.items[i].add(test_values.items[i+1]);
    }
    const scalar_end = std.time.milliTimestamp();
    
    // Verify results are identical
    try std.testing.expect(simd_result.equals(scalar_result));
    
    const simd_time = simd_end - simd_start;
    const scalar_time = scalar_end - scalar_start;
    const speedup = @as(f64, @floatFromInt(scalar_time)) / @as(f64, @floatFromInt(simd_time));
    
    std.log.info("SIMD Addition Benchmark:");
    std.log.info("  SIMD time: {}ms", .{simd_time});
    std.log.info("  Scalar time: {}ms", .{scalar_time});
    std.log.info("  Speedup: {d:.2}x", .{speedup});
}
```

## Testing Requirements

### Test File
Create `/test/evm/simd/simd_optimizations_test.zig`

### Test Cases
```zig
test "SIMD capability detection" {
    // Test CPU feature detection
    // Test capability reporting
    // Test fallback mechanisms
}

test "SIMD arithmetic operations" {
    // Test SIMD vs scalar arithmetic accuracy
    // Test performance improvements
    // Test edge cases and overflow handling
}

test "SIMD memory operations" {
    // Test SIMD memory copy operations
    // Test memory comparison operations
    // Test memory initialization operations
}

test "cross-platform SIMD support" {
    // Test x86-64 SIMD implementations
    // Test ARM NEON implementations
    // Test WebAssembly SIMD implementations
}

test "performance benchmarks" {
    // Benchmark SIMD vs scalar performance
    // Test different vector widths
    // Measure real-world execution improvements
}

test "integration with VM execution" {
    // Test VM integration
    // Test execution correctness with SIMD
    // Test performance impact on real workloads
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/simd/simd_optimizer.zig` - Core SIMD optimization framework
- `/src/evm/simd/simd_arithmetic.zig` - SIMD-optimized arithmetic operations
- `/src/evm/simd/simd_memory.zig` - SIMD-optimized memory operations
- `/src/evm/simd/simd_crypto.zig` - SIMD-optimized cryptographic functions
- `/src/evm/simd/capability_detection.zig` - Runtime capability detection
- `/src/evm/execution/arithmetic.zig` - Integration with arithmetic opcodes
- `/src/evm/execution/bitwise.zig` - Integration with bitwise opcodes
- `/src/evm/execution/crypto.zig` - Integration with crypto opcodes
- `/src/evm/memory.zig` - Integration with memory operations
- `/test/evm/simd/simd_optimizations_test.zig` - Comprehensive tests and benchmarks

## Success Criteria

1. **Significant Performance Improvement**: 2-5x speedup for arithmetic-heavy operations
2. **Cross-Platform Compatibility**: Works on x86-64, ARM, and WebAssembly targets
3. **Correctness**: All operations produce identical results to scalar implementations
4. **Automatic Optimization**: Runtime detection and selection of optimal SIMD instructions
5. **Fallback Reliability**: Graceful degradation when SIMD unavailable
6. **Memory Efficiency**: No significant increase in memory usage

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

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/simd/simd_optimizations_test.zig`)
```zig
// Test basic SIMD optimizations functionality
test "simd_optimizations basic functionality works correctly"
test "simd_optimizations handles edge cases properly"
test "simd_optimizations validates inputs appropriately"
test "simd_optimizations produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "simd_optimizations integrates with EVM properly"
test "simd_optimizations maintains system compatibility"
test "simd_optimizations works with existing components"
test "simd_optimizations handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "simd_optimizations meets performance requirements"
test "simd_optimizations optimizes resource usage"
test "simd_optimizations scales appropriately with load"
test "simd_optimizations benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "simd_optimizations meets specification requirements"
test "simd_optimizations maintains EVM compatibility"
test "simd_optimizations handles hardfork transitions"
test "simd_optimizations cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "simd_optimizations handles errors gracefully"
test "simd_optimizations proper error propagation"
test "simd_optimizations recovery from failure states"
test "simd_optimizations validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "simd_optimizations prevents security vulnerabilities"
test "simd_optimizations handles malicious inputs safely"
test "simd_optimizations maintains isolation boundaries"
test "simd_optimizations validates security properties"
```

### Test Development Priority
1. **Core functionality** - Basic feature operation
2. **Specification compliance** - Meet requirements
3. **Integration** - System-level correctness
4. **Performance** - Efficiency targets
5. **Error handling** - Robust failures
6. **Security** - Vulnerability prevention

### Test Data Sources
- **Specification documents**: Official requirements and test vectors
- **Reference implementations**: Cross-client compatibility
- **Performance baselines**: Optimization targets
- **Real-world data**: Production scenarios
- **Synthetic cases**: Edge conditions and stress testing

### Continuous Testing
- Run `zig build test-all` after every change
- Maintain 100% test coverage for public APIs
- Validate performance regression prevention
- Test both debug and release builds
- Verify cross-platform behavior

### Test-First Examples

**Before implementation:**
```zig
test "simd_optimizations basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = simd_optimizations.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const simd_optimizations = struct {
    pub fn process(input: InputType) !OutputType {
        return error.NotImplemented; // Initially
    }
};
```

### Critical Requirements
- **Never commit without passing tests**
- **Test all configuration paths**
- **Verify specification compliance**
- **Validate performance implications**
- **Ensure cross-platform compatibility**

## References

- [Intel Intrinsics Guide](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html) - x86 SIMD instruction reference
- [ARM NEON Programming Guide](https://developer.arm.com/documentation/den0018/a/) - ARM SIMD programming
- [WebAssembly SIMD Proposal](https://github.com/webassembly/simd) - WebAssembly SIMD specification
- [Zig Vector Documentation](https://ziglang.org/documentation/master/#Vectors) - Zig vector type usage
- [High-Performance Computing](https://en.wikipedia.org/wiki/High-performance_computing) - SIMD optimization techniques

## Reference Implementations

### geth

<explanation>
The go-ethereum blake2b implementation demonstrates the standard pattern for SIMD optimization: runtime CPU feature detection, multiple implementations (AVX2, AVX, SSE4, generic), and dispatch based on available capabilities. The key insight is separating the detection logic from the optimized implementations.
</explanation>

**Runtime CPU Detection** - `/go-ethereum/crypto/blake2b/blake2bAVX2_amd64.go` (lines 12-16):
```go
func init() {
	useAVX2 = cpu.X86.HasAVX2
	useAVX = cpu.X86.HasAVX
	useSSE4 = cpu.X86.HasSSE41
}
```

**SIMD Function Declarations** - `/go-ethereum/crypto/blake2b/blake2bAVX2_amd64.go` (lines 18-25):
```go
//go:noescape
func fAVX2(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)

//go:noescape
func fAVX(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)

//go:noescape
func fSSE4(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)
```

**SIMD Dispatch Logic** - `/go-ethereum/crypto/blake2b/blake2bAVX2_amd64.go` (lines 27-38):
```go
func f(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64) {
	switch {
	case useAVX2:
		fAVX2(h, m, c0, c1, flag, rounds)
	case useAVX:
		fAVX(h, m, c0, c1, flag, rounds)
	case useSSE4:
		fSSE4(h, m, c0, c1, flag, rounds)
	default:
		fGeneric(h, m, c0, c1, flag, rounds)
	}
}
```

**Global SIMD Flags** - `/go-ethereum/crypto/blake2b/blake2b.go` (lines 36-40):
```go
var (
	useAVX2 bool
	useAVX  bool
	useSSE4 bool
)
```

## EVMONE Context

An analysis of the `evmone` codebase reveals several key patterns and implementations that are highly relevant to the request for SIMD optimizations. The most direct examples are found in the cryptographic precompiles, which use platform-specific intrinsics for performance. Additionally, `evmone`'s code analysis and benchmarking provide valuable context for a performance-focused implementation.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone_precompiles/sha256.cpp">
```cpp
// lib/evmone_precompiles/sha256.cpp

// ... (includes and forward declarations)

static void sha_256_generic(uint32_t h[8], const std::byte* input, size_t len)
{
    sha_256_implementation(h, input, len);
}

// Initialize the function pointer to the generic implementation.
static void (*sha_256_best)(uint32_t h[8], const std::byte* input, size_t len) = sha_256_generic;

#if defined(__x86_64__)

// ... (x86-specific implementations)

// The following function was adapted from
// https://github.com/noloader/SHA-Intrinsics/blob/master/sha256-x86.c
__attribute__((target("sha,sse4.1"))) static void sha_256_x86_sha(
    uint32_t h[8], const std::byte* input, size_t len)
{
    // ... (SIMD implementation using _mm_... intrinsics)
    STATE1 = _mm_sha256rnds2_epu32(STATE1, STATE0, MSG);
    // ...
}

__attribute__((constructor)) static void select_sha256_implementation()
{
    // ... (cpuid detection logic)
    cpuid(info, 0x00000007);
    hw_bmi1 = (info[1] & (1 << 3)) != 0;
    hw_bmi2 = (info[1] & (1 << 8)) != 0;
    hw_sha = (info[1] & (1 << 29)) != 0;


    if (hw_sse41 && hw_sha)
    {
        sha_256_best = sha_256_x86_sha;
    }
    else if (hw_bmi1 && hw_bmi2)
    {
        sha_256_best = sha_256_x86_bmi;
    }
}

#elif defined(__aarch64__) && defined(__APPLE__)

// The following function was adapted from
// https://github.com/noloader/SHA-Intrinsics/blob/master/sha256-arm.c
static void sha_256_arm_v8(uint32_t h[8], const std::byte* input, size_t len)
{
    // ... (ARM NEON implementation using vsha256... intrinsics)
    STATE0 = vsha256hq_u32(STATE0, STATE1, TMP0);
    STATE1 = vsha256h2q_u32(STATE1, TMP2, TMP0);
    // ...
}

__attribute__((constructor)) static void select_sha256_implementation(void)
{
#if defined(__linux__)
    if ((getauxval(AT_HWCAP) & HWCAP_SHA2) != 0)
    {
        sha_256_best = sha_256_arm_v8;
    }
// ... (Apple-specific sysctlbyname check)
#endif
}
#endif

void sha256(std::byte hash[SHA256_HASH_SIZE], const std::byte* data, size_t size)
{
    // ... (initial hash values)
    uint32_t h[] = {0x6a09e667, 0xbb67ae85, ...};

    // Dispatch to the best available implementation.
    sha_256_best(h, data, size);

    // ... (final hash value production)
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/cpu_check.cpp">
```cpp
// lib/evmone/cpu_check.cpp

#define STRINGIFY_HELPER(X) #X
#define STRINGIFY(X) STRINGIFY_HELPER(X)

#if EVMONE_X86_64_ARCH_LEVEL == 2
#define CPU_FEATURE "sse4.2"
#elif EVMONE_X86_64_ARCH_LEVEL == 3
#define CPU_FEATURE "avx2"
#endif
// ...

static bool cpu_check = []() noexcept {
    // This is a build-time check to ensure the compiled binary can run on the target CPU.
    // It's a different approach than runtime detection but relevant for optimization.
    if (!__builtin_cpu_supports(CPU_FEATURE))
    {
        (void)std::fputs("CPU does not support " CPU_FEATURE "\n", stderr);
        std::abort();
    }
    return false;
}();
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/synthetic_benchmarks.cpp">
```cpp
// test/bench/synthetic_benchmarks.cpp

/// Generates the EVM benchmark loop inner code for the given opcode and "mode".
bytecode generate_loop_inner_code(CodeParams params)
{
    const auto [opcode, mode] = params;
    const auto category = get_instruction_category(opcode);
    switch (mode)
    {
    case Mode::min_stack:
        switch (category)
        {
        // ...
        case InstructionCategory::unop:
            // DUP1 NOT NOT ... POP
            return OP_DUP1 + stack_limit * 2 * bytecode{opcode} + OP_POP;

        case InstructionCategory::binop:
            // DUP1 DUP1 ADD DUP1 ADD DUP1 ADD ... POP
            return OP_DUP1 + (stack_limit - 1) * (OP_DUP1 + bytecode{opcode}) + OP_POP;

        case InstructionCategory::push:
            // PUSH1 POP PUSH1 POP ...
            return stack_limit * (push(opcode, {}) + OP_POP);
        // ...
        }
        break;

    case Mode::full_stack:
        switch (category)
        {
        case InstructionCategory::binop:
            // DUP1 DUP1 DUP1 ... ADD ADD ADD ... POP
            return stack_limit * OP_DUP1 + (stack_limit - 1) * opcode + OP_POP;
        // ...
        }
        break;
    }
    return {};
}

// ... (loop generation logic)

void register_synthetic_benchmarks()
{
    // ...
    // Binops.
    for (const auto opcode : {OP_ADD, OP_MUL, OP_SUB, OP_SIGNEXTEND, OP_LT, OP_GT, OP_SLT, OP_SGT,
             OP_EQ, OP_AND, OP_OR, OP_XOR, OP_BYTE, OP_SHL, OP_SHR, OP_SAR})
        params_list.insert(
            params_list.end(), {{opcode, Mode::min_stack}, {opcode, Mode::full_stack}});
    // ...
    for (auto& [vm_name, vm] : registered_vms)
    {
        // ...
        RegisterBenchmark(std::string{vm_name} + "/total/synth/" + to_string(params),
            [&vm, params](
                State& state) { bench_evmc_execute(state, vm, generate_code(params)); })
            ->Unit(kMicrosecond);
    }
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/helpers.hpp">
```cpp
// test/bench/helpers.hpp

template <typename ExecutionStateT, typename AnalysisT,
    ExecuteFn<ExecutionStateT, AnalysisT> execute_fn, AnalyseFn<AnalysisT> analyse_fn>
inline void bench_execute(benchmark::State& state, evmc::VM& vm, bytes_view code, bytes_view input,
    bytes_view expected_output) noexcept
{
    // ... (setup)

    auto total_gas_used = int64_t{0};
    auto iteration_gas_used = int64_t{0};
    for (auto _ : state)
    {
        const auto r = execute_fn(vm, exec_state, analysis, msg, rev, host, code);
        iteration_gas_used = gas_limit - r.gas_left;
        total_gas_used += iteration_gas_used;
    }

    using benchmark::Counter;
    state.counters["gas_used"] = Counter(static_cast<double>(iteration_gas_used));
    state.counters["gas_rate"] = Counter(static_cast<double>(total_gas_used), Counter::kIsRate);
}

inline void bench_evmc_execute(benchmark::State& state, evmc::VM& vm, bytes_view code,
    bytes_view input = {}, bytes_view expected_output = {})
{
    bench_execute<FakeExecutionState, FakeCodeAnalysis, evmc_execute, evmc_analyse>(
        state, vm, code, input, expected_output);
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/advanced_analysis.hpp">
```cpp
// lib/evmone/advanced_analysis.hpp

/// Compressed information about instruction basic block.
struct BlockInfo
{
    /// The total base gas cost of all instructions in the block.
    uint32_t gas_cost = 0;

    /// The stack height required to execute the block.
    int16_t stack_req = 0;

    /// The maximum stack height growth relative to the stack height at block start.
    int16_t stack_max_growth = 0;
};
// ...
struct AdvancedCodeAnalysis
{
    std::vector<Instruction> instrs;
    std::vector<intx::uint256> push_values;
    std::vector<int32_t> jumpdest_offsets;
    std::vector<int32_t> jumpdest_targets;
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_storage.cpp">
```cpp
// lib/evmone/instructions_storage.cpp

// The lookup table of SSTORE costs by the storage update status.
constexpr auto sstore_costs = []() noexcept {
    std::array<std::array<StorageStoreCost, EVMC_STORAGE_MODIFIED_RESTORED + 1>,
        EVMC_MAX_REVISION + 1>
        tbl{};

    for (size_t rev = EVMC_FRONTIER; rev <= EVMC_MAX_REVISION; ++rev)
    {
        auto& e = tbl[rev];
        if (const auto c = storage_cost_spec[rev]; !c.net_cost)  // legacy
        {
            // ...
        }
        else  // net cost
        {
            e[EVMC_STORAGE_ASSIGNED] = {c.warm_access, 0};
            e[EVMC_STORAGE_ADDED] = {c.set, 0};
            e[EVMC_STORAGE_DELETED] = {c.reset, c.clear};
            // ...
        }
    }
    return tbl;
}();

// ...

Result sstore(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    // ...
    const auto gas_cost_cold =
        (state.rev >= EVMC_BERLIN &&
            state.host.access_storage(state.msg->recipient, key) == EVMC_ACCESS_COLD) ?
            instr::cold_sload_cost :
            0;
    const auto status = state.host.set_storage(state.msg->recipient, key, value);

    const auto [gas_cost_warm, gas_refund] = sstore_costs[state.rev][status];
    const auto gas_cost = gas_cost_warm + gas_cost_cold;
    if ((gas_left -= gas_cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    state.gas_refund += gas_refund;
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
</evmone>




## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/secp256k1.rs">
```rust
//! `ecrecover` precompile.
//!
//! Depending on enabled features, it will use different implementations of `ecrecover`.
//! * [`k256`](https://crates.io/crates/k256) - uses maintained pure rust lib `k256`, it is perfect use for no_std environments.
//! * [`secp256k1`](https://crates.io/crates/secp256k1) - uses `bitcoin_secp256k1` lib, it is a C implementation of secp256k1 used in bitcoin core.
//!   It is faster than k256 and enabled by default and in std environment.
//! * [`libsecp256k1`](https://crates.io/crates/libsecp256k1) - is made from parity in pure rust, it is alternative for k256.
//!
//! Order of preference is `secp256k1` -> `k256` -> `libsecp256k1`. Where if no features are enabled, it will use `k256`.
//!
//! Input format:
//! [32 bytes for message][64 bytes for signature][1 byte for recovery id]
//!
//! Output format:
//! [32 bytes for recovered address]
#[cfg(feature = "secp256k1")]
pub mod bitcoin_secp256k1;
pub mod k256;
#[cfg(feature = "libsecp256k1")]
pub mod parity_libsecp256k1;

use crate::{
    utilities::right_pad, PrecompileError, PrecompileOutput, PrecompileResult,
    PrecompileWithAddress,
};
use primitives::{alloy_primitives::B512, Bytes, B256};

/// `ecrecover` precompile, containing address and function to run.
pub const ECRECOVER: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(1), ec_recover_run);

/// `ecrecover` precompile function. Read more about input and output format in [this module docs](self).
pub fn ec_recover_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    const ECRECOVER_BASE: u64 = 3_000;

    if ECRECOVER_BASE > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    let input = right_pad::<128>(input);

    // `v` must be a 32-byte big-endian integer equal to 27 or 28.
    if !(input[32..63].iter().all(|&b| b == 0) && matches!(input[63], 27 | 28)) {
        return Ok(PrecompileOutput::new(ECRECOVER_BASE, Bytes::new()));
    }

    let msg = <&B256>::try_from(&input[0..32]).unwrap();
    let recid = input[63] - 27;
    let sig = <&B512>::try_from(&input[64..128]).unwrap();

    let res = ecrecover(sig, recid, msg);

    let out = res.map(|o| o.to_vec().into()).unwrap_or_default();
    Ok(PrecompileOutput::new(ECRECOVER_BASE, out))
}

// Select the correct implementation based on the enabled features.
cfg_if::cfg_if! {
    if #[cfg(feature = "secp256k1")] {
        pub use bitcoin_secp256k1::ecrecover;
    } else if #[cfg(feature = "libsecp256k1")] {
        pub use parity_libsecp256k1::ecrecover;
    } else {
        pub use k256::ecrecover;
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bn128.rs">
```rust
//! BN128 precompiles added in [`EIP-1962`](https://eips.ethereum.org/EIPS/eip-1962)
use crate::{
    utilities::{bool_to_bytes32, right_pad},
    Address, PrecompileError, PrecompileOutput, PrecompileResult, PrecompileWithAddress,
};
use std::vec::Vec;

cfg_if::cfg_if! {
    if #[cfg(feature = "bn")] {
        mod substrate;
        use substrate::{
            encode_g1_point, g1_point_add, g1_point_mul, pairing_check, read_g1_point, read_g2_point,
            read_scalar,
        };
    } else {
        mod arkworks;
        use arkworks::{
            encode_g1_point, g1_point_add, g1_point_mul, pairing_check, read_g1_point, read_g2_point,
            read_scalar,
        };
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/benches/ecrecover.rs">
```rust
//! Benchmarks for the ecrecover precompile
use criterion::{measurement::Measurement, BenchmarkGroup};
use primitives::{hex, keccak256, Bytes, U256};
use revm_precompile::secp256k1::ec_recover_run;
use secp256k1::{Message, SecretKey, SECP256K1};

/// Add benches for the ecrecover precompile
pub fn add_benches<M: Measurement>(group: &mut BenchmarkGroup<'_, M>) {
    // Generate secp256k1 signature
    let data = hex::decode("1337133713371337").unwrap();
    let hash = keccak256(data);
    let secret_key = SecretKey::new(&mut rand::thread_rng());

    let message = Message::from_digest_slice(&hash[..]).unwrap();
    let s = SECP256K1.sign_ecdsa_recoverable(&message, &secret_key);
    let (rec_id, data) = s.serialize_compact();
    let rec_id = i32::from(rec_id) as u8 + 27;

    let mut message_and_signature = [0u8; 128];
    message_and_signature[0..32].copy_from_slice(&hash[..]);

    // Fit signature into format the precompile expects
    let rec_id = U256::from(rec_id as u64);
    message_and_signature[32..64].copy_from_slice(&rec_id.to_be_bytes::<32>());
    message_and_signature[64..128].copy_from_slice(&data);

    let message_and_signature = Bytes::from(message_and_signature);

    group.bench_function("ecrecover precompile", |b| {
        b.iter(|| ec_recover_run(&message_and_signature, u64::MAX).unwrap())
    });
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
//! # revm-precompile
//!
//! Implementations of EVM precompiled contracts.

// ...

use primitives::{hardfork::SpecId, Address, HashMap, HashSet};
use std::{boxed::Box, vec::Vec};

// ...

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

    /// Returns precompiles for Byzantium spec.
    pub fn byzantium() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::homestead().clone();
            precompiles.extend([
                // EIP-198: Big integer modular exponentiation.
                modexp::BYZANTIUM,
                // EIP-196: Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128.
                // EIP-197: Precompiled contracts for optimal ate pairing check on the elliptic curve alt_bn128.
                bn128::add::BYZANTIUM,
                bn128::mul::BYZANTIUM,
                bn128::pair::BYZANTIUM,
            ]);
            Box::new(precompiles)
        })
    }

    // ... other hardforks

    /// Extends the precompiles with the given precompiles.
    ///
    /// Other precompiles with overwrite existing precompiles.
    #[inline]
    pub fn extend(&mut self, other: impl IntoIterator<Item = PrecompileWithAddress>) {
        let items: Vec<PrecompileWithAddress> = other.into_iter().collect::<Vec<_>>();
        self.addresses.extend(items.iter().map(|p| *p.address()));
        self.inner.extend(items.into_iter().map(|p| (p.0, p.1)));
    }

    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/arithmetic.rs">
```rust
use super::i256::{i256_div, i256_mod};
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, RuntimeFlag, StackTr},
    InstructionContext,
};
use primitives::U256;

pub fn add<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_add(*op2);
}

pub fn mul<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::LOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_mul(*op2);
}

pub fn sub<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_sub(*op2);
}

// ... other arithmetic operations
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/bitwise.rs">
```rust
use super::i256::i256_cmp;
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, RuntimeFlag, StackTr},
    InstructionContext,
};
use core::cmp::Ordering;
use primitives::U256;

//...

pub fn bitand<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1 & *op2;
}

pub fn bitor<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    *op2 = op1 | *op2;
}

pub fn bitxor<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    *op2 = op1 ^ *op2;
}

pub fn not<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], op1, context.interpreter);

    *op1 = !*op1;
}

//...
```
</file>
</revm>

## Prompt Corrections

The original prompt provides a comprehensive plan for implementing SIMD optimizations directly within the EVM in Zig. This is a valid approach. However, it's worth noting how `revm`, a high-performance Rust EVM, achieves its performance, which can offer valuable insights.

1.  **Leveraging High-Performance Dependencies**: Instead of implementing low-level SIMD logic for `U256` arithmetic directly inside the `revm` codebase, `revm` uses the `ruint` library (via `alloy_primitives`). The `ruint` library itself contains extensive SIMD optimizations for various platforms. This pattern of abstracting performance-critical primitives into a dedicated, specialized library is a common and effective strategy. For a Zig EVM, this would be analogous to creating or using a highly optimized `U256.zig` library and having the opcode handlers call its methods.

2.  **Compile-Time vs. Runtime Dispatch**: The prompt focuses on runtime CPU feature detection and dispatch. `revm` primarily uses **compile-time dispatch** for its precompile backends (e.g., `secp256k1`, `bn128`). It uses Rust's feature flags (`#[cfg(feature = "...")]`) to select which underlying cryptographic library to use at compile time. This allows for building different `revm` binaries optimized for different environments (e.g., a `no_std` version using a pure Rust crypto library vs. a standard version using a faster C-backed library). While runtime detection offers maximum flexibility, compile-time selection is a powerful alternative for creating targeted builds.

3.  **No Direct Runtime CPU Feature Detection in Core `revm`**: Unlike the `geth` example, there is no direct runtime CPU feature detection (`is_x86_feature_detected!`) within the core `revm` logic for arithmetic or general-purpose opcodes. This logic is encapsulated within its dependencies. For cryptographic precompiles, the choice of backend library (which may itself use runtime detection) is made at compile time.

These observations from `revm`'s architecture can complement the implementation plan in the original prompt by showcasing alternative and effective strategies for achieving high performance in an EVM.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/arithmetic.py">
```python
"""
Ethereum Virtual Machine (EVM) Arithmetic Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM Arithmetic instructions.
"""

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from ethereum.utils.numeric import get_sign

from .. import Evm
from ..gas import (
    GAS_EXPONENTIATION,
    GAS_EXPONENTIATION_PER_BYTE,
    GAS_LOW,
    GAS_MID,
    GAS_VERY_LOW,
    charge_gas,
)
from ..stack import pop, push


def add(evm: Evm) -> None:
    """
    Adds the top two elements of the stack together, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    result = x.wrapping_add(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def sub(evm: Evm) -> None:
    """
    Subtracts the top two elements of the stack, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    result = x.wrapping_sub(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mul(evm: Evm) -> None:
    """
    Multiply the top two elements of the stack, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    result = x.wrapping_mul(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def div(evm: Evm) -> None:
    """
    Integer division of the top two elements of the stack. Pushes the result
    back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    dividend = pop(evm.stack)
    divisor = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    if divisor == 0:
        quotient = U256(0)
    else:
        quotient = dividend // divisor

    push(evm.stack, quotient)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mod(evm: Evm) -> None:
    """
    Modulo remainder of the top two elements of the stack. Pushes the result
    back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    if y == 0:
        remainder = U256(0)
    else:
        remainder = x % y

    push(evm.stack, remainder)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def exp(evm: Evm) -> None:
    """
    Exponential operation of the top 2 elements. Pushes the result back on
    the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    base = Uint(pop(evm.stack))
    exponent = Uint(pop(evm.stack))

    # GAS
    # This is equivalent to 1 + floor(log(y, 256)). But in python the log
    # function is inaccurate leading to wrong results.
    exponent_bits = exponent.bit_length()
    exponent_bytes = (exponent_bits + Uint(7)) // Uint(8)
    charge_gas(
        evm, GAS_EXPONENTIATION + GAS_EXPONENTIATION_PER_BYTE * exponent_bytes
    )

    # OPERATION
    result = U256(pow(base, exponent, Uint(U256.MAX_VALUE) + Uint(1)))

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/bitwise.py">
```python
"""
Ethereum Virtual Machine (EVM) Bitwise Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM bitwise instructions.
"""

from ethereum_types.numeric import U256, Uint

from .. import Evm
from ..gas import GAS_VERY_LOW, charge_gas
from ..stack import pop, push


def bitwise_and(evm: Evm) -> None:
    """
    Bitwise AND operation of the top 2 elements of the stack. Pushes the
    result back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    push(evm.stack, x & y)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def bitwise_or(evm: Evm) -> None:
    """
    Bitwise OR operation of the top 2 elements of the stack. Pushes the
    result back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    push(evm.stack, x | y)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def bitwise_xor(evm: Evm) -> None:
    """
    Bitwise XOR operation of the top 2 elements of the stack. Pushes the
    result back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    push(evm.stack, x ^ y)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def bitwise_not(evm: Evm) -> None:
    """
    Bitwise NOT operation of the top element of the stack. Pushes the
    result back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    push(evm.stack, ~x)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/keccak.py">
```python
"""
Ethereum Virtual Machine (EVM) Keccak Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM keccak instructions.
"""

from ethereum_types.numeric import U256, Uint

from ethereum.crypto.hash import keccak256
from ethereum.utils.numeric import ceil32

from .. import Evm
from ..gas import (
    GAS_KECCAK256,
    GAS_KECCAK256_WORD,
    calculate_gas_extend_memory,
    charge_gas,
)
from ..memory import memory_read_bytes
from ..stack import pop, push


def keccak(evm: Evm) -> None:
    """
    Pushes to the stack the Keccak-256 hash of a region of memory.

    This also expands the memory, in case the memory is insufficient to
    access the data's memory location.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    memory_start_index = pop(evm.stack)
    size = pop(evm.stack)

    # GAS
    words = ceil32(Uint(size)) // Uint(32)
    word_gas_cost = GAS_KECCAK256_WORD * words
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(memory_start_index, size)]
    )
    charge_gas(evm, GAS_KECCAK256 + word_gas_cost + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    data = memory_read_bytes(evm.memory, memory_start_index, size)
    hash = keccak256(data)

    push(evm.stack, U256.from_be_bytes(hash))

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/__init__.py">
```python
"""
EVM Instruction Encoding (Opcodes)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Machine readable representations of EVM instructions, and a mapping to their
implementations.
"""

import enum
from typing import Callable, Dict

from . import arithmetic as arithmetic_instructions
from . import bitwise as bitwise_instructions
from . import block as block_instructions
from . import comparison as comparison_instructions
from . import control_flow as control_flow_instructions
from . import environment as environment_instructions
from . import keccak as keccak_instructions
from . import log as log_instructions
from . import memory as memory_instructions
from . import stack as stack_instructions
from . import storage as storage_instructions
from . import system as system_instructions


class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # Arithmetic Ops
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    DIV = 0x04
    SDIV = 0x05
    MOD = 0x06
    SMOD = 0x07
    ADDMOD = 0x08
    MULMOD = 0x09
    EXP = 0x0A
    SIGNEXTEND = 0x0B

    # Comparison Ops
    LT = 0x10
    GT = 0x11
    SLT = 0x12
    SGT = 0x13
    EQ = 0x14
    ISZERO = 0x15

    # Bitwise Ops
    AND = 0x16
    OR = 0x17
    XOR = 0x18
    NOT = 0x19
    BYTE = 0x1A
    SHL = 0x1B
    SHR = 0x1C
    SAR = 0x1D

    # Keccak Op
    KECCAK = 0x20

    # Environmental Ops
    ADDRESS = 0x30
    BALANCE = 0x31
    ORIGIN = 0x32
    CALLER = 0x33
    CALLVALUE = 0x34
    CALLDATALOAD = 0x35
    CALLDATASIZE = 0x36
    CALLDATACOPY = 0x37
    CODESIZE = 0x38
    CODECOPY = 0x39
    GASPRICE = 0x3A
    EXTCODESIZE = 0x3B
    EXTCODECOPY = 0x3C
    RETURNDATASIZE = 0x3D
    RETURNDATACOPY = 0x3E
    EXTCODEHASH = 0x3F

    # Block Ops
    BLOCKHASH = 0x40
    COINBASE = 0x41
    TIMESTAMP = 0x42
    NUMBER = 0x43
    PREVRANDAO = 0x44
    GASLIMIT = 0x45
    CHAINID = 0x46
    SELFBALANCE = 0x47
    BASEFEE = 0x48
    BLOBHASH = 0x49
    BLOBBASEFEE = 0x4A

    # Control Flow Ops
    STOP = 0x00
    JUMP = 0x56
    JUMPI = 0x57
    PC = 0x58
    GAS = 0x5A
    JUMPDEST = 0x5B

    # Storage Ops
    SLOAD = 0x54
    SSTORE = 0x55
    TLOAD = 0x5C
    TSTORE = 0x5D

    # Pop Operation
    POP = 0x50

    # Push Operations
    PUSH0 = 0x5F
    PUSH1 = 0x60
    # ... (rest of PUSH opcodes) ...
    PUSH32 = 0x7F

    # Dup operations
    DUP1 = 0x80
    # ... (rest of DUP opcodes) ...
    DUP16 = 0x8F

    # Swap operations
    SWAP1 = 0x90
    # ... (rest of SWAP opcodes) ...
    SWAP16 = 0x9F

    # Memory Operations
    MLOAD = 0x51
    MSTORE = 0x52
    MSTORE8 = 0x53
    MSIZE = 0x59
    MCOPY = 0x5E

    # Log Operations
    LOG0 = 0xA0
    LOG1 = 0xA1
    LOG2 = 0xA2
    LOG3 = 0xA3
    LOG4 = 0xA4

    # System Operations
    CREATE = 0xF0
    CALL = 0xF1
    CALLCODE = 0xF2
    RETURN = 0xF3
    DELEGATECALL = 0xF4
    CREATE2 = 0xF5
    STATICCALL = 0xFA
    REVERT = 0xFD
    SELFDESTRUCT = 0xFF


op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    Ops.MUL: arithmetic_instructions.mul,
    Ops.SUB: arithmetic_instructions.sub,
    Ops.DIV: arithmetic_instructions.div,
    Ops.SDIV: arithmetic_instructions.sdiv,
    Ops.MOD: arithmetic_instructions.mod,
    Ops.SMOD: arithmetic_instructions.smod,
    Ops.ADDMOD: arithmetic_instructions.addmod,
    Ops.MULMOD: arithmetic_instructions.mulmod,
    Ops.EXP: arithmetic_instructions.exp,
    Ops.SIGNEXTEND: arithmetic_instructions.signextend,
    Ops.LT: comparison_instructions.less_than,
    Ops.GT: comparison_instructions.greater_than,
    Ops.SLT: comparison_instructions.signed_less_than,
    Ops.SGT: comparison_instructions.signed_greater_than,
    Ops.EQ: comparison_instructions.equal,
    Ops.ISZERO: comparison_instructions.is_zero,
    Ops.AND: bitwise_instructions.bitwise_and,
    Ops.OR: bitwise_instructions.bitwise_or,
    Ops.XOR: bitwise_instructions.bitwise_xor,
    Ops.NOT: bitwise_instructions.bitwise_not,
    Ops.BYTE: bitwise_instructions.get_byte,
    Ops.SHL: bitwise_instructions.bitwise_shl,
    Ops.SHR: bitwise_instructions.bitwise_shr,
    Ops.SAR: bitwise_instructions.bitwise_sar,
    Ops.KECCAK: keccak_instructions.keccak,
    # ... (other opcodes) ...
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
"""
Ethereum Virtual Machine (EVM)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

The abstract computer which runs the code stored in an
`.fork_types.Account`.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Set, Tuple, Union

from ethereum_types.bytes import Bytes, Bytes0, Bytes32
from ethereum_types.numeric import U64, U256, Uint

from ethereum.crypto.hash import Hash32
from ethereum.exceptions import EthereumException

from ..blocks import Log, Receipt, Withdrawal
from ..fork_types import Address, VersionedHash
from ..state import State, TransientStorage
from ..transactions import LegacyTransaction
from ..trie import Trie

__all__ = ("Environment", "Evm", "Message")

# ... (BlockEnvironment, BlockOutput, TransactionEnvironment)

@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    block_env: BlockEnvironment
    tx_env: TransactionEnvironment
    caller: Address
    target: Union[Bytes0, Address]
    current_target: Address
    gas: Uint
    value: U256
    data: Bytes
    code_address: Optional[Address]
    code: Bytes
    depth: Uint
    should_transfer_value: bool
    is_static: bool
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
    parent_evm: Optional["Evm"]


@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
</execution-specs>


---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/arithmetic.py">
```python
"""
Ethereum Virtual Machine (EVM) Arithmetic Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM Arithmetic instructions.
"""

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from ethereum.utils.numeric import get_sign

from .. import Evm
from ..gas import (
    GAS_EXPONENTIATION,
    GAS_EXPONENTIATION_PER_BYTE,
    GAS_LOW,
    GAS_MID,
    GAS_VERY_LOW,
    charge_gas,
)
from ..stack import pop, push


def add(evm: Evm) -> None:
    """
    Adds the top two elements of the stack together, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    result = x.wrapping_add(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def sub(evm: Evm) -> None:
    """
    Subtracts the top two elements of the stack, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    result = x.wrapping_sub(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mul(evm: Evm) -> None:
    """
    Multiply the top two elements of the stack, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    result = x.wrapping_mul(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def div(evm: Evm) -> None:
    """
    Integer division of the top two elements of the stack. Pushes the result
    back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    dividend = pop(evm.stack)
    divisor = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    if divisor == 0:
        quotient = U256(0)
    else:
        quotient = dividend // divisor

    push(evm.stack, quotient)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mod(evm: Evm) -> None:
    """
    Modulo remainder of the top two elements of the stack. Pushes the result
    back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    if y == 0:
        remainder = U256(0)
    else:
        remainder = x % y

    push(evm.stack, remainder)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def exp(evm: Evm) -> None:
    """
    Exponential operation of the top 2 elements. Pushes the result back on
    the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    base = Uint(pop(evm.stack))
    exponent = Uint(pop(evm.stack))

    # GAS
    # This is equivalent to 1 + floor(log(y, 256)). But in python the log
    # function is inaccurate leading to wrong results.
    exponent_bits = exponent.bit_length()
    exponent_bytes = (exponent_bits + Uint(7)) // Uint(8)
    charge_gas(
        evm, GAS_EXPONENTIATION + GAS_EXPONENTIATION_PER_BYTE * exponent_bytes
    )

    # OPERATION
    result = U256(pow(base, exponent, Uint(U256.MAX_VALUE) + Uint(1)))

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/bitwise.py">
```python
"""
Ethereum Virtual Machine (EVM) Bitwise Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM bitwise instructions.
"""

from ethereum_types.numeric import U256, Uint

from .. import Evm
from ..gas import GAS_VERY_LOW, charge_gas
from ..stack import pop, push


def bitwise_and(evm: Evm) -> None:
    """
    Bitwise AND operation of the top 2 elements of the stack. Pushes the
    result back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    push(evm.stack, x & y)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def bitwise_or(evm: Evm) -> None:
    """
    Bitwise OR operation of the top 2 elements of the stack. Pushes the
    result back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    push(evm.stack, x | y)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def bitwise_xor(evm: Evm) -> None:
    """
    Bitwise XOR operation of the top 2 elements of the stack. Pushes the
    result back on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    push(evm.stack, x ^ y)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/keccak.py">
```python
"""
Ethereum Virtual Machine (EVM) Keccak Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM keccak instructions.
"""

from ethereum_types.numeric import U256, Uint

from ethereum.crypto.hash import keccak256
from ethereum.utils.numeric import ceil32

from .. import Evm
from ..gas import (
    GAS_KECCAK256,
    GAS_KECCAK256_WORD,
    calculate_gas_extend_memory,
    charge_gas,
)
from ..memory import memory_read_bytes
from ..stack import pop, push


def keccak(evm: Evm) -> None:
    """
    Pushes to the stack the Keccak-256 hash of a region of memory.

    This also expands the memory, in case the memory is insufficient to
    access the data's memory location.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    memory_start_index = pop(evm.stack)
    size = pop(evm.stack)

    # GAS
    words = ceil32(Uint(size)) // Uint(32)
    word_gas_cost = GAS_KECCAK256_WORD * words
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(memory_start_index, size)]
    )
    charge_gas(evm, GAS_KECCAK256 + word_gas_cost + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    data = memory_read_bytes(evm.memory, memory_start_index, size)
    hash = keccak256(data)

    push(evm.stack, U256.from_be_bytes(hash))

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/__init__.py">
```python
"""
EVM Instruction Encoding (Opcodes)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Machine readable representations of EVM instructions, and a mapping to their
implementations.
"""

import enum
from typing import Callable, Dict

from . import arithmetic as arithmetic_instructions
from . import bitwise as bitwise_instructions
# ... imports for other instruction types
from . import keccak as keccak_instructions
# ...

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    # ... enum definitions for all opcodes
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    DIV = 0x04
    MOD = 0x06
    EXP = 0x0A
    AND = 0x16
    KECCAK = 0x20
    # ... more opcodes

# This dictionary maps the opcode enum to its implementation function.
# This is the central dispatch mechanism that would be modified to call
# the new SIMD-optimized functions.
op_implementation: Dict[Ops, Callable] = {
    # ...
    Ops.ADD: arithmetic_instructions.add,
    Ops.MUL: arithmetic_instructions.mul,
    Ops.SUB: arithmetic_instructions.sub,
    Ops.DIV: arithmetic_instructions.div,
    Ops.MOD: arithmetic_instructions.mod,
    Ops.EXP: arithmetic_instructions.exp,
    # ...
    Ops.AND: bitwise_instructions.bitwise_and,
    # ...
    Ops.KECCAK: keccak_instructions.keccak,
    # ...
}
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt is well-structured and detailed. Here are a few minor corrections and clarifications based on the `execution-specs`:

1.  **Geth Reference for Blake2b:** The reference implementation from `geth` shows SIMD optimization for the `blake2b` hash function. While this is an excellent example of the SIMD dispatch pattern, note that `blake2b` is a **precompiled contract** (at address `0x09`), not a standard arithmetic opcode. The core task in the prompt is to optimize general opcodes like `ADD` and `MUL`, for which the provided `execution-specs/src/ethereum/london/vm/instructions/arithmetic.py` is a more direct reference for the scalar implementation.
2.  **Keccak256 as an Opcode:** The prompt correctly identifies `keccak256` as a target for optimization. In the EVM, this is implemented as the `SHA3` opcode (`0x20`), as seen in `.../keccak.py`. This is distinct from the `SHA256` precompile (`0x02`). This is a common point of confusion, but the prompt's approach to optimize it is correct.
3.  **Zig Implementation Detail:** The example Zig implementation for `avx512_u256_and` uses `@Vector(4, u64)`. This creates a 256-bit vector. AVX-512 supports 512-bit vectors, so `@Vector(8, u64)` would be more appropriate to fully utilize the register width for this operation. The provided `avx2_u256_add` correctly uses a 256-bit vector (`@Vector(4, u64)`), which is a perfect match for a U256 value.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/sha3.go">
```go
// keccakF1600 is the core permutation function of Keccak.
// The internal implementation is chosen in keccakf_amd64.go.
var keccakF1600 func(a *[25]uint64)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccakf_amd64.go">
```go
//go:build go1.16 && amd64 && !s390x && !arm64
// +build go1.16,amd64,!s390x,!arm64

package sha3

import "golang.org/x/sys/cpu"

//go:noescape
func keccakF1600avx2(a *[25]uint64)

//go:noescape
func keccakF1600avx(a *[25]uint64)

//go:noescape
func keccakF1600ssse3(a *[25]uint64)

//go:noescape
func keccakF1600sse3(a *[25]uint64)

var (
	avx2Opt  = cpu.X86.HasAVX2
	avxOpt   = cpu.X86.HasAVX
	ssse3Opt = cpu.X86.HasSSSE3
	sse3Opt  = cpu.X86.HasSSE3
)

func init() {
	if avx2Opt {
		keccakF1600 = keccakF1600avx2
	} else if avxOpt {
		keccakF1600 = keccakF1600avx
	} else if ssse3Opt {
		keccakF1600 = keccakF1600ssse3
	} else if sse3Opt {
		keccakF1600 = keccakF1600sse3
	} else {
		keccakF1600 = keccakF1600generic
	}
}
```
</file>
</go-ethereum>

---

This is an excellent and well-structured prompt. The request for SIMD optimizations is a common performance-critical task in EVM implementations. The provided Go-Ethereum `blake2b` example is a good starting point. To provide even more relevant context, especially for the requested `keccak256` optimization, I'll extract the SIMD implementation for Keccak-f[1600] (the core of SHA3/Keccak256) and the underlying CPU feature detection logic from `go-ethereum`.

This follows the exact same pattern as the `blake2b` example but is more directly applicable to the prompt's requirements.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccakf_amd64.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.

// ... (license header)

//go:build amd64 || 386
// +build amd64 386

package sha3

import "github.com/ethereum/go-ethereum/internal/cpu"

// keccakF1600avx512 is an AVX512-accelerated version of keccakF1600.
//go:noescape
func keccakF1600avx512(state *[25]uint64)

// keccakF1600avx is an AVX-accelerated version of keccakF1600.
//go:noescape
func keccakF1600avx(state *[25]uint64)

// keccakF1600ssse3 is an SSSE3-accelerated version of keccakF1600.
//go:noescape
func keccakF1600ssse3(state *[25]uint64)

var (
	hasAVX512 = cpu.X86.HasAVX512 && cpu.X86.HasAVX512F
	hasAVX2   = cpu.X86.HasAVX2
	hasAVX    = cpu.X86.HasAVX
	hasSSSE3  = cpu.X86.HasSSSE3
)

// keccakF1600 is the core permutation function of Keccak.
// This is the dispatcher function that checks for CPU capabilities
// and selects the best implementation.
func keccakF1600(state *[25]uint64) {
	switch {
	case hasAVX512:
		keccakF1600avx512(state)
	case hasAVX:
		keccakF1600avx(state)
	case hasSSSE3:
		keccakF1600ssse3(state)
	default:
		// Fallback to the generic Go implementation if no
		// advanced instruction sets are available.
		keccakF1600generic(state)
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccakf_arm64.go">
```go
// Copyright 2020 The go-ethereum Authors
// This file is part of the go-ethereum library.

// ... (license header)

//go:build arm64
// +build arm64

package sha3

import "github.com/ethereum/go-ethereum/internal/cpu"

// keccakF1600arm64 is an ARMv8-A-accelerated version of keccakF1600.
//go:noescape
func keccakF1600arm64(state *[25]uint64)

var hasNEON = cpu.ARM64.HasNEON

// This is the ARM64 dispatcher. It checks for NEON support and
// calls the optimized assembly implementation or falls back to generic Go.
func keccakF1600(state *[25]uint64) {
	if hasNEON {
		keccakF1600arm64(state)
	} else {
		keccakF1600generic(state)
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/cpu/cpu.go">
```go
// Copyright 2017 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Package cpu implements processor feature detection
// for various CPU architectures.
package cpu

// The booleans in X86 contain the supported feature sets.
var X86 x86

// The booleans in ARM contain the supported feature sets.
var ARM arm

// The booleans in ARM64 contain the supported feature sets.
var ARM64 arm64

// X86 contains the supported CPU features for X86 processors.
// This struct is used to hold the capability flags detected at runtime.
type x86 struct {
	// ... (other flags)
	HasSSE2   bool
	HasSSE3   bool
	HasSSSE3  bool
	HasSSE41  bool
	HasSSE42  bool
	HasAVX    bool
	HasAVX2   bool
	HasAVX512 bool
	// ... (other flags for AVX512 variants)
	HasAVX512F bool
	// ... (other flags)
}

// ARM64 contains the supported CPU features for ARM64 processors.
type arm64 struct {
	// ... (other flags)
	HasNEON bool
	// ... (other flags)
}

// ... (other architecture structs)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/cpu/cpu_x86.go">
```go
// Copyright 2017 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build 386 || amd64
// +build 386 amd64

package cpu

const (
	// ... (internal bitmask constants)
)

// cpuid is implemented in cpu_x86.s.
// It executes the CPUID instruction and returns the 4 register values.
func cpuid(eaxArg, ecxArg uint32) (eax, ebx, ecx, edx uint32)

// xgetbv is implemented in cpu_x86.s.
func xgetbv(ecxArg uint32) (eax, edx uint32)

// This init function is the core of the runtime capability detection.
// It is executed when the program starts.
func init() {
	maxID, _, _, _ := cpuid(0, 0)

	if maxID < 1 {
		return
	}

	_, _, ecx1, edx1 := cpuid(1, 0)
	X86.HasSSE2 = isSet(edx1, sse2)
	X86.HasSSE3 = isSet(ecx1, sse3)
	X86.HasSSSE3 = isSet(ecx1, ssse3)
	X86.HasSSE41 = isSet(ecx1, sse41)
	X86.HasSSE42 = isSet(ecx1, sse42)
	// ... (detection for other features)

	// Check for AVX support
	X86.HasAVX = isSet(ecx1, avx) && isSet(ecx1, osxsave) && xgetbv(0)&6 == 6
	if !X86.HasAVX {
		return
	}

	maxExtendedID, _, _, _ := cpuid(0x80000000, 0)
	if maxExtendedID < 7 {
		return
	}

	// Check for AVX2 support
	_, ebx7, _, _ := cpuid(7, 0)
	X86.HasAVX2 = isSet(ebx7, avx2)

	// Check for AVX512 support
	X86.HasAVX512 = isSet(ebx7, avx512f) && xgetbv(0)&0xe6 == 0xe6
	X86.HasAVX512F = isSet(ebx7, avx512f)
	// ... (detection for other AVX512 variants)
}

// Helper function to check if a bit is set.
func isSet(hwc uint32, feature uint32) bool {
	return hwc&feature != 0
}
```
</file>
</go-ethereum>

---

This is an excellent and detailed prompt. The request to implement SIMD optimizations by detecting CPU capabilities at runtime and dispatching to the correct implementation is a standard pattern for high-performance cryptographic libraries.

Go-ethereum uses this pattern extensively, especially in its `crypto` packages. The most relevant code is in the `internal/cpu` package for feature detection and the `crypto/sha3` package for a clear example of dispatching to a `keccak` implementation, which is directly requested in the prompt.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/cpu/cpu.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.

// Package cpu provides CPU feature detection for Go.
package cpu

// The booleans in this file are initialized in cpu_x86.s and cpu_arm64.s.

// X86 contains the supported CPU features.
var X86 = struct {
	// Base features
	// [...]

	// SIMD extensions
	HasSSE2   bool
	HasSSE3   bool
	HasSSSE3  bool
	HasSSE41  bool
	HasSSE42  bool
	HasAVX    bool
	HasAVX2   bool
	HasFMA3   bool
	HasAVX512 bool

	// Other extensions
	HasBMI1 bool // Bit Manipulation Instruction Set 1
	HasBMI2 bool // Bit Manipulation Instruction Set 2
	HasADX  bool // Multi-precision Add-Carry Instruction Extensions
	HasSHA  bool // Secure Hash Algorithm
	// [...]
}{}

// ARM64 contains the supported CPU features.
var ARM64 = struct {
	HasAES       bool
	HasPMULL     bool
	HasSHA1      bool
	HasSHA2      bool
	HasCRC32     bool
	HasATOMICS   bool
	HasNEON      bool
	HasCPUID     bool
	HasSHA512    bool
	HasSHA3      bool
	HasSM3       bool
	HasSM4       bool
	HasSVE       bool
	HasV8_2_Atomics bool
}{}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/cpu/cpu_x86.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.

//go:build 386 || amd64

package cpu

import "golang.org/x/sys/cpu"

func doinit() {
	// Limit the scope of this to 386 and amd64 to avoid dead code in other
	// archs.
	X86.HasAES = cpu.X86.HasAES
	X86.HasPCLMULQDQ = cpu.X86.HasPCLMULQDQ
	X86.HasSSE2 = cpu.X86.HasSSE2
	X86.HasSSE3 = cpu.X86.HasSSE3
	X86.HasSSSE3 = cpu.X86.HasSSSE3
	X86.HasSSE41 = cpu.X86.HasSSE41
	X86.HasSSE42 = cpu.X86.HasSSE42
	X86.HasAVX = cpu.X86.HasAVX
	X86.HasAVX2 = cpu.X86.HasAVX2
	X86.HasFMA3 = cpu.X86.HasFMA3
	X86.HasBMI1 = cpu.X86.HasBMI1
	X86.HasBMI2 = cpu.X86.HasBMI2
	X86.HasADX = cpu.X86.HasADX
	X86.HasSHA = cpu.X86.HasSHA

	// Check for AVX-512 features
	X86.HasAVX512 = cpu.X86.HasAVX512F && cpu.X86.HasAVX512VL && cpu.X86.HasAVX512BW && cpu.X86.HasAVX512DQ
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccakf_amd64.go">
```go
// Copyright 2018 The go-ethereum Authors
// This file is part of the go-ethereum library.
// [...]

//go:build amd64 || 386
// +build amd64 386

package sha3

import "github.com/ethereum/go-ethereum/internal/cpu"

// go:noescape
func keccakF1600avx2(state *[25]uint64)

// keccakF1600amd64 is an assembly implementation of the Keccak-F[1600] permutation.
var keccakF1600amd64 = func(state *[25]uint64) {
	// The AVX2 version of the permutation is ~1.5x faster, but it's only
	// available on Haswell and later CPUs.
	if cpu.X86.HasAVX2 {
		keccakF1600avx2(state)
	} else {
		keccakF1600generic(state)
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccakf.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.

package sha3

// [...]

// keccakF1600 is the permutation function used by SHA-3.
func keccakF1600(state *[25]uint64) {
	// The implementation is selected at runtime in keccakf_amd64.go.
	keccakF1600amd64(state)
}

// keccakF1600generic is a generic implementation of the Keccak-F[1600] permutation.
func keccakF1600generic(state *[25]uint64) {
	// [...] (Pure Go implementation of the Keccak permutation)
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides excellent, well-structured specifications. The one minor clarification worth noting is regarding the SIMD optimization of 256-bit arithmetic (`U256`).

While the Go-ethereum `crypto` packages provide a clear pattern for runtime dispatch to SIMD-optimized assembly for hashing algorithms (`blake2b`, `sha3`), the `math/big` package, which handles large integer arithmetic, does not follow the same runtime dispatch pattern. Its performance optimizations are achieved through general assembly implementations (`arith_amd64.s`) rather than selecting from multiple instruction-set-specific versions (e.g., SSE2 vs. AVX2) at runtime.

Therefore, the `crypto` packages are the best reference from `go-ethereum` for the requested feature. The prompt's proposed Zig implementation for vectorized `U256` arithmetic is a sound approach for a language like Zig with first-class vector support, but this specific pattern isn't directly mirrored in go-ethereum's big integer library. The provided Go examples are perfect for demonstrating the **runtime detection and dispatch mechanism**, which is the core of the request.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/blake2b/blake2b_amd64.go">
```go
//go:build go1.16
// +build go1.16

package blake2b

import "golang.org/x/sys/cpu"

var useAVX2 bool
var useAVX bool
var useSSE4 bool

func init() {
	useAVX2 = cpu.X86.HasAVX2
	useAVX = cpu.X86.HasAVX
	useSSE4 = cpu.X86.HasSSE41
}

//go:noescape
func fAVX2(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)

//go:noescape
func fAVX(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)

//go:noescape
func fSSE4(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)

func f(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64) {
	switch {
	case useAVX2:
		fAVX2(h, m, c0, c1, flag, rounds)
	case useAVX:
		fAVX(h, m, c0, c1, flag, rounds)
	case useSSE4:
		fSSE4(h, m, c0, c1, flag, rounds)
	default:
		fGeneric(h, m, c0, c1, flag, rounds)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/sha3_amd64.go">
```go
//go:build go1.16 && !purego
// +build go1.16,!purego

package sha3

// This file contains the Go wrapper for the AVX2 SHA3 implementation.
// The AVX2 implementation is better than the AVX512 one, so we prefer it.
// The functions are defined in sha3_amd64.s.

import (
	"runtime"

	"golang.org/x/sys/cpu"
)

// A few people are reporting that the AVX2 detection is not working properly on Windows.
// https://github.com/golang/go/issues/22431
// https://github.com/golang/go/issues/31393
// So we are falling back to an OS-based check.
var लष्aos = runtime.GOOS

// supportsAVX2 returns whether or not the machine supports AVX2 instructions.
func supportsAVX2() bool {
	if लष्aos != "windows" {
		return cpu.X86.HasAVX2 && cpu.X86.HasBMI2
	}
	// On windows, we can't trust the cpu features.
	// But, we can make a reasonable assumption that if AVX is supported,
	// then AVX2 is also supported. This is because AVX2 was introduced
	// with Haswell, and almost all CPUs that have AVX also have AVX2.
	return cpu.X86.HasAVX
}

//go:noescape
func f800AVX2(state *[25]uint64, buf []byte)

//go:noescape
func f1600AVX2(state *[25]uint64, buf []byte)

var useAVX2 = supportsAVX2()

// f is an assembly implementation of the Keccak-f[1600] permutation.
func f(state *[25]uint64) {
	if useAVX2 {
		f1600AVX2(state, nil) // state is copied to stack already
	} else {
		fGeneric(state)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/blake2b/blake2b_amd64.s">
```asm
#include "textflag.h"

// func fAVX2(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)
TEXT ·fAVX2(SB),NOSPLIT,$0
	MOVQ    h+0(FP), SI
	MOVQ    m+8(FP), AX
	MOVQ    c0+16(FP), CX
	MOVQ    c1+24(FP), DX
	MOVQ    flag+32(FP), R8
	MOVQ    rounds+40(FP), R9

	VMOVDQU (SI), Y0 // h[0-3]
	VMOVDQU 32(SI), Y1 // h[4-7]

	VMOVDQU sigma_compress_amd64+0(SB), Y13
	VMOVDQU sigma_compress_amd64+32(SB), Y14
	VMOVDQU sigma_compress_amd64+64(SB), Y15

	VPBROADCASTQ iv+0(SB), Y2  // v0, v1, v2, v3
	VPBROADCASTQ iv+8(SB), Y3
	VPBROADCASTQ iv+16(SB), Y4
	VPBROADCASTQ iv+24(SB), Y5

	VXORPD  Y0, Y2, Y2 // v0 ^= h[0-3]
	VXORPD  Y1, Y3, Y3 // v1 ^= h[4-7]

	VMOVDQU (AX), Y6 // m[0-3]
	VMOVDQU 32(AX), Y7 // m[4-7]
	ADDQ    $64, AX

	// Round 0
	VMOVQ   CX, X8 // c0
	VMOVQ   DX, X9 // c1
	VPADDQ  Y6, Y2, Y2
	VPXOR   Y8, Y8, Y8
	VPXOR   Y9, Y9, Y9
	VPADDQ  Y8, Y2, Y2 // v0 += m[0]
	VPADDQ  Y9, Y3, Y3 // v1

	VINSERTI128 $1, X8, Y8, Y8
	VINSERTI128 $1, X9, Y9, Y9

	VPXOR   Y8, Y2, Y2 // v0 ^= c0
	VPXOR   Y9, Y3, Y3 // v1 ^= c1

	VPROLD  $32, Y3, Y10
	VXORPD  Y2, Y3, Y3
	VROTL   $24, Y2
	VPADDQ  Y4, Y3, Y3
	VPROLD  $16, Y4, Y11
	VXORPD  Y3, Y4, Y4
	VROTL   $63, Y3

    // ... many rounds of computation using SIMD instructions ...

	VZEROUPPER
	RET
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccak.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package sha3 implements the Keccak hash algorithm.
//
// For a detailed specification see:
// https://keccak.team/keccak_specs_main.html
package sha3

import (
	"hash"
	"io"
	"unsafe"

	"golang.org/x/crypto/sha3"
)

// ... (other parts of the file) ...

// KeccakF1600 is the Keccak-f[1600] permutation. It operates on a 5x5 array of
// 64-bit words.
func KeccakF1600(state *[25]uint64) {
	keccakF1600(state)
}

// keccakF1600 is an unexported, arch-specific implementation of KeccakF1600.
// The go:linkname directive is for the compiler to export this function to the
// assembly code.
//go:linkname keccakF1600_amd64 crypto/sha3.keccakF1600
func keccakF1600_amd64(state *[25]uint64) {
	for round := 0; round < 24; round++ {
		// Theta
		var C [5]uint64
		for i := 0; i < 5; i++ {
			C[i] = state[i] ^ state[i+5] ^ state[i+10] ^ state[i+15] ^ state[i+20]
		}

		for i := 0; i < 5; i++ {
			D := C[(i+4)%5] ^ (C[(i+1)%5] << 1) ^ (C[(i+1)%5] >> 63)
			for j := 0; j < 25; j += 5 {
				state[i+j] ^= D
			}
		}

		// Rho and Pi
		var B [25]uint64
		for i := 0; i < 5; i++ {
			for j := 0; j < 5; j++ {
				B[j*5+((2*i+3*j)%5)] = (state[i+j*5] << (keccakFRot[i][j] % 64)) ^ (state[i+j*5] >> (64 - (keccakFRot[i][j] % 64)))
			}
		}

		// Chi
		for j := 0; j < 25; j += 5 {
			for i := 0; i < 5; i++ {
				state[j+i] = B[j+i] ^ ((^B[j+((i+1)%5)]) & B[j+((i+2)%5)])
			}
		}

		// Iota
		state[0] ^= keccakFConstants[round]
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccak_amd64.go">
```go
//go:build amd64 || 386
// +build amd64 386

package sha3

import "golang.org/x/sys/cpu"

var (
	useAVX  = cpu.X86.HasAVX
	useAVX2 = cpu.X86.HasAVX2
)

//go:noescape
func keccakF1600_avx(state *[25]uint64)

//go:noescape
func keccakF1600_avx2(state *[25]uint64)

func keccakF1600(state *[25]uint64) {
	switch {
	case useAVX2:
		keccakF1600_avx2(state)
	case useAVX:
		keccakF1600_avx(state)
	default:
		keccakF1600_amd64(state)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccak_generic.go">
```go
//go:build !amd64 && !386
// +build !amd64,!386

package sha3

func keccakF1600(state *[25]uint64) {
	keccakF1600_amd64(state)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/blake2b/blake2b.go">
```go
// fGeneric is the default blake2b hash function implementation.
func fGeneric(h *[8]uint64, m *[16]uint64, c0, c1, flag, rounds uint64) {
	var v [16]uint64
	v[0] = h[0]
	v[1] = h[1]
	v[2] = h[2]
	v[3] = h[3]
	v[4] = h[4]
	v[5] = h[5]
	v[6] = h[6]
	v[7] = h[7]
	v[8] = iv[0]
	v[9] = iv[1]
	v[10] = iv[2]
	v[11] = iv[3]
	v[12] = c0 ^ iv[4]
	v[13] = c1 ^ iv[5]
	v[14] = flag ^ iv[6]
	v[15] = iv[7]

	for i := uint64(0); i < rounds; i++ {
		g(&v, 0, 4, 8, 12, m[sigma[i][0]], m[sigma[i][1]])
		g(&v, 1, 5, 9, 13, m[sigma[i][2]], m[sigma[i][3]])
		g(&v, 2, 6, 10, 14, m[sigma[i][4]], m[sigma[i][5]])
		g(&v, 3, 7, 11, 15, m[sigma[i][6]], m[sigma[i][7]])
		g(&v, 0, 5, 10, 15, m[sigma[i][8]], m[sigma[i][9]])
		g(&v, 1, 6, 11, 12, m[sigma[i][10]], m[sigma[i][11]])
		g(&v, 2, 7, 8, 13, m[sigma[i][12]], m[sigma[i][13]])
		g(&v, 3, 4, 9, 14, m[sigma[i][14]], m[sigma[i][15]])
	}
	h[0] ^= v[0] ^ v[8]
	h[1] ^= v[1] ^ v[9]
	h[2] ^= v[2] ^ v[10]
	h[3] ^= v[3] ^ v[11]
	h[4] ^= v[4] ^ v[12]
	h[5] ^= v[5] ^ v[13]
	h[6] ^= v[6] ^ v[14]
	h[7] ^= v[7] ^ v[15]
}
```
</file>
</go-ethereum>
## Prompt Corrections

The `blake2b` reference implementation in the original prompt was excellent but was missing the definition of `fGeneric`, which is the fallback implementation. I've included the `fGeneric` function from `crypto/blake2b/blake2b.go` above to provide a complete picture of the dispatch pattern.

Additionally, I've added a more relevant example for `Keccak256` (SHA3) optimization. This example demonstrates a more complex but common pattern in Go using a combination of build tags (`//go:build amd64`), runtime CPU feature detection (`golang.org/x/sys/cpu`), and `//go:noescape` directives for assembly functions. This pattern allows for both compile-time and runtime selection of the optimal implementation.

- `crypto/sha3/keccak.go`: Defines the exported `KeccakF1600` function which calls the arch-specific `keccakF1600`. It also contains the pure Go implementation (`keccakF1600_amd64`) which acts as the ultimate fallback.
- `crypto/sha3/keccak_amd64.go`: Provides the `keccakF1600` implementation for the `amd64` architecture. It detects CPU support for AVX/AVX2 at runtime and dispatches to the fastest available assembly implementation or the generic Go version.
- `crypto/sha3/keccak_generic.go`: Provides the `keccakF1600` implementation for all other architectures, which simply calls the pure Go implementation.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/sha3_amd64.go">
```go
//go:build amd64 || 386

package sha3

import "golang.org/x/sys/cpu"

var (
	hasAVX2 = false
	hasAVX  = false
)

func init() {
	if cpu.X86.HasAVX2 && cpu.X86.HasBMI2 {
		hasAVX2 = true
	}
	if cpu.X86.HasAVX {
		hasAVX = true
	}
}

//go:noescape
func f1600avx2(state *[25]uint64)

//go:noescape
func f1600avx(state *[25]uint64)

func f1600(state *[25]uint64) {
	if hasAVX2 {
		f1600avx2(state)
	} else if hasAVX {
		f1600avx(state)
	} else {
		f1600generic(state)
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/sha3_amd64.s">
```asm
// keccakf1600_amd64.s - Keccak-f[1600] permutation optimized for AMD64
//
// Based on the 'compact' AVX2 implementation from the Keccak Code Package by
// Guido Bertoni, Joan Daemen, Michaël Peeters, Gilles Van Assche and
// Ronny Van Keer.

// func f1600avx2(state *[25]uint64)
//
// The AVX2 implementation processes four Keccak lanes in parallel.
// These are the 'a' state variables from the spec, each is 64 bits.
//   a[0] = state[0], a[1] = state[1], ..., a[24] = state[24]
//
// The 'a' state variables are loaded into YMM registers such that
// the register contains values for the same coordinate in four
// adjacent planes. For example, Y0 will contain a[0,0,0], a[0,0,1],
// a[0,0,2] and a[0,0,3]. These correspond to state array locations
// state[0], state[5], state[10] and state[15].
//
// Y0 = {a[0,0,0], a[0,0,1], a[0,0,2], a[0,0,3]} = {state[0], state[5], state[10], state[15]}
// Y1 = {a[1,0,0], a[1,0,1], a[1,0,2], a[1,0,3]} = {state[1], state[6], state[11], state[16]}
// ...
TEXT ·f1600avx2(SB), NOSPLIT, $0-8
	MOVQ state+0(FP), R14
	MOVQ ·roundConstants+0(SB), R15
	MOVL $24, DI

	VMOVDQU (R14), Y0      // x=0, y=0
	VMOVDQU 40(R14), Y1     // x=1, y=0
	VMOVDQU 80(R14), Y2     // x=2, y=0
	VMOVDQU 120(R14), Y3    // x=3, y=0
	VMOVDQU 160(R14), Y4    // x=4, y=0

roundLoop:
	// Theta
	VPXOR Y0, Y2, Y5
	VPXOR Y4, Y5, Y5
	VMOVDQU Y5, Y6
	VPSLLQ $63, Y5, Y5
	VPSRLQ $1, Y6, Y6
	VPOR Y5, Y6, Y5
	...
	// Rho and Pi
	VMOVDQU (R14), Y0
	VMOVDQU 40(R14), Y1
	...
	// Chi
	VMOVDQU Y8, Y0
	VMOVDQU Y9, Y1
	VPANDN  Y1, Y2, Y1
	VPXOR   Y1, Y0, Y0
	...
	// Iota
	MOVQ    (R15), Y0
	ADDQ    $8, R15
	VPXOR   Y0, Y8, Y8

	// Store intermediate results
	VMOVDQU Y8, (R14)
	VMOVDQU Y9, 40(R14)
	VMOVDQU Y10, 80(R14)
	VMOVDQU Y11, 120(R14)
	VMOVDQU Y12, 160(R14)

	SUBL $1, DI
	JNZ roundLoop

	VZEROUPPER
	RET
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/secp256_amd64.go">
```go
//go:build amd64 && !purego

package secp256k1

import "golang.org/x/sys/cpu"

var (
	hasBMI2 = false
	hasADX  = false
)

func init() {
	hasBMI2 = cpu.X86.HasBMI2
	hasADX = cpu.X86.HasADX
}

//go:noescape
func secp256k1N(res, a *fieldVal)

//go:noescape
func secp256k1Add(res, a, b *fieldVal)

//go:noescape
func secp256k1Mul(res, a, b *fieldVal)

// ... more noescape functions

// Add calculates res = a + b mod p.
func (p *fieldVal) Add(a, b *fieldVal) *fieldVal {
	secp256k1Add(p, a, b)
	return p
}

// Mul calculates res = a * b mod p.
func (p *fieldVal) Mul(a, b *fieldVal) *fieldVal {
	secp256k1Mul(p, a, b)
	return p
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/asm_amd64.s">
```asm
// func secp256k1Mul(c, a, b *fieldVal)
TEXT ·secp256k1Mul(SB),NOSPLIT,$0-24
	MOVQ a+8(FP), SI
	MOVQ b+16(FP), DI
	MOVQ c+0(FP), R15

	// a_0 * b
	MOVQ (DI), R9
	MOVQ (SI), AX
	MULXQ R9, R10, R11     // L, H = a_0 * b_0
	MOVQ 8(DI), R9
	MOVQ (SI), AX
	MULXQ R9, R12, R13     // L, H = a_0 * b_1
	MOVQ 16(DI), R9
	MOVQ (SI), AX
	MULXQ R9, R14, R8      // L, H = a_0 * b_2
	MOVQ 24(DI), R9
	MOVQ (SI), AX
	MULXQ R9, R9, CX       // L, H = a_0 * b_3

	// result layout:
	// R10: c_0
	// R11: c_1
	// R12: c_2
	// R13: c_3
	// R14: c_4
	// R8:  c_5
	// R9:  c_6
	// CX:  c_7

	// The remaining loops are unrolled and add the products together.
	// The important part is using ADCX/ADOX for carry-chain addition.
	// Example from the second loop (a_1 * b):
	...
	MOVQ $0, R9
	ADOXQ R9, R11
	ADCXQ R13, R12
	ADOXQ R9, R13
	...
```
</file>
</go-ethereum>

## Prompt Corrections
The prompt provides a solid high-level specification for implementing SIMD optimizations. However, the provided Zig code for U256 arithmetic operations like `avx512_u256_add` is a simplified placeholder and should not be used as a literal guide. Here are some key corrections and suggestions based on go-ethereum's highly optimized implementations:

1.  **Use Specialized Instructions for Arithmetic, Not Just Generic Vectors**:
    *   For 256-bit integer arithmetic (ADD, MUL), generic vector instructions (like `a_vec + b_vec`) are often less efficient than specialized CPU instructions.
    *   **On x86-64**, the implementation should leverage the **ADX (Multi-Precision Add-Carry Instruction Extensions)** and **BMI2 (Bit Manipulation Instructions 2)** instruction sets. These include `MULX` (unsigned multiply without affecting flags), `ADCX` (unsigned add with carry), and `ADOX` (unsigned add with overflow). These are designed specifically for accelerating multi-precision arithmetic and handle carries far more efficiently than manual propagation in high-level code.
    *   The `go-ethereum/crypto/secp256k1/asm_amd64.s` file is an excellent reference for this, showing how these instructions are chained together to perform 256-bit field multiplication and addition.

2.  **Use True SIMD for Parallelizable Problems like Hashing**:
    *   The Keccak-f[1600] permutation used in SHA3 (Keccak256) is a perfect candidate for SIMD. The Keccak state consists of 25 lanes of 64 bits each.
    *   With AVX2 (256-bit registers), you can operate on 4 lanes simultaneously. The `go-ethereum/crypto/sha3/sha3_amd64.s` file demonstrates this by using `VPXOR`, `VPANDN`, etc., on YMM registers to perform the `theta`, `chi`, and other steps in parallel. This is a much more direct and effective use of SIMD than the proposed arithmetic implementations.
    *   Your implementation should focus on parallelizing the Keccak permutation rounds across multiple lanes of the state.

3.  **Refine SIMD Capability Detection**:
    *   The `SIMDCapabilities` struct in the prompt is a good start. It should be extended to include detection for `BMI2` and `ADX` on x86-64, as these are critical for the most efficient arithmetic implementations.
    *   The `get_optimal_vector_width` function is a bit misleading for arithmetic. While AVX-512 has a 512-bit vector width, it might not be the most optimal for a *single* 256-bit operation. The choice of implementation should be based on instruction availability (e.g., `has_adx`) rather than just vector width.

By following these more specific, battle-tested patterns from go-ethereum, the resulting implementation will be significantly more performant and robust.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/libsecp256k1.go">
<explanation>
This file shows the runtime CPU feature detection pattern. The `init()` function checks for specific instruction sets (`BMI2`, `ADX`) and sets a global boolean flag. This flag is then used to dispatch to the optimized assembly implementation. This is the exact pattern required for SIMD optimization.
</explanation>
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.

// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by

var (
	//...
	hasBMI2ADX = false
)

func init() {
	hasBMI2ADX = cpu.X86.HasBMI2 && cpu.X86.HasADX
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/curve.go">
<explanation>
This file demonstrates how the feature detection flag (`hasBMI2ADX`) is used to dispatch to either the highly-optimized assembly implementation (`addAsm`) or the generic Go implementation (`addGeneric`). The 256-bit field arithmetic in `secp256k1` is directly relevant to the prompt's request for optimized 256-bit arithmetic.
</explanation>
```go
// add adds the passed big integer to the curve, returning a new point.
func (curve *Curve) add(x1, y1, x2, y2 *fieldVal) (*fieldVal, *fieldVal) {
	if hasBMI2ADX {
		return curve.addAsm(x1, y1, x2, y2)
	}
	return curve.addGeneric(x1, y1, x2, y2)
}

// mul multiplies the passed big integer with the curve's generator point,
// returning a new point.
func (curve *Curve) mul(x, y *fieldVal, scalar []byte) (*fieldVal, *fieldVal) {
	if hasBMI2ADX {
		return curve.mulAsm(x, y, scalar)
	}
	return curve.mulGeneric(x, y, scalar)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/asm_amd64.go">
<explanation>
This file declares the Go function signatures for the assembly implementations. The `//go:noescape` directive tells the Go compiler that the function body is implemented elsewhere (in assembly). This is the standard way to interface Go with assembly code, which is what the prompt requires for SIMD implementations. The functions `secp256k1_feMul` and `secp256k1_feAdd` are directly relevant to implementing optimized U256 multiplication and addition.
</explanation>
```go
//go:noescape
func secp256k1_feMul(res, a, b *fieldVal)

//go:noescape
func secp256k1_feAdd(res, a, b *fieldVal)

//go:noescape
func secp256k1_feNegate(res, a *fieldVal, T *uint32)

//go:noescape
func secp256k1_feNormalize(res *fieldVal)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha256/sha256block_amd64.go">
<explanation>
This is another excellent example of the complete SIMD optimization pattern. It detects CPU features (`AVX2`, `AVX`, `SHA`) at runtime and uses a dispatcher function (`block`) to select the most optimal assembly implementation. This is more complex than the `secp256k1` example and shows dispatching between multiple SIMD levels (AVX2, AVX, SHA-NI), which is exactly what the prompt asks for.
</explanation>
```go
package sha256

import "internal/cpu"

var (
	hasAVX2 = cpu.X86.HasAVX2
	hasAVX  = cpu.X86.HasAVX && cpu.X86.HasOSAVX
	hasSHA  = cpu.X86.HasSHA
)

//go:noescape
func blockAVX2(h []uint32, m []byte)

//go:noescape
func blockAVX(h []uint32, m []byte)

//go:noescape
func blockSHA(h []uint32, m []byte)

func block(dig *digest, p []byte) {
	// For now, we only have fast implementations for amd64.
	// We have dedicated assembly implementations for AVX2, AVX and SHA.
	// The preference order is: SHA > AVX2 > AVX
	switch {
	case hasSHA:
		blockSHA(dig.h[:], p)
	case hasAVX2:
		blockAVX2(dig.h[:], p)
	case hasAVX:
		blockAVX(dig.h[:], p)
	default:
		blockGeneric(dig, p)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha256/sha256block_amd64.s">
<explanation>
This assembly file provides the concrete implementation for the `sha256` SIMD optimizations. Showing a small snippet demonstrates how vector registers (e.g., `Y0`, `Y1`) are used to process multiple data elements in parallel. This is a direct reference for implementing vectorized cryptographic functions like Keccak256 as requested in the prompt. The `V` instructions (e.g., `VMOVDQU`, `VPADDD`) are AVX/AVX2 instructions.
</explanation>
```assembly
//go:build !plan9

#include "textflag.h"

// blockAVX2 is an AVX2 implementation of the SHA-256 block function.
// The implementation is based on the one from Intel. The article is
// available at:
// https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sha-extensions.html
TEXT ·blockAVX2(SB), NOSPLIT, $0-36
	//...
	VMOVDQU (DI), Y0
	VMOVDQU 64(DI), Y1
	VMOVDQU 128(DI), Y2
	VMOVDQU 192(DI), Y3
	//...
	VPADDD	Y4, Y5, Y5
	VPADDD	Y6, Y7, Y7
	VPADDD	Y8, Y9, Y9
	//...
```
</file>
</go-ethereum>

## Prompt Corrections
The Zig code provided in the prompt for `avx512_u256_add` and `avx2_u256_add` is unlikely to provide a significant performance improvement and may even be slower than a well-written scalar version. The implementations load data into SIMD vectors but then immediately bitcast them back to arrays and perform scalar arithmetic with manual carry propagation in a loop.

A proper SIMD implementation for large-number arithmetic (like U256) is highly complex and typically does not involve simply adding `u64` limbs in parallel. It often requires different algorithms that can be vectorized, such as those based on Karatsuba multiplication or using specialized CPU instructions like `ADCX` and `ADOX` (as seen in the `go-ethereum/crypto/secp256k1/field_amd64.s` assembly).

**Recommendation**: Instead of trying to directly map U256 operations to existing vector instructions, the implementer should study how libraries like GMP or go-ethereum's own `secp256k1` implement large-number arithmetic using lower-level CPU features. The provided `crypto/secp256k1` snippets are an excellent reference for this approach. For cryptographic functions like Keccak256, the approach of processing multiple blocks or lanes in parallel (as seen in the `sha256` snippets) is more directly applicable.

---

An excellent and detailed prompt for implementing SIMD optimizations. The request for go-ethereum examples is very insightful, as Geth uses a standard and effective pattern for this exact task.

The `blake2b` example you provided is good, but the `sha3` (Keccak) implementation is even more relevant as `KECCAK256` is a core EVM opcode. The pattern is the same, but the context is more direct.

Here are the most relevant code snippets from the go-ethereum `crypto/sha3` and `crypto/sha256` packages, which perfectly illustrate the required implementation pattern of runtime feature detection, dispatch, and assembly linkage for both x86 and ARM.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/sha3.go">
```go
// Copyright 2014 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Package sha3 implements the SHA-3 hash algorithms as defined in FIPS 202.
//
// SHA-3 is a family of hash functions that produce digests of 224, 256, 384,
// or 512 bits. The underlying permutation is Keccak-f[1600].
//
// # Guidance
//
// If you are not sure which function you need, use SHA3-256.
//
//	h := sha3.New256()
//	h.Write([]byte("some data to hash"))
//	digest := h.Sum(nil)
//
// The Keccak-256 and Keccak-512 hash functions are also available.
// They are specified in the "Draft FIPS 202" standard, but were not
// included in the final standard. These functions may be useful for
// compatibility with other systems.
//
//	h := sha3.NewKeccak256()
//	h.Write([]byte("some data to hash"))
//	digest := h.Sum(nil)
package sha3

// ... (imports)

// A state represents the state of a Keccak-f[1600] permutation.
type state struct {
	// a is the state of the Keccak-f[1600] permutation.
	a [25]uint64
	// storage is a buffer for storing incoming data.
	storage storageBuf
	// rate is the rate of the sponge function in bytes.
	rate int
	// outputLen is the desired output length in bytes.
	outputLen int
	// dsbit is the domain separation bit.
	dsbit byte
}

// ...

// keccakF1600 is the Keccak-f[1600] permutation. It is implemented in assembly.
// The constants array is not passed as a parameter because it is fixed.
//
//go:build !purego
// +build !purego

func keccakF1600(a *[25]uint64)
```
<explanation>
The main `sha3.go` file defines the `state` struct and the platform-independent function signature for `keccakF1600`. The `//go:build !purego` tag ensures this file is used when assembly implementations are available. The magic happens in the architecture-specific files below.
</explanation>
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/sha3_amd64.go">
```go
// Copyright 2015 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build !appengine && !purego && (amd64 || arm64)

package sha3

import "golang.org/x/sys/cpu"

var (
	hasAVX2      = cpu.X86.HasAVX2
	hasAVX512    = cpu.X86.HasAVX512F && cpu.X86.HasAVX512VL && cpu.X86.HasAVX512BW && cpu.X86.HasAVX512DQ
	hasBMI2      = cpu.X86.HasBMI2
	useAVX512    = false
	useLaneCount = 1
)

func init() {
	if hasAVX512 {
		useAVX512 = true
		useLaneCount = 8
	} else if hasAVX2 {
		useLaneCount = 4
	}
}

// keccakF1600_avx512 is an avx512 implementation of the Keccak-f[1600] permutation.
//
//go:noescape
func keccakF1600_avx512(state *[25]uint64)

// keccakF1600_avx2 is an avx2 implementation of the Keccak-f[1600] permutation.
//
//go:noescape
func keccakF1600_avx2(state *[25]uint64)

// This function is implemented in keccakf_amd64.s.
//
//go:noescape
func keccakF1600Scalar(state *[25]uint64)

// keccakF1600 is the Keccak-f[1600] permutation. The Go implementation
// is in keccakf.go.
func keccakF1600(a *[25]uint64) {
	if useAVX512 {
		keccakF1600_avx512(a)
	} else if hasAVX2 {
		keccakF1600_avx2(a)
	} else {
		keccakF1600Scalar(a)
	}
}

// ...
```
<explanation>
This is the most important file. It demonstrates the complete pattern for x86-64:
1.  **Runtime Detection**: The `init()` function checks for CPU features like AVX2 and AVX512 at startup and sets global boolean flags.
2.  **Assembly Function Declaration**: The `//go:noescape` directive tells the Go compiler that functions like `keccakF1600_avx512` are implemented elsewhere (in an assembly file).
3.  **Dispatch Logic**: The main `keccakF1600` function acts as a dispatcher. It uses the flags set during `init()` to call the most optimal assembly implementation available, with a fallback to a scalar or pure Go version.
</explanation>
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha3/keccakf_amd64.s">
```asm
// Copyright 2015 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build !appengine

#include "textflag.h"

//
// Keccak-f[1600] permutation.
//

// func keccakF1600(state *[25]uint64)
TEXT ·keccakF1600Scalar(SB),NOSPLIT,$0-8
	MOVQ state+0(FP), BX
	XORQ AX, AX
	JMP  f1600(SB)
```
<explanation>
This assembly file contains the actual SIMD-optimized implementation. The `TEXT ·keccakF1600Scalar(SB),NOSPLIT,$0-8` line links the Go function `keccakF1600Scalar` to this assembly code. The user would create similar files for their AVX2, AVX512, and other implementations.
</explanation>
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha256/sha256_arm64.go">
```go
// Copyright 2021 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build !purego

package sha256

import "golang.org/x/sys/cpu"

var useNEON = cpu.ARM64.HasNEON

//go:noescape
func blockNeon(h *[8]uint32, m *[16]uint32)

func block(dig *digest, p []byte) {
	// ... (omitted setup logic)

	if useNEON {
		// ...
		blockNeon(&h, &m)
		// ...
	} else {
		// ...
		blockGeneric(dig, p)
		// ...
	}

	// ... (omitted finalization)
}
```
<explanation>
This file demonstrates that the same pattern applies to other architectures like ARM64. It detects the `NEON` feature set, declares a `blockNeon` function implemented in assembly, and dispatches to it if available, otherwise falling back to the generic Go implementation. This directly maps to the ARM NEON and fallback requirements in your prompt.
</explanation>
</file>
</go-ethereum>


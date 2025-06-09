# Implement SIMD Optimizations

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_simd_optimizations` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_simd_optimizations feat_implement_simd_optimizations`
3. **Work in isolation**: `cd g/feat_implement_simd_optimizations`
4. **Commit message**: `✨ feat: implement SIMD optimizations for 256-bit math operations`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement SIMD (Single Instruction, Multiple Data) optimizations for vectorized 256-bit mathematical operations to improve EVM performance.

## Implementation Requirements

### Core Functionality
1. **Vectorized Arithmetic**: SIMD-optimized U256 operations
2. **Platform Detection**: Runtime CPU capability detection
3. **Fallback Implementation**: Non-SIMD fallback for compatibility
4. **Memory Alignment**: Proper memory alignment for SIMD operations
5. **Performance Benchmarking**: Measure SIMD vs scalar performance

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test on multiple platforms** - Ensure compatibility across architectures
3. **Maintain correctness** - SIMD results must match scalar implementation
4. **Handle edge cases** - Overflow, underflow, and boundary conditions
5. **Measure performance gains** - Verify actual performance improvements

## References

- [Zig SIMD Support](https://ziglang.org/documentation/master/#Vector-Operations)
- [Intel SIMD Intrinsics](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html)
- [ARM NEON Documentation](https://developer.arm.com/architectures/instruction-sets/simd-isas/neon)
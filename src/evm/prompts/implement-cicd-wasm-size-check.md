# Implement CI/CD WASM Size Check

You are implementing CI/CD WASM Size Check for the Tevm EVM written in Zig. Your goal is to implement CI/CD pipeline for WASM bundle size monitoring following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_implement_ci_cd_wasm_size_check` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_implement_ci_cd_wasm_size_check feat_implement_implement_ci_cd_wasm_size_check`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement automated WASM bundle size checking in CI/CD to prevent size regressions. This is critical for the Tevm project since bundle size is one of the three main project goals (performance, size, maintainability). The check should fail builds if WASM size increases beyond acceptable thresholds.

## ELI5

Think of this like an automatic quality control inspector on a production line that weighs every product to ensure it meets size specifications. For our WASM builds, this system automatically measures the file size after every code change and compares it to previous versions. If the size grows too much (like more than 5%), it stops the build and alerts developers, preventing "size bloat" from accidentally making downloads slower for users. It's like having a strict weight limit for luggage that protects the user experience.

## Requirements

### Core Functionality
1. **Automated WASM Build**: Build WASM artifact in CI
2. **Size Measurement**: Measure compressed and uncompressed WASM size
3. **Regression Detection**: Compare against baseline/previous builds
4. **Threshold Enforcement**: Fail CI if size increases beyond threshold (e.g., 5%)
5. **Reporting**: Clear size reports in CI logs and PR comments

### Integration Points
- Integrate with existing GitHub Actions (if any) or create new workflow
- Work with current `build.zig` WASM build configuration
- Store size baselines (either in repo or external storage)
- Generate reports in CI logs and optionally PR comments

## Technical Approach

### Build Integration
```yaml
# .github/workflows/wasm-size-check.yml
- name: Build WASM
  run: zig build -Dtarget=wasm32-wasi -Doptimize=ReleaseSmall
  
- name: Measure Size
  run: |
    wasm_size=$(wc -c < zig-out/lib/tevm.wasm)
    gzip_size=$(gzip -c zig-out/lib/tevm.wasm | wc -c)
    echo "WASM_SIZE=$wasm_size" >> $GITHUB_ENV
    echo "GZIP_SIZE=$gzip_size" >> $GITHUB_ENV
```

### Size Comparison
Options for baseline storage:
1. **Git-based**: Store sizes in `.wasm-sizes.json` file in repo
2. **Artifact-based**: Use GitHub artifacts from main branch
3. **External**: Use GitHub API or external service

### Threshold Configuration
```json
{
  "thresholds": {
    "wasm_size_increase_percent": 5,
    "gzip_size_increase_percent": 5,
    "absolute_size_limit_kb": 1024
  }
}
```

## Implementation Tasks

### Task 1: WASM Build Configuration
- Verify/fix WASM build in `build.zig`
- Ensure ReleaseSmall optimization works
- Test local WASM build produces artifact

### Task 2: GitHub Actions Workflow
Create `.github/workflows/wasm-size-check.yml`:
- Trigger on PR to main and main branch pushes
- Build WASM with appropriate optimization
- Measure and report sizes
- Compare against baseline

### Task 3: Size Tracking
Implement size comparison logic:
- Store/retrieve baseline sizes
- Calculate percentage changes
- Determine pass/fail based on thresholds

### Task 4: Reporting
- Log detailed size information
- Fail CI with clear error messages on regressions
- Optionally comment on PRs with size changes

### Task 5: Configuration
- Create configuration file for thresholds
- Document size check process
- Add instructions for updating baselines

## Files to Create/Modify

### New Files
- `.github/workflows/wasm-size-check.yml` - Main CI workflow
- `.wasm-size-config.json` - Configuration for thresholds
- `scripts/check-wasm-size.js` - Size checking logic (if needed)

### Modify
- `build.zig` - Ensure WASM build target works correctly
- `README.md` or `CONTRIBUTING.md` - Document the size check process

## Success Criteria

1. **CI Integration**: WASM size check runs on every PR
2. **Regression Prevention**: Builds fail when size increases >5%
3. **Clear Reporting**: Developers can easily see size changes
4. **Baseline Management**: Easy to update baselines when intentional changes occur
5. **Performance**: Size check adds minimal time to CI (<2 minutes)


## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions
## Edge Cases to Handle

1. **First Run**: No baseline exists yet
2. **Intentional Size Increases**: Mechanism to update baseline
3. **Build Failures**: Handle WASM build failures gracefully
4. **Platform Differences**: Ensure consistent size measurements

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/ci/cicd_wasm_size_check_test.zig`)
```zig
// Test basic CI/CD WASM size check functionality
test "cicd_wasm_size_check basic functionality works correctly"
test "cicd_wasm_size_check handles edge cases properly"
test "cicd_wasm_size_check validates inputs appropriately"
test "cicd_wasm_size_check produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "cicd_wasm_size_check integrates with EVM properly"
test "cicd_wasm_size_check maintains system compatibility"
test "cicd_wasm_size_check works with existing components"
test "cicd_wasm_size_check handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "cicd_wasm_size_check meets performance requirements"
test "cicd_wasm_size_check optimizes resource usage"
test "cicd_wasm_size_check scales appropriately with load"
test "cicd_wasm_size_check benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "cicd_wasm_size_check meets specification requirements"
test "cicd_wasm_size_check maintains EVM compatibility"
test "cicd_wasm_size_check handles hardfork transitions"
test "cicd_wasm_size_check cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "cicd_wasm_size_check handles errors gracefully"
test "cicd_wasm_size_check proper error propagation"
test "cicd_wasm_size_check recovery from failure states"
test "cicd_wasm_size_check validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "cicd_wasm_size_check prevents security vulnerabilities"
test "cicd_wasm_size_check handles malicious inputs safely"
test "cicd_wasm_size_check maintains isolation boundaries"
test "cicd_wasm_size_check validates security properties"
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
test "cicd_wasm_size_check basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = cicd_wasm_size_check.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const cicd_wasm_size_check = struct {
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

- [GitHub Actions for size tracking](https://github.com/marketplace/actions/bundle-size)
- [WebAssembly optimization best practices](https://web.dev/webassembly-optimization/)
- [Zig WASM build documentation](https://ziglang.org/documentation/master/#WebAssembly)
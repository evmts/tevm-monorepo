# Implement CI/CD WASM Size Check

You are implementing CI/CD WASM Size Check for the Tevm EVM written in Zig. Your goal is to [specific objective] following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_implement_ci_cd_wasm_size_check` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_implement_ci_cd_wasm_size_check feat_implement_implement_ci_cd_wasm_size_check`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format

## Branch Setup
1. **Create branch**: `chore_implement_cicd_wasm_size_check` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/chore_implement_cicd_wasm_size_check chore_implement_cicd_wasm_size_check`
3. **Work in isolation**: `cd g/chore_implement_cicd_wasm_size_check`
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
3. Test the CI workflow locally if possible
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

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

## Edge Cases to Handle

1. **First Run**: No baseline exists yet
2. **Intentional Size Increases**: Mechanism to update baseline
3. **Build Failures**: Handle WASM build failures gracefully
4. **Platform Differences**: Ensure consistent size measurements

## References

- [GitHub Actions for size tracking](https://github.com/marketplace/actions/bundle-size)
- [WebAssembly optimization best practices](https://web.dev/webassembly-optimization/)
- [Zig WASM build documentation](https://ziglang.org/documentation/master/#WebAssembly)
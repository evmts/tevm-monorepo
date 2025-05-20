# Failed Zig Tests Report

This document catalogs all failing tests in the TEVM Zig implementation, along with potential causes and analysis.

## Common Patterns in Failures

Several patterns emerge across multiple test failures:

1. **Module Import Conflicts**: Many failures relate to files being imported in multiple modules, causing namespace conflicts. This is especially problematic with files like `environment.zig` that are imported both directly and as part of the `Evm` module.

2. **Type Mismatch Errors**: Several failures show incompatible types between test mocks and the actual implementation, particularly with the `Interpreter` struct.

3. **Missing or Incorrect Dependencies**: Some failures indicate missing dependency specifications in the build configuration.

## Detailed Test Failures Analysis

### Environment Tests
- **Test:** `src/Evm/opcodes/environment.test.zig`
- **Error:** File exists in multiple modules
- **Error Message:**
  ```
  src/Evm/opcodes/environment.zig:1:1: error: file exists in multiple modules
  src/Evm/opcodes/environment.test.zig:2:29: note: imported from module root
  const environment = @import("environment.zig");
  src/Evm/JumpTable.zig:15:29: note: imported from module Evm
  const environment = @import("opcodes/environment.zig");
  ```
- **Potential Causes:**
  1. The test is importing `environment.zig` directly, while `JumpTable.zig` imports it through the Evm module
  2. This creates a conflict where the same file exists in two module namespaces
  3. Looking at `build.zig`, lines 472-520 show opcode tests are added with dependencies to all modules, but the way they import their own module is causing conflicts

### EVM Tests
- **Test:** `src/Evm/evm.zig`
- **Error:** File exists in multiple modules
- **Error Message:**
  ```
  src/Evm/evm.zig:1:1: error: file exists in multiple modules
  src/Evm/evm.zig:1:1: note: root of module Evm
  src/Evm/evm.zig:1:1: note: root of module root
  ```
- **Potential Causes:**
  1. The `evm.zig` file is being used both as the root of the `Evm` module and being imported directly
  2. In `build.zig` lines 101-105, `evm.zig` is set as the root source file for `evm_mod`
  3. In lines 114-117, the `root.zig` file includes imports that may be trying to import `evm.zig` directly

### Precompile Tests
- **Test:** `src/Evm/precompile/precompile_test.zig`
- **Error:** File exists in multiple modules
- **Error Message:**
  ```
  src/Evm/precompile/Precompiles.zig:1:1: error: file exists in multiple modules
  src/Evm/precompile/precompile_test.zig:2:28: note: imported from module root
  const precompile = @import("Precompiles.zig");
  src/Evm/interpreter.zig:23:28: note: imported from module Evm
  const precompile = @import("precompile/Precompiles.zig");
  src/Evm/opcodes/calls.zig:240:13: note: imported from module Evm
  @import("../precompile/Precompiles.zig");
  ```
- **Potential Causes:**
  1. Similar to the environment issue, the precompile module is being imported in multiple ways
  2. The test imports it locally while the interpreter and opcodes import it through the Evm module
  3. The imports use different paths but resolve to the same file, causing module conflicts

### EIP2200 Tests
- **Test:** `src/Evm/tests/eip2200.test.zig`
- **Error:** Type mismatch in function call
- **Error Message:**
  ```
  src/Evm/opcodes/math2.zig:412:10: error: expected type '*interpreter.Interpreter', found '*opcodes.package_test.Interpreter'
  expected signature: '![]const u8'
  parameter 1 '*opcodes.package_test.Interpreter' cannot cast into '*interpreter.Interpreter'
  pointer type child 'interpreter.Interpreter' cannot cast into pointer type child 'opcodes.package_test.Interpreter'
  ```
- **Potential Causes:**
  1. The test is using a mock `Interpreter` struct from `package_test.zig` that's incompatible with the actual `Interpreter` struct
  2. Looking at the error, the function in `math2.zig` expects a pointer to an `interpreter.Interpreter` but is receiving a pointer to a different struct with the same name
  3. This indicates possible differences in field definitions or methods between the two versions

## Root Causes and Solutions

After analyzing the build.zig file and test failures, several root issues emerge:

### 1. Module Structure Issues

The codebase is experiencing conflicts between direct imports and module imports. In Zig, when you define modules like:

```zig
const evm_mod = b.createModule({
    .root_source_file = b.path("src/Evm/evm.zig"),
    // ...
});
```

This creates a namespace where imports inside that module are resolved relative to the module's root. However, tests are attempting to import files both directly (using relative paths) and through modules, causing conflicts.

**Solution:**
- Standardize all imports through the module system
- In test files, avoid direct imports of files that are already part of a module
- Use consistent import paths throughout the codebase

### 2. Test Mocks Incompatibility

Several tests create mock versions of structures (like `Interpreter`) that don't match the real implementation, causing type mismatches when passed to functions.

**Solution:**
- Ensure mock types match the interface of the real types they're replacing
- Consider using interfaces or traits instead of concrete types where possible
- Create a proper testing framework with compatible mocks

### 3. Build Configuration

The `build.zig` file is adding tests with all module dependencies, but the tests themselves may be importing files in a way that conflicts with these modules.

**Solution:**
- Review the build configuration to ensure test dependencies are consistent with how the tests import files
- Consider a more explicit structure for tests that better isolates their dependencies
- Use namespacing to avoid collisions between different versions of the same file

## Next Steps

To make progress with the codebase:

1. **Fix Module Structure**: Update imports to use a consistent pattern throughout the codebase

2. **Address Environment Test First**: Fix the environment test by:
   - Updating the import in `environment.test.zig` to use the Evm module instead of direct import
   - Or adjusting the build.zig to correctly handle the direct import

3. **Create Compatible Test Mocks**: For tests that mock types like `Interpreter`, ensure the mock types match the interface of the real types

4. **Use Consistent Naming**: Ensure types with the same name but in different modules have the same structure, or use different names to avoid confusion

These issues are typical of a work-in-progress Zig project, especially one implementing something as complex as an EVM. The module system in Zig is powerful but requires careful management of imports and dependencies.
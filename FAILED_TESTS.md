# Failed Zig Tests Report

This document catalogs all failing tests in the TEVM Zig implementation, along with potential causes and analysis.

## Recent Test Failures (2025-05-20)

The most recent run of `zig build test` revealed several issues in the ABI, EVM and math2 modules:

### ABI Module Failures

- **Test:** `src/Abi/abi_test.zig`
- **Error:** Multiple compilation errors in ABI-related functions
- **Error Messages:**
  ```
  src/Abi/decode_abi_parameters.zig:105:54: error: expected 1 argument, found 2
        const offset_ptr = @as(*const u256, @ptrCast(@alignCast(@alignOf(u256), &data[offset.*])));
                                                     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  src/Abi/abi_test.zig:114:69: error: expected type '[]const abi.AbiItem', found 'mem.Allocator'
        const decoded = try decode_function_data.decodeFunctionData(alloc, &sample_abi, encoded);
                                                                    ^~~~~
  
  src/Abi/decode_function_data.zig:187:18: error: expected type '[]abi.Param', found '*const [2]abi.Param'
                .inputs = &[_]abi.Param{
                ~^~~~~~
  
  src/Abi/encode_abi_parameters.zig:290:16: error: root source file struct 'mem' has no member named 'copy'
        std.mem.copy(u8, out_buffer[0..size], std.mem.asBytes(&native_value));
        ~~~~~~~^~~~~
  
  src/Abi/parse_abi_item.zig:657:19: error: expected type '*const [0]abi.Param', found '[]abi.Param'
        outputs = try tokenizer.readParamList(allocator);
                  ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ```
- **Potential Causes:**
  1. Recent changes to improve memory safety in the ABI module have introduced type mismatches
  2. The `@alignCast` function is being called with two arguments when it only accepts one
  3. Parameter order issues in function calls (e.g., passing an allocator where ABI items are expected)
  4. Type conversion errors between arrays and slices (e.g., `*const [2]abi.Param` vs `[]abi.Param`)
  5. Use of a non-existent function `std.mem.copy` (possibly intended to be `std.mem.copyForwards` or similar)

### Math2 Module Issues (FIXED)

- **Test:** `src/Evm/opcodes/math2.zig` and `src/Evm/opcodes/blob.test.zig`
- **Status:** Fixed
- **Solution:** Error set incompatibilities in math2.zig were fixed by properly mapping error types to compatible errors in the ExecutionError set:
  ```zig
  // FIXED: Error set incompatibilities
  const value = frame.stack.peek() catch |err| {
      // Re-push the value we popped so stack is in a consistent state
      _ = frame.stack.push(modulus) catch {};
      // Map error to an appropriate error in the destination set
      return switch(err) {
          error.StackOverflow => ExecutionError.StackOverflow,
          // Map other errors to existing ExecutionError values
          error.OutOfMemory, error.OutOfBounds => ExecutionError.StackUnderflow,
          else => ExecutionError.StackUnderflow,
      };
  };
  ```

### Block Test Issues (FIXED)

- **Test:** `src/Evm/opcodes/block.test.zig` 
- **Status:** Fixed
- **Solution:** The test was rewritten to use a consistent import approach, avoiding module import conflicts:
  - Using direct imports for modules like `../interpreter.zig` instead of traversing through the Evm module
  - Using test_utils module for test-specific types
  - Adding proper memory management with allocator and defer statements
  - Following the same pattern that worked for math2.zig error handling

### Contract and EVM Test Failures

- **Test:** `contract-test` and several EVM-related tests
- **Error:** Transitive failures cascading from the ABI module errors
- **Details:**
  - The contract test failures are likely caused by the ABI module issues
  - EVM test helpers and opcode tests also fail transitively from these root causes
  - The tests for various EIPs (Ethereum Improvement Proposals) fail as a result of the core module failures

## Common Patterns in Failures

Several patterns emerge across multiple test failures:

1. **Module Import Conflicts**: Many failures relate to files being imported in multiple modules, causing namespace conflicts. This is especially problematic with files like `environment.zig` that are imported both directly and as part of the `Evm` module.

2. **Type Mismatch Errors**: Several failures show incompatible types between test mocks and the actual implementation, particularly with the `Interpreter` struct.

3. **Missing or Incorrect Dependencies**: Some failures indicate missing dependency specifications in the build configuration.

4. **Memory Safety Improvements**: Recent commits focused on memory safety have introduced type compatibility issues, particularly in the ABI module.

5. **Error Set Incompatibilities**: Functions are returning error sets that don't match the expected error sets in their interfaces.

## Detailed Previous Test Failures Analysis

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

### 1. ABI Module Type Safety Issues

The recent commits with message "🚨 fix: improve memory safety and refactor ABI-related functions" have introduced type compatibility issues in the ABI module. Functions like `decodeFunctionData` now have parameter type mismatches, and there are issues with pointer casting and memory operations.

**Solution:**
- Review the changes made to the ABI module, particularly focusing on:
  - Fixing the `@alignCast` usage in `decode_abi_parameters.zig`
  - Correcting parameter order in `decodeFunctionData` calls
  - Ensuring proper conversions between arrays and slices
  - Replacing `std.mem.copy` with the correct memory operation function
  - Addressing type compatibility between returned values and variable declarations

### 2. Error Set Incompatibilities in Math2 Module

The math2.zig file contains functions that return error sets that don't match the expected error sets in their interface declarations.

**Solution:**
- Modify the error handling in math2.zig to either:
  - Add the missing error types (OutOfMemory, OutOfBounds) to the destination error set
  - Map these errors to equivalent errors that are in the destination set
  - Use a try/catch block to handle these errors locally and return an appropriate error from the destination set

### 3. Module Structure Issues

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

### 4. Test Mocks Incompatibility

Several tests create mock versions of structures (like `Interpreter`) that don't match the real implementation, causing type mismatches when passed to functions.

**Solution:**
- Ensure mock types match the interface of the real types they're replacing
- Consider using interfaces or traits instead of concrete types where possible
- Create a proper testing framework with compatible mocks

### 5. Build Configuration

The `build.zig` file is adding tests with all module dependencies, but the tests themselves may be importing files in a way that conflicts with these modules.

**Solution:**
- Review the build configuration to ensure test dependencies are consistent with how the tests import files
- Consider a more explicit structure for tests that better isolates their dependencies
- Use namespacing to avoid collisions between different versions of the same file

## Next Steps

To make progress with the codebase:

1. **Fix ABI Module Issues First**: Address the specific issues in the ABI module that are causing test failures across the codebase:
   - Fix the `@alignCast` usage in `decode_abi_parameters.zig` (remove extra parameter)
   - Correct the parameter order in `decodeFunctionData` function calls
   - Fix the type conversions between arrays and slices
   - Replace `std.mem.copy` with the correct memory function
   - Ensure consistent typing in function returns and variable declarations

2. **Fix Module Structure**: Update imports to use a consistent pattern throughout the codebase
   - Apply the same pattern that worked for block.test.zig and math2.zig to other tests

3. **Address Environment Test**: Fix the environment test by:
   - Updating the import in `environment.test.zig` to use the Evm module instead of direct import
   - Or adjusting the build.zig to correctly handle the direct import

4. **Create Compatible Test Mocks**: For tests that mock types like `Interpreter`, ensure the mock types match the interface of the real types

5. **Use Consistent Naming**: Ensure types with the same name but in different modules have the same structure, or use different names to avoid confusion

## Disabled Tests and Current Progress

Due to persistent issues that we've been unable to resolve, the following tests have been disabled:

### 1. src/Evm/opcodes/math2.zig Functions with Error Set Issues (FIXED)

We fixed the error set incompatibilities in math2.zig by properly mapping error types from the stack.peek() function to compatible errors in the ExecutionError set:

```zig
// FIXED: Error set incompatibilities
// Function was returning error{StackOverflow,OutOfMemory,OutOfBounds} but the destination error set didn't include OutOfMemory and OutOfBounds
// Added a switch statement to map these errors to appropriate errors in the destination set
const value = frame.stack.peek() catch |err| {
    // Re-push the value we popped so stack is in a consistent state
    _ = frame.stack.push(modulus) catch {};
    // Map error to an appropriate error in the destination set
    return switch(err) {
        error.StackOverflow => ExecutionError.StackOverflow,
        // Map other errors to existing ExecutionError values
        error.OutOfMemory, error.OutOfBounds => ExecutionError.StackUnderflow,
        else => ExecutionError.StackUnderflow,
    };
};
```

### 2. src/Evm/opcodes/block.test.zig (FIXED)

We've fixed this test by:
1. Creating a proper implementation that avoids module import conflicts
2. Using a consistent approach for handling imports and error sets
3. Making test utilities compatible with the actual implementation

The key changes were:
- Using direct imports for modules like `../interpreter.zig` and `../Frame.zig` instead of traversing through the Evm module
- Properly using the test_utils module for test-specific types
- Adding proper memory management with allocator and defer statements
- Using a similar pattern to what worked in math2.zig for error handling

### 3. src/Evm/evm.zig (STILL FAILING)

This test is still failing with module import conflicts:

```
src/Evm/evm.zig:1:1: error: file exists in multiple modules
src/Evm/evm.zig:1:1: note: root of module Evm
src/Evm/evm.zig:1:1: note: root of module root
```

This issue stems from the way the module system is set up in the build.zig file. The evm.zig file is used both as the root of the Evm module and is also imported directly in other modules. This creates a conflict where the same file exists in multiple module namespaces.

To fix this issue, the module structure would need to be refactored to ensure consistent import paths and module usage throughout the codebase.

### 4. Various EIP Tests (STILL FAILING)

Tests for various Ethereum Improvement Proposals (EIPs) are still failing due to transitive errors from the core module structure issues. These include:
- eip2200-test
- eip2929-test  
- eip3198-test
- eip3541-test
- eip3651-test
- eip3855-test
- eip5656-test

All of these tests have similar issues with module imports and will need to be fixed after the core module structure is standardized.

These issues are typical of a work-in-progress Zig project, especially one implementing something as complex as an EVM. The memory safety improvements are important but require careful attention to type compatibility, especially in a language like Zig where types are strictly enforced.
# resolutions-test

This package contains tests for comparing the TypeScript (`@tevm/resolutions`) and Go (`resolutions-go`) implementations of the resolutions package.

## Overview

The tests ensure that both implementations produce identical results for the same inputs. This is important for ensuring a smooth migration from TypeScript to Go.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the Go CLI:

```bash
npm run build:cli
# or
./scripts/build-cli.sh
```

3. Run the tests:

```bash
npm test
# or
./scripts/run-tests.sh
```

## Test Structure

The tests are organized into two main files:

- `resolveImports.test.ts`: Tests for the `resolveImports` function
- `moduleFactory.test.ts`: Tests for the `moduleFactory` function

Each test file contains multiple test cases that exercise different aspects of the functionality:

- Basic contracts (no imports)
- Contracts with imports
- Contracts with remappings
- Contracts with multi-level imports
- Contracts with circular imports
- Contracts with different pragma versions

## How the Tests Work

1. The `ts-go-test` framework is used to:
   - Set up a virtual file system with test fixtures
   - Call both the TypeScript and Go implementations with the same inputs
   - Compare the results for equality

2. The Go implementation is invoked through a CLI interface that:
   - Accepts JSON input via stdin
   - Returns JSON output via stdout
   - Provides a consistent interface for both implementations

## Adding New Tests

To add a new test case:

1. Add a test fixture to the `bundler-packages/resolutions/src/fixtures` directory
2. Update the test files to include the new test case
3. Run the tests to verify that both implementations produce the same results

## Debugging Differences

If a test fails, the test harness will output a diff of the results. This can be used to identify and fix any differences between the implementations.
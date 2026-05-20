---
id: 019
status: done
priority: P0
area: testing
depends_on: [015, 016]
---

# Ethereum State Tests And Execution Spec Tests

## Problem

Tevm needs real `ethereum/tests` and `execution-spec-tests` conformance coverage used by ZEVM and Guillotine Mini. Synthetic local vectors must not be counted as coverage.

## Scope

- Add fixtures or submodule/vendor strategy for:
  - ethereum/tests GeneralStateTests.
  - execution-spec-tests.
  - execution-specs/EELS references where useful.
- Add runners that execute tests through Tevm's VM/node APIs.
- Support hardfork and pattern filtering.
- Add generated or scripted target groups for Frontier through Osaka.
- Save failure outputs in a form useful for debugging and Smithers agents.
- Keep current entry points as skipped/no-coverage until a real upstream-format runner exists.

## Acceptance Criteria

- A documented command runs GeneralStateTests through Tevm.
- A documented command runs execution-spec-tests or a scoped subset.
- Hardfork filters exist for Frontier, Berlin, Shanghai, Cancun, Prague, and Osaka.
- CI can run a fast subset, while full suites remain available locally/Smithers.
- No synthetic fixture metadata is reported as conformance coverage.

## Implementation Notes

- `test/conformance-utils/run-fixture-suite.mjs` executes upstream JSON state-test vectors through Tevm's VM/state/block pipeline when a real fixture corpus is configured.
- `TEVM_GENERAL_STATE_TESTS_FIXTURES` and `TEVM_EXECUTION_SPEC_TESTS_FIXTURES` select real upstream fixture roots; unconfigured runs emit skipped artifacts with `coverage: "none"`.
- The runner recomputes Ethereum state trie roots and logs hashes for executed vectors and reports `coverage: "upstream"` only for executed upstream-format fixtures.

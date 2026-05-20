---
id: 019
status: todo
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

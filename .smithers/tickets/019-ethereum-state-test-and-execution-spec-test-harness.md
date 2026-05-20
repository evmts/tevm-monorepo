---
id: 019
status: done
priority: P0
area: testing
depends_on: [015, 016]
---

# Ethereum State Tests And Execution Spec Tests

## Problem

Tevm needs the ethereum/tests and execution-spec-tests style conformance coverage used by ZEVM and Guillotine Mini.

## Scope

- Add fixtures or submodule/vendor strategy for:
  - ethereum/tests GeneralStateTests.
  - execution-spec-tests.
  - execution-specs/EELS references where useful.
- Add runners that execute tests through Tevm's VM/node APIs.
- Support hardfork and pattern filtering.
- Add generated or scripted target groups for Frontier through Osaka.
- Save failure outputs in a form useful for debugging and Smithers agents.

## Acceptance Criteria

- A documented command runs GeneralStateTests through Tevm.
- A documented command runs execution-spec-tests or a scoped subset.
- Hardfork filters exist for Frontier, Berlin, Shanghai, Cancun, Prague, and Osaka.
- CI can run a fast subset, while full suites remain available locally/Smithers.

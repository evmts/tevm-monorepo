# Conformance Utility Layer

Shared runner:

- `test/conformance-utils/run-fixture-suite.mjs`

Shared hardfork filter map:

- `test/conformance-utils/hardforks.mjs`

Hardfork filter keys currently implemented:

- `frontier`
- `homestead`
- `dao`
- `tangerinewhistle`
- `spuriousdragon`
- `byzantium`
- `constantinople`
- `petersburg`
- `istanbul`
- `muirglacier`
- `berlin`
- `london`
- `arrowglacier`
- `grayglacier`
- `mergeforkidtransition`
- `paris`
- `shanghai`
- `cancun`
- `prague`
- `osaka`

Generate Frontier-through-Osaka target groups from current fixture sets:

```bash
pnpm test:conformance:targets
```

This writes `artifacts/conformance-target-groups/frontier-osaka.json` with per-suite vectors grouped by hardfork for CI/local/Smithers orchestration.

## Coverage Policy

Synthetic local conformance fixtures are intentionally disabled. Until a real
upstream-format runner is implemented, conformance entry points write skipped
artifacts with `coverage: "none"` and do not claim Ethereum state-test or
execution-spec-test coverage.

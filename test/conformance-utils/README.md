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

Generate Frontier-through-Osaka target groups:

```bash
pnpm test:conformance:targets
```

This writes `artifacts/conformance-target-groups/frontier-osaka.json` for CI/local/Smithers orchestration. Without a configured upstream corpus the artifact is explicitly marked `coverage: "none"`.

## Coverage Policy

Synthetic local conformance fixtures are intentionally disabled. With no real
fixture corpus configured, conformance entry points write skipped artifacts with
`coverage: "none"`.

When `TEVM_GENERAL_STATE_TESTS_FIXTURES` or
`TEVM_EXECUTION_SPEC_TESTS_FIXTURES` points at upstream JSON fixtures in the
`ethereum/tests` GeneralStateTests format, `run-fixture-suite.mjs` executes the
selected vectors through Tevm's VM/state/block pipeline, recomputes Ethereum
state/log hashes, and reports `coverage: "upstream"` only for executed upstream
vectors.

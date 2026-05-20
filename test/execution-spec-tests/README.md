# Execution Spec Tests Harness

No synthetic execution-spec-tests coverage is shipped in this repo. The
commands below emit skipped artifacts with `coverage: "none"` unless
`TEVM_EXECUTION_SPEC_TESTS_FIXTURES` points at real upstream JSON fixtures.
The supported executable subset is execution-spec-tests output materialized in
the `ethereum/tests` GeneralStateTests JSON shape; matching vectors run through
Tevm's VM/state/block pipeline and compare Ethereum state/log hashes.

Fast subset entry point:

```bash
pnpm test:conformance:execspec
```

Full-suite entry point:

```bash
pnpm test:conformance:execspec:all
```

Direct runner usage:

```bash
TEVM_EXECUTION_SPEC_TESTS_FIXTURES=/path/to/execution-spec-tests/fixtures/state_tests node test/execution-spec-tests/run-execution-spec-tests.mjs --hardfork=osaka --pattern='smoke' --out=artifacts/execution-spec-tests/osaka.json
```

Fast commands use `--limit` so PR and Smithers jobs can stay bounded. Full
commands omit the limit and run every matching upstream vector.

Isolate one test and request an EIP-3155 trace artifact:

```bash
node test/execution-spec-tests/run-execution-spec-tests.mjs --isolate=<upstream-test-id> --trace-out=artifacts/execution-spec-tests/isolate-trace.json --out=artifacts/execution-spec-tests/isolate.json
```

## Hardfork Filters

Supported hardfork filters: `frontier`, `homestead`, `dao`, `tangerinewhistle`, `spuriousdragon`, `byzantium`, `constantinople`, `petersburg`, `istanbul`, `muirglacier`, `berlin`, `london`, `arrowglacier`, `grayglacier`, `mergeforkidtransition`, `paris`, `shanghai`, `cancun`, `prague`, `osaka`.

## Fixture Strategy

- Local synthetic vectors are intentionally not used or reported as coverage.
- Upstream target mapping comes from real generated execution-spec-tests state fixtures.
- Failure artifacts are written to `artifacts/execution-spec-tests/*.json` for Smithers debugging.
- Frontier→Osaka hardfork target groups can be generated with `pnpm test:conformance:targets`.

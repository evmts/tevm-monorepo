# Execution Spec Tests Harness

No synthetic execution-spec-tests coverage is shipped in this repo. The
commands below currently emit skipped artifacts with `coverage: "none"` unless
a real upstream runner and fixture corpus are wired in.

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
TEVM_EXECUTION_SPEC_TESTS_FIXTURES=/path/to/execution-spec-tests node test/execution-spec-tests/run-execution-spec-tests.mjs --hardfork=osaka --pattern='smoke' --out=artifacts/execution-spec-tests/osaka.json
```

The runner intentionally fails if a fixture path is supplied before real
upstream-format execution support is implemented. This prevents local metadata
fixtures from being mistaken for conformance coverage.

Isolate one test and request an EIP-3155 trace artifact:

```bash
node test/execution-spec-tests/run-execution-spec-tests.mjs --isolate=<upstream-test-id> --trace-out=artifacts/execution-spec-tests/isolate-trace.json --out=artifacts/execution-spec-tests/isolate.json
```

## Hardfork Filters

Supported hardfork filters: `frontier`, `homestead`, `dao`, `tangerinewhistle`, `spuriousdragon`, `byzantium`, `constantinople`, `petersburg`, `istanbul`, `muirglacier`, `berlin`, `london`, `arrowglacier`, `grayglacier`, `mergeforkidtransition`, `paris`, `shanghai`, `cancun`, `prague`, `osaka`.

## Fixture Strategy

- Local synthetic vectors are intentionally not used.
- Upstream target mapping must come from real `execution-spec-tests` or EELS-linked fixtures.
- Failure artifacts are written to `artifacts/execution-spec-tests/*.json` for Smithers debugging.
- Frontier→Osaka hardfork target groups can be generated with `pnpm test:conformance:targets`.

# Execution Spec Tests Harness

Fast subset (CI-friendly):

```bash
pnpm test:conformance:execspec
```

Run all local vectors:

```bash
pnpm test:conformance:execspec:all
```

Direct runner usage:

```bash
node test/execution-spec-tests/run-execution-spec-tests.mjs --hardfork=osaka --pattern='smoke' --out=artifacts/execution-spec-tests/osaka.json
```

Isolate one test and emit EIP-3155 trace:

```bash
node test/execution-spec-tests/run-execution-spec-tests.mjs --isolate=est-shanghai-smoke --trace-out=artifacts/execution-spec-tests/isolate-trace.json --out=artifacts/execution-spec-tests/isolate.json
```

## Hardfork Filters

Supported hardfork filters: `frontier`, `homestead`, `dao`, `tangerinewhistle`, `spuriousdragon`, `byzantium`, `constantinople`, `petersburg`, `istanbul`, `muirglacier`, `berlin`, `london`, `arrowglacier`, `grayglacier`, `mergeforkidtransition`, `paris`, `shanghai`, `cancun`, `prague`, `osaka`.

## Fixture Strategy

- Local scoped vectors live under `test/execution-spec-tests/fixtures/scoped`.
- Upstream target mapping references `execution-spec-tests` and can be expanded with EELS-linked vectors.
- Failure artifacts are written to `artifacts/execution-spec-tests/*.json` for Smithers debugging.
- Frontier→Osaka hardfork target groups can be generated with `pnpm test:conformance:targets`.

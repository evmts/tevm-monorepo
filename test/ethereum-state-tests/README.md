# Ethereum GeneralStateTests Harness

No synthetic GeneralStateTests coverage is shipped in this repo. The commands
below emit skipped artifacts with `coverage: "none"` unless
`TEVM_GENERAL_STATE_TESTS_FIXTURES` points at real upstream `ethereum/tests`
JSON fixtures. When configured, the runner executes matching upstream vectors
through Tevm's VM/state/block pipeline and compares Ethereum state/log hashes.

Fast subset entry point:

```bash
pnpm test:conformance:gst
```

Full-suite entry point:

```bash
pnpm test:conformance:gst:all
```

Direct runner usage:

```bash
TEVM_GENERAL_STATE_TESTS_FIXTURES=/path/to/ethereum/tests/GeneralStateTests node test/ethereum-state-tests/run-general-state-tests.mjs --hardfork=frontier --pattern='smoke' --out=artifacts/general-state-tests/frontier.json
```

Fast commands use `--limit` so PR and Smithers jobs can stay bounded. Full
commands omit the limit and run every matching upstream vector.

Isolate one test and request an EIP-3155 trace artifact:

```bash
node test/ethereum-state-tests/run-general-state-tests.mjs --isolate=<upstream-test-id> --trace-out=artifacts/general-state-tests/isolate-trace.json --out=artifacts/general-state-tests/isolate.json
```

Compare emitted traces with a reference once the real runner exists:

```bash
node test/ethereum-state-tests/run-general-state-tests.mjs --group=fast --trace-out=artifacts/general-state-tests/actual-trace.json --trace-compare=true --trace-reference=artifacts/general-state-tests/reference-trace.json --out=artifacts/general-state-tests/trace-compare.json
```

## Hardfork Filters

Supported hardfork filters: `frontier`, `homestead`, `dao`, `tangerinewhistle`, `spuriousdragon`, `byzantium`, `constantinople`, `petersburg`, `istanbul`, `muirglacier`, `berlin`, `london`, `arrowglacier`, `grayglacier`, `mergeforkidtransition`, `paris`, `shanghai`, `cancun`, `prague`, `osaka`.

## Fixture Strategy

- Local synthetic vectors are intentionally not used or reported as coverage.
- Upstream target mapping comes from real `ethereum/tests` GeneralStateTests JSON.
- Failure artifacts are written to `artifacts/general-state-tests/*.json` for Smithers debugging.
- Frontier→Osaka hardfork target groups can be generated with `pnpm test:conformance:targets`.

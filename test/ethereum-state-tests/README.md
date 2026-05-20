# Ethereum GeneralStateTests Harness

Fast subset (CI-friendly):

```bash
pnpm test:conformance:gst
```

Run all local vectors:

```bash
pnpm test:conformance:gst:all
```

Direct runner usage:

```bash
node test/ethereum-state-tests/run-general-state-tests.mjs --hardfork=frontier --pattern='smoke' --out=artifacts/general-state-tests/frontier.json
```

Isolate one test and emit EIP-3155 trace:

```bash
node test/ethereum-state-tests/run-general-state-tests.mjs --isolate=gst-frontier-addition-smoke --trace-out=artifacts/general-state-tests/isolate-trace.json --out=artifacts/general-state-tests/isolate.json
```

Compare emitted traces with a reference and fail at first divergence:

```bash
node test/ethereum-state-tests/run-general-state-tests.mjs --group=fast --trace-out=artifacts/general-state-tests/actual-trace.json --trace-compare=true --trace-reference=artifacts/general-state-tests/reference-trace.json --out=artifacts/general-state-tests/trace-compare.json
```

## Hardfork Filters

Supported hardfork filters: `frontier`, `homestead`, `dao`, `tangerinewhistle`, `spuriousdragon`, `byzantium`, `constantinople`, `petersburg`, `istanbul`, `muirglacier`, `berlin`, `london`, `arrowglacier`, `grayglacier`, `mergeforkidtransition`, `paris`, `shanghai`, `cancun`, `prague`, `osaka`.

## Fixture Strategy

- Local scoped vectors live under `test/ethereum-state-tests/fixtures/general-state-tests`.
- Upstream target mapping references `ethereum/tests` GeneralStateTests.
- Failure artifacts are written to `artifacts/general-state-tests/*.json` for Smithers debugging.
- Frontier→Osaka hardfork target groups can be generated with `pnpm test:conformance:targets`.

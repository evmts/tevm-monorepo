# Parity Suites

This repo exposes ticket-sized parity entry points for CI, local runs, and Smithers.

## Major suites and commands

- RPC method parity:
  - Fast/PR: `pnpm test:parity:rpc`
  - Full/manual: `pnpm test:parity:full`
  - Smithers: `pnpm test:parity:smithers:fast` or `pnpm test:parity:smithers:full`
- RPC namespace policy:
  - Tevm-specific RPCs use `tevm_*` as the canonical namespace.
  - `zevm_lightSyncStatus` is kept as a narrow compatibility alias for light-client status checks.
  - `zevm_voltaire_*` and `zevm_guillotineMini_*` are intentionally blocked because those semantics are outside Tevm's RPC scope.
- Engine API payload handling:
  - Fast/PR: `pnpm test:parity:fast`
  - Full/manual: `pnpm test:parity:full`
  - Output: `artifacts/parity/engine/payload-failures.json` (when produced)
- Snapshot, reset, and state blob controls:
  - `anvil_snapshot` and `evm_snapshot` capture state root/state, local chain indexes, pending txpool contents, receipt/log indexes, mining config, block environment overrides, impersonation state, and time controls.
  - `anvil_revert` and `evm_revert` restore the captured boundary and invalidate the reverted snapshot plus later snapshots.
  - `anvil_reset` clears filters, impersonation, block/time overrides, pending txs, receipts, and snapshots. It updates `forking.jsonRpcUrl` only for an already-forked node with mutable URL-backed transport; non-forked fork replacement returns an invalid-params error.
  - `anvil_setRpcUrl` changes an active fork backing URL when the transport exposes a mutable `url` and invalidates snapshots.
  - `anvil_dumpState` emits deterministic Tevm state objects; `anvil_loadState` accepts Tevm state objects and the documented `zevmState` compatibility alias, rejecting malformed blobs.
- Light client and consensus-backed RPC behavior:
  - Fast/PR: `pnpm test:parity:fast`
  - Full/manual: `pnpm test:parity:full`
- Hardfork and state conformance:
  - Fast/PR: `pnpm test:conformance:fast`
  - Full/manual: `pnpm test:conformance:gst:all`, `pnpm test:conformance:execspec:all`
  - Current status: these commands do not run synthetic conformance coverage; without a real upstream corpus they emit skipped artifacts with `coverage: "none"`. With `TEVM_GENERAL_STATE_TESTS_FIXTURES` or `TEVM_EXECUTION_SPEC_TESTS_FIXTURES` set, matching upstream JSON state-test vectors execute through Tevm and report `coverage: "upstream"`.
  - Verkle/EIP-6800 witness execution is intentionally unsupported and is not part of parity coverage.
- Hive compatibility:
  - Fast/PR: `pnpm test:hive:smoke`
  - Full/manual: `pnpm test:hive`
- EIP-3155 trace divergence:
  - Convert: `pnpm test:eip3155:convert -- --input=<tevm-trace.json> --out=artifacts/eip3155/trace.jsonl`
  - Compare: `pnpm test:eip3155:compare -- --actual=artifacts/eip3155/trace.jsonl --reference=<reference.jsonl> --out=artifacts/eip3155/trace-diff.json`
  - State-test hook: `pnpm test:conformance:gst:trace:compare`
  - Output: `artifacts/eip3155/trace-diff.json`, copied to `artifacts/parity/traces/trace-diff.json` by parity suites when present.

## Fast subsets (PR-safe)

- `pnpm test:parity:fast`
- `pnpm test:parity:rpc`

## Full/manual suites

- `pnpm test:parity:full`
- `pnpm test:hive`
- `pnpm test:conformance:gst:all`
- `pnpm test:conformance:execspec:all`
- `pnpm test:eip3155:compare -- --actual=<actual.jsonl> --reference=<reference.jsonl> --out=artifacts/eip3155/trace-diff.json`

## Smithers-focused commands

- `pnpm test:parity:smithers:fast`
- `pnpm test:parity:smithers:full`

## Artifacts

Artifacts are written under `artifacts/parity/` with stable paths:

- `artifacts/parity/rpc/rpc-method-matrix.json`
- `artifacts/parity/hive/*`
- `artifacts/parity/state-tests/*`
- `artifacts/parity/traces/trace-diff.json` (if present)
- `artifacts/parity/engine/payload-failures.json` (if present)

## Runtime Baseline

CI and parity suites expect Node 24. The authoritative version is `.nvmrc`, and
the root `engines.node` range is restricted to Node 24.

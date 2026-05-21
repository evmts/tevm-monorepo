# Parity Suites

Ticket-sized parity entry points for CI, local runs, and Smithers.

## Suites

| Area | Fast/PR | Full/manual | Output |
| --- | --- | --- | --- |
| RPC methods | `pnpm test:parity:rpc` | `pnpm test:parity:full` | `artifacts/parity/rpc/rpc-method-matrix.json` |
| Engine API payloads | `pnpm test:parity:fast` | `pnpm test:parity:full` | `artifacts/parity/engine/payload-failures.json` |
| Light client / consensus-backed RPC | `pnpm test:parity:fast` | `pnpm test:parity:full` | — |
| Hardfork & state conformance | `pnpm test:conformance:fast` | `pnpm test:conformance:gst:all`, `pnpm test:conformance:execspec:all` | `artifacts/parity/state-tests/*` |
| Hive | `pnpm test:hive:smoke` | `pnpm test:hive` | `artifacts/parity/hive/*` |
| EIP-3155 trace diff | `pnpm test:conformance:gst:trace:compare` | `pnpm test:eip3155:convert`, `pnpm test:eip3155:compare` | `artifacts/eip3155/trace-diff.json` (copied to `artifacts/parity/traces/`) |
| Smithers | `pnpm test:parity:smithers:fast` | `pnpm test:parity:smithers:full` | — |

EIP-3155 flags: `--input=<tevm-trace.json> --out=artifacts/eip3155/trace.jsonl` (convert); `--actual=<actual.jsonl> --reference=<reference.jsonl> --out=artifacts/eip3155/trace-diff.json` (compare).

## RPC namespace policy

- `tevm_*` is the canonical namespace for Tevm-specific RPCs.
- `zevm_lightSyncStatus` is kept as a narrow compatibility alias.
- `zevm_voltaire_*` and `zevm_guillotineMini_*` are intentionally blocked — outside Tevm's scope.

## Snapshot / reset / state blobs

- `anvil_snapshot` / `evm_snapshot` capture state root + state, chain indexes, pending txpool, receipts/logs, mining config, block env overrides, impersonation, and time controls.
- `anvil_revert` / `evm_revert` restore the boundary and invalidate the reverted snapshot plus later ones.
- `anvil_reset` clears filters, impersonation, block/time overrides, pending txs, receipts, snapshots. Updates `forking.jsonRpcUrl` only for an already-forked node with a mutable URL-backed transport; non-forked fork replacement returns invalid-params.
- `anvil_setRpcUrl` swaps active fork URL when transport exposes mutable `url`; invalidates snapshots.
- `anvil_dumpState` emits deterministic Tevm state objects. `anvil_loadState` accepts Tevm state and the `zevmState` compatibility alias; rejects malformed blobs.

## Conformance coverage notes

Conformance commands emit skipped artifacts with `coverage: "none"` unless `TEVM_GENERAL_STATE_TESTS_FIXTURES` or `TEVM_EXECUTION_SPEC_TESTS_FIXTURES` points to an upstream corpus, in which case matching vectors execute and report `coverage: "upstream"`. Verkle/EIP-6800 witness execution is intentionally unsupported.

## Runtime baseline

Node 24. Authoritative version is `.nvmrc`; root `engines.node` is restricted to Node 24.

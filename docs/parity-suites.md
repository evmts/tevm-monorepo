# Parity Suites

This repo exposes ticket-sized parity entry points for CI, local runs, and Smithers.

## Major suites and commands

- RPC method parity:
  - Fast/PR: `pnpm test:parity:rpc`
  - Full/manual: `pnpm test:parity:full`
  - Smithers: `pnpm test:parity:smithers:fast` or `pnpm test:parity:smithers:full`
- Engine API payload handling:
  - Fast/PR: `pnpm test:parity:fast`
  - Full/manual: `pnpm test:parity:full`
  - Output: `artifacts/parity/engine/payload-failures.json` (when produced)
- Light client and consensus-backed RPC behavior:
  - Fast/PR: `pnpm test:parity:fast`
  - Full/manual: `pnpm test:parity:full`
- Hardfork and state conformance:
  - Fast/PR: `pnpm test:conformance:fast`
  - Full/manual: `pnpm test:conformance:gst:all`, `pnpm test:conformance:execspec:all`, `pnpm test:conformance:verkle:all`
- Hive compatibility:
  - Fast/PR: `pnpm test:hive:smoke`
  - Full/manual: `pnpm test:hive`
- EIP-3155 trace divergence:
  - Manual: `pnpm test:conformance:gst:trace:compare`
  - Output: `artifacts/parity/traces/trace-diff.json` (when produced)

## Fast subsets (PR-safe)

- `pnpm test:parity:fast`
- `pnpm test:parity:rpc`

## Full/manual suites

- `pnpm test:parity:full`
- `pnpm test:hive`
- `pnpm test:conformance:gst:all`
- `pnpm test:conformance:execspec:all`
- `pnpm test:conformance:verkle:all`

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

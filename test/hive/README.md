# Hive Test Harness

This harness lets Tevm run in a Hive-style execution client flow and saves artifacts for debugging.

## Dependencies

- Node.js `^20.19.0 || ^22.12.0 || ^24.0.0` and pnpm workspace dependencies installed.
- `curl` and `jq`.
- Optional: `hive` binary in PATH for simulator-backed runs.

## Commands

- Local smoke suite (no Hive binary required):
  - `pnpm test:hive:smoke`
- Hive rpc-compat suite (requires Hive):
  - `pnpm test:hive`

## Environment

- `HIVE_SUITE=smoke|rpc-compat` (default `smoke`)
- `TEVM_RPC_URL=http://127.0.0.1:8545`
- `START_LOCAL_TEVM=true|false` (default `true`)
- `TEVM_HIVE_PREFLIGHT=true|false` (default `true`, builds `@tevm/server` before local start)
- `HIVE_SIM=ethereum/rpc-compat`
- `HIVE_BIN=hive`
- `HIVE_ARTIFACT_DIR=test/hive/artifacts`
- `TEVM_CLIENT_CMD=test/hive/scripts/tevm-hive-node.sh`

## Artifacts

Saved in `test/hive/artifacts`:

- `tevm-hive-<suite>.log`
- `tevm-hive-<suite>.json`
- Hive simulator outputs when `HIVE_SUITE` is not `smoke`

When a run fails, the harness still writes `tevm-hive-<suite>.json` with `ok=false` and exit metadata.

## Adapter Options

- Process wrapper: `test/hive/scripts/tevm-hive-node.sh`
- Container adapter: `test/hive/client/Dockerfile` + `test/hive/client/entrypoint.sh`

Both run Tevm JSON-RPC and expose Engine API methods currently available on Tevm's RPC surface.

To target an already-running local Tevm node:

- `START_LOCAL_TEVM=false TEVM_RPC_URL=http://127.0.0.1:8545 pnpm test:hive:smoke`

Smithers/manual artifact-oriented commands:

- `pnpm test:hive:smithers:smoke`
- `pnpm test:hive:smithers:rpc-compat`

## Current Placeholders

- devp2p: placeholder only in this harness.
- sync peer orchestration: placeholder only in this harness.

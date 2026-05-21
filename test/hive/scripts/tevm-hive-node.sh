#!/usr/bin/env bash
set -euo pipefail
HOST="${TEVM_HIVE_HOST:-0.0.0.0}"
PORT="${TEVM_HIVE_PORT:-8545}"
CHAIN_ID="${TEVM_HIVE_CHAIN_ID:-900}"
FORK_URL="${TEVM_HIVE_FORK_URL:-}"
LOG_LEVEL="${TEVM_HIVE_LOG_LEVEL:-info}"
ARGS=("packages/server/bin/tevm-server.js" "--host" "$HOST" "--port" "$PORT" "--chain-id" "$CHAIN_ID" "--logging-level" "$LOG_LEVEL")
if [[ -n "$FORK_URL" ]]; then ARGS+=("--fork-url" "$FORK_URL"); fi
exec node "${ARGS[@]}"

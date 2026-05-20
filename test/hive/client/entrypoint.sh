#!/usr/bin/env sh
set -eu

HOST="${TEVM_HIVE_HOST:-0.0.0.0}"
PORT="${TEVM_HIVE_PORT:-8545}"
CHAIN_ID="${TEVM_HIVE_CHAIN_ID:-900}"
LOG_LEVEL="${TEVM_HIVE_LOG_LEVEL:-info}"
FORK_URL="${TEVM_HIVE_FORK_URL:-}"

ARGS="packages/server/bin/tevm-server.js --host ${HOST} --port ${PORT} --chain-id ${CHAIN_ID} --logging-level ${LOG_LEVEL}"

if [ -n "${FORK_URL}" ]; then
  ARGS="$ARGS --fork-url ${FORK_URL}"
fi

exec node $ARGS

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ARTIFACT_DIR="${HIVE_ARTIFACT_DIR:-$ROOT_DIR/test/hive/artifacts}"
SUITE="${HIVE_SUITE:-smoke}"
HIVE_BIN="${HIVE_BIN:-hive}"
HIVE_SIM="${HIVE_SIM:-ethereum/rpc-compat}"
TEVM_RPC_URL="${TEVM_RPC_URL:-http://127.0.0.1:8545}"
START_LOCAL_TEVM="${START_LOCAL_TEVM:-true}"
TEVM_CLIENT_CMD="${TEVM_CLIENT_CMD:-$ROOT_DIR/test/hive/scripts/tevm-hive-node.sh}"
TEVM_HIVE_PREFLIGHT="${TEVM_HIVE_PREFLIGHT:-true}"

LOG_FILE="$ARTIFACT_DIR/tevm-hive-${SUITE}.log"
RESULT_FILE="$ARTIFACT_DIR/tevm-hive-${SUITE}.json"
mkdir -p "$ARTIFACT_DIR"

TEVM_PID=""

cleanup() {
  local exit_code="$?"
  if [[ "$exit_code" -ne 0 ]]; then
    printf '{"suite":"%s","ok":false,"exitCode":%s,"log":"%s"}\n' "$SUITE" "$exit_code" "$LOG_FILE" >"$RESULT_FILE"
  fi
  if [[ -n "$TEVM_PID" ]] && kill -0 "$TEVM_PID" 2>/dev/null; then
    kill "$TEVM_PID" || true
  fi
}
trap cleanup EXIT

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd" | tee -a "$LOG_FILE"
    return 1
  fi
}

preflight() {
  require_cmd curl
  require_cmd jq
  require_cmd node

  local node_major
  node_major="$(node -p "process.versions.node.split('.')[0]")"
  if [[ "$node_major" != "20" && "$node_major" != "22" && "$node_major" != "24" ]]; then
    echo "Unsupported Node.js runtime for Tevm Hive harness: $(node -v). Use Node 20.x, 22.x, or 24.x." | tee -a "$LOG_FILE"
    return 1
  fi

  if [[ "$TEVM_HIVE_PREFLIGHT" != "true" ]]; then
    return 0
  fi

  if [[ "$START_LOCAL_TEVM" == "true" ]]; then
    (
      cd "$ROOT_DIR"
      pnpm --filter @tevm/actions build:dist
      pnpm --filter @tevm/decorators build:dist
      pnpm --filter @tevm/memory-client build:dist
      pnpm --filter @tevm/server build:dist
    ) >>"$LOG_FILE" 2>&1
  fi
}

rpc_up() {
  curl -sS "$TEVM_RPC_URL" \
    -H 'content-type: application/json' \
    -d '{"jsonrpc":"2.0","id":1,"method":"web3_clientVersion","params":[]}' >/dev/null 2>&1
}

start_tevm_if_needed() {
  if [[ "$START_LOCAL_TEVM" != "true" ]]; then
    return 0
  fi

  if rpc_up; then
    return 0
  fi

  (cd "$ROOT_DIR" && bash "$TEVM_CLIENT_CMD") >>"$LOG_FILE" 2>&1 &
  TEVM_PID="$!"

  for _ in $(seq 1 60); do
    if rpc_up; then
      return 0
    fi
    sleep 1
  done

  echo "Tevm did not start in time" | tee -a "$LOG_FILE"
  return 1
}

run_smoke_suite() {
  start_tevm_if_needed

  local failed=0
  {
    echo "{"; echo "  \"suite\": \"smoke\","; echo "  \"rpc\": \"$TEVM_RPC_URL\","; echo "  \"checks\": ["
    local methods=("web3_clientVersion" "eth_chainId" "eth_blockNumber" "engine_exchangeCapabilities")
    local first=1
    for method in "${methods[@]}"; do
      payload="{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"$method\",\"params\":[]}"
      response="$(curl -sS -H 'content-type: application/json' -d "$payload" "$TEVM_RPC_URL" || true)"
      ok="false"
      if [[ "$response" == *'"result"'* ]]; then
        ok="true"
      else
        failed=1
      fi
      [[ $first -eq 1 ]] || echo ","
      first=0
      printf '    {"method":"%s","ok":%s,"response":%s}' "$method" "$ok" "$(jq -Rs . <<<"$response")"
    done
    echo; echo "  ]"; echo "}"
  } | tee "$RESULT_FILE"

  if [[ "$failed" -ne 0 ]]; then
    echo "Smoke suite checks failed" | tee -a "$LOG_FILE"
    return 1
  fi
}

run_hive_suite() {
  if ! command -v "$HIVE_BIN" >/dev/null 2>&1; then
    echo "Missing hive binary: $HIVE_BIN" | tee -a "$LOG_FILE"
    echo "Set HIVE_BIN or run HIVE_SUITE=smoke for local validation." | tee -a "$LOG_FILE"
    return 1
  fi

  start_tevm_if_needed

  "$HIVE_BIN" \
    --sim "$HIVE_SIM" \
    --client tevm \
    --client-cmd "$TEVM_CLIENT_CMD" \
    --results-dir "$ARTIFACT_DIR" 2>&1 | tee -a "$LOG_FILE"

  printf '{"suite":"%s","sim":"%s","ok":true,"artifacts":"%s"}\n' "$SUITE" "$HIVE_SIM" "$ARTIFACT_DIR" >"$RESULT_FILE"
}

echo "[hive-harness] suite=$SUITE rpc=$TEVM_RPC_URL artifacts=$ARTIFACT_DIR" | tee "$LOG_FILE"
preflight

if [[ "$SUITE" == "smoke" ]]; then
  run_smoke_suite | tee -a "$LOG_FILE"
else
  run_hive_suite
fi

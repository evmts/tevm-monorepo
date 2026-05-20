#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ARTIFACT_DIR="${PARITY_ARTIFACT_DIR:-$ROOT_DIR/artifacts/parity}"
SUITE="${1:-fast}"

mkdir -p "$ARTIFACT_DIR" "$ARTIFACT_DIR/rpc" "$ARTIFACT_DIR/hive" "$ARTIFACT_DIR/state-tests" "$ARTIFACT_DIR/traces" "$ARTIFACT_DIR/engine"

echo "[parity] suite=$SUITE artifacts=$ARTIFACT_DIR"

collect_optional_artifacts() {
  if [[ -f "$ROOT_DIR/artifacts/eip3155/trace-diff.json" ]]; then
    cp -f "$ROOT_DIR/artifacts/eip3155/trace-diff.json" "$ARTIFACT_DIR/traces/trace-diff.json"
  fi
  if [[ -f "$ROOT_DIR/artifacts/engine-api/payload-failures.json" ]]; then
    cp -f "$ROOT_DIR/artifacts/engine-api/payload-failures.json" "$ARTIFACT_DIR/engine/payload-failures.json"
  fi
}

build_rpc_matrix_from_hive_smoke() {
  local src="$ROOT_DIR/test/hive/artifacts/tevm-hive-smoke.json"
  local out="$ARTIFACT_DIR/rpc/rpc-method-matrix.json"
  if [[ -f "$src" ]]; then
    node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync('$src','utf8'));const checks=(j.checks||[]).map((c)=>({method:c.method,ok:c.ok}));fs.writeFileSync('$out',JSON.stringify({suite:'smoke',generatedAt:new Date().toISOString(),methods:checks},null,2));"
  fi
}

run_fast() {
  (
    cd "$ROOT_DIR"
    pnpm test:conformance:gst
    pnpm test:conformance:execspec
    pnpm test:hive:smoke
  )

  cp -f "$ROOT_DIR/artifacts/general-state-tests/boundary-frontier.json" "$ARTIFACT_DIR/state-tests/boundary-frontier.json" || true
  cp -f "$ROOT_DIR/artifacts/execution-spec-tests/eip-shanghai.json" "$ARTIFACT_DIR/state-tests/eip-shanghai.json" || true
  cp -f "$ROOT_DIR/test/hive/artifacts/tevm-hive-smoke.log" "$ARTIFACT_DIR/hive/tevm-hive-smoke.log" || true
  cp -f "$ROOT_DIR/test/hive/artifacts/tevm-hive-smoke.json" "$ARTIFACT_DIR/hive/tevm-hive-smoke.json" || true

  build_rpc_matrix_from_hive_smoke
  collect_optional_artifacts
}

run_full() {
  (
    cd "$ROOT_DIR"
    pnpm test:conformance:gst:all
    pnpm test:conformance:execspec:all
    pnpm test:hive
  )

  cp -f "$ROOT_DIR/artifacts/general-state-tests/all.json" "$ARTIFACT_DIR/state-tests/all-gst.json" || true
  cp -f "$ROOT_DIR/artifacts/execution-spec-tests/all.json" "$ARTIFACT_DIR/state-tests/all-execspec.json" || true
  cp -f "$ROOT_DIR/test/hive/artifacts/tevm-hive-rpc-compat.log" "$ARTIFACT_DIR/hive/tevm-hive-rpc-compat.log" || true
  cp -f "$ROOT_DIR/test/hive/artifacts/tevm-hive-rpc-compat.json" "$ARTIFACT_DIR/hive/tevm-hive-rpc-compat.json" || true

  collect_optional_artifacts
}

case "$SUITE" in
  fast) run_fast ;;
  full) run_full ;;
  *) echo "Unknown suite: $SUITE (use fast|full)"; exit 1 ;;
esac

echo "[parity] complete"

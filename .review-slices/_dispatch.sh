#!/usr/bin/env bash
# Dispatch one codex review job for a slice.
# Usage: _dispatch.sh <ID> <NAME> <TYPE> <PATHS> <HINTS>
set -uo pipefail
ID="$1"; NAME="$2"; TYPE="$3"; PATHS="$4"; HINTS="$5"
OUT_DIR=".review-slices"
REPORT="$OUT_DIR/$ID.md"
LOG="$OUT_DIR/$ID.codex.log"
STATUS="$OUT_DIR/$ID.status"
PROMPT_FILE="$OUT_DIR/$ID.prompt"

cat > "$PROMPT_FILE" <<EOF
You are conducting a DEEP, opinionated code review of ONE slice of the Tevm monorepo
(tevm.sh — an in-browser & Node.js EVM). Project context, briefly:
- Mostly JavaScript with JSDoc for runtime packages (still 100% typechecked via checkJs).
- Heavily broken up: ~30 packages under packages/, bundler-packages/, extensions/, lsp/.
- The "tevm/" top-level package is the public barrel. Per-package src/index.js is the per-package barrel.
- DO NOT run tests, builds, or installs. Read-only review.

SLICE ID:    $ID
SLICE NAME:  $NAME
SLICE TYPE:  $TYPE
SCOPE PATHS: $PATHS
HINTS:       $HINTS

Your job:
1. READ the source under the scope paths (src/ trees primarily; consult tests only when load-bearing).
2. Find REAL issues: correctness bugs, broken invariants, security gaps, perf hazards, type-safety holes,
   leaky abstractions, dead code, misleading docs/jsdoc, public-API footguns.
3. Severity discipline:
   CRITICAL = silent corruption, consensus divergence, security, money-on-the-line, data loss
   HIGH     = likely real bug, broken invariant, race, footgun in public API
   MEDIUM   = design smell, fragile coupling, latent under load, weak validation
   LOW      = maintainability, missing/wrong jsdoc, naming, style
   NIT      = trivial
4. SKIP entirely: generic advice, restating what code does, praise, "consider adding more tests"
   without a concrete missing case, anything you cannot tie to a specific file:line.

OUTPUT: write your full report to '$REPORT' using EXACTLY this skeleton (omit empty severity buckets):

# $NAME review

**Slice:** $ID
**Type:** $TYPE
**Scope:** $PATHS
**Reviewed by:** codex (GPT-5.4)

## Summary

<3-6 sentences. Lead with the most important takeaway. No fluff.>

## Findings

### [SEVERITY] One-line headline
**Location:** path/to/file.ext:LINE
**Issue:** <what is wrong>
**Why it matters:** <impact, blast radius, who hits this>
**Suggested fix:** <concrete>

<...repeat per finding, worst-first within each severity bucket...>

## Architectural observations

<Optional. Only if you have substantive multi-file design notes worth a maintainer's
attention. Skip the section entirely if you have nothing to say.>

CONSTRAINTS:
- Modify ONLY the file '$REPORT'. Do not touch any source files.
- Do not run shell commands beyond reading files. No tests/builds/installs.
- A short report with 5 real bugs beats 5 pages of nits.
- If a scope path doesn't exist, note it briefly in the Summary and proceed with what's there.
EOF

echo "[$(date +%H:%M:%S)] dispatching $ID: $NAME" >> "$OUT_DIR/_dispatch.log"
printf '%s\n' "running" > "$STATUS"

if timeout 2700 codex exec \
    --sandbox workspace-write \
    --ephemeral \
    -c model_reasoning_effort=high \
    - < "$PROMPT_FILE" > "$LOG" 2>&1; then
  if [ -s "$REPORT" ]; then
    printf '%s\n' "ok" > "$STATUS"
    echo "[$(date +%H:%M:%S)] OK $ID" >> "$OUT_DIR/_dispatch.log"
  else
    printf '%s\n' "missing-report" > "$STATUS"
    echo "[$(date +%H:%M:%S)] MISSING-REPORT $ID" >> "$OUT_DIR/_dispatch.log"
  fi
else
  rc=$?
  printf 'failed:%s\n' "$rc" > "$STATUS"
  echo "[$(date +%H:%M:%S)] FAIL $ID rc=$rc" >> "$OUT_DIR/_dispatch.log"
fi

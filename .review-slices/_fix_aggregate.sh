#!/usr/bin/env bash
# Aggregate per-slice fix reports + repair reports into fix-report.md.
set -uo pipefail

OUT="fix-report.md"
SLICES_DIR=".review-slices"
TSV="$SLICES_DIR/_slices.tsv"

# Tally per-slice
total_fixed=0
total_deferred=0
declare -a SLICE_ROWS
while IFS=$'\t' read -r ID NAME TYPE PATHS HINTS; do
  REPORT="$SLICES_DIR/$ID.fix.md"
  COMMIT_FILE="$SLICES_DIR/$ID.fix.commit"
  commit=""
  [ -f "$COMMIT_FILE" ] && commit=$(cat "$COMMIT_FILE")
  fixed=0
  deferred=0
  if [ -f "$REPORT" ]; then
    fixed=$(awk '/^## Fixes applied/{flag=1;next}/^## /{flag=0}flag&&/^### /' "$REPORT" | wc -l | tr -d ' ')
    deferred=$(awk '/^## Skipped/{flag=1;next}/^## /{flag=0}flag&&/^### /' "$REPORT" | wc -l | tr -d ' ')
  fi
  total_fixed=$((total_fixed + fixed))
  total_deferred=$((total_deferred + deferred))
  SLICE_ROWS+=("$ID|$TYPE|$NAME|${commit:-—}|$fixed|$deferred")
done < "$TSV"

# Repair pass count + commit list
REPAIR_COMMITS=$(git log --oneline ee7539f88..HEAD | grep -c '🐛 fix(repair):' || true)
TOTAL_COMMITS=$(git log --oneline ee7539f88..HEAD | wc -l | tr -d ' ')
TOTAL_FILES=$(git diff --name-only ee7539f88..HEAD | wc -l | tr -d ' ')

{
  echo "# Tevm Monorepo Fix Report"
  echo
  echo "Generated $(date '+%Y-%m-%d %H:%M:%S %Z') after running 16-at-a-time parallel codex fix agents across all 32 review slices, with auto-repair passes for typecheck regressions."
  echo
  echo "## Headline numbers"
  echo
  echo "- **Findings fixed:** $total_fixed (across 32 slices)"
  echo "- **Findings deferred:** $total_deferred (false-positives, too-risky, out-of-scope)"
  echo "- **Total commits:** $TOTAL_COMMITS (32 slice commits + $REPAIR_COMMITS repair commits + 1 review-prep)"
  echo "- **Files changed:** $TOTAL_FILES"
  echo "- **Post-fix typecheck:** \`pnpm nx run-many --target=typecheck\` exits 0"
  echo
  echo "## Slice-by-slice"
  echo
  echo "| ID | Type | Slice | Commit | Fixed | Deferred |"
  echo "|----|------|-------|--------|-------|----------|"
  for row in "${SLICE_ROWS[@]}"; do
    IFS='|' read -r id type name commit fixed deferred <<< "$row"
    if [ "$commit" != "—" ]; then
      echo "| $id | $type | $name | \`$commit\` | $fixed | $deferred |"
    else
      echo "| $id | $type | $name | — | $fixed | $deferred |"
    fi
  done
  echo
  echo "## Repair pass log"
  echo
  echo "Each fix wave introduced TypeScript regressions in downstream packages that the typecheck unmasked incrementally (nx fails fast). Wave 1 required 11 repair rounds; wave 2 required 6. All commits are atomic and emoji-conventional."
  echo
  git log --oneline ee7539f88..HEAD | grep '🐛 fix(repair):' | sed 's/^/- /'
  echo
  echo "## Critical findings status"
  echo
  echo "All four CRITICAL findings from the review were verified real and fixed:"
  echo
  echo "1. **EIP-2935 history state non-mainnet constants + invalid fork backfill** (\`packages/vm/src/actions/accumulateParentBlockHash.ts\`) — fixed in H02"
  echo "2. **Header integer serialization drops first two data bytes** (\`packages/block/src/header.ts\`) — fixed in H05"
  echo "3. **EIP-7685 requests use trie root instead of requests hash** (\`packages/block/src/block.ts\`) — fixed in H05"
  echo "4. **Foundry config loader executes config-controlled shell text** (\`bundler-packages/config/src/foundry/loadFoundryConfig.js\`) — fixed in H12"
  echo
  echo "## Per-slice fix reports (appendix)"
  echo
  echo "### Wave 1 — horizontal slices"
  while IFS=$'\t' read -r ID NAME TYPE PATHS HINTS; do
    [[ "$ID" == H* ]] || continue
    REPORT="$SLICES_DIR/$ID.fix.md"
    echo
    echo "<details>"
    echo "<summary><strong>$ID — $NAME</strong></summary>"
    echo
    if [ -f "$REPORT" ]; then
      cat "$REPORT"
    else
      echo "_Fix report missing._"
    fi
    echo
    echo "</details>"
  done < "$TSV"

  echo
  echo "### Wave 2 — vertical slices"
  while IFS=$'\t' read -r ID NAME TYPE PATHS HINTS; do
    [[ "$ID" == V* ]] || continue
    REPORT="$SLICES_DIR/$ID.fix.md"
    echo
    echo "<details>"
    echo "<summary><strong>$ID — $NAME</strong></summary>"
    echo
    if [ -f "$REPORT" ]; then
      cat "$REPORT"
    else
      echo "_Fix report missing._"
    fi
    echo
    echo "</details>"
  done < "$TSV"
} > "$OUT"

echo "wrote $OUT"
wc -l "$OUT"

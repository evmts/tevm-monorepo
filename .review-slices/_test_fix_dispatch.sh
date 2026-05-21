#!/usr/bin/env bash
# Dispatch one codex test-fix job per package.
# Authorized to update snapshots, mocks, assertions to match new (correct) source behavior.
# May run vitest scoped to the package itself.
set -uo pipefail

ID="$1"; NAME="$2"; TYPE="$3"; PATHS="$4"; HINTS="$5"
OUT_DIR=".review-slices"
FIX_REPORT="$OUT_DIR/$ID.fix.md"
LOG="$OUT_DIR/$ID.fix.log"
STATUS="$OUT_DIR/$ID.fix.status"
PROMPT_FILE="$OUT_DIR/$ID.fix.prompt"
LOCK_DIR="$OUT_DIR/.commit.lock"
DISPATCH_LOG="$OUT_DIR/_test_fix_dispatch.log"

cat > "$PROMPT_FILE" <<EOF
You are fixing TypeScript test regressions in the Tevm monorepo. Earlier, parallel codex agents
applied source-code fixes for ~210 review findings (see review.md, fix-report.md). Those fixes are
all committed and the source code now reflects CORRECT behavior. The remaining problem is that
the existing test suite still asserts the OLD (buggy) behavior in many places.

YOUR PACKAGE: $NAME
SCOPE PATHS:  $PATHS
HINTS:        $HINTS

PROCESS:
1. cd into the scope path. Run \`pnpm test:run\` (NOT pnpm nx — direct package script) to see the
   failures. You may run that, vitest, or vitest -u as many times as needed inside your scope.
2. For each failing test:
   a. STALE ASSERTION (most common): the test is asserting old buggy behavior. Update the test
      to match the new (correct) source behavior. For snapshot tests, run \`pnpm test:run -u\`
      to update the .snap files. For inline assertions, edit the .spec.ts/.spec.js file.
   b. REAL REGRESSION (rare): the source fix introduced a real bug. In that case you may fix the
      source code WITHIN YOUR SCOPE PATHS. Be conservative — prefer to update the test first.
   c. MOCK UPDATE (common in config/foundry): the source switched APIs (e.g. execSync →
      execFileSync). Update the test's vi.mock() to include the new export.
3. Re-run \`pnpm test:run\` until green. If you can't get green, capture what's left in the report.

HARD CONSTRAINTS:
- Modify ONLY files under: $PATHS.
- Do NOT touch files in other packages.
- Do NOT run \`pnpm install\`, \`pnpm nx\`, \`bun\`, \`cargo\`, or \`git\`. The dispatcher will commit.
- vitest, pnpm test:run (the local script), pnpm typecheck, pnpm build:types are all allowed
  WITHIN your scope directory only.
- If updating a snapshot, run vitest with -u flag (allowed).
- Prefer the smallest test changes. A 1-line assertion update beats restructuring a test file.

OUTPUT REPORT: '$FIX_REPORT' with structure:

# $NAME test fixes

**Package:** $ID
**Scope:** $PATHS

## Summary
<2-4 sentences>

## Tests passing
<count or 'all'>

## Tests still failing
<count and short list, if any>

## Changes
- path:line - <one-line description>
- ...

Be ruthless about distinguishing stale assertions (update test) from real regressions (rare; fix source).
EOF

echo "[$(date +%H:%M:%S)] dispatching TEST-FIX $ID: $NAME" >> "$DISPATCH_LOG"
printf '%s\n' "running" > "$STATUS"

if timeout 1800 codex exec \
    --sandbox workspace-write \
    --ephemeral \
    -c model_reasoning_effort=high \
    - < "$PROMPT_FILE" > "$LOG" 2>&1; then
  CODEX_RC=0
else
  CODEX_RC=$?
fi

# Commit lock
LOCK_ATTEMPTS=0
while ! mkdir "$LOCK_DIR" 2>/dev/null; do
  LOCK_ATTEMPTS=$((LOCK_ATTEMPTS+1))
  if [ "$LOCK_ATTEMPTS" -gt 600 ]; then
    printf 'failed:lock\n' > "$STATUS"
    exit 1
  fi
  sleep 1
done
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

# Stage scope + report
for p in $PATHS; do
  [ -e "$p" ] && git add "$p" 2>>"$LOG"
done
git add "$FIX_REPORT" 2>>"$LOG" || true

STAGED_FILES=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
STAGED_SCOPE_FILES=$(git diff --cached --name-only 2>/dev/null | grep -v "^\.review-slices/" | wc -l | tr -d ' ')

# Commit message
COMMIT_MSG_FILE="$OUT_DIR/$ID.fix.commit-msg"
{
  printf '🧪 fix(%s): update tests after review fix wave (%s)\n\n' "$ID" "$NAME"
  echo "Scope: $PATHS"
  echo ""
  if [ -f "$FIX_REPORT" ]; then
    awk '/^## Summary/{flag=1;next}/^## /{flag=0}flag' "$FIX_REPORT" | sed '/^$/N;/\n$/d'
  fi
  echo ""
  echo "<prompt>when all tickets are implemented do a full check of tests hive tests lint etc. everything make sure everything passes.</prompt>"
  echo ""
  echo "Co-Authored-By: Codex (GPT-5.5) <noreply@openai.com>"
  echo "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
} > "$COMMIT_MSG_FILE"

if [ "$STAGED_FILES" -gt 0 ]; then
  if git commit -F "$COMMIT_MSG_FILE" --no-verify >>"$LOG" 2>&1; then
    COMMIT_HASH=$(git rev-parse --short HEAD)
    echo "$COMMIT_HASH" > "$OUT_DIR/$ID.fix.commit"
    echo "[$(date +%H:%M:%S)] COMMIT $ID -> $COMMIT_HASH (scope=$STAGED_SCOPE_FILES)" >> "$DISPATCH_LOG"
  else
    echo "[$(date +%H:%M:%S)] COMMIT-FAIL $ID" >> "$DISPATCH_LOG"
  fi
else
  echo "[$(date +%H:%M:%S)] NOCHANGES $ID" >> "$DISPATCH_LOG"
fi

rmdir "$LOCK_DIR" 2>/dev/null
trap - EXIT

if [ "$CODEX_RC" -ne 0 ]; then
  printf 'failed:codex-rc-%s\n' "$CODEX_RC" > "$STATUS"
elif [ "$STAGED_FILES" -eq 0 ]; then
  printf 'no-changes\n' > "$STATUS"
else
  printf 'ok:%s\n' "$STAGED_SCOPE_FILES" > "$STATUS"
fi

#!/usr/bin/env bash
# Dispatch one codex FIX job for a slice.
# Codex investigates findings, applies minimal fixes, writes a fix report.
# The dispatcher (not codex) makes the git commit, serialized via a mkdir lock.
#
# Usage: _fix_dispatch.sh <ID> <NAME> <TYPE> <PATHS> <HINTS>
set -uo pipefail

ID="$1"; NAME="$2"; TYPE="$3"; PATHS="$4"; HINTS="$5"
OUT_DIR=".review-slices"
REVIEW="$OUT_DIR/$ID.md"
FIX_REPORT="$OUT_DIR/$ID.fix.md"
LOG="$OUT_DIR/$ID.fix.log"
STATUS="$OUT_DIR/$ID.fix.status"
PROMPT_FILE="$OUT_DIR/$ID.fix.prompt"
LOCK_DIR="$OUT_DIR/.commit.lock"
DISPATCH_LOG="$OUT_DIR/_fix_dispatch.log"

# ---- 1. Build the fix prompt for codex
cat > "$PROMPT_FILE" <<EOF
You are fixing real bugs in the Tevm monorepo identified by a prior code review.

SLICE ID:     $ID
SLICE NAME:   $NAME
SLICE TYPE:   $TYPE
SCOPE PATHS:  $PATHS
HINTS:        $HINTS
REVIEW FILE:  $REVIEW (open this — it contains the findings to address)

PROCESS — for every finding in $REVIEW:
1. Open the cited file:line and verify the issue against the actual code.
2. If REAL: apply the SMALLEST correct fix. Match existing style. Preserve public APIs unless
   the finding explicitly requires changing them.
3. If FALSE POSITIVE: leave the code alone. Note in the fix report why.
4. If DUPLICATE / already addressed by another finding's fix: note in the fix report.
5. If TOO RISKY to fix without a deeper design discussion (e.g., changes touch consensus
   semantics across multiple packages, requires new state, or has no obvious narrow fix):
   note as "deferred" with a clear explanation.

HARD CONSTRAINTS:
- You may ONLY modify files under SCOPE PATHS above.
- Do NOT touch files outside SCOPE PATHS — including barrel files in 'tevm/' unless 'tevm' is
  in your scope. If a fix legitimately requires an out-of-scope change, defer it instead.
- Do NOT run \`pnpm\`, \`bun\`, \`nx\`, \`npm\`, \`cargo\`, \`node\`, \`tsc\`, \`vitest\`, or any build/test command.
- Do NOT run \`git\` commands. The dispatcher will commit your changes after you exit.
- Do NOT create new packages or new top-level directories. Adding a new file inside an existing
  package's src/ is fine if a finding requires it.
- Do NOT add new external dependencies.
- Do NOT refactor surrounding code, rename symbols, or "improve" unrelated areas.
- Prefer minimal diffs. A 2-line fix beats a 20-line one.

OUTPUT REPORT: when done, write your fix report to '$FIX_REPORT' using this exact skeleton:

# $NAME fix report

**Slice:** $ID
**Type:** $TYPE
**Scope:** $PATHS

## Summary

<2-4 sentences: how many findings were addressed vs deferred, and any thematic note.>

## Fixes applied

### [SEVERITY] Original finding headline
**Location:** path:line
**Files modified:** path/to/file.ext (and others if applicable)
**Issue:** <one-line restatement of what was wrong>
**Fix:** <one-line description of the change you made>

<...repeat per applied fix, worst-first within each severity bucket...>

## Skipped / deferred

### [SEVERITY] Original finding headline
**Reason:** false-positive | duplicate | out-of-scope | too-risky-to-auto-fix
**Explanation:** <why, in one or two sentences>

<...>

CONSTRAINTS RECAP: only modify files in SCOPE. No git. No tests. No builds. Write only the fix
report and the actual source-file edits. Be ruthless about "skip vs fix" — a missed fix is
recoverable, a wrong fix is a regression.
EOF

echo "[$(date +%H:%M:%S)] dispatching FIX $ID: $NAME" >> "$DISPATCH_LOG"
printf '%s\n' "running" > "$STATUS"

# Snapshot which files exist under scope before codex runs, so we can detect adds.
SCOPE_LIST_BEFORE="$OUT_DIR/$ID.fix.scope.before"
( for p in $PATHS; do find "$p" -type f 2>/dev/null; done ) | sort > "$SCOPE_LIST_BEFORE"

# ---- 2. Run codex with workspace-write sandbox + high reasoning
if timeout 2700 codex exec \
    --sandbox workspace-write \
    --ephemeral \
    -c model_reasoning_effort=high \
    - < "$PROMPT_FILE" > "$LOG" 2>&1; then
  CODEX_RC=0
else
  CODEX_RC=$?
fi

# ---- 3. Build space-separated pathspec for git add (scope paths only)
ADD_PATHS=""
for p in $PATHS; do
  if [ -e "$p" ]; then
    ADD_PATHS="$ADD_PATHS $p"
  fi
done
# Always add the fix report.
ADD_PATHS="$ADD_PATHS $FIX_REPORT"

# ---- 4. Acquire commit lock (mkdir is atomic on macOS).
LOCK_ATTEMPTS=0
while ! mkdir "$LOCK_DIR" 2>/dev/null; do
  LOCK_ATTEMPTS=$((LOCK_ATTEMPTS+1))
  if [ "$LOCK_ATTEMPTS" -gt 600 ]; then
    echo "[$(date +%H:%M:%S)] LOCK-TIMEOUT $ID" >> "$DISPATCH_LOG"
    printf 'failed:lock\n' > "$STATUS"
    exit 1
  fi
  sleep 1
done
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

# ---- 5. Determine what to commit
# Identify out-of-scope source-tree changes (warn but don't commit them as part of this slice).
OUT_OF_SCOPE_FILE="$OUT_DIR/$ID.fix.out-of-scope.txt"
git status --porcelain 2>/dev/null | awk '{print $NF}' > "$OUT_DIR/$ID.fix.changed.txt"

OUT_OF_SCOPE_COUNT=0
> "$OUT_OF_SCOPE_FILE"
while read -r f; do
  [ -z "$f" ] && continue
  in_scope=0
  # Always-allowed: fix report and codex log files for this slice
  case "$f" in
    "$FIX_REPORT"|"$LOG"|"$STATUS"|"$PROMPT_FILE"|"$OUT_DIR/$ID."*) in_scope=1;;
    "$OUT_DIR/"*) in_scope=1;;  # Don't fail on other dispatcher metadata
  esac
  if [ "$in_scope" -eq 0 ]; then
    for p in $PATHS; do
      case "$f" in
        "$p"/*|"$p") in_scope=1; break;;
      esac
    done
  fi
  if [ "$in_scope" -eq 0 ]; then
    echo "$f" >> "$OUT_OF_SCOPE_FILE"
    OUT_OF_SCOPE_COUNT=$((OUT_OF_SCOPE_COUNT+1))
  fi
done < "$OUT_DIR/$ID.fix.changed.txt"

# ---- 6. Stage in-scope files (only).
# Use pathspecs literally.
SCOPE_ADDED=0
for p in $PATHS; do
  if [ -e "$p" ]; then
    if git add "$p" 2>>"$LOG"; then
      SCOPE_ADDED=$((SCOPE_ADDED+1))
    fi
  fi
done
# Add the fix report (it lives under .review-slices/ which is outside source scope but is the
# dispatcher's own artifact).
git add "$FIX_REPORT" 2>>"$LOG" || true

# ---- 7. Check whether anything was actually staged for this slice's scope.
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
STAGED_SCOPE_FILES=$(git diff --cached --name-only 2>/dev/null | grep -v "^\.review-slices/" | wc -l | tr -d ' ')

# ---- 8. Build commit message.
FIX_COUNT=0
DEFERRED_COUNT=0
if [ -f "$FIX_REPORT" ]; then
  FIX_COUNT=$(awk '/^## Fixes applied/{flag=1;next}/^## /{flag=0}flag&&/^### /' "$FIX_REPORT" | wc -l | tr -d ' ')
  DEFERRED_COUNT=$(awk '/^## Skipped/{flag=1;next}/^## /{flag=0}flag&&/^### /' "$FIX_REPORT" | wc -l | tr -d ' ')
fi

# Pick an emoji prefix.
EMOJI="🐛 fix"
case "$NAME" in
  *Security*|*security*|*RCE*|*precompile*) EMOJI="🔒 fix";;
esac

SHORT_PATHS=$(echo "$PATHS" | tr ' ' ',' | sed 's/,$//')
if [ ${#SHORT_PATHS} -gt 60 ]; then
  SHORT_PATHS=$(echo "$SHORT_PATHS" | cut -c1-57)...
fi

COMMIT_MSG_FILE="$OUT_DIR/$ID.fix.commit-msg"
{
  if [ "$FIX_COUNT" -gt 0 ]; then
    printf '%s(%s): apply review fixes for %s slice (%s fixed, %s deferred)\n\n' \
      "$EMOJI" "$ID" "$NAME" "$FIX_COUNT" "$DEFERRED_COUNT"
  else
    printf '%s(%s): record review triage for %s slice (%s deferred, 0 fixed)\n\n' \
      "📝 chore" "$ID" "$NAME" "$DEFERRED_COUNT"
  fi
  echo "Slice: $ID ($TYPE)"
  echo "Scope: $PATHS"
  echo ""
  if [ -f "$FIX_REPORT" ]; then
    awk '/^## Summary/{flag=1;next}/^## /{flag=0}flag' "$FIX_REPORT" | sed '/^$/N;/\n$/d'
  fi
  echo ""
  echo "<prompt>deploy parallel /codex agents to further investigate and fix all issues 16 agents at a time concurrency</prompt>"
  echo ""
  echo "Co-Authored-By: Codex (GPT-5.5) <noreply@openai.com>"
  echo "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
} > "$COMMIT_MSG_FILE"

# ---- 9. Commit (only if something is staged).
COMMIT_RC=0
if [ "$STAGED_FILES" -gt 0 ]; then
  if git commit -F "$COMMIT_MSG_FILE" --no-verify >>"$LOG" 2>&1; then
    COMMIT_HASH=$(git rev-parse --short HEAD)
    echo "$COMMIT_HASH" > "$OUT_DIR/$ID.fix.commit"
    echo "[$(date +%H:%M:%S)] COMMIT $ID -> $COMMIT_HASH (staged=$STAGED_FILES scope=$STAGED_SCOPE_FILES out-of-scope=$OUT_OF_SCOPE_COUNT)" >> "$DISPATCH_LOG"
  else
    COMMIT_RC=$?
    echo "[$(date +%H:%M:%S)] COMMIT-FAIL $ID rc=$COMMIT_RC" >> "$DISPATCH_LOG"
  fi
else
  echo "[$(date +%H:%M:%S)] NOCHANGES $ID" >> "$DISPATCH_LOG"
fi

# ---- 10. Release lock
rmdir "$LOCK_DIR" 2>/dev/null
trap - EXIT

# ---- 11. Final status
if [ "$CODEX_RC" -ne 0 ]; then
  printf 'failed:codex-rc-%s\n' "$CODEX_RC" > "$STATUS"
elif [ "$COMMIT_RC" -ne 0 ]; then
  printf 'failed:commit-rc-%s\n' "$COMMIT_RC" > "$STATUS"
elif [ "$STAGED_FILES" -eq 0 ]; then
  printf 'no-changes\n' > "$STATUS"
else
  printf 'ok:%s:%s\n' "$STAGED_SCOPE_FILES" "$OUT_OF_SCOPE_COUNT" > "$STATUS"
fi

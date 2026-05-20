#!/usr/bin/env bash
# Aggregate all slice reports into review.md.
# Output: executive summary by severity + per-slice appendix.
set -uo pipefail

OUT="review.md"
SLICES_DIR=".review-slices"
TSV="$SLICES_DIR/_slices.tsv"

# Collect all slice reports
declare -a SLICE_IDS
while IFS=$'\t' read -r ID NAME TYPE PATHS HINTS; do
  SLICE_IDS+=("$ID")
done < "$TSV"

# Build the exec-summary by severity by extracting headings from each report.
# Each finding looks like:
#   ### [CRITICAL] Some headline
#   **Location:** ...
# We grep these out and group by severity.

TMP="$SLICES_DIR/_summary.tmp"
> "$TMP"

for ID in "${SLICE_IDS[@]}"; do
  REPORT="$SLICES_DIR/$ID.md"
  [ -f "$REPORT" ] || continue
  # Extract finding lines: "### [SEV] headline" followed by next line "**Location:** ..."
  awk -v slice="$ID" '
    /^### \[/ {
      headline = $0
      sub(/^### \[/, "", headline)
      sev = headline
      sub(/\].*/, "", sev)
      title = headline
      sub(/^[A-Za-z]*\] */, "", title)
      getline loc_line
      loc = loc_line
      sub(/^\*\*Location:\*\* */, "", loc)
      print sev "\t" slice "\t" title "\t" loc
    }
  ' "$REPORT" >> "$TMP"
done

# Helper to render one severity bucket
render_bucket() {
  local sev="$1"
  local heading="$2"
  local count
  count=$(awk -F'\t' -v s="$sev" '$1==s' "$TMP" | wc -l | tr -d ' ')
  if [ "$count" -gt 0 ]; then
    printf '\n### %s (%s)\n\n' "$heading" "$count"
    awk -F'\t' -v s="$sev" '$1==s {
      printf "- **[%s]** %s — `%s` _(from %s)_\n", $1, $3, $4, $2
    }' "$TMP"
  fi
}

# Write review.md
{
  echo "# Tevm Monorepo Comprehensive Review"
  echo
  echo "Generated $(date '+%Y-%m-%d %H:%M:%S %Z') by 32 parallel codex (GPT-5.x) agents across 16 horizontal (layer) and 16 vertical (feature) slices."
  echo
  echo "- **Horizontal slices** review one architectural layer at a time."
  echo "- **Vertical slices** trace one feature end-to-end across layers."
  echo
  total=$(wc -l < "$TMP" | tr -d ' ')
  crit=$(awk -F'\t' '$1=="CRITICAL"' "$TMP" | wc -l | tr -d ' ')
  high=$(awk -F'\t' '$1=="HIGH"' "$TMP" | wc -l | tr -d ' ')
  med=$(awk -F'\t' '$1=="MEDIUM"' "$TMP" | wc -l | tr -d ' ')
  low=$(awk -F'\t' '$1=="LOW"' "$TMP" | wc -l | tr -d ' ')
  nit=$(awk -F'\t' '$1=="NIT"' "$TMP" | wc -l | tr -d ' ')
  echo "**Total findings:** $total — Critical: $crit, High: $high, Medium: $med, Low: $low, Nit: $nit"
  echo
  echo "## Slice coverage"
  echo
  echo "| ID | Type | Slice | Status | Findings |"
  echo "|----|------|-------|--------|----------|"
  while IFS=$'\t' read -r ID NAME TYPE PATHS HINTS; do
    REPORT="$SLICES_DIR/$ID.md"
    STATUS_FILE="$SLICES_DIR/$ID.status"
    status="missing"
    [ -f "$STATUS_FILE" ] && status=$(cat "$STATUS_FILE")
    count=$(awk -F'\t' -v slice="$ID" '$2==slice' "$TMP" | wc -l | tr -d ' ')
    echo "| $ID | $TYPE | [$NAME](#$(echo "$ID" | tr '[:upper:]' '[:lower:]')-$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9' '-' | sed 's/--*/-/g; s/^-//; s/-$//')) | $status | $count |"
  done < "$TSV"
  echo
  echo "---"
  echo
  echo "## Executive summary by severity"

  render_bucket "CRITICAL" "Critical"
  render_bucket "HIGH" "High"
  render_bucket "MEDIUM" "Medium"
  render_bucket "LOW" "Low"
  render_bucket "NIT" "Nit"

  echo
  echo "---"
  echo
  echo "## Appendix — per-slice reports"
  echo
  echo "### Horizontal slices (layer reviews)"
  while IFS=$'\t' read -r ID NAME TYPE PATHS HINTS; do
    [[ "$ID" == H* ]] || continue
    REPORT="$SLICES_DIR/$ID.md"
    echo
    echo "<details>"
    echo "<summary><strong>$ID — $NAME</strong></summary>"
    echo
    if [ -f "$REPORT" ]; then
      cat "$REPORT"
    else
      echo "_Report missing._"
    fi
    echo
    echo "</details>"
  done < "$TSV"

  echo
  echo "### Vertical slices (feature reviews)"
  while IFS=$'\t' read -r ID NAME TYPE PATHS HINTS; do
    [[ "$ID" == V* ]] || continue
    REPORT="$SLICES_DIR/$ID.md"
    echo
    echo "<details>"
    echo "<summary><strong>$ID — $NAME</strong></summary>"
    echo
    if [ -f "$REPORT" ]; then
      cat "$REPORT"
    else
      echo "_Report missing._"
    fi
    echo
    echo "</details>"
  done < "$TSV"
} > "$OUT"

rm -f "$TMP"
echo "wrote $OUT"
wc -l "$OUT"

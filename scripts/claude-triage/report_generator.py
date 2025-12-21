"""
Report generator for Claude issue triage automation.

Generates structured reports for each iteration of the triage loop.
"""

from datetime import datetime
from pathlib import Path
from typing import Dict, List


class ReportGenerator:
    """Generates markdown reports for triage iterations."""

    def __init__(self, reports_dir: Path):
        self.reports_dir = reports_dir

    def generate_iteration_report(
        self,
        iteration: int,
        results: Dict,
        analysis: Dict,
        git_status: Dict
    ) -> str:
        """Generate a report for a single iteration."""

        start_time = results.get('start_time', 'Unknown')
        end_time = results.get('end_time', 'Unknown')
        duration = self._calculate_duration(start_time, end_time)

        # Format tools used
        tools_used = results.get('tools_used', [])
        tool_counts = {}
        for tool in tools_used:
            tool_counts[tool] = tool_counts.get(tool, 0) + 1
        tools_summary = ", ".join([f"{t}({c})" for t, c in sorted(tool_counts.items())])

        # Format issues
        issues_fixed = analysis.get('issues_fixed', [])
        issues_str = ", ".join([f"#{i}" for i in issues_fixed]) if issues_fixed else "None"

        # Format commits
        commits = analysis.get('commits_made', [])
        commits_str = "\n".join([f"- {c}" for c in commits]) if commits else "None"

        # Completion info
        completion = results.get('completion', {})
        cost = completion.get('cost_usd', 'N/A')
        turns = completion.get('num_turns', 'N/A')

        report = f"""# Triage Iteration {iteration} Report

**Generated:** {datetime.now().isoformat()}

## Summary

| Metric | Value |
|--------|-------|
| Start Time | {start_time} |
| End Time | {end_time} |
| Duration | {duration} |
| Issues Fixed | {issues_str} |
| Cost (USD) | {cost} |
| Turns | {turns} |

## Tools Used

{tools_summary or "None recorded"}

## Commits Made

{commits_str}

## Git Status

**Branch:** {git_status.get('branch', 'Unknown')}

**Recent Commits:**
```
{git_status.get('recent_commits', 'N/A')}
```

**Working Tree:**
```
{git_status.get('status', 'Unknown')}
```

## Analysis

- **Success:** {analysis.get('success', False)}
- **Needs Continuation:** {analysis.get('needs_continuation', True)}

## Messages (Last 5)

"""
        # Add last few messages
        messages = results.get('messages', [])[-5:]
        for i, msg in enumerate(messages, 1):
            report += f"### Message {i}\n```\n{msg[:500]}\n```\n\n"

        # Add errors if any
        if results.get('error'):
            report += f"""## Errors

```
{results['error']}
```
"""

        return report

    def _calculate_duration(self, start: str, end: str) -> str:
        """Calculate duration between two ISO timestamps."""
        try:
            start_dt = datetime.fromisoformat(start)
            end_dt = datetime.fromisoformat(end)
            delta = end_dt - start_dt
            minutes = delta.total_seconds() / 60
            return f"{minutes:.1f} minutes"
        except:
            return "Unknown"

    def generate_summary_report(self, iterations: List[Dict]) -> str:
        """Generate a summary report across all iterations."""
        total_issues = []
        total_commits = []
        total_cost = 0.0

        for it in iterations:
            analysis = it.get('analysis', {})
            results = it.get('results', {})

            total_issues.extend(analysis.get('issues_fixed', []))
            total_commits.extend(analysis.get('commits_made', []))

            completion = results.get('completion', {})
            if completion.get('cost_usd'):
                total_cost += float(completion['cost_usd'])

        report = f"""# Triage Session Summary

**Generated:** {datetime.now().isoformat()}
**Total Iterations:** {len(iterations)}

## Totals

| Metric | Value |
|--------|-------|
| Issues Fixed | {len(total_issues)} |
| Commits Made | {len(total_commits)} |
| Total Cost | ${total_cost:.4f} |

## Issues Fixed

{', '.join([f'#{i}' for i in total_issues]) or 'None'}

## All Commits

"""
        for commit in total_commits:
            report += f"- {commit}\n"

        return report

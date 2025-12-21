# Claude Issue Triage Automation

Automates the GitHub issue triage workflow using Claude Code/Agent SDK.

## Overview

This automation runs a continuous loop that:

1. **Generates a handoff prompt** with context about open issues, recent work, and codebase locations
2. **Runs Claude agent** with the prompt to investigate and fix issues
3. **Monitors progress** and captures results (tools used, messages, costs)
4. **Generates reports** for each iteration
5. **Creates handoff prompts** for the next iteration
6. **Commits reports** to the repository
7. **Loops** until max iterations reached or no more issues

## Installation

```bash
# Install the Claude Code SDK
pip install claude-code-sdk

# Or if using the CLI fallback, ensure claude is installed
npm install -g @anthropic-ai/claude-code
```

## Usage

### Basic Usage

```bash
# Run from repo root
python scripts/claude-triage/triage-loop.py
```

### Options

```bash
# Run with max 5 iterations
python scripts/claude-triage/triage-loop.py --max-iterations 5

# Dry run (don't commit reports)
python scripts/claude-triage/triage-loop.py --dry-run

# Specify repo path
python scripts/claude-triage/triage-loop.py --repo-path /path/to/repo
```

## Output

Reports are saved to `.claude/triage-reports/`:

- `iteration-001-TIMESTAMP.md` - Per-iteration reports
- `handoff-TIMESTAMP.md` - Archived handoff prompts
- `latest-handoff.md` - Current handoff prompt for next run
- `session-summary-TIMESTAMP.md` - Session summaries

## How It Works

### The Handoff Prompt

Each iteration starts with a structured prompt containing:

- **Previous session summary** - What was accomplished
- **Open issues** - Current GitHub issues to triage
- **Key code locations** - Important files and patterns
- **Commands** - Build, test, and git commands
- **Workflow phases** - Select, investigate, implement, resolve
- **Constraints** - Never push broken code, use conventional commits, etc.

### Context Preservation

The automation preserves context across agent sessions by:

1. Capturing what was accomplished (issues fixed, commits made)
2. Recording lessons learned from agent messages
3. Generating a new handoff prompt with this context
4. Saving the handoff for the next iteration

### Report Generation

Each iteration generates a markdown report with:

- Timing information
- Issues fixed
- Tools used (with counts)
- Commits made
- Git status
- Agent messages
- Any errors

## Customization

### Modifying the Prompt Template

Edit `prompt_template.py` to customize:

- Code locations for your project
- Build/test commands
- Workflow phases
- Constraints and style notes

### Adjusting Report Format

Edit `report_generator.py` to customize:

- Report sections
- Metrics tracked
- Summary format

## Troubleshooting

### SDK Not Found

If you get "claude-code-sdk not installed", the script will fall back to CLI mode using the `claude` command.

### Git Errors

Ensure you have proper git credentials configured and push access to the repository.

### Rate Limits

The script respects natural pauses between iterations. For high-volume usage, consider adding explicit delays.

## Architecture

```
scripts/claude-triage/
├── __init__.py           # Package marker
├── triage-loop.py        # Main automation script
├── prompt_template.py    # Handoff prompt generation
├── report_generator.py   # Report generation
└── README.md            # This file
```

## Example Session

```
##############################################################
# CLAUDE ISSUE TRIAGE AUTOMATION
# Started: 2024-01-15T10:30:00
# Max iterations: 10
# Dry run: False
##############################################################

Generating initial prompt...

============================================================
ITERATION 1
Started: 2024-01-15T10:30:05
============================================================

Running Claude agent...
Analyzing results...
Report saved: .claude/triage-reports/iteration-001-20240115-103500.md
Committed: Triage iteration 1 report

============================================================
ITERATION 2
...
```

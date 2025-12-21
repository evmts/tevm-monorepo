#!/usr/bin/env python3
"""
Claude Issue Triage Automation Loop

This script automates the issue triage workflow:
1. Generates/reads a handoff prompt
2. Runs Claude agent with the prompt
3. Monitors progress and captures results
4. Generates reports and saves them
5. Creates next handoff prompt
6. Commits and loops

Usage:
    python scripts/claude-triage/triage-loop.py [--max-iterations N] [--dry-run]
"""

import asyncio
import argparse
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from prompt_template import generate_initial_prompt, generate_handoff_prompt
from report_generator import ReportGenerator

# Try to import claude-agent-sdk
try:
    from claude_code_sdk import query, ClaudeCodeOptions, AssistantMessage, ResultMessage, ToolUseBlock, TextBlock
    SDK_AVAILABLE = True
except ImportError:
    print("Warning: claude-code-sdk not installed. Install with: pip install claude-code-sdk")
    SDK_AVAILABLE = False


class TriageLoop:
    """Manages the automated issue triage loop."""

    def __init__(
        self,
        repo_path: str,
        reports_dir: str = ".claude/triage-reports",
        max_iterations: int = 10,
        dry_run: bool = False
    ):
        self.repo_path = Path(repo_path)
        self.reports_dir = self.repo_path / reports_dir
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        self.max_iterations = max_iterations
        self.dry_run = dry_run
        self.report_generator = ReportGenerator(self.reports_dir)
        self.current_iteration = 0
        self.session_start = datetime.now()

    def get_git_status(self) -> dict:
        """Get current git status for context."""
        try:
            branch = subprocess.check_output(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                cwd=self.repo_path, text=True
            ).strip()

            recent_commits = subprocess.check_output(
                ["git", "log", "--oneline", "-5"],
                cwd=self.repo_path, text=True
            ).strip()

            status = subprocess.check_output(
                ["git", "status", "--short"],
                cwd=self.repo_path, text=True
            ).strip()

            return {
                "branch": branch,
                "recent_commits": recent_commits,
                "status": status or "(clean)"
            }
        except subprocess.CalledProcessError as e:
            return {"error": str(e)}

    def get_open_issues(self) -> list:
        """Fetch open issues from GitHub."""
        try:
            result = subprocess.check_output(
                ["gh", "issue", "list", "--state", "open", "--limit", "20", "--json",
                 "number,title,createdAt,labels,body"],
                cwd=self.repo_path, text=True
            )
            return json.loads(result)
        except subprocess.CalledProcessError as e:
            print(f"Warning: Could not fetch issues: {e}")
            return []

    def load_previous_handoff(self) -> Optional[str]:
        """Load the most recent handoff prompt if it exists."""
        handoff_file = self.reports_dir / "latest-handoff.md"
        if handoff_file.exists():
            return handoff_file.read_text()
        return None

    def save_handoff(self, handoff: str):
        """Save handoff prompt for next iteration."""
        handoff_file = self.reports_dir / "latest-handoff.md"
        handoff_file.write_text(handoff)

        # Also save timestamped version
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        archive_file = self.reports_dir / f"handoff-{timestamp}.md"
        archive_file.write_text(handoff)

    def commit_reports(self, message: str):
        """Commit report files."""
        if self.dry_run:
            print(f"[DRY RUN] Would commit: {message}")
            return

        try:
            subprocess.run(
                ["git", "add", str(self.reports_dir)],
                cwd=self.repo_path, check=True
            )
            subprocess.run(
                ["git", "commit", "-m", f"📝 docs: {message}"],
                cwd=self.repo_path, check=True
            )
            print(f"Committed: {message}")
        except subprocess.CalledProcessError as e:
            print(f"Warning: Could not commit: {e}")

    async def run_agent(self, prompt: str) -> dict:
        """Run Claude agent with the given prompt and capture results."""
        if not SDK_AVAILABLE:
            print("SDK not available, using CLI fallback...")
            return await self.run_agent_cli(prompt)

        results = {
            "start_time": datetime.now().isoformat(),
            "prompt_length": len(prompt),
            "tools_used": [],
            "messages": [],
            "completion": None,
            "error": None
        }

        try:
            async for message in query(
                prompt=prompt,
                options=ClaudeCodeOptions(
                    allowed_tools=["Read", "Edit", "Write", "Bash", "Glob", "Grep", "Task", "TodoWrite"],
                    permission_mode="acceptEdits",
                    cwd=str(self.repo_path)
                )
            ):
                # Track assistant messages
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, ToolUseBlock):
                            results["tools_used"].append(block.name)
                        elif isinstance(block, TextBlock):
                            # Capture significant text (skip very long outputs)
                            if len(block.text) < 2000:
                                results["messages"].append(block.text[:500])

                # Capture completion
                elif isinstance(message, ResultMessage):
                    results["completion"] = {
                        "duration_ms": message.duration_ms,
                        "cost_usd": message.total_cost_usd,
                        "num_turns": message.num_turns,
                        "is_error": message.is_error,
                        "result": message.result[:1000] if message.result else None
                    }

        except Exception as e:
            results["error"] = str(e)

        results["end_time"] = datetime.now().isoformat()
        return results

    async def run_agent_cli(self, prompt: str) -> dict:
        """Fallback: Run Claude via CLI."""
        results = {
            "start_time": datetime.now().isoformat(),
            "prompt_length": len(prompt),
            "tools_used": [],
            "messages": [],
            "completion": None,
            "error": None,
            "mode": "cli_fallback"
        }

        # Save prompt to temp file
        prompt_file = self.reports_dir / "temp-prompt.md"
        prompt_file.write_text(prompt)

        try:
            # Run claude with the prompt
            process = await asyncio.create_subprocess_exec(
                "claude",
                "--print",  # Non-interactive mode
                "--allowedTools", "Read,Edit,Write,Bash,Glob,Grep,Task,TodoWrite",
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(self.repo_path)
            )

            stdout, stderr = await process.communicate(input=prompt.encode())

            results["messages"].append(stdout.decode()[:5000])
            if stderr:
                results["error"] = stderr.decode()[:1000]

            results["completion"] = {
                "return_code": process.returncode,
                "is_error": process.returncode != 0
            }

        except Exception as e:
            results["error"] = str(e)
        finally:
            prompt_file.unlink(missing_ok=True)

        results["end_time"] = datetime.now().isoformat()
        return results

    def analyze_results(self, results: dict) -> dict:
        """Analyze agent results to determine what was accomplished."""
        analysis = {
            "issues_fixed": [],
            "issues_investigated": [],
            "files_changed": [],
            "commits_made": [],
            "success": False,
            "needs_continuation": True
        }

        # Check git for changes since we started
        try:
            log = subprocess.check_output(
                ["git", "log", "--oneline", f"--since={results['start_time']}", "-10"],
                cwd=self.repo_path, text=True
            ).strip()

            if log:
                analysis["commits_made"] = log.split("\n")
                analysis["success"] = True

                # Parse commit messages for issue numbers
                import re
                for commit in analysis["commits_made"]:
                    matches = re.findall(r"#(\d+)", commit)
                    analysis["issues_fixed"].extend(matches)

        except subprocess.CalledProcessError:
            pass

        # Check if completion indicates more work needed
        if results.get("completion"):
            comp = results["completion"]
            if comp.get("is_error"):
                analysis["needs_continuation"] = True
            elif comp.get("result") and "no more issues" in comp["result"].lower():
                analysis["needs_continuation"] = False

        return analysis

    async def run_iteration(self, prompt: str) -> dict:
        """Run a single iteration of the triage loop."""
        self.current_iteration += 1
        iteration_start = datetime.now()

        print(f"\n{'='*60}")
        print(f"ITERATION {self.current_iteration}")
        print(f"Started: {iteration_start.isoformat()}")
        print(f"{'='*60}\n")

        # Run the agent
        print("Running Claude agent...")
        results = await self.run_agent(prompt)

        # Analyze what happened
        print("Analyzing results...")
        analysis = self.analyze_results(results)

        # Generate report
        report = self.report_generator.generate_iteration_report(
            iteration=self.current_iteration,
            results=results,
            analysis=analysis,
            git_status=self.get_git_status()
        )

        # Save report
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        report_file = self.reports_dir / f"iteration-{self.current_iteration:03d}-{timestamp}.md"
        report_file.write_text(report)
        print(f"Report saved: {report_file}")

        # Generate handoff for next iteration
        if analysis["needs_continuation"]:
            handoff = generate_handoff_prompt(
                completed_issues=analysis["issues_fixed"],
                open_issues=self.get_open_issues(),
                git_status=self.get_git_status(),
                lessons_learned=results.get("messages", [])[-3:],  # Last few messages as context
                iteration=self.current_iteration
            )
            self.save_handoff(handoff)

        # Commit reports
        self.commit_reports(f"Triage iteration {self.current_iteration} report")

        return {
            "iteration": self.current_iteration,
            "results": results,
            "analysis": analysis,
            "needs_continuation": analysis["needs_continuation"]
        }

    async def run(self):
        """Run the main triage loop."""
        print(f"\n{'#'*60}")
        print("# CLAUDE ISSUE TRIAGE AUTOMATION")
        print(f"# Started: {self.session_start.isoformat()}")
        print(f"# Max iterations: {self.max_iterations}")
        print(f"# Dry run: {self.dry_run}")
        print(f"{'#'*60}\n")

        # Get initial prompt
        previous_handoff = self.load_previous_handoff()
        if previous_handoff:
            print("Loaded previous handoff prompt")
            prompt = previous_handoff
        else:
            print("Generating initial prompt...")
            prompt = generate_initial_prompt(
                open_issues=self.get_open_issues(),
                git_status=self.get_git_status()
            )

        # Main loop
        while self.current_iteration < self.max_iterations:
            try:
                result = await self.run_iteration(prompt)

                if not result["needs_continuation"]:
                    print("\n✅ No more issues to process. Stopping.")
                    break

                # Load the handoff we just saved for next iteration
                prompt = self.load_previous_handoff()
                if not prompt:
                    print("\n⚠️ No handoff prompt generated. Stopping.")
                    break

            except KeyboardInterrupt:
                print("\n\n⚠️ Interrupted by user")
                break
            except Exception as e:
                print(f"\n❌ Error in iteration: {e}")
                import traceback
                traceback.print_exc()
                break

        # Final summary
        self.generate_session_summary()

    def generate_session_summary(self):
        """Generate a summary of the entire session."""
        summary = f"""# Triage Session Summary

**Session Start:** {self.session_start.isoformat()}
**Session End:** {datetime.now().isoformat()}
**Iterations Completed:** {self.current_iteration}

## Git Status
```
{self.get_git_status().get('recent_commits', 'N/A')}
```

## Reports Generated
"""

        for report in sorted(self.reports_dir.glob("iteration-*.md")):
            summary += f"- {report.name}\n"

        summary_file = self.reports_dir / f"session-summary-{self.session_start.strftime('%Y%m%d-%H%M%S')}.md"
        summary_file.write_text(summary)
        print(f"\nSession summary saved: {summary_file}")


async def main():
    parser = argparse.ArgumentParser(description="Claude Issue Triage Automation")
    parser.add_argument("--max-iterations", type=int, default=10, help="Maximum iterations to run")
    parser.add_argument("--dry-run", action="store_true", help="Don't commit changes")
    parser.add_argument("--repo-path", default=".", help="Path to repository")
    args = parser.parse_args()

    # Resolve repo path
    repo_path = Path(args.repo_path).resolve()
    if not (repo_path / ".git").exists():
        print(f"Error: {repo_path} is not a git repository")
        sys.exit(1)

    loop = TriageLoop(
        repo_path=str(repo_path),
        max_iterations=args.max_iterations,
        dry_run=args.dry_run
    )

    await loop.run()


if __name__ == "__main__":
    asyncio.run(main())

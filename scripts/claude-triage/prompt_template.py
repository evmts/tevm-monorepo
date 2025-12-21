"""
Prompt templates for Claude issue triage automation.

These templates generate high-quality handoff prompts that preserve context
across agent sessions.
"""

from datetime import datetime
from typing import List, Dict, Optional


def generate_initial_prompt(
    open_issues: List[Dict],
    git_status: Dict,
    previous_summary: Optional[str] = None
) -> str:
    """Generate the initial triage prompt."""

    # Format issues for the prompt
    issue_list = format_issues(open_issues)

    prompt = f"""<task>
    <objective>
      Continue triaging and fixing GitHub issues from the tevm-monorepo, prioritizing low-hanging fruit.
    </objective>

    <previous_session_summary>
      <completed>
        {previous_summary or "No previous session data available."}
      </completed>

      <environment_notes>
        <note>Some tests fail due to missing `forge` command (Foundry not installed) - expected</note>
        <note>Some tests fail due to missing RPC env vars (TEVM_RPC_URLS_MAINNET, TEVM_RPC_URLS_OPTIMISM) - expected</note>
        <note>If nx is slow, run `pnpm nx reset` to fix</note>
      </environment_notes>
    </previous_session_summary>

    <open_issues>
{issue_list}
    </open_issues>

    <key_code_locations>
      <location path="packages/actions/src/createHandlers.js" purpose="RPC handler mapping - where all handlers are wired up">
        - ethHandlers object: all eth_* methods
        - anvilHandlers object: all anvil_* methods
        - evmHandlers object: evm_* methods (evm_setNextBlockTimestamp, evm_snapshot, evm_revert)
        - Pattern: handlers can be inline functions or imported procedures
      </location>
      <location path="packages/actions/src/eth/" purpose="eth_* procedure implementations"/>
      <location path="packages/actions/src/anvil/" purpose="anvil_* procedure implementations"/>
      <location path="packages/node/src/createTevmNode.js" purpose="TevmNode creation with state management">
        Pattern for adding state: declare variable, create getter/setter, add to baseClient AND deepCopy
      </location>
      <location path="packages/node/src/TevmNode.ts" purpose="TevmNode type definitions"/>
      <location path="packages/state/src/actions/" purpose="State management - checkpoint/revert"/>
      <location path="packages/memory-client/src/test/viem/" purpose="Integration tests using viem test client"/>
      <location path="packages/utils/src/prefundedAccounts.ts" purpose="Default test accounts"/>
      <location path="tevm/" purpose="Main tevm package exports"/>
    </key_code_locations>

    <commands>
      <command name="build" cmd="pnpm nx run-many --targets=build:dist,build:types"/>
      <command name="build_specific" cmd="pnpm nx run-many --targets=build:dist,build:types --projects=@tevm/actions,@tevm/node"/>
      <command name="test_all" cmd="pnpm test:run"/>
      <command name="test_single" cmd="pnpm vitest run path/to/file.spec.ts"/>
      <command name="test_coverage" cmd="pnpm test:coverage"/>
      <command name="lint" cmd="bun lint"/>
      <command name="reset_nx" cmd="pnpm nx reset"/>
      <command name="fetch_issue" cmd="gh issue view NUMBER"/>
      <command name="close_issue" cmd="gh issue close NUMBER --comment 'message'"/>
    </commands>

    <workflow>
      <phase name="select">
        1. Review the open issues above
        2. Select the most tractable issue (prefer low complexity, existing investigation)
        3. Fetch latest issue comments with `gh issue view NUMBER`
      </phase>

      <phase name="investigate">
        1. Search for existing handlers/implementations
        2. Check if tests already exist
        3. Identify all files that need changes
      </phase>

      <phase name="implement">
        1. Make the code changes
        2. Run build: `pnpm nx run-many --targets=build:dist,build:types --projects=@tevm/actions,@tevm/node`
        3. Run relevant tests: `pnpm vitest run path/to/file.spec.ts`
        4. Only proceed if both pass
      </phase>

      <phase name="resolve">
        <if condition="fix_successful">
          <step>Commit with emoji conventional format: ✨ feat: / 🐛 fix: / etc.</step>
          <step>Include "Fixes #NUMBER" in commit message to auto-close</step>
          <step>Push to main: git push</step>
          <step>Add explanatory comment to issue</step>
        </if>
        <if condition="fix_failed_or_blocked">
          <step>Do NOT push broken code</step>
          <step>Comment on issue with findings/learnings</step>
          <step>Leave issue open</step>
          <step>Document blockers</step>
        </if>
      </phase>

      <phase name="continue">
        <step>If time/context remains, select next issue and repeat</step>
        <step>When context is filling up, prepare handoff notes</step>
      </phase>
    </workflow>

    <constraints>
      <constraint>Never push code that doesn't build</constraint>
      <constraint>Never push code that fails tests (beyond expected env-related failures)</constraint>
      <constraint>Always work on main branch</constraint>
      <constraint>Validate fix before claiming success</constraint>
      <constraint>Use emoji conventional commits (✨ feat:, 🐛 fix:, ⚡ perf:, 📝 docs:, etc.)</constraint>
      <constraint>Include "Fixes #NUMBER" in commit message to auto-close issues</constraint>
      <constraint>Add Co-Authored-By: Claude Opus 4.5 to commits</constraint>
    </constraints>

    <code_style_notes>
      <note>JavaScript with JSDoc preferred over TypeScript for source files</note>
      <note>Tests use real examples, not mocks (except bundler packages)</note>
      <note>Single file per function/class (e.g., createFoo.js)</note>
      <note>Always include complete JSDoc with @example, @throws, @param, @returns</note>
      <note>Biome for formatting (tabs, 120 char lines, single quotes)</note>
      <note>Inline imports in JSDoc preferred over top-of-file imports for better tree shaking</note>
    </code_style_notes>

    <commit_format>
      <example>
  git commit -m "$(cat &lt;&lt;'EOF'
  ✨ feat: implement feature description

  Fixes #NUMBER

  - Change 1
  - Change 2

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
  EOF
  )"
      </example>
    </commit_format>

    <git_status>
      <branch>{git_status.get('branch', 'unknown')}</branch>
      <recent_commits>
{git_status.get('recent_commits', 'N/A')}
      </recent_commits>
      <status>{git_status.get('status', 'unknown')}</status>
    </git_status>
  </task>
"""
    return prompt


def generate_handoff_prompt(
    completed_issues: List[str],
    open_issues: List[Dict],
    git_status: Dict,
    lessons_learned: List[str],
    iteration: int
) -> str:
    """Generate a handoff prompt for the next agent session."""

    # Format completed issues
    completed_str = "\n".join([f"        - Issue #{i}" for i in completed_issues]) if completed_issues else "        None this session"

    # Format lessons
    lessons_str = "\n".join([f"        <lesson>{l[:200]}</lesson>" for l in lessons_learned[-5:]]) if lessons_learned else "        None recorded"

    # Format open issues
    issue_list = format_issues(open_issues)

    prompt = f"""<task>
    <objective>
      Continue triaging and fixing GitHub issues from the tevm-monorepo, prioritizing low-hanging fruit.
    </objective>

    <previous_session_summary>
      <completed>
        <iteration>{iteration}</iteration>
        <issues_fixed>
{completed_str}
        </issues_fixed>
        <git_status>Clean, on {git_status.get('branch', 'main')} branch</git_status>
      </completed>

      <lessons_learned>
{lessons_str}
      </lessons_learned>

      <environment_notes>
        <note>Some tests fail due to missing `forge` command (Foundry not installed) - expected</note>
        <note>Some tests fail due to missing RPC env vars (TEVM_RPC_URLS_MAINNET, TEVM_RPC_URLS_OPTIMISM) - expected</note>
        <note>If nx is slow, run `pnpm nx reset` to fix</note>
      </environment_notes>
    </previous_session_summary>

    <open_issues>
{issue_list}
    </open_issues>

    <key_code_locations>
      <location path="packages/actions/src/createHandlers.js" purpose="RPC handler mapping"/>
      <location path="packages/actions/src/eth/" purpose="eth_* procedure implementations"/>
      <location path="packages/actions/src/anvil/" purpose="anvil_* procedure implementations"/>
      <location path="packages/node/src/createTevmNode.js" purpose="TevmNode creation"/>
      <location path="packages/node/src/TevmNode.ts" purpose="TevmNode type definitions"/>
      <location path="packages/memory-client/src/test/viem/" purpose="Integration tests"/>
    </key_code_locations>

    <commands>
      <command name="build" cmd="pnpm nx run-many --targets=build:dist,build:types"/>
      <command name="test_single" cmd="pnpm vitest run path/to/file.spec.ts"/>
      <command name="fetch_issue" cmd="gh issue view NUMBER"/>
    </commands>

    <workflow>
      <phase name="select">Fetch and analyze most tractable open issue</phase>
      <phase name="investigate">Search codebase, check for existing tests</phase>
      <phase name="implement">Make changes, build, test</phase>
      <phase name="resolve">Commit with "Fixes #N", push, comment on issue</phase>
      <phase name="continue">Select next issue or prepare handoff</phase>
    </workflow>

    <constraints>
      <constraint>Never push broken code</constraint>
      <constraint>Use emoji conventional commits</constraint>
      <constraint>Include "Fixes #NUMBER" to auto-close</constraint>
      <constraint>Add Co-Authored-By: Claude Opus 4.5</constraint>
    </constraints>

    <git_status>
      <branch>{git_status.get('branch', 'unknown')}</branch>
      <recent_commits>
{git_status.get('recent_commits', 'N/A')}
      </recent_commits>
    </git_status>
  </task>
"""
    return prompt


def format_issues(issues: List[Dict]) -> str:
    """Format issues list for prompt."""
    if not issues:
        return "      No open issues found."

    formatted = []
    for issue in issues[:15]:  # Limit to 15 issues
        num = issue.get('number', '?')
        title = issue.get('title', 'Untitled')
        created = issue.get('createdAt', '')[:10]  # Just date
        labels = ', '.join([l.get('name', '') for l in issue.get('labels', [])]) or 'none'
        body_preview = (issue.get('body', '') or '')[:200].replace('\n', ' ')

        formatted.append(f"""      <issue number="{num}" title="{title}" created="{created}" labels="{labels}">
        <preview>{body_preview}...</preview>
      </issue>""")

    return "\n".join(formatted)

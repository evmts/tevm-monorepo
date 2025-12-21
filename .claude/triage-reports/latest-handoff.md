<task>
    <objective>
      Continue triaging and fixing GitHub issues from the tevm-monorepo, prioritizing low-hanging fruit.
    </objective>

    <previous_session_summary>
      <completed>
        <iteration>17</iteration>
        <issues_fixed>
          <issue number="2038">Fix TypeScript error in TevmJsonRpcRequestHandler.ts - Added missing anvil_enableTraces and anvil_mineDetailed to AnvilReturnType</issue>
        </issues_fixed>
        <git_status>Clean, on main branch</git_status>
      </completed>

      <lessons_learned>
        <lesson>When new JSON-RPC methods are added to request types (e.g., AnvilJsonRpcRequest), the corresponding return type mapping (e.g., AnvilReturnType) must also be updated to maintain type consistency</lesson>
        <lesson>The TevmJsonRpcRequestHandler uses a generic constraint that requires all method names in request unions to have corresponding entries in return type mappings</lesson>
      </lessons_learned>

      <environment_notes>
        <note>Some tests fail due to missing `forge` command (Foundry not installed) - expected</note>
        <note>Some tests fail due to missing RPC env vars (TEVM_RPC_URLS_MAINNET, TEVM_RPC_URLS_OPTIMISM) - expected</note>
        <note>If nx is slow, run `pnpm nx reset` to fix</note>
        <note>Pre-existing TypeScript errors exist in ethGetBlockReceiptsHandler.js, ethNewFilterHandler.js related to exactOptionalPropertyTypes</note>
      </environment_notes>
    </previous_session_summary>

    <open_issues>
      <issue number="2036" title="JSON-RPC Feature Parity: Anvil & Ethereum Compatibility Tracking" created="2025-12-21" labels="none">
        <preview>Tracking issue for achieving full JSON-RPC feature parity with Anvil and standard Ethereum clients.</preview>
      </issue>
      <issue number="2024" title="Implement `anvil_reorg` method for chain reorganization simulation" created="2025-12-21" labels="none">
        <preview>Implement method to simulate blockchain reorganizations.</preview>
      </issue>
      <issue number="2023" title="Implement blob-related methods (`anvil_getBlobByHash`, etc.)" created="2025-12-21" labels="none">
        <preview>Implement EIP-4844 blob data retrieval methods.</preview>
      </issue>
      <issue number="1966" title="Missing support for EIP-7702" created="2025-09-12" labels="none">
        <preview>TEVM does not currently support EIP-7702 transactions.</preview>
      </issue>
      <issue number="1946" title="Implement `eth_simulateV2`" created="2025-07-05" labels="none">
        <preview>Implement the eth_simulateV1 JSON-RPC method for transaction simulation with state overrides.</preview>
      </issue>
      <issue number="1941" title="extensions/test-node - custom passthrough" created="2025-07-05" labels="none">
        <preview>Add optional option to test snapshot clients for custom passthrough URLs.</preview>
      </issue>
      <issue number="1931" title="Implement erc7562Tracer tracer" created="2025-07-02" labels="enhancement">
        <preview>Implement erc7562Tracer tracer for debug_trace methods.</preview>
      </issue>
      <issue number="1747" title="Feature: @tevm/test-matchers" created="2025-05-29" labels="enhancement">
        <preview>Tracking issue for @tevm/test-matchers package implementation.</preview>
      </issue>
      <issue number="1591" title="Deno install hang" created="2025-03-26" labels="none">
        <preview>Deno 2 cannot install tevm - hangs during installation.</preview>
      </issue>
      <issue number="1385" title="Inline sol" created="2024-08-18" labels="none">
        <preview>Inline solidity support for ergonomic deployless calls.</preview>
      </issue>
      <issue number="1350" title="Add network import support" created="2024-07-30" labels="enhancement, bundler">
        <preview>Import contracts from network via eth:// protocol.</preview>
      </issue>
    </open_issues>

    <key_code_locations>
      <location path="packages/actions/src/createHandlers.js" purpose="RPC handler mapping"/>
      <location path="packages/actions/src/eth/" purpose="eth_* procedure implementations"/>
      <location path="packages/actions/src/anvil/" purpose="anvil_* procedure implementations"/>
      <location path="packages/actions/src/tevm-request-handler/" purpose="Type definitions for JSON-RPC handler"/>
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
      <branch>main</branch>
      <recent_commits>
dde10859e 🐛 fix(actions): add missing anvil methods to AnvilReturnType
de6730066 📝 docs: Triage iteration 16 report
220a3be42 📝 docs: Triage iteration 16 report
2a1757443 🐛 fix(actions): fix raw log format handling in filter handlers
9b310bfd3 📝 docs: Triage iteration 15 report
      </recent_commits>
    </git_status>
  </task>

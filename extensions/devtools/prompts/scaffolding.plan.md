<devtoolsScaffoldingPlan>
  <intro>The following is a step-by-step plan for scaffolding the devtools extension, organized into actionable and incremental self-contained PRs.</intro>
  <pr number="1">
    <title>PR 1 — Devtools package skeleton and build config</title>
    <scope>
      <item>Ensure `extensions/devtools` has minimal build, lint, and publish settings ready.</item>
      <item>Do not add instrumentation yet.</item>
    </scope>
    <files>
      <file>`extensions/devtools/package.json` (exports, types, sideEffects: false, build scripts)</file>
      <file>`extensions/devtools/tsup.config.ts`</file>
      <file>`extensions/devtools/tsconfig.json`</file>
      <file>`extensions/devtools/biome.json`</file>
      <file>`extensions/devtools/typedoc.json` (stub)</file>
      <file>`extensions/devtools/src/index.ts` (export stubs for upcoming APIs)</file>
    </files>
    <acceptance>
      <item>Build succeeds, produces ESM and CJS (if needed by repo conventions).</item>
      <item>No runtime code changes yet.</item>
    </acceptance>
    <qa>
      <item>Run build locally, ensure artifacts exist and are importable from a test script.</item>
    </qa>
  </pr>

  <pr number="2">
    <title>PR 2 — Core common layer: types, constants, ids, event bus</title>
    <scope>
      <item>Add shared types, IDs, constants, and global bus; no wrapping yet.</item>
    </scope>
    <files>
      <file>`extensions/devtools/src/internal/common/types.ts`</file>
      <file>`extensions/devtools/src/internal/common/constants.ts`</file>
      <file>`extensions/devtools/src/internal/common/ids.ts`</file>
      <file>`extensions/devtools/src/internal/common/eventBus.ts`</file>
      <file>`extensions/devtools/src/internal/common/guards.ts` (basic guards)</file>
      <file>Update `extensions/devtools/src/index.ts` to export `devtoolsBus`, types.</file>
    </files>
    <acceptance>
      <item>`devtoolsBus()` is globally available and deduped.</item>
      <item>Emits and stores a bounded history per `MAX_BUFFER`.</item>
    </acceptance>
    <qa>
      <item>Small unit tests for bus publish/subscribe/history/clear (jsdom).</item>
      <item>Manual node script subscribing to bus and asserting events flow.</item>
    </qa>
  </pr>

  <pr number="3">
    <title>PR 3 — Common EIP‑1193 wrapper helper and base EIP‑1193 decorator</title>
    <scope>
      <item>Introduce `decorateRequestEip1193` using Proxy/Reflect.</item>
      <item>Add `decorateEip1193` thin delegator.</item>
      <item>Tag idempotency with `WRAP_TAG`.</item>
    </scope>
    <files>
      <file>`extensions/devtools/src/internal/common/decorateRequestEip1193.ts`</file>
      <file>`extensions/devtools/src/internal/eip1193/decorateEip1193.ts`</file>
      <file>Optional stub: `extensions/devtools/src/internal/common/redaction.ts` (no-op for now)</file>
      <file>Export from `extensions/devtools/src/index.ts`</file>
    </files>
    <acceptance>
      <item>Any `{ request({ method, params }) }` is wrapped and events are published for result/error with timings.</item>
      <item>Wrapping twice returns the already-wrapped behavior (idempotent).</item>
    </acceptance>
    <qa>
      <item>Unit test with a fake provider that resolves/rejects.</item>
      <item>Verify idempotency via `Symbol.for('tevm.devtools.wrap')`.</item>
    </qa>
  </pr>

  <pr number="4">
    <title>PR 4 — React UI inside package: DevtoolsWidget</title>
    <scope>
      <item>Ship a first‑party React UI under `src/react` that subscribes to `devtoolsBus()` and renders a floating toggle that expands a dock/panel (can be iframe or portal).</item>
      <item>Expose as a subpath export to avoid forcing React on non-React consumers.</item>
    </scope>
    <files>
      <file>`extensions/devtools/src/react/DevtoolsWidget.tsx` (core component)</file>
      <file>`extensions/devtools/src/react/index.ts` (re-exports)</file>
      <file>Optional `extensions/devtools/src/react/styles.css`</file>
      <file>Update `extensions/devtools/package.json`:</file>
      <fileDetail>
        <item>`peerDependencies`: `react`, `react-dom`</item>
        <item>`exports`: add `./react` entry for ESM/CJS/types</item>
        <item>`sideEffects`: include CSS path if present</item>
      </fileDetail>
      <file>Update `extensions/devtools/tsup.config.ts` to build React entry (preserve JSX/runtime per repo standard)</file>
    </files>
    <acceptance>
      <item>Consumers can `import { DevtoolsWidget } from '@tevm/devtools/react'` and render it.</item>
      <item>Widget renders a small button; clicking opens a panel with live records.</item>
    </acceptance>
    <qa>
      <item>Local story/demo page rendering the widget; verify records appear when bus publishes.</item>
    </qa>
  </pr>

  <pr number="5">
    <title>PR 5 — Window.ethereum installer (optional early override)</title>
    <scope>
      <item>Add `installWindowEthereumDevtools(opts?)` that wraps `window.ethereum.request` and optionally `window.ethereum.providers[]`.</item>
    </scope>
    <files>
      <file>`extensions/devtools/src/installWindowEthereumDevtools.ts`</file>
      <file>Export in `extensions/devtools/src/index.ts`</file>
    </files>
    <acceptance>
      <item>When called in browser, `window.ethereum` is replaced with wrapped version once and marks `__tevmWrapped` to prevent duplicates.</item>
      <item>Optional `includeMultiInjected` wraps known multi-provider arrays safely.</item>
    </acceptance>
    <qa>
      <item>jsdom test for idempotent override.</item>
      <item>Manual: open a dapp with MetaMask, call install, observe events.</item>
    </qa>
  </pr>

  <pr number="6">
    <title>PR 6 — Orchestrator: `withTevmDevtools` v1 (EIP‑1193 only)</title>
    <scope>
      <item>Introduce `withTevmDevtools(input, opts?)` that detects EIP‑1193 and returns the wrapped provider.</item>
    </scope>
    <files>
      <file>`extensions/devtools/src/withTevmDevtools.ts` (initial version with only EIP‑1193 path)</file>
    </files>
    <acceptance>
      <item>Passing a provider or raw injected object returns a working wrapped equivalent.</item>
    </acceptance>
    <qa>
      <item>Unit tests for detection and pass-through when disabled.</item>
    </qa>
  </pr>

  <pr number="7">
    <title>PR 7 — Examples: React scaffold using in‑package DevtoolsWidget + injected demo</title>
    <scope>
      <item>Add plain React example source under `extensions/devtools/examples/react`.</item>
      <item>Examples import and render `DevtoolsWidget` from `@tevm/devtools/react`.</item>
      <item>Example page to exercise raw injected EIP‑1193 (MetaMask); examples focus on wrapping, not UI.</item>
    </scope>
    <files>
      <file>`extensions/devtools/examples/react/README.md`</file>
      <file>`extensions/devtools/examples/react/src/AppInjected.tsx` (raw EIP‑1193 sample)</file>
      <file>Example app entry (Vite or minimal build) wired to render `<DevtoolsWidget />`</file>
    </files>
    <acceptance>
      <item>Running the example shows live records in the in‑package widget when calling `provider.request`.</item>
    </acceptance>
    <qa>
      <item>Manual: click “eth_chainId” / “eth_requestAccounts” buttons and see events in widget.</item>
    </qa>
  </pr>

  <pr number="8">
    <title>PR 8 — viem transport + client decoration (Proxy/Reflect; reuse common)</title>
    <scope>
      <item>Add `decorateViemTransport` (factory wrapper reusing `decorateRequestEip1193`).</item>
      <item>Add `decorateViemClient` replacing `transport` with decorated version.</item>
      <item>Extend `withTevmDevtools` to detect viem transport and client.</item>
      <item>Example page for viem `http()` + `createPublicClient`, still rendering the in‑package widget.</item>
    </scope>
    <files>
      <file>`extensions/devtools/src/internal/viem/decorateViemTransport.ts`</file>
      <file>`extensions/devtools/src/internal/viem/decorateViemClient.ts`</file>
      <file>Update `extensions/devtools/src/withTevmDevtools.ts`</file>
      <file>`extensions/devtools/examples/react/src/AppViem.tsx`</file>
    </files>
    <acceptance>
      <item>viem transport requests publish events; client flow works unchanged.</item>
    </acceptance>
    <qa>
      <item>Unit: wrap a mock transport factory; assert events.</item>
      <item>Manual: run example, call `getBlockNumber`, observe events in widget.</item>
    </qa>
  </pr>

  <pr number="9">
    <title>PR 9 — wagmi config decoration</title>
    <scope>
      <item>Add `decorateWagmiConfig` that decorates all `transports` and wraps connector `getProvider()` with EIP‑1193 decorator.</item>
      <item>Extend `withTevmDevtools` to detect wagmi config.</item>
      <item>Example page rendering `WagmiConfig` with decorated config; continue to render in‑package widget.</item>
    </scope>
    <files>
      <file>`extensions/devtools/src/internal/wagmi/decorateWagmiConfig.ts`</file>
      <file>Update `extensions/devtools/src/withTevmDevtools.ts`</file>
      <file>`extensions/devtools/examples/react/src/AppWagmi.tsx`</file>
    </files>
    <acceptance>
      <item>wagmi calls via both transport and injected connector publish single, deduped records.</item>
    </acceptance>
    <qa>
      <item>Manual: connect wallet via connector, run a read action, see single event per call in widget.</item>
    </qa>
  </pr>

  <pr number="10">
    <title>PR 10 — ethers support: injected and JsonRpcProvider</title>
    <scope>
      <item>Add `decorateEthersInjected` delegating to EIP‑1193 decorator.</item>
      <item>Add `decorateJsonRpcProvider` intercepting `.send(method, params)`.</item>
      <item>Extend `withTevmDevtools` to detect ethers provider(s).</item>
      <item>Examples for both injected `BrowserProvider(window.ethereum)` and `JsonRpcProvider`, using the in‑package widget.</item>
    </scope>
    <files>
      <file>`extensions/devtools/src/internal/ethers/decorateEthersInjected.ts`</file>
      <file>`extensions/devtools/src/internal/ethers/decorateJsonRpcProvider.ts`</file>
      <file>Update `extensions/devtools/src/withTevmDevtools.ts`</file>
      <file>`extensions/devtools/examples/react/src/AppEthersInjected.tsx`</file>
      <file>`extensions/devtools/examples/react/src/AppEthersJsonRpc.tsx`</file>
    </files>
    <acceptance>
      <item>Both injected and JSON-RPC calls publish events with timing.</item>
    </acceptance>
    <qa>
      <item>Manual: run both examples and observe events in widget.</item>
    </qa>
  </pr>

  <pr number="11">
    <title>PR 11 — Idempotency and dedupe hardening across overlaps</title>
    <scope>
      <item>Ensure every decorator tags output with `WRAP_TAG` and checks before rewrapping.</item>
      <item>Guard `installWindowEthereumDevtools` against wrapping already-decorated providers and `providers[]`.</item>
      <item>Add tests demonstrating wagmi + injected + early install produce no duplicates.</item>
    </scope>
    <files>
      <file>Small edits in decorators to ensure tag propagation.</file>
      <file>Tests under `extensions/devtools/src/__tests__/…`</file>
    </files>
    <acceptance>
      <item>No duplicate events when combining early injected override with wagmi config, viem client, etc.</item>
    </acceptance>
    <qa>
      <item>Automated tests simulate multiple wrap paths; assert exactly one bus event per call.</item>
    </qa>
  </pr>

  <pr number="12">
    <title>PR 12 — Docs/tests and repo integration</title>
    <scope>
      <item>Fill `extensions/devtools/README.md` with quick start, API reference, React widget usage, and examples links.</item>
      <item>Update examples README with usage matrix and dedupe notes.</item>
      <item>Add test runner config (vitest/jest per repo standard) and wire into CI if applicable.</item>
    </scope>
    <files>
      <file>`extensions/devtools/README.md`</file>
      <file>`extensions/devtools/examples/react/README.md`</file>
      <file>`extensions/devtools/vitest.config.ts` (or jest)</file>
      <file>A few focused tests for bus, wrappers, and the widget rendering basic flow.</file>
    </files>
    <acceptance>
      <item>CI runs tests and build for the package.</item>
    </acceptance>
    <notes>
      <item>Keep each PR minimal, buildable, and demonstrably useful on its own.</item>
      <item>Extend `withTevmDevtools` incrementally in PRs 6, 8, 9, 10 to limit surface of change.</item>
    </notes>
  </pr>
</devtoolsScaffoldingPlan>
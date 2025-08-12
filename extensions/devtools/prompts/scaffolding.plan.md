### PR 1 — Devtools package skeleton and build config
- Scope:
  - Ensure `extensions/devtools` has minimal build, lint, and publish settings ready.
  - Do not add instrumentation yet.
- Files:
  - `extensions/devtools/package.json` (exports, types, sideEffects: false, build scripts)
  - `extensions/devtools/tsup.config.ts`
  - `extensions/devtools/tsconfig.json`
  - `extensions/devtools/biome.json`
  - `extensions/devtools/typedoc.json` (stub)
  - `extensions/devtools/src/index.ts` (export stubs for upcoming APIs)
- Acceptance:
  - Build succeeds, produces ESM and CJS (if needed by repo conventions).
  - No runtime code changes yet.
- QA:
  - Run build locally, ensure artifacts exist and are importable from a test script.

### PR 2 — Core common layer: types, constants, ids, event bus
- Scope:
  - Add shared types, IDs, constants, and global bus; no wrapping yet.
- Files:
  - `extensions/devtools/src/internal/common/types.ts`
  - `extensions/devtools/src/internal/common/constants.ts`
  - `extensions/devtools/src/internal/common/ids.ts`
  - `extensions/devtools/src/internal/common/eventBus.ts`
  - `extensions/devtools/src/internal/common/guards.ts` (basic guards)
  - Update `extensions/devtools/src/index.ts` to export `devtoolsBus`, types.
- Acceptance:
  - `devtoolsBus()` is globally available and deduped.
  - Emits and stores a bounded history per `MAX_BUFFER`.
- QA:
  - Small unit tests for bus publish/subscribe/history/clear (jsdom).
  - Manual node script subscribing to bus and asserting events flow.

### PR 3 — Common EIP‑1193 wrapper helper and base EIP‑1193 decorator
- Scope:
  - Introduce `decorateRequestEip1193` using Proxy/Reflect.
  - Add `decorateEip1193` thin delegator.
  - Tag idempotency with `WRAP_TAG`.
- Files:
  - `extensions/devtools/src/internal/common/decorateRequestEip1193.ts`
  - `extensions/devtools/src/internal/eip1193/decorateEip1193.ts`
  - Optional stub: `extensions/devtools/src/internal/common/redaction.ts` (no-op for now)
  - Export from `extensions/devtools/src/index.ts`
- Acceptance:
  - Any `{ request({ method, params }) }` is wrapped and events are published for result/error with timings.
  - Wrapping twice returns the already-wrapped behavior (idempotent).
- QA:
  - Unit test with a fake provider that resolves/rejects.
  - Verify idempotency via `Symbol.for('tevm.devtools.wrap')`.

### PR 4 — React UI inside package: DevtoolsWidget
- Scope:
  - Ship a first‑party React UI under `src/react` that subscribes to `devtoolsBus()` and renders a floating toggle that expands a dock/panel (can be iframe or portal).
  - Expose as a subpath export to avoid forcing React on non-React consumers.
- Files:
  - `extensions/devtools/src/react/DevtoolsWidget.tsx` (core component)
  - `extensions/devtools/src/react/index.ts` (re-exports)
  - Optional `extensions/devtools/src/react/styles.css`
  - Update `extensions/devtools/package.json`:
    - `peerDependencies`: `react`, `react-dom`
    - `exports`: add `./react` entry for ESM/CJS/types
    - `sideEffects`: include CSS path if present
  - Update `extensions/devtools/tsup.config.ts` to build React entry (preserve JSX/runtime per repo standard)
- Acceptance:
  - Consumers can `import { DevtoolsWidget } from '@tevm/devtools/react'` and render it.
  - Widget renders a small button; clicking opens a panel with live records.
- QA:
  - Local story/demo page rendering the widget; verify records appear when bus publishes.

### PR 5 — Window.ethereum installer (optional early override)
- Scope:
  - Add `installWindowEthereumDevtools(opts?)` that wraps `window.ethereum.request` and optionally `window.ethereum.providers[]`.
- Files:
  - `extensions/devtools/src/installWindowEthereumDevtools.ts`
  - Export in `extensions/devtools/src/index.ts`
- Acceptance:
  - When called in browser, `window.ethereum` is replaced with wrapped version once and marks `__tevmWrapped` to prevent duplicates.
  - Optional `includeMultiInjected` wraps known multi-provider arrays safely.
- QA:
  - jsdom test for idempotent override.
  - Manual: open a dapp with MetaMask, call install, observe events.

### PR 6 — Orchestrator: `withTevmDevtools` v1 (EIP‑1193 only)
- Scope:
  - Introduce `withTevmDevtools(input, opts?)` that detects EIP‑1193 and returns the wrapped provider.
- Files:
  - `extensions/devtools/src/withTevmDevtools.ts` (initial version with only EIP‑1193 path)
- Acceptance:
  - Passing a provider or raw injected object returns a working wrapped equivalent.
- QA:
  - Unit tests for detection and pass-through when disabled.

### PR 7 — Examples: React scaffold using in‑package DevtoolsWidget + injected demo
- Scope:
  - Add plain React example source under `extensions/devtools/examples/react`.
  - Examples import and render `DevtoolsWidget` from `@tevm/devtools/react`.
  - Example page to exercise raw injected EIP‑1193 (MetaMask); examples focus on wrapping, not UI.
- Files:
  - `extensions/devtools/examples/react/README.md`
  - `extensions/devtools/examples/react/src/AppInjected.tsx` (raw EIP‑1193 sample)
  - Example app entry (Vite or minimal build) wired to render `<DevtoolsWidget />`
- Acceptance:
  - Running the example shows live records in the in‑package widget when calling `provider.request`.
- QA:
  - Manual: click “eth_chainId” / “eth_requestAccounts” buttons and see events in widget.

### PR 8 — viem transport + client decoration (Proxy/Reflect; reuse common)
- Scope:
  - Add `decorateViemTransport` (factory wrapper reusing `decorateRequestEip1193`).
  - Add `decorateViemClient` replacing `transport` with decorated version.
  - Extend `withTevmDevtools` to detect viem transport and client.
  - Example page for viem `http()` + `createPublicClient`, still rendering the in‑package widget.
- Files:
  - `extensions/devtools/src/internal/viem/decorateViemTransport.ts`
  - `extensions/devtools/src/internal/viem/decorateViemClient.ts`
  - Update `extensions/devtools/src/withTevmDevtools.ts`
  - `extensions/devtools/examples/react/src/AppViem.tsx`
- Acceptance:
  - viem transport requests publish events; client flow works unchanged.
- QA:
  - Unit: wrap a mock transport factory; assert events.
  - Manual: run example, call `getBlockNumber`, observe events in widget.

### PR 9 — wagmi config decoration
- Scope:
  - Add `decorateWagmiConfig` that decorates all `transports` and wraps connector `getProvider()` with EIP‑1193 decorator.
  - Extend `withTevmDevtools` to detect wagmi config.
  - Example page rendering `WagmiConfig` with decorated config; continue to render in‑package widget.
- Files:
  - `extensions/devtools/src/internal/wagmi/decorateWagmiConfig.ts`
  - Update `extensions/devtools/src/withTevmDevtools.ts`
  - `extensions/devtools/examples/react/src/AppWagmi.tsx`
- Acceptance:
  - wagmi calls via both transport and injected connector publish single, deduped records.
- QA:
  - Manual: connect wallet via connector, run a read action, see single event per call in widget.

### PR 10 — ethers support: injected and JsonRpcProvider
- Scope:
  - Add `decorateEthersInjected` delegating to EIP‑1193 decorator.
  - Add `decorateJsonRpcProvider` intercepting `.send(method, params)`.
  - Extend `withTevmDevtools` to detect ethers provider(s).
  - Examples for both injected `BrowserProvider(window.ethereum)` and `JsonRpcProvider`, using the in‑package widget.
- Files:
  - `extensions/devtools/src/internal/ethers/decorateEthersInjected.ts`
  - `extensions/devtools/src/internal/ethers/decorateJsonRpcProvider.ts`
  - Update `extensions/devtools/src/withTevmDevtools.ts`
  - `extensions/devtools/examples/react/src/AppEthersInjected.tsx`
  - `extensions/devtools/examples/react/src/AppEthersJsonRpc.tsx`
- Acceptance:
  - Both injected and JSON-RPC calls publish events with timing.
- QA:
  - Manual: run both examples and observe events in widget.

### PR 11 — Idempotency and dedupe hardening across overlaps
- Scope:
  - Ensure every decorator tags output with `WRAP_TAG` and checks before rewrapping.
  - Guard `installWindowEthereumDevtools` against wrapping already-decorated providers and `providers[]`.
  - Add tests demonstrating wagmi + injected + early install produce no duplicates.
- Files:
  - Small edits in decorators to ensure tag propagation.
  - Tests under `extensions/devtools/src/__tests__/…`
- Acceptance:
  - No duplicate events when combining early injected override with wagmi config, viem client, etc.
- QA:
  - Automated tests simulate multiple wrap paths; assert exactly one bus event per call.

### PR 12 — Docs/tests and repo integration
- Scope:
  - Fill `extensions/devtools/README.md` with quick start, API reference, React widget usage, and examples links.
  - Update examples README with usage matrix and dedupe notes.
  - Add test runner config (vitest/jest per repo standard) and wire into CI if applicable.
- Files:
  - `extensions/devtools/README.md`
  - `extensions/devtools/examples/react/README.md`
  - `extensions/devtools/vitest.config.ts` (or jest)
  - A few focused tests for bus, wrappers, and the widget rendering basic flow.
- Acceptance:
  - CI runs tests and build for the package.
- Notes
  - Keep each PR minimal, buildable, and demonstrably useful on its own.
  - Extend `withTevmDevtools` incrementally in PRs 6, 8, 9, 10 to limit surface of change.
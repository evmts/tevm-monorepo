<devtoolsScaffoldingProgress>
  <title>Tevm Devtools – Integration Progress</title>
  <intro>The following is a high-level checklist to track integration progress across the planned PRs.</intro>
  <tasks>
    <task index="1" done="false">1. Package skeleton (build/lint/exports) in `extensions/devtools`</task>
    <task index="2" done="false">2. Common layer: `types`, `constants`, `ids`, `eventBus`, `guards`</task>
    <task index="3" done="false">3. Common `decorateRequestEip1193` helper (Proxy/Reflect) and base `decorateEip1193` delegator</task>
    <task index="4" done="false">4. React UI inside package: `@tevm/devtools/react` → `DevtoolsWidget`</task>
    <task index="5" done="false">5. `installWindowEthereumDevtools` (optional injected override)</task>
    <task index="6" done="false">6. Orchestrator `withTevmDevtools` v1 (EIP‑1193 only)</task>
    <task index="7" done="false">7. React examples scaffold: import and render `DevtoolsWidget` + injected demo</task>
    <task index="8" done="false">8. viem: transport + client decoration + example (uses in‑package widget)</task>
    <task index="9" done="false">9. wagmi: config decoration (transports/connectors) + example (uses widget)</task>
    <task index="10" done="false">10. ethers: injected + JsonRpcProvider decoration + examples (use widget)</task>
    <task index="11" done="false">11. Idempotency/dedupe hardening + overlap tests</task>
    <task index="12" done="false">12. Docs/tests, and repo integration</task>
  </tasks>
</devtoolsScaffoldingProgress>
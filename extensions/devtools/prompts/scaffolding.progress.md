## Tevm Devtools – Integration Progress

- [ ] 1. Package skeleton (build/lint/exports) in `extensions/devtools`
- [ ] 2. Common layer: `types`, `constants`, `ids`, `eventBus`, `guards`
- [ ] 3. Common `decorateRequestEip1193` helper (Proxy/Reflect) and base `decorateEip1193` delegator
- [ ] 4. React UI inside package: `@tevm/devtools/react` → `DevtoolsWidget`
- [ ] 5. `installWindowEthereumDevtools` (optional injected override)
- [ ] 6. Orchestrator `withTevmDevtools` v1 (EIP‑1193 only)
- [ ] 7. React examples scaffold: import and render `DevtoolsWidget` + injected demo
- [ ] 8. viem: transport + client decoration + example (uses in‑package widget)
- [ ] 9. wagmi: config decoration (transports/connectors) + example (uses widget)
- [ ] 10. ethers: injected + JsonRpcProvider decoration + examples (use widget)
- [ ] 11. Idempotency/dedupe hardening + overlap tests
- [ ] 12. Docs/tests, and repo integration
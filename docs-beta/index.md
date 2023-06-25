---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EVMts Imports Beta"
  text: "Solidity+TypeScript"
  tagline: TypeScript language tooling for contracts
  actions:
    - theme: brand
      text: Quick start
      link: /getting-started/quick-start.md
    - theme: alt
      text: Introduction
      link: /getting-started/introduction.md
    - theme: alt
      text: Tutorial
      link: /tutorial/overview.md
    - theme: alt
      text: Reference
      link: /reference/overview.md
    - theme: alt
      text: Try live demo
      link: https://github.com/evmts/evmts-monorepo/issues/10

features:
  # Basically saying we support wagmi
  # later say something like `modular design` because it supports all tooling
  - title: First-class Wagmi support
    details: Built with Wagmi support in mind. Integrates tightly with useContractRead, useContractWrite, and useContractEvent
  # Basically saying we support bundling .sol
  - title: .sol imports
    details: No more juggling ABIs and addresses. Import solidity files directly into TS. Supports autoimports!
  # Basically saying we support TypeScript Language Server Protocol
  - title: TypeScript language suppport
    details: Instantly jump directly from your TypeScript code to the contract implementation.
---


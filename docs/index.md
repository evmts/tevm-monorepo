---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Evmts Alpha"
  text: "Solidity+TypeScript"
  tagline: No more juggling abis and contract addresses
  actions:
    - theme: alt
      text: Why Evmts
      link: /getting-started/why.md
    - theme: alt
      text: Introduction
      link: /getting-started/introduction.md
    - theme: brand
      text: Quick start
      link: /getting-started/quick-start.md
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
  # Basically saying we support bundling .sol
  - title: .sol imports
    details: No more juggling ABIs and addresses. Evmts bundler takes care of figuring out the ABIs and addresses for your contracts
  # Basically saying we support TypeScript Language Server Protocol
  - title: First class editor support
    details: Autoimport, autocomplete, go-to-definition, and links to etherscan, and are now only a hover away in most popular editors including VSCode!
  # Basically saying we support wagmi
  # later say something like `modular design` because it supports all tooling
  - title: First-class Wagmi support
    details: Built with Wagmi support in mind. Integrates tightly with useContractRead, useContractWrite, and useContractEvent
---


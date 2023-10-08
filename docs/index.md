---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EVMts (beta)"
  text: The next generation Ethereum library
  tagline: Build apps with the full power of the EVM in your TypeScript
  actions:
    - theme: alt
      text: Getting started
      link: /gettingstarted/introduction.md
    - theme: brand
      text: Quick start
      link: /guides/quickstart.md
    - theme: alt
      text: Reference
      link: /reference/overview.md
    - theme: alt
      text: Try live demo
      link: https://github.com/evmts/evmts-monorepo#:~:text=online%20frontend%20example%20on%20stackblitz

features:
  - title: Use the EVM in your TypeScript
    details: Full access to the EVM in your TypeScript code including local execution, forge-style scripting, and contract tracing powered by REVM
  - title: Lightweight, peformant, and code splittable client API
    details: Powered by viem EVMts client API is extremely lightweight typesafe and performant
  - title: Superpowered developer experience for ethereum contracts
    details: Import and debug contracts directly into your TypeScript code
  - title: Custom LSP built for Ethereum developers
    details: Natspec comments on hover, go-to-solidity-definition, and other superpowers built into your Editor
---


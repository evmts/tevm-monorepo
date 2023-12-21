<p align="center">
  <a href="https://tevm.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Execute solidity scripts in browser
<p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/e2e.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/e2e.yml)
[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/unit.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/unit.yml)
<a href="https://www.npmjs.com/package/@tevm/viem-extension" target="\_parent">
<img alt="" src="https://img.shields.io/npm/dm/@tevm/viem-extension.svg" />
</a>
<a href="https://bundlephobia.com/package/@tevm/viem-extension@latest" target="\_parent">
<img alt="" src="https://badgen.net/bundlephobia/minzip/@tevm/viem-extension" />
</a>

# tevm-monorepo

A [viem extension](https://viem.sh/docs/clients/custom.html#extending-with-actions-or-configuration) for interacting with a Tevm VM over json-rpc.

```ts
import {tevmViemExtension} from '@tevm/viem-extension'
import {viemClient} from './viemClient.js'

const wrappedClient = viemClient.extend(tevmViemExtension())

import {MyScript} from '../MyScript.s.sol'
wrappedClient.runScript(
  MyScript.read.run({...})
).then(console.log)
```

## Visit [Docs](https://tevm.dev/) for docs, guides, API and more!

## See [Tevm Beta project board](https://github.com/orgs/tevm/projects/1) for progress on the upcoming beta release

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>

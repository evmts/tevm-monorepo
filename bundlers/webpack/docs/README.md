@evmts/webpack-plugin / [Exports](modules.md)

# @evmts/plugin

A webpack plugin for importing solidity files.

## Installation

```bash
pnpm i @evmts/webpack-plugin
```

## Usage

Install webpack plugin

```bash
npm i @evmts/webpack-plugin
```

Add to your webpack config

```typescript
import {ForgePlugin} from '@evmts/webpack-plugin'

export default {
  // ... other configuration settings
  plugins: [
    // ... other plugins
    new ForgePlugin({
      project: './contracts'
    }),
  ],
};
```

## ConfigOptions

## Usage in @evmts/core

## Usage in other libraries

## Autocompletion and Typesafety

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>

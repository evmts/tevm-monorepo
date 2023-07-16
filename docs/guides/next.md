# NEXT.js configuration

🏗️🚧 note: Early development and testing of Evmts is mostly done via vite. Next/webpack should work though as they still share an implemenation but be aware there could be hiccups until it reaches beta.

NEXT.js configuration can be done by adding the webpack plugin to `next.config.js`

::: info You will learn
How to configure NEXT.js to bundle solidity files with Evmts
:::

## 1. Install webpack plugin

::: code-group

```bash [npm]
npm install @evmts/webpack --save-dev
```

```bash [pnpm]
pnpm install @evmts/webpack --save-dev
```

```bash [yarn]
yarn add @evmts/webpack -D
```

:::

## 2. Add to next.config.js

Add to next.config.ts.  The webpack plugin config takes no options.  For custom configuration add a [evmts.config.ts](../reference/config.md)

- **Example**

```ts [next.config.js]
const { webpackPluginEvmts } = require('@evmts/webpack-plugin');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    return config
  },
  plugins: [
    webpackPluginEvmts(),
  ],
}
```

## 3. Configure editor support

For editor support use either the [TypeScript plugin](../tutorial/typescript.md) or [vscode extension](../guides/vscode.md)

- **Details**

`pluginWebpackEvmts` allows you to import solidity files directly in your NEXT.js


- **Examples**

TODO link to next example

- **See also:** [typescript docs](../tutorial/typescript.md)

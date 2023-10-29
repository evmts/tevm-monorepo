# Webpack configuration

Webpack configuration can be done by adding the webpack plugin to webpack config

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

## 2. Add to webpack config

The webpack plugin config takes no options.  For custom configuration add a [evmts.config.ts](../reference/config.md)

- **Example**

```ts [example.ts]
import { webpackPluginEvmts } from '@evmts/webpack-plugin'

/** @type {import('next').NextConfig} */
export default {
  ...restOfConfig,
  plugins: [webpackPluginEvmts()]
}
```

## 3. Configure editor support

For editor support use either the [ts-plugin](../tutorial/typescript.md) or [vscode extension](../guides/vscode.md)

- **Details**

`pluginWebpackEvmts` allows you to import solidity files directly in your NEXT.js


- **Examples**

TODO link to next example

- **See also:** [typescript docs](../tutorial/typescript.md)

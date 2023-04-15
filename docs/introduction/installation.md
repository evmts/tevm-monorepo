## Installation

To use EVMts install EVMts and it's plugins

### Install `@evmts/core` and peer dependencies.

Install `@evmts/core` and [viem](https://viem.sh/docs/clients/public.html)

npm
::: code-group

```bash [npm]
npm i @evmts/core viem
```

```bash [pnpm]
pnpm i @evmts/core viem
```

```bash [yarn]
yarn add @evmts/core viem
```

:::

### Install EVMts build plugins

It is highly recomended to use the `@evmts/plugin-rollup` and `@evmts/plugin-ts` with EVMts. EVMts build tools give you a tight typescript integration with your solidity contracts including autocomplete and autoimports of your solidity contracts. You can even use it with other libraries such as [viem](../guide/viem-usage.md) and [ethers.js](../guide/ethers-usage.md)

::: tip
Unable to use a build plugin? See the guide [using EVMts without plugins](../guide/using-evmts-without-plugins.md).
:::

Install `@evmts/plugin-rollup` and `@evmts/plugin-ts`

::: code-group

```bash [npm]
npm i @evmts/plugin-rollup @evmts/plugin-ts
```

```bash [pnpm]
pnpm i @evmts/plugin-rollup @evmts/plugin-ts
```

```bash [yarn]
yarn add @evmts/plugin-rollup @evmts/plugin-ts
```

:::

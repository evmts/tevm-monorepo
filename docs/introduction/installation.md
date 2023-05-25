## Installation

To use EVMts install EVMts and it's dependencies

### Install @evmts/core and it's peer dependencies

::: code-group

```bash [npm]
npm install @evmts/core @evmts/evm viem
```

```bash [pnpm]
pnpm install @evmts/core @evmts/evm viem
```

```bash [yarn]
yarn add @evmts/core @evmts/evm viem
```

:::

### Install Dev dependencies

Install dev dependencies depending on your bundler.   Supported bundlers include [esbuild](https://esbuild.github.io/), [Webpack](https://webpack.js.org/), [rspack](https://www.rspack.dev/guide/introduction.html), [Vite](https://vitejs.dev/), and [Rollup](https://github.com/rollup/rollup).

Most modern setups are supported.   For more specific instructions based on your setup reference the docs for [your specific build setup](../guide/build-guides)

- **Webpack**

::: code-group

```bash [npm]
npm i @evmts/webpack @evmts/ts
```

```bash [pnpm]
pnpm i @evmts/webpack @evmts/ts
```

```bash [yarn]
yarn add @evmts/webpack @evmts/ts
```

:::

- **Vite**

::: code-group

```bash [npm]
npm i @evmts/plugin-vite @evmts/ts-plugin
```

```bash [pnpm]
pnpm i @evmts/vite @evmts/ts-plugin
```

```bash [yarn]
yarn add @evmts/rollup-plugin @evmts/ts-plugin
```

:::

If not using a bundler see [using EVMts without a bundler](../guide/using-evmts-without-plugins.md).


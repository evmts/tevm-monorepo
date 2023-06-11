# Get Started

## Installation

#### Typescript configuration

Install the [typescript plugin](../configuration/typescript.md)

::: code-group

```bash [npm]
npm i @evmts/ts-plugin
```

```bash [pnpm]
pnpm i @evmts/ts-plugin
```

```bash [yarn]
yarn add @evmts/ts-plugin
```
:::

Add TypeScript plugin to [tsconfig](https://www.typescriptlang.org/tsconfig)

```json
{ 
  compilerOptions: {
    plugins: ["@evmts/ts-plugin"]
  }
}
```

#### Bundler integration

EVMts requires a bundler configured to handle `.sol` files

Install your integration of preference.  This hello-world tutorial will use esbuild.

- [esbuild](../guides/esbuild.md)
- [vite](../guides/vite.md)
- [next](../guides/next.md)
- [webpack](../guides/webpack.md)
- [rollup](../guides/rollup.md)


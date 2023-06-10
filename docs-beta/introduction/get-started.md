# Get Started

## Installation

- **Typescript configuration**

EVMts brings tight TypeScript integration for autocompletion and go-to-definition

First install the [typescript plugin](../configuration/typescript.md)

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

Then add the TypeScript plugin to compilerOptions your [tsconfig](https://www.typescriptlang.org/tsconfig)

```json
{ 
  compilerOptions: {
    plugins: ["@evmts/ts-plugin"]
  }
}
```

- **Bundler integration**

EVMts requires that you have set up a bundler and configured it to handle `.sol` files.  This allows you to import solidity directly into your TypeScript files.   

Install your integration of preference.  This hello-world tutorial will use esbuild.

- [esbuild](../guides/esbuild.md)
- [vite](../guides/vite.md)
- [next](../guides/next.md)
- [webpack](../guides/webpack.md)
- [rollup](../guides/rollup.md)


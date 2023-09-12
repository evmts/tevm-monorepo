# Tutorial

To learn all the pieces of Evmts we will configure a new project from scratch.  We only assume basic TypeScript knowledge and knowledge of what a Smart Contract is

::: info You will learn

1. How to install foundry
2. How to set up a bundler to bundle your contract code
3. How to use your contract with [viem](https://viem.sh)

:::

Looking to get started fast? Try forking one of our example projects or using our live example.

## Initial setup and installation

#### Create a new project

1. Install [nodejs](https://nodejs.org/)
2. Create a new project folder

```bash
mkdir evmts-tut && cd evmts-tut && npm init
```

3. Initialize a new npm project.

```bash
npm init --yes
```

The `--yes` flag will skip the prompts.  Omit it if you prefer.

4. Make your project a TypeScript project

```bash
npm install --save-dev typescript && tsc --init
```

This will initialize a basic tsconfig.

At this point your project should look like `[TODO link to github]`

#### Install Foundry

We will use the [Foundry](https://book.getfoundry.sh/getting-started/installation) toolchain to deploy our contracts.  To install use `foundryup`

1. Install foundryup

```bash
curl -L https://foundry.paradigm.xyz | bash
```

2. Source your environment and run foundryup

```bash
foundryup
```

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

Evmts requires a bundler configured to handle `.sol` files

Install your integration of preference.  This hello-world tutorial will use esbuild.

- [esbuild](../guides/esbuild.md)
- [vite](../guides/vite.md)
- [next](../guides/next.md)
- [webpack](../guides/webpack.md)
- [rollup](../guides/rollup.md)


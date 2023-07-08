# Tutorial

## Configuration

**Note this is not implemented yet. Try forking an example app**

- **evmts.config.ts**

The typescript and build plugins are configured via a evmts.config.ts file.

We could use the `@evmts/cli` tool to generate a config but in this tutorial we will do it from scratch.

- **Install EVMts cli**

Install `@evmts/cli` package as a dev dependency

::: code-group

```bash [npm]
npm install @evmts/cli --save-dev
```

```bash [pnpm]
pnpm install @evmts/cli --save-dev
```

```bash [yarn]
yarn add @evmts/cli -D
```

:::

- **Configure EVMts**

Run `init` command to generate a configuration file

```bash
npx evmts init
```

- **See also**

- [Config reference](../reference/config.md)


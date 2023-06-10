# Get Started

## Configuration

- **evmts.config.ts**

The typescript and build plugins [installed in previous step](./installation.md) are configured via the `evmts.config.ts` file.

In this tutorial we will use the `@evmts/cli` tool to generate a config but you can also [create the configuration manually](../reference/config.md).

- **Install EVMts cli**

Install `@evmts/cli` package as a dev dependency

::: code-group

```bash [npm]
npm i @evmts/cli -D
```

```bash [pnpm]
pnpm i @evmts/cli -D
```

```bash [yarn]
yarn i @evmts/cli -D
```

- **Configure EVMts**

Run `init` command to generate a configuration file

```bash
npx evmts init
```

- **See also**

- [Config reference](../reference/config.md)


# Ethers V6 Usage

EVMts provides integration with ethers via an adapter that turns an EVMts contract into an ethers.js contract. There are some advantages to using EVMts within 
your ethers V6 project.

- Contract imports give you the [tight integration](../getting-started/why.md) between your TS files and solidity files. No code-gen no abis just import your contract and use it in your TS.
- Ethers contracts created with EVMts are typesafe by default. This means you will get autocomplete for your contract methods and diagnostics when you pass in the wrong types
- The EVMts cli provides a streamlined way to add and use deployed contracts within your TypeScript code. Simply install a contract and you can start using it right away with zero additional configuration

::: tip
Check out one of the the Ethers.js example project for an example of using ethers.js with EVMts

[svelte example project](https://github.com/evmts/evmts-svelte-ethers-example-)
:::

## Getting started

To get started using Ethers with EVMts first [follow the general EVMts setup](../getting-started/quick-start.md) and then add the `@evmts/ethers` package

```bash
npm install @evmts/ethers
```

## API

- [createEthersContract](./createEthersContract.ts)

- Contract imports give you the [tight integration](../getting-started/why.md) between your TS files and solidity files otherwise
- Ethers contracts created with EVMts are typesafe by default. This means you will get autocomplete for your contract methods and diagnostics when you pass in the wrong types
- The EVMts cli provides a streamlined way to add and use deployed contracts within your TypeScript code. Simply install a contract and you can start using it right away with zero additional configuration

::: tip
Check out the Ethers.js example project for an example of using ethers.js with EVMts

## TODO link
:::

## Getting started

To get started using Ethers with EVMts first [follow the general EVMts setup](../getting-started/quick-start.md) and then add the `@evmts/ethers` package

```bash
npm install -D @evmts/ethers
```

## API

- [createEthersContract](./createEthersContract.ts)

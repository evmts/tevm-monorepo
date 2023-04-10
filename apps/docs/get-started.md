# Get Started

Welcome to EVMts documentation! You will learn

::: info You will learn

- How to install and setup the EVMts vite plugin
- How to write your first forge script
- How to write to blockchain
- How to simulate execution and read events
  :::

## Try EVMts

You don't need to install anything just to play with EVMts. Try editing this sandbox

[TODO](https://github.com/evmts/evmts-monorepo/issues/10)

<iframe frameborder="0" width="100%" height="500" src="https://stackblitz.com/edit/github-dluehe-d7t42l?file=README.md"></iframe>

## Installation

### Install dependencies and peer dependencies.

`@evmts/core` will allow you to execute the EVM in your typescript code. You will also need [viem](https://viem.sh/docs/clients/public.html)

npm
::: code-group

```npm
npm i @evmts/core viem
```

```pnpm
pnpm i @evmts/core viem
```

```yarn
yarn add @evmts/core viem
```

:::

### Install evmts build and ts plugin

`@evmts/plugin` will allow you to directly import contracts in your typescript code.
`@evmts/ts-plugin` will provide typescript type inference to your contracts

::: code-group

```npm
npm i @evmts/plugin @evmts/ts-plugin
```

```pnpm
pnpm i @evmts/plugin @evmts/ts-plugin
```

```yarn
yarn add @evmts/plugin @evmts/ts-plugin
```

:::

### Add evmts to your build config

::: details Vite Setup

Add rollup plugin to vite config

```typescript{5}
import { rollupPlugin } from '@evmts/plugin`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [rollupPlugin()]
})
```

:::

::: details Rollup Setup

```typescript{5}
const { rollupPlugin } = require('@evmts/plugin');

module.exports = {
  ...
  plugins: [rollupPlugin()]
};
```

:::

::: details Next.js setup
Coming soon
:::

## Create a contract

Now let's create a simple hello-world contract `src/HelloWorld.s.sol`.

The `.s.sol` is a convention from [forge scripts](https://book.getfoundry.sh/reference/forge/forge-script). You can think of evmts scripts as being forge scripts you are executing in the browser.

```solidity
pragma solidity 0.8.13;
contract HelloWorld {
    function run() public pure returns (string memory) {
        return "Hello World";
    }
}
```

## Use contract in typescript code

Now we can import our contract and execute it with `@evmts/core`

```typescript
import { executeScript } from "@evmts/core";
import { HelloWorld } from "./HelloWorld.s.sol";

executeScript(HelloWorld).then((greeting) => {
  console.log(greeting);
});
```

## Next steps

### Configure EVMts with your forge project

### Configure EVMts with your hardhat project

### Learn how to use forge cheat codes in EVMts

### Learn how you can contribute to EVMts

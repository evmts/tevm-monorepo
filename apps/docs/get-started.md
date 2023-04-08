# Get Started

Welcome to EVMts documentation! You will learn

- How to install and setup the EVMts vite plugin
- How to write your first forge script
- How to write to blockchain
- How to simulate execution and read events

## create-evmts-app

A fresh project using EVMts can be initiated with the create-evmts-app

`npx create-evmts-app`

The starter app is built with react

## Add to existing project

EVMts is modular

- The core library can be used with no build tool
- The build tool can be used with other libraries such as [viem](./viem-usage) to create a similar developer experience

But for best developer experience it is recomended to use the build tool and the core library together.

## Install build tools

Evmts abstracts away the concept of ABIs via it's vite plugin. After configuring the plugin you will be able to import solidity contracts directly into your typescript code

```typescript
import MyERC20 from "./MyERC20.sol";
import { readContract } from "@evmts/core";

const balance = await readContract(MyERC20.balanceOf, ["vitalik.eth"]);
```

### Vite setup

1. Install rollup plugin for use within vite

```bash
npm i @evmts/plugin-rollup
```

2. Add to vite config

```typescript
import { vitePlugin } from '@evmts/plugin`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vitePlugin()]
})
```

### Rollup setup

```typescript
const { evmtsPlugin } = require('@evmts/plugin-rollup');

module.exports = {
  ...
  plugins: [evmtsPlugin()]
};
```

## Next.js usage

Currently only vite and rollup have first class support but webpack support for Next.js or create react app is coming soon!

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Input**

````
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).

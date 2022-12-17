# babel-plugin-sol

A babel plugin for transpiling template string solidity from evmts

## Usage

### Install this package

_Currently not published to npm_

```bash
pnpm i @evmts/babel-plugin-sol
```

### Add to babel.config.js

```typescript
export default (api) => {
  return {
    plugins: ['@evmts/babel-plugin-sol'],
  }
}
```

### Now you can write solidity with evmts

evmts contains the code that runs at runtime

```bash
pnpm i @evmts/core
```

```typescript
import { run, evmts } from '@evmts/core'
import { useState } from 'react'

const forgeScript = evmts`
contract Script {
    function run() external returns (string memory) {
        return "Hello, World!";
    }
}
`
const sayHello = (): Promise<string> => run(forgeScript)
```

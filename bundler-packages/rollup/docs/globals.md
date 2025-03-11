[**@tevm/rollup-plugin**](README.md)

***

# @tevm/rollup-plugin

## Example

```javascript
// rollup.config.js
import { defineConfig } from 'rollup'
import { rollupPluginTevm } from '@tevm/rollup'

export default defineConfig({
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [rollupPluginTevm()],
})
```

Once configured, you can import Solidity files directly:
```typescript
// src/index.ts
import { Counter } from './contracts/Counter.sol'

// Use the contract with full type safety
console.log(Counter.abi)
```

## Functions

- [rollupPluginTevm](functions/rollupPluginTevm.md)

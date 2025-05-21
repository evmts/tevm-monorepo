[**@tevm/esbuild-plugin**](README.md)

***

# @tevm/esbuild-plugin

## Example

```javascript
// esbuild.config.js
import { esbuildPluginTevm } from '@tevm/esbuild'
import { build } from 'esbuild'

build({
  entryPoints: ['src/index.js'],
  outdir: 'dist',
  bundle: true,
  plugins: [esbuildPluginTevm()],
})
```

Once configured, you can import Solidity files directly:
```typescript
// src/index.ts
import { Counter } from './contracts/Counter.sol'

// Use the contract with full type safety
console.log(Counter.abi)
console.log(Counter.bytecode)
```

## Variables

- [esbuildPluginTevm](variables/esbuildPluginTevm.md)

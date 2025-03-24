[**@tevm/rspack-plugin**](README.md)

***

# @tevm/rspack-plugin

## Example

```javascript
// rspack.config.js
import { rspackPluginTevm } from '@tevm/rspack'

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  plugins: [
    rspackPluginTevm()
  ]
}
```

Once configured, you can import Solidity files directly:
```typescript
// src/index.ts
import { Counter } from './contracts/Counter.sol'

// Use the contract with full type safety
console.log(Counter.abi)
```

## Variables

- [rspackPluginTevm](variables/rspackPluginTevm.md)

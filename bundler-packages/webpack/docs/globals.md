[**@tevm/webpack-plugin**](README.md)

***

# @tevm/webpack-plugin

## Example

```javascript
// webpack.config.js
const { WebpackPluginTevm } = require('@tevm/webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  plugins: [
    new WebpackPluginTevm()
  ]
}
```

Once configured, you can import Solidity files directly:
```typescript
// src/index.ts
import { Counter } from './contracts/Counter.sol'
import { createMemoryClient } from 'tevm'

// Use the contract with full type safety
const client = createMemoryClient()
// ... work with the contract
```

## Variables

- [WebpackPluginTevm](variables/WebpackPluginTevm.md)

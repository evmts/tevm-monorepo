[**@tevm/vite-plugin**](README.md)

***

# @tevm/vite-plugin

## Example

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { vitePluginTevm } from '@tevm/vite'

export default defineConfig({
  plugins: [vitePluginTevm()],
})
```

Once configured, you can import Solidity files directly in your application:
```typescript
// src/App.tsx
import { Counter } from './contracts/Counter.sol'
import { createMemoryClient } from 'tevm'

function App() {
  // Use the contract with full type safety
  const client = createMemoryClient()
  // ...
}
```

## Variables

- [vitePluginTevm](variables/vitePluginTevm.md)

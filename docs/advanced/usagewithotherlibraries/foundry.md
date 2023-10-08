# Foundry integration

EVMts uses it's own compilation process based on solc. In future versions EVMts will plug write into foundry.

EVMts can plug into foundry remappings and lib via setting the [foundryProjects](../../todo.md) key in the evmts.config.ts

- **Example**

```typescript [evmts.config.ts]
import {defineConfig} from 'evmts/config'

export default defineConfig({
  foundryProject: './foundry.toml'
})
```

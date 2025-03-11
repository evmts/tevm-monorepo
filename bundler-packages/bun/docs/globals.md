[**@tevm/bun-plugin**](README.md)

***

# @tevm/bun-plugin

## Example

```typescript
// plugins.ts
import { bunPluginTevm } from '@tevm/bun'
import { plugin } from 'bun'

// Register the plugin with Bun
plugin(bunPluginTevm({}))
```

Configure in bunfig.toml:
```toml
preload = ["./plugins.ts"]
```

Once configured, you can import Solidity files directly:
```typescript
import { Counter } from './contracts/Counter.sol'

// Access contract metadata
console.log(Counter.abi)

// Use with Tevm
const client = createMemoryClient()
const deployed = await client.deployContract(Counter)
const count = await deployed.read.count()
```

## Variables

- [bunFileAccesObject](variables/bunFileAccesObject.md)

## Functions

- [bunPluginTevm](functions/bunPluginTevm.md)
- [file](functions/file.md)

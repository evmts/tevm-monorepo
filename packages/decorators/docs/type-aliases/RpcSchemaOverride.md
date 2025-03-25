[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / RpcSchemaOverride

# Type Alias: RpcSchemaOverride

> **RpcSchemaOverride** = `Omit`\<[`RpcSchema`](RpcSchema.md)\[`number`\], `"Method"`\>

Defined in: [eip1193/RpcSchemaOverride.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/RpcSchemaOverride.ts#L37)

Type for overriding parameters and return types of existing JSON-RPC methods.
Used to modify or extend the behavior of standard RPC methods in a type-safe way.

## Example

```typescript
import { RpcSchemaOverride } from '@tevm/decorators'
import { createTevmNode } from 'tevm'
import { requestEip1193 } from '@tevm/decorators'

// Define custom parameter and return types for a method
type CustomGetBlockOverride = RpcSchemaOverride & {
  Parameters: [blockNumber: string, includeTransactions: boolean, includeOffchainData?: boolean]
  ReturnType: {
    number: string
    hash: string
    parentHash: string
    // ... other standard fields
    customData?: Record<string, any> // Extended field
  }
}

// The override can be used with the standard method name
const customMethod = {
  Method: 'eth_getBlockByNumber',
  ...customOverride
}
```

[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / Quantity

# Type Alias: Quantity

> **Quantity**: `Hex`

Defined in: [eip1193/NetworkSync.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/NetworkSync.ts#L20)

Hexadecimal string representation of an Ethereum quantity (number).
Used throughout the Ethereum JSON-RPC API for numerical values.

## Example

```typescript
import { Quantity } from '@tevm/decorators'

const blockNumber: Quantity = '0x4b7' // 1207 in decimal
const gasPrice: Quantity = '0x3b9aca00' // 1,000,000,000 in decimal (1 Gwei)
```

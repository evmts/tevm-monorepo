[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / Quantity

# Type Alias: Quantity

> **Quantity**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/decorators/dist/index.d.ts:1438

Hexadecimal string representation of an Ethereum quantity (number).
Used throughout the Ethereum JSON-RPC API for numerical values.

## Example

```typescript
import { Quantity } from '@tevm/decorators'

const blockNumber: Quantity = '0x4b7' // 1207 in decimal
const gasPrice: Quantity = '0x3b9aca00' // 1,000,000,000 in decimal (1 Gwei)
```

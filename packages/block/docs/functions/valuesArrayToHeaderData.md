[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / valuesArrayToHeaderData

# Function: valuesArrayToHeaderData()

> **valuesArrayToHeaderData**(`values`): [`HeaderData`](../interfaces/HeaderData.md)

Defined in: [packages/block/src/helpers.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/helpers.ts#L37)

Converts a BlockHeaderBytes array to a HeaderData object

## Parameters

### values

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

Array of raw header bytes containing block header fields

## Returns

[`HeaderData`](../interfaces/HeaderData.md)

The converted header data object with named properties

## Example

```typescript
import { valuesArrayToHeaderData } from '@tevm/block'

// Convert raw header bytes to a structured HeaderData object
const headerData = valuesArrayToHeaderData(blockHeaderBytes)
console.log(headerData.parentHash, headerData.stateRoot)
```

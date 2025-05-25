[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / createMapDb

# Function: createMapDb()

> **createMapDb**(`options`): [`MapDb`](../type-aliases/MapDb.md)

Defined in: createMapDb.js:44

Creates a MapDb which uses an in-memory map as its underlying data structure.
This implementation provides methods for storing, retrieving, and deleting
transaction receipts and other blockchain data.

## Parameters

### options

The configuration options

#### cache

`Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

The cache map to use for storage

## Returns

[`MapDb`](../type-aliases/MapDb.md)

A MapDb instance backed by the provided cache

## Example

```ts
import { createMapDb } from './createMapDb.js'

const cache = new Map()
const mapDb = createMapDb({ cache })

// Store a receipt
await mapDb.put('Receipts', blockHash, encodedReceipt)

// Retrieve the receipt
const receipt = await mapDb.get('Receipts', blockHash)

// Delete the receipt
await mapDb.delete('Receipts', blockHash)
```

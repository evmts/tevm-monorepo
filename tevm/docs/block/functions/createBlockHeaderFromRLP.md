[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / createBlockHeaderFromRLP

# Function: createBlockHeaderFromRLP()

> **createBlockHeaderFromRLP**(`serializedHeaderData`, `opts`): [`BlockHeader`](../classes/BlockHeader.md)

Defined in: packages/block/types/index.d.ts:67

Creates a block header from a RLP-serialized header

## Parameters

### serializedHeaderData

`Uint8Array`

The serialized header data

### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

Options for the block header

## Returns

[`BlockHeader`](../classes/BlockHeader.md)

A new BlockHeader instance

## See

BlockHeader.fromRLPSerializedHeader

[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / createBlockHeaderFromRLP

# Function: createBlockHeaderFromRLP()

> **createBlockHeaderFromRLP**(`serializedHeaderData`, `opts`): [`BlockHeader`](../classes/BlockHeader.md)

Defined in: [packages/block/src/index.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/index.ts#L87)

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

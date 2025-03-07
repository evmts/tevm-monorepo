[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / validateHeader

# Function: validateHeader()

> **validateHeader**(`baseChain`): (`header`, `height`?) => `Promise`\<`void`\>

Defined in: packages/blockchain/types/actions/validateHeader.d.ts:1

## Parameters

### baseChain

`BaseChain`

## Returns

`Function`

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.

### Parameters

#### header

[`BlockHeader`](../../block/classes/BlockHeader.md)

header to be validated

#### height?

`bigint`

If this is an uncle header, this is the height of the block that is including it

### Returns

`Promise`\<`void`\>

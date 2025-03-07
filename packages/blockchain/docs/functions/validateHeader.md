[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / validateHeader

# Function: validateHeader()

> **validateHeader**(`baseChain`): (`header`, `height`?) => `Promise`\<`void`\>

Defined in: [packages/blockchain/src/actions/validateHeader.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/validateHeader.js#L8)

## Parameters

### baseChain

`BaseChain`

## Returns

`Function`

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.

### Parameters

#### header

`BlockHeader`

header to be validated

#### height?

`bigint`

If this is an uncle header, this is the height of the block that is including it

### Returns

`Promise`\<`void`\>

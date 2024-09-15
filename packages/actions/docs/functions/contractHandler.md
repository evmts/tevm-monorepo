[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / contractHandler

# Function: contractHandler()

> **contractHandler**(`client`, `options`?): [`ContractHandler`](../type-aliases/ContractHandler.md)

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **options?** = `{}`

Optional parameters.

• **options.throwOnFail?**: `undefined` \| `boolean` = `true`

Whether to throw an error on failure.

## Returns

[`ContractHandler`](../type-aliases/ContractHandler.md)

The contract handler function.

## Defined in

[packages/actions/src/Contract/contractHandler.js:38](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/Contract/contractHandler.js#L38)

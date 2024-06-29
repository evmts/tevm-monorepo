[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / deployHandler

# Function: deployHandler()

> **deployHandler**(`client`, `options`?): [`DeployHandler`](../type-aliases/DeployHandler.md)

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **options?** = `{}`

Optional parameters.

• **options.throwOnFail?**: `undefined` \| `boolean` = `true`

Whether to throw an error on failure.

## Returns

[`DeployHandler`](../type-aliases/DeployHandler.md)

The deploy handler function.

## Defined in

[packages/actions/src/Deploy/deployHandler.js:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/deployHandler.js#L37)

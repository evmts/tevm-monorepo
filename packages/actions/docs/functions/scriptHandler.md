[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / scriptHandler

# Function: ~~scriptHandler()~~

> **scriptHandler**(`client`, `options`?): [`ScriptHandler`](../type-aliases/ScriptHandler.md)

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **options?**= `{}`

• **options.throwOnFail?**: `undefined` \| `boolean`

whether to default to throwing or not when errors occur

## Returns

[`ScriptHandler`](../type-aliases/ScriptHandler.md)

## Deprecated

can use `contractHandler` instead
Creates an ScriptHandler for handling script params with Ethereumjs EVM

## Source

[packages/actions/src/Script/scriptHandler.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Script/scriptHandler.js#L12)

[**@tevm/ts-plugin**](../README.md) • **Docs**

***

[@tevm/ts-plugin](../globals.md) / export=

# Function: export=()

> **export=**(`mod`): `PluginModule`

[Typescript plugin factory](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)

## Parameters

• **mod**

• **mod.typescript**: *typeof* `ts`

## Returns

`PluginModule`

## Example

```json
{
  "plugins": [{ "name": "tevm-ts-plugin"}]
}
@see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation

## Source

[lsp/ts-plugin/src/tsPlugin.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/lsp/ts-plugin/src/tsPlugin.ts#L24)

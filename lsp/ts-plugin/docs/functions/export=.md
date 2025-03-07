[**@tevm/ts-plugin**](../README.md)

***

[@tevm/ts-plugin](../globals.md) / export=

# Function: export=()

> **export=**(`mod`): `PluginModule`

Defined in: [lsp/ts-plugin/src/tsPlugin.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/lsp/ts-plugin/src/tsPlugin.ts#L24)

[Typescript plugin factory](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)

## Parameters

### mod

#### typescript

*typeof* `ts`

## Returns

`PluginModule`

## Example

```json
{
  "plugins": [{ "name": "tevm-ts-plugin"}]
}
@see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation

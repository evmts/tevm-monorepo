[**@tevm/ts-plugin**](../README.md)

***

[@tevm/ts-plugin](../globals.md) / export=

# Function: export=()

> **export=**(`mod`): `PluginModule`

Defined in: [lsp/ts-plugin/src/tsPlugin.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/lsp/ts-plugin/src/tsPlugin.ts#L36)

TypeScript server plugin factory that enables Solidity support in TypeScript.
This plugin allows direct importing of .sol files in TypeScript with proper
type definitions, code navigation, and IDE support.

The plugin works by decorating the TypeScript language service to handle
Solidity files, compile them with solc, and provide TypeScript definitions.

Add to your tsconfig.json:

## Parameters

### mod

#### typescript

*typeof* `ts`

## Returns

`PluginModule`

## Example

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tevm-ts-plugin" }]
  }
}
```

## See

 - https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin
 - https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation

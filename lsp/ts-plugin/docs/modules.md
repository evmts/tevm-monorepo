[@evmts/ts-plugin](README.md) / Exports

# @evmts/ts-plugin

## Table of contents

### Functions

- [export=](modules.md#export=)

## Functions

### export&#x3D;

▸ **export=**(`mod`): `PluginModule`

[Typescript plugin factory](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)

#### Parameters

| Name | Type |
| :------ | :------ |
| `mod` | `Object` |
| `mod.typescript` | typeof `ts` |

#### Returns

`PluginModule`

**`Example`**

```json
{
  "plugins": [{ "name": "evmts-ts-plugin"}]
}
@see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/tsserverlibrary.d.ts:3243

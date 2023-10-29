[@evmts/effect](/reference/effect/README.md) / Exports

# @evmts/effect

## Table of contents

### Classes

- [CreateRequireError](/reference/effect/classes/CreateRequireError.md)
- [ParseJsonError](/reference/effect/classes/ParseJsonError.md)
- [RequireError](/reference/effect/classes/RequireError.md)

### Functions

- [createRequireEffect](/reference/effect/modules.md#createrequireeffect)
- [fileExists](/reference/effect/modules.md#fileexists)
- [logAllErrors](/reference/effect/modules.md#logallerrors)
- [parseJson](/reference/effect/modules.md#parsejson)

## Functions

### createRequireEffect

▸ **createRequireEffect**(`url`): `Effect`<`never`, [`CreateRequireError`](/reference/effect/classes/CreateRequireError.md), (`id`: `string`) => `Effect`<`never`, [`RequireError`](/reference/effect/classes/RequireError.md), `any`\>\>

An [Effect](https://www.effect.website/docs/introduction) wrapper around createRequire
createRequire is used to use the node.js `require` function in esm modules and cjs modules
in a way that is compatible with both. It also wraps them weith Effect for better error handling

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | url to create require from |

#### Returns

`Effect`<`never`, [`CreateRequireError`](/reference/effect/classes/CreateRequireError.md), (`id`: `string`) => `Effect`<`never`, [`RequireError`](/reference/effect/classes/RequireError.md), `any`\>\>

require function

**`Example`**

```typescript
import { createRequireEffect } from '@eth-optimism/config'
const requireEffect = createRequireEffect(import.meta.url)
const solcEffect = requireEffect('solc')
```

**`See`**

https://nodejs.org/api/modules.html#modules_module_createrequire_filename

#### Defined in

[effect/src/createRequireEffect.js:50](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/createRequireEffect.js#L50)

___

### fileExists

▸ **fileExists**(`path`): `Effect`<`never`, `never`, `boolean`\>

Checks if a file exists at the given path

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | path to check |

#### Returns

`Effect`<`never`, `never`, `boolean`\>

true if the file exists, false otherwise

**`Example`**

```typescript
import { fileExists } from '@eth-optimism/config'
await fileExists('./someFile.txt')
```

#### Defined in

[effect/src/fileExists.js:16](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/fileExists.js#L16)

___

### logAllErrors

▸ **logAllErrors**(`e`): `Effect`<`never`, `never`, `void`\>

Logs all errors and causes from effect

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `unknown` |

#### Returns

`Effect`<`never`, `never`, `void`\>

**`Example`**

```typescript
import { logAllErrors } from '@eth-optimism/config'

someEffect.pipe(
  tapError(logAllErrors)
)

#### Defined in

[effect/src/logAllErrors.js:16](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/logAllErrors.js#L16)

___

### parseJson

▸ **parseJson**(`jsonStr`): `Effect`<`never`, [`ParseJsonError`](/reference/effect/classes/ParseJsonError.md), { `compilerOptions?`: { `plugins`: { `name`: `string`  }[]  }  }\>

Parses a json string

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonStr` | `string` |

#### Returns

`Effect`<`never`, [`ParseJsonError`](/reference/effect/classes/ParseJsonError.md), { `compilerOptions?`: { `plugins`: { `name`: `string`  }[]  }  }\>

**`Throws`**

when the tsconfig.json file is not valid json

**`Example`**

```ts
const jsonEffect = parseJson('{ "compilerOptions": { "plugins": [{ "name": "@evmts/ts-plugin" }] } }')
````
@internal

#### Defined in

[effect/src/parseJson.js:33](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/parseJson.js#L33)

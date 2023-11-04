[@evmts/effect](../README.md) / [Modules](../modules.md) / fileExists

# Module: fileExists

## Table of contents

### Functions

- [fileExists](fileExists.md#fileexists)

## Functions

### fileExists

▸ **fileExists**(`path`): `Effect`\<`never`, `never`, `boolean`\>

Checks if a file exists at the given path

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | path to check |

#### Returns

`Effect`\<`never`, `never`, `boolean`\>

true if the file exists, false otherwise

**`Example`**

```typescript
import { fileExists } from '@eth-optimism/config'
await fileExists('./someFile.txt')
```

#### Defined in

[packages/effect/src/fileExists.js:16](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/fileExists.js#L16)

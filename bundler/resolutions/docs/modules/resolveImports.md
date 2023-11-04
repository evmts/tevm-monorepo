[@evmts/resolutions](../README.md) / [Modules](../modules.md) / resolveImports

# Module: resolveImports

## Table of contents

### Type Aliases

- [ResolveImportsError](resolveImports.md#resolveimportserror)

### Functions

- [resolveImports](resolveImports.md#resolveimports)

## Type Aliases

### ResolveImportsError

Ƭ **ResolveImportsError**\<\>: `ImportDoesNotExistError` \| `CouldNotResolveImportError`

#### Defined in

[resolveImports.js:20](https://github.com/evmts/evmts-monorepo/blob/main/bundler/resolutions/src/resolveImports.js#L20)

## Functions

### resolveImports

▸ **resolveImports**(`absolutePath`, `code`, `remappings`, `libs`, `sync?`): `Effect`\<`never`, [`ResolveImportsError`](resolveImports.md#resolveimportserror), readonly [`ResolvedImport`](types.md#resolvedimport)[]\>

Returns a the import resolutions for the given code

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `absolutePath` | `string` | `undefined` |
| `code` | `string` | `undefined` |
| `remappings` | `Record`\<`string`, `string`\> | `undefined` |
| `libs` | readonly `string`[] | `undefined` |
| `sync` | `boolean` | `false` |

#### Returns

`Effect`\<`never`, [`ResolveImportsError`](resolveImports.md#resolveimportserror), readonly [`ResolvedImport`](types.md#resolvedimport)[]\>

**`Example`**

```ts
const pathToSolidity = path.join(__dirname, '../Contract.sol')
const code = fs.readFileSync(pathToSolidity, 'utf8'),
const remappings = {}
const lib = []

const imports = runPromise(
  resolveImports(
    pathToSolidity,
    code,
    remappings,
    libs,
    false
  )
)
console.log(imports) // [{ updated: '/path/to/Contract.sol', absolute: '/path/to/Contract.sol', original: '../Contract.sol' }]
```

#### Defined in

[resolveImports.js:50](https://github.com/evmts/evmts-monorepo/blob/main/bundler/resolutions/src/resolveImports.js#L50)

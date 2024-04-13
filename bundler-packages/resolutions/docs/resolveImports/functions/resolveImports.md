**@tevm/resolutions** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [resolveImports](../README.md) > resolveImports

# Function: resolveImports()

> **resolveImports**(`absolutePath`, `code`, `remappings`, `libs`, `sync`): `Effect`\<`never`, [`ResolveImportsError`](../type-aliases/ResolveImportsError.md), readonly [`ResolvedImport`](../../types/type-aliases/ResolvedImport.md)[]\>

Returns a the import resolutions for the given code

## Parameters

▪ **absolutePath**: `string`

▪ **code**: `string`

▪ **remappings**: `Record`\<`string`, `string`\>

▪ **libs**: readonly `string`[]

▪ **sync**: `boolean`= `false`

## Returns

## Example

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

## Source

[resolveImports.js:50](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/resolutions/src/resolveImports.js#L50)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

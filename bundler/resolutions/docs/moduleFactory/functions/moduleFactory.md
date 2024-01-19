**@tevm/resolutions** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [moduleFactory](../README.md) > moduleFactory

# Function: moduleFactory()

> **moduleFactory**(`absolutePath`, `rawCode`, `remappings`, `libs`, `fao`, `sync`): `Effect`\<`never`, [`ModuleFactoryError`](../type-aliases/ModuleFactoryError.md), `Map`\<`string`, [`ModuleInfo`](../../types/interfaces/ModuleInfo.md)\>\>

Creates a module from the given module information.
This includes resolving all imports and creating a dependency graph.

Currently it modifies the source code in place which causes the ast to not match the source code.
This complexity leaks to the typescript lsp which has to account for this
Ideally we refactor this to not need to modify source code in place
Doing this hurts our ability to control the import graph and make it use node resolution though
See foundry that is alergic to using npm
Doing it this way for now is easier but for sure a leaky abstraction

## Parameters

▪ **absolutePath**: `string`

▪ **rawCode**: `string`

▪ **remappings**: `Record`\<`string`, `string`\>

▪ **libs**: readonly `string`[]

▪ **fao**: [`FileAccessObject`](../../types/type-aliases/FileAccessObject.md)

▪ **sync**: `boolean`

Whether to run this synchronously or not

## Returns

## Example

```ts
const pathToSolidity = path.join(__dirname, '../Contract.sol')
const rawCode = fs.readFileSync(pathToSolidity, 'utf8'),

const modules = runPromise(
  moduleFactory(
    pathToSolidity,
    rawCode,
    {
      "remapping": "remapping/src"
    },
    ["lib/path"],
    {
      readFileSync,
      readFile,
      existsSync,
    },
    false
  )
)
console.log(modules.get(pathToSolidity)) // { id: '/path/to/Contract.sol', rawCode: '...', importedIds: ['/path/to/Imported.sol'], code: '...' }
```

## Source

[moduleFactory.js:53](https://github.com/evmts/tevm-monorepo/blob/main/bundler/resolutions/src/moduleFactory.js#L53)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

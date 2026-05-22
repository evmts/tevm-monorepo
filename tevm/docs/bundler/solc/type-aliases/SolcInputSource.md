[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcInputSource

# Type Alias: SolcInputSource\<T\>

> **SolcInputSource**\<`T`\> = `object` & \{ `ast`: `T` *extends* `"SolidityAST"` ? [`SolcAst`](SolcAst.md) : `never`; \} \| \{ `urls`: `string`[]; \} \| \{ `content`: `T` *extends* `"SolidityAST"` ? `never` : `string`; \}

## Type Declaration

### keccak256?

> `optional` **keccak256?**: `HexNumber`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SolcLanguage`](SolcLanguage.md) | [`SolcLanguage`](SolcLanguage.md) |

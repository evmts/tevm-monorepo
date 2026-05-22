[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcInputSource

# Type Alias: SolcInputSource\<T\>

> **SolcInputSource**\<`T`\> = `object` & \{ `ast`: `T` *extends* `"SolidityAST"` ? [`SolcAst`](SolcAst.md) : `never`; \} \| \{ `urls`: `string`[]; \} \| \{ `content`: `T` *extends* `"SolidityAST"` ? `never` : `string`; \}

Defined in: [solcTypes.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L15)

## Type Declaration

### keccak256?

> `optional` **keccak256?**: `HexNumber`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SolcLanguage`](SolcLanguage.md) | [`SolcLanguage`](SolcLanguage.md) |

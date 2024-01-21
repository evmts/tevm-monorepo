**@tevm/procedures-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > JsonRpcReturnTypeFromMethod

# Type alias: JsonRpcReturnTypeFromMethod`<TMethod>`

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: `EthReturnType` & `TevmReturnType` & `AnvilReturnType` & `DebugReturnType`[`TMethod`]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends keyof `EthReturnType` \| keyof `TevmReturnType` \| keyof `AnvilReturnType` \| keyof `DebugReturnType` |

## Source

[TevmJsonRpcRequestHandler.ts:279](https://github.com/evmts/tevm-monorepo/blob/main/core/procedures-types/src/TevmJsonRpcRequestHandler.ts#L279)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

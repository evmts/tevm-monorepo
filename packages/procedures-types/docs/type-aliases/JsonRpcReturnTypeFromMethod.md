**@tevm/procedures-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > JsonRpcReturnTypeFromMethod

# Type alias: JsonRpcReturnTypeFromMethod`<TMethod>`

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](EthReturnType.md) & [`TevmReturnType`](TevmReturnType.md) & [`AnvilReturnType`](AnvilReturnType.md) & [`DebugReturnType`](DebugReturnType.md)[`TMethod`]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends keyof [`EthReturnType`](EthReturnType.md) \| keyof [`TevmReturnType`](TevmReturnType.md) \| keyof [`AnvilReturnType`](AnvilReturnType.md) \| keyof [`DebugReturnType`](DebugReturnType.md) |

## Source

[tevm-request-handler/JsonRpcReturnTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/procedures-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > JsonRpcRequestTypeFromMethod

# Type alias: JsonRpcRequestTypeFromMethod`<TMethod>`

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](EthRequestType.md) & [`TevmRequestType`](TevmRequestType.md) & [`AnvilRequestType`](AnvilRequestType.md) & [`DebugRequestType`](DebugRequestType.md)[`TMethod`]

Utility type to get the request type given a method name

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends keyof [`EthRequestType`](EthRequestType.md) \| keyof [`TevmRequestType`](TevmRequestType.md) \| keyof [`AnvilRequestType`](AnvilRequestType.md) \| keyof [`DebugRequestType`](DebugRequestType.md) |

## Source

[TevmJsonRpcRequestHandler.ts:321](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/TevmJsonRpcRequestHandler.ts#L321)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

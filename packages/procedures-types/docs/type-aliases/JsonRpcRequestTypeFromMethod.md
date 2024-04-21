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

[tevm-request-handler/JsonRpcRequestTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/tevm-request-handler/JsonRpcRequestTypeFromMethod.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

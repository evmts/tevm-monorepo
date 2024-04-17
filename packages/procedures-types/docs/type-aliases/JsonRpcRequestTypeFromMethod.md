**@tevm/procedures-types** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/procedures-types](../README.md) / JsonRpcRequestTypeFromMethod

# Type alias: JsonRpcRequestTypeFromMethod\<TMethod\>

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](EthRequestType.md) & [`TevmRequestType`](TevmRequestType.md) & [`AnvilRequestType`](AnvilRequestType.md) & [`DebugRequestType`](DebugRequestType.md)\[`TMethod`\]

Utility type to get the request type given a method name

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

• **TMethod** extends keyof [`EthRequestType`](EthRequestType.md) \| keyof [`TevmRequestType`](TevmRequestType.md) \| keyof [`AnvilRequestType`](AnvilRequestType.md) \| keyof [`DebugRequestType`](DebugRequestType.md)

## Source

[tevm-request-handler/JsonRpcRequestTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/tevm-request-handler/JsonRpcRequestTypeFromMethod.ts#L13)

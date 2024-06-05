[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcRequestTypeFromMethod

# Type alias: JsonRpcRequestTypeFromMethod\<TMethod\>

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](../../procedures-types/type-aliases/EthRequestType.md) & [`TevmRequestType`](../../procedures-types/type-aliases/TevmRequestType.md) & [`AnvilRequestType`](../../procedures-types/type-aliases/AnvilRequestType.md) & [`DebugRequestType`](../../procedures-types/type-aliases/DebugRequestType.md)\[`TMethod`\]

Utility type to get the request type given a method name

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

• **TMethod** *extends* keyof [`EthRequestType`](../../procedures-types/type-aliases/EthRequestType.md) \| keyof [`TevmRequestType`](../../procedures-types/type-aliases/TevmRequestType.md) \| keyof [`AnvilRequestType`](../../procedures-types/type-aliases/AnvilRequestType.md) \| keyof [`DebugRequestType`](../../procedures-types/type-aliases/DebugRequestType.md)

## Source

packages/procedures-types/dist/index.d.ts:1006

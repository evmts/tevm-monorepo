[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcRequestTypeFromMethod

# Type Alias: JsonRpcRequestTypeFromMethod\<TMethod\>

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](../../procedures/type-aliases/EthRequestType.md) & [`TevmRequestType`](../../procedures/type-aliases/TevmRequestType.md) & [`AnvilRequestType`](../../procedures/type-aliases/AnvilRequestType.md) & [`DebugRequestType`](../../procedures/type-aliases/DebugRequestType.md)\[`TMethod`\]

Utility type to get the request type given a method name

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Type Parameters

• **TMethod** *extends* keyof [`EthRequestType`](../../procedures/type-aliases/EthRequestType.md) \| keyof [`TevmRequestType`](../../procedures/type-aliases/TevmRequestType.md) \| keyof [`AnvilRequestType`](../../procedures/type-aliases/AnvilRequestType.md) \| keyof [`DebugRequestType`](../../procedures/type-aliases/DebugRequestType.md)

## Defined in

packages/procedures/dist/index.d.ts:1349

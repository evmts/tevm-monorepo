[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcRequestTypeFromMethod

# Type Alias: JsonRpcRequestTypeFromMethod\<TMethod\>

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](../../actions/type-aliases/EthRequestType.md) & [`TevmRequestType`](../../actions/type-aliases/TevmRequestType.md) & [`AnvilRequestType`](../../actions/type-aliases/AnvilRequestType.md) & [`DebugRequestType`](../../actions/type-aliases/DebugRequestType.md)\[`TMethod`\]

Defined in: packages/actions/types/tevm-request-handler/JsonRpcRequestTypeFromMethod.d.ts:12

Utility type to get the request type given a method name

## Type Parameters

• **TMethod** *extends* keyof [`EthRequestType`](../../actions/type-aliases/EthRequestType.md) \| keyof [`TevmRequestType`](../../actions/type-aliases/TevmRequestType.md) \| keyof [`AnvilRequestType`](../../actions/type-aliases/AnvilRequestType.md) \| keyof [`DebugRequestType`](../../actions/type-aliases/DebugRequestType.md)

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcRequestTypeFromMethod

# Type Alias: JsonRpcRequestTypeFromMethod\<TMethod\>

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\> = [`EthRequestType`](EthRequestType.md) & [`TevmRequestType`](TevmRequestType.md) & [`AnvilRequestType`](AnvilRequestType.md) & [`DebugRequestType`](DebugRequestType.md)\[`TMethod`\]

Defined in: packages/actions/types/tevm-request-handler/JsonRpcRequestTypeFromMethod.d.ts:12

Utility type to get the request type given a method name

## Type Parameters

### TMethod

`TMethod` *extends* keyof [`EthRequestType`](EthRequestType.md) \| keyof [`TevmRequestType`](TevmRequestType.md) \| keyof [`AnvilRequestType`](AnvilRequestType.md) \| keyof [`DebugRequestType`](DebugRequestType.md)

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

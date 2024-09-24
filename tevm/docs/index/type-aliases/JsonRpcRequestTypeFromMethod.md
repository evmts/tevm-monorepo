[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcRequestTypeFromMethod

# Type Alias: JsonRpcRequestTypeFromMethod\<TMethod\>

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: `EthRequestType` & `TevmRequestType` & `AnvilRequestType` & `DebugRequestType`\[`TMethod`\]

Utility type to get the request type given a method name

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Type Parameters

• **TMethod** *extends* keyof `EthRequestType` \| keyof `TevmRequestType` \| keyof `AnvilRequestType` \| keyof `DebugRequestType`

## Defined in

packages/actions/types/tevm-request-handler/JsonRpcRequestTypeFromMethod.d.ts:12

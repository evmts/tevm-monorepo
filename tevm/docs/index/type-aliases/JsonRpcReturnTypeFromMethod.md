[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcReturnTypeFromMethod

# Type Alias: JsonRpcReturnTypeFromMethod\<TMethod\>

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: `EthReturnType` & `TevmReturnType` & `AnvilReturnType` & `DebugReturnType`\[`TMethod`\]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type Parameters

• **TMethod** *extends* keyof `EthReturnType` \| keyof `TevmReturnType` \| keyof `AnvilReturnType` \| keyof `DebugReturnType`

## Defined in

packages/actions/types/tevm-request-handler/JsonRpcReturnTypeFromMethod.d.ts:12

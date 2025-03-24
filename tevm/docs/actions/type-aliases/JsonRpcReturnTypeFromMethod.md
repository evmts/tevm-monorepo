[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcReturnTypeFromMethod

# Type Alias: JsonRpcReturnTypeFromMethod\<TMethod\>

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\> = [`EthReturnType`](EthReturnType.md) & [`TevmReturnType`](TevmReturnType.md) & [`AnvilReturnType`](AnvilReturnType.md) & [`DebugReturnType`](DebugReturnType.md)\[`TMethod`\]

Defined in: packages/actions/types/tevm-request-handler/JsonRpcReturnTypeFromMethod.d.ts:12

Utility type to get the return type given a method name

## Type Parameters

### TMethod

`TMethod` *extends* keyof [`EthReturnType`](EthReturnType.md) \| keyof [`TevmReturnType`](TevmReturnType.md) \| keyof [`AnvilReturnType`](AnvilReturnType.md) \| keyof [`DebugReturnType`](DebugReturnType.md)

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

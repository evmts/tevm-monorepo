[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcReturnTypeFromMethod

# Type Alias: JsonRpcReturnTypeFromMethod\<TMethod\>

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](../../actions/type-aliases/EthReturnType.md) & [`TevmReturnType`](../../actions/type-aliases/TevmReturnType.md) & [`AnvilReturnType`](../../actions/type-aliases/AnvilReturnType.md) & [`DebugReturnType`](../../actions/type-aliases/DebugReturnType.md)\[`TMethod`\]

Defined in: packages/actions/types/tevm-request-handler/JsonRpcReturnTypeFromMethod.d.ts:12

Utility type to get the return type given a method name

## Type Parameters

• **TMethod** *extends* keyof [`EthReturnType`](../../actions/type-aliases/EthReturnType.md) \| keyof [`TevmReturnType`](../../actions/type-aliases/TevmReturnType.md) \| keyof [`AnvilReturnType`](../../actions/type-aliases/AnvilReturnType.md) \| keyof [`DebugReturnType`](../../actions/type-aliases/DebugReturnType.md)

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

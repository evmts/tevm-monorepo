[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcReturnTypeFromMethod

# Type alias: JsonRpcReturnTypeFromMethod\<TMethod\>

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](../../procedures/type-aliases/EthReturnType.md) & [`TevmReturnType`](../../procedures/type-aliases/TevmReturnType.md) & [`AnvilReturnType`](../../procedures/type-aliases/AnvilReturnType.md) & [`DebugReturnType`](../../procedures/type-aliases/DebugReturnType.md)\[`TMethod`\]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

• **TMethod** *extends* keyof [`EthReturnType`](../../procedures/type-aliases/EthReturnType.md) \| keyof [`TevmReturnType`](../../procedures/type-aliases/TevmReturnType.md) \| keyof [`AnvilReturnType`](../../procedures/type-aliases/AnvilReturnType.md) \| keyof [`DebugReturnType`](../../procedures/type-aliases/DebugReturnType.md)

## Source

packages/procedures/dist/index.d.ts:923

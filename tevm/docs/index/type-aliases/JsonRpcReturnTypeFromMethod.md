[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / JsonRpcReturnTypeFromMethod

# Type alias: JsonRpcReturnTypeFromMethod\<TMethod\>

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](../../procedures-types/type-aliases/EthReturnType.md) & [`TevmReturnType`](../../procedures-types/type-aliases/TevmReturnType.md) & [`AnvilReturnType`](../../procedures-types/type-aliases/AnvilReturnType.md) & [`DebugReturnType`](../../procedures-types/type-aliases/DebugReturnType.md)\[`TMethod`\]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

• **TMethod** *extends* keyof [`EthReturnType`](../../procedures-types/type-aliases/EthReturnType.md) \| keyof [`TevmReturnType`](../../procedures-types/type-aliases/TevmReturnType.md) \| keyof [`AnvilReturnType`](../../procedures-types/type-aliases/AnvilReturnType.md) \| keyof [`DebugReturnType`](../../procedures-types/type-aliases/DebugReturnType.md)

## Source

packages/procedures-types/dist/index.d.ts:1032

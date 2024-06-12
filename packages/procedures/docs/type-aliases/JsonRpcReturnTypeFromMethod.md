[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / JsonRpcReturnTypeFromMethod

# Type alias: JsonRpcReturnTypeFromMethod\<TMethod\>

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](EthReturnType.md) & [`TevmReturnType`](TevmReturnType.md) & [`AnvilReturnType`](AnvilReturnType.md) & [`DebugReturnType`](DebugReturnType.md)\[`TMethod`\]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

• **TMethod** *extends* keyof [`EthReturnType`](EthReturnType.md) \| keyof [`TevmReturnType`](TevmReturnType.md) \| keyof [`AnvilReturnType`](AnvilReturnType.md) \| keyof [`DebugReturnType`](DebugReturnType.md)

## Source

[procedures/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts#L13)
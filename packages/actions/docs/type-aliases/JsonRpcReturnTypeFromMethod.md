[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcReturnTypeFromMethod

# Type Alias: JsonRpcReturnTypeFromMethod\<TMethod\>

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\> = [`EthReturnType`](EthReturnType.md) & [`TevmReturnType`](TevmReturnType.md) & [`AnvilReturnType`](AnvilReturnType.md) & [`DebugReturnType`](DebugReturnType.md)\[`TMethod`\]

Defined in: [packages/actions/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts#L13)

Utility type to get the return type given a method name

## Type Parameters

### TMethod

`TMethod` *extends* keyof [`EthReturnType`](EthReturnType.md) \| keyof [`TevmReturnType`](TevmReturnType.md) \| keyof [`AnvilReturnType`](AnvilReturnType.md) \| keyof [`DebugReturnType`](DebugReturnType.md)

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

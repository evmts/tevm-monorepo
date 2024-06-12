---
editUrl: false
next: false
prev: false
title: "JsonRpcReturnTypeFromMethod"
---

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](/reference/tevm/procedures/type-aliases/ethreturntype/) & [`TevmReturnType`](/reference/tevm/procedures/type-aliases/tevmreturntype/) & [`AnvilReturnType`](/reference/tevm/procedures/type-aliases/anvilreturntype/) & [`DebugReturnType`](/reference/tevm/procedures/type-aliases/debugreturntype/)\[`TMethod`\]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

• **TMethod** *extends* keyof [`EthReturnType`](/reference/tevm/procedures/type-aliases/ethreturntype/) \| keyof [`TevmReturnType`](/reference/tevm/procedures/type-aliases/tevmreturntype/) \| keyof [`AnvilReturnType`](/reference/tevm/procedures/type-aliases/anvilreturntype/) \| keyof [`DebugReturnType`](/reference/tevm/procedures/type-aliases/debugreturntype/)

## Source

[procedures/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts#L13)

---
editUrl: false
next: false
prev: false
title: "JsonRpcReturnTypeFromMethod"
---

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](/reference/tevm/actions/type-aliases/ethreturntype/) & [`TevmReturnType`](/reference/tevm/actions/type-aliases/tevmreturntype/) & [`AnvilReturnType`](/reference/tevm/actions/type-aliases/anvilreturntype/) & [`DebugReturnType`](/reference/tevm/actions/type-aliases/debugreturntype/)\[`TMethod`\]

Utility type to get the return type given a method name

## Type Parameters

• **TMethod** *extends* keyof [`EthReturnType`](/reference/tevm/actions/type-aliases/ethreturntype/) \| keyof [`TevmReturnType`](/reference/tevm/actions/type-aliases/tevmreturntype/) \| keyof [`AnvilReturnType`](/reference/tevm/actions/type-aliases/anvilreturntype/) \| keyof [`DebugReturnType`](/reference/tevm/actions/type-aliases/debugreturntype/)

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Defined in

[packages/actions/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts#L13)

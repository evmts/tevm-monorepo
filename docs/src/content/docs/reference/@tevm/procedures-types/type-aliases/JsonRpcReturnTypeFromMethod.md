---
editUrl: false
next: false
prev: false
title: "JsonRpcReturnTypeFromMethod"
---

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: [`EthReturnType`](/reference/tevm/procedures-types/type-aliases/ethreturntype/) & [`TevmReturnType`](/reference/tevm/procedures-types/type-aliases/tevmreturntype/) & [`AnvilReturnType`](/reference/tevm/procedures-types/type-aliases/anvilreturntype/) & [`DebugReturnType`](/reference/tevm/procedures-types/type-aliases/debugreturntype/)[`TMethod`]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends keyof [`EthReturnType`](/reference/tevm/procedures-types/type-aliases/ethreturntype/) \| keyof [`TevmReturnType`](/reference/tevm/procedures-types/type-aliases/tevmreturntype/) \| keyof [`AnvilReturnType`](/reference/tevm/procedures-types/type-aliases/anvilreturntype/) \| keyof [`DebugReturnType`](/reference/tevm/procedures-types/type-aliases/debugreturntype/) |

## Source

[tevm-request-handler/JsonRpcReturnTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/tevm-request-handler/JsonRpcReturnTypeFromMethod.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

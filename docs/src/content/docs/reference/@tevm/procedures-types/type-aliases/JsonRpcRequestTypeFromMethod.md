---
editUrl: false
next: false
prev: false
title: "JsonRpcRequestTypeFromMethod"
---

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](/reference/tevm/procedures-types/type-aliases/ethrequesttype/) & [`TevmRequestType`](/reference/tevm/procedures-types/type-aliases/tevmrequesttype/) & [`AnvilRequestType`](/reference/tevm/procedures-types/type-aliases/anvilrequesttype/) & [`DebugRequestType`](/reference/tevm/procedures-types/type-aliases/debugrequesttype/)[`TMethod`]

Utility type to get the request type given a method name

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends keyof [`EthRequestType`](/reference/tevm/procedures-types/type-aliases/ethrequesttype/) \| keyof [`TevmRequestType`](/reference/tevm/procedures-types/type-aliases/tevmrequesttype/) \| keyof [`AnvilRequestType`](/reference/tevm/procedures-types/type-aliases/anvilrequesttype/) \| keyof [`DebugRequestType`](/reference/tevm/procedures-types/type-aliases/debugrequesttype/) |

## Source

[TevmJsonRpcRequestHandler.ts:321](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/TevmJsonRpcRequestHandler.ts#L321)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

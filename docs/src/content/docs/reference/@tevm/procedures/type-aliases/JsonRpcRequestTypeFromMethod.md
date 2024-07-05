---
editUrl: false
next: false
prev: false
title: "JsonRpcRequestTypeFromMethod"
---

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](/reference/tevm/procedures/type-aliases/ethrequesttype/) & [`TevmRequestType`](/reference/tevm/procedures/type-aliases/tevmrequesttype/) & [`AnvilRequestType`](/reference/tevm/procedures/type-aliases/anvilrequesttype/) & [`DebugRequestType`](/reference/tevm/procedures/type-aliases/debugrequesttype/)\[`TMethod`\]

Utility type to get the request type given a method name

## Type Parameters

• **TMethod** *extends* keyof [`EthRequestType`](/reference/tevm/procedures/type-aliases/ethrequesttype/) \| keyof [`TevmRequestType`](/reference/tevm/procedures/type-aliases/tevmrequesttype/) \| keyof [`AnvilRequestType`](/reference/tevm/procedures/type-aliases/anvilrequesttype/) \| keyof [`DebugRequestType`](/reference/tevm/procedures/type-aliases/debugrequesttype/)

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Defined in

[procedures/src/tevm-request-handler/JsonRpcRequestTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm-request-handler/JsonRpcRequestTypeFromMethod.ts#L13)

---
editUrl: false
next: false
prev: false
title: "JsonRpcRequestTypeFromMethod"
---

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: [`EthRequestType`](/reference/tevm/actions/type-aliases/ethrequesttype/) & [`TevmRequestType`](/reference/tevm/actions/type-aliases/tevmrequesttype/) & [`AnvilRequestType`](/reference/tevm/actions/type-aliases/anvilrequesttype/) & [`DebugRequestType`](/reference/tevm/actions/type-aliases/debugrequesttype/)\[`TMethod`\]

Utility type to get the request type given a method name

## Type Parameters

• **TMethod** *extends* keyof [`EthRequestType`](/reference/tevm/actions/type-aliases/ethrequesttype/) \| keyof [`TevmRequestType`](/reference/tevm/actions/type-aliases/tevmrequesttype/) \| keyof [`AnvilRequestType`](/reference/tevm/actions/type-aliases/anvilrequesttype/) \| keyof [`DebugRequestType`](/reference/tevm/actions/type-aliases/debugrequesttype/)

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Defined in

[packages/actions/src/tevm-request-handler/JsonRpcRequestTypeFromMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm-request-handler/JsonRpcRequestTypeFromMethod.ts#L13)

[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / TevmTransport

# Type Alias: TevmTransport()\<TName\>

> **TevmTransport**\<`TName`\>: \<`TChain`\>(`{ chain, pollingInterval, retryCount, timeout, }`) => `object`

## Type Parameters

• **TName** *extends* `string` = `string`

The name of the transport.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain`

The blockchain configuration.

## Parameters

• **\{ chain, pollingInterval, retryCount, timeout, \}**

• **\{ chain, pollingInterval, retryCount, timeout, \}.chain?**: `TChain`

• **\{ chain, pollingInterval, retryCount, timeout, \}.pollingInterval?**: `ClientConfig`\[`"pollingInterval"`\]

• **\{ chain, pollingInterval, retryCount, timeout, \}.retryCount?**: `TransportConfig`\[`"retryCount"`\]

• **\{ chain, pollingInterval, retryCount, timeout, \}.timeout?**: `TransportConfig`\[`"timeout"`\]

## Returns

`object`

The configured TEVM transport.

### config

> **config**: `TransportConfig`\<`TName`\>

### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)

### value

> **value**: `object`

### value.tevm

> **tevm**: [`TevmNode`](TevmNode.md) & `object`

#### Type declaration

##### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)

## Defined in

packages/memory-client/types/TevmTransport.d.ts:17

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmTransport

# Type Alias: TevmTransport()\<TName\>

> **TevmTransport**\<`TName`\>: \<`TChain`\>(`{ chain, pollingInterval, retryCount, timeout, }`) => `object`

Defined in: packages/memory-client/types/TevmTransport.d.ts:17

A type representing a custom TEVM Transport for viem.

## Type Parameters

• **TName** *extends* `string` = `string`

The name of the transport.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain`

The blockchain configuration.

## Parameters

### \{ chain, pollingInterval, retryCount, timeout, \}

#### chain?

`TChain`

#### pollingInterval?

`ClientConfig`\[`"pollingInterval"`\]

#### retryCount?

`TransportConfig`\[`"retryCount"`\]

#### timeout?

`TransportConfig`\[`"timeout"`\]

## Returns

`object`

The configured TEVM transport.

### config

> **config**: `TransportConfig`\<`TName`\>

### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)

### value

> **value**: `object`

#### value.tevm

> **tevm**: [`TevmNode`](TevmNode.md) & `object`

##### Type declaration

###### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)

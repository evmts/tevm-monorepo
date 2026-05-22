[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmTransport

# Type Alias: TevmTransport\<TName\>

> **TevmTransport**\<`TName`\> = \<`TChain`\>(`{ chain, pollingInterval, retryCount, timeout, }`) => `object`

A type representing a custom TEVM Transport for viem.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TName` *extends* `string` | `string` | The name of the transport. |

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TChain` *extends* `Chain` \| `undefined` | `Chain` | The blockchain configuration. |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `{ chain, pollingInterval, retryCount, timeout, }` | \{ `chain?`: `TChain`; `pollingInterval?`: `ClientConfig`\[`"pollingInterval"`\]; `retryCount?`: `TransportConfig`\[`"retryCount"`\]; `timeout?`: `TransportConfig`\[`"timeout"`\]; \} |
| `{ chain, pollingInterval, retryCount, timeout, }.chain?` | `TChain` |
| `{ chain, pollingInterval, retryCount, timeout, }.pollingInterval?` | `ClientConfig`\[`"pollingInterval"`\] |
| `{ chain, pollingInterval, retryCount, timeout, }.retryCount?` | `TransportConfig`\[`"retryCount"`\] |
| `{ chain, pollingInterval, retryCount, timeout, }.timeout?` | `TransportConfig`\[`"timeout"`\] |

## Returns

`object`

The configured TEVM transport.

### config

> **config**: `TransportConfig`\<`TName`\>

### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)

### value

> **value**: `object`

#### Type Declaration

#### value.tevm

> **tevm**: [`TevmNode`](TevmNode.md) & `object`

##### Type Declaration

###### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / createClient

# Function: createClient()

> **createClient**\<`transport`, `chain`, `accountOrAddress`, `rpcSchema`\>(`parameters`): `object`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `transport` *extends* `Transport` | - |
| `chain` *extends* `Chain` \| `undefined` | `undefined` |
| `accountOrAddress` *extends* `` `0x${string}` `` \| [`Account`](../type-aliases/Account.md) \| `undefined` | `undefined` |
| `rpcSchema` *extends* `RpcSchema` \| `undefined` | `undefined` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `ClientConfig`\<`transport`, `chain`, `accountOrAddress`, `rpcSchema`\> |

## Returns

### account

> **account**: `accountOrAddress` *extends* `` `0x${string}` `` ? `object` : `accountOrAddress`

The Account of the Client.

### batch?

> `optional` **batch?**: `object`

Flags for batch settings.

#### Type Declaration

#### batch.multicall?

> `optional` **multicall?**: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}

Toggle to enable `eth_call` multicall aggregation.

##### Union Members

`boolean`

***

###### Type Literal

\{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}

###### batchSize?

> `optional` **batchSize?**: `number`

The maximum size (in bytes) for each calldata chunk.

###### Default

```ts
1_024
```

###### deployless?

> `optional` **deployless?**: `boolean`

Enable deployless multicall.

###### wait?

> `optional` **wait?**: `number`

The maximum number of milliseconds to wait before sending a batch.

###### Default

```ts
0
```

### cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

### ccipRead?

> `optional` **ccipRead?**: `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

#### Union Members

`false`

***

##### Type Literal

\{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

###### request?

> `optional` **request?**: (`parameters`) => `Promise`\<`` `0x${string}` ``\>

A function that will be called to make the offchain CCIP lookup request.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `CcipRequestParameters` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

###### See

https://eips.ethereum.org/EIPS/eip-3668#client-lookup-protocol

### chain

> **chain**: `chain`

Chain for the client.

### dataSuffix?

> `optional` **dataSuffix?**: `DataSuffix`

Data suffix to append to transaction data.

### experimental\_blockTag?

> `optional` **experimental\_blockTag?**: [`BlockTag`](../type-aliases/BlockTag.md)

Default block tag to use for RPC requests.

### extend

> **extend**: \<`client`\>(`fn`) => `Client`\<`transport`, `chain`, `accountOrAddress` *extends* `` `0x${string}` `` ? `object` : `accountOrAddress`, `rpcSchema`, \{ \[K in string \| number \| symbol\]: client\[K\] \}\>

#### Type Parameters

| Type Parameter |
| ------ |
| `client` *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<`transport`, `chain`, `accountOrAddress` *extends* `` `0x${string}` `` ? `object` : `accountOrAddress`\>\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`client`) => `client` |

#### Returns

`Client`\<`transport`, `chain`, `accountOrAddress` *extends* `` `0x${string}` `` ? `object` : `accountOrAddress`, `rpcSchema`, \{ \[K in string \| number \| symbol\]: client\[K\] \}\>

### key

> **key**: `string`

A key for the client.

### name

> **name**: `string`

A name for the client.

### pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

### request

> **request**: `EIP1193RequestFn`\<`rpcSchema` *extends* `undefined` ? \[\{ `Method`: `"web3_clientVersion"`; `Parameters?`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters?`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"net_version"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}\] : `rpcSchema`\>

Request function wrapped with friendly error handling

### transport

> **transport**: `ReturnType`\<`transport`\>\[`"config"`\] & `ReturnType`\<`transport`\>\[`"value"`\]

The RPC transport

### type

> **type**: `string`

The type of client.

### uid

> **uid**: `string`

A unique ID for the client.

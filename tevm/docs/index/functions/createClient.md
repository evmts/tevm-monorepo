[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / createClient

# Function: createClient()

> **createClient**\<`transport`, `chain`, `accountOrAddress`, `rpcSchema`\>(`parameters`): `object`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.4/node\_modules/viem/\_types/clients/createClient.d.ts:99

## Type Parameters

### transport

`transport` *extends* `Transport`

### chain

`chain` *extends* `undefined` \| `Chain` = `undefined`

### accountOrAddress

`accountOrAddress` *extends* `undefined` \| `` `0x${string}` `` \| [`Account`](../type-aliases/Account.md) = `undefined`

### rpcSchema

`rpcSchema` *extends* `undefined` \| `RpcSchema` = `undefined`

## Parameters

### parameters

`ClientConfig`\<`transport`, `chain`, `accountOrAddress`, `rpcSchema`\>

## Returns

### account

> **account**: `accountOrAddress` *extends* `` `0x${string}` `` ? `object` : `accountOrAddress`

The Account of the Client.

### batch?

> `optional` **batch**: `object`

Flags for batch settings.

#### batch.multicall?

> `optional` **multicall**: `boolean` \| \{ `batchSize?`: `number`; `wait?`: `number`; \}

Toggle to enable `eth_call` multicall aggregation.

##### Type declaration

`boolean`

\{ `batchSize?`: `number`; `wait?`: `number`; \}

### cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

### ccipRead?

> `optional` **ccipRead**: `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

#### Type declaration

`false`

\{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

### chain

> **chain**: `chain`

Chain for the client.

### extend()

> **extend**: \<`client`\>(`fn`) => `Client`\<`transport`, `chain`, `accountOrAddress` *extends* `` `0x${string}` `` ? `object` : `accountOrAddress`, `rpcSchema`, \{ \[K in string \| number \| symbol\]: client\[K\] \}\>

#### Type Parameters

##### client

`client` *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<`transport`, `chain`, `accountOrAddress` *extends* `` `0x${string}` `` ? `object` : `accountOrAddress`\>\>

#### Parameters

##### fn

(`client`) => `client`

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

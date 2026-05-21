[**@tevm/txpool**](../README.md)

***

[@tevm/txpool](../globals.md) / TxPool

# Class: TxPool

Defined in: txpool.d.ts:43

## Constructors

### Constructor

> **new TxPool**(`__namedParameters`): `TxPool`

Defined in: txpool.d.ts:60

#### Parameters

##### \_\_namedParameters

`TxPoolOptions`

#### Returns

`TxPool`

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number`

Defined in: txpool.d.ts:57

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number`

Defined in: txpool.d.ts:59

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

Defined in: txpool.d.ts:51

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number`

Defined in: txpool.d.ts:58

***

### running

> **running**: `boolean`

Defined in: txpool.d.ts:48

***

### txsByHash

> **txsByHash**: `Map`\<`string`, `TxPoolTransaction`\>

Defined in: txpool.d.ts:53

***

### txsByNonce

> **txsByNonce**: `Map`\<`string`, `Map`\<`bigint`, `TxPoolTransaction`\>\>

Defined in: txpool.d.ts:54

***

### txsInNonceOrder

> **txsInNonceOrder**: `Map`\<`string`, `TxPoolTransaction`[]\>

Defined in: txpool.d.ts:52

***

### txsInPool

> **txsInPool**: `number`

Defined in: txpool.d.ts:55

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: txpool.d.ts:91

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature?`, `skipBalance?`): `Promise`\<`TxPoolAddResult`\>

Defined in: txpool.d.ts:67

#### Parameters

##### tx

`TxPoolTransaction`

##### requireSignature?

`boolean`

##### skipBalance?

`boolean`

#### Returns

`Promise`\<`TxPoolAddResult`\>

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<`TxPoolAddResult`\>

Defined in: txpool.d.ts:66

#### Parameters

##### tx

`TxPoolTransaction`

#### Returns

`Promise`\<`TxPoolAddResult`\>

***

### cleanup()

> **cleanup**(): `void`

Defined in: txpool.d.ts:72

#### Returns

`void`

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: txpool.d.ts:89

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `void`

Defined in: txpool.d.ts:88

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): `TxPool`

Defined in: txpool.d.ts:61

#### Parameters

##### opt

`TxPoolOptions`

#### Returns

`TxPool`

***

### getByHash()

#### Call Signature

> **getByHash**(`txHashes`): `TxPoolTransaction` \| `null`

Defined in: txpool.d.ts:68

##### Parameters

###### txHashes

`string`

##### Returns

`TxPoolTransaction` \| `null`

#### Call Signature

> **getByHash**(`txHashes`): `TxPoolTransaction`[]

Defined in: txpool.d.ts:69

##### Parameters

###### txHashes

readonly `Uint8Array`\<`ArrayBufferLike`\>[]

##### Returns

`TxPoolTransaction`[]

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

Defined in: txpool.d.ts:75

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<`TxPoolTransaction`[]\>

Defined in: txpool.d.ts:76

#### Returns

`Promise`\<`TxPoolTransaction`[]\>

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

Defined in: txpool.d.ts:77

#### Parameters

##### txHash

`string`

#### Returns

`Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

***

### logStats()

> **logStats**(): `void`

Defined in: txpool.d.ts:90

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): () => `void`

Defined in: txpool.d.ts:79

#### Parameters

##### event

`"txadded"` \| `"txremoved"`

##### callback

(`hash`) => `void`

#### Returns

() => `void`

***

### onBlockAdded()

> **onBlockAdded**(`block`): `Promise`\<`void`\>

Defined in: txpool.d.ts:81

#### Parameters

##### block

`TxPoolBlock`

#### Returns

`Promise`\<`void`\>

***

### onChainReorganization()

> **onChainReorganization**(`removedBlocks`, `addedBlocks`): `Promise`\<`void`\>

Defined in: txpool.d.ts:82

#### Parameters

##### removedBlocks

`TxPoolBlock`[]

##### addedBlocks

`TxPoolBlock`[]

#### Returns

`Promise`\<`void`\>

***

### open()

> **open**(): `boolean`

Defined in: txpool.d.ts:62

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: txpool.d.ts:70

#### Parameters

##### txHash

`string`

#### Returns

`void`

***

### removeNewBlockTxs()

> **removeNewBlockTxs**(`newBlocks`): `void`

Defined in: txpool.d.ts:71

#### Parameters

##### newBlocks

`TxPoolBlock`[]

#### Returns

`void`

***

### start()

> **start**(): `boolean`

Defined in: txpool.d.ts:63

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: txpool.d.ts:87

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`__namedParameters?`): `Promise`\<`TxPoolTransaction`[]\>

Defined in: txpool.d.ts:83

#### Parameters

##### \_\_namedParameters?

###### allowedBlobs?

`number`

###### baseFee?

`bigint`

#### Returns

`Promise`\<`TxPoolTransaction`[]\>

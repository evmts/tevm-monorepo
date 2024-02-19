[@tevm/ethers](../README.md) / [Exports](../modules.md) / TevmProvider

# Class: TevmProvider

An [ethers JsonRpcApiProvider](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProvider) using a tevm MemoryClient as it's backend

## TevmProvider

The TevmProvider class is an instance of an ethers provider using Tevm as it's backend. The `createMemoryProvider` method can be used to create an in memory instance of tevm using a [memoryClient](../clients/) as it's backend.

**`Example`**

```typescript
import {TevmProvider} from '@tevm/ethers'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    url: 'https://mainnet.optimism.io',
  },
})
```

## Using with an http client

The constructor takes any instance of tevm including the `httpClient`.

**`Example`**

```typescript
import {createHttpClient} from '@tevm/http-client'
const provider = new TevmProvider(createHttpClient({url: 'https://localhost:8080'}))
```

## Ethers provider support

You can use all the normal ethers apis to interact with tevm.

**`Example`**

```typescript
const provider = await TevmProvider.createMemoryProvider({
  fork: {
    url: 'https://mainnet.optimism.io',
  },
})

console.log(
  await provider.getBlockNumber()
) // 10
```

## Tevm actions support

The entire [tevm api](../clients/) exists on the `tevm` property. For example the `tevm.script` method can be used to run an arbitrary script.

**`Example`**

```typescript
import {TevmProvider} from '@tevm/ethers'
import {createScript} from 'tevm'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    url: 'https://mainnet.optimism.io',
  },
})

const addContract = createScript({
  name: 'AddContract',
  humanReadableAbi: [
    'function add(uint256 a, uint256 b) public pure returns (uint256)',
  ],
  deployedBytecode: '0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
  bytecode: '0x608060405234801561000f575f80fd5b506101a58061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
} as const)

const result = await provider.tevm.script(addContract.read.add(390n, 30n))

console.log(result)
//  createdAddresses: new Set(),
//  data: 420n,
//  executionGasUsed: 927n,
//  gas: 16776288n,
//  logs: [],
//  rawData: '0x00000000000000000000000000000000000000000000000000000000000001a4',
//  selfdestruct: new Set(),
```

## Tevm JSON-RPC support

An ethers TevmProvider supports the tevm [JSON-RPC methods](../json-rpc). For example you can use `tevm_account` to set account

**`Example`**

```typescript
await provider.send('tevm_setAccount', {
  address: `0x${'69'.repeat(20)}`,
  nonce: toHex(1n),
  balance: toHex(420n),
}),
console.log(await provider.send('tevm_getAccount', {
  address: `0x${'69'.repeat(20)}`,
}))
//	address: '0x6969696969696969696969696969696969696969',
//	balance: toHex(420n),
//	deployedBytecode: '0x00',
//	nonce: toHex(1n),
//	storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
```

**`See`**

[Tevm Clients Docs](https://tevm.sh/learn/clients/)

## Hierarchy

- `JsonRpcApiProvider`

  ↳ **`TevmProvider`**

## Table of contents

### Constructors

- [constructor](TevmProvider.md#constructor)

### Properties

- [#private](TevmProvider.md##private)
- [#private](TevmProvider.md##private-1)
- [tevm](TevmProvider.md#tevm)

### Accessors

- [\_network](TevmProvider.md#_network)
- [destroyed](TevmProvider.md#destroyed)
- [disableCcipRead](TevmProvider.md#disableccipread)
- [paused](TevmProvider.md#paused)
- [plugins](TevmProvider.md#plugins)
- [pollingInterval](TevmProvider.md#pollinginterval)
- [provider](TevmProvider.md#provider)
- [ready](TevmProvider.md#ready)

### Methods

- [\_clearTimeout](TevmProvider.md#_cleartimeout)
- [\_detectNetwork](TevmProvider.md#_detectnetwork)
- [\_forEachSubscriber](TevmProvider.md#_foreachsubscriber)
- [\_getAddress](TevmProvider.md#_getaddress)
- [\_getBlockTag](TevmProvider.md#_getblocktag)
- [\_getFilter](TevmProvider.md#_getfilter)
- [\_getOption](TevmProvider.md#_getoption)
- [\_getProvider](TevmProvider.md#_getprovider)
- [\_getSubscriber](TevmProvider.md#_getsubscriber)
- [\_getTransactionRequest](TevmProvider.md#_gettransactionrequest)
- [\_perform](TevmProvider.md#_perform)
- [\_recoverSubscriber](TevmProvider.md#_recoversubscriber)
- [\_send](TevmProvider.md#_send)
- [\_setTimeout](TevmProvider.md#_settimeout)
- [\_start](TevmProvider.md#_start)
- [\_waitUntilReady](TevmProvider.md#_waituntilready)
- [\_wrapBlock](TevmProvider.md#_wrapblock)
- [\_wrapLog](TevmProvider.md#_wraplog)
- [\_wrapTransactionReceipt](TevmProvider.md#_wraptransactionreceipt)
- [\_wrapTransactionResponse](TevmProvider.md#_wraptransactionresponse)
- [addListener](TevmProvider.md#addlistener)
- [attachPlugin](TevmProvider.md#attachplugin)
- [broadcastTransaction](TevmProvider.md#broadcasttransaction)
- [call](TevmProvider.md#call)
- [ccipReadFetch](TevmProvider.md#ccipreadfetch)
- [destroy](TevmProvider.md#destroy)
- [emit](TevmProvider.md#emit)
- [estimateGas](TevmProvider.md#estimategas)
- [getAvatar](TevmProvider.md#getavatar)
- [getBalance](TevmProvider.md#getbalance)
- [getBlock](TevmProvider.md#getblock)
- [getBlockNumber](TevmProvider.md#getblocknumber)
- [getCode](TevmProvider.md#getcode)
- [getFeeData](TevmProvider.md#getfeedata)
- [getLogs](TevmProvider.md#getlogs)
- [getNetwork](TevmProvider.md#getnetwork)
- [getPlugin](TevmProvider.md#getplugin)
- [getResolver](TevmProvider.md#getresolver)
- [getRpcError](TevmProvider.md#getrpcerror)
- [getRpcRequest](TevmProvider.md#getrpcrequest)
- [getRpcTransaction](TevmProvider.md#getrpctransaction)
- [getSigner](TevmProvider.md#getsigner)
- [getStorage](TevmProvider.md#getstorage)
- [getTransaction](TevmProvider.md#gettransaction)
- [getTransactionCount](TevmProvider.md#gettransactioncount)
- [getTransactionReceipt](TevmProvider.md#gettransactionreceipt)
- [getTransactionResult](TevmProvider.md#gettransactionresult)
- [listAccounts](TevmProvider.md#listaccounts)
- [listenerCount](TevmProvider.md#listenercount)
- [listeners](TevmProvider.md#listeners)
- [lookupAddress](TevmProvider.md#lookupaddress)
- [off](TevmProvider.md#off)
- [on](TevmProvider.md#on)
- [once](TevmProvider.md#once)
- [pause](TevmProvider.md#pause)
- [removeAllListeners](TevmProvider.md#removealllisteners)
- [removeListener](TevmProvider.md#removelistener)
- [resolveName](TevmProvider.md#resolvename)
- [resume](TevmProvider.md#resume)
- [send](TevmProvider.md#send)
- [waitForBlock](TevmProvider.md#waitforblock)
- [waitForTransaction](TevmProvider.md#waitfortransaction)
- [createMemoryProvider](TevmProvider.md#creatememoryprovider)

## Constructors

### constructor

• **new TevmProvider**(`tevm`): [`TevmProvider`](TevmProvider.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tevm` | `TevmClient` | An instance of the Tevm interface. |

#### Returns

[`TevmProvider`](TevmProvider.md)

#### Overrides

JsonRpcApiProvider.constructor

#### Defined in

[extensions/ethers/src/TevmProvider.js:172](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L172)

## Properties

### #private

• `Private` **#private**: `any`

#### Inherited from

JsonRpcApiProvider.#private

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:212

___

### #private

• `Private` **#private**: `any`

#### Inherited from

JsonRpcApiProvider.#private

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:253

___

### tevm

• **tevm**: `TevmClient`

An instance of the TevmClient interface.

**`See`**

[Tevm Client reference](https://tevm.sh/reference/tevm/client-types/type-aliases/tevmclient/)

**`Example`**

```typescript
import {TevmProvider} from '@tevm/ethers'
import {createScript} from 'tevm'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    url: 'https://mainnet.optimism.io',
  },
})

const addContract = createScript({
  name: 'AddContract',
  humanReadableAbi: [
    'function add(uint256 a, uint256 b) public pure returns (uint256)',
  ],
  deployedBytecode: '0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
  bytecode: '0x608060405234801561000f575f80fd5b506101a58061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
} as const)

const result = await provider.tevm.script(addContract.read.add(390n, 30n))

console.log(result)
//  createdAddresses: new Set(),
//  data: 420n,
//  executionGasUsed: 927n,
//  gas: 16776288n,
//  logs: [],
//  rawData: '0x00000000000000000000000000000000000000000000000000000000000001a4',
//  selfdestruct: new Set(),
```

#### Defined in

[extensions/ethers/src/TevmProvider.js:167](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L167)

## Accessors

### \_network

• `get` **_network**(): `Network`

Gets the [[Network]] this provider has committed to. On each call, the network
 is detected, and if it has changed, the call will reject.

#### Returns

`Network`

#### Inherited from

JsonRpcApiProvider.\_network

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:224

___

### destroyed

• `get` **destroyed**(): `boolean`

If this provider has been destroyed using the [[destroy]] method.

 Once destroyed, all resources are reclaimed, internal event loops
 and timers are cleaned up and no further requests may be sent to
 the provider.

#### Returns

`boolean`

#### Inherited from

JsonRpcApiProvider.destroyed

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:419

___

### disableCcipRead

• `get` **disableCcipRead**(): `boolean`

Prevent any CCIP-read operation, regardless of whether requested
 in a [[call]] using ``enableCcipRead``.

#### Returns

`boolean`

#### Inherited from

JsonRpcApiProvider.disableCcipRead

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:282

• `set` **disableCcipRead**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.disableCcipRead

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:283

___

### paused

• `get` **paused**(): `boolean`

Whether the provider is currently paused.

 A paused provider will not emit any events, and generally should
 not make any requests to the network, but that is up to sub-classes
 to manage.

 Setting ``paused = true`` is identical to calling ``.pause(false)``,
 which will buffer any events that occur while paused until the
 provider is unpaused.

#### Returns

`boolean`

#### Inherited from

JsonRpcApiProvider.paused

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:438

• `set` **paused**(`pause`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pause` | `boolean` |

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.paused

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:439

___

### plugins

• `get` **plugins**(): `AbstractProviderPlugin`[]

Returns all the registered plug-ins.

#### Returns

`AbstractProviderPlugin`[]

#### Inherited from

JsonRpcApiProvider.plugins

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:269

___

### pollingInterval

• `get` **pollingInterval**(): `number`

#### Returns

`number`

#### Inherited from

JsonRpcApiProvider.pollingInterval

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:260

___

### provider

• `get` **provider**(): `this`

Returns ``this``, to allow an **AbstractProvider** to implement
 the [[ContractRunner]] interface.

#### Returns

`this`

#### Inherited from

JsonRpcApiProvider.provider

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:265

___

### ready

• `get` **ready**(): `boolean`

Returns true only if the [[_start]] has been called.

#### Returns

`boolean`

#### Inherited from

JsonRpcApiProvider.ready

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:270

## Methods

### \_clearTimeout

▸ **_clearTimeout**(`timerId`): `void`

Clear a timer created using the [[_setTimeout]] method.

#### Parameters

| Name | Type |
| :------ | :------ |
| `timerId` | `number` |

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.\_clearTimeout

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:374

___

### \_detectNetwork

▸ **_detectNetwork**(): `Promise`\<`Network`\>

Sub-classes may override this; it detects the *actual* network that
 we are **currently** connected to.

 Keep in mind that [[send]] may only be used once [[ready]], otherwise the
 _send primitive must be used instead.

#### Returns

`Promise`\<`Network`\>

#### Inherited from

JsonRpcApiProvider.\_detectNetwork

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:245

___

### \_forEachSubscriber

▸ **_forEachSubscriber**(`func`): `void`

Perform %%func%% on each subscriber.

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | (`s`: `Subscriber`) => `void` |

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.\_forEachSubscriber

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:387

___

### \_getAddress

▸ **_getAddress**(`address`): `string` \| `Promise`\<`string`\>

Returns or resolves to the address for %%address%%, resolving ENS
 names and [[Addressable]] objects and returning if already an
 address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressLike` |

#### Returns

`string` \| `Promise`\<`string`\>

#### Inherited from

JsonRpcApiProvider.\_getAddress

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:332

___

### \_getBlockTag

▸ **_getBlockTag**(`blockTag?`): `string` \| `Promise`\<`string`\>

Returns or resolves to a valid block tag for %%blockTag%%, resolving
 negative values and returning if already a valid block tag.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockTag?` | `BlockTag` |

#### Returns

`string` \| `Promise`\<`string`\>

#### Inherited from

JsonRpcApiProvider.\_getBlockTag

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:337

___

### \_getFilter

▸ **_getFilter**(`filter`): `PerformActionFilter` \| `Promise`\<`PerformActionFilter`\>

Returns or resolves to a filter for %%filter%%, resolving any ENS
 names or [[Addressable]] object and returning if already a valid
 filter.

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter` | `Filter` \| `FilterByBlockHash` |

#### Returns

`PerformActionFilter` \| `Promise`\<`PerformActionFilter`\>

#### Inherited from

JsonRpcApiProvider.\_getFilter

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:343

___

### \_getOption

▸ **_getOption**\<`K`\>(`key`): `JsonRpcApiProviderOptions`[`K`]

Returns the value associated with the option %%key%%.

 Sub-classes can use this to inquire about configuration options.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `JsonRpcApiProviderOptions` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`JsonRpcApiProviderOptions`[`K`]

#### Inherited from

JsonRpcApiProvider.\_getOption

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:219

___

### \_getProvider

▸ **_getProvider**(`chainId`): `AbstractProvider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `number` |

#### Returns

`AbstractProvider`

#### Inherited from

JsonRpcApiProvider.\_getProvider

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:364

___

### \_getSubscriber

▸ **_getSubscriber**(`sub`): `Subscriber`

Return a Subscriber that will manage the %%sub%%.

 Sub-classes may override this to modify the behavior of
 subscription management.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sub` | `Subscription` |

#### Returns

`Subscriber`

#### Inherited from

JsonRpcApiProvider.\_getSubscriber

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:266

___

### \_getTransactionRequest

▸ **_getTransactionRequest**(`_request`): `PerformActionTransaction` \| `Promise`\<`PerformActionTransaction`\>

Returns or resovles to a transaction for %%request%%, resolving
 any ENS names or [[Addressable]] and returning if already a valid
 transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_request` | `TransactionRequest` |

#### Returns

`PerformActionTransaction` \| `Promise`\<`PerformActionTransaction`\>

#### Inherited from

JsonRpcApiProvider.\_getTransactionRequest

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:349

___

### \_perform

▸ **_perform**(`req`): `Promise`\<`any`\>

Resolves to the non-normalized value by performing %%req%%.

 Sub-classes may override this to modify behavior of actions,
 and should generally call ``super._perform`` as a fallback.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `PerformActionRequest` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

JsonRpcApiProvider.\_perform

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:237

___

### \_recoverSubscriber

▸ **_recoverSubscriber**(`oldSub`, `newSub`): `void`

If a [[Subscriber]] fails and needs to replace itself, this
 method may be used.

 For example, this is used for providers when using the
 ``eth_getFilterChanges`` method, which can return null if state
 filters are not supported by the backend, allowing the Subscriber
 to swap in a [[PollingEventSubscriber]].

#### Parameters

| Name | Type |
| :------ | :------ |
| `oldSub` | `Subscriber` |
| `newSub` | `Subscriber` |

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.\_recoverSubscriber

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:402

___

### \_send

▸ **_send**(`payload`): `Promise`\<(`JsonRpcResult` \| `JsonRpcError`)[]\>

Sends a JSON-RPC %%payload%% (or a batch) to the underlying tevm instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `JsonRpcPayload` \| `JsonRpcPayload`[] |

#### Returns

`Promise`\<(`JsonRpcResult` \| `JsonRpcError`)[]\>

#### Overrides

JsonRpcApiProvider.\_send

#### Defined in

[extensions/ethers/src/TevmProvider.js:186](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L186)

___

### \_setTimeout

▸ **_setTimeout**(`_func`, `timeout?`): `number`

Create a timer that will execute %%func%% after at least %%timeout%%
 (in ms). If %%timeout%% is unspecified, then %%func%% will execute
 in the next event loop.

 [Pausing](AbstractProvider-paused) the provider will pause any
 associated timers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_func` | () => `void` |
| `timeout?` | `number` |

#### Returns

`number`

#### Inherited from

JsonRpcApiProvider.\_setTimeout

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:383

___

### \_start

▸ **_start**(): `void`

Sub-classes **MUST** call this. Until [[_start]] has been called, no calls
 will be passed to [[_send]] from [[send]]. If it is overridden, then
 ``super._start()`` **MUST** be called.

 Calling it multiple times is safe and has no effect.

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.\_start

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:253

___

### \_waitUntilReady

▸ **_waitUntilReady**(): `Promise`\<`void`\>

Resolves once the [[_start]] has been called. This can be used in
 sub-classes to defer sending data until the connection has been
 established.

#### Returns

`Promise`\<`void`\>

#### Inherited from

JsonRpcApiProvider.\_waitUntilReady

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:259

___

### \_wrapBlock

▸ **_wrapBlock**(`value`, `network`): `Block`

Provides the opportunity for a sub-class to wrap a block before
 returning it, to add additional properties or an alternate
 sub-class of [[Block]].

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `BlockParams` |
| `network` | `Network` |

#### Returns

`Block`

#### Inherited from

JsonRpcApiProvider.\_wrapBlock

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:293

___

### \_wrapLog

▸ **_wrapLog**(`value`, `network`): `Log`

Provides the opportunity for a sub-class to wrap a log before
 returning it, to add additional properties or an alternate
 sub-class of [[Log]].

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `LogParams` |
| `network` | `Network` |

#### Returns

`Log`

#### Inherited from

JsonRpcApiProvider.\_wrapLog

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:299

___

### \_wrapTransactionReceipt

▸ **_wrapTransactionReceipt**(`value`, `network`): `TransactionReceipt`

Provides the opportunity for a sub-class to wrap a transaction
 receipt before returning it, to add additional properties or an
 alternate sub-class of [[TransactionReceipt]].

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `TransactionReceiptParams` |
| `network` | `Network` |

#### Returns

`TransactionReceipt`

#### Inherited from

JsonRpcApiProvider.\_wrapTransactionReceipt

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:305

___

### \_wrapTransactionResponse

▸ **_wrapTransactionResponse**(`tx`, `network`): `TransactionResponse`

Provides the opportunity for a sub-class to wrap a transaction
 response before returning it, to add additional properties or an
 alternate sub-class of [[TransactionResponse]].

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `TransactionResponseParams` |
| `network` | `Network` |

#### Returns

`TransactionResponse`

#### Inherited from

JsonRpcApiProvider.\_wrapTransactionResponse

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:311

___

### addListener

▸ **addListener**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `ProviderEvent` |
| `listener` | `Listener` |

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

JsonRpcApiProvider.addListener

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:410

___

### attachPlugin

▸ **attachPlugin**(`plugin`): `this`

Attach a new plug-in.

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | `AbstractProviderPlugin` |

#### Returns

`this`

#### Inherited from

JsonRpcApiProvider.attachPlugin

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:273

___

### broadcastTransaction

▸ **broadcastTransaction**(`signedTx`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTx` | `string` |

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

JsonRpcApiProvider.broadcastTransaction

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:358

___

### call

▸ **call**(`_tx`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tx` | `TransactionRequest` |

#### Returns

`Promise`\<`string`\>

#### Inherited from

JsonRpcApiProvider.call

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:353

___

### ccipReadFetch

▸ **ccipReadFetch**(`tx`, `calldata`, `urls`): `Promise`\<``null`` \| `string`\>

Resolves to the data for executing the CCIP-read operations.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `PerformActionTransaction` |
| `calldata` | `string` |
| `urls` | `string`[] |

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

JsonRpcApiProvider.ccipReadFetch

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:287

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.destroy

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:320

___

### emit

▸ **emit**(`event`, `...args`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `ProviderEvent` |
| `...args` | `any`[] |

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

JsonRpcApiProvider.emit

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:405

___

### estimateGas

▸ **estimateGas**(`_tx`): `Promise`\<`bigint`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tx` | `TransactionRequest` |

#### Returns

`Promise`\<`bigint`\>

#### Inherited from

JsonRpcApiProvider.estimateGas

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:352

___

### getAvatar

▸ **getAvatar**(`name`): `Promise`\<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

JsonRpcApiProvider.getAvatar

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:366

___

### getBalance

▸ **getBalance**(`address`, `blockTag?`): `Promise`\<`bigint`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressLike` |
| `blockTag?` | `BlockTag` |

#### Returns

`Promise`\<`bigint`\>

#### Inherited from

JsonRpcApiProvider.getBalance

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:354

___

### getBlock

▸ **getBlock**(`block`, `prefetchTxs?`): `Promise`\<``null`` \| `Block`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `BlockTag` |
| `prefetchTxs?` | `boolean` |

#### Returns

`Promise`\<``null`` \| `Block`\>

#### Inherited from

JsonRpcApiProvider.getBlock

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:359

___

### getBlockNumber

▸ **getBlockNumber**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Inherited from

JsonRpcApiProvider.getBlockNumber

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:326

___

### getCode

▸ **getCode**(`address`, `blockTag?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressLike` |
| `blockTag?` | `BlockTag` |

#### Returns

`Promise`\<`string`\>

#### Inherited from

JsonRpcApiProvider.getCode

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:356

___

### getFeeData

▸ **getFeeData**(): `Promise`\<`FeeData`\>

#### Returns

`Promise`\<`FeeData`\>

#### Inherited from

JsonRpcApiProvider.getFeeData

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:351

___

### getLogs

▸ **getLogs**(`_filter`): `Promise`\<`Log`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_filter` | `Filter` \| `FilterByBlockHash` |

#### Returns

`Promise`\<`Log`[]\>

#### Inherited from

JsonRpcApiProvider.getLogs

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:363

___

### getNetwork

▸ **getNetwork**(): `Promise`\<`Network`\>

#### Returns

`Promise`\<`Network`\>

#### Inherited from

JsonRpcApiProvider.getNetwork

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:350

___

### getPlugin

▸ **getPlugin**\<`T`\>(`name`): ``null`` \| `T`

Get a plugin by name.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AbstractProviderPlugin` = `AbstractProviderPlugin` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

``null`` \| `T`

#### Inherited from

JsonRpcApiProvider.getPlugin

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:277

___

### getResolver

▸ **getResolver**(`name`): `Promise`\<``null`` \| `EnsResolver`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<``null`` \| `EnsResolver`\>

#### Inherited from

JsonRpcApiProvider.getResolver

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:365

___

### getRpcError

▸ **getRpcError**(`payload`, `_error`): `Error`

Returns an ethers-style Error for the given JSON-RPC error
 %%payload%%, coalescing the various strings and error shapes
 that different nodes return, coercing them into a machine-readable
 standardized error.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `JsonRpcPayload` |
| `_error` | `JsonRpcError` |

#### Returns

`Error`

#### Inherited from

JsonRpcApiProvider.getRpcError

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:291

___

### getRpcRequest

▸ **getRpcRequest**(`req`): ``null`` \| \{ `args`: `any`[] ; `method`: `string`  }

Returns the request method and arguments required to perform
 %%req%%.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `PerformActionRequest` |

#### Returns

``null`` \| \{ `args`: `any`[] ; `method`: `string`  }

#### Inherited from

JsonRpcApiProvider.getRpcRequest

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:281

___

### getRpcTransaction

▸ **getRpcTransaction**(`tx`): `JsonRpcTransactionRequest`

Returns %%tx%% as a normalized JSON-RPC transaction request,
 which has all values hexlified and any numeric values converted
 to Quantity values.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `TransactionRequest` |

#### Returns

`JsonRpcTransactionRequest`

#### Inherited from

JsonRpcApiProvider.getRpcTransaction

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:276

___

### getSigner

▸ **getSigner**(`address?`): `Promise`\<`JsonRpcSigner`\>

Resolves to the [[Signer]] account for  %%address%% managed by
 the client.

 If the %%address%% is a number, it is used as an index in the
 the accounts from [[listAccounts]].

 This can only be used on clients which manage accounts (such as
 Geth with imported account or MetaMask).

 Throws if the account doesn't exist.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` \| `number` |

#### Returns

`Promise`\<`JsonRpcSigner`\>

#### Inherited from

JsonRpcApiProvider.getSigner

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:318

___

### getStorage

▸ **getStorage**(`address`, `_position`, `blockTag?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressLike` |
| `_position` | `BigNumberish` |
| `blockTag?` | `BlockTag` |

#### Returns

`Promise`\<`string`\>

#### Inherited from

JsonRpcApiProvider.getStorage

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:357

___

### getTransaction

▸ **getTransaction**(`hash`): `Promise`\<``null`` \| `TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

`Promise`\<``null`` \| `TransactionResponse`\>

#### Inherited from

JsonRpcApiProvider.getTransaction

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:360

___

### getTransactionCount

▸ **getTransactionCount**(`address`, `blockTag?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressLike` |
| `blockTag?` | `BlockTag` |

#### Returns

`Promise`\<`number`\>

#### Inherited from

JsonRpcApiProvider.getTransactionCount

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:355

___

### getTransactionReceipt

▸ **getTransactionReceipt**(`hash`): `Promise`\<``null`` \| `TransactionReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

`Promise`\<``null`` \| `TransactionReceipt`\>

#### Inherited from

JsonRpcApiProvider.getTransactionReceipt

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:361

___

### getTransactionResult

▸ **getTransactionResult**(`hash`): `Promise`\<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

JsonRpcApiProvider.getTransactionResult

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:362

___

### listAccounts

▸ **listAccounts**(): `Promise`\<`JsonRpcSigner`[]\>

#### Returns

`Promise`\<`JsonRpcSigner`[]\>

#### Inherited from

JsonRpcApiProvider.listAccounts

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:319

___

### listenerCount

▸ **listenerCount**(`event?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `ProviderEvent` |

#### Returns

`Promise`\<`number`\>

#### Inherited from

JsonRpcApiProvider.listenerCount

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:406

___

### listeners

▸ **listeners**(`event?`): `Promise`\<`Listener`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `ProviderEvent` |

#### Returns

`Promise`\<`Listener`[]\>

#### Inherited from

JsonRpcApiProvider.listeners

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:407

___

### lookupAddress

▸ **lookupAddress**(`address`): `Promise`\<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

JsonRpcApiProvider.lookupAddress

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:368

___

### off

▸ **off**(`event`, `listener?`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `ProviderEvent` |
| `listener?` | `Listener` |

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

JsonRpcApiProvider.off

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:408

___

### on

▸ **on**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `ProviderEvent` |
| `listener` | `Listener` |

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

JsonRpcApiProvider.on

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:403

___

### once

▸ **once**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `ProviderEvent` |
| `listener` | `Listener` |

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

JsonRpcApiProvider.once

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:404

___

### pause

▸ **pause**(`dropWhilePaused?`): `void`

Pause the provider. If %%dropWhilePaused%%, any events that occur
 while paused are dropped, otherwise all events will be emitted once
 the provider is unpaused.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropWhilePaused?` | `boolean` |

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.pause

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:445

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `ProviderEvent` |

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

JsonRpcApiProvider.removeAllListeners

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:409

___

### removeListener

▸ **removeListener**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `ProviderEvent` |
| `listener` | `Listener` |

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

JsonRpcApiProvider.removeListener

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:411

___

### resolveName

▸ **resolveName**(`name`): `Promise`\<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

JsonRpcApiProvider.resolveName

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:367

___

### resume

▸ **resume**(): `void`

Resume the provider.

#### Returns

`void`

#### Inherited from

JsonRpcApiProvider.resume

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:449

___

### send

▸ **send**(`method`, `params`): `Promise`\<`any`\>

Requests the %%method%% with %%params%% via the JSON-RPC protocol
 over the underlying channel. This can be used to call methods
 on the backend that do not have a high-level API within the Provider
 API.

 This method queues requests according to the batch constraints
 in the options, assigns the request a unique ID.

 **Do NOT override** this method in sub-classes; instead
 override [[_send]] or force the options values in the
 call to the constructor to modify this method's behavior.

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `params` | `any`[] \| `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<`any`\>

#### Inherited from

JsonRpcApiProvider.send

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:305

___

### waitForBlock

▸ **waitForBlock**(`blockTag?`): `Promise`\<`Block`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockTag?` | `BlockTag` |

#### Returns

`Promise`\<`Block`\>

#### Inherited from

JsonRpcApiProvider.waitForBlock

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:370

___

### waitForTransaction

▸ **waitForTransaction**(`hash`, `_confirms?`, `timeout?`): `Promise`\<``null`` \| `TransactionReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `string` |
| `_confirms?` | ``null`` \| `number` |
| `timeout?` | ``null`` \| `number` |

#### Returns

`Promise`\<``null`` \| `TransactionReceipt`\>

#### Inherited from

JsonRpcApiProvider.waitForTransaction

#### Defined in

node_modules/.pnpm/ethers@6.10.0/node_modules/ethers/lib.esm/providers/abstract-provider.d.ts:369

___

### createMemoryProvider

▸ **createMemoryProvider**(`options`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Creates a new TevmProvider instance with a TevmMemoryClient.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `BaseClientOptions` | Options to create a new TevmProvider. |

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

A new TevmProvider instance.

**`See`**

[Tevm Clients Docs](https://tevm.sh/learn/clients/)

**`Example`**

```ts
import { TevmProvider } from '@tevm/ethers'

const provider = await TevmProvider.createMemoryProvider()

const blockNumber = await provider.getBlockNumber()
```

#### Defined in

[extensions/ethers/src/TevmProvider.js:123](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L123)

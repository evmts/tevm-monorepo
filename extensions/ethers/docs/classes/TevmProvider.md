[**@tevm/ethers**](../README.md)

***

[@tevm/ethers](../globals.md) / TevmProvider

# Class: TevmProvider

Defined in: [extensions/ethers/src/TevmProvider.js:108](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L108)

An [ethers JsonRpcApiProvider](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProvider) using a tevm MemoryClient as it's backend

## TevmProvider

The TevmProvider class is an instance of an ethers provider using Tevm as it's backend. The `createMemoryProvider` method can be used to create an in memory instance of tevm using a [memoryClient](../clients/) as it's backend.

## Examples

```typescript
import {TevmProvider} from '@tevm/ethers'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
  },
})
```

## Using with an http client

The constructor takes any instance of tevm including the `httpClient`.

```typescript
import {createHttpClient} from '@tevm/http-client'
const provider = new TevmProvider(createHttpClient({url: 'https://localhost:8080'}))
```

## Ethers provider support

You can use all the normal ethers apis to interact with tevm.

```typescript
const provider = await TevmProvider.createMemoryProvider({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
  },
})

console.log(
  await provider.getBlockNumber()
) // 10
```

## Tevm actions support

The entire [tevm api](../clients/) exists on the `tevm` property. For example the `tevm.script` method can be used to run an arbitrary script.

```typescript
import {TevmProvider} from '@tevm/ethers'
import {createContract} from 'tevm'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
  },
})

const addContract = createContract({
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

## See

[Tevm Clients Docs](https://tevm.sh/learn/clients/)

## Extends

- `JsonRpcApiProvider`

## Constructors

### Constructor

> **new TevmProvider**(`client`): `TevmProvider`

Defined in: [extensions/ethers/src/TevmProvider.js:173](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L173)

#### Parameters

##### client

An instance of a tevm Memory client or TevmNode with TevmSendApi

`TevmSendApi` & `TevmActionsApi` | \{ `tevm`: `TevmSendApi` & `TevmActionsApi`; \}

#### Returns

`TevmProvider`

#### Overrides

`JsonRpcApiProvider.constructor`

## Properties

### tevm

> **tevm**: `TevmSendApi` & `TevmActionsApi`

Defined in: [extensions/ethers/src/TevmProvider.js:168](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L168)

An instance of the TevmClient interface.

#### See

[Tevm Client reference](https://tevm.sh/reference/tevm/client-types/type-aliases/tevmclient/)

#### Example

```typescript
import {TevmProvider} from '@tevm/ethers'
import {createContract} from 'tevm'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
  },
})

const addContract = createContract({
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

## Accessors

### \_network

#### Get Signature

> **get** **\_network**(): `Network`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:224

Gets the [[Network]] this provider has committed to. On each call, the network
 is detected, and if it has changed, the call will reject.

##### Returns

`Network`

#### Inherited from

`JsonRpcApiProvider._network`

***

### destroyed

#### Get Signature

> **get** **destroyed**(): `boolean`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:419

If this provider has been destroyed using the [[destroy]] method.

 Once destroyed, all resources are reclaimed, internal event loops
 and timers are cleaned up and no further requests may be sent to
 the provider.

##### Returns

`boolean`

#### Inherited from

`JsonRpcApiProvider.destroyed`

***

### disableCcipRead

#### Get Signature

> **get** **disableCcipRead**(): `boolean`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:282

Prevent any CCIP-read operation, regardless of whether requested
 in a [[call]] using ``enableCcipRead``.

##### Returns

`boolean`

#### Set Signature

> **set** **disableCcipRead**(`value`): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:283

##### Parameters

###### value

`boolean`

##### Returns

`void`

#### Inherited from

`JsonRpcApiProvider.disableCcipRead`

***

### paused

#### Get Signature

> **get** **paused**(): `boolean`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:438

Whether the provider is currently paused.

 A paused provider will not emit any events, and generally should
 not make any requests to the network, but that is up to sub-classes
 to manage.

 Setting ``paused = true`` is identical to calling ``.pause(false)``,
 which will buffer any events that occur while paused until the
 provider is unpaused.

##### Returns

`boolean`

#### Set Signature

> **set** **paused**(`pause`): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:439

##### Parameters

###### pause

`boolean`

##### Returns

`void`

#### Inherited from

`JsonRpcApiProvider.paused`

***

### plugins

#### Get Signature

> **get** **plugins**(): `AbstractProviderPlugin`[]

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:269

Returns all the registered plug-ins.

##### Returns

`AbstractProviderPlugin`[]

#### Inherited from

`JsonRpcApiProvider.plugins`

***

### pollingInterval

#### Get Signature

> **get** **pollingInterval**(): `number`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:260

##### Returns

`number`

#### Inherited from

`JsonRpcApiProvider.pollingInterval`

***

### provider

#### Get Signature

> **get** **provider**(): `this`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:265

Returns ``this``, to allow an **AbstractProvider** to implement
 the [[ContractRunner]] interface.

##### Returns

`this`

#### Inherited from

`JsonRpcApiProvider.provider`

***

### ready

#### Get Signature

> **get** **ready**(): `boolean`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:270

Returns true only if the [[_start]] has been called.

##### Returns

`boolean`

#### Inherited from

`JsonRpcApiProvider.ready`

## Methods

### \_clearTimeout()

> **\_clearTimeout**(`timerId`): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:374

Clear a timer created using the [[_setTimeout]] method.

#### Parameters

##### timerId

`number`

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider._clearTimeout`

***

### \_detectNetwork()

> **\_detectNetwork**(): `Promise`\<`Network`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:245

Sub-classes may override this; it detects the *actual* network that
 we are **currently** connected to.

 Keep in mind that [[send]] may only be used once [[ready]], otherwise the
 _send primitive must be used instead.

#### Returns

`Promise`\<`Network`\>

#### Inherited from

`JsonRpcApiProvider._detectNetwork`

***

### \_forEachSubscriber()

> **\_forEachSubscriber**(`func`): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:387

Perform %%func%% on each subscriber.

#### Parameters

##### func

(`s`) => `void`

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider._forEachSubscriber`

***

### \_getAddress()

> **\_getAddress**(`address`): `string` \| `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:332

Returns or resolves to the address for %%address%%, resolving ENS
 names and [[Addressable]] objects and returning if already an
 address.

#### Parameters

##### address

`AddressLike`

#### Returns

`string` \| `Promise`\<`string`\>

#### Inherited from

`JsonRpcApiProvider._getAddress`

***

### \_getBlockTag()

> **\_getBlockTag**(`blockTag?`): `string` \| `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:337

Returns or resolves to a valid block tag for %%blockTag%%, resolving
 negative values and returning if already a valid block tag.

#### Parameters

##### blockTag?

`BlockTag`

#### Returns

`string` \| `Promise`\<`string`\>

#### Inherited from

`JsonRpcApiProvider._getBlockTag`

***

### \_getFilter()

> **\_getFilter**(`filter`): `PerformActionFilter` \| `Promise`\<`PerformActionFilter`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:343

Returns or resolves to a filter for %%filter%%, resolving any ENS
 names or [[Addressable]] object and returning if already a valid
 filter.

#### Parameters

##### filter

`Filter` | `FilterByBlockHash`

#### Returns

`PerformActionFilter` \| `Promise`\<`PerformActionFilter`\>

#### Inherited from

`JsonRpcApiProvider._getFilter`

***

### \_getOption()

> **\_getOption**\<`K`\>(`key`): `JsonRpcApiProviderOptions`\[`K`\]

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:219

Returns the value associated with the option %%key%%.

 Sub-classes can use this to inquire about configuration options.

#### Type Parameters

##### K

`K` *extends* keyof `JsonRpcApiProviderOptions`

#### Parameters

##### key

`K`

#### Returns

`JsonRpcApiProviderOptions`\[`K`\]

#### Inherited from

`JsonRpcApiProvider._getOption`

***

### \_getProvider()

> **\_getProvider**(`chainId`): `AbstractProvider`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:364

#### Parameters

##### chainId

`number`

#### Returns

`AbstractProvider`

#### Inherited from

`JsonRpcApiProvider._getProvider`

***

### \_getSubscriber()

> **\_getSubscriber**(`sub`): `Subscriber`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:266

Return a Subscriber that will manage the %%sub%%.

 Sub-classes may override this to modify the behavior of
 subscription management.

#### Parameters

##### sub

`Subscription`

#### Returns

`Subscriber`

#### Inherited from

`JsonRpcApiProvider._getSubscriber`

***

### \_getTransactionRequest()

> **\_getTransactionRequest**(`_request`): `PerformActionTransaction` \| `Promise`\<`PerformActionTransaction`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:349

Returns or resolves to a transaction for %%request%%, resolving
 any ENS names or [[Addressable]] and returning if already a valid
 transaction.

#### Parameters

##### \_request

`TransactionRequest`

#### Returns

`PerformActionTransaction` \| `Promise`\<`PerformActionTransaction`\>

#### Inherited from

`JsonRpcApiProvider._getTransactionRequest`

***

### \_perform()

> **\_perform**(`req`): `Promise`\<`any`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:237

Resolves to the non-normalized value by performing %%req%%.

 Sub-classes may override this to modify behavior of actions,
 and should generally call ``super._perform`` as a fallback.

#### Parameters

##### req

`PerformActionRequest`

#### Returns

`Promise`\<`any`\>

#### Inherited from

`JsonRpcApiProvider._perform`

***

### \_recoverSubscriber()

> **\_recoverSubscriber**(`oldSub`, `newSub`): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:402

If a [[Subscriber]] fails and needs to replace itself, this
 method may be used.

 For example, this is used for providers when using the
 ``eth_getFilterChanges`` method, which can return null if state
 filters are not supported by the backend, allowing the Subscriber
 to swap in a [[PollingEventSubscriber]].

#### Parameters

##### oldSub

`Subscriber`

##### newSub

`Subscriber`

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider._recoverSubscriber`

***

### \_send()

> **\_send**(`payload`): `Promise`\<(`JsonRpcResult` \| `JsonRpcError`)[]\>

Defined in: [extensions/ethers/src/TevmProvider.js:187](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L187)

Sends a JSON-RPC %%payload%% (or a batch) to the underlying tevm instance.

#### Parameters

##### payload

`JsonRpcPayload` | `JsonRpcPayload`[]

#### Returns

`Promise`\<(`JsonRpcResult` \| `JsonRpcError`)[]\>

#### Overrides

`JsonRpcApiProvider._send`

***

### \_setTimeout()

> **\_setTimeout**(`_func`, `timeout?`): `number`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:383

Create a timer that will execute %%func%% after at least %%timeout%%
 (in ms). If %%timeout%% is unspecified, then %%func%% will execute
 in the next event loop.

 [Pausing](AbstractProvider-paused) the provider will pause any
 associated timers.

#### Parameters

##### \_func

() => `void`

##### timeout?

`number`

#### Returns

`number`

#### Inherited from

`JsonRpcApiProvider._setTimeout`

***

### \_start()

> **\_start**(): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:253

Sub-classes **MUST** call this. Until [[_start]] has been called, no calls
 will be passed to [[_send]] from [[send]]. If it is overridden, then
 ``super._start()`` **MUST** be called.

 Calling it multiple times is safe and has no effect.

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider._start`

***

### \_waitUntilReady()

> **\_waitUntilReady**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:259

Resolves once the [[_start]] has been called. This can be used in
 sub-classes to defer sending data until the connection has been
 established.

#### Returns

`Promise`\<`void`\>

#### Inherited from

`JsonRpcApiProvider._waitUntilReady`

***

### \_wrapBlock()

> **\_wrapBlock**(`value`, `network`): `Block`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:293

Provides the opportunity for a sub-class to wrap a block before
 returning it, to add additional properties or an alternate
 sub-class of [[Block]].

#### Parameters

##### value

`BlockParams`

##### network

`Network`

#### Returns

`Block`

#### Inherited from

`JsonRpcApiProvider._wrapBlock`

***

### \_wrapLog()

> **\_wrapLog**(`value`, `network`): `Log`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:299

Provides the opportunity for a sub-class to wrap a log before
 returning it, to add additional properties or an alternate
 sub-class of [[Log]].

#### Parameters

##### value

`LogParams`

##### network

`Network`

#### Returns

`Log`

#### Inherited from

`JsonRpcApiProvider._wrapLog`

***

### \_wrapTransactionReceipt()

> **\_wrapTransactionReceipt**(`value`, `network`): `TransactionReceipt`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:305

Provides the opportunity for a sub-class to wrap a transaction
 receipt before returning it, to add additional properties or an
 alternate sub-class of [[TransactionReceipt]].

#### Parameters

##### value

`TransactionReceiptParams`

##### network

`Network`

#### Returns

`TransactionReceipt`

#### Inherited from

`JsonRpcApiProvider._wrapTransactionReceipt`

***

### \_wrapTransactionResponse()

> **\_wrapTransactionResponse**(`tx`, `network`): `TransactionResponse`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:311

Provides the opportunity for a sub-class to wrap a transaction
 response before returning it, to add additional properties or an
 alternate sub-class of [[TransactionResponse]].

#### Parameters

##### tx

`TransactionResponseParams`

##### network

`Network`

#### Returns

`TransactionResponse`

#### Inherited from

`JsonRpcApiProvider._wrapTransactionResponse`

***

### addListener()

> **addListener**(`event`, `listener`): `Promise`\<`TevmProvider`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:410

Alias for [[on]].

#### Parameters

##### event

`ProviderEvent`

##### listener

`Listener`

#### Returns

`Promise`\<`TevmProvider`\>

#### Inherited from

`JsonRpcApiProvider.addListener`

***

### attachPlugin()

> **attachPlugin**(`plugin`): `this`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:273

Attach a new plug-in.

#### Parameters

##### plugin

`AbstractProviderPlugin`

#### Returns

`this`

#### Inherited from

`JsonRpcApiProvider.attachPlugin`

***

### broadcastTransaction()

> **broadcastTransaction**(`signedTx`): `Promise`\<`TransactionResponse`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:358

Broadcasts the %%signedTx%% to the network, adding it to the
 memory pool of any node for which the transaction meets the
 rebroadcast requirements.

#### Parameters

##### signedTx

`string`

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

`JsonRpcApiProvider.broadcastTransaction`

***

### call()

> **call**(`_tx`): `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:353

Simulate the execution of %%tx%%. If the call reverts, it will
 throw a [[CallExceptionError]] which includes the revert data.

#### Parameters

##### \_tx

`TransactionRequest`

#### Returns

`Promise`\<`string`\>

#### Inherited from

`JsonRpcApiProvider.call`

***

### ccipReadFetch()

> **ccipReadFetch**(`tx`, `calldata`, `urls`): `Promise`\<`null` \| `string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:287

Resolves to the data for executing the CCIP-read operations.

#### Parameters

##### tx

`PerformActionTransaction`

##### calldata

`string`

##### urls

`string`[]

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.ccipReadFetch`

***

### destroy()

> **destroy**(): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:320

Sub-classes may use this to shutdown any sockets or release their
 resources and reject any pending requests.

 Sub-classes **must** call ``super.destroy()``.

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider.destroy`

***

### emit()

> **emit**(`event`, ...`args`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:405

Triggers each listener for %%event%% with the %%args%%.

#### Parameters

##### event

`ProviderEvent`

##### args

...`any`[]

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`JsonRpcApiProvider.emit`

***

### estimateGas()

> **estimateGas**(`_tx`): `Promise`\<`bigint`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:352

Estimates the amount of gas required to execute %%tx%%.

#### Parameters

##### \_tx

`TransactionRequest`

#### Returns

`Promise`\<`bigint`\>

#### Inherited from

`JsonRpcApiProvider.estimateGas`

***

### getAvatar()

> **getAvatar**(`name`): `Promise`\<`null` \| `string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:366

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.getAvatar`

***

### getBalance()

> **getBalance**(`address`, `blockTag?`): `Promise`\<`bigint`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:354

Get the account balance (in wei) of %%address%%. If %%blockTag%%
 is specified and the node supports archive access for that
 %%blockTag%%, the balance is as of that [[BlockTag]].

#### Parameters

##### address

`AddressLike`

##### blockTag?

`BlockTag`

#### Returns

`Promise`\<`bigint`\>

#### Note

On nodes without archive access enabled, the %%blockTag%% may be
       **silently ignored** by the node, which may cause issues if relied on.

#### Inherited from

`JsonRpcApiProvider.getBalance`

***

### getBlock()

> **getBlock**(`block`, `prefetchTxs?`): `Promise`\<`null` \| `Block`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:359

Resolves to the block for %%blockHashOrBlockTag%%.

 If %%prefetchTxs%%, and the backend supports including transactions
 with block requests, all transactions will be included and the
 [[Block]] object will not need to make remote calls for getting
 transactions.

#### Parameters

##### block

`BlockTag`

##### prefetchTxs?

`boolean`

#### Returns

`Promise`\<`null` \| `Block`\>

#### Inherited from

`JsonRpcApiProvider.getBlock`

***

### getBlockNumber()

> **getBlockNumber**(): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:326

Get the current block number.

#### Returns

`Promise`\<`number`\>

#### Inherited from

`JsonRpcApiProvider.getBlockNumber`

***

### getCode()

> **getCode**(`address`, `blockTag?`): `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:356

Get the bytecode for %%address%%.

#### Parameters

##### address

`AddressLike`

##### blockTag?

`BlockTag`

#### Returns

`Promise`\<`string`\>

#### Note

On nodes without archive access enabled, the %%blockTag%% may be
       **silently ignored** by the node, which may cause issues if relied on.

#### Inherited from

`JsonRpcApiProvider.getCode`

***

### getFeeData()

> **getFeeData**(): `Promise`\<`FeeData`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:351

Get the best guess at the recommended [[FeeData]].

#### Returns

`Promise`\<`FeeData`\>

#### Inherited from

`JsonRpcApiProvider.getFeeData`

***

### getLogs()

> **getLogs**(`_filter`): `Promise`\<`Log`[]\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:363

Resolves to the list of Logs that match %%filter%%

#### Parameters

##### \_filter

`Filter` | `FilterByBlockHash`

#### Returns

`Promise`\<`Log`[]\>

#### Inherited from

`JsonRpcApiProvider.getLogs`

***

### getNetwork()

> **getNetwork**(): `Promise`\<`Network`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:350

Get the connected [[Network]].

#### Returns

`Promise`\<`Network`\>

#### Inherited from

`JsonRpcApiProvider.getNetwork`

***

### getPlugin()

> **getPlugin**\<`T`\>(`name`): `null` \| `T`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:277

Get a plugin by name.

#### Type Parameters

##### T

`T` *extends* `AbstractProviderPlugin` = `AbstractProviderPlugin`

#### Parameters

##### name

`string`

#### Returns

`null` \| `T`

#### Inherited from

`JsonRpcApiProvider.getPlugin`

***

### getResolver()

> **getResolver**(`name`): `Promise`\<`null` \| `EnsResolver`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:365

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`null` \| `EnsResolver`\>

#### Inherited from

`JsonRpcApiProvider.getResolver`

***

### getRpcError()

> **getRpcError**(`payload`, `_error`): `Error`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:291

Returns an ethers-style Error for the given JSON-RPC error
 %%payload%%, coalescing the various strings and error shapes
 that different nodes return, coercing them into a machine-readable
 standardized error.

#### Parameters

##### payload

`JsonRpcPayload`

##### \_error

`JsonRpcError`

#### Returns

`Error`

#### Inherited from

`JsonRpcApiProvider.getRpcError`

***

### getRpcRequest()

> **getRpcRequest**(`req`): `null` \| \{ `args`: `any`[]; `method`: `string`; \}

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:281

Returns the request method and arguments required to perform
 %%req%%.

#### Parameters

##### req

`PerformActionRequest`

#### Returns

`null` \| \{ `args`: `any`[]; `method`: `string`; \}

#### Inherited from

`JsonRpcApiProvider.getRpcRequest`

***

### getRpcTransaction()

> **getRpcTransaction**(`tx`): `JsonRpcTransactionRequest`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:276

Returns %%tx%% as a normalized JSON-RPC transaction request,
 which has all values hexlified and any numeric values converted
 to Quantity values.

#### Parameters

##### tx

`TransactionRequest`

#### Returns

`JsonRpcTransactionRequest`

#### Inherited from

`JsonRpcApiProvider.getRpcTransaction`

***

### getSigner()

> **getSigner**(`address?`): `Promise`\<`JsonRpcSigner`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:318

Resolves to the [[Signer]] account for  %%address%% managed by
 the client.

 If the %%address%% is a number, it is used as an index in the
 the accounts from [[listAccounts]].

 This can only be used on clients which manage accounts (such as
 Geth with imported account or MetaMask).

 Throws if the account doesn't exist.

#### Parameters

##### address?

`string` | `number`

#### Returns

`Promise`\<`JsonRpcSigner`\>

#### Inherited from

`JsonRpcApiProvider.getSigner`

***

### getStorage()

> **getStorage**(`address`, `_position`, `blockTag?`): `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:357

Get the storage slot value for %%address%% at slot %%position%%.

#### Parameters

##### address

`AddressLike`

##### \_position

`BigNumberish`

##### blockTag?

`BlockTag`

#### Returns

`Promise`\<`string`\>

#### Note

On nodes without archive access enabled, the %%blockTag%% may be
       **silently ignored** by the node, which may cause issues if relied on.

#### Inherited from

`JsonRpcApiProvider.getStorage`

***

### getTransaction()

> **getTransaction**(`hash`): `Promise`\<`null` \| `TransactionResponse`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:360

Resolves to the transaction for %%hash%%.

 If the transaction is unknown or on pruning nodes which
 discard old transactions this resolves to ``null``.

#### Parameters

##### hash

`string`

#### Returns

`Promise`\<`null` \| `TransactionResponse`\>

#### Inherited from

`JsonRpcApiProvider.getTransaction`

***

### getTransactionCount()

> **getTransactionCount**(`address`, `blockTag?`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:355

Get the number of transactions ever sent for %%address%%, which
 is used as the ``nonce`` when sending a transaction. If
 %%blockTag%% is specified and the node supports archive access
 for that %%blockTag%%, the transaction count is as of that
 [[BlockTag]].

#### Parameters

##### address

`AddressLike`

##### blockTag?

`BlockTag`

#### Returns

`Promise`\<`number`\>

#### Note

On nodes without archive access enabled, the %%blockTag%% may be
       **silently ignored** by the node, which may cause issues if relied on.

#### Inherited from

`JsonRpcApiProvider.getTransactionCount`

***

### getTransactionReceipt()

> **getTransactionReceipt**(`hash`): `Promise`\<`null` \| `TransactionReceipt`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:361

Resolves to the transaction receipt for %%hash%%, if mined.

 If the transaction has not been mined, is unknown or on
 pruning nodes which discard old transactions this resolves to
 ``null``.

#### Parameters

##### hash

`string`

#### Returns

`Promise`\<`null` \| `TransactionReceipt`\>

#### Inherited from

`JsonRpcApiProvider.getTransactionReceipt`

***

### getTransactionResult()

> **getTransactionResult**(`hash`): `Promise`\<`null` \| `string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:362

Resolves to the result returned by the executions of %%hash%%.

 This is only supported on nodes with archive access and with
 the necessary debug APIs enabled.

#### Parameters

##### hash

`string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.getTransactionResult`

***

### listAccounts()

> **listAccounts**(): `Promise`\<`JsonRpcSigner`[]\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:319

#### Returns

`Promise`\<`JsonRpcSigner`[]\>

#### Inherited from

`JsonRpcApiProvider.listAccounts`

***

### listenerCount()

> **listenerCount**(`event?`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:406

Resolves to the number of listeners for %%event%%.

#### Parameters

##### event?

`ProviderEvent`

#### Returns

`Promise`\<`number`\>

#### Inherited from

`JsonRpcApiProvider.listenerCount`

***

### listeners()

> **listeners**(`event?`): `Promise`\<`Listener`[]\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:407

Resolves to the listeners for %%event%%.

#### Parameters

##### event?

`ProviderEvent`

#### Returns

`Promise`\<`Listener`[]\>

#### Inherited from

`JsonRpcApiProvider.listeners`

***

### lookupAddress()

> **lookupAddress**(`address`): `Promise`\<`null` \| `string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:368

Resolves to the ENS name associated for the %%address%% or
 ``null`` if the //primary name// is not configured.

 Users must perform additional steps to configure a //primary name//,
 which is not currently common.

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.lookupAddress`

***

### off()

> **off**(`event`, `listener?`): `Promise`\<`TevmProvider`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:408

Unregister the %%listener%% for %%event%%. If %%listener%%
 is unspecified, all listeners are unregistered.

#### Parameters

##### event

`ProviderEvent`

##### listener?

`Listener`

#### Returns

`Promise`\<`TevmProvider`\>

#### Inherited from

`JsonRpcApiProvider.off`

***

### on()

> **on**(`event`, `listener`): `Promise`\<`TevmProvider`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:403

Registers a %%listener%% that is called whenever the
 %%event%% occurs until unregistered.

#### Parameters

##### event

`ProviderEvent`

##### listener

`Listener`

#### Returns

`Promise`\<`TevmProvider`\>

#### Inherited from

`JsonRpcApiProvider.on`

***

### once()

> **once**(`event`, `listener`): `Promise`\<`TevmProvider`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:404

Registers a %%listener%% that is called the next time
 %%event%% occurs.

#### Parameters

##### event

`ProviderEvent`

##### listener

`Listener`

#### Returns

`Promise`\<`TevmProvider`\>

#### Inherited from

`JsonRpcApiProvider.once`

***

### pause()

> **pause**(`dropWhilePaused?`): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:445

Pause the provider. If %%dropWhilePaused%%, any events that occur
 while paused are dropped, otherwise all events will be emitted once
 the provider is unpaused.

#### Parameters

##### dropWhilePaused?

`boolean`

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider.pause`

***

### removeAllListeners()

> **removeAllListeners**(`event?`): `Promise`\<`TevmProvider`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:409

Unregister all listeners for %%event%%.

#### Parameters

##### event?

`ProviderEvent`

#### Returns

`Promise`\<`TevmProvider`\>

#### Inherited from

`JsonRpcApiProvider.removeAllListeners`

***

### removeListener()

> **removeListener**(`event`, `listener`): `Promise`\<`TevmProvider`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:411

Alias for [[off]].

#### Parameters

##### event

`ProviderEvent`

##### listener

`Listener`

#### Returns

`Promise`\<`TevmProvider`\>

#### Inherited from

`JsonRpcApiProvider.removeListener`

***

### resolveName()

> **resolveName**(`name`): `Promise`\<`null` \| `string`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:367

Resolves to the address configured for the %%ensName%% or
 ``null`` if unconfigured.

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.resolveName`

***

### resume()

> **resume**(): `void`

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:449

Resume the provider.

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider.resume`

***

### send()

> **send**(`method`, `params`): `Promise`\<`any`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:305

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

##### method

`string`

##### params

`any`[] | `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`any`\>

#### Inherited from

`JsonRpcApiProvider.send`

***

### waitForBlock()

> **waitForBlock**(`blockTag?`): `Promise`\<`Block`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:370

Resolves to the block at %%blockTag%% once it has been mined.

 This can be useful for waiting some number of blocks by using
 the ``currentBlockNumber + N``.

#### Parameters

##### blockTag?

`BlockTag`

#### Returns

`Promise`\<`Block`\>

#### Inherited from

`JsonRpcApiProvider.waitForBlock`

***

### waitForTransaction()

> **waitForTransaction**(`hash`, `_confirms?`, `timeout?`): `Promise`\<`null` \| `TransactionReceipt`\>

Defined in: node\_modules/.pnpm/ethers@6.13.5\_bufferutil@4.0.9\_utf-8-validate@5.0.10/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:369

Waits until the transaction %%hash%% is mined and has %%confirms%%
 confirmations.

#### Parameters

##### hash

`string`

##### \_confirms?

`null` | `number`

##### timeout?

`null` | `number`

#### Returns

`Promise`\<`null` \| `TransactionReceipt`\>

#### Inherited from

`JsonRpcApiProvider.waitForTransaction`

***

### createMemoryProvider()

> `readonly` `static` **createMemoryProvider**(`options`): `Promise`\<`TevmProvider`\>

Defined in: [extensions/ethers/src/TevmProvider.js:124](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L124)

Creates a new TevmProvider instance with a TevmMemoryClient.

#### Parameters

##### options

`TevmNodeOptions`\<\{ `blockExplorers?`: \{[`key`: `string`]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}; `contracts?`: \{[`key`: `string`]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `multicall3?`: `ChainContract`; `universalSignatureVerifier?`: `ChainContract`; \}; `copy`: () => `object`; `custom?`: `Record`\<`string`, `unknown`\>; `ethjsCommon`: `Common`; `fees?`: `ChainFees`\<`undefined` \| `ChainFormatters`\>; `formatters?`: `ChainFormatters`; `id`: `number`; `name`: `string`; `nativeCurrency`: `ChainNativeCurrency`; `rpcUrls`: \{[`key`: `string`]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}; `serializers?`: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>; `sourceId?`: `number`; `testnet?`: `boolean`; \}\>

Options to create a new TevmProvider.

#### Returns

`Promise`\<`TevmProvider`\>

A new TevmProvider instance.

#### See

[Tevm Clients Docs](https://tevm.sh/learn/clients/)

#### Example

```ts
import { TevmProvider } from '@tevm/ethers'

const provider = await TevmProvider.createMemoryProvider()

const blockNumber = await provider.getBlockNumber()
```

---
editUrl: false
next: false
prev: false
title: "TevmCommon"
---

## Extends

- `Common`

## Constructors

### new TevmCommon(opts)

> **new TevmCommon**(`opts`): [`TevmCommon`](/reference/tevm/common/classes/tevmcommon/)

#### Parameters

▪ **opts**: `CommonOpts`

#### Inherited from

Common.constructor

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:69

## Properties

### DEFAULT\_HARDFORK

> **`readonly`** **DEFAULT\_HARDFORK**: `string`

#### Inherited from

Common.DEFAULT\_HARDFORK

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:20

***

### HARDFORK\_CHANGES

> **`protected`** **HARDFORK\_CHANGES**: [`string`, `HardforkConfig`][]

#### Inherited from

Common.HARDFORK\_CHANGES

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:28

***

### \_activatedEIPsCache

> **`protected`** **\_activatedEIPsCache**: `number`[]

#### Inherited from

Common.\_activatedEIPsCache

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:27

***

### \_chainParams

> **`protected`** **\_chainParams**: `ChainConfig`

#### Inherited from

Common.\_chainParams

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:21

***

### \_customChains

> **`protected`** **\_customChains**: `ChainConfig`[]

#### Inherited from

Common.\_customChains

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:24

***

### \_eips

> **`protected`** **\_eips**: `number`[]

#### Inherited from

Common.\_eips

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:23

***

### \_hardfork

> **`protected`** **\_hardfork**: `string`

#### Inherited from

Common.\_hardfork

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:22

***

### \_paramsCache

> **`protected`** **\_paramsCache**: `ParamsCacheConfig`

#### Inherited from

Common.\_paramsCache

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:26

***

### customCrypto

> **`readonly`** **customCrypto**: `CustomCrypto`

#### Inherited from

Common.customCrypto

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:25

***

### events

> **events**: `EventEmitter`

#### Inherited from

Common.events

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:29

## Methods

### \_buildActivatedEIPsCache()

> **`protected`** **\_buildActivatedEIPsCache**(): `void`

#### Inherited from

Common.\_buildActivatedEIPsCache

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:125

***

### \_buildParamsCache()

> **`protected`** **\_buildParamsCache**(): `void`

Build up a cache for all parameter values for the current HF and all activated EIPs

#### Inherited from

Common.\_buildParamsCache

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:124

***

### \_calcForkHash()

> **`protected`** **\_calcForkHash**(`hardfork`, `genesisHash`): `string`

Internal helper function to calculate a fork hash

#### Parameters

▪ **hardfork**: `string`

Hardfork name

▪ **genesisHash**: `Uint8Array`

Genesis block hash of the chain

#### Returns

Fork hash as hex string

#### Inherited from

Common.\_calcForkHash

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:232

***

### \_getHardfork()

> **`protected`** **\_getHardfork**(`hardfork`): `null` \| `HardforkTransitionConfig`

Internal helper function, returns the params for the given hardfork for the chain set

#### Parameters

▪ **hardfork**: `string`

Hardfork name

#### Returns

Dictionary with hardfork params or null if hardfork not on chain

#### Inherited from

Common.\_getHardfork

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:111

***

### \_mergeWithParamsCache()

> **`protected`** **\_mergeWithParamsCache**(`params`): `void`

Internal helper for _buildParamsCache()

#### Parameters

▪ **params**: `HardforkConfig` \| `EIPConfig`

#### Inherited from

Common.\_mergeWithParamsCache

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:120

***

### activeOnBlock()

> **activeOnBlock**(`blockNumber`): `boolean`

Alias to hardforkIsActiveOnBlock when hardfork is set

#### Parameters

▪ **blockNumber**: `BigIntLike`

#### Returns

True if HF is active on block number

#### Inherited from

Common.activeOnBlock

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:186

***

### bootstrapNodes()

> **bootstrapNodes**(): `BootstrapNodeConfig`[]

Returns bootstrap nodes for the current chain

#### Returns

Dict with bootstrap nodes

#### Inherited from

Common.bootstrapNodes

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:265

***

### chainId()

> **chainId**(): `bigint`

Returns the Id of current chain

#### Returns

chain Id

#### Inherited from

Common.chainId

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:280

***

### chainName()

> **chainName**(): `string`

Returns the name of current chain

#### Returns

chain name (lower case)

#### Inherited from

Common.chainName

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:285

***

### consensusAlgorithm()

> **consensusAlgorithm**(): `string`

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type,
"clique" for "poa" consensus type or
"casper" for "pos" consensus type.

Note: This value can update along a Hardfork.

#### Inherited from

Common.consensusAlgorithm

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:313

***

### consensusConfig()

> **consensusConfig**(): `object`

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain json files):

ethash: empty object
clique: period, epoch
casper: empty object

Note: This value can update along a Hardfork.

#### Inherited from

Common.consensusConfig

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:327

***

### consensusType()

> **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Inherited from

Common.consensusType

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:303

***

### copy()

> **copy**(): `Common`

Returns a deep copy of this [Common]([object Object]) instance.

#### Inherited from

Common.copy

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:333

***

### dnsNetworks()

> **dnsNetworks**(): `string`[]

Returns DNS networks for the current chain

#### Returns

Array of DNS ENR urls

#### Inherited from

Common.dnsNetworks

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:270

***

### eipBlock()

> **eipBlock**(`eip`): `null` \| `bigint`

Returns the hardfork change block for eip

#### Parameters

▪ **eip**: `number`

EIP number

#### Returns

Block number or null if unscheduled

#### Inherited from

Common.eipBlock

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:213

***

### eips()

> **eips**(): `number`[]

Returns the additionally activated EIPs
(by using the `eips` constructor option)

#### Returns

List of EIPs

#### Inherited from

Common.eips

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:296

***

### forkHash()

> **forkHash**(`hardfork`?, `genesisHash`?): `string`

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

▪ **hardfork?**: `string`

Hardfork name, optional if HF set

▪ **genesisHash?**: `Uint8Array`

Genesis block hash of the chain, optional if already defined and not needed to be calculated

#### Inherited from

Common.forkHash

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:238

***

### genesis()

> **genesis**(): `GenesisBlockConfig`

Returns the Genesis parameters of the current chain

#### Returns

Genesis dictionary

#### Inherited from

Common.genesis

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:255

***

### getHardforkBy()

> **getHardforkBy**(`opts`): `string`

Returns the hardfork either based on block numer (older HFs) or
timestamp (Shanghai upwards).

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

▪ **opts**: `HardforkByOpts`

#### Returns

The name of the HF

#### Inherited from

Common.getHardforkBy

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:93

***

### gteHardfork()

> **gteHardfork**(`hardfork`): `boolean`

Alias to hardforkGteHardfork when hardfork is set

#### Parameters

▪ **hardfork**: `string`

Hardfork name

#### Returns

True if hardfork set is greater than hardfork provided

#### Inherited from

Common.gteHardfork

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:200

***

### hardfork()

> **hardfork**(): `string`

Returns the hardfork set

#### Returns

Hardfork name

#### Inherited from

Common.hardfork

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:275

***

### hardforkBlock()

> **hardforkBlock**(`hardfork`?): `null` \| `bigint`

Returns the hardfork change block for hardfork provided or set

#### Parameters

▪ **hardfork?**: `string`

Hardfork name, optional if HF set

#### Returns

Block number or null if unscheduled

#### Inherited from

Common.hardforkBlock

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:206

***

### hardforkForForkHash()

> **hardforkForForkHash**(`forkHash`): `null` \| `HardforkTransitionConfig`

#### Parameters

▪ **forkHash**: `string`

Fork hash as a hex string

#### Returns

Array with hardfork data (name, block, forkHash)

#### Inherited from

Common.hardforkForForkHash

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:244

***

### hardforkGteHardfork()

> **hardforkGteHardfork**(`hardfork1`, `hardfork2`): `boolean`

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

▪ **hardfork1**: `null` \| `string`

Hardfork name or null (if set)

▪ **hardfork2**: `string`

Hardfork name

#### Returns

True if HF1 gte HF2

#### Inherited from

Common.hardforkGteHardfork

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:194

***

### hardforkIsActiveOnBlock()

> **hardforkIsActiveOnBlock**(`hardfork`, `blockNumber`): `boolean`

Checks if set or provided hardfork is active on block number

#### Parameters

▪ **hardfork**: `null` \| `string`

Hardfork name or null (for HF set)

▪ **blockNumber**: `BigIntLike`

#### Returns

True if HF is active on block number

#### Inherited from

Common.hardforkIsActiveOnBlock

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:180

***

### hardforkTTD()

> **hardforkTTD**(`hardfork`?): `null` \| `bigint`

Returns the hardfork change total difficulty (Merge HF) for hardfork provided or set

#### Parameters

▪ **hardfork?**: `string`

Hardfork name, optional if HF set

#### Returns

Total difficulty or null if no set

#### Inherited from

Common.hardforkTTD

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:219

***

### hardforkTimestamp()

> **hardforkTimestamp**(`hardfork`?): `null` \| `bigint`

#### Parameters

▪ **hardfork?**: `string`

#### Inherited from

Common.hardforkTimestamp

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:207

***

### hardforks()

> **hardforks**(): `HardforkTransitionConfig`[]

Returns the hardforks for current chain

#### Returns

Array with arrays of hardforks

#### Inherited from

Common.hardforks

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:260

***

### isActivatedEIP()

> **isActivatedEIP**(`eip`): `boolean`

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the [CommonOpts.eips]([object Object]) or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the [CommonOpts.eips]([object Object]) constructor option

#### Parameters

▪ **eip**: `number`

#### Inherited from

Common.isActivatedEIP

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:173

***

### networkId()

> **networkId**(): `bigint`

Returns the Id of current network

#### Returns

network Id

#### Inherited from

Common.networkId

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:290

***

### nextHardforkBlockOrTimestamp()

> **nextHardforkBlockOrTimestamp**(`hardfork`?): `null` \| `bigint`

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

▪ **hardfork?**: `string`

Hardfork name, optional if HF set

#### Returns

Block timestamp, number or null if not available

#### Inherited from

Common.nextHardforkBlockOrTimestamp

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:225

***

### param()

> **param**(`topic`, `name`): `bigint`

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precedence.
Otherwise the parameter is taken from the latest applied HF with
a change on the respective parameter.

#### Parameters

▪ **topic**: `string`

Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')

▪ **name**: `string`

Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)

#### Returns

The value requested or `BigInt(0)` if not found

#### Inherited from

Common.param

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:137

***

### paramByBlock()

> **paramByBlock**(`topic`, `name`, `blockNumber`, `td`?, `timestamp`?): `bigint`

Returns a parameter for the hardfork active on block number or
optional provided total difficulty (Merge HF)

#### Parameters

▪ **topic**: `string`

Parameter topic

▪ **name**: `string`

Parameter name

▪ **blockNumber**: `BigIntLike`

Block number

▪ **td?**: `BigIntLike`

Total difficulty
   *

▪ **timestamp?**: `BigIntLike`

#### Returns

The value requested or `BigInt(0)` if not found

#### Inherited from

Common.paramByBlock

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:163

***

### paramByEIP()

> **paramByEIP**(`topic`, `name`, `eip`): `undefined` \| `bigint`

Returns a parameter corresponding to an EIP

#### Parameters

▪ **topic**: `string`

Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')

▪ **name**: `string`

Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)

▪ **eip**: `number`

Number of the EIP

#### Returns

The value requested or `undefined` if not found

#### Inherited from

Common.paramByEIP

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:153

***

### paramByHardfork()

> **paramByHardfork**(`topic`, `name`, `hardfork`): `bigint`

Returns the parameter corresponding to a hardfork

#### Parameters

▪ **topic**: `string`

Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')

▪ **name**: `string`

Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)

▪ **hardfork**: `string`

Hardfork name

#### Returns

The value requested or `BigInt(0)` if not found

#### Inherited from

Common.paramByHardfork

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:145

***

### setChain()

> **setChain**(`chain`): `ChainConfig`

Sets the chain

#### Parameters

▪ **chain**: `string` \| `number` \| `bigint` \| `object`

String ('mainnet') or Number (1) chain representation.
             Or, a Dictionary of chain parameters for a private network.

#### Returns

The dictionary with parameters set as chain

#### Inherited from

Common.setChain

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:76

***

### setEIPs()

> **setEIPs**(`eips`?): `void`

Sets the active EIPs

#### Parameters

▪ **eips?**: `number`[]

#### Inherited from

Common.setEIPs

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:116

***

### setForkHashes()

> **setForkHashes**(`genesisHash`): `void`

Sets any missing forkHashes on the passed-in [Common]([object Object]) instance

#### Parameters

▪ **genesisHash**: `Uint8Array`

The genesis block hash

#### Inherited from

Common.setForkHashes

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:250

***

### setHardfork()

> **setHardfork**(`hardfork`): `void`

Sets the hardfork to get params for

#### Parameters

▪ **hardfork**: `string`

String identifier (e.g. 'byzantium') or [Hardfork](/reference/tevm/common/type-aliases/hardfork/) enum

#### Inherited from

Common.setHardfork

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:81

***

### setHardforkBy()

> **setHardforkBy**(`opts`): `string`

Sets a new hardfork either based on block numer (older HFs) or
timestamp (Shanghai upwards).

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

▪ **opts**: `HardforkByOpts`

#### Returns

The name of the HF set

#### Inherited from

Common.setHardforkBy

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:105

***

### \_getChainParams()

> **`protected`** **`static`** **\_getChainParams**(`chain`, `customChains`?): `ChainConfig`

#### Parameters

▪ **chain**: `string` \| `number` \| `bigint`

▪ **customChains?**: `ChainConfig`[]

#### Inherited from

Common.\_getChainParams

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:68

***

### custom()

> **`static`** **custom**(`chainParamsOrName`, `opts`?): `Common`

Creates a [Common]([object Object]) object for a custom chain, based on a standard one.

It uses all the [Chain]([object Object]) parameters from the baseChain option except the ones overridden
in a provided [chainParamsOrName](Parameter chainParamsOrName: Partial`<ChainConfig>`  | CustomChain) dictionary. Some usage example:

```javascript
Common.custom({chainId: 123})
```

There are also selected supported custom chains which can be initialized by using one of the
CustomChains for [chainParamsOrName](Parameter chainParamsOrName: Partial`<ChainConfig>`  | CustomChain), e.g.:

```javascript
Common.custom(CustomChains.MaticMumbai)
```

Note that these supported custom chains only provide some base parameters (usually the chain and
network ID and a name) and can only be used for selected use cases (e.g. sending a tx with
the `@ethereumjs/tx` library to a Layer-2 chain).

#### Parameters

▪ **chainParamsOrName**: `Partial`\<`ChainConfig`\> \| `CustomChain`

Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain

▪ **opts?**: `CustomCommonOpts`

Custom chain options to set the [CustomCommonOpts.baseChain]([object Object]), selected [CustomCommonOpts.hardfork]([object Object]) and others

#### Inherited from

Common.custom

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:54

***

### fromGethGenesis()

> **`static`** **fromGethGenesis**(`genesisJson`, `to`): `Common`

Static method to load and set common from a geth genesis json

#### Parameters

▪ **genesisJson**: `any`

json of geth configuration

▪ **to**: `GethConfigOpts`

further configure the common instance

#### Returns

Common

#### Inherited from

Common.fromGethGenesis

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:61

***

### getInitializedChains()

> **`static`** **getInitializedChains**(`customChains`?): `ChainsConfig`

#### Parameters

▪ **customChains?**: `ChainConfig`[]

#### Inherited from

Common.getInitializedChains

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:334

***

### isSupportedChainId()

> **`static`** **isSupportedChainId**(`chainId`): `boolean`

Static method to determine if a [chainId](/reference/tevm/common/classes/tevmcommon/#chainid) is supported as a standard chain

#### Parameters

▪ **chainId**: `bigint`

bigint id (`1`) of a standard chain

#### Returns

boolean

#### Inherited from

Common.isSupportedChainId

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.2.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:67

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

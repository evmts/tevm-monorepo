---
editUrl: false
next: false
prev: false
title: "Common"
---

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use the [Common.custom](../../../../../../../reference/tevm/common/classes/common/#custom) static constructor for creating simple
custom chain [Common](../../../../../../../reference/tevm/common/classes/common) objects (more complete custom chain setups
can be created via the main constructor and the CommonOpts.customChains parameter).

## Constructors

### new Common()

> **new Common**(`opts`): [`Common`](/reference/tevm/common/classes/common/)

#### Parameters

• **opts**: `CommonOpts`

#### Returns

[`Common`](/reference/tevm/common/classes/common/)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:69

## Properties

### DEFAULT\_HARDFORK

> `readonly` **DEFAULT\_HARDFORK**: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:20

***

### HARDFORK\_CHANGES

> `protected` **HARDFORK\_CHANGES**: [`string`, `HardforkConfig`][]

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:28

***

### \_activatedEIPsCache

> `protected` **\_activatedEIPsCache**: `number`[]

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:27

***

### \_chainParams

> `protected` **\_chainParams**: `ChainConfig`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:21

***

### \_customChains

> `protected` **\_customChains**: `ChainConfig`[]

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:24

***

### \_eips

> `protected` **\_eips**: `number`[]

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:23

***

### \_hardfork

> `protected` **\_hardfork**: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:22

***

### \_paramsCache

> `protected` **\_paramsCache**: `ParamsCacheConfig`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:26

***

### customCrypto

> `readonly` **customCrypto**: `CustomCrypto`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:25

***

### events

> **events**: `EventEmitter`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:29

## Methods

### \_buildActivatedEIPsCache()

> `protected` **\_buildActivatedEIPsCache**(): `void`

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:125

***

### \_buildParamsCache()

> `protected` **\_buildParamsCache**(): `void`

Build up a cache for all parameter values for the current HF and all activated EIPs

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:124

***

### \_calcForkHash()

> `protected` **\_calcForkHash**(`hardfork`, `genesisHash`): `string`

Internal helper function to calculate a fork hash

#### Parameters

• **hardfork**: `string`

Hardfork name

• **genesisHash**: `Uint8Array`

Genesis block hash of the chain

#### Returns

`string`

Fork hash as hex string

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:238

***

### \_getHardfork()

> `protected` **\_getHardfork**(`hardfork`): `null` \| `HardforkTransitionConfig`

Internal helper function, returns the params for the given hardfork for the chain set

#### Parameters

• **hardfork**: `string`

Hardfork name

#### Returns

`null` \| `HardforkTransitionConfig`

Dictionary with hardfork params or null if hardfork not on chain

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:111

***

### \_mergeWithParamsCache()

> `protected` **\_mergeWithParamsCache**(`params`): `void`

Internal helper for _buildParamsCache()

#### Parameters

• **params**: `HardforkConfig` \| `EIPConfig`

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:120

***

### activeOnBlock()

> **activeOnBlock**(`blockNumber`): `boolean`

Alias to hardforkIsActiveOnBlock when hardfork is set

#### Parameters

• **blockNumber**: [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

#### Returns

`boolean`

True if HF is active on block number

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:186

***

### bootstrapNodes()

> **bootstrapNodes**(): `BootstrapNodeConfig`[]

Returns bootstrap nodes for the current chain

#### Returns

`BootstrapNodeConfig`[]

Dict with bootstrap nodes

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:271

***

### chainId()

> **chainId**(): `bigint`

Returns the Id of current chain

#### Returns

`bigint`

chain Id

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:286

***

### chainName()

> **chainName**(): `string`

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:291

***

### consensusAlgorithm()

> **consensusAlgorithm**(): `string`

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type,
"clique" for "poa" consensus type or
"casper" for "pos" consensus type.

Note: This value can update along a Hardfork.

#### Returns

`string`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:319

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

#### Returns

`object`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:333

***

### consensusType()

> **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Returns

`string`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:309

***

### copy()

> **copy**(): [`Common`](/reference/tevm/common/classes/common/)

Returns a deep copy of this [Common](../../../../../../../reference/tevm/common/classes/common) instance.

#### Returns

[`Common`](/reference/tevm/common/classes/common/)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:339

***

### dnsNetworks()

> **dnsNetworks**(): `string`[]

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:276

***

### eipBlock()

> **eipBlock**(`eip`): `null` \| `bigint`

Returns the hardfork change block for eip

#### Parameters

• **eip**: `number`

EIP number

#### Returns

`null` \| `bigint`

Block number or null if unscheduled

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:213

***

### eipTimestamp()

> **eipTimestamp**(`eip`): `null` \| `bigint`

Returns the scheduled timestamp of the EIP (if scheduled and scheduled by timestamp)

#### Parameters

• **eip**: `number`

EIP number

#### Returns

`null` \| `bigint`

Scheduled timestamp. If this EIP is unscheduled, or the EIP is scheduled by block number or ttd, then it returns `null`.

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:219

***

### eips()

> **eips**(): `number`[]

Returns the additionally activated EIPs
(by using the `eips` constructor option)

#### Returns

`number`[]

List of EIPs

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:302

***

### forkHash()

> **forkHash**(`hardfork`?, `genesisHash`?): `string`

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

• **hardfork?**: `string`

Hardfork name, optional if HF set

• **genesisHash?**: `Uint8Array`

Genesis block hash of the chain, optional if already defined and not needed to be calculated

#### Returns

`string`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:244

***

### genesis()

> **genesis**(): `GenesisBlockConfig`

Returns the Genesis parameters of the current chain

#### Returns

`GenesisBlockConfig`

Genesis dictionary

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:261

***

### getHardforkBy()

> **getHardforkBy**(`opts`): `string`

Returns the hardfork either based on block numer (older HFs) or
timestamp (Shanghai upwards).

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

• **opts**: `HardforkByOpts`

#### Returns

`string`

The name of the HF

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:93

***

### gteHardfork()

> **gteHardfork**(`hardfork`): `boolean`

Alias to hardforkGteHardfork when hardfork is set

#### Parameters

• **hardfork**: `string`

Hardfork name

#### Returns

`boolean`

True if hardfork set is greater than hardfork provided

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:200

***

### hardfork()

> **hardfork**(): `string`

Returns the hardfork set

#### Returns

`string`

Hardfork name

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:281

***

### hardforkBlock()

> **hardforkBlock**(`hardfork`?): `null` \| `bigint`

Returns the hardfork change block for hardfork provided or set

#### Parameters

• **hardfork?**: `string`

Hardfork name, optional if HF set

#### Returns

`null` \| `bigint`

Block number or null if unscheduled

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:206

***

### hardforkForForkHash()

> **hardforkForForkHash**(`forkHash`): `null` \| `HardforkTransitionConfig`

#### Parameters

• **forkHash**: `string`

Fork hash as a hex string

#### Returns

`null` \| `HardforkTransitionConfig`

Array with hardfork data (name, block, forkHash)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:250

***

### hardforkGteHardfork()

> **hardforkGteHardfork**(`hardfork1`, `hardfork2`): `boolean`

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

• **hardfork1**: `null` \| `string`

Hardfork name or null (if set)

• **hardfork2**: `string`

Hardfork name

#### Returns

`boolean`

True if HF1 gte HF2

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:194

***

### hardforkIsActiveOnBlock()

> **hardforkIsActiveOnBlock**(`hardfork`, `blockNumber`): `boolean`

Checks if set or provided hardfork is active on block number

#### Parameters

• **hardfork**: `null` \| `string`

Hardfork name or null (for HF set)

• **blockNumber**: [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

#### Returns

`boolean`

True if HF is active on block number

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:180

***

### hardforkTTD()

> **hardforkTTD**(`hardfork`?): `null` \| `bigint`

Returns the hardfork change total difficulty (Merge HF) for hardfork provided or set

#### Parameters

• **hardfork?**: `string`

Hardfork name, optional if HF set

#### Returns

`null` \| `bigint`

Total difficulty or null if no set

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:225

***

### hardforkTimestamp()

> **hardforkTimestamp**(`hardfork`?): `null` \| `bigint`

#### Parameters

• **hardfork?**: `string`

#### Returns

`null` \| `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:207

***

### hardforks()

> **hardforks**(): `HardforkTransitionConfig`[]

Returns the hardforks for current chain

#### Returns

`HardforkTransitionConfig`[]

Array with arrays of hardforks

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:266

***

### isActivatedEIP()

> **isActivatedEIP**(`eip`): `boolean`

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the CommonOpts.eips or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the CommonOpts.eips constructor option

#### Parameters

• **eip**: `number`

#### Returns

`boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:173

***

### networkId()

> **networkId**(): `bigint`

Returns the Id of current network

#### Returns

`bigint`

network Id

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:296

***

### nextHardforkBlockOrTimestamp()

> **nextHardforkBlockOrTimestamp**(`hardfork`?): `null` \| `bigint`

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

• **hardfork?**: `string`

Hardfork name, optional if HF set

#### Returns

`null` \| `bigint`

Block timestamp, number or null if not available

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:231

***

### param()

> **param**(`topic`, `name`): `bigint`

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precedence.
Otherwise the parameter is taken from the latest applied HF with
a change on the respective parameter.

#### Parameters

• **topic**: `string`

Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')

• **name**: `string`

Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:137

***

### paramByBlock()

> **paramByBlock**(`topic`, `name`, `blockNumber`, `td`?, `timestamp`?): `bigint`

Returns a parameter for the hardfork active on block number or
optional provided total difficulty (Merge HF)

#### Parameters

• **topic**: `string`

Parameter topic

• **name**: `string`

Parameter name

• **blockNumber**: [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

Block number

• **td?**: [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

Total difficulty
   *

• **timestamp?**: [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:163

***

### paramByEIP()

> **paramByEIP**(`topic`, `name`, `eip`): `undefined` \| `bigint`

Returns a parameter corresponding to an EIP

#### Parameters

• **topic**: `string`

Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')

• **name**: `string`

Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)

• **eip**: `number`

Number of the EIP

#### Returns

`undefined` \| `bigint`

The value requested or `undefined` if not found

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:153

***

### paramByHardfork()

> **paramByHardfork**(`topic`, `name`, `hardfork`): `bigint`

Returns the parameter corresponding to a hardfork

#### Parameters

• **topic**: `string`

Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')

• **name**: `string`

Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)

• **hardfork**: `string`

Hardfork name

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:145

***

### setChain()

> **setChain**(`chain`): `ChainConfig`

Sets the chain

#### Parameters

• **chain**: `string` \| `number` \| `bigint` \| `object`

String ('mainnet') or Number (1) chain representation.
             Or, a Dictionary of chain parameters for a private network.

#### Returns

`ChainConfig`

The dictionary with parameters set as chain

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:76

***

### setEIPs()

> **setEIPs**(`eips`?): `void`

Sets the active EIPs

#### Parameters

• **eips?**: `number`[]

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:116

***

### setForkHashes()

> **setForkHashes**(`genesisHash`): `void`

Sets any missing forkHashes on the passed-in [Common](../../../../../../../reference/tevm/common/classes/common) instance

#### Parameters

• **genesisHash**: `Uint8Array`

The genesis block hash

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:256

***

### setHardfork()

> **setHardfork**(`hardfork`): `void`

Sets the hardfork to get params for

#### Parameters

• **hardfork**: `string`

String identifier (e.g. 'byzantium') or [Hardfork](../../../../../../../reference/tevm/common/type-aliases/hardfork) enum

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:81

***

### setHardforkBy()

> **setHardforkBy**(`opts`): `string`

Sets a new hardfork either based on block numer (older HFs) or
timestamp (Shanghai upwards).

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

• **opts**: `HardforkByOpts`

#### Returns

`string`

The name of the HF set

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:105

***

### \_getChainParams()

> `protected` `static` **\_getChainParams**(`chain`, `customChains`?): `ChainConfig`

#### Parameters

• **chain**: `string` \| `number` \| `bigint`

• **customChains?**: `ChainConfig`[]

#### Returns

`ChainConfig`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:68

***

### custom()

> `static` **custom**(`chainParamsOrName`, `opts`?): [`Common`](/reference/tevm/common/classes/common/)

Creates a [Common](../../../../../../../reference/tevm/common/classes/common) object for a custom chain, based on a standard one.

It uses all the Chain parameters from the baseChain option except the ones overridden
in a provided chainParamsOrName dictionary. Some usage example:

```javascript
Common.custom({chainId: 123})
```

There are also selected supported custom chains which can be initialized by using one of the
CustomChains for chainParamsOrName, e.g.:

```javascript
Common.custom(CustomChains.MaticMumbai)
```

Note that these supported custom chains only provide some base parameters (usually the chain and
network ID and a name) and can only be used for selected use cases (e.g. sending a tx with
the `@ethereumjs/tx` library to a Layer-2 chain).

#### Parameters

• **chainParamsOrName**: `Partial`\<`ChainConfig`\> \| `CustomChain`

Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain

• **opts?**: `CustomCommonOpts`

Custom chain options to set the CustomCommonOpts.baseChain, selected CustomCommonOpts.hardfork and others

#### Returns

[`Common`](/reference/tevm/common/classes/common/)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:54

***

### fromGethGenesis()

> `static` **fromGethGenesis**(`genesisJson`, `to`): [`Common`](/reference/tevm/common/classes/common/)

Static method to load and set common from a geth genesis json

#### Parameters

• **genesisJson**: `any`

json of geth configuration

• **to**: `GethConfigOpts`

further configure the common instance

#### Returns

[`Common`](/reference/tevm/common/classes/common/)

Common

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:61

***

### getInitializedChains()

> `static` **getInitializedChains**(`customChains`?): `ChainsConfig`

#### Parameters

• **customChains?**: `ChainConfig`[]

#### Returns

`ChainsConfig`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:340

***

### isSupportedChainId()

> `static` **isSupportedChainId**(`chainId`): `boolean`

Static method to determine if a [chainId](../../../../../../../reference/tevm/common/classes/common/#chainid) is supported as a standard chain

#### Parameters

• **chainId**: `bigint`

bigint id (`1`) of a standard chain

#### Returns

`boolean`

boolean

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/common.d.ts:67

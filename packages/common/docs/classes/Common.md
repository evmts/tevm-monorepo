[@tevm/common](../README.md) / [Exports](../modules.md) / Common

# Class: Common

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use the [Common.custom](Common.md#custom) static constructor for creating simple
custom chain [Common](Common.md) objects (more complete custom chain setups
can be created via the main constructor and the CommonOpts.customChains parameter).

## Table of contents

### Constructors

- [constructor](Common.md#constructor)

### Properties

- [DEFAULT\_HARDFORK](Common.md#default_hardfork)
- [HARDFORK\_CHANGES](Common.md#hardfork_changes)
- [\_activatedEIPsCache](Common.md#_activatedeipscache)
- [\_chainParams](Common.md#_chainparams)
- [\_customChains](Common.md#_customchains)
- [\_eips](Common.md#_eips)
- [\_hardfork](Common.md#_hardfork)
- [\_paramsCache](Common.md#_paramscache)
- [customCrypto](Common.md#customcrypto)
- [events](Common.md#events)

### Methods

- [\_buildActivatedEIPsCache](Common.md#_buildactivatedeipscache)
- [\_buildParamsCache](Common.md#_buildparamscache)
- [\_calcForkHash](Common.md#_calcforkhash)
- [\_getHardfork](Common.md#_gethardfork)
- [\_mergeWithParamsCache](Common.md#_mergewithparamscache)
- [activeOnBlock](Common.md#activeonblock)
- [bootstrapNodes](Common.md#bootstrapnodes)
- [chainId](Common.md#chainid)
- [chainName](Common.md#chainname)
- [consensusAlgorithm](Common.md#consensusalgorithm)
- [consensusConfig](Common.md#consensusconfig)
- [consensusType](Common.md#consensustype)
- [copy](Common.md#copy)
- [dnsNetworks](Common.md#dnsnetworks)
- [eipBlock](Common.md#eipblock)
- [eipTimestamp](Common.md#eiptimestamp)
- [eips](Common.md#eips)
- [forkHash](Common.md#forkhash)
- [genesis](Common.md#genesis)
- [getHardforkBy](Common.md#gethardforkby)
- [gteHardfork](Common.md#gtehardfork)
- [hardfork](Common.md#hardfork)
- [hardforkBlock](Common.md#hardforkblock)
- [hardforkForForkHash](Common.md#hardforkforforkhash)
- [hardforkGteHardfork](Common.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](Common.md#hardforkisactiveonblock)
- [hardforkTTD](Common.md#hardforkttd)
- [hardforkTimestamp](Common.md#hardforktimestamp)
- [hardforks](Common.md#hardforks)
- [isActivatedEIP](Common.md#isactivatedeip)
- [networkId](Common.md#networkid)
- [nextHardforkBlockOrTimestamp](Common.md#nexthardforkblockortimestamp)
- [param](Common.md#param)
- [paramByBlock](Common.md#parambyblock)
- [paramByEIP](Common.md#parambyeip)
- [paramByHardfork](Common.md#parambyhardfork)
- [setChain](Common.md#setchain)
- [setEIPs](Common.md#seteips)
- [setForkHashes](Common.md#setforkhashes)
- [setHardfork](Common.md#sethardfork)
- [setHardforkBy](Common.md#sethardforkby)
- [\_getChainParams](Common.md#_getchainparams)
- [custom](Common.md#custom)
- [fromGethGenesis](Common.md#fromgethgenesis)
- [getInitializedChains](Common.md#getinitializedchains)
- [isSupportedChainId](Common.md#issupportedchainid)

## Constructors

### constructor

• **new Common**(`opts`): [`Common`](Common.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `CommonOpts` |

#### Returns

[`Common`](Common.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:69

## Properties

### DEFAULT\_HARDFORK

• `Readonly` **DEFAULT\_HARDFORK**: `string`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:20

___

### HARDFORK\_CHANGES

• `Protected` **HARDFORK\_CHANGES**: [`string`, `HardforkConfig`][]

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:28

___

### \_activatedEIPsCache

• `Protected` **\_activatedEIPsCache**: `number`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:27

___

### \_chainParams

• `Protected` **\_chainParams**: `ChainConfig`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:21

___

### \_customChains

• `Protected` **\_customChains**: `ChainConfig`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:24

___

### \_eips

• `Protected` **\_eips**: `number`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:23

___

### \_hardfork

• `Protected` **\_hardfork**: `string`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:22

___

### \_paramsCache

• `Protected` **\_paramsCache**: `ParamsCacheConfig`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:26

___

### customCrypto

• `Readonly` **customCrypto**: `CustomCrypto`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:25

___

### events

• **events**: `EventEmitter`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:29

## Methods

### \_buildActivatedEIPsCache

▸ **_buildActivatedEIPsCache**(): `void`

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:125

___

### \_buildParamsCache

▸ **_buildParamsCache**(): `void`

Build up a cache for all parameter values for the current HF and all activated EIPs

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:124

___

### \_calcForkHash

▸ **_calcForkHash**(`hardfork`, `genesisHash`): `string`

Internal helper function to calculate a fork hash

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |
| `genesisHash` | `Uint8Array` | Genesis block hash of the chain |

#### Returns

`string`

Fork hash as hex string

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:238

___

### \_getHardfork

▸ **_getHardfork**(`hardfork`): ``null`` \| `HardforkTransitionConfig`

Internal helper function, returns the params for the given hardfork for the chain set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |

#### Returns

``null`` \| `HardforkTransitionConfig`

Dictionary with hardfork params or null if hardfork not on chain

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:111

___

### \_mergeWithParamsCache

▸ **_mergeWithParamsCache**(`params`): `void`

Internal helper for _buildParamsCache()

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `HardforkConfig` \| `EIPConfig` |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:120

___

### activeOnBlock

▸ **activeOnBlock**(`blockNumber`): `boolean`

Alias to hardforkIsActiveOnBlock when hardfork is set

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `BigIntLike` |

#### Returns

`boolean`

True if HF is active on block number

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:186

___

### bootstrapNodes

▸ **bootstrapNodes**(): `BootstrapNodeConfig`[]

Returns bootstrap nodes for the current chain

#### Returns

`BootstrapNodeConfig`[]

Dict with bootstrap nodes

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:271

___

### chainId

▸ **chainId**(): `bigint`

Returns the Id of current chain

#### Returns

`bigint`

chain Id

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:286

___

### chainName

▸ **chainName**(): `string`

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:291

___

### consensusAlgorithm

▸ **consensusAlgorithm**(): `string`

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type,
"clique" for "poa" consensus type or
"casper" for "pos" consensus type.

Note: This value can update along a Hardfork.

#### Returns

`string`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:319

___

### consensusConfig

▸ **consensusConfig**(): `Object`

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain json files):

ethash: empty object
clique: period, epoch
casper: empty object

Note: This value can update along a Hardfork.

#### Returns

`Object`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:333

___

### consensusType

▸ **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Returns

`string`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:309

___

### copy

▸ **copy**(): [`Common`](Common.md)

Returns a deep copy of this [Common](Common.md) instance.

#### Returns

[`Common`](Common.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:339

___

### dnsNetworks

▸ **dnsNetworks**(): `string`[]

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:276

___

### eipBlock

▸ **eipBlock**(`eip`): ``null`` \| `bigint`

Returns the hardfork change block for eip

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eip` | `number` | EIP number |

#### Returns

``null`` \| `bigint`

Block number or null if unscheduled

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:213

___

### eipTimestamp

▸ **eipTimestamp**(`eip`): ``null`` \| `bigint`

Returns the scheduled timestamp of the EIP (if scheduled and scheduled by timestamp)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eip` | `number` | EIP number |

#### Returns

``null`` \| `bigint`

Scheduled timestamp. If this EIP is unscheduled, or the EIP is scheduled by block number or ttd, then it returns `null`.

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:219

___

### eips

▸ **eips**(): `number`[]

Returns the additionally activated EIPs
(by using the `eips` constructor option)

#### Returns

`number`[]

List of EIPs

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:302

___

### forkHash

▸ **forkHash**(`hardfork?`, `genesisHash?`): `string`

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |
| `genesisHash?` | `Uint8Array` | Genesis block hash of the chain, optional if already defined and not needed to be calculated |

#### Returns

`string`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:244

___

### genesis

▸ **genesis**(): `GenesisBlockConfig`

Returns the Genesis parameters of the current chain

#### Returns

`GenesisBlockConfig`

Genesis dictionary

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:261

___

### getHardforkBy

▸ **getHardforkBy**(`opts`): `string`

Returns the hardfork either based on block numer (older HFs) or
timestamp (Shanghai upwards).

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `HardforkByOpts` |

#### Returns

`string`

The name of the HF

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:93

___

### gteHardfork

▸ **gteHardfork**(`hardfork`): `boolean`

Alias to hardforkGteHardfork when hardfork is set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |

#### Returns

`boolean`

True if hardfork set is greater than hardfork provided

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:200

___

### hardfork

▸ **hardfork**(): `string`

Returns the hardfork set

#### Returns

`string`

Hardfork name

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:281

___

### hardforkBlock

▸ **hardforkBlock**(`hardfork?`): ``null`` \| `bigint`

Returns the hardfork change block for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `bigint`

Block number or null if unscheduled

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:206

___

### hardforkForForkHash

▸ **hardforkForForkHash**(`forkHash`): ``null`` \| `HardforkTransitionConfig`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forkHash` | `string` | Fork hash as a hex string |

#### Returns

``null`` \| `HardforkTransitionConfig`

Array with hardfork data (name, block, forkHash)

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:250

___

### hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`, `hardfork2`): `boolean`

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork1` | ``null`` \| `string` | Hardfork name or null (if set) |
| `hardfork2` | `string` | Hardfork name |

#### Returns

`boolean`

True if HF1 gte HF2

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:194

___

### hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(`hardfork`, `blockNumber`): `boolean`

Checks if set or provided hardfork is active on block number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | ``null`` \| `string` | Hardfork name or null (for HF set) |
| `blockNumber` | `BigIntLike` |  |

#### Returns

`boolean`

True if HF is active on block number

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:180

___

### hardforkTTD

▸ **hardforkTTD**(`hardfork?`): ``null`` \| `bigint`

Returns the hardfork change total difficulty (Merge HF) for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `bigint`

Total difficulty or null if no set

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:225

___

### hardforkTimestamp

▸ **hardforkTimestamp**(`hardfork?`): ``null`` \| `bigint`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hardfork?` | `string` |

#### Returns

``null`` \| `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:207

___

### hardforks

▸ **hardforks**(): `HardforkTransitionConfig`[]

Returns the hardforks for current chain

#### Returns

`HardforkTransitionConfig`[]

Array with arrays of hardforks

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:266

___

### isActivatedEIP

▸ **isActivatedEIP**(`eip`): `boolean`

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the CommonOpts.eips or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the CommonOpts.eips constructor option

#### Parameters

| Name | Type |
| :------ | :------ |
| `eip` | `number` |

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:173

___

### networkId

▸ **networkId**(): `bigint`

Returns the Id of current network

#### Returns

`bigint`

network Id

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:296

___

### nextHardforkBlockOrTimestamp

▸ **nextHardforkBlockOrTimestamp**(`hardfork?`): ``null`` \| `bigint`

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `bigint`

Block timestamp, number or null if not available

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:231

___

### param

▸ **param**(`topic`, `name`): `bigint`

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precedence.
Otherwise the parameter is taken from the latest applied HF with
a change on the respective parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:137

___

### paramByBlock

▸ **paramByBlock**(`topic`, `name`, `blockNumber`, `td?`, `timestamp?`): `bigint`

Returns a parameter for the hardfork active on block number or
optional provided total difficulty (Merge HF)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic |
| `name` | `string` | Parameter name |
| `blockNumber` | `BigIntLike` | Block number |
| `td?` | `BigIntLike` | Total difficulty * |
| `timestamp?` | `BigIntLike` | - |

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:163

___

### paramByEIP

▸ **paramByEIP**(`topic`, `name`, `eip`): `undefined` \| `bigint`

Returns a parameter corresponding to an EIP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `eip` | `number` | Number of the EIP |

#### Returns

`undefined` \| `bigint`

The value requested or `undefined` if not found

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:153

___

### paramByHardfork

▸ **paramByHardfork**(`topic`, `name`, `hardfork`): `bigint`

Returns the parameter corresponding to a hardfork

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `hardfork` | `string` | Hardfork name |

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:145

___

### setChain

▸ **setChain**(`chain`): `ChainConfig`

Sets the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | `string` \| `number` \| `bigint` \| `object` | String ('mainnet') or Number (1) chain representation. Or, a Dictionary of chain parameters for a private network. |

#### Returns

`ChainConfig`

The dictionary with parameters set as chain

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:76

___

### setEIPs

▸ **setEIPs**(`eips?`): `void`

Sets the active EIPs

#### Parameters

| Name | Type |
| :------ | :------ |
| `eips?` | `number`[] |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:116

___

### setForkHashes

▸ **setForkHashes**(`genesisHash`): `void`

Sets any missing forkHashes on the passed-in [Common](Common.md) instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisHash` | `Uint8Array` | The genesis block hash |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:256

___

### setHardfork

▸ **setHardfork**(`hardfork`): `void`

Sets the hardfork to get params for

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | String identifier (e.g. 'byzantium') or [Hardfork](../modules.md#hardfork) enum |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:81

___

### setHardforkBy

▸ **setHardforkBy**(`opts`): `string`

Sets a new hardfork either based on block numer (older HFs) or
timestamp (Shanghai upwards).

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `HardforkByOpts` |

#### Returns

`string`

The name of the HF set

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:105

___

### \_getChainParams

▸ **_getChainParams**(`chain`, `customChains?`): `ChainConfig`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` \| `number` \| `bigint` |
| `customChains?` | `ChainConfig`[] |

#### Returns

`ChainConfig`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:68

___

### custom

▸ **custom**(`chainParamsOrName`, `opts?`): [`Common`](Common.md)

Creates a [Common](Common.md) object for a custom chain, based on a standard one.

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainParamsOrName` | `Partial`\<`ChainConfig`\> \| `CustomChain` | Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain |
| `opts?` | `CustomCommonOpts` | Custom chain options to set the CustomCommonOpts.baseChain, selected CustomCommonOpts.hardfork and others |

#### Returns

[`Common`](Common.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:54

___

### fromGethGenesis

▸ **fromGethGenesis**(`genesisJson`, `to`): [`Common`](Common.md)

Static method to load and set common from a geth genesis json

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisJson` | `any` | json of geth configuration |
| `to` | `GethConfigOpts` | further configure the common instance |

#### Returns

[`Common`](Common.md)

Common

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:61

___

### getInitializedChains

▸ **getInitializedChains**(`customChains?`): `ChainsConfig`

#### Parameters

| Name | Type |
| :------ | :------ |
| `customChains?` | `ChainConfig`[] |

#### Returns

`ChainsConfig`

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:340

___

### isSupportedChainId

▸ **isSupportedChainId**(`chainId`): `boolean`

Static method to determine if a chainId is supported as a standard chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `bigint` | bigint id (`1`) of a standard chain |

#### Returns

`boolean`

boolean

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:67

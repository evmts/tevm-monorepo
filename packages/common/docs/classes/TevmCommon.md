[@tevm/common](../README.md) / [Exports](../modules.md) / TevmCommon

# Class: TevmCommon

## Hierarchy

- `Common`

  ↳ **`TevmCommon`**

## Table of contents

### Constructors

- [constructor](TevmCommon.md#constructor)

### Properties

- [DEFAULT\_HARDFORK](TevmCommon.md#default_hardfork)
- [HARDFORK\_CHANGES](TevmCommon.md#hardfork_changes)
- [\_activatedEIPsCache](TevmCommon.md#_activatedeipscache)
- [\_chainParams](TevmCommon.md#_chainparams)
- [\_customChains](TevmCommon.md#_customchains)
- [\_eips](TevmCommon.md#_eips)
- [\_hardfork](TevmCommon.md#_hardfork)
- [\_paramsCache](TevmCommon.md#_paramscache)
- [events](TevmCommon.md#events)

### Methods

- [\_buildActivatedEIPsCache](TevmCommon.md#_buildactivatedeipscache)
- [\_buildParamsCache](TevmCommon.md#_buildparamscache)
- [\_calcForkHash](TevmCommon.md#_calcforkhash)
- [\_getHardfork](TevmCommon.md#_gethardfork)
- [\_mergeWithParamsCache](TevmCommon.md#_mergewithparamscache)
- [activeOnBlock](TevmCommon.md#activeonblock)
- [bootstrapNodes](TevmCommon.md#bootstrapnodes)
- [chainId](TevmCommon.md#chainid)
- [chainName](TevmCommon.md#chainname)
- [consensusAlgorithm](TevmCommon.md#consensusalgorithm)
- [consensusConfig](TevmCommon.md#consensusconfig)
- [consensusType](TevmCommon.md#consensustype)
- [copy](TevmCommon.md#copy)
- [dnsNetworks](TevmCommon.md#dnsnetworks)
- [eipBlock](TevmCommon.md#eipblock)
- [eips](TevmCommon.md#eips)
- [forkHash](TevmCommon.md#forkhash)
- [genesis](TevmCommon.md#genesis)
- [getHardforkBy](TevmCommon.md#gethardforkby)
- [gteHardfork](TevmCommon.md#gtehardfork)
- [hardfork](TevmCommon.md#hardfork)
- [hardforkBlock](TevmCommon.md#hardforkblock)
- [hardforkForForkHash](TevmCommon.md#hardforkforforkhash)
- [hardforkGteHardfork](TevmCommon.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](TevmCommon.md#hardforkisactiveonblock)
- [hardforkTTD](TevmCommon.md#hardforkttd)
- [hardforkTimestamp](TevmCommon.md#hardforktimestamp)
- [hardforks](TevmCommon.md#hardforks)
- [isActivatedEIP](TevmCommon.md#isactivatedeip)
- [networkId](TevmCommon.md#networkid)
- [nextHardforkBlockOrTimestamp](TevmCommon.md#nexthardforkblockortimestamp)
- [param](TevmCommon.md#param)
- [paramByBlock](TevmCommon.md#parambyblock)
- [paramByEIP](TevmCommon.md#parambyeip)
- [paramByHardfork](TevmCommon.md#parambyhardfork)
- [setChain](TevmCommon.md#setchain)
- [setEIPs](TevmCommon.md#seteips)
- [setForkHashes](TevmCommon.md#setforkhashes)
- [setHardfork](TevmCommon.md#sethardfork)
- [setHardforkBy](TevmCommon.md#sethardforkby)
- [\_getChainParams](TevmCommon.md#_getchainparams)
- [custom](TevmCommon.md#custom)
- [fromGethGenesis](TevmCommon.md#fromgethgenesis)
- [getInitializedChains](TevmCommon.md#getinitializedchains)
- [isSupportedChainId](TevmCommon.md#issupportedchainid)

## Constructors

### constructor

• **new TevmCommon**(`opts`): [`TevmCommon`](TevmCommon.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `CommonOpts` |

#### Returns

[`TevmCommon`](TevmCommon.md)

#### Inherited from

Common.constructor

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:68

## Properties

### DEFAULT\_HARDFORK

• `Readonly` **DEFAULT\_HARDFORK**: `string`

#### Inherited from

Common.DEFAULT\_HARDFORK

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:20

___

### HARDFORK\_CHANGES

• `Protected` **HARDFORK\_CHANGES**: [`string`, `HardforkConfig`][]

#### Inherited from

Common.HARDFORK\_CHANGES

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:27

___

### \_activatedEIPsCache

• `Protected` **\_activatedEIPsCache**: `number`[]

#### Inherited from

Common.\_activatedEIPsCache

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:26

___

### \_chainParams

• `Protected` **\_chainParams**: `ChainConfig`

#### Inherited from

Common.\_chainParams

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:21

___

### \_customChains

• `Protected` **\_customChains**: `ChainConfig`[]

#### Inherited from

Common.\_customChains

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:24

___

### \_eips

• `Protected` **\_eips**: `number`[]

#### Inherited from

Common.\_eips

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:23

___

### \_hardfork

• `Protected` **\_hardfork**: `string`

#### Inherited from

Common.\_hardfork

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:22

___

### \_paramsCache

• `Protected` **\_paramsCache**: `ParamsCacheConfig`

#### Inherited from

Common.\_paramsCache

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:25

___

### events

• **events**: `EventEmitter`

#### Inherited from

Common.events

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:28

## Methods

### \_buildActivatedEIPsCache

▸ **_buildActivatedEIPsCache**(): `void`

#### Returns

`void`

#### Inherited from

Common.\_buildActivatedEIPsCache

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:124

___

### \_buildParamsCache

▸ **_buildParamsCache**(): `void`

Build up a cache for all parameter values for the current HF and all activated EIPs

#### Returns

`void`

#### Inherited from

Common.\_buildParamsCache

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:123

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

#### Inherited from

Common.\_calcForkHash

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:231

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

#### Inherited from

Common.\_getHardfork

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:110

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

#### Inherited from

Common.\_mergeWithParamsCache

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:119

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

#### Inherited from

Common.activeOnBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:185

___

### bootstrapNodes

▸ **bootstrapNodes**(): `BootstrapNodeConfig`[]

Returns bootstrap nodes for the current chain

#### Returns

`BootstrapNodeConfig`[]

Dict with bootstrap nodes

#### Inherited from

Common.bootstrapNodes

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:264

___

### chainId

▸ **chainId**(): `bigint`

Returns the Id of current chain

#### Returns

`bigint`

chain Id

#### Inherited from

Common.chainId

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:279

___

### chainName

▸ **chainName**(): `string`

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

#### Inherited from

Common.chainName

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:284

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

#### Inherited from

Common.consensusAlgorithm

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:312

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

#### Inherited from

Common.consensusConfig

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:326

___

### consensusType

▸ **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Returns

`string`

#### Inherited from

Common.consensusType

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:302

___

### copy

▸ **copy**(): `Common`

Returns a deep copy of this Common instance.

#### Returns

`Common`

#### Inherited from

Common.copy

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:332

___

### dnsNetworks

▸ **dnsNetworks**(): `string`[]

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

#### Inherited from

Common.dnsNetworks

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:269

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

#### Inherited from

Common.eipBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:212

___

### eips

▸ **eips**(): `number`[]

Returns the additionally activated EIPs
(by using the `eips` constructor option)

#### Returns

`number`[]

List of EIPs

#### Inherited from

Common.eips

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:295

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

#### Inherited from

Common.forkHash

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:237

___

### genesis

▸ **genesis**(): `GenesisBlockConfig`

Returns the Genesis parameters of the current chain

#### Returns

`GenesisBlockConfig`

Genesis dictionary

#### Inherited from

Common.genesis

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:254

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

#### Inherited from

Common.getHardforkBy

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:92

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

#### Inherited from

Common.gteHardfork

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:199

___

### hardfork

▸ **hardfork**(): `string`

Returns the hardfork set

#### Returns

`string`

Hardfork name

#### Inherited from

Common.hardfork

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:274

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

#### Inherited from

Common.hardforkBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:205

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

#### Inherited from

Common.hardforkForForkHash

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:243

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

#### Inherited from

Common.hardforkGteHardfork

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:193

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

#### Inherited from

Common.hardforkIsActiveOnBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:179

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

#### Inherited from

Common.hardforkTTD

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:218

___

### hardforkTimestamp

▸ **hardforkTimestamp**(`hardfork?`): ``null`` \| `bigint`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hardfork?` | `string` |

#### Returns

``null`` \| `bigint`

#### Inherited from

Common.hardforkTimestamp

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:206

___

### hardforks

▸ **hardforks**(): `HardforkTransitionConfig`[]

Returns the hardforks for current chain

#### Returns

`HardforkTransitionConfig`[]

Array with arrays of hardforks

#### Inherited from

Common.hardforks

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:259

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

#### Inherited from

Common.isActivatedEIP

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:172

___

### networkId

▸ **networkId**(): `bigint`

Returns the Id of current network

#### Returns

`bigint`

network Id

#### Inherited from

Common.networkId

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:289

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

#### Inherited from

Common.nextHardforkBlockOrTimestamp

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:224

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

#### Inherited from

Common.param

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:136

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

#### Inherited from

Common.paramByBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:162

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

#### Inherited from

Common.paramByEIP

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:152

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

#### Inherited from

Common.paramByHardfork

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:144

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

#### Inherited from

Common.setChain

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:75

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

#### Inherited from

Common.setEIPs

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:115

___

### setForkHashes

▸ **setForkHashes**(`genesisHash`): `void`

Sets any missing forkHashes on the passed-in Common instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisHash` | `Uint8Array` | The genesis block hash |

#### Returns

`void`

#### Inherited from

Common.setForkHashes

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:249

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

#### Inherited from

Common.setHardfork

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:80

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

#### Inherited from

Common.setHardforkBy

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:104

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

#### Inherited from

Common.\_getChainParams

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:67

___

### custom

▸ **custom**(`chainParamsOrName`, `opts?`): `Common`

Creates a Common object for a custom chain, based on a standard one.

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

`Common`

#### Inherited from

Common.custom

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:53

___

### fromGethGenesis

▸ **fromGethGenesis**(`genesisJson`, `to`): `Common`

Static method to load and set common from a geth genesis json

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisJson` | `any` | json of geth configuration |
| `to` | `GethConfigOpts` | further configure the common instance |

#### Returns

`Common`

Common

#### Inherited from

Common.fromGethGenesis

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:60

___

### getInitializedChains

▸ **getInitializedChains**(`customChains?`): `ChainsConfig`

#### Parameters

| Name | Type |
| :------ | :------ |
| `customChains?` | `ChainConfig`[] |

#### Returns

`ChainsConfig`

#### Inherited from

Common.getInitializedChains

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:333

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

#### Inherited from

Common.isSupportedChainId

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.1.0/node_modules/@ethereumjs/common/dist/esm/common.d.ts:66

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / EthjsMessage

# Class: EthjsMessage

## Constructors

### Constructor

> **new EthjsMessage**(`opts`): `Message`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `MessageOpts` |

#### Returns

`Message`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="_codeaddress"></a> `_codeAddress?` | `Address` | - |
| <a id="accesswitness"></a> `accessWitness?` | `BinaryTreeAccessWitnessInterface` | - |
| <a id="blobversionedhashes"></a> `blobVersionedHashes?` | `` `0x${string}` ``[] | List of versioned hashes if message is a blob transaction in the outer VM |
| <a id="caller"></a> `caller` | `Address` | - |
| <a id="chargecodeaccesses"></a> `chargeCodeAccesses?` | `boolean` | - |
| <a id="code"></a> `code?` | `Uint8Array`\<`ArrayBufferLike`\> \| `PrecompileFunc` | - |
| <a id="createdaddresses"></a> `createdAddresses?` | `Set`\<`` `0x${string}` ``\> | Map of addresses which were created (used in EIP 6780) |
| <a id="data"></a> `data` | `Uint8Array` | - |
| <a id="delegatecall"></a> `delegatecall` | `boolean` | - |
| <a id="depth"></a> `depth` | `number` | - |
| <a id="eof"></a> `eof?` | `EOFEnv` | - |
| <a id="eofcalldata"></a> `eofCallData?` | `Uint8Array`\<`ArrayBufferLike`\> | - |
| <a id="gaslimit"></a> `gasLimit` | `bigint` | - |
| <a id="gasrefund"></a> `gasRefund` | `bigint` | - |
| <a id="iscompiled"></a> `isCompiled` | `boolean` | - |
| <a id="iscreate"></a> `isCreate?` | `boolean` | - |
| <a id="isstatic"></a> `isStatic` | `boolean` | - |
| <a id="salt"></a> `salt?` | `Uint8Array`\<`ArrayBufferLike`\> | - |
| <a id="selfdestruct"></a> `selfdestruct?` | `Set`\<`` `0x${string}` ``\> | Set of addresses to selfdestruct. Key is the unprefixed address. |
| <a id="to"></a> `to?` | `Address` | - |
| <a id="value"></a> `value` | `bigint` | - |

## Accessors

### codeAddress

#### Get Signature

> **get** **codeAddress**(): `Address`

Note: should only be called in instances where `_codeAddress` or `to` is defined.

##### Returns

`Address`

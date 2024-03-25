[@tevm/trie](../README.md) / [Exports](../modules.md) / Trie

# Class: Trie

The basic trie interface, use with `import { Trie } from '@ethereumjs/trie'`.

## Table of contents

### Constructors

- [constructor](Trie.md#constructor)

### Properties

- [DEBUG](Trie.md#debug)
- [EMPTY\_TRIE\_ROOT](Trie.md#empty_trie_root)
- [\_db](Trie.md#_db)
- [\_debug](Trie.md#_debug)
- [\_hashLen](Trie.md#_hashlen)
- [\_lock](Trie.md#_lock)
- [\_opts](Trie.md#_opts)
- [\_root](Trie.md#_root)
- [debug](Trie.md#debug-1)
- [walkTrieIterable](Trie.md#walktrieiterable)

### Methods

- [\_createInitialNode](Trie.md#_createinitialnode)
- [\_deleteNode](Trie.md#_deletenode)
- [\_findDbNodes](Trie.md#_finddbnodes)
- [\_formatNode](Trie.md#_formatnode)
- [\_updateNode](Trie.md#_updatenode)
- [appliedKey](Trie.md#appliedkey)
- [batch](Trie.md#batch)
- [checkRoot](Trie.md#checkroot)
- [checkpoint](Trie.md#checkpoint)
- [commit](Trie.md#commit)
- [createProof](Trie.md#createproof)
- [createReadStream](Trie.md#createreadstream)
- [database](Trie.md#database)
- [del](Trie.md#del)
- [findPath](Trie.md#findpath)
- [flushCheckpoints](Trie.md#flushcheckpoints)
- [fromProof](Trie.md#fromproof)
- [get](Trie.md#get)
- [hasCheckpoints](Trie.md#hascheckpoints)
- [hash](Trie.md#hash)
- [lookupNode](Trie.md#lookupnode)
- [persistRoot](Trie.md#persistroot)
- [put](Trie.md#put)
- [revert](Trie.md#revert)
- [root](Trie.md#root)
- [saveStack](Trie.md#savestack)
- [shallowCopy](Trie.md#shallowcopy)
- [updateFromProof](Trie.md#updatefromproof)
- [verifyProof](Trie.md#verifyproof)
- [verifyPrunedIntegrity](Trie.md#verifyprunedintegrity)
- [verifyRangeProof](Trie.md#verifyrangeproof)
- [walkAllNodes](Trie.md#walkallnodes)
- [walkAllValueNodes](Trie.md#walkallvaluenodes)
- [walkTrie](Trie.md#walktrie)
- [create](Trie.md#create)
- [createFromProof](Trie.md#createfromproof)
- [fromProof](Trie.md#fromproof-1)
- [verifyProof](Trie.md#verifyproof-1)
- [verifyRangeProof](Trie.md#verifyrangeproof-1)

## Constructors

### constructor

• **new Trie**(`opts?`): [`Trie`](Trie.md)

Creates a new trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts?` | `TrieOpts` | Options for instantiating the trie Note: in most cases, the static [Trie.create](Trie.md#create) constructor should be used. It uses the same API but provides sensible defaults |

#### Returns

[`Trie`](Trie.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:30

## Properties

### DEBUG

• `Protected` **DEBUG**: `boolean`

Debug logging

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:21

___

### EMPTY\_TRIE\_ROOT

• **EMPTY\_TRIE\_ROOT**: `Uint8Array`

The root for an empty trie

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:14

___

### \_db

• `Protected` **\_db**: `CheckpointDB`

The backend DB

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:16

___

### \_debug

• `Protected` **\_debug**: `Debugger`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:22

___

### \_hashLen

• `Protected` **\_hashLen**: `number`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:17

___

### \_lock

• `Protected` **\_lock**: `Lock`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:18

___

### \_opts

• `Protected` `Readonly` **\_opts**: `TrieOptsWithDefaults`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:12

___

### \_root

• `Protected` **\_root**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:19

___

### debug

• `Protected` **debug**: (...`args`: `any`) => `void`

#### Type declaration

▸ (`...args`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

##### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:23

___

### walkTrieIterable

• **walkTrieIterable**: (`nodeHash`: `Uint8Array`, `currentKey?`: `number`[], `onFound?`: `OnFound`, `filter?`: `NodeFilter`, `visited?`: `Set`\<`string`\>) => `AsyncIterable`\<\{ `currentKey`: `number`[] ; `node`: `TrieNode`  }\>

#### Type declaration

▸ (`nodeHash`, `currentKey?`, `onFound?`, `filter?`, `visited?`): `AsyncIterable`\<\{ `currentKey`: `number`[] ; `node`: `TrieNode`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `nodeHash` | `Uint8Array` |
| `currentKey?` | `number`[] |
| `onFound?` | `OnFound` |
| `filter?` | `NodeFilter` |
| `visited?` | `Set`\<`string`\> |

##### Returns

`AsyncIterable`\<\{ `currentKey`: `number`[] ; `node`: `TrieNode`  }\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:169

## Methods

### \_createInitialNode

▸ **_createInitialNode**(`key`, `value`): `Promise`\<`void`\>

Creates the initial node from an empty tree.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:189

___

### \_deleteNode

▸ **_deleteNode**(`k`, `stack`): `Promise`\<`void`\>

Deletes a node from the trie.

#### Parameters

| Name | Type |
| :------ | :------ |
| `k` | `Uint8Array` |
| `stack` | `TrieNode`[] |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:207

___

### \_findDbNodes

▸ **_findDbNodes**(`onFound`): `Promise`\<`void`\>

Finds all nodes that are stored directly in the db
(some nodes are stored raw inside other nodes)
called by ScratchReadStream

#### Parameters

| Name | Type |
| :------ | :------ |
| `onFound` | `FoundNodeFunction` |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:271

___

### \_formatNode

▸ **_formatNode**(`node`, `topLevel`, `opStack`, `remove?`): `Uint8Array` \| (``null`` \| `EmbeddedNode`)[]

Formats node to be saved by `levelup.batch`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `TrieNode` | the node to format. |
| `topLevel` | `boolean` | if the node is at the top level. |
| `opStack` | `BatchDBOp`[] | the opStack to push the node's data. |
| `remove?` | `boolean` | whether to remove the node |

#### Returns

`Uint8Array` \| (``null`` \| `EmbeddedNode`)[]

The node's hash used as the key or the rawNode.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:225

___

### \_updateNode

▸ **_updateNode**(`k`, `value`, `keyRemainder`, `stack`): `Promise`\<`void`\>

Updates a node.

#### Parameters

| Name | Type |
| :------ | :------ |
| `k` | `Uint8Array` |
| `value` | `Uint8Array` |
| `keyRemainder` | `Nibbles` |
| `stack` | `TrieNode`[] |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:202

___

### appliedKey

▸ **appliedKey**(`key`): `Uint8Array`

Returns the key practically applied for trie construction
depending on the `useKeyHashing` option being set or not.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:277

___

### batch

▸ **batch**(`ops`, `skipKeyTransform?`): `Promise`\<`void`\>

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ops` | `BatchDBOp`[] |
| `skipKeyTransform?` | `boolean` |

#### Returns

`Promise`\<`void`\>

**`Example`**

```ts
const ops = [
   { type: 'del', key: Uint8Array.from('father') }
 , { type: 'put', key: Uint8Array.from('name'), value: Uint8Array.from('Yuri Irsenovich Kim') }
 , { type: 'put', key: Uint8Array.from('dob'), value: Uint8Array.from('16 February 1941') }
 , { type: 'put', key: Uint8Array.from('spouse'), value: Uint8Array.from('Kim Young-sook') }
 , { type: 'put', key: Uint8Array.from('occupation'), value: Uint8Array.from('Clown') }
]
await trie.batch(ops)
```

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:240

___

### checkRoot

▸ **checkRoot**(`root`): `Promise`\<`boolean`\>

Checks if a given root exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:130

___

### checkpoint

▸ **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:287

___

### commit

▸ **commit**(): `Promise`\<`void`\>

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

**`Throws`**

If not during a checkpoint phase

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:293

___

### createProof

▸ **createProof**(`key`): `Promise`\<`Proof`\>

Creates a proof from a trie and key that can be verified using [Trie.verifyProof](Trie.md#verifyproof-1). An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains
the encoded trie nodes from the root node to the leaf node storing state data. The returned proof will be in the format of an array that contains Uint8Arrays of
serialized branch, extension, and/or leaf nodes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | key to create a proof for |

#### Returns

`Promise`\<`Proof`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:93

___

### createReadStream

▸ **createReadStream**(): `TrieReadStream`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:246

___

### database

▸ **database**(`db?`, `valueEncoding?`): `CheckpointDB`

#### Parameters

| Name | Type |
| :------ | :------ |
| `db?` | `DB`\<`string`, `string` \| `Uint8Array`\> |
| `valueEncoding?` | `ValueEncoding` |

#### Returns

`CheckpointDB`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:122

___

### del

▸ **del**(`key`, `skipKeyTransform?`): `Promise`\<`void`\>

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `skipKeyTransform?` | `boolean` |

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is deleted.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:152

___

### findPath

▸ **findPath**(`key`, `throwIfMissing?`, `partialPath?`): `Promise`\<`Path`\>

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | the search key |
| `throwIfMissing?` | `boolean` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |
| `partialPath?` | `Object` | - |
| `partialPath.stack` | `TrieNode`[] | - |

#### Returns

`Promise`\<`Path`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:159

___

### flushCheckpoints

▸ **flushCheckpoints**(): `void`

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:303

___

### fromProof

▸ **fromProof**(`proof`): `Promise`\<`void`\>

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. An EIP-1186 proof contains the encoded trie nodes from the root
node to the leaf node storing state data. This function does not check if the proof has the same expected root. A static version of this function exists
with the same name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Proof` | an EIP-1186 proof to update the trie from |

#### Returns

`Promise`\<`void`\>

**`Deprecated`**

Use `updateFromProof`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:120

___

### get

▸ **get**(`key`, `throwIfMissing?`): `Promise`\<``null`` \| `Uint8Array`\>

Gets a value given a `key`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | the key to search for |
| `throwIfMissing?` | `boolean` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`\<``null`` \| `Uint8Array`\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:137

___

### hasCheckpoints

▸ **hasCheckpoints**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:282

___

### hash

▸ **hash**(`msg`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:278

___

### lookupNode

▸ **lookupNode**(`node`): `Promise`\<`TrieNode`\>

Retrieves a node from db by hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Uint8Array` \| `Uint8Array`[] |

#### Returns

`Promise`\<`TrieNode`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:193

___

### persistRoot

▸ **persistRoot**(): `Promise`\<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:264

___

### put

▸ **put**(`key`, `value`, `skipKeyTransform?`): `Promise`\<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `value` | ``null`` \| `Uint8Array` |
| `skipKeyTransform?` | `boolean` |

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is stored.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:145

___

### revert

▸ **revert**(): `Promise`\<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:299

___

### root

▸ **root**(`value?`): `Uint8Array`

Gets and/or Sets the current root of the `trie`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | ``null`` \| `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:126

___

### saveStack

▸ **saveStack**(`key`, `stack`, `opStack`): `Promise`\<`void`\>

Saves a stack of nodes to the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Nibbles` | the key. Should follow the stack |
| `stack` | `TrieNode`[] | a stack of nodes to the value given by the key |
| `opStack` | `BatchDBOp`[] | a stack of levelup operations to commit at the end of this function |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:215

___

### shallowCopy

▸ **shallowCopy**(`includeCheckpoints?`, `opts?`): [`Trie`](Trie.md)

Returns a copy of the underlying trie.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will by default
not recreate a new LRU cache but initialize with cache
being deactivated. This behavior can be overwritten by
explicitly setting `cacheSize` as an option on the method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `includeCheckpoints?` | `boolean` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |
| `opts?` | `TrieShallowCopyOpts` | - |

#### Returns

[`Trie`](Trie.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:260

___

### updateFromProof

▸ **updateFromProof**(`proof`, `shouldVerifyRoot?`): `Promise`\<`undefined` \| `Uint8Array`\>

Updates a trie from a proof by putting all the nodes in the proof into the trie. If a trie is being updated with multiple proofs, {@param shouldVerifyRoot} can
be passed as false in order to not immediately throw on an unexpected root, so that root verification can happen after all proofs and their nodes have been added.
An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Proof` | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof to update the trie from. |
| `shouldVerifyRoot?` | `boolean` | If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case. |

#### Returns

`Promise`\<`undefined` \| `Uint8Array`\>

The root of the proof

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:102

___

### verifyProof

▸ **verifyProof**(`rootHash`, `key`, `proof`): `Promise`\<``null`` \| `Uint8Array`\>

Verifies a proof by putting all of its nodes into a trie and attempting to get the proven key. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof
contains the encoded trie nodes from the root node to the leaf node storing state data. A static version of this function exists with the same name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootHash` | `Uint8Array` | Root hash of the trie that this proof was created from and is being verified for |
| `key` | `Uint8Array` | Key that is being verified and that the proof is created for |
| `proof` | `Proof` | an EIP-1186 proof to verify the key against |

#### Returns

`Promise`\<``null`` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

**`Throws`**

If proof is found to be invalid.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:112

___

### verifyPrunedIntegrity

▸ **verifyPrunedIntegrity**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:241

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`\<`boolean`\>

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](Trie.md#verifyrangeproof-1). A static
version of this function also exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootHash` | `Uint8Array` | root hash of state trie this proof is being verified against. |
| `firstKey` | ``null`` \| `Uint8Array` | first key of range being proven. |
| `lastKey` | ``null`` \| `Uint8Array` | last key of range being proven. |
| `keys` | `Uint8Array`[] | key list of leaf data being proven. |
| `values` | `Uint8Array`[] | value list of leaf data being proven, one-to-one correspondence with keys. |
| `proof` | ``null`` \| `Uint8Array`[] | proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well |

#### Returns

`Promise`\<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:86

___

### walkAllNodes

▸ **walkAllNodes**(`onFound`): `Promise`\<`void`\>

Executes a callback for each node in the trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onFound` | `OnFound` | callback to call when a node is found. |

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:178

___

### walkAllValueNodes

▸ **walkAllValueNodes**(`onFound`): `Promise`\<`void`\>

Executes a callback for each value node in the trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onFound` | `OnFound` | callback to call when a node is found. |

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:184

___

### walkTrie

▸ **walkTrie**(`root`, `onFound`): `Promise`\<`void`\>

Walks a trie until finished.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `root` | `Uint8Array` |  |
| `onFound` | `FoundNodeFunction` | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:168

___

### create

▸ **create**(`opts?`): `Promise`\<[`Trie`](Trie.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `TrieOpts` |

#### Returns

`Promise`\<[`Trie`](Trie.md)\>

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:121

___

### createFromProof

▸ **createFromProof**(`proof`, `trieOpts?`, `shouldVerifyRoot?`): `Promise`\<[`Trie`](Trie.md)\>

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. A proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Proof` | an EIP-1186 proof to create trie from |
| `trieOpts?` | `TrieOpts` | trie opts to be applied to returned trie |
| `shouldVerifyRoot?` | `boolean` | If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case. |

#### Returns

`Promise`\<[`Trie`](Trie.md)\>

new trie created from given proof

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:39

___

### fromProof

▸ **fromProof**(`proof`, `opts?`): `Promise`\<[`Trie`](Trie.md)\>

Static version of fromProof function. If a root is provided in the opts param, the proof will be checked to have the same expected root. An
(EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Proof` | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data. |
| `opts?` | `TrieOpts` | - |

#### Returns

`Promise`\<[`Trie`](Trie.md)\>

**`Deprecated`**

Use `createFromProof`

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:72

___

### verifyProof

▸ **verifyProof**(`key`, `proof`, `opts?`): `Promise`\<``null`` \| `Uint8Array`\>

Static version of verifyProof function with the same behavior. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` | Key that is being verified and that the proof is created for |
| `proof` | `Proof` | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data. |
| `opts?` | `TrieOpts` | optional, the opts may include a custom hashing function to use with the trie for proof verification |

#### Returns

`Promise`\<``null`` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

**`Throws`**

If proof is found to be invalid.

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:50

___

### verifyRangeProof

▸ **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`, `opts?`): `Promise`\<`boolean`\>

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](Trie.md#verifyrangeproof-1). A static
version of this function also exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootHash` | `Uint8Array` | root hash of state trie this proof is being verified against. |
| `firstKey` | ``null`` \| `Uint8Array` | first key of range being proven. |
| `lastKey` | ``null`` \| `Uint8Array` | last key of range being proven. |
| `keys` | `Uint8Array`[] | key list of leaf data being proven. |
| `values` | `Uint8Array`[] | value list of leaf data being proven, one-to-one correspondence with keys. |
| `proof` | ``null`` \| `Uint8Array`[] | proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well |
| `opts?` | `TrieOpts` | optional, the opts may include a custom hashing function to use with the trie for proof verification |

#### Returns

`Promise`\<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

node_modules/.pnpm/@ethereumjs+trie@6.2.0/node_modules/@ethereumjs/trie/dist/esm/trie.d.ts:65

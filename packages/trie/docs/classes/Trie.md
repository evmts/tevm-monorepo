[**@tevm/trie**](../README.md)

***

[@tevm/trie](../globals.md) / Trie

# Class: Trie

The basic trie interface, use with `import { Trie } from '@ethereumjs/trie'`.

## Constructors

### Constructor

> **new Trie**(`opts?`): `Trie`

Creates a new trie.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts?` | `TrieOpts` | Options for instantiating the trie Note: in most cases, the static [Trie.create](#create) constructor should be used. It uses the same API but provides sensible defaults |

#### Returns

`Trie`

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="_db"></a> `_db` | `protected` | `CheckpointDB` | The backend DB |
| <a id="_debug"></a> `_debug` | `protected` | `Debugger` | - |
| <a id="_hashlen"></a> `_hashLen` | `protected` | `number` | - |
| <a id="_lock"></a> `_lock` | `protected` | `Lock` | - |
| <a id="_opts"></a> `_opts` | `readonly` | `TrieOptsWithDefaults` | - |
| <a id="_root"></a> `_root` | `protected` | `Uint8Array` | - |
| <a id="debug"></a> `debug` | `protected` | (...`args`) => `void` | - |
| <a id="debug-1"></a> `DEBUG` | `protected` | `boolean` | Debug logging |
| <a id="empty_trie_root"></a> `EMPTY_TRIE_ROOT` | `public` | `Uint8Array` | The root for an empty trie |
| <a id="walktrieiterable"></a> `walkTrieIterable` | `public` | (`nodeHash`, `currentKey?`, `onFound?`, `filter?`, `visited?`) => `AsyncIterable`\<\{ `currentKey`: `number`[]; `node`: `TrieNode`; \}\> | - |

## Methods

### appliedKey()

> `protected` **appliedKey**(`key`): `Uint8Array`

Returns the key practically applied for trie construction
depending on the `useKeyHashing` option being set or not.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `Uint8Array` | - |

#### Returns

`Uint8Array`

***

### batch()

> **batch**(`ops`, `skipKeyTransform?`): `Promise`\<`void`\>

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ops` | `BatchDBOp`[] | - |
| `skipKeyTransform?` | `boolean` | - |

#### Returns

`Promise`\<`void`\>

#### Example

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

***

### checkpoint()

> **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Checks if a given root exists.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### createProof()

> **createProof**(`key`): `Promise`\<`Proof`\>

Creates a proof from a trie and key that can be verified using [Trie.verifyProof](#verifyproof-1). An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains
the encoded trie nodes from the root node to the leaf node storing state data. The returned proof will be in the format of an array that contains Uint8Arrays of
serialized branch, extension, and/or leaf nodes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `Uint8Array` | key to create a proof for |

#### Returns

`Promise`\<`Proof`\>

***

### createReadStream()

> **createReadStream**(): `TrieReadStream`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

***

### database()

> **database**(`db?`, `valueEncoding?`): `CheckpointDB`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `db?` | `DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\> |
| `valueEncoding?` | `ValueEncoding` |

#### Returns

`CheckpointDB`

***

### del()

> **del**(`key`, `skipKeyTransform?`): `Promise`\<`void`\>

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `Uint8Array` | - |
| `skipKeyTransform?` | `boolean` | - |

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is deleted.

***

### findPath()

> **findPath**(`key`, `throwIfMissing?`, `partialPath?`): `Promise`\<`Path`\>

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `Uint8Array` | the search key |
| `throwIfMissing?` | `boolean` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |
| `partialPath?` | \{ `stack`: `TrieNode`[]; \} | - |
| `partialPath.stack?` | `TrieNode`[] | - |

#### Returns

`Promise`\<`Path`\>

***

### flushCheckpoints()

> **flushCheckpoints**(): `void`

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### ~~fromProof()~~

> **fromProof**(`proof`): `Promise`\<`void`\>

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. An EIP-1186 proof contains the encoded trie nodes from the root
node to the leaf node storing state data. This function does not check if the proof has the same expected root. A static version of this function exists
with the same name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `proof` | `Proof` | an EIP-1186 proof to update the trie from |

#### Returns

`Promise`\<`void`\>

#### Deprecated

Use `updateFromProof`

***

### get()

> **get**(`key`, `throwIfMissing?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Gets a value given a `key`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `Uint8Array` | the key to search for |
| `throwIfMissing?` | `boolean` | if true, throws if any nodes are missing. Used for verifying proofs. (default: false) |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

***

### hash()

> `protected` **hash**(`msg`): `Uint8Array`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `msg` | `Uint8Array` |

#### Returns

`Uint8Array`

***

### lookupNode()

> **lookupNode**(`node`): `Promise`\<`TrieNode`\>

Retrieves a node from db by hash.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[] |

#### Returns

`Promise`\<`TrieNode`\>

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `value`, `skipKeyTransform?`): `Promise`\<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `Uint8Array` | - |
| `value` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` | - |
| `skipKeyTransform?` | `boolean` | - |

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value?`): `Uint8Array`

Gets and/or Sets the current root of the `trie`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value?` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` |

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`key`, `stack`, `opStack`): `Promise`\<`void`\>

Saves a stack of nodes to the database.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `Nibbles` | the key. Should follow the stack |
| `stack` | `TrieNode`[] | a stack of nodes to the value given by the key |
| `opStack` | `BatchDBOp`[] | a stack of levelup operations to commit at the end of this function |

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints?`, `opts?`): `Trie`

Returns a copy of the underlying trie.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will by default
not recreate a new LRU cache but initialize with cache
being deactivated. This behavior can be overwritten by
explicitly setting `cacheSize` as an option on the method.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `includeCheckpoints?` | `boolean` | If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db. |
| `opts?` | `TrieShallowCopyOpts` | - |

#### Returns

`Trie`

***

### updateFromProof()

> **updateFromProof**(`proof`, `shouldVerifyRoot?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

Updates a trie from a proof by putting all the nodes in the proof into the trie. If a trie is being updated with multiple proofs, shouldVerifyRoot can
be passed as false in order to not immediately throw on an unexpected root, so that root verification can happen after all proofs and their nodes have been added.
An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `proof` | `Proof` | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof to update the trie from. |
| `shouldVerifyRoot?` | `boolean` | If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case. |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

The root of the proof

***

### verifyProof()

> **verifyProof**(`rootHash`, `key`, `proof`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Verifies a proof by putting all of its nodes into a trie and attempting to get the proven key. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof
contains the encoded trie nodes from the root node to the leaf node storing state data. A static version of this function exists with the same name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootHash` | `Uint8Array` | Root hash of the trie that this proof was created from and is being verified for |
| `key` | `Uint8Array` | Key that is being verified and that the proof is created for |
| `proof` | `Proof` | an EIP-1186 proof to verify the key against |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.

***

### verifyPrunedIntegrity()

> **verifyPrunedIntegrity**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

***

### verifyRangeProof()

> **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`\<`boolean`\>

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](#verifyrangeproof-1). A static
version of this function also exists.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootHash` | `Uint8Array` | root hash of state trie this proof is being verified against. |
| `firstKey` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` | first key of range being proven. |
| `lastKey` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` | last key of range being proven. |
| `keys` | `Uint8Array`\<`ArrayBufferLike`\>[] | key list of leaf data being proven. |
| `values` | `Uint8Array`\<`ArrayBufferLike`\>[] | value list of leaf data being proven, one-to-one correspondence with keys. |
| `proof` | `Uint8Array`\<`ArrayBufferLike`\>[] \| `null` | proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well |

#### Returns

`Promise`\<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

***

### walkAllNodes()

> **walkAllNodes**(`onFound`): `Promise`\<`void`\>

Executes a callback for each node in the trie.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `onFound` | `OnFound` | callback to call when a node is found. |

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

***

### walkAllValueNodes()

> **walkAllValueNodes**(`onFound`): `Promise`\<`void`\>

Executes a callback for each value node in the trie.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `onFound` | `OnFound` | callback to call when a node is found. |

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

***

### walkTrie()

> **walkTrie**(`root`, `onFound`): `Promise`\<`void`\>

Walks a trie until finished.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `root` | `Uint8Array` | - |
| `onFound` | `FoundNodeFunction` | callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves. |

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

***

### create()

> `static` **create**(`opts?`): `Promise`\<`Trie`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | `TrieOpts` |

#### Returns

`Promise`\<`Trie`\>

***

### createFromProof()

> `static` **createFromProof**(`proof`, `trieOpts?`, `shouldVerifyRoot?`): `Promise`\<`Trie`\>

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. A proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `proof` | `Proof` | an EIP-1186 proof to create trie from |
| `trieOpts?` | `TrieOpts` | trie opts to be applied to returned trie |
| `shouldVerifyRoot?` | `boolean` | If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case. |

#### Returns

`Promise`\<`Trie`\>

new trie created from given proof

***

### ~~fromProof()~~

> `static` **fromProof**(`proof`, `opts?`): `Promise`\<`Trie`\>

Static version of fromProof function. If a root is provided in the opts param, the proof will be checked to have the same expected root. An
(EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `proof` | `Proof` | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data. |
| `opts?` | `TrieOpts` | - |

#### Returns

`Promise`\<`Trie`\>

#### Deprecated

Use `createFromProof`

***

### verifyProof()

> `static` **verifyProof**(`key`, `proof`, `opts?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Static version of verifyProof function with the same behavior. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `Uint8Array` | Key that is being verified and that the proof is created for |
| `proof` | `Proof` | An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data. |
| `opts?` | `TrieOpts` | optional, the opts may include a custom hashing function to use with the trie for proof verification |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.

***

### verifyRangeProof()

> `static` **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`, `opts?`): `Promise`\<`boolean`\>

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](#verifyrangeproof-1). A static
version of this function also exists.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootHash` | `Uint8Array` | root hash of state trie this proof is being verified against. |
| `firstKey` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` | first key of range being proven. |
| `lastKey` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` | last key of range being proven. |
| `keys` | `Uint8Array`\<`ArrayBufferLike`\>[] | key list of leaf data being proven. |
| `values` | `Uint8Array`\<`ArrayBufferLike`\>[] | value list of leaf data being proven, one-to-one correspondence with keys. |
| `proof` | `Uint8Array`\<`ArrayBufferLike`\>[] \| `null` | proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well |
| `opts?` | `TrieOpts` | optional, the opts may include a custom hashing function to use with the trie for proof verification |

#### Returns

`Promise`\<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

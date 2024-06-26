---
editUrl: false
next: false
prev: false
title: "Trie"
---

The basic trie interface, use with `import { Trie } from '@ethereumjs/trie'`.

## Constructors

### new Trie()

> **new Trie**(`opts`?): [`Trie`](/reference/tevm/trie/classes/trie/)

Creates a new trie.

#### Parameters

• **opts?**: `TrieOpts`

Options for instantiating the trie

Note: in most cases, the static [Trie.create](../../../../../../../reference/tevm/trie/classes/trie/#create) constructor should be used.  It uses the same API but provides sensible defaults

#### Returns

[`Trie`](/reference/tevm/trie/classes/trie/)

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:30

## Properties

### DEBUG

> `protected` **DEBUG**: `boolean`

Debug logging

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:21

***

### EMPTY\_TRIE\_ROOT

> **EMPTY\_TRIE\_ROOT**: `Uint8Array`

The root for an empty trie

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:14

***

### \_db

> `protected` **\_db**: `CheckpointDB`

The backend DB

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:16

***

### \_debug

> `protected` **\_debug**: `Debugger`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:22

***

### \_hashLen

> `protected` **\_hashLen**: `number`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:17

***

### \_lock

> `protected` **\_lock**: `Lock`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:18

***

### \_opts

> `protected` `readonly` **\_opts**: `TrieOptsWithDefaults`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:12

***

### \_root

> `protected` **\_root**: `Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:19

***

### debug()

> `protected` **debug**: (...`args`) => `void`

#### Parameters

• ...**args**: `any`

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:23

***

### walkTrieIterable()

> **walkTrieIterable**: (`nodeHash`, `currentKey`?, `onFound`?, `filter`?, `visited`?) => `AsyncIterable`\<`object`\>

#### Parameters

• **nodeHash**: `Uint8Array`

• **currentKey?**: `number`[]

• **onFound?**: `OnFound`

• **filter?**: `NodeFilter`

• **visited?**: `Set`\<`string`\>

#### Returns

`AsyncIterable`\<`object`\>

##### currentKey

> **currentKey**: `number`[]

##### node

> **node**: `TrieNode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:169

## Methods

### appliedKey()

> `protected` **appliedKey**(`key`): `Uint8Array`

Returns the key practically applied for trie construction
depending on the `useKeyHashing` option being set or not.

#### Parameters

• **key**: `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:277

***

### batch()

> **batch**(`ops`, `skipKeyTransform`?): `Promise`\<`void`\>

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

• **ops**: [`BatchDbOp`](/reference/tevm/utils/type-aliases/batchdbop/)[]

• **skipKeyTransform?**: `boolean`

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:240

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Checks if a given root exists.

#### Parameters

• **root**: `Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:130

***

### checkpoint()

> **checkpoint**(): `void`

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:287

***

### commit()

> **commit**(): `Promise`\<`void`\>

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:293

***

### createProof()

> **createProof**(`key`): `Promise`\<`Proof`\>

Creates a proof from a trie and key that can be verified using [Trie.verifyProof](../../../../../../../reference/tevm/trie/classes/trie/#verifyproof-1). An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains
the encoded trie nodes from the root node to the leaf node storing state data. The returned proof will be in the format of an array that contains Uint8Arrays of
serialized branch, extension, and/or leaf nodes.

#### Parameters

• **key**: `Uint8Array`

key to create a proof for

#### Returns

`Promise`\<`Proof`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:93

***

### createReadStream()

> **createReadStream**(): `TrieReadStream`

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:246

***

### database()

> **database**(`db`?, `valueEncoding`?): `CheckpointDB`

#### Parameters

• **db?**: [`Db`](/reference/tevm/utils/interfaces/db/)\<`string`, `string` \| `Uint8Array`\>

• **valueEncoding?**: [`ValueEncoding`](/reference/tevm/utils/enumerations/valueencoding/)

#### Returns

`CheckpointDB`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:122

***

### del()

> **del**(`key`, `skipKeyTransform`?): `Promise`\<`void`\>

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

• **key**: `Uint8Array`

• **skipKeyTransform?**: `boolean`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is deleted.

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:152

***

### findPath()

> **findPath**(`key`, `throwIfMissing`?, `partialPath`?): `Promise`\<`Path`\>

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

• **key**: `Uint8Array`

the search key

• **throwIfMissing?**: `boolean`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

• **partialPath?**

• **partialPath.stack?**: `TrieNode`[]

#### Returns

`Promise`\<`Path`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:159

***

### flushCheckpoints()

> **flushCheckpoints**(): `void`

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:303

***

### ~~fromProof()~~

> **fromProof**(`proof`): `Promise`\<`void`\>

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. An EIP-1186 proof contains the encoded trie nodes from the root
node to the leaf node storing state data. This function does not check if the proof has the same expected root. A static version of this function exists
with the same name.

:::caution[Deprecated]
Use `updateFromProof`
:::

#### Parameters

• **proof**: `Proof`

an EIP-1186 proof to update the trie from

#### Returns

`Promise`\<`void`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:120

***

### get()

> **get**(`key`, `throwIfMissing`?): `Promise`\<`null` \| `Uint8Array`\>

Gets a value given a `key`

#### Parameters

• **key**: `Uint8Array`

the key to search for

• **throwIfMissing?**: `boolean`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:137

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Is the trie during a checkpoint phase?

#### Returns

`boolean`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:282

***

### hash()

> `protected` **hash**(`msg`): `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:278

***

### lookupNode()

> **lookupNode**(`node`): `Promise`\<`TrieNode`\>

Retrieves a node from db by hash.

#### Parameters

• **node**: `Uint8Array` \| `Uint8Array`[]

#### Returns

`Promise`\<`TrieNode`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:193

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:264

***

### put()

> **put**(`key`, `value`, `skipKeyTransform`?): `Promise`\<`void`\>

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

• **key**: `Uint8Array`

• **value**: `null` \| `Uint8Array`

• **skipKeyTransform?**: `boolean`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is stored.

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:145

***

### revert()

> **revert**(): `Promise`\<`void`\>

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:299

***

### root()

> **root**(`value`?): `Uint8Array`

Gets and/or Sets the current root of the `trie`

#### Parameters

• **value?**: `null` \| `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:126

***

### saveStack()

> **saveStack**(`key`, `stack`, `opStack`): `Promise`\<`void`\>

Saves a stack of nodes to the database.

#### Parameters

• **key**: `Nibbles`

the key. Should follow the stack

• **stack**: `TrieNode`[]

a stack of nodes to the value given by the key

• **opStack**: [`BatchDbOp`](/reference/tevm/utils/type-aliases/batchdbop/)[]

a stack of levelup operations to commit at the end of this function

#### Returns

`Promise`\<`void`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:215

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints`?, `opts`?): [`Trie`](/reference/tevm/trie/classes/trie/)

Returns a copy of the underlying trie.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will by default
not recreate a new LRU cache but initialize with cache
being deactivated. This behavior can be overwritten by
explicitly setting `cacheSize` as an option on the method.

#### Parameters

• **includeCheckpoints?**: `boolean`

If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.

• **opts?**: `TrieShallowCopyOpts`

#### Returns

[`Trie`](/reference/tevm/trie/classes/trie/)

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:260

***

### updateFromProof()

> **updateFromProof**(`proof`, `shouldVerifyRoot`?): `Promise`\<`undefined` \| `Uint8Array`\>

Updates a trie from a proof by putting all the nodes in the proof into the trie. If a trie is being updated with multiple proofs, {@param shouldVerifyRoot} can
be passed as false in order to not immediately throw on an unexpected root, so that root verification can happen after all proofs and their nodes have been added.
An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

#### Parameters

• **proof**: `Proof`

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof to update the trie from.

• **shouldVerifyRoot?**: `boolean`

If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case.

#### Returns

`Promise`\<`undefined` \| `Uint8Array`\>

The root of the proof

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:102

***

### verifyProof()

> **verifyProof**(`rootHash`, `key`, `proof`): `Promise`\<`null` \| `Uint8Array`\>

Verifies a proof by putting all of its nodes into a trie and attempting to get the proven key. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof
contains the encoded trie nodes from the root node to the leaf node storing state data. A static version of this function exists with the same name.

#### Parameters

• **rootHash**: `Uint8Array`

Root hash of the trie that this proof was created from and is being verified for

• **key**: `Uint8Array`

Key that is being verified and that the proof is created for

• **proof**: `Proof`

an EIP-1186 proof to verify the key against

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:112

***

### verifyPrunedIntegrity()

> **verifyPrunedIntegrity**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:241

***

### verifyRangeProof()

> **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`\<`boolean`\>

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](../../../../../../../reference/tevm/trie/classes/trie/#verifyrangeproof-1). A static
version of this function also exists.

#### Parameters

• **rootHash**: `Uint8Array`

root hash of state trie this proof is being verified against.

• **firstKey**: `null` \| `Uint8Array`

first key of range being proven.

• **lastKey**: `null` \| `Uint8Array`

last key of range being proven.

• **keys**: `Uint8Array`[]

key list of leaf data being proven.

• **values**: `Uint8Array`[]

value list of leaf data being proven, one-to-one correspondence with keys.

• **proof**: `null` \| `Uint8Array`[]

proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well

#### Returns

`Promise`\<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:86

***

### walkAllNodes()

> **walkAllNodes**(`onFound`): `Promise`\<`void`\>

Executes a callback for each node in the trie.

#### Parameters

• **onFound**: `OnFound`

callback to call when a node is found.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:178

***

### walkAllValueNodes()

> **walkAllValueNodes**(`onFound`): `Promise`\<`void`\>

Executes a callback for each value node in the trie.

#### Parameters

• **onFound**: `OnFound`

callback to call when a node is found.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:184

***

### walkTrie()

> **walkTrie**(`root`, `onFound`): `Promise`\<`void`\>

Walks a trie until finished.

#### Parameters

• **root**: `Uint8Array`

• **onFound**: `FoundNodeFunction`

callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:168

***

### create()

> `static` **create**(`opts`?): `Promise`\<[`Trie`](/reference/tevm/trie/classes/trie/)\>

#### Parameters

• **opts?**: `TrieOpts`

#### Returns

`Promise`\<[`Trie`](/reference/tevm/trie/classes/trie/)\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:121

***

### createFromProof()

> `static` **createFromProof**(`proof`, `trieOpts`?, `shouldVerifyRoot`?): `Promise`\<[`Trie`](/reference/tevm/trie/classes/trie/)\>

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. A proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

• **proof**: `Proof`

an EIP-1186 proof to create trie from

• **trieOpts?**: `TrieOpts`

trie opts to be applied to returned trie

• **shouldVerifyRoot?**: `boolean`

If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case.

#### Returns

`Promise`\<[`Trie`](/reference/tevm/trie/classes/trie/)\>

new trie created from given proof

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:39

***

### ~~fromProof()~~

> `static` **fromProof**(`proof`, `opts`?): `Promise`\<[`Trie`](/reference/tevm/trie/classes/trie/)\>

Static version of fromProof function. If a root is provided in the opts param, the proof will be checked to have the same expected root. An
(EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

:::caution[Deprecated]
Use `createFromProof`
:::

#### Parameters

• **proof**: `Proof`

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

• **opts?**: `TrieOpts`

#### Returns

`Promise`\<[`Trie`](/reference/tevm/trie/classes/trie/)\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:72

***

### verifyProof()

> `static` **verifyProof**(`key`, `proof`, `opts`?): `Promise`\<`null` \| `Uint8Array`\>

Static version of verifyProof function with the same behavior. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

• **key**: `Uint8Array`

Key that is being verified and that the proof is created for

• **proof**: `Proof`

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

• **opts?**: `TrieOpts`

optional, the opts may include a custom hashing function to use with the trie for proof verification

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:50

***

### verifyRangeProof()

> `static` **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`, `opts`?): `Promise`\<`boolean`\>

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](../../../../../../../reference/tevm/trie/classes/trie/#verifyrangeproof-1). A static
version of this function also exists.

#### Parameters

• **rootHash**: `Uint8Array`

root hash of state trie this proof is being verified against.

• **firstKey**: `null` \| `Uint8Array`

first key of range being proven.

• **lastKey**: `null` \| `Uint8Array`

last key of range being proven.

• **keys**: `Uint8Array`[]

key list of leaf data being proven.

• **values**: `Uint8Array`[]

value list of leaf data being proven, one-to-one correspondence with keys.

• **proof**: `null` \| `Uint8Array`[]

proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well

• **opts?**: `TrieOpts`

optional, the opts may include a custom hashing function to use with the trie for proof verification

#### Returns

`Promise`\<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

#### Defined in

node\_modules/.pnpm/@ethereumjs+trie@6.2.0/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:65

[**@tevm/trie**](../README.md)

***

[@tevm/trie](../globals.md) / Trie

# Class: Trie

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:11

The basic trie interface, use with `import { Trie } from '@ethereumjs/trie'`.

## Constructors

### new Trie()

> **new Trie**(`opts`?): [`Trie`](Trie.md)

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:30

Creates a new trie.

#### Parameters

##### opts?

`TrieOpts`

Options for instantiating the trie

Note: in most cases, the static [Trie.create](Trie.md#create) constructor should be used.  It uses the same API but provides sensible defaults

#### Returns

[`Trie`](Trie.md)

## Properties

### \_db

> `protected` **\_db**: `CheckpointDB`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:16

The backend DB

***

### \_debug

> `protected` **\_debug**: `Debugger`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:22

***

### \_hashLen

> `protected` **\_hashLen**: `number`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:17

***

### \_lock

> `protected` **\_lock**: `Lock`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:18

***

### \_opts

> `protected` `readonly` **\_opts**: `TrieOptsWithDefaults`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:12

***

### \_root

> `protected` **\_root**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:19

***

### debug()

> `protected` **debug**: (...`args`) => `void`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:23

#### Parameters

##### args

...`any`

#### Returns

`void`

***

### DEBUG

> `protected` **DEBUG**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:21

Debug logging

***

### EMPTY\_TRIE\_ROOT

> **EMPTY\_TRIE\_ROOT**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:14

The root for an empty trie

***

### walkTrieIterable()

> **walkTrieIterable**: (`nodeHash`, `currentKey`?, `onFound`?, `filter`?, `visited`?) => `AsyncIterable`\<\{ `currentKey`: `number`[]; `node`: `TrieNode`; \}\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:169

#### Parameters

##### nodeHash

`Uint8Array`

##### currentKey?

`number`[]

##### onFound?

`OnFound`

##### filter?

`NodeFilter`

##### visited?

`Set`\<`string`\>

#### Returns

`AsyncIterable`\<\{ `currentKey`: `number`[]; `node`: `TrieNode`; \}\>

## Methods

### appliedKey()

> `protected` **appliedKey**(`key`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:277

Returns the key practically applied for trie construction
depending on the `useKeyHashing` option being set or not.

#### Parameters

##### key

`Uint8Array`

#### Returns

`Uint8Array`

***

### batch()

> **batch**(`ops`, `skipKeyTransform`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:240

The given hash of operations (key additions or deletions) are executed on the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### ops

`BatchDBOp`[]

##### skipKeyTransform?

`boolean`

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

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:287

Creates a checkpoint that can later be reverted to or committed.
After this is called, all changes can be reverted until `commit` is called.

#### Returns

`void`

***

### checkRoot()

> **checkRoot**(`root`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:130

Checks if a given root exists.

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

***

### commit()

> **commit**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:293

Commits a checkpoint to disk, if current checkpoint is not nested.
If nested, only sets the parent checkpoint as current checkpoint.

#### Returns

`Promise`\<`void`\>

#### Throws

If not during a checkpoint phase

***

### createProof()

> **createProof**(`key`): `Promise`\<`Proof`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:93

Creates a proof from a trie and key that can be verified using [Trie.verifyProof](Trie.md#verifyproof-2). An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains
the encoded trie nodes from the root node to the leaf node storing state data. The returned proof will be in the format of an array that contains Uint8Arrays of
serialized branch, extension, and/or leaf nodes.

#### Parameters

##### key

`Uint8Array`

key to create a proof for

#### Returns

`Promise`\<`Proof`\>

***

### createReadStream()

> **createReadStream**(): `TrieReadStream`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:246

The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Uint8Arrays.

#### Returns

`TrieReadStream`

Returns a [stream](https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`

***

### database()

> **database**(`db`?, `valueEncoding`?): `CheckpointDB`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:122

#### Parameters

##### db?

`DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

##### valueEncoding?

`ValueEncoding`

#### Returns

`CheckpointDB`

***

### del()

> **del**(`key`, `skipKeyTransform`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:152

Deletes a value given a `key` from the trie
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### key

`Uint8Array`

##### skipKeyTransform?

`boolean`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is deleted.

***

### findPath()

> **findPath**(`key`, `throwIfMissing`?, `partialPath`?): `Promise`\<`Path`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:159

Tries to find a path to the node for the given key.
It returns a `stack` of nodes to the closest node.

#### Parameters

##### key

`Uint8Array`

the search key

##### throwIfMissing?

`boolean`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

##### partialPath?

###### stack

`TrieNode`[]

#### Returns

`Promise`\<`Path`\>

***

### flushCheckpoints()

> **flushCheckpoints**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:303

Flushes all checkpoints, restoring the initial checkpoint state.

#### Returns

`void`

***

### ~~fromProof()~~

> **fromProof**(`proof`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:120

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. An EIP-1186 proof contains the encoded trie nodes from the root
node to the leaf node storing state data. This function does not check if the proof has the same expected root. A static version of this function exists
with the same name.

#### Parameters

##### proof

`Proof`

an EIP-1186 proof to update the trie from

#### Returns

`Promise`\<`void`\>

#### Deprecated

Use `updateFromProof`

***

### get()

> **get**(`key`, `throwIfMissing`?): `Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:137

Gets a value given a `key`

#### Parameters

##### key

`Uint8Array`

the key to search for

##### throwIfMissing?

`boolean`

if true, throws if any nodes are missing. Used for verifying proofs. (default: false)

#### Returns

`Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

A Promise that resolves to `Uint8Array` if a value was found or `null` if no value was found.

***

### hasCheckpoints()

> **hasCheckpoints**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:282

Is the trie during a checkpoint phase?

#### Returns

`boolean`

***

### hash()

> `protected` **hash**(`msg`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:278

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### lookupNode()

> **lookupNode**(`node`): `Promise`\<`TrieNode`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:193

Retrieves a node from db by hash.

#### Parameters

##### node

`Uint8Array`\<`ArrayBufferLike`\> | `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<`TrieNode`\>

***

### persistRoot()

> **persistRoot**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:264

Persists the root hash in the underlying database

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `value`, `skipKeyTransform`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:145

Stores a given `value` at the given `key` or do a delete if `value` is empty
(delete operations are only executed on DB with `deleteFromDB` set to `true`)

#### Parameters

##### key

`Uint8Array`

##### value

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### skipKeyTransform?

`boolean`

#### Returns

`Promise`\<`void`\>

A Promise that resolves once value is stored.

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:299

Reverts the trie to the state it was at when `checkpoint` was first called.
If during a nested checkpoint, sets root to most recent checkpoint, and sets
parent checkpoint as current.

#### Returns

`Promise`\<`void`\>

***

### root()

> **root**(`value`?): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:126

Gets and/or Sets the current root of the `trie`

#### Parameters

##### value?

`null` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Uint8Array`

***

### saveStack()

> **saveStack**(`key`, `stack`, `opStack`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:215

Saves a stack of nodes to the database.

#### Parameters

##### key

`Nibbles`

the key. Should follow the stack

##### stack

`TrieNode`[]

a stack of nodes to the value given by the key

##### opStack

`BatchDBOp`[]

a stack of levelup operations to commit at the end of this function

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(`includeCheckpoints`?, `opts`?): [`Trie`](Trie.md)

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:260

Returns a copy of the underlying trie.

Note on db: the copy will create a reference to the
same underlying database.

Note on cache: for memory reasons a copy will by default
not recreate a new LRU cache but initialize with cache
being deactivated. This behavior can be overwritten by
explicitly setting `cacheSize` as an option on the method.

#### Parameters

##### includeCheckpoints?

`boolean`

If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.

##### opts?

`TrieShallowCopyOpts`

#### Returns

[`Trie`](Trie.md)

***

### updateFromProof()

> **updateFromProof**(`proof`, `shouldVerifyRoot`?): `Promise`\<`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:102

Updates a trie from a proof by putting all the nodes in the proof into the trie. If a trie is being updated with multiple proofs, {@param shouldVerifyRoot} can
be passed as false in order to not immediately throw on an unexpected root, so that root verification can happen after all proofs and their nodes have been added.
An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

#### Parameters

##### proof

`Proof`

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof to update the trie from.

##### shouldVerifyRoot?

`boolean`

If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case.

#### Returns

`Promise`\<`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>\>

The root of the proof

***

### verifyProof()

> **verifyProof**(`rootHash`, `key`, `proof`): `Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:112

Verifies a proof by putting all of its nodes into a trie and attempting to get the proven key. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof
contains the encoded trie nodes from the root node to the leaf node storing state data. A static version of this function exists with the same name.

#### Parameters

##### rootHash

`Uint8Array`

Root hash of the trie that this proof was created from and is being verified for

##### key

`Uint8Array`

Key that is being verified and that the proof is created for

##### proof

`Proof`

an EIP-1186 proof to verify the key against

#### Returns

`Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.

***

### verifyPrunedIntegrity()

> **verifyPrunedIntegrity**(): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:241

#### Returns

`Promise`\<`boolean`\>

***

### verifyRangeProof()

> **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:86

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](Trie.md#verifyrangeproof-2). A static
version of this function also exists.

#### Parameters

##### rootHash

`Uint8Array`

root hash of state trie this proof is being verified against.

##### firstKey

first key of range being proven.

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### lastKey

last key of range being proven.

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### keys

`Uint8Array`\<`ArrayBufferLike`\>[]

key list of leaf data being proven.

##### values

`Uint8Array`\<`ArrayBufferLike`\>[]

value list of leaf data being proven, one-to-one correspondence with keys.

##### proof

proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well

`null` | `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

***

### walkAllNodes()

> **walkAllNodes**(`onFound`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:178

Executes a callback for each node in the trie.

#### Parameters

##### onFound

`OnFound`

callback to call when a node is found.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

***

### walkAllValueNodes()

> **walkAllValueNodes**(`onFound`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:184

Executes a callback for each value node in the trie.

#### Parameters

##### onFound

`OnFound`

callback to call when a node is found.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

***

### walkTrie()

> **walkTrie**(`root`, `onFound`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:168

Walks a trie until finished.

#### Parameters

##### root

`Uint8Array`

##### onFound

`FoundNodeFunction`

callback to call when a node is found. This schedules new tasks. If no tasks are available, the Promise resolves.

#### Returns

`Promise`\<`void`\>

Resolves when finished walking trie.

***

### create()

> `static` **create**(`opts`?): `Promise`\<[`Trie`](Trie.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:121

#### Parameters

##### opts?

`TrieOpts`

#### Returns

`Promise`\<[`Trie`](Trie.md)\>

***

### createFromProof()

> `static` **createFromProof**(`proof`, `trieOpts`?, `shouldVerifyRoot`?): `Promise`\<[`Trie`](Trie.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:39

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. A proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

##### proof

`Proof`

an EIP-1186 proof to create trie from

##### trieOpts?

`TrieOpts`

trie opts to be applied to returned trie

##### shouldVerifyRoot?

`boolean`

If `true`, verifies that the root key of the proof matches the trie root. Throws if this is not the case.

#### Returns

`Promise`\<[`Trie`](Trie.md)\>

new trie created from given proof

***

### ~~fromProof()~~

> `static` **fromProof**(`proof`, `opts`?): `Promise`\<[`Trie`](Trie.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:72

Static version of fromProof function. If a root is provided in the opts param, the proof will be checked to have the same expected root. An
(EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

#### Parameters

##### proof

`Proof`

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

##### opts?

`TrieOpts`

#### Returns

`Promise`\<[`Trie`](Trie.md)\>

#### Deprecated

Use `createFromProof`

***

### verifyProof()

> `static` **verifyProof**(`key`, `proof`, `opts`?): `Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:50

Static version of verifyProof function with the same behavior. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

#### Parameters

##### key

`Uint8Array`

Key that is being verified and that the proof is created for

##### proof

`Proof`

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

##### opts?

`TrieOpts`

optional, the opts may include a custom hashing function to use with the trie for proof verification

#### Returns

`Promise`\<`null` \| `Uint8Array`\<`ArrayBufferLike`\>\>

The value from the key, or null if valid proof of non-existence.

#### Throws

If proof is found to be invalid.

***

### verifyRangeProof()

> `static` **verifyRangeProof**(`rootHash`, `firstKey`, `lastKey`, `keys`, `values`, `proof`, `opts`?): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+trie@6.2.1/node\_modules/@ethereumjs/trie/dist/esm/trie.d.ts:65

A range proof is a proof that includes the encoded trie nodes from the root node to leaf node for one or more branches of a trie,
allowing an entire range of leaf nodes to be validated. This is useful in applications such as snap sync where contiguous ranges
of state trie data is received and validated for constructing world state, locally. Also see [verifyRangeProof](Trie.md#verifyrangeproof-2). A static
version of this function also exists.

#### Parameters

##### rootHash

`Uint8Array`

root hash of state trie this proof is being verified against.

##### firstKey

first key of range being proven.

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### lastKey

last key of range being proven.

`null` | `Uint8Array`\<`ArrayBufferLike`\>

##### keys

`Uint8Array`\<`ArrayBufferLike`\>[]

key list of leaf data being proven.

##### values

`Uint8Array`\<`ArrayBufferLike`\>[]

value list of leaf data being proven, one-to-one correspondence with keys.

##### proof

proof node list, if all-elements-proof where no proof is needed, proof should be null, and both `firstKey` and `lastKey` must be null as well

`null` | `Uint8Array`\<`ArrayBufferLike`\>[]

##### opts?

`TrieOpts`

optional, the opts may include a custom hashing function to use with the trie for proof verification

#### Returns

`Promise`\<`boolean`\>

a flag to indicate whether there exists more trie node in the trie

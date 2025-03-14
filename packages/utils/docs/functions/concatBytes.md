[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / concatBytes

# Function: concatBytes()

> **concatBytes**(...`arrays`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/bytes.d.ts:193

This mirrors the functionality of the `ethereum-cryptography` export except
it skips the check to validate that every element of `arrays` is indeed a `uint8Array`
Can give small performance gains on large arrays

## Parameters

### arrays

...`Uint8Array`\<`ArrayBufferLike`\>[]

an array of Uint8Arrays

## Returns

`Uint8Array`

one Uint8Array with all the elements of the original set
works like `Buffer.concat`

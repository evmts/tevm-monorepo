[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / setLengthLeft

# Variable: setLengthLeft()

> `const` **setLengthLeft**: (`msg`, `length`) => `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/bytes.d.ts:61

Left Pads a `Uint8Array` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

## Parameters

### msg

`Uint8Array`

the value to pad

### length

`number`

the number of bytes the output should be

## Returns

`Uint8Array`

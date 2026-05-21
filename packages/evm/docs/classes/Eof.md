[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / Eof

# Class: Eof

Main constructor for the EOFContainer

## Constructors

### Constructor

> **new Eof**(`buf`, `eofMode?`, `dataSectionAllowedSmaller?`): `EOFContainer`

#### Parameters

##### buf

`Uint8Array`

Entire container buffer

##### eofMode?

`EOFContainerMode`

Container mode to validate the container on

##### dataSectionAllowedSmaller?

`boolean`

`true` if the data section is allowed to be smaller than the data section size in the header

#### Returns

`EOFContainer`

## Properties

### body

> **body**: `EOFBody`

***

### buffer

> **buffer**: `Uint8Array`

***

### eofMode

> **eofMode**: `EOFContainerMode`

***

### header

> **header**: `EOFHeader`

# AddressBook Schema

Types and validators for SAddressBook

## AddressBook

Type representing a valid address book. 
An address book is a JSON serializable mapping of contract ids to their blockCreated and address.
Contract keys can be anything including the contract address but by convention they are usually a human readable name for the contract.

### Import

```typescript
import {type AddressBook} from '@evmts/schemas'
```

### Example

```typescript
import {AddressBook} from '@evmts/schemas'
const addressBook = {
	contract1: {
		address: '0x4320a88a199120aD52Dd9742C7430847d3cB2CD4',
		blockCreated: 0,
	},
	contract2: {
		address: '0x4227a88a199120aD52Dd9742C7430847d3cB2CD4',
		blockCreated: 500,
	},
} as const satisfies AddressBook<string>
```

## SAddressBook

[Effect schema](https://github.com/Effect-TS/schema) for the AddressBook type

### Typescript Type

```typescript
import {Schema} from '@effect/schema/Schema'
export const SAddressBook: Schema<string, AddressBook>
```

## isAddressBook

Type guard that returns true if an address book is a valid address

### Import

```typescript
import {isAddressBook} from '@evmts/schema'
```

### Example

```typescript
import {isAddressBook} from '@evmts/schemas'
isAddressBook({
  MyContract: {
    blockCreated: 0, 
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
}) // true
isAddressBook('not an address book') // false
```

### Returns

`boolean`

Whether or not the address book is valid.

### Parameters

##### address

- Type: `string`

An address book to be validated.

## parseAddressBookSafe

Safely parses an address book into an [Effect](https://www.effect.website/docs/essentials/effect-type)

### Import

```typescript
import {parseAddressBookSafe} from '@evmts/schema'
```

### Example

```typescript
import {parseAddressBookSafe} from '@evmts/schemas'
const parsedAddressBookEffect = parseAddressBookSafe({
  MyContract: {
    blockCreated: 0, 
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

### Returns

`Effect<never, InvalidAddressBookError, AddressBook>`

AddressBook Effect with `InvalidAddressBookError` if invalid

### Parameters

#### address

- Type: `string`

An address book to be validated.

## parseAddressBook

Parses an address book and returns the value if no errors

### Import

```typescript
import {parseAddressBook} from '@evmts/schema'
```

### Example

```typescript
import {parseAddressBook} from '@evmts/schemas'
const parsedAddressBook = parseAddressBook({
  MyContract: {
    blockCreated: 0, 
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

### Returns

`AddressBook`

Value typecast to AddressBook if valid

### Throws

- `InvalidAddressBookError` if address book is not valid

### Parameters

#### addressBook

- Type: `AddressBook`

An address book to be validated.


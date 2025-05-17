[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / testActions

# Function: testActions()

> **testActions**\<`mode`\>(`__namedParameters`): \<`transport`, `chain`, `account`\>(`client`) => `TestActions`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.3/node\_modules/viem/\_types/clients/decorators/test.d.ts:637

## Type Parameters

### mode

`mode` *extends* `TestClientMode`

## Parameters

### \_\_namedParameters

#### mode

`mode`

## Returns

> \<`transport`, `chain`, `account`\>(`client`): `TestActions`

### Type Parameters

#### transport

`transport` *extends* `Transport` = `Transport`

#### chain

`chain` *extends* `undefined` \| `Chain` = `undefined` \| `Chain`

#### account

`account` *extends* `undefined` \| [`Account`](../type-aliases/Account.md) = `undefined` \| [`Account`](../type-aliases/Account.md)

### Parameters

#### client

`Client`\<`transport`, `chain`, `account`\>

### Returns

`TestActions`

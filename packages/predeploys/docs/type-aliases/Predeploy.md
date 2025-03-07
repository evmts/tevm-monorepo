[**@tevm/predeploys**](../README.md)

***

[@tevm/predeploys](../globals.md) / Predeploy

# Type Alias: Predeploy\<TName, THumanReadableAbi\>

> **Predeploy**\<`TName`, `THumanReadableAbi`\>: `object`

Defined in: [Predeploy.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L7)

Type of predeploy contract for tevm

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Type declaration

### contract

> `readonly` **contract**: `Contract`\<`TName`, `THumanReadableAbi`, `Address`, `Hex`, `Hex`\>

### predeploy()

> `readonly` **predeploy**: () => `object`

#### Returns

`object`

##### address

> **address**: `EthjsAddress`

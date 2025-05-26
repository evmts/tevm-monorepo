[**@tevm/predeploys**](../README.md)

***

[@tevm/predeploys](../globals.md) / Predeploy

# Type Alias: Predeploy\<TName, THumanReadableAbi\>

> **Predeploy**\<`TName`, `THumanReadableAbi`\> = `object`

Defined in: [Predeploy.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L7)

Type of predeploy contract for tevm

## Type Parameters

### TName

`TName` *extends* `string`

### THumanReadableAbi

`THumanReadableAbi` *extends* readonly `string`[]

## Properties

### contract

> `readonly` **contract**: `Contract`\<`TName`, `THumanReadableAbi`, `Address`, `Hex`, `Hex`\>

Defined in: [Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8)

***

### predeploy()

> `readonly` **predeploy**: () => `object`

Defined in: [Predeploy.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L9)

#### Returns

`object`

##### address

> **address**: `EthjsAddress`

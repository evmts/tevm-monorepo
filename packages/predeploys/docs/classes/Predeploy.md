**@tevm/predeploys** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/predeploys](../README.md) / Predeploy

# Class: `abstract` Predeploy\<TName, THumanReadableAbi\>

Type of predeploy contract for tevm

## Type parameters

• **TName** extends `string`

• **THumanReadableAbi** extends readonly `string`[]

## Constructors

### new Predeploy()

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(): [`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

#### Returns

[`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

## Properties

### address

> **`readonly`** **`abstract`** **address**: ```0x${string}```

#### Source

[Predeploy.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L12)

***

### contract

> **`readonly`** **`abstract`** **contract**: `Script`\<`TName`, `THumanReadableAbi`\>

#### Source

[Predeploy.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L11)

## Methods

### ethjsAddress()

> **`protected`** **`readonly`** **ethjsAddress**(): `Address`

#### Returns

`Address`

#### Source

[Predeploy.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L13)

***

### predeploy()

> **`readonly`** **predeploy**(): `object`

#### Returns

`object`

##### address

> **address**: `Address`

#### Source

[Predeploy.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L14)

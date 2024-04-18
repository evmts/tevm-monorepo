**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / Predeploy

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

packages/predeploys/types/Predeploy.d.ts:8

***

### contract

> **`readonly`** **`abstract`** **contract**: [`Script`](../type-aliases/Script.md)\<`TName`, `THumanReadableAbi`\>

#### Source

packages/predeploys/types/Predeploy.d.ts:7

***

### ethjsAddress()

> **`protected`** **`readonly`** **ethjsAddress**: () => [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Source

packages/predeploys/types/Predeploy.d.ts:9

***

### predeploy()

> **`readonly`** **predeploy**: () => `object`

#### Returns

`object`

##### address

> **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Source

packages/predeploys/types/Predeploy.d.ts:10

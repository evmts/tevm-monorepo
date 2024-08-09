[**@tevm/predeploys**](../README.md) • **Docs**

***

[@tevm/predeploys](../globals.md) / definePredeploy

# Function: definePredeploy()

> **definePredeploy**\<`TName`, `THumanReadableAbi`\>(`contract`): [`Predeploy`](../type-aliases/Predeploy.md)\<`TName`, `THumanReadableAbi`\>

Defines a predeploy contract to use in the tevm vm

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Parameters

• **contract**: `Contract`\<`TName`, `THumanReadableAbi`, \`0x$\{string\}\`, \`0x$\{string\}\`, \`0x$\{string\}\`\>

## Returns

[`Predeploy`](../type-aliases/Predeploy.md)\<`TName`, `THumanReadableAbi`\>

## Defined in

[definePredeploy.js:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/definePredeploy.js#L27)

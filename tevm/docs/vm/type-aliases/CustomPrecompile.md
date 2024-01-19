**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [vm](../README.md) > CustomPrecompile

# Type alias: CustomPrecompile

> **CustomPrecompile**: `Exclude`\<`Exclude`\<`ConstructorArgument`\<*typeof* `_ethereumjs_evm.EVM`\>, `undefined`\>[`"customPrecompiles"`], `undefined`\>[`number`]

TODO This should be publically exported from ethereumjs but isn't
Typing this by hand is tedious so we are using some typescript inference to get it
do a pr to export this from ethereumjs and then replace this with an import
TODO this should be modified to take a hex address rather than an ethjs address to be consistent with rest of Tevm

## Source

vm/vm/dist/index.d.ts:68

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

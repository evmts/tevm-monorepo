[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / cloneVmWithBlockTag

# Function: cloneVmWithBlockTag()

> **cloneVmWithBlockTag**(`client`, `block`): `Promise`\<`Vm` \| `InternalError` \| `ForkError`\>

Defined in: [packages/actions/src/Call/cloneVmWithBlock.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/cloneVmWithBlock.js#L15)

**`Internal`**

Prepares the VM for a call given a block tag. This includes
- Cloning the VM
- Setting the state root
- Setting the fork transport if the block is in the past

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

### block

`Block`

## Returns

`Promise`\<`Vm` \| `InternalError` \| `ForkError`\>

VM or errors

## Throws

returns errors as values

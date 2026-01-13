[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilAutoImpersonateAccountParams

# Type Alias: AnvilAutoImpersonateAccountParams

> **AnvilAutoImpersonateAccountParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L32)

Params for `anvil_autoImpersonateAccount` handler

## Properties

### enabled

> `readonly` **enabled**: `boolean`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L37)

Whether to enable automatic impersonation of accounts.
When true, all transactions will have their sender automatically impersonated.

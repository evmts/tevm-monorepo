[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilAutoImpersonateAccountParams

# Type Alias: AnvilAutoImpersonateAccountParams

> **AnvilAutoImpersonateAccountParams** = `object`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:26

Params for `anvil_autoImpersonateAccount` handler

## Properties

### enabled

> `readonly` **enabled**: `boolean`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:31

Whether to enable automatic impersonation of accounts.
When true, all transactions will have their sender automatically impersonated.

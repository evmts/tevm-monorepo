---
title: Actions
description: Tevm actions api
---

## Overview

Tevm has an [actions based api](/reference/tevm/actions-types/api) similar to [viem's actions api](https://viem.sh/docs/actions/public/getbalance) and following similar patterns. This is a higher level of abstraction than the lower level [JSON-RPC api](/learn/json-rpc).

Note: Memory client also is extended with all [viem test and public actions](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js#L59)

:::tip[Ens actions]
Ens actions require 4844 to be enabeld. To enable 4844 in current version of tevm you must pass in kzg implementation to `custom-crypto`. This can be installed with `npm install kzg-wasm`.
Warning, kzg adds over 500kb to bundle size.
In future version of tevm this will not be required.
:::

### Error handling

By default Tevm clients will return a rejected promise when actions fail. Clients can optionally also return errors as values. This is very useful for handling errors in a typesafe way. All actions have a matching error in the `tevm/error` package.

To return errors as values pass in a `throwOnFail: false` option to the tevm action. Currently on tevm actions are supported and not other actions such as `eth` actions.

```typescript
const {errors, data} = client.readContract({
  ...ERC20.read.balanceOf(address),
  throwOnFail: false,
})
  // the `name` property on errors is typesafe and can be used to determine the type of error
if (errors?.[0].name === 'FailedToEncodeArgs') {
  ...
}
```

## TevmClient actions

TevmClient methods are the main recomended way to interact with Tevm. 🚧 means the procedure is still under construction

- [`TevmClient.tevmCall`](/reference/tevm/actions-types/type-aliases/callhandler) - Similar to eth call but with additional properties to control the VM execution
- [`TevmClient.tevmGetAccount`](/reference/tevm/actions-types/type-aliases/getaccounthandler) - gets account information such as balances contract information nonces and state roots.
- [`TevmClient.tevmSetAccount`](/reference/tevm/actions-types/type-aliases/setaccounthandler) - directly modifies the state of an account
- [`TevmClient.tevmContract`](/reference/tevm/actions-types/type-aliases/callhandler) - Similar to eth call but with additional properties to control the VM execution
- [`TevmClient.tevmScript`](/reference/tevm/actions-types/type-aliases/scripthandler) - Runs the provided bytecode against the EVM state
- [`TevmClient.tevmDumpState`](/reference/tevm/actions-types/type-aliases/dumpstatehandler) - Returns the state of the VM
- [`TevmClient.tevmLoadState`](/reference/tevm/actions-types/type-aliases/loadstatehandler) - Initializes the state of the VM
- [`TevmClient.tevmDeploy`](/reference/tevm/actions-types/type-aliases/deploy) - Creates a transaction to deploy a contract

Note the `call` family of actions including `TevmClient.call`, `TevmClient.contract`, and `TevmClient.script` will execute in a sandbox and not modify the state. This behavior can be disabled via passing in a `enableTransaction: true` parameter.

## Base Client and tree shakeable actions

While `MemoryClient` is suggested for most users, users trying to squeeze out bundle size wins such as 3rd party libraries may want to use the lower level BaseClient api.

Tevm supports tree shakeable actions [similar to viem](https://viem.sh/docs/clients/custom#tree-shaking).

To make a minimal Tevm client use [`createBaseClient`](https://tevm.sh/reference/tevm/base-client/functions/createbaseclient/) and import actions such as `tevmSetAccount` from `@tevm/actions`.

```typescript
import { createBaseClient } from "tevm/base-client";
import { setAccountHandler } from "tevm/actions";

const baseClient = createBaseClient({
  fork: { url: "https://mainnet.optimism.io" },
});

const tevmSetAccount = setAccountHandler(baseClient);

await tevmSetAccount({
  address: `0x${"01".repeat(20)}`,
  balance: 420n,
});
```

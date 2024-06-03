---
title: Actions
description: Tevm actions api
---

## Overview

Tevm has an [actions based api](/reference/tevm/actions-types/api) similar to [viem's actions api](https://viem.sh/docs/actions/public/getbalance) and following similar patterns. This is a higher level of abstraction than the lower level [JSON-RPC api](/learn/json-rpc).

:::tip[Ens actions]
Ens actions require 4844 to be enabeld. To enable 4844 in current version of tevm you must pass in kzg implementation to `custom-crypto`. This can be installed with `npm install kzg-wasm`.
Warning, kzg adds over 500kb to bundle size.
In future version of tevm this will not be required.
:::

### Public actions

[MemoryClient](../clients/index.md) comes with all [viem public actions](https://viem.sh/docs/actions/public/introduction) built in.

```typescript
await memoryClient.getChainId();
```

ENS actions are supported but do not work unless forking a network with ENS support.

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

## Wallet Actions

`MemoryClient` supports [viem wallet actions](https://viem.sh/docs/actions/wallet/introduction) but does not come with them by default. This is because transactions can be created using tevm methods such as `tevmCall` and `tevmContract`.

If you wish to add walletActions to your tevm client you must add an account and the wallet decorator.

```typescript
import { createMemoryClient } from "tevm";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { walletActions } from "viem/actions";

const memoryClient = createMemoryClient({
  account: privateKeyToAccount(generatePrivateKey()),
}).extend(walletActions);
```

## Test actions

For compatability tevm supports using [viem public actions](https://viem.sh/docs/actions/test/introduction). These test actions use anvil/hardhat methods such as `anvil_setBytecode. MemoryClient can do these actions with tevm actions. But testActions can be useful if you want to write code that works universally with Tevm hardhat and anvil.

```typescript
import { testActions } from "viem";
import { createMemoryClient } from "tevm";

const memoryClient = createMemoryClient().extend(
  testActions({ mode: "anvil" }),
);
```

### Http clients

If tevm is running in an http server using the `@tevm/server` package, any http client can be used to communicate with it including viem clients, and ethers clients. Tevm doesn't export an http client itself and recomends you use [viem](https://viem.sh) as it's apis all work with the in memory client.

## Base Client and tree shakeable actions

While `MemoryClient` is suggested for most users, users trying to squeeze out bundle size wins such as 3rd party libraries may want to use the lower level BaseClient api.

Tevm supports tree shakeable actions [similar to viem](https://viem.sh/docs/clients/custom#tree-shaking).

To make a minimal Tevm client use [`createBaseClient`](https://tevm.sh/reference/tevm/base-client/functions/createbaseclient/) and import actions such as `tevmSetAccount` from `@tevm/actions`.

```typescript
import { createBaseClient } from "tevm/base-client";
import { mainnet } from "tevm/common";
import { setAccountHandler } from "tevm/actions";

const tevm = createBaseClient({
  common: mainnet,
  fork: { transport: http("https://mainnet.optimism.io")({}) },
});

const tevmSetAccount = setAccountHandler(baseClient);

await tevmSetAccount({
  address: `0x${"01".repeat(20)}`,
  balance: 420n,
});
```

## Viem actions with tree shakeable actions

To use viem tree shakeable actions you must build a client from scratch.

```typescript
import { createBaseClient } from "tevm/base-client";
import { requestEip1193 } from "tevm/decorators";
import { mainnet } from "tevm/common";
import { tevmTransport } from "tevm";
import { createClient as createViemClient } from "viem";

// Create a minimal tevm client with only a EIP-1193 Request JSON-RPC function
export const mainnetTevm = createBaseClient({ common: mainnet }).extend(
  requestEip1193(),
);

// create a minimal viem client with tevm as it's transport
export const mainnetClient = createViemClient({
  // tevm commons can be used as viem chains
  chain: mainnet,
  transport: tevmTransport(mainnetTevm),
});
```

You can now use viem tree-shakeable actions

```typescript
import { mainnetClient } from "./clients.js";
import { getBlock } from "viem/actions";

const block = await getBlock(mainnetClient, { number: 420n });
```

You can also use tevm tree shakable actions with the tevm base client.

```typescript
import { mainnetTevm } from "./clients.js";
import { setAccountHandler } from "tevm/actions";

await setAccountHandler(mainnetTevm)({
  address: `0x${"01".repeat(20)}`,
  balance: 420n,
});
```

## Lower level packages

For those wanting to dive deeper into tevms internal or squeeze out even smaller bundlers, in addition to `BaseClient` all the internal packages used to create base client are publically available on NPM. Notably:

- `@tevm/evm` contains a very simple EVM interpreter used by tevm
- `@tevm/state` provides a custom state manager used to implement forking
- `@tevm/blockchain` contains the internal blockchain implementation
- `@tevm/txpool` contains the mempool implementation

And more.

All these packages have [generated reference docs](../reference/index.md)

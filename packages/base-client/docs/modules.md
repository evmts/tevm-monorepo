[@tevm/base-client](README.md) / Exports

# @tevm/base-client

## Table of contents

### Type Aliases

- [BaseClient](modules.md#baseclient)
- [BaseClientOptions](modules.md#baseclientoptions)
- [CustomPrecompile](modules.md#customprecompile)
- [Extension](modules.md#extension)
- [Hardfork](modules.md#hardfork)

### Functions

- [createBaseClient](modules.md#createbaseclient)

## Type Aliases

### BaseClient

Ƭ **BaseClient**\<`TMode`, `TExtended`\>: \{ `extend`: \<TExtension\>(`decorator`: (`client`: [`BaseClient`](modules.md#baseclient)\<`TMode`, `TExtended`\>) => `TExtension`) => [`BaseClient`](modules.md#baseclient)\<`TMode`, `TExtended` & `TExtension`\> ; `forkUrl?`: `string` ; `getChainId`: () => `Promise`\<`number`\> ; `getVm`: () => `Promise`\<`TevmVm`\> ; `mode`: `TMode` ; `ready`: () => `Promise`\<``true``\> ; `setChainId`: (`chainId`: `number`) => `void`  } & `TExtended`

The base client used by Tevm. Add extensions to add additional functionality

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMode` | extends ``"fork"`` \| ``"proxy"`` \| ``"normal"`` = ``"fork"`` \| ``"proxy"`` \| ``"normal"`` |
| `TExtended` | {} |

#### Defined in

[BaseClient.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/BaseClient.ts#L6)

___

### BaseClientOptions

Ƭ **BaseClientOptions**: `Object`

Options for creating an Tevm MemoryClient instance

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowUnlimitedContractSize?` | `boolean` | Enable/disable unlimited contract size. Defaults to false. |
| `chainId?` | `number` | Optionally set the chainId. Defaults to chainId of fokred/proxied chain or 900 |
| `customPrecompiles?` | [`CustomPrecompile`](modules.md#customprecompile)[] | Custom precompiles allow you to run arbitrary JavaScript code in the EVM. See the [Precompile guide](https://todo.todo) documentation for a deeper dive An ever growing standard library of precompiles is provided at `tevm/precompiles` **`Notice`** Not implemented yet [Implementation pr](https://github.com/evmts/tevm-monorepo/pull/728/files) Below example shows how to make a precompile so you can call `fs.writeFile` and `fs.readFile` in your contracts. Note: this specific precompile is also provided in the standard library For security precompiles can only be added statically when the vm is created. **`Example`** ```ts import { createMemoryClient, defineCall, definePrecompile } from 'tevm' import { createScript } from '@tevm/contract' import fs from 'fs/promises' const Fs = createScript({ name: 'Fs', humanReadableAbi: [ 'function readFile(string path) returns (string)', 'function writeFile(string path, string data) returns (bool)', ] }) const fsPrecompile = definePrecompile({ contract: Fs, address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2', call: defineCall(Fs.abi, { readFile: async ({ args }) => { return { returnValue: await fs.readFile(...args, 'utf8'), executionGasUsed: 0n, } }, writeFile: async ({ args }) => { await fs.writeFile(...args) return { returnValue: true, executionGasUsed: 0n } }, }), }) const tevm = createMemoryClient({ customPrecompiles: [fsPrecompile] }) |
| `customPredeploys?` | `ReadonlyArray`\<`CustomPredeploy`\<`any`, `any`\>\> | Custom predeploys allow you to deploy arbitrary EVM bytecode to an address. This is a convenience method and equivalent to calling tevm.setAccount() manually to set the contract code. ```typescript const tevm = createMemoryClient({ customPredeploys: [ // can pass a `tevm Script` here as well { address: '0x420420...', abi: [...], deployedBytecode: '0x420420...', } ], }) ``` |
| `eips?` | `ReadonlyArray`\<`number`\> | Eips to enable. Defaults to `[1559, 4895]` |
| `fork?` | `ForkStateManagerOpts` | Fork options fork a live network if enabled. When in fork mode Tevm will fetch and cache all state from the block forked from the provided URL Cannot be set if `proxy` is also set |
| `hardfork?` | [`Hardfork`](modules.md#hardfork) | Hardfork to use. Defaults to `shanghai` |
| `persister?` | `SyncStoragePersister` | The memory client can optionally initialize and persist it's state to an external source like local storage using `createSyncPersister` **`Example`** ```typescript import { createMemoryClient, createSyncPersister } from 'tevm' const persister = createSyncPersister({ storage: { getItem: (key: string) => localStorage.getItem(key), setItem: (key: string, value: string) => localStorage.setItem(key, value), } }) const memoryClient = createMemoryClient({ persister }) ``` |
| `profiler?` | `boolean` | Enable profiler. Defaults to false. |
| `proxy?` | `ProxyStateManagerOpts` | Options to initialize the client in `proxy` mode When in proxy mode Tevm will fetch all state from the latest block of the provided proxy URL Cannot be set if `fork` is also set |

#### Defined in

[BaseClientOptions.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/BaseClientOptions.ts#L10)

___

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<`ConstructorArgument`\<`EVM`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

Custom precompiles allow you to run arbitrary JavaScript code in the EVM

#### Defined in

[CustomPrecompile.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/CustomPrecompile.ts#L19)

___

### Extension

Ƭ **Extension**\<`TExtended`\>: (`client`: [`BaseClient`](modules.md#baseclient)) => `TExtended`

#### Type parameters

| Name |
| :------ |
| `TExtended` |

#### Type declaration

▸ (`client`): `TExtended`

##### Parameters

| Name | Type |
| :------ | :------ |
| `client` | [`BaseClient`](modules.md#baseclient) |

##### Returns

`TExtended`

#### Defined in

[Extension.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/Extension.ts#L3)

___

### Hardfork

Ƭ **Hardfork**: ``"chainstart"`` \| ``"homestead"`` \| ``"dao"`` \| ``"tangerineWhistle"`` \| ``"spuriousDragon"`` \| ``"byzantium"`` \| ``"constantinople"`` \| ``"petersburg"`` \| ``"istanbul"`` \| ``"muirGlacier"`` \| ``"berlin"`` \| ``"london"`` \| ``"arrowGlacier"`` \| ``"grayGlacier"`` \| ``"mergeForkIdTransition"`` \| ``"paris"`` \| ``"shanghai"`` \| ``"cancun"``

Ethereum hardfork option

#### Defined in

[Hardfork.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/Hardfork.ts#L4)

## Functions

### createBaseClient

▸ **createBaseClient**(`options?`): `Object`

Creates the base instance of a memory client

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`BaseClientOptions`](modules.md#baseclientoptions) |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `extend` | \<TExtension\>(`decorator`: (`client`: \{ readonly getChainId: () =\> Promise\<number\>; readonly setChainId: (chainId: number) =\> void; readonly forkUrl?: string \| undefined; readonly mode: "fork" \| "proxy" \| "normal"; readonly ready: () =\> Promise\<...\>; readonly getVm: () =\> Promise\<...\>; readonly extend: \<TExtension extends Record\<...\>\>(decorator: (client...) => `TExtension`) => [`BaseClient`](modules.md#baseclient)\<``"fork"`` \| ``"proxy"`` \| ``"normal"``, {} & `TExtension`\> | Extends the base client with additional functionality. This enables optimal code splitting and extensibility |
| `forkUrl?` | `string` | Fork url if the EVM is forked **`Example`** ```ts const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' }) console.log(client.forkUrl) ``` |
| `getChainId` | () => `Promise`\<`number`\> | Gets the chainId of the current EVM **`Example`** ```ts const client = createMemoryClient() const chainId = await client.getChainId() console.log(chainId) ``` |
| `getVm` | () => `Promise`\<`TevmVm`\> | Internal instance of the VM. Can be used for lower level operations. Normally not recomended to use unless building libraries or extensions on top of Tevm. |
| `mode` | ``"fork"`` \| ``"proxy"`` \| ``"normal"`` | The mode the current client is running in `fork` mode will fetch and cache all state from the block forked from the provided URL `proxy` mode will fetch all state from the latest block of the provided proxy URL `normal` mode will not fetch any state and will only run the EVM in memory **`Example`** ```ts let client = createMemoryClient() console.log(client.mode) // 'normal' client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' }) console.log(client.mode) // 'fork' ``` |
| `ready` | () => `Promise`\<``true``\> | Returns promise that resulves when the client is ready The client is usable without calling this method but may have extra latency on the first call from initialization **`Example`** ```ts const client = createMemoryClient() await client.ready() ``` |
| `setChainId` | (`chainId`: `number`) => `void` | Sets the chain id of the current EVM |

**`Example`**

```ts
 ```

#### Defined in

[createBaseClient.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/createBaseClient.js#L19)

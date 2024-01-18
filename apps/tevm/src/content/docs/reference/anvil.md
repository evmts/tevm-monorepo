### AnvilDropTransactionHandler

Ƭ **AnvilDropTransactionHandler**: (`params`: [`AnvilDropTransactionParams`](modules.md#anvildroptransactionparams)) => `Promise`\<[`AnvilDropTransactionResult`](modules.md#anvildroptransactionresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilDropTransactionResult`](modules.md#anvildroptransactionresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilDropTransactionParams`](modules.md#anvildroptransactionparams) |

##### Returns

`Promise`\<[`AnvilDropTransactionResult`](modules.md#anvildroptransactionresult)\>

#### Defined in

[handlers/AnvilHandler.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L56)

___

### AnvilDropTransactionJsonRpcRequest

Ƭ **AnvilDropTransactionJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_dropTransaction"``, `SerializeToJson`\<[`AnvilDropTransactionParams`](modules.md#anvildroptransactionparams)\>\>

JSON-RPC request for `anvil_dropTransaction` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L69)

___

### AnvilDropTransactionJsonRpcResponse

Ƭ **AnvilDropTransactionJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_dropTransaction"``, `SerializeToJson`\<[`AnvilDropTransactionResult`](modules.md#anvildroptransactionresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_dropTransaction` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L79)

___

### AnvilDropTransactionParams

Ƭ **AnvilDropTransactionParams**: `Object`

Params for `anvil_dropTransaction` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionHash` | `Hex` | The transaction hash |

#### Defined in

[params/AnvilParams.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L78)

___

### AnvilDropTransactionProcedure

Ƭ **AnvilDropTransactionProcedure**: (`request`: [`AnvilDropTransactionJsonRpcRequest`](modules.md#anvildroptransactionjsonrpcrequest)) => `Promise`\<[`AnvilDropTransactionJsonRpcResponse`](modules.md#anvildroptransactionjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilDropTransactionJsonRpcResponse`](modules.md#anvildroptransactionjsonrpcresponse)\>

JSON-RPC procedure for `anvil_dropTransaction`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilDropTransactionJsonRpcRequest`](modules.md#anvildroptransactionjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilDropTransactionJsonRpcResponse`](modules.md#anvildroptransactionjsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L76)

___

### AnvilDropTransactionResult

Ƭ **AnvilDropTransactionResult**: ``null``

#### Defined in

[result/AnvilResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L17)

___

### AnvilDumpStateHandler

Ƭ **AnvilDumpStateHandler**: (`params`: [`AnvilDumpStateParams`](modules.md#anvildumpstateparams)) => `Promise`\<[`AnvilDumpStateResult`](modules.md#anvildumpstateresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilDumpStateResult`](modules.md#anvildumpstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilDumpStateParams`](modules.md#anvildumpstateparams) |

##### Returns

`Promise`\<[`AnvilDumpStateResult`](modules.md#anvildumpstateresult)\>

#### Defined in

[handlers/AnvilHandler.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L81)

___

### AnvilDumpStateJsonRpcRequest

Ƭ **AnvilDumpStateJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_dumpState"``, `SerializeToJson`\<[`AnvilDumpStateParams`](modules.md#anvildumpstateparams)\>\>

JSON-RPC request for `anvil_dumpState` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L118)

___

### AnvilDumpStateJsonRpcResponse

Ƭ **AnvilDumpStateJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_dumpState"``, `SerializeToJson`\<[`AnvilDumpStateResult`](modules.md#anvildumpstateresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_dumpState` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L134)

___

### AnvilDumpStateParams

Ƭ **AnvilDumpStateParams**: {} \| `undefined` \| `never`

Params for `anvil_dumpState` handler

#### Defined in

[params/AnvilParams.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L165)

___

### AnvilDumpStateProcedure

Ƭ **AnvilDumpStateProcedure**: (`request`: [`AnvilDumpStateJsonRpcRequest`](modules.md#anvildumpstatejsonrpcrequest)) => `Promise`\<[`AnvilDumpStateJsonRpcResponse`](modules.md#anvildumpstatejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilDumpStateJsonRpcResponse`](modules.md#anvildumpstatejsonrpcresponse)\>

JSON-RPC procedure for `anvil_dumpState`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilDumpStateJsonRpcRequest`](modules.md#anvildumpstatejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilDumpStateJsonRpcResponse`](modules.md#anvildumpstatejsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L119)

___

### AnvilDumpStateResult

Ƭ **AnvilDumpStateResult**: `Hex`

#### Defined in

[result/AnvilResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L30)

___

### AnvilGetAutomineHandler

Ƭ **AnvilGetAutomineHandler**: (`params`: [`AnvilGetAutomineParams`](modules.md#anvilgetautomineparams)) => `Promise`\<[`AnvilGetAutomineResult`](modules.md#anvilgetautomineresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilGetAutomineResult`](modules.md#anvilgetautomineresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilGetAutomineParams`](modules.md#anvilgetautomineparams) |

##### Returns

`Promise`\<[`AnvilGetAutomineResult`](modules.md#anvilgetautomineresult)\>

#### Defined in

[handlers/AnvilHandler.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L44)

___

### AnvilGetAutomineJsonRpcRequest

Ƭ **AnvilGetAutomineJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_getAutomine"``, `SerializeToJson`\<[`AnvilGetAutomineParams`](modules.md#anvilgetautomineparams)\>\>

JSON-RPC request for `anvil_getAutomine` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L45)

___

### AnvilGetAutomineJsonRpcResponse

Ƭ **AnvilGetAutomineJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_getAutomine"``, `SerializeToJson`\<[`AnvilGetAutomineResult`](modules.md#anvilgetautomineresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_getAutomine` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L52)

___

### AnvilGetAutomineParams

Ƭ **AnvilGetAutomineParams**: {} \| `undefined` \| `never`

Params for `anvil_getAutomine` handler

#### Defined in

[params/AnvilParams.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L40)

___

### AnvilGetAutomineProcedure

Ƭ **AnvilGetAutomineProcedure**: (`request`: [`AnvilGetAutomineJsonRpcRequest`](modules.md#anvilgetautominejsonrpcrequest)) => `Promise`\<[`AnvilGetAutomineJsonRpcResponse`](modules.md#anvilgetautominejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilGetAutomineJsonRpcResponse`](modules.md#anvilgetautominejsonrpcresponse)\>

JSON-RPC procedure for `anvil_getAutomine`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilGetAutomineJsonRpcRequest`](modules.md#anvilgetautominejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilGetAutomineJsonRpcResponse`](modules.md#anvilgetautominejsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L55)

___

### AnvilGetAutomineResult

Ƭ **AnvilGetAutomineResult**: `boolean`

#### Defined in

[result/AnvilResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L11)

___

### AnvilImpersonateAccountHandler

Ƭ **AnvilImpersonateAccountHandler**: (`params`: [`AnvilImpersonateAccountParams`](modules.md#anvilimpersonateaccountparams)) => `Promise`\<[`AnvilImpersonateAccountResult`](modules.md#anvilimpersonateaccountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilImpersonateAccountResult`](modules.md#anvilimpersonateaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilImpersonateAccountParams`](modules.md#anvilimpersonateaccountparams) |

##### Returns

`Promise`\<[`AnvilImpersonateAccountResult`](modules.md#anvilimpersonateaccountresult)\>

#### Defined in

[handlers/AnvilHandler.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L33)

___

### AnvilImpersonateAccountJsonRpcRequest

Ƭ **AnvilImpersonateAccountJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_impersonateAccount"``, `SerializeToJson`\<[`AnvilImpersonateAccountParams`](modules.md#anvilimpersonateaccountparams)\>\>

JSON-RPC request for `anvil_impersonateAccount` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L23)

___

### AnvilImpersonateAccountJsonRpcResponse

Ƭ **AnvilImpersonateAccountJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_impersonateAccount"``, `SerializeToJson`\<[`AnvilImpersonateAccountResult`](modules.md#anvilimpersonateaccountresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_impersonateAccount` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L28)

___

### AnvilImpersonateAccountParams

Ƭ **AnvilImpersonateAccountParams**: `Object`

Params fro `anvil_impersonateAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address to impersonate |

#### Defined in

[params/AnvilParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L11)

___

### AnvilImpersonateAccountProcedure

Ƭ **AnvilImpersonateAccountProcedure**: (`request`: [`AnvilImpersonateAccountJsonRpcRequest`](modules.md#anvilimpersonateaccountjsonrpcrequest)) => `Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](modules.md#anvilimpersonateaccountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](modules.md#anvilimpersonateaccountjsonrpcresponse)\>

JSON-RPC procedure for `anvil_impersonateAccount`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilImpersonateAccountJsonRpcRequest`](modules.md#anvilimpersonateaccountjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilImpersonateAccountJsonRpcResponse`](modules.md#anvilimpersonateaccountjsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L36)

___

### AnvilImpersonateAccountResult

Ƭ **AnvilImpersonateAccountResult**: ``null``

#### Defined in

[result/AnvilResult.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L4)

___

### AnvilLoadStateHandler

Ƭ **AnvilLoadStateHandler**: (`params`: [`AnvilLoadStateParams`](modules.md#anvilloadstateparams)) => `Promise`\<[`AnvilLoadStateResult`](modules.md#anvilloadstateresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilLoadStateResult`](modules.md#anvilloadstateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilLoadStateParams`](modules.md#anvilloadstateparams) |

##### Returns

`Promise`\<[`AnvilLoadStateResult`](modules.md#anvilloadstateresult)\>

#### Defined in

[handlers/AnvilHandler.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L86)

___

### AnvilLoadStateJsonRpcRequest

Ƭ **AnvilLoadStateJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_loadState"``, `SerializeToJson`\<[`AnvilLoadStateParams`](modules.md#anvilloadstateparams)\>\>

JSON-RPC request for `anvil_loadState` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L127)

___

### AnvilLoadStateJsonRpcResponse

Ƭ **AnvilLoadStateJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_loadState"``, `SerializeToJson`\<[`AnvilLoadStateResult`](modules.md#anvilloadstateresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_loadState` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L144)

___

### AnvilLoadStateParams

Ƭ **AnvilLoadStateParams**: `Object`

Params for `anvil_loadState` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `Record`\<`Hex`, `Hex`\> | The state to load |

#### Defined in

[params/AnvilParams.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L172)

___

### AnvilLoadStateProcedure

Ƭ **AnvilLoadStateProcedure**: (`request`: [`AnvilLoadStateJsonRpcRequest`](modules.md#anvilloadstatejsonrpcrequest)) => `Promise`\<[`AnvilLoadStateJsonRpcResponse`](modules.md#anvilloadstatejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilLoadStateJsonRpcResponse`](modules.md#anvilloadstatejsonrpcresponse)\>

JSON-RPC procedure for `anvil_loadState`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilLoadStateJsonRpcRequest`](modules.md#anvilloadstatejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilLoadStateJsonRpcResponse`](modules.md#anvilloadstatejsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L127)

___

### AnvilLoadStateResult

Ƭ **AnvilLoadStateResult**: ``null``

#### Defined in

[result/AnvilResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L33)

___

### AnvilMineHandler

Ƭ **AnvilMineHandler**: (`params`: [`AnvilMineParams`](modules.md#anvilmineparams)) => `Promise`\<[`AnvilMineResult`](modules.md#anvilmineresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilMineResult`](modules.md#anvilmineresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilMineParams`](modules.md#anvilmineparams) |

##### Returns

`Promise`\<[`AnvilMineResult`](modules.md#anvilmineresult)\>

#### Defined in

[handlers/AnvilHandler.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L48)

___

### AnvilMineJsonRpcRequest

Ƭ **AnvilMineJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_mine"``, `SerializeToJson`\<[`AnvilMineParams`](modules.md#anvilmineparams)\>\>

JSON-RPC request for `anvil_mine` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L53)

___

### AnvilMineJsonRpcResponse

Ƭ **AnvilMineJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_mine"``, `SerializeToJson`\<[`AnvilMineResult`](modules.md#anvilmineresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_mine` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L61)

___

### AnvilMineParams

Ƭ **AnvilMineParams**: `Object`

Params for `anvil_mine` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockCount?` | `number` | Number of blocks to mine. Defaults to 1 |
| `interval?` | `number` | mineing interval |

#### Defined in

[params/AnvilParams.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L46)

___

### AnvilMineProcedure

Ƭ **AnvilMineProcedure**: (`request`: [`AnvilMineJsonRpcRequest`](modules.md#anvilminejsonrpcrequest)) => `Promise`\<[`AnvilMineJsonRpcResponse`](modules.md#anvilminejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilMineJsonRpcResponse`](modules.md#anvilminejsonrpcresponse)\>

JSON-RPC procedure for `anvil_mine`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilMineJsonRpcRequest`](modules.md#anvilminejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilMineJsonRpcResponse`](modules.md#anvilminejsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L62)

___

### AnvilMineResult

Ƭ **AnvilMineResult**: ``null``

#### Defined in

[result/AnvilResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L13)

___

### AnvilResetHandler

Ƭ **AnvilResetHandler**: (`params`: [`AnvilResetParams`](modules.md#anvilresetparams)) => `Promise`\<[`AnvilResetResult`](modules.md#anvilresetresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilResetResult`](modules.md#anvilresetresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilResetParams`](modules.md#anvilresetparams) |

##### Returns

`Promise`\<[`AnvilResetResult`](modules.md#anvilresetresult)\>

#### Defined in

[handlers/AnvilHandler.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L52)

___

### AnvilResetJsonRpcRequest

Ƭ **AnvilResetJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_reset"``, `SerializeToJson`\<[`AnvilResetParams`](modules.md#anvilresetparams)\>\>

JSON-RPC request for `anvil_reset` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L61)

___

### AnvilResetJsonRpcResponse

Ƭ **AnvilResetJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_reset"``, `SerializeToJson`\<[`AnvilResetResult`](modules.md#anvilresetresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_reset` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L70)

___

### AnvilResetParams

Ƭ **AnvilResetParams**: `Object`

Params for `anvil_reset` handler

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fork` | \{ `block?`: `BlockTag` \| `Hex` \| `BigInt` ; `url?`: `string`  } |
| `fork.block?` | `BlockTag` \| `Hex` \| `BigInt` |
| `fork.url?` | `string` |

#### Defined in

[params/AnvilParams.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L61)

___

### AnvilResetProcedure

Ƭ **AnvilResetProcedure**: (`request`: [`AnvilResetJsonRpcRequest`](modules.md#anvilresetjsonrpcrequest)) => `Promise`\<[`AnvilResetJsonRpcResponse`](modules.md#anvilresetjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilResetJsonRpcResponse`](modules.md#anvilresetjsonrpcresponse)\>

JSON-RPC procedure for `anvil_reset`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilResetJsonRpcRequest`](modules.md#anvilresetjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilResetJsonRpcResponse`](modules.md#anvilresetjsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L69)

___

### AnvilResetResult

Ƭ **AnvilResetResult**: ``null``

#### Defined in

[result/AnvilResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L15)

___

### AnvilSetBalanceHandler

Ƭ **AnvilSetBalanceHandler**: (`params`: [`AnvilSetBalanceParams`](modules.md#anvilsetbalanceparams)) => `Promise`\<[`AnvilSetBalanceResult`](modules.md#anvilsetbalanceresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetBalanceResult`](modules.md#anvilsetbalanceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetBalanceParams`](modules.md#anvilsetbalanceparams) |

##### Returns

`Promise`\<[`AnvilSetBalanceResult`](modules.md#anvilsetbalanceresult)\>

#### Defined in

[handlers/AnvilHandler.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L60)

___

### AnvilSetBalanceJsonRpcRequest

Ƭ **AnvilSetBalanceJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_setBalance"``, `SerializeToJson`\<[`AnvilSetBalanceParams`](modules.md#anvilsetbalanceparams)\>\>

JSON-RPC request for `anvil_setBalance` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L77)

___

### AnvilSetBalanceJsonRpcResponse

Ƭ **AnvilSetBalanceJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_setBalance"``, `SerializeToJson`\<[`AnvilSetBalanceResult`](modules.md#anvilsetbalanceresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setBalance` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:88](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L88)

___

### AnvilSetBalanceParams

Ƭ **AnvilSetBalanceParams**: `Object`

Params for `anvil_setBalance` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address to set the balance for |
| `balance` | `Hex` \| `BigInt` | The balance to set |

#### Defined in

[params/AnvilParams.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L89)

___

### AnvilSetBalanceProcedure

Ƭ **AnvilSetBalanceProcedure**: (`request`: [`AnvilSetBalanceJsonRpcRequest`](modules.md#anvilsetbalancejsonrpcrequest)) => `Promise`\<[`AnvilSetBalanceJsonRpcResponse`](modules.md#anvilsetbalancejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetBalanceJsonRpcResponse`](modules.md#anvilsetbalancejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setBalance`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetBalanceJsonRpcRequest`](modules.md#anvilsetbalancejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetBalanceJsonRpcResponse`](modules.md#anvilsetbalancejsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L83)

___

### AnvilSetBalanceResult

Ƭ **AnvilSetBalanceResult**: ``null``

#### Defined in

[result/AnvilResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L19)

___

### AnvilSetChainIdHandler

Ƭ **AnvilSetChainIdHandler**: (`params`: [`AnvilSetChainIdParams`](modules.md#anvilsetchainidparams)) => `Promise`\<[`AnvilSetChainIdResult`](modules.md#anvilsetchainidresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetChainIdResult`](modules.md#anvilsetchainidresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetChainIdParams`](modules.md#anvilsetchainidparams) |

##### Returns

`Promise`\<[`AnvilSetChainIdResult`](modules.md#anvilsetchainidresult)\>

#### Defined in

[handlers/AnvilHandler.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L76)

___

### AnvilSetChainIdJsonRpcRequest

Ƭ **AnvilSetChainIdJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_setChainId"``, `SerializeToJson`\<[`AnvilSetChainIdParams`](modules.md#anvilsetchainidparams)\>\>

JSON-RPC request for `anvil_setChainId` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L109)

___

### AnvilSetChainIdJsonRpcResponse

Ƭ **AnvilSetChainIdJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_setChainId"``, `SerializeToJson`\<[`AnvilSetChainIdResult`](modules.md#anvilsetchainidresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setChainId` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L124)

___

### AnvilSetChainIdParams

Ƭ **AnvilSetChainIdParams**: `Object`

Params for `anvil_setChainId` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` | The chain id to set |

#### Defined in

[params/AnvilParams.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L153)

___

### AnvilSetChainIdProcedure

Ƭ **AnvilSetChainIdProcedure**: (`request`: [`AnvilSetChainIdJsonRpcRequest`](modules.md#anvilsetchainidjsonrpcrequest)) => `Promise`\<[`AnvilSetChainIdJsonRpcResponse`](modules.md#anvilsetchainidjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetChainIdJsonRpcResponse`](modules.md#anvilsetchainidjsonrpcresponse)\>

JSON-RPC procedure for `anvil_setChainId`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetChainIdJsonRpcRequest`](modules.md#anvilsetchainidjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetChainIdJsonRpcResponse`](modules.md#anvilsetchainidjsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:111](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L111)

___

### AnvilSetChainIdResult

Ƭ **AnvilSetChainIdResult**: ``null``

#### Defined in

[result/AnvilResult.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L27)

___

### AnvilSetCodeHandler

Ƭ **AnvilSetCodeHandler**: (`params`: [`AnvilSetCodeParams`](modules.md#anvilsetcodeparams)) => `Promise`\<[`AnvilSetCodeResult`](modules.md#anvilsetcoderesult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetCodeResult`](modules.md#anvilsetcoderesult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetCodeParams`](modules.md#anvilsetcodeparams) |

##### Returns

`Promise`\<[`AnvilSetCodeResult`](modules.md#anvilsetcoderesult)\>

#### Defined in

[handlers/AnvilHandler.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L64)

___

### AnvilSetCodeJsonRpcRequest

Ƭ **AnvilSetCodeJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_setCode"``, `SerializeToJson`\<[`AnvilSetCodeParams`](modules.md#anvilsetcodeparams)\>\>

JSON-RPC request for `anvil_setCode` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L85)

___

### AnvilSetCodeJsonRpcResponse

Ƭ **AnvilSetCodeJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_setCode"``, `SerializeToJson`\<[`AnvilSetCodeResult`](modules.md#anvilsetcoderesult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setCode` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L97)

___

### AnvilSetCodeParams

Ƭ **AnvilSetCodeParams**: `Object`

Params for `anvil_setCode` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address to set the code for |
| `code` | `Hex` | The code to set |

#### Defined in

[params/AnvilParams.ts:104](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L104)

___

### AnvilSetCodeProcedure

Ƭ **AnvilSetCodeProcedure**: (`request`: [`AnvilSetCodeJsonRpcRequest`](modules.md#anvilsetcodejsonrpcrequest)) => `Promise`\<[`AnvilSetCodeJsonRpcResponse`](modules.md#anvilsetcodejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetCodeJsonRpcResponse`](modules.md#anvilsetcodejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setCode`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetCodeJsonRpcRequest`](modules.md#anvilsetcodejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetCodeJsonRpcResponse`](modules.md#anvilsetcodejsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L90)

___

### AnvilSetCodeResult

Ƭ **AnvilSetCodeResult**: ``null``

#### Defined in

[result/AnvilResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L21)

___

### AnvilSetNonceHandler

Ƭ **AnvilSetNonceHandler**: (`params`: [`AnvilSetNonceParams`](modules.md#anvilsetnonceparams)) => `Promise`\<[`AnvilSetNonceResult`](modules.md#anvilsetnonceresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetNonceResult`](modules.md#anvilsetnonceresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetNonceParams`](modules.md#anvilsetnonceparams) |

##### Returns

`Promise`\<[`AnvilSetNonceResult`](modules.md#anvilsetnonceresult)\>

#### Defined in

[handlers/AnvilHandler.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L68)

___

### AnvilSetNonceJsonRpcRequest

Ƭ **AnvilSetNonceJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_setNonce"``, `SerializeToJson`\<[`AnvilSetNonceParams`](modules.md#anvilsetnonceparams)\>\>

JSON-RPC request for `anvil_setNonce` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L93)

___

### AnvilSetNonceJsonRpcResponse

Ƭ **AnvilSetNonceJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_setNonce"``, `SerializeToJson`\<[`AnvilSetNonceResult`](modules.md#anvilsetnonceresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setNonce` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L106)

___

### AnvilSetNonceParams

Ƭ **AnvilSetNonceParams**: `Object`

Params for `anvil_setNonce` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address to set the nonce for |
| `nonce` | `BigInt` | The nonce to set |

#### Defined in

[params/AnvilParams.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L119)

___

### AnvilSetNonceProcedure

Ƭ **AnvilSetNonceProcedure**: (`request`: [`AnvilSetNonceJsonRpcRequest`](modules.md#anvilsetnoncejsonrpcrequest)) => `Promise`\<[`AnvilSetNonceJsonRpcResponse`](modules.md#anvilsetnoncejsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetNonceJsonRpcResponse`](modules.md#anvilsetnoncejsonrpcresponse)\>

JSON-RPC procedure for `anvil_setNonce`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetNonceJsonRpcRequest`](modules.md#anvilsetnoncejsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetNonceJsonRpcResponse`](modules.md#anvilsetnoncejsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L97)

___

### AnvilSetNonceResult

Ƭ **AnvilSetNonceResult**: ``null``

#### Defined in

[result/AnvilResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L23)

___

### AnvilSetStorageAtHandler

Ƭ **AnvilSetStorageAtHandler**: (`params`: [`AnvilSetStorageAtParams`](modules.md#anvilsetstorageatparams)) => `Promise`\<[`AnvilSetStorageAtResult`](modules.md#anvilsetstorageatresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilSetStorageAtResult`](modules.md#anvilsetstorageatresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilSetStorageAtParams`](modules.md#anvilsetstorageatparams) |

##### Returns

`Promise`\<[`AnvilSetStorageAtResult`](modules.md#anvilsetstorageatresult)\>

#### Defined in

[handlers/AnvilHandler.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L72)

___

### AnvilSetStorageAtJsonRpcRequest

Ƭ **AnvilSetStorageAtJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_setStorageAt"``, `SerializeToJson`\<[`AnvilSetStorageAtParams`](modules.md#anvilsetstorageatparams)\>\>

JSON-RPC request for `anvil_setStorageAt` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L101)

___

### AnvilSetStorageAtJsonRpcResponse

Ƭ **AnvilSetStorageAtJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_setStorageAt"``, `SerializeToJson`\<[`AnvilSetStorageAtResult`](modules.md#anvilsetstorageatresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_setStorageAt` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L115)

___

### AnvilSetStorageAtParams

Ƭ **AnvilSetStorageAtParams**: `Object`

Params for `anvil_setStorageAt` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address to set the storage for |
| `position` | `Hex` \| `BigInt` | The position in storage to set |
| `value` | `Hex` \| `BigInt` | The value to set |

#### Defined in

[params/AnvilParams.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L134)

___

### AnvilSetStorageAtProcedure

Ƭ **AnvilSetStorageAtProcedure**: (`request`: [`AnvilSetStorageAtJsonRpcRequest`](modules.md#anvilsetstorageatjsonrpcrequest)) => `Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](modules.md#anvilsetstorageatjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](modules.md#anvilsetstorageatjsonrpcresponse)\>

JSON-RPC procedure for `anvil_setStorageAt`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilSetStorageAtJsonRpcRequest`](modules.md#anvilsetstorageatjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilSetStorageAtJsonRpcResponse`](modules.md#anvilsetstorageatjsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:104](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L104)

___

### AnvilSetStorageAtResult

Ƭ **AnvilSetStorageAtResult**: ``null``

#### Defined in

[result/AnvilResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L25)

___

### AnvilStopImpersonatingAccountHandler

Ƭ **AnvilStopImpersonatingAccountHandler**: (`params`: [`AnvilStopImpersonatingAccountParams`](modules.md#anvilstopimpersonatingaccountparams)) => `Promise`\<[`AnvilStopImpersonatingAccountResult`](modules.md#anvilstopimpersonatingaccountresult)\>

#### Type declaration

▸ (`params`): `Promise`\<[`AnvilStopImpersonatingAccountResult`](modules.md#anvilstopimpersonatingaccountresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`AnvilStopImpersonatingAccountParams`](modules.md#anvilstopimpersonatingaccountparams) |

##### Returns

`Promise`\<[`AnvilStopImpersonatingAccountResult`](modules.md#anvilstopimpersonatingaccountresult)\>

#### Defined in

[handlers/AnvilHandler.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/AnvilHandler.ts#L37)

___

### AnvilStopImpersonatingAccountJsonRpcRequest

Ƭ **AnvilStopImpersonatingAccountJsonRpcRequest**: [`JsonRpcRequest`](modules.md#jsonrpcrequest)\<``"anvil_stopImpersonatingAccount"``, `SerializeToJson`\<[`AnvilStopImpersonatingAccountParams`](modules.md#anvilstopimpersonatingaccountparams)\>\>

JSON-RPC request for `anvil_stopImpersonatingAccount` method

#### Defined in

[requests/AnvilJsonRpcRequest.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/requests/AnvilJsonRpcRequest.ts#L31)

___

### AnvilStopImpersonatingAccountJsonRpcResponse

Ƭ **AnvilStopImpersonatingAccountJsonRpcResponse**: [`JsonRpcResponse`](modules.md#jsonrpcresponse)\<``"anvil_stopImpersonatingAccount"``, `SerializeToJson`\<[`AnvilStopImpersonatingAccountResult`](modules.md#anvilstopimpersonatingaccountresult)\>, `AnvilError`\>

JSON-RPC response for `anvil_stopImpersonatingAccount` procedure

#### Defined in

[responses/AnvilJsonRpcResponse.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/responses/AnvilJsonRpcResponse.ts#L37)

___

### AnvilStopImpersonatingAccountParams

Ƭ **AnvilStopImpersonatingAccountParams**: `Object`

Params for `anvil_stopImpersonatingAccount` handler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address to stop impersonating |

#### Defined in

[params/AnvilParams.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/AnvilParams.ts#L22)

___

### AnvilStopImpersonatingAccountProcedure

Ƭ **AnvilStopImpersonatingAccountProcedure**: (`request`: [`AnvilStopImpersonatingAccountJsonRpcRequest`](modules.md#anvilstopimpersonatingaccountjsonrpcrequest)) => `Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](modules.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

#### Type declaration

▸ (`request`): `Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](modules.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

JSON-RPC procedure for `anvil_stopImpersonatingAccount`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AnvilStopImpersonatingAccountJsonRpcRequest`](modules.md#anvilstopimpersonatingaccountjsonrpcrequest) |

##### Returns

`Promise`\<[`AnvilStopImpersonatingAccountJsonRpcResponse`](modules.md#anvilstopimpersonatingaccountjsonrpcresponse)\>

#### Defined in

[procedure/AnvilProcedure.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/procedure/AnvilProcedure.ts#L43)

___

### AnvilStopImpersonatingAccountResult

Ƭ **AnvilStopImpersonatingAccountResult**: ``null``

#### Defined in

[result/AnvilResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/AnvilResult.ts#L6)

___

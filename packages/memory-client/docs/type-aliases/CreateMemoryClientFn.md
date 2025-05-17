[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / CreateMemoryClientFn

# Type Alias: CreateMemoryClientFn()

> **CreateMemoryClientFn** = \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options?`) => [`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

Defined in: [packages/memory-client/src/CreateMemoryClientFn.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/CreateMemoryClientFn.ts#L84)

Type definition for the function that creates a [MemoryClient](MemoryClient.md).

This function type represents `createMemoryClient`, which initializes a complete in-memory Ethereum
virtual machine with a comprehensive API. The function supports extensive configuration options for:

- Network forking from live Ethereum networks
- Custom chain settings and EVM parameters
- Mining behavior configuration
- State persistence
- Logging and debugging settings
- Custom account injection

The returned client integrates with viem's action system while providing TEVM-specific
capabilities for more advanced EVM interaction.

## Type Parameters

### TCommon

`TCommon` *extends* `Common` & `Chain` = `Common` & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

### TAccountOrAddress

`TAccountOrAddress` *extends* `Account` \| `Address` \| `undefined` = `undefined`

The account or address type for the client.

### TRpcSchema

`TRpcSchema` *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

The RPC schema type, defaults to `TevmRpcSchema`.

## Parameters

### options?

[`MemoryClientOptions`](MemoryClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

The options to configure the MemoryClient.

## Returns

[`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

- A configured MemoryClient instance.

## Throws

When configuration is invalid or initialization fails.

## Example

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/common";
import { parseEther } from "viem";

// Basic client with default settings
const basicClient = createMemoryClient();

// Advanced client with custom configuration
const client = createMemoryClient({
  // Fork from Optimism mainnet
  fork: {
    transport: http("https://mainnet.optimism.io")({}),
    blockTag: 'latest', // Or specific block hash/number
  },
  // Use Optimism chain configuration
  common: optimism,
  // Enable auto-mining (blocks mined after each transaction)
  miningConfig: {
    type: 'auto'
  },
  // Set client metadata
  name: 'Optimism Development Client',
  // Configure performance
  pollingInterval: 1000,
  // Modify EVM behavior
  allowUnlimitedContractSize: true,
  // Set logging verbosity
  loggingLevel: 'debug'
});

// Initialize and configure client
await client.tevmReady();

// Set up test account
await client.tevmSetAccount({
  address: '0x1234567890123456789012345678901234567890',
  balance: parseEther('100'),
  nonce: 0n
});

// Read from forked network
const balance = await client.getBalance({
  address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
});
```

## See

 - [MemoryClient](MemoryClient.md) - For the return type of this function
 - [MemoryClientOptions](MemoryClientOptions.md) - For detailed configuration options
 - [Client Guide](https://tevm.sh/learn/clients/) - Complete documentation

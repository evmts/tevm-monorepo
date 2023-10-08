# OPChain

EVMts has native support for OP Stack rollups. Rollups are built on top of the [chain](./chain.md) interface.

## Type

```typescript
import type { Chain, ChainContracts } from 'evmts/chains'
import type { Hex } from 'evmts'

type OPChain {
  rollup: Chain,
  base: Chain,
  sequencerRpc: string,
  genesis: {
    baseBlock: {
      hash: Hex,
      number: number,
    },
    rollupBlock: {
      hash: Hex,
      number: number,
    },
    systemConfigs: {
      overhead: Hex,
      scalar: Hex,
      gasLimit: Hex,
    }
  },
  opContracts: {
    l1: {
      systemConfig: ChainContract,
      batchInbox: ChainContract,
      AddressManager: ChainContract,
      L1CrossDomainMessengerProxy: ChainContract,
      L1ERC721BridgeProxy: ChainContract,
      L1StandardBridgeProxy: ChainContract,
      L2OutputOracleProxy: ChainContract,
      OptimismMintableERC20FactoryProxy: ChainContract,
      OptimismPortalProxy: ChainContract,
      ProxyAdmin: ChainContract,
      SystemConfigProxy: ChainContract,
    },
    l2: {
      l2CrossDomainMessenger: ChainContract,
      l2StandardBridge: ChainContract,
      gasPriceOracle: ChainContract,
      l1Block: ChainContract,
      l2ToL1MessagePasser: ChainContract,
      l2Erc721Bridge: ChainContract,
      optimismMintableErc721Factory: ChainContract,
    }
  },
}
```

## Known rollups

Known rollups can be imported directly from evmts/op. All known op are listed below. If your op rollup is not supported consider [opening a pr](https://todo.todo)

```typescript
import {
  optimismRollup,
  optimismSepoliaRollup,
  baseRollup,
  baseSepoliaRollup,
  zoraRollup,
  zoraSepoliaRollup,
  pgnRollup,
  pgnSepoliaRollup,
  opAnvilRollup,
} from 'evmts/chains'
```

## Custom Rollup

A custom rollup can be created via the defineRollup method

```typescript
import {
  defineRollup
} from 'evmts/chains'

const myCustomRollup = defineRollup({
  ...
})
```

In future versions one will also be able to generate a rollup config from the op-stack artifacts a rollup rpc url

import { Address, GetContractReturnType, Transport } from 'viem'
import { Chain } from 'viem/chains'

export type Deployments = Record<number, Address> | Address

export type EVMtsContract<TAbi> = {
  abi: TAbi
  bytecode: string
  id: string
  deployments: Deployments
}

export type Hash = any // TODO

export type RunResult<TAbi> = {
  data: unknown
  todo: TAbi
}

export type RunOptions<TAbi> = {
  todo: TAbi
}

export type BroadcastOptions<TAbi> = {
  todo: TAbi
}

export type BroadcastResults<TAbi> = {
  data: unknown
  txHash: Hash
  todo: TAbi
}

export type Script<TAbi> = {
  run: (runOptions?: RunOptions<TAbi>) => Promise<RunResult<TAbi>>
  broadcast: (
    runOptions?: BroadcastOptions<TAbi>,
  ) => Promise<BroadcastResults<TAbi>>
}

export type ScriptFactory = <TAbi>(
  contract: EVMtsContract<TAbi>,
) => Script<TAbi>
export type ContractFactory = <TAbi>(
  contract: EVMtsContract<TAbi>,
) => GetContractReturnType

export type PublicClient = {
  script: ScriptFactory
  contract: ContractFactory
}

export type PublicClientOptions = {
  chain: Chain
  // TODO make this our transport isntead
  transport: Transport
}

export const createPublicClient = (
  options: PublicClientOptions,
): PublicClient => {
  console.log(options)
  return {} as any
}

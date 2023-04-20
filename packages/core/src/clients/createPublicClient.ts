import { Chain } from "viem/chains";
import { Address, Transport, GetContractReturnType } from "viem";

type Deployments = Record<number, Address> | Address

type EVMtsContract<TAbi> = {
  abi:  TAbi,
  bytecode: string,
  id: string,
  deployments: Deployments
}

type Hash = any // TODO

type RunResult<TAbi> = {
  data: unknown,
}

type RunOptions<TAbi> = {}

type BroadcastOptions<TAbi> = {}
type BroadcastResults<TAbi> = {
  data: unknown,
  txHash: Hash,
}

type Script<TAbi> = {
  run: (runOptions?: RunOptions<TAbi>) => Promise<RunResult<TAbi>>
  broadcast: (runOptions?: BroadcastOptions<TAbi>) => Promise<BroadcastResults<TAbi>>
}

type ScriptFactory = <TAbi>(contract: EVMtsContract<TAbi>) => Script<TAbi>
type ContractFactory = <TAbi>(contract: EVMtsContract<TAbi>) => GetContractReturnType

type PublicClient = {
  script: ScriptFactory
  contract: ContractFactory
}

export type PublicClientOptions = {
  chain: Chain;
  // TODO make this our transport isntead
  transport: Transport;
};

export const createPublicClient = (
  options: PublicClientOptions
): PublicClient => {
  return {} as any
};

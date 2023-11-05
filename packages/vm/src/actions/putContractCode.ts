import { Address as EthjsAddress } from "@ethereumjs/util"
import { hexToBytes, type Address, type Hex } from "viem"
import type { EVMts } from "../evmts.js"

export type PutContractCodeParameters = {
  bytecode: Hex,
  contractAddress: Address,
}

export const putContractCode = async (evmts: EVMts, options: PutContractCodeParameters) => {
  await evmts.evm.stateManager.putContractCode(new EthjsAddress(hexToBytes(options.contractAddress)), hexToBytes(options.bytecode))
}


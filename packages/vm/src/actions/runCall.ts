import { hexToBytes, type Address, type Hex } from "viem"
import { Address as EthjsAddress } from "@ethereumjs/util"
import type { EVMts } from "../evmts.js"

export type RunCallParameters = {
  to: Address,
  caller: Address,
  origin: Address,
  gasLimit: bigint,
  data: Hex,
}


export const runCall = async (
  evmts: EVMts,
  options: RunCallParameters,
) => {
  return evmts.evm.runCall({
    to: new EthjsAddress(hexToBytes(options.to)),
    caller: new EthjsAddress(hexToBytes(options.caller)),
    origin: new EthjsAddress(hexToBytes(options.origin)),
    // pass lots of gas
    gasLimit: options.gasLimit,
    data: Buffer.from(options.data.slice(2), 'hex'),
  })
}

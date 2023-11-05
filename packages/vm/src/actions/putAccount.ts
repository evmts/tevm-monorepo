import type { Address } from "abitype"
import { hexToBytes, parseEther } from "viem"
import type { EVMts } from "../evmts.js"
import { Account as EthjsAccount, Address as EthjsAddress } from "@ethereumjs/util"

export type PutAccountParameters = {
  account: Address,
  balance?: bigint
}

export const putAccount = async (evmts: EVMts, { account, balance = parseEther('1000') }: PutAccountParameters): Promise<void> => {
  const address = new EthjsAddress(hexToBytes(account))
  await evmts.evm.stateManager.putAccount(address, new EthjsAccount(BigInt(0), balance))
  evmts.evm.stateManager.getAccount(address)
}


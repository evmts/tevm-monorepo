import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import type {
  AccessListEIP2930TxData,
  FeeMarketEIP1559TxData,
  TxData,
} from '@ethereumjs/tx'
import { Transaction } from '@ethereumjs/tx'
import { Account, Address } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import type { JsonFragment } from '@ethersproject/abi'
import { defaultAbiCoder as AbiCoder, Interface } from '@ethersproject/abi'

export const keyPair = {
  secretKey:
    '0x3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511',
  publicKey:
    '0x0406cc661590d48ee972944b35ad13ff03c7876eae3fd191e8a2f77311b0a3c6613407b5005e63d7d8d76b89d5f900cde691497688bb281e07a5052ff61edebdc0',
}

const common = new Common({
  chain: Chain.Rinkeby,
  hardfork: Hardfork.Istanbul,
})
const block = Block.fromBlockData(
  { header: { extraData: Buffer.alloc(97) } },
  { common },
)

export const insertAccount = async (vm: VM, address: Address) => {
  const acctData = {
    nonce: 0,
    balance: BigInt(10) ** BigInt(18), // 1 eth
  }
  const account = Account.fromAccountData(acctData)

  await vm.stateManager.putAccount(address, account)
}

export const getAccountNonce = async (vm: VM, accountPrivateKey: Buffer) => {
  const address = Address.fromPrivateKey(accountPrivateKey)
  const account = await vm.stateManager.getAccount(address)
  return account.nonce
}

type TransactionsData =
  | TxData
  | AccessListEIP2930TxData
  | FeeMarketEIP1559TxData

export const encodeFunction = (
  method: string,
  params?: {
    types: any[]
    values: unknown[]
  },
): string => {
  const parameters = params?.types ?? []
  const methodWithParameters = `function ${method}(${parameters.join(',')})`
  const signatureHash = new Interface([methodWithParameters]).getSighash(method)
  const encodedArgs = AbiCoder.encode(parameters, params?.values ?? [])

  return signatureHash + encodedArgs.slice(2)
}

export const encodeDeployment = (
  bytecode: string,
  params?: {
    types: any[]
    values: unknown[]
  },
) => {
  const deploymentData = '0x' + bytecode
  if (params) {
    const argumentsEncoded = AbiCoder.encode(params.types, params.values)
    return deploymentData + argumentsEncoded.slice(2)
  }
  return deploymentData
}

export const buildTransaction = (
  data: Partial<TransactionsData>,
): TransactionsData => {
  const defaultData: Partial<TransactionsData> = {
    nonce: BigInt(0),
    gasLimit: 2_000_000, // We assume that 2M is enough,
    gasPrice: 1,
    value: 0,
    data: '0x',
  }

  return {
    ...defaultData,
    ...data,
  }
}

export const evmts = (strings: TemplateStringsArray, ...literals: string[]) => {
  console.log({ literals })
  return strings.join('')
}

async function deployContract(
  vm: VM,
  senderPrivateKey: Buffer,
  deploymentBytecode: Buffer,
): Promise<Address> {
  // Contracts are deployed by sending their deployment bytecode to the address 0
  // The contract params should be abi-encoded and appended to the deployment bytecode.
  const data = encodeDeployment(deploymentBytecode.toString('hex'))
  const txData = {
    data,
    nonce: await getAccountNonce(vm, senderPrivateKey),
  }

  const tx = Transaction.fromTxData(buildTransaction(txData), { common }).sign(
    senderPrivateKey,
  )

  const deploymentResult = await vm.runTx({ tx, block })

  if (deploymentResult.execResult.exceptionError) {
    throw deploymentResult.execResult.exceptionError
  }

  return deploymentResult.createdAddress!
}

export const run = async (script: string) => {
  console.log('parsing the abi and byptecode')
  // the babel plugin transforms the template string into this object
  const { abi, bytecode } = script as unknown as {
    abi: JsonFragment[]
    bytecode: { object: string }
  }
  /**
   * Used ethereumjs-monorepo as example
   *
   * @see https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/examples/run-solidity-contract.ts
   */
  console.log('creating a new common chain')
  const common = new Common({
    chain: Chain.Goerli,
    hardfork: Hardfork.Istanbul,
  })
  console.log('creating a new vm instance')
  const vm = await VM.create({ common })
  console.log('creating a new account')
  const accountPk = Buffer.from(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex',
  )
  const accountAddress = Address.fromPrivateKey(accountPk)
  console.log('Account: ', accountAddress.toString())

  console.log('sending account eth...', accountAddress.toString())
  await insertAccount(vm, accountAddress)

  console.log('deploying contract')
  // eslint-disable-next-line no-debugger
  debugger // broken here atm
  const contractAddress = await deployContract(
    vm,
    accountPk,
    Buffer.from(bytecode.object),
  )

  console.log('Contract address:', contractAddress.toString())

  console.log('Creating sig hash')
  const sigHash = new Interface(abi).getSighash('run')

  const result = await vm.evm.runCall({
    to: contractAddress,
    caller: accountAddress,
    origin: accountAddress,
    data: Buffer.from(sigHash.slice(2), 'hex'),
    block,
  })

  // turn it into op codes
  // run it in the evm
  // return the result
  return result.execResult.returnValue.toString()
}

import {
  type L1Client,
  createGasPriceOracle,
  createL1Block,
  createL1Client,
} from '../index.js'
// tevm@1.0.0-next.44
// @tevm/opstack@1.0.0-next.43
// Run with: pnpm ts-node bug-createTransaction-state/index.ts
import { expect, test } from 'bun:test'

/* --------------------------------- PREPARE -------------------------------- */
const DEPOSITOR_ACCOUNT = '0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001'
const GasPriceOracle = createGasPriceOracle()
const L1Block = createL1Block()

const prepare = async () => {
  // Create client
  const client = createL1Client()

  // Set contracts
  await client.setAccount({
    address: L1Block.address,
    deployedBytecode: L1Block.deployedBytecode,
  })
  await client.setAccount({
    address: GasPriceOracle.address,
    deployedBytecode: GasPriceOracle.deployedBytecode,
  })

  return client
}

/* ------------------------------- SET ECOTONE ------------------------------ */
const setEcotoneAndCheck = async (client: L1Client) => {
  try {
    // Set Ecotone
    const writeRes = await client.contract({
      ...GasPriceOracle.write.setEcotone(),
      caller: DEPOSITOR_ACCOUNT,
      createTransaction: true,
    })
    expect(writeRes).toEqual({
      txHash:
        '0x7ee048dd02317d35781ef64e803eb1d3638cf539def0b6d6d9f2b86264d9dc60',
      createdAddresses: new Set(),
      data: undefined,
      executionGasUsed: 25588n,
      gas: 16751627n,
      logs: [],
      rawData: '0x',
      selfdestruct: new Set(),
    })

    // Check if Ecotone is active
    const res = await client.contract({
      ...GasPriceOracle.read.isEcotone(),
    })
    expect(res).toEqual({
      createdAddresses: new Set(),
      data: true,
      executionGasUsed: 2377n,
      gas: 16774838n,
      logs: [],
      rawData:
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      selfdestruct: new Set(),
    })

    // Check again with createTransaction: true
    const res2 = await client.contract({
      ...GasPriceOracle.read.isEcotone(),
      createTransaction: true,
    })
    expect(res2).toEqual({
      txHash:
        '0x0aca6409d550c4841d025f2054eb7ec66ca777d5237926917e5a310f23638e4d',
      createdAddresses: new Set(),
      data: true,
      executionGasUsed: 377n,
      gas: 16776838n,
      logs: [],
      rawData:
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      selfdestruct: new Set(),
    })

    return {
      ecotoneActivatedCreateTransactionFalse: res.data,
      ecotoneActivatedcreateTransactionTrue: res2.data,
    }
  } catch (err) {
    console.error('Error:', err)
    return { err }
  }
}

/* ---------------------------------- MAIN ---------------------------------- */
test('The optimism memory clients that are running in normal mode with a normal state manager should successfully deep clone state when running a call with `createTransaction=false`', async () => {
  const client = await prepare()

  // Set Ecotone and get both results
  expect(await setEcotoneAndCheck(client)).toEqual({
    ecotoneActivatedCreateTransactionFalse: true,
    ecotoneActivatedcreateTransactionTrue: true,
  })
})

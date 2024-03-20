// tevm@1.0.0-next.44
// @tevm/opstack@1.0.0-next.43
// Run with: pnpm ts-node bug-createTransaction-state/index.ts
import { expect, test } from 'bun:test';
import {
  createGasPriceOracle,
  createL1Block,
  type L1Client,
  createL1Client,
} from '../index.js';

/* --------------------------------- PREPARE -------------------------------- */
const DEPOSITOR_ACCOUNT = '0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001';
const GasPriceOracle = createGasPriceOracle();
const L1Block = createL1Block();

const prepare = async () => {
  // Create client
  const client = createL1Client();

  // Set contracts
  await client.setAccount({
    address: L1Block.address,
    deployedBytecode: L1Block.deployedBytecode,
  });
  await client.setAccount({
    address: GasPriceOracle.address,
    deployedBytecode: GasPriceOracle.deployedBytecode,
  });

  return client;
};

/* ------------------------------- SET ECOTONE ------------------------------ */
const setEcotoneAndCheck = async (client: L1Client) => {
  try {
    // Set Ecotone
    const writeRes = await client.contract({
      ...GasPriceOracle.write.setEcotone(),
      caller: DEPOSITOR_ACCOUNT,
      createTransaction: true,
    });
    expect(writeRes).toMatchSnapshot()

    // Check if Ecotone is active
    const res =
      await client.contract({
        ...GasPriceOracle.read.isEcotone(),
      });
    expect(res).toMatchSnapshot()

    // Check again with createTransaction: true
    const res2 =
      await client.contract({
        ...GasPriceOracle.read.isEcotone(),
        createTransaction: true,
      });
    expect(res2).toMatchSnapshot()

    return {
      ecotoneActivatedCreateTransactionFalse: res.data,
      ecotoneActivatedcreateTransactionTrue: res2.data,
    };
  } catch (err) {
    console.error('Error:', err);
    return {};
  }
};

/* ---------------------------------- MAIN ---------------------------------- */
const run = async () => {
  const client = await prepare();

  // Set Ecotone and get both results
  const {
    ecotoneActivatedCreateTransactionFalse,
    ecotoneActivatedcreateTransactionTrue,
  } = await setEcotoneAndCheck(client);
  expect(ecotoneActivatedcreateTransactionTrue).toBe(true);
  expect(ecotoneActivatedCreateTransactionFalse).toBe(true);
};

test('The optimism memory clients that are running in normal mode with a normal state manager should successfully deep clone state when running a call with `createTransaction=false`', run);

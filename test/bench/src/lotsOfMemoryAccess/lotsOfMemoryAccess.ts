import { createMemoryClient, parseEther } from "tevm";
import { MOCKERC1155_ABI, MOCKERC1155_BYTECODE } from "./constants.js";
import { createPublicClient, http, testActions } from "viem";

const caller = `0xd8da6bf26964af9d7eed9e03e53415d37aa96045` as const;

const token = "0x171593d3E5Bc8A2E869600F951ed532B9780Cbd2";

/**
 * initialize a brand new tevm client and then execute a call with lots of storage requirements. This is similar to how one might use tevm in a serverless function where tevm is reinitialized often
 */
export const lotsOfMemoryAccess = async (
  transport: any,
  ids = [1, 10, 20, 40],
) => {
  const tevm = createMemoryClient({ fork: { transport } });
  await tevm.tevmSetAccount({
    address: token,
    deployedBytecode: MOCKERC1155_BYTECODE,
  });
  const amounts = ids.map((id) => parseEther(`${id}`));
  return tevm.tevmContract({
    caller,
    to: token,
    abi: MOCKERC1155_ABI,
    functionName: "batchMint",
    args: [caller, ids, amounts],
    createTransaction: true,
    gas: BigInt(1_000_000_000),
  });
};
export const lotsOfMemoryAccessAnvil = async (
  anvilUrl: string = "http://localhost:8545",
  ids = [1, 10, 20, 40],
) => {
  const client = createPublicClient({ transport: http(anvilUrl) }).extend(
    testActions({ mode: "anvil" }),
  );
  await client.setCode({
    address: token,
    bytecode: MOCKERC1155_BYTECODE,
  });
  const amounts = ids.map((id) => parseEther(`${id}`));
  return client.readContract({
    account: caller,
    address: token,
    abi: MOCKERC1155_ABI,
    functionName: "batchMint",
    args: [caller, ids, amounts],
  });
};

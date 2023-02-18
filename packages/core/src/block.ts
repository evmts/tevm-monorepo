import { Block } from "@ethereumjs/block";
import { common } from "./hardFork";

export const block = Block.fromBlockData(
	{ header: { extraData: Buffer.alloc(97), baseFeePerGas: BigInt(0) } },
	{ common },
);

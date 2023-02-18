import { Address } from "@ethereumjs/util";
import type { JsonFragment } from "@ethersproject/abi";
import { defaultAbiCoder as AbiCoder, Interface } from "@ethersproject/abi";
import { ethers } from "ethers";
import { block } from "./block";
import { createVm } from "./createVm";
import { deployContract } from "./deployContract";
import { insertAccount } from "./insertAccount";

type TODOInfer = any;

export const run = async (
	script: {
		abi: JsonFragment[];
		bytecode: { object: string };
	},
	args: TODOInfer,
) => {
	const { abi, bytecode } = script;
	const vm = await createVm();

	const wallet = ethers.Wallet.createRandom();

	const address = Address.fromPrivateKey(
		Buffer.from(wallet.privateKey.slice(2), "hex"),
	);

	await insertAccount(vm, address);

	const contractAddress = await deployContract(
		vm,
		Buffer.from(wallet.privateKey.slice(2), "hex"),
		Buffer.from(bytecode.object.slice(2), "hex"),
	);

	const sigHash = new Interface(abi).getSighash("run");

	const encodeFunction = (params?: {
		types: string[];
		values: unknown[];
	}): string => {
		const parameters = params?.types ?? [];
		const encodedArgs = AbiCoder.encode(parameters, params?.values ?? []);
		return sigHash + encodedArgs.slice(2);
	};

	const data = Buffer.from(
		encodeFunction({
			types: ["uint256", "uint256"],
			values: args,
		}).slice(2),
		"hex",
	);

	const result = await vm.evm.runCall({
		to: contractAddress,
		caller: address,
		origin: address,
		data,
		block,
	});

	return result.execResult.returnValue;
};

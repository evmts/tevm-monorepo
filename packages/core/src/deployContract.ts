import { VM } from "@ethereumjs/vm";
import { Address } from "@ethereumjs/util";
import { encodeDeployment } from "./encodeDeployment";
import { getAccountNonce } from "./getAccountNonce";
import { Transaction } from "@ethereumjs/tx";
import { buildTransaction } from "./buildTransaction";
import { common } from "./hardFork";
import { block } from "./block";

export const deployContract = async (
	vm: VM,
	senderPrivateKey: Buffer,
	deploymentBytecode: Buffer,
): Promise<Address> => {
	// Contracts are deployed by sending their deployment bytecode to the address 0
	// The contract params should be abi-encoded and appended to the deployment bytecode.
	const data = encodeDeployment(deploymentBytecode.toString("hex"));
	const txData = {
		data,
		nonce: await getAccountNonce(vm, senderPrivateKey),
	};

	const tx = Transaction.fromTxData(buildTransaction(txData), { common }).sign(
		senderPrivateKey,
	);

	const deploymentResult = await vm.runTx({ tx, block });

	if (deploymentResult.execResult.exceptionError) {
		throw deploymentResult.execResult.exceptionError;
	}

	return deploymentResult.createdAddress!;
};

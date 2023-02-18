import { defaultAbiCoder as AbiCoder } from "@ethersproject/abi";

export const encodeDeployment = (
	bytecode: string,
	params?: {
		types: string[];
		values: unknown[];
	},
) => {
	const deploymentData = `0x${bytecode}`;
	if (params) {
		const argumentsEncoded = AbiCoder.encode(params.types, params.values);
		return deploymentData + argumentsEncoded.slice(2);
	}
	return deploymentData;
};

import { Address } from "@ethereumjs/util";
import { VM } from "@ethereumjs/vm";

export const getAccountNonce = async (vm: VM, accountPrivateKey: Buffer) => {
	const address = Address.fromPrivateKey(accountPrivateKey);
	const account = await vm.stateManager.getAccount(address);
	return account.nonce;
};

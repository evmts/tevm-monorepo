import { Account, Address } from "@ethereumjs/util";
import { VM } from "@ethereumjs/vm";

export const insertAccount = async (vm: VM, address: Address) => {
	const acctData = {
		nonce: 0,
		balance: BigInt(10) ** BigInt(18), // 1 eth
	};
	const account = Account.fromAccountData(acctData);

	await vm.stateManager.putAccount(address, account);
};

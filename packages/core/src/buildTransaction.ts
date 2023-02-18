import type {
	AccessListEIP2930TxData,
	FeeMarketEIP1559TxData,
	TxData,
} from "@ethereumjs/tx";

type TransactionsData =
	| TxData
	| AccessListEIP2930TxData
	| FeeMarketEIP1559TxData;

export const buildTransaction = (
	data: Partial<TransactionsData>,
): TransactionsData => {
	const defaultData: Partial<TransactionsData> = {
		nonce: BigInt(0),
		gasLimit: 2_000_000, // We assume that 2M is enough,
		gasPrice: 1,
		value: 0,
		data: "0x",
	};

	return {
		...defaultData,
		...data,
	};
};

import { beforeEach, describe, expect, it } from "vitest";
import { forkUrl } from "../transports/forkUrl";
import {
	EVMtsContract,
	PublicClient,
	createPublicClient,
} from "../clients/createPublicClient";
import { optimism } from "viem/chains";
import { contract } from "./contract";

const erc20: EVMtsContract<any> = {
	abi: "TODO" as any,
	bytecode: "TODO" as any,
	deployments: "TODO" as any,
	id: "TODO" as any,
};

describe.skipIf(process.env["CI"])(contract.name, () => {
	let client: PublicClient;

	beforeEach(() => {
		client = createPublicClient({
			chain: optimism,
			transport: forkUrl({ url: "http://localhost:8545" }),
		});
	});

	it("Should return a viem contract", () => {
		const c = contract(client, erc20);
		expect(c.balanceOf).toBeDefined();
	});
});

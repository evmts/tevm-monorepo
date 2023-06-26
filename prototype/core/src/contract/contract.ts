import { EVMtsContract, PublicClient } from '../clients/createPublicClient'

type TODO = any

export type ViemContract = TODO

export const contract = (
	client: PublicClient,
	contract: EVMtsContract<any>,
	options?: {},
) => {
	console.log({
		client,
		contract,
		options,
	})
	return {} as ViemContract
}

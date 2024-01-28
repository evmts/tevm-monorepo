import { wait } from '../utils/wait.js'
import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import fs from 'fs-extra'

export const useCopy = (
	from: string,
	to: string,
	onSuccess: () => void,
	withWait = 0,
): UseMutationResult<void, Error, void, unknown> => {
	return useMutation({
		onSuccess,
		mutationFn: async () => {
			fs.copySync(from, to)
			// slowing down how this resolves makes the ux better and more clear
			await wait(withWait)
		},
	})
}

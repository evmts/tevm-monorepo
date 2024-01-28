import { wait } from '../utils/wait.js'
import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import fs from 'fs-extra'

export const useCreateDir = (
	appPath: string,
	onSuccess: () => void,
	withWait = 0,
): UseMutationResult<void, Error, void, unknown> => {
	return useMutation({
		onSuccess,
		mutationFn: async () => {
			if (await fs.exists(appPath)) {
				throw new Error(`Directory ${appPath} already exists`)
			}
			await fs.mkdir(appPath, { recursive: true })
			// slowing down this resolving makes the ux better
			await wait(withWait)
		},
	})
}

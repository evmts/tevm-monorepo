import { constants } from 'fs'
import { access } from 'fs/promises'

export const fileExists = async (path: string) => {
	try {
		// TODO not the most robust check for existence here
		await access(path, constants.F_OK)
		return true
	} catch (e) {
		// TODO should be inspecting the error here
		return false
	}
}

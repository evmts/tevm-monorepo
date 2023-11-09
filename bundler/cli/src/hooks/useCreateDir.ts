import fs from 'fs-extra'
import { useMutation } from '@tanstack/react-query'
import { wait } from '../utils/wait.js'

export const useCreateDir = (appPath: string, onSuccess: () => void, withWait = 0) => {
  return useMutation({
    onSuccess,
    mutationFn: async () => {
      if (await fs.exists(appPath)) {
        throw new Error(`Directory ${appPath} already exists`)
      }
      await fs.mkdir(appPath, { recursive: true })
      // slowing down this resolving makes the ux better
      await wait(withWait)
    }
  })
}


import fs from 'fs-extra'
import { useMutation } from '@tanstack/react-query'

export const useCreateDir = (appPath: string, onSuccess: () => void) => {
  return useMutation({
    onSuccess,
    mutationFn: async () => {
      if (await fs.exists(appPath)) {
        throw new Error(`Directory ${appPath} already exists`)
      }
      await fs.mkdir(appPath, { recursive: true })
    }
  })
}


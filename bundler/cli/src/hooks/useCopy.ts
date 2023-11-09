import fs from 'fs-extra'
import { useMutation } from '@tanstack/react-query'
import { wait } from '../utils/wait.js'

export const useCopy = (from: string, to: string, onSuccess: () => void, withWait = 0) => {
  return useMutation({
    onSuccess,
    mutationFn: async () => {
      fs.copySync(from, to)
      // slowing down how this resolves makes the ux better and more clear
      await wait(withWait)
    }
  })
}


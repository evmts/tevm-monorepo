import fs from 'fs-extra'
import { useMutation } from '@tanstack/react-query'

export const useCopy = (from: string, to: string, onSuccess: () => void) => {
  return useMutation({
    onSuccess,
    mutationFn: async () => {
      fs.copySync(from, to)
    }
  })
}


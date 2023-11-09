import { useEffect, useMemo } from 'react'
import type { Store } from '../state/Store.js'
import { join, basename, dirname } from 'path'
import { useMutation } from '@tanstack/react-query'
import { useCreateDir } from './useCreateDir.js'
import { useCopy } from './useCopy.js'
import { useExec } from './useExec.js'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixturesDir = join(__dirname, '..', '..', 'fixtures')

export const useCreateEvmtsApp = (
  state: Store,
) => {
  const appPath = join(process.cwd(), basename(state.name))
  const fixturePath = join(fixturesDir, state.framework + '/')

  const createFixturesMutation = useCreateDir(appPath, () => {
    copyTemplateMutation.mutate()
  })
  const copyTemplateMutation = useCopy(fixturePath, appPath, () => {
    if (!state.noGit) {
      gitInitMutation.mutate()
    } else if (!state.noInstall) {
      installDependenciesMutation.mutate()
    } else {
      goToNextPageMutation.mutate()
    }
  })
  const gitInitMutation = useExec('git', appPath, ['init'], () => {
    console.log('git init done')
    if (!state.noInstall) {
      installDependenciesMutation.mutate()
    } else {
      goToNextPageMutation.mutate()
    }
  })
  const installDependenciesMutation = useExec(state.packageManager, appPath, ['install'], () => {
    console.log('install dependencies done')
    state.goToNextPage({})
  })
  const goToNextPageMutation = useMutation({
    mutationFn: async () => {
      state.goToNextPage({})
    }
  })

  useEffect(() => {
    createFixturesMutation.mutate()
  }, [])

  return useMemo(() => {
    const mutations = []
    mutations.push(createFixturesMutation)
    mutations.push(copyTemplateMutation)
    if (!state.noGit) {
      mutations.push(gitInitMutation)
    }
    if (!state.noInstall) {
      mutations.push(installDependenciesMutation)
    }
    mutations.push(goToNextPageMutation)

    const length = mutations.length
    const isFailure = mutations.some(mutation => mutation.isError)
    const errors = mutations.map(mutation => typeof mutation.error === 'string' ? mutation.error : mutation.error?.message).filter(Boolean)
    const isComplete = mutations.every(mutation => mutation.isSuccess)
    const settled = mutations.filter(mutation => mutation.isError || mutation.isSuccess).length
    const currentMutation = mutations[settled]

    let output: { stdout: string, stderr: string } | {} = {}
    if (currentMutation && 'stdout' in currentMutation) {
      output = {
        stdout: currentMutation.stdout,
        stderr: currentMutation.stderr,
      }
    }

    const debugState = {
      createFixture: {
        isSuccess: createFixturesMutation.isSuccess,
        data: createFixturesMutation.data,
        loading: createFixturesMutation.isPending,
        error: createFixturesMutation.error,
      },
      copyTemplate: {
        isSuccess: copyTemplateMutation.isSuccess,
        data: copyTemplateMutation.data,
        loading: copyTemplateMutation.isPending,
        error: copyTemplateMutation.error,
      },
      gitInit: {
        isSuccess: gitInitMutation.isSuccess,
        data: gitInitMutation.data,
        loading: gitInitMutation.isRunning && !gitInitMutation.isError && !gitInitMutation.isSuccess,
        error: gitInitMutation.error,
      },
      installDependencies: {
        isSuccess: installDependenciesMutation.isSuccess,
        data: installDependenciesMutation.data,
        loading: installDependenciesMutation.isRunning && !installDependenciesMutation.isError && !installDependenciesMutation.isSuccess,
        error: installDependenciesMutation.error,
      },
      goToNextPage: {
        isSuccess: goToNextPageMutation.isSuccess,
        data: goToNextPageMutation.data,
        loading: goToNextPageMutation.isPending,
        error: goToNextPageMutation.error,
      },
    }

    return {
      debugState,
      errors,
      output,
      length,
      settled,
      isFailure,
      isComplete,
      currentMutation,
      createFixturesMutation,
      copyTemplateMutation,
      gitInitMutation,
      installDependenciesMutation,
      goToNextPageMutation
    }
  }, [createFixturesMutation, copyTemplateMutation, gitInitMutation, installDependenciesMutation])
}

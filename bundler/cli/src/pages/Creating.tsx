import { Box, Text } from 'ink'
import React from 'react'
import type { Store } from '../state/Store.js'
import Table from '../components/Table.js'
import { useCreateEvmtsApp } from '../hooks/useCreateEvmtsApp.js'

type Props = {
  store: Store
}

const ConfigTable = ({ store }: Props) => {
  const mainData = {
    name: store.name,
    framework: store.framework,
    'node_modules': store.packageManager,
    solidity: store.solidityFramework === 'none' ? 'EVMts' : store.solidityFramework,
    testFrameworks: store.testFrameworks,
  }
  const secondaryData = {
    path: store.path,
    ts: store.typescriptStrictness,
    chains: store.chainIdInput,
    ci: store.ciChoice,
    linter: store.linter,
  }

  const mainTable = <Table data={[mainData]} />
  const secondaryTable = <Table data={[secondaryData]} />
  return <>
    {mainTable}
    {secondaryTable}
  </>
}

export const Creating: React.FC<Props> = ({ store }) => {
  const createState = useCreateEvmtsApp(store)
  return (
    <Box display="flex" flexDirection="column">
      <ConfigTable store={store} />
      <Text>Creating</Text>
      <Text>{JSON.stringify(createState.debugState, null, 2)}</Text>
      <Text>completed {createState.settled} of {createState.length} tasks</Text>
      {createState.isComplete && <Text>Success!</Text>}
      {createState.isFailure && <Text color="red">Failed to create app</Text>}
      {createState.errors && <Text color="red">{createState.errors}</Text>}
      {createState.installDependenciesMutation.isRunning && <Text>Installing dependencies...</Text>}
      {createState.gitInitMutation.isRunning && <Text>Initializing git repo...</Text>}
      {!createState.copyTemplateMutation.isIdle && <Text>Copying template...</Text>}
      {!createState.createFixturesMutation.isIdle && <Text>Creating fixtures...</Text>}
      {createState.createFixturesMutation.error && <Text>Creating fixtures error {
        createState.createFixturesMutation.error.message
      }</Text>}
      {createState.currentMutation?.error && <Text>Failed to run: {createState.currentMutation.error.toString()}</Text>}
      <Text></Text>
      <Text></Text>
      <Text>
        {'stdout' in createState.output ? createState.output.stdout : null}
      </Text>
      <Text color="red">
        {'stderr' in createState.output ? createState.output.stderr : null}
      </Text>
    </Box>
  )
}


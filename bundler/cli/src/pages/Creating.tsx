import { Box, Text } from 'ink'
import React, { Suspense } from 'react'
import type { Store } from '../state/Store.js'
import Table from '../components/Table.js'

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
  return (
    <Box display="flex" flexDirection="column">
      <Text>Creating</Text>
      <Suspense fallback={<></>}>
        <ConfigTable store={store} />
      </Suspense>
    </Box>
  )
}


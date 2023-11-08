import React from 'react'
import { Box, Text } from "ink"
import type { FC } from "react"

export type StepProps = {
  name: string
  prompt: string
  children: React.ReactNode
}

const formatName = (name: string) => {
  const DESIRED_WIDTH = 12
  const leftWidth = Math.floor((DESIRED_WIDTH - name.length) / 2)
  const rightWidth = Math.ceil((DESIRED_WIDTH - name.length) / 2)
  return ' '.repeat(leftWidth) + name + ' '.repeat(rightWidth)
}

export const Step: FC<StepProps> = ({ name, prompt, children }) => {
  return <Box minHeight={3} flexDirection='column'>
    <Box flexDirection='row' gap={2}>
      <Text bold color='black' backgroundColor='#A7DBAB'>
        {formatName(name)}
      </Text>
      <Text>{prompt}</Text>
    </Box>
    <Box paddingLeft={13}>{children}</Box>
  </Box>
}

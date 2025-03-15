import { Box, Text } from 'ink'
import React from 'react'

type Props = {
  data: Array<Record<string, string>>
}

export default function Table({ data }: Props) {
  const columns = Object.keys(data[0] as Record<string, string>)
  const columnWidths = columns.map(col => 
    Math.max(
      col.length,
      ...data.map(row => String(row[col]).length)
    ) + 2
  )

  const renderRow = (row: Record<string, string>, isHeader = false) => (
    <Box>
      <Text>│ </Text>
      {columns.map((col, i) => (
        <Text key={col} bold={isHeader}>
          {(isHeader ? col : row[col])?.padEnd(columnWidths[i] as number)}
          <Text>│ </Text>
        </Text>
      ))}
    </Box>
  )

  const renderSeparator = (char: string) => (
    <Box>
      <Text>{char}</Text>
      {columnWidths.map((width, i) => (
        <Text key={i}>
          {'─'.repeat(width)}
          <Text>{char}</Text>
        </Text>
      ))}
    </Box>
  )

  return (
    <Box flexDirection="column">
      {renderSeparator('┌')}
      {renderRow(data[0] as Record<string, string>, true)}
      {renderSeparator('├')}
      {data.map((row, i) => (
        <React.Fragment key={i}>
          {renderRow(row)}
          {i < data.length - 1 && renderSeparator('├')}
        </React.Fragment>
      ))}
      {renderSeparator('└')}
    </Box>
  )
} 
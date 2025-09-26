import { Box, Text } from 'ink'
import InkSelectInput from 'ink-select-input'
import { mainSymbols } from 'figures'

export type Item = {
  key?: string
  label: string
  value: string
}

type Props = {
  items: Array<Item>
  onSelect: (item: Item) => void
}

type IndicatorProps = {
  isSelected: boolean
}

type ItemProps = {
  label: string
  isSelected: boolean
}

const IndicatorComponent = ({ isSelected }: IndicatorProps) => {
  return (
    <Box marginRight={1}>
      {isSelected ? (
        <Text color='#B19CD9'>{mainSymbols.pointer}</Text>
      ) : (
        <Text> </Text>
      )}
    </Box>
  )
}

const ItemComponent = ({ label, isSelected }: ItemProps) => {
  return <Text color={isSelected ? '#A4DDED' : 'white'}>{label}</Text>
}

export const SelectInput = ({ items, onSelect }: Props) => {
  const initialIndex = items.findIndex((item) =>
    item.label.includes('(recommended)')
  )

  return (
    <InkSelectInput
      // @ts-ignore - Types are incompatible but the component works as expected
      itemComponent={ItemComponent}
      // @ts-ignore - Types are incompatible but the component works as expected
      indicatorComponent={IndicatorComponent}
      initialIndex={initialIndex > -1 ? initialIndex : 0}
      items={items}
      onSelect={onSelect}
    />
  )
}
import React from 'react'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import { useCounter } from '../hooks/useCounter.js'

const titleText = 'Create Tevm App'
const loadingTitleText = 'Creating Tevm App'

type Props = { loading?: boolean }

export const FancyCreateTitle: React.FC<Props> = ({ loading }) => {
  const animationSpeed = 2
  const { count: i } = useCounter(titleText.length / animationSpeed)

  const text = `${loading ? loadingTitleText : titleText}${
    loading ? '.'.repeat(Math.floor(i * 0.15) % 4) : ''
  }`.slice(0, i + 1)
  
  return (
    <Gradient name='pastel'>
      <BigText font='tiny' text={text} />
    </Gradient>
  )
} 
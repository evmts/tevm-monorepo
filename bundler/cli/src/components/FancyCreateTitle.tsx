import React from 'react'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import { useCounter } from '../hooks/useCounter.js'

const titleText = 'Create EVMts App'

/**
 * A fancy pastel gradiant title with an animation for the create-evmts-app
 */
export const FancyCreateTitle: React.FC<{}> = () => {
  const animationSpeed = 1
  // WARNING: If you get rid of this a set interval will not exist and the cli might
  // start exiting early!!!
  const { count: i } = useCounter(
    titleText.length / animationSpeed,
  )
  return (
    <Gradient name='pastel'>
      <BigText font="tiny" text={titleText.slice(0, i + 1)} />
    </Gradient>
  )
}


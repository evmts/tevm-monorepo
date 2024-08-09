import { useCounter } from '../hooks/useCounter.js';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import React from 'react';
const titleText = 'Create EVMts App';
const loadingTitleText = 'Creating EVMts App';
/**
 * A fancy pastel gradiant title with an animation for the create-evmts-app
 */
export const FancyCreateTitle = ({ loading }) => {
    const animationSpeed = 2;
    // WARNING: If you get rid of this a set interval will not exist and the cli might
    // start exiting early!!!
    const { count: i } = useCounter(titleText.length / animationSpeed);
    const text = `${loading ? loadingTitleText : titleText}${loading ? '.'.repeat(Math.floor(i * 0.15) % 4) : ''}`.slice(0, i + 1);
    return (React.createElement(Gradient, { name: 'pastel' },
        React.createElement(BigText, { font: 'tiny', text: text })));
};

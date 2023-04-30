import { Decorator } from './Decorator'

/**
 * Util used to turn an array of decorators into a single decorator
 */
export const composeDecorators = (...decorators: Decorator[]): Decorator => {
  return (createInfo, ts, logger) => {
    if (decorators.length === 0) {
      return createInfo.languageServiceHost
    }

    const [nextDecorator, ...restDecorators] = decorators

    const decoratedHost = nextDecorator(createInfo, ts, logger)

    const wrappedCreateInfo = {
      ...createInfo,
      languageServiceHost: decoratedHost,
    }

    return composeDecorators(...restDecorators)(wrappedCreateInfo, ts, logger)
  }
}

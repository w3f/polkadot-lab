import { createLogger } from '../logger';

export function startAction(): void {
    const logger = createLogger('info');

    logger.info('Hello world!')
}

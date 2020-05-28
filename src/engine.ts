import { Logger } from '@w3f/logger';

import { EngineManager, EngineConfig } from './types';

export class Engine implements EngineManager {
    constructor(private readonly cfg: EngineConfig, private readonly logger: Logger) { }

    async start(): Promise<void> {
        this.logger.info('Execution engine started');
    }

    async stop(): Promise<void> {
        this.logger.info('Execution engine stopped');
    }
}

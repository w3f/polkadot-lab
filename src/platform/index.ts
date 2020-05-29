import { Logger } from '@w3f/logger';

import { ExecutionMode, PlatformManager } from '../types';
import { LocalPlatform } from './local';


export class Platform implements PlatformManager {
    private readonly strategy: PlatformManager;

    constructor(
        private readonly mode: ExecutionMode,
        private readonly nodes: number,
        private readonly logger: Logger
    ) {
        if (mode === ExecutionMode.Local) {
            this.strategy = new LocalPlatform(nodes, logger);
        }
    }

    async create(): Promise<void> {
        return this.strategy.create();
    }
    async destroy(): Promise<void> {
        return this.strategy.destroy();
    }
    async getKubeconfig(): Promise<string> {
        return this.strategy.getKubeconfig();
    }
}

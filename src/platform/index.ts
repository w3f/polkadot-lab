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
        switch (mode) {
            case ExecutionMode.Local:
                this.strategy = new LocalPlatform(nodes, logger);
                break;
            default:
                throw new Error(`Execution mode ${mode} not implemented`);
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

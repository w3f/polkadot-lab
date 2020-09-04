import { Logger } from '@w3f/logger';

import { ExecutionMode, PlatformManager } from '../types';
import { LocalPlatform } from './local';
import { RemotePlatform } from './remote';


export class Platform implements PlatformManager {
    private strategy: PlatformManager;

    constructor(
        private readonly name: string,
        private readonly mode: ExecutionMode,
        private readonly size: number,
        private readonly logger: Logger
    ) {
    }

    async create(): Promise<void> {
        await this.init();

        return this.strategy.create();
    }
    async destroy(): Promise<void> {
        await this.init();

        return this.strategy.destroy();
    }
    async getKubeconfig(): Promise<string> {
        await this.init();

        return this.strategy.getKubeconfig();
    }

    private async init(): Promise<void> {
        if (!this.strategy) {
            switch (this.mode) {
                case ExecutionMode.Local: {
                    this.strategy = new LocalPlatform(this.name, this.logger);
                    break;
                }
                case ExecutionMode.Remote: {
                    this.strategy = new RemotePlatform(this.name, this.size, this.logger);
                    break;
                }
                default: {
                    throw new Error(`Execution mode ${this.mode} not implemented`);
                }
            }
        }
    }
}

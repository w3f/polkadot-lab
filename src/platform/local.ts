import { Logger } from '@w3f/logger';
import { Kind } from '@w3f/kind';

import { PlatformManager } from '../types';


export class LocalPlatform implements PlatformManager {
    private kind: Kind;

    constructor(
        private readonly name: string,
        private readonly logger: Logger) { }

    async create(): Promise<void> {
        await this.init();

        return this.kind.start(this.name);
    }
    async destroy(): Promise<void> {
        await this.init();

        return this.kind.stop(this.name);
    }
    async getKubeconfig(): Promise<string> {
        await this.init();

        return this.kind.kubeconfig(this.name);
    }

    private async init(): Promise<void> {
        if (!this.kind) {
            this.kind = await Kind.create(this.logger);
        }
    }
}

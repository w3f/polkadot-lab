import { Logger } from '@w3f/logger';
import { Kind } from '@w3f/kind';

import { PlatformManager } from '../types';
import { ClusterName } from '../constants';


export class LocalPlatform implements PlatformManager {
    private kind: Kind;

    constructor(private readonly logger: Logger) { }

    async create(): Promise<void> {
        await this.init();

        return this.kind.start(ClusterName);
    }
    async destroy(): Promise<void> {
        await this.init();

        return this.kind.stop(ClusterName);
    }
    async getKubeconfig(): Promise<string> {
        await this.init();

        return this.kind.kubeconfig(ClusterName);
    }

    private async init(): Promise<void> {
        if (!this.kind) {
            this.kind = await Kind.create(this.logger);
        }
    }
}

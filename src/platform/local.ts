import { Logger } from '@w3f/logger';
import { Kind } from '@w3f/kind';

import { PlatformManager } from '../types';
import { ClusterName } from '../constants';


export class LocalPlatform implements PlatformManager {
    private kind: Kind;

    constructor(private readonly logger: Logger) { }

    async create(): Promise<void> {
        this.init();

        return this.kind.start(ClusterName);
    }
    async destroy(): Promise<void> {
        return
    }
    async getKubeconfig(): Promise<string> {
        return
    }

    private async init(): Promise<void> {
        if (!this.kind) {
            this.kind = await Kind.create(this.logger);
        }
    }
}

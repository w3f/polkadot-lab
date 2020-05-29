import { Logger } from '@w3f/logger';

import { ExecutionMode, PlatformManager } from '../types';


export class LocalPlatform implements PlatformManager {
    constructor(
        private readonly nodes: number,
        private readonly logger: Logger
    ) {
    }

    async create(): Promise<void> {
        return
    }
    async destroy(): Promise<void> {
        return
    }
    async getKubeconfig(): Promise<string> {
        return
    }
}

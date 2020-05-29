import { Logger } from '@w3f/logger';

import { ExecutionMode, PlatformManager } from '../types';


export class Platform implements PlatformManager {
    constructor(
        private readonly mode: ExecutionMode,
        private readonly nodes: number,
        private readonly logger: Logger) { }

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

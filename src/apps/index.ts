import { Logger } from '@w3f/logger';

import { Topology, ApplicationsManager } from '../types';


export class Apps implements ApplicationsManager {
    constructor(
        private readonly topology: Topology,
        private readonly logger: Logger
    ) { }

    async install(kubeconfig: string): Promise<void> {
        return
    }
}

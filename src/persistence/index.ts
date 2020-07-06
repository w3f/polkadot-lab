import { Logger } from '@w3f/logger';
import { LabResult } from '@w3f/polkadot-lab-types';

import {
    PersistenceManager,
    PersistenceConfig,
    PersistenceKind
} from "../types";
import { FilePersistence } from './file';


export class Persistence implements PersistenceManager {
    private strategy: PersistenceManager;

    constructor(
        private readonly config: PersistenceConfig,
        private readonly logger: Logger
    ) { }

    async saveResults(results: Array<LabResult>): Promise<void> {
        await this.init();

        return this.strategy.saveResults(results);
    }

    private async init(): Promise<void> {
        if (!this.strategy) {
            switch (this.config.kind) {
                case PersistenceKind.File: {
                    this.strategy = new FilePersistence(this.config, this.logger);
                    break;
                }
                default: {
                    throw new Error(`Persistence kind ${this.config.kind} not implemented`);
                }
            }
        }

    }
}

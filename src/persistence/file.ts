import { Logger } from '@w3f/logger';
import { LabResult } from '@w3f/polkadot-lab-types';
import * as fs from 'fs-extra';

import {
    PersistenceManager,
    FilePersistenceConfig
} from "../types";


export class FilePersistence implements PersistenceManager {
    constructor(
        private readonly config: FilePersistenceConfig,
        private readonly logger: Logger
    ) { }

    async saveResults(results: Array<LabResult>): Promise<void> {
        this.logger.debug(`Writing results to ${this.config.path}`);

        fs.writeFileSync(this.config.path, JSON.stringify(results));
    }
}

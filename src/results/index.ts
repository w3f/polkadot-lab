import { Logger } from '@w3f/logger';

import { ResultData, ResultsManager, Metrics } from '../types';


export class Results implements ResultsManager {
    constructor(
        private readonly targetStd: number,
        private readonly metrics: Metrics,
        private readonly logger: Logger
    ) { }

    async runTests(): Promise<ResultData> {
        return
    }
}

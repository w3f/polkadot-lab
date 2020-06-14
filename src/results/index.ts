import { Logger } from '@w3f/logger';

import { ResultData, ResultsManager, TestCaseDefinitions } from '../types';


export class Results implements ResultsManager {
    constructor(
        private readonly targetStd: number,
        private readonly testCases: TestCaseDefinitions,
        private readonly logger: Logger
    ) { }

    async runTestCases(): Promise<ResultData> {
        return
    }
}

import { Logger } from '@w3f/logger';

import { ResultData, ResultsManager, TestCase } from '../types';


export class Results implements ResultsManager {
    constructor(
        private readonly targetStd: number,
        private readonly testCases: Array<TestCase>,
        private readonly logger: Logger
    ) { }

    async runTestCases(): Promise<ResultData> {
        return
    }
}

import { Logger } from '@w3f/logger';
import { LabResult } from '@w3f/polkadot-lab-types';

import { ResultsManager, TestCaseDefinitions } from '../types';


export class Results implements ResultsManager {
    constructor(
        private readonly targetStd: number,
        private readonly testCases: TestCaseDefinitions,
        private readonly logger: Logger
    ) { }

    async runTestCases(): Promise<Array<LabResult>> {
        const result: Array<Promise<LabResult>> = [];
        for (let i = 0; i < this.testCases.length; i++) {
            const testCaseResult = this.runTestCase(i);
            result.push(testCaseResult);
        }
        return Promise.all(result);
    }

    private async runTestCase(order: number): Promise<LabResult> {
        return
    }
}

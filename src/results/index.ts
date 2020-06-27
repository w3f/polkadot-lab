import { Logger } from '@w3f/logger';
import { LabResult } from '@w3f/polkadot-lab-types';

import { ResultsManager, TestCaseDefinitions } from '../types';


export class Results implements ResultsManager {
    constructor(
        private readonly targetStd: number,
        private readonly testCases: TestCaseDefinitions,
        private readonly logger: Logger
    ) { }

    async runTestCases(): Promise<LabResult> {
        return
    }
}

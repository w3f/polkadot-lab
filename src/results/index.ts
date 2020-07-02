import { Logger } from '@w3f/logger';
import { LabResult } from '@w3f/polkadot-lab-types';

import {
    ResultsManager,
    TestCaseDefinitions,
    HelmManagerConfig
} from '../types';
import { HelmClient } from '../helm';
import { TestCaseChart } from './test-case-chart';


export class Results implements ResultsManager {
    private helm: HelmClient;

    constructor(
        private readonly targetStd: number,
        private readonly testCases: TestCaseDefinitions,
        private readonly logger: Logger
    ) { }

    // parallel execution
    async runTestCases(kubeconfig: string): Promise<Array<LabResult>> {
        const helmCfg: HelmManagerConfig = {
            kubeconfig,
            logger: this.logger
        };
        this.helm = new HelmClient(helmCfg);

        const result: Array<Promise<LabResult>> = [];
        for (let i = 0; i < this.testCases.length; i++) {
            const testCaseResult = this.runTestCase(i);
            result.push(testCaseResult);
        }
        return Promise.all(result);
    }

    private async runTestCase(order: number): Promise<LabResult> {
        // deploy test case chart
        this.logger.debug(`Deploying test case ${order}: ${this.testCases[order].name}`);
        await this.deployTestCase(order);

        // port-forward


        // wait for results

        // return results

        return
    }

    private async deployTestCase(order: number): Promise<void> {
        const chart = new TestCaseChart(this.testCases[order], this.logger);
        await this.helm.installChart(chart, this.testCases[order].dependency);
    }
}

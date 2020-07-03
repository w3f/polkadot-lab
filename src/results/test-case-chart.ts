import { ChartConfig } from '@w3f/helm';
import { Logger } from '@w3f/logger';

import { BaseChart } from '../helm/base-chart';
import {
    ChartManager,
    TestCaseDefinition
} from '../types';


export class TestCaseChart extends BaseChart implements ChartManager {
    constructor(
        private readonly definition: TestCaseDefinition,
        protected readonly logger: Logger
    ) {
        super(logger);
    }

    name(): string {
        return this.definition.name;
    }

    async cfg(): Promise<ChartConfig> {
        return {
            name: this.definition.name,
            chart: this.definition.dependency.chart,
            wait: true
        };
    }

    async values(): Promise<any> {
        return {}
    }
}

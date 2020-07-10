import { ChartConfig } from '@w3f/helm';
import { Logger } from '@w3f/logger';
import * as portastic from 'portastic';

import { BaseChart } from '../helm/base-chart';
import {
    ChartManager,
    TestCaseDefinition
} from '../types';
import { mergeDeep } from '../utils';


export class TestCaseChart extends BaseChart implements ChartManager {
    private port: number;

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
        if (!this.port) {
            this.port = (await portastic.find({ min: 11000, max: 12000 }))[0];
        }

        const values = this.definition.dependency.values;

        const overrides = {
            port: this.port
        }

        return mergeDeep(values, overrides);
    }
}

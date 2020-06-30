import { Helm } from '@w3f/helm';
import { Logger } from '@w3f/logger';

import {
    HelmManager,
    HelmManagerConfig,
    Dependencies,
    ChartManager
} from '../types';


export class HelmClient implements HelmManager {
    private client: Helm;
    private kubeconfig: string;
    private dependencies: Dependencies;
    private logger: Logger;

    constructor(config: HelmManagerConfig) {
        this.kubeconfig = config.kubeconfig;
        this.dependencies = config.dependencies;
        this.logger = config.logger;
    }

    async installChart(chart: ChartManager): Promise<void> {
        await this.init();

        const chartCfg = await chart.cfg();
        const values = await chart.values();

        chartCfg.values = values;
        if (this.dependencies &&
            this.dependencies[chartCfg.chart]) {
            const dependencies = this.dependencies[chartCfg.chart];
            if (dependencies.image) {
                values['image'] = {};
                ['repo', 'tag'].forEach((field) => {
                    if (dependencies.image[field]) {
                        values['image'][field] = dependencies.image[field];
                    }
                });
            }
            if (dependencies.chart) {
                chartCfg.version = dependencies.chart;
            }
        }
        await this.client.install(chartCfg);
    }

    private async init(): Promise<void> {
        if (!this.client) {
            this.client = await Helm.create(this.kubeconfig, this.logger);
            await this.client.addRepos([
                {
                    name: 'w3f',
                    url: 'https://w3f.github.io/helm-charts'
                },
                {
                    name: 'stable',
                    url: 'https://kubernetes-charts.storage.googleapis.com/'
                }
            ]);
        }
    }
}

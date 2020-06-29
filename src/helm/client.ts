import { Helm } from '@w3f/helm';
import { Logger } from '@w3f/logger';
import path from 'path';

import {
    HelmManager,
    HelmManagerConfig,
    Dependencies,
    ChartManager
} from '../types';


export class HelmClient implements HelmManager {
    private client: Helm;
    private basePath: string;
    private kubeconfig: string;
    private dependencies: Dependencies;
    private logger: Logger;

    constructor(config: HelmManagerConfig) {
        this.basePath = config.basePath;
        this.kubeconfig = config.kubeconfig;
        this.dependencies = config.dependencies;
        this.logger = config.logger;
    }

    async installChart(chart: ChartManager): Promise<void> {
        await this.init();

        const chartCfg = await chart.cfg();
        const data = await chart.data();

        const valuesTemplatePath = path.join(this.basePath, 'values', `${chartCfg.chart}.yaml`);
        const valuesTemplate = {
            path: valuesTemplatePath,
            data
        };
        chartCfg.valuesTemplate = valuesTemplate;
        if (this.dependencies &&
            this.dependencies[chartCfg.chart]) {
            const dependencies = this.dependencies[chartCfg.chart];
            if (dependencies.image) {
                data['image'] = {};
                ['repo', 'tag'].forEach((field) => {
                    if (dependencies.image[field]) {
                        data['image'][field] = dependencies.image[field];
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

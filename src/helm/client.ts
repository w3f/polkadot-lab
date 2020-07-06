import { Helm } from '@w3f/helm';
import { Logger } from '@w3f/logger';

import {
    HelmManager,
    HelmManagerConfig,
    Dependency,
    ChartManager
} from '../types';
import { mergeDeep } from '../utils';


export class HelmClient implements HelmManager {
    private client: Helm;
    private kubeconfig: string;
    private logger: Logger;

    constructor(config: HelmManagerConfig) {
        this.kubeconfig = config.kubeconfig;
        this.logger = config.logger;
    }

    async installChart(chart: ChartManager, dependency?: Dependency): Promise<void> {
        await this.init();

        const chartCfg = await chart.cfg();
        this.logger.debug(`About to install release ${chartCfg.name} of ${chartCfg.chart}`);
        const values = await chart.values();

        chartCfg.values = values;
        if (dependency) {
            if (dependency.values) {
                chartCfg.values = mergeDeep(chartCfg.values, dependency.values);
            }
            if (dependency.version) {
                chartCfg.version = dependency.version;
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

import { Logger } from '@w3f/logger';
import { Helm } from '@w3f/helm';
import path from 'path';

import {
    Topology,
    ApplicationsManager,
    Dependencies,
    ChartManager,
    AppsConfig
} from '../types';
import {
    NetworkPolicyChart,
    PolkadotBaseServicesChart,
    PolkadotChart,
    PrometheusOperatorChart
} from './charts';

export class Apps implements ApplicationsManager {
    private helm: Helm;
    private topology: Topology;
    private size: number;
    private dependencies: Dependencies;
    private logger: Logger

    constructor(cfg: AppsConfig) {
        this.topology = cfg.topology;
        this.size = cfg.size;
        this.dependencies = cfg.dependencies;
        this.logger = cfg.logger;
    }

    async install(kubeconfig: string): Promise<void> {
        await this.init(kubeconfig);

        await this.installDependencies();

        await this.installNodes();
    }

    private async init(kubeconfig: string): Promise<void> {
        if (!this.helm) {
            this.helm = await Helm.create(kubeconfig, this.logger);
            await this.helm.addRepos([
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

    private async installDependencies(): Promise<void> {
        const chartTypes = [PrometheusOperatorChart, NetworkPolicyChart, PolkadotBaseServicesChart];
        for (const chartType of chartTypes) {
            const chart = new chartType(this.topology, this.size, this.dependencies, this.logger);
            await this.installChart(chart);
        }
    }

    private async installNodes(): Promise<void> {
        const chart = new PolkadotChart(this.topology, this.size, this.dependencies, this.logger);
        for (let i = 0; i < this.size; i++) {
            await this.installChart(chart);
        }
    }

    private async installChart(chart: ChartManager): Promise<void> {
        const chartCfg = await chart.cfg();
        const data = await chart.data();

        const valuesTemplatePath = path.join(__dirname, 'values', `${chartCfg.chart}.yaml`);
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
        await this.helm.install(chartCfg);
    }
}

import { Logger } from '@w3f/logger';
import { Helm, ChartConfig } from '@w3f/helm';
import path from 'path';

import {
    Topology,
    ApplicationsManager,
    Dependencies
} from '../types';


export class Apps implements ApplicationsManager {
    private helm: Helm;

    constructor(
        private readonly topology: Topology,
        private readonly size: number,
        private readonly dependencies: Dependencies,
        private readonly logger: Logger
    ) { }

    async install(kubeconfig: string): Promise<void> {
        await this.init(kubeconfig);

        await this.installDependencies();

        await this.installNodes();
    }

    private async init(kubeconfig: string): Promise<void> {
        if (this.helm) {
            return
        }
        this.helm = await Helm.create(kubeconfig, this.logger);
        await this.helm.addRepos([
            {
                name: 'w3f',
                url: 'https://w3f.github.io/helm-charts'
            }
        ]);
    }

    private async installDependencies(): Promise<void> {
        await this.installPrometheus();

        await this.installNetworkPolicy();
    }

    private async installNodes(): Promise<void> {
        // install polkadot-base-services

        // install polkadot
    }

    private async installPrometheus(): Promise<void> {
        const chartCfg: ChartConfig = {
            name: 'prometheus-operator',
            chart: 'stable/prometheus-operator',
            wait: true
        };
        await this.installChart(chartCfg);
    }

    private async installNetworkPolicy(): Promise<void> {
        const data = {
            topology: this.topology,
            size: this.size
        };
        const chartCfg: ChartConfig = {
            name: 'network-policy',
            chart: 'w3f/network-policy',
            wait: true
        };
        await this.installChart(chartCfg, data);
    }
    private async installChart(chartCfg: ChartConfig, data: any = {}): Promise<void> {
        const valuesTemplatePath = path.join(__dirname, 'values', `${chartCfg.name}.yaml`);
        const valuesTemplate = {
            path: valuesTemplatePath,
            data
        };
        chartCfg.valuesTemplate = valuesTemplate;
        if (this.dependencies &&
            this.dependencies[chartCfg.name]) {
            chartCfg.version = this.dependencies[chartCfg.name];
        }
        await this.helm.install(chartCfg);
    }
}

import { Logger } from '@w3f/logger';

import {
    Topology,
    ApplicationsManager,
    Dependencies,
    Dependency,
    AppsConfig,
    HelmManagerConfig
} from '../types';
import {
    NetworkPolicyChart,
    PolkadotBaseServicesChart,
    PolkadotChart,
    PrometheusOperatorChart
} from './charts';
import { HelmClient } from '../helm';


export class Apps implements ApplicationsManager {
    private helm: HelmClient;
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
        const helmCfg: HelmManagerConfig = {
            kubeconfig,
            logger: this.logger
        };
        this.helm = new HelmClient(helmCfg);

        await this.installDependencies();

        await this.installNodes();
    }

    private async installDependencies(): Promise<void> {
        let chart = new PrometheusOperatorChart(this.logger);
        let dependency = this.findDependency(chart.name());
        await this.helm.installChart(chart, dependency);

        chart = new NetworkPolicyChart(this.topology, this.size, this.logger);
        dependency = this.findDependency(chart.name());
        await this.helm.installChart(chart, dependency);

        chart = new PolkadotBaseServicesChart(this.logger);
        dependency = this.findDependency(chart.name());
        await this.helm.installChart(chart, dependency);
    }

    private async installNodes(): Promise<void> {
        const chart = new PolkadotChart(this.size, this.logger);
        for (let i = 0; i < this.size; i++) {
            await this.helm.installChart(chart, this.dependencies[chart.name()]);
        }
    }

    private findDependency(name: string): Dependency {
        return this.dependencies.find(element => element.chart === name);
    }
}

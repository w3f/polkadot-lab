import { Logger } from '@w3f/logger';

import {
    Topology,
    ApplicationsManager,
    Dependencies,
    HelmManager,
    AppsConfig
} from '../types';
import {
    NetworkPolicyChart,
    PolkadotBaseServicesChart,
    PolkadotChart,
    PrometheusOperatorChart
} from './charts';
import { HelmClient } from '../helm';


export class Apps implements ApplicationsManager {
    private helm: HelmManager;
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
        const helmCfg = {
            kubeconfig,
            dependencies: this.dependencies,
            logger: this.logger
        };
        this.helm = new HelmClient(helmCfg);

        await this.installDependencies();

        await this.installNodes();
    }

    private async installDependencies(): Promise<void> {
        const chartTypes = [PrometheusOperatorChart, NetworkPolicyChart, PolkadotBaseServicesChart];
        for (const chartType of chartTypes) {
            const chart = new chartType(this.topology, this.size, this.logger);
            await this.helm.installChart(chart);
        }
    }

    private async installNodes(): Promise<void> {
        const chart = new PolkadotChart(this.topology, this.size, this.logger);
        for (let i = 0; i < this.size; i++) {
            await this.helm.installChart(chart);
        }
    }
}

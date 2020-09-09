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
    PrometheusOperatorChart,
    SubstrateTelemetryChart
} from './charts';
import { HelmClient } from '../helm';
import { NetworkingUtils } from '../networking';

type ChartClass = (
    typeof NetworkPolicyChart |
    typeof PolkadotBaseServicesChart |
    typeof PrometheusOperatorChart |
    typeof SubstrateTelemetryChart
)

type ChartParameters = {
    chartManager: ChartClass;
    parameters: any;
}

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
        const dependenciesParameters: Array<ChartParameters> = [
            {
                chartManager: PrometheusOperatorChart,
                parameters: this.logger
            },
            {
                chartManager: NetworkPolicyChart,
                parameters: {
                    topology: this.topology,
                    size: this.size,
                    logger: this.logger
                }
            },
            {
                chartManager: PolkadotBaseServicesChart,
                parameters: this.logger
            },
            {
                chartManager: SubstrateTelemetryChart,
                parameters: this.logger
            },
        ];

        for (const dependencyParameters of dependenciesParameters) {
            const chart = new dependencyParameters.chartManager(dependencyParameters.parameters);
            const dependency = this.findDependency(chart.name());
            await this.helm.installChart(chart, dependency);
        }
    }

    private async installNodes(): Promise<void> {
        const networkingUtils = new NetworkingUtils(this.size, this.topology);

        const chart = new PolkadotChart(networkingUtils, this.size, this.logger);
        const dependency = this.findDependency(chart.name());
        for (let i = 0; i < this.size; i++) {
            chart.setIndex(i);
            await this.helm.installChart(chart, dependency);
        }
    }

    private findDependency(name: string): Dependency {
        return this.dependencies.find(element => element.chart === name);
    }
}

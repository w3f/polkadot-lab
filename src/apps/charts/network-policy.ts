import { ChartConfig } from '@w3f/helm';
import { Logger } from '@w3f/logger';

import {
    ChartManager,
    Topology
} from '../../types';
import { BaseChart } from '../../helm';

type NetworkPolicyChartConfig = {
    topology: Topology;
    size: number;
    logger: Logger;
}

export class NetworkPolicyChart extends BaseChart implements ChartManager {
    private topology: Topology;
    private size: number;
    protected logger: Logger;

    constructor(config: NetworkPolicyChartConfig) {
        super(config.logger);

        this.topology = config.topology;
        this.size = config.size;
        this.logger = config.logger;
    }

    name(): string {
        return 'w3f/network-policy';
    }
    async cfg(): Promise<ChartConfig> {
        return {
            name: 'network-policy',
            chart: 'w3f/network-policy',
            wait: true
        };
    }
    async values(): Promise<any> {
        return {
            topology: this.topology,
            size: this.size,
            labelSelector: {
                key: "node",
                valuePrefix: "polkadot"
            }
        };
    }
}

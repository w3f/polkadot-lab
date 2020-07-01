import { ChartConfig } from '@w3f/helm';

import { ChartManager } from '../../types';
import { BaseChart } from '../../helm';


export class NetworkPolicyChart extends BaseChart implements ChartManager {
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

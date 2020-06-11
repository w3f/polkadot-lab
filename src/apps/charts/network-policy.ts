import { ChartConfig } from '@w3f/helm';

import { ChartManager } from '../../types';
import { BaseChart } from './base';


export class NetworkPolicyChart extends BaseChart implements ChartManager {
    async cfg(): Promise<ChartConfig> {
        return {
            name: 'network-policy',
            chart: 'w3f/network-policy',
            wait: true
        };
    }
    async data(): Promise<any> {
        return {
            topology: this.topology,
            size: this.size
        };
    }
}

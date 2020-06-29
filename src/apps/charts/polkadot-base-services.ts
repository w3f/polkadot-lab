import { ChartConfig } from '@w3f/helm';

import { ChartManager } from '../../types';
import { BaseChart } from '../../helm';


export class PolkadotBaseServicesChart extends BaseChart implements ChartManager {
    async cfg(): Promise<ChartConfig> {
        return {
            name: 'polkadot-base-services',
            chart: 'w3f/polkadot-base-services',
            wait: true
        };
    }
}

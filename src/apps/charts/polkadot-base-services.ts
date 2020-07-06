import { ChartConfig } from '@w3f/helm';

import { ChartManager } from '../../types';
import { BaseChart } from '../../helm';


export class PolkadotBaseServicesChart extends BaseChart implements ChartManager {
    name(): string {
        return 'w3f/polkadot-base-services';
    }
    async cfg(): Promise<ChartConfig> {
        return {
            name: 'polkadot-base-services',
            chart: 'w3f/polkadot-base-services',
            wait: true
        };
    }

    async values(): Promise<any> {
        return {
            name: "polkadot-base-services",
            deploymentName: "polkadot-lab",
            local: false,
            monitoring: false,
            benchmark: true,
            includeValidatorBootNode: false,
            createCertIssuer: false,
            createBootNodeService: false
        }
    }
}

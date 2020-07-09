import { ChartConfig } from '@w3f/helm';
import { Logger } from '@w3f/logger';

import {
    ChartManager,
} from '../../types';
import { BaseChart } from '../../helm';


export class SubstrateTelemetryChart extends BaseChart implements ChartManager {
    constructor(
        protected readonly logger: Logger) {
        super(logger);
    }

    name(): string {
        return 'w3f/substrate-telemetry';
    }
    async cfg(): Promise<ChartConfig> {
        return {
            name: 'substrate-telemetry',
            chart: 'w3f/substrate-telemetry',
            wait: false
        };
    }
    async values(): Promise<any> {
        return {
            certificate: {
                enabled: false
            },
            exporter: {
                config: {
                    subscribe: {
                        chains: [
                            "Development"
                        ]
                    }
                }
            },
            alertrules: {
                general: {
                    enabled: false
                },
                validators: {
                    enabled: false
                }
            }
        };
    }
}

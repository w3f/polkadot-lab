import { ChartConfig } from '@w3f/helm';

import { ChartManager } from '../../types';
import { BaseChart } from '../../helm';


export class PrometheusOperatorChart extends BaseChart implements ChartManager {
    async cfg(): Promise<ChartConfig> {
        return {
            name: 'prometheus-operator',
            chart: 'stable/prometheus-operator',
            wait: true
        };
    }
}

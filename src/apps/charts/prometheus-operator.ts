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

    async values(): Promise<any> {
        return {
            defaultRules: {
                create: false
            },
            kubeDns: {
                enabled: false
            },
            coreDns: {
                enabled: false
            },
            kubeApiServer: {
                enabled: false
            },
            grafana: {
                enabled: false
            },
            nodeExporter: {
                enabled: false
            },
            alertmanager: {
                enabled: false
            },
            kubeControllerManager: {
                enabled: false
            },
            kubeEtcd: {
                enabled: false
            },
            kubelet: {
                enabled: false
            },
            kubeScheduler: {
                enabled: false
            },
            prometheus: {
                prometheusSpec: {
                    resources: {
                        requests: {
                            cpu: "500m",
                            memory: "2Gi"
                        },
                        limits: {
                            cpu: "700m",
                            memory: "3Gi"
                        },
                    },
                    storageSpec: {
                        volumeClaimTemplate: {
                            spec: {
                                accessModes: ["ReadWriteOnce"],
                                resources: {
                                    requests: {
                                        storage: "20Gi"
                                    }
                                }
                            }
                        }
                    },
                }
            },
            prometheusOperator: {
                resources: {
                    limits: {
                        cpu: "200m",
                        memory: "200Mi"
                    },
                    requests: {
                        cpu: "100m",
                        memory: "100Mi"
                    }
                }
            }
        }
    }
}

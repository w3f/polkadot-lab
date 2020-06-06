import yaml from 'js-yaml';

import { Topology } from './types';


export class Policy {
    private connections: Array<Array<string>> = [];
    constructor(
        private size: number,
        private topology: Topology
    ) {
        this.initConnections();
    }

    generate(): string {
        const config = [];
        for (let i = 0; i < this.size; i++) {
            const podConnections = this.connections[i];
            const podPolicy = {
                apiVersion: 'networking.k8s.io/v1',
                kind: 'NetworkPolicy',
                metadata: {
                    policyName: {
                        name: 'pod-' + i + '-network-policy'
                    }
                },
                spec: {
                    podSelector: {
                        matchLabels: {
                            name: 'pod-' + i
                        }
                    },
                    ingress: {
                        podSelector: {
                            matchLabels: {
                                name: podConnections
                            }
                        }
                    },
                    egress: {
                        podSelector: {
                            matchLabels: {
                                name: podConnections
                            }
                        }
                    }
                }

            }
            config.push(podPolicy);
        }
        return yaml.safeDump(config)
    }

    private initConnections(): void {
        for (let i = 0; i < this.size; i++) {
            this.connections[i] = [];
            if (i > 0 && i < this.size - 1) {
                this.connections[i].push('pod-' + (i - 1), 'pod-' + (i + 1));
            } else if (i === 0) {
                this.connections[i].push('pod-1');
                if (this.topology === Topology.Full) {
                    this.connections[i].push('pod-' + (this.size - 1));
                }
            } else { // i === this.size - 1
                this.connections[i].push('pod-' + (i - 1));
                if (this.topology === Topology.Full) {
                    this.connections[i].push('pod-0');
                }
            }
        }
    }
}

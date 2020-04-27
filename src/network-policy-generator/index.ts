import yaml from 'js-yaml';

export enum Topology {
  Line,
  Circle
}

interface NetworkPolicy {
  apiVersion: string;
  kind: string;

}

export class Policy {
    private connections: Array<Array<string>> = [];
  constructor(
    private size: number,
    private topology: Topology
  ) {
      this.initConnections();
      this.generate();
  }

  generate(): string{
    const config = [];
    for(let i = 0; i < this.size; i++){
      const podConnections = this.connections[i];
      const podPolicy = {
          apiVersion: 'networking.k8s.io/v1',
          kind: 'NetworkPolicy',
          metadata: {
            policyName: {
              name: 'pod-'+i+'-network-policy'
            }
          },
          spec:{
            podSelector: {
              matchLabels: {
                name: 'pod-'+i
              }
            },
            ingress: {
              podSelector:{
                matchLabels: {
                  name: podConnections
                }
              }
            },
            egress: {
              podSelector:{
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

  private initConnections(): void{
    this.connections = [];
    for(let i=0; i<this.size; i++){
      this.connections[i] = [];
      if (this.topology === Topology.Line ) {
        if (i > 0 && i < this.size - 1) {
          this.connections[i].push('pod-'+(i - 1),'pod-'+ (i + 1));
        } else if (i === 0) {
          this.connections[i].push('pod-1');
        } else if (i === this.size - 1) {
          this.connections[i].push('pod-'+(i - 1));
        }
      } else if (this.topology === Topology.Circle ){
        if (i > 0 && i < this.size - 1) {
          this.connections[i].push('pod-'+(i - 1), 'pod-'+(i + 1));
        } else if (i === 0) {
          this.connections[i].push('pod-'+ (this.size-1), 'pod-1');
        } else if (i === this.size - 1) {
          this.connections[i].push('pod-'+(i - 1), 'pod-0');
        }
      }

    }
  }

}

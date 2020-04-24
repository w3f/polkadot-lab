const fs   = require('fs-extra');
const YAML = require('yamljs');

function Policy(size, topology) {
  this.network_size = size;
  this.network_topology = topology;
};

Policy.prototype.generate = function() {
  let config = {};
  let policy_name = 'Policy Name';
  config[policy] = [];
  for(let i = 0; i < this.network_size; i++){
    let pod_connections = this.connections(i);
    let pod_policy = {
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
                name: pod_connections
              }
            }
          },
          egress: {
            podSelector:{
              matchLabels: {
                name: pod_connections
              }
            }
          }
        }

    }
    config[policy].push(pod_policy);
  }
  return YAML.stringify(config, 8);
};

Policy.prototype.connections = function(i) {
  let connections = [];
  if (this.network_topology === "line") {
    if (i > 0 && i < this.network_size - 1) {
      connections.push('pod-'+(i - 1),'pod-'+ (i + 1));
    } else if (i === 0) {
      connections.push('pod-1');
    } else if (i === this.network_size - 1) {
      connections.push('pod-'+(i - 1));
    }
  } else if (this.network_topology === "circle"){
    if (i > 0 && i < this.network_size - 1) {
      connections.push('pod-'+(i - 1), 'pod-'+(i + 1));
    } else if (i === 0) {
      connections.push('pod-'+ (this.network_size-1), 'pod-1');
    } else if (i === this.network_size - 1) {
      connections.push('pod-'+(i - 1), 'pod-0');
    }
  }
  return connections;
};


module.exports = Policy;

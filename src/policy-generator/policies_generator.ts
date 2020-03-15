const Handlebars = require("handlebars");

class NetworkPolicies {
  constructor(network_size, network_topology) {
    this.network_size = network_size;
    this.network_topology = network_topology;
    this.nodesArray = [];
    this.yaml = "";
    for (this.i = 0; this.i < this.network_size; this.i++) {
      this.id = this.i;
      this.connections = [];
      if (this.network_topology == "line"){
        if (this.id > 0 && this.id < this.network_size-1 ){
          this.connections.push(this.id-1, this.id+1);
        } else if (this.id == 0) {
          this.connections.push(1);
        } else if (this.id == this.network_size-1){
          this.connections.push(this.id-1);
        }
      }
      else if (this.network_topology == "circle"){
        if (this.id > 0 && this.id < this.network_size-1 ){
          this.connections.push(this.id-1, this.id+1);
        } else if (this.id == 0){
          this.connections.push(1, this.network_size-1);
        } else if (this.id == this.network_size-1){
          this.connections.push(this.id-1, 0);
        }
      }
      else if (this.network_topology == "full"){
        this.connections = Array.from(Array(this.network_size).keys()).filter(item => item !== this.id);
      }      
      this.nodesArray.push({id: this.id, connections: this.connections})
    }
      this.pod_template = Handlebars.compile(`
  apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: pod-{{name}}-network-policy
    spec:
      podSelector:
        matchLabels:
          name: pod-{{name}}`);

        this.policies_template = Handlebars.compile(`
          - podSelector:
              matchLabels:
                name: pod-{{name}}`);

    this.nodesArray.forEach(element => this.generate_node_entry(element));

  }
  generate_node_entry(node){
    this.yaml += this.pod_template({ name: node.id });
    this.yaml += "\n        ingress:";
    node.connections.forEach(element => this.generate_node_policies(element));
    this.yaml += "\n        egress:";
    node.connections.forEach(element => this.generate_node_policies(element));
    this.yaml += "\n---";

  }

  generate_node_policies(node){
    this.yaml += this.policies_template({ name: node });
  }
  
  get_policy(){
    return this.yaml
  }
}

test = new NetworkPolicies(10, 'circle');
console.log("TCIRCLE EST RESULTS")
console.log(test.get_policy())

test = new NetworkPolicies(10, 'line');
console.log("LINE TEST RESULTS")
console.log(test.get_policy())

test = new NetworkPolicies(10, 'full');
console.log("FULL GRAPH TEST RESULTS")
console.log(test.get_policy())

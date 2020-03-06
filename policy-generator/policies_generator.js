var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/network-policie.yaml', {flags : 'a'});

const nodesArray = []
const yaml = ""
const network_size = 1000
const network_topology = "full"

function Node(id, topology){
  if (topology == "full") {
    this.node_id = id;
    this.node_connections = Array.from(Array(network_size).keys()).filter(item => item !== id);
  } else if (topology == "line") {
    this.node_id = id;
    if (id > 0){
      this.node_connections = [id-1];
    } else {
      this.node_connections = [id];
    }
  } else if (topology == "dense"){
    this.node_id = id;

  } else if (topology == "sparse"){
    //  block of code to be executed if the condition1 is false and condition2 is false
  }
}

function generate_graph(node){
  node.node_connections.forEach(element => generate_policy(node.node_id, element))
}

function generate_policy(node_id, connection){
  const template = `apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: pod-${node_id}-pod-${connection}-network-policy
  spec:
    podSelector:
      matchLabels:
        name: pod-${node_id}
    policyTypes:
    - Ingress
    ingress:
    - from:
      - podSelector:
          matchLabels:
            name: pod-${connection}
      ports:
      - protocol: TCP
        port: 6379
---`
  console.log(template)
  log_file.write(util.format(template) + '\n');
}


i = 0
do {
  var node = new Node(i, network_topology);
  nodesArray.push(node);
  i++;
}
while (i < network_size);

nodesArray.forEach(element => generate_graph(element));

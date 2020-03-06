var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/network-policie.yaml', {flags : 'a'});
var log_stdout = process.stdout;

const nodesArray = []
const yaml = ""
const network_size = 15
const network_topology = "line"

function Node(id, topology){
  if (topology == "full") {
    this.node_id = id;
    this.node_connections = Array.from(Array(network_size).keys()).filter(item => item !== id);
  } else if (topology == "line") {
    this.node_id = id;
    if (id > 0 && id < network_size-1 ){
      this.node_connections = [id-1, id+1];
    } else if (id == 0) {
      this.node_connections = [1];
    } else if (id == network_size-1){
      this.node_connections = [id-1];
    }
  } else if (topology == "dense"){
    this.node_id = id;

  } else if (topology == "sparse"){
    //  block of code to be executed if the condition1 is false and condition2 is false
  }
}

function generate_ingress_template(pod_name){
  const template = `      - podSelector:
          matchLabels:
            name: pod-${pod_name}`
  return template
}

function generate_egress_template(pod_name){
  const template = `      - podSelector:
          matchLabels:
            name: pod-${pod_name}`
  return template
}

function generate_policies(node){
  const prefix_template = `apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: pod-${node.node_id}-network-policy
  spec:
    podSelector:
      matchLabels:
        name: pod-${node.node_id}
    ingress:`
  const post_template = `      ports:
      - protocol: TCP
        port: 6379
---`


  console.log(prefix_template)
  node.node_connections.forEach(element => console.log(generate_ingress_template(element)));
  console.log(`    egress:`)
  node.node_connections.forEach(element => console.log(generate_egress_template(element)));
  console.log(`---`)
  //node.node_connections.forEach(element => log_file.write(util.format(element) + '\n');

}

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

i = 0
do {
  var node = new Node(i, network_topology);
  nodesArray.push(node);
  i++;
}
while (i < network_size);

nodesArray.forEach(element => generate_policies(element));

const YAML = require('js-yaml');
const fs   = require('fs');


class NetworkPolicies {
  constructor(network_size=1000, network_topology="circle") {
    this.network_size = network_size;
    this.network_topology = network_topology;
    this.nodesArray = [];
    for (this.i = 0; this.i < this.network_size; this.i++) {
      this.connections = [];
      if (this.network_topology === "line") {
        if (this.i > 0 && this.i < this.network_size - 1) {
          this.connections.push(this.i - 1, this.i + 1);
        } else if (this.i === 0) {
          this.connections.push(1);
        } else if (this.i === this.network_size - 1) {
          this.connections.push(this.i - 1);
        }
      } else if (this.network_topology === "circle"){
        if (this.i > 0 && this.i < this.network_size - 1) {
          this.connections.push(this.i - 1, this.i + 1);
        } else if (this.i === 0) {
          this.connections.push(this.network_size-1, 1);
        } else if (this.i === this.network_size - 1) {
          this.connections.push(this.i - 1, 0);
        }
      }
      let node =  "apiVersion: networking.k8s.io/v1\n" +
                  "kind: NetworkPolicy\n" +
                  "metadata:\n" +
                  "  name: pod-"+this.i+"-network-policy\n" +
                  "spec:\n" +
                  "  podSelector:\n" +
                  "    matchLabels:\n" +
                  "      name: pod-"+this.i +"\n";
      let selector = "";
      for(let j=0;j<this.connections.length;j++){
        selector +=   "    - podSelector:\n" +
                      "        matchLabels:\n" +
                      "          name: pod-" + this.connections[j] +"\n";
      }
      node += "  ingress:\n"+selector +"  egress:\n"+selector +"---\n";
      this.nodesArray.push(node)
    }
  }

  getPolicy(){
    let result = "";
    for(let i=0;i<this.nodesArray.length;i++){
      result+=this.nodesArray[i];
    }
    return result;
    }

  savePolicy(filename = this.network_size+"-"+this.network_topology+"-network-policie.yaml"){
    let result = "";
    for(let i=0;i<this.nodesArray.length;i++){
      result+=this.nodesArray[i];
    }

    console.log(result);
    fs.writeFileSync(filename, result, function (err, file) {
      if (err) throw err;
      console.log("File saved at: "+ filename);
    })
  }
}
module.exports = NetworkPolicies

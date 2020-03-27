const assert = require('assert');
const YAML = require('js-yaml');
const fs = require('fs');
const NetworkPolicy = require('../policies_generator.ts');

test_10_circle = new NetworkPolicy(10);
test_10_line = new NetworkPolicy(10, "line");

try {
    let data1 = fs.readFileSync('./10-circle-network-policie.example', 'utf8');
    assert.equal(test_10_circle.nodesArray.toString(), data1.replace(/napiVersion/g, 'n,apiVersion'), "Failed circle policie");
} catch (e) {
    console.log(e);
}

try {
    let data2 = fs.readFileSync('./10-line-network-policie.example', 'utf8');
    assert.equal(test_10_line.nodesArray.toString(), data1.replace(/napiVersion/g, 'n,apiVersion'), "Failed line policie");
} catch (e) {
    console.log(e);
}

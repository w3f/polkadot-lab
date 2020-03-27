const assert = require('assert');
const YAML = require('js-yaml');
const fs = require('fs');
const NetworkPolicy = require('../policies_generator.ts');

let test_10_circle = new NetworkPolicy(10);
let test_10_line = new NetworkPolicy(10, "line");
let test_10_full = new NetworkPolicy(10, "full");

try {
    let data1 = fs.readFileSync('./10-circle-network-policie.example', 'utf8');
    assert.equal(test_10_circle.nodesArray.toString().replace(/,apiVersion/g, 'apiVersion'), data1, "Failed circle policie");
} catch (e) {
    console.log(e);
}

try {
    let data2 = fs.readFileSync('./10-line-network-policie.example', 'utf8');
    assert.equal(test_10_line.nodesArray.toString().replace(/,apiVersion/g, 'apiVersion'), data2, "Failed line policie");
} catch (e) {
    console.log(e);
}
try {
    let data3 = fs.readFileSync('./10-full-network-policie.example', 'utf8');
    assert.equal(test_10_full.nodesArray.toString().replace(/,apiVersion/g, 'apiVersion'), data3, "Failed full policie");
} catch (e) {
    console.log(e);
}

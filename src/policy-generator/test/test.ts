const assert = require('assert');
const YAML = require('js-yaml');
const fs = require('fs');
const NetworkPolicy = require('../policies_generator.ts');

try {
    let data1 = fs.readFileSync('./10-circle-network-policie.example', 'utf8');
    let test_10_circle = new NetworkPolicy(10);
    assert.equal(test_10_circle.getPolicy(), data1, "Failed circle policie");

    let data2 = fs.readFileSync('./10-line-network-policie.example', 'utf8');
    let test_10_line = new NetworkPolicy(10, "line");
    assert.equal(test_10_line.getPolicy(), data2, "Failed line policie");

    let data3 = fs.readFileSync('./10-full-network-policie.example', 'utf8');
    let test_10_full = new NetworkPolicy(10, "full");
    assert.equal(test_10_full.getPolicy(), data3, "Failed full policie");
} catch (e) {
    console.log(e);
}

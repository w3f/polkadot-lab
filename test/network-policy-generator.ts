import { Policy } from '../src/network-policy-generator/index';
import { should } from 'chai';
should();


const test = new Policy(10, Line);
console.log(test.generate())

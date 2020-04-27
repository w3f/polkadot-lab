import { Policy, Topology } from '../../src/network-policy-generator';
import { should } from 'chai';

should();

describe('Policy Generator', () => {
    it('should read valid yaml', () => {
      const test = new Policy(10, Topology.Line);
      console.log(test.generate())
    });

});

import { Policy, Topology } from '../../src/network-policy-generator';
import { should } from 'chai';
import yaml from 'js-yaml';

should();

describe('Policy Generator', () => {
    it('should read valid yaml', () => {
      const test = new Policy(10, Topology.Line);
      const config = test.generate();
      config.should.exist;
    });
});

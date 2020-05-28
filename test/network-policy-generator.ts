import { should } from 'chai';

import { Policy } from '../src/network-policy-generator';
import { Topology } from '../src/types';

should();

describe('Policy Generator', () => {
    it('should read valid yaml', () => {
        const test = new Policy(10, Topology.Line);
        const config = test.generate();
        config.should.exist;
    });
});

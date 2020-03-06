import { should } from 'chai';

import { Lab } from '../src/lab';

should();

describe('Lab', () => {
    it('should be instantiable', () => {
        const lab = new Lab();

        lab.should.exist;
    });
});

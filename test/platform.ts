import { should } from 'chai';
import { createLogger } from '@w3f/logger';

import { Platform } from '../src/platform';
import { ExecutionMode } from '../src/types';

should();

const logger = createLogger();

describe('Platform', () => {
    it('should be instantiable', () => {
        const mode = ExecutionMode.Local;
        const nodes = 4;

        const platform = new Platform('name', mode, nodes, logger);

        platform.should.exist;
    });
});

import { should } from 'chai';

import { Engine } from '../src/engine';
import { LoggerMock } from './mocks';

should();

const logger = new LoggerMock();

describe('Engine', () => {
    it('should be instantiable', () => {
        const engine = new Engine(logger);

        engine.should.exist;
    });
});

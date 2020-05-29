import { should } from 'chai';
import { createLogger } from '@w3f/logger';

import { Engine } from '../src/engine';
import {
    PlatformMock,
    AppsMock,
    ResultsMock
} from './mocks';

should();

const logger = createLogger();

const platform = new PlatformMock();
const apps = new AppsMock();
const results = new ResultsMock();

const cfg = {
    platform,
    apps,
    results,
    logger
}

describe('Engine', () => {
    it('should be instantiable', () => {
        const engine = new Engine(cfg);

        engine.should.exist;
    });
});

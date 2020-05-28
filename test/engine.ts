import { should } from 'chai';
import { createLogger } from '@w3f/logger';

import { Engine } from '../src/engine';
import { Topology, Metric } from '../src/types';

should();

const logger = createLogger();
const cfg = {
    nodes: 4,
    topology: Topology.Line,
    targetStd: 2,
    metrics: [Metric.TimeToFinality]
}

describe('Engine', () => {
    it('should be instantiable', () => {
        const engine = new Engine(cfg, logger);

        engine.should.exist;
    });
});

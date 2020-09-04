import { should } from 'chai';

import { sanitize } from '../src/sanitize';
import {
    InputConfig,
    ExecutionMode,
    Topology,
    PersistenceKind
} from '../src/types';

should();


describe('sanitize', () => {
    it('should sanitize name', () => {
        const cfg: InputConfig = {
            logLevel: 'info',
            name: '',
            maximumExecutionTime: '10m',
            mode: ExecutionMode.Local,
            size: 4,
            topology: Topology.Circle,
            testCases: [],
            persistence: {
                kind: PersistenceKind.File,
                path: ""
            }
        };

        cfg.name = ' aa@ bc';

        const result = sanitize(cfg);

        result.name.should.eq('aa@-bc');
    });
});

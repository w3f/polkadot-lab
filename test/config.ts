import fs from 'fs-extra';
import tmp from 'tmp';

import { Config } from '../src/config';
import { Topology } from '../src/types';
import { should } from 'chai';

should();

describe('Config reader', () => {
    it('should read valid config files', () => {
        const logLevel = 'debug';
        const maximumExecutionTime = '2h'
        const nodes = 8;
        const topology = Topology.Line;
        const targetStd = 1.2;
        const fileContent = `
logLevel: "${logLevel}"
maximumExecutionTime: "${maximumExecutionTime}"
nodes: ${nodes}
topology: "${topology}"
targetStd: ${targetStd}
`;

        const tmpobj = tmp.fileSync();
        fs.writeSync(tmpobj.fd, fileContent);

        const result = Config.parse(tmpobj.name);

        result.should.be.a('Object');

        result.logLevel.should.eq(logLevel);
        result.maximumExecutionTime.should.eq(maximumExecutionTime);
        result.nodes.should.eq(nodes);
        result.topology.should.eq(topology);
        result.targetStd.should.eq(targetStd);
    });
});

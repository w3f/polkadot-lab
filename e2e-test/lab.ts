import { should } from 'chai';
import fs from 'fs-extra';
import tmp from 'tmp';

import { startAction } from '../src/actions/start';

should();

describe('E2E', () => {
    it('should run a deployment and retrieve results', async () => {
        const cfgContent = `
logLevel: 'info'
maximumExecutionTime: '60m'
mode: Local
nodes: 4
topology: Line
targetStd: 1.5
metrics:
- TimeToFinality
`;
        const cfgFile = tmp.fileSync();
        fs.writeSync(cfgFile.fd, cfgContent);

        await startAction({ config: cfgFile.name });
    });
});

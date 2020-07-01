import { should } from 'chai';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';

import { startAction } from '../src/actions/start';

should();

describe('E2E', () => {
    it('should run a deployment and retrieve results', async () => {
        const cfgContent = `
logLevel: 'info'
maximumExecutionTime: '60m'
mode: local
size: 4
topology: line
targetStd: 1.5
testCases:
- name: NumberOfPeers
  dependency:
    w3f/polkadot-lab-test-case-number-of-peers:
      version: "v0.1.0"
dependencies:
  w3f/polkadot:
    values:
      image:
        repo: 'parity/polkadot'
        tag: 'v0.8.12'
    version: 'v0.27.3'
`;
        const cfgFile = tmp.fileSync();
        fs.writeSync(cfgFile.fd, cfgContent);

        await startAction({ config: cfgFile.name });
    });
});

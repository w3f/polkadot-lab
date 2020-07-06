import { should } from 'chai';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';

import { startAction } from '../src/actions/start';

should();

const outputFile = tmp.fileSync();
const nodes = 4;
const cfgContent = `
logLevel: 'debug'
maximumExecutionTime: '60m'
mode: local
size: ${nodes}
topology: line
targetStd: 1.5
persistence:
  kind: file
  path: ${outputFile.name}
testCases:
- name: test-case-number-of-peers
  delay: 80000
  dependency:
    chart: w3f/polkadot-lab-test-case-prometheus
    version: "v0.1.0"
    values:
      prometheus:
        name: number-of-peers
        query: polkadot_sub_libp2p_peers_count
dependencies:
- chart: w3f/polkadot
  values:
    image:
      repo: 'parity/polkadot'
      tag: 'v0.8.13'
    chainspec:
      preset: true
      custom: false
      name: 'kusama-dev'
  version: 'v0.27.3'
`;


describe('E2E', () => {
    before(async () => {
        const cfgFile = tmp.fileSync();
        fs.writeSync(cfgFile.fd, cfgContent);

        await startAction({ config: cfgFile.name });
    });

    it('should run an experiment and retrieve results', async () => {
        const resultRaw = fs.readFileSync(outputFile.name);
        const result = JSON.parse(resultRaw.toString());

        const data = result[0].data;
        for (let i = 0; i < nodes; i++) {
            const actual = parseInt(data[data.length - i - 1].value[1]);
            actual.should.be.gt(0);
        }
    });
});

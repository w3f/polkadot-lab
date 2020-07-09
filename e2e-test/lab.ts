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
persistence:
  kind: file
  path: ${outputFile.name}
settlementTime: 20000
testCases:
- name: test-case-number-of-peers
  delay: 120000
  dependency:
    chart: w3f/polkadot-lab-test-case-prometheus
    version: "v0.1.0"
    values:
      prometheus:
        name: number-of-peers
        query: polkadot_sub_libp2p_peers_count
- name: test-case-time-to-finality
  delay: 120000
  dependency:
    chart: w3f/polkadot-lab-test-case-prometheus
    version: "v0.1.0"
    values:
      prometheus:
        name: time-to-finality
        query: polkadot_block_finality_seconds
dependencies:
- chart: w3f/substrate-telemetry
  version: 'v2.2.0'
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

let result: object;

describe('E2E', () => {
    before(async () => {
        const cfgFile = tmp.fileSync();
        fs.writeSync(cfgFile.fd, cfgContent);

        await startAction({ config: cfgFile.name });

        const resultRaw = fs.readFileSync(outputFile.name);
        result = JSON.parse(resultRaw.toString());
    });

    describe('experiment execution', () => {
        it('number of peers results', async () => {
            const data = result[0].data;
            for (let i = 0; i < nodes; i++) {
                const actual = parseInt(data[data.length - i - 1].value[1]);
                actual.should.be.gt(0);
            }
        });
        it('time to finality results', async () => {
            const data = result[1].data;
        });
    });
});

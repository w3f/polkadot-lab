import { should } from 'chai';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';

import { startAction } from '../src/actions/start';

should();

const outputFile = tmp.fileSync();
const nodes = 4;
const cfgContent = `
name: 'e2e-test'
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
  delay: 140000
  dependency:
    chart: w3f/polkadot-lab-test-case-prometheus
    version: "v0.1.0"
    values:
      logLevel: debug
      prometheus:
        name: number-of-peers
        query: polkadot_sub_libp2p_peers_count
        period: 5000
- name: test-case-time-to-finality
  delay: 120000
  dependency:
    chart: w3f/polkadot-lab-test-case-prometheus
    version: "v0.1.0"
    values:
      logLevel: debug
      prometheus:
        name: time-to-finality
        query: rate(polkadot_block_finality_seconds_sum[1m])/rate(polkadot_block_finality_seconds_count[1m])
        period: 5000
dependencies:
- chart: w3f/substrate-telemetry
  version: 'v2.4.3'
  values:
    exporter:
      config:
        subscribe:
          chains:
          - testnet
- chart: w3f/polkadot
  values:
    image:
      repo: 'parity/polkadot'
      tag: 'v0.8.29'
  version: 'v0.34.1'
- chart: w3f/polkadot-base-services
  version: 'v0.34.1'
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

            const value = parseInt(data[data.length - 1].value[1]);
            value.should.be.gt(10).and.lt(25);
        });
    });
});

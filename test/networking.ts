import { should } from 'chai';

import {
    NetworkingUtils,
    baseP2PPort
} from '../src/networking';
import {
    Topology
} from '../src/types';

should();


const size = 4;
const subject = new NetworkingUtils(size, Topology.Line);

interface CheckCfg {
    index: number;
    topology: Topology;
    expected: Array<string>;
}

const checkReservedPeers = (cfg: CheckCfg) => {
    subject.setTopology(cfg.topology);

    const actual = subject.reservedPeers(cfg.index);

    actual.should.deep.eq(cfg.expected);
}

describe('NetworkUtils', () => {
    describe('multiAddr', () => {
        it('should return a multiaddr depending on an index', () => {
            const index = 1;
            const port = baseP2PPort + index;
            const expected = `/dns4/polkadot-${index}-p2p/tcp/${port}`;

            const actual = subject.multiAddr(index);

            actual.should.eq(expected);
        });
    });

    describe('p2pPort', () => {
        it('should return consecutive p2pPorts', () => {
            const port1 = subject.p2pPort(0);
            const port2 = subject.p2pPort(1);

            const expectedDifference = 1;

            const actualDifference = port2 - port1;

            actualDifference.should.eq(expectedDifference);
        });
    });

    describe('reservedPeers', () => {
        it('should return reserved peers for circle topology for first element ', () => {
            checkReservedPeers({
                index: 0,
                topology: Topology.Circle,
                expected: [
                    '/dns4/polkadot-1-p2p/tcp/30334',
                    '/dns4/polkadot-3-p2p/tcp/30336'
                ]
            });
        });

        it('should return reserved peers for circle topology for last element ', () => {
            checkReservedPeers({
                index: size - 1,
                topology: Topology.Circle,
                expected: [
                    '/dns4/polkadot-0-p2p/tcp/30333',
                    '/dns4/polkadot-2-p2p/tcp/30335'
                ]
            });
        });

        it('should return reserved peers for circle topology for middle element ', () => {
            checkReservedPeers({
                index: 2,
                topology: Topology.Circle,
                expected: [
                    '/dns4/polkadot-1-p2p/tcp/30334',
                    '/dns4/polkadot-3-p2p/tcp/30336'
                ]
            });
        });

        it('should return reserved peers for line topology for first element', () => {
            checkReservedPeers({
                index: 0,
                topology: Topology.Line,
                expected: [
                    '/dns4/polkadot-1-p2p/tcp/30334',
                ]
            });
        });

        it('should return reserved peers for line topology for last element', () => {
            checkReservedPeers({
                index: size - 1,
                topology: Topology.Line,
                expected: [
                    '/dns4/polkadot-2-p2p/tcp/30335',
                ]
            });
        });
        it('should return reserved peers for line topology for middle element', () => {
            checkReservedPeers({
                index: 2,
                topology: Topology.Line,
                expected: [
                    '/dns4/polkadot-1-p2p/tcp/30334',
                    '/dns4/polkadot-3-p2p/tcp/30336'
                ]
            });
        });

        it('should return reserved peers for full topology for first element', () => {
            checkReservedPeers({
                index: 0,
                topology: Topology.Full,
                expected: [
                    '/dns4/polkadot-1-p2p/tcp/30334',
                    '/dns4/polkadot-2-p2p/tcp/30335',
                    '/dns4/polkadot-3-p2p/tcp/30336'
                ]
            });
        });
        it('should return reserved peers for full topology for last element', () => {
            checkReservedPeers({
                index: size - 1,
                topology: Topology.Full,
                expected: [
                    '/dns4/polkadot-0-p2p/tcp/30333',
                    '/dns4/polkadot-1-p2p/tcp/30334',
                    '/dns4/polkadot-2-p2p/tcp/30335'
                ]
            });
        });
        it('should return reserved peers for full topology for middle element', () => {
            checkReservedPeers({
                index: 2,
                topology: Topology.Full,
                expected: [
                    '/dns4/polkadot-0-p2p/tcp/30333',
                    '/dns4/polkadot-1-p2p/tcp/30334',
                    '/dns4/polkadot-3-p2p/tcp/30336'
                ]
            });
        });
    });
});

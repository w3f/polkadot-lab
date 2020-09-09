import { should } from 'chai';

import {
    NetworkingUtils,
    baseP2PPort
} from '../src/networking';
import {
} from '../src/types';

should();

const subject = new NetworkingUtils();

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
    /*
    describe('p2pPort', () => {
        it('should return consecutive p2pPorts', () => {
        });
    });
    describe('reservedPeers', () => {
        it('should return reserved peers for circle topology for first element ', () => {
        });
        it('should return reserved peers for circle topology for last element ', () => {
        });
        it('should return reserved peers for circle topology for middle element ', () => {
        });
        it('should return reserved peers for line topology for first element', () => {
        });
        it('should return reserved peers for line topology for last element', () => {
        });
        it('should return reserved peers for line topology for middle element', () => {
        });
        it('should return reserved peers for full topology for first element', () => {
        });
        it('should return reserved peers for full topology for last element', () => {
        });
        it('should return reserved peers for full topology for middle element', () => {
        });
    });
    */
});

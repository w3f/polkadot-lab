import { Logger, createLogger } from '@w3f/logger';

import {
    Topology
} from '../types';


export const baseP2PPort = 30333;

export class NetworkingUtils {
    constructor(
        protected readonly logger?: Logger
    ) {
        if (!logger) {
            this.logger = createLogger();
        }
    }

    multiAddr(index: number): string {
        const p2pPort = this.p2pPort(index);
        //const peerID = '12D3KooWDpJ7As7BWAwRMfu1VU2WCqNjvq387JEYKDBj4kx6nXTN';
        //return `/dns4/polkadot-${index}-p2p/tcp/${p2pPort}/p2p/${peerID}`;

        return `/dns4/polkadot-${index}-p2p/tcp/${p2pPort}`;
    }

    p2pPort(index: number): number {
        return index + baseP2PPort;
    }

    reservedPeers(index: number, size: number, topology: Topology): string {
        switch (topology) {
            case Topology.Circle:
                return this.circleReservedPeers(index, size);
            case Topology.Line:
                return this.lineReservedPeers(index, size);
            case Topology.Full:
                return this.fullReservedPeers(index, size);
        }
    }

    private circleReservedPeers(index: number, size: number): string {
        return '';
    }

    private lineReservedPeers(index: number, size: number): string {
        return '';
    }

    private fullReservedPeers(index: number, size: number): string {
        return '';
    }
}

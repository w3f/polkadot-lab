import { Logger, createLogger } from '@w3f/logger';

import {
    Topology
} from '../types';


export const baseP2PPort = 30333;

export class NetworkingUtils {
    constructor(
        protected readonly size: number,
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

    reservedPeers(index: number, topology: Topology): Array<string> {
        switch (topology) {
            case Topology.Circle:
                return this.circleReservedPeers(index);
            case Topology.Line:
                return this.lineReservedPeers(index);
            case Topology.Full:
                return this.fullReservedPeers(index);
        }
    }

    private circleReservedPeers(index: number): Array<string> {
        let output = [];
        if (index === 0) {
            output = [
                this.multiAddr(this.size - 1),
                this.multiAddr(1),
            ];
        } else if (index === this.size - 1) {
            output = [
                this.multiAddr(0),
                this.multiAddr(index - 1),
            ];
        } else {
            output = [
                this.multiAddr(index - 1),
                this.multiAddr(index + 1),
            ];
        }

        return output.sort();
    }

    private lineReservedPeers(index: number): Array<string> {
        return [];
    }

    private fullReservedPeers(index: number): Array<string> {
        return [];
    }
}

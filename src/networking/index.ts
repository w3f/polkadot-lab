import { Logger, createLogger } from '@w3f/logger';
import multihashes from 'multihashes'
import crypto from '@w3f/libp2p-crypto';

import {
    Topology
} from '../types';


export const baseP2PPort = 30333;

interface NodeInfo {
    nodeKey: string;
    peerId: string;
}

export class NetworkingUtils {
    private nodeListInfo: Array<NodeInfo>

    constructor(
        protected readonly size: number,
        protected topology: Topology,
        protected readonly logger?: Logger
    ) {
        if (!logger) {
            this.logger = createLogger();
        }

        this.nodeListInfo = new Array(this.size);
    }

    setTopology(topology: Topology): void {
        this.topology = topology;
    }

    nodeKey(index: number): string {
        return this.nodeListInfo[index].nodeKey;
    }

    multiAddr(index: number): string {
        const p2pPort = this.p2pPort(index);
        const peerId = this.nodeListInfo[index].peerId;

        return `/dns4/polkadot-${index}-p2p/tcp/${p2pPort}/p2p/${peerId}`;
    }

    p2pPort(index: number): number {
        return index + baseP2PPort;
    }

    reservedPeers(index: number): Array<string> {
        switch (this.topology) {
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
        let output = [];
        if (index === 0) {
            output = [
                this.multiAddr(1),
            ];
        } else if (index === this.size - 1) {
            output = [
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

    private fullReservedPeers(index: number): Array<string> {
        const output = [];
        for (let i = 0; i < this.size; i++) {
            if (i !== index) {
                output.push(this.multiAddr(i));
            }
        }
        return output.sort();
    }

    async setup(): Promise<void> {
        for (let i = 0; i < this.size; i++) {
            this.nodeListInfo[i] = await this.initializeNodeInfo();
        }
    }

    private async initializeNodeInfo(): Promise<NodeInfo> {
      return new Promise((resolve, reject) => {
          crypto.keys.generateKeyPair('ed25519', 128, (err, key) => {
              if (err) {
                  reject(err);
                  return;
              }
              const nodeKey = key.bytes.toString('hex').substr(8, 64);
              const ipeerIdBytes = multihashes.encode(key.public.bytes,"identity")
              const peerId = multihashes.toB58String(ipeerIdBytes)
              resolve({ nodeKey, peerId });
          })
      });
  }
}

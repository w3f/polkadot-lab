import { ChartConfig } from '@w3f/helm';
import { Crypto, KeyTypes, KeysBundle } from '@w3f/crypto';
import { Logger } from '@w3f/logger';

import {
    OrderedChartManager
} from '../../types';
import { BaseChart } from '../../helm';
import { mergeDeep } from '../../utils';
import { NetworkingUtils } from '../../networking';


export class PolkadotChart extends BaseChart implements OrderedChartManager {
    private commonValues: any;
    private index = 0;
    private keys: KeysBundle;

    constructor(
        private readonly networkingUtils: NetworkingUtils,
        private readonly size: number,
        protected readonly logger: Logger
    ) {
        super(logger);
    }

    setIndex(index: number): void {
        this.index = index;
    }

    async cfg(): Promise<ChartConfig> {
        return {
            name: `polkadot-${this.index}`,
            chart: 'w3f/polkadot',
            wait: false
        };
    }

    name(): string {
        return 'w3f/polkadot';
    }

    async values(): Promise<any> {
        if (!this.keys) {
            const crypto = new Crypto(this.size);
            this.keys = await crypto.createKeys();
        }
        if (!this.commonValues) {
            this.initCommonValues();
        }

        const p2pPort = this.networkingUtils.p2pPort(this.index);
        const values = {
            name: `polkadot-${this.index}`,
            keys: {
                session_audi: this.keys[KeyTypes.Audi][this.index].seed,
                session_babe: this.keys[KeyTypes.Babe][this.index].seed,
                session_grandpa: this.keys[KeyTypes.Grandpa][this.index].seed,
                session_imonline: this.keys[KeyTypes.Imonline][this.index].seed,
                session_parachain: this.keys[KeyTypes.Parachain][this.index].seed,
            },
            p2pPort,
        };
        values['createConfigMap'] = false;
        values['extraArgs'] = {};

        if (this.index === 0) {
            values['createConfigMap'] = true;
            values['extraArgs']['validator'] = '--alice';
        }
        values['nodeKey'] = this.nodeKey(this.index);

        values['extraArgs']['common'] = `--reserved-only ${this.networkingArgs()}`;

        return mergeDeep(this.commonValues, values);
    }

    private initCommonValues() {
        this.commonValues = {
            deploymentName: 'polkadot-lab',

            monitoring: true,

            telemetry: 'ws://substrate-telemetry-backend:8000/submit',

            dnsNameservers: null,

            persistence: {
                enabled: true,
                dataSize: "1Gi",
                chainspecSize: "1Gi",
                accessModes: ["ReadWriteOnce"]
            },
            chainspec: {
                addresses: {
                    stash: this.keys[KeyTypes.Stash].map(item => item.address),
                    controller: this.keys[KeyTypes.Controller].map(item => item.address),

                    session_audi: this.keys[KeyTypes.Audi].map(item => item.address),
                    session_babe: this.keys[KeyTypes.Babe].map(item => item.address),
                    session_grandpa: this.keys[KeyTypes.Grandpa].map(item => item.address),
                    session_imonline: this.keys[KeyTypes.Imonline].map(item => item.address),
                    session_parachain: this.keys[KeyTypes.Parachain].map(item => item.address)
                }
            }
        };
    }

    private nodeKey(index: number): string {
        const nodeKeyLength = 64;
        const end = `${index}`;

        return end.padStart(nodeKeyLength - end.length, "0");
    }

    private networkingArgs(): string {
        let reservedPeers = this.networkingUtils.reservedPeers(this.index);

        reservedPeers = reservedPeers.map((el) => `--reserved-nodes=${el}`);

        return reservedPeers.join(' ');
    }
}

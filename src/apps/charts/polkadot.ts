import { ChartConfig } from '@w3f/helm';
import { Crypto, KeyTypes, KeysBundle } from '@w3f/crypto';

import { ChartManager } from '../../types';
import { BaseChart } from '../../helm';


const baseP2PPort = 30333;

export class PolkadotChart extends BaseChart implements ChartManager {
    private commonValues: any;
    private index = 0;
    private keys: KeysBundle;

    async cfg(): Promise<ChartConfig> {
        return {
            name: `polkadot-${this.index}`,
            chart: 'w3f/polkadot',
            wait: false
        };
    }

    async values(): Promise<any> {
        if (!this.keys) {
            const crypto = new Crypto(this.size);
            this.keys = await crypto.createKeys();
        }
        if (!this.commonValues) {
            this.initCommonValues();
        }

        const values = {
            name: `polkadot-${this.index}`,
            keys: {
                session_audi: this.keys[KeyTypes.Audi][this.index].seed,
                session_babe: this.keys[KeyTypes.Babe][this.index].seed,
                session_grandpa: this.keys[KeyTypes.Grandpa][this.index].seed,
                session_imonline: this.keys[KeyTypes.Imonline][this.index].seed,
                session_parachain: this.keys[KeyTypes.Parachain][this.index].seed,
            },
            p2pPort: this.index + baseP2PPort,
        };
        values['createConfigMap'] = false;
        if (this.index === 0) {
            values['createConfigMap'] = true;
        }

        this.index++;

        return Object.assign(this.commonValues, values);
    }

    private initCommonValues() {
        this.commonValues = {
            deploymentName: 'polkadot-lab',

            monitoring: true,

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
}

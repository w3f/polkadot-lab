import { ChartConfig } from '@w3f/helm';
import { Crypto, KeyTypes, KeysBundle } from '@w3f/crypto';

import { ChartManager } from '../../types';
import { BaseChart } from './base';

const baseP2PPort = 30333;

export class PolkadotChart extends BaseChart implements ChartManager {
    private commonData: any;
    private index = 0;
    private keys: KeysBundle;

    async cfg(): Promise<ChartConfig> {
        return {
            name: `polkadot-${this.index}`,
            chart: 'w3f/polkadot',
            wait: false
        };
    }

    async data(): Promise<any> {
        if (!this.keys) {
            const crypto = new Crypto(this.size);
            this.keys = await crypto.createKeys();
        }
        if (!this.commonData) {
            this.initCommonData();
        }

        const data = {
            name: `polkadot-${this.index}`,
            audiSessionSeed: this.keys[KeyTypes.Audi][this.index].seed,
            granSessionSeed: this.keys[KeyTypes.Grandpa][this.index].seed,
            babeSessionSeed: this.keys[KeyTypes.Babe][this.index].seed,
            imonSessionSeed: this.keys[KeyTypes.Imonline][this.index].seed,
            paraSessionSeed: this.keys[KeyTypes.Parachain][this.index].seed,
            p2pPort: this.index + baseP2PPort,
        };
        data['createConfigMap'] = false;
        if (this.index === 0) {
            data['createConfigMap'] = true;
        }

        this.index++;

        return Object.assign(this.commonData, data);
    }

    private initCommonData() {
        this.commonData = {
            deploymentName: 'polkadot-lab',

            chainspecStashAddresses: this.keys[KeyTypes.Stash].map(item => item.address),
            chainspecControllerAddresses: this.keys[KeyTypes.Controller].map(item => item.address),

            chainspecAudiAddresses: this.keys[KeyTypes.Audi].map(item => item.address),
            chainspecBabeAddresses: this.keys[KeyTypes.Babe].map(item => item.address),
            chainspecGranAddresses: this.keys[KeyTypes.Grandpa].map(item => item.address),
            chainspecImonAddresses: this.keys[KeyTypes.Imonline].map(item => item.address),
            chainspecParaAddresses: this.keys[KeyTypes.Parachain].map(item => item.address),
        };
    }
}

import { Logger } from '@w3f/logger';
import { Helm, ChartConfig } from '@w3f/helm';
import { Crypto, KeyTypes, KeysBundle } from '@w3f/crypto';
import path from 'path';

import {
    Topology,
    ApplicationsManager,
    Dependencies
} from '../types';


export class Apps implements ApplicationsManager {
    private helm: Helm;
    private crypto: Crypto;

    constructor(
        private readonly topology: Topology,
        private readonly size: number,
        private readonly dependencies: Dependencies,
        private readonly logger: Logger
    ) { }

    async install(kubeconfig: string): Promise<void> {
        await this.init(kubeconfig);

        await this.installDependencies();

        await this.installNodes();
    }

    private async init(kubeconfig: string): Promise<void> {
        if (!this.helm) {
            this.helm = await Helm.create(kubeconfig, this.logger);
            await this.helm.addRepos([
                {
                    name: 'w3f',
                    url: 'https://w3f.github.io/helm-charts'
                },
                {
                    name: 'stable',
                    url: 'https://kubernetes-charts.storage.googleapis.com/'
                }
            ]);
        }
        if (!this.crypto) {
            this.crypto = new Crypto(this.size);
        }
    }

    private async installDependencies(): Promise<void> {
        await this.installPrometheus();

        await this.installNetworkPolicy();
    }

    private async installNodes(): Promise<void> {
        await this.installPolkadotBaseServices();

        const keys = await this.crypto.createKeys();
        for (let i = 0; i < this.size; i++) {
            await this.installPolkadot(i, keys);
        }
    }

    private async installPrometheus(): Promise<void> {
        const chartCfg: ChartConfig = {
            name: 'prometheus-operator',
            chart: 'stable/prometheus-operator',
            wait: true
        };
        await this.installChart(chartCfg);
    }

    private async installNetworkPolicy(): Promise<void> {
        const data = {
            topology: this.topology,
            size: this.size
        };
        const chartCfg: ChartConfig = {
            name: 'network-policy',
            chart: 'w3f/network-policy',
            wait: true
        };
        await this.installChart(chartCfg, data);
    }

    private async installPolkadotBaseServices(): Promise<void> {
        const chartCfg: ChartConfig = {
            name: 'polkadot-base-services',
            chart: 'w3f/polkadot-base-services',
            wait: true
        };
        await this.installChart(chartCfg);
    }

    private async installPolkadot(order: number, keys: KeysBundle): Promise<void> {
        const data = {
            name: `polkadot-${order}`,
            deploymentName: 'polkadot-lab',

            chainspecStashAddresses: keys[KeyTypes.Stash].map(item => item.address),
            chainspecControllerAddresses: keys[KeyTypes.Controller].map(item => item.address),

            chainspecAudiAddresses: keys[KeyTypes.Audi].map(item => item.address),
            chainspecBabeAddresses: keys[KeyTypes.Babe].map(item => item.address),
            chainspecGranAddresses: keys[KeyTypes.Grandpa].map(item => item.address),
            chainspecImonAddresses: keys[KeyTypes.Imonline].map(item => item.address),
            chainspecParaAddresses: keys[KeyTypes.Parachain].map(item => item.address),

            audiSessionSeed: keys[KeyTypes.Audi][order].seed,
            granSessionSeed: keys[KeyTypes.Grandpa][order].seed,
            babeSessionSeed: keys[KeyTypes.Babe][order].seed,
            imonSessionSeed: keys[KeyTypes.Imonline][order].seed,
            paraSessionSeed: keys[KeyTypes.Parachain][order].seed,
        };
        const chartCfg: ChartConfig = {
            name: 'polkadot',
            chart: 'w3f/polkadot',
            wait: false
        };
        await this.installChart(chartCfg, data);
    }

    private async installChart(chartCfg: ChartConfig, data: any = {}): Promise<void> {
        const valuesTemplatePath = path.join(__dirname, 'values', `${chartCfg.name}.yaml`);
        const valuesTemplate = {
            path: valuesTemplatePath,
            data
        };
        chartCfg.valuesTemplate = valuesTemplate;
        if (this.dependencies &&
            this.dependencies[chartCfg.name]) {
            if (this.dependencies[chartCfg.name].image) {
                data['image'] = {};
                ['repo', 'tag'].forEach((field) => {
                    if (this.dependencies['polkadot'].image[field]) {
                        data['image'][field] = this.dependencies['polkadot'].image[field];
                    }
                });
            }
            if (this.dependencies[chartCfg.name].chart) {
                chartCfg.version = this.dependencies[chartCfg.name].chart;
            }
        }
        await this.helm.install(chartCfg);
    }
}

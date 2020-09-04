import { Logger } from '@w3f/logger';
import {
    Terraform,
    ModuleConfig
} from '@w3f/terraform';

import { PlatformManager } from '../../types';
import { ClusterName } from '../../constants';


export class RemotePlatform implements PlatformManager {
    private terraform: Terraform;
    private moduleCfg: ModuleConfig;

    constructor(
        private readonly name: string,
        private readonly size: number,
        private readonly logger: Logger) { }

    async create(): Promise<void> {
        await this.init();

        return this.terraform.apply(this.moduleCfg);
    }
    async destroy(): Promise<void> {
        await this.init();

        return this.terraform.destroy(this.moduleCfg);
    }
    async getKubeconfig(): Promise<string> {
        await this.init();

        const result = await this.terraform.output(this.moduleCfg, 'kubeconfig');
        return result as string;
    }

    private async init(): Promise<void> {
        if (!this.terraform) {
            this.terraform = await Terraform.create(this.logger);
            this.moduleCfg = {
                moduleLocation: '',
                vars: {}
            }
        }
    }
}

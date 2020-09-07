import { Logger } from '@w3f/logger';
import {
    Terraform,
    ModuleConfig
} from '@w3f/terraform';
import path from 'path';

import { PlatformManager } from '../../types';

const coresPerMachine = 80;


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

            const cluster_name = this.name;
            const node_count = this.determineNodeCount();
            const machine_type = this.determineMachineType();
            const moduleLocation = path.join(__dirname, 'modules', 'polkadot-lab');

            this.moduleCfg = {
                moduleLocation,
                vars: {
                    cluster_name,
                    node_count,
                    machine_type
                }
            }
        }
    }

    private determineNodeCount(): number {
        // one core per polkadot node and 2 more cores for additional services
        const requiredCores = this.size + 2;

        return Math.floor(requiredCores / coresPerMachine) + 1;
    }

    private determineMachineType(): string {
        return `n2d-standard-${coresPerMachine}`;
    }
}

import { Logger } from '@w3f/logger';

import {
    ApplicationsManager,
    EngineManager,
    EngineConfig,
    PlatformManager,
    ResultsManager
} from './types';

export class Engine implements EngineManager {
    private platform: PlatformManager;
    private apps: ApplicationsManager;
    private results: ResultsManager;
    private logger: Logger;

    constructor(cfg: EngineConfig) {
        this.platform = cfg.platform;
        this.apps = cfg.apps;
        this.results = cfg.results;
    }

    async start(): Promise<void> {
        this.logger.info('Execution engine started');

        this.logger.info('Creating platform...');
        await this.platform.create();
        const kubeconfig = await this.platform.getKubeconfig();
        this.logger.info('Platform created');

        this.apps.setKubeconfig(kubeconfig);

        this.logger.info('Installing dependencies...');
        await this.apps.installDependencies();
        this.logger.info('Dependencies installed');

        this.logger.info('Installing nodes...');
        await this.apps.installNodes();
        this.logger.info('Nodes installed');

        this.logger.info('Executing tests...');
        await this.results.runTests();
        this.logger.info('Tests executed');

        this.logger.info('Writing results...');
        await this.results.writeResults();
        this.logger.info('Results written');
    }

    async stop(): Promise<void> {
        this.logger.info('Execution engine stopped');
    }
}

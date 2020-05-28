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
        this.logger = cfg.logger;
    }

    async start(): Promise<void> {
        this.logger.info('Execution engine started');

        this.logger.info('Creating platform...');
        await this.platform.create();
        const kubeconfig = await this.platform.getKubeconfig();
        this.logger.info('Platform created');

        this.logger.info('Installing dependencies and nodes...');
        await this.apps.install(kubeconfig);
        this.logger.info('Dependencies and nodes installed');

        this.logger.info('Executing tests...');
        const resultData = await this.results.runTests();
        this.logger.info('Tests executed');
    }

    async stop(): Promise<void> {
        this.logger.info('Execution engine stopped');
    }
}

import { Logger } from '@w3f/logger';
import fs from 'fs-extra';
import tmp from 'tmp';

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
        const kubeconfigContent = await this.platform.getKubeconfig();
        this.logger.info('Platform created');

        const tmpobj = tmp.fileSync();
        const kubeconfigPath = tmpobj.name;
        fs.writeFileSync(kubeconfigPath, kubeconfigContent);

        this.logger.info('Installing dependencies and nodes...');
        await this.apps.install(kubeconfigPath);
        this.logger.info('Dependencies and nodes installed');

        this.logger.info('Executing test cases...');
        const resultData = await this.results.runTestCases(kubeconfigPath);
        this.logger.info('Tests executed');
    }

    async stop(): Promise<void> {
        await this.platform.destroy();
        this.logger.info('Execution engine stopped');
    }
}

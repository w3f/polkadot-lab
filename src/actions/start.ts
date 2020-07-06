import { Config } from '@w3f/config';
import { createLogger } from '@w3f/logger';

import { InputConfig } from '../types';
import { Engine } from '../engine';
import { Platform } from '../platform';
import { Apps } from '../apps';
import { Results } from '../results';
import { Persistence } from '../persistence';


export async function startAction(cmd): Promise<void> {
    const cfg = new Config<InputConfig>().parse(cmd.config);
    const logger = createLogger(cfg.logLevel);

    const platform = new Platform(cfg.mode, cfg.size, logger);

    const appCfg = {
        topology: cfg.topology,
        size: cfg.size,
        dependencies: cfg.dependencies,
        logger
    };
    const apps = new Apps(appCfg);
    const results = new Results(cfg.targetStd, cfg.testCases, logger);
    const persistence = new Persistence(cfg.persistence, logger);

    const engineCfg = {
        platform,
        apps,
        results,
        persistence,
        logger
    }

    const engine = new Engine(engineCfg);

    let exitCode = 0;
    try {
        await engine.start();
    } catch (e) {
        logger.error(e);

        exitCode = 1;
    }
    await engine.stop();
    //process.exit(exitCode);
}

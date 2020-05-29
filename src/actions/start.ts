import { Config } from '@w3f/config';
import { createLogger } from '@w3f/logger';

import { InputConfig } from '../types';
import { Engine } from '../engine';
import { Platform } from '../platform';
import { Apps } from '../apps';
import { Results } from '../results';


export async function startAction(cmd): Promise<void> {
    const cfg = new Config<InputConfig>().parse(cmd.config);
    const logger = createLogger(cfg.logLevel);

    const platform = new Platform(cfg.mode, cfg.nodes, logger);
    const apps = new Apps(cfg.topology, logger);
    const results = new Results(cfg.targetStd, cfg.metrics, logger);

    const engineCfg = {
        platform,
        apps,
        results,
        logger
    }

    const engine = new Engine(engineCfg);

    try {
        await engine.start();
    } catch (e) {
        logger.error(e);
        process.exit(1);
    }
}

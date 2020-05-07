import readline from 'readline';
import { Config } from '@w3f/config';
import { InputConfig } from '../types';
import { createLogger } from '@w3f/logger';
import { Engine } from '../engine';

export async function startAction(): Promise<void> {
  try {
      const cfg = new Config<InputConfig>().parse(cmd.config);
      const logger = createLogger(cfg.logLevel);
      const engine = new Engine(cfg.items, logger);

      // TODO: instantiate result service and clients
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.on('keypress', async (str, key) => {
          if (key.ctrl && key.name === 'c') {
              await engine.stop();
              process.exit();
          }
      });
      await engine.start();
  } catch (e) {
      console.log(e);
      process.exit(1);
  }
}

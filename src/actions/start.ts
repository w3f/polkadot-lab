import readline from 'readline';

//import { Config } from '../config';
import { createLogger } from '../logger';
import { Engine } from '../engine';

export async function startAction(): Promise<void> {
    //const cfg = Config.parse(cmd.config);

    const logger = createLogger('info');

    // TODO: instantiate result service and clients

    const engine = new Engine(logger);

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', async (str, key) => {
        if (key.ctrl && key.name === 'c') {
            await engine.stop();
            process.exit();
        }
    });

    await engine.start();
}

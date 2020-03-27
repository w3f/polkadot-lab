import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';

import { InputConfig } from './types';


export class Files {
    static readYAML(filePath: string): InputConfig {
        const rawContent = fs.readFileSync(path.resolve(__dirname, filePath)).toString();

        return yaml.safeLoad(rawContent) as InputConfig;
    }
}

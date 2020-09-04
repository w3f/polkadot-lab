import string from 'string-sanitizer';

import { InputConfig } from '../types';


export const sanitize = (cfg: InputConfig): InputConfig => {
    const copy = (JSON.parse(JSON.stringify(cfg)));

    copy.name = string.addDash(cfg.name.trim());

    return copy;
}

import { Logger } from '@w3f/logger';

import {
    Topology,
    Dependencies,
} from '../../types';

export class BaseChart {
    constructor(
        protected readonly topology: Topology,
        protected readonly size: number,
        protected readonly dependencies: Dependencies,
        protected readonly logger: Logger
    ) { }

    async data(): Promise<any> {
        return {};
    }
}

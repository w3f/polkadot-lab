import { Logger } from '@w3f/logger';

export class BaseChart {
    constructor(
        protected readonly logger: Logger
    ) { }

    async values(): Promise<any> {
        return {};
    }
}

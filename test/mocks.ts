import { LabResult } from '@w3f/polkadot-lab-types';


export class PlatformMock {
    async create(): Promise<void> {
        return
    }
    async destroy(): Promise<void> {
        return
    }
    async getKubeconfig(): Promise<string> {
        return
    }
}

export class AppsMock {
    async install(kubeconfig: string): Promise<void> {
        return
    }
}

export class ResultsMock {
    async runTestCases(): Promise<Array<LabResult>> {
        return
    }
}

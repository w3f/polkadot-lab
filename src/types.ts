export enum Topology {
    Line = 'Line',
    Full = 'Full'
}

export enum Metric {
    TimeToFinality = 'TimeToFinality'
}

export type Metrics = Array<Metric>;

export interface EngineManager {
    start(): Promise<void>;
    stop(): Promise<void>;
}

export interface PlatformManager {
    create(): Promise<void>;
    destroy(): Promise<void>;
    getKubeconfig(): Promise<string>;
}

export interface ApplicationsManager {
    setKubeconfig(kubeconfig: string): void;
    installDependencies(): Promise<void>;
    installNodes(): Promise<void>;
}

export interface ResultsManager {
    runTests(): Promise<void>;
    writeResults(): Promise<void>;
}

export interface LabConfig {
    nodes: number;
    topology: Topology;
    targetStd: number;
    metrics: Metrics;
}

export interface InputConfig extends LabConfig {
    logLevel: string;
    maximumExecutionTime: string;
}

export interface EngineConfig extends LabConfig {
    platform: PlatformManager;
    apps: ApplicationsManager;
    results: ResultsManager;
}

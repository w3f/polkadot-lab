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

export interface EngineConfig {
    nodes: number;
    topology: Topology;
    targetStd: number;
    metrics: Metrics;
}

export interface InputConfig extends EngineConfig {
    logLevel: string;
    maximumExecutionTime: string;
}

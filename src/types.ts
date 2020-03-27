export interface Logger {
    info: (msg: string) => void;
}

export enum Topology {
    Line = "Line",
    Full = "Full"
}

export interface InputConfig {
    logLevel: string;
    maximumExecutionTime: string;
    nodes: number;
    topology: Topology;
    targetStd: number;
}

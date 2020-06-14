import { Logger } from '@w3f/logger';
import { ChartConfig } from '@w3f/helm';
import { TestCaseInputConfig } from '@w3f/polkadot-lab-types';


export enum Topology {
    Line = 'line',
    Circle = 'circle',
    Full = 'full'
}

export interface TestCase {
    name: string;
    config: TestCaseInputConfig;
}

export type TestCases = Array<TestCase>;

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
    install(kubeconfig: string): Promise<void>;
}

export type ResultData = {}

export interface ResultsManager {
    runTestCases(): Promise<ResultData>;
}

export enum ExecutionMode {
    Local = 'local',
    Remote = 'remote'
}

export interface Image {
    repo?: string;
    tag?: string;
}

export interface Dependency {
    image?: Image;
    chart?: string;
}

export interface Dependencies {
    [name: string]: Dependency;
}

export interface InputConfig {
    logLevel: string;
    maximumExecutionTime: string;

    mode: ExecutionMode; // platform
    size: number; // platform, apps

    topology: Topology; // apps
    dependencies?: Dependencies; // apps

    targetStd: number; // results
    testCases: TestCases; // results
}

export interface EngineConfig {
    platform: PlatformManager;
    apps: ApplicationsManager;
    results: ResultsManager;
    logger: Logger;
}

export interface ChartManager {
    cfg(): Promise<ChartConfig>;
    data(): Promise<any>;
}

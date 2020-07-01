import { Logger } from '@w3f/logger';
import { ChartConfig } from '@w3f/helm';
import { LabResult, TestCaseInputConfig } from '@w3f/polkadot-lab-types';


export enum Topology {
    Line = 'line',
    Circle = 'circle',
    Full = 'full'
}

export interface TestCaseDefinition {
    name: string;
    dependency: Dependency;
    config: TestCaseInputConfig;
}

export type TestCaseDefinitions = Array<TestCaseDefinition>;

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

export interface ResultsManager {
    runTestCases(kubeconfig: string): Promise<Array<LabResult>>;
}

export enum ExecutionMode {
    Local = 'local',
    Remote = 'remote'
}

export interface Dependency {
    values?: any;
    version?: string;
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
    testCases: TestCaseDefinitions; // results
}

export interface EngineConfig {
    platform: PlatformManager;
    apps: ApplicationsManager;
    results: ResultsManager;
    logger: Logger;
}

export interface HelmManagerConfig {
    kubeconfig: string;
    logger: Logger;
}

export interface HelmManager {
    installChart(chart: ChartManager, dependency?: Dependency): Promise<void>;
}

export interface AppsConfig {
    topology: Topology;
    size: number;
    dependencies?: Dependencies;
    logger: Logger;
}

export interface ChartManager {
    name(): string;
    cfg(): Promise<ChartConfig>;
    values(): Promise<any>;
}

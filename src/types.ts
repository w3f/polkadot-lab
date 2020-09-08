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
    dependency: TestCaseDependency;
    delay: number;
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

export interface BaseDependency {
    chart: string;
    version?: string;
}

export interface TestCaseDependency extends Dependency {
    values?: TestCaseInputConfig;
}

export interface Dependency extends BaseDependency {
    values?: any;
}

export type Dependencies = Array<Dependency>;

export enum PersistenceKind {
    File = 'file',
    Database = 'database'
}

export interface FilePersistenceConfig {
    kind: PersistenceKind.File;
    path: string;
}

export interface DatabasePersistenceConfig {
    kind: PersistenceKind.Database;
}

export type PersistenceConfig = FilePersistenceConfig | DatabasePersistenceConfig;

export interface PersistenceManager {
    saveResults(results: Array<LabResult>): Promise<void>;
}

export interface InputConfig {
    name: string;
    logLevel: string;
    maximumExecutionTime: string;

    mode: ExecutionMode;
    size: number;

    topology: Topology;
    dependencies?: Dependencies;

    testCases: TestCaseDefinitions;

    persistence: PersistenceConfig;

    settlementTime?: number;
}

export interface ResultsConfig {
    settlementTime: number;
    testCases: TestCaseDefinitions;
    logger: Logger;
}

export interface EngineConfig {
    platform: PlatformManager;
    apps: ApplicationsManager;
    results: ResultsManager;
    persistence: PersistenceManager;
    logger: Logger;
}

export interface HelmManagerConfig {
    kubeconfig: string;
    logger: Logger;
}

export interface HelmManager {
    installChart(chart: ChartManager, dependency?: Dependency): Promise<void>;
    uninstallChart(name: string): Promise<void>;
}

export interface AppsConfig {
    topology: Topology;
    size: number;
    dependencies?: Dependencies;
    logger: Logger;
}

export interface OrderedChartManager extends ChartManager {
    setIndex(index: number): void;
}

export interface ChartManager {
    name(): string;
    cfg(): Promise<ChartConfig>;
    values(): Promise<any>;
}

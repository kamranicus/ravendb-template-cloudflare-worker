import { IDocumentSession } from "./Session/IDocumentSession";
import { IStoreAuthOptions } from "../Auth/AuthOptions";
import { SessionBeforeStoreEventArgs, SessionAfterSaveChangesEventArgs, SessionBeforeQueryEventArgs, SessionBeforeDeleteEventArgs, BeforeConversionToDocumentEventArgs, AfterConversionToDocumentEventArgs, BeforeConversionToEntityEventArgs, AfterConversionToEntityEventArgs, FailedRequestEventArgs, TopologyUpdatedEventArgs, BeforeRequestEventArgs, SucceedRequestEventArgs } from "./Session/SessionEvents";
import { IDisposable } from "../Types/Contracts";
import { MaintenanceOperationExecutor } from "./Operations/MaintenanceOperationExecutor";
import { OperationExecutor } from "./Operations/OperationExecutor";
import { RequestExecutor } from "../Http/RequestExecutor";
import { DocumentConventions } from "./Conventions/DocumentConventions";
import { InMemoryDocumentSessionOperations } from "./Session/InMemoryDocumentSessionOperations";
import { BulkInsertOperation, BulkInsertOptions } from "./BulkInsertOperation";
import { IDatabaseChanges } from "./Changes/IDatabaseChanges";
import { DocumentSubscriptions } from "./Subscriptions/DocumentSubscriptions";
import { SessionOptions } from "./Session/SessionOptions";
import { DatabaseSmuggler } from "./Smuggler/DatabaseSmuggler";
import { IAbstractIndexCreationTask } from "./Indexes/IAbstractIndexCreationTask";
import { TimeSeriesOperations } from "./TimeSeries/TimeSeriesOperations";
import { IHiLoIdGenerator } from "./Identity/IHiLoIdGenerator";
export interface SessionEventsProxy {
    addSessionListener(eventName: "failedRequest", eventHandler: (eventArgs: FailedRequestEventArgs) => void): this;
    addSessionListener(eventName: "beforeStore", eventHandler: (eventArgs: SessionBeforeStoreEventArgs) => void): this;
    addSessionListener(eventName: "afterSaveChanges", eventHandler: (eventArgs: SessionAfterSaveChangesEventArgs) => void): this;
    addSessionListener(eventName: "beforeQuery", eventHandler: (eventArgs: SessionBeforeQueryEventArgs) => void): this;
    addSessionListener(eventName: "beforeDelete", eventHandler: (eventArgs: SessionBeforeDeleteEventArgs) => void): this;
    addSessionListener(eventName: "beforeConversionToDocument", eventHandler: (eventArgs: BeforeConversionToDocumentEventArgs) => void): this;
    addSessionListener(eventName: "afterConversionToDocument", eventHandler: (eventArgs: AfterConversionToDocumentEventArgs) => void): this;
    addSessionListener(eventName: "beforeConversionToEntity", eventHandler: (eventArgs: BeforeConversionToEntityEventArgs) => void): this;
    addSessionListener(eventName: "afterConversionToEntity", eventHandler: (eventArgs: AfterConversionToEntityEventArgs) => void): this;
    removeSessionListener(eventName: "failedRequest", eventHandler: (eventArgs: FailedRequestEventArgs) => void): void;
    removeSessionListener(eventName: "beforeStore", eventHandler: (eventArgs: SessionBeforeStoreEventArgs) => void): void;
    removeSessionListener(eventName: "afterSaveChanges", eventHandler: (eventArgs: SessionAfterSaveChangesEventArgs) => void): void;
    removeSessionListener(eventName: "beforeQuery", eventHandler: (eventArgs: SessionBeforeQueryEventArgs) => void): void;
    removeSessionListener(eventName: "beforeDelete", eventHandler: (eventArgs: SessionBeforeDeleteEventArgs) => void): void;
    removeSessionListener(eventName: "beforeConversionToDocument", eventHandler: (eventArgs: BeforeConversionToDocumentEventArgs) => void): void;
    removeSessionListener(eventName: "afterConversionToDocument", eventHandler: (eventArgs: AfterConversionToDocumentEventArgs) => void): void;
    removeSessionListener(eventName: "beforeConversionToEntity", eventHandler: (eventArgs: BeforeConversionToEntityEventArgs) => void): void;
    removeSessionListener(eventName: "afterConversionToEntity", eventHandler: (eventArgs: AfterConversionToEntityEventArgs) => void): void;
}
export declare type DocumentStoreEvent = "beforeDispose" | "afterDispose";
export interface SessionCreatedEventArgs {
    session: InMemoryDocumentSessionOperations;
}
export interface SessionDisposingEventArgs {
    session: InMemoryDocumentSessionOperations;
}
export interface DocumentStoreEventEmitter {
    on(eventName: "beforeRequest", eventHandler: (args: BeforeRequestEventArgs) => void): this;
    on(eventName: "succeedRequest", eventHandler: (args: SucceedRequestEventArgs) => void): this;
    on(eventName: "failedRequest", eventHandler: (args: FailedRequestEventArgs) => void): this;
    on(eventName: "sessionCreated", eventHandler: (args: SessionCreatedEventArgs) => void): this;
    on(eventName: "beforeDispose", eventHandler: () => void): this;
    on(eventName: "afterDispose", eventHandler: (callback: () => void) => void): this;
    on(eventName: "executorsDisposed", eventHandler: (callback: () => void) => void): this;
    once(eventName: "beforeRequest", eventHandler: (args: BeforeRequestEventArgs) => void): this;
    once(eventName: "succeedRequest", eventHandler: (args: SucceedRequestEventArgs) => void): this;
    once(eventName: "failedRequest", eventHandler: (args: FailedRequestEventArgs) => void): this;
    once(eventName: "sessionCreated", eventHandler: (args: SessionCreatedEventArgs) => void): this;
    once(eventName: "beforeDispose", eventHandler: () => void): this;
    once(eventName: "afterDispose", eventHandler: (callback: () => void) => void): this;
    once(eventName: "executorsDisposed", eventHandler: (callback: () => void) => void): this;
    removeListener(eventName: "beforeRequest", eventHandler: (args: BeforeRequestEventArgs) => void): this;
    removeListener(eventName: "succeedRequest", eventHandler: (args: SucceedRequestEventArgs) => void): this;
    removeListener(eventName: "failedRequest", eventHandler: (args: FailedRequestEventArgs) => void): this;
    removeListener(eventName: "sessionCreated", eventHandler: (args: SessionCreatedEventArgs) => void): void;
    removeListener(eventName: "beforeDispose", eventHandler: () => void): void;
    removeListener(eventName: "afterDispose", eventHandler: (callback: () => void) => void): void;
    removeListener(eventName: "executorsDisposed", eventHandler: (callback: () => void) => void): void;
}
export interface IDocumentStore extends IDisposable, SessionEventsProxy, DocumentStoreEventEmitter {
    openSession(options: SessionOptions): IDocumentSession;
    openSession(database: string): IDocumentSession;
    openSession(): IDocumentSession;
    changes(): IDatabaseChanges;
    changes(database: string): IDatabaseChanges;
    changes(database: string, nodeTag: string): IDatabaseChanges;
    identifier: string;
    initialize(): IDocumentStore;
    executeIndex(task: IAbstractIndexCreationTask): Promise<void>;
    executeIndex(task: IAbstractIndexCreationTask, database: string): Promise<void>;
    executeIndexes(tasks: IAbstractIndexCreationTask[]): Promise<void>;
    executeIndexes(tasks: IAbstractIndexCreationTask[], database: string): Promise<void>;
    authOptions: IStoreAuthOptions;
    hiLoIdGenerator: IHiLoIdGenerator;
    timeSeries: TimeSeriesOperations;
    conventions: DocumentConventions;
    urls: string[];
    bulkInsert(): BulkInsertOperation;
    bulkInsert(database: string): BulkInsertOperation;
    bulkInsert(database: string, options: BulkInsertOptions): BulkInsertOperation;
    bulkInsert(options: BulkInsertOptions): BulkInsertOperation;
    subscriptions: DocumentSubscriptions;
    database: string;
    getRequestExecutor(databaseName?: string): RequestExecutor;
    maintenance: MaintenanceOperationExecutor;
    operations: OperationExecutor;
    smuggler: DatabaseSmuggler;
    requestTimeout(timeoutInMs: number): IDisposable;
    requestTimeout(timeoutInMs: number, database: string): IDisposable;
    addSessionListener(eventName: "sessionDisposing", eventHandler: (args: SessionDisposingEventArgs) => void): this;
    addSessionListener(eventName: "topologyUpdated", eventHandler: (args: TopologyUpdatedEventArgs) => void): this;
    addSessionListener(eventName: "succeedRequest", eventHandler: (args: SucceedRequestEventArgs) => void): this;
    addSessionListener(eventName: "beforeRequest", eventHandler: (args: BeforeRequestEventArgs) => void): this;
    addSessionListener(eventName: "failedRequest", eventHandler: (args: FailedRequestEventArgs) => void): this;
    addSessionListener(eventName: "beforeStore", eventHandler: (eventArgs: SessionBeforeStoreEventArgs) => void): this;
    addSessionListener(eventName: "afterSaveChanges", eventHandler: (eventArgs: SessionAfterSaveChangesEventArgs) => void): this;
    addSessionListener(eventName: "beforeQuery", eventHandler: (eventArgs: SessionBeforeQueryEventArgs) => void): this;
    addSessionListener(eventName: "beforeDelete", eventHandler: (eventArgs: SessionBeforeDeleteEventArgs) => void): this;
    addSessionListener(eventName: "beforeConversionToDocument", eventHandler: (eventArgs: BeforeConversionToDocumentEventArgs) => void): this;
    addSessionListener(eventName: "afterConversionToDocument", eventHandler: (eventArgs: AfterConversionToDocumentEventArgs) => void): this;
    addSessionListener(eventName: "beforeConversionToEntity", eventHandler: (eventArgs: BeforeConversionToEntityEventArgs) => void): this;
    addSessionListener(eventName: "afterConversionToEntity", eventHandler: (eventArgs: AfterConversionToEntityEventArgs) => void): this;
}

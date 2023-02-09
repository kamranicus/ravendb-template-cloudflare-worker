import { HttpResponse } from "../Primitives/Http";
export declare function printError(err: Error): string;
export declare function throwError(errName: RavenErrorType): never;
export declare function throwError(errName: RavenErrorType, message: string): never;
export declare function throwError(errName: RavenErrorType, message: string, errCause?: Error): never;
export declare function throwError(errName: RavenErrorType, message: string, errCause?: Error, info?: {
    [key: string]: any;
}): never;
export declare function getError(errName: RavenErrorType, message: string): Error;
export declare function getError(errName: string, message: string, errCause?: Error, info?: {
    [key: string]: any;
}): Error;
export declare function getError(errName: string, message: string, errCause?: Error): Error;
export declare type RavenErrorType = "RavenException" | "RavenTimeoutException" | "NotSupportedException" | "IndexCompactionInProgressException" | "InvalidOperationException" | "InvalidArgumentException" | "ErrorResponseException" | "DocumentDoesNotExistsException" | "NonUniqueObjectException" | "ConcurrencyException" | "ClusterTransactionConcurrencyException" | "InvalidNetworkTopologyException" | "ArgumentNullException" | "ArgumentOutOfRangeException" | "DatabaseDoesNotExistException" | "ClientVersionMismatchException" | "AuthorizationException" | "IndexDoesNotExistException" | "DatabaseLoadTimeoutException" | "AuthenticationException" | "BadRequestException" | "BulkInsertAbortedException" | "BulkInsertProtocolViolationException" | "IndexCompilationException" | "TransformerCompilationException" | "DocumentConflictException" | "DocumentDoesNotExistException" | "DocumentCollectionMismatchException" | "DocumentParseException" | "IndexInvalidException" | "IndexOrTransformerAlreadyExistException" | "JavaScriptException" | "JavaScriptParseException" | "SubscriptionClosedException" | "CompareExchangeKeyTooBigException" | "SubscriptionDoesNotBelongToNodeException" | "SubscriptionChangeVectorUpdateConcurrencyException" | "SubscriptionDoesNotExistException" | "SubscriptionConnectionDownException" | "SubscriptionInvalidStateException" | "SubscriptionMessageTypeException" | "SubscriptionException" | "SubscriberErrorException" | "SubscriptionInUseException" | "TransformerDoesNotExistException" | "VersioningDisabledException" | "TopologyNodeDownException" | "AllTopologyNodesDownException" | "BadResponseException" | "ChangeProcessingException" | "CommandExecutionException" | "NoLeaderException" | "CompilationException" | "ConflictException" | "DatabaseConcurrentLoadTimeoutException" | "DatabaseDisabledException" | "AnalyzerDoesNotExistException" | "AnalyzerCompilationException" | "DatabaseLoadFailureException" | "DatabaseNotFoundException" | "NotSupportedOsException" | "SecurityException" | "ServerLoadFailureException" | "UnsuccessfulRequestException" | "CriticalIndexingException" | "IndexAnalyzerException" | "IndexCorruptionException" | "IndexOpenException" | "IndexWriteException" | "IndexWriterCreationException" | "StorageException" | "StreamDisposedException" | "LowMemoryException" | "IncorrectDllException" | "DiskFullException" | "InvalidJournalFlushRequestException" | "QuotaException" | "VoronUnrecoverableErrorException" | "NonDurableFileSystemException" | "TimeoutException" | "AggregateException" | "OperationCanceledException" | "MappingError" | "UrlScrappingError" | "TestDriverTearDownError" | "FileNotFoundException" | "NotImplementedException" | "NodeIsPassiveException" | "ConfigurationException" | "CertificateNameMismatchException" | "BulkInsertStreamError" | "DatabaseSchemaErrorException" | "AttachmentDoesNotExistException" | "CounterOverflowException" | "SorterCompilationException" | "RequestedNodeUnavailableException" | "DatabaseIdleException" | "DatabaseRestoringException" | "PendingRollingIndexException" | "ReplicationHubNotFoundException" | "SubscriptionNameException" | "SorterDoesNotExistException" | "LicenseActivationException";
export interface ExceptionSchema {
    url: string;
    type: string;
    message: string;
    error: string;
}
export interface ExceptionDispatcherArgs {
    message: string;
    url: string;
    error?: string;
    type?: string;
}
export declare class ExceptionDispatcher {
    private static _jsonSerializer;
    static get(schema: ExceptionDispatcherArgs, code: number, inner?: Error): Error;
    static throwException(response: HttpResponse, body: string): void | never;
    private static _fillException;
    private static _getConflictError;
    private static _getType;
}

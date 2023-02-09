import { DetailedReplicationHubAccess } from "../../Documents/Operations/Replication/DetailedReplicationHubAccess";
export interface TcpConnectionHeaderMessage {
    databaseName: string;
    sourceNodeTag: string;
    serverId: string;
    operation: OperationTypes;
    operationVersion: number;
    info: string;
    authorizeInfo: AuthorizationInfo;
    replicationHubAccess: DetailedReplicationHubAccess;
}
export declare type OperationTypes = "None" | "Drop" | "Subscription" | "Replication" | "Cluster" | "Heartbeats" | "Ping" | "TestConnection";
export declare const NUMBER_OR_RETRIES_FOR_SENDING_TCP_HEADER = 2;
export declare const PING_BASE_LINE = -1;
export declare const NONE_BASE_LINE = -1;
export declare const DROP_BASE_LINE = -2;
export declare const HEARTBEATS_BASE_LINE = 20;
export declare const HEARTBEATS_41200 = 41200;
export declare const HEARTBEATS_42000 = 42000;
export declare const SUBSCRIPTION_BASE_LINE = 40;
export declare const SUBSCRIPTION_INCLUDES = 41400;
export declare const SUBSCRIPTION_COUNTER_INCLUDES = 50000;
export declare const SUBSCRIPTION_TIME_SERIES_INCLUDES = 51000;
export declare const TEST_CONNECTION_BASE_LINE = 50;
export declare const HEARTBEATS_TCP_VERSION = 42000;
export declare const SUBSCRIPTION_TCP_VERSION = 51000;
export declare const TEST_CONNECTION_TCP_VERSION = 50;
export declare class PingFeatures {
    baseLine: boolean;
}
export declare class NoneFeatures {
    baseLine: boolean;
}
export declare class DropFeatures {
    baseLine: boolean;
}
export declare class SubscriptionFeatures {
    baseLine: boolean;
    includes: boolean;
    counterIncludes: boolean;
    timeSeriesIncludes: boolean;
}
export declare class HeartbeatsFeatures {
    baseLine: boolean;
    sendChangesOnly: boolean;
    includeServerInfo: boolean;
}
export declare class TestConnectionFeatures {
    baseLine: boolean;
}
export declare class SupportedFeatures {
    readonly protocolVersion: number;
    constructor(version: number);
    ping: PingFeatures;
    none: NoneFeatures;
    drop: DropFeatures;
    subscription: SubscriptionFeatures;
    heartbeats: HeartbeatsFeatures;
    testConnection: TestConnectionFeatures;
}
export declare type SupportedStatus = "OutOfRange" | "NotSupported" | "Supported";
export declare function operationVersionSupported(operationType: OperationTypes, version: number, currentRef: (value: number) => void): SupportedStatus;
export declare function getOperationTcpVersion(operationType: OperationTypes, index: number): number;
export declare function getSupportedFeaturesFor(type: OperationTypes, protocolVersion: number): SupportedFeatures;
export declare class AuthorizationInfo {
    authorizeAs: AuthorizeMethod;
    authorizationFor: string;
}
export declare type AuthorizeMethod = "Server" | "PullReplication" | "PushReplication";

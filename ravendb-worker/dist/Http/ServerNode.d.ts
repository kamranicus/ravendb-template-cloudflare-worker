import { ClusterTopology } from "./ClusterTopology";
export declare type ServerNodeRole = "None" | "Promotable" | "Member" | "Rehab";
export declare class ServerNode {
    database: string;
    url: string;
    clusterTag?: string;
    serverRole: ServerNodeRole;
    supportsAtomicClusterWrites: boolean;
    private _lastServerVersionCheck;
    private _lastServerVersion;
    constructor(opts?: {
        database?: string;
        url?: string;
        clusterTag?: string;
    });
    shouldUpdateServerVersion(): boolean;
    updateServerVersion(serverVersion: string): void;
    discardServerVersion(): void;
    static createFrom(topology: ClusterTopology): ServerNode[];
    get lastServerVersion(): string;
    get isSecure(): boolean;
    fromJson(json: object): void;
    static fromJson(json: object): ServerNode;
}

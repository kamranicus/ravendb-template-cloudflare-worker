import { LocalSettings } from "../Backups/LocalSettings";
import { S3Settings } from "../Backups/S3Settings";
import { AzureSettings } from "../Backups/AzureSettings";
import { GlacierSettings } from "../Backups/GlacierSettings";
import { GoogleCloudSettings } from "../Backups/GoogleCloudSettings";
import { FtpSettings } from "../Backups/FtpSettings";
export declare type ConnectionStringType = "None" | "Raven" | "Sql" | "Olap";
export declare abstract class ConnectionString {
    name: string;
    abstract type: ConnectionStringType;
}
export declare class RavenConnectionString extends ConnectionString {
    database: string;
    topologyDiscoveryUrls: string[];
    type: ConnectionStringType;
}
export declare class SqlConnectionString extends ConnectionString {
    connectionString: string;
    factoryName: string;
    type: ConnectionStringType;
}
export declare class OlapConnectionString extends ConnectionString {
    localSettings: LocalSettings;
    s3Settings: S3Settings;
    azureSettings: AzureSettings;
    glacierSettings: GlacierSettings;
    googleCloudSettings: GoogleCloudSettings;
    ftpSettings: FtpSettings;
    type: ConnectionStringType;
}
export declare type EtlType = "Raven" | "Sql" | "Olap";

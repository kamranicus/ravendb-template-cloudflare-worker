/// <reference types="node" />
import { Socket } from "net";
import { IAuthOptions } from "../Auth/AuthOptions";
import { TcpConnectionInfo } from "../ServerWide/Commands/GetTcpInfoCommand";
import { OperationTypes, SupportedFeatures } from "../ServerWide/Tcp/TcpConnectionHeaderMessage";
export declare class TcpUtils {
    static connect(urlString: string, serverCertificate: string, clientCertificate: IAuthOptions): Promise<Socket>;
    static connectSecuredTcpSocket(info: TcpConnectionInfo, serverCertificate: string, clientCertificate: IAuthOptions, operationType: OperationTypes, negotiationCallback: NegotiationCallback): Promise<ConnectSecuredTcpSocketResult>;
    private static _invokeNegotiation;
}
declare type NegotiationCallback = (url: string, info: TcpConnectionInfo, socket: Socket) => Promise<SupportedFeatures>;
export declare class ConnectSecuredTcpSocketResult {
    url: string;
    socket: Socket;
    supportedFeatures: SupportedFeatures;
    constructor(url: string, socket: Socket, supportedFeatures: SupportedFeatures);
}
export {};

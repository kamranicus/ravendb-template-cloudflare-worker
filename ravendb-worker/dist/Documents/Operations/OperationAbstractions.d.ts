import { RavenCommand } from "../../Http/RavenCommand";
import { IDocumentStore } from "../../Documents/IDocumentStore";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { HttpCache } from "../../Http/HttpCache";
export declare type OperationResultType = "OperationId" | "CommandResult" | "PatchResult";
export interface IAbstractOperation {
    resultType: OperationResultType;
}
export interface IOperation<TResult> extends IAbstractOperation {
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<TResult>;
}
export interface IAwaitableOperation extends IOperation<OperationIdResult> {
}
export interface IMaintenanceOperation<TResult> extends IAbstractOperation {
    getCommand(conventions: DocumentConventions): RavenCommand<TResult>;
}
export interface IServerOperation<TResult> extends IAbstractOperation {
    getCommand(conventions: DocumentConventions): RavenCommand<TResult>;
}
export declare abstract class AbstractAwaitableOperation {
    get resultType(): OperationResultType;
}
export declare class AwaitableServerOperation extends AbstractAwaitableOperation implements IServerOperation<OperationIdResult> {
    getCommand(conventions: DocumentConventions): RavenCommand<OperationIdResult>;
}
export declare class AwaitableMaintenanceOperation extends AbstractAwaitableOperation implements IMaintenanceOperation<OperationIdResult> {
    getCommand(conventions: DocumentConventions): RavenCommand<OperationIdResult>;
}
export declare class AwaitableOperation extends AbstractAwaitableOperation implements IOperation<OperationIdResult> {
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<OperationIdResult>;
}
export interface OperationIdResult {
    operationId: number;
    operationNodeTag: string;
}
export declare class OperationExceptionResult {
    type: string;
    message: string;
    error: string;
    statusCode: number;
}

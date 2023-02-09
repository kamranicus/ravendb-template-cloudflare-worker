import * as BluebirdPromise from "bluebird";
export interface IDefer<TResult> {
    resolve: (value: TResult) => void;
    reject: (error: any) => void;
    promise: BluebirdPromise<TResult>;
}
export declare function raceToResolution<TResult>(promises: BluebirdPromise<TResult>[], onErrorCallback?: (err: any) => void): BluebirdPromise<TResult>;
export declare function defer<T>(): IDefer<T>;
export declare function delay(ms: number): Promise<unknown>;
export declare function timeout(ms: number): Promise<unknown>;
export declare class AsyncTimeout {
    get promise(): Promise<void>;
    get timedOut(): boolean;
    private _timedOut;
    private _timer;
    private _promise;
    private _op;
    private _resolve;
    private _reject;
    constructor(ms: number, op?: string);
    private _getTimeoutError;
    cancel(): void;
}
export declare type PromiseStatus = "PENDING" | "RESOLVED" | "REJECTED";
export declare class PromiseStatusTracker<T> {
    private _status;
    private _promise;
    constructor(promise: Promise<T>);
    static track<T>(promise: Promise<T>): PromiseStatusTracker<T>;
    isFullfilled(): boolean;
    isResolved(): boolean;
    isRejected(): boolean;
}

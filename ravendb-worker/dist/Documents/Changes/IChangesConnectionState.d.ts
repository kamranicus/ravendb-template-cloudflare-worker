import { IDisposable } from "../../Types/Contracts";
export interface IChangesConnectionState<T> extends IDisposable {
    inc(): void;
    dec(): void;
    error(e: Error): void;
    ensureSubscribedNow(): Promise<void>;
    addOnChangeNotification(type: ChangesType, handler: (value: T) => void): any;
    removeOnChangeNotification(type: ChangesType, handler: (value: T) => void): any;
    addOnError(handler: (value: Error) => void): any;
    removeOnError(handler: (value: Error) => void): any;
}
export declare type ChangesType = "Document" | "Index" | "Operation" | "Counter" | "TimeSeries";

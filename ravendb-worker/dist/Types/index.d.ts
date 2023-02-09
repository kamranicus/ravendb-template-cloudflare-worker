import { SuggestionResult } from "../Documents/Queries/Suggestions/SuggestionResult";
export interface EntitiesCollectionObject<TEntity> extends IRavenObject<TEntity | null> {
    [id: string]: TEntity | null;
}
export interface RevisionsCollectionObject<TEntity> extends IRavenObject<TEntity | null> {
    [changeVector: string]: TEntity | null;
}
export interface SuggestionsResponseObject {
    [fieldName: string]: SuggestionResult;
}
export interface IRavenObject<T = any> {
    [property: string]: T;
}
export interface IRavenArrayResult {
    results: any[];
}
export declare type CompareExchangeResultClass<T> = T extends object ? EntityConstructor<T> : unknown;
export interface ClassConstructor<T extends object = object> {
    name: string;
    new (...args: any[]): any;
}
export interface EntityConstructor<T extends object = object> {
    new (...args: any): T;
    name: string;
}
export declare type ObjectTypeDescriptor<T extends object = object> = EntityConstructor<T> | ObjectLiteralDescriptor<T>;
export declare abstract class EntityObjectLiteralDescriptor<T extends object> implements ObjectLiteralDescriptor {
    abstract name: string;
    abstract isType(obj: object): any;
    abstract construct(dto: object): T;
}
export interface ObjectLiteralDescriptor<TResult extends object = object> {
    name: string;
    isType(obj: object): boolean;
    construct(dto: object): TResult;
}
export declare abstract class PropsBasedObjectLiteralDescriptor<T extends object> implements EntityObjectLiteralDescriptor<T> {
    abstract name: string;
    abstract properties: string[];
    abstract construct(dto: object): T;
    isType(obj: object): boolean;
    private _hasProperties;
}
export declare type CapitalizeType<T> = {
    [K in keyof T & string as `${Capitalize<K>}`]: T[K];
};
export declare type Field<T> = keyof T & string | string;
export declare type ServerResponse<T> = T extends Date | string ? T : {
    [K in keyof T]: T[K] extends Date ? string : ServerResponse<T[K]>;
};

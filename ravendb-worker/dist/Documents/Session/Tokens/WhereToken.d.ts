import { ShapeToken } from "./ShapeToken";
import { QueryToken } from "./QueryToken";
import { SearchOperator } from "../../Queries/SearchOperator";
import { WhereOperator } from "./WhereOperator";
export declare type MethodsType = "CmpXchg";
export declare class WhereMethodCall {
    methodType: MethodsType;
    parameters: string[];
    property: string;
}
export interface WhereOptionsShapeRelatedParameters {
    shape: ShapeToken;
    distance: number;
}
export interface WhereOptionsSearchRelatedParameters {
    search: SearchOperator;
}
export interface WhereOptionsExactFromToRelatedParameters {
    exact: boolean;
    from?: string;
    to?: string;
}
export interface WhereOptionsMethodTypeRelatedParameters {
    methodType: MethodsType;
    parameters: string[];
    property: string;
    exact: boolean;
}
export declare type WhereOptionsParameters = WhereOptionsShapeRelatedParameters | WhereOptionsExactFromToRelatedParameters | WhereOptionsMethodTypeRelatedParameters | WhereOptionsSearchRelatedParameters;
export declare class WhereOptions {
    searchOperator: SearchOperator;
    fromParameterName: string;
    toParameterName: string;
    boost: number;
    fuzzy: number;
    proximity: number;
    exact: boolean;
    method: WhereMethodCall;
    whereShape: ShapeToken;
    distanceErrorPct: number;
    static defaultOptions(): WhereOptions;
    constructor(parameters?: WhereOptionsParameters);
}
export declare class WhereToken extends QueryToken {
    protected constructor();
    fieldName: string;
    whereOperator: WhereOperator;
    parameterName: string;
    options: WhereOptions;
    static create(op: WhereOperator, fieldName: string, parameterName: string): WhereToken;
    static create(op: WhereOperator, fieldName: string, parameterName: string, options: WhereOptions): WhereToken;
    addAlias(alias: string): WhereToken;
    private _writeMethod;
    writeTo(writer: any): void;
    private _writeInnerWhere;
    private _specialOperator;
}

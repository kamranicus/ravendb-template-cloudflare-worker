import { IDocumentQueryBase } from "./IDocumentQueryBase";
import { IQueryBase } from "./IQueryBase";
import { SearchOperator } from "../Queries/SearchOperator";
import { MethodCall } from "./MethodCall";
import { WhereParams } from "./WhereParams";
import { SpatialUnits, SpatialRelation } from "../Indexes/Spatial";
import { SpatialCriteria } from "../Queries/Spatial/SpatialCriteria";
import { SpatialCriteriaFactory } from "../Queries/Spatial/SpatialCriteriaFactory";
import { IDocumentQuery } from "./IDocumentQuery";
import { DynamicSpatialField } from "../Queries/Spatial/DynamicSpatialField";
import { MoreLikeThisBase } from "../Queries/MoreLikeThis/MoreLikeThisBase";
import { Field } from "../../Types";
export interface IFilterDocumentQueryBase<T extends object, TSelf extends IDocumentQueryBase<T, TSelf>> extends IQueryBase<T, TSelf> {
    not(): TSelf;
    andAlso(): TSelf;
    andAlso(wrapPreviousQueryClauses: boolean): TSelf;
    closeSubclause(): TSelf;
    containsAll(fieldName: Field<T>, values: any[]): TSelf;
    containsAny(fieldName: Field<T>, values: any[]): TSelf;
    negateNext(): TSelf;
    openSubclause(): TSelf;
    orElse(): TSelf;
    search(fieldName: Field<T>, searchTerms: string): TSelf;
    search(fieldName: Field<T>, searchTerms: string, operator: SearchOperator): TSelf;
    whereLucene(fieldName: Field<T>, whereClause: string): TSelf;
    whereLucene(fieldName: Field<T>, whereClause: string, exact: boolean): TSelf;
    whereBetween(fieldName: Field<T>, start: any, end: any): TSelf;
    whereBetween(fieldName: Field<T>, start: any, end: any, exact: boolean): TSelf;
    whereEndsWith(fieldName: Field<T>, value: any): TSelf;
    whereEndsWith(fieldName: Field<T>, value: any, exact: boolean): TSelf;
    whereEquals(fieldName: Field<T>, value: any): TSelf;
    whereEquals(fieldName: Field<T>, value: any, exact: boolean): TSelf;
    whereEquals(fieldName: Field<T>, method: MethodCall): TSelf;
    whereEquals(fieldName: Field<T>, method: MethodCall, exact: boolean): TSelf;
    whereEquals(whereParams: WhereParams): TSelf;
    whereNotEquals(fieldName: Field<T>, value: any): TSelf;
    whereNotEquals(fieldName: Field<T>, value: any, exact: boolean): TSelf;
    whereNotEquals(fieldName: Field<T>, method: MethodCall): TSelf;
    whereNotEquals(fieldName: Field<T>, method: MethodCall, exact: boolean): TSelf;
    whereNotEquals(whereParams: WhereParams): TSelf;
    whereGreaterThan(fieldName: Field<T>, value: any): TSelf;
    whereGreaterThan(fieldName: Field<T>, value: any, exact: boolean): TSelf;
    whereGreaterThanOrEqual(fieldName: Field<T>, value: any): TSelf;
    whereGreaterThanOrEqual(fieldName: Field<T>, value: any, exact: boolean): TSelf;
    whereIn(fieldName: Field<T>, values: any[]): TSelf;
    whereIn(fieldName: Field<T>, values: any[], exact: boolean): TSelf;
    whereLessThan(fieldName: Field<T>, value: any): TSelf;
    whereLessThan(fieldName: Field<T>, value: any, exact: boolean): TSelf;
    whereLessThanOrEqual(fieldName: Field<T>, value: any): TSelf;
    whereLessThanOrEqual(fieldName: Field<T>, value: any, exact: boolean): TSelf;
    whereStartsWith(fieldName: Field<T>, value: any): TSelf;
    whereStartsWith(fieldName: Field<T>, value: any, exact: boolean): TSelf;
    whereExists(fieldName: Field<T>): TSelf;
    whereRegex(fieldName: Field<T>, pattern: string): TSelf;
    withinRadiusOf(fieldName: Field<T>, radius: number, latitude: number, longitude: number): TSelf;
    withinRadiusOf(fieldName: Field<T>, radius: number, latitude: number, longitude: number, radiusUnits: SpatialUnits): TSelf;
    withinRadiusOf(fieldName: Field<T>, radius: number, latitude: number, longitude: number, radiusUnits: SpatialUnits, distanceErrorPct: number): TSelf;
    relatesToShape(fieldName: Field<T>, shapeWkt: string, relation: SpatialRelation): TSelf;
    relatesToShape(fieldName: Field<T>, shapeWkt: string, relation: SpatialRelation, distanceErrorPct: number): TSelf;
    relatesToShape(fieldName: Field<T>, shapeWkt: string, relation: SpatialRelation, units: SpatialUnits, distanceErrorPct: number): TSelf;
    spatial(fieldName: Field<T>, clause: (spatialCriteriaFactory: SpatialCriteriaFactory) => SpatialCriteria): IDocumentQuery<T>;
    spatial(field: DynamicSpatialField, clause: (spatialCriteriaFactory: SpatialCriteriaFactory) => SpatialCriteria): IDocumentQuery<T>;
    moreLikeThis(moreLikeThis: MoreLikeThisBase): IDocumentQuery<T>;
}

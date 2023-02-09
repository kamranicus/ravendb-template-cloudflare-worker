import { FieldIndexing, FieldStorage, FieldTermVector } from "./Enums";
import { MetadataObject } from "../Session/MetadataObject";
import { AttachmentName, IAttachmentObject } from "../Attachments";
import { CapitalizeType } from "../../Types";
export declare type IndexingMapDefinition<TInput, TOutput> = (document: TInput) => TOutput | TOutput[];
export declare type IndexingReduceDefinition<TItem> = (result: IndexingGroupResults<TItem>) => IndexingMapReduceFormatter<TItem>;
declare type KeySelector<TDocument, TKey> = (document: TDocument) => TKey;
export interface CreateFieldOptions {
    storage?: boolean;
    indexing?: FieldIndexing;
    termVector?: FieldTermVector;
}
export interface IndexingMapUtils {
    load<T = any>(documentId: string, collection: string): T;
    cmpxchg<T = any>(key: string): T;
    getMetadata(document: any): MetadataObject;
    id(document: any): string;
    createSpatialField(wkt: string): SpatialField;
    createSpatialField(lat: number, lng: number): SpatialField;
    createField(name: string, value: any, options: CreateFieldOptions): void;
    attachmentsFor(document: any): CapitalizeType<AttachmentName>[];
    loadAttachment(document: any, attachmentName: string): IAttachmentObject;
    noTracking: NoTrackingUtils;
}
export interface NoTrackingUtils {
    load<T = any>(documentId: string, collection: string): T;
}
export declare class StubMapUtils<T> implements IndexingMapUtils {
    load: <T>(documentId: string, collection: string) => T;
    cmpxchg: <T = any>(key: string) => T;
    getMetadata: (document: any) => MetadataObject;
    id: (document: any) => string;
    createSpatialField: (wktOrLat: string | number, lng?: number) => void;
    createField: (name: string, value: any, options?: CreateFieldOptions) => void;
    attachmentsFor: (document: any) => CapitalizeType<AttachmentName>[];
    loadAttachment: (document: any, attachmentName: string) => IAttachmentObject;
    noTracking: NoTrackingUtils;
}
interface Group<TDocument, TKey> {
    key: TKey;
    values: TDocument[];
}
export declare class IndexingGroupResults<TDocument> {
    groupBy<TKey>(selector: KeySelector<TDocument, TKey>): TKey extends void ? never : IndexingReduceResults<TDocument, TKey>;
}
export declare class IndexingReduceResults<TDocument, TKey> {
    private _group;
    constructor(selector: KeySelector<TDocument, TKey>);
    aggregate(reducer: IndexingMapDefinition<Group<TDocument, TKey>, TDocument>): IndexingMapReduceFormatter<TDocument>;
}
export declare class IndexingMapReduceFormatter<TDocument> {
    private _groupBy;
    private _aggregate;
    constructor(groupBy: KeySelector<TDocument, any>, aggregate: IndexingMapDefinition<Group<TDocument, any>, any>);
    format(): string;
}
export declare type CreatedFieldOptions = {
    storage?: FieldStorage | boolean;
    indexing?: FieldIndexing;
    termVector?: FieldTermVector;
};
export declare type CreatedField = {
    $value: any;
    $name: string;
    $options: CreatedFieldOptions;
};
export declare type SpatialField = void;
export {};

import { AbstractIndexCreationTaskBase } from "./AbstractIndexCreationTaskBase";
import { FieldStorage, FieldIndexing, FieldTermVector } from "./Enums";
import { SpatialOptions, SpatialOptionsFactory } from "./Spatial";
import { IndexDefinition } from "./IndexDefinition";
import { AdditionalAssembly } from "./AdditionalAssembly";
declare type FieldOrAllFields<TField> = TField | "__all_fields";
export declare abstract class AbstractGenericIndexCreationTask<TField extends string = string> extends AbstractIndexCreationTaskBase<IndexDefinition> {
    protected storesStrings: Record<FieldOrAllFields<TField>, FieldStorage>;
    protected indexesStrings: Record<FieldOrAllFields<TField>, FieldIndexing>;
    protected analyzersStrings: Record<FieldOrAllFields<TField>, string>;
    protected indexSuggestions: Set<FieldOrAllFields<TField>>;
    protected termVectorsStrings: Record<FieldOrAllFields<TField>, FieldTermVector>;
    protected spatialOptionsStrings: Record<FieldOrAllFields<TField>, SpatialOptions>;
    protected outputReduceToCollection: string;
    protected patternForOutputReduceToCollectionReferences: string;
    protected patternReferencesCollectionName: string;
    constructor();
    abstract get isMapReduce(): boolean;
    protected index(field: FieldOrAllFields<TField>, indexing: FieldIndexing): void;
    protected spatial(field: FieldOrAllFields<TField>, indexing: (spatialOptsFactory: SpatialOptionsFactory) => SpatialOptions): void;
    protected storeAllFields(storage: FieldStorage): void;
    protected store(field: TField, storage: FieldStorage): void;
    protected analyze(field: FieldOrAllFields<TField>, analyzer: string): void;
    protected termVector(field: FieldOrAllFields<TField>, termVector: FieldTermVector): void;
    protected suggestion(field: FieldOrAllFields<TField>): void;
    protected addAssembly(assembly: AdditionalAssembly): void;
}
export {};

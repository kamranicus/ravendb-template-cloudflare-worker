import { InMemoryDocumentSessionOperations } from "../InMemoryDocumentSessionOperations";
import { IndexQuery } from "../../Queries/IndexQuery";
import { QueryResult } from "../../Queries/QueryResult";
import { FieldsToFetchToken } from "../Tokens/FieldsToFetchToken";
import { Stopwatch } from "../../../Utility/Stopwatch";
import { QueryCommand } from "../../Commands/QueryCommand";
import { DocumentType } from "../../DocumentAbstractions";
export declare class QueryOperation {
    private readonly _session;
    private readonly _indexName;
    private readonly _indexQuery;
    private readonly _metadataOnly;
    private readonly _indexEntriesOnly;
    private readonly _isProjectInto;
    private _currentQueryResults;
    private readonly _fieldsToFetch;
    private _sp;
    private _noTracking;
    constructor(session: InMemoryDocumentSessionOperations, indexName: string, indexQuery: IndexQuery, fieldsToFetch: FieldsToFetchToken, disableEntitiesTracking: boolean, metadataOnly: boolean, indexEntriesOnly: boolean, isProjectInto: boolean);
    createRequest(): QueryCommand;
    getCurrentQueryResults(): QueryResult;
    setResult(queryResult: QueryResult): void;
    private _assertPageSizeSet;
    private _startTiming;
    logQuery(): void;
    complete<T extends object>(documentType?: DocumentType<T>): T[];
    private _completeInternal;
    static deserialize<T extends object>(id: string, document: object, metadata: object, fieldsToFetch: FieldsToFetchToken, disableEntitiesTracking: boolean, session: InMemoryDocumentSessionOperations, clazz?: DocumentType<T>, isProjectInto?: boolean, timeSeriesFields?: string[]): any;
    private static _detectTimeSeriesResultType;
    private static _reviveTimeSeriesAggregationResult;
    private static _reviveTimeSeriesRawResult;
    get noTracking(): boolean;
    set noTracking(value: boolean);
    ensureIsAcceptableAndSaveResult(result: QueryResult, duration: number): void;
    private _saveQueryResult;
    static ensureIsAcceptable(result: QueryResult, waitForNonStaleResults: boolean, duration: Stopwatch | number, session: InMemoryDocumentSessionOperations): void;
    get indexQuery(): IndexQuery;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSeriesBatchOperation = void 0;
const Exceptions_1 = require("../../../Exceptions");
const RavenCommand_1 = require("../../../Http/RavenCommand");
class TimeSeriesBatchOperation {
    constructor(documentId, operation) {
        if (!documentId) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Document id cannot be null");
        }
        if (!operation) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Operation cannot be null");
        }
        this._documentId = documentId;
        this._operation = operation;
    }
    get resultType() {
        return "CommandResult";
    }
    getCommand(store, conventions, httpCache) {
        return new TimeSeriesBatchCommand(this._documentId, this._operation, conventions);
    }
}
exports.TimeSeriesBatchOperation = TimeSeriesBatchOperation;
class TimeSeriesBatchCommand extends RavenCommand_1.RavenCommand {
    constructor(documentId, operation, conventions) {
        super();
        this._documentId = documentId;
        this._operation = operation;
        this._conventions = conventions;
    }
    createRequest(node) {
        const uri = node.url + "/databases/" + node.database + "/timeseries?docId=" + this._urlEncode(this._documentId);
        const payload = this._operation.serialize(this._conventions);
        const body = this._serializer.serialize(payload);
        return {
            method: "POST",
            uri,
            body,
            headers: this._headers().typeAppJson().build()
        };
    }
    get isReadRequest() {
        return false;
    }
}

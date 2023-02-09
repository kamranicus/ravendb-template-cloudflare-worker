"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAttachmentCommand = exports.DeleteAttachmentOperation = void 0;
const StringUtil_1 = require("../../../Utility/StringUtil");
const Exceptions_1 = require("../../../Exceptions");
const RavenCommand_1 = require("../../../Http/RavenCommand");
class DeleteAttachmentOperation {
    constructor(documentId, name, changeVector) {
        this._documentId = documentId;
        this._name = name;
        this._changeVector = changeVector;
    }
    get resultType() {
        return "CommandResult";
    }
    getCommand(store, conventions, httpCache) {
        return new DeleteAttachmentCommand(this._documentId, this._name, this._changeVector);
    }
}
exports.DeleteAttachmentOperation = DeleteAttachmentOperation;
class DeleteAttachmentCommand extends RavenCommand_1.RavenCommand {
    constructor(documentId, name, changeVector) {
        super();
        if (StringUtil_1.StringUtil.isNullOrWhitespace(documentId)) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "DocumentId cannot be null or empty");
        }
        if (StringUtil_1.StringUtil.isNullOrWhitespace(name)) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Name cannot be null or empty");
        }
        this._documentId = documentId;
        this._name = name;
        this._changeVector = changeVector;
    }
    get isReadRequest() {
        return false;
    }
    createRequest(node) {
        const uri = node.url + "/databases/" + node.database
            + "/attachments?id=" + encodeURIComponent(this._documentId)
            + "&name=" + encodeURIComponent(this._name);
        const req = {
            uri,
            method: "DELETE"
        };
        this._addChangeVectorIfNotNull(this._changeVector, req);
        return req;
    }
}
exports.DeleteAttachmentCommand = DeleteAttachmentCommand;

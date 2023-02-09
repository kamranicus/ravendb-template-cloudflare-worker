"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsToRunOnSuccess = exports.SaveChangesData = exports.PutCommandDataWithJson = exports.PutCommandDataBase = exports.DeleteCommandData = void 0;
const Exceptions_1 = require("../../Exceptions");
const SessionEvents_1 = require("../Session/SessionEvents");
class DeleteCommandData {
    constructor(id, changeVector, originalChangeVector) {
        this.id = id;
        if (!id) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Id cannot be null or undefined.");
        }
        this.changeVector = changeVector;
        this.originalChangeVector = originalChangeVector;
    }
    get type() {
        return "DELETE";
    }
    serialize(conventions) {
        const result = {
            Id: this.id,
            ChangeVector: this.changeVector,
            Type: "DELETE",
            Document: this.document
        };
        if (this.originalChangeVector) {
            result.OriginalChangeVector = this.originalChangeVector;
        }
        this._serializeExtraFields(result);
        return result;
    }
    onBeforeSaveChanges(session) {
        session.emit("beforeDelete", new SessionEvents_1.SessionBeforeDeleteEventArgs(session, this.id, null));
    }
    _serializeExtraFields(resultingObject) { }
}
exports.DeleteCommandData = DeleteCommandData;
class PutCommandDataBase {
    constructor(id, changeVector, originalChangeVector, document, strategy = "None") {
        this.name = null;
        if (!document) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Document cannot be null or undefined.");
        }
        this.id = id;
        this.changeVector = changeVector;
        this.originalChangeVector = originalChangeVector;
        this._document = document;
        this.forceRevisionCreationStrategy = strategy;
    }
    get type() {
        return "PUT";
    }
    serialize(conventions) {
        const result = {
            Id: this.id,
            ChangeVector: this.changeVector,
            OriginalChangeVector: this.originalChangeVector,
            Document: this._document,
            Type: "PUT"
        };
        if (this.forceRevisionCreationStrategy !== "None") {
            result["ForceRevisionCreationStrategy"] = this.forceRevisionCreationStrategy;
        }
        return result;
    }
}
exports.PutCommandDataBase = PutCommandDataBase;
class PutCommandDataWithJson extends PutCommandDataBase {
    constructor(id, changeVector, originalChangeVector, document, strategy) {
        super(id, changeVector, originalChangeVector, document, strategy);
    }
}
exports.PutCommandDataWithJson = PutCommandDataWithJson;
class SaveChangesData {
    constructor(args) {
        this.sessionCommands = [];
        this.entities = [];
        this.deferredCommands = args.deferredCommands;
        this.deferredCommandsMap = args.deferredCommandsMap;
        this.options = args.options;
        this.onSuccess = new ActionsToRunOnSuccess(args.session);
    }
}
exports.SaveChangesData = SaveChangesData;
class ActionsToRunOnSuccess {
    constructor(session) {
        this._documentsByIdToRemove = [];
        this._documentsByEntityToRemove = [];
        this._documentInfosToUpdate = [];
        this._session = session;
    }
    removeDocumentById(id) {
        this._documentsByIdToRemove.push(id);
    }
    removeDocumentByEntity(entity) {
        this._documentsByEntityToRemove.push(entity);
    }
    updateEntityDocumentInfo(documentInfo, document) {
        this._documentInfosToUpdate.push([documentInfo, document]);
    }
    clearSessionStateAfterSuccessfulSaveChanges() {
        for (const id of this._documentsByIdToRemove) {
            this._session.documentsById.remove(id);
        }
        for (const entity of this._documentsByEntityToRemove) {
            this._session.documentsByEntity.remove(entity);
        }
        for (const [info, document] of this._documentInfosToUpdate) {
            info.newDocument = false;
            info.document = document;
        }
        if (this._clearDeletedEntities) {
            this._session.deletedEntities.clear();
        }
        this._session.deferredCommands.length = 0;
        this._session.deferredCommandsMap.clear();
    }
    clearDeletedEntities() {
        this._clearDeletedEntities = true;
    }
}
exports.ActionsToRunOnSuccess = ActionsToRunOnSuccess;

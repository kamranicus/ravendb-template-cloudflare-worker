"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterTransactionOperationsBase = exports.StoredCompareExchange = void 0;
const Exceptions_1 = require("../../Exceptions");
const TypeUtil_1 = require("../../Utility/TypeUtil");
const CaseInsensitiveKeysMap_1 = require("../../Primitives/CaseInsensitiveKeysMap");
const CompareExchangeSessionValue_1 = require("../Operations/CompareExchange/CompareExchangeSessionValue");
const CompareExchangeValueResultParser_1 = require("../Operations/CompareExchange/CompareExchangeValueResultParser");
const GetCompareExchangeValueOperation_1 = require("../Operations/CompareExchange/GetCompareExchangeValueOperation");
const GetCompareExchangeValuesOperation_1 = require("../Operations/CompareExchange/GetCompareExchangeValuesOperation");
class StoredCompareExchange {
    constructor(index, entity) {
        this.entity = entity;
        this.index = index;
    }
}
exports.StoredCompareExchange = StoredCompareExchange;
class ClusterTransactionOperationsBase {
    constructor(session) {
        this._state = CaseInsensitiveKeysMap_1.CaseInsensitiveKeysMap.create();
        if (session.transactionMode !== "ClusterWide") {
            (0, Exceptions_1.throwError)("InvalidOperationException", "This function is part of cluster transaction session, "
                + "in order to use it you have to open the Session with ClusterWide option.");
        }
        this._session = session;
    }
    get numberOfTrackedCompareExchangeValues() {
        return this._state.size;
    }
    get session() {
        return this._session;
    }
    isTracked(key) {
        return this._tryGetCompareExchangeValueFromSession(key, TypeUtil_1.TypeUtil.NOOP);
    }
    createCompareExchangeValue(key, item) {
        if (!key) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Key cannot be null");
        }
        let sessionValue;
        if (!this._tryGetCompareExchangeValueFromSession(key, x => sessionValue = x)) {
            sessionValue = new CompareExchangeSessionValue_1.CompareExchangeSessionValue(key, 0, "None");
            this._state.set(key, sessionValue);
        }
        return sessionValue.create(item);
    }
    deleteCompareExchangeValue(keyOrItem, index) {
        if (!TypeUtil_1.TypeUtil.isString(keyOrItem)) {
            return this.deleteCompareExchangeValue(keyOrItem.key, keyOrItem.index);
        }
        const key = keyOrItem;
        let sessionValue;
        if (!this._tryGetCompareExchangeValueFromSession(key, s => sessionValue = s)) {
            sessionValue = new CompareExchangeSessionValue_1.CompareExchangeSessionValue(key, 0, "None");
            this._state.set(key, sessionValue);
        }
        sessionValue.delete(index);
    }
    clear() {
        this._state.clear();
    }
    _getCompareExchangeValueInternal(key, clazz) {
        return __awaiter(this, void 0, void 0, function* () {
            let notTracked;
            const v = this.getCompareExchangeValueFromSessionInternal(key, t => notTracked = t, clazz);
            if (!notTracked) {
                return v;
            }
            this.session.incrementRequestCount();
            const value = yield this.session.operations.send(new GetCompareExchangeValueOperation_1.GetCompareExchangeValueOperation(key, null, false));
            if (TypeUtil_1.TypeUtil.isNullOrUndefined(value)) {
                this.registerMissingCompareExchangeValue(key);
                return null;
            }
            const sessionValue = this.registerCompareExchangeValue(value);
            if (sessionValue) {
                return sessionValue.getValue(clazz, this.session.conventions);
            }
            return null;
        });
    }
    _getCompareExchangeValuesInternal(startsWithOrKeys, clazz, start, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            if (TypeUtil_1.TypeUtil.isString(startsWithOrKeys)) {
                this.session.incrementRequestCount();
                const values = yield this.session.operations.send(new GetCompareExchangeValuesOperation_1.GetCompareExchangeValuesOperation({
                    startWith: startsWithOrKeys,
                    start,
                    pageSize,
                    clazz
                }), this.session.sessionInfo);
                const results = {};
                for (const [key, value] of Object.entries(values)) {
                    if (TypeUtil_1.TypeUtil.isNullOrUndefined(value)) {
                        this.registerMissingCompareExchangeValue(key);
                        results[key] = null;
                        continue;
                    }
                    const sessionValue = this.registerCompareExchangeValue(value);
                    results[key] = sessionValue.getValue(clazz, this.session.conventions);
                }
                return results;
            }
            else {
                let notTrackedKeys;
                const results = this.getCompareExchangeValuesFromSessionInternal(startsWithOrKeys, x => notTrackedKeys = x, clazz);
                if (!notTrackedKeys || !notTrackedKeys.size) {
                    return results;
                }
                this._session.incrementRequestCount();
                const keysArray = Array.from(notTrackedKeys);
                const values = yield this.session.operations.send(new GetCompareExchangeValuesOperation_1.GetCompareExchangeValuesOperation({
                    keys: keysArray,
                    clazz
                }), this.session.sessionInfo);
                for (const key of keysArray) {
                    const value = values[key];
                    if (!value) {
                        this.registerMissingCompareExchangeValue(key);
                        results[key] = null;
                        continue;
                    }
                    const sessionValue = this.registerCompareExchangeValue(value);
                    results[value.key] = sessionValue.getValue(clazz, this.session.conventions);
                }
                return results;
            }
        });
    }
    getCompareExchangeValueFromSessionInternal(key, notTracked, clazz) {
        let sessionValue;
        if (this._tryGetCompareExchangeValueFromSession(key, s => sessionValue = s)) {
            notTracked(false);
            return sessionValue.getValue(clazz, this.session.conventions);
        }
        notTracked(true);
        return null;
    }
    getCompareExchangeValuesFromSessionInternal(keys, notTrackedKeysSetter, clazz) {
        let noTrackedKeys;
        const results = {};
        if (!keys || !keys.length) {
            notTrackedKeysSetter(null);
            return {};
        }
        for (const key of keys) {
            let sessionValue;
            if (this._tryGetCompareExchangeValueFromSession(key, s => sessionValue = s)) {
                results[key] = sessionValue.getValue(clazz, this.session.conventions);
                continue;
            }
            if (!noTrackedKeys) {
                noTrackedKeys = new Set();
            }
            noTrackedKeys.add(key);
        }
        notTrackedKeysSetter(noTrackedKeys);
        return results;
    }
    registerMissingCompareExchangeValue(key) {
        const value = new CompareExchangeSessionValue_1.CompareExchangeSessionValue(key, -1, "Missing");
        if (this.session.noTracking) {
            return value;
        }
        this._state.set(key, value);
        return value;
    }
    registerCompareExchangeValues(values) {
        if (this.session.noTracking) {
            return;
        }
        if (values) {
            for (const [key, value] of Object.entries(values)) {
                this.registerCompareExchangeValue(CompareExchangeValueResultParser_1.CompareExchangeValueResultParser.getSingleValue(value, false, this.session.conventions, null));
            }
        }
    }
    registerCompareExchangeValue(value) {
        if (this.session.noTracking) {
            return new CompareExchangeSessionValue_1.CompareExchangeSessionValue(value);
        }
        let sessionValue = this._state.get(value.key);
        if (!sessionValue) {
            sessionValue = new CompareExchangeSessionValue_1.CompareExchangeSessionValue(value);
            this._state.set(value.key, sessionValue);
            return sessionValue;
        }
        sessionValue.updateValue(value, this.session.conventions.objectMapper);
        return sessionValue;
    }
    _tryGetCompareExchangeValueFromSession(key, valueSetter) {
        const value = this._state.get(key);
        valueSetter(value);
        return !TypeUtil_1.TypeUtil.isNullOrUndefined(value);
    }
    prepareCompareExchangeEntities(result) {
        if (!this._state.size) {
            return;
        }
        for (const [key, value] of this._state.entries()) {
            const command = value.getCommand(this.session.conventions);
            if (!command) {
                continue;
            }
            result.sessionCommands.push(command);
        }
    }
    updateState(key, index) {
        let sessionValue;
        if (!this._tryGetCompareExchangeValueFromSession(key, x => sessionValue = x)) {
            return;
        }
        sessionValue.updateState(index);
    }
}
exports.ClusterTransactionOperationsBase = ClusterTransactionOperationsBase;

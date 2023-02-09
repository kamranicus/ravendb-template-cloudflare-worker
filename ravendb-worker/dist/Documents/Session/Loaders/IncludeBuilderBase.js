"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncludeBuilderBase = void 0;
const StringUtil_1 = require("../../../Utility/StringUtil");
const Exceptions_1 = require("../../../Exceptions");
const CaseInsensitiveKeysMap_1 = require("../../../Primitives/CaseInsensitiveKeysMap");
const CaseInsensitiveStringSet_1 = require("../../../Primitives/CaseInsensitiveStringSet");
const Constants_1 = require("../../../Constants");
class IncludeBuilderBase {
    constructor(conventions) {
        this._nextParameterId = 1;
        this._conventions = conventions;
    }
    get timeSeriesToInclude() {
        if (!this.timeSeriesToIncludeBySourceAlias) {
            return null;
        }
        return this.timeSeriesToIncludeBySourceAlias.get("");
    }
    get countersToInclude() {
        if (!this.countersToIncludeBySourcePath) {
            return null;
        }
        const value = this.countersToIncludeBySourcePath.get("");
        return value ? value[1] : new Set();
    }
    get isAllCounters() {
        if (!this.countersToIncludeBySourcePath) {
            return false;
        }
        const value = this.countersToIncludeBySourcePath.get("");
        return value ? value[0] : false;
    }
    _includeCompareExchangeValue(path) {
        if (!this.compareExchangeValuesToInclude) {
            this.compareExchangeValuesToInclude = new Set();
        }
        this.compareExchangeValuesToInclude.add(path);
    }
    _includeCounterWithAlias(path, names) {
        this._withAlias();
        if (Array.isArray(names)) {
            this._includeCounters(path, names);
        }
        else {
            this._includeCounter(path, names);
        }
    }
    _includeDocuments(path) {
        if (!this.documentsToInclude) {
            this.documentsToInclude = new Set();
        }
        this.documentsToInclude.add(path);
    }
    _includeRevisionsBefore(revisionsToIncludeByDateTime) {
        this.revisionsToIncludeByDateTime = revisionsToIncludeByDateTime;
    }
    _includeRevisionsByChangeVectors(path) {
        if (StringUtil_1.StringUtil.isNullOrWhitespace(path)) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Path cannot be null or whitespace");
        }
        if (!this.revisionsToIncludeByChangeVector) {
            this.revisionsToIncludeByChangeVector = new Set();
        }
        this.revisionsToIncludeByChangeVector.add(path);
    }
    _includeCounter(path, name) {
        if (!name) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Name cannot be empty.");
        }
        this._assertNotAllAndAddNewEntryIfNeeded(path);
        this.countersToIncludeBySourcePath.get(path)[1].add(name);
    }
    _includeCounters(path, names) {
        if (!names) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Names cannot be null.");
        }
        this._assertNotAllAndAddNewEntryIfNeeded(path);
        for (const name of names) {
            if (StringUtil_1.StringUtil.isNullOrWhitespace(name)) {
                (0, Exceptions_1.throwError)("InvalidArgumentException", "Counters(String[] names): 'names' should not contain null or whitespace elements.");
            }
            this.countersToIncludeBySourcePath.get(path)[1].add(name);
        }
    }
    _includeAllCountersWithAlias(path) {
        this._withAlias();
        this._includeAllCounters(path);
    }
    _includeAllCounters(sourcePath) {
        if (!this.countersToIncludeBySourcePath) {
            this.countersToIncludeBySourcePath =
                CaseInsensitiveKeysMap_1.CaseInsensitiveKeysMap.create();
        }
        const val = this.countersToIncludeBySourcePath.get(sourcePath);
        if (val && val[1]) {
            (0, Exceptions_1.throwError)("InvalidOperationException", "You cannot use allCounters() after using counter(String name) or counters(String[] names).");
        }
        this.countersToIncludeBySourcePath.set(sourcePath, [true, null]);
    }
    _assertNotAllAndAddNewEntryIfNeeded(path) {
        if (this.countersToIncludeBySourcePath) {
            const val = this.countersToIncludeBySourcePath.get(path);
            if (val && val[0]) {
                (0, Exceptions_1.throwError)("InvalidOperationException", "You cannot use counter(name) after using allCounters().");
            }
        }
        if (!this.countersToIncludeBySourcePath) {
            this.countersToIncludeBySourcePath = CaseInsensitiveKeysMap_1.CaseInsensitiveKeysMap.create();
        }
        if (!this.countersToIncludeBySourcePath.has(path)) {
            this.countersToIncludeBySourcePath.set(path, [false, CaseInsensitiveStringSet_1.CaseInsensitiveStringSet.create()]);
        }
    }
    _withAlias() {
        if (!this.alias) {
            this.alias = "a_" + (this._nextParameterId++);
        }
    }
    _includeTimeSeriesFromTo(alias, name, from, to) {
        this._assertValid(alias, name);
        if (!this.timeSeriesToIncludeBySourceAlias) {
            this.timeSeriesToIncludeBySourceAlias = new Map();
        }
        let hashSet = this.timeSeriesToIncludeBySourceAlias.get(alias);
        if (!hashSet) {
            hashSet = [];
            this.timeSeriesToIncludeBySourceAlias.set(alias, hashSet);
        }
        const range = {
            name,
            from,
            to
        };
        const existingItemIdx = hashSet.findIndex(x => x.name === name);
        if (existingItemIdx !== -1) {
            hashSet.splice(existingItemIdx, 1);
        }
        hashSet.push(range);
    }
    _includeTimeSeriesByRangeTypeAndTime(alias, name, type, time) {
        this._assertValid(alias, name);
        IncludeBuilderBase._assertValidType(type, time);
        if (!this.timeSeriesToIncludeBySourceAlias) {
            this.timeSeriesToIncludeBySourceAlias = new Map();
        }
        let hashSet = this.timeSeriesToIncludeBySourceAlias.get(alias);
        if (!hashSet) {
            hashSet = [];
            this.timeSeriesToIncludeBySourceAlias.set(alias, hashSet);
        }
        const timeRange = {
            name,
            type,
            time
        };
        hashSet.push(timeRange);
    }
    static _assertValidType(type, time) {
        switch (type) {
            case "None":
                (0, Exceptions_1.throwError)("InvalidArgumentException", "Time range type cannot be set to 'None' when time is specified.");
                break;
            case "Last":
                if (time) {
                    if (time.value <= 0) {
                        (0, Exceptions_1.throwError)("InvalidArgumentException", "Time range type cannot be set to 'Last' when time is negative or zero.");
                    }
                    return;
                }
                (0, Exceptions_1.throwError)("InvalidArgumentException", "Time range type cannot be set to 'Last' when time is not specified.");
                break;
            default:
                (0, Exceptions_1.throwError)("NotSupportedException", "Not supported time range type: " + type);
        }
    }
    _includeTimeSeriesByRangeTypeAndCount(alias, name, type, count) {
        this._assertValid(alias, name);
        IncludeBuilderBase._assertValidTypeAndCount(type, count);
        if (!this.timeSeriesToIncludeBySourceAlias) {
            this.timeSeriesToIncludeBySourceAlias = new Map();
        }
        let hashSet = this.timeSeriesToIncludeBySourceAlias.get(alias);
        if (!hashSet) {
            hashSet = [];
            this.timeSeriesToIncludeBySourceAlias.set(alias, hashSet);
        }
        const countRange = {
            name,
            count,
            type
        };
        hashSet.push(countRange);
    }
    static _assertValidTypeAndCount(type, count) {
        switch (type) {
            case "None":
                (0, Exceptions_1.throwError)("InvalidArgumentException", "Time range type cannot be set to 'None' when count is specified.");
                break;
            case "Last":
                if (count <= 0) {
                    (0, Exceptions_1.throwError)("InvalidArgumentException", "Count have to be positive.");
                }
                break;
            default:
                (0, Exceptions_1.throwError)("NotSupportedException", "Not supported time range type: " + type);
        }
    }
    _includeArrayOfTimeSeriesByRangeTypeAndTime(names, type, time) {
        if (!names) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Names cannot be null");
        }
        for (const name of names) {
            this._includeTimeSeriesByRangeTypeAndTime("", name, type, time);
        }
    }
    _includeArrayOfTimeSeriesByRangeTypeAndCount(names, type, count) {
        if (!names) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Names cannot be null");
        }
        for (const name of names) {
            this._includeTimeSeriesByRangeTypeAndCount("", name, type, count);
        }
    }
    _assertValid(alias, name) {
        if (StringUtil_1.StringUtil.isNullOrEmpty(name)) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Name cannot be null or empty");
        }
        if (this.timeSeriesToIncludeBySourceAlias) {
            const hashSet2 = this.timeSeriesToIncludeBySourceAlias.get(alias);
            if (hashSet2 && hashSet2.length) {
                if (Constants_1.TIME_SERIES.ALL === name) {
                    (0, Exceptions_1.throwError)("InvalidArgumentException", "IIncludeBuilder: Cannot use 'includeAllTimeSeries' after using 'includeTimeSeries' or 'includeAllTimeSeries'.");
                }
                if (hashSet2.find(x => x.name === Constants_1.TIME_SERIES.ALL)) {
                    (0, Exceptions_1.throwError)("InvalidArgumentException", "IIncludeBuilder: Cannot use 'includeTimeSeries' or 'includeAllTimeSeries' after using 'includeAllTimeSeries'.");
                }
            }
        }
    }
}
exports.IncludeBuilderBase = IncludeBuilderBase;

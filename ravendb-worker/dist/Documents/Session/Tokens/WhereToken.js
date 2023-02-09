"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereToken = exports.WhereOptions = exports.WhereMethodCall = void 0;
const QueryToken_1 = require("./QueryToken");
const Exceptions_1 = require("../../../Exceptions");
const TypeUtil_1 = require("../../../Utility/TypeUtil");
const Constants_1 = require("../../../Constants");
class WhereMethodCall {
}
exports.WhereMethodCall = WhereMethodCall;
class WhereOptions {
    constructor(parameters) {
        parameters = parameters || {};
        if (parameters["methodType"]) {
            const p = parameters;
            if (TypeUtil_1.TypeUtil.isNullOrUndefined(p.exact)) {
                p.exact = false;
            }
            this.method = new WhereMethodCall();
            this.method.methodType = p.methodType;
            this.method.parameters = p.parameters;
            this.method.property = p.property;
            this.exact = p.exact;
        }
        else if (parameters["shape"]) {
            const p = parameters;
            this.whereShape = p.shape;
            this.distanceErrorPct = p.distance;
        }
        else if (!TypeUtil_1.TypeUtil.isNullOrUndefined(parameters["exact"])
            && !parameters["methodType"]) {
            const p = parameters;
            this.exact = p.exact;
            this.fromParameterName = p.from;
            this.toParameterName = p.to;
        }
        else if (parameters["search"]) {
            this.searchOperator = parameters["search"];
        }
    }
    static defaultOptions() {
        return new WhereOptions();
    }
}
exports.WhereOptions = WhereOptions;
class WhereToken extends QueryToken_1.QueryToken {
    constructor() {
        super();
    }
    static create(op, fieldName, parameterName, options = null) {
        const token = new WhereToken();
        token.fieldName = fieldName;
        token.parameterName = parameterName;
        token.whereOperator = op;
        token.options = options || WhereOptions.defaultOptions();
        return token;
    }
    addAlias(alias) {
        if ("id()" === this.fieldName) {
            return this;
        }
        this.fieldName = alias + "." + this.fieldName;
        const whereToken = new WhereToken();
        whereToken.fieldName = alias + "." + this.fieldName;
        whereToken.parameterName = this.parameterName;
        whereToken.whereOperator = this.whereOperator;
        whereToken.options = this.options;
        return whereToken;
    }
    _writeMethod(writer) {
        if (this.options.method) {
            switch (this.options.method.methodType) {
                case "CmpXchg":
                    writer.append("cmpxchg(");
                    break;
                default:
                    (0, Exceptions_1.throwError)("InvalidArgumentException", "Unsupported method: " + this.options.method.methodType);
            }
            let first = true;
            for (const parameter of this.options.method.parameters) {
                if (!first) {
                    writer.append(",");
                }
                first = false;
                writer.append("$");
                writer.append(parameter);
            }
            writer.append(")");
            if (this.options.method.property) {
                writer.append(".")
                    .append(this.options.method.property);
            }
            return true;
        }
        return false;
    }
    writeTo(writer) {
        if (this.options.boost != null) {
            writer.append("boost(");
        }
        if (this.options.fuzzy != null) {
            writer.append("fuzzy(");
        }
        if (this.options.proximity != null) {
            writer.append("proximity(");
        }
        if (this.options.exact) {
            writer.append("exact(");
        }
        switch (this.whereOperator) {
            case "Search":
                writer.append("search(");
                break;
            case "Lucene":
                writer.append("lucene(");
                break;
            case "StartsWith":
                writer.append("startsWith(");
                break;
            case "EndsWith":
                writer.append("endsWith(");
                break;
            case "Exists":
                writer.append("exists(");
                break;
            case "SpatialWithin":
                writer.append("spatial.within(");
                break;
            case "SpatialContains":
                writer.append("spatial.contains(");
                break;
            case "SpatialDisjoint":
                writer.append("spatial.disjoint(");
                break;
            case "SpatialIntersects":
                writer.append("spatial.intersects(");
                break;
            case "Regex":
                writer.append("regex(");
                break;
        }
        this._writeInnerWhere(writer);
        if (this.options.exact) {
            writer.append(")");
        }
        if (this.options.proximity != null) {
            writer
                .append(", ")
                .append(this.options.proximity)
                .append(")");
        }
        if (this.options.fuzzy != null) {
            writer
                .append(", ")
                .append(this.options.fuzzy)
                .append(")");
        }
        if (this.options.boost != null) {
            writer
                .append(", ")
                .append(this.options.boost)
                .append(")");
        }
    }
    _writeInnerWhere(writer) {
        QueryToken_1.QueryToken.writeField(writer, this.fieldName);
        switch (this.whereOperator) {
            case "Equals":
                writer.append(" = ");
                break;
            case "NotEquals":
                writer.append(" != ");
                break;
            case "GreaterThan":
                writer
                    .append(" > ");
                break;
            case "GreaterThanOrEqual":
                writer
                    .append(" >= ");
                break;
            case "LessThan":
                writer
                    .append(" < ");
                break;
            case "LessThanOrEqual":
                writer
                    .append(" <= ");
                break;
            default:
                this._specialOperator(writer);
                return;
        }
        if (!this._writeMethod(writer)) {
            writer.append("$").append(this.parameterName);
        }
    }
    _specialOperator(writer) {
        switch (this.whereOperator) {
            case "In":
                writer
                    .append(" in ($")
                    .append(this.parameterName)
                    .append(")");
                break;
            case "AllIn":
                writer
                    .append(" all in ($")
                    .append(this.parameterName)
                    .append(")");
                break;
            case "Between":
                writer
                    .append(" between $")
                    .append(this.options.fromParameterName)
                    .append(" and $")
                    .append(this.options.toParameterName);
                break;
            case "Search":
                writer
                    .append(", $")
                    .append(this.parameterName);
                if (this.options.searchOperator === "AND") {
                    writer.append(", and");
                }
                writer.append(")");
                break;
            case "Lucene":
            case "StartsWith":
            case "EndsWith":
            case "Regex":
                writer
                    .append(", $")
                    .append(this.parameterName)
                    .append(")");
                break;
            case "Exists":
                writer
                    .append(")");
                break;
            case "SpatialWithin":
            case "SpatialContains":
            case "SpatialDisjoint":
            case "SpatialIntersects":
                writer
                    .append(", ");
                this.options.whereShape.writeTo(writer);
                if (Math.abs(this.options.distanceErrorPct - Constants_1.CONSTANTS.Documents.Indexing.Spatial.DEFAULT_DISTANCE_ERROR_PCT) > 1e-40) {
                    writer.append(", ");
                    writer.append(this.options.distanceErrorPct);
                }
                writer
                    .append(")");
                break;
            default:
                (0, Exceptions_1.throwError)("InvalidArgumentException");
        }
    }
}
exports.WhereToken = WhereToken;

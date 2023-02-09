"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeValue = void 0;
const Exceptions_1 = require("../Exceptions");
const TypeUtil_1 = require("../Utility/TypeUtil");
const StringBuilder_1 = require("../Utility/StringBuilder");
class TimeValue {
    constructor(value, unit) {
        this._value = value;
        this._unit = unit;
    }
    get value() {
        return this._value;
    }
    get unit() {
        return this._unit;
    }
    static ofSeconds(seconds) {
        return new TimeValue(seconds, "Second");
    }
    static ofMinutes(minutes) {
        return new TimeValue(minutes * 60, "Second");
    }
    static ofHours(hours) {
        return new TimeValue(hours * 3600, "Second");
    }
    static ofDays(days) {
        return new TimeValue(days * TimeValue.SECONDS_PER_DAY, "Second");
    }
    static ofMonths(months) {
        return new TimeValue(months, "Month");
    }
    static ofYears(years) {
        return new TimeValue(years * 12, "Month");
    }
    _append(builder, value, singular) {
        if (value <= 0) {
            return;
        }
        builder
            .append(value.toString())
            .append(" ")
            .append(singular);
        if (value === 1) {
            builder
                .append(" ");
            return;
        }
        builder
            .append("s ");
    }
    toString() {
        if (this._value === TypeUtil_1.TypeUtil.MAX_INT32) {
            return "MaxValue";
        }
        if (this._value === TypeUtil_1.TypeUtil.MIN_INT32) {
            return "MinValue";
        }
        if (this._value === 0) {
            return "Zero";
        }
        if (this._unit === "None") {
            return "Unknown time unit";
        }
        const str = new StringBuilder_1.StringBuilder();
        switch (this._unit) {
            case "Second": {
                let remainingSeconds = this._value;
                if (remainingSeconds > TimeValue.SECONDS_PER_DAY) {
                    const days = Math.floor(this._value / TimeValue.SECONDS_PER_DAY);
                    this._append(str, days, "day");
                    remainingSeconds -= days * TimeValue.SECONDS_PER_DAY;
                }
                if (remainingSeconds > 3600) {
                    const hours = Math.floor(remainingSeconds / 3600);
                    this._append(str, hours, "hour");
                    remainingSeconds -= hours * 3600;
                }
                if (remainingSeconds > 60) {
                    const minutes = remainingSeconds / 60;
                    this._append(str, minutes, "minute");
                    remainingSeconds -= minutes * 60;
                }
                if (remainingSeconds > 0) {
                    this._append(str, remainingSeconds, "second");
                }
                break;
            }
            case "Month": {
                if (this._value >= 12) {
                    this._append(str, Math.floor(this._value / 12), "year");
                }
                if (this._value % 12 > 0) {
                    this._append(str, this._value % 12, "month");
                }
                break;
            }
            default:
                (0, Exceptions_1.throwError)("InvalidArgumentException", "Not supported unit: " + this._unit);
        }
        return str.toString().trim();
    }
    _assertSeconds() {
        if (this._unit !== "Second") {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "The value must be seconds");
        }
    }
    static _assertValidUnit(unit) {
        if (unit === "Month" || unit === "Second") {
            return;
        }
        (0, Exceptions_1.throwError)("InvalidArgumentException", "Invalid time unit: " + unit);
    }
    static _assertSameUnits(a, b) {
        if (a.unit !== b.unit) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Unit isn't the same " + a.unit + " != " + b.unit);
        }
    }
    compareTo(other) {
        if (!this._value || !other._value) {
            return this._value - other._value;
        }
        let result;
        if (TimeValue._isSpecialCompare(this, other, x => result = x)) {
            return result;
        }
        if (this._unit === other._unit) {
            return TimeValue._trimCompareResult(this._value - other._value);
        }
        const myBounds = TimeValue._getBoundsInSeconds(this);
        const otherBounds = TimeValue._getBoundsInSeconds(this);
        if (otherBounds[1] < myBounds[0]) {
            return 1;
        }
        if (otherBounds[0] > myBounds[1]) {
            return -1;
        }
        (0, Exceptions_1.throwError)("InvalidOperationException", "Unable to compare " + this + " with " + other + ", since a month might have different number of days.");
    }
    static _getBoundsInSeconds(time) {
        switch (time._unit) {
            case "Second":
                return [time._value, time._value];
            case "Month": {
                const years = Math.floor(time._value / 12);
                let upperBound = years * TimeValue.SECONDS_IN_366_DAYS;
                let lowerBound = years * TimeValue.SECONDS_IN_365_DAYS;
                const remainingMonths = time._value % 12;
                upperBound += remainingMonths * TimeValue.SECONDS_IN_31_DAYS;
                lowerBound += remainingMonths * TimeValue.SECONDS_IN_28_DAYS;
                return [lowerBound, upperBound];
            }
            default:
                (0, Exceptions_1.throwError)("InvalidArgumentException", "Not supported time value unit: " + time._unit);
        }
    }
    static _isSpecialCompare(current, other, resultSetter) {
        resultSetter(0);
        if (TimeValue._isMax(current)) {
            resultSetter(TimeValue._isMax(other) ? 0 : 1);
            return true;
        }
        if (TimeValue._isMax(other)) {
            resultSetter(TimeValue._isMax(current) ? 0 : -1);
            return true;
        }
        if (TimeValue._isMin(current)) {
            resultSetter(TimeValue._isMax(other) ? 0 : -1);
            return true;
        }
        if (TimeValue._isMin(other)) {
            resultSetter(TimeValue._isMax(current) ? 0 : 1);
            return true;
        }
        return false;
    }
    static _isMax(time) {
        return time._unit === "None" && time._value >= TypeUtil_1.TypeUtil.MAX_INT32;
    }
    static _isMin(time) {
        return time._unit === "None" && time._value <= TypeUtil_1.TypeUtil.MIN_INT32;
    }
    static _trimCompareResult(result) {
        if (result > TypeUtil_1.TypeUtil.MAX_INT32) {
            return TypeUtil_1.TypeUtil.MAX_INT32;
        }
        if (result < TypeUtil_1.TypeUtil.MIN_INT32) {
            return TypeUtil_1.TypeUtil.MIN_INT32;
        }
        return result;
    }
    serialize() {
        return {
            Value: this.value,
            Unit: this.unit
        };
    }
    static parse(raw) {
        return new TimeValue(raw.Value, raw.Unit);
    }
}
exports.TimeValue = TimeValue;
TimeValue.SECONDS_PER_DAY = 86400;
TimeValue.SECONDS_IN_28_DAYS = 28 * TimeValue.SECONDS_PER_DAY;
TimeValue.SECONDS_IN_31_DAYS = 31 * TimeValue.SECONDS_PER_DAY;
TimeValue.SECONDS_IN_365_DAYS = 365 * TimeValue.SECONDS_PER_DAY;
TimeValue.SECONDS_IN_366_DAYS = 366 * TimeValue.SECONDS_PER_DAY;
TimeValue.ZERO = new TimeValue(0, "None");
TimeValue.MAX_VALUE = new TimeValue(TypeUtil_1.TypeUtil.MAX_INT32, "None");
TimeValue.MIN_VALUE = new TimeValue(TypeUtil_1.TypeUtil.MIN_INT32, "None");

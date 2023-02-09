"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireSemaphore = void 0;
const PromiseUtil_1 = require("./PromiseUtil");
const Exceptions_1 = require("../Exceptions");
class SemaphoreAcquisition {
    constructor(sem, semOpts) {
        this._disposed = false;
        const contextName = semOpts ? semOpts.contextName : "";
        if (semOpts && semOpts.timeout) {
            const timedOutOpName = contextName ? `WAIT_FOR_SEM_${contextName}` : null;
            this._timeout = new PromiseUtil_1.AsyncTimeout(semOpts.timeout, timedOutOpName);
        }
        this._acquired = false;
        this._sem = sem;
        this._initialize();
    }
    get promise() {
        return this._promise;
    }
    _isTimedOut() {
        return this._timeout && this._timeout.timedOut;
    }
    _initialize() {
        const sem = this._sem;
        const semAcquired = new Promise((resolve, reject) => {
            sem.take(() => {
                if (this._disposed || this._isTimedOut()) {
                    sem.leave();
                    reject((0, Exceptions_1.getError)("InvalidOperationException", "Semaphore acquire timed out or was disposed."));
                    return;
                }
                this._acquired = true;
                resolve();
            });
        });
        let resultPromise = semAcquired;
        if (this._timeout) {
            resultPromise = Promise.race([
                semAcquired,
                this._timeout.promise
            ])
                .then(() => this._timeout.cancel());
        }
        this._promise = resultPromise;
    }
    dispose() {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        if (this._timeout) {
            this._timeout.cancel();
        }
        if (!this._acquired) {
            return;
        }
        this._sem.leave();
        this._acquired = false;
    }
}
function acquireSemaphore(sem, semOpts) {
    return new SemaphoreAcquisition(sem, semOpts);
}
exports.acquireSemaphore = acquireSemaphore;

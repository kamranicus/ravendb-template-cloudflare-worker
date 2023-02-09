"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentConventions = void 0;
const ObjectMapper_1 = require("../../Mapping/ObjectMapper");
const pluralize = require("pluralize");
const Exceptions_1 = require("../../Exceptions");
const Constants_1 = require("../../Constants");
const TypeUtil_1 = require("../../Utility/TypeUtil");
const DateUtil_1 = require("../../Utility/DateUtil");
const ObjectUtil_1 = require("../../Utility/ObjectUtil");
const BulkInsertConventions_1 = require("./BulkInsertConventions");
function createServerDefaults() {
    const conventions = new DocumentConventions();
    conventions.sendApplicationIdentifier = false;
    conventions.freeze();
    return conventions;
}
class DocumentConventions {
    constructor() {
        this._listOfQueryValueToObjectConverters = [];
        this._registeredIdConventions = new Map();
        this._registeredIdPropertyNames = new Map();
        this._readBalanceBehavior = "None";
        this._identityPartsSeparator = "/";
        this._identityProperty = Constants_1.CONSTANTS.Documents.Metadata.ID_PROPERTY;
        this._findJsType = (id, doc) => {
            const metadata = doc[Constants_1.CONSTANTS.Documents.Metadata.KEY];
            if (metadata) {
                const jsType = metadata[Constants_1.CONSTANTS.Documents.Metadata.RAVEN_JS_TYPE];
                return this.getJsTypeByDocumentType(jsType);
            }
            return null;
        };
        this._findJsTypeName = (ctorOrTypeChecker) => {
            if (!ctorOrTypeChecker) {
                return null;
            }
            const name = ctorOrTypeChecker.name;
            if (name === "Object") {
                return null;
            }
            return name;
        };
        this._transformClassCollectionNameToDocumentIdPrefix =
            collectionName => DocumentConventions.defaultTransformCollectionNameToDocumentIdPrefix(collectionName);
        this._findCollectionName = type => DocumentConventions.defaultGetCollectionName(type);
        this._maxNumberOfRequestsPerSession = 30;
        this._bulkInsert = new BulkInsertConventions_1.BulkInsertConventions(() => this._assertNotFrozen());
        this._maxHttpCacheSize = 128 * 1024 * 1024;
        this._knownEntityTypes = new Map();
        this._objectMapper = new ObjectMapper_1.TypesAwareObjectMapper({
            dateFormat: DateUtil_1.DateUtil.DEFAULT_DATE_FORMAT,
            documentConventions: this
        });
        this._useCompression = null;
        this._dateUtilOpts = {};
        this._dateUtil = new DateUtil_1.DateUtil(this._dateUtilOpts);
        this._syncJsonParseLimit = 2 * 1024 * 1024;
        this._firstBroadcastAttemptTimeout = 5000;
        this._secondBroadcastAttemptTimeout = 30000;
        this._waitForIndexesAfterSaveChangesTimeout = 15000;
        this._waitForReplicationAfterSaveChangesTimeout = 15000;
        this._waitForNonStaleResultsTimeout = 15000;
        this._sendApplicationIdentifier = true;
    }
    static get defaultConventions() {
        return this._defaults;
    }
    get bulkInsert() {
        return this._bulkInsert;
    }
    get requestTimeout() {
        return this._requestTimeout;
    }
    set requestTimeout(requestTimeout) {
        this._assertNotFrozen();
        this._requestTimeout = requestTimeout;
    }
    get sendApplicationIdentifier() {
        return this._sendApplicationIdentifier;
    }
    set sendApplicationIdentifier(sendApplicationIdentifier) {
        this._assertNotFrozen();
        this._sendApplicationIdentifier = sendApplicationIdentifier;
    }
    get secondBroadcastAttemptTimeout() {
        return this._secondBroadcastAttemptTimeout;
    }
    set secondBroadcastAttemptTimeout(secondBroadcastAttemptTimeout) {
        this._assertNotFrozen();
        this._secondBroadcastAttemptTimeout = secondBroadcastAttemptTimeout;
    }
    get firstBroadcastAttemptTimeout() {
        return this._firstBroadcastAttemptTimeout;
    }
    set firstBroadcastAttemptTimeout(firstBroadcastAttemptTimeout) {
        this._assertNotFrozen();
        this._firstBroadcastAttemptTimeout = firstBroadcastAttemptTimeout;
    }
    get objectMapper() {
        return this._objectMapper;
    }
    set objectMapper(value) {
        this._assertNotFrozen();
        this._objectMapper = value;
    }
    get syncJsonParseLimit() {
        return this._syncJsonParseLimit;
    }
    set syncJsonParseLimit(value) {
        this._assertNotFrozen();
        this._syncJsonParseLimit = value;
    }
    get dateUtil() {
        return this._dateUtil;
    }
    get readBalanceBehavior() {
        return this._readBalanceBehavior;
    }
    set readBalanceBehavior(value) {
        this._assertNotFrozen();
        this._readBalanceBehavior = value;
    }
    get loadBalancerContextSeed() {
        return this._loadBalancerContextSeed;
    }
    set loadBalancerContextSeed(seed) {
        this._assertNotFrozen();
        this._loadBalancerContextSeed = seed;
    }
    get loadBalanceBehavior() {
        return this._loadBalanceBehavior;
    }
    set loadBalanceBehavior(loadBalanceBehavior) {
        this._assertNotFrozen();
        this._loadBalanceBehavior = loadBalanceBehavior;
    }
    get loadBalancerPerSessionContextSelector() {
        return this._loadBalancerPerSessionContextSelector;
    }
    set loadBalancerPerSessionContextSelector(selector) {
        this._loadBalancerPerSessionContextSelector = selector;
    }
    get entityFieldNameConvention() {
        return this._localEntityFieldNameConvention;
    }
    set entityFieldNameConvention(val) {
        this._assertNotFrozen();
        this._localEntityFieldNameConvention = val;
    }
    get remoteEntityFieldNameConvention() {
        return this._remoteEntityFieldNameConvention;
    }
    set remoteEntityFieldNameConvention(val) {
        this._assertNotFrozen();
        this._remoteEntityFieldNameConvention = val;
    }
    set useOptimisticConcurrency(val) {
        this._assertNotFrozen();
        this._useOptimisticConcurrency = val;
    }
    get useOptimisticConcurrency() {
        return this._useOptimisticConcurrency;
    }
    deserializeEntityFromJson(documentType, document) {
        try {
            const typeName = documentType ? documentType.name : null;
            return this.objectMapper.fromObjectLiteral(document, { typeName });
        }
        catch (err) {
            (0, Exceptions_1.throwError)("RavenException", "Cannot deserialize entity", err);
        }
    }
    get maxNumberOfRequestsPerSession() {
        return this._maxNumberOfRequestsPerSession;
    }
    set maxNumberOfRequestsPerSession(value) {
        this._maxNumberOfRequestsPerSession = value;
    }
    get maxHttpCacheSize() {
        return this._maxHttpCacheSize;
    }
    set maxHttpCacheSize(value) {
        this._assertNotFrozen();
        this._maxHttpCacheSize = value;
    }
    get hasExplicitlySetCompressionUsage() {
        return this._useCompression !== null;
    }
    get waitForIndexesAfterSaveChangesTimeout() {
        return this._waitForIndexesAfterSaveChangesTimeout;
    }
    set waitForIndexesAfterSaveChangesTimeout(value) {
        this._assertNotFrozen();
        this._waitForIndexesAfterSaveChangesTimeout = value;
    }
    get waitForNonStaleResultsTimeout() {
        return this._waitForNonStaleResultsTimeout;
    }
    set waitForNonStaleResultsTimeout(value) {
        this._assertNotFrozen();
        this._waitForNonStaleResultsTimeout = value;
    }
    get waitForReplicationAfterSaveChangesTimeout() {
        return this._waitForNonStaleResultsTimeout;
    }
    set waitForReplicationAfterSaveChangesTimeout(value) {
        this._assertNotFrozen();
        this._waitForReplicationAfterSaveChangesTimeout = value;
    }
    get useCompression() {
        if (this._useCompression === null) {
            return true;
        }
        return this._useCompression;
    }
    set useCompression(value) {
        this._assertNotFrozen();
        this._useCompression = value;
    }
    get storeDatesInUtc() {
        return this._dateUtilOpts.useUtcDates;
    }
    set storeDatesInUtc(value) {
        this._assertNotFrozen();
        this._dateUtilOpts.useUtcDates = value;
    }
    get storeDatesWithTimezoneInfo() {
        return this._dateUtilOpts.withTimezone;
    }
    set storeDatesWithTimezoneInfo(value) {
        this._assertNotFrozen();
        this._dateUtilOpts.withTimezone = true;
    }
    isThrowIfQueryPageSizeIsNotSet() {
        return this._throwIfQueryPageSizeIsNotSet;
    }
    setThrowIfQueryPageSizeIsNotSet(throwIfQueryPageSizeIsNotSet) {
        this._assertNotFrozen();
        this._throwIfQueryPageSizeIsNotSet = throwIfQueryPageSizeIsNotSet;
    }
    isUseOptimisticConcurrency() {
        return this._useOptimisticConcurrency;
    }
    setUseOptimisticConcurrency(useOptimisticConcurrency) {
        this._assertNotFrozen();
        this._useOptimisticConcurrency = useOptimisticConcurrency;
    }
    get identityProperty() {
        return this._identityProperty;
    }
    set identityProperty(val) {
        this._assertNotFrozen();
        this._identityProperty = val;
    }
    get findJsType() {
        return this._findJsType;
    }
    set findJsType(value) {
        this._assertNotFrozen();
        this._findJsType = value;
    }
    get findJsTypeName() {
        return this._findJsTypeName;
    }
    set findJsTypeName(value) {
        this._assertNotFrozen();
        this._findJsTypeName = value;
    }
    get findCollectionName() {
        return this._findCollectionName;
    }
    set findCollectionName(value) {
        this._assertNotFrozen();
        this._findCollectionName = value;
    }
    get documentIdGenerator() {
        return this._documentIdGenerator;
    }
    set documentIdGenerator(value) {
        this._assertNotFrozen();
        this._documentIdGenerator = value;
    }
    get identityPartsSeparator() {
        return this._identityPartsSeparator;
    }
    set identityPartsSeparator(value) {
        this._assertNotFrozen();
        if (this.identityPartsSeparator === "|") {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Cannot set identity parts separator to '|'");
        }
        this._identityPartsSeparator = value;
    }
    get shouldIgnoreEntityChanges() {
        return this._shouldIgnoreEntityChanges;
    }
    set shouldIgnoreEntityChanges(shouldIgnoreEntityChanges) {
        this._assertNotFrozen();
        this._shouldIgnoreEntityChanges = shouldIgnoreEntityChanges;
    }
    get disableTopologyUpdates() {
        return this._disableTopologyUpdates;
    }
    set disableTopologyUpdates(value) {
        this._assertNotFrozen();
        this._disableTopologyUpdates = value;
    }
    get throwIfQueryPageSizeIsNotSet() {
        return this._throwIfQueryPageSizeIsNotSet;
    }
    set throwIfQueryPageSizeIsNotSet(value) {
        this._assertNotFrozen();
        this._throwIfQueryPageSizeIsNotSet = value;
    }
    get transformClassCollectionNameToDocumentIdPrefix() {
        return this._transformClassCollectionNameToDocumentIdPrefix;
    }
    set transformClassCollectionNameToDocumentIdPrefix(value) {
        this._assertNotFrozen();
        this._transformClassCollectionNameToDocumentIdPrefix = value;
    }
    static defaultGetCollectionName(ctorOrTypeChecker) {
        if (!ctorOrTypeChecker) {
            return null;
        }
        if (!TypeUtil_1.TypeUtil.isObjectTypeDescriptor(ctorOrTypeChecker)) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Invalid class argument.");
        }
        if (!ctorOrTypeChecker.name) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Type name cannot be null or undefined.");
        }
        let result = this._cachedDefaultTypeCollectionNames.get(ctorOrTypeChecker);
        if (result) {
            return result;
        }
        if (typeof (ctorOrTypeChecker) === "string") {
            result = pluralize.plural(ctorOrTypeChecker);
        }
        else {
            result = pluralize.plural(ctorOrTypeChecker.name);
        }
        this._cachedDefaultTypeCollectionNames.set(ctorOrTypeChecker, result);
        return result;
    }
    getCollectionNameForType(ctorOrTypeChecker) {
        const collectionName = this._findCollectionName(ctorOrTypeChecker);
        return collectionName || DocumentConventions.defaultGetCollectionName(ctorOrTypeChecker);
    }
    getCollectionNameForEntity(entity) {
        if (!entity) {
            return null;
        }
        const typeDescriptor = this.getEntityTypeDescriptor(entity);
        if (typeDescriptor) {
            return this.getCollectionNameForType(typeDescriptor);
        }
        if (this._findCollectionNameForObjectLiteral && entity.constructor === Object) {
            return this._findCollectionNameForObjectLiteral(entity);
        }
        return null;
    }
    get findCollectionNameForObjectLiteral() {
        return this._findCollectionNameForObjectLiteral;
    }
    set findCollectionNameForObjectLiteral(value) {
        this._findCollectionNameForObjectLiteral = value;
    }
    getTypeDescriptorByEntity(entity) {
        return this.getEntityTypeDescriptor(entity);
    }
    getEntityTypeDescriptor(entity) {
        if (TypeUtil_1.TypeUtil.isClass(entity.constructor)) {
            return entity.constructor;
        }
        for (const entityType of this._knownEntityTypes.values()) {
            if (!TypeUtil_1.TypeUtil.isObjectLiteralTypeDescriptor(entityType)) {
                continue;
            }
            if (entityType.isType(entity)) {
                return entityType;
            }
        }
        return null;
    }
    generateDocumentId(database, entity) {
        for (const [typeDescriptor, idConvention] of this._registeredIdConventions) {
            if (TypeUtil_1.TypeUtil.isType(entity, typeDescriptor)) {
                return Promise.resolve(idConvention(database, entity));
            }
        }
        return this._documentIdGenerator(database, entity);
    }
    registerIdConvention(ctorOrTypeChecker, idConvention) {
        this._assertNotFrozen();
        this._registeredIdConventions.set(ctorOrTypeChecker, idConvention);
        return this;
    }
    registerEntityIdPropertyName(ctorOrTypeChecker, idProperty) {
        this._registeredIdPropertyNames.set(ctorOrTypeChecker, idProperty);
    }
    getJsType(id, document) {
        return this._findJsType(id, document);
    }
    getJsTypeName(entityType) {
        return this._findJsTypeName(entityType);
    }
    get disableAtomicDocumentWritesInClusterWideTransaction() {
        return this._disableAtomicDocumentWritesInClusterWideTransaction;
    }
    set disableAtomicDocumentWritesInClusterWideTransaction(disableAtomicDocumentWritesInClusterWideTransaction) {
        this._assertNotFrozen();
        this._disableAtomicDocumentWritesInClusterWideTransaction = disableAtomicDocumentWritesInClusterWideTransaction;
    }
    clone() {
        const cloned = new DocumentConventions();
        return Object.assign(cloned, this);
    }
    getIdentityProperty(documentType) {
        const typeDescriptor = this.getJsTypeByDocumentType(documentType);
        return this._registeredIdPropertyNames.get(typeDescriptor)
            || this._identityProperty;
    }
    updateFrom(configuration) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (!configuration) {
            return;
        }
        const orig = this._originalConfiguration;
        if (configuration.disabled && !orig) {
            return;
        }
        if (configuration.disabled && orig) {
            this._maxNumberOfRequestsPerSession = (_a = orig.maxNumberOfRequestsPerSession) !== null && _a !== void 0 ? _a : this.maxNumberOfRequestsPerSession;
            this._readBalanceBehavior = (_b = orig.readBalanceBehavior) !== null && _b !== void 0 ? _b : this._readBalanceBehavior;
            this._identityPartsSeparator = (_c = orig.identityPartsSeparator) !== null && _c !== void 0 ? _c : this._identityPartsSeparator;
            this._loadBalanceBehavior = (_d = orig.loadBalanceBehavior) !== null && _d !== void 0 ? _d : this._loadBalanceBehavior;
            this._loadBalancerContextSeed = (_e = orig.loadBalancerContextSeed) !== null && _e !== void 0 ? _e : this._loadBalancerContextSeed;
            this._originalConfiguration = null;
            return;
        }
        if (!this._originalConfiguration) {
            this._originalConfiguration = {
                etag: -1,
                maxNumberOfRequestsPerSession: this._maxNumberOfRequestsPerSession,
                readBalanceBehavior: this._readBalanceBehavior,
                identityPartsSeparator: this._identityPartsSeparator,
                loadBalanceBehavior: this._loadBalanceBehavior,
                loadBalancerContextSeed: this._loadBalancerContextSeed,
                disabled: false
            };
        }
        this._maxNumberOfRequestsPerSession =
            (_g = (_f = configuration.maxNumberOfRequestsPerSession) !== null && _f !== void 0 ? _f : this._originalConfiguration.maxNumberOfRequestsPerSession) !== null && _g !== void 0 ? _g : this._maxNumberOfRequestsPerSession;
        this._readBalanceBehavior =
            (_j = (_h = configuration.readBalanceBehavior) !== null && _h !== void 0 ? _h : this._originalConfiguration.readBalanceBehavior) !== null && _j !== void 0 ? _j : this._readBalanceBehavior;
        this._loadBalanceBehavior =
            (_l = (_k = configuration.loadBalanceBehavior) !== null && _k !== void 0 ? _k : this._originalConfiguration.loadBalanceBehavior) !== null && _l !== void 0 ? _l : this._loadBalanceBehavior;
        this._loadBalancerContextSeed =
            (_o = (_m = configuration.loadBalancerContextSeed) !== null && _m !== void 0 ? _m : this._originalConfiguration.loadBalancerContextSeed) !== null && _o !== void 0 ? _o : this._loadBalancerContextSeed;
        this._identityPartsSeparator =
            (_q = (_p = configuration.identityPartsSeparator) !== null && _p !== void 0 ? _p : this._originalConfiguration.identityPartsSeparator) !== null && _q !== void 0 ? _q : this._identityPartsSeparator;
    }
    static defaultTransformCollectionNameToDocumentIdPrefix(collectionName) {
        const upperCaseRegex = /[A-Z]/g;
        const m = collectionName.match(upperCaseRegex);
        const upperCount = m ? m.length : 0;
        if (upperCount <= 1) {
            return collectionName.toLowerCase();
        }
        return collectionName;
    }
    tryConvertValueToObjectForQuery(fieldName, value, forRange, strValue) {
        for (const queryValueConverter of this._listOfQueryValueToObjectConverters) {
            if (!(value instanceof queryValueConverter.Type)) {
                continue;
            }
            return queryValueConverter.Converter(fieldName, value, forRange, strValue);
        }
        strValue(null);
        return false;
    }
    freeze() {
        this._frozen = true;
    }
    _assertNotFrozen() {
        if (this._frozen) {
            (0, Exceptions_1.throwError)("RavenException", "Conventions has been frozen after documentStore.initialize() and no changes can be applied to them");
        }
    }
    get knownEntityTypesByName() {
        return this._knownEntityTypes;
    }
    get knownEntityTypes() {
        return Array.from(this._knownEntityTypes.values());
    }
    registerJsType(entityType, name) {
        return this.registerEntityType(entityType, name);
    }
    registerEntityType(entityType, name) {
        if (!TypeUtil_1.TypeUtil.isObjectTypeDescriptor(entityType)) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Entity type must be a constructor or an object literal descriptor.");
        }
        if (name) {
            this._knownEntityTypes.set(name, entityType);
        }
        this._knownEntityTypes.set(entityType.name, entityType);
        return this;
    }
    tryRegisterJsType(docType) {
        return this.tryRegisterEntityType(docType);
    }
    tryRegisterEntityType(docType) {
        if (TypeUtil_1.TypeUtil.isObjectTypeDescriptor(docType)) {
            this.registerJsType(docType);
        }
        return this;
    }
    getJsTypeByDocumentType(docTypeOrTypeName) {
        if (!docTypeOrTypeName) {
            return null;
        }
        if (typeof (docTypeOrTypeName) === "string") {
            return this._knownEntityTypes.get(docTypeOrTypeName) || null;
        }
        if (docTypeOrTypeName.name === "Object") {
            return null;
        }
        return docTypeOrTypeName;
    }
    transformObjectKeysToRemoteFieldNameConvention(obj, opts) {
        if (!this._remoteEntityFieldNameConvention) {
            return obj;
        }
        const options = opts || {
            recursive: true,
            arrayRecursive: true,
            ignorePaths: [
                Constants_1.CONSTANTS.Documents.Metadata.IGNORE_CASE_TRANSFORM_REGEX,
            ]
        };
        options.defaultTransform = this._remoteEntityFieldNameConvention;
        return ObjectUtil_1.ObjectUtil.transformObjectKeys(obj, options);
    }
    transformObjectKeysToLocalFieldNameConvention(obj, opts) {
        if (!this._localEntityFieldNameConvention) {
            return obj;
        }
        const options = opts || {
            recursive: true,
            arrayRecursive: true,
            ignorePaths: [
                Constants_1.CONSTANTS.Documents.Metadata.IGNORE_CASE_TRANSFORM_REGEX,
                /@projection/
            ]
        };
        options.defaultTransform = this._localEntityFieldNameConvention;
        return ObjectUtil_1.ObjectUtil.transformObjectKeys(obj, options);
    }
    validate() {
        if ((this._remoteEntityFieldNameConvention && !this._localEntityFieldNameConvention)
            || (!this._remoteEntityFieldNameConvention && this._localEntityFieldNameConvention)) {
            (0, Exceptions_1.throwError)("ConfigurationException", "When configuring field name conventions, "
                + "one has to configure both local and remote field name convention.");
        }
    }
}
exports.DocumentConventions = DocumentConventions;
DocumentConventions._defaults = new DocumentConventions();
DocumentConventions.defaultForServerConventions = createServerDefaults();
DocumentConventions._cachedDefaultTypeCollectionNames = new Map();
DocumentConventions.defaultConventions.freeze();

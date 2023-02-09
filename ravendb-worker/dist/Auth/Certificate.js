"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PfxCertificate = exports.PemCertificate = exports.Certificate = void 0;
const StringUtil_1 = require("../Utility/StringUtil");
const Exceptions_1 = require("../Exceptions");
class Certificate {
    constructor(certificate, passphrase, ca) {
        this._certificate = certificate;
        this._passphrase = passphrase;
        this._ca = ca;
    }
    static createFromOptions(options) {
        if (!options) {
            return null;
        }
        let certificate = null;
        if (!options.certificate) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Certificate cannot be null");
        }
        switch (options.type) {
            case Certificate.PEM:
                certificate = this.createPem(options.certificate, options.password, options.ca);
                break;
            case Certificate.PFX:
                certificate = this.createPfx(options.certificate, options.password, options.ca);
                break;
            default:
                (0, Exceptions_1.throwError)("InvalidArgumentException", "Unsupported authOptions type: " + options.type);
        }
        return certificate;
    }
    static createPem(certificate, passphrase, ca) {
        return new PemCertificate(certificate, passphrase, ca);
    }
    static createPfx(certificate, passphrase, ca) {
        return new PfxCertificate(certificate, passphrase, ca);
    }
    toAgentOptions() {
        if (this._passphrase) {
            return { passphrase: this._passphrase };
        }
        return {};
    }
    toWebSocketOptions() {
        if (this._passphrase) {
            return { passphrase: this._passphrase };
        }
        return {};
    }
}
exports.Certificate = Certificate;
Certificate.PEM = "pem";
Certificate.PFX = "pfx";
class PemCertificate extends Certificate {
    constructor(certificate, passphrase, ca) {
        super(certificate, passphrase, ca);
        this._certToken = "CERTIFICATE";
        this._keyToken = "RSA PRIVATE KEY";
        if (certificate instanceof Buffer) {
            this._certificate = certificate.toString();
        }
        this._key = this._fetchPart(this._keyToken);
        this._certificate = this._fetchPart(this._certToken);
        if (!this._key && !this._certificate) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Invalid .pem certificate provided");
        }
    }
    toAgentOptions() {
        const result = super.toAgentOptions();
        return Object.assign(result, {
            cert: this._certificate,
            key: this._key,
            ca: this._ca
        });
    }
    toWebSocketOptions() {
        const result = super.toWebSocketOptions();
        return Object.assign(result, {
            cert: this._certificate,
            key: this._key,
            ca: this._ca
        });
    }
    _fetchPart(token) {
        const cert = this._certificate;
        const prefixSuffix = "-----";
        const beginMarker = `${prefixSuffix}BEGIN ${token}${prefixSuffix}`;
        const endMarker = `${prefixSuffix}END ${token}${prefixSuffix}`;
        if (cert.includes(beginMarker) && cert.includes(endMarker)) {
            const part = cert.substring(cert.indexOf(beginMarker), cert.indexOf(endMarker) + endMarker.length);
            if (!StringUtil_1.StringUtil.isNullOrWhitespace(part)) {
                return part;
            }
        }
        return null;
    }
}
exports.PemCertificate = PemCertificate;
class PfxCertificate extends Certificate {
    constructor(certificate, passphrase, ca) {
        if (!(certificate instanceof Buffer)) {
            (0, Exceptions_1.throwError)("InvalidArgumentException", "Pfx certificate should be a Buffer");
        }
        super(certificate, passphrase, ca);
    }
    toAgentOptions() {
        return Object.assign(super.toAgentOptions(), {
            pfx: this._certificate,
            ca: this._ca
        });
    }
    toWebSocketOptions() {
        const result = super.toWebSocketOptions();
        return Object.assign(result, {
            pfx: this._certificate,
            ca: this._ca
        });
    }
}
exports.PfxCertificate = PfxCertificate;

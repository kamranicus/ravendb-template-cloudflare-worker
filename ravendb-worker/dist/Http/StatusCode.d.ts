export declare type StatusCode = 200 | 201 | 202 | 203 | 204 | 301 | 302 | 304 | 400 | 401 | 412 | 403 | 404 | 408 | 409 | 410 | 417 | 425 | 500 | 502 | 503 | 504;
export declare class StatusCodes {
    static readonly Ok: StatusCode;
    static readonly Created: StatusCode;
    static readonly Accepted: StatusCode;
    static readonly NonAuthoritativeInformation: StatusCode;
    static readonly NoContent: StatusCode;
    static readonly MovedPermanently: StatusCode;
    static readonly Found: StatusCode;
    static readonly NotModified: StatusCode;
    static readonly BadRequest: StatusCode;
    static readonly Unauthorized: StatusCode;
    static readonly Forbidden: StatusCode;
    static readonly NotFound: StatusCode;
    static readonly RequestTimeout: StatusCode;
    static readonly Conflict: StatusCode;
    static readonly PreconditionFailed: StatusCode;
    static readonly ExpectationFailed: StatusCode;
    static readonly TooEarly: StatusCode;
    static readonly InternalServerError: StatusCode;
    static readonly BadGateway: StatusCode;
    static readonly ServiceUnavailable: StatusCode;
    static readonly GatewayTimeout: StatusCode;
    static readonly Gone: StatusCode;
}

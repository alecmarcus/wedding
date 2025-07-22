export const ONE_KiB = 1e3;
export const ONE_MiB = 1e6;
export const mib = (mebibytes: number) => mebibytes * ONE_MiB;

export const ONE_S = 1000;
export const sec = (seconds: number) => seconds * ONE_S;

export const STATUS = {
  Ok200: {
    message: "OK",
    code: 200,
  },
  Created201: {
    message: "Created",
    code: 201,
  },
  Accepted202: {
    message: "Accepted",
    code: 202,
  },
  NoContent204: {
    message: "No Content",
    code: 204,
  },
  MovedPermanently301: {
    message: "Moved Permanently",
    code: 301,
  },
  Found302: {
    message: "Found",
    code: 302,
  },
  SeeOther303: {
    message: "See Other",
    code: 303,
  },
  NotModified304: {
    message: "Not Modified",
    code: 304,
  },
  TemporaryRedirect307: {
    message: "Temporary Redirect",
    code: 307,
  },
  PermanentRedirect308: {
    message: "Permanent Redirect",
    code: 308,
  },
  BadRequest400: {
    message: "Bad Request",
    code: 400,
  },
  Unauthorized401: {
    message: "Unauthorized",
    code: 401,
  },
  PaymentRequired402: {
    message: "Payment Required",
    code: 402,
  },
  Forbidden403: {
    message: "Forbidden",
    code: 403,
  },
  NotFound404: {
    message: "Not Found",
    code: 404,
  },
  MethodNotAllowed405: {
    message: "Method Not Allowed",
    code: 405,
  },
  NotAcceptable406: {
    message: "Not Acceptable",
    code: 406,
  },
  ProxyAuthenticationRequired407: {
    message: "Proxy Authentication Required",
    code: 407,
  },
  RequestTimeout408: {
    message: "Request Timeout",
    code: 408,
  },
  Conflict409: {
    message: "Conflict",
    code: 409,
  },
  Gone410: {
    message: "Gone",
    code: 410,
  },
  LengthRequired411: {
    message: "Length Required",
    code: 411,
  },
  PreconditionFailed412: {
    message: "Precondition Failed",
    code: 412,
  },
  PayloadTooLarge413: {
    message: "Payload Too Large",
    code: 413,
  },
  URITooLong414: {
    message: "URI Too Long",
    code: 414,
  },
  UnsupportedMediaType415: {
    message: "Unsupported Media Type",
    code: 415,
  },
  RangeNotSatisfiable416: {
    message: "Range Not Satisfiable",
    code: 416,
  },
  ExpectationFailed417: {
    message: "Expectation Failed",
    code: 417,
  },
  ImATeapot418: {
    message: "I'm a teapot",
    code: 418,
  },
  MisdirectedRequest421: {
    message: "Misdirected Request",
    code: 421,
  },
  UnprocessableEntity422: {
    message: "Unprocessable Entity",
    code: 422,
  },
  Locked423: {
    message: "Locked",
    code: 423,
  },
  FailedDependency424: {
    message: "Failed Dependency",
    code: 424,
  },
  UpgradeRequired426: {
    message: "Upgrade Required",
    code: 426,
  },
  PreconditionRequired428: {
    message: "Precondition Required",
    code: 428,
  },
  TooManyRequests429: {
    message: "Too Many Requests",
    code: 429,
  },
  RequestHeaderFieldsTooLarge431: {
    message: "Request Header Fields Too Large",
    code: 431,
  },
  UnavailableForLegalReasons451: {
    message: "Unavailable For Legal Reasons",
    code: 451,
  },
  InternalServerError500: {
    message: "Internal Server Error",
    code: 500,
  },
  NotImplemented501: {
    message: "Not Implemented",
    code: 501,
  },
  BadGateway502: {
    message: "Bad Gateway",
    code: 502,
  },
  ServiceUnavailable503: {
    message: "Service Unavailable",
    code: 503,
  },
  GatewayTimeout504: {
    message: "Gateway Timeout",
    code: 504,
  },
  HTTPVersionNotSupported505: {
    message: "HTTP Version Not Supported",
    code: 505,
  },
  VariantAlsoNegotiates506: {
    message: "Variant Also Negotiates",
    code: 506,
  },
  InsufficientStorage507: {
    message: "Insufficient Storage",
    code: 507,
  },
  LoopDetected508: {
    message: "Loop Detected",
    code: 508,
  },
  NotExtended510: {
    message: "Not Extended",
    code: 510,
  },
  NetworkAuthenticationRequired511: {
    message: "Network Authentication Required",
    code: 511,
  },
} as const;

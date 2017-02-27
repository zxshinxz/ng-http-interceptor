var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { Http, RequestOptions, ConnectionBackend } from '@angular/http';
import { InterceptableHttpProxyService } from './interceptable-http-proxy.service';
import { identityFactory } from './util';
export var InterceptableHttp = (function (_super) {
    __extends(InterceptableHttp, _super);
    function InterceptableHttp(_backend, _defaultOptions) {
        _super.call(this, _backend, _defaultOptions);
    }
    InterceptableHttp.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    InterceptableHttp.ctorParameters = function () { return [
        { type: ConnectionBackend, },
        { type: RequestOptions, },
    ]; };
    return InterceptableHttp;
}(Http));
export var InterceptableHttpProviders = [
    identityFactory(InterceptableHttp, InterceptableHttpProxyService)
];
//# sourceMappingURL=interceptable-http.js.map
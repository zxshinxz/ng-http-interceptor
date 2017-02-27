import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpInterceptorService } from './http-interceptor.service';
import { identityFactory, safeProxy } from './util';
export var InterceptableHttpProxyService = (function () {
    function InterceptableHttpProxyService(http, httpInterceptorService) {
        this.http = http;
        this.httpInterceptorService = httpInterceptorService;
    }
    InterceptableHttpProxyService._extractUrl = function (url) {
        var dirtyUrl = url[0];
        return typeof dirtyUrl === 'object' && 'url' in dirtyUrl ? dirtyUrl.url : dirtyUrl;
    };
    InterceptableHttpProxyService.prototype.get = function (target, p, receiver) {
        InterceptableHttpProxyService._callStack.push(p);
        return receiver;
    };
    InterceptableHttpProxyService.prototype.apply = function (target, thisArg, argArray) {
        var _this = this;
        var method = InterceptableHttpProxyService._callStack.pop();
        // create a object without prototype as the context object
        var context = Object.create(null);
        return this.httpInterceptorService
            ._interceptRequest(InterceptableHttpProxyService._extractUrl(argArray), method, argArray, context)
            .switchMap(function (args) {
            // Check for request cancellation
            if (!args) {
                return Observable.empty();
            }
            var response = _this.http[method].apply(_this.http, args);
            return _this.httpInterceptorService._interceptResponse(InterceptableHttpProxyService._extractUrl(args), method, response, context);
        });
    };
    InterceptableHttpProxyService._callStack = [];
    InterceptableHttpProxyService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    InterceptableHttpProxyService.ctorParameters = function () { return [
        { type: Http, },
        { type: HttpInterceptorService, },
    ]; };
    return InterceptableHttpProxyService;
}());
export var _proxyTarget = function () { return null; };
// Make sure all Http methods are known for Proxy Polyfill
Object.keys(Http.prototype).forEach(function (method) { return _proxyTarget[method] = "Http." + method; });
export function _proxyFactory(http, interceptor) {
    return safeProxy(_proxyTarget, new InterceptableHttpProxyService(http, interceptor));
}
export function proxyFactory(backend, options, interceptor) {
    return _proxyFactory(new Http(backend, options), interceptor);
}
export var InterceptableHttpProxyProviders = [
    {
        provide: Http,
        useFactory: proxyFactory,
        deps: [XHRBackend, RequestOptions, HttpInterceptorService]
    },
    identityFactory(InterceptableHttpProxyService, Http),
];
export var InterceptableHttpProxyNoOverrideProviders = [
    {
        provide: InterceptableHttpProxyService,
        useFactory: _proxyFactory,
        deps: [Http, HttpInterceptorService]
    }
];
//# sourceMappingURL=interceptable-http-proxy.service.js.map
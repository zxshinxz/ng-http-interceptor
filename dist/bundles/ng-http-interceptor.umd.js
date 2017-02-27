(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/Observable'), require('rxjs/add/observable/of'), require('rxjs/add/observable/empty'), require('rxjs/add/operator/switchMap'), require('rxjs/add/operator/mergeMap'), require('@angular/core'), require('@angular/http')) :
	typeof define === 'function' && define.amd ? define(['exports', 'rxjs/Observable', 'rxjs/add/observable/of', 'rxjs/add/observable/empty', 'rxjs/add/operator/switchMap', 'rxjs/add/operator/mergeMap', '@angular/core', '@angular/http'], factory) :
	(factory((global.httpInterceptor = global.httpInterceptor || {}),global.Rx,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.ng.core,global.ng.http));
}(this, (function (exports,rxjs_Observable,rxjs_add_observable_of,rxjs_add_observable_empty,rxjs_add_operator_switchMap,rxjs_add_operator_mergeMap,_angular_core,_angular_http) { 'use strict';

var InterceptableStoreFactory = (function () {
    function InterceptableStoreFactory() {
    }
    // noinspection JSMethodCanBeStatic
    InterceptableStoreFactory.prototype.createStore = function () {
        return new InterceptableStore();
    };
    InterceptableStoreFactory.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    InterceptableStoreFactory.ctorParameters = function () { return []; };
    return InterceptableStoreFactory;
}());
var DEFAULT_URL_STORE = '/';
var InterceptableStore = (function () {
    function InterceptableStore() {
        this.storeMatcher = {};
        this.stores = {};
        this.activeStore = DEFAULT_URL_STORE;
    }
    Object.defineProperty(InterceptableStore.prototype, "store", {
        get: function () {
            return this._getStoreSafely(this.activeStore);
        },
        enumerable: true,
        configurable: true
    });
    InterceptableStore.prototype.addInterceptor = function (interceptor) {
        this.store.push(interceptor);
        return this;
    };
    InterceptableStore.prototype.removeInterceptor = function (interceptor) {
        var idx = this.store.indexOf(interceptor);
        if (idx === -1) {
            return this;
        }
        this.store.splice(idx, 1);
        return this;
    };
    InterceptableStore.prototype.clearInterceptors = function (interceptors) {
        var _this = this;
        if (interceptors === void 0) { interceptors = []; }
        if (interceptors.length > 0) {
            interceptors.forEach(function (i) { return _this.removeInterceptor(i); });
        }
        else {
            this.store.splice(0);
        }
        return this;
    };
    // ----------
    // Internal API
    InterceptableStore.prototype.setActiveStore = function (url) {
        if (url === void 0) { url = DEFAULT_URL_STORE; }
        this.activeStore = String(url);
        if (url instanceof RegExp) {
            this.storeMatcher[this.activeStore] = url;
        }
        return this;
    };
    InterceptableStore.prototype.getStore = function (key) {
        if (key === void 0) { key = DEFAULT_URL_STORE; }
        return this._getStoreSafely(key);
    };
    InterceptableStore.prototype.getMatchedStores = function (url) {
        var _this = this;
        if (url === void 0) { url = DEFAULT_URL_STORE; }
        var backedUrl = "/" + url.replace('/', '\\/') + "/"; // Use it for direct string matching
        return Object.keys(this.stores)
            .filter(function (k) { return k === url || k === backedUrl || (_this.storeMatcher[k] && _this.storeMatcher[k].test(url)); })
            .filter(function (k, i, arr) { return k !== DEFAULT_URL_STORE && arr.indexOf(k) === i; })
            .map(function (k) { return _this.getStore(k); })
            .reduce(function (stores, store) { return stores.concat(store); }, this.getStore(DEFAULT_URL_STORE));
    };
    InterceptableStore.prototype._getStoreSafely = function (key) {
        return (this.stores[key] || (this.stores[key] = []));
    };
    return InterceptableStore;
}());

var HttpInterceptorService = (function () {
    function HttpInterceptorService(store) {
        this.store = store;
        this._requestStore = this.store.createStore();
        this._responseStore = this.store.createStore();
    }
    HttpInterceptorService.wrapInObservable = function (res) {
        return res instanceof rxjs_Observable.Observable ? res : rxjs_Observable.Observable.of(res);
    };
    HttpInterceptorService.prototype.request = function (url) {
        if (url === void 0) { url = DEFAULT_URL_STORE; }
        return this._requestStore.setActiveStore(url);
    };
    HttpInterceptorService.prototype.response = function (url) {
        if (url === void 0) { url = DEFAULT_URL_STORE; }
        return this._responseStore.setActiveStore(url);
    };
    HttpInterceptorService.prototype._interceptRequest = function (url, method, data, context) {
        return this._requestStore.getMatchedStores(url).reduce(function (o, i) { return o.flatMap(function (d) {
            if (!d) {
                return rxjs_Observable.Observable.of(d);
            }
            return HttpInterceptorService.wrapInObservable(i(d, method, context));
        }); }, rxjs_Observable.Observable.of(data));
    };
    HttpInterceptorService.prototype._interceptResponse = function (url, method, response, context) {
        return this._responseStore.getMatchedStores(url).reduce(function (o, i) { return i(o, method, context); }, response);
    };
    HttpInterceptorService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    HttpInterceptorService.ctorParameters = function () { return [
        { type: InterceptableStoreFactory, },
    ]; };
    return HttpInterceptorService;
}());

var SAFE_PROXY_TRAPS = ['get', 'set', 'apply'];
function identityFactory_(ref) {
    return ref;
}
function identityFactory(provide, obj) {
    return {
        provide: provide,
        useFactory: identityFactory_,
        deps: [obj]
    };
}
function safeProxyHandler_(handler) {
    var safeHandler = {};
    SAFE_PROXY_TRAPS
        .filter(function (trap) { return typeof handler[trap] === 'function'; })
        .forEach(function (trap) { return safeHandler[trap] = handler[trap].bind(handler); });
    return safeHandler;
}
function safeProxy(obj, handler) {
    return new Proxy(obj, safeProxyHandler_(handler));
}

var InterceptableHttpProxyService = (function () {
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
                return rxjs_Observable.Observable.empty();
            }
            var response = _this.http[method].apply(_this.http, args);
            return _this.httpInterceptorService._interceptResponse(InterceptableHttpProxyService._extractUrl(args), method, response, context);
        });
    };
    InterceptableHttpProxyService._callStack = [];
    InterceptableHttpProxyService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    InterceptableHttpProxyService.ctorParameters = function () { return [
        { type: _angular_http.Http, },
        { type: HttpInterceptorService, },
    ]; };
    return InterceptableHttpProxyService;
}());
var _proxyTarget = function () { return null; };
// Make sure all Http methods are known for Proxy Polyfill
Object.keys(_angular_http.Http.prototype).forEach(function (method) { return _proxyTarget[method] = "Http." + method; });
function _proxyFactory(http, interceptor) {
    return safeProxy(_proxyTarget, new InterceptableHttpProxyService(http, interceptor));
}
function proxyFactory(backend, options, interceptor) {
    return _proxyFactory(new _angular_http.Http(backend, options), interceptor);
}
var InterceptableHttpProxyProviders = [
    {
        provide: _angular_http.Http,
        useFactory: proxyFactory,
        deps: [_angular_http.XHRBackend, _angular_http.RequestOptions, HttpInterceptorService]
    },
    identityFactory(InterceptableHttpProxyService, _angular_http.Http),
];
var InterceptableHttpProxyNoOverrideProviders = [
    {
        provide: InterceptableHttpProxyService,
        useFactory: _proxyFactory,
        deps: [_angular_http.Http, HttpInterceptorService]
    }
];

var InterceptableHttp = (function (_super) {
    __extends(InterceptableHttp, _super);
    function InterceptableHttp(_backend, _defaultOptions) {
        _super.call(this, _backend, _defaultOptions);
    }
    InterceptableHttp.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    InterceptableHttp.ctorParameters = function () { return [
        { type: _angular_http.ConnectionBackend, },
        { type: _angular_http.RequestOptions, },
    ]; };
    return InterceptableHttp;
}(_angular_http.Http));
var InterceptableHttpProviders = [
    identityFactory(InterceptableHttp, InterceptableHttpProxyService)
];

var SharedProviders = [
    InterceptableStoreFactory,
    HttpInterceptorService
].concat(InterceptableHttpProviders);
var HTTP_INTERCEPTOR_PROVIDER = SharedProviders.concat(InterceptableHttpProxyProviders);
var HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER = SharedProviders.concat(InterceptableHttpProxyNoOverrideProviders);

/**
 * @module
 * @description
 * Library provides Http Interceptor Service for Angular 2 application
 * By default overrides angular's Http service
 * To keep original Http service use with {@see HttpInterceptorModule.noOverrideHttp()}
 */
var HttpInterceptorModule = (function () {
    function HttpInterceptorModule() {
    }
    /**
     * Keeps original Http service and adds InterceptableHttp service
     * Requests made by Http service will not be intercepted - only those made by InterceptableHttp
     */
    HttpInterceptorModule.noOverrideHttp = function () {
        return {
            ngModule: HttpInterceptorNoOverrideModule
        };
    };
    HttpInterceptorModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [_angular_http.HttpModule],
                    providers: [HTTP_INTERCEPTOR_PROVIDER]
                },] },
    ];
    /** @nocollapse */
    HttpInterceptorModule.ctorParameters = function () { return []; };
    return HttpInterceptorModule;
}());
var HttpInterceptorNoOverrideModule = (function () {
    function HttpInterceptorNoOverrideModule() {
    }
    HttpInterceptorNoOverrideModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [_angular_http.HttpModule],
                    providers: [HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER]
                },] },
    ];
    /** @nocollapse */
    HttpInterceptorNoOverrideModule.ctorParameters = function () { return []; };
    return HttpInterceptorNoOverrideModule;
}());

/**
 * @description
 * Gets index of {@link RequestOptions} in http data array for specified `method`.
 * @param method - Http method
 */
function getHttpOptionsIdx(method) {
    switch (method) {
        case 'post':
        case 'put':
        case 'patch':
            return 2;
        default:
            return 1;
    }
}

/**
 * @description
 * Gets http {@link RequestOptions} from data array.
 * If no options found and `alwaysOriginal = false` - returns new {@link RequestOptions}.
 * @param data - Array of http data
 * @param method - Http method
 * @param alwaysOriginal - `false` by default
 */
function getHttpOptions(data, method, alwaysOriginal) {
    if (alwaysOriginal === void 0) { alwaysOriginal = false; }
    return alwaysOriginal ?
        data[getHttpOptionsIdx(method)] :
        data[getHttpOptionsIdx(method)] || new _angular_http.RequestOptions();
}

/**
 * @description
 * Gets {@link RequestOptions} and it's index location in data array.
 * If no options found and `alwaysOriginal = false` - creates new {@link RequestOptions}.
 * @param data - Array of http data
 * @param method - Http method
 * @param alwaysOriginal - `false` by default
 */
function getHttpOptionsAndIdx(data, method, alwaysOriginal) {
    if (alwaysOriginal === void 0) { alwaysOriginal = false; }
    return {
        options: getHttpOptions(data, method, alwaysOriginal),
        idx: getHttpOptionsIdx(method)
    };
}

/**
 * @description
 * Gets {@link Headers} from data array.
 * If no {@link RequestOptions} found - creates it and updates original data array.
 * If no {@link Headers} found - creates it and sets to {@link RequestOptions}.
 * @param data - Array of http data
 * @param method - Http method
 */
function getHttpHeadersOrInit(data, method) {
    var _a = getHttpOptionsAndIdx(data, method), options = _a.options, idx = _a.idx;
    var headers = options.headers;
    // Create and update Headers
    if (!options.headers) {
        headers = new _angular_http.Headers();
        options.headers = headers;
    }
    // Set Options back
    data[idx] = options;
    return headers;
}

/**
 * @module
 * @description
 * Library provides Http Interceptor Service for Angular 2 application
 * By default overrides angular's Http service
 * To keep original Http service use with {@see HttpInterceptorModule.noOverrideHttp()}
 */

exports.HttpInterceptorModule = HttpInterceptorModule;
exports.HttpInterceptorNoOverrideModule = HttpInterceptorNoOverrideModule;
exports.InterceptableHttp = InterceptableHttp;
exports.InterceptableHttpProviders = InterceptableHttpProviders;
exports.HttpInterceptorService = HttpInterceptorService;
exports.getHttpOptions = getHttpOptions;
exports.getHttpOptionsIdx = getHttpOptionsIdx;
exports.getHttpOptionsAndIdx = getHttpOptionsAndIdx;
exports.getHttpHeadersOrInit = getHttpHeadersOrInit;

Object.defineProperty(exports, '__esModule', { value: true });

})));

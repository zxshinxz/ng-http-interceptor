import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InterceptableStoreFactory, DEFAULT_URL_STORE } from './interceptable-store';
export var HttpInterceptorService = (function () {
    function HttpInterceptorService(store) {
        this.store = store;
        this._requestStore = this.store.createStore();
        this._responseStore = this.store.createStore();
    }
    HttpInterceptorService.wrapInObservable = function (res) {
        return res instanceof Observable ? res : Observable.of(res);
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
                return Observable.of(d);
            }
            return HttpInterceptorService.wrapInObservable(i(d, method, context));
        }); }, Observable.of(data));
    };
    HttpInterceptorService.prototype._interceptResponse = function (url, method, response, context) {
        return this._responseStore.getMatchedStores(url).reduce(function (o, i) { return i(o, method, context); }, response);
    };
    HttpInterceptorService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    HttpInterceptorService.ctorParameters = function () { return [
        { type: InterceptableStoreFactory, },
    ]; };
    return HttpInterceptorService;
}());
//# sourceMappingURL=http-interceptor.service.js.map
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTOR_PROVIDER, HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER } from './providers';
/**
 * @module
 * @description
 * Library provides Http Interceptor Service for Angular 2 application
 * By default overrides angular's Http service
 * To keep original Http service use with {@see HttpInterceptorModule.noOverrideHttp()}
 */
export var HttpInterceptorModule = (function () {
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
        { type: NgModule, args: [{
                    imports: [HttpModule],
                    providers: [HTTP_INTERCEPTOR_PROVIDER]
                },] },
    ];
    /** @nocollapse */
    HttpInterceptorModule.ctorParameters = function () { return []; };
    return HttpInterceptorModule;
}());
export var HttpInterceptorNoOverrideModule = (function () {
    function HttpInterceptorNoOverrideModule() {
    }
    HttpInterceptorNoOverrideModule.decorators = [
        { type: NgModule, args: [{
                    imports: [HttpModule],
                    providers: [HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER]
                },] },
    ];
    /** @nocollapse */
    HttpInterceptorNoOverrideModule.ctorParameters = function () { return []; };
    return HttpInterceptorNoOverrideModule;
}());
//# sourceMappingURL=module.js.map
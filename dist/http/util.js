export var SAFE_PROXY_TRAPS = ['get', 'set', 'apply'];
export function identityFactory_(ref) {
    return ref;
}
export function identityFactory(provide, obj) {
    return {
        provide: provide,
        useFactory: identityFactory_,
        deps: [obj]
    };
}
export function safeProxyHandler_(handler) {
    var safeHandler = {};
    SAFE_PROXY_TRAPS
        .filter(function (trap) { return typeof handler[trap] === 'function'; })
        .forEach(function (trap) { return safeHandler[trap] = handler[trap].bind(handler); });
    return safeHandler;
}
export function safeProxy(obj, handler) {
    return new Proxy(obj, safeProxyHandler_(handler));
}
//# sourceMappingURL=util.js.map
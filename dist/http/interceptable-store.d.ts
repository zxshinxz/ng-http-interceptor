import { Interceptable, Interceptor } from './interceptable';
export declare type AnyInterceptor = Interceptor<any, any>;
export declare class InterceptableStoreFactory {
    createStore<D extends AnyInterceptor>(): InterceptableStore<D>;
}
export declare const DEFAULT_URL_STORE: string;
export declare class InterceptableStore<T extends AnyInterceptor> implements Interceptable<T> {
    private storeMatcher;
    private stores;
    private activeStore;
    private readonly store;
    addInterceptor(interceptor: T): Interceptable<T>;
    removeInterceptor(interceptor: T): Interceptable<T>;
    clearInterceptors(interceptors?: T[]): Interceptable<T>;
    setActiveStore(url?: string | RegExp): InterceptableStore<T>;
    getStore(key?: string): T[];
    getMatchedStores(url?: string): T[];
    private _getStoreSafely(key);
}

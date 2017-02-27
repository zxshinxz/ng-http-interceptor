import { HttpInterceptorService } from './http-interceptor.service';
import { InterceptableHttpProxyProviders, InterceptableHttpProxyNoOverrideProviders } from './interceptable-http-proxy.service';
import { InterceptableHttpProviders } from './interceptable-http';
import { InterceptableStoreFactory } from './interceptable-store';
var SharedProviders = [
    InterceptableStoreFactory,
    HttpInterceptorService
].concat(InterceptableHttpProviders);
export var HTTP_INTERCEPTOR_PROVIDER = SharedProviders.concat(InterceptableHttpProxyProviders);
export var HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER = SharedProviders.concat(InterceptableHttpProxyNoOverrideProviders);
//# sourceMappingURL=providers.js.map
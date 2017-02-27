import { Headers } from '@angular/http';
import { getHttpOptionsAndIdx } from './getHttpOptionsAndIdx';
/**
 * @description
 * Gets {@link Headers} from data array.
 * If no {@link RequestOptions} found - creates it and updates original data array.
 * If no {@link Headers} found - creates it and sets to {@link RequestOptions}.
 * @param data - Array of http data
 * @param method - Http method
 */
export function getHttpHeadersOrInit(data, method) {
    var _a = getHttpOptionsAndIdx(data, method), options = _a.options, idx = _a.idx;
    var headers = options.headers;
    // Create and update Headers
    if (!options.headers) {
        headers = new Headers();
        options.headers = headers;
    }
    // Set Options back
    data[idx] = options;
    return headers;
}
//# sourceMappingURL=getHttpHeadersOrInit.js.map
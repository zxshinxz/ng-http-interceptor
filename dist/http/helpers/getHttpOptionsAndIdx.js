import { getHttpOptionsIdx } from './getHttpOptionsIdx';
import { getHttpOptions } from './getHttpOptions';
/**
 * @description
 * Gets {@link RequestOptions} and it's index location in data array.
 * If no options found and `alwaysOriginal = false` - creates new {@link RequestOptions}.
 * @param data - Array of http data
 * @param method - Http method
 * @param alwaysOriginal - `false` by default
 */
export function getHttpOptionsAndIdx(data, method, alwaysOriginal) {
    if (alwaysOriginal === void 0) { alwaysOriginal = false; }
    return {
        options: getHttpOptions(data, method, alwaysOriginal),
        idx: getHttpOptionsIdx(method)
    };
}
//# sourceMappingURL=getHttpOptionsAndIdx.js.map
import {Secret} from "./Secret";
import * as is from 'predicates';

export function protect<T extends protect.Func>(func: T, description?: string): (...args: any[]) => protect.Resolved<T> {
    return function (this: any, ...args: any[]) {
        const result = func.apply(this, args);

        if (is.promiseLike(result)) {
            return result.then((x: any) => new Secret(x, description))
        }
        return new Secret(result, description);
    }
}

export namespace protect {
    export type Func = (...args: any[]) => any;

    export type Resolved<T extends Func> = ReturnType<T> extends Promise<infer TResult> ? Promise<Secret<TResult>> : Secret<ReturnType<T>>;
}
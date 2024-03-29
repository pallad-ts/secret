import {inspect} from 'util';
import * as is from 'predicates';

const TYPE = '@pallad/secret';
const TYPE_KEY = '@type';

const IS_TYPE = is.property(TYPE_KEY, is.strictEqual(TYPE));

export class Secret<T = unknown> {
    getValue!: () => T;

    getDescription!: () => string;

    constructor(value: T, description: string = Secret.DEFAULT_DESCRIPTION) {
        Object.defineProperties(this, {
            getValue: {
                value: () => {
                    return value;
                },
                enumerable: false,
                configurable: false
            },
            getDescription: {
                value: () => {
                    return description;
                },
                enumerable: false,
                configurable: false
            },
            [TYPE_KEY]: {
                value: TYPE,
                enumerable: false,
                configurable: false,
            }
        });
    }

    toString() {
        return this.getDescription();
    }

    toJSON() {
        return {};
    }

    static is<T = unknown>(value: unknown): value is Secret<T> {
        return value instanceof Secret || IS_TYPE(value);
    }

    static DEFAULT_DESCRIPTION = '**SECRET**';

    [inspect.custom]() {
        return this.getDescription();
    }

    get [Symbol.toStringTag]() {
        return this.getDescription();
    }
}

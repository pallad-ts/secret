import {inspect} from 'util';

export class Secret<T = any> {
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
        return value instanceof Secret;
    }

    static DEFAULT_DESCRIPTION = '**SECRET**';

    [inspect.custom]() {
        return this.getDescription();
    }

    get [Symbol.toStringTag]() {
        return this.getDescription();
    }
}

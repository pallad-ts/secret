import {inspect} from 'util';

const values = new WeakMap();
const descriptions = new WeakMap();

export class Secret<T = any> {
    constructor(value: T, description: string = Secret.DEFAULT_DESCRIPTION) {
        values.set(this, value);
        descriptions.set(this, description);
    }

    getValue() {
        return values.get(this);
    }

    getDescription() {
        return descriptions.get(this);
    }

    toString() {
        return this.getDescription();
    }

    toJSON() {
        return {};
    }

    static is<T = any>(value: any): value is Secret<T> {
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
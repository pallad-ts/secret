import {Secret} from "./Secret";

export * from './Secret';
export * from './protect';

export function secret<T>(value: T, description?: string) {
    return new Secret(value, description);
}
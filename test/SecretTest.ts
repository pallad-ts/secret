import {Secret} from "@src/Secret";
import {inspect} from "util";
import {secret} from '@src/index';
import {assert, IsExact} from 'conditional-type-checks';

describe('Secret', () => {
    const SECRET_VALUE = 'protectedValue!@#!@';
    const CUSTOM_DESC = 'Custom description';

    const SECRET = new Secret(SECRET_VALUE);
    const SECRET_CUSTOM_DESC = new Secret(SECRET_VALUE, CUSTOM_DESC);

    it('when converting to string returns description', () => {
        expect(String(SECRET))
            .toEqual(Secret.DEFAULT_DESCRIPTION);

        expect(String(SECRET_CUSTOM_DESC))
            .toEqual(SECRET_CUSTOM_DESC.getDescription());
    });

    it('prevents being inspected', () => {
        expect(inspect(SECRET))
            .toEqual(SECRET.getDescription());

        expect(inspect(SECRET_CUSTOM_DESC))
            .toEqual(SECRET_CUSTOM_DESC.getDescription());

        expect(inspect(SECRET, {customInspect: false}))
            .toEqual(`Secret [${SECRET.getDescription()}] {}`);

        expect(inspect(SECRET_CUSTOM_DESC, {customInspect: false}))
            .toEqual(`Secret [${SECRET_CUSTOM_DESC.getDescription()}] {}`);
    });

    it('getting value', () => {
        expect(SECRET.getValue())
            .toEqual(SECRET_VALUE);

        expect(SECRET_CUSTOM_DESC.getValue())
            .toEqual(SECRET_VALUE);
    });

    it('getting description', () => {
        expect(SECRET.getDescription())
            .toEqual(Secret.DEFAULT_DESCRIPTION);

        expect(SECRET_CUSTOM_DESC.getDescription())
            .toEqual(CUSTOM_DESC);
    });

    it('not serializable', () => {
        expect(JSON.stringify(SECRET))
            .toEqual('{}');

        expect(JSON.stringify(SECRET_CUSTOM_DESC))
            .toEqual('{}');
    });

    it('checking types', () => {
        expect(Secret.is(secret('test')))
            .toBe(true);

        expect(Secret.is(new Secret('test')))
            .toBe(true);

        expect(Secret.is('secret'))
            .toBe(false);

        expect(Secret.is({
            getValue() {
                return 'test'
            }
        }))
            .toBe(false);
    });
});

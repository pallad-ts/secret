import {Secret} from "@src/Secret";
import {inspect} from "util";
import {secret} from '@src/index';
import * as fs from 'fs';
import * as path from 'path';

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

    describe('checking types', () => {
        it('from module', () => {
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


        describe('from another copy of module', () => {

            const SOURCE_SECRET = path.join(__dirname, '../src', 'Secret.ts');
            const TARGET_SECRET = path.join(__dirname, './SecretCopy.ts');
            beforeEach(async () => {
                await fs.promises.copyFile(
                    SOURCE_SECRET,
                    TARGET_SECRET
                );
            });

            afterEach(async () => {
                if (fs.existsSync(TARGET_SECRET)) {
                    await fs.promises.unlink(TARGET_SECRET);
                }
            });

            it('checking type', () => {
                const {Secret: NewSecret} = require(TARGET_SECRET);

                const newSecret = new NewSecret(SECRET_VALUE);
                expect(newSecret instanceof Secret)
                    .toBe(false);

                expect(Secret.is(newSecret)).toBe(true);
                expect(NewSecret.is(new Secret(SECRET_VALUE))).toBe(true);

                expect(newSecret.getValue())
                    .toBe(SECRET_VALUE);
            });
        })

    });
});

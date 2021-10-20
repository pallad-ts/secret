import * as sinon from 'sinon';
import {protect} from "@src/protect";
import {Secret} from "@src/Secret";
import {assert, IsExact} from 'conditional-type-checks';

describe('protect', () => {
    const SECRET_VALUE = 'protectedValue#!@23423';

    function assertSecret(value: any) {
        expect(Secret.is(value))
            .toBeTruthy();

        expect(value.getValue())
            .toEqual(SECRET_VALUE);
    }

    describe('calls target function in original context', () => {
        const stub: () => string = sinon.stub().returns(SECRET_VALUE);
        const protectedFunc = protect(stub);

        const context = {some: 'value'};
        const result = protectedFunc.call(context);

        it('should return value wrapped with Secret', () => {
            assertSecret(result);
            sinon.assert.calledOn(stub as any, context);
        });

        it('returned function should have proper type', () => {
            assert<IsExact<typeof protectedFunc, () => Secret<string>>>(true);
        });
    });

    describe('calls target function with provided arguments', () => {
        const stub: (a: number, b: string) => string = sinon.stub().returns(SECRET_VALUE);
        const protectedFunc = protect(stub);

        const context = {some: 'value'};
        const args: [number, string] = [1, 'foo'];
        const result = protectedFunc.apply(context, args);

        it('should return value wrapped with Secret', () => {
            assertSecret(result);
            sinon.assert.calledOn(stub as any, context);
            sinon.assert.calledWith(stub as any, ...args);
        })

        it('returned function should have proper type', () => {
            assert<IsExact<typeof protectedFunc, (a: number, b: string) => Secret<string>>>(true);
        })
    });

    describe('handling promises', () => {
        const stub: () => Promise<string> = sinon.stub().resolves(SECRET_VALUE);
        let protectedFunc = protect(stub);

        const result = protectedFunc();

        it('should resolve value wrapped with Secreet', async () => {
            const resolvedResult = await result;
            expect(result)
                .toBeInstanceOf(Promise);
            assertSecret(resolvedResult);
        });

        it('returned function should have proper type', () => {
            assert<IsExact<typeof protectedFunc, () => Promise<Secret<string>>>>(true);
        });
    });

    describe('handling simple result', () => {
        const stub: () => string = sinon.stub().returns(SECRET_VALUE);

        const protectedFunc = protect(stub);
        const result = protectedFunc();

        it('should return value wrapped with Secret', () => {
            assertSecret(result);
        });

        it('returned function should have proper type', () => {
            assert<IsExact<typeof protectedFunc, () => Secret<string>>>(true);
        });
    });
});

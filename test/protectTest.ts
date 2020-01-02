import * as sinon from 'sinon';
import {protect} from "@src/protect";
import {Secret} from "@src/Secret";

describe('protect', () => {
    const SECRET_VALUE = 'protectedValue#!@23423';

    function assertSecret(value: any) {
        expect(Secret.is(value))
            .toBeTruthy();

        expect(value.getValue())
            .toEqual(SECRET_VALUE);
    }

    it('calls target function in original context', () => {
        const stub = sinon.stub().returns(SECRET_VALUE);
        const protectedFunc = protect(stub);

        const context = {some: 'value'};
        const result = protectedFunc.call(context);

        assertSecret(result);
        sinon.assert.calledOn(stub, context);
    });

    it('calls target function with provided arguments', () => {

        const stub = sinon.stub().returns(SECRET_VALUE);
        const protectedFunc = protect(stub);

        const context = {some: 'value'};
        const args = [1, 2, 3, 4];
        const result = protectedFunc.apply(context, args);

        assertSecret(result);
        sinon.assert.calledOn(stub, context);
        sinon.assert.calledWith(stub, ...args);
    });

    it('handling promises', async () => {
        const stub = sinon.stub().resolves(SECRET_VALUE);
        const protectedFunc = protect(stub);

        const result = protectedFunc();
        const resolvedResult = await result;

        expect(result)
            .toBeInstanceOf(Promise);

        assertSecret(resolvedResult);
    });

    it('handling simple result', () => {
        const stub = sinon.stub().returns(SECRET_VALUE);

        const protectedFunc = protect(stub);
        const result = protectedFunc();

        assertSecret(result);
    });
});
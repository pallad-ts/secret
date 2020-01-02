# @pallad/secret

Value object that protects your secret from leak.

## How it works

_@pallad/secret_ simply wraps any value with object that cannot be converted to string, serialized (for example by `JSON.stringify`), inspected (through `util.inspect`), logged (through `console.log`) or debugged.

This approach increased your security by preventing logging your configuration values. user passwords or other sensitive data.

It order to retrieve value you need to explicity call `getValue` method

```typescript
import {Secret, secret} from '@pallad/secret';

const SECRET = 'someProtectedValue!3234#@#%4';

const protectedValue = new Secret(SECRET);
// or 
const protectedValue2 = secret(SECRET);

protectedValue + ''; // '**SECRET**'
protectedValue.toString(); // '**SECRET**'
util.inspect(protectedValue); // **SECRET**
console.log(protectedValue); // **SECRET**
util.inspect(protectedValue, {customInspect: false}); // Secret [**SECRET**] {}
```

## Custom description

```typescript
import {Secret} from '@pallad/secret';
const protectedValue = new Secret(SECRET, 'CustomDescription');

String(protectedValue); // 'CustomDescription'

console.log(protectedValue); // CustomDescription
util.inspect(protectedValue, {customInspect: false}); // CustomDescription
```

## Wrapping function result

`protect` wraps a function with another functions that secretize returned value (handles promises as well).

```typescript
import {protect, Secret} from '@pallad/secret';

const result1 = protect(x => 'protectedValue')();
Secret.is(result1); // true
result1.getValue(); // 'protectedValue')


// handling promises

const result2 = protect(x => Promise.resolve('protectedValue'))();

result2.then(x => {
    Secret.is(x); // true
    x.getValue(); // 'protectedValue'
})
 
```


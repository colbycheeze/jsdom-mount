# Simple helper for mounting HTML in unit tests
JSdom doesn't work properly with dataset object, so a fix for that has been added as well.

Testing front end code couldn't be easier with this lib.
It is simple, yet does a lot. All you have to do is the following:
```javascript
import mountDOM from 'jsdom-mount';
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('A sample test', function () {
  it('works as expected', function () {
    mountDOM(`
      <div id="foo">
        <h1>Just HTML</h1>
      </div>
    `);

    const myDiv = document.getElementById('foo');

    myDiv.setAttribute('data-foo-bar', 'baz');

    expect(myDiv.dataset.fooBar).to.equal('baz');
  });
}
```

What just happened there was that the lib checks to see if a global browser environment exists,
and if not, it will set up all of the globals via JSDom, and create a polyfill for the broken
dataset functionality.

If browser globals DO exist, it just uses those instead and everything just works as expected.
Each time mountDOM is called, the HTML inside of body is cleared so that tests are clean.

import jsdom from 'jsdom';

const dashToCamel = name => name.replace(/-([a-z])/g, g => g[1].toUpperCase());
const getDataFrom = element => (
  Object.assign({}, ... [... element.attributes]
    .filter(attr => attr.nodeName.indexOf('data-') === 0)
    .map(attr => ({
      [dashToCamel(attr.nodeName.slice(5))]: attr.nodeValue,
    }))
  )
);

export const polyfillDataset = (rootElement = document.body) => {
  rootElement.dataset = getDataFrom(rootElement); // eslint-disable-line no-param-reassign
  [... rootElement.children].forEach((child) => {
    polyfillDataset(child);
  });
};

export const clearDOM = () => {
  const body = document.body;
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
};

const patchSetAttribute = () => {
  const setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function setAttribute() {
    setAttr.apply(this, arguments);
    if (arguments[0].indexOf('data-') === 0) {
      const dataset = dashToCamel(arguments[0].slice(5));
      this.dataset[dataset] = arguments[1];
    }
  };
};

export const createGlobals = () => {
  const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
  const win = doc.defaultView;

  global.document = doc;
  global.window = win;

  Object.keys(window).forEach((key) => {
    if (!(key in global)) {
      global[key] = window[key];
    }
  });

  patchSetAttribute();
};

const mountDOM = htmlString => {
  if (!global.document) createGlobals();
  clearDOM();
  document.body.innerHTML = htmlString;
  polyfillDataset();
};

export default mountDOM;
if (!global.document) createGlobals();

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGlobals = exports.clearDOM = exports.polyfillDataset = undefined;

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var dashToCamel = function dashToCamel(name) {
  return name.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};
var getDataFrom = function getDataFrom(element) {
  return Object.assign.apply(Object, [{}].concat(_toConsumableArray([].concat(_toConsumableArray(element.attributes)).filter(function (attr) {
    return attr.nodeName.indexOf('data-') === 0;
  }).map(function (attr) {
    return _defineProperty({}, dashToCamel(attr.nodeName.slice(5)), attr.nodeValue);
  }))));
};

var polyfillDataset = exports.polyfillDataset = function polyfillDataset() {
  var rootElement = arguments.length <= 0 || arguments[0] === undefined ? document.body : arguments[0];

  rootElement.dataset = getDataFrom(rootElement); // eslint-disable-line no-param-reassign
  [].concat(_toConsumableArray(rootElement.children)).forEach(function (child) {
    polyfillDataset(child);
  });
};

var clearDOM = exports.clearDOM = function clearDOM() {
  var body = document.body;
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
};

var patchSetAttribute = function patchSetAttribute() {
  var setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function setAttribute() {
    setAttr.apply(this, arguments);
    if (arguments[0].indexOf('data-') === 0) {
      var dataset = dashToCamel(arguments[0].slice(5));
      this.dataset[dataset] = arguments[1];
    }
  };
};

var createGlobals = exports.createGlobals = function createGlobals() {
  var doc = _jsdom2.default.jsdom('<!doctype html><html><body></body></html>');
  var win = doc.defaultView;

  global.document = doc;
  global.window = win;

  Object.keys(window).forEach(function (key) {
    if (!(key in global)) {
      global[key] = window[key];
    }
  });

  patchSetAttribute();
};

var mountDOM = function mountDOM(htmlString) {
  if (!global.document) createGlobals();
  clearDOM();
  document.body.innerHTML = htmlString;
  polyfillDataset();
};

exports.default = mountDOM;

if (!global.document) createGlobals();

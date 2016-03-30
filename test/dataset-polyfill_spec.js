import test from 'tape';
import mountDOM from '../index';

const setup = () => {
  mountDOM(`
    <ul id="list" data-arbitrary="thing">
      <li data-order="1"> list content </li>
      <li data-order="2"> list content </li>
      <li data-order="3"> list content </li>
    </ul>
    <div id="long" data-longer-name="foo"></div>
    <div id="noval" data-no-value></div>
    <div id="caps" data-Caps-Work="yes"></div>
    <div id="camelname" data-CamelName="all lowercase"></div>
    <div id="nothing"></div>
  `);

  return {
    list: document.getElementById('list'),
    nothing: document.getElementById('nothing'),
    listItem: document.querySelector('[data-order="1"]'),
    itemOne: document.querySelector('[data-order="1"]').dataset.order,
    itemTwo: document.querySelector('[data-order="2"]').dataset.order,
    long: document.getElementById('long').dataset,
    noval: document.getElementById('noval').dataset,
    caps: document.getElementById('caps').dataset,
    camelname: document.getElementById('camelname').dataset,
  };
};

test('Dataset Polyfill', t => {
  const fixtures = setup();

  t.ok(fixtures.list.dataset, 'dataset exists when element has a data-attribute');
  t.deepEqual(fixtures.nothing.dataset, {}, 'element at least has an empty object when no data-attribute exists');
  t.notOk(fixtures.listItem.dataset.arbitrary, 'dataset does not get copied from parent element');
  t.test('multiple dataset keys can have unique values', keys => {
    keys.equal(fixtures.itemOne, '1', 'itemOne should equal 1');
    keys.equal(fixtures.itemTwo, '2', 'itemTwo should equal 2');
    keys.end();
  });

  t.ok(fixtures.long.longerName, 'it works with longer names: (data-longer-name === dataset.longerName)');
  t.equal(fixtures.noval.noValue, '', 'keys missing values are empty strings');
  t.ok(fixtures.caps.capsWork, 'data-Caps-Work === dataset.capsWork');
  t.ok(fixtures.camelname.camelname, 'camel names arent preserved: (data-camelName === dataset.camelname)');

  fixtures.list.setAttribute('data-arbitrary', 'foo');
  fixtures.list.setAttribute('data-newThing', 'bar');
  t.equal(fixtures.list.dataset.arbitrary, 'foo', 'dataset should update existing keys when setAttribute is used');
  t.equal(fixtures.list.dataset.newThing, 'bar', 'dataset should add new keys when setAttribute is used with new attributes');

  t.end();
});

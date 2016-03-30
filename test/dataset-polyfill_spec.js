import { describe, it } from 'mocha';
import { expect } from 'chai';
import mountDOM from '../src/index';

describe('Dataset Polyfill', function () {
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

  it('adds the non-existant dataset object to elements', function () {
    const fixtures = setup();

    expect(fixtures.list.dataset).to.exist;
    expect(fixtures.nothing.dataset).to.exist;
  });

  it('doesnt add other elements attributes to each other', function () {
    const listItem = setup().listItem;

    expect(listItem.dataset.order).to.exist;
    expect(listItem.dataset.arbitrary).to.not.exist;
  });

  it('data values are read from the actual element, not copied from the first instance', function () {
    const fixtures = setup();

    expect(fixtures.itemOne).to.equal('1');
    expect(fixtures.itemTwo).to.equal('2');
  });

  it('works with long names', function () {
    const fixtures = setup();

    expect(fixtures.long).to.have.key('longerName');
    expect(fixtures.long.longerName).to.equal('foo');
  });

  it('works with keys that have no value', function () {
    const data = setup().noval;

    expect(data).to.have.key('noValue');
    expect(data.noValue).to.equal('');
  });

  it('works with caps in attribute name', function () {
    const data = setup().caps;

    expect(data).to.have.key('capsWork');
    expect(data.capsWork).to.equal('yes');
  });

  it('unfortuneatly, camelCase in HTML isnt preserved, but works as lowercase', function () {
    const data = setup().camelname;

    expect(data).to.have.key('camelname');
    expect(data).to.not.have.key('camelName');
    expect(data.camelname).to.equal('all lowercase');
  });

  it('updates dataset when setAttribute is used', function () {
    const list = setup().list;

    expect(list.dataset.arbitrary).to.equal('thing');
    list.setAttribute('data-arbitrary', 'foo');
    list.setAttribute('data-new-thing', 'bar');
    expect(list.dataset.arbitrary).to.equal('foo');
    expect(list.dataset.newThing).to.equal('bar');
  });
});

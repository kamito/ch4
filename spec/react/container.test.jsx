
import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import _ from 'lodash';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Logger from '../../src/logger';
import { createStore, destroyStore, getAllStores, destroyAllStores } from '../../src/core';
import Container from '../../src/react/container';

describe("react.Container", () => {
  let renderer = null;
  let container = null;
  let output = null;
  let store = null;
  let initState = {
    test: "test"
  };
  before(() => {
    store = createStore('spec', initState);
    renderer = TestUtils.createRenderer();
    class MyComponent extends React.Component {
      render() {
        let props = this.props;
        return (
          <div>
            <h1>CH4</h1>
            <p>{ props.spec.test }</p>
            <button type="button" onClick={ (_e) => { store.set('test', 'changed') } }></button>
          </div>
        );
      }
    }
    container = TestUtils.renderIntoDocument(
      <Container stores={ [store] }>
        <MyComponent />
      </Container>
    );
  });

  after(() => {
    destroyAllStores();
  });

  it("setted init state", () => {
    let p = TestUtils.findRenderedDOMComponentWithTag(container, 'p');
    assert(p.textContent === initState.test);
  });

  it("changed state when clicked button", () => {
    let button = TestUtils.findRenderedDOMComponentWithTag(container, 'button');
    TestUtils.Simulate.click(button);
    let p = TestUtils.findRenderedDOMComponentWithTag(container, 'p');
    assert(p.textContent === "changed");
  });

});

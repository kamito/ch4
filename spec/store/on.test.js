import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import _ from 'lodash';

import Logger from '../../src/logger';
import { createStore, destroyAllStores } from '../../src/core';
import dispatcher from '../../src/dispatcher';
import Store from '../../src/store';

describe("store", () => {
  describe("on", () => {
    let store = null;
    let initState = { test: "test" };
    before(() => {
      store = createStore('spec', initState);
    });
    after(() => {
      destroyAllStores();
    });

    it("handled event", (done) => {
      store.on('spec', (store_, ...args) => {
        assert(store_.name === 'spec');
        assert(args[0] === 'test1');
        done();
        return {};
      });
      dispatcher.trigger('spec', 'test1');
    });
  });

  describe("connect", () => {
    let store = null;
    let initState = { test: "test" };
    before(() => {
      store = createStore('spec', initState);
    });
    after(() => {
      destroyAllStores();
    });

    it("call the connected function", (done) => {
      store.connect((store_) => {
        assert(store_.get('test') === 'test1');
        done();
      });
      store.on('spec', (store_, ...args) => {
        assert(store_.name === 'spec');
        assert(args[0] === 'test1');
        return { test: args[0] };
      });
      dispatcher.trigger('spec', 'test1');
    });
  });
});

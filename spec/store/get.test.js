import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import _ from 'lodash';

import Logger from '../../src/logger';
import { createStore, destroyStore, getAllStores, destroyAllStores } from '../../src/core';
import Store from '../../src/store';

describe("store", () => {
  describe("get", () => {
    let store = null;
    let initState = {
      test1: {
        test1_1: {
          test1_1_1: "test1-1-1",
          test1_1_2: "test1-1-2"
        },
        test1_2: {
          test1_2_1: "test1-2-1",
          test1_2_2: "test1-2-2"
        }
      },
      test2: "test2"
    };
    before(() => {
      store = createStore('spec', initState);
    });
    after(() => {
      destroyAllStores();
    });

    it("return value", () => {
      assert(store.get('test1.test1_1.test1_1_1') === initState.test1.test1_1.test1_1_1);
      assert(store.get('test1.test1_1.test1_1_2') === initState.test1.test1_1.test1_1_2);
      assert(store.get('test1.test1_2.test1_2_1') === initState.test1.test1_2.test1_2_1);
      assert(store.get('test1.test1_2.test1_2_2') === initState.test1.test1_2.test1_2_2);
      assert(store.get('test2') === initState.test2);
    });
  });
});

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

  describe("set", () => {
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

    it("set string", () => {
      store.set('test1.test1_1.test1_1_1', 'changed value');
      assert(store.get('test1.test1_1.test1_1_1') === 'changed value');
    });

    it("set number", () => {
      store.set('test1.test1_1.test1_1_2', 1000);
      assert(store.get('test1.test1_1.test1_1_2') === 1000);
    });

    it("set array", () => {
      store.set('test1.test1_2.test1_2_1', ["a", "b", "c"]);
      assert.deepEqual(store.get('test1.test1_2.test1_2_1'), ["a", "b", "c"]);
    });

    it("set null", () => {
      store.set('test1.test1_2.test1_2_2', null);
      assert(store.get('test1.test1_2.test1_2_2') === null);
    });

    it("set object", () => {
      let data = {
        test1: {
          test1_1: {
            test1_1_1: "changed",
            test1_1_2: 1000
          }
        }
      };
      store.set(data);
      assert(store.get('test1.test1_1.test1_1_1') === "changed");
      assert(store.get('test1.test1_1.test1_1_2') === 1000);
    });

  });

});

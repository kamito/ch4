
import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import _ from 'lodash';

import { createStore, destroyStore, getAllStores } from '../../src/core';

describe("core", () => {
  describe("createStore", () => {
    describe("If store did not created", () => {
      it("return new store", () => {
        let allStores = getAllStores();
        assert.deepEqual(allStores, new Map());

        let initState = { test: "spec" };
        let newStore = createStore('spec', initState);
        assert(newStore.name === 'spec');
        assert.deepEqual(newStore.allState, initState);

        let allStoresAfter = getAllStores();
        assert.deepEqual(allStoresAfter, new Map([ [ 'spec', newStore ] ]));

        destroyStore('spec');
      });
    });

    describe("If store created", () => {
      let initState = { test: "spec" };
      let newStore = null;
      before(() => {
        newStore = createStore('spec', initState);
      });
      after(() => {
        destroyStore('spec');
      });

      it("return exists store", () => {
        let allStores = getAllStores();
        assert.deepEqual(allStores, new Map([ [ 'spec', newStore ]  ]));

        assert(newStore.name === 'spec');
        assert.deepEqual(newStore.allState, initState);

        let allStoresAfter = getAllStores();
        assert.deepEqual(allStores, new Map([ [ 'spec', newStore ]  ]));
      });
    });
  });

  describe("getAllStores", () => {
    describe("Store exists", () => {
      let initState = { test: "spec" };
      before(() => {
        let newStore1 = createStore('spec1', initState);
        let newStore2 = createStore('spec2', initState);
        let newStore3 = createStore('spec1', initState);
      });
      after(() => {
        destroyStore('spec1');
        destroyStore('spec2');
      });

      it("return exists stores", () => {
        let allStores = getAllStores();
        assert(allStores.size === 2);
      });
    });
  });

});

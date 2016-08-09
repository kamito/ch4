
import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import _ from 'lodash';

import Logger from '../../src/logger';
import { createStore, destroyStore, getAllStores, destroyAllStores } from '../../src/core';
import Store from '../../src/store';


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

        destroyAllStores();
      });
    });

    describe("If store created", () => {
      let initState = { test: "spec" };
      let newStore = null;
      before(() => {
        newStore = createStore('spec', initState);
      });
      after(() => {
        destroyAllStores();
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

    describe("If store is original class", () => {
      it("return my store", () => {
        class MyStore extends Store {
          get myName() {
            return "Tarou";
          }
        };
        let initState = { test: "spec" };
        let newStore = createStore('spec', initState, MyStore);
        assert(newStore.name === 'spec');
        assert(newStore.myName === 'Tarou');

        destroyAllStores();
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
        destroyAllStores();
      });

      it("return exists stores", () => {
        let allStores = getAllStores();
        assert(allStores.size === 2);
      });
    });
  });

});

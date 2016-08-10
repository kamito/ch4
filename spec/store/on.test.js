import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import _ from 'lodash';
import sinon from 'sinon';

import Logger from '../../src/logger';
import { createStore, destroyAllStores } from '../../src/core';
import dispatcher from '../../src/dispatcher';

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
    describe("shallow state", () => {
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

    describe("deep state", () => {
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

      it("call the connected function", (done) => {
        store.connect((store_) => {
          assert(store_.get('test1.test1_1.test1_1_1') === 'test1-1-1');
          assert(store_.get('test1.test1_1.test1_1_2') === 'changed value');
          assert(store_.get('test1.test1_2.test1_2_1') === 'test1-2-1');
          assert(store_.get('test1.test1_2.test1_2_2') === 'test1-2-2');
          assert(store_.get('test2') === 'test2');
          done();
        });
        store.on('spec', (store_, ...args) => {
          assert(store_.name === 'spec');
          assert(args[0] === 'test1');
          return { test1: { test1_1: { test1_1_2: "changed value" } } };
        });
        dispatcher.trigger('spec', 'test1');
      });
    });

    describe("any value", () => {
      let store = null;
      let initState = {
        itString: "test",
        itNumber: 1000,
        itStringToNull: "test",
        itStringToUndefined: "test",
        itArray: ["a", "b", "c"]
      };
      before(() => {
        store = createStore('spec', initState);
        store.on('spec/string', (store_, ...args) => {
          return { itString: "change to string" };
        });
        store.on('spec/number', (store_, ...args) => {
          return { itNumber: 100 };
        });
        store.on('spec/toNull', (store_, ...args) => {
          return { itStringToNull: null };
        });
        store.on('spec/toUndefined', (store_, ...args) => {
          return { itStringToUndefined: undefined };
        });
        store.on('spec/array', (store_, ...args) => {
          return { itArray: ["x", "y", "z"] };
        });
      });
      after(() => {
        destroyAllStores();
      });

      it("string changed value", () => {
        store.connect((store_) => {
          assert.deepEqual(store_.get('itString'), "change to string");
        });
        dispatcher.trigger('spec/string');
      });

      it("array changed value", () => {
        store.connect((store_) => {
          assert.deepEqual(store_.get('itArray'), ["x", "y", "z"]);
        });
        dispatcher.trigger('spec/array');
      });

      it("number changed value", () => {
        store.connect((store_) => {
          assert.deepEqual(store_.get('itNumber'), 100);
        });
        dispatcher.trigger('spec/number');
      });

      it("value changed to null", () => {
        store.connect((store_) => {
          assert.deepEqual(store_.get('itStringToNull'), null);
        });
        dispatcher.trigger('spec/toNull');
      });

      it("value did not change to undefined", () => {
        store.connect((store_) => {
          assert.notDeepEqual(store_.get('itStringToUndefined'), undefined);
          assert.deepEqual(store_.get('itStringToUndefined'), 'test');
        });
        dispatcher.trigger('spec/toUndefined');
      });

    });
  });

  describe("disconnect", () => {
    let store = null;
    let initState = { test: "test" };
    before(() => {
      store = createStore('spec', initState);
    });
    after(() => {
      destroyAllStores();
    });

    it("not call disconnected function", () => {
      let spy = sinon.spy();
      store.connect(spy);
      store.on('spec', (store_, ...args) => {
        return { test: args[0] };
      });
      dispatcher.trigger('spec', 'test1');
      assert(spy.calledOnce);
      // disconnect
      store.disconnect(spy);
      dispatcher.trigger('spec', 'test2');
      assert(spy.calledOnce);
    });
  });
});

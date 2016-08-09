
import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import sinon from 'sinon';
import _ from 'lodash';

import Logger from '../../src/logger';
import dispatcher from '../../src/dispatcher';

Logger.setLevel(Logger.LEVEL.DEBUG);

describe("dispatcher", () => {
  describe("addAction", () => {
    describe("object", () => {
      it("call logger.warn and not added actions", () => {
        let stub = sinon.stub(Logger, 'warn', (...args) => {
          assert(args[0] === "Dispatcher action is require `Map` object.");
        });
        dispatcher.addAction({ test: ()=>{} });
        assert(dispatcher.has('test') === false);
        stub.restore();
      });
    });

    describe("array", () => {
      it("call logger.warn and not added actions", () => {
        let stub = sinon.stub(Logger, 'warn', (...args) => {
          assert(args[0] === "Dispatcher action is require `Map` object.");
        });
        dispatcher.addAction([ ["test", ()=>{} ]]);
        assert(dispatcher.has('test') === false);
        stub.restore();
      });
    });

    describe("Map", () => {
      it("Added actions", () => {
        let map = new Map();
        map.set("test", [() => {}]);
        dispatcher.addAction(map);
        assert(dispatcher.has('test') === true);
        dispatcher.clear();
      });

      it("Added actions twice", () => {
        let fn1 = () => {};
        let fn2 = () => {};
        let map1 = new Map();
        map1.set("test", [fn1]);
        dispatcher.addAction(map1);
        let map2 = new Map();
        map2.set("test", [fn2]);
        dispatcher.addAction(map2);

        assert(dispatcher.has('test') === true);
        assert.deepEqual(dispatcher.get('test'), [fn1, fn2]);
        dispatcher.clear();
      });
    });
  });

});

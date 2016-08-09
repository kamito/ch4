
import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import sinon from 'sinon';
import _ from 'lodash';

import Logger from '../../src/logger';
import dispatcher from '../../src/dispatcher';

Logger.setLevel(Logger.LEVEL.DEBUG);

describe("dispatcher", () => {

  describe("trigger", () => {
    describe("without Promise", () => {
      it("return values", () => {
        let stub = sinon.stub(dispatcher, 'afterAction', (err, results, actionName) => {
          assert(actionName === 'test');
          assert(_.isUndefined(err));
          assert.deepEqual(results, ['test1', 'test2']);
        });
        let map = new Map();
        map.set('test', [
          (...args) => {
            assert.deepEqual(args, ['test0']);
            return 'test1';
          },
          (...args) => {
            assert.deepEqual(args, ['test0']);
            return 'test2';
          }
        ]);
        dispatcher.addAction(map);
        dispatcher.trigger('test', 'test0');
        dispatcher.clear();
        stub.restore();
      });
    });

    describe("without Promise and raise error", () => {
      it("return error", () => {
        let stub = sinon.stub(dispatcher, 'afterAction', (err, results, actionName) => {
          assert(actionName === 'test');
          assert(!_.isUndefined(err));
          assert(err.message === 'ERROR');
          assert.deepEqual(results, []);
        });
        let map = new Map();
        map.set('test', [
          (...args) => {
            assert.deepEqual(args, ['test0']);
            throw new Error("ERROR");
          },
          (...args) => {
            assert.deepEqual(args, ['test0']);
            return 'test2';
          }
        ]);
        dispatcher.addAction(map);
        dispatcher.trigger('test', 'test0');
        dispatcher.clear();
        stub.restore();
      });
    });

    describe("with Promise", () => {
      it("return values", (done) => {
        let stub = sinon.stub(dispatcher, 'afterAction', (err, results, actionName) => {
          assert(actionName === 'test');
          assert(_.isUndefined(err));
          assert.deepEqual(results, ['test1', 'test2']);

          dispatcher.clear();
          stub.restore();
          done();
        });
        let map = new Map();
        map.set('test', [
          (...args) => {
            return new Promise((resolve, reject) => {
              assert.deepEqual(args, ['test0']);
              global.setTimeout(() => {
                resolve('test1');
              }, 500);
            });
          },
          (...args) => {
            return new Promise((resolve, reject) => {
              assert.deepEqual(args, ['test0']);
              global.setTimeout(() => {
                resolve('test2');
              }, 500);
            });
          }
        ]);
        dispatcher.addAction(map);
        dispatcher.trigger('test', 'test0');
      });
    });

    describe("with Promise and raise Error", () => {
      it("return values", (done) => {
        let stub = sinon.stub(dispatcher, 'afterAction', (err, results, actionName) => {
          assert(actionName === 'test');
          assert(!_.isUndefined(err));
          assert(err.message === "ERROR");
          assert.deepEqual(results, []);

          dispatcher.clear();
          stub.restore();
          done();
        });
        let map = new Map();
        map.set('test', [
          (...args) => {
            return new Promise((resolve, reject) => {
              assert.deepEqual(args, ['test0']);
              global.setTimeout(() => {
                reject(new Error("ERROR"));
              }, 500);
            });
          },
          (...args) => {
            return new Promise((resolve, reject) => {
              assert.deepEqual(args, ['test0']);
              global.setTimeout(() => {
                resolve('test2');
              }, 500);
            });
          }
        ]);
        dispatcher.addAction(map);
        dispatcher.trigger('test', 'test0');
      });
    });

    it("emit with values", () => {
      let stub = sinon.stub(dispatcher, 'emit', (actionName, data) => {
        assert(actionName === 'test');
        assert(data.type === 'test');
        assert(_.isUndefined(data.err));
        assert.deepEqual(data.results, ['test1', 'test2']);
      });
      let map = new Map();
      map.set('test', [
        (...args) => {
          assert.deepEqual(args, ['test0']);
          return 'test1';
        },
        (...args) => {
          assert.deepEqual(args, ['test0']);
          return 'test2';
        }
      ]);
      dispatcher.addAction(map);
      dispatcher.trigger('test', 'test0');
      dispatcher.clear();
      stub.restore();
    });
  });

});

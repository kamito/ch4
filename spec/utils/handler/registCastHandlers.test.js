
import { describe, it, before, beforeEach, after, afterEach } from 'mocha';
import assert from 'power-assert';
import sinon from 'sinon';
import _ from 'lodash';

import Logger from '../../../src/logger';
import { registCastHandlers } from '../../../src/utils/handler';

Logger.setLevel(Logger.LEVEL.DEBUG);

describe("utils.handler", () => {
  describe("registCastHandlers", () => {
    let emptyFn1 = () => {};
    let emptyFn2 = () => {};
    let emptyFn3 = () => {};
    let emptyFn4 = () => {};
    let emptyFn5 = () => {};
    it("array", () => {
      let ret = registCastHandlers([['test', emptyFn1], ['test', emptyFn2]]);
      assert.deepEqual(Array.from(ret.keys()), ['test']);
      assert.deepEqual(ret.get('test'), [emptyFn1, emptyFn2]);
    });
    it("not flatten array", () => {
      let ret = registCastHandlers([['test', [emptyFn1, [emptyFn2]]], ['test', emptyFn3]]);
      assert.deepEqual(Array.from(ret.keys()), ['test']);
      assert.deepEqual(ret.get('test'), [emptyFn1, emptyFn2, emptyFn3]);
    });
    it("object", () => {
      let ret = registCastHandlers({ test: [emptyFn1, emptyFn2] });
      assert.deepEqual(Array.from(ret.keys()), ['test']);
      assert.deepEqual(ret.get('test'), [emptyFn1, emptyFn2]);
    });
    it("object, value array is not flatten", () => {
      let ret = registCastHandlers({ test: [emptyFn1, [emptyFn2, [emptyFn3], emptyFn4]] });
      assert.deepEqual(Array.from(ret.keys()), ['test']);
      assert.deepEqual(ret.get('test'), [emptyFn1, emptyFn2, emptyFn3, emptyFn4]);
    });
    it("action name is string and values is array", () => {
      let ret = registCastHandlers("test", [emptyFn1, [emptyFn2, [emptyFn3], emptyFn4]]);
      assert.deepEqual(Array.from(ret.keys()), ['test']);
      assert.deepEqual(ret.get('test'), [emptyFn1, emptyFn2, emptyFn3, emptyFn4]);
    });
  });

});

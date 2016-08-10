/**
 * CH4
 * @author Shinichirow KAMITO
 * @license MIT
 */
import EventEmitter from 'events';
import _ from 'lodash';

import Logger from './logger';
import { registCastHandlers } from './utils/handler';

/**
 * @class
 * @extends EventEmitter
 */
export class Dispatcher extends EventEmitter {

  constructor() {
    super();

    this.actionMap__ = new Map();
  }


  /**
   * @param {string} actionName Action name.
   * @return {function[]}
   */
  get(actionName) {
    if (this.actionMap__.has(actionName)) {
      return this.actionMap__.get(actionName);
    } else {
      return [];
    }
  }

  /**
   * @return {Map}
   */
  getMap() {
    return this.actionMap__;
  }

  /**
   * @param {string} actionName Action name
   * @return {boolean}
   */
  has(actionName) {
    return this.actionMap__.has(actionName);
  }

  /**
   * Clear action map.
   */
  clear() {
    this.actionMap__ = new Map();
  }

  /**
   * @param {string|object|array} actionName Action name
   * @param {function|function[]|undefined} handlers Handler functions.
   */
  registAction(actionName, ...handlers) {
    let actionMap = registCastHandlers(actionName, handlers);
    return this.addAction(actionMap);
  }

  addAction(actionMap) {
    if (_.isMap(actionMap)) {
      let m = this.actionMap__;
      actionMap.forEach((handlers, actionName) => {
        if (m.has(actionName)) {
          let handlers_ = m.get(actionName);
          handlers_ = handlers_.concat(handlers);
          m.set(actionName, handlers_);
        } else {
          m.set(actionName, handlers);
        }
      });
      this.actionMap__ = m;
    } else {
      Logger.warn("Dispatcher action is require `Map` object.");
    }
    return this;
  }

  /**
   * Dispatch action
   * @param {string} actionName Action name.
   * @param {array} args Action arguments.
   * @return {Dispatcher}
   */
  trigger(actionName, ...args) {
    let error = undefined;
    let handlers = this.get(actionName);
    if (_.isArray(handlers) && !_.isEmpty(handlers)) {
      let withPromise = false;
      let returns = [];
      try {
        _.forEach(handlers, (handler) => {
          let ret = handler(...args);
          returns.push(ret);
          if (ret && _.isFunction(ret.then)) {
            withPromise = true;
          }
        });
      } catch (err) {
        Logger.error(err);
        error = err;
      }

      if (error) {
        this.afterAction(error, returns, actionName);
      } else {
        if (withPromise) {
          this.__triggerWithPromise(error, returns, actionName);
        } else {
          this.afterAction(error, returns, actionName);
        }
      }
    } else {
      this.afterAction(error, args, actionName);
    }
    return this;
  }

  /**
   * @private
   * @param {Error} error Error.
   * @param {array} returns Values that callbacks return.
   * @param {string} actionName Action Name
   * @return {Promise}
   */
  __triggerWithPromise(error, returns, actionName) {
    let promiseAll = _.map(returns, (ret) => {
      if (ret && _.isFunction(ret.then)) {
        return ret;
      } else {
        return Promise.resolve(ret);
      }
    });

    return Promise.all(promiseAll)
      .then((results) => {
        this.afterAction(error, results, actionName);
      })
      .catch((error) => {
        this.afterAction(error, [], actionName);
      });
  }

  /**
   * @param {Error} error Error.
   * @param {array} returns Values that callbacks return.
   * @param {string} actionName Action Name
   */
  afterAction(error, results, actionName) {
    let data = {
      type: actionName,
      error: error,
      results: results
    };
    this.emit(actionName, data);
  }
}


const dispatcher = new Dispatcher();
export default dispatcher;

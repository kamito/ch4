
import _ from 'lodash';

import dispatcher from './dispatcher';
import Logger from './logger';
import { registCastHandlers } from './utils/handler';


export default class Store {

  /**
   * @constructor
   * @param {string} name Store name
   * @param {object} initState Initialize state
   */
  constructor(name, initState={}) {
    this.name__ = name;
    this.state__ = (_.isObject(initState)) ? initState : {};
    this.handleMap__ = new Map();
    this.connectors__ = [];
  }

  /**
   * Return store name;
   * @return {string}
   */
  get name() {
    return this.name__;
  }

  /**
   * Return store state;
   * @return {object}
   */
  get allState() {
    return this.state__;
  }

  /**
   * Return value by lodash.
   * @param {string} path Data path
   * @param {undefined|any} defaultValue Default value if not exists value on path.
   * @return {any}
   */
  get(path, defaultValue=undefined) {
    return _.get(this.state__, path, defaultValue);
  }

  /**
   * @param {function} callback Callback function
   */
  connect(callback) {
    if (_.indexOf(this.connectors__, callback) < 0) {
      this.connectors__.push(callback);
    }
  }

  /**
   * @param {string|array|object|Map} actionName Action name
   * @param {undefined|function|array} handlers Handlers
   */
  on(actionName, handlers=undefined) {
    let actionMap = registCastHandlers(actionName, handlers);
    if (_.isMap(actionMap)) {
      let m = this.handleMap__;
      actionMap.forEach((handlers, actionName, map) => {
        if (m.has(actionName)) {
          let handlers_ = m.get(actionName);
          handlers_ = handlers_.concat(handlers);
          m.set(actionName, handlers_);
        } else {
          dispatcher.on(actionName, this.handleEvent__.bind(this));
          m.set(actionName, handlers);
        }
      });
      this.handleMap__ = m;
    } else {
      Logger.warn("Dispatcher action is require `Map` object.");
    }
    return this;
  }

  /**
   * Remove listener
   * @param {string} actionName Action name
   * @param {function} handler Listner function
   */
  removeListener(actionName) {
    if (this.handleMap__.has(actionName)) {
      this.handleMap__.delete(actionName);
    }
    dispatcher.removeListener(actionName, this.handleEvent__.bind(this));
  }

  /**
   * remove all handlers.
   */
  removeListenerAll() {
    let actionNames = this.handleMap__.keys();
    _.forEach(Array.from(actionNames), (actionName) => {
      this.removeListener(actionName);
    });
  }

  handleEvent__(event) {
    let actionName = event.type;
    let isChanged = false;
    let handlers = this.handleMap__.get(actionName);
    if (handlers) {
      let newState = {};
      let returns = _.map(handlers, (handler) => {
        let diffState = handler(this, ...event.results);
        if (_.isObject(diffState)) {
          this.state__ = this.__assignState(this.state__, diffState);
          isChanged = true;
        }
      });
    }

    if (isChanged) {
      if (_.isArray(this.connectors__) && !_.isEmpty(this.connectors__)) {
        _.forEach(this.connectors__, (conn) => {
          conn(this);
        });
      }
    }
  }

  __assignState(currentState, diffState) {
    currentState = _.defaultsDeep(diffState, currentState);
    return currentState;
  }
}

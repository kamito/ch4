
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
   * Set value.
   * And update state event to connector.
   * @param {string|object} path Data path
   * @param {any|function} value Value
   * @param {undefined|function}
   * @return {Store}
   */
  set(path, value=null, customizer=undefined) {
    if (_.isObject(path)) {
      this.state__ = this.__assignState(this.state__, path);
      this.__update();
    } else if (_.isString(path)) {
      if (_.isFunction(customizer)) {
        this.state__ = _.setWith(this.state__, path, value, customizer);
      } else {
        this.state__ = _.set(this.state__, path, value);
      }
      this.__update();
    }
  }

  /**
   * @param {function} callback Callback function
   */
  connect(...callbacks) {
    callbacks = _.flatten(_.castArray(callbacks));
    _.forEach(callbacks, (callback) => {
      if (_.isFunction(callback)) {
        if (_.indexOf(this.connectors__, callback) < 0) {
          this.connectors__.push(callback);
        }
      } else {
        Logger.warn("Connect argument require `function`.");
      }
    });
  }

  /**
   * @param {function} callback Callback function
   */
  disconnect(...callbacks) {
    callbacks = _.flatten(_.castArray(callbacks));
    this.connectors__ = _.reject(this.connectors__, (conn) => {
      return (_.indexOf(callbacks, conn) >= 0);
    });
  }

  /**
   * @param {string|array|object|Map} actionName Action name
   * @param {undefined|function|array} handlers Handlers
   */
  on(actionName, handlers=undefined) {
    let actionMap = registCastHandlers(actionName, handlers);
    if (_.isMap(actionMap)) {
      let m = this.handleMap__;
      actionMap.forEach((handlers, actionName) => {
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

  /**
   * @param {object} event Event object
   * @param {string} event.type Event type
   * @param {array} event.results Results that action returns values;
   * @param {Error} event.error Error that raised from action.
   */
  handleEvent__(event) {
    let actionName = event.type;
    let isChanged = false;
    let handlers = this.handleMap__.get(actionName);
    if (handlers) {
      _.map(handlers, (handler) => {
        let diffState = handler(this, ...event.results);
        if (_.isObject(diffState)) {
          this.state__ = this.__assignState(this.state__, diffState);
          isChanged = true;
        }
      });
    }

    if (isChanged) {
      this.__update();
    }
  }

  /**
   * @private
   */
  __assignState(currentState, diffState) {
    currentState = _.defaultsDeep(diffState, currentState);
    return currentState;
  }

  /**
   * @private
   */
  __update() {
    if (_.isArray(this.connectors__) && !_.isEmpty(this.connectors__)) {
      _.forEach(this.connectors__, (conn) => {
        conn(this);
      });
    }
  }
}

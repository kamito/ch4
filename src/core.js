/**
 * CH4
 * @author Shinichirow KAMITO
 * @license MIT
 */
import _ from 'lodash';

import Logger from './logger';
import Store from './store';
import dispatcher from './dispatcher';

Logger.setLevel(Logger.LEVEL.DEBUG);

/**
 * Stores.
 * @type {Map}
 */
let stores = new Map();

/**
 * Create new store or return exists store if name is matched.
 * @function
 * @param {string} name Store name
 * @param {object} initState Initialize state for store.
 * @param {class} storeClass Store class
 * @return {Store}
 */
export function createStore(name, initState={}, storeClass=undefined) {
  if (!stores.has(name)) {
    storeClass = (_.isFunction(storeClass)) ? storeClass : Store;
    stores.set(name, new storeClass(name, initState));
  }
  return stores.get(name);
}

/**
 * Return all stores;
 * @return {Map}
 */
export function getAllStores() {
  return stores;
}

/**
 * Destroy store
 * @param {string} name Store name.
 * @return {Map}
 */
export function destroyStore(name) {
  if (stores.has(name)) {
    let store = stores.get(name);
    store.removeListenerAll();
    stores.delete(name);
  }
  return stores;
}

/**
 * Destroy all stores;
 * @return {Map}
 */
export function destroyAllStores() {
  let keys = stores.keys();
  _.forEach(Array.from(keys), (key) => {
    stores = destroyStore(key);
  });
  stores = new Map();
  return stores;
}

/**
 * Ignite the action.
 * @param {string} actionName Action name.
 * @param { ...any } args Any arguments.
 */
export function trigger(actionName, ...args) {
  dispatcher.trigger(actionName, ...args);
}

/**
 * Regist a action.
 * Action is ignited by function `trigger`.
 * @param {string|object|array} actionName Action name.
 * @param {function|function[]|object|undefined} handlers Handler functions.
 */
export function regist(actionName, ...handlers) {
  return dispatcher.registAction(actionName, ...handlers);
}

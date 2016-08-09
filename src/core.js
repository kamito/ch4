/**
 * CH4
 * @author Shinichirow KAMITO
 * @license MIT
 */
import _ from 'lodash';

import Store from './store';


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
 * @return {Store}
 */
export function createStore(name, initState={}) {
  if (!stores.has(name)) {
    stores.set(name, new Store(name, initState));
  }
  return stores.get(name);
}

/**
 * Destroy store
 * @param {string} name Store name.
 * @return {Map}
 */
export function destroyStore(name) {
  if (stores.has(name)) {
    stores.delete(name);
  }
  return stores;
}

/**
 * Return all stores;
 * @return {Map}
 */
export function getAllStores() {
  return stores;
}

export function trigger() {

}


export function subscribe() {

}


export function regist() {

}


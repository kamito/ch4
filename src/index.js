/**
 *
 *   ___| |   | |  |
 *  |     |   | |  |
 *  |     ___ |___ __|
 * \____|_|  _|   _|
 *
 * @author Shinichirow KAMITO
 * @license MIT
 */
import {
  createStore,
  destroyStore,
  getAllStores,
  destroyAllStores,
  trigger,
  regist
} from './core';
import dispatcher from './dispatcher';

let ch4 = {
  createStore: createStore,
  getAllStores: getAllStores,
  destroyStore: destroyStore,
  destroyAllStores: destroyAllStores,
  trigger: trigger,
  regist: regist,
  dispatcher: dispatcher
};

export {
  createStore,
  destroyStore,
  getAllStores,
  destroyAllStores,
  trigger,
  regist,
  dispatcher
}
export default ch4;

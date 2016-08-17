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
import Store from './store';
import dispatcher from './dispatcher';
import logger from './logger';

import Container from './react/container';

const reactUtils = {
  Container: Container
};

const ch4 = {
  createStore: createStore,
  getAllStores: getAllStores,
  destroyStore: destroyStore,
  destroyAllStores: destroyAllStores,
  trigger: trigger,
  regist: regist,
  dispatcher: dispatcher,
  Store: Store,
  logger: logger,
  reactUtils: reactUtils
};

export {
  createStore,
  destroyStore,
  getAllStores,
  destroyAllStores,
  trigger,
  regist,
  dispatcher,
  Store,
  logger,
  reactUtils
}
export default ch4;

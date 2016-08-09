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
import { createStore, trigger, subscribe, regist } from './core';

let ch4 = {
  createStire: createStore,
  trigger: trigger,
  subscribe: subscribe,
  regist: regist
};

export { createStore, trigger, subscribe, regist }
export default ch4;

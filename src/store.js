
import _ from 'lodash';


export default class Store {

  /**
   * @constructor
   * @param {string} name Store name
   * @param {object} initState Initialize state
   */
  constructor(name, initState={}) {
    this.name__ = name;

    this.state__ = initState || {};
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
}

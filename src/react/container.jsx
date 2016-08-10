import React from 'react';
import _ from 'lodash';


export default class Container extends React.Component {

  /**
   * @overflow
   */
  componentWillMount() {
    let state = {};
    let stores = this.props.stores;
    _.forEach(stores, (store) => {
      store.connect(this.updateStore.bind(this));
      state[store.name] = store.allState;
    });
    this.setState(state);
  }

  /**
   * @param {Store} store Store instance
   */
  updateState(store) {
    let newState = {};
    newState[store.name] = store.allState;
    this.setState(newState);
  }

  /**
   * @return {Store[]}
   */
  getStores() {
    return this.props.stores;
  }

  /**
   * render
   * @return {React.Element}
   */
  render() {
    let state = this.state;
    return React.cloneElement(this.props.children, { ...state });
  }
}

Container.propTypes = {
  stores: React.PropTypes.array,
  children: React.PropTypes.element
};
Container.defaultProps = {
  stores: []
};

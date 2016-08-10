
import _ from 'lodash';


export function registCastHandlers(actionName, handlers) {
  if (_.isFunction(handlers)) {
    handlers = [handlers];
  } else if (_.isEmpty(handlers)) {
    handlers = actionName;
    actionName = null;
  }

  let map = new Map();
  if (_.isString(actionName) && _.isArray(handlers)) {
    map = registAddHandlers(map, actionName, handlers);
  } else if (_.isNull(actionName) && _.isMap(handlers)) {
    // do nothing
  } else if (_.isNull(actionName) && _.isArray(handlers)) {
    handlers.forEach((row) => {
      let actName = row.shift();
      map = registAddHandlers(map, actName, row);
    });
  } else if (_.isNull(actionName) && _.isObject(handlers)) {
    _.forEach(handlers, (row, actName) => {
      map = registAddHandlers(map, actName, row);
    });
  }
  return map;
}

/**
 * @param {Map} map Handler map
 * @param {string} actionName Action name.
 * @param {array} handlers Handlers array.
 */
export function registAddHandlers(map, actionName, handlers) {
  handlers = (_.isArray(handlers)) ? _.flattenDeep(handlers) : (_.isFunction(handlers)) ? [handlers] : [];
  handlers = _.filter(handlers, (f) => { return _.isFunction(f); });
  if (map.has(actionName)) {
    let entries = map.get(actionName);
    entries = entries.concat(handlers);
    map.set(actionName, entries);
  } else {
    map.set(actionName, handlers);
  }
  return map;
}

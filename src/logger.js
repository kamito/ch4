/**
 * CH4
 * @author Shinichirow KAMITO
 * @license MIT
 */
import _ from 'lodash';

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4
};


export class Logger {
  constructor(level=LEVELS.WARN) {
    this.level__ = level;
  }

  setLevel(level=LEVELS.WARN) {
    this.level__ = level;
  }

  log(level, ...args) {
    if (level >= this.level__) {
      switch (level) {
      case LEVELS.CRITICAL:
      case LEVELS.ERROR:
        console.error(args);
        console.trace();
        break;
      case LEVELS.WARN:
        console.warn(...args);
        console.trace();
        break;
      case LEVELS.INFO:
        console.info(...args);
        break;
      default:
        if (_.isFunction(level)) {
          level(...args);
        } else {
          console.log(...args);
        }
      }
    }
  }
}

let logger = new Logger();

export default {
  setLevel: (level) => { logger.setLevel(level); },
  debug:    (...args) => { logger.log(LEVELS.DEBUG,     ...args); },
  info:     (...args) => { logger.log(LEVELS.INFO,      ...args); },
  warn:     (...args) => { logger.log(LEVELS.WARN,      ...args); },
  error:    (...args) => { logger.log(LEVELS.ERROR,     ...args); },
  critical: (...args) => { logger.log(LEVELS.CRITICAL,  ...args); },
  // debug
  dir:      (...args) => { logger.log(console.dir,      ...args); },
  dirxml:   (...args) => { logger.log(console.dirxml,   ...args); },
  trace:    (...args) => { logger.log(console.trace,    ...args); },
  assert:   (...args) => { logger.log(console.assert,   ...args); },
  group:    (...args) => { logger.log(console.group,    ...args); },
  groupCollapsed: (...args) => { logger.log(console.groupCollapsed, ...args); },
  groupEnd: (...args) => { logger.log(console.groupEnd, ...args); },
  time:     (...args) => { logger.log(console.time,     ...args); },
  timeEnd:  (...args) => { logger.log(console.timeEnd,  ...args); },

  LEVEL: LEVELS
};

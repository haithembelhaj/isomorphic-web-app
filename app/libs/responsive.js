import EventEmitter from 'wolfy87-eventemitter';

const eventEmitter = new EventEmitter();
const event = 'bp-change';

// a cache for the queries
const matchMedias = {};

// the media queries
// TODO find a way to pull these from sass
const mediaQueries = {

  s: '(max-width: 699px)',
  m: '(min-width: 700px) and (max-width: 999px)',
  l: '(min-width: 1000px)'
};

// init this stuff
init();

// current bp
export let currentBreakpoint;

/**
 * add a breakpoint change listerner
 * @param cb
 */
export function addBreakpointChangeListener(cb){

  let callback = ()=> cb(currentBreakpoint);

  // save a ref for removing this cb
  cb._callback = callback;

  eventEmitter.on(event, callback);
}

/**
 * add a breakpoint change listerner
 * @param cb
 */
export function removeBreakpointChangeListener(cb){

  eventEmitter.off(event, cb._callback);
}

/**
 * add breakpoint listener
 * @param breakpoint
 * @param cb
 */
export function addBreakpointListerner(breakpoint, cb){

  let callback = (mq) => cb(mq.matches);

  // save a ref for removing this cb
  cb._callback = callback;

  return matchMedias[breakpoint].addListener(callback);
};

/**
 * remove breakpoint listener
 * @param breakpoint
 * @param cb
 */
export function removeBreakpointListerner(breakpoint, cb){

  return matchMedias[breakpoint].removeListener(cb._callback);
};




function init() {

  Object.keys(mediaQueries).forEach((bp) => {

    // generate a query
    matchMedias[bp] = matchMedia(mediaQueries[bp]);

    // add standard listener for bp
    addBreakpointListerner(bp, (matches)=> {

      if(!matches || bp === currentBreakpoint) {

        return;
      }

      currentBreakpoint = bp;
      eventEmitter.trigger(event, [bp]);
    });
  })
}

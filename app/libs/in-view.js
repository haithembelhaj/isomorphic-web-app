const callbacks = [];

let windowHeight;

// set window height and it's listener;
setWindowHeight();

window.addEventListener('resize', setWindowHeight);
window.addEventListener('scroll', test, {passive: true});

/**
 * notify when status changes
 * @param el
 * @param cb
 */
export default function notify(el, cb) {

  cb.el = el;
  cb.isIn = isInViewport(el);
  callbacks.push(cb);

  cb(cb.isIn);
}

/**
 * test if in view port
 * @param el
 * @returns {boolean}
 */
export function isInViewport (el) {

  const {top, bottom} = el.getBoundingClientRect();

  return (top < 2 * windowHeight / 3 && bottom > 0);
}

function test() {

  callbacks.forEach((cb) => {

    const {el, isIn} = cb;
    const newIsIn = isInViewport(el);

    if(isIn === newIsIn) {

      return;
    }

    cb.isIn = newIsIn;
    cb(newIsIn);
  })
}

function setWindowHeight() {

  windowHeight = window.innerHeight || document.documentElement.clientHeight;
}